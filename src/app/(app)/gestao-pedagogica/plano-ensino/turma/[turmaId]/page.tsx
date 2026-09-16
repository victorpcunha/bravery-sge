'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { listarPlanosEnsino, excluirPlanoEnsino, listarPeriodosPlanoEnsino, type PlanoEnsino } from '@/lib/actions/plano-ensino'
import { listarTurmasDiario, getDisciplinasDiario } from '@/lib/actions/diario-classe'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, BookOpen, Plus, ChevronRight, Trash2, GraduationCap, CalendarDays, User, Clock, FileText, SearchX, School } from 'lucide-react'
import { toast } from 'sonner'

function formatarPeriodos(periodos?: number[]) {
  if (!periodos?.length) return ''
  const sorted = [...periodos].sort((a, b) => a - b)
  if (sorted.length === 1) return `${sorted[0]}º Período`
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const isSequencia = sorted.length === last - first + 1
  if (isSequencia) return `${first}º ao ${last}º Período`
  return sorted.map(p => `${p}º`).join(' e ')
}

function formatarMinutos(minutos: number) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, '0')}`
}

function formatarDataBR(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

export default function TurmaPlanosPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </PageContainer>
      }
    >
      <TurmaPlanosContent />
    </Suspense>
  )
}

function TurmaPlanosContent() {
  const params = useTabParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const turmaId = params.turmaId as string
  const escolaParam = searchParams.get('escola')
  const anoParam = searchParams.get('ano')
  const { schoolId, isSuperAdmin } = useAuth()

  const [anoLetivoId, setAnoLetivoId] = useState(anoParam || '')
  const [turmaNome, setTurmaNome] = useState('')
  const [etapaNome, setEtapaNome] = useState('')
  const [disciplinaFiltro, setDisciplinaFiltro] = useState('')
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [periodosSelecionados, setPeriodosSelecionados] = useState<number[]>([])
  const [periodosDisponiveis, setPeriodosDisponiveis] = useState<number[]>([1, 2, 3, 4])
  const [planos, setPlanos] = useState<PlanoEnsino[]>([])
  const [loading, setLoading] = useState(true)
  const [pessoaId, setPessoaId] = useState<string | null>(null)

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const effectiveSchoolId = isSuperAdmin ? escolaParam : schoolId

  useEffect(() => {
    if (anoParam) {
      setAnoLetivoId(anoParam)
      return
    }
    if (!effectiveSchoolId) return
    getAnosLetivosAtivos(effectiveSchoolId)
      .then(list => {
        const ativo = list.find((a: any) => a.status === 'ativo')
        setAnoLetivoId(ativo?.id || '')
      })
      .catch(() => {})
  }, [effectiveSchoolId, anoParam])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId || !permLoaded || !turmaId) return
    listarTurmasDiario(effectiveSchoolId, pessoaId, anoLetivoId)
      .then(list => {
        const encontrada = list.find((t: any) => t.id === turmaId)
        if (encontrada) {
          setTurmaNome(encontrada.nome)
          setEtapaNome(encontrada.etapa_nome)
        }
      })
      .catch(() => {})
  }, [effectiveSchoolId, anoLetivoId, pessoaId, permLoaded, turmaId])

  useEffect(() => {
    if (!turmaId) return
    getDisciplinasDiario(turmaId, pessoaId).then(setDisciplinas).catch(() => {})
  }, [turmaId, pessoaId])

  useEffect(() => {
    if (!turmaId) return
    listarPeriodosPlanoEnsino(turmaId)
      .then(r => setPeriodosDisponiveis(r.periodos))
      .catch(() => setPeriodosDisponiveis([1, 2, 3, 4]))
  }, [turmaId])

  useEffect(() => {
    if (!permLoaded) return
    if (!effectiveSchoolId || !anoLetivoId || !turmaId) {
      setPlanos([])
      setLoading(false)
      return
    }
    setLoading(true)
    listarPlanosEnsino(effectiveSchoolId, pessoaId, {
      anoLetivoId,
      turmaId,
      matrizDisciplinaId: disciplinaFiltro === '__all__' ? undefined : disciplinaFiltro || undefined,
      periodos: periodosSelecionados.length ? periodosSelecionados : undefined,
    })
      .then(data => {
        setPlanos(data)
        if (data.length > 0) {
          if (!turmaNome) setTurmaNome(data[0].turma_nome || '')
          if (!etapaNome) setEtapaNome(data[0].etapa_nome || '')
        }
      })
      .catch(() => toast.error('Erro ao carregar planos'))
      .finally(() => setLoading(false))
  }, [effectiveSchoolId, pessoaId, anoLetivoId, turmaId, disciplinaFiltro, periodosSelecionados, permLoaded])

  const togglePeriodo = (p: number) => {
    setPeriodosSelecionados(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Excluir este plano de ensino?')) return
    try {
      await excluirPlanoEnsino(id, pessoaId)
      setPlanos(prev => prev.filter(p => p.id !== id))
      toast.success('Plano excluído')
    } catch {
      toast.error('Erro ao excluir plano')
    }
  }

  const goCriar = () => {
    const params = new URLSearchParams()
    if (isSuperAdmin && escolaParam) params.set('escola', escolaParam)
    if (anoLetivoId) params.set('ano', anoLetivoId)
    if (turmaId) params.set('turma', turmaId)
    const qs = params.toString()
    router.push(`/gestao-pedagogica/plano-ensino/criar${qs ? `?${qs}` : ''}`)
  }

  const voltarLista = () => {
    router.push('/gestao-pedagogica/plano-ensino')
  }

  const temFiltros = disciplinaFiltro !== '' || periodosSelecionados.length > 0
  const titulo = turmaNome ? `Plano de Ensino — ${turmaNome}` : 'Plano de Ensino'

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title={titulo}
          description={etapaNome || 'Planos de ensino da turma'}
          icon={BookOpen}
          actions={
            <Button variant="outline" size="sm" onClick={voltarLista}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          }
        />
        <PageSection variant="flush" title="Plano de Ensino">
          <div className="p-6">
            <EmptyState
              icon={School}
              title="Selecione uma escola"
              description="Volte para a lista de turmas, selecione uma escola e acesse a turma novamente."
            />
          </div>
        </PageSection>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title={titulo}
        description={etapaNome || 'Planos de ensino da turma'}
        icon={BookOpen}
        actions={
          <Button variant="outline" size="sm" onClick={voltarLista}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar
          </Button>
        }
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar>
          <Select value={disciplinaFiltro} onValueChange={setDisciplinaFiltro}>
            <SelectTrigger className="w-auto min-w-[190px] h-9">
              <SelectValue placeholder="Selecione uma disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas as disciplinas</SelectItem>
              {disciplinas.map((d: any) => (
                <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>{d.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-muted-foreground">Períodos:</span>
            {periodosDisponiveis.map(per => (
              <ClickablePill
                key={per}
                label={`${per}º`}
                title={`${per}º Período`}
                active={periodosSelecionados.includes(per)}
                onClick={() => togglePeriodo(per)}
              />
            ))}
          </div>
        </FilterBar>
      </PageSection>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && planos.length === 0 && (
        <PageSection variant="flush" title="Plano de Ensino">
          <div className="p-6">
            {temFiltros ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum plano com esses filtros"
                description="Tente ajustar os filtros para encontrar planos de ensino."
                action={
                  <Button variant="outline" onClick={() => { setDisciplinaFiltro(''); setPeriodosSelecionados([]) }}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhum Plano de Ensino encontrado"
                description={turmaNome ? `A turma ${turmaNome} ainda não possui planos de ensino. Crie o primeiro plano para começar.` : 'Crie um novo plano para começar o planejamento pedagógico'}
                action={
                  <Button onClick={goCriar}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Criar Plano de Ensino
                  </Button>
                }
              />
            )}
          </div>
        </PageSection>
      )}

      {!loading && planos.length > 0 && (
        <PageSection
          variant="flush"
          title="Plano de Ensino"
          description={`${planos.length} plano(s) encontrado(s)`}
          actions={
            <Button onClick={goCriar}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Plano de Ensino
            </Button>
          }
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {planos.map(plano => {
                const disciplinaDestaque = plano.disciplinas?.[0]?.nome || plano.etapa_nome || 'Plano de Ensino'
                const profs = (plano.professores || []).filter(p => p.matriz_disciplina_id === plano.disciplinas?.[0]?.matriz_disciplina_id)
                const professoresLabel = profs.length ? profs.map(p => p.nome).join(', ') : ''
                const bimestreLabel = formatarPeriodos(plano.periodos)
                const aulasLabel = `${plano.aulas_quadro ?? 0} aula${(plano.aulas_quadro ?? 0) === 1 ? '' : 's'}`
                const horasLabel = (plano.horas_quadro ?? 0) > 0 ? ` · ${formatarMinutos(plano.horas_quadro ?? 0)}` : ''
                const atualizadoLabel = formatarDataBR(plano.ultima_atualizacao)

                return (
                  <Card
                    key={plano.id}
                    className="flex flex-col cursor-pointer hover:shadow-md transition-all border-border hover:border-primary/30"
                    onClick={() => router.push(`/gestao-pedagogica/plano-ensino/${plano.id}`)}
                  >
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[16px] font-semibold text-foreground truncate">{disciplinaDestaque}</p>
                            {(plano.is_interdisciplinar && (plano.disciplinas?.length ?? 0) > 1) && (
                              <Badge variant="outline" className="mt-1 bg-warning/10 text-warning border-warning/20">
                                +{(plano.disciplinas?.length || 0) - 1} disciplina{(plano.disciplinas?.length || 0) - 1 > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={e => { e.stopPropagation(); handleExcluir(plano.id) }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 space-y-2 text-[13px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 shrink-0 text-primary/70" />
                          <span className="truncate font-medium text-foreground">{plano.turma_nome}</span>
                        </div>
                        {bimestreLabel && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0 text-primary/70" />
                            <span>{bimestreLabel}</span>
                          </div>
                        )}
                        {professoresLabel && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 shrink-0 text-primary/70" />
                            <span className="truncate">{professoresLabel}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-primary/70" />
                          <span>{aulasLabel}{horasLabel}</span>
                        </div>
                        {atualizadoLabel && (
                          <div className="text-[12px] text-muted-foreground/80">Atualizado em {atualizadoLabel}</div>
                        )}
                      </div>

                      <div className="mt-auto pt-4">
                        <Button variant="default" size="sm" className="w-full h-10 text-[13px]">
                          Ver Plano
                          <ChevronRight className="ml-1.5 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </PageSection>
      )}
    </PageContainer>
  )
}
