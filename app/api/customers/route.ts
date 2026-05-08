import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const data = await db.select().from(customers).all()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 })
    }

    const allCustomers = await db.select().from(customers).all()
    const newId = `CUS-${String(allCustomers.length + 1).padStart(3, "0")}`

    const newCustomer = {
      id: newId,
      name: body.name,
      phone: body.phone || null,
      address: body.address || null,
      createdAt: new Date().toISOString().split("T")[0],
    }

    await db.insert(customers).values(newCustomer)

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Gagal tambah pelanggan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id || !body.name) {
      return NextResponse.json({ error: "ID dan nama wajib diisi" }, { status: 400 })
    }

    await db
      .update(customers)
      .set({
        name: body.name,
        phone: body.phone || null,
        address: body.address || null,
      })
      .where(eq(customers.id, body.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Gagal update pelanggan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 })
    }

    await db.delete(customers).where(eq(customers.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Gagal hapus pelanggan" }, { status: 500 })
  }
}