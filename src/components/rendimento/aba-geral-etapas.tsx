'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import { Layers, TrendingUp, TrendingDown, Minus, BarChart3, ChevronDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import {
  chartTooltipContentStyle, chartTooltipWrapperStyle, chartLegendFormatter, truncateLabel,
} from '@/components/dashboard/chart-helpers'
import type { PanoramaRendimento, EtapaPanorama } from '@/lib/actions/rendimento'
import { fmtMedia, fmtPct, fmtInt, fmtEvolucao, CORES_EVOLUCAO } from './format'

type Props = {
  panorama: PanoramaRendimento | null
  periodoInicial: number | null
  loading: boolean
}

type Metricas = {
  avaliados: number
  media: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  acima: number
  abaixo: number
  freqMedia: number | null
  evolucao: number | null
}

const idEtapa = (e: { etapaId: string | null }) => e.etapaId || 'sem-etapa'

type OpcaoEtapa = { id: string; nome: string }

function EtapaMultiSelect({
  opcoes, selecionadas, onChange,
}: {
  opcoes: OpcaoEtapa[]
  selecionadas: string[]
  onChange: (ids: string[]) => void
}) {
  const [aberto, setAberto] = useState(false)
  const rotulo = selecionadas.length === 0
    ? 'Nenhuma selecionada'
    : selecionadas.length === opcoes.length
      ? 'Todas as Etapas'
      : `${selecionadas.length} ${selecionadas.length === 1 ? 'etapa' : 'etapas'}`
  const alternar = (id: string) => {
    onChange(selecionadas.includes(id) ? selecionadas.filter(x => x !== id) : [...selecionadas, id])
  }
  return (
    <Popover open={aberto} onOpenChange={setAberto}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal" aria-label="Etapas de ensino">
          <span className="truncate">{rotulo}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="flex gap-2 p-1">
          <Button
            variant="outline" size="sm" className="h-8 flex-1"
            onClick={() => onChange(opcoes.map(o => o.id))}
          >
            Selecionar todas
          </Button>
          <Button variant="ghost" size="sm" className="h-8 flex-1" onClick={() => onChange([])}>
            Limpar
          </Button>
        </div>
        <div className="max-h-56 overflow-y-auto py-1">
          {opcoes.map(o => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-[14px] text-foreground hover:bg-accent/10"
            >
              <Checkbox
                checked={selecionadas.includes(o.id)}
                onCheckedChange={() => alternar(o.id)}
                aria-label={o.nome}
              />
              <span className="truncate">{o.nome}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function AbaGeralEtapas({ panorama, periodoInicial, loading }: Props) {
  const [etapas, setEtapas] = useState<string[]>([])
  const [periodo, setPeriodo] = useState<number | null>(null)
  const [disciplina, setDisciplina] = useState('todas')

  useEffect(() => {
    const base = panorama?.recortes.find(r => r.periodoOrdem === null) || panorama?.recortes[0]
    setEtapas((base?.porEtapa || []).map(e => idEtapa(e)))
    setDisciplina('todas')
    setPeriodo(periodoInicial ?? panorama?.porPeriodo[0]?.ordem ?? null)
  }, [panorama]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !panorama) {
    return <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
  }
  const recorte = panorama?.recortes.find(r => r.periodoOrdem === periodo)
    || panorama?.recortes.find(r => r.periodoOrdem !== null)
  if (!panorama || !recorte || recorte.porEtapa.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="Sem dados por etapa"
        description="Não há etapas com avaliações lançadas no período selecionado."
      />
    )
  }

  const disciplinasOpcoes = [...new Map(
    recorte.porEtapa.flatMap(e => e.porDisciplina).map(d => [d.disciplinaId, d.nome])
  ).entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))

  const etapasVisiveis = recorte.porEtapa.filter(e => etapas.includes(idEtapa(e)))

  const metricasDe = (e: EtapaPanorama): (Metricas & { semDados: boolean }) => {
    if (disciplina === 'todas') {
      return { ...e, semDados: false }
    }
    const d = e.porDisciplina.find(x => x.disciplinaId === disciplina)
    if (!d || d.avaliados === 0) {
      return { avaliados: 0, media: null, pctAcima: null, pctAbaixo: null, acima: 0, abaixo: 0, freqMedia: null, evolucao: null, semDados: true }
    }
    return { ...d, semDados: false }
  }

  const comDados = etapasVisiveis
    .map(e => ({ etapa: e, m: metricasDe(e) }))
    .filter(x => !x.m.semDados)

  const periodoNome = periodo !== null
    ? (panorama.porPeriodo.find(p => p.ordem === periodo)?.nome || `Período ${periodo}`)
    : 'Ano letivo completo'
  const discNome = disciplina === 'todas'
    ? null
    : (disciplinasOpcoes.find(([id]) => id === disciplina)?.[1] || null)
  const contexto = `${periodoNome}${discNome ? ` · ${discNome}` : ''}`

  // Disciplinas da legenda (ordem alfabética global — cores estáveis entre gráficos)
  const discsLegenda = disciplina === 'todas'
    ? disciplinasOpcoes.map(([id, nome]) => ({ id, nome }))
    : disciplinasOpcoes.filter(([id]) => id === disciplina).map(([id, nome]) => ({ id, nome }))
  const corDisciplina = (id: string) => {
    const idx = disciplinasOpcoes.findIndex(([d]) => d === id)
    return CORES_EVOLUCAO[(idx >= 0 ? idx : 0) % CORES_EVOLUCAO.length]
  }
  const mediasPorEtapaDisc = (etapaId: string | null, discId: string): number | null => {
    const e = recorte.porEtapa.find(x => (x.etapaId || 'sem-etapa') === (etapaId || 'sem-etapa'))
    const d = e?.porDisciplina.find(x => x.disciplinaId === discId)
    return d && d.avaliados > 0 ? d.media : null
  }
  const chartData = comDados.map(({ etapa: e }) => {
    const row: Record<string, string | number | null> = { nome: e.nome }
    for (const d of discsLegenda) row[d.id] = mediasPorEtapaDisc(e.etapaId, d.id)
    return row
  }).filter(r => discsLegenda.some(d => (r[d.id] as number | null) !== null))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Etapa</Label>
          <EtapaMultiSelect
            opcoes={recorte.porEtapa.map(e => ({ id: idEtapa(e), nome: e.nome }))}
            selecionadas={etapas}
            onChange={setEtapas}
          />
        </div>
        <div className="space-y-2">
          <Label>Período</Label>
          <Select
            value={periodo === null ? '' : String(periodo)}
            onValueChange={(v) => setPeriodo(Number(v))}
          >
            <SelectTrigger><SelectValue placeholder="Selecione o período" /></SelectTrigger>
            <SelectContent>
              {panorama.porPeriodo.map(p => (
                <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Disciplina</Label>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger><SelectValue placeholder="Todas as disciplinas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as disciplinas</SelectItem>
              {disciplinasOpcoes.map(([id, nome]) => (
                <SelectItem key={id} value={id}>{nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {etapas.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Nenhuma etapa selecionada"
          description="Marque ao menos uma etapa para comparar o rendimento."
        />
      ) : comDados.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Sem dados para os filtros"
          description="Nenhuma etapa com avaliações na disciplina e no período selecionados."
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Média por etapa e disciplina</CardTitle>
              <CardDescription>
                Média dos alunos avaliados por disciplina em cada etapa, em {contexto}.
                Cada grupo de barras representa uma etapa; cada barra, a média de uma disciplina.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <EmptyState icon={BarChart3} title="Sem dados" description="Nenhuma etapa com média calculada." />
              ) : (
                <div className="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                      barCategoryGap="20%"
                      barGap={2}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis
                        type="number"
                        domain={[0, 10]}
                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                        axisLine={{ stroke: 'var(--border)' }}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="nome"
                        tick={{ fontSize: 12, fill: 'var(--foreground)' }}
                        axisLine={false}
                        tickLine={false}
                        width={110}
                        tickFormatter={(v) => truncateLabel(String(v), 14)}
                      />
                      <Tooltip
                        contentStyle={chartTooltipContentStyle}
                        wrapperStyle={chartTooltipWrapperStyle}
                        formatter={((value: unknown, name: unknown) => [fmtMedia(Number(value)), String(name)]) as never}
                      />
                      <Legend formatter={chartLegendFormatter} />
                      {discsLegenda.map(d => (
                        <Bar key={d.id} dataKey={d.id} name={d.nome} fill={corDisciplina(d.id)} radius={[0, 4, 4, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {comDados.map(({ etapa: e, m }) => (
              <Card key={e.etapaId || 'sem-etapa'}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[20px] font-semibold leading-snug text-foreground">{e.nome}</h4>
                    {m.evolucao !== null && m.evolucao !== undefined ? (
                      <StatusBadge status={m.evolucao > 0 ? 'success' : m.evolucao < 0 ? 'destructive' : 'muted'}>
                        <span className="flex items-center gap-1">
                          {m.evolucao > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : m.evolucao < 0 ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                          {fmtEvolucao(m.evolucao)}
                        </span>
                      </StatusBadge>
                    ) : (
                      <StatusBadge status="muted">Sem período anterior</StatusBadge>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] text-muted-foreground">Média</p>
                    <p className="text-[36px] font-bold leading-none text-foreground tabular-nums">
                      {fmtMedia(m.media)}
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
                    <div>
                      <dt className="text-muted-foreground">Avaliados</dt>
                      <dd className="font-medium text-foreground tabular-nums">{fmtInt(m.avaliados)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Freq. média</dt>
                      <dd className="font-medium text-foreground tabular-nums">{fmtPct(m.freqMedia)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Acima da média</dt>
                      <dd className="font-medium tabular-nums">
                        <span className="text-success">{fmtPct(m.pctAcima)}</span>{' '}
                        <span className="text-[13px] text-muted-foreground">· {fmtInt(m.acima)} {m.acima === 1 ? 'aluno' : 'alunos'}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Abaixo da média</dt>
                      <dd className="font-medium tabular-nums">
                        <span className="text-destructive">{fmtPct(m.pctAbaixo)}</span>{' '}
                        <span className="text-[13px] text-muted-foreground">· {fmtInt(m.abaixo)} {m.abaixo === 1 ? 'aluno' : 'alunos'}</span>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
