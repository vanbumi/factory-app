"use client"

import { useState, useEffect } from "react"
import { ProductionForm } from "@/components/productions/production-form"
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
import { Plus, Search, Factory, TrendingUp, CheckCircle, Clock, Pencil, Trash2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Production = {
  id: string
  orderId: string
  qtyProduced: string
  date: string
  shift: string | null
}

export default function ProduksiPage() {
  const [productions, setProductions] = useState<Production[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Production | null>(null)
  const [search, setSearch] = useState("")

  function fetchProductions() {
    fetch("/api/productions")
      .then((res) => res.json())
      .then((data) => {
        setProductions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchProductions()
  }, [])

  const totalOutput = productions.length
  const todayOutput = productions.filter((p) => p.date === new Date().toISOString().split("T")[0]).length
  const activeOrders = [...new Set(productions.map((p) => p.orderId))].length

  // Data grafik dummy
    const hourlyData = [
    { time: "06:00", output: 150 },
    { time: "08:00", output: 300 },
    { time: "10:00", output: 450 },
    { time: "12:00", output: 400 },
    { time: "14:00", output: 500 },
    { time: "16:00", output: 350 },
  ]

  const filtered = productions.filter((p) =>
    search === "" ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.orderId.toLowerCase().includes(search.toLowerCase()) ||
    (p.shift && p.shift.toLowerCase().includes(search.toLowerCase()))
  )

  async function handleDelete(production: Production) {
    const ok = window.confirm(`Hapus data produksi ${production.id}?`)
    if (!ok) return

    const res = await fetch("/api/productions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: production.id }),
    })

    if (res.ok) fetchProductions()
    else alert("Gagal hapus produksi")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produksi</h1>
          <p className="text-muted-foreground">Kelola dan pantau proses produksi pabrik</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Input Produksi
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Factory className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalOutput}</div>
                <p className="text-sm text-muted-foreground">Total Produksi</p>
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
                <div className="text-2xl font-bold">{todayOutput}</div>
                <p className="text-sm text-muted-foreground">Output Hari Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeOrders}</div>
                <p className="text-sm text-muted-foreground">Order Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-sm text-muted-foreground">Efisiensi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafik */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">Output Produksi Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="output"
                stroke="#4ade80"
                fill="#4ade80"
                fillOpacity={0.15}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari produksi..."
          className="pl-9 bg-secondary/50 border-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">Order Produksi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data produksi</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">No. PO</TableHead>
                  <TableHead className="text-muted-foreground">Qty</TableHead>
                  <TableHead className="text-muted-foreground">Tanggal</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Shift</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.orderId}</TableCell>
                    <TableCell>{p.qtyProduced}</TableCell>
                    <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{p.shift || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowForm(false)
                            setEditing(p)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(p)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {(showForm || editing) && (
        <ProductionForm
          initial={editing}
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setEditing(null)
            setLoading(true)
            fetchProductions()
          }}
        />
      )}
    </div>
  )
}