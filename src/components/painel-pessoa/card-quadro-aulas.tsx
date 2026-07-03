'use client'

import { useState, useEffect } from 'react'
import { getQuadroAulas, type QuadroAulaItem } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Calendar, Loader2 } from 'lucide-react'

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
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" />Quadro de Aulas</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  if (aulas.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-info" />
            Quadro de Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum quadro de aulas configurado para esta turma.</p>
        </CardContent>
      </Card>
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
<Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-info" />
            Quadro de Aulas
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <Table className="border border-border rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-muted z-10 text-xs uppercase tracking-wider">Horário</TableHead>
              {diasUteis.map(dia => (
                <TableHead key={dia} className="text-center text-xs uppercase tracking-wider min-w-[100px]">
                  {DIAS_SEMANA_LABEL[dia]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {horarios.map(horario => (
              <TableRow key={horario}>
                <TableCell className="sticky left-0 bg-card z-10 text-xs text-muted-foreground font-mono whitespace-nowrap">
                  {horario}
                </TableCell>
                {diasUteis.map(dia => {
                  const nome = mapa.get(`${dia}|${horario}`)
                  return (
                    <TableCell key={dia} className="text-center text-sm">
                      {nome ? (
                        <span className="font-medium text-foreground">{nome}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}