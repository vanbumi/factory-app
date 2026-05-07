import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"
import { cn } from "@/lib/utils"

const machines = [
  {
    id: "INJ-001",
    name: "Injection Molding 1",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 94,
    lastMaintenance: "28 Apr 2024",
  },
  {
    id: "INJ-002",
    name: "Injection Molding 2",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 87,
    lastMaintenance: "25 Apr 2024",
  },
  {
    id: "EXT-001",
    name: "Extruder Line 1",
    status: "warning" as const,
    statusLabel: "Perawatan",
    efficiency: 0,
    lastMaintenance: "07 Mei 2024",
  },
  {
    id: "BLW-001",
    name: "Blow Molding 1",
    status: "success" as const,
    statusLabel: "Aktif",
    efficiency: 91,
    lastMaintenance: "01 Mei 2024",
  },
  {
    id: "CRS-001",
    name: "Crusher Unit",
    status: "error" as const,
    statusLabel: "Gangguan",
    efficiency: 0,
    lastMaintenance: "15 Apr 2024",
  },
]

export function MachineStatus() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Status Mesin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {machine.id}
                </span>
                <span className="font-medium">{machine.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Perawatan terakhir: {machine.lastMaintenance}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {machine.efficiency > 0 && (
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">{machine.efficiency}%</div>
                  <div className="text-xs text-muted-foreground">Efisiensi</div>
                </div>
              )}
              <StatusBadge status={machine.status} label={machine.statusLabel} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
