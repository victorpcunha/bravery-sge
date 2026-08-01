'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  getIndicadoresDaTurma,
  salvarAvaliacaoIndicador,
  listarAvaliacoesIndicadores,
  type IndicadorComNiveis,
  type AvaliacaoIndicador,
} from '@/lib/actions/avaliacoes-indicadores'
import { type AlunoMatriculado } from '@/lib/actions/diario-classe'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Check, Circle, CircleDotDashed, Loader2 } from 'lucide-react'

type DisciplinaItem = {
  id: string
  disciplina_id: string
  nome: string
  nome_abreviado: string
}

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas: DisciplinaItem[]
  quantidadePeriodosNivel: number
}

type StatusNivel = 'completo' | 'parcial' | 'pendente'

const statusUi: Record<
  StatusNivel,
  {
    label: string
    textClass: string
    pillClass: string
    icon: typeof Check
  }
> = {
  completo: {
    label: 'Completo',
    textClass: 'text-success',
    pillClass: 'border-success/40 bg-success/10 text-success',
    icon: Check,
  },
  parcial: {
    label: 'Parcial',
    textClass: 'text-warning',
    pillClass: 'border-warning/40 bg-warning/10 text-warning',
    icon: CircleDotDashed,
  },
  pendente: {
    label: 'Pendente',
    textClass: 'text-muted-foreground',
    pillClass: 'border-border bg-muted text-muted-foreground',
    icon: Circle,
  },
}

const chipSelectedClasses =
  'border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs'

function formatarHora(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

type FeedbackEstado = { state: 'idle' | 'saving' | 'saved'; updatedAt?: string }

function SaveStatus({ feedback }: { feedback?: FeedbackEstado }) {
  if (!feedback || feedback.state === 'idle') return null
  if (feedback.state === 'saving') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Salvando...
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-success">
      <Check className="h-3 w-3" />
      Salvo às {formatarHora(feedback.updatedAt)}
    </span>
  )
}

export default function AvaliacaoIndicadores({
  turmaId,
  alunos,
  disciplinas,
  quantidadePeriodosNivel,
}: Props) {
  const { schoolId } = useAuth()
  const { pessoaId, pode } = usePermissoes(schoolId || '')
  const podeEditar = pode.editar('gestao-pedagogica.diario-classe.indicadores')

  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [periodoAtivo, setPeriodoAtivo] = useState(1)
  const [alunoExpandido, setAlunoExpandido] = useState<string>('')
  const [indicadores, setIndicadores] = useState<IndicadorComNiveis[]>([])
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoIndicador[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Record<string, FeedbackEstado>>({})
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const periodos = Array.from(
    { length: quantidadePeriodosNivel || 4 },
    (_, i) => i + 1
  )
  const alunosVisiveis = alunos.filter(a => !a.data_saida)

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      Object.values(timers).forEach(t => clearTimeout(t))
    }
  }, [])

  const carregar = useCallback(async () => {
    if (!turmaId || !disciplinaId) {
      setIndicadores([])
      setAvaliacoes([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const inds = await getIndicadoresDaTurma(turmaId, disciplinaId, pessoaId)
      setIndicadores(inds)
      const ids = inds.map(i => i.id)
      const avals = ids.length
        ? await listarAvaliacoesIndicadores(turmaId, { indicadorIds: ids, pessoaId })
        : []
      setAvaliacoes(avals)
    } catch (e) {
      console.error('Erro ao carregar indicadores:', e)
      toast.error('Erro ao carregar indicadores')
    } finally {
      setLoading(false)
    }
  }, [turmaId, disciplinaId, pessoaId])

  useEffect(() => {
    carregar()
  }, [carregar])

  const getAvaliacaoEmPeriodo = (alunoId: string, indicadorId: string, periodo: number) => {
    return avaliacoes.find(
      a => a.aluno_id === alunoId && a.indicador_id === indicadorId && a.periodo === periodo
    )
  }

  const getAvaliacao = (alunoId: string, indicadorId: string) => {
    return getAvaliacaoEmPeriodo(alunoId, indicadorId, periodoAtivo)
  }

  const countAvaliados = (alunoId: string, periodo: number) => {
    return indicadores.filter(ind => getAvaliacaoEmPeriodo(alunoId, ind.id, periodo)?.nivel_id).length
  }

  const statusAluno = (alunoId: string, periodo: number): StatusNivel => {
    if (indicadores.length === 0) return 'pendente'
    const avaliados = countAvaliados(alunoId, periodo)
    if (avaliados === indicadores.length) return 'completo'
    if (avaliados > 0) return 'parcial'
    return 'pendente'
  }

  const statusGlobalPeriodo = (periodo: number): 'verde' | 'amarelo' | 'cinza' => {
    const total = alunosVisiveis.length
    if (total === 0) return 'cinza'
    let completos = 0
    let comProgresso = 0
    for (const a of alunosVisiveis) {
      const s = statusAluno(a.id, periodo)
      if (s === 'completo') completos++
      if (s !== 'pendente') comProgresso++
    }
    if (completos === total) return 'verde'
    if (comProgresso > 0) return 'amarelo'
    return 'cinza'
  }

  const feedbackKey = (alunoId: string, indicadorId: string) =>
    `${alunoId}_${indicadorId}_${periodoAtivo}`

  const definirFeedback = (key: string, fb: FeedbackEstado) => {
    setFeedback(prev => ({ ...prev, [key]: fb }))
  }

  const agendarFeedbackSalvo = (key: string, updatedAt?: string | null) => {
    if (timersRef.current[key]) clearTimeout(timersRef.current[key])
    definirFeedback(key, { state: 'saved', updatedAt: updatedAt ?? undefined })
    timersRef.current[key] = setTimeout(() => {
      definirFeedback(key, { state: 'idle' })
    }, 4000)
  }

  const handleChipClick = async (alunoId: string, indicadorId: string, nivelId: string) => {
    if (!podeEditar) return
    const key = feedbackKey(alunoId, indicadorId)
    const current = getAvaliacao(alunoId, indicadorId)
    const novoNivelId = current?.nivel_id === nivelId ? null : nivelId

    definirFeedback(key, { state: 'saving' })
    try {
      const res = await salvarAvaliacaoIndicador(
        schoolId,
        turmaId,
        alunoId,
        indicadorId,
        periodoAtivo,
        novoNivelId,
        current?.observacao || null,
        pessoaId
      )

      setAvaliacoes(prev => {
        const next = [...prev]
        const idx = next.findIndex(
          a =>
            a.aluno_id === alunoId &&
            a.indicador_id === indicadorId &&
            a.periodo === periodoAtivo
        )
        if (idx >= 0) {
          next[idx] = { ...next[idx], nivel_id: novoNivelId, updated_at: res.updated_at }
        } else if (novoNivelId) {
          next.push({
            id: '',
            aluno_id: alunoId,
            indicador_id: indicadorId,
            periodo: periodoAtivo,
            nivel_id: novoNivelId,
            observacao: null,
            updated_at: res.updated_at,
          })
        }
        return next
      })

      agendarFeedbackSalvo(key, res.updated_at)
    } catch {
      toast.error('Erro ao salvar avaliação')
      definirFeedback(key, { state: 'idle' })
    }
  }

  const handleObservacaoChange = async (
    alunoId: string,
    indicadorId: string,
    observacao: string
  ) => {
    if (!podeEditar) return
    const key = feedbackKey(alunoId, indicadorId)
    const current = getAvaliacao(alunoId, indicadorId)

    definirFeedback(key, { state: 'saving' })
    try {
      const res = await salvarAvaliacaoIndicador(
        schoolId,
        turmaId,
        alunoId,
        indicadorId,
        periodoAtivo,
        current?.nivel_id || null,
        observacao || null,
        pessoaId
      )

      setAvaliacoes(prev => {
        const next = [...prev]
        const idx = next.findIndex(
          a =>
            a.aluno_id === alunoId &&
            a.indicador_id === indicadorId &&
            a.periodo === periodoAtivo
        )
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            observacao: observacao || null,
            updated_at: res.updated_at,
          }
        } else if (observacao) {
          next.push({
            id: '',
            aluno_id: alunoId,
            indicador_id: indicadorId,
            periodo: periodoAtivo,
            nivel_id: null,
            observacao,
            updated_at: res.updated_at,
          })
        }
        return next
      })

      agendarFeedbackSalvo(key, res.updated_at)
    } catch {
      toast.error('Erro ao salvar observação')
      definirFeedback(key, { state: 'idle' })
    }
  }

  const handlePillClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    alunoId: string,
    periodo: number
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setPeriodoAtivo(periodo)
    setAlunoExpandido(alunoId)
  }

  const handlePillKeyDown = (
    e: React.KeyboardEvent<HTMLSpanElement>,
    alunoId: string,
    periodo: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      setPeriodoAtivo(periodo)
      setAlunoExpandido(alunoId)
    }
  }

  let statsCompletos = 0
  let statsParciais = 0
  let statsPendentes = 0
  alunosVisiveis.forEach(a => {
    const s = statusAluno(a.id, periodoAtivo)
    if (s === 'completo') statsCompletos++
    else if (s === 'parcial') statsParciais++
    else statsPendentes++
  })

  const totalCelulas = alunosVisiveis.length * indicadores.length
  const celulasAvaliadas = alunosVisiveis.reduce(
    (acc, a) => acc + countAvaliados(a.id, periodoAtivo),
    0
  )
  const statsPct = totalCelulas > 0 ? Math.round((celulasAvaliadas / totalCelulas) * 100) : 0

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 px-1 pt-2">
        <Select
          value={disciplinaId}
          onValueChange={v => {
            setDisciplinaId(v)
            setAlunoExpandido('')
          }}
        >
          <SelectTrigger className="min-w-[220px] max-w-xs">
            <SelectValue placeholder="Selecione uma disciplina" />
          </SelectTrigger>
          <SelectContent>
            {disciplinas.map(d => (
              <SelectItem key={d.disciplina_id} value={d.disciplina_id}>
                {d.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {disciplinaId && (
          <div className="inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted p-1">
            {periodos.map(p => {
              const dot = statusGlobalPeriodo(p)
              const ativo = periodoAtivo === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodoAtivo(p)}
                  aria-pressed={ativo}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[13px] font-semibold transition-all',
                    ativo
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full transition-colors',
                      dot === 'verde' && 'bg-success',
                      dot === 'amarelo' && 'bg-warning',
                      dot === 'cinza' && 'bg-muted-foreground/40',
                      ativo && 'ring-1 ring-white/60'
                    )}
                  />
                  {p}º Bimestre
                </button>
              )
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          Carregando indicadores...
        </div>
      ) : !disciplinaId ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
          Selecione uma disciplina para visualizar os indicadores.
        </div>
      ) : indicadores.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
          Nenhum indicador encontrado para esta disciplina.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[14px] font-semibold text-foreground">
                {periodoAtivo}º Bimestre
              </span>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-semibold text-success">
                  <Check className="h-3 w-3" />
                  {statsCompletos} Completos
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[12px] font-semibold text-warning">
                  <CircleDotDashed className="h-3 w-3" />
                  {statsParciais} Parciais
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
                  <Circle className="h-3 w-3" />
                  {statsPendentes} Pendentes
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={statsPct}
                className={cn(
                  'h-2',
                  statsPct === 100 && '[&_[data-slot=progress-indicator]]:bg-success'
                )}
              />
              <span className="min-w-[2.5rem] text-right text-[13px] font-bold tabular-nums text-foreground">
                {statsPct}%
              </span>
            </div>
          </div>

          {alunosVisiveis.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
              Nenhum aluno matriculado nesta turma.
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={alunoExpandido}
              onValueChange={setAlunoExpandido}
              className="w-full"
            >
              {alunosVisiveis.map(aluno => {
                const status = statusAluno(aluno.id, periodoAtivo)
                const meta = statusUi[status]
                const StatusIcon = meta.icon
                const aberto = alunoExpandido === aluno.id
                const avaliados = countAvaliados(aluno.id, periodoAtivo)
                const pendentes = indicadores.length - avaliados
                const pctAluno =
                  indicadores.length > 0
                    ? Math.round((avaliados / indicadores.length) * 100)
                    : 0

                return (
                  <AccordionItem
                    key={aluno.id}
                    value={aluno.id}
                    className={cn(
                      'mb-2 overflow-hidden rounded-lg border bg-card shadow-xs transition-all duration-200',
                      aberto ? 'border-primary/40 shadow-md' : 'border-border'
                    )}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="truncate text-[14px] font-semibold text-foreground">
                            {aluno.nome_completo}
                          </span>
                          <div className="flex items-center gap-1">
                            {periodos.map(p => {
                              const s = statusAluno(aluno.id, p)
                              const ui = statusUi[s]
                              const ativoP = periodoAtivo === p
                              return (
                                <span
                                  key={p}
                                  role="button"
                                  tabIndex={0}
                                  onClick={e => handlePillClick(e, aluno.id, p)}
                                  onKeyDown={e => handlePillKeyDown(e, aluno.id, p)}
                                  title={`${p}º Bimestre: ${ui.label}`}
                                  className={cn(
                                    'inline-flex select-none items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none transition-all cursor-pointer',
                                    ui.pillClass,
                                    ativoP
                                      ? 'scale-105 border-2 shadow-sm'
                                      : 'border opacity-90 hover:opacity-100'
                                  )}
                                >
                                  {p}º
                                </span>
                              )
                            })}
                          </div>
                        </div>
                        <span
                          className={cn(
                            'inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold',
                            meta.textClass
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4">
                      <div className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[12px] font-medium text-foreground">
                            {avaliados}/{indicadores.length} indicadores
                            <span className="mx-1 text-muted-foreground">·</span>
                            {pendentes} pendentes
                          </p>
                          <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                            {pctAluno}%
                          </span>
                        </div>
                        <Progress
                          value={pctAluno}
                          className={cn(
                            'mt-2 h-1.5',
                            pctAluno === 100 && '[&_[data-slot=progress-indicator]]:bg-success'
                          )}
                        />
                      </div>

                      <div className="space-y-3">
                        {indicadores.map(ind => {
                          const av = getAvaliacao(aluno.id, ind.id)
                          const fbk = feedback[feedbackKey(aluno.id, ind.id)]
                          const bloqueado = !podeEditar || fbk?.state === 'saving'

                          return (
                            <div
                              key={`${ind.id}_${periodoAtivo}`}
                              className="rounded-lg border border-border bg-card p-3"
                            >
                              <div className="mb-2 flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-[14px] font-medium text-foreground">
                                    {ind.codigo && (
                                      <span className="text-muted-foreground mr-1">
                                        {ind.codigo} {'\u2014'}
                                      </span>
                                    )}
                                    {ind.descricao}
                                  </p>
                                  {ind.campo_experiencia && (
                                    <span className="text-[12px] text-muted-foreground">
                                      {ind.campo_experiencia}
                                    </span>
                                  )}
                                </div>
                                <SaveStatus feedback={fbk} />
                              </div>

                              {ind.niveis.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {ind.niveis.map(nivel => {
                                    const isSelected = av?.nivel_id === nivel.id
                                    return (
                                      <button
                                        key={nivel.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        disabled={bloqueado}
                                        onClick={() => handleChipClick(aluno.id, ind.id, nivel.id)}
                                        className={cn(
                                          'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-left transition-all',
                                          isSelected
                                            ? chipSelectedClasses
                                            : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                                          bloqueado && 'opacity-60 cursor-not-allowed'
                                        )}
                                        title={nivel.descricao}
                                      >
                                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                                        <span className="flex flex-col">
                                          <span className="text-[13px] font-semibold leading-tight">
                                            {nivel.sigla || nivel.descricao}
                                          </span>
                                          {nivel.sigla && (
                                            <span className="max-w-[200px] truncate text-[11px] font-normal leading-tight opacity-85">
                                              {nivel.descricao}
                                            </span>
                                          )}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              ) : (
                                <p className="mt-1 text-[12px] italic text-muted-foreground/50">
                                  Nenhum nível configurado para este indicador.
                                </p>
                              )}

                              <Textarea
                                rows={2}
                                placeholder="Observação (opcional)"
                                defaultValue={av?.observacao || ''}
                                disabled={!podeEditar}
                                onBlur={e => {
                                  const val = e.target.value.trim()
                                  if (val !== (av?.observacao || '')) {
                                    handleObservacaoChange(aluno.id, ind.id, val)
                                  }
                                }}
                                className={cn(
                                  'w-full mt-2 text-[13px] resize-none',
                                  !podeEditar && 'opacity-60 cursor-not-allowed'
                                )}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </div>
      )}
    </div>
  )
}
