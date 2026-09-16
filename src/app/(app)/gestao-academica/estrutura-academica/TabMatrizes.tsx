'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ShieldAlert, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import { getMatrizes, deleteMatriz, getResumoMatrizes } from '@/lib/actions/matrizes'

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

const RECURSO = 'gestao-academica.estrutura-academica.matrizes'

interface TabMatrizesProps {
  schoolId: string | null
}

export function TabMatrizes({ schoolId }: TabMatrizesProps) {
  const router = useRouter()
  const { isSuperAdmin, allSchools, pessoaId } = useAuth()
  const { pode, loaded: permLoaded } = usePermissoes(schoolId)

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState<string | null>(null)
  const [etapas, setEtapas] = useState<any[]>([])
  const [etapaFiltro, setEtapaFiltro] = useState<string>('__all__')
  const [matrizes, setMatrizes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [periodosExpandidos, setPeriodosExpandidos] = useState<Set<string>>(new Set())
  const [periodosPorMatriz, setPeriodosPorMatriz] = useState<Record<string, { id: string; nome: string }[]>>({})
  const [disciplinasPorPeriodo, setDisciplinasPorPeriodo] = useState<Record<string, { id: string; nome: string }[]>>({})
  const [contagemPorMatriz, setContagemPorMatriz] = useState<Record<string, number>>({})

  const effectiveSchoolId = selectedSchoolId || schoolId
  const lastKey = useRef('')

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
    if (!effectiveSchoolId) return
    const key = `${effectiveSchoolId}|${anoLetivoId || ''}|${etapaFiltro || ''}`
    if (key === lastKey.current) return
    lastKey.current = key
    loadInitialData()
  }, [effectiveSchoolId, anoLetivoId, etapaFiltro, isSuperAdmin, allSchools, selectedSchoolId])

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
      // Resumo batch (2 queries): períodos + disciplinas por matriz, sem N+1
      const resumo = await getResumoMatrizes(data.map((m: any) => m.id))
      setPeriodosPorMatriz(resumo.periodosPorMatriz)
      setDisciplinasPorPeriodo(resumo.disciplinasPorPeriodo)
      setContagemPorMatriz(resumo.contagemPorMatriz)
    } catch (error) {
      console.error('Erro ao carregar matrizes:', error)
      toast.error('Erro ao carregar matrizes')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMatriz(deleteTarget.id, pessoaId)
      toast.success('Matriz excluída')
      setDeleteTarget(null)
      loadMatrizes()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir')
    }
  }

  function toggleExpand(matrizId: string) {
    const ns = new Set(periodosExpandidos)
    if (ns.has(matrizId)) ns.delete(matrizId)
    else ns.add(matrizId)
    setPeriodosExpandidos(ns)
  }

  const basePath = '/gestao-academica/estrutura-academica/matrizes'
  const handleOpenNew = () => {
    const q = new URLSearchParams()
    if (effectiveSchoolId) q.set('escola', effectiveSchoolId)
    if (anoLetivoId) q.set('ano', anoLetivoId)
    router.push(`${basePath}/novo?${q.toString()}`)
  }
  const handleOpenEdit = (id: string) => router.push(`${basePath}/${id}`)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (permLoaded && !pode.visualizar(RECURSO)) {
    return <EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem permissão para acessar Matrizes Curriculares." />
  }

  return (
    <>
      <PageSection variant="compact" title="Filtros">
        <FilterBar>
          {isSuperAdmin && allSchools.length > 0 && (
            <div className="max-w-md flex-1 min-w-[200px]">
              <Label className="text-[14px] font-medium mb-1 block">Escola</Label>
              <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v); setAnoLetivoId(null); setMatrizes([]) }}>
                <SelectTrigger className="w-full border-border">
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
              <Label className="text-[14px] font-medium mb-1 block">Ano Letivo</Label>
              <Select value={anoLetivoId ?? ''} onValueChange={setAnoLetivoId}>
                <SelectTrigger className="w-[160px] border-border">
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
              <Label className="text-[14px] font-medium mb-1 block">Etapa</Label>
              <Select value={etapaFiltro} onValueChange={setEtapaFiltro}>
                <SelectTrigger className="w-[220px] border-border">
                  <SelectValue placeholder="Todas as etapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as etapas</SelectItem>
                  {Object.entries(etapasAgrupadas).map(([tipo, lista]) => (
                    <SelectGroup key={tipo}>
                      <SelectLabel>{gruposEtapaLabels[tipo] || tipo}</SelectLabel>
                      {lista.map((e: any) => (
                        <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </FilterBar>
      </PageSection>

      {isSuperAdmin && !selectedSchoolId ? (
        <EmptyState icon={ShieldAlert} title="Selecione uma Escola" description="Escolha uma escola para gerenciar as matrizes." />
      ) : !anoLetivoId ? (
        <EmptyState icon={ShieldAlert} title="Selecione um Ano Letivo" description="Escolha um ano letivo para visualizar as matrizes." />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-display text-[20px] font-semibold text-foreground">
              Matrizes Curriculares {matrizes.length > 0 && <span className="text-muted-foreground font-normal text-[16px]">({matrizes.length})</span>}
            </CardTitle>
            <Button size="lg" onClick={handleOpenNew}>
              <Plus className="h-4 w-4 mr-2" />Nova Matriz
            </Button>
          </CardHeader>
          <CardContent>
            {matrizes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-[15px]">Nenhuma matriz curricular cadastrada</p>
            ) : (
              <div className="space-y-3">
                {matrizes.map(m => {
                  const isExpanded = periodosExpandidos.has(m.id)
                  const statusAno = anosLetivos.find((a: any) => a.id === m.ano_letivo_id)
                  const isEncerrado = statusAno?.status === 'encerrado'
                  const periodos = periodosPorMatriz[m.id] || []
                  const qtd = contagemPorMatriz[m.id] ?? 0
                  const turnos = Array.isArray(m.turnos) ? m.turnos.join(', ') : ''
                  const tipos = Array.isArray(m.tipo_turma) ? m.tipo_turma.join(', ') : ''
                  return (
                    <Card key={m.id} className="shadow-sm">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 p-4">
                          <button type="button" onClick={() => toggleExpand(m.id)} className="text-muted-foreground shrink-0" aria-label={isExpanded ? 'Recolher' : 'Expandir'}>
                            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                          </button>
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0" aria-hidden="true">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[16px] font-semibold text-foreground">{m.descricao}</span>
                              <StatusBadge status={m.ativa ? 'success' : 'muted'}>{m.ativa ? 'Ativa' : 'Inativa'}</StatusBadge>
                            </div>
                            <div className="flex items-center gap-x-2 gap-y-0.5 text-[13px] text-muted-foreground mt-1 flex-wrap">
                              {m.academico_anos_letivos?.descricao && <span>Ano Letivo: {m.academico_anos_letivos.descricao}</span>}
                              {(m.data_inicio || m.data_final) && (
                                <span>· {formatDate(m.data_inicio)} – {formatDate(m.data_final)}</span>
                              )}
                              {m.academico_etapas_ensino?.etapa_nome && <span>· {m.academico_etapas_ensino.etapa_nome}</span>}
                              {turnos && <span>· Turnos: {turnos}</span>}
                              {tipos && <span>· Tipo: {tipos}</span>}
                              <span>· {qtd} disciplina{qtd === 1 ? '' : 's'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!isEncerrado && (
                              <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(m.id)} title="Editar">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="border-t border-border px-4 py-3 space-y-2">
                            {periodos.length === 0 && (
                              <p className="text-[13px] text-muted-foreground py-2">Nenhum período configurado</p>
                            )}
                            {periodos.map(p => {
                              const discs = disciplinasPorPeriodo[p.id] || []
                              return (
                                <div key={p.id}>
                                  <div className="text-[13px] font-medium text-muted-foreground mb-1.5">{p.nome}</div>
                                  {discs.length === 0 ? (
                                    <p className="text-[13px] text-muted-foreground">Nenhuma disciplina neste período</p>
                                  ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                      {discs.map((d) => (
                                        <span key={d.id} className="text-[13px] bg-muted border border-border rounded px-2 py-0.5 text-foreground">{d.nome}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
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
