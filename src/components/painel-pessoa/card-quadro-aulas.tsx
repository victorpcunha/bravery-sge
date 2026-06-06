'use client'

import { useState, useEffect } from 'react'
import { getQuadroAulas, type QuadroAulaItem } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
            <Calendar className="h-4 w-4 text-blue-500" />
            Quadro de Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum quadro de aulas configurado para esta turma.</p>
        </CardContent>
      </Card>
    )
  }

  // Extrair horários únicos ordenados
  const horariosSet = new Set<string>()
  for (const a of aulas) {
    horariosSet.add(`${a.horario_inicial} - ${a.horario_final}`)
  }
  const horarios = [...horariosSet].sort()

  // Montar lookup: dia_semana + horario -> disciplina_nome
  const mapa = new Map<string, string>()
  for (const a of aulas) {
    const key = `${a.dia_semana}|${a.horario_inicial} - ${a.horario_final}`
    mapa.set(key, a.disciplina_nome)
  }

  const diasUteis = [1, 2, 3, 4, 5]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          Quadro de Aulas
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground pr-3 pb-2 border-b border-border sticky left-0 bg-card">Horário</th>
              {diasUteis.map(dia => (
                <th key={dia} className="text-center text-xs font-medium text-muted-foreground pb-2 border-b border-border min-w-[100px]">
                  {DIAS_SEMANA_LABEL[dia]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map(horario => (
              <tr key={horario}>
                <td className="text-xs text-muted-foreground font-mono pr-3 py-2 border-b border-border sticky left-0 bg-card whitespace-nowrap">
                  {horario}
                </td>
                {diasUteis.map(dia => {
                  const nome = mapa.get(`${dia}|${horario}`)
                  return (
                    <td key={dia} className="text-center py-2 border-b border-border text-sm">
                      {nome ? (
                        <span className="font-medium text-foreground">{nome}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
