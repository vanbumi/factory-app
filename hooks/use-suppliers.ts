'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Supplier } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Supplier[]
}

export function useSuppliers() {
  const { data, error, isLoading, mutate } = useSWR<Supplier[]>('suppliers', fetchSuppliers)

  const createSupplier = async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: newSupplier, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return newSupplier
  }

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    const { data: updatedSupplier, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedSupplier
  }

  const deleteSupplier = async (id: string) => {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  return {
    suppliers: data ?? [],
    isLoading,
    error,
    mutate,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  }
}
