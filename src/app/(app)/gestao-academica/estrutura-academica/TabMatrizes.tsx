'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ShieldAlert, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import {
  getMatrizes, deleteMatriz, toggleMatrizAtiva,
  getPeriodos, createDisciplinaMatriz, updateDisciplinaMatriz, deleteDisciplinaMatriz,
  getDisciplinasPorPeriodo, replicarDisciplinas, getMetodosAvaliacao, getDisciplinas,
  type DisciplinaMatriz,
} from '@/lib/actions/matrizes'
import { MatrizForm } from './MatrizForm'

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

const gruposEtapaLabels: Record<string, string> = {
  infantil: 'Educação Infantil',
  fundamental_inicial: 'Ensino Fundamental - Anos Iniciais',
  fundamental_final: 'Ensino Fundamental - Anos Finais',
  medio: 'Ensino Médio',
  fundamental_outros: 'Fundamental - Outros',
  eja: 'EJA',
}

interface TabMatrizesProps {
  schoolId: string | null
}

export function TabMatrizes({ schoolId }: TabMatrizesProps) {
  const { isSuperAdmin, allSchools } = useAuth()
  const { pode, loaded: permLoaded } = usePermissoes(schoolId)

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState<string | null>(null)
  const [etapas, setEtapas] = useState<any[]>([])
  const [etapaFiltro, setEtapaFiltro] = useState<string>('__all__')
  const [matrizes, setMatrizes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [showFormModal, setShowFormModal] = useState(false)
  const [editingMatrizId, setEditingMatrizId] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [periodosExpandidos, setPeriodosExpandidos] = useState<Set<string>>(new Set())
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, any[]>>({})
  const [periodNames, setPeriodNames] = useState<Record<string, string>>({})

  const [showDiscModal, setShowDiscModal] = useState(false)
  const [discPeriodoId, setDiscPeriodoId] = useState('')
  const [discEditId, setDiscEditId] = useState<string | null>(null)
  const [discForm, setDiscForm] = useState({
    disciplina_id: '',
    tipo: 'obrigatoria' as string,
    desconsidera_reprovacao: false,
    carga_horaria_regular: 0,
    carga_horaria_integral: 0,
    carga_horaria_regular_habilitada: false,
    carga_horaria_integral_habilitada: false,
    habilidades_ids: [] as string[],
    outras_habilidades: [] as { codigo: string; descricao: string }[],
  })
  const [savingDisc, setSavingDisc] = useState(false)

  const [replicarTarget, setReplicarTarget] = useState<{ periodoOrigemId: string; periodoDestinoIds: string[]; periodoOrigemNome: string } | null>(null)

  const effectiveSchoolId = selectedSchoolId || schoolId

  const etapasAgrupadas = useMemo(() => {
    const grupos: Record<string, any[]> = {}
    for (const e of etapas) {
      const tipo = e.etapa_tipo || 'outros'
      if (!grupos[tipo]) grupos[tipo] = []
      grupos[tipo].push(e)
    }
    return grupos
  }, [etapas])

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) return
    if (!effectiveSchoolId) { setLoading(false); return }
    loadInitialData()
  }, [effectiveSchoolId, isSuperAdmin, allSchools, selectedSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId) return
    loadMatrizes()
  }, [effectiveSchoolId, anoLetivoId, etapaFiltro])

  async function loadInitialData() {
    if (!effectiveSchoolId) return
    setLoading(true)
    try {
      const [anos, etapasData] = await Promise.all([
        getAnosLetivosAtivos(effectiveSchoolId),
        getEtapasEnsino(effectiveSchoolId),
      ])
      setAnosLetivos(anos)
      setEtapas(etapasData)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setAnoLetivoId(ativo.id)
      else if (anos.length > 0) setAnoLetivoId(anos[0].id)
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadMatrizes() {
    try {
      const data = await getMatrizes(effectiveSchoolId!, anoLetivoId || undefined, etapaFiltro === '__all__' ? undefined : etapaFiltro)
      setMatrizes(data)
    } catch (error) {
      console.error('Erro ao carregar matrizes:', error)
      toast.error('Erro ao carregar matrizes')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMatriz(deleteTarget.id)
      toast.success('Matriz excluída')
      setDeleteTarget(null)
      loadMatrizes()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir')
    }
  }

  async function handleToggleAtiva(id: string, ativa: boolean) {
    try {
      await toggleMatrizAtiva(id, ativa)
      setMatrizes(prev => prev.map(m => m.id === id ? { ...m, ativa } : m))
      toast.success(ativa ? 'Matriz ativada' : 'Matriz inativada')
    } catch (e: any) {
      toast.error(e?.message || 'Erro')
    }
  }

  function handleSaved() {
    setShowFormModal(false)
    setEditingMatrizId(null)
    loadMatrizes()
  }

  async function toggleExpandPeriodo(matrizId: string) {
    const newSet = new Set(periodosExpandidos)
    if (newSet.has(matrizId)) {
      newSet.delete(matrizId)
      setPeriodosExpandidos(newSet)
    } else {
      newSet.add(matrizId)
      setPeriodosExpandidos(new Set(newSet))
      try {
        const periodos = await getPeriodos(matrizId)
        const map: Record<string, any[]> = {}
        const names: Record<string, string> = {}
        for (const p of periodos) {
          map[p.id] = await getDisciplinasPorPeriodo(p.id)
          names[p.id] = p.periodo_nome
        }
        setDisciplinasPorPeriodo(prev => ({ ...prev, ...map }))
        setPeriodNames(prev => ({ ...prev, ...names }))
      } catch { toast.error('Erro ao carregar períodos') }
    }
  }

  const handleOpenNew = () => { setEditingMatrizId(null); setShowFormModal(true) }
  const handleOpenEdit = (id: string) => { setEditingMatrizId(id); setShowFormModal(true) }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (permLoaded && !pode.visualizar('gestao-academica.estrutura-academica.matrizes')) {
    return <EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem permissão para acessar Matrizes Curriculares." />
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        {isSuperAdmin && allSchools.length > 0 && (
          <div className="max-w-md">
            <Label className="text-xs text-muted-foreground mb-1 block">Escola</Label>
            <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v); setAnoLetivoId(null); setMatrizes([]) }}>
              <SelectTrigger className="w-full border-border [&_svg]:!rotate-0">
                <SelectValue placeholder="Selecione uma Escola" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        {(effectiveSchoolId || !isSuperAdmin) && anosLetivos.length > 0 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
            <Select value={anoLetivoId ?? ''} onValueChange={setAnoLetivoId}>
              <SelectTrigger className="w-[160px] border-border [&_svg]:!rotate-0">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        {(effectiveSchoolId || !isSuperAdmin) && anoLetivoId && etapas.length > 0 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Etapa</Label>
            <Select value={etapaFiltro} onValueChange={setEtapaFiltro}>
              <SelectTrigger className="w-[200px] border-border [&_svg]:!rotate-0">
                <SelectValue placeholder="Todas as etapas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas as etapas</SelectItem>
                {Object.entries(etapasAgrupadas).map(([tipo, lista]) => (
                  <div key={tipo}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{gruposEtapaLabels[tipo] || tipo}</div>
                    {lista.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isSuperAdmin && !selectedSchoolId ? (
        <EmptyState icon={ShieldAlert} title="Selecione uma Escola" description="Escolha uma escola para gerenciar as matrizes." />
      ) : !anoLetivoId ? (
        <EmptyState icon={ShieldAlert} title="Selecione um Ano Letivo" description="Escolha um ano letivo para visualizar as matrizes." />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-[16px] font-semibold text-foreground">
              Matrizes Curriculares {matrizes.length > 0 && <span className="text-muted-foreground font-normal">({matrizes.length})</span>}
            </CardTitle>
            <Button size="lg" onClick={handleOpenNew}>
              <Plus className="h-4 w-4 mr-2" />Nova Matriz
            </Button>
          </CardHeader>
          <CardContent>
            {matrizes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">Nenhuma matriz curricular cadastrada</p>
            ) : (
              <div className="space-y-3">
                {matrizes.map(m => {
                  const isExpanded = periodosExpandidos.has(m.id)
                  const statusAno = anosLetivos.find((a: any) => a.id === m.ano_letivo_id)
                  const isEncerrado = statusAno?.status === 'encerrado'
                  return (
                    <Card key={m.id} className="shadow-sm">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 p-4">
                          <button type="button" onClick={() => toggleExpandPeriodo(m.id)} className="text-muted-foreground shrink-0">
                            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[15px] font-semibold text-foreground">{m.descricao}</span>
                              <StatusBadge status={m.ativa ? 'success' : 'muted'}>{m.ativa ? 'Ativa' : 'Inativa'}</StatusBadge>
                              {m.academico_etapas_ensino?.etapa_nome && (
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{m.academico_etapas_ensino.etapa_nome}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                              <span>{formatDate(m.data_inicio)} – {formatDate(m.data_final)}</span>
                              {m.turnos?.length > 0 && <span>· {m.turnos.join(', ')}</span>}
                              {m.tipo_turma?.length > 0 && <span>· {m.tipo_turma.join(', ')}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!isEncerrado && (
                              <>
                                <Switch checked={m.ativa} onCheckedChange={(v) => handleToggleAtiva(m.id, v)} />
                                <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(m.id)} title="Editar">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-border px-4 py-3 space-y-2">
                            {Object.values(disciplinasPorPeriodo).flat().length === 0 && (
                              <p className="text-xs text-muted-foreground py-2">Nenhum período configurado</p>
                            )}
                            {Object.entries(disciplinasPorPeriodo).filter(([, discs]) => discs && discs.length > 0).map(([pid, discs]) => (
                              <div key={pid}>
                                <div className="text-xs font-medium text-muted-foreground mb-1.5">{periodNames[pid] || pid}</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {discs.map((d: any) => (
                                    <span key={d.id} className="text-xs bg-card border border-border rounded px-2 py-0.5">{d.academico_disciplinas?.nome || d.disciplina_id}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Matriz Form Dialog */}
      <Dialog open={showFormModal} onOpenChange={(open) => { if (!open) { setShowFormModal(false); setEditingMatrizId(null) } }}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{editingMatrizId ? 'Editar Matriz Curricular' : 'Nova Matriz Curricular'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <MatrizForm
              schoolId={effectiveSchoolId}
              matrizId={editingMatrizId}
              onSaved={handleSaved}
              onCancel={() => { setShowFormModal(false); setEditingMatrizId(null) }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Excluir Matriz Curricular"
        description={`Tem certeza que deseja excluir "${deleteTarget?.descricao}"? Todos os períodos e disciplinas vinculados serão excluídos.`}
        confirmLabel="Sim, Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
