'use client'

import { useState } from 'react'
import { type NotasDetalhadas } from '@/lib/actions/painel-pessoa'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Props = {
  data: NotasDetalhadas
}

export default function ExpansaoNotas({ data }: Props) {
  const { disciplinas, total_dias_letivos } = data
  const [open, setOpen] = useState(false)

  if (!disciplinas.length) {
    return (
      <div className="py-2">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          <h4 className="text-xs font-semibold text-foreground">Avaliacao Numerica</h4>
        </div>
        {open && <p className="text-xs text-muted-foreground mt-1 ml-6">Nenhuma avaliacao numerica registrada.</p>}
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
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        <h4 className="text-xs font-semibold text-foreground">
          Avaliacao Numerica
          {total_dias_letivos != null && (
            <span className="text-muted-foreground font-normal ml-2">
              ({total_dias_letivos} dias letivos)
            </span>
          )}
        </h4>
      </div>

      {open && (
        <div className="mt-2 ml-6">
          <ScrollArea className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sticky left-0 bg-muted z-10 min-w-[140px]">Disciplina</TableHead>
                  {periodosSorted.map(p => (
                    <TableHead key={p} className="text-xs text-center">{p}° Per.</TableHead>
                  ))}
                  <TableHead className="text-xs text-center">Media Final</TableHead>
                  <TableHead className="text-xs text-center">Faltas</TableHead>
                  <TableHead className="text-xs text-center">Freq. %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinas.map(d => (
                  <TableRow key={d.disciplina_id}>
                    <TableCell className="text-xs font-medium sticky left-0 bg-background z-10">
                      {d.disciplina_nome}
                    </TableCell>
                    {periodosSorted.map(p => {
                      const per = d.periodos.find(pp => pp.periodo === p)
                      return (
                        <TableCell key={p} className="text-xs text-center">
                          {per ? (
                            <span className={cn(per.tem_recuperacao && 'text-warning')}>
                              {per.nota != null ? per.nota : '-'}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell className="text-xs text-center font-medium">
                      {d.media_final != null ? d.media_final : '-'}
                    </TableCell>
                    <TableCell className="text-xs text-center">{d.total_faltas}</TableCell>
                    <TableCell className="text-xs text-center">
                      {d.frequencia_percentual != null ? `${d.frequencia_percentual}%` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
