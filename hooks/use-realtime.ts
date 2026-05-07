'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type TableName = 
  | 'employees' 
  | 'suppliers' 
  | 'customers' 
  | 'raw_materials' 
  | 'products' 
  | 'machines' 
  | 'production_orders' 
  | 'inventory' 
  | 'product_materials'

type PostgresChangesEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeOptions<T> {
  table: TableName
  event?: PostgresChangesEvent
  onInsert?: (payload: T) => void
  onUpdate?: (payload: T) => void
  onDelete?: (payload: { id: string }) => void
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void
  filter?: string
}

export function useRealtime<T extends Record<string, unknown>>({
  table,
  event = '*',
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  filter,
}: UseRealtimeOptions<T>) {
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupChannel = () => {
      const channelConfig: Parameters<typeof supabase.channel>[1] = {
        config: {
          broadcast: { self: true },
        },
      }

      channel = supabase.channel(`${table}-changes`, channelConfig)

      // @ts-expect-error - Supabase types are complex with postgres_changes
      channel.on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          onChange?.(payload)

          if (payload.eventType === 'INSERT' && onInsert) {
            onInsert(payload.new as T)
          } else if (payload.eventType === 'UPDATE' && onUpdate) {
            onUpdate(payload.new as T)
          } else if (payload.eventType === 'DELETE' && onDelete) {
            onDelete({ id: (payload.old as { id: string }).id })
          }
        }
      )

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Realtime subscribed to ${table}`)
        }
      })
    }

    setupChannel()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, table, event, filter, onChange, onInsert, onUpdate, onDelete])
}

// Convenience hooks for specific tables
export function useRealtimeProducts(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'products' })
}

export function useRealtimeRawMaterials(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'raw_materials' })
}

export function useRealtimeProductionOrders(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'production_orders' })
}

export function useRealtimeInventory(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'inventory' })
}

export function useRealtimeMachines(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'machines' })
}

export function useRealtimeCustomers(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'customers' })
}

export function useRealtimeSuppliers(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'suppliers' })
}

export function useRealtimeEmployees(callbacks: Omit<UseRealtimeOptions<Record<string, unknown>>, 'table'>) {
  return useRealtime({ ...callbacks, table: 'employees' })
}
