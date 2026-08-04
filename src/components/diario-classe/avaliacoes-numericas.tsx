'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  salvarNota,
  salvarRecuperacao,
  listarNotasTurmaDisciplina,
  listarRecuperacoes,
  recalcularTurma,
  limparNotasAluno,
  getDescricoesNotas,
  getNumericoConfigCompleta,
  type Nota,
  type Recuperacao,
  type DesempenhoAluno,
  type ConfigNumericaCompleta,
  type AvaliacaoPredefinida,
} from '@/lib/actions/avaliacoes-numericas'
import { type AlunoMatriculado } from '@/lib/actions/diario-classe'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  BarChart3,
  ClipboardList,
  RefreshCcw,
  FileText,
  CalendarRange,
  CheckSquare,
  Check,
  Circle,
  CircleDotDashed,
  Loader2,
  Plus,
  Eraser,
  X,
  AlertCircle,
  Target,
  TrendingUp,
  TrendingDown,
  Medal,
  Users,
  Clock,
  type LucideIcon,
} from 'lucide-react'

type DisciplinaItem = {
  id: string
  disciplina_id: string
  matriz_disciplina_id: string
  nome: string
  nome_abreviado: string
}

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas: DisciplinaItem[]
  quantidadePeriodosNumerico: number
  metodoId?: string | null
}

type StatusNota = 'completo' | 'parcial' | 'pendente'
type SubAba = 'resumo' | 'registro' | 'recuperacoes'
type RecTipo = 'avaliacao' | 'periodo' | 'final'

const statusUi: Record<
  StatusNota,
  { label: string; textClass: string; pillClass: string; icon: LucideIcon }
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

const recTabMeta: Record<RecTipo, { label: string; icon: LucideIcon }> = {
  avaliacao: { label: 'Por Avaliação', icon: FileText },
  periodo: { label: 'Por Bimestre', icon: CalendarRange },
  final: { label: 'Final', icon: CheckSquare },
}

const recTipoOrder: RecTipo[] = ['avaliacao', 'periodo', 'final']

type FeedbackEstado = { state: 'idle' | 'saving' | 'saved'; updatedAt?: string }

function formatarHora(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function hojeISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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
      Auto-salvo às {formatarHora(feedback.updatedAt)}
    </span>
  )
}

function StatCardResumo({
  icon: Icon,
  label,
  value,
  valueClass,
  iconClass,
}: {
  icon: LucideIcon
  label: string
  value: string
  valueClass: string
  iconClass: string
}) {
  return (
    <div className="group rounded-lg border border-border bg-card p-3 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium leading-tight text-muted-foreground">{label}</span>
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform group-hover:scale-110',
            iconClass
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className={cn('mt-1.5 text-[20px] font-bold leading-none tabular-nums', valueClass)}>{value}</div>
    </div>
  )
}

export default function AvaliacoesNumericas({
  turmaId,
  alunos,
  disciplinas,
  quantidadePeriodosNumerico,
  metodoId,
}: Props) {
  const { schoolId } = useAuth()
  const { pessoaId, pode } = usePermissoes(schoolId || '')
  const podeEditar = pode.editar('gestao-pedagogica.diario-classe.avaliacoes')

  const [disciplinaId, setDisciplinaId] = useState('')
  const [periodoAtivo, setPeriodoAtivo] = useState(1)
  const [subAba, setSubAba] = useState<SubAba>('resumo')
  const [recSubAba, setRecSubAba] = useState<RecTipo>('avaliacao')
  const [alunoExpandido, setAlunoExpandido] = useState('')
  const [notas, setNotas] = useState<Nota[]>([])
  const [recuperacoes, setRecuperacoes] = useState<Recuperacao[]>([])
  const [descricoes, setDescricoes] = useState<string[]>([])
  const [datasAvaliacoes, setDatasAvaliacoes] = useState<Map<string, string>>(new Map())
  const [config, setConfig] = useState<ConfigNumericaCompleta | null>(null)
  const [desempenhos, setDesempenhos] = useState<DesempenhoAluno[]>([])
  const [novaDescricao, setNovaDescricao] = useState('')
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<Record<string, FeedbackEstado>>({})

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const recalcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notaIdsRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      Object.values(timers).forEach(t => clearTimeout(t))
      if (recalcTimerRef.current) clearTimeout(recalcTimerRef.current)
    }
  }, [])

  const periodos = Array.from({ length: quantidadePeriodosNumerico || 4 }, (_, i) => i + 1)
  const alunosVisiveis = alunos.filter(a => !a.data_saida)
  const mediaMinima = config?.media_minima ?? 7

  const desempenhoMap = useMemo(() => new Map(desempenhos.map(d => [d.aluno_id, d])), [desempenhos])

  const predefinida = useCallback(
    (descricao: string): AvaliacaoPredefinida | undefined =>
      config?.avaliacoes_list.find(a => a.nome === descricao),
    [config]
  )
  const getPeso = useCallback((descricao: string) => predefinida(descricao)?.peso ?? 1, [predefinida])
  const getNotaMaxima = useCallback((descricao: string) => predefinida(descricao)?.nota_maxima ?? 10, [predefinida])

  const getNota = useCallback(
    (alunoId: string, descricao: string, periodo?: number) => {
      const p = periodo ?? periodoAtivo
      return notas.find(n => n.aluno_id === alunoId && n.descricao === descricao && n.periodo === p)
    },
    [notas, periodoAtivo]
  )

  const getRec = useCallback(
    (alunoId: string, tipo: RecTipo, periodo: number | null, descricao?: string | null) => {
      return recuperacoes.find(
        r =>
          r.aluno_id === alunoId &&
          r.tipo === tipo &&
          r.periodo === periodo &&
          (r.descricao ?? null) === (descricao ?? null)
      )
    },
    [recuperacoes]
  )

  const calcMediaPeriodo = useCallback(
    (alunoId: string, periodo: number): number | null => {
      if (!config) return null
      const recAvaliacao = new Map<string, number>()
      recuperacoes.forEach(r => {
        if (r.tipo === 'avaliacao' && r.periodo === periodo && r.valor !== null && r.descricao) {
          recAvaliacao.set(r.descricao, r.valor)
        }
      })
      const comNota = notas
        .filter(n => n.aluno_id === alunoId && n.periodo === periodo && n.valor !== null)
        .map(n => {
          const recVal = n.descricao ? recAvaliacao.get(n.descricao) : undefined
          if (recVal === undefined) return n
          return config.recuperacao_substitutiva
            ? { ...n, valor: recVal }
            : { ...n, valor: Math.max(n.valor as number, recVal) }
        })
      if (comNota.length === 0) return null

      if (config.tipo_media_periodo === 'somatoria') {
        return Math.min(comNota.reduce((acc, n) => acc + (n.valor as number), 0), config.media_maxima_periodo)
      }

      let somaPonderada = 0
      let somaPesos = 0
      for (const n of comNota) {
        const peso = getPeso(n.descricao || '')
        somaPonderada += (n.valor as number) * peso
        somaPesos += peso
      }
      const media = somaPesos > 0 ? somaPonderada / somaPesos : 0
      const capped = Math.min(media, config.media_maxima_periodo)
      return Math.round(capped * 100) / 100
    },
    [config, notas, recuperacoes, getPeso]
  )

  const statusAluno = useCallback(
    (alunoId: string, periodo: number): StatusNota => {
      if (descricoes.length === 0) return 'pendente'
      const comNota = descricoes.filter(d => (getNota(alunoId, d, periodo)?.valor ?? null) !== null).length
      if (comNota === descricoes.length) return 'completo'
      if (comNota > 0) return 'parcial'
      return 'pendente'
    },
    [descricoes, getNota]
  )

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

  const carregar = useCallback(async () => {
    if (!disciplinaId || !turmaId) {
      setNotas([])
      setRecuperacoes([])
      setDescricoes([])
      setDatasAvaliacoes(new Map())
      setConfig(null)
      setDesempenhos([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [notasData, recsData, descs, cfg] = await Promise.all([
        listarNotasTurmaDisciplina(turmaId, disciplinaId, pessoaId),
        listarRecuperacoes(turmaId, disciplinaId, pessoaId),
        getDescricoesNotas(turmaId, periodoAtivo, disciplinaId, pessoaId),
        getNumericoConfigCompleta(metodoId, quantidadePeriodosNumerico),
      ])
      setNotas(notasData)
      setRecuperacoes(recsData)
      setConfig(cfg)

      const descsFinal = cfg.limitar_avaliacoes && cfg.avaliacoes_list.length > 0
        ? cfg.avaliacoes_list.map(a => a.nome)
        : descs.map(d => d.descricao!).filter(Boolean)
      setDescricoes(descsFinal)

      const datas = new Map<string, string>()
      notasData.forEach(n => {
        if (n.descricao && n.data_aplicacao) datas.set(`${n.aluno_id}_${n.descricao}`, n.data_aplicacao)
      })
      setDatasAvaliacoes(datas)

      const ref = new Map<string, string>()
      notasData.forEach(n => {
        if (n.descricao) ref.set(`${n.aluno_id}_${n.periodo}_${n.descricao}`, n.id)
      })
      notaIdsRef.current = ref

      const recTabsCfg = (cfg.permite_recuperacao || [])
        .filter((t): t is RecTipo => t === 'avaliacao' || t === 'periodo' || t === 'final')
        .sort((a, b) => recTipoOrder.indexOf(a) - recTipoOrder.indexOf(b))
      setRecSubAba(recTabsCfg[0] || 'final')

      try {
        const resultados = await recalcularTurma(turmaId, disciplinaId, quantidadePeriodosNumerico, pessoaId)
        setDesempenhos(resultados)
      } catch {
        setDesempenhos([])
      }
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [turmaId, disciplinaId, periodoAtivo, pessoaId, metodoId, quantidadePeriodosNumerico])

  useEffect(() => {
    if (disciplinaId) carregar()
  }, [carregar, disciplinaId])

  const agendarRecalc = useCallback(() => {
    if (!disciplinaId) return
    if (recalcTimerRef.current) clearTimeout(recalcTimerRef.current)
    recalcTimerRef.current = setTimeout(async () => {
      try {
        const resultados = await recalcularTurma(turmaId, disciplinaId, quantidadePeriodosNumerico, pessoaId)
        setDesempenhos(resultados)
      } catch {
        // mantém últimos desempenhos em caso de falha
      }
    }, 600)
  }, [turmaId, disciplinaId, quantidadePeriodosNumerico, pessoaId])

  const agendarSalvarNota = useCallback(
    (alunoId: string, descricao: string, valor: number | null, dataAplicacao: string | null) => {
      const p = periodoAtivo
      const key = `${alunoId}_${p}_${descricao}`
      const timerKey = `nota_${key}`
      const cardKey = `${alunoId}_${p}`
      if (timersRef.current[timerKey]) clearTimeout(timersRef.current[timerKey])

      timersRef.current[timerKey] = setTimeout(async () => {
        setFeedback(prev => ({ ...prev, [cardKey]: { state: 'saving' } }))
        try {
          const rowId = notaIdsRef.current.get(key) || null
          const result = await salvarNota(
            schoolId,
            turmaId,
            alunoId,
            disciplinaId,
            p,
            valor,
            descricao,
            dataAplicacao,
            rowId,
            pessoaId
          )
          if (!result.success) {
            toast.error('Erro ao salvar nota: ' + result.error)
            setFeedback(prev => ({ ...prev, [cardKey]: { state: 'idle' } }))
            return
          }
          if (result.id) notaIdsRef.current.set(key, result.id)
          setNotas(prev => {
            const idx = prev.findIndex(
              n => n.aluno_id === alunoId && n.periodo === p && n.descricao === descricao
            )
            if (idx < 0) {
              return [
                ...prev,
                {
                  id: result.id || '',
                  aluno_id: alunoId,
                  disciplina_id: disciplinaId,
                  periodo: p,
                  valor,
                  descricao,
                  data_aplicacao: dataAplicacao,
                },
              ]
            }
            const next = [...prev]
            next[idx] = {
              ...next[idx],
              id: result.id || next[idx].id,
              valor,
              data_aplicacao: dataAplicacao,
            }
            return next
          })
          const updatedAt = new Date().toISOString()
          setFeedback(prev => ({ ...prev, [cardKey]: { state: 'saved', updatedAt } }))
          if (timersRef.current[cardKey]) clearTimeout(timersRef.current[cardKey])
          timersRef.current[cardKey] = setTimeout(() => {
            setFeedback(prev => ({ ...prev, [cardKey]: { state: 'idle' } }))
          }, 4000)
          agendarRecalc()
        } catch {
          toast.error('Erro ao salvar nota')
          setFeedback(prev => ({ ...prev, [cardKey]: { state: 'idle' } }))
        }
      }, 800)
    },
    [schoolId, turmaId, disciplinaId, periodoAtivo, pessoaId, agendarRecalc]
  )

  const handleNotaChange = (alunoId: string, descricao: string, valorRaw: string) => {
    if (!podeEditar) return
    const max = getNotaMaxima(descricao)
    const parsed = valorRaw.trim() === '' ? null : parseFloat(valorRaw.replace(',', '.'))
    const numValor = parsed === null || Number.isNaN(parsed) ? null : Math.min(Math.max(parsed, 0), max)
    let dataAplicacao = datasAvaliacoes.get(`${alunoId}_${descricao}`) ?? null
    if (dataAplicacao === null && numValor !== null) {
      dataAplicacao = hojeISO()
      setDatasAvaliacoes(prev => {
        const next = new Map(prev)
        next.set(`${alunoId}_${descricao}`, dataAplicacao as string)
        return next
      })
    }

    setNotas(prev => {
      const idx = prev.findIndex(
        n => n.aluno_id === alunoId && n.periodo === periodoAtivo && n.descricao === descricao
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], valor: numValor }
        return next
      }
      return [
        ...prev,
        {
          id: '',
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          periodo: periodoAtivo,
          valor: numValor,
          descricao,
          data_aplicacao: dataAplicacao,
        },
      ]
    })

    agendarSalvarNota(alunoId, descricao, numValor, dataAplicacao)
  }

  const handleDataChange = (alunoId: string, descricao: string, date: string) => {
    if (!podeEditar) return
    setDatasAvaliacoes(prev => {
      const next = new Map(prev)
      if (date) next.set(`${alunoId}_${descricao}`, date)
      else next.delete(`${alunoId}_${descricao}`)
      return next
    })
    const atual = getNota(alunoId, descricao)
    agendarSalvarNota(alunoId, descricao, atual?.valor ?? null, date || null)
  }

  const handleLimparNotas = async (alunoId: string) => {
    if (!podeEditar) return
    const p = periodoAtivo
    setNotas(prev => prev.filter(n => !(n.aluno_id === alunoId && n.periodo === p)))
    descricoes.forEach(d => {
      notaIdsRef.current.delete(`${alunoId}_${p}_${d}`)
      const timerKey = `nota_${alunoId}_${p}_${d}`
      if (timersRef.current[timerKey]) clearTimeout(timersRef.current[timerKey])
    })
    try {
      const res = await limparNotasAluno(turmaId, alunoId, disciplinaId, p, pessoaId)
      if (!res.success) {
        toast.error('Erro ao limpar notas: ' + res.error)
        return
      }
      toast.success('Notas do bimestre limpas')
      agendarRecalc()
    } catch {
      toast.error('Erro ao limpar notas')
    }
  }

  const handleAdicionarAvaliacao = () => {
    if (!novaDescricao.trim()) return
    setDescricoes(prev => [...prev, novaDescricao.trim()])
    setNovaDescricao('')
  }

  const agendarSalvarRec = useCallback(
    (alunoId: string, tipo: RecTipo, periodo: number | null, descricao: string | null, valor: number | null) => {
      const key = `${alunoId}_${tipo}_${periodo ?? 'F'}_${descricao ?? ''}`
      const timerKey = `rec_${key}`
      if (timersRef.current[timerKey]) clearTimeout(timersRef.current[timerKey])

      timersRef.current[timerKey] = setTimeout(async () => {
        try {
          const existing = getRec(alunoId, tipo, periodo, descricao)
          const result = await salvarRecuperacao(
            schoolId,
            turmaId,
            alunoId,
            disciplinaId,
            tipo,
            periodo,
            valor,
            descricao,
            existing?.id || null,
            pessoaId
          )
          if (!result.success) {
            toast.error('Erro ao salvar recuperação: ' + result.error)
            return
          }
          setRecuperacoes(prev => {
            const idx = prev.findIndex(
              r =>
                r.aluno_id === alunoId &&
                r.tipo === tipo &&
                r.periodo === periodo &&
                (r.descricao ?? null) === (descricao ?? null)
            )
            const novo: Recuperacao = {
              id: result.id || (idx >= 0 ? prev[idx].id : ''),
              aluno_id: alunoId,
              disciplina_id: disciplinaId,
              periodo,
              tipo,
              descricao,
              valor,
            }
            if (idx >= 0) {
              const next = [...prev]
              next[idx] = novo
              return next
            }
            return [...prev, novo]
          })
          agendarRecalc()
        } catch {
          toast.error('Erro ao salvar recuperação')
        }
      }, 600)
    },
    [schoolId, turmaId, disciplinaId, pessoaId, agendarRecalc, getRec]
  )

  const handleRecChange = (
    alunoId: string,
    tipo: RecTipo,
    periodo: number | null,
    descricao: string | null,
    valorRaw: string
  ) => {
    if (!podeEditar) return
    const max = tipo === 'avaliacao' && descricao ? getNotaMaxima(descricao) : 10
    const parsed = valorRaw.trim() === '' ? null : parseFloat(valorRaw.replace(',', '.'))
    const numValor = parsed === null || Number.isNaN(parsed) ? null : Math.min(Math.max(parsed, 0), max)

    setRecuperacoes(prev => {
      const idx = prev.findIndex(
        r =>
          r.aluno_id === alunoId &&
          r.tipo === tipo &&
          r.periodo === periodo &&
          (r.descricao ?? null) === (descricao ?? null)
      )
      const novo: Recuperacao = {
        id: idx >= 0 ? prev[idx].id : '',
        aluno_id: alunoId,
        disciplina_id: disciplinaId,
        periodo,
        tipo,
        descricao,
        valor: numValor,
      }
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = novo
        return next
      }
      return [...prev, novo]
    })

    agendarSalvarRec(alunoId, tipo, periodo, descricao, numValor)
  }

  const renderPills = (alunoId: string) =>
    periodos.map(p => {
      const s = statusAluno(alunoId, p)
      const ui = statusUi[s]
      return (
        <span
          key={p}
          title={`${p}º Bimestre: ${ui.label}`}
          className={cn(
            'inline-flex select-none items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none',
            ui.pillClass
          )}
        >
          {p}º
        </span>
      )
    })

  let statsCompletos = 0
  let statsParciais = 0
  let statsPendentes = 0
  alunosVisiveis.forEach(a => {
    const s = statusAluno(a.id, periodoAtivo)
    if (s === 'completo') statsCompletos++
    else if (s === 'parcial') statsParciais++
    else statsPendentes++
  })
  const totalCelulas = alunosVisiveis.length * descricoes.length
  const celulasAvaliadas = alunosVisiveis.reduce(
    (acc, a) => acc + descricoes.filter(d => (getNota(a.id, d)?.valor ?? null) !== null).length,
    0
  )
  const statsPct = totalCelulas > 0 ? Math.round((celulasAvaliadas / totalCelulas) * 100) : 0

  const mediasBimestreAtivo = alunosVisiveis.map(a => ({
    aluno_id: a.id,
    media: desempenhoMap.get(a.id)?.medias_periodo[periodoAtivo - 1] ?? null,
  }))
  const comMedia = mediasBimestreAtivo.filter(m => m.media !== null)
  const mediaTurma = comMedia.length
    ? comMedia.reduce((acc, m) => acc + (m.media as number), 0) / comMedia.length
    : null
  const maior = comMedia.length ? Math.max(...comMedia.map(m => m.media as number)) : null
  const menor = comMedia.length ? Math.min(...comMedia.map(m => m.media as number)) : null
  const acima = comMedia.filter(m => (m.media as number) >= mediaMinima).length
  const abaixo = comMedia.filter(m => (m.media as number) < mediaMinima).length

  const recTabs = (config?.permite_recuperacao || [])
    .filter((t): t is RecTipo => t === 'avaliacao' || t === 'periodo' || t === 'final')
    .sort((a, b) => recTipoOrder.indexOf(a) - recTipoOrder.indexOf(b))

  const subTabs: { key: SubAba; label: string; icon: LucideIcon }[] = [
    { key: 'resumo', label: 'Resumo', icon: BarChart3 },
    { key: 'registro', label: 'Registro', icon: ClipboardList },
    { key: 'recuperacoes', label: 'Recuperações', icon: RefreshCcw },
  ]

  const renderSituacao = (d?: DesempenhoAluno) => {
    if (d?.status === 'em_andamento') {
      return (
        <StatusBadge status="muted">
          <Clock className="h-3 w-3 mr-1" /> Em andamento
        </StatusBadge>
      )
    }
    if (d?.status === 'aprovado') {
      return (
        <StatusBadge status="success">
          <Check className="h-3 w-3 mr-1" /> Aprovado
        </StatusBadge>
      )
    }
    if (d?.status === 'recuperacao') {
      return (
        <StatusBadge status="warning">
          <AlertCircle className="h-3 w-3 mr-1" /> Recuperação
        </StatusBadge>
      )
    }
    if (d?.status === 'reprovado') {
      return (
        <StatusBadge status="destructive">
          <X className="h-3 w-3 mr-1" /> Reprovado
        </StatusBadge>
      )
    }
    return <span className="text-[12px] text-muted-foreground">—</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 px-1 pt-2">
        <Select
          value={disciplinaId}
          onValueChange={v => {
            Object.values(timersRef.current).forEach(t => clearTimeout(t))
            timersRef.current = {}
            setDisciplinaId(v)
            setAlunoExpandido('')
            setSubAba('resumo')
          }}
        >
          <SelectTrigger className="min-w-[220px] max-w-xs">
            <SelectValue placeholder="Selecione uma disciplina" />
          </SelectTrigger>
          <SelectContent>
            {disciplinas.map(d => (
              <SelectItem key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>
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

      {!disciplinaId ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
          Selecione uma disciplina para começar.
        </div>
      ) : loading ? (
        <div className="py-8 text-center text-muted-foreground">Carregando notas...</div>
      ) : (
        <>
          <div className="mb-4 flex gap-1 border-b border-border">
            {subTabs.map(t => {
              const Icon = t.icon
              const ativo = subAba === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setSubAba(t.key)
                    if (t.key === 'recuperacoes') setRecSubAba(recTabs[0] || 'final')
                  }}
                  aria-pressed={ativo}
                  className={cn(
                    'flex items-center gap-2 border-b-2 px-3 py-2 text-[14px] font-semibold transition-colors',
                    ativo
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              )
            })}
          </div>

          {subAba === 'resumo' && (
            <div className="space-y-4 px-1">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                <StatCardResumo
                  icon={Target}
                  label="Média da Turma"
                  value={mediaTurma !== null ? mediaTurma.toFixed(2) : '—'}
                  valueClass="text-primary"
                  iconClass="bg-primary/10 text-primary"
                />
                <StatCardResumo
                  icon={TrendingUp}
                  label="Maior Média"
                  value={maior !== null ? maior.toFixed(2) : '—'}
                  valueClass="text-success"
                  iconClass="bg-success/10 text-success"
                />
                <StatCardResumo
                  icon={TrendingDown}
                  label="Menor Média"
                  value={menor !== null ? menor.toFixed(2) : '—'}
                  valueClass="text-warning"
                  iconClass="bg-warning/10 text-warning"
                />
                <StatCardResumo
                  icon={Medal}
                  label="Acima da Média"
                  value={String(acima)}
                  valueClass="text-success"
                  iconClass="bg-success/10 text-success"
                />
                <StatCardResumo
                  icon={Users}
                  label="Abaixo da Média"
                  value={String(abaixo)}
                  valueClass="text-destructive"
                  iconClass="bg-destructive/10 text-destructive"
                />
              </div>

              {alunosVisiveis.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
                  Nenhum aluno matriculado nesta turma.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
                  <Table className="min-w-max">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="sticky left-0 z-20 min-w-[200px] bg-muted/50 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Aluno
                        </TableHead>
                        {periodos.map(p => (
                          <TableHead
                            key={p}
                            className="min-w-[72px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {p}º Bim.
                          </TableHead>
                        ))}
                        <TableHead className="min-w-[80px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Média Final
                        </TableHead>
                        <TableHead className="min-w-[110px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Situação
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alunosVisiveis.map((aluno, idx) => {
                        const d = desempenhoMap.get(aluno.id)
                        const mediaFinal = d?.media_final ?? null
                        return (
                          <TableRow key={aluno.id} className={cn(idx % 2 === 1 && 'bg-muted/30')}>
                            <TableCell className="sticky left-0 z-10 bg-card px-3 py-2.5">
                              <p className="text-[14px] font-semibold text-foreground">{aluno.nome_completo}</p>
                            </TableCell>
                            {periodos.map(p => {
                              const m = d?.medias_periodo[p - 1] ?? null
                              return (
                                <TableCell key={p} className="px-2 py-2.5 text-center">
                                  <span
                                    className={cn(
                                      'text-[14px] font-semibold tabular-nums',
                                      m === null
                                        ? 'text-muted-foreground'
                                        : m >= mediaMinima
                                          ? 'text-success'
                                          : 'text-destructive'
                                    )}
                                  >
                                    {m !== null ? m.toFixed(2) : '—'}
                                  </span>
                                </TableCell>
                              )
                            })}
                            <TableCell className="px-2 py-2.5 text-center">
                              <span
                                className={cn(
                                  'text-[14px] font-bold tabular-nums',
                                  mediaFinal === null
                                    ? 'text-muted-foreground'
                                    : d?.status === 'aprovado' || mediaFinal >= mediaMinima
                                      ? 'text-success'
                                      : 'text-destructive'
                                )}
                              >
                                {mediaFinal !== null ? mediaFinal.toFixed(2) : '—'}
                              </span>
                            </TableCell>
                            <TableCell className="px-2 py-2.5 text-center">{renderSituacao(d)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {subAba === 'registro' && (
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
                    {!config?.limitar_avaliacoes && podeEditar && (
                      <>
                        <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
                        <div className="flex items-center gap-1">
                          <Input
                            placeholder="Nova avaliação..."
                            value={novaDescricao}
                            onChange={e => setNovaDescricao(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleAdicionarAvaliacao()
                            }}
                            className="h-8 w-44 text-[13px]"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleAdicionarAvaliacao}
                            disabled={!novaDescricao.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
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
                    const media = calcMediaPeriodo(aluno.id, periodoAtivo)
                    const comNota = descricoes.filter(d => (getNota(aluno.id, d)?.valor ?? null) !== null).length
                    const pendentes = descricoes.length - comNota
                    const cardKey = `${aluno.id}_${periodoAtivo}`
                    const cardFeedback = feedback[cardKey]

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
                              <div className="hidden items-center gap-1 lg:flex">{renderPills(aluno.id)}</div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-bold tabular-nums',
                                  media === null
                                    ? 'border-border bg-muted text-muted-foreground'
                                    : media >= mediaMinima
                                      ? 'border-success/40 bg-success/10 text-success'
                                      : 'border-destructive/40 bg-destructive/10 text-destructive'
                                )}
                              >
                                <span className="text-[11px] font-semibold text-muted-foreground">Média</span>
                                {media !== null ? media.toFixed(2) : '—'}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 text-[12px] font-semibold',
                                  meta.textClass
                                )}
                              >
                                <StatusIcon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{meta.label}</span>
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1 lg:hidden">{renderPills(aluno.id)}</div>
                            <p className="text-[12px] text-muted-foreground">
                              {descricoes.length > 0 && comNota === descricoes.length
                                ? 'Todas as notas lançadas'
                                : `${comNota}/${descricoes.length} notas lançadas · ${pendentes} pendente${pendentes === 1 ? '' : 's'}`}
                            </p>
                          </div>

                          {descricoes.length === 0 ? (
                            <div className="rounded-md border border-border bg-muted/30 px-3 py-4 text-center text-[13px] text-muted-foreground">
                              Nenhuma avaliação registrada neste bimestre.
                              {!config?.limitar_avaliacoes && podeEditar && ' Adicione uma avaliação acima.'}
                            </div>
                          ) : (
                            <div className="overflow-x-auto rounded-md border border-border">
                              <Table className="min-w-max">
                                <TableHeader>
                                  <TableRow>
                                    {descricoes.map(d => (
                                      <TableHead
                                        key={d}
                                        className="min-w-[150px] px-2 py-1.5 text-center align-top"
                                      >
                                        <div className="text-[12px] font-semibold leading-tight text-foreground">
                                          {d}
                                        </div>
                                        <div className="mt-0.5 text-[10px] font-normal text-muted-foreground">
                                          Peso {getPeso(d)}
                                        </div>
                                        <DatePicker
                                          value={datasAvaliacoes.get(`${aluno.id}_${d}`) || ''}
                                          onChange={date => handleDataChange(aluno.id, d, date)}
                                          disabled={!podeEditar}
                                          size="sm"
                                          label="Data da Avaliação"
                                          className="mx-auto mt-1.5 w-[140px]"
                                        />
                                      </TableHead>
                                    ))}
                                    <TableHead className="min-w-[72px] px-2 py-1.5 text-center text-[12px] font-semibold text-muted-foreground">
                                      Média
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    {descricoes.map(d => {
                                      const nota = getNota(aluno.id, d)
                                      const vazio = (nota?.valor ?? null) === null
                                      return (
                                        <TableCell key={d} className="px-1.5 py-1.5 text-center">
                                          <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max={getNotaMaxima(d)}
                                            value={nota?.valor ?? ''}
                                            onChange={e => handleNotaChange(aluno.id, d, e.target.value)}
                                            disabled={!podeEditar}
                                            className={cn(
                                              'mx-auto h-9 w-16 rounded-sm text-center text-[14px] font-semibold tabular-nums',
                                              vazio
                                                ? 'border-dashed border-foreground/30 bg-muted/60'
                                                : 'border-border bg-card'
                                            )}
                                          />
                                        </TableCell>
                                      )
                                    })}
                                    <TableCell className="px-2 py-1.5 text-center">
                                      {media !== null ? (
                                        <span
                                          className={cn(
                                            'text-[20px] font-bold leading-none tabular-nums',
                                            media >= mediaMinima ? 'text-success' : 'text-destructive'
                                          )}
                                        >
                                          {media.toFixed(2)}
                                        </span>
                                      ) : (
                                        <span className="text-[20px] font-bold leading-none text-muted-foreground/40">
                                          —
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <SaveStatus feedback={cardFeedback} />
                            <button
                              type="button"
                              onClick={() => handleLimparNotas(aluno.id)}
                              disabled={!podeEditar}
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
                            >
                              <Eraser className="h-3.5 w-3.5" />
                              Limpar notas
                            </button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </div>
          )}

          {subAba === 'recuperacoes' && (
            <div className="space-y-4">
              {recTabs.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <RefreshCcw className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-[15px] text-muted-foreground">
                    Recuperação não habilitada no método de avaliação desta turma.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-1 border-b border-border">
                    {recTabs.map(t => {
                      const meta = recTabMeta[t]
                      const Icon = meta.icon
                      const ativo = recSubAba === t
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRecSubAba(t)}
                          aria-pressed={ativo}
                          className={cn(
                            'flex items-center gap-2 border-b-2 px-3 py-2 text-[14px] font-semibold transition-colors',
                            ativo
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {meta.label}
                        </button>
                      )
                    })}
                  </div>

                  {recSubAba === 'avaliacao' && (
                    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
                      <Table className="min-w-max">
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="sticky left-0 z-20 min-w-[200px] bg-muted/50 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Aluno
                            </TableHead>
                            {descricoes.map(d => (
                              <TableHead key={d} className="min-w-[120px] px-2 py-2.5 text-center">
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  {d}
                                </div>
                                <div className="mt-1 flex justify-center gap-3 text-[10px] font-normal text-muted-foreground">
                                  <span>Nota</span>
                                  <span>Rec</span>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="min-w-[70px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Média
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alunosVisiveis.map(aluno => {
                            const media = calcMediaPeriodo(aluno.id, periodoAtivo)
                            return (
                              <TableRow key={aluno.id}>
                                <TableCell className="sticky left-0 z-10 bg-card px-3 py-2">
                                  <p className="text-[14px] font-semibold text-foreground">{aluno.nome_completo}</p>
                                </TableCell>
                                {descricoes.map(d => {
                                  const nota = getNota(aluno.id, d)
                                  const notaVal = nota?.valor ?? null
                                  const precisaRec = notaVal !== null && notaVal < mediaMinima
                                  const rec = getRec(aluno.id, 'avaliacao', periodoAtivo, d)
                                  const recMax = getNotaMaxima(d)
                                  return (
                                    <TableCell key={d} className="px-2 py-1.5 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <span
                                          className={cn(
                                            'min-w-[3ch] text-[13px] font-semibold tabular-nums',
                                            notaVal !== null ? 'text-foreground' : 'text-muted-foreground/50'
                                          )}
                                        >
                                          {notaVal !== null ? notaVal : '—'}
                                        </span>
                                        {precisaRec && (
                                          <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max={recMax}
                                            value={rec?.valor ?? ''}
                                            onChange={e =>
                                              handleRecChange(aluno.id, 'avaliacao', periodoAtivo, d, e.target.value)
                                            }
                                            disabled={!podeEditar}
                                            className="h-8 w-14 text-center text-[12px] font-semibold tabular-nums"
                                          />
                                        )}
                                      </div>
                                    </TableCell>
                                  )
                                })}
                                <TableCell className="px-2 py-1.5 text-center">
                                  <span
                                    className={cn(
                                      'text-[14px] font-bold tabular-nums',
                                      media !== null
                                        ? media >= mediaMinima
                                          ? 'text-success'
                                          : 'text-destructive'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    {media !== null ? media.toFixed(2) : '—'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {recSubAba === 'periodo' && (
                    <div className="space-y-3">
                      {(() => {
                        const alunosRec = alunosVisiveis
                          .map(aluno => ({
                            aluno,
                            media: calcMediaPeriodo(aluno.id, periodoAtivo),
                          }))
                          .filter(({ media }) => media === null || media < mediaMinima)

                        if (alunosRec.length === 0) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
                              Nenhum aluno em recuperação no {periodoAtivo}º bimestre.
                            </div>
                          )
                        }

                        return (
                          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
                            <Table className="min-w-max">
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  <TableHead className="sticky left-0 z-20 min-w-[200px] bg-muted/50 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Aluno
                                  </TableHead>
                                  <TableHead className="min-w-[110px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Média · {periodoAtivo}º Bim
                                  </TableHead>
                                  <TableHead className="min-w-[80px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Rec
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {alunosRec.map(({ aluno, media }) => {
                                  const rec = getRec(aluno.id, 'periodo', periodoAtivo)
                                  const precisaRec = media !== null && media < mediaMinima
                                  return (
                                    <TableRow key={aluno.id}>
                                      <TableCell className="sticky left-0 z-10 bg-card px-3 py-2">
                                        <p className="text-[14px] font-semibold text-foreground">{aluno.nome_completo}</p>
                                      </TableCell>
                                      <TableCell className="px-2 py-1.5 text-center">
                                        <span
                                          className={cn(
                                            'text-[13px] font-semibold tabular-nums',
                                            media === null
                                              ? 'text-muted-foreground'
                                              : media >= mediaMinima
                                                ? 'text-success'
                                                : 'text-destructive'
                                          )}
                                        >
                                          {media !== null ? media.toFixed(2) : '—'}
                                        </span>
                                      </TableCell>
                                      <TableCell className="px-2 py-1.5 text-center">
                                        {precisaRec ? (
                                          <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={rec?.valor ?? ''}
                                            onChange={e =>
                                              handleRecChange(aluno.id, 'periodo', periodoAtivo, null, e.target.value)
                                            }
                                            disabled={!podeEditar}
                                            className="mx-auto h-8 w-14 text-center text-[12px] font-semibold tabular-nums"
                                          />
                                        ) : (
                                          <span className="text-[13px] font-semibold text-muted-foreground">—</span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {recSubAba === 'final' && (
                    <div className="space-y-3">
                      {(() => {
                        const alunosFinal = alunosVisiveis.filter(aluno => {
                          const mediaAnual = desempenhoMap.get(aluno.id)?.media_anual ?? null
                          return mediaAnual !== null && mediaAnual < mediaMinima
                        })

                        if (alunosFinal.length === 0) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-8 text-center text-[15px] text-muted-foreground">
                              Nenhum aluno em recuperação final.
                            </div>
                          )
                        }

                        return (
                          <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
                            <Table className="min-w-max">
                              <TableHeader>
                                <TableRow className="bg-muted/50">
                                  <TableHead className="sticky left-0 z-20 min-w-[200px] bg-muted/50 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Aluno
                                  </TableHead>
                                  <TableHead className="min-w-[90px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Média Anual
                                  </TableHead>
                                  <TableHead className="min-w-[100px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Recuperação
                                  </TableHead>
                                  <TableHead className="min-w-[80px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Média Final
                                  </TableHead>
                                  <TableHead className="min-w-[110px] px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    Situação
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {alunosFinal.map(aluno => {
                                  const d = desempenhoMap.get(aluno.id)
                                  const mediaAnual = d?.media_anual ?? null
                                  const rec = getRec(aluno.id, 'final', null)
                                  const mediaFinal = d?.media_final ?? null
                                  return (
                                    <TableRow key={aluno.id}>
                                      <TableCell className="sticky left-0 z-10 bg-card px-3 py-2">
                                        <p className="text-[14px] font-semibold text-foreground">{aluno.nome_completo}</p>
                                      </TableCell>
                                      <TableCell className="px-2 py-2 text-center">
                                        <span
                                          className={cn(
                                            'text-[14px] font-semibold tabular-nums',
                                            mediaAnual !== null
                                              ? mediaAnual >= mediaMinima
                                                ? 'text-success'
                                                : 'text-destructive'
                                              : 'text-muted-foreground'
                                          )}
                                        >
                                          {mediaAnual !== null ? mediaAnual.toFixed(2) : '—'}
                                        </span>
                                      </TableCell>
                                      <TableCell className="px-2 py-2 text-center">
                                        <Input
                                          type="number"
                                          step="0.1"
                                          min="0"
                                          max="10"
                                          value={rec?.valor ?? ''}
                                          onChange={e => handleRecChange(aluno.id, 'final', null, null, e.target.value)}
                                          disabled={!podeEditar}
                                          className="mx-auto h-8 w-16 text-center text-[13px] font-semibold tabular-nums"
                                        />
                                      </TableCell>
                                      <TableCell className="px-2 py-2 text-center">
                                        <span
                                          className={cn(
                                            'text-[14px] font-bold tabular-nums',
                                            mediaFinal === null
                                              ? 'text-muted-foreground'
                                              : d?.status === 'aprovado' || mediaFinal >= mediaMinima
                                                ? 'text-success'
                                                : 'text-destructive'
                                          )}
                                        >
                                          {mediaFinal !== null ? mediaFinal.toFixed(2) : '—'}
                                        </span>
                                      </TableCell>
                                      <TableCell className="px-2 py-2 text-center">{renderSituacao(d)}</TableCell>
                                    </TableRow>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
