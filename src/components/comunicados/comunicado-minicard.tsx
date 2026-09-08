'use client'

import { Megaphone, Pencil, Trash2, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/feedback/status-badge'
import type { ComunicadoLista } from '@/lib/actions/comunicados'

function formatarDataBR(iso: string | null): string {
  if (!iso) return '—'
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

const ESTADO_CONFIG = {
  vigente: { status: 'success' as const, label: 'Vigente' },
  agendado: { status: 'info' as const, label: 'Agendado' },
  expirado: { status: 'muted' as const, label: 'Expirado' },
} as const

type ComunicadoMinicardProps = {
  comunicado: ComunicadoLista
  onEditar: () => void
  onExcluir: () => void
  podeEditar: boolean
  podeExcluir: boolean
}

export function ComunicadoMinicard({ comunicado, onEditar, onExcluir, podeEditar, podeExcluir }: ComunicadoMinicardProps) {
  const estado = ESTADO_CONFIG[comunicado.estado]
  const destino = comunicado.turmaNomes.length > 0
    ? comunicado.turmaNomes.slice(0, 2).join(', ') + (comunicado.turmaNomes.length > 2 ? ` +${comunicado.turmaNomes.length - 2}` : '')
    : 'Todas as turmas'

  return (
    <Card
      className="flex flex-col cursor-pointer hover:shadow-md transition-all border-border hover:border-primary/30"
      onClick={onEditar}
    >
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-foreground truncate">{comunicado.titulo}</p>
              <StatusBadge status={estado.status} className="mt-1">{estado.label}</StatusBadge>
            </div>
          </div>
          <div className="flex shrink-0" onClick={e => e.stopPropagation()}>
            {podeEditar && (
              <Button variant="ghost" size="icon-sm" onClick={onEditar} aria-label="Editar comunicado" className="min-h-[44px] min-w-[44px]">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {podeExcluir && (
              <Button variant="ghost" size="icon-sm" onClick={onExcluir} aria-label="Excluir comunicado" className="min-h-[44px] min-w-[44px]">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
            <span>Envio {formatarDataBR(comunicado.dataEnvio)} · Final {formatarDataBR(comunicado.dataFinal)}</span>
          </div>
          <p className="text-[14px] text-muted-foreground line-clamp-2">{comunicado.descricaoResumida}</p>
          <p className="truncate font-medium text-foreground">{destino}</p>
        </div>
      </CardContent>
    </Card>
  )
}
