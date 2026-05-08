"use client"

import { useState } from "react"

type Props = {
  onClose: () => void
  onSuccess: () => void
}

export function ProductionForm({ onClose, onSuccess }: Props) {
  const [orderId, setOrderId] = useState("")
  const [qtyProduced, setQtyProduced] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [shift, setShift] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!orderId.trim() || !qtyProduced.trim() || !date) {
      setError("Semua field wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/productions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, qtyProduced, date, shift }),
      })

      if (!res.ok) throw new Error("Gagal")

      onSuccess()
      onClose()
    } catch {
      setError("Gagal menambahkan produksi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Input Produksi</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">No. PO</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="PO-2024-001"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Qty Diproduksi</label>
            <input
              type="text"
              value={qtyProduced}
              onChange={(e) => setQtyProduced(e.target.value)}
              placeholder="5,000 pcs"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Shift</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="">Pilih shift</option>
              <option value="Pagi">Pagi (06:00-14:00)</option>
              <option value="Siang">Siang (14:00-22:00)</option>
              <option value="Malam">Malam (22:00-06:00)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg disabled:bg-blue-300 disabled:text-white">
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}