"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"

type Order = {
  id: string
  customerId: string
  product: string
  quantity: string
  status: string
  date: string
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Pesanan Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada pesanan</p>
        ) : (
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-mono text-sm font-medium truncate">{order.id}</p>
                  <p className="text-sm text-muted-foreground truncate">{order.customerId}</p>
                  <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                    {order.product} · {order.quantity}
                  </p>
                </div>
                <StatusBadge status={statusMap[order.status] || "info"} label={order.status} />
              </div>
            ))}
          </div>
        )}

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 font-medium text-muted-foreground">No. Pesanan</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Pelanggan</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-2 font-mono text-sm">{order.id}</td>
                  <td className="py-2">{order.customerId}</td>
                  <td className="py-2">
                    <StatusBadge status={statusMap[order.status] || "info"} label={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}