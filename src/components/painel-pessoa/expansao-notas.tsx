'use client'

import { useState } from 'react'
import { type NotasDetalhadas } from '@/lib/actions/painel-pessoa'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  data: NotasDetalhadas
}

export default function ExpansaoNotas({ data }: Props) {
  const { disciplinas, total_dias_letivos } = data
  const [open, setOpen] = useState(false)

  if (!disciplinas.length) {
    return (
      <div className="py-2">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-full text-left"
          aria-expanded={open}
        >
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          <h4 className="text-[14px] font-semibold text-foreground">Avaliação Numérica</h4>
        </button>
        {open && (
          <p className="text-[14px] text-muted-foreground mt-1 ml-0 sm:ml-6">
            Nenhuma avaliação numérica registrada.
          </p>
        )}
      </div>
    )
  }

  const allPeriodos = new Set<number>()
  for (const d of disciplinas) {
    for (const p of d.periodos) {
      allPeriodos.add(p.periodo)
    }
  }
  const periodosSorted = [...allPeriodos].sort((a, b) => a - b)

  return (
    <div className="py-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left"
        aria-expanded={open}
      >
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
        <h4 className="text-[14px] font-semibold text-foreground">
          Avaliação Numérica
          {total_dias_letivos != null && (
            <span className="text-muted-foreground font-normal ml-2">
              ({total_dias_letivos} dias letivos)
            </span>
          )}
        </h4>
      </button>

      {open && (
        <div className="mt-2 ml-0 sm:ml-6 space-y-2">
          <ul className="space-y-2">
            {disciplinas.map(d => (
                <li
                  key={d.disciplina_id}
                  className="rounded-lg border border-border p-3 space-y-2 min-w-0"
                >
                  <p className="text-[14px] font-semibold text-foreground break-words">
                    {d.disciplina_nome}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                    {d.periodos.map(p => (
                      <div
                        key={p.periodo}
                        className={cn(
                          'flex items-center justify-between gap-1 text-[13px] tabular-nums px-2 py-1 rounded-md border',
                          p.tem_recuperacao
                            ? 'border-warning/30 bg-warning/10 text-warning'
                            : 'border-border bg-muted/30 text-foreground'
                        )}
                      >
                        <span className="text-muted-foreground font-medium">{p.periodo}°</span>
                        <span className="font-semibold">
                          {p.nota != null ? p.nota : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground border-t border-border pt-2 tabular-nums">
                    <span>
                      Média:{' '}
                      <span className="font-semibold text-foreground">
                        {d.media_final != null ? d.media_final : '—'}
                      </span>
                    </span>
                    <span>
                      Faltas:{' '}
                      <span className="font-semibold text-foreground">
                        {d.total_faltas}
                      </span>
                    </span>
                    <span>
                      Freq:{' '}
                      <span className="font-semibold text-foreground">
                        {d.frequencia_percentual != null
                          ? `${d.frequencia_percentual}%`
                          : '—'}
                      </span>
                    </span>
                  </div>
                </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
