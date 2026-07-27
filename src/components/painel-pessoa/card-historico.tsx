'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { getHistoricoSistema, getNotasDetalhadas, getIndicadoresAvaliados, type HistoricoAno, type NotasDetalhadas, type IndicadoresAvaliados, type HistoricoManualRecord } from '@/lib/actions/painel-pessoa'
import { listarHistoricoManual, removerHistoricoManual } from '@/lib/actions/historico-manual'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GraduationCap, Loader2, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import ExpansaoNotas from './expansao-notas'
import ExpansaoIndicadores from './expansao-indicadores'
import ModalHistoricoManual from './modal-historico-manual'
import { toast } from 'sonner'

type Props = {
  pessoaId: string
  schoolId: string | null
  pessoaLogadaId: string | null
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
  frequencia: string
  systemData?: HistoricoAno
  manualData?: HistoricoManualRecord
}

export default function CardHistorico({ pessoaId, schoolId, pessoaLogadaId }: Props) {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
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
          frequencia: s.frequencia_percentual !== null ? `${s.frequencia_percentual}%` : '-',
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
                frequencia: '-',
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
  }, [pessoaId, carregar])

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
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Histórico Escolar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-[15px] flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-warning" />
            Histórico Escolar
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-7 gap-1"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Adicionar Histórico
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">Nenhum registro de histórico escolar.</p>
          ) : (
            <ScrollArea className="max-h-[800px]">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Ano</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Freq.</TableHead>
                    <TableHead className="text-right pr-3">Situação</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(row => {
                    const isExpanded = expandedId === row.key

                    return (
                      <Fragment key={row.key}>
                        <TableRow
                          key={row.key}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleExpand(row)}
                          aria-expanded={isExpanded}
                        >
                          <TableCell className="p-2">
                            {isExpanded
                              ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                              : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                            }
                          </TableCell>
                          <TableCell className="font-medium text-[14px]">
                            {row.label}
                            {row.type === 'manual' && (
                              <span className="ml-2 text-[11px] bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                                Manual
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-[14px]">{row.etapa_nome}</TableCell>
                          <TableCell className="text-[14px] tabular-nums">{row.frequencia}</TableCell>
                          <TableCell className="text-[14px] text-right pr-3">{row.situacao}</TableCell>
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
                              <div className="px-3 sm:px-6 py-3 bg-muted/30 border-t border-border min-w-0">
                                {row.type === 'system' && (
                                  <>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Ano Letivo: </span>
                                        <span className="text-[13px] font-medium">{row.label}</span>
                                      </div>
                                      <div>
                                        <span className="text-[13px] text-muted-foreground">Turma: </span>
                                        <span className="text-[13px] font-medium">{row.turma_nome}</span>
                                      </div>
                                    </div>

                                    {expandedData.loading ? (
                                      <div className="flex items-center gap-2 py-3" role="status">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                                        <span className="text-[13px] text-muted-foreground">Carregando avaliações...</span>
                                      </div>
                                    ) : (
                                      <>
                                        <ExpansaoNotas data={expandedData.notas || { disciplinas: [], total_dias_letivos: null }} />
                                        <ExpansaoIndicadores data={expandedData.indicadores || { disciplinas: [] }} />
                                      </>
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
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Remover Histórico"
        description="Tem certeza que deseja remover este histórico manual? As disciplinas vinculadas também serão removidas. Esta ação não pode ser desfeita."
        onConfirm={handleRemove}
        loading={deleting}
        variant="destructive"
      />

      <ModalHistoricoManual
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={carregar}
        personId={pessoaId}
        schoolId={schoolId}
        pessoaLogadaId={pessoaLogadaId}
      />
    </>
  )
}
