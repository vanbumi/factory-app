'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { ProductionOrder, OrderStatus } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchProductionOrders(): Promise<ProductionOrder[]> {
  const { data, error } = await supabase
    .from('production_orders')
    .select('*, product:products(*), machine:machines(*)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as ProductionOrder[]
}

export function useProductionOrders() {
  const { data, error, isLoading, mutate } = useSWR<ProductionOrder[]>('production_orders', fetchProductionOrders)

  const createProductionOrder = async (order: Omit<ProductionOrder, 'id' | 'created_at' | 'updated_at' | 'product' | 'machine'>) => {
    const { data: newOrder, error } = await supabase
      .from('production_orders')
      .insert(order)
      .select('*, product:products(*), machine:machines(*)')
      .single()
    
    if (error) throw error
    await mutate()
    return newOrder
  }

  const updateProductionOrder = async (id: string, updates: Partial<ProductionOrder>) => {
    const { data: updatedOrder, error } = await supabase
      .from('production_orders')
      .update(updates)
      .eq('id', id)
      .select('*, product:products(*), machine:machines(*)')
      .single()
    
    if (error) throw error
    await mutate()
    return updatedOrder
  }

  const deleteProductionOrder = async (id: string) => {
    const { error } = await supabase
      .from('production_orders')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    const updates: Partial<ProductionOrder> = { status }
    
    if (status === 'in_progress' && !data?.find(o => o.id === id)?.start_date) {
      updates.start_date = new Date().toISOString()
    }
    
    if (status === 'completed') {
      updates.end_date = new Date().toISOString()
    }
    
    return updateProductionOrder(id, updates)
  }

  const updateProgress = async (id: string, quantityProduced: number) => {
    return updateProductionOrder(id, { quantity_produced: quantityProduced })
  }

  return {
    productionOrders: data ?? [],
    isLoading,
    error,
    mutate,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    updateStatus,
    updateProgress,
  }
}
