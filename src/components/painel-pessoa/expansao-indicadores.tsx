'use client'

import { useState } from 'react'
import { type IndicadoresAvaliados } from '@/lib/actions/painel-pessoa'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
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
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        <h4 className="text-xs font-semibold text-foreground">Avaliacao por Indicadores</h4>
      </div>

      {open && (
        <div className="mt-2 ml-6">
          {!disciplinas.length ? (
            <p className="text-xs text-muted-foreground">Nenhum indicador avaliado.</p>
          ) : (
            <>
              <div className="mb-3">
                <Select value={selectedDiscId} onValueChange={setSelectedDiscId}>
                  <SelectTrigger size="sm" className="text-xs w-full max-w-xs">
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map(d => (
                      <SelectItem key={d.disciplina_id} value={d.disciplina_id} className="text-xs">
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
                  <ScrollArea className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sticky left-0 bg-muted z-10 min-w-[200px]">Indicador</TableHead>
                          {periodosSorted.map(p => (
                            <TableHead key={p} className="text-xs text-center">{p}° Per.</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDisc.indicadores.map(ind => (
                          <TableRow key={ind.indicador_id}>
                            <TableCell className="text-xs sticky left-0 bg-background z-10">
                              {ind.descricao}
                            </TableCell>
                            {periodosSorted.map(p => {
                              const per = ind.periodos.find(pp => pp.periodo === p)
                              return (
                                <TableCell key={p} className="text-xs text-center">
                                  {per?.nivel_sigla || per?.nivel_descricao || '-'}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )
              })()}
            </>
          )}
        </div>
      )}
    </div>
  )
}
