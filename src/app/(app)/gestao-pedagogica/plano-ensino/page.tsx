'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { listarPlanosEnsino, type PlanoEnsino } from '@/lib/actions/plano-ensino'
import { listarTurmasDiario, type TurmaDiario } from '@/lib/actions/diario-classe'
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
import { StatusBadge } from '@/components/feedback/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, BookOpen, Plus, GraduationCap, FileText, ChevronRight, Clock, SearchX } from 'lucide-react'
import { toast } from 'sonner'

function formatarDataBR(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

type TurmaCard = TurmaDiario & { totalPlanos: number; ultimaAtualizacao: string | null }

export default function PlanoEnsinoPage() {
  const router = useRouter()
  const { schoolId, isSuperAdmin, allSchools } = useAuth()
  const [anoLetivoId, setAnoLetivoId] = useState('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<TurmaDiario[]>([])
  const [planos, setPlanos] = useState<PlanoEnsino[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pessoaId, setPessoaId] = useState<string | null>(null)

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId

  useEffect(() => {
    setAnoLetivoId('')
    setAnosLetivos([])
    setTurmas([])
    setPlanos([])
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId) return
    getAnosLetivosAtivos(effectiveSchoolId)
      .then(list => {
        setAnosLetivos(list)
        const ativo = list.find((a: any) => a.status === 'ativo')
        setAnoLetivoId(ativo?.id || '')
      })
      .catch(() => {})
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!permLoaded) return
    if (!effectiveSchoolId || !anoLetivoId) {
      setTurmas([])
      setPlanos([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all([
      listarTurmasDiario(effectiveSchoolId, pessoaId, anoLetivoId),
      listarPlanosEnsino(effectiveSchoolId, pessoaId, { anoLetivoId }),
    ])
      .then(([t, p]) => {
        setTurmas(t)
        setPlanos(p)
      })
      .catch(() => toast.error('Erro ao carregar turmas'))
      .finally(() => setLoading(false))
  }, [effectiveSchoolId, pessoaId, anoLetivoId, permLoaded])

  const turmasCards: TurmaCard[] = useMemo(() => {
    const porTurma = new Map<string, { total: number; ultima: string | null }>()
    for (const p of planos) {
      const cur = porTurma.get(p.turma_id) || { total: 0, ultima: null }
      cur.total += 1
      const u = p.ultima_atualizacao || null
      if (u && (!cur.ultima || u > cur.ultima)) cur.ultima = u
      porTurma.set(p.turma_id, cur)
    }
    return turmas.map(t => {
      const agg = porTurma.get(t.id)
      return { ...t, totalPlanos: agg?.total || 0, ultimaAtualizacao: agg?.ultima || null }
    })
  }, [turmas, planos])

  const goCriar = () => {
    const params = new URLSearchParams()
    if (isSuperAdmin && selectedSchoolId) params.set('escola', selectedSchoolId)
    if (anoLetivoId) params.set('ano', anoLetivoId)
    const qs = params.toString()
    router.push(`/gestao-pedagogica/plano-ensino/criar${qs ? `?${qs}` : ''}`)
  }

  const abrirTurma = (turmaId: string) => {
    const params = new URLSearchParams()
    if (isSuperAdmin && selectedSchoolId) params.set('escola', selectedSchoolId)
    if (anoLetivoId) params.set('ano', anoLetivoId)
    const qs = params.toString()
    router.push(`/gestao-pedagogica/plano-ensino/turma/${turmaId}${qs ? `?${qs}` : ''}`)
  }

  const mostraSelecaoEscola = isSuperAdmin && !selectedSchoolId
  const mostraSelecaoAno = !mostraSelecaoEscola && !!effectiveSchoolId && !anoLetivoId

  return (
    <PageContainer>
      <PageHeader
        title="Plano de Ensino"
        description="Selecione uma turma para visualizar os planos de ensino"
        icon={BookOpen}
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar
          </Button>
        }
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar>
          {isSuperAdmin && allSchools.length > 0 && (
            <Select
              value={selectedSchoolId ?? '__none__'}
              onValueChange={(v) => setSelectedSchoolId(v === '__none__' ? null : v)}
            >
              <SelectTrigger className="w-auto min-w-[200px] h-9">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" disabled>Selecione uma escola</SelectItem>
                {allSchools.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
            <SelectTrigger className="w-auto min-w-[160px] h-9" disabled={!effectiveSchoolId}>
              <SelectValue placeholder="Ano letivo" />
            </SelectTrigger>
            <SelectContent>
              {anosLetivos.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>
      </PageSection>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && mostraSelecaoEscola && (
        <PageSection variant="flush" title="Turmas">
          <div className="p-6">
            <EmptyState
              icon={GraduationCap}
              title="Selecione uma escola"
              description="Escolha uma escola para visualizar as turmas."
            />
          </div>
        </PageSection>
      )}

      {!loading && mostraSelecaoAno && (
        <PageSection variant="flush" title="Turmas">
          <div className="p-6">
            <EmptyState
              icon={GraduationCap}
              title="Selecione um ano letivo"
              description="Escolha um ano letivo para visualizar as turmas."
            />
          </div>
        </PageSection>
      )}

      {!loading && !mostraSelecaoEscola && !mostraSelecaoAno && turmasCards.length === 0 && (
        <PageSection variant="flush" title="Turmas">
          <div className="p-6">
            <EmptyState
              icon={SearchX}
              title="Nenhuma turma encontrada"
              description="Não há turmas cadastradas para este ano letivo."
            />
          </div>
        </PageSection>
      )}

      {!loading && turmasCards.length > 0 && (
        <PageSection
          variant="flush"
          title="Turmas"
          description={`${turmasCards.length} turma(s) encontrada(s)`}
          actions={
            <Button onClick={goCriar} disabled={isSuperAdmin && !selectedSchoolId}>
              <Plus className="h-4 w-4 mr-1.5" />
              Novo Plano de Ensino
            </Button>
          }
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {turmasCards.map(turma => (
                <Card
                  key={turma.id}
                  className="flex flex-col hover:shadow-md transition-all border-border hover:border-primary/30"
                >
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-semibold text-foreground truncate">{turma.nome}</p>
                        <p className="text-[13px] text-muted-foreground truncate">
                          {turma.etapa_nome}{turma.subetapa_nome ? ` — ${turma.subetapa_nome}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {turma.etapa_nome}
                      </Badge>
                      {turma.totalPlanos === 0 ? (
                        <StatusBadge status="warning">Sem plano de ensino</StatusBadge>
                      ) : (
                        <StatusBadge status="success">
                          {turma.totalPlanos} plano{turma.totalPlanos === 1 ? '' : 's'}
                        </StatusBadge>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-[13px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-primary/70" />
                        <span>
                          {turma.totalPlanos === 0
                            ? 'Nenhum plano criado'
                            : `${turma.totalPlanos} plano(s) de ensino criado(s)`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-primary/70" />
                        <span>
                          {turma.ultimaAtualizacao
                            ? `Atualizado em ${formatarDataBR(turma.ultimaAtualizacao)}`
                            : 'Sem atualizações'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full h-10 text-[13px]"
                        onClick={() => abrirTurma(turma.id)}
                      >
                        Acessar Plano de Ensino
                        <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </PageSection>
      )}
    </PageContainer>
  )
}
