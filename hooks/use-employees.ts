'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Employee, UserRole } from '@/lib/supabase/types'

const supabase = createClient()

async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Employee[]
}

export function useEmployees() {
  const { data, error, isLoading, mutate } = useSWR<Employee[]>('employees', fetchEmployees)

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    const { data: updatedEmployee, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    await mutate()
    return updatedEmployee
  }

  const updateRole = async (id: string, role: UserRole) => {
    return updateEmployee(id, { role })
  }

  const deactivateEmployee = async (id: string) => {
    return updateEmployee(id, { is_active: false })
  }

  const activateEmployee = async (id: string) => {
    return updateEmployee(id, { is_active: true })
  }

  const getByRole = (role: UserRole) => {
    return data?.filter(e => e.role === role) ?? []
  }

  const getActiveEmployees = () => {
    return data?.filter(e => e.is_active) ?? []
  }

  return {
    employees: data ?? [],
    isLoading,
    error,
    mutate,
    updateEmployee,
    updateRole,
    deactivateEmployee,
    activateEmployee,
    getByRole,
    getActiveEmployees,
  }
}
