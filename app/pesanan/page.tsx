"use client"

import { useState, useEffect } from "react"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { OrderForm } from "@/components/orders/order-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, ShoppingCart, Clock, CheckCircle, AlertTriangle } from "lucide-react"

type Order = {
  id: string
  customerId: string
  product: string
  quantity: string
  status: string
  date: string
}

const statusMap: Record<string, "success" | "warning" | "info" | "error"> = {
  Selesai: "success",
  Produksi: "info",
  Pending: "warning",
}

export default function PesananPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("Semua")
  const [search, setSearch] = useState("")

  function fetchOrders() {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const totalPesanan = orders.length
  const dalamProduksi = orders.filter((o) => o.status === "Produksi").length
  const selesai = orders.filter((o) => o.status === "Selesai").length
  const pending = orders.filter((o) => o.status === "Pending").length

  const filtered = orders
    .filter((o) => filter === "Semua" || o.status === filter)
    .filter((o) =>
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
          <p className="text-muted-foreground">Kelola semua pesanan produksi</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Pesanan Baru
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPesanan}</div>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dalamProduksi}</div>
                <p className="text-sm text-muted-foreground">Dalam Produksi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{selesai}</div>
                <p className="text-sm text-muted-foreground">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pending}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            className="pl-9 bg-secondary/50 border-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Semua", "Produksi", "Selesai", "Pending"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada pesanan</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">No. Pesanan</TableHead>
                  <TableHead className="text-muted-foreground">Pelanggan</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Produk</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Jumlah</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm font-medium">{o.id}</TableCell>
                    <TableCell>{o.customerId}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{o.product}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{o.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={statusMap[o.status] || "info"} label={o.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{o.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Form */}
      {showForm && (
        <OrderForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            setLoading(true)
            fetchOrders()
          }}
        />
      )}
    </div>
  )
}