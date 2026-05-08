import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { productions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const data = await db.select().from(productions).all()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.orderId || !body.qtyProduced || !body.date) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    const allProductions = await db.select().from(productions).all()
    const newId = `PRD-${String(allProductions.length + 1).padStart(3, "0")}`

    const newProduction = {
      id: newId,
      orderId: body.orderId,
      qtyProduced: body.qtyProduced,
      date: body.date,
      shift: body.shift || null,
      createdAt: new Date().toISOString().split("T")[0],
    }

    await db.insert(productions).values(newProduction)

    return NextResponse.json(newProduction, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Gagal tambah produksi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id || !body.orderId || !body.qtyProduced || !body.date) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await db
      .update(productions)
      .set({
        orderId: body.orderId,
        qtyProduced: body.qtyProduced,
        date: body.date,
        shift: body.shift || null,
      })
      .where(eq(productions.id, body.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Gagal update produksi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 })
    }

    await db.delete(productions).where(eq(productions.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Gagal hapus produksi" }, { status: 500 })
  }
}