import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const data = await db.select().from(orders).all()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Body:", body)

    if (!body.customerId || !body.product || !body.quantity) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const today = new Date()
    const month = today.toLocaleString("id-ID", { month: "short" })
    const prefix = `PO-${today.getFullYear()}-${month.toUpperCase()}`

    const allOrders = await db.select().from(orders).all()
    const lastNumber = allOrders
      .filter((o) => o.id.startsWith(prefix))
      .length

    const newId = `${prefix}-${String(lastNumber + 1).padStart(3, "0")}`

    const newOrder = {
      id: newId,
      customerId: body.customerId,
      product: body.product,
      quantity: body.quantity,
      status: "Produksi",
      date: today.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      createdAt: today.toISOString().split("T")[0],
    }

    console.log("Inserting:", newOrder)

    await db.insert(orders).values(newOrder)

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Gagal tambah pesanan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id || !body.customerId || !body.product || !body.quantity || !body.status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await db
      .update(orders)
      .set({
        customerId: body.customerId,
        product: body.product,
        quantity: body.quantity,
        status: body.status,
      })
      .where(eq(orders.id, body.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Gagal update pesanan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 })
    }

    await db.delete(orders).where(eq(orders.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Gagal hapus pesanan" }, { status: 500 })
  }
}