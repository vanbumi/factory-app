'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Inventory, InventoryMovementType } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchInventory(): Promise<Inventory[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, product:products(*), raw_material:raw_materials(*)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Inventory[]
}

export function useInventory() {
  const { data, error, isLoading, mutate } = useSWR<Inventory[]>('inventory', fetchInventory)

  const createInventoryMovement = async (movement: Omit<Inventory, 'id' | 'created_at' | 'product' | 'raw_material'>) => {
    const { data: newMovement, error } = await supabase
      .from('inventory')
      .insert({
        ...movement,
        total_price: movement.quantity * movement.unit_price,
      })
      .select('*, product:products(*), raw_material:raw_materials(*)')
      .single()
    
    if (error) throw error
    
    // Update stock in the corresponding table
    if (movement.product_id) {
      await updateProductStock(movement.product_id, movement.quantity, movement.movement_type)
    } else if (movement.raw_material_id) {
      await updateRawMaterialStock(movement.raw_material_id, movement.quantity, movement.movement_type)
    }
    
    await mutate()
    return newMovement
  }

  const updateProductStock = async (productId: string, quantity: number, type: InventoryMovementType) => {
    const { data: product } = await supabase
      .from('products')
      .select('current_stock')
      .eq('id', productId)
      .single()
    
    if (!product) return

    let newStock = product.current_stock
    if (type === 'in') newStock += quantity
    else if (type === 'out') newStock -= quantity
    else newStock = quantity // adjustment

    await supabase
      .from('products')
      .update({ current_stock: Math.max(0, newStock) })
      .eq('id', productId)
  }

  const updateRawMaterialStock = async (materialId: string, quantity: number, type: InventoryMovementType) => {
    const { data: material } = await supabase
      .from('raw_materials')
      .select('current_stock')
      .eq('id', materialId)
      .single()
    
    if (!material) return

    let newStock = material.current_stock
    if (type === 'in') newStock += quantity
    else if (type === 'out') newStock -= quantity
    else newStock = quantity // adjustment

    await supabase
      .from('raw_materials')
      .update({ current_stock: Math.max(0, newStock) })
      .eq('id', materialId)
  }

  const getMovementsByProduct = (productId: string) => {
    return data?.filter(m => m.product_id === productId) ?? []
  }

  const getMovementsByMaterial = (materialId: string) => {
    return data?.filter(m => m.raw_material_id === materialId) ?? []
  }

  return {
    inventory: data ?? [],
    isLoading,
    error,
    mutate,
    createInventoryMovement,
    getMovementsByProduct,
    getMovementsByMaterial,
  }
}
