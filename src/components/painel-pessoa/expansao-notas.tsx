'use client'

import { useState } from 'react'
import { type NotasDetalhadas } from '@/lib/actions/painel-pessoa'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Info, BookOpen, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  data: NotasDetalhadas
}

function freqColor(percent: number | null) {
  if (percent === null) return 'text-muted-foreground'
  if (percent >= 75) return 'text-success'
  if (percent >= 50) return 'text-warning'
  return 'text-destructive'
}

export default function ExpansaoNotas({ data }: Props) {
  const { disciplinas, total_dias_letivos } = data
  const [open, setOpen] = useState(false)

  const allPeriodos = new Set<number>()
  for (const d of disciplinas) {
    for (const p of d.periodos) {
      allPeriodos.add(p.periodo)
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
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h4 className="text-[14px] font-semibold text-foreground">Avaliação Numérica</h4>
        {total_dias_letivos != null && (
          <span className="text-[13px] text-muted-foreground">({total_dias_letivos} dias letivos)</span>
        )}
      </button>

      {open && (!disciplinas.length ? (
        <p className="text-[14px] text-muted-foreground">Nenhuma avaliação numérica registrada.</p>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-lg border border-primary/15">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary/5 text-[13px] uppercase tracking-wider text-primary min-w-[180px]">
                  Disciplina
                </TableHead>
                {periodosSorted.map(periodo => (
                  <TableHead
                    key={periodo}
                    className="bg-primary/5 text-center text-[13px] uppercase tracking-wider text-primary whitespace-nowrap"
                  >
                    {periodo}° Bim
                  </TableHead>
                ))}
                <TableHead className="bg-primary/5 text-center text-[13px] uppercase tracking-wider text-primary whitespace-nowrap">
                  Média Final
                </TableHead>
                <TableHead className="bg-primary/5 text-center text-[13px] uppercase tracking-wider text-primary whitespace-nowrap">
                  Faltas
                </TableHead>
                <TableHead className="bg-primary/5 text-center text-[13px] uppercase tracking-wider text-primary whitespace-nowrap">
                  Freq.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disciplinas.map((d, idx) => (
                <TableRow key={d.disciplina_id} className={cn(idx % 2 === 0 ? 'bg-card' : 'bg-primary/[0.02]', 'hover:bg-primary/5')}>
                  <TableCell className="sticky left-0 bg-inherit z-10 font-medium text-[14px] text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      {d.disciplina_nome}
                    </span>
                  </TableCell>
                  {periodosSorted.map(periodo => {
                    const p = d.periodos.find(x => x.periodo === periodo)

                    if (!p) {
                      return (
                        <TableCell key={periodo} className="text-center text-[14px] text-muted-foreground/60">
                          —
                        </TableCell>
                      )
                    }

                    const cellContent = (
                      <div
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[13px] tabular-nums',
                          p.tem_recuperacao
                            ? 'border-warning/30 bg-warning/10 text-warning'
                            : 'border-border bg-muted/30 text-foreground'
                        )}
                      >
                        <span className="font-semibold">{p.nota != null ? p.nota : '—'}</span>
                        {p.tem_recuperacao && <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                      </div>
                    )

                    return (
                      <TableCell key={periodo} className="text-center whitespace-nowrap">
                        {p.tem_recuperacao ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">{cellContent}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-[13px]">
                                Nota original: <span className="font-semibold">{p.nota_original ?? '—'}</span>
                              </p>
                              <p className="text-[13px]">
                                Recuperação: <span className="font-semibold">{p.nota_recuperacao ?? '—'}</span>
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          cellContent
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-center whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[14px] font-bold text-primary tabular-nums">
                      {d.media_final != null ? d.media_final : '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-[14px] tabular-nums whitespace-nowrap">
                    <span className={cn(d.total_faltas > 0 ? 'font-semibold text-warning' : 'text-foreground')}>
                      {d.total_faltas}
                    </span>
                  </TableCell>
                  <TableCell className={cn('text-center text-[14px] tabular-nums whitespace-nowrap', freqColor(d.frequencia_percentual))}>
                    {d.frequencia_percentual != null ? `${d.frequencia_percentual}%` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
