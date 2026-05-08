"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ProductionChart } from "@/components/dashboard/charts/production-chart"
import { InventoryChart } from "@/components/dashboard/charts/inventory-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { MachineStatus } from "@/components/dashboard/machine-status"
import {
  Factory,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

type DashboardData = {
  totalProduksi: number
  pesananAktif: number
  pendapatan: number
  totalStok: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch(() => {})
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Selamat datang kembali! Berikut ringkasan aktivitas pabrik hari ini.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Produksi"
            value={data ? data.totalProduksi.toLocaleString() : "..."}
            change={12.5}
            changeLabel="dari minggu lalu"
            icon={Factory}
          />
          <KPICard
            title="Stok Bahan Baku"
            value={data ? `${data.totalStok.toLocaleString()} kg` : "..."}
            change={-3.2}
            changeLabel="dari bulan lalu"
            icon={Package}
          />
          <KPICard
            title="Pesanan Aktif"
            value={data ? data.pesananAktif.toString() : "..."}
            change={8.1}
            changeLabel="dari minggu lalu"
            icon={ShoppingCart}
          />
          <KPICard
            title="Pendapatan"
            value={data ? `Rp ${(data.pendapatan / 1000000).toFixed(0)} jt` : "..."}
            change={15.3}
            changeLabel="dari bulan lalu"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="min-h-[300px] sm:min-h-[350px]">
            <ProductionChart />
          </div>
          <div className="min-h-[300px] sm:min-h-[350px]">
            <InventoryChart />
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentOrders />
          <MachineStatus />
        </div>
      </div>
    </DashboardLayout>
  )
}