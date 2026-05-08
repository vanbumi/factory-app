'use client'

import { addInventoryItem } from "@/lib/actions/inventory"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type AddItemDialogProps = {
  onRefresh?: () => void
}

export function AddItemDialog({ onRefresh }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await addInventoryItem(formData)
    if (result.success) {
      setOpen(false)
      onRefresh?.()
    } else {
      alert(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Tambah Barang</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Inventori Baru</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <Input name="id" placeholder="Kode (Contoh: MAT-008)" required />
          <Input name="material_name" placeholder="Nama Bahan" required />
          <Input name="category" placeholder="Kategori (Bahan Baku/Aditif)" required />
          <Input name="location" placeholder="Lokasi (Contoh: Gudang A-1)" required />
          <div className="flex gap-2">
            <Input name="stock" type="number" placeholder="Stok Awal" required />
            <Input name="min_stock" type="number" placeholder="Batas Minimum" required />
          </div>
          <Input name="unit" placeholder="Satuan (kg/pcs)" required />
          <Button type="submit" className="w-full">Simpan Data</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
