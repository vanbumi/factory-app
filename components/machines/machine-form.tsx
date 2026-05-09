"use client"

import { useState, useEffect } from "react"

export type MachineFormInitial = {
  id: string
  name: string
  status: string
  efficiency: number | null
  lastMaintenance: string
}

type Props = {
  onClose: () => void
  onSuccess: () => void
  initial?: MachineFormInitial | null
}

const STATUS_OPTIONS = ["Aktif", "Perawatan", "Gangguan"] as const

export function MachineForm({ onClose, onSuccess, initial = null }: Props) {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<string>("Aktif")
  const [efficiency, setEfficiency] = useState("0")
  const [lastMaintenance, setLastMaintenance] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(initial)

  useEffect(() => {
    if (initial) {
      setId(initial.id)
      setName(initial.name)
      setStatus(
        STATUS_OPTIONS.includes(initial.status as (typeof STATUS_OPTIONS)[number])
          ? initial.status
          : "Aktif"
      )
      setEfficiency(String(initial.efficiency ?? 0))
      setLastMaintenance(normalizeDateForInput(initial.lastMaintenance))
    } else {
      setId("")
      setName("")
      setStatus("Aktif")
      setEfficiency("0")
      setLastMaintenance(new Date().toISOString().split("T")[0])
    }
    setError("")
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim() || !lastMaintenance.trim()) {
      setError("Nama dan tanggal maintenance wajib diisi")
      return
    }

    if (!isEdit && !id.trim()) {
      setError("ID mesin wajib diisi")
      return
    }

    const effNum = Number(efficiency)
    if (Number.isNaN(effNum) || effNum < 0 || effNum > 100) {
      setError("Efisiensi harus angka 0–100")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/machines", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit && initial
            ? {
                id: initial.id,
                name: name.trim(),
                status,
                efficiency: effNum,
                lastMaintenance: lastMaintenance.trim(),
              }
            : {
                id: id.trim(),
                name: name.trim(),
                status,
                efficiency: effNum,
                lastMaintenance: lastMaintenance.trim(),
              }
        ),
      })

      if (!res.ok) throw new Error("Gagal")

      onSuccess()
      onClose()
    } catch {
      setError(isEdit ? "Gagal memperbarui mesin" : "Gagal menambahkan mesin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card text-card-foreground rounded-2xl w-full max-w-md p-6 shadow-2xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight">
            {isEdit ? "Edit Mesin" : "Tambah Mesin"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">ID Mesin</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="MCN-001"
              readOnly={isEdit}
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${
                isEdit ? "border-border bg-muted cursor-not-allowed" : "border-input"
              }`}
              required={!isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Injection Molding 1"
              className="w-full border-2 border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border-2 border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Efisiensi (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
              className="w-full border-2 border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Terakhir maintenance</label>
            <input
              type="date"
              value={lastMaintenance}
              onChange={(e) => setLastMaintenance(e.target.value)}
              className="w-full border-2 border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-input py-2.5 rounded-xl text-sm font-semibold hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function normalizeDateForInput(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const t = Date.parse(value)
  if (!Number.isNaN(t)) return new Date(t).toISOString().split("T")[0]
  return new Date().toISOString().split("T")[0]
}
