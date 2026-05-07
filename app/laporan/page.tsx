"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileText, BarChart3, TrendingUp, Package } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 520 },
  { month: "Feb", revenue: 580 },
  { month: "Mar", revenue: 620 },
  { month: "Apr", revenue: 750 },
  { month: "Mei", revenue: 847 },
]

const productionData = [
  { month: "Jan", target: 100000, actual: 95000 },
  { month: "Feb", target: 100000, actual: 102000 },
  { month: "Mar", target: 110000, actual: 108000 },
  { month: "Apr", target: 110000, actual: 115000 },
  { month: "Mei", target: 120000, actual: 118000 },
]

const productMixData = [
  { name: "Botol", value: 35 },
  { name: "Kantong", value: 25 },
  { name: "Galon", value: 20 },
  { name: "Pipa", value: 12 },
  { name: "Lainnya", value: 8 },
]

const COLORS = ["oklch(0.65 0.18 160)", "oklch(0.6 0.15 200)", "oklch(0.7 0.12 80)", "oklch(0.55 0.2 280)", "oklch(0.65 0.18 30)"]

const reports = [
  {
    id: 1,
    title: "Laporan Produksi Bulanan",
    description: "Ringkasan produksi dan efisiensi mesin",
    icon: BarChart3,
    lastGenerated: "01 Mei 2024",
  },
  {
    id: 2,
    title: "Laporan Inventori",
    description: "Stok bahan baku dan pergerakan material",
    icon: Package,
    lastGenerated: "30 Apr 2024",
  },
  {
    id: 3,
    title: "Laporan Keuangan",
    description: "Pendapatan, pengeluaran, dan profit",
    icon: TrendingUp,
    lastGenerated: "28 Apr 2024",
  },
  {
    id: 4,
    title: "Laporan Pesanan",
    description: "Status pesanan dan pengiriman",
    icon: FileText,
    lastGenerated: "05 Mei 2024",
  },
]

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
            <p className="text-muted-foreground">
              Analisis dan laporan bisnis
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="mei">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan">Januari</SelectItem>
                <SelectItem value="feb">Februari</SelectItem>
                <SelectItem value="mar">Maret</SelectItem>
                <SelectItem value="apr">April</SelectItem>
                <SelectItem value="mei">Mei</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Pendapatan Bulanan (dalam juta Rp)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "oklch(0.93 0 0)" }}
                      formatter={(value: number) => [`Rp ${value} jt`, "Pendapatan"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.65 0.18 160)"
                      strokeWidth={3}
                      dot={{ fill: "oklch(0.65 0.18 160)", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Production vs Target */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Produksi vs Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "oklch(0.93 0 0)" }}
                    />
                    <Bar dataKey="target" fill="oklch(0.35 0 0)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="oklch(0.65 0.18 160)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "oklch(0.35 0 0)" }} />
                  <span className="text-muted-foreground">Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Aktual</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Mix */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Komposisi Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productMixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {productMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Persentase"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                {productMixData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Laporan Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.description}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
