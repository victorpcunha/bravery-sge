'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type FrequenciaData = {
  presencas: number
  total: number
}

type TurmaFreq = {
  turma: string
  presencas: number
  total: number
}

type FrequenciaHeroCardProps = {
  data: FrequenciaData | null
  topTurmasFaltosas: TurmaFreq[]
  className?: string
}

function corPorTaxa(taxa: number): string {
  if (taxa < 75) return 'text-destructive'
  if (taxa < 90) return 'text-warning'
  return 'text-success'
}

export function FrequenciaHeroCard({ data, topTurmasFaltosas, className }: FrequenciaHeroCardProps) {
  const percentage =
    data && data.total > 0
      ? Math.round((data.presencas / data.total) * 100)
      : null

  const top5 = topTurmasFaltosas.slice(0, 5)
  const hasTopList = top5.length > 0

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md sm:p-7',
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="p-3 rounded-2xl bg-success/10 text-success shrink-0">
            <TrendingUp className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[44px] font-bold leading-none tracking-tight text-foreground tabular-nums sm:text-[48px]">
              {percentage !== null ? `${percentage}%` : '—'}
            </p>
            <p className="mt-2 text-[15px] font-medium text-muted-foreground sm:text-base">
              Frequência Média da Escola
            </p>
            {data && data.total > 0 && (
              <p className="mt-1 text-[13px] text-muted-foreground tabular-nums">
                {data.presencas.toLocaleString('pt-BR')} de{' '}
                {data.total.toLocaleString('pt-BR')} registros de presença
              </p>
            )}
            {percentage === null && (
              <p className="mt-1 text-[13px] text-muted-foreground">
                Sem dados de frequência registrados
              </p>
            )}
          </div>
        </div>

        {hasTopList && (
          <div className="min-w-0 flex-1 lg:border-l lg:border-border lg:pl-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                Turmas com mais faltas
              </p>
            </div>
            <ul className="space-y-2">
              {top5.map((t, i) => {
                const taxa = t.total > 0 ? Math.round((t.presencas / t.total) * 100) : 0
                const faltas = t.total - t.presencas
                return (
                  <li
                    key={t.turma}
                    className="flex items-center justify-between gap-3 text-[13px]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <span className="truncate text-foreground">{t.turma}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 tabular-nums">
                      <span className="text-muted-foreground">
                        {faltas.toLocaleString('pt-BR')} {faltas === 1 ? 'falta' : 'faltas'}
                      </span>
                      <span
                        className={cn(
                          'min-w-[3ch] text-right text-[12px] font-semibold',
                          corPorTaxa(taxa)
                        )}
                      >
                        {taxa}%
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
