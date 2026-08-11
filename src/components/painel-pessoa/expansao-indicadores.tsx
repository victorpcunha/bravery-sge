'use client'

import { useState } from 'react'
import { type IndicadoresAvaliados } from '@/lib/actions/painel-pessoa'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ClipboardCheck, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  data: IndicadoresAvaliados
}

const PALETA_NIVEIS = ['primary', 'info', 'success', 'warning', 'destructive', 'muted'] as const
type NivelStatus = (typeof PALETA_NIVEIS)[number]

function nivelStatus(chave: string): NivelStatus {
  let h = 0
  for (let i = 0; i < chave.length; i++) {
    h = (h * 31 + chave.charCodeAt(i)) >>> 0
  }
  return PALETA_NIVEIS[h % PALETA_NIVEIS.length]
}

export default function ExpansaoIndicadores({ data }: Props) {
  const { disciplinas } = data
  const [open, setOpen] = useState(false)

  const allPeriodos = new Set<number>()
  for (const d of disciplinas) {
    for (const ind of d.indicadores) {
      for (const p of ind.periodos) {
        allPeriodos.add(p.periodo)
      }
    }
  }
  const periodosSorted = [...allPeriodos].sort((a, b) => a - b)

  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-[14px] font-semibold text-foreground">Avaliação por Indicadores</h4>
      </button>

      {open && (!disciplinas.length ? (
        <p className="text-[14px] text-muted-foreground">Nenhum indicador avaliado.</p>
      ) : (
        <div className="mt-2 space-y-4">
          {disciplinas.map(disc => (
            <div key={disc.disciplina_id}>
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-primary mb-1.5">
                <ClipboardCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {disc.disciplina_nome}
              </p>
              <div className="overflow-x-auto rounded-lg border border-primary/15">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-primary/5 text-[13px] uppercase tracking-wider text-primary min-w-[220px]">
                        Indicador
                      </TableHead>
                      {periodosSorted.map(periodo => (
                        <TableHead
                          key={periodo}
                          className="bg-primary/5 text-center text-[13px] uppercase tracking-wider text-primary whitespace-nowrap"
                        >
                          {periodo}° Bim
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disc.indicadores.map((ind, idx) => (
                      <TableRow key={ind.indicador_id} className={cn(idx % 2 === 0 ? 'bg-card' : 'bg-primary/[0.02]', 'hover:bg-primary/5')}>
                        <TableCell className="text-[14px] text-foreground break-words">
                          {ind.descricao}
                        </TableCell>
                        {periodosSorted.map(periodo => {
                          const p = ind.periodos.find(x => x.periodo === periodo)

                          if (!p?.nivel_id) {
                            return (
                              <TableCell key={periodo} className="text-center text-[14px] text-muted-foreground/60">
                                —
                              </TableCell>
                            )
                          }

                          const chave = p.nivel_sigla || p.nivel_descricao || ''
                          const label = p.nivel_sigla || p.nivel_descricao

                          return (
                            <TableCell key={periodo} className="text-center whitespace-nowrap">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex">
                                    <StatusBadge status={nivelStatus(chave)}>{label}</StatusBadge>
                                  </span>
                                </TooltipTrigger>
                                {p.nivel_descricao && (
                                  <TooltipContent>
                                    <p className="text-[13px]">{p.nivel_descricao}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
