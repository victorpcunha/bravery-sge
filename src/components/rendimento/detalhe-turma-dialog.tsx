'use client'

import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { BookOpen, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import {
  chartTooltipContentStyle, chartTooltipWrapperStyle, truncateLabel,
} from '@/components/dashboard/chart-helpers'
import { getDetalheTurma, type DetalheTurma } from '@/lib/actions/rendimento'
import { fmtMedia, fmtPct, fmtInt } from './format'
import { toast } from 'sonner'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  escolaId: string
  anoId: string
  turmaId: string
  turmaNome: string
  periodo: number | null
  pessoaId: string | null
}

export default function DetalheTurmaDialog({
  open, onOpenChange, escolaId, anoId, turmaId, turmaNome, periodo, pessoaId,
}: Props) {
  const [detalhe, setDetalhe] = useState<DetalheTurma | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !escolaId || !anoId || !turmaId) return
    setDetalhe(null)
    setLoading(true)
    getDetalheTurma({ schoolId: escolaId, anoLetivoId: anoId, periodoOrdem: periodo, turmaId }, pessoaId)
      .then(setDetalhe)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'Erro ao carregar turma'))
      .finally(() => setLoading(false))
  }, [open, escolaId, anoId, turmaId, periodo, pessoaId])

  const chartData = (detalhe?.evolucao || [])
    .filter(e => e.media !== null)
    .map(e => ({ nome: e.nome, media: e.media }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 flex flex-col max-h-[90vh] max-w-4xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle>{turmaNome || 'Turma'}</DialogTitle>
          <DialogDescription>Desempenho detalhado no período selecionado</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[14px]">Carregando detalhe da turma...</span>
            </div>
          ) : !detalhe ? (
            <EmptyState icon={BookOpen} title="Sem dados" description="Não foi possível carregar o detalhe da turma." />
          ) : (
            <>
              <section>
                <h4 className="text-[16px] font-semibold text-foreground mb-2">Desempenho por disciplina</h4>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-muted z-10">Disciplina</TableHead>
                        <TableHead className="text-right">Média</TableHead>
                        <TableHead className="text-right">Avaliados</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalhe.porDisciplina.map(d => (
                        <TableRow key={d.id}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium text-foreground">{d.nome}</TableCell>
                          <TableCell className="text-right font-medium text-foreground tabular-nums">{fmtMedia(d.media)}</TableCell>
                          <TableCell className="text-right text-muted-foreground tabular-nums">{fmtInt(d.avaliados)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[16px] font-semibold text-foreground mb-2">Distribuição das notas</h4>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Faixa</TableHead>
                          <TableHead className="text-right">Alunos</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detalhe.distribuicao.map(d => (
                          <TableRow key={d.faixa}>
                            <TableCell className="font-medium text-foreground">{d.faixa}</TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">{fmtInt(d.quantidade)}</TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">{fmtPct(d.percentual)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-foreground mb-2">Frequência</h4>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-[36px] font-bold leading-none text-foreground tabular-nums">{fmtPct(detalhe.frequencia)}</p>
                    <p className="text-[14px] text-muted-foreground mt-1">Frequência média da turma</p>
                  </div>
                  <h4 className="text-[16px] font-semibold text-foreground mt-4 mb-2">
                    Alunos abaixo da média ({detalhe.abaixoMedia.length})
                  </h4>
                  {detalhe.abaixoMedia.length === 0 ? (
                    <p className="text-[14px] text-muted-foreground">Nenhum aluno abaixo da média.</p>
                  ) : (
                    <ul className="divide-y divide-border rounded-lg border border-border max-h-48 overflow-y-auto">
                      {detalhe.abaixoMedia.map(a => (
                        <li key={a.alunoId} className="flex items-center justify-between px-3 py-2">
                          <span className="text-[14px] text-foreground">{a.nome}</span>
                          <span className="text-[14px] font-semibold text-destructive tabular-nums">{fmtMedia(a.media)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section>
                <h4 className="text-[16px] font-semibold text-foreground mb-2">Evolução por período</h4>
                {chartData.length === 0 ? (
                  <EmptyState icon={BookOpen} title="Sem dados" description="Nenhum período com média calculada." />
                ) : (
                  <div className="h-64">
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
                          formatter={((value: unknown) => [fmtMedia(Number(value)), 'Média']) as never}
                        />
                        <Line type="monotone" dataKey="media" name="Média" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
