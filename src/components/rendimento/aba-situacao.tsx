'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import {
  CircleCheck, TriangleAlert, OctagonAlert, TrendingUp, TrendingDown, Minus,
  Users, ChevronDown, ChevronUp, Loader2, User, Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import {
  getListaSituacao, getFiltrosSituacao, getDetalheAluno, getPeriodosRendimento,
  type ListaSituacao, type ResumoSituacao, type FiltrosSituacaoOpcoes, type DetalheAluno,
} from '@/lib/actions/rendimento'
import { ROTULOS_MOTIVO, type MotivoSituacao, type TendenciaAluno } from '@/lib/actions/rendimento-calculo'
import { fmtMedia, fmtPct, fmtInt } from './format'
import { toast } from 'sonner'

type Props = {
  ativo: boolean
  escolaId: string
  anoId: string
  pessoaId: string | null
  onResumo: (r: ResumoSituacao | null) => void
}

const POR_PAGINA = 10

const TENDENCIA: Record<TendenciaAluno, { label: string; icon: typeof Minus }> = {
  melhorando: { label: 'Melhorando', icon: TrendingUp },
  estavel: { label: 'Estável', icon: Minus },
  queda: { label: 'Em queda', icon: TrendingDown },
}

function FrequencyBar({ percent }: { percent: number | null }) {
  if (percent === null) {
    return <span className="text-[14px] text-muted-foreground">—</span>
  }
  const barClass = percent >= 75 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-destructive'
  const textClass = percent >= 75 ? 'text-success' : percent >= 50 ? 'text-warning' : 'text-destructive'
  return (
    <div className="flex items-center gap-2 min-w-[120px]" title={`Frequência: ${percent}%`}>
      <div className="h-1.5 w-16 sm:w-24 rounded-full bg-muted overflow-hidden" role="img" aria-label={`Frequência ${percent}%`}>
        <div className={cn('h-full rounded-full', barClass)} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className={cn('text-[13px] tabular-nums', textClass)}>{percent}%</span>
    </div>
  )
}

const LEGENDA = [
  {
    categoria: 'adequado' as const,
    titulo: 'Adequado',
    status: 'success' as const,
    icone: CircleCheck,
    texto: 'Média e frequência dentro do esperado: iguais ou acima do mínimo configurado no Método de Avaliação da turma, sem queda relevante entre períodos.',
    exemplo: 'Exemplo: turma com média mínima 6,0 e aluno com 7,5.',
  },
  {
    categoria: 'atencao' as const,
    titulo: 'Atenção',
    status: 'warning' as const,
    icone: TriangleAlert,
    texto: 'Média ou frequência próximos do limite (dentro da Faixa de Atenção configurada no Método de Avaliação) ou queda de 1,0 ponto ou mais entre períodos.',
    exemplo: 'Exemplo: mínima 6,0 e aluno com 6,2; ou caiu de 7,0 para 5,8.',
  },
  {
    categoria: 'risco' as const,
    titulo: 'Risco',
    status: 'destructive' as const,
    icone: OctagonAlert,
    texto: 'Situação crítica: média e/ou frequência abaixo do mínimo configurado no Método de Avaliação da turma.',
    exemplo: 'Exemplo: mínima 6,0 e aluno com 5,0; ou frequência 68% com mínimo de 75%.',
  },
]

export default function AbaSituacao({ ativo, escolaId, anoId, pessoaId, onResumo }: Props) {
  const [lista, setLista] = useState<ListaSituacao | null>(null)
  const [loading, setLoading] = useState(false)
  const [carregado, setCarregado] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [periodo, setPeriodo] = useState<number | null>(null)
  const [periodos, setPeriodos] = useState<{ ordem: number; nome: string }[]>([])
  const [etapa, setEtapa] = useState('todas')
  const [turma, setTurma] = useState('todas')
  const [disciplina, setDisciplina] = useState('todas')
  const [opcoes, setOpcoes] = useState<FiltrosSituacaoOpcoes>({ etapas: [], turmas: [], disciplinas: [] })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detalhes, setDetalhes] = useState<Record<string, { data: DetalheAluno | null; loading: boolean }>>({})

  useEffect(() => {
    setPeriodo(null)
    setEtapa('todas')
    setTurma('todas')
    setDisciplina('todas')
    setOpcoes({ etapas: [], turmas: [], disciplinas: [] })
    setLista(null)
    setCarregado(false)
    setExpandedId(null)
    setDetalhes({})
    onResumo(null)
    if (!escolaId || !anoId) {
      setPeriodos([])
      return
    }
    getPeriodosRendimento(escolaId, anoId, pessoaId)
      .then(ps => {
        setPeriodos(ps.map(p => ({ ordem: p.ordem, nome: p.nome })))
        setPeriodo(ps[0]?.ordem ?? null)
      })
      .catch(() => setPeriodos([]))
    getFiltrosSituacao(escolaId, anoId, pessoaId)
      .then(setOpcoes)
      .catch(() => setOpcoes({ etapas: [], turmas: [], disciplinas: [] }))
  }, [escolaId, anoId, pessoaId, onResumo])

  const carregar = useCallback(async (
    esc: string, ano: string, per: number | null, eta: string, tur: string, disc: string
  ) => {
    if (!esc || !ano || per === null) return
    setLoading(true)
    try {
      const data = await getListaSituacao({
        schoolId: esc,
        anoLetivoId: ano,
        periodoOrdem: per,
        etapaId: eta === 'todas' ? null : eta,
        turmaId: tur === 'todas' ? null : tur,
        disciplinaId: disc === 'todas' ? null : disc,
      }, pessoaId)
      setLista(data)
      onResumo(data.resumo)
      setCarregado(true)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar situação')
    } finally {
      setLoading(false)
    }
  }, [pessoaId, onResumo])

  useEffect(() => {
    if (ativo && !carregado && !loading) carregar(escolaId, anoId, periodo, etapa, turma, disciplina)
  }, [ativo, carregado, loading, escolaId, anoId, periodo, etapa, turma, disciplina, carregar])

  const trocarFiltro = (fn: () => void) => {
    setCarregado(false)
    setLista(null)
    onResumo(null)
    setPagina(1)
    setExpandedId(null)
    setDetalhes({})
    fn()
  }

  const toggleExpand = async (alunoId: string, turmaId: string) => {
    const discKey = disciplina === 'todas' ? 'todas' : disciplina
    const key = `${turmaId}|${alunoId}|${discKey}`
    if (expandedId === key) {
      setExpandedId(null)
      return
    }
    setExpandedId(key)
    if (detalhes[key] || periodo === null) return
    setDetalhes(prev => ({ ...prev, [key]: { data: null, loading: true } }))
    try {
      const data = await getDetalheAluno(
        {
          schoolId: escolaId, anoLetivoId: anoId, periodoOrdem: periodo, turmaId, alunoId,
          disciplinaId: disciplina === 'todas' ? null : disciplina,
        },
        pessoaId
      )
      setDetalhes(prev => ({ ...prev, [key]: { data, loading: false } }))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao carregar detalhe')
      setDetalhes(prev => ({ ...prev, [key]: { data: null, loading: false } }))
    }
  }

  if (!ativo && !carregado) return null
  if (loading && !lista) {
    return <div className="h-64 rounded-xl border border-border bg-card animate-pulse" />
  }
  if (!lista) return null

  const { resumo, linhas } = lista
  const totalPaginas = Math.max(1, Math.ceil(linhas.length / POR_PAGINA))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = linhas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)
  const turmasOpcoes = opcoes.turmas.filter(t => etapa === 'todas' || (t.etapaId || 'sem-etapa') === etapa)

  const motivoTexto = (motivos: MotivoSituacao[]) => {
    if (motivos.length === 0) return '—'
    const rotulos = motivos.map(m => ROTULOS_MOTIVO[m])
    return rotulos.length === 1 ? rotulos[0] : `${rotulos[0]} +${rotulos.length - 1}`
  }

  const detalheBox = (key: string) => {
    const det = detalhes[key]
    if (!det || det.loading) {
      return (
        <div className="flex items-center gap-2 py-2" role="status">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="text-[13px] text-muted-foreground">Carregando detalhe...</span>
        </div>
      )
    }
    if (!det.data) return <p className="text-[14px] text-muted-foreground py-2">Sem detalhe disponível.</p>
    const d = det.data
    const tend = TENDENCIA[d.tendencia]
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-[13px] text-muted-foreground">Média atual</p>
            <p className="text-[16px] font-semibold text-foreground tabular-nums">{fmtMedia(d.mediaAtual)}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Média anterior</p>
            <p className="text-[16px] font-semibold text-foreground tabular-nums">{fmtMedia(d.mediaAnterior)}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Frequência</p>
            <div className="mt-1"><FrequencyBar percent={d.frequencia} /></div>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground">Tendência</p>
            <p className="flex items-center gap-1 text-[14px] font-medium text-foreground">
              <tend.icon className="h-4 w-4" /> {tend.label}
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-foreground mb-2">Desempenho por disciplina</h4>
          {d.porDisciplina.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">Sem disciplinas com nota no período.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {d.porDisciplina.map(x => (
                <li key={x.id} className="flex items-center justify-between px-3 py-2">
                  <span className="text-[14px] text-foreground">{x.nome}</span>
                  <span className="text-[14px] font-semibold text-foreground tabular-nums">{fmtMedia(x.media)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-foreground mb-2">Pontos de atenção</h4>
          {d.pontosAtencao.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">Nenhum ponto de atenção no período.</p>
          ) : (
            <ul className="space-y-2">
              {d.pontosAtencao.map((p, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2 text-[14px] text-warning">
                  <TriangleAlert className="h-4 w-4 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Período</Label>
          <Select
            value={periodo === null ? '' : String(periodo)}
            onValueChange={(v) => trocarFiltro(() => setPeriodo(Number(v)))}
          >
            <SelectTrigger><SelectValue placeholder="Selecione o período" /></SelectTrigger>
            <SelectContent>
              {periodos.map(p => (
                <SelectItem key={p.ordem} value={String(p.ordem)}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Etapa de Ensino</Label>
          <Select value={etapa} onValueChange={(v) => trocarFiltro(() => { setEtapa(v); setTurma('todas') })}>
            <SelectTrigger><SelectValue placeholder="Todas as etapas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Etapas</SelectItem>
              {opcoes.etapas.map(e => (
                <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Turma</Label>
          <Select value={turma} onValueChange={(v) => trocarFiltro(() => setTurma(v))}>
            <SelectTrigger><SelectValue placeholder="Todas as turmas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Turmas</SelectItem>
              {turmasOpcoes.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Disciplina</Label>
          <Select value={disciplina} onValueChange={(v) => trocarFiltro(() => setDisciplina(v))}>
            <SelectTrigger><SelectValue placeholder="Todas as disciplinas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as disciplinas</SelectItem>
              {opcoes.disciplinas.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-live="polite">
          {LEGENDA.map(item => {
            const qtd = item.categoria === 'adequado'
              ? resumo.adequado : item.categoria === 'atencao' ? resumo.atencao : resumo.risco
            return (
              <Card key={item.categoria}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`p-2.5 rounded-xl ${item.status === 'success' ? 'bg-success/10 text-success' : item.status === 'warning' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        <item.icone className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[28px] font-bold leading-none text-foreground tabular-nums">{fmtInt(qtd.quantidade)}</p>
                        <p className="text-[14px] font-medium text-muted-foreground mt-1">{item.titulo} · {fmtPct(qtd.percentual)}</p>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost" size="icon-sm" className="h-8 w-8 shrink-0"
                          aria-label={`O que significa ${item.titulo}`}
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm whitespace-normal text-[14px]">
                        <p>{item.texto}</p>
                        <p className="italic mt-1.5">{item.exemplo}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </TooltipProvider>

      {linhas.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum aluno em atenção"
          description="Todos os alunos avaliados estão dentro dos parâmetros esperados para os filtros."
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-[16px] font-semibold text-foreground">Alunos que precisam de atenção</h3>

          <ul className="space-y-3 md:hidden">
            {visiveis.map(c => {
              const discKey = disciplina === 'todas' ? 'todas' : disciplina
              const key = `${c.turmaId}|${c.alunoId}|${discKey}`
              const isExpanded = expandedId === key
              const Tend = TENDENCIA[c.tendencia]
              return (
                <li key={key} className="rounded-lg border border-border bg-card shadow-xs">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <User className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-foreground">{c.nome}</p>
                          <p className="text-[13px] text-muted-foreground">{c.turmaNome}</p>
                        </div>
                      </div>
                      <StatusBadge status={c.categoria === 'risco' ? 'destructive' : 'warning'}>
                        {c.categoria === 'risco' ? 'Risco' : 'Atenção'}
                      </StatusBadge>
                    </div>
                    <div className="mt-3 space-y-1 text-[14px] tabular-nums">
                      <p className="text-muted-foreground">Média: <span className="font-medium text-foreground">{fmtMedia(c.media)}</span></p>
                      <FrequencyBar percent={c.frequencia} />
                      <p className="text-muted-foreground">{motivoTexto(c.motivos)}</p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Tend.icon className="h-3.5 w-3.5" /> {Tend.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded-md py-2 text-[13px] font-medium text-primary hover:bg-primary/5 min-h-[44px]"
                      onClick={() => toggleExpand(c.alunoId, c.turmaId)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? 'Ocultar detalhe' : 'Ver detalhe'}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-border">
                      {detalheBox(key)}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="hidden md:block">
            <ScrollArea className="max-h-[800px] rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 bg-muted" />
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Aluno</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Turma</TableHead>
                    <TableHead className="bg-muted text-right text-[13px] uppercase tracking-wider text-muted-foreground">Média</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Frequência</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Motivo</TableHead>
                    <TableHead className="bg-muted text-[13px] uppercase tracking-wider text-muted-foreground">Tendência</TableHead>
                    <TableHead className="bg-muted text-center text-[13px] uppercase tracking-wider text-muted-foreground">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visiveis.map(c => {
                    const discKey = disciplina === 'todas' ? 'todas' : disciplina
                    const key = `${c.turmaId}|${c.alunoId}|${discKey}`
                    const isExpanded = expandedId === key
                    const Tend = TENDENCIA[c.tendencia]
                    return (
                      <Fragment key={key}>
                        <TableRow
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-primary/5',
                            isExpanded && 'bg-primary/[0.03]'
                          )}
                          onClick={() => toggleExpand(c.alunoId, c.turmaId)}
                          aria-expanded={isExpanded}
                        >
                          <TableCell className="p-2">
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                            )}
                          </TableCell>
                          <TableCell className="text-[15px] font-semibold text-foreground">
                            <span className="inline-flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <User className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                              {c.nome}
                            </span>
                          </TableCell>
                          <TableCell className="text-[14px] text-muted-foreground">{c.turmaNome}</TableCell>
                          <TableCell className="text-right text-[15px] font-semibold text-foreground tabular-nums">
                            {fmtMedia(c.media)}
                          </TableCell>
                          <TableCell className="text-[14px] tabular-nums">
                            <FrequencyBar percent={c.frequencia} />
                          </TableCell>
                          <TableCell className="text-[14px] text-muted-foreground">{motivoTexto(c.motivos)}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-[14px] text-muted-foreground">
                              <Tend.icon className="h-4 w-4" /> {Tend.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusBadge status={c.categoria === 'risco' ? 'destructive' : 'warning'}>
                              {c.categoria === 'risco' ? 'Risco' : 'Atenção'}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${key}-expanded`}>
                            <TableCell colSpan={8} className="p-0">
                              <div className="px-3 sm:px-6 py-3 bg-primary/[0.03] border-t border-border min-w-0">
                                {detalheBox(key)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <Pagination
            currentPage={paginaAtual}
            totalPages={totalPaginas}
            totalItems={linhas.length}
            itemsPerPage={POR_PAGINA}
            onPageChange={setPagina}
          />
        </div>
      )}
    </div>
  )
}
