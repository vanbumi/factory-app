"use client"

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

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali! Berikut ringkasan aktivitas pabrik hari ini.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Produksi"
            value="27,400"
            change={12.5}
            changeLabel="dari minggu lalu"
            icon={Factory}
          />
          <KPICard
            title="Stok Bahan Baku"
            value="13,306 kg"
            change={-3.2}
            changeLabel="dari bulan lalu"
            icon={Package}
          />
          <KPICard
            title="Pesanan Aktif"
            value="48"
            change={8.1}
            changeLabel="dari minggu lalu"
            icon={ShoppingCart}
          />
          <KPICard
            title="Pendapatan"
            value="Rp 847 jt"
            change={15.3}
            changeLabel="dari bulan lalu"
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ProductionChart />
          <InventoryChart />
        </div>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentOrders />
          <MachineStatus />
        </div>
      </div>
    </DashboardLayout>
  )
}
