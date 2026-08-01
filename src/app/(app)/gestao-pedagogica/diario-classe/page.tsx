'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { listarTurmasDiario, type TurmaDiario } from '@/lib/actions/diario-classe'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getEtapasEnsino, type EtapaEnsino } from '@/lib/actions/etapas-ensino'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { BookOpen, Users, GraduationCap, ArrowRight, SearchX } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'

const TURNOS = ['Matutino', 'Vespertino', 'Noturno', 'Integral'] as const

const etapaTipoLabels: Record<string, string> = {
  infantil: 'Educação Infantil',
  fundamental_inicial: 'Fundamental (Anos Iniciais)',
  fundamental_final: 'Fundamental (Anos Finais)',
  fundamental_outros: 'Fundamental (Outros)',
  medio: 'Ensino Médio',
  eja: 'EJA',
}

const turnoBadgeStyles: Record<string, string> = {
  Matutino: 'bg-primary/10 text-primary border-primary/20',
  Vespertino: 'bg-warning/10 text-warning border-warning/20',
  Noturno: 'bg-accent/10 text-accent border-accent/20',
  Integral: 'bg-success/10 text-success border-success/20',
}

export default function DiarioClassePage() {
  const router = useRouter()
  const { user, schoolId, isSuperAdmin, allSchools } = useAuth()
  const [anoLetivoId, setAnoLetivoId] = useState<string>('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<TurmaDiario[]>([])
  const [loading, setLoading] = useState(true)
  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [etapaFiltro, setEtapaFiltro] = useState('')
  const [turnoFiltro, setTurnoFiltro] = useState('')
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId

  useEffect(() => {
    getAnosLetivosAtivos(effectiveSchoolId).then(setAnosLetivos).catch(() => {})
  }, [effectiveSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId) return
    getEtapasEnsino(effectiveSchoolId).then(setEtapas).catch(() => {})
  }, [effectiveSchoolId])

  const etapaTiposUnicos = useMemo(() => {
    const seen = new Set<string>()
    return etapas.filter(e => {
      if (seen.has(e.etapa_tipo)) return false
      seen.add(e.etapa_tipo)
      return true
    })
  }, [etapas])

  const loadTurmas = useCallback(async () => {
    if (!permLoaded || !anoLetivoId) return
    setLoading(true)
    try {
      const data = await listarTurmasDiario(effectiveSchoolId, pessoaId, anoLetivoId, {
        searchNome: search || undefined,
        etapaTipo: etapaFiltro || undefined,
        turno: turnoFiltro || undefined,
      })
      setTurmas(data)
    } catch {
      toast.error('Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }, [effectiveSchoolId, pessoaId, anoLetivoId, search, etapaFiltro, turnoFiltro, permLoaded])

  useEffect(() => {
    loadTurmas()
  }, [loadTurmas])

  useEffect(() => {
    setAnoLetivoId('')
  }, [effectiveSchoolId])

  const filtrosAtivos = search.trim() !== '' || etapaFiltro !== '' || turnoFiltro !== ''

  const limparFiltros = () => {
    setSearch('')
    setEtapaFiltro('')
    setTurnoFiltro('')
  }

  return (
    <PageContainer>
      <PageHeader
        title="Diário de Classe"
        description="Selecione uma turma para registrar frequência e avaliações"
        icon={BookOpen}
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar turma por nome..."
        >
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
            <SelectTrigger className="w-auto min-w-[160px] h-9">
              <SelectValue placeholder="Ano letivo" />
            </SelectTrigger>
            <SelectContent>
              {anosLetivos.map((a: any) => (
                <SelectItem key={a.id} value={a.id}>{a.descricao || a.ano}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={etapaFiltro} onValueChange={(v) => setEtapaFiltro(v === '__all__' ? '' : v)}>
            <SelectTrigger className="w-auto min-w-[180px] h-9">
              <SelectValue placeholder="Etapa de ensino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas as etapas</SelectItem>
              {etapaTiposUnicos.map(e => (
                <SelectItem key={e.etapa_tipo} value={e.etapa_tipo}>
                  {etapaTipoLabels[e.etapa_tipo] || e.etapa_tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={turnoFiltro} onValueChange={(v) => setTurnoFiltro(v === '__all__' ? '' : v)}>
            <SelectTrigger className="w-auto min-w-[150px] h-9">
              <SelectValue placeholder="Turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos os turnos</SelectItem>
              {TURNOS.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterBar>
      </PageSection>

      {!anoLetivoId && !loading && (
        <Card className="shadow-sm">
          <EmptyState
            icon={GraduationCap}
            title="Selecione um ano letivo"
            description="Escolha um ano letivo para visualizar as turmas disponíveis."
          />
        </Card>
      )}

      {loading && anoLetivoId && (
        <Card className="shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-36 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </Card>
      )}

      {!loading && anoLetivoId && turmas.length === 0 && (
        <Card className="shadow-sm">
          {filtrosAtivos ? (
            <EmptyState
              icon={SearchX}
              title="Nenhuma turma com esses filtros"
              description="Tente ajustar a busca ou os filtros para encontrar turmas."
              action={
                <Button variant="outline" onClick={limparFiltros}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="Nenhuma turma encontrada"
              description="Não há turmas cadastradas para este ano letivo."
            />
          )}
        </Card>
      )}

      {!loading && turmas.length > 0 && (
        <PageSection
          variant="flush"
          title={`${turmas.length} turma(s) encontrada(s)`}
        >
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {turmas.map(turma => (
                <div
                  key={turma.id}
                  className="rounded-xl border border-border bg-card shadow-xs p-5 hover:shadow-md transition-all hover:border-primary/30 group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-[16px] font-semibold text-foreground truncate">
                          {turma.nome}
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[11px] font-semibold shrink-0 border',
                          turnoBadgeStyles[turma.turno] || 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        {turma.turno}
                      </Badge>
                    </div>

                    <Badge variant="secondary" className="text-[11px] font-medium w-fit mb-3">
                      {turma.etapa_nome}
                    </Badge>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                      <Users className="h-4 w-4" />
                      <span className="tabular-nums font-medium">{turma.total_alunos}</span>
                      <span>aluno(s) matriculado(s)</span>
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full text-[13px]"
                        onClick={() => router.push(`/gestao-pedagogica/diario-classe/${turma.id}`)}
                      >
                        Acessar Diário
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageSection>
      )}
    </PageContainer>
  )
}