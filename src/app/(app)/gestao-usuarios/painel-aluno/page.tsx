'use client'

import { useState, useEffect } from 'react'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getFirstSchool } from '@/lib/actions/schools'
import { getTurmasDaPessoa, type PessoaResumida, type TurmaResumida } from '@/lib/actions/painel-pessoa'
import { Sidebar } from '@/components/layout/sidebar'
import FiltroPessoa from '@/components/painel-pessoa/filtro-pessoa'
import FiltroTurma from '@/components/painel-pessoa/filtro-turma'
import CardIdentificacao from '@/components/painel-pessoa/card-identificacao'
import CardSaude from '@/components/painel-pessoa/card-saude'
import CardDesempenho from '@/components/painel-pessoa/card-desempenho'
import CardQuadroAulas from '@/components/painel-pessoa/card-quadro-aulas'
import CardHistorico from '@/components/painel-pessoa/card-historico'
import CardOcorrencias from '@/components/painel-pessoa/card-ocorrencias'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, User, Users, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function PainelAlunoPage() {
  const router = useRouter()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaResumida | null>(null)
  const [turmas, setTurmas] = useState<TurmaResumida[]>([])
  const [turmaId, setTurmaId] = useState<string>('')
  const [loadingTurmas, setLoadingTurmas] = useState(false)

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (permLoaded && !pode.visualizar('gestao-usuarios.painel-aluno')) {
      toast.error('Acesso negado')
      router.push('/gestao-usuarios')
    }
  }, [permLoaded, pode, router])

  const handleSelectPessoa = async (pessoa: PessoaResumida) => {
    setPessoaSelecionada(pessoa)
    if (!schoolId) return
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
      <>
        <Sidebar />
        <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-200 rounded-lg" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/gestao-usuarios')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Painel do Aluno
        </h1>

        {/* Filtros */}
        {schoolId && (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
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
            </CardContent>
          </Card>
        )}

        {/* Cards independentes de turma (FASE 4) */}
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
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                Selecione um aluno para visualizar o painel completo.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Digite pelo menos 3 caracteres (nome ou CPF) para buscar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
