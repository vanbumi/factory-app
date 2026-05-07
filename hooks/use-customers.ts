'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Customer[]
}

export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR<Customer[]>('customers', fetchCustomers)

  const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return newCustomer
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const { data: updatedCustomer, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedCustomer
  }

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  return {
    customers: data ?? [],
    isLoading,
    error,
    mutate,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
