'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getTurmasDaPessoa, type PessoaResumida, type TurmaResumida } from '@/lib/actions/painel-pessoa'
import FiltroPessoa from '@/components/painel-pessoa/filtro-pessoa'
import FiltroTurma from '@/components/painel-pessoa/filtro-turma'
import CardIdentificacao from '@/components/painel-pessoa/card-identificacao'
import CardSaude from '@/components/painel-pessoa/card-saude'
import CardDesempenho from '@/components/painel-pessoa/card-desempenho'
import CardQuadroAulas from '@/components/painel-pessoa/card-quadro-aulas'
import CardHistorico from '@/components/painel-pessoa/card-historico'
import CardOcorrencias from '@/components/painel-pessoa/card-ocorrencias'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PainelAlunoPage() {
  const router = useRouter()
  const { schoolId } = useAuth()
  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaResumida | null>(null)
  const [turmas, setTurmas] = useState<TurmaResumida[]>([])
  const [turmaId, setTurmaId] = useState<string>('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)

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

  if (!permLoaded) {
    return (
      <PageContainer className="max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded-lg" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        title="Painel do Aluno"
        description="Visualização completa do aluno"
        icon={User}
        breadcrumbs={[
          { label: 'Gestão de Usuários', href: '/gestao-usuarios' },
          { label: 'Painel do Aluno' }
        ]}
      />

      {schoolId && (
        <PageSection variant="compact" title="Busca" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Aluno</label>
              <FiltroPessoa
                schoolId={schoolId}
                pessoaLogadaId={pessoaId}
                onSelect={handleSelectPessoa}
                selectedId={pessoaSelecionada?.id}
              />
            </div>

            {pessoaSelecionada && turmas.length > 1 && (
              <FiltroTurma
                turmas={turmas}
                selectedId={turmaId}
                onSelect={setTurmaId}
                loading={loadingTurmas}
              />
            )}

            {pessoaSelecionada && turmas.length === 0 && !loadingTurmas && (
              <p className="text-sm text-muted-foreground py-2">
                Aluno sem matrícula ativa no ano letivo vigente.
              </p>
            )}
          </div>
        </PageSection>
      )}

      {pessoaSelecionada && (
        <div className="mb-6">
          <CardIdentificacao pessoaId={pessoaSelecionada.id} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-6">
          {schoolId && (
            <CardSaude pessoaId={pessoaSelecionada.id} schoolId={schoolId} pessoaLogadaId={pessoaId} />
          )}
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-6">
          <CardDesempenho pessoaId={pessoaSelecionada.id} turmaId={turmaId} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-6">
          <CardQuadroAulas turmaId={turmaId} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-6">
          <CardHistorico pessoaId={pessoaSelecionada.id} schoolId={schoolId!} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {pessoaSelecionada && turmaId && (
        <div className="mb-6">
          <CardOcorrencias pessoaId={pessoaSelecionada.id} schoolId={schoolId!} pessoaLogadaId={pessoaId} />
        </div>
      )}

      {!pessoaSelecionada && (
        <EmptyState
          icon={User}
          title="Selecione um aluno"
          description="Digite pelo menos 3 caracteres (nome ou CPF) para buscar."
        />
      )}
    </PageContainer>
  )
}