'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import { BarChart3, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { PageSection } from '@/components/layout/page-section'
import { StatCard } from '@/components/ui/stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Gauge, TrendingUp, TrendingDown, CalendarCheck, Users } from 'lucide-react'
import {
  chartTooltipContentStyle, chartTooltipWrapperStyle, chartLegendFormatter,
  truncateLabel,
} from '@/components/dashboard/chart-helpers'
import {
  getRecorteEtapa,
  type PanoramaRendimento, type RecortePanorama,
} from '@/lib/actions/rendimento'
import { fmtMedia, fmtPct, fmtInt, CORES_EVOLUCAO } from './format'
import { toast } from 'sonner'

type Props = {
  panorama: PanoramaRendimento | null
  periodo: number | null
  loading: boolean
  escolaId: string
  anoId: string
  pessoaId: string | null
}

export default function AbaGeralPeriodo({ panorama, periodo, loading, escolaId, anoId, pessoaId }: Props) {
  const [discEvolucao, setDiscEvolucao] = useState('todas')
  const [periodoEv, setPeriodoEv] = useState<number | null>(null)
  const [etapaEv, setEtapaEv] = useState('todas')
  const [dadosEv, setDadosEv] = useState<RecortePanorama | null>(null)
  const [loadingEv, setLoadingEv] = useState(false)
  const [periodoDist, setPeriodoDist] = useState<number>(1)
  const [discDist, setDiscDist] = useState('todas')
  const [etapaDist, setEtapaDist] = useState('todas')
  const [dadosDist, setDadosDist] = useState<RecortePanorama | null>(null)
  const [loadingDist, setLoadingDist] = useState(false)

  const ordens = panorama?.porPeriodo || []
  const anoRecorte = panorama?.recortes.find(r => r.periodoOrdem === null)
  const etapasOpcoes = (anoRecorte?.porEtapa || []).map(e => ({
    id: e.etapaId || 'sem-etapa', nome: e.nome,
  }))

  useEffect(() => {
    setDiscEvolucao('todas')
    setPeriodoEv(null)
    setEtapaEv('todas')
    setDadosEv(null)
    setDiscDist('todas')
    setEtapaDist('todas')
    setDadosDist(null)
    setPeriodoDist(periodo ?? ordens[0]?.ordem ?? 1)
  }, [panorama]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (periodo !== null) setPeriodoDist(periodo)
  }, [periodo])

  const buscarEtapa = useCallback(async (
    etapaId: string,
    periodoOrdem: number | null,
    setDados: (r: RecortePanorama | null) => void,
    setLoading: (v: boolean) => void
  ) => {
    if (etapaId === 'todas' || !escolaId || !anoId) {
      setDados(null)
      return
    }
    setLoading(true)
    try {
      const data = await getRecorteEtapa({ schoolId: escolaId, anoLetivoId: anoId, etapaId, periodoOrdem }, pessoaId)
      setDados(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao filtrar por etapa')
      setDados(null)
    } finally {
      setLoading(false)
    }
  }, [escolaId, anoId, pessoaId])

  useEffect(() => {
    buscarEtapa(etapaEv, null, setDadosEv, setLoadingEv)
  }, [etapaEv, escolaId, anoId, buscarEtapa])

  useEffect(() => {
    buscarEtapa(etapaDist, periodoDist, setDadosDist, setLoadingDist)
  }, [etapaDist, periodoDist, escolaId, anoId, buscarEtapa])

  if (loading && !panorama) {
    return <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
  }
  const recorteGlobal = panorama?.recortes.find(r => r.periodoOrdem === periodo)
    || panorama?.recortes.find(r => r.periodoOrdem !== null)
  if (!panorama || !recorteGlobal || recorteGlobal.kpis.totalAvaliados === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Sem avaliações lançadas"
        description="Não há notas lançadas para o período selecionado."
      />
    )
  }
  const k = recorteGlobal.kpis

  // Evolução: fonte = panorama (todas) ou recorte da etapa
  const fonteEv = etapaEv === 'todas' ? anoRecorte : dadosEv
  const discsEvolucao = fonteEv?.porDisciplina || []
  const discEv = discEvolucao === 'todas'
    ? null
    : discsEvolucao.find(d => d.disciplinaId === discEvolucao) || null
  const discsVisiveis = discEv ? [discEv] : discsEvolucao
  const etapaEvNome = etapaEv === 'todas' ? null : (etapasOpcoes.find(e => e.id === etapaEv)?.nome || null)
  const chartData = panorama.porPeriodo
    .filter(p => periodoEv === null || p.ordem === periodoEv)
    .map(p => {
      const row: Record<string, string | number | null> = { nome: p.nome }
      for (const d of discsEvolucao) row[d.disciplinaId] = d.evolucao[p.ordem - 1] ?? null
      return row
    })
    .filter(r => discsVisiveis.some(d => (r[d.disciplinaId] as number | null) !== null))

  // Distribuição: fonte = panorama (todas) ou recorte da etapa no período
  const recorteDistBase = etapaDist === 'todas'
    ? (panorama.recortes.find(r => r.periodoOrdem === periodoDist)
      || panorama.recortes.find(r => r.periodoOrdem !== null)!)
    : dadosDist
  const discD = recorteDistBase && discDist !== 'todas'
    ? (recorteDistBase.porDisciplina.find(d => d.disciplinaId === discDist) || null)
    : null
  const distribuicao = discD ? discD.distribuicao : (recorteDistBase?.distribuicao || [])
  const periodoDistNome = panorama.porPeriodo.find(p => p.ordem === periodoDist)?.nome || `Período ${periodoDist}`
  const etapaDistNome = etapaDist === 'todas' ? null : (etapasOpcoes.find(e => e.id === etapaDist)?.nome || null)
  const contextoDist = `${periodoDistNome}${etapaDistNome ? ` · ${etapaDistNome}` : ''}${discD ? ` · ${discD.nome}` : ''}`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Gauge} value={fmtMedia(k.mediaGeral)} label="Média geral" />
        <StatCard icon={TrendingUp} variant="success" value={fmtPct(k.pctAcima)} label="Acima da média" />
        <StatCard icon={TrendingDown} variant="destructive" value={fmtPct(k.pctAbaixo)} label="Abaixo da média" />
        <StatCard icon={CalendarCheck} variant="warning" value={fmtPct(k.pctFreqAbaixo)} label="Freq. abaixo do mínimo" />
        <StatCard icon={Users} value={fmtInt(k.totalAvaliados)} label="Alunos avaliados" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução da média por período{discEv ? ` · ${discEv.nome}` : ''}</CardTitle>
          <CardDescription>
            Cada linha mostra a média dos alunos avaliados em uma disciplina ao
            longo dos períodos avaliativos do ano letivo
            {etapaEvNome ? ` na etapa ${etapaEvNome}` : ''}
            {discEv ? ` (destacando ${discEv.nome})` : ''}. Passe o mouse sobre
            os pontos para ver a média de cada disciplina no período.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Etapa</Label>
              <Select value={etapaEv} onValueChange={(v) => { setEtapaEv(v); setDiscEvolucao('todas') }}>
                <SelectTrigger><SelectValue placeholder="Todas as etapas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Etapas</SelectItem>
                  {etapasOpcoes.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Períodos</Label>
              <Select
                value={periodoEv === null ? 'todos' : String(periodoEv)}
                onValueChange={(v) => setPeriodoEv(v === 'todos' ? null : Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Todos os períodos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  {panorama.porPeriodo.map(p => (
                    <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Disciplina</Label>
              <Select value={discEvolucao} onValueChange={setDiscEvolucao}>
                <SelectTrigger><SelectValue placeholder="Todas as disciplinas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as disciplinas</SelectItem>
                  {discsEvolucao.map(d => (
                    <SelectItem key={d.disciplinaId} value={d.disciplinaId}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {loadingEv ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[14px]">Carregando etapa...</span>
            </div>
          ) : chartData.length === 0 ? (
            <EmptyState icon={BarChart3} title="Sem dados" description="Nenhum período com média calculada para os filtros." />
          ) : (
            <div className="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                    tickFormatter={(v) => truncateLabel(String(v), 12)}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={chartTooltipContentStyle}
                    wrapperStyle={chartTooltipWrapperStyle}
                    formatter={((value: unknown, name: unknown) => [fmtMedia(Number(value)), String(name)]) as never}
                  />
                  <Legend formatter={chartLegendFormatter} />
                  {discsVisiveis.map((d, i) => (
                    <Line
                      key={d.disciplinaId}
                      type="monotone"
                      dataKey={d.disciplinaId}
                      name={d.nome}
                      stroke={CORES_EVOLUCAO[i % CORES_EVOLUCAO.length]}
                      strokeDasharray={i >= CORES_EVOLUCAO.length ? '6 3' : undefined}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <PageSection
        variant="default"
        title={`Distribuição do rendimento${discD ? ` · ${discD.nome}` : ''}`}
        description={`Alunos avaliados distribuídos por faixa de média no período em análise (${contextoDist}). Mostra quantos alunos estão em cada faixa de nota e o percentual sobre o total de avaliados.`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mb-4">
          <div className="space-y-2">
            <Label>Etapa</Label>
            <Select value={etapaDist} onValueChange={(v) => { setEtapaDist(v); setDiscDist('todas') }}>
              <SelectTrigger><SelectValue placeholder="Todas as etapas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Etapas</SelectItem>
                {etapasOpcoes.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={String(periodoDist)} onValueChange={(v) => setPeriodoDist(Number(v))}>
              <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
              <SelectContent>
                {panorama.porPeriodo.map(p => (
                  <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select value={discDist} onValueChange={setDiscDist}>
              <SelectTrigger><SelectValue placeholder="Todas as disciplinas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as disciplinas</SelectItem>
                {(recorteDistBase?.porDisciplina || []).map(d => (
                  <SelectItem key={d.disciplinaId} value={d.disciplinaId}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {loadingDist ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[14px]">Carregando etapa...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted z-10">Faixa de nota</TableHead>
                  <TableHead className="text-right">Alunos</TableHead>
                  <TableHead className="text-right">Percentual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distribuicao.map(d => (
                  <TableRow key={d.faixa}>
                    <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{d.faixa}</TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">{fmtInt(d.quantidade)}</TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">{fmtPct(d.percentual)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </PageSection>
    </div>
  )
}
