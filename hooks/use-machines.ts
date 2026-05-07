'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Machine, MachineStatus } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchMachines(): Promise<Machine[]> {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Machine[]
}

export function useMachines() {
  const { data, error, isLoading, mutate } = useSWR<Machine[]>('machines', fetchMachines)

  const createMachine = async (machine: Omit<Machine, 'id' | 'created_at' | 'updated_at'>) => {
    const { data: newMachine, error } = await supabase
      .from('machines')
      .insert(machine)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return newMachine
  }

  const updateMachine = async (id: string, updates: Partial<Machine>) => {
    const { data: updatedMachine, error } = await supabase
      .from('machines')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedMachine
  }

  const deleteMachine = async (id: string) => {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    await mutate()
  }

  const updateStatus = async (id: string, status: MachineStatus) => {
    return updateMachine(id, { status })
  }

  const updateEfficiency = async (id: string, efficiency: number) => {
    return updateMachine(id, { efficiency })
  }

  const getByQRCode = async (qrCode: string): Promise<Machine | null> => {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .eq('qr_code', qrCode)
      .single()
    
    if (error) return null
    return data as Machine
  }

  const scheduleMaintenance = async (id: string, nextMaintenanceDate: string) => {
    return updateMachine(id, { 
      next_maintenance: nextMaintenanceDate,
      last_maintenance: new Date().toISOString()
    })
  }

  return {
    machines: data ?? [],
    isLoading,
    error,
    mutate,
    createMachine,
    updateMachine,
    deleteMachine,
    updateStatus,
    updateEfficiency,
    getByQRCode,
    scheduleMaintenance,
  }
}
