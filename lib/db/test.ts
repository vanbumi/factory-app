import { config } from "dotenv"
import { createClient } from "@libsql/client"

config({ path: ".env.local" })

async function seed() {
  const url = process.env.LIBSQL_URL!
  const token = process.env.LIBSQL_TOKEN!

  const client = createClient({ url, authToken: token })

  await client.executeMultiple(`
    INSERT OR IGNORE INTO customers (id, name, phone, address, created_at) VALUES ('CUS-001', 'PT Maju Jaya', '021-1111', 'Jakarta', '2024-01-01');
    INSERT OR IGNORE INTO customers (id, name, phone, address, created_at) VALUES ('CUS-002', 'CV Sejahtera', '021-2222', 'Bandung', '2024-01-02');
    INSERT OR IGNORE INTO customers (id, name, phone, address, created_at) VALUES ('CUS-003', 'PT Indo Plastik', '021-3333', 'Surabaya', '2024-01-03');
    INSERT OR IGNORE INTO customers (id, name, phone, address, created_at) VALUES ('CUS-004', 'UD Berkah', '021-4444', 'Semarang', '2024-01-04');
    INSERT OR IGNORE INTO customers (id, name, phone, address, created_at) VALUES ('CUS-005', 'PT Sentosa', '021-5555', 'Medan', '2024-01-05');

    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-001', 'CUS-001', 'Botol HDPE 500ml', '10,000 pcs', 'Selesai', '07 Mei 2024', '2024-05-07');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-002', 'CUS-002', 'Kantong PP 30x40', '50,000 pcs', 'Produksi', '06 Mei 2024', '2024-05-06');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-003', 'CUS-003', 'Galon PET 19L', '5,000 pcs', 'Pending', '05 Mei 2024', '2024-05-05');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-004', 'CUS-004', 'Tutup Botol PP', '100,000 pcs', 'Produksi', '04 Mei 2024', '2024-05-04');
    INSERT OR IGNORE INTO orders (id, customer_id, product, quantity, status, date, created_at) VALUES ('PO-2024-005', 'CUS-005', 'Pipa PVC 3 inch', '2,000 m', 'Selesai', '03 Mei 2024', '2024-05-03');
  `)

  console.log("✅ Customers & Orders seeded!")
}

seed()