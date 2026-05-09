'use client'

import { useState } from 'react'
import { QRScanner } from '@/components/qr/qr-scanner'
import { QRGenerator } from '@/components/qr/qr-generator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useProducts } from '@/hooks/use-products'
import { useRawMaterials } from '@/hooks/use-raw-materials'
import { useMachines } from '@/hooks/use-machines'
import { useInventory } from '@/hooks/use-inventory'
import { useAuth } from '@/lib/auth/auth-context'
import { 
  Package, 
  Boxes, 
  Cog, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  QrCode,
  Search,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react'
import type { Product, RawMaterial, Machine, InventoryMovementType } from '@/lib/supabase/types'

type ScannedItem = 
  | { type: 'product'; data: Product }
  | { type: 'raw_material'; data: RawMaterial }
  | { type: 'machine'; data: Machine }
  | null

export default function ScanPage() {
  const [scannedItem, setScannedItem] = useState<ScannedItem>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [movementType, setMovementType] = useState<InventoryMovementType>('in')
  const [quantity, setQuantity] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Generate QR tab state
  const [generateType, setGenerateType] = useState<'product' | 'raw_material' | 'machine'>('product')
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  const { getByQRCode: getProductByQR, products } = useProducts()
  const { getByQRCode: getMaterialByQR, rawMaterials, updateStock } = useRawMaterials()
  const { getByQRCode: getMachineByQR, machines } = useMachines()
  const { createInventoryMovement } = useInventory()
  const { employee } = useAuth()

  const handleScan = async (qrCode: string) => {
    setScanError(null)
    setScannedItem(null)
    setSuccessMessage(null)

    try {
      // Try to find in products
      const product = await getProductByQR(qrCode)
      if (product) {
        setScannedItem({ type: 'product', data: product })
        return
      }

      // Try to find in raw materials
      const material = await getMaterialByQR(qrCode)
      if (material) {
        setScannedItem({ type: 'raw_material', data: material })
        return
      }

      // Try to find in machines
      const machine = await getMachineByQR(qrCode)
      if (machine) {
        setScannedItem({ type: 'machine', data: machine })
        return
      }

      setScanError('Item tidak ditemukan. QR code tidak terdaftar dalam sistem.')
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memindai')
    }
  }

  const handleInventoryMovement = async () => {
    if (!scannedItem || scannedItem.type === 'machine' || !quantity) return

    setIsProcessing(true)
    try {
      const qty = parseFloat(quantity)
      if (isNaN(qty) || qty <= 0) {
        throw new Error('Jumlah harus lebih dari 0')
      }

      if (scannedItem.type === 'product') {
        await createInventoryMovement({
          movement_type: movementType,
          product_id: scannedItem.data.id,
          raw_material_id: null,
          quantity: qty,
          unit_price: scannedItem.data.unit_price,
          total_price: qty * scannedItem.data.unit_price,
          location: null,
          notes: `Scan QR - ${movementType === 'in' ? 'Masuk' : movementType === 'out' ? 'Keluar' : 'Penyesuaian'}`,
          recorded_by: employee?.id ?? null,
          reference_number: `SCN-${Date.now()}`,
        })
      } else {
        await createInventoryMovement({
          movement_type: movementType,
          product_id: null,
          raw_material_id: scannedItem.data.id,
          quantity: qty,
          unit_price: scannedItem.data.unit_price,
          total_price: qty * scannedItem.data.unit_price,
          location: null,
          notes: `Scan QR - ${movementType === 'in' ? 'Masuk' : movementType === 'out' ? 'Keluar' : 'Penyesuaian'}`,
          recorded_by: employee?.id ?? null,
          reference_number: `SCN-${Date.now()}`,
        })

        // Also update raw material stock directly
        await updateStock(
          scannedItem.data.id, 
          qty, 
          movementType === 'in' ? 'add' : 'subtract'
        )
      }

      setSuccessMessage(`Berhasil mencatat ${movementType === 'in' ? 'masuk' : movementType === 'out' ? 'keluar' : 'penyesuaian'} ${qty} ${scannedItem.type === 'product' ? scannedItem.data.unit : scannedItem.data.unit}`)
      setQuantity('')
      setScannedItem(null)
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'Gagal mencatat pergerakan inventori')
    } finally {
      setIsProcessing(false)
    }
  }

  const getSelectedItemQR = () => {
    if (!selectedItemId) return ''
    
    switch (generateType) {
      case 'product':
        return products.find(p => p.id === selectedItemId)?.qr_code ?? `PRD-${selectedItemId.slice(0, 8)}`
      case 'raw_material':
        return rawMaterials.find(m => m.id === selectedItemId)?.qr_code ?? `MAT-${selectedItemId.slice(0, 8)}`
      case 'machine':
        return machines.find(m => m.id === selectedItemId)?.qr_code ?? `MCH-${selectedItemId.slice(0, 8)}`
      default:
        return ''
    }
  }

  const getSelectedItemName = () => {
    if (!selectedItemId) return ''
    
    switch (generateType) {
      case 'product':
        return products.find(p => p.id === selectedItemId)?.name ?? ''
      case 'raw_material':
        return rawMaterials.find(m => m.id === selectedItemId)?.name ?? ''
      case 'machine':
        return machines.find(m => m.id === selectedItemId)?.name ?? ''
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QR Code Scanner</h1>
          <p className="text-muted-foreground">
            Pindai QR code untuk melihat informasi dan mencatat pergerakan inventori
          </p>
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scan" className="gap-2">
              <Search className="h-4 w-4" />
              Scan
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2">
              <QrCode className="h-4 w-4" />
              Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Scanner */}
              <QRScanner 
                onScan={handleScan}
                onError={setScanError}
                title="Pindai Inventori"
                description="Arahkan kamera ke QR code produk, bahan baku, atau mesin"
              />

              {/* Result Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Hasil Pemindaian</CardTitle>
                  <CardDescription>Informasi item yang dipindai</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scanError && (
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{scanError}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                      <p className="text-sm font-medium">{successMessage}</p>
                    </div>
                  )}

                  {scannedItem ? (
                    <div className="space-y-4">
                      {/* Item Info */}
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="p-2 bg-background rounded-lg">
                          {scannedItem.type === 'product' && <Package className="h-6 w-6 text-primary" />}
                          {scannedItem.type === 'raw_material' && <Boxes className="h-6 w-6 text-amber-500" />}
                          {scannedItem.type === 'machine' && <Cog className="h-6 w-6 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {scannedItem.type === 'product' && 'Produk'}
                              {scannedItem.type === 'raw_material' && 'Bahan Baku'}
                              {scannedItem.type === 'machine' && 'Mesin'}
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{scannedItem.data.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {scannedItem.type === 'product' && scannedItem.data.product_code}
                            {scannedItem.type === 'raw_material' && scannedItem.data.material_code}
                            {scannedItem.type === 'machine' && scannedItem.data.machine_code}
                          </p>
                        </div>
                      </div>

                      {/* Stock Info */}
                      {(scannedItem.type === 'product' || scannedItem.type === 'raw_material') && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Stok Saat Ini</p>
                            <p className="text-lg font-bold">
                              {scannedItem.data.current_stock} {scannedItem.data.unit}
                            </p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Harga Satuan</p>
                            <p className="text-lg font-bold">
                              Rp {scannedItem.data.unit_price.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Machine Status */}
                      {scannedItem.type === 'machine' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <Badge variant={
                              scannedItem.data.status === 'running' ? 'default' :
                              scannedItem.data.status === 'idle' ? 'secondary' :
                              scannedItem.data.status === 'maintenance' ? 'outline' : 'destructive'
                            }>
                              {scannedItem.data.status === 'running' && 'Berjalan'}
                              {scannedItem.data.status === 'idle' && 'Diam'}
                              {scannedItem.data.status === 'maintenance' && 'Perawatan'}
                              {scannedItem.data.status === 'offline' && 'Offline'}
                            </Badge>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Efisiensi</p>
                            <p className="text-lg font-bold">{scannedItem.data.efficiency}%</p>
                          </div>
                        </div>
                      )}

                      {/* Inventory Movement Form */}
                      {(scannedItem.type === 'product' || scannedItem.type === 'raw_material') && (
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-medium">Catat Pergerakan</h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Tipe</Label>
                              <Select 
                                value={movementType} 
                                onValueChange={(v: InventoryMovementType) => setMovementType(v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in">
                                    <span className="flex items-center gap-2">
                                      <ArrowDownToLine className="h-4 w-4 text-green-500" />
                                      Masuk
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="out">
                                    <span className="flex items-center gap-2">
                                      <ArrowUpFromLine className="h-4 w-4 text-red-500" />
                                      Keluar
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Jumlah</Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <Button 
                            className="w-full" 
                            onClick={handleInventoryMovement}
                            disabled={!quantity || isProcessing}
                          >
                            {movementType === 'in' ? (
                              <Plus className="mr-2 h-4 w-4" />
                            ) : (
                              <Minus className="mr-2 h-4 w-4" />
                            )}
                            {isProcessing ? 'Memproses...' : 'Catat Pergerakan'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <QrCode className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        Pindai QR code untuk melihat informasi item
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Generate Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Code</CardTitle>
                  <CardDescription>Pilih item untuk membuat QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipe Item</Label>
                    <Select 
                      value={generateType} 
                      onValueChange={(v: 'product' | 'raw_material' | 'machine') => {
                        setGenerateType(v)
                        setSelectedItemId('')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product">
                          <span className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Produk
                          </span>
                        </SelectItem>
                        <SelectItem value="raw_material">
                          <span className="flex items-center gap-2">
                            <Boxes className="h-4 w-4" />
                            Bahan Baku
                          </span>
                        </SelectItem>
                        <SelectItem value="machine">
                          <span className="flex items-center gap-2">
                            <Cog className="h-4 w-4" />
                            Mesin
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Pilih Item</Label>
                    <Select 
                      value={selectedItemId} 
                      onValueChange={setSelectedItemId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {generateType === 'product' && products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.product_code} - {product.name}
                          </SelectItem>
                        ))}
                        {generateType === 'raw_material' && rawMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.material_code} - {material.name}
                          </SelectItem>
                        ))}
                        {generateType === 'machine' && machines.map((machine) => (
                          <SelectItem key={machine.id} value={machine.id}>
                            {machine.machine_code} - {machine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* QR Preview */}
              <div className="flex items-start justify-center">
                <QRGenerator
                  value={getSelectedItemQR()}
                  title={getSelectedItemName() || 'QR Code'}
                  description={selectedItemId ? getSelectedItemQR() : 'Pilih item untuk generate QR'}
                  filename={`qr-${generateType}-${selectedItemId?.slice(0, 8) ?? 'preview'}`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
