import "dotenv/config" // ← tambahin ini di paling atas
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

const client = createClient({
  url: process.env.LIBSQL_URL!,
  authToken: process.env.LIBSQL_TOKEN!,
})

export const db = drizzle(client)