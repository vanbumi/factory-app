'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { RawMaterial } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchRawMaterials(): Promise<RawMaterial[]> {
  const { data, error } = await supabase
    .from('raw_materials')
    .select('*, supplier:suppliers(*)')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as RawMaterial[]
}

export function useRawMaterials() {
  const { data, error, isLoading, mutate } = useSWR<RawMaterial[]>('raw_materials', fetchRawMaterials)

  const createRawMaterial = async (material: Omit<RawMaterial, 'id' | 'created_at' | 'updated_at' | 'supplier'>) => {
    const { data: newMaterial, error } = await supabase
      .from('raw_materials')
      .insert(material)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return newMaterial
  }

  const updateRawMaterial = async (id: string, updates: Partial<RawMaterial>) => {
    const { data: updatedMaterial, error } = await supabase
      .from('raw_materials')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedMaterial
  }

  const deleteRawMaterial = async (id: string) => {
    const { error } = await supabase
      .from('raw_materials')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  const getByQRCode = async (qrCode: string): Promise<RawMaterial | null> => {
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*, supplier:suppliers(*)')
      .eq('qr_code', qrCode)
      .single()
    
    if (error) return null
    return data as RawMaterial
  }

  const updateStock = async (id: string, quantity: number, type: 'add' | 'subtract') => {
    const material = data?.find(m => m.id === id)
    if (!material) throw new Error('Material not found')
    
    const newStock = type === 'add' 
      ? material.current_stock + quantity 
      : material.current_stock - quantity

    return updateRawMaterial(id, { current_stock: Math.max(0, newStock) })
  }

  return {
    rawMaterials: data ?? [],
    isLoading,
    error,
    mutate,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    getByQRCode,
    updateStock,
  }
}
