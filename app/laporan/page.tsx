"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileText, BarChart3, Package, Table2 } from "lucide-react"
import { downloadCsvFile } from "@/lib/csv-export"
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

const COLORS = [
  "oklch(0.65 0.18 160)",
  "oklch(0.6 0.15 200)",
  "oklch(0.7 0.12 80)",
  "oklch(0.55 0.2 280)",
  "oklch(0.65 0.18 30)",
]

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

type OrderRow = {
  id?: string
  customerId?: string
  customer_id?: string
  product?: string
  quantity?: string
  status?: string
  date?: string
  createdAt?: string
  created_at?: string
}

type ProductionRow = {
  id?: string
  orderId?: string
  order_id?: string
  qtyProduced?: string
  qty_produced?: string
  date?: string
  shift?: string | null
  createdAt?: string
  created_at?: string
}

function last6MonthKeys(): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = 5; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1)
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`)
  }
  return out
}

function labelForYm(ym: string) {
  const m = Number(ym.slice(5, 7)) - 1
  return MONTH_LABELS[m] ?? ym
}

function orderMonthKey(o: OrderRow): string | null {
  const raw = o.createdAt ?? o.created_at
  if (!raw || typeof raw !== "string") return null
  if (raw.length >= 7) return raw.slice(0, 7)
  return null
}

function productionMonthKey(p: ProductionRow): string | null {
  const raw = p.createdAt ?? p.created_at ?? p.date
  if (!raw || typeof raw !== "string") return null
  if (/^\d{4}-\d{2}/.test(raw)) return raw.slice(0, 7)
  const t = Date.parse(raw)
  if (!Number.isNaN(t)) {
    const d = new Date(t)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }
  return null
}

/** Estimasi sama dashboard: jumlah pesanan × 17,5 jt (per bulan, dari jumlah order di bulan itu) */
const REVENUE_PER_ORDER_JT = 17.5

function todaySlug() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const reports = [
  {
    id: 1,
    title: "Detail pesanan (CSV)",
    description: "Semua baris pesanan — cocok dicek di Excel",
    icon: FileText,
    action: "orders" as const,
  },
  {
    id: 2,
    title: "Detail produksi (CSV)",
    description: "Semua entri produksi — cocok dicek di Excel",
    icon: BarChart3,
    action: "productions" as const,
  },
  {
    id: 3,
    title: "Ringkasan per bulan (CSV)",
    description: "Agregat 6 bulan terakhir — sama sumber dengan grafik",
    icon: Table2,
    action: "summary" as const,
  },
  {
    id: 4,
    title: "Inventori & keuangan",
    description: "Export menyusul setelah modul dilengkapi",
    icon: Package,
    action: null,
  },
]

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [productions, setProductions] = useState<ProductionRow[]>([])
  const [syncLabel, setSyncLabel] = useState("—")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const [oRes, pRes] = await Promise.all([fetch("/api/orders"), fetch("/api/productions")])
        const oData = await oRes.json()
        const pData = await pRes.json()
        if (cancelled) return
        setOrders(Array.isArray(oData) ? oData : [])
        setProductions(Array.isArray(pData) ? pData : [])
        setSyncLabel(
          new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        )
      } catch {
        if (!cancelled) {
          setOrders([])
          setProductions([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const monthKeys = useMemo(() => last6MonthKeys(), [])

  const revenueData = useMemo(() => {
    return monthKeys.map((ym) => {
      const count = orders.filter((o) => orderMonthKey(o) === ym).length
      return {
        month: labelForYm(ym),
        revenue: Math.round(count * REVENUE_PER_ORDER_JT * 10) / 10,
      }
    })
  }, [orders, monthKeys])

  const productionData = useMemo(() => {
    return monthKeys.map((ym) => {
      const actual = productions.filter((p) => productionMonthKey(p) === ym).length
      const target = Math.max(actual, Math.ceil(actual * 1.15) || 1)
      return {
        month: labelForYm(ym),
        target,
        actual,
      }
    })
  }, [productions, monthKeys])

  function exportOrdersCsv() {
    const header = [
      "id",
      "pelanggan_id",
      "produk",
      "jumlah",
      "status",
      "tanggal_tampil",
      "tanggal_dibuat",
    ]
    const rows: string[][] = [header]
    for (const o of orders) {
      rows.push([
        o.id ?? "",
        String(o.customerId ?? o.customer_id ?? ""),
        o.product ?? "",
        o.quantity ?? "",
        o.status ?? "",
        o.date ?? "",
        String(o.createdAt ?? o.created_at ?? ""),
      ])
    }
    downloadCsvFile(`laporan-pesanan-${todaySlug()}.csv`, rows)
  }

  function exportProductionsCsv() {
    const header = [
      "id",
      "no_po",
      "qty_diproduksi",
      "tanggal",
      "shift",
      "tanggal_dibuat",
    ]
    const rows: string[][] = [header]
    for (const p of productions) {
      rows.push([
        p.id ?? "",
        String(p.orderId ?? p.order_id ?? ""),
        String(p.qtyProduced ?? p.qty_produced ?? ""),
        p.date ?? "",
        p.shift ?? "",
        String(p.createdAt ?? p.created_at ?? ""),
      ])
    }
    downloadCsvFile(`laporan-produksi-${todaySlug()}.csv`, rows)
  }

  function exportSummaryCsv() {
    const header = [
      "tahun_bulan",
      "label_bulan",
      "jumlah_pesanan",
      "estimasi_pendapatan_jt",
      "catatan_estimasi",
      "jumlah_entri_produksi",
      "target_demo_benchmark",
      "catatan_target",
    ]
    const rows: string[][] = [header]
    const estNote = `Asumsi demo: ${REVENUE_PER_ORDER_JT} jt per pesanan (bukan faktur)`
    const tgtNote = "Target demo: max(aktual, ceil(aktual×1,15)); bukan RPP resmi"
    for (let i = 0; i < monthKeys.length; i++) {
      const ym = monthKeys[i]
      const ordCount = orders.filter((o) => orderMonthKey(o) === ym).length
      const prodCount = productions.filter((p) => productionMonthKey(p) === ym).length
      const targetBench = Math.max(prodCount, Math.ceil(prodCount * 1.15) || 1)
      rows.push([
        ym,
        labelForYm(ym),
        String(ordCount),
        String(Math.round(ordCount * REVENUE_PER_ORDER_JT * 10) / 10),
        estNote,
        String(prodCount),
        String(targetBench),
        tgtNote,
      ])
    }
    downloadCsvFile(`laporan-ringkasan-bulanan-${todaySlug()}.csv`, rows)
  }

  const productMixData = useMemo(() => {
    const map = new Map<string, number>()
    for (const o of orders) {
      const name = (o.product ?? "").trim() || "Lainnya"
      map.set(name, (map.get(name) ?? 0) + 1)
    }
    if (map.size === 0) {
      return [{ name: "Belum ada data", value: 100 }]
    }
    const entries = [...map.entries()].sort((a, b) => b[1] - a[1])
    const top = entries.slice(0, 4)
    const rest = entries.slice(4).reduce((s, [, n]) => s + n, 0)
    const out = top.map(([name, value]) => ({ name, value }))
    if (rest > 0) out.push({ name: "Lainnya", value: rest })
    const total = out.reduce((s, x) => s + x.value, 0)
    if (total === 0) return [{ name: "Belum ada data", value: 100 }]
    return out.map((x) => ({
      name: x.name,
      value: Math.round((x.value / total) * 1000) / 10,
    }))
  }, [orders])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">
            Grafik dan unduhan CSV memakai data nyata dari menu Pesanan & Produksi (6 bulan terakhir di grafik).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="current">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Rentang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">6 bulan terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={loading}
            onClick={exportOrdersCsv}
            title="Data sama dengan yang Anda input di menu Pesanan"
          >
            <Download className="mr-2 h-4 w-4" />
            CSV pesanan
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={loading}
            onClick={exportProductionsCsv}
            title="Data sama dengan yang Anda input di menu Produksi"
          >
            <Download className="mr-2 h-4 w-4" />
            CSV produksi
          </Button>
          <Button
            variant="default"
            size="sm"
            type="button"
            disabled={loading}
            onClick={exportSummaryCsv}
            title="Ringkatan per bulan — selaras dengan grafik di bawah"
          >
            <Download className="mr-2 h-4 w-4" />
            CSV ringkasan
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat data laporan…</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Estimasi pendapatan bulanan (jt Rp)
            </CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Input nyata:</strong> jumlah pesanan per bulan. <strong>Demo / MVP:</strong> dikalikan asumsi{" "}
              {REVENUE_PER_ORDER_JT} jt per pesanan — bukan faktur atau pembukuan resmi.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.93 0 0)" }}
                    formatter={(value: number) => [`Rp ${value} jt`, "Estimasi"]}
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

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Produksi: aktual vs benchmark demo</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Aktual:</strong> jumlah entri produksi per bulan (data nyata). <strong>Batang abu-abu:</strong>{" "}
              benchmark demo max(aktual, ceil(aktual×1,15)) — bukan target RPP resmi; untuk pilot bisa diganti field
              database nanti.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.93 0 0)" }}
                  />
                  <Bar dataKey="target" fill="oklch(0.35 0 0)" radius={[4, 4, 0, 0]} name="Benchmark demo" />
                  <Bar dataKey="actual" fill="oklch(0.65 0.18 160)" radius={[4, 4, 0, 0]} name="Aktual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "oklch(0.35 0 0)" }} />
                <span className="text-muted-foreground">Benchmark demo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Aktual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Komposisi produk</CardTitle>
            <p className="text-xs text-muted-foreground">
              Proporsi dari <strong>nama produk</strong> pada pesanan yang Anda masukkan (data nyata).
            </p>
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
                      <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0 0)",
                      border: "1px solid oklch(0.25 0 0)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Bagian"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
              {productMixData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Unduh data (sama dengan grafik)</CardTitle>
            <p className="text-xs text-muted-foreground">Terakhir diambil: {syncLabel}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="shrink-0"
                  disabled={loading || report.action == null}
                  onClick={() => {
                    if (report.action === "orders") exportOrdersCsv()
                    else if (report.action === "productions") exportProductionsCsv()
                    else if (report.action === "summary") exportSummaryCsv()
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Unduh
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
