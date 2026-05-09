"use client"

import { useState, useEffect, useMemo } from "react"
import { CustomerForm } from "@/components/customers/customer-form"
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
import { Plus, Search, Users, Phone, MapPin, Pencil, Trash2, ShoppingCart } from "lucide-react"

type Customer = {
  id: string
  name: string
  phone: string | null
  address: string | null
}

type OrderRow = { createdAt?: string; created_at?: string }

function currentMonthPrefix(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [search, setSearch] = useState("")

  async function loadData() {
    setLoading(true)
    try {
      const [cRes, oRes] = await Promise.all([fetch("/api/customers"), fetch("/api/orders")])
      const cData = await cRes.json()
      const oData = await oRes.json()
      setCustomers(Array.isArray(cData) ? cData : [])
      setOrders(Array.isArray(oData) ? oData : [])
    } catch {
      setCustomers([])
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const total = customers.length
  const withPhone = customers.filter((c) => c.phone).length
  const withAddress = customers.filter((c) => c.address).length

  const pesananBulanIni = useMemo(() => {
    const prefix = currentMonthPrefix()
    return orders.filter((o) => {
      const d = o.createdAt ?? o.created_at
      return typeof d === "string" && d.length >= 7 && d.slice(0, 7) === prefix
    }).length
  }, [orders])

  const filtered = customers.filter((c) =>
    search === "" ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.toLowerCase().includes(search.toLowerCase())) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  )

  async function handleDelete(customer: Customer) {
    const ok = window.confirm(`Hapus pelanggan ${customer.name}?`)
    if (!ok) return

    const res = await fetch("/api/customers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: customer.id }),
    })

    if (res.ok) loadData()
    else alert("Gagal hapus pelanggan")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
          <p className="text-muted-foreground">Daftar pelanggan terdaftar</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Pelanggan Baru
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-sm text-muted-foreground">Total Pelanggan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{withPhone}</div>
                <p className="text-sm text-muted-foreground">Kontak Lengkap</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{withAddress}</div>
                <p className="text-sm text-muted-foreground">Alamat Terdata</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <ShoppingCart className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pesananBulanIni}</div>
                <p className="text-sm text-muted-foreground">Pesanan Bulan Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari pelanggan..."
          className="pl-9 bg-secondary/50 border-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabel */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">Daftar Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Memuat...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada pelanggan</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Nama</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Telepon</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Alamat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{c.id}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{c.phone || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{c.address || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowForm(false)
                            setEditing(c)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(c)}>
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
        <CustomerForm
          initial={editing}
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSuccess={() => {
            setShowForm(false)
            setEditing(null)
            setLoading(true)
            loadData()
          }}
        />
      )}
    </div>
  )
}