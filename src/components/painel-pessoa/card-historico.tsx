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
      toast.success('Historico removido')
      setDeleteTarget(null)
      carregar()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao remover historico')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4" />Historico Escolar</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-warning" />
            Historico Escolar
            <Button variant="outline" size="sm" className="ml-auto h-7 text-xs gap-1" onClick={() => setModalOpen(true)}>
              <Plus className="h-3 w-3" />
              Adicionar Historico
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum registro de historico escolar.</p>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs w-8" />
                    <TableHead className="text-xs">Ano</TableHead>
                    <TableHead className="text-xs">Turma / Escola</TableHead>
                    <TableHead className="text-xs">Etapa</TableHead>
                    <TableHead className="text-xs">Freq.</TableHead>
                    <TableHead className="text-xs">Situacao</TableHead>
                    <TableHead className="text-xs w-8" />
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
                        >
                          <TableCell className="p-2">
                            {isExpanded
                              ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                              : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            }
                          </TableCell>
                          <TableCell className="font-medium text-xs">
                            {row.label}
                            {row.type === 'manual' && (
                              <span className="ml-1 text-[10px] bg-accent/10 text-accent px-1 py-0.5 rounded">Manual</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">{row.turma_nome}</TableCell>
                          <TableCell className="text-xs">{row.etapa_nome}</TableCell>
                          <TableCell className="text-xs">{row.frequencia}</TableCell>
                          <TableCell className="text-xs">{row.situacao}</TableCell>
                          <TableCell className="p-1">
                            {row.type === 'manual' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={e => { e.stopPropagation(); setDeleteTarget(row.manualData!.id) }}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${row.key}-expanded`}>
                            <TableCell colSpan={7} className="p-0">
                              <div className="px-6 py-3 bg-muted/30 border-t border-border">
                                {row.type === 'system' && (
                                  <>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                      <div>
                                        <span className="text-xs text-muted-foreground">Ano Letivo: </span>
                                        <span className="text-xs font-medium">{row.label}</span>
                                      </div>
                                      <div>
                                        <span className="text-xs text-muted-foreground">Turma: </span>
                                        <span className="text-xs font-medium">{row.turma_nome}</span>
                                      </div>
                                    </div>

                                    {expandedData.loading ? (
                                      <div className="flex items-center gap-2 py-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Carregando avaliacoes...</span>
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
                                    <div className="grid grid-cols-3 gap-3">
                                      <div><span className="text-xs text-muted-foreground">Estado: </span><span className="text-xs font-medium">{row.manualData.estado || '-'}</span></div>
                                      <div><span className="text-xs text-muted-foreground">Municipio: </span><span className="text-xs font-medium">{row.manualData.municipio || '-'}</span></div>
                                      <div><span className="text-xs text-muted-foreground">Etapa: </span><span className="text-xs font-medium">{row.manualData.etapa_nome || '-'}</span></div>
                                      <div><span className="text-xs text-muted-foreground">Carga Horaria: </span><span className="text-xs font-medium">{row.manualData.carga_horaria ? `${row.manualData.carga_horaria}h` : '-'}</span></div>
                                      <div><span className="text-xs text-muted-foreground">Dias Letivos: </span><span className="text-xs font-medium">{row.manualData.dias_letivos || '-'}</span></div>
                                      <div><span className="text-xs text-muted-foreground">Observacoes: </span><span className="text-xs font-medium">{row.manualData.observacoes || '-'}</span></div>
                                    </div>

                                    {row.manualData.disciplinas.length > 0 && (
                                      <div>
                                        <h4 className="text-xs font-semibold text-foreground mb-2">Disciplinas</h4>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-xs">Disciplina</TableHead>
                                              <TableHead className="text-xs text-center">Media Final</TableHead>
                                              <TableHead className="text-xs text-center">Carga Horaria</TableHead>
                                              <TableHead className="text-xs text-center">Tipo</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {row.manualData.disciplinas.map(d => (
                                              <TableRow key={d.id}>
                                                <TableCell className="text-xs">{d.disciplina_nome}</TableCell>
                                                <TableCell className="text-xs text-center">{d.media_final}</TableCell>
                                                <TableCell className="text-xs text-center">{d.carga_horaria_anual ? `${d.carga_horaria_anual}h` : '-'}</TableCell>
                                                <TableCell className="text-xs text-center">
                                                  <span className={d.parte_diversificada ? 'text-accent' : 'text-primary'}>
                                                    {d.parte_diversificada ? 'Parte Diversif.' : 'BNCC'}
                                                  </span>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
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
        title="Remover Historico"
        description="Tem certeza que deseja remover este historico manual? As disciplinas vinculadas tambem serao removidas. Esta acao nao pode ser desfeita."
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
