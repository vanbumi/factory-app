"use client"

import { useState, useEffect } from "react"
import { StatusBadge } from "@/components/dashboard/status-badge"

type Order = {
  id: string
  customerId: string
  product: string
  quantity: string
  status: string
  date: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("Semua")

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statusMap: Record<string, "success" | "warning" | "info" | "error"> = {
    Selesai: "success",
    Produksi: "info",
    Pending: "warning",
  }

  const filtered = filter === "Semua" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
          <p className="text-muted-foreground text-sm">Kelola semua pesanan produksi</p>
        </div>
        <button
          onClick={() => alert("Form tambah pesanan akan dibuat di step berikutnya")}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-all"
        >
          + Pesanan Baru
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["Semua", "Produksi", "Selesai", "Pending"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              filter === s
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tabel */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada pesanan</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">No. Pesanan</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pelanggan</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Produk</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Jumlah</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono text-sm font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customerId}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{order.product}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{order.quantity}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={statusMap[order.status] || "info"} label={order.status} />
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}