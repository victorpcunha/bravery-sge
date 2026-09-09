'use client'

import { ThumbsUp, ThumbsDown, Pencil, Trash2, CalendarDays, Users, Globe, GlobeLock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/feedback/status-badge'
import { cn } from '@/lib/utils'
import type { OcorrenciaLista } from '@/lib/actions/ocorrencias'

function formatarDataBR(iso: string | null): string {
  if (!iso) return '—'
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

function resumirNomes(nomes: string[]): string {
  if (nomes.length === 0) return '—'
  const base = nomes.slice(0, 2).join(', ')
  return nomes.length > 2 ? `${base} +${nomes.length - 2}` : base
}

const TIPO_CONFIG = {
  positiva: { status: 'success' as const, label: 'Positiva', Icone: ThumbsUp },
  negativa: { status: 'destructive' as const, label: 'Negativa', Icone: ThumbsDown },
} as const

type OcorrenciaMinicardProps = {
  ocorrencia: OcorrenciaLista
  onEditar: () => void
  onExcluir: () => void
  podeEditar: boolean
  podeExcluir: boolean
}

export function OcorrenciaMinicard({ ocorrencia, onEditar, onExcluir, podeEditar, podeExcluir }: OcorrenciaMinicardProps) {
  const tipo = TIPO_CONFIG[ocorrencia.tipo]
  const { Icone } = tipo

  return (
    <Card
      className="flex flex-col cursor-pointer hover:shadow-md transition-all border-border hover:border-primary/30"
      onClick={onEditar}
    >
      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              'p-2.5 rounded-lg shrink-0',
              ocorrencia.tipo === 'positiva' ? 'bg-success/10' : 'bg-destructive/10'
            )}>
              <Icone className={cn(
                'h-5 w-5',
                ocorrencia.tipo === 'positiva' ? 'text-success' : 'text-destructive'
              )} />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-foreground truncate">{ocorrencia.titulo}</p>
              <StatusBadge status={tipo.status} className="mt-1">{tipo.label}</StatusBadge>
            </div>
          </div>
          <div className="flex shrink-0" onClick={e => e.stopPropagation()}>
            {podeEditar && (
              <Button variant="ghost" size="icon-sm" onClick={onEditar} aria-label="Editar ocorrência" className="min-h-[44px] min-w-[44px]">
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {podeExcluir && (
              <Button variant="ghost" size="icon-sm" onClick={onExcluir} aria-label="Excluir ocorrência" className="min-h-[44px] min-w-[44px]">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
            <span>{formatarDataBR(ocorrencia.dataOcorrencia)}</span>
          </div>
          <div className="flex items-center gap-2">
            {ocorrencia.apresentarPortal ? (
              <>
                <Globe className="h-4 w-4 shrink-0 text-info" />
                <span className="text-info font-medium">Exibida no Portal dos Responsáveis</span>
              </>
            ) : (
              <>
                <GlobeLock className="h-4 w-4 shrink-0" />
                <span>Não exibida no Portal</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary/70" />
            <span className="truncate font-medium text-foreground">
              {ocorrencia.profissionais.length} {ocorrencia.profissionais.length === 1 ? 'profissional' : 'profissionais'}: {resumirNomes(ocorrencia.profissionais.map(p => p.nome))}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary/70" />
            <span className="truncate font-medium text-foreground">
              {ocorrencia.alunos.length} {ocorrencia.alunos.length === 1 ? 'aluno' : 'alunos'}: {resumirNomes(ocorrencia.alunos.map(a => a.nome))}
            </span>
          </div>
          <p className="text-[14px] text-muted-foreground line-clamp-2">{ocorrencia.descricaoResumida}</p>
        </div>
      </CardContent>
    </Card>
  )
}
