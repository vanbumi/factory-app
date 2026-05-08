"use client"

import { useState, useEffect } from "react"
import { ProductionForm } from "@/components/productions/production-form"

type Production = {
  id: string
  orderId: string
  qtyProduced: string
  date: string
  shift: string | null
}

export default function ProductionsPage() {
  const [productions, setProductions] = useState<Production[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  function fetchProductions() {
    fetch("/api/productions")
      .then((res) => res.json())
      .then((data) => {
        setProductions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchProductions()
  }, [])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produksi</h1>
          <p className="text-muted-foreground text-sm">Input hasil produksi harian</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
        >
          + Input Produksi
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : productions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada data produksi</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">No. PO</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Qty</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tanggal</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Shift</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((p) => (
                <tr key={p.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono text-sm">{p.id}</td>
                  <td className="py-3 px-4 font-medium">{p.orderId}</td>
                  <td className="py-3 px-4">{p.qtyProduced}</td>
                  <td className="py-3 px-4 text-muted-foreground">{p.date}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{p.shift || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            setLoading(true)
            fetchProductions()
          }}
        />
      )}
    </div>
  )
}