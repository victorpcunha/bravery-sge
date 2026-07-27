'use client'

import { useState, useEffect } from 'react'
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

export default function CardEvolucao({ pessoaId, turmaId, pessoaLogadaId }: Props) {
  const [periodos, setPeriodos] = useState<PeriodoAvaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<Array<{ periodo: string; aluno: number | null; turma: number | null }>>([])
  const [compararTurma, setCompararTurma] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPeriodosAvaliacao(turmaId, pessoaLogadaId)
      .then(async per => {
        setPeriodos(per)
        if (per.length === 0) return

        const results = await Promise.all(
          per.map(p => getDesempenhoComparativo(pessoaId, turmaId, p.numero, pessoaLogadaId).catch(() => null))
        )

        const data = per.map((p, idx) => {
          const comp = results[idx] as DesempenhoComparativo | null
          const discAluno = (comp?.disciplinas || []).map(d => d.aluno_nota).filter(n => n != null) as number[]
          const discTurma = (comp?.disciplinas || []).map(d => d.turma_media).filter(n => n != null) as number[]

          return {
            periodo: p.label,
            aluno: discAluno.length > 0 ? Math.round((discAluno.reduce((a, b) => a + b, 0) / discAluno.length) * 100) / 100 : null,
            turma: discTurma.length > 0 ? Math.round((discTurma.reduce((a, b) => a + b, 0) / discTurma.length) * 100) / 100 : null,
          }
        })

        setChartData(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pessoaId, turmaId, pessoaLogadaId])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Evolução do Aluno
          </CardTitle>
          <Select value={compararTurma ? 'comparar' : 'geral'} onValueChange={v => setCompararTurma(v === 'comparar')}>
            <SelectTrigger size="sm" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Média Geral</SelectItem>
              <SelectItem value="comparar">Comparar com a turma</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        ) : chartData.length === 0 ? (
          <p className="text-[14px] text-muted-foreground text-center py-12">
            Nenhum dado de evolução disponível.
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
