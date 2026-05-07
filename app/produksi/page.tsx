"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Filter, Download } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const productionData = [
  { jam: "06:00", output: 320 },
  { jam: "08:00", output: 480 },
  { jam: "10:00", output: 520 },
  { jam: "12:00", output: 380 },
  { jam: "14:00", output: 550 },
  { jam: "16:00", output: 490 },
  { jam: "18:00", output: 420 },
]

const productionOrders = [
  {
    id: "PRD-001",
    product: "Botol HDPE 500ml",
    machine: "INJ-001",
    target: 10000,
    actual: 8500,
    status: "info" as const,
    statusLabel: "Berjalan",
    operator: "Budi Santoso",
  },
  {
    id: "PRD-002",
    product: "Kantong PP 30x40",
    machine: "EXT-001",
    target: 50000,
    actual: 50000,
    status: "success" as const,
    statusLabel: "Selesai",
    operator: "Agus Wijaya",
  },
  {
    id: "PRD-003",
    product: "Galon PET 19L",
    machine: "BLW-001",
    target: 5000,
    actual: 2100,
    status: "info" as const,
    statusLabel: "Berjalan",
    operator: "Dedi Kurniawan",
  },
  {
    id: "PRD-004",
    product: "Tutup Botol PP",
    machine: "INJ-002",
    target: 100000,
    actual: 0,
    status: "warning" as const,
    statusLabel: "Antrian",
    operator: "Rudi Hermawan",
  },
  {
    id: "PRD-005",
    product: "Pipa PVC 3 inch",
    machine: "EXT-002",
    target: 2000,
    actual: 1800,
    status: "info" as const,
    statusLabel: "Berjalan",
    operator: "Hendra Pratama",
  },
]

export default function ProductionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produksi</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau proses produksi pabrik
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Order
            </Button>
          </div>
        </div>

        {/* Production Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Order Aktif</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">62,400</div>
              <p className="text-sm text-muted-foreground">Output Hari Ini</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-sm text-muted-foreground">Efisiensi Rata-rata</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">2.1%</div>
              <p className="text-sm text-muted-foreground">Reject Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Production Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Output Produksi Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <defs>
                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.18 160)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis dataKey="jam" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.93 0 0)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="output"
                    stroke="oklch(0.65 0.18 160)"
                    fillOpacity={1}
                    fill="url(#colorOutput)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Production Orders Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Order Produksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Produk</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Mesin</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Target</TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">Aktual</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Operator</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionOrders.map((order) => (
                  <TableRow key={order.id} className="border-border/50 hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.product}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{order.machine}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{order.target.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{order.actual.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{order.operator}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} label={order.statusLabel} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
