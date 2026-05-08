'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from "@libsql/client"

const client = createClient({
  url: process.env.LIBSQL_URL!,
  authToken: process.env.LIBSQL_TOKEN!,
})

export async function addInventoryItem(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('material_name') as string
  const category = formData.get('category') as string
  const location = formData.get('location') as string
  const stock = Number(formData.get('stock'))
  const minStock = Number(formData.get('min_stock'))
  const unit = formData.get('unit') as string
  const updatedAt = new Date().toISOString().split('T')[0]

  try {
    await client.execute({
      sql: `INSERT INTO inventory (id, material_name, category, location, stock, min_stock, unit, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name, category, location, stock, minStock, unit, updatedAt]
    })
    
    revalidatePath('/inventori')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Gagal menambah data. Pastikan Kode unik!" }
  }
}
