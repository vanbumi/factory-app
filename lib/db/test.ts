import { config } from "dotenv"
import { createClient } from "@libsql/client"

config({ path: ".env.local" })

async function seed() {
  const url = process.env.LIBSQL_URL!
  const token = process.env.LIBSQL_TOKEN!
  const client = createClient({ url, authToken: token })

  // Drop & recreate orders table tanpa foreign key
  await client.execute("DROP TABLE IF EXISTS orders")
  await client.execute(`
    CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      product TEXT NOT NULL,
      quantity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Produksi',
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  // Seed data orders
  await client.executeMultiple(`
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-001', 'PT Maju Jaya', 'Botol HDPE 500ml', '10,000 pcs', 'Selesai', '07 Mei 2024', '2024-05-07');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-002', 'CV Sejahtera', 'Kantong PP 30x40', '50,000 pcs', 'Produksi', '06 Mei 2024', '2024-05-06');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-003', 'PT Indo Plastik', 'Galon PET 19L', '5,000 pcs', 'Pending', '05 Mei 2024', '2024-05-05');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-004', 'UD Berkah', 'Tutup Botol PP', '100,000 pcs', 'Produksi', '04 Mei 2024', '2024-05-04');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-005', 'PT Sentosa', 'Pipa PVC 3 inch', '2,000 m', 'Selesai', '03 Mei 2024', '2024-05-03');
  `)

  console.log("✅ Orders table recreated & seeded!")
  await client.close()
}

seed()