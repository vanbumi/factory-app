export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer'
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'offline'
export type InventoryMovementType = 'in' | 'out' | 'adjustment'

export interface Employee {
  id: string
  employee_code: string
  full_name: string
  email: string
  phone: string | null
  role: UserRole
  department: string | null
  position: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  supplier_code: string
  name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  customer_code: string
  name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string
  credit_limit: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RawMaterial {
  id: string
  material_code: string
  name: string
  description: string | null
  unit: string
  unit_price: number
  min_stock: number
  current_stock: number
  supplier_id: string | null
  supplier?: Supplier
  qr_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  product_code: string
  name: string
  description: string | null
  category: string | null
  unit: string
  unit_price: number
  min_stock: number
  current_stock: number
  qr_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Machine {
  id: string
  machine_code: string
  name: string
  type: string | null
  manufacturer: string | null
  model: string | null
  serial_number: string | null
  location: string | null
  status: MachineStatus
  efficiency: number
  last_maintenance: string | null
  next_maintenance: string | null
  qr_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductionOrder {
  id: string
  order_number: string
  product_id: string | null
  product?: Product
  machine_id: string | null
  machine?: Machine
  quantity_ordered: number
  quantity_produced: number
  status: OrderStatus
  start_date: string | null
  end_date: string | null
  due_date: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  movement_type: InventoryMovementType
  reference_number: string | null
  product_id: string | null
  product?: Product
  raw_material_id: string | null
  raw_material?: RawMaterial
  quantity: number
  unit_price: number
  total_price: number
  location: string | null
  notes: string | null
  recorded_by: string | null
  created_at: string
}

export interface ProductMaterial {
  id: string
  product_id: string
  raw_material_id: string
  raw_material?: RawMaterial
  quantity_required: number
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: Employee
        Insert: Omit<Employee, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string }
        Update: Partial<Omit<Employee, 'id'>>
      }
      suppliers: {
        Row: Supplier
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<Supplier, 'id'>>
      }
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<Customer, 'id'>>
      }
      raw_materials: {
        Row: RawMaterial
        Insert: Omit<RawMaterial, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<RawMaterial, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<Product, 'id'>>
      }
      machines: {
        Row: Machine
        Insert: Omit<Machine, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<Machine, 'id'>>
      }
      production_orders: {
        Row: ProductionOrder
        Insert: Omit<ProductionOrder, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Omit<ProductionOrder, 'id'>>
      }
      inventory: {
        Row: Inventory
        Insert: Omit<Inventory, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Inventory, 'id'>>
      }
      product_materials: {
        Row: ProductMaterial
        Insert: Omit<ProductMaterial, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<ProductMaterial, 'id'>>
      }
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      machine_status: MachineStatus
      inventory_movement_type: InventoryMovementType
    }
  }
}
