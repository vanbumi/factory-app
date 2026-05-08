import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { productions } from "@/lib/db/schema"

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