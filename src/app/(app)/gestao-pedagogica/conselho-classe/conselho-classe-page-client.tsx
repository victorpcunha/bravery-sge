'use client'

import { useState, useCallback } from 'react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConselhoClasseFiltros, { type FiltrosConselho } from '@/components/conselho-classe/conselho-classe-filtros'
import ConselhoClasseTabela from '@/components/conselho-classe/conselho-classe-tabela'
import AprovacaoConselhoFiltros, { type FiltrosAprovacao } from '@/components/conselho-classe/aprovacao-conselho-filtros'
import AprovacaoConselhoTabela from '@/components/conselho-classe/aprovacao-conselho-tabela'
import {
  listarAlunosAbaixoMedia, listarAlunosReprovados, salvarNotaConselho,
  verificarPreRequisitos, type AlunoDesempenho, type AlunoReprovado,
} from '@/lib/actions/conselho-classe'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  schoolId: string
}

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

  const [preReqOk, setPreReqOk] = useState<boolean | null>(null)
  const [preReqErro, setPreReqErro] = useState<string | null>(null)

  const [filtrosAtuais, setFiltrosAtuais] = useState<{ turmaId: string; periodo: number } | null>(null)

  async function handleFilterConselho(filtros: FiltrosConselho) {
    setLoadingAlunos(true)
    setErrorAlunos(null)
    try {
      const preReq = await verificarPreRequisitos(filtros.turmaId)
      if (!preReq.ok) {
        setPreReqOk(false)
        setPreReqErro(preReq.erro || 'Pré-requisitos não atendidos')
        setLoadingAlunos(false)
        return
      }
      setPreReqOk(true)
      setPreReqErro(null)
      setFiltrosAtuais({ turmaId: filtros.turmaId, periodo: Number(filtros.periodo) })
      const data = await listarAlunosAbaixoMedia(
        schoolId, filtros.turmaId, Number(filtros.periodo), filtros.disciplinaId || undefined
      )
      setAlunos(data)
    } catch (e: any) {
      setErrorAlunos(e?.message || 'Erro ao carregar alunos')
    } finally {
      setLoadingAlunos(false)
    }
  }

  async function handleFilterAprovacao(filtros: FiltrosAprovacao) {
    setLoadingReprovados(true)
    setErrorReprovados(null)
    try {
      const preReq = await verificarPreRequisitos(filtros.turmaId)
      if (!preReq.ok) {
        setPreReqOk(false)
        setPreReqErro(preReq.erro || 'Pré-requisitos não atendidos')
        setLoadingReprovados(false)
        return
      }
      setPreReqOk(true)
      setPreReqErro(null)
      const data = await listarAlunosReprovados(schoolId, filtros.turmaId)
      setReprovados(data)
    } catch (e: any) {
      setErrorReprovados(e?.message || 'Erro ao carregar alunos reprovados')
    } finally {
      setLoadingReprovados(false)
    }
  }

  const handleSalvarNota = useCallback(async (
    alunoId: string,
    disciplinaId: string,
    field: 'nota_conselho' | 'parecer',
    value: string
  ) => {
    if (!pessoaId || !filtrosAtuais) return

    const result = await salvarNotaConselho(
      schoolId, filtrosAtuais.turmaId, disciplinaId, alunoId, filtrosAtuais.periodo,
      field === 'nota_conselho' ? (value === '' ? null : Number(value)) : undefined as any,
      field === 'parecer' ? (value === '' ? null : value) : undefined as any,
      pessoaId
    )

    if (!result.success) {
      toast.error(result.error || 'Erro ao salvar')
    }
  }, [schoolId, pessoaId, filtrosAtuais])

  if (!permLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!podeVisualizar) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Acesso Restrito</h2>
        <p className="text-sm text-muted-foreground">Você não tem permissão para acessar esta funcionalidade.</p>
      </div>
    )
  }

  if (preReqOk === false) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Conselho de Classe não disponível</h2>
        <p className="text-sm text-muted-foreground">{preReqErro}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Conselho de Classe</h1>
        <p className="text-muted-foreground mt-1">Avalie alunos abaixo da média por período e aprove por conselho</p>
      </div>

      <Tabs defaultValue="conselho">
        <TabsList>
          <TabsTrigger value="conselho">Conselho de Classe</TabsTrigger>
          <TabsTrigger value="aprovacao">Aprovação por Conselho de Classe</TabsTrigger>
        </TabsList>

        <TabsContent value="conselho" className="mt-6">
          <ConselhoClasseFiltros
            schoolId={schoolId}
            onFilter={handleFilterConselho}
            temPeriodo
          />
          <ConselhoClasseTabela
            alunos={alunos}
            loading={loadingAlunos}
            error={errorAlunos}
            onSalvarNota={handleSalvarNota}
            readonly={!podeEditar}
          />
        </TabsContent>

        <TabsContent value="aprovacao" className="mt-6">
          <AprovacaoConselhoFiltros
            schoolId={schoolId}
            onFilter={handleFilterAprovacao}
          />
          <AprovacaoConselhoTabela
            alunos={reprovados}
            loading={loadingReprovados}
            error={errorReprovados}
            schoolId={schoolId}
            pessoaId={pessoaId}
            readonly={!podeEditar}
            onToggle={() => handleFilterAprovacao({ anoLetivoId: '', turmaId: '' })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
