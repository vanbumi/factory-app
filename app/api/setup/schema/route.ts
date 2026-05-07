import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing types if they exist (for clean re-run)
DO $$ BEGIN
  DROP TYPE IF EXISTS user_role CASCADE;
  DROP TYPE IF EXISTS order_status CASCADE;
  DROP TYPE IF EXISTS machine_status CASCADE;
  DROP TYPE IF EXISTS inventory_movement_type CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Enum types for status and roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE machine_status AS ENUM ('running', 'idle', 'maintenance', 'offline');
CREATE TYPE inventory_movement_type AS ENUM ('in', 'out', 'adjustment');

-- Employees table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'viewer',
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Indonesia',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Indonesia',
  credit_limit DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw materials table
CREATE TABLE IF NOT EXISTS public.raw_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(15, 2) DEFAULT 0,
  min_stock DECIMAL(15, 2) DEFAULT 0,
  current_stock DECIMAL(15, 2) DEFAULT 0,
  supplier_id UUID REFERENCES public.suppliers(id),
  qr_code VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(15, 2) DEFAULT 0,
  min_stock DECIMAL(15, 2) DEFAULT 0,
  current_stock DECIMAL(15, 2) DEFAULT 0,
  qr_code VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Machines table
CREATE TABLE IF NOT EXISTS public.machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  manufacturer VARCHAR(255),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  location VARCHAR(255),
  status machine_status DEFAULT 'idle',
  efficiency DECIMAL(5, 2) DEFAULT 0,
  last_maintenance TIMESTAMPTZ,
  next_maintenance TIMESTAMPTZ,
  qr_code VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production orders table
CREATE TABLE IF NOT EXISTS public.production_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  machine_id UUID REFERENCES public.machines(id),
  quantity_ordered DECIMAL(15, 2) NOT NULL,
  quantity_produced DECIMAL(15, 2) DEFAULT 0,
  status order_status DEFAULT 'pending',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory movements table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movement_type inventory_movement_type NOT NULL,
  reference_number VARCHAR(50),
  product_id UUID REFERENCES public.products(id),
  raw_material_id UUID REFERENCES public.raw_materials(id),
  quantity DECIMAL(15, 2) NOT NULL,
  unit_price DECIMAL(15, 2) DEFAULT 0,
  total_price DECIMAL(15, 2) DEFAULT 0,
  location VARCHAR(255),
  notes TEXT,
  recorded_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product raw materials (BOM - Bill of Materials)
CREATE TABLE IF NOT EXISTS public.product_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  raw_material_id UUID REFERENCES public.raw_materials(id) ON DELETE CASCADE,
  quantity_required DECIMAL(15, 4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, raw_material_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
-- Employees policies
CREATE POLICY "employees_select" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "employees_insert" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "employees_update" ON public.employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "employees_delete" ON public.employees FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Suppliers policies
CREATE POLICY "suppliers_select" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "suppliers_insert" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "suppliers_update" ON public.suppliers FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "suppliers_delete" ON public.suppliers FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Customers policies
CREATE POLICY "customers_select" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "customers_insert" ON public.customers FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "customers_update" ON public.customers FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "customers_delete" ON public.customers FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Raw materials policies
CREATE POLICY "raw_materials_select" ON public.raw_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "raw_materials_insert" ON public.raw_materials FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "raw_materials_update" ON public.raw_materials FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "raw_materials_delete" ON public.raw_materials FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Products policies
CREATE POLICY "products_select" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "products_update" ON public.products FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "products_delete" ON public.products FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Machines policies
CREATE POLICY "machines_select" ON public.machines FOR SELECT TO authenticated USING (true);
CREATE POLICY "machines_insert" ON public.machines FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "machines_update" ON public.machines FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "machines_delete" ON public.machines FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Production orders policies
CREATE POLICY "production_orders_select" ON public.production_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "production_orders_insert" ON public.production_orders FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "production_orders_update" ON public.production_orders FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "production_orders_delete" ON public.production_orders FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Inventory policies
CREATE POLICY "inventory_select" ON public.inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "inventory_insert" ON public.inventory FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager', 'operator'))
);
CREATE POLICY "inventory_update" ON public.inventory FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "inventory_delete" ON public.inventory FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Product materials policies
CREATE POLICY "product_materials_select" ON public.product_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "product_materials_insert" ON public.product_materials FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "product_materials_update" ON public.product_materials FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role IN ('admin', 'manager'))
);
CREATE POLICY "product_materials_delete" ON public.product_materials FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.employees e WHERE e.id = auth.uid() AND e.role = 'admin')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON public.production_orders(status);
CREATE INDEX IF NOT EXISTS idx_inventory_movement_type ON public.inventory(movement_type);
CREATE INDEX IF NOT EXISTS idx_machines_status ON public.machines(status);
CREATE INDEX IF NOT EXISTS idx_raw_materials_qr ON public.raw_materials(qr_code);
CREATE INDEX IF NOT EXISTS idx_products_qr ON public.products(qr_code);
CREATE INDEX IF NOT EXISTS idx_machines_qr ON public.machines(qr_code);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.raw_materials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.machines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.production_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_materials;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_employee_code VARCHAR(50);
BEGIN
  -- Generate employee code
  new_employee_code := 'EMP-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  INSERT INTO public.employees (id, employee_code, full_name, email, role)
  VALUES (
    new.id,
    new_employee_code,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    COALESCE((new.raw_user_meta_data ->> 'role')::user_role, 'viewer')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_raw_materials_updated_at BEFORE UPDATE ON public.raw_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON public.machines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON public.production_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Execute schema creation
    const { error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
      // If the RPC doesn't exist, we need to tell user to run manually
      return NextResponse.json({
        success: false,
        message: 'Schema needs to be created manually in Supabase SQL Editor',
        schema: schema,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Schema created successfully' })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create schema',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database schema for ERP system',
    tables: [
      'employees',
      'suppliers', 
      'customers',
      'raw_materials',
      'products',
      'machines',
      'production_orders',
      'inventory',
      'product_materials'
    ],
    schema: schema
  })
}
