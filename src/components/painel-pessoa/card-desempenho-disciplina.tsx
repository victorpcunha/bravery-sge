'use client'

import { useState, useEffect, useCallback } from 'react'
import { getPeriodosAvaliacao, getDesempenhoComparativo, type PeriodoAvaliacao, type DesempenhoComparativo } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  turmaId: string
  pessoaLogadaId: string | null
}

const CORES_DISCIPLINAS = ['#0F2B46', '#2E8BA3', '#4FC3D7', '#1A7F37', '#9A6700', '#8B5CF6', '#CF222E', '#457B9D']

export default function CardDesempenhoDisciplina({ pessoaId, turmaId, pessoaLogadaId }: Props) {
  const [periodos, setPeriodos] = useState<PeriodoAvaliacao[]>([])
  const [periodo, setPeriodo] = useState<string>('')
  const [desempenho, setDesempenho] = useState<DesempenhoComparativo | null>(null)
  const [loadingPeriodos, setLoadingPeriodos] = useState(true)
  const [loadingGrafico, setLoadingGrafico] = useState(false)

  useEffect(() => {
    setLoadingPeriodos(true)
    getPeriodosAvaliacao(turmaId, pessoaLogadaId)
      .then(per => {
        setPeriodos(per)
        if (per.length > 0) setPeriodo(String(per[0].numero))
      })
      .catch(() => {})
      .finally(() => setLoadingPeriodos(false))
  }, [turmaId, pessoaLogadaId])

  const carregarGrafico = useCallback(async (p: string) => {
    if (!p) return
    setLoadingGrafico(true)
    try {
      const data = await getDesempenhoComparativo(pessoaId, turmaId, Number(p), pessoaLogadaId)
      setDesempenho(data)
    } catch {
      setDesempenho(null)
    } finally {
      setLoadingGrafico(false)
    }
  }, [pessoaId, turmaId, pessoaLogadaId])

  useEffect(() => {
    if (periodo) carregarGrafico(periodo)
  }, [periodo, carregarGrafico])

  const chartData = (desempenho?.disciplinas || []).map((d, i) => ({
    name: d.disciplina_nome.length > 12 ? d.disciplina_nome.slice(0, 12) + '…' : d.disciplina_nome,
    nota: d.aluno_nota ?? 0,
    fill: CORES_DISCIPLINAS[i % CORES_DISCIPLINAS.length],
  }))

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            Desempenho por Disciplina
          </CardTitle>
          {periodos.length > 0 && (
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodos.map(p => (
                  <SelectItem key={p.numero} value={String(p.numero)}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loadingPeriodos || loadingGrafico ? (
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        ) : chartData.length === 0 ? (
          <p className="text-[14px] text-muted-foreground text-center py-12">
            Nenhum dado de desempenho disponível para este período.
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--border)' }}
                  formatter={(value: unknown) => [Number(value).toFixed(2), 'Nota']}
                />
                <Bar dataKey="nota" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
