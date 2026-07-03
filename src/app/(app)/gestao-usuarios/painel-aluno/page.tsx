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
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PainelAlunoPage() {
  const router = useRouter()
  const { user, loading: authLoading, schoolId, isSuperAdmin } = useAuth()
  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaResumida | null>(null)
  const [turmas, setTurmas] = useState<TurmaResumida[]>([])
  const [turmaId, setTurmaId] = useState<string>('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)
  const [situacao, setSituacao] = useState<string | null>(null)

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (permLoaded && !pode.visualizar('gestao-usuarios.painel-aluno')) {
      toast.error('Acesso negado')
      router.push('/gestao-usuarios')
    }
  }, [permLoaded, pode, router])

  const handleSelectPessoa = async (pessoa: PessoaResumida) => {
    setPessoaSelecionada(pessoa)
    setLoadingTurmas(true)
    try {
      const data = await getTurmasDaPessoa(pessoa.id, schoolId, pessoaId)
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
      <PageContainer className="max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded-lg" />
        </div>
      </PageContainer>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const canSearch = isSuperAdmin || !!schoolId

  const turmaSelecionadaNome = turmas.find(t => t.id === turmaId)?.nome || null

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title="Painel do Aluno"
        description="Visualização completa do aluno"
        icon={User}
      />

      {canSearch && (
        <PageSection variant="compact" title="Busca" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Aluno</label>
              <FiltroPessoa
                schoolId={schoolId}
                pessoaLogadaId={pessoaId}
                onSelect={handleSelectPessoa}
                selectedId={pessoaSelecionada?.id}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Turma</label>
              {loadingTurmas ? (
                <div className="h-9 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Carregando turmas...
                </div>
              ) : pessoaSelecionada && turmas.length > 0 ? (
                <Select value={turmaId} onValueChange={setTurmaId}>
                  <SelectTrigger size="sm" className="text-xs">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map(t => (
                      <SelectItem key={t.id} value={t.id} className="text-xs">
                        {t.nome} — {t.etapa_nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select disabled>
                  <SelectTrigger size="sm" className="text-xs">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </Select>
              )}
            </div>
          </div>

          {pessoaSelecionada && turmas.length === 0 && !loadingTurmas && (
            <p className="text-sm text-muted-foreground py-2 mt-2">
              Aluno sem matrícula ativa no ano letivo vigente.
            </p>
          )}
        </PageSection>
      )}

      {pessoaSelecionada && (
        <div className="mb-8">
          <CardIdentificacao
            pessoaId={pessoaSelecionada.id}
            pessoaLogadaId={pessoaId}
            situacao={situacao}
            turmaNome={turmaSelecionadaNome}
          />
        </div>
      )}

      {pessoaSelecionada && (
        <div className="mb-8">
          <CardSaude pessoaId={pessoaSelecionada.id} schoolId={schoolId} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-8">
          <CardKpis
            pessoaId={pessoaSelecionada.id}
            turmaId={turmaId}
            schoolId={schoolId}
            pessoaLogadaId={pessoaId}
          />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CardDesempenhoDisciplina
            pessoaId={pessoaSelecionada.id}
            turmaId={turmaId}
            pessoaLogadaId={pessoaId}
          />
          <CardEvolucao
            pessoaId={pessoaSelecionada.id}
            turmaId={turmaId}
            pessoaLogadaId={pessoaId}
          />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-8">
          <CardQuadroAulas turmaId={turmaId} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && (
        <div className="mb-8">
          <CardHistorico pessoaId={pessoaSelecionada.id} schoolId={schoolId!} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-8">
          <CardOcorrencias pessoaId={pessoaSelecionada.id} schoolId={schoolId!} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {!pessoaSelecionada && canSearch && (
        <EmptyState
          icon={User}
          title="Selecione um aluno"
          description="Digite pelo menos 3 caracteres (nome ou CPF) para buscar."
        />
      )}

      {!pessoaSelecionada && !canSearch && (
        <EmptyState
          icon={User}
          title="Painel do Aluno"
          description="Você não possui escola vinculada."
        />
      )}
    </PageContainer>
  )
}