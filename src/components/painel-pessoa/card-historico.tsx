'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { getHistoricoSistema, getNotasDetalhadas, getIndicadoresAvaliados, type HistoricoAno, type NotasDetalhadas, type IndicadoresAvaliados, type HistoricoManualRecord } from '@/lib/actions/painel-pessoa'
import { listarHistoricoManual, removerHistoricoManual } from '@/lib/actions/historico-manual'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, ChevronDown, ChevronUp, Trash2, CalendarDays, GraduationCap } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { StatusBadge } from '@/components/feedback/status-badge'
import { cn } from '@/lib/utils'
import ExpansaoNotas from './expansao-notas'
import ExpansaoIndicadores from './expansao-indicadores'
import { toast } from 'sonner'

type Props = {
  pessoaId: string
  pessoaLogadaId: string | null
  refreshKey?: number
}

type RowData = {
  notas: NotasDetalhadas | null
  indicadores: IndicadoresAvaliados | null
  loading: boolean
}

type UnifiedRow = {
  key: string
  type: 'system' | 'manual'
  label: string
  turma_nome: string
  etapa_nome: string
  situacao: string
  systemData?: HistoricoAno
  manualData?: HistoricoManualRecord
}

const SITUACAO_BADGE: Record<string, 'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'> = {
  'Ativo': 'primary',
  'Aprovado': 'success',
  'Aprovado por conselho de classe': 'success',
  'Reclassificado': 'success',
  'Remanejado': 'success',
  'Reprovado': 'destructive',
  'Reprovado por frequência': 'destructive',
  'Óbito': 'destructive',
  'Transferido': 'warning',
  'Desistente': 'warning',
}

function situacaoStatus(situacao: string) {
  return SITUACAO_BADGE[situacao] || 'muted'
}

function FrequencyBar({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span className="text-[14px] text-muted-foreground">—</span>
  }

  const barClass = percent >= 75 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-destructive'
  const textClass = percent >= 75 ? 'text-success' : percent >= 50 ? 'text-warning' : 'text-destructive'

  return (
    <div className="flex items-center gap-2 min-w-[120px]" title={`Frequência: ${percent}%`}>
      <div className="h-1.5 w-16 sm:w-24 rounded-full bg-muted overflow-hidden" role="img" aria-label={`Frequência ${percent}%`}>
        <div className={cn('h-full rounded-full', barClass)} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className={cn('text-[13px] tabular-nums', textClass)}>{percent}%</span>
    </div>
  )
}

export default function CardHistorico({ pessoaId, pessoaLogadaId, refreshKey }: Props) {
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedData, setExpandedData] = useState<RowData>({ notas: null, indicadores: null, loading: false })
  const [rows, setRows] = useState<UnifiedRow[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const carregar = useCallback(() => {
    setLoading(true)
    getHistoricoSistema(pessoaId, pessoaLogadaId)
      .then(sistema => {
        const unified: UnifiedRow[] = sistema.map(s => ({
          key: `sys-${s.ano_letivo_id}-${s.turma_id}`,
          type: 'system' as const,
          label: String(s.ano),
          turma_nome: s.turma_nome,
          etapa_nome: s.etapa_nome,
          situacao: s.situacao,
          systemData: s,
        }))

        listarHistoricoManual(pessoaId, pessoaLogadaId)
          .then(manual => {
            for (const m of manual) {
              unified.push({
                key: `man-${m.id}`,
                type: 'manual',
                label: m.year_name,
                turma_nome: m.unidade_escolar || '-',
                etapa_nome: m.etapa_nome || '-',
                situacao: m.situacao || '-',
                manualData: m,
              })
            }
            setRows([...unified])
          })
          .catch(() => setRows([...unified]))
          .finally(() => setLoading(false))
      })
      .catch(() => { setRows([]); setLoading(false) })
  }, [pessoaId, pessoaLogadaId])

  useEffect(() => {
    if (pessoaId) carregar()
  }, [pessoaId, carregar, refreshKey])

  const toggleExpand = async (row: UnifiedRow) => {
    if (expandedId === row.key) {
      setExpandedId(null)
      return
    }

    setExpandedId(row.key)

    if (row.type === 'manual') {
      setExpandedData({ notas: null, indicadores: null, loading: false })
      return
    }

    const turmaId = row.systemData?.turma_id
    if (!turmaId || !pessoaId) {
      setExpandedData({ notas: null, indicadores: null, loading: false })
      return
    }

    setExpandedData({ notas: null, indicadores: null, loading: true })

    try {
      const [notas, indicadores] = await Promise.all([
        getNotasDetalhadas(pessoaId, turmaId, pessoaLogadaId),
        getIndicadoresAvaliados(pessoaId, turmaId, pessoaLogadaId),
      ])
      setExpandedData({ notas, indicadores, loading: false })
    } catch {
      setExpandedData({ notas: null, indicadores: null, loading: false })
    }
  }

  const handleRemove = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removerHistoricoManual(deleteTarget, pessoaLogadaId)
      toast.success('Histórico removido')
      setDeleteTarget(null)
      carregar()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao remover histórico')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4" role="status">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="text-[14px] text-muted-foreground">Carregando histórico...</span>
      </div>
    )
  }

  return (
    <>
      {rows.length === 0 ? (
        <p className="text-[15px] text-muted-foreground py-2">Nenhum registro de histórico escolar.</p>
      ) : (
            <ScrollArea className="max-h-[800px]">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 bg-muted" />
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Ano</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Etapa</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Frequência</TableHead>
                    <TableHead className="bg-muted text-center text-[13px] uppercase tracking-wider text-muted-foreground">Situação</TableHead>
                    <TableHead className="w-8 bg-muted" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(row => {
                    const isExpanded = expandedId === row.key

                    return (
                      <Fragment key={row.key}>
                        <TableRow
                          key={row.key}
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-primary/5',
                            isExpanded && 'bg-primary/[0.03]'
                          )}
                          onClick={() => toggleExpand(row)}
                          aria-expanded={isExpanded}
                        >
                          <TableCell className="p-2">
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                            )}
                          </TableCell>
                          <TableCell className="text-[15px] font-semibold text-foreground">
                            <span className="inline-flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                              {row.label}
                              {row.type === 'manual' && (
                                <span className="text-[11px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                                  Manual
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="text-[14px] text-muted-foreground">{row.etapa_nome}</TableCell>
                          <TableCell className="text-[14px] tabular-nums">
                            {row.type === 'manual' ? (
                              <span className="text-[14px] text-muted-foreground">—</span>
                            ) : (
                              <FrequencyBar percent={row.systemData?.frequencia_percentual ?? null} />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={situacaoStatus(row.situacao)}>{row.situacao}</StatusBadge>
                          </TableCell>
                          <TableCell className="p-1">
                            {row.type === 'manual' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={e => { e.stopPropagation(); setDeleteTarget(row.manualData!.id) }}
                                aria-label={`Remover histórico manual de ${row.label}`}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${row.key}-expanded`}>
                            <TableCell colSpan={6} className="p-0">
                              <div className="px-3 sm:px-6 py-3 bg-primary/[0.03] border-t border-border min-w-0">
                                {row.type === 'system' && (
                                  <>
                                    <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-3">
                                      <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                                      Turma:{' '}
                                      <span className="font-medium text-foreground">{row.turma_nome}</span>
                                    </p>

                                    {expandedData.loading ? (
                                      <div className="flex items-center gap-2 py-3" role="status">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                                        <span className="text-[13px] text-muted-foreground">Carregando avaliações...</span>
                                      </div>
                                    ) : (
                                      <div className="space-y-5">
                                        <ExpansaoNotas data={expandedData.notas || { disciplinas: [], total_dias_letivos: null }} />
                                        <ExpansaoIndicadores data={expandedData.indicadores || { disciplinas: [] }} />
                                      </div>
                                    )}
                                  </>
                                )}

                                {row.type === 'manual' && row.manualData && (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Estado: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.estado || '-'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Município: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.municipio || '-'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Etapa: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.etapa_nome || '-'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Carga Horária: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.carga_horaria ? `${row.manualData.carga_horaria}h` : '-'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Dias Letivos: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.dias_letivos || '-'}</span>
                                      </div>
                                      <div className="sm:col-span-2 lg:col-span-3">
                                        <span className="text-[13px] text-muted-foreground">Observações: </span>
                                        <span className="text-[13px] font-medium">{row.manualData.observacoes || '-'}</span>
                                      </div>
                                    </div>

                                    {row.manualData.disciplinas.length > 0 && (
                                      <div>
                                        <h4 className="text-[14px] font-semibold text-foreground mb-2">Disciplinas</h4>
                                        <ul className="space-y-2">
                                          {row.manualData.disciplinas.map(d => (
                                            <li
                                              key={d.id}
                                              className="rounded-lg border border-border p-3 space-y-1.5"
                                            >
                                              <div className="flex items-center justify-between gap-2">
                                                <span className="text-[14px] font-semibold text-foreground truncate">
                                                  {d.disciplina_nome}
                                                </span>
                                                <span
                                                  className={
                                                    d.parte_diversificada
                                                      ? 'shrink-0 text-[13px] font-medium text-accent'
                                                      : 'shrink-0 text-[13px] font-medium text-primary'
                                                  }
                                                >
                                                  {d.parte_diversificada ? 'Parte Diversif.' : 'BNCC'}
                                                </span>
                                              </div>
                                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground tabular-nums">
                                                <span>
                                                  Média:{' '}
                                                  <span className="font-medium text-foreground">
                                                    {d.media_final}
                                                  </span>
                                                </span>
                                                <span>
                                                  Carga:{' '}
                                                  <span className="font-medium text-foreground">
                                                    {d.carga_horaria_anual
                                                      ? `${d.carga_horaria_anual}h`
                                                      : '-'}
                                                  </span>
                                                </span>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
              </TableBody>
            </Table>
          </ScrollArea>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Remover Histórico"
        description="Tem certeza que deseja remover este histórico manual? As disciplinas vinculadas também serão removidas. Esta ação não pode ser desfeita."
        onConfirm={handleRemove}
        loading={deleting}
        variant="destructive"
      />
    </>
  )
}
