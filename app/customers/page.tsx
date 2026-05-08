"use client"

import { useState, useEffect } from "react"
import { CustomerForm } from "@/components/customers/customer-form"

type Customer = {
  id: string
  name: string
  phone: string | null
  address: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  function fetchCustomers() {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pelanggan</h1>
          <p className="text-muted-foreground text-sm">Daftar pelanggan terdaftar</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
        >
          + Pelanggan Baru
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada pelanggan</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Nama</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Telepon</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Alamat</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-border/50 hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono text-sm">{c.id}</td>
                  <td className="py-3 px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{c.phone || "-"}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{c.address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CustomerForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false)
            setLoading(true)
            fetchCustomers()
          }}
        />
      )}
    </div>
  )
}