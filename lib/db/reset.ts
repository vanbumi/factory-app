import { config } from "dotenv"
import { createClient } from "@libsql/client"

config({ path: ".env.local" })

async function reset() {
  const client = createClient({
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_TOKEN!,
  })

  await client.execute("DROP TABLE IF EXISTS stock_logs")
  await client.execute("DROP TABLE IF EXISTS productions")
  await client.execute("DROP TABLE IF EXISTS inventory")
  await client.execute("DROP TABLE IF EXISTS orders")
  await client.execute("DROP TABLE IF EXISTS machines")
  await client.execute("DROP TABLE IF EXISTS customers")
  
  console.log("✅ Semua tabel dihapus")
  await client.close()
}

reset()