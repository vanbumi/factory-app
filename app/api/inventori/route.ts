import { createClient } from "@libsql/client"
import { NextRequest, NextResponse } from "next/server"

const client = createClient({
  url: process.env.LIBSQL_URL!,
  authToken: process.env.LIBSQL_TOKEN!,
})

export async function GET() {
  try {
    const result = await client.execute("SELECT * FROM inventory ORDER BY id ASC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Database Error:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data inventori" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedAt = new Date().toISOString().split("T")[0]
    await client.execute({
      sql: `INSERT INTO inventory (id, material_name, category, location, stock, min_stock, unit, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.id,
        body.material_name,
        body.category,
        body.location,
        Number(body.stock),
        Number(body.min_stock),
        body.unit,
        updatedAt,
      ],
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Gagal tambah inventori" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedAt = new Date().toISOString().split("T")[0]
    await client.execute({
      sql: `UPDATE inventory
            SET material_name = ?, category = ?, location = ?, stock = ?, min_stock = ?, unit = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        body.material_name,
        body.category,
        body.location,
        Number(body.stock),
        Number(body.min_stock),
        body.unit,
        updatedAt,
        body.id,
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Gagal update inventori" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    await client.execute({
      sql: "DELETE FROM inventory WHERE id = ?",
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Gagal hapus inventori" }, { status: 500 })
  }
}
