'use client'

import { Bell, Megaphone, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { InicioPortal, MediasInicio } from '@/lib/actions/portal'

type Props = {
  dados: InicioPortal
  periodoCard: string
  onPeriodoCardChange: (ordem: string) => void
  cardMedias: MediasInicio | null
  onVerComunicados: () => void
  onVerBoletim: () => void
  onVerOcorrencias: () => void
}

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

export function InicioCards({ dados, periodoCard, onPeriodoCardChange, cardMedias, onVerComunicados, onVerBoletim, onVerOcorrencias }: Props) {
  // Card com filtro próprio, independente do KPI de Média geral
  const medias = cardMedias?.mediasDisciplina ?? dados.mediasDisciplina
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <PageSection
        title="Comunicados Recentes"
        actions={<Button size="sm" onClick={onVerComunicados}>Ver Todos</Button>}
      >
        {dados.comunicadosRecentes.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nenhum comunicado recente.</p>
        ) : (
          <ul className="space-y-3">
            {dados.comunicadosRecentes.map(c => (
              <li key={c.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-foreground truncate flex items-center gap-1.5">
                    {!c.lido && <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Não lido" />}
                    <Megaphone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{c.titulo}</span>
                  </p>
                  <span className="text-[13px] text-muted-foreground tabular-nums shrink-0">{formatarData(c.data)}</span>
                </div>
                <p className="text-[14px] text-muted-foreground mt-1 line-clamp-2">{c.descricao}</p>
              </li>
            ))}
          </ul>
        )}
      </PageSection>

      <PageSection
        title="Média do Bimestre por Disciplina"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          {dados.periodos.length > 0 ? (
            <Select value={periodoCard} onValueChange={onPeriodoCardChange}>
              <SelectTrigger className="w-[130px] h-8 text-[13px]" aria-label="Selecionar bimestre do card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dados.periodos.map(p => (
                  <SelectItem key={p.ordem} value={String(p.ordem)}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : <span />}
          <Button size="sm" onClick={onVerBoletim}>Ver Todos</Button>
        </div>
        {!dados.turmaNumerica ? (
          <p className="text-[14px] text-muted-foreground">Turma sem avaliação numérica.</p>
        ) : medias.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nenhuma média lançada.</p>
        ) : (
          <ul className="space-y-2">
            {medias.map(m => (
              <li key={m.disciplina} className="flex items-center justify-between gap-2 text-[14px]">
                <span className="text-muted-foreground truncate flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{m.disciplina}</span>
                </span>
                <span className={`font-bold tabular-nums ${m.media === null ? 'text-muted-foreground' : m.media >= dados.mediaMinima ? 'text-success' : 'text-destructive'}`}>
                  {m.media === null ? '—' : m.media.toFixed(2).replace('.', ',')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PageSection>

      <PageSection
        title="Ocorrências Recentes"
        actions={<Button size="sm" onClick={onVerOcorrencias}>Ver Todos</Button>}
      >
        {dados.ocorrenciasRecentes.length === 0 ? (
          <EmptyState icon={Bell} title="Sem ocorrências" description="Nenhuma ocorrência registrada." />
        ) : (
          <ul className="space-y-3">
            {dados.ocorrenciasRecentes.map(o => (
              <li key={o.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={o.natureza === 'positiva' ? 'success' : 'destructive'}>
                    {o.natureza === 'positiva' ? 'Positiva' : 'Negativa'}
                  </StatusBadge>
                  <span className="text-[13px] text-muted-foreground tabular-nums">{formatarData(o.data)}</span>
                </div>
                <p className="text-[14px] font-semibold text-foreground mt-1.5">{o.titulo}</p>
                <p className="text-[14px] text-muted-foreground line-clamp-2">{o.descricao}</p>
              </li>
            ))}
          </ul>
        )}
      </PageSection>
    </div>
  )
}
