'use client'

import { Calendar } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function AgendaEmpty() {
  return (
    <EmptyState
      icon={Calendar}
      title="Nenhum compromisso agendado."
      description="Seus compromissos aparecerão aqui após adicioná-los."
    />
  )
}
