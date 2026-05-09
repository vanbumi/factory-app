"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type InventoryRow = {
  id: string
  material_name: string
  category: string
  location: string
  stock: number
  min_stock: number
  unit: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = mode tambah; terisi = mode edit */
  initialItem: InventoryRow | null
  onSaved: () => void
}

export function InventoryItemDialog({
  open,
  onOpenChange,
  initialItem,
  onSaved,
}: Props) {
  const isEdit = initialItem !== null

  const [id, setId] = useState("")
  const [materialName, setMaterialName] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [stock, setStock] = useState("")
  const [minStock, setMinStock] = useState("")
  const [unit, setUnit] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return

    if (initialItem) {
      setId(initialItem.id)
      setMaterialName(String(initialItem.material_name ?? ""))
      setCategory(String(initialItem.category ?? ""))
      setLocation(String(initialItem.location ?? ""))
      setStock(String(initialItem.stock ?? ""))
      setMinStock(String(initialItem.min_stock ?? ""))
      setUnit(String(initialItem.unit ?? ""))
    } else {
      setId("")
      setMaterialName("")
      setCategory("")
      setLocation("")
      setStock("")
      setMinStock("")
      setUnit("")
    }
    setError("")
  }, [open, initialItem])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!materialName.trim() || !category.trim() || !location.trim() || !unit.trim()) {
      setError("Lengkapi nama, kategori, lokasi, dan satuan.")
      return
    }

    const stockNum = Number(stock)
    const minNum = Number(minStock)
    if (Number.isNaN(stockNum) || Number.isNaN(minNum)) {
      setError("Stok dan minimum harus angka.")
      return
    }

    if (!isEdit && !id.trim()) {
      setError("Kode item wajib diisi.")
      return
    }

    setLoading(true)
    try {
      const body = {
        id: id.trim(),
        material_name: materialName.trim(),
        category: category.trim(),
        location: location.trim(),
        stock: stockNum,
        min_stock: minNum,
        unit: unit.trim(),
      }

      const res = await fetch("/api/inventori", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(typeof data.error === "string" ? data.error : "Gagal menyimpan")
      }

      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit inventori" : "Tambah inventori"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="inv-id">Kode</Label>
            <Input
              id="inv-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="MAT-008"
              required={!isEdit}
              readOnly={isEdit}
              className={isEdit ? "bg-muted" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-name">Nama bahan</Label>
            <Input
              id="inv-name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="Nama bahan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-cat">Kategori</Label>
            <Input
              id="inv-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Bahan baku / Aditif"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-loc">Lokasi</Label>
            <Input
              id="inv-loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Gudang A-1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="inv-stock">Stok</Label>
              <Input
                id="inv-stock"
                type="number"
                min={0}
                step="any"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-min">Minimum</Label>
              <Input
                id="inv-min"
                type="number"
                min={0}
                step="any"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-unit">Satuan</Label>
            <Input
              id="inv-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="kg / pcs"
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
