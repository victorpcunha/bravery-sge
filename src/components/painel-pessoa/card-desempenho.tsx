'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getFrequenciaGeral,
  getFrequenciaPorDisciplina,
  getPeriodosAvaliacao,
  getDesempenhoComparativo,
  getCriterioFrequenciaTurma,
  type FrequenciaGeral,
  type FrequenciaPorDisciplina,
  type PeriodoAvaliacao,
  type DesempenhoComparativo,
} from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import GraficoDesempenho from './grafico-desempenho'
import { BarChart3, Loader2, ClipboardCheck } from 'lucide-react'

type Props = {
  pessoaId: string
  turmaId: string
  pessoaLogadaId: string | null
}

export default function CardDesempenho({ pessoaId, turmaId, pessoaLogadaId }: Props) {
  const [criterio, setCriterio] = useState<string | null>(null)
  const [freqGeral, setFreqGeral] = useState<FrequenciaGeral | null>(null)
  const [freqDisc, setFreqDisc] = useState<FrequenciaPorDisciplina[]>([])
  const [periodos, setPeriodos] = useState<PeriodoAvaliacao[]>([])
  const [periodo, setPeriodo] = useState<string>('')
  const [desempenho, setDesempenho] = useState<DesempenhoComparativo | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingGrafico, setLoadingGrafico] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCriterioFrequenciaTurma(turmaId, pessoaLogadaId),
      getPeriodosAvaliacao(turmaId, pessoaLogadaId),
    ]).then(([crit, per]) => {
      setCriterio(crit)
      setPeriodos(per)
      if (per.length > 0) setPeriodo(String(per[0].numero))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [turmaId, pessoaLogadaId])

  useEffect(() => {
    if (!criterio) return
    if (criterio === 'por_dia') {
      getFrequenciaGeral(pessoaId, turmaId, pessoaLogadaId).then(setFreqGeral).catch(() => {})
    } else {
      getFrequenciaPorDisciplina(pessoaId, turmaId, pessoaLogadaId).then(setFreqDisc).catch(() => {})
    }
  }, [criterio, pessoaId, turmaId, pessoaLogadaId])

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

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4" />Desempenho</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-500" />
          Desempenho
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Frequência */}
        {criterio && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
              <ClipboardCheck className="h-3 w-3" />
              Frequência
            </h4>
            {criterio === 'por_dia' && freqGeral && (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">{freqGeral.percentual}%</span>
                <span className="text-xs text-muted-foreground">
                  ({freqGeral.presencas} de {freqGeral.total} dias)
                </span>
              </div>
            )}
            {criterio === 'por_dia' && !freqGeral && (
              <p className="text-sm text-muted-foreground">Nenhum registro de frequência.</p>
            )}
            {criterio === 'por_aula' && freqDisc.length > 0 && (
              <div className="space-y-1">
                {freqDisc.map(f => (
                  <div key={f.disciplina_id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{f.disciplina_nome}</span>
                    <span className="font-medium">{f.percentual}%</span>
                  </div>
                ))}
              </div>
            )}
            {criterio === 'por_aula' && freqDisc.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum registro de frequência.</p>
            )}
          </div>
        )}

        {/* Gráfico Comparativo */}
        {periodos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Desempenho Comparativo
              </h4>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-[130px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(p => (
                    <SelectItem key={p.numero} value={String(p.numero)}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <GraficoDesempenho data={desempenho} loading={loadingGrafico} />
          </div>
        )}

        {!criterio && periodos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum método de avaliação configurado para esta turma.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
