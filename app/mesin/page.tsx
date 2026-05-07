"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Cog, Activity, AlertTriangle, CheckCircle } from "lucide-react"

const machines = [
  {
    id: "INJ-001",
    name: "Injection Molding 1",
    type: "Injection Molding",
    brand: "Haitian MA3200",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 94,
    hoursToday: 8.5,
    totalOutput: 4200,
    lastMaintenance: "28 Apr 2024",
    nextMaintenance: "28 Mei 2024",
    operator: "Budi Santoso",
  },
  {
    id: "INJ-002",
    name: "Injection Molding 2",
    type: "Injection Molding",
    brand: "Haitian MA2500",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 87,
    hoursToday: 7.2,
    totalOutput: 3800,
    lastMaintenance: "25 Apr 2024",
    nextMaintenance: "25 Mei 2024",
    operator: "Agus Wijaya",
  },
  {
    id: "EXT-001",
    name: "Extruder Line 1",
    type: "Extrusion",
    brand: "Battenfeld-Cincinnati",
    status: "warning" as const,
    statusLabel: "Perawatan",
    efficiency: 0,
    hoursToday: 0,
    totalOutput: 0,
    lastMaintenance: "07 Mei 2024",
    nextMaintenance: "07 Jun 2024",
    operator: "-",
  },
  {
    id: "BLW-001",
    name: "Blow Molding 1",
    type: "Blow Molding",
    brand: "Sidel SBO 8",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 91,
    hoursToday: 6.8,
    totalOutput: 2100,
    lastMaintenance: "01 Mei 2024",
    nextMaintenance: "01 Jun 2024",
    operator: "Dedi Kurniawan",
  },
  {
    id: "CRS-001",
    name: "Crusher Unit",
    type: "Recycling",
    brand: "Zerma GSL 300",
    status: "error" as const,
    statusLabel: "Gangguan",
    efficiency: 0,
    hoursToday: 2.1,
    totalOutput: 450,
    lastMaintenance: "15 Apr 2024",
    nextMaintenance: "15 Mei 2024",
    operator: "Rudi Hermawan",
  },
  {
    id: "EXT-002",
    name: "Extruder Line 2",
    type: "Extrusion",
    brand: "KraussMaffei",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 89,
    hoursToday: 8.0,
    totalOutput: 1800,
    lastMaintenance: "20 Apr 2024",
    nextMaintenance: "20 Mei 2024",
    operator: "Hendra Pratama",
  },
]

export default function MachinesPage() {
  const activeMachines = machines.filter(m => m.status === "success").length
  const maintenanceMachines = machines.filter(m => m.status === "warning").length
  const errorMachines = machines.filter(m => m.status === "error").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mesin</h1>
            <p className="text-muted-foreground">
              Pantau dan kelola mesin produksi
            </p>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Mesin
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Cog className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{machines.length}</div>
                  <p className="text-sm text-muted-foreground">Total Mesin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeMachines}</div>
                  <p className="text-sm text-muted-foreground">Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Activity className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{maintenanceMachines}</div>
                  <p className="text-sm text-muted-foreground">Perawatan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{errorMachines}</div>
                  <p className="text-sm text-muted-foreground">Gangguan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machines Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {machines.map((machine) => (
            <Card key={machine.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">
                      {machine.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {machine.id} • {machine.type}
                    </p>
                  </div>
                  <StatusBadge status={machine.status} label={machine.statusLabel} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {machine.brand}
                </div>

                {machine.efficiency > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Efisiensi</span>
                      <span className="font-medium">{machine.efficiency}%</span>
                    </div>
                    <Progress value={machine.efficiency} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Jam Operasi</div>
                    <div className="text-lg font-semibold">{machine.hoursToday} jam</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Output</div>
                    <div className="text-lg font-semibold">{machine.totalOutput.toLocaleString()}</div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Operator</span>
                    <span>{machine.operator}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Perawatan berikut</span>
                    <span>{machine.nextMaintenance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
