import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { machines } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const data = await db.select().from(machines).all()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id || !body.name || !body.lastMaintenance) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await db.insert(machines).values({
      id: body.id,
      name: body.name,
      status: body.status || "Aktif",
      efficiency: Number(body.efficiency || 0),
      lastMaintenance: body.lastMaintenance,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Gagal tambah mesin" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id || !body.name || !body.lastMaintenance) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    await db
      .update(machines)
      .set({
        name: body.name,
        status: body.status || "Aktif",
        efficiency: Number(body.efficiency || 0),
        lastMaintenance: body.lastMaintenance,
      })
      .where(eq(machines.id, body.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Gagal update mesin" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 })
    }

    await db.delete(machines).where(eq(machines.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Gagal hapus mesin" }, { status: 500 })
  }
}