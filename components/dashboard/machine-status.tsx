"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"

type Machine = {
  id: string
  name: string
  status: "Aktif" | "Perawatan" | "Gangguan"
  efficiency: number
  lastMaintenance: string
}

export function MachineStatus() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/machines")
      .then((res) => res.json())
      .then((data) => {
        setMachines(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Status Mesin</CardTitle>
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
        <CardTitle className="text-base font-medium">Status Mesin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {machines.map((machine) => {
          const statusMap: Record<string, "success" | "warning" | "error"> = {
            Aktif: "success",
            Perawatan: "warning",
            Gangguan: "error",
          }

          return (
            <div
              key={machine.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-2.5 sm:p-3 gap-2 sm:gap-4"
            >
              <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-mono text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    {machine.id}
                  </span>
                  <span className="font-medium text-xs sm:text-sm truncate">
                    {machine.name}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  Maintenance: {machine.lastMaintenance}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {machine.efficiency > 0 && (
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{machine.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efisiensi</div>
                  </div>
                )}
                <StatusBadge
                  status={statusMap[machine.status]}
                  label={machine.status}
                  className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}