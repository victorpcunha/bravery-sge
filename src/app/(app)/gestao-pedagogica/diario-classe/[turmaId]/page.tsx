'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAlunosDaTurmaComPeriodo, getDisciplinasDiario, gerarNumeroChamada, getMetodoAvaliacaoDaTurma, getTurmaDiarioInfo, type AlunoMatriculado, type TurmaDiarioInfo } from '@/lib/actions/diario-classe'
import FrequenciaPorDia from '@/components/diario-classe/frequencia-por-dia'
import FrequenciaPorAula from '@/components/diario-classe/frequencia-por-aula'
import ParecerDescritivo from '@/components/diario-classe/parecer-descritivo'
import AvaliacaoIndicadores from '@/components/diario-classe/avaliacao-indicadores'
import AvaliacoesNumericas from '@/components/diario-classe/avaliacoes-numericas'
import PlanoAulaDiario from '@/components/diario-classe/plano-aula-diario'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, BookOpen, GraduationCap, Hash, Calendar, ClipboardCheck, FileText, BarChart3, Calculator, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export default function TurmaDiarioPage() {
  const params = useParams()
  const router = useRouter()
  const turmaId = params.turmaId as string
  const { user, schoolId } = useAuth()
  const [turmaInfo, setTurmaInfo] = useState<TurmaDiarioInfo | null>(null)
  const [alunos, setAlunos] = useState<AlunoMatriculado[]>([])
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [metodo, setMetodo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('alunos')

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (!turmaId) return
    setLoading(true)

    const carregar = async () => {
      try {
        const [info, alunosData, disciplinasData, metodoData] = await Promise.all([
          getTurmaDiarioInfo(turmaId, pessoaId).catch(() => null),
          getAlunosDaTurmaComPeriodo(turmaId, pessoaId).catch(() => []),
          getDisciplinasDiario(turmaId, pessoaId).catch(() => []),
          getMetodoAvaliacaoDaTurma(turmaId).catch(() => null),
        ])
        setTurmaInfo(info)
        setAlunos(alunosData)
        setDisciplinas(disciplinasData)
        setMetodo(metodoData)
      } catch {
        toast.error('Erro ao carregar dados da turma')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [turmaId, pessoaId])

  const handleGerarChamada = async () => {
    setGerando(true)
    try {
      const total = await gerarNumeroChamada(turmaId, pessoaId)
      toast.success(`Chamada gerada para ${total} alunos`)
      const alunosAtualizados = await getAlunosDaTurmaComPeriodo(turmaId, pessoaId)
      setAlunos(alunosAtualizados)
    } catch {
      toast.error('Erro ao gerar chamada')
    } finally {
      setGerando(false)
    }
  }

  const tiposAtivos = metodo?.tipos_avaliacao || {}
  const criterioFrequencia = metodo?.criterio_frequencia
  const isTipoAtivo = (tipo: string) => {
    const val = (tiposAtivos as any)[tipo]
    return val === true || val === 'true'
  }
  const temParecer = isTipoAtivo('parecer')
  const quantidadePeriodosParecer = metodo?.quantidade_periodos_parecer || 4
  const temIndicador = isTipoAtivo('nivel')
  const quantidadePeriodosNivel = metodo?.quantidade_periodos_nivel || 4
  const temNota = isTipoAtivo('numerico')
  const quantidadePeriodosNumerico = metodo?.quantidade_periodos_numerico || 4

  return (
    <PageContainer>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-8 w-96 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <>
          <PageHeader
            title={turmaInfo?.nome || 'Diário de Classe'}
            description={turmaInfo?.ano_letivo_descricao ? `Ano Letivo: ${turmaInfo.ano_letivo_descricao} · ${turmaInfo.etapa_nome || ''}` : undefined}
            icon={GraduationCap}
            breadcrumbs={[
              { label: 'Diário de Classe', href: '/gestao-pedagogica/diario-classe', icon: BookOpen },
              { label: turmaInfo?.nome || 'Turma' },
            ]}
            actions={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" onClick={handleGerarChamada} disabled={gerando}>
                  <Hash className="h-4 w-4 mr-1.5" />
                  {gerando ? 'Gerando...' : 'Gerar Chamada'}
                </Button>
                {turmaInfo?.quadro_aula_id && (
                  <Button variant="outline" size="sm" onClick={() => router.push(`/gestao-turmas/quadro-aulas/cadastro?id=${turmaInfo.quadro_aula_id}`)}>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Ver Quadro de Horários
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            }
          />

          <PageSection title="Informações da Turma" variant="compact" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Etapa: {turmaInfo?.etapa_nome}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Alunos: {turmaInfo?.total_alunos || alunos.length} / {turmaInfo?.capacidade_alunos || '—'}
                </p>
              </div>
            </div>

            {disciplinas.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Disciplinas
                </p>
                <div className="flex flex-wrap gap-2">
                  {disciplinas.map(d => (
                    <Badge key={d.id} variant="secondary" className="text-xs">
                      {d.nome_abreviado || d.nome}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </PageSection>

          {metodo && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Método de Avaliação: {metodo.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {criterioFrequencia === 'por_dia' && <Badge variant="secondary">Frequência por Dia</Badge>}
                  {criterioFrequencia === 'por_aula' && <Badge variant="secondary">Frequência por Aula</Badge>}
                  {isTipoAtivo('parecer') && <Badge variant="secondary">Parecer Descritivo</Badge>}
                  {isTipoAtivo('nivel') && <Badge variant="secondary">Avaliação por Indicadores</Badge>}
                  {isTipoAtivo('numerico') && <Badge variant="secondary">Avaliações Numéricas</Badge>}
                  {isTipoAtivo('conceito') && <Badge variant="secondary">Avaliação por Conceitos</Badge>}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="mb-4">
              <TabsTrigger value="alunos" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Alunos
              </TabsTrigger>
              {criterioFrequencia === 'por_dia' && (
                <TabsTrigger value="frequencia" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Frequência por Dia
                </TabsTrigger>
              )}
              {criterioFrequencia === 'por_aula' && (
                <TabsTrigger value="frequencia" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Frequência por Aula
                </TabsTrigger>
              )}
              {temParecer && (
                <TabsTrigger value="parecer" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Parecer
                </TabsTrigger>
              )}
              {temIndicador && (
                <TabsTrigger value="indicadores" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Indicadores
                </TabsTrigger>
              )}
              {temNota && (
                <TabsTrigger value="notas" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Notas
                </TabsTrigger>
              )}
              <TabsTrigger value="plano-aula" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Plano de Aula
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alunos">
              <PageSection title="Alunos Matriculados" variant="flush">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alunos.filter(a => !a.data_saida).map((aluno, idx) => (
                        <TableRow key={aluno.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="text-sm font-medium">{aluno.nome_completo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </PageSection>
            </TabsContent>

            <TabsContent value="frequencia">
              <PageSection
                title={criterioFrequencia === 'por_aula' ? 'Frequência por Aula' : 'Frequência por Dia'}
                variant="flush"
              >
                {criterioFrequencia === 'por_aula' ? (
                  <FrequenciaPorAula turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} />
                ) : (
                  <FrequenciaPorDia turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} />
                )}
              </PageSection>
            </TabsContent>
            <TabsContent value="parecer">
              <PageSection title="Parecer Descritivo" variant="flush">
                <ParecerDescritivo
                  turmaId={turmaId}
                  alunos={alunos}
                  quantidadePeriodosParecer={quantidadePeriodosParecer}
                />
              </PageSection>
            </TabsContent>
            <TabsContent value="indicadores">
              <PageSection title="Avaliação por Indicadores" variant="flush">
                <AvaliacaoIndicadores
                  turmaId={turmaId}
                  alunos={alunos}
                  disciplinas={disciplinas}
                  quantidadePeriodosNivel={quantidadePeriodosNivel}
                />
              </PageSection>
            </TabsContent>
            <TabsContent value="notas">
              <PageSection title="Avaliações Numéricas" variant="flush">
                <AvaliacoesNumericas
                  turmaId={turmaId}
                  alunos={alunos}
                  disciplinas={disciplinas}
                  quantidadePeriodosNumerico={quantidadePeriodosNumerico}
                  metodoId={metodo?.id}
                />
              </PageSection>
            </TabsContent>
            <TabsContent value="plano-aula">
              <PageSection title="Plano de Aula" variant="flush">
                <PlanoAulaDiario turmaId={turmaId} disciplinas={disciplinas} pessoaId={pessoaId} />
              </PageSection>
            </TabsContent>
          </Tabs>
        </>
      )}
    </PageContainer>
  )
}
