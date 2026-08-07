'use client'

import { useState, useCallback } from 'react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { ModernTabs, type ModernTabItem } from '@/components/ui/modern-tabs'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import ConselhoClasseFiltros, { type FiltrosConselho } from '@/components/conselho-classe/conselho-classe-filtros'
import ConselhoClasseTabela from '@/components/conselho-classe/conselho-classe-tabela'
import AprovacaoConselhoFiltros, { type FiltrosAprovacao } from '@/components/conselho-classe/aprovacao-conselho-filtros'
import AprovacaoConselhoTabela from '@/components/conselho-classe/aprovacao-conselho-tabela'
import {
  listarAlunosAbaixoMedia, listarAlunosReprovados, salvarNotaConselho,
  verificarPreRequisitos, type AlunoDesempenho, type AlunoReprovado,
} from '@/lib/actions/conselho-classe'
import { AlertCircle, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  schoolId: string | null
}

type PreReq = { ok: boolean; erro: string | null }

export default function ConselhoClassePageClient({ schoolId }: Props) {
  const { pode, loaded: permLoaded, pessoaId } = usePermissoes(schoolId)

  const podeEditar = pode.editar('gestao-pedagogica.conselho-classe')
  const podeVisualizar = pode.visualizar('gestao-pedagogica.conselho-classe')

  const [alunos, setAlunos] = useState<AlunoDesempenho[]>([])
  const [loadingAlunos, setLoadingAlunos] = useState(false)
  const [errorAlunos, setErrorAlunos] = useState<string | null>(null)

  const [reprovados, setReprovados] = useState<AlunoReprovado[]>([])
  const [loadingReprovados, setLoadingReprovados] = useState(false)
  const [errorReprovados, setErrorReprovados] = useState<string | null>(null)

  const [preReqConselho, setPreReqConselho] = useState<PreReq | null>(null)
  const [preReqAprovacao, setPreReqAprovacao] = useState<PreReq | null>(null)

  const [filtrosAtuais, setFiltrosAtuais] = useState<FiltrosConselho | null>(null)
  const [filtrosAprovacaoAtuais, setFiltrosAprovacaoAtuais] = useState<FiltrosAprovacao | null>(null)

  const handleFilterConselho = useCallback(async (filtros: FiltrosConselho) => {
    setLoadingAlunos(true)
    setErrorAlunos(null)
    try {
      if (!filtros.turmaId) {
        setPreReqConselho(null)
        setAlunos([])
        setLoadingAlunos(false)
        return
      }
      const preReq = await verificarPreRequisitos(filtros.turmaId)
      if (!preReq.ok) {
        setPreReqConselho({ ok: false, erro: preReq.erro || 'Pré-requisitos não atendidos' })
        setAlunos([])
        setLoadingAlunos(false)
        return
      }
      setPreReqConselho({ ok: true, erro: null })
      setFiltrosAtuais(filtros)
      const data = await listarAlunosAbaixoMedia(
        filtros.schoolId, filtros.turmaId, Number(filtros.periodo), filtros.disciplinaId || undefined
      )
      setAlunos(data)
    } catch (e: any) {
      setErrorAlunos(e?.message || 'Erro ao carregar alunos')
    } finally {
      setLoadingAlunos(false)
    }
  }, [])

  const handleFilterAprovacao = useCallback(async (filtros: FiltrosAprovacao) => {
    setLoadingReprovados(true)
    setErrorReprovados(null)
    try {
      if (!filtros.turmaId) {
        setPreReqAprovacao(null)
        setReprovados([])
        setLoadingReprovados(false)
        return
      }
      const preReq = await verificarPreRequisitos(filtros.turmaId)
      if (!preReq.ok) {
        setPreReqAprovacao({ ok: false, erro: preReq.erro || 'Pré-requisitos não atendidos' })
        setReprovados([])
        setLoadingReprovados(false)
        return
      }
      setPreReqAprovacao({ ok: true, erro: null })
      setFiltrosAprovacaoAtuais(filtros)
      const data = await listarAlunosReprovados(filtros.schoolId, filtros.turmaId)
      setReprovados(data)
    } catch (e: any) {
      setErrorReprovados(e?.message || 'Erro ao carregar alunos reprovados')
    } finally {
      setLoadingReprovados(false)
    }
  }, [])

  const atualizarAlunosSilencioso = useCallback(async () => {
    if (!filtrosAtuais || !filtrosAtuais.turmaId) return
    try {
      const data = await listarAlunosAbaixoMedia(
        filtrosAtuais.schoolId, filtrosAtuais.turmaId, Number(filtrosAtuais.periodo), filtrosAtuais.disciplinaId || undefined
      )
      setAlunos(data)
    } catch {
      // mantém os últimos dados carregados em caso de falha
    }
  }, [filtrosAtuais])

  const handleSalvarNota = useCallback(async (
    alunoId: string,
    disciplinaId: string,
    field: 'nota_conselho' | 'parecer',
    value: string
  ) => {
    if (!filtrosAtuais) return

    const result = await salvarNotaConselho(
      filtrosAtuais.schoolId, filtrosAtuais.turmaId, disciplinaId, alunoId, Number(filtrosAtuais.periodo),
      field === 'nota_conselho' ? (value === '' ? null : Number(value)) : undefined as any,
      field === 'parecer' ? (value === '' ? null : value) : undefined as any,
      pessoaId
    )

    if (!result.success) {
      toast.error(result.error || 'Erro ao salvar')
    } else {
      toast.success('Nota salva com sucesso')
      if (field === 'nota_conselho') {
        atualizarAlunosSilencioso()
      }
    }
  }, [pessoaId, filtrosAtuais, atualizarAlunosSilencioso])

  if (!permLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!podeVisualizar) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Acesso Restrito"
        description="Você não tem permissão para acessar esta funcionalidade."
      />
    )
  }

  const tabs: ModernTabItem[] = [
    { value: 'conselho', label: 'Conselho de Classe' },
    { value: 'aprovacao', label: 'Aprovação por Conselho de Classe' },
  ]

  return (
    <>
      <PageHeader
        title="Conselho de Classe"
        description="Avalie alunos abaixo da média por período e aprove por conselho"
        icon={GraduationCap}
      />

      <ModernTabs tabs={tabs}>
        <div className="space-y-6">
          <ConselhoClasseFiltros
            schoolId={schoolId}
            onFilter={handleFilterConselho}
            temPeriodo
          />

          {preReqConselho && !preReqConselho.ok ? (
            <EmptyState
              icon={AlertCircle}
              title="Conselho de Classe não disponível"
              description={preReqConselho.erro || ''}
            />
          ) : (
            <ConselhoClasseTabela
              alunos={alunos}
              loading={loadingAlunos}
              error={errorAlunos}
              onSalvarNota={handleSalvarNota}
              readonly={!podeEditar}
            />
          )}
        </div>

        <div className="space-y-6">
          <AprovacaoConselhoFiltros
            schoolId={schoolId}
            onFilter={handleFilterAprovacao}
          />

          {preReqAprovacao && !preReqAprovacao.ok ? (
            <EmptyState
              icon={AlertCircle}
              title="Aprovação por Conselho não disponível"
              description={preReqAprovacao.erro || ''}
            />
          ) : (
            <AprovacaoConselhoTabela
              alunos={reprovados}
              loading={loadingReprovados}
              error={errorReprovados}
              schoolId={filtrosAprovacaoAtuais?.schoolId ?? schoolId}
              pessoaId={pessoaId}
              readonly={!podeEditar}
              onToggle={() => filtrosAprovacaoAtuais && handleFilterAprovacao(filtrosAprovacaoAtuais)}
            />
          )}
        </div>
      </ModernTabs>
    </>
  )
}
