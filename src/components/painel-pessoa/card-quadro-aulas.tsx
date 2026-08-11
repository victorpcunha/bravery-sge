'use client'

import { useState, useEffect } from 'react'
import { getQuadroAulas, type QuadroAulaItem } from '@/lib/actions/painel-pessoa'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

type Props = {
  turmaId: string
  pessoaLogadaId: string | null
}

const DIAS_SEMANA_LABEL: Record<number, string> = {
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
}

export default function CardQuadroAulas({ turmaId, pessoaLogadaId }: Props) {
  const [aulas, setAulas] = useState<QuadroAulaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getQuadroAulas(turmaId, pessoaLogadaId)
      .then(setAulas)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [turmaId, pessoaLogadaId])

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="flex items-center justify-center gap-2 py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="text-[14px] text-muted-foreground">Carregando quadro de aulas...</span>
        </div>
      </div>
    )
  }

  if (aulas.length === 0) {
    return (
      <p className="text-[15px] text-muted-foreground py-2">
        Nenhum quadro de aulas configurado para esta turma.
      </p>
    )
  }

  const horariosSet = new Set<string>()
  for (const a of aulas) {
    horariosSet.add(`${a.horario_inicial} - ${a.horario_final}`)
  }
  const horarios = [...horariosSet].sort()

  const mapa = new Map<string, string>()
  for (const a of aulas) {
    const key = `${a.dia_semana}|${a.horario_inicial} - ${a.horario_final}`
    mapa.set(key, a.disciplina_nome)
  }

  const diasUteis = [1, 2, 3, 4, 5]

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-muted z-10 text-[13px] uppercase tracking-wider text-muted-foreground">
              Horário
            </TableHead>
            {diasUteis.map(dia => (
              <TableHead
                key={dia}
                className="bg-muted text-center text-[13px] uppercase tracking-wider text-muted-foreground min-w-[120px]"
              >
                {DIAS_SEMANA_LABEL[dia]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios.map((horario, idx) => (
            <TableRow key={horario} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/20 hover:bg-muted/30'}>
              <TableCell className="sticky left-0 bg-inherit z-10 whitespace-nowrap">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-[13px] font-mono font-medium text-foreground">
                  {horario}
                </span>
              </TableCell>
              {diasUteis.map(dia => {
                const nome = mapa.get(`${dia}|${horario}`)
                return (
                  <TableCell key={dia} className="text-center">
                    {nome ? (
                      <span className="inline-flex items-center justify-center rounded-md bg-primary/5 px-2.5 py-1 text-[14px] font-medium text-primary">
                        {nome}
                      </span>
                    ) : (
                      <span className="text-[14px] text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
