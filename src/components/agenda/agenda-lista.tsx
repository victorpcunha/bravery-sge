'use client'

import { AgendaCard } from '@/components/agenda/agenda-card'
import { AgendaEmpty } from '@/components/agenda/agenda-empty'
import type { Compromisso } from '@/lib/actions/agenda'

type Props = {
  compromissos: Record<string, Compromisso[]>
  onDelete: (id: string) => void
}

function formatDataLabel(data: string) {
  const d = new Date(data + 'T12:00:00')
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  const hojeStr = hoje.toISOString().split('T')[0]
  const amanhaStr = amanha.toISOString().split('T')[0]

  if (data === hojeStr) return 'Hoje'
  if (data === amanhaStr) return 'Amanhã'

  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

export function AgendaLista({ compromissos, onDelete }: Props) {
  const datas = Object.keys(compromissos).sort()

  if (datas.length === 0) {
    return <AgendaEmpty />
  }

  return (
    <div className="space-y-4">
      {datas.map((data) => (
        <div key={data}>
          <h4 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {formatDataLabel(data)}
          </h4>
          <div className="space-y-2">
            {compromissos[data].map((c) => (
              <AgendaCard key={c.id} compromisso={c} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
