"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Package, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const inventoryItems = [
  {
    id: "MAT-001",
    name: "HDPE Granule",
    category: "Bahan Baku",
    stock: 2400,
    unit: "kg",
    minStock: 1000,
    maxStock: 5000,
    location: "Gudang A-1",
    status: "success" as const,
  },
  {
    id: "MAT-002",
    name: "LDPE Granule",
    category: "Bahan Baku",
    stock: 1398,
    unit: "kg",
    minStock: 1000,
    maxStock: 4000,
    location: "Gudang A-2",
    status: "success" as const,
  },
  {
    id: "MAT-003",
    name: "PP Granule",
    category: "Bahan Baku",
    stock: 800,
    unit: "kg",
    minStock: 1000,
    maxStock: 4000,
    location: "Gudang A-3",
    status: "error" as const,
  },
  {
    id: "MAT-004",
    name: "PVC Compound",
    category: "Bahan Baku",
    stock: 3908,
    unit: "kg",
    minStock: 1500,
    maxStock: 6000,
    location: "Gudang B-1",
    status: "success" as const,
  },
  {
    id: "MAT-005",
    name: "PET Resin",
    category: "Bahan Baku",
    stock: 4800,
    unit: "kg",
    minStock: 2000,
    maxStock: 8000,
    location: "Gudang B-2",
    status: "success" as const,
  },
  {
    id: "MAT-006",
    name: "Pewarna Merah",
    category: "Aditif",
    stock: 45,
    unit: "kg",
    minStock: 50,
    maxStock: 200,
    location: "Gudang C-1",
    status: "warning" as const,
  },
  {
    id: "MAT-007",
    name: "Pewarna Biru",
    category: "Aditif",
    stock: 120,
    unit: "kg",
    minStock: 50,
    maxStock: 200,
    location: "Gudang C-2",
    status: "success" as const,
  },
]

export default function InventoryPage() {
  const lowStockItems = inventoryItems.filter(
    (item) => item.stock < item.minStock
  ).length
  const totalValue = "Rp 1.2 M"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventori</h1>
            <p className="text-muted-foreground">
              Kelola stok bahan baku dan material
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inventoryItems.length}</div>
                  <p className="text-sm text-muted-foreground">Total Item</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{lowStockItems}</div>
                  <p className="text-sm text-muted-foreground">Stok Rendah</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">13,471 kg</div>
              <p className="text-sm text-muted-foreground">Total Stok</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalValue}</div>
              <p className="text-sm text-muted-foreground">Nilai Inventori</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari item inventori..."
            className="pl-9 bg-secondary/50 border-0"
          />
        </div>

        {/* Inventory Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Daftar Inventori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Kode</TableHead>
                  <TableHead className="text-muted-foreground">Nama</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Kategori</TableHead>
                  <TableHead className="text-muted-foreground">Stok</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Level</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Lokasi</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => {
                  const stockPercent = Math.min(
                    (item.stock / item.maxStock) * 100,
                    100
                  )
                  return (
                    <TableRow key={item.id} className="border-border/50 hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {item.category}
                      </TableCell>
                      <TableCell>
                        {item.stock.toLocaleString()} {item.unit}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={stockPercent}
                            className="h-2 w-20"
                          />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(stockPercent)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {item.location}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={item.status}
                          label={
                            item.status === "success"
                              ? "Normal"
                              : item.status === "warning"
                              ? "Rendah"
                              : "Kritis"
                          }
                        />
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
