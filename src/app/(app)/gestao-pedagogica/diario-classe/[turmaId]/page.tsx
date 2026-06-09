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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, Users, BookOpen, GraduationCap, Hash, Calendar, ClipboardCheck, FileText, BarChart3, Calculator, ExternalLink } from 'lucide-react'
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
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/gestao-pedagogica/diario-classe')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-8 w-96 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <>
            {/* Card Principal da Turma */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{turmaInfo?.nome}</h2>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {turmaInfo?.ano_letivo_descricao && (
                        <p className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Ano Letivo: {turmaInfo.ano_letivo_descricao}
                        </p>
                      )}
                      {turmaInfo?.etapa_nome && (
                        <p className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Etapa: {turmaInfo.etapa_nome}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Alunos: {turmaInfo?.total_alunos || alunos.length} / {turmaInfo?.capacidade_alunos || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:items-end md:justify-center">
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
                </div>

                {disciplinas.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
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
              </CardContent>
            </Card>

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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alunos Matriculados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-xs text-muted-foreground uppercase tracking-wider">
                            <th className="text-left py-2 px-2 w-12">#</th>
                            <th className="text-left py-2 px-2">Nome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alunos.filter(a => !a.data_saida).map((aluno, idx) => (
                            <tr key={aluno.id} className="border-b border-border hover:bg-muted/40">
                              <td className="py-2 px-2 text-sm text-muted-foreground">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-2 text-sm font-medium">{aluno.nome_completo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="frequencia">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {criterioFrequencia === 'por_aula' ? 'Frequência por Aula' : 'Frequência por Dia'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {criterioFrequencia === 'por_aula' ? (
                      <FrequenciaPorAula turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} />
                    ) : (
                      <FrequenciaPorDia turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="parecer">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parecer Descritivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ParecerDescritivo
                      turmaId={turmaId}
                      alunos={alunos}
                      quantidadePeriodosParecer={quantidadePeriodosParecer}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="indicadores">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Avaliação por Indicadores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AvaliacaoIndicadores
                      turmaId={turmaId}
                      alunos={alunos}
                      disciplinas={disciplinas}
                      quantidadePeriodosNivel={quantidadePeriodosNivel}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notas">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Avaliações Numéricas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AvaliacoesNumericas
                      turmaId={turmaId}
                      alunos={alunos}
                      disciplinas={disciplinas}
                      quantidadePeriodosNumerico={quantidadePeriodosNumerico}
                      metodoId={metodo?.id}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="plano-aula">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plano de Aula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlanoAulaDiario turmaId={turmaId} disciplinas={disciplinas} pessoaId={pessoaId} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
  )
}
