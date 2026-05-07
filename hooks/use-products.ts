'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Product[]
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>('products', fetchProducts)

  const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return newProduct
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedProduct
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  const getByQRCode = async (qrCode: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('qr_code', qrCode)
      .single()
    
    if (error) return null
    return data as Product
  }

  return {
    products: data ?? [],
    isLoading,
    error,
    mutate,
    createProduct,
    updateProduct,
    deleteProduct,
    getByQRCode,
  }
}
