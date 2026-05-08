import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

// Tabel Pelanggan
export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  createdAt: text("created_at").notNull(),
})

// Tabel Pesanan
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id),
  product: text("product").notNull(),
  quantity: text("quantity").notNull(),
  status: text("status").notNull().default("Produksi"),
  date: text("date").notNull(),
  createdAt: text("created_at").notNull(),
})

// Tabel Mesin
export const machines = sqliteTable("machines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Aktif"),
  efficiency: integer("efficiency").default(0),
  lastMaintenance: text("last_maintenance").notNull(),
})

// Tabel Produksi
export const productions = sqliteTable("productions", {
  id: text("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id),
  qtyProduced: text("qty_produced").notNull(),
  date: text("date").notNull(),
  shift: text("shift"),
  createdAt: text("created_at").notNull(),
})

// Tabel Inventori
export const inventory = sqliteTable("inventory", {
  id: text("id").primaryKey(),
  materialName: text("material_name").notNull(),
  stock: real("stock").notNull(),
  minStock: real("min_stock").notNull(),
  unit: text("unit").notNull(),
  updatedAt: text("updated_at").notNull(),
})

// Tabel Log Mutasi Stok
export const stockLogs = sqliteTable("stock_logs", {
  id: text("id").primaryKey(),
  inventoryId: text("inventory_id").references(() => inventory.id),
  type: text("type").notNull(),
  qty: real("qty").notNull(),
  notes: text("notes"),
  date: text("date").notNull(),
})