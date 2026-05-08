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

    // Drop dulu stock_logs (tergantung inventory)
  await client.execute("DROP TABLE IF EXISTS stock_logs")
  await client.execute("DROP TABLE IF EXISTS inventory")
  
  await client.execute(`
    CREATE TABLE inventory (
      id TEXT PRIMARY KEY,
      material_name TEXT NOT NULL,
      stock REAL NOT NULL,
      min_stock REAL NOT NULL,
      unit TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  await client.executeMultiple(`
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-001', 'HDPE Granule', 2400, 1000, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-002', 'LDPE Granule', 1398, 1000, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-003', 'PP Granule', 800, 1000, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-004', 'PVC Compound', 3908, 1500, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-005', 'PET Resin', 4800, 2000, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-006', 'Pewarna Merah', 45, 50, 'kg', '2024-05-08');
    INSERT INTO inventory (id, material_name, stock, min_stock, unit, updated_at) VALUES ('MAT-007', 'Pewarna Biru', 120, 50, 'kg', '2024-05-08');
  `)

  console.log("✅ Inventory seeded!")

    // Seed machines
  await client.execute("DROP TABLE IF EXISTS machines")
  await client.execute(`
    CREATE TABLE machines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Aktif',
      efficiency INTEGER DEFAULT 0,
      last_maintenance TEXT NOT NULL
    )
  `)
  await client.executeMultiple(`
    INSERT INTO machines (id, name, status, efficiency, last_maintenance) VALUES ('INJ-001', 'Injection Molding 1', 'Aktif', 94, '28 Apr 2024');
    INSERT INTO machines (id, name, status, efficiency, last_maintenance) VALUES ('INJ-002', 'Injection Molding 2', 'Aktif', 87, '25 Apr 2024');
    INSERT INTO machines (id, name, status, efficiency, last_maintenance) VALUES ('EXT-001', 'Extruder Line 1', 'Perawatan', 0, '07 Mei 2024');
    INSERT INTO machines (id, name, status, efficiency, last_maintenance) VALUES ('BLW-001', 'Blow Molding 1', 'Aktif', 91, '01 Mei 2024');
    INSERT INTO machines (id, name, status, efficiency, last_maintenance) VALUES ('CRS-001', 'Crusher Unit', 'Gangguan', 0, '15 Apr 2024');
  `)
  console.log("✅ Machines seeded!")

  // Seed customers
  await client.execute("DROP TABLE IF EXISTS customers")
  await client.execute(`
    CREATE TABLE customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL
    )
  `)
  await client.executeMultiple(`
    INSERT INTO customers (id, name, phone, address, created_at) VALUES ('CUS-001', 'PT Maju Jaya', '021-1111', 'Jakarta', '2024-01-01');
    INSERT INTO customers (id, name, phone, address, created_at) VALUES ('CUS-002', 'CV Sejahtera', '021-2222', 'Bandung', '2024-01-02');
    INSERT INTO customers (id, name, phone, address, created_at) VALUES ('CUS-003', 'PT Indo Plastik', '021-3333', 'Surabaya', '2024-01-03');
    INSERT INTO customers (id, name, phone, address, created_at) VALUES ('CUS-004', 'UD Berkah', '021-4444', 'Semarang', '2024-01-04');
    INSERT INTO customers (id, name, phone, address, created_at) VALUES ('CUS-005', 'PT Sentosa', '021-5555', 'Medan', '2024-01-05');
  `)
  console.log("✅ Customers seeded!")

  console.log("✅ Inventory seeded!")

    // Seed productions
  await client.execute("DROP TABLE IF EXISTS productions")
  await client.execute(`
    CREATE TABLE productions (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      qty_produced INTEGER NOT NULL,
      date TEXT NOT NULL,
      shift TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  await client.executeMultiple(`
    INSERT INTO productions (id, order_id, qty_produced, date, shift, created_at) VALUES ('PRD-001', 'PO-2024-001', 2000, '2024-05-08', 'Pagi', '2024-05-08');
    INSERT INTO productions (id, order_id, qty_produced, date, shift, created_at) VALUES ('PRD-002', 'PO-2024-001', 3000, '2024-05-08', 'Siang', '2024-05-08');
    INSERT INTO productions (id, order_id, qty_produced, date, shift, created_at) VALUES ('PRD-003', 'PO-2024-002', 5000, '2024-05-08', 'Pagi', '2024-05-08');
  `)
  console.log("✅ Productions seeded!")

  await client.close()
}

seed()