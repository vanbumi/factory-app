"use client"

import { useState, useEffect } from "react"

export type OrderFormInitial = {
  id: string
  customerId: string
  product: string
  quantity: string
  status: string
}

type Props = {
  onClose: () => void
  onSuccess: () => void
  initial?: OrderFormInitial | null
}

const STATUS_OPTIONS = ["Produksi", "Selesai", "Pending"] as const

export function OrderForm({ onClose, onSuccess, initial = null }: Props) {
  const [customerId, setCustomerId] = useState("")
  const [product, setProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [status, setStatus] = useState<string>("Produksi")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(initial)

  useEffect(() => {
    if (initial) {
      setCustomerId(initial.customerId)
      setProduct(initial.product)
      setQuantity(initial.quantity)
      setStatus(STATUS_OPTIONS.includes(initial.status as (typeof STATUS_OPTIONS)[number]) ? initial.status : "Produksi")
    } else {
      setCustomerId("")
      setProduct("")
      setQuantity("")
      setStatus("Produksi")
    }
    setError("")
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!customerId || !product || !quantity) {
      setError("Semua field harus diisi")
      return
    }

    if (isEdit && !status) {
      setError("Pilih status")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit && initial
            ? { id: initial.id, customerId, product, quantity, status }
            : { customerId, product, quantity }
        ),
      })

      if (!res.ok) throw new Error("Gagal")

      onSuccess()
      onClose()
    } catch {
      setError(isEdit ? "Gagal memperbarui pesanan" : "Gagal menambahkan pesanan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Pesanan" : "Pesanan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEdit && initial && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">No. Pesanan</label>
              <input
                type="text"
                value={initial.id}
                readOnly
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 bg-gray-50 cursor-not-allowed"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Pelanggan
            </label>
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Nama PT/CV/UD"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Produk
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Nama produk"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Jumlah
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Contoh: 10,000 pcs"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:bg-blue-300 disabled:text-white"
            >
              {loading ? "Menyimpan..." : isEdit ? "Simpan perubahan" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}