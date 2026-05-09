"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { MachineForm } from "@/components/machines/machine-form"
import { Plus, Cog, Activity, AlertTriangle, CheckCircle, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Machine = {
  id: string
  name: string
  status: string
  efficiency: number | null
  lastMaintenance: string
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Machine | null>(null)

  const fetchMachines = async () => {
    try {
      const res = await fetch("/api/machines")
      const data = await res.json()
      setMachines(Array.isArray(data) ? data : [])
    } catch {
      setMachines([])
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  const activeMachines = machines.filter((m) => m.status === "Aktif").length
  const maintenanceMachines = machines.filter((m) => m.status === "Perawatan").length
  const errorMachines = machines.filter((m) => m.status === "Gangguan").length

  async function handleDelete(machine: Machine) {
    const ok = window.confirm(`Hapus mesin ${machine.id}?`)
    if (!ok) return

    const res = await fetch("/api/machines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: machine.id }),
    })

    if (res.ok) fetchMachines()
    else alert("Gagal hapus mesin")
  }

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
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
          >
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

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-medium">Daftar Mesin</CardTitle>
          </CardHeader>
          <CardContent>
            {machines.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Belum ada mesin. Klik Tambah Mesin untuk menambah data.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Efisiensi</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.map((machine) => {
                    const badgeStatus =
                      machine.status === "Aktif"
                        ? "success"
                        : machine.status === "Perawatan"
                          ? "warning"
                          : "error"

                    return (
                      <TableRow key={machine.id}>
                        <TableCell className="font-mono text-sm">{machine.id}</TableCell>
                        <TableCell className="font-medium">{machine.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={badgeStatus} label={machine.status} />
                        </TableCell>
                        <TableCell>{Number(machine.efficiency || 0)}%</TableCell>
                        <TableCell>{machine.lastMaintenance}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowForm(false)
                                setEditing(machine)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(machine)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {(showForm || editing) && (
          <MachineForm
            initial={editing}
            onClose={() => {
              setShowForm(false)
              setEditing(null)
            }}
            onSuccess={() => {
              setShowForm(false)
              setEditing(null)
              fetchMachines()
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
