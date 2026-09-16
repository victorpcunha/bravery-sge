'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getTurmasDaPessoa, getSituacaoMatricula, type PessoaResumida, type TurmaResumida } from '@/lib/actions/painel-pessoa'
import FiltroPessoa from '@/components/painel-pessoa/filtro-pessoa'
import CardIdentificacao from '@/components/painel-pessoa/card-identificacao'
import CardSaude from '@/components/painel-pessoa/card-saude'
import CardKpis from '@/components/painel-pessoa/card-kpis'
import CardDesempenhoDisciplina from '@/components/painel-pessoa/card-desempenho-disciplina'
import CardEvolucao from '@/components/painel-pessoa/card-evolucao'
import CardQuadroAulas from '@/components/painel-pessoa/card-quadro-aulas'
import CardHistorico from '@/components/painel-pessoa/card-historico'
import CardOcorrencias from '@/components/painel-pessoa/card-ocorrencias'
import ModalHistoricoManual from '@/components/painel-pessoa/modal-historico-manual'
import { PainelTabs } from '@/components/painel-pessoa/painel-tabs'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PainelAlunoPage() {
  const router = useRouter()
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaResumida | null>(null)
  const [turmas, setTurmas] = useState<TurmaResumida[]>([])
  const [turmaId, setTurmaId] = useState<string>('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)
  const [situacao, setSituacao] = useState<string | null>(null)
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false)
  const [historicoRefreshKey, setHistoricoRefreshKey] = useState(0)
  const [escolaFiltro, setEscolaFiltro] = useState('')

  const effectiveSchoolId = isSuperAdmin ? (escolaFiltro || null) : schoolId

  useEffect(() => {
    if (isSuperAdmin && allSchools.length === 1 && !escolaFiltro) {
      setEscolaFiltro(allSchools[0].id)
    }
  }, [isSuperAdmin, allSchools, escolaFiltro])

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (permLoaded && !pode.visualizar('gestao-usuarios.painel-aluno')) {
      toast.error('Acesso negado')
      router.push('/gestao-usuarios')
    }
  }, [permLoaded, pode, router])

  const handleSelectEscola = (escolaId: string) => {
    setEscolaFiltro(escolaId)
    setPessoaSelecionada(null)
    setTurmas([])
    setTurmaId('')
    setSituacao(null)
  }

  const handleSelectPessoa = async (pessoa: PessoaResumida) => {
    setPessoaSelecionada(pessoa)
    setLoadingTurmas(true)
    try {
      const data = await getTurmasDaPessoa(pessoa.id, effectiveSchoolId, pessoaId)
      setTurmas(data)
      if (data.length === 1) {
        setTurmaId(data[0].id)
      } else {
        setTurmaId('')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao carregar turmas')
      setTurmas([])
    } finally {
      setLoadingTurmas(false)
    }
  }

  useEffect(() => {
    if (!pessoaSelecionada || !turmaId) {
      setSituacao(null)
      return
    }
    getSituacaoMatricula(pessoaSelecionada.id, turmaId, pessoaId)
      .then(setSituacao)
      .catch(() => setSituacao(null))
  }, [pessoaSelecionada, turmaId, pessoaId])

  if (authLoading || !permLoaded) {
    return (
      <PageContainer>
        <PageHeader title="Painel do Aluno" description="Visualização completa do aluno" icon={User} />
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      </PageContainer>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const canSearch = isSuperAdmin ? !!escolaFiltro : !!schoolId
  const turmaSelecionadaNome = turmas.find(t => t.id === turmaId)?.nome || null
  const hasTurma = !!turmaId

  return (
    <PageContainer>
      <PageHeader
        title="Painel do Aluno"
        description="Visualização completa do aluno"
        icon={User}
      />

      {(isSuperAdmin || !!schoolId) && (
        <PageSection variant="compact" title="Busca" className="mb-6">
          <div className={isSuperAdmin ? 'grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_1fr]' : 'grid grid-cols-1 sm:grid-cols-5 gap-4'}>
            {isSuperAdmin && allSchools.length > 0 && (
              <div>
                <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
                  Unidade Escolar
                </Label>
                <Select value={escolaFiltro} onValueChange={handleSelectEscola}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade escolar" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSchools.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome_escola}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className={isSuperAdmin ? undefined : 'sm:col-span-3'}>
              <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
                Aluno
              </Label>
              <FiltroPessoa
                schoolId={effectiveSchoolId}
                pessoaLogadaId={pessoaId}
                onSelect={handleSelectPessoa}
                selectedId={pessoaSelecionada?.id}
                disabled={!canSearch}
              />
              {isSuperAdmin && !escolaFiltro && (
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Selecione uma unidade escolar para buscar o aluno.
                </p>
              )}
            </div>
            <div className={isSuperAdmin ? undefined : 'sm:col-span-2'}>
              <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
                Turma
              </Label>
              {loadingTurmas ? (
                <div className="h-9 flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-[14px]">Carregando turmas...</span>
                </div>
              ) : pessoaSelecionada && turmas.length > 0 ? (
                <Select value={turmaId} onValueChange={setTurmaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nome} — {t.etapa_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </Select>
              )}
            </div>
          </div>

          {pessoaSelecionada && turmas.length === 0 && !loadingTurmas && (
            <div className="mt-4">
              <EmptyState
                icon={User}
                title="Aluno sem matrícula ativa"
                description="Não há matrículas ativas no ano letivo vigente para este aluno."
              />
            </div>
          )}
        </PageSection>
      )}

      {pessoaSelecionada && (
        <PainelTabs hasTurma={hasTurma}>
          {/* Aba: Visão Geral */}
          <div className="space-y-6">
            <PageSection title="Identificação">
              <CardIdentificacao
                pessoaId={pessoaSelecionada.id}
                pessoaLogadaId={pessoaId}
                situacao={situacao}
                turmaNome={turmaSelecionadaNome}
              />
            </PageSection>

            <PageSection title="Saúde">
              <CardSaude pessoaId={pessoaSelecionada.id} schoolId={effectiveSchoolId} pessoaLogadaId={pessoaId} />
            </PageSection>

            {hasTurma ? (
              <PageSection title="Indicadores">
                <CardKpis
                  pessoaId={pessoaSelecionada.id}
                  turmaId={turmaId}
                  schoolId={effectiveSchoolId}
                  pessoaLogadaId={pessoaId}
                />
              </PageSection>
            ) : (
              <PageSection title="Indicadores">
                <EmptyState
                  icon={User}
                  title="Selecione uma turma"
                  description="Os indicadores (frequência, desempenho, disciplinas, ocorrências) aparecem quando uma turma é selecionada."
                />
              </PageSection>
            )}
          </div>

          {/* Aba: Desempenho */}
          {hasTurma ? (
            <div className="grid grid-cols-1 gap-6">
              <PageSection title="Desempenho por Disciplina">
                <CardDesempenhoDisciplina
                  pessoaId={pessoaSelecionada.id}
                  turmaId={turmaId}
                  pessoaLogadaId={pessoaId}
                />
              </PageSection>
              <PageSection title="Evolução do Desempenho">
                <CardEvolucao
                  pessoaId={pessoaSelecionada.id}
                  turmaId={turmaId}
                  pessoaLogadaId={pessoaId}
                />
              </PageSection>
            </div>
          ) : (
            <EmptyState
              icon={User}
              title="Selecione uma turma"
              description="O desempenho por disciplina e a evolução aparecem quando uma turma é selecionada."
            />
          )}

          {/* Aba: Acadêmico */}
          {hasTurma ? (
            <PageSection title="Quadro de Aulas">
              <CardQuadroAulas turmaId={turmaId} pessoaLogadaId={pessoaId} />
            </PageSection>
          ) : (
            <EmptyState
              icon={User}
              title="Selecione uma turma"
              description="O quadro de aulas da turma aparece quando uma turma é selecionada."
            />
          )}

          {/* Aba: Histórico */}
          <div className="space-y-6">
            <PageSection
              title="Histórico Escolar"
              actions={
                <Button
                  variant="outline"
                  className="gap-1 h-9"
                  onClick={() => setHistoricoModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Histórico
                </Button>
              }
            >
              <CardHistorico
                pessoaId={pessoaSelecionada.id}
                pessoaLogadaId={pessoaId}
                refreshKey={historicoRefreshKey}
              />
            </PageSection>

            {hasTurma ? (
              <PageSection title="Ocorrências">
                <CardOcorrencias pessoaId={pessoaSelecionada.id} schoolId={effectiveSchoolId!} pessoaLogadaId={pessoaId} />
              </PageSection>
            ) : (
              <PageSection title="Ocorrências">
                <EmptyState
                  icon={User}
                  title="Selecione uma turma"
                  description="As ocorrências registradas aparecem quando uma turma é selecionada."
                />
              </PageSection>
            )}
          </div>
        </PainelTabs>
      )}

      {pessoaSelecionada && (
        <ModalHistoricoManual
          open={historicoModalOpen}
          onClose={() => setHistoricoModalOpen(false)}
          onSuccess={() => setHistoricoRefreshKey(k => k + 1)}
          personId={pessoaSelecionada.id}
          schoolId={effectiveSchoolId}
          pessoaLogadaId={pessoaId}
        />
      )}

      {!pessoaSelecionada && canSearch && (
        <EmptyState
          icon={User}
          title="Selecione um aluno"
          description="Digite pelo menos 3 caracteres (nome ou CPF) para buscar."
        />
      )}

      {!pessoaSelecionada && !canSearch && isSuperAdmin && (
        <EmptyState
          icon={User}
          title="Selecione uma unidade escolar"
          description="Escolha uma unidade escolar no filtro acima para buscar o aluno."
        />
      )}

      {!pessoaSelecionada && !canSearch && !isSuperAdmin && (
        <EmptyState
          icon={User}
          title="Painel do Aluno"
          description="Você não possui escola vinculada."
        />
      )}
    </PageContainer>
  )
}
