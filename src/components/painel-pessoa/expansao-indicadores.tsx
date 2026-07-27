'use client'

import { useState } from 'react'
import { type IndicadoresAvaliados } from '@/lib/actions/painel-pessoa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Props = {
  data: IndicadoresAvaliados
}

export default function ExpansaoIndicadores({ data }: Props) {
  const { disciplinas } = data
  const [open, setOpen] = useState(false)
  const [selectedDiscId, setSelectedDiscId] = useState<string>('')

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
          Avaliação por Indicadores
        </h4>
      </button>

      {open && (
        <div className="mt-2 ml-0 sm:ml-6">
          {!disciplinas.length ? (
            <p className="text-[14px] text-muted-foreground">Nenhum indicador avaliado.</p>
          ) : (
            <>
              <div className="mb-3">
                <Select value={selectedDiscId} onValueChange={setSelectedDiscId}>
                  <SelectTrigger className="w-full sm:max-w-xs">
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map(d => (
                      <SelectItem key={d.disciplina_id} value={d.disciplina_id}>
                        {d.disciplina_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(() => {
                const selectedDisc = selectedDiscId
                  ? disciplinas.find(d => d.disciplina_id === selectedDiscId)
                  : null

                if (!selectedDisc) return null

                const allPeriodos = new Set<number>()
                for (const ind of selectedDisc.indicadores) {
                  for (const p of ind.periodos) {
                    allPeriodos.add(p.periodo)
                  }
                }
                const periodosSorted = [...allPeriodos].sort((a, b) => a - b)

                return (
                  <ul className="space-y-2">
                    {selectedDisc.indicadores.map(ind => (
                      <li
                        key={ind.indicador_id}
                        className="rounded-lg border border-border p-3 space-y-2 min-w-0"
                      >
                        <p className="text-[14px] font-medium text-foreground break-words">
                          {ind.descricao}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                          {ind.periodos.map(p => (
                            <div
                              key={p.periodo}
                              className="flex items-center justify-between gap-1 text-[13px] tabular-nums px-2 py-1 rounded-md border border-border bg-muted/30"
                            >
                              <span className="text-muted-foreground font-medium">
                                {p.periodo}°
                              </span>
                              <span className="font-semibold">
                                {p.nivel_sigla || p.nivel_descricao || '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </>
          )}
        </div>
      )}
    </div>
  )
}
