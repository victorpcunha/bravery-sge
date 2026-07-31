'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AgendaCategoriaBadge } from '@/components/agenda/agenda-categoria-badge'
import type { Compromisso } from '@/lib/actions/agenda'

type Props = {
  compromisso: Compromisso
  onDelete: (id: string) => void
}

function formatHora(time: string | null) {
  if (!time) return ''
  const [h, m] = time.split(':')
  return `${h}:${m}`
}

export function AgendaCard({ compromisso, onDelete }: Props) {
  return (
    <div className="relative flex items-start gap-3 rounded-sm border border-border bg-card p-3 transition-shadow hover:shadow-sm">
      <div className="flex flex-col items-end gap-0.5 min-w-[60px] shrink-0">
        <span className="text-[13px] font-semibold text-foreground leading-tight tabular-nums">
          {formatHora(compromisso.horario_inicial)}
        </span>
        {compromisso.horario_final && (
          <>
            <span className="text-[10px] text-muted-foreground leading-tight">até</span>
            <span className="text-[12px] font-medium text-muted-foreground leading-tight tabular-nums">
              {formatHora(compromisso.horario_final)}
            </span>
          </>
        )}
        {compromisso.dia_todo && (
          <span className="text-[11px] text-muted-foreground leading-tight mt-0.5">Dia todo</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-foreground leading-snug truncate pr-1">
              {compromisso.titulo}
            </p>
            {compromisso.detalhes && (
              <p className="text-[13px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                {compromisso.detalhes}
              </p>
            )}
          </div>
          <div className="flex items-start gap-1 shrink-0">
            <AgendaCategoriaBadge categoria={compromisso.categoria} />
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive/80 shrink-0 -mr-1.5"
              onClick={() => onDelete(compromisso.id)}
              aria-label="Excluir compromisso"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
