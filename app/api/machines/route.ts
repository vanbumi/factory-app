import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { machines } from "@/lib/db/schema"

export async function GET() {
  try {
    const data = await db.select().from(machines).all()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}