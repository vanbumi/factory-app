"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Sen", produksi: 4200, target: 4000 },
  { name: "Sel", produksi: 3800, target: 4000 },
  { name: "Rab", produksi: 4500, target: 4000 },
  { name: "Kam", produksi: 4100, target: 4000 },
  { name: "Jum", produksi: 4800, target: 4000 },
  { name: "Sab", produksi: 3200, target: 3000 },
  { name: "Min", produksi: 2800, target: 2500 },
]

export function ProductionChart() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Produksi Mingguan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorProduksi" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.65 0.18 160)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.65 0.18 160)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.25 0 0)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.6 0 0)", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.16 0 0)",
                  border: "1px solid oklch(0.25 0 0)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                }}
                labelStyle={{ color: "oklch(0.93 0 0)" }}
                itemStyle={{ color: "oklch(0.65 0.18 160)" }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="oklch(0.4 0 0)"
                strokeDasharray="5 5"
                fill="none"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="produksi"
                stroke="oklch(0.65 0.18 160)"
                fillOpacity={1}
                fill="url(#colorProduksi)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Produksi Aktual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
