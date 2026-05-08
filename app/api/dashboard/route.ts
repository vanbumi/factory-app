import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { orders, machines, productions, inventory } from "@/lib/db/schema"

export async function GET() {
  try {
    // Fetch semua data
    const allOrders = await db.select().from(orders).all()
    const allMachines = await db.select().from(machines).all()
    const allProductions = await db.select().from(productions).all()
    const allInventory = await db.select().from(inventory).all()

    // Hitung KPI
    const totalProduksi = allProductions.length
    const pesananAktif = allOrders.filter((o) => o.status === "Produksi" || o.status === "Pending").length
    const pendapatan = allOrders.length * 17500000 // Estimasi kasar
    const totalStok = allInventory.reduce((sum, item) => sum + item.stock, 0)

    return NextResponse.json({
      totalProduksi,
      pesananAktif,
      pendapatan,
      totalStok,
      orders: allOrders.slice(0, 5),
      machines: allMachines,
      productions: allProductions,
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Gagal fetch data" }, { status: 500 })
  }
}