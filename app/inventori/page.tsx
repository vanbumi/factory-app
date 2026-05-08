"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, AlertTriangle, Search, Pencil, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { AddItemDialog } from "@/components/inventory/add-item-dialog"
import { Button } from "@/components/ui/button"

export default function InventoriPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const fetchInventori = async () => {
    try {
      const res = await fetch('/api/inventori')
      const data = await res.json()
      setItems(data)
    } catch (error) {
      console.error("Gagal ambil data:", error)
    }
  }

  useEffect(() => {
    fetchInventori()
  }, [])

  const lowStockItems = items.filter((item) => item.stock <= item.min_stock).length
  const totalStock = items.reduce((acc, item) => acc + (Number(item.stock) || 0), 0)
  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase()
    if (!query) return true
    return (
      String(item.id).toLowerCase().includes(query) ||
      String(item.material_name).toLowerCase().includes(query) ||
      String(item.category).toLowerCase().includes(query)
    )
  })

  async function handleEdit(item: any) {
    const material_name = window.prompt("Nama bahan", item.material_name)
    if (!material_name) return
    const category = window.prompt("Kategori", item.category)
    if (!category) return
    const location = window.prompt("Lokasi", item.location)
    if (!location) return
    const stock = window.prompt("Stok", String(item.stock))
    if (!stock) return
    const min_stock = window.prompt("Minimum stok", String(item.min_stock))
    if (!min_stock) return
    const unit = window.prompt("Satuan", item.unit)
    if (!unit) return

    const res = await fetch("/api/inventori", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        material_name,
        category,
        location,
        stock: Number(stock),
        min_stock: Number(min_stock),
        unit,
      }),
    })

    if (res.ok) fetchInventori()
    else alert("Gagal update inventori")
  }

  async function handleDelete(item: any) {
    const ok = window.confirm(`Hapus item ${item.id}?`)
    if (!ok) return

    const res = await fetch("/api/inventori", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    })

    if (res.ok) fetchInventori()
    else alert("Gagal hapus inventori")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventori</h1>
            <p className="text-muted-foreground">Kelola stok bahan baku secara real-time</p>
          </div>
          <AddItemDialog onRefresh={fetchInventori} />
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6 flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-sm text-muted-foreground">Total Item</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <p className="text-sm text-muted-foreground">Stok Rendah</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalStock.toLocaleString()} kg</div>
              <p className="text-sm text-muted-foreground">Total Stok</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">Rp 1.2 M</div>
              <p className="text-sm text-muted-foreground">Nilai Estimasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari item inventori..."
            className="pl-9 bg-secondary/50 border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Full Columns Table */}
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base font-medium">Daftar Inventori</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const isLow = item.stock <= item.min_stock
                  // Logika Progress Bar: Anggap stok aman adalah 2x lipat dari min_stock
                  const stockPercent = Math.min((item.stock / (item.min_stock * 2)) * 100, 100)
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.material_name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell>{item.stock.toLocaleString()} {item.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stockPercent} className="h-2 w-16" />
                          <span className="text-[10px] text-muted-foreground">{Math.round(stockPercent)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={isLow ? "error" : "success"} 
                          label={isLow ? "Kritis" : "Normal"} 
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
