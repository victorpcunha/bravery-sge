'use client'

import { useState, useEffect, useMemo } from 'react'
import { getPeriodosAvaliacao, getDesempenhoComparativo, type PeriodoAvaliacao, type DesempenhoComparativo } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  turmaId: string
  pessoaLogadaId: string | null
}

const TODAS_DISCIPLINAS = 'todas'

export default function CardEvolucao({ pessoaId, turmaId, pessoaLogadaId }: Props) {
  const [periodos, setPeriodos] = useState<PeriodoAvaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [comparativos, setComparativos] = useState<Array<DesempenhoComparativo | null>>([])
  const [compararTurma, setCompararTurma] = useState(false)
  const [disciplinaId, setDisciplinaId] = useState<string>(TODAS_DISCIPLINAS)

  useEffect(() => {
    setLoading(true)
    setDisciplinaId(TODAS_DISCIPLINAS)
    getPeriodosAvaliacao(turmaId, pessoaLogadaId)
      .then(async per => {
        setPeriodos(per)
        if (per.length === 0) {
          setComparativos([])
          return
        }

        const results = await Promise.all(
          per.map(p => getDesempenhoComparativo(pessoaId, turmaId, p.numero, pessoaLogadaId).catch(() => null))
        )

        setComparativos(results)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pessoaId, turmaId, pessoaLogadaId])

  const disciplinas = useMemo(() => {
    const map = new Map<string, string>()
    for (const comp of comparativos) {
      for (const d of comp?.disciplinas || []) {
        if (!map.has(d.disciplina_id)) map.set(d.disciplina_id, d.disciplina_nome)
      }
    }
    return [...map.entries()]
      .map(([id, nome]) => ({ id, nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [comparativos])

  const chartData = useMemo(() => {
    return periodos.map((p, idx) => {
      const comp = comparativos[idx]
      const lista = comp?.disciplinas || []
      const alvo = disciplinaId === TODAS_DISCIPLINAS ? lista : lista.filter(d => d.disciplina_id === disciplinaId)
      const discAluno = alvo.map(d => d.aluno_nota).filter(n => n != null) as number[]
      const discTurma = alvo.map(d => d.turma_media).filter(n => n != null) as number[]

      return {
        periodo: p.label,
        aluno: discAluno.length > 0 ? Math.round((discAluno.reduce((a, b) => a + b, 0) / discAluno.length) * 100) / 100 : null,
        turma: discTurma.length > 0 ? Math.round((discTurma.reduce((a, b) => a + b, 0) / discTurma.length) * 100) / 100 : null,
      }
    })
  }, [periodos, comparativos, disciplinaId])

  const temDados = chartData.some(d => d.aluno != null || d.turma != null)

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Evolução do Aluno
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {disciplinas.length > 1 && (
              <Select value={disciplinaId} onValueChange={setDisciplinaId}>
                <SelectTrigger size="sm" className="w-[200px] shrink-0" aria-label="Filtrar por disciplina">
                  <SelectValue placeholder="Disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODAS_DISCIPLINAS}>Todas as disciplinas</SelectItem>
                  {disciplinas.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={compararTurma ? 'comparar' : 'geral'} onValueChange={v => setCompararTurma(v === 'comparar')}>
              <SelectTrigger size="sm" className="w-[220px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Média Geral</SelectItem>
                <SelectItem value="comparar">Comparar com a turma</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        ) : chartData.length === 0 || !temDados ? (
          <p className="text-[14px] text-muted-foreground text-center py-12">
            {disciplinaId === TODAS_DISCIPLINAS
              ? 'Nenhum dado de evolução disponível.'
              : 'Nenhuma nota lançada para esta disciplina nos períodos avaliados.'}
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)' }}
                  formatter={(value: unknown) => Number(value).toFixed(2)}
                />
                {compararTurma && <Legend fontSize={12} />}
                <Line
                  type="monotone"
                  dataKey="aluno"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Aluno"
                />
                {compararTurma && (
                  <Line
                    type="monotone"
                    dataKey="turma"
                    stroke="var(--muted-foreground)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Média da Turma"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
