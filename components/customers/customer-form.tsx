"use client"

import { useState, useEffect } from "react"

export type CustomerFormInitial = {
  id: string
  name: string
  phone: string | null
  address: string | null
}

type Props = {
  onClose: () => void
  onSuccess: () => void
  initial?: CustomerFormInitial | null
}

export function CustomerForm({ onClose, onSuccess, initial = null }: Props) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEdit = Boolean(initial)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setPhone(initial.phone ?? "")
      setAddress(initial.address ?? "")
    } else {
      setName("")
      setPhone("")
      setAddress("")
    }
    setError("")
  }, [initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Nama pelanggan wajib diisi")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/customers", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit && initial
            ? {
                id: initial.id,
                name: name.trim(),
                phone: phone.trim() || null,
                address: address.trim() || null,
              }
            : { name: name.trim(), phone: phone.trim() || null, address: address.trim() || null }
        ),
      })

      if (!res.ok) throw new Error("Gagal")

      onSuccess()
      onClose()
    } catch {
      setError(isEdit ? "Gagal memperbarui pelanggan" : "Gagal menambahkan pelanggan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Pelanggan" : "Pelanggan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
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
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">ID Pelanggan</label>
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
              Nama Pelanggan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PT/CV/UD"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Telepon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap"
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none text-sm resize-none"
            />
          </div>

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