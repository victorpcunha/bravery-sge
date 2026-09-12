'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts'
import { GraduationCap, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  chartTooltipContentStyle, chartTooltipWrapperStyle, chartLegendFormatter,
  colorPorIndice, truncateLabel,
} from '@/components/dashboard/chart-helpers'
import { variantSituacaoMatricula } from '@/lib/situacoes-matricula'
import {
  getSituacaoFinal, getCruzamentoRendimento,
  type SituacaoFinalPanorama,
} from '@/lib/actions/rendimento'
import { fmtPct, fmtInt } from './format'
import { toast } from 'sonner'

type Props = {
  ativo: boolean
  escolaId: string
  anoId: string
  pessoaId: string | null
}

type Cruzamento = { ordens: { ordem: number; nome: string }[]; alunos: { alunoId: string; nome: string; turmaNome: string; medias: (number | null)[] }[] }

export default function AbaSituacaoFinal({ ativo, escolaId, anoId, pessoaId }: Props) {
  const [dados, setDados] = useState<SituacaoFinalPanorama | null>(null)
  const [loading, setLoading] = useState(false)
  const [carregado, setCarregado] = useState(false)
  const [recorte, setRecorte] = useState('')
  const [cruz, setCruz] = useState<Cruzamento | null>(null)
  const [loadingCruz, setLoadingCruz] = useState(false)

  const carregar = useCallback(async () => {
    if (!escolaId || !anoId) return
    setLoading(true)
    try {
      const data = await getSituacaoFinal(escolaId, anoId, pessoaId)
      setDados(data)
      setCarregado(true)
      const padrao = data.situacoes.includes('Reprovado') ? 'Reprovado' : (data.situacoes[0] || '')
      setRecorte(padrao)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar situação final')
    } finally {
      setLoading(false)
    }
  }, [escolaId, anoId, pessoaId])

  useEffect(() => {
    if (ativo && !carregado && !loading) carregar()
  }, [ativo, carregado, loading, carregar])

  useEffect(() => {
    setCarregado(false)
    setDados(null)
    setCruz(null)
    setRecorte('')
  }, [escolaId, anoId])

  useEffect(() => {
    if (!recorte || !escolaId || !anoId) {
      setCruz(null)
      return
    }
    setLoadingCruz(true)
    getCruzamentoRendimento({ schoolId: escolaId, anoLetivoId: anoId, situacaoDb: recorte }, pessoaId)
      .then(setCruz)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Erro ao cruzar rendimento'))
      .finally(() => setLoadingCruz(false))
  }, [recorte, escolaId, anoId, pessoaId])

  if (!ativo && !carregado) return null
  if (loading && !dados) {
    return <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
  }
  if (!dados) return null

  if (dados.vazio) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={GraduationCap}
          title="Nenhuma turma fechada"
          description="A situação final depende do Fechamento de Turma. Ainda não há turmas fechadas neste ano letivo."
        />
        {dados.turmasNaoFechadas.length > 0 && (
          <div className="rounded-lg border border-warning/20 bg-warning/10 px-4 py-3 text-[14px] text-warning">
            Turmas ainda não fechadas: {dados.turmasNaoFechadas.map(t => t.turmaNome).join(', ')}
          </div>
        )}
      </div>
    )
  }

  const chartData = (cruz?.ordens || []).map(o => {
    const row: Record<string, string | number | null> = { nome: o.nome }
    for (const a of cruz?.alunos || []) row[a.alunoId] = a.medias[o.ordem - 1] ?? null
    return row
  })

  return (
    <div className="space-y-6">
      {dados.turmasNaoFechadas.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/10 px-4 py-3 text-[14px] text-warning">
          <TriangleAlert className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Resultados consideram apenas turmas fechadas. Ainda não fechadas: {dados.turmasNaoFechadas.map(t => t.turmaNome).join(', ')}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-live="polite">
        {dados.blocos.map(b => (
          <Card key={b.situacaoDb}>
            <CardContent className="pt-5 space-y-2">
              <StatusBadge status={variantSituacaoMatricula(b.situacaoDb)}>{b.rotulo}</StatusBadge>
              <p className="text-[28px] font-bold leading-none text-foreground tabular-nums">{fmtInt(b.quantidade)}</p>
              <p className="text-[14px] font-medium text-muted-foreground">{fmtPct(b.percentual)} dos alunos</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-[16px] font-semibold text-foreground mb-2">Situação Final por Turma</h3>
        <ul className="space-y-3 md:hidden">
          {dados.porTurma.map(t => (
            <li key={t.turmaId} className="rounded-lg border border-border bg-card p-4 shadow-xs">
              <p className="font-medium text-foreground">{t.turmaNome}</p>
              <dl className="mt-2 space-y-1">
                {dados.situacoes.filter(s => (t.valores[s] || 0) > 0).map(s => (
                  <div key={s} className="flex items-center justify-between text-[14px]">
                    <dt className="text-muted-foreground">{s}</dt>
                    <dd className="font-semibold text-foreground tabular-nums">{fmtInt(t.valores[s])}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-muted z-10">Turma</TableHead>
                {dados.situacoes.map(s => (
                  <TableHead key={s} className="text-right">{s}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.porTurma.map(t => (
                <TableRow key={t.turmaId}>
                  <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{t.turmaNome}</TableCell>
                  {dados.situacoes.map(s => (
                    <TableCell key={s} className="text-right text-muted-foreground tabular-nums">
                      {(t.valores[s] || 0) > 0 ? fmtInt(t.valores[s]) : '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-[16px] font-semibold text-foreground mb-2">Rendimento × resultado final</h3>
        <div className="max-w-xs mb-3">
          <Label>Resultado final</Label>
          <Select value={recorte} onValueChange={setRecorte}>
            <SelectTrigger><SelectValue placeholder="Selecione a situação" /></SelectTrigger>
            <SelectContent>
              {dados.situacoes.map(s => (
                <SelectItem key={s} value={s}>{s} ({fmtInt(dados.blocos.find(b => b.situacaoDb === s)?.quantidade)})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loadingCruz ? (
          <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
        ) : !cruz || cruz.alunos.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Sem histórico"
            description="Nenhum aluno neste resultado com rendimento registrado ao longo do ano."
          />
        ) : (
          <Card>
            <CardContent className="pt-5">
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
                    <Tooltip contentStyle={chartTooltipContentStyle} wrapperStyle={chartTooltipWrapperStyle} />
                    <Legend formatter={chartLegendFormatter} />
                    {cruz.alunos.map((a, i) => (
                      <Line
                        key={a.alunoId}
                        type="monotone"
                        dataKey={a.alunoId}
                        name={`${a.nome} (${a.turmaNome})`}
                        stroke={colorPorIndice(i)}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Histórico das médias por período (até 20 alunos) · Total: {cruz.alunos.length} exibidos
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
