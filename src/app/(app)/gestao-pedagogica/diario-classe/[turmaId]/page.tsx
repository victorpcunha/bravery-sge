'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAlunosDaTurmaComPeriodo, getDisciplinasDiario, gerarNumeroChamada, getMetodoAvaliacaoDaTurma, getTurmaDiarioInfo, getFrequenciasAlunosTurma, type AlunoMatriculado, type TurmaDiarioInfo } from '@/lib/actions/diario-classe'
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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Search, Users, BookOpen, GraduationCap, Hash, Calendar, ClipboardCheck, FileText, BarChart3, Calculator, Info, Lock, LockOpen } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/feedback/status-badge'
import { labelSituacaoMatricula, variantSituacaoMatricula } from '@/lib/situacoes-matricula'

const turnoBadgeStyles: Record<string, string> = {
  Matutino: 'bg-primary/10 text-primary border-primary/20',
  Vespertino: 'bg-warning/10 text-warning border-warning/20',
  Noturno: 'bg-accent/10 text-accent border-accent/20',
  Integral: 'bg-success/10 text-success border-success/20',
}

export default function TurmaDiarioPage() {
  const params = useTabParams()
  const router = useRouter()
  const turmaId = params.turmaId as string
  const { user, schoolId } = useAuth()
  const [turmaInfo, setTurmaInfo] = useState<TurmaDiarioInfo | null>(null)
  const [alunos, setAlunos] = useState<AlunoMatriculado[]>([])
  const [disciplinas, setDisciplinas] = useState<any[]>([])
  const [metodo, setMetodo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [confirmChamadaOpen, setConfirmChamadaOpen] = useState(false)
  const [confirmDesfazerOpen, setConfirmDesfazerOpen] = useState(false)
  const [desfazendo, setDesfazendo] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('alunos')
  const [alunosSearch, setAlunosSearch] = useState('')
  const [alunosPage, setAlunosPage] = useState(1)
  const ITENS_POR_PAGINA = 10

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  const carregarAlunosComFrequencia = useCallback(async (criterioFrequencia?: string) => {
    const lista = await getAlunosDaTurmaComPeriodo(turmaId, pessoaId)
    if (lista.length > 0 && criterioFrequencia) {
      const frequencias = await getFrequenciasAlunosTurma(turmaId, criterioFrequencia, pessoaId).catch(() => [])
      const freqMap = new Map(frequencias.map(f => [f.aluno_id, f.frequencia]))
      lista.forEach(a => { a.frequencia = freqMap.get(a.id) ?? null })
    }
    return lista
  }, [turmaId, pessoaId])

  useEffect(() => {
    if (!turmaId) return
    setLoading(true)

    const carregar = async () => {
      try {
        const [info, disciplinasData, metodoData] = await Promise.all([
          getTurmaDiarioInfo(turmaId, pessoaId).catch(() => null),
          getDisciplinasDiario(turmaId, pessoaId).catch(() => []),
          getMetodoAvaliacaoDaTurma(turmaId).catch(() => null),
        ])
        setTurmaInfo(info)
        setAlunos(await carregarAlunosComFrequencia(metodoData?.criterio_frequencia))
        setDisciplinas(disciplinasData)
        setMetodo(metodoData)
      } catch {
        toast.error('Erro ao carregar dados da turma')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [turmaId, pessoaId, carregarAlunosComFrequencia])

  const handleGerarChamada = async () => {
    setGerando(true)
    try {
      const total = await gerarNumeroChamada(turmaId, pessoaId)
      toast.success(`Numeração de chamada gerada para ${total} ${total === 1 ? 'aluno' : 'alunos'}`)
      setAlunos(await carregarAlunosComFrequencia(metodo?.criterio_frequencia))
    } catch {
      toast.error('Erro ao gerar chamada')
    } finally {
      setGerando(false)
      setConfirmChamadaOpen(false)
    }
  }

  const handleDesfazerFechamento = async () => {
    setDesfazendo(true)
    try {
      const { desfazerFechamento } = await import('@/lib/actions/fechamento-turma')
      const res = await desfazerFechamento(turmaId, pessoaId)
      toast.success(`Fechamento desfeito. ${res.total} aluno(s) retornaram para "Em andamento".`)
      setConfirmDesfazerOpen(false)
      const info = await getTurmaDiarioInfo(turmaId, pessoaId).catch(() => null)
      setTurmaInfo(info)
      setAlunos(await carregarAlunosComFrequencia(metodo?.criterio_frequencia))
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao desfazer fechamento')
    } finally {
      setDesfazendo(false)
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
  const registroGeralParecer = metodo?.registro_geral === true
  const temIndicador = isTipoAtivo('nivel')
  const quantidadePeriodosNivel = metodo?.quantidade_periodos_nivel || 4
  const temNota = isTipoAtivo('numerico')
  const quantidadePeriodosNumerico = metodo?.quantidade_periodos_numerico || 4
  const frecuenciaMinima = Number(metodo?.frecuencia_minima) || 75

  const turmaFechada = turmaInfo?.fechada === true
  const readOnly = turmaFechada
  const podeFechar = pode.editar('gestao-pedagogica.fechamento.fechar')
  const podeDesfazer = pode.editar('gestao-pedagogica.fechamento.desfazer')

  const alunosFiltrados = useMemo(() => {
    if (!alunosSearch.trim()) return alunos.filter(a => !a.data_saida)
    const termo = alunosSearch.toLowerCase()
    return alunos.filter(a => !a.data_saida && a.nome_completo.toLowerCase().includes(termo))
  }, [alunos, alunosSearch])

  const totalPaginas = Math.max(1, Math.ceil(alunosFiltrados.length / ITENS_POR_PAGINA))
  const alunosPaginados = useMemo(() => {
    const inicio = (alunosPage - 1) * ITENS_POR_PAGINA
    return alunosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)
  }, [alunosFiltrados, alunosPage])

  useEffect(() => { setAlunosPage(1) }, [alunosSearch])

  function calcularIdade(dataNascimento: string | null | undefined): string {
    if (!dataNascimento) return '—'
    const nasc = new Date(dataNascimento)
    const hoje = new Date()
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const mes = hoje.getMonth() - nasc.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--
    return `${idade} anos`
  }

  function formatarData(data: string | null | undefined): string {
    if (!data) return '—'
    const d = new Date(data)
    return d.toLocaleDateString('pt-BR')
  }

  return (
    <PageContainer>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-80 rounded-lg" />
          <Skeleton className="h-6 w-64 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <>
          <PageHeader
            title={turmaInfo?.nome || 'Diário de Classe'}
            description={turmaInfo?.ano_letivo_descricao ? `Ano Letivo: ${turmaInfo.ano_letivo_descricao}` : undefined}
            icon={GraduationCap}
            actions={
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" onClick={() => setConfirmChamadaOpen(true)} disabled={gerando || turmaFechada}>
                  <Hash className="h-4 w-4 mr-1.5" />
                  {gerando ? 'Gerando...' : 'Gerar Chamada'}
                </Button>
                {turmaInfo?.quadro_aula_id && (
                  <Button variant="outline" size="sm" onClick={() => router.push(`/gestao-turmas/quadro-aulas/cadastro?id=${turmaInfo.quadro_aula_id}`)}>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Ver Quadro de Horários
                  </Button>
                )}
              </div>
            }
          />

          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-foreground">{turmaInfo?.nome}</h2>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{turmaInfo?.ano_letivo_descricao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {turmaInfo?.turno && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[12px] font-semibold border',
                        turnoBadgeStyles[turmaInfo.turno] || 'bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {turmaInfo.turno}
                    </Badge>
                  )}
                  <span className="text-[13px] text-muted-foreground tabular-nums">
                    {turmaInfo?.total_alunos || alunos.length}/{turmaInfo?.capacidade_alunos || '?'} alunos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[12px] font-medium">
                  {turmaInfo?.etapa_nome}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {metodo?.nome && (
                    <Badge variant="outline" className="text-[12px] font-medium text-muted-foreground">
                      Método: {metodo.nome}
                    </Badge>
                  )}
                  {turmaFechada && (
                    <Badge variant="outline" className="text-[12px] font-semibold bg-muted text-muted-foreground border-border">
                      <Lock className="h-3 w-3 mr-1" />
                      Fechada em {turmaInfo?.data_fechamento ? formatarData(turmaInfo.data_fechamento) : ''}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!turmaFechada && podeFechar && (
                    <Button size="sm" onClick={() => router.push(`/gestao-pedagogica/diario-classe/${turmaId}/fechamento`)}>
                      <ClipboardCheck className="h-4 w-4 mr-1.5" />
                      Fechar Turma
                    </Button>
                  )}
                  {turmaFechada && podeDesfazer && (
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmDesfazerOpen(true)}>
                      <LockOpen className="h-4 w-4 mr-1.5" />
                      Desfazer Fechamento
                    </Button>
                  )}
                </div>
              </div>

              {disciplinas.length > 0 && (
                <>
                  <hr className="border-border" />
                  <div>
                    <p className="text-[13px] font-medium text-foreground mb-2">Disciplinas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {disciplinas.map(d => (
                        <Badge key={d.id} variant="outline" className="text-[11px] font-medium text-muted-foreground">
                          {d.nome_abreviado || d.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
            <TabsList className="mb-6 flex h-auto w-full min-h-[48px] gap-1 rounded-lg border border-border bg-card p-1 shadow-xs">
              <TabsTrigger value="alunos" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Alunos
                </span>
              </TabsTrigger>
              {criterioFrequencia === 'por_dia' && (
                <TabsTrigger value="frequencia" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Frequência por Dia
                  </span>
                </TabsTrigger>
              )}
              {criterioFrequencia === 'por_aula' && (
                <TabsTrigger value="frequencia" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Frequência por Aula
                  </span>
                </TabsTrigger>
              )}
              {temParecer && (
                <TabsTrigger value="parecer" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Parecer
                  </span>
                </TabsTrigger>
              )}
              {temIndicador && (
                <TabsTrigger value="indicadores" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Indicadores
                  </span>
                </TabsTrigger>
              )}
              {temNota && (
                <TabsTrigger value="notas" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Notas
                  </span>
                </TabsTrigger>
              )}
              <TabsTrigger value="plano-aula" className="group/tab h-10 min-h-[40px] flex-1 rounded-md px-4 text-[14px] font-semibold text-foreground/80 transition-colors hover:bg-accent/10 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Plano de Aula
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alunos">
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="p-4 pb-0">
                    <div className="relative max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={alunosSearch}
                        onChange={(e) => setAlunosSearch(e.target.value)}
                        placeholder="Buscar aluno por nome..."
                        className="h-9 w-full rounded-md border border-border bg-transparent pl-10 pr-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">#</TableHead>
                          <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Aluno</TableHead>
                          <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Idade</TableHead>
                          <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Data Matrícula</TableHead>
                          <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button type="button" className="inline-flex items-center gap-1 cursor-help">
                                    Frequência
                                    <Info className="h-3.5 w-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={6} className="max-w-[260px] text-left">
                                  <p className="text-[12px] leading-relaxed">
                                    Percentual calculado com base nos lançamentos de frequência de
                                    <span className="font-semibold"> todas as disciplinas </span>
                                    que o aluno cursa, ao longo de
                                    <span className="font-semibold"> todo o ano letivo</span>,
                                    de acordo com o período ativo da matrícula.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableHead>
                          <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alunosPaginados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                              Nenhum aluno encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          alunosPaginados.map((aluno, idx) => {
                            const inicio = (alunosPage - 1) * ITENS_POR_PAGINA
                            const freqVal = aluno.frequencia ?? null
                            const freqCor = freqVal !== null ? (freqVal >= frecuenciaMinima ? 'bg-success' : 'bg-destructive') : 'bg-muted'

                            return (
                              <TableRow key={aluno.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="text-[13px] text-muted-foreground tabular-nums align-top pt-4">
                                  {aluno.numero_chamada ?? inicio + idx + 1}
                                </TableCell>
                                <TableCell className="align-top pt-4">
                                  <p className="text-[14px] font-semibold text-foreground">{aluno.nome_completo}</p>
                                  <p className="text-[12px] text-muted-foreground mt-0.5">
                                    #{aluno.matricula_id.slice(0, 8)}
                                  </p>
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground tabular-nums align-top pt-4">
                                  {calcularIdade(aluno.data_nascimento)}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground tabular-nums align-top pt-4">
                                  {formatarData(aluno.data_matricula)}
                                </TableCell>
                                <TableCell className="align-top pt-4">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      'text-[14px] font-semibold tabular-nums min-w-[3ch]',
                                      freqVal !== null ? (freqVal >= frecuenciaMinima ? 'text-success' : 'text-destructive') : 'text-muted-foreground'
                                    )}>
                                      {freqVal !== null ? `${freqVal}%` : '—'}
                                    </span>
                                    <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                      <div
                                        className={cn('h-full rounded-full transition-all', freqCor)}
                                        style={{ width: freqVal !== null ? `${freqVal}%` : '0%' }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="align-top pt-4">
                                  <StatusBadge status={variantSituacaoMatricula(aluno.situacao)}>
                                    {labelSituacaoMatricula(aluno.situacao)}
                                  </StatusBadge>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="border-t border-border px-4 py-3 flex items-center justify-between text-[13px] text-muted-foreground">
                    <span>
                      Mostrando {alunosFiltrados.length === 0 ? 0 : (alunosPage - 1) * ITENS_POR_PAGINA + 1} a {Math.min(alunosPage * ITENS_POR_PAGINA, alunosFiltrados.length)} de {alunosFiltrados.length} resultados
                    </span>
                    {totalPaginas > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={alunosPage <= 1}
                          onClick={() => setAlunosPage(p => Math.max(1, p - 1))}
                          className="h-8 px-2 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          Anterior
                        </button>
                        <span className="text-[13px] tabular-nums">{alunosPage}/{totalPaginas}</span>
                        <button
                          type="button"
                          disabled={alunosPage >= totalPaginas}
                          onClick={() => setAlunosPage(p => Math.min(totalPaginas, p + 1))}
                          className="h-8 px-2 rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                        >
                          Próximo
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="frequencia">
              <PageSection
                title={criterioFrequencia === 'por_aula' ? 'Frequência por Aula' : 'Frequência por Dia'}
                variant="flush"
              >
                {criterioFrequencia === 'por_aula' ? (
                  <FrequenciaPorAula turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} readOnly={readOnly} />
                ) : (
                  <FrequenciaPorDia turmaId={turmaId} alunos={alunos} disciplinas={disciplinas} readOnly={readOnly} />
                )}
              </PageSection>
            </TabsContent>
            <TabsContent value="parecer">
              <PageSection title="Parecer Descritivo" variant="flush">
                <ParecerDescritivo
                  turmaId={turmaId}
                  alunos={alunos}
                  disciplinas={disciplinas}
                  quantidadePeriodosParecer={quantidadePeriodosParecer}
                  registroGeral={registroGeralParecer}
                  readOnly={readOnly}
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
                  readOnly={readOnly}
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
                  readOnly={readOnly}
                />
              </PageSection>
            </TabsContent>
            <TabsContent value="plano-aula">
              <PageSection title="Plano de Aula" variant="flush">
                <PlanoAulaDiario turmaId={turmaId} disciplinas={disciplinas} pessoaId={pessoaId} readOnly={readOnly} />
              </PageSection>
            </TabsContent>
          </Tabs>
        </>
      )}

      <ConfirmDialog
        open={confirmChamadaOpen}
        onOpenChange={v => { if (!v) setConfirmChamadaOpen(false) }}
        title="Gerar numeração de chamada?"
        description="Os alunos serão reorganizados em ordem alfabética e cada um receberá um número de chamada em sequência (1, 2, 3...). Atenção: alunos que entrarem na turma durante o ano letivo podem ficar com números que antes pertenciam a outros alunos."
        confirmLabel="Gerar chamada"
        cancelLabel="Cancelar"
        variant="warning"
        loading={gerando}
        onConfirm={handleGerarChamada}
      />

      <ConfirmDialog
        open={confirmDesfazerOpen}
        onOpenChange={v => { if (!v) setConfirmDesfazerOpen(false) }}
        title="Desfazer Fechamento da Turma?"
        description="A turma será reaberta, permitindo novamente registrar frequências e corrigir notas. As situações finais aplicadas no fechamento serão revertidas para 'Em andamento'. Esta ação fica registrada na auditoria, identificando o profissional responsável."
        confirmLabel="Desfazer Fechamento"
        cancelLabel="Cancelar"
        variant="destructive"
        loading={desfazendo}
        onConfirm={handleDesfazerFechamento}
      />
    </PageContainer>
  )
}
