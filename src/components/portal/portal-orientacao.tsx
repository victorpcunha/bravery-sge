'use client'

import { School } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

export function PortalOrientacao({ variante }: { variante: 'orientacao' | 'indisponivel' }) {
  if (variante === 'indisponivel') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-md">
          <EmptyState
            icon={School}
            title="Portal indisponível"
            description="O portal desta escola está indisponível no momento. Procure a secretaria da escola."
          />
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-md">
        <EmptyState
          icon={School}
          title="Portal do Responsável"
          description="O acesso ao portal é feito pelo link repassado pela escola do seu filho (ex.: /portal/nome-da-escola). Procure a secretaria da escola para receber o link correto."
        />
      </div>
    </div>
  )
}
