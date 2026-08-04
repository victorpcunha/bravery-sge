'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  listarDiasComAula,
  listarPlanosAplicadosMes,
  listarPlanosDisponiveis,
  aplicarPlanoAula,
  removerPlanoAulaAplicado,
} from '@/lib/actions/diario-planos'
import { type PlanoAula } from '@/lib/actions/plano-ensino'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  BookOpen,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  GraduationCap,
  Info,
  ListChecks,
  Loader2,
  Lock,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type DisciplinaItem = {
  id: string
  matriz_disciplina_id: string
  disciplina_id: string
  nome: string
  nome_abreviado: string
}

type PlanoAplicado = {
  id: string
  turma_id: string
  matriz_disciplina_id: string
  data_aula: string
  horario_id: string | null
  plano_aula_id: string
  created_by: string | null
  created_at: string
  plano_aula: PlanoAula
}

type StatusDia = 'aplicada' | 'planejada' | 'pendente'

type Props = {
  turmaId: string
  disciplinas: DisciplinaItem[]
  pessoaId: string | null
}

function agruparPorData(lista: PlanoAplicado[]): Map<string, PlanoAplicado[]> {
  const mapa = new Map<string, PlanoAplicado[]>()
  for (const item of lista) {
    const atual = mapa.get(item.data_aula) || []
    atual.push(item)
    mapa.set(item.data_aula, atual)
  }
  return mapa
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function formatarDataBR(data: string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data + 'T12:00:00')
  if (isNaN(d.getTime())) return data
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function formatarPeriodos(periodos: number[] | undefined): string {
  if (!periodos || periodos.length === 0) return ''
  const itens = [...periodos].sort((a, b) => a - b).map(p => `${p}º`)
  if (itens.length === 1) return `${itens[0]} Período`
  const ultimo = itens.pop()
  return `${itens.join(', ')} e ${ultimo} Período`
}

type BnccItem = {
  tipo: string
  id: string
  codigo?: string
  nome?: string
  descricao?: string
}

const BNCC_TIPO_LABELS: Record<string, string> = {
  campo_experiencia: 'Campos de Experiência',
  objetivo: 'Objetivos de Aprendizagem',
  unidade_tematica: 'Unidades Temáticas',
  objeto_conhecimento: 'Objetos de Conhecimento',
  habilidade: 'Habilidades',
  area_conhecimento: 'Áreas de Conhecimento',
  competencia: 'Competências Específicas',
  habilidade_medio: 'Habilidades',
}

const BNCC_TIPO_ORDER = [
  'campo_experiencia',
  'objetivo',
  'unidade_tematica',
  'objeto_conhecimento',
  'habilidade',
  'area_conhecimento',
  'competencia',
  'habilidade_medio',
]

function agruparBnccPorTipo(bncc: BnccItem[] | undefined) {
  const grupos: { tipo: string; label: string; itens: BnccItem[] }[] = []
  for (const item of bncc || []) {
    const label = BNCC_TIPO_LABELS[item.tipo] || item.tipo || 'BNCC'
    let grupo = grupos.find(g => g.tipo === item.tipo)
    if (!grupo) {
      grupo = { tipo: item.tipo, label, itens: [] }
      grupos.push(grupo)
    }
    grupo.itens.push(item)
  }
  return grupos.sort((a, b) => BNCC_TIPO_ORDER.indexOf(a.tipo) - BNCC_TIPO_ORDER.indexOf(b.tipo))
}

function CampoDetalhe({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="h-3.5 w-1 shrink-0 rounded-full bg-primary" />
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-foreground">{label}</h3>
      </div>
      <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5">{children}</div>
    </div>
  )
}

function GrupoDetalhe({ icon: Icon, titulo, children }: { icon: LucideIcon; titulo: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-foreground">{titulo}</h3>
      </div>
      <div className="space-y-4 px-4 py-4">{children}</div>
    </section>
  )
}

export default function PlanoAulaDiario({ turmaId, disciplinas, pessoaId }: Props) {
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [diasComAula, setDiasComAula] = useState<string[]>([])
  const [planosMes, setPlanosMes] = useState<Map<string, PlanoAplicado[]>>(new Map())
  const [planosDisponiveis, setPlanosDisponiveis] = useState<PlanoAula[]>([])
  const [loadingDias, setLoadingDias] = useState(false)
  const [loadingDisponiveis, setLoadingDisponiveis] = useState(false)
  const [aplicando, setAplicando] = useState<string | null>(null)
  const [removendo, setRemovendo] = useState<string | null>(null)
  const [drawerData, setDrawerData] = useState<string | null>(null)
  const [visualizandoPlano, setVisualizandoPlano] = useState<PlanoAula | null>(null)

  useEffect(() => {
    if (!disciplinaId) return
    setLoadingDias(true)
    listarDiasComAula(turmaId, disciplinaId, ano, mes, pessoaId)
      .then(setDiasComAula)
      .catch(() => toast.error('Erro ao carregar dias com aula'))
      .finally(() => setLoadingDias(false))
  }, [turmaId, disciplinaId, ano, mes, pessoaId])

  useEffect(() => {
    if (!disciplinaId) return
    listarPlanosAplicadosMes(turmaId, disciplinaId, ano, mes, pessoaId)
      .then(lista => setPlanosMes(agruparPorData(lista)))
      .catch(() => toast.error('Erro ao carregar planos aplicados'))
  }, [turmaId, disciplinaId, ano, mes, pessoaId])

  useEffect(() => {
    if (!disciplinaId) return
    setLoadingDisponiveis(true)
    listarPlanosDisponiveis(turmaId, disciplinaId, pessoaId)
      .then(setPlanosDisponiveis)
      .catch(() => toast.error('Erro ao carregar planos disponíveis'))
      .finally(() => setLoadingDisponiveis(false))
  }, [turmaId, disciplinaId, pessoaId])

  const recarregarMes = useCallback(async () => {
    if (!disciplinaId) return
    const lista = await listarPlanosAplicadosMes(turmaId, disciplinaId, ano, mes, pessoaId)
    setPlanosMes(agruparPorData(lista))
  }, [turmaId, disciplinaId, ano, mes, pessoaId])

  const navegarMes = (delta: number) => {
    setDrawerData(null)
    setVisualizandoPlano(null)
    let novoMes = mes + delta
    let novoAno = ano
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    if (novoMes > 12) { novoMes = 1; novoAno++ }
    setMes(novoMes)
    setAno(novoAno)
  }

  const handleAplicar = async (planoAulaId: string) => {
    if (!drawerData) return
    setAplicando(planoAulaId)
    try {
      await aplicarPlanoAula(turmaId, disciplinaId, drawerData, planoAulaId, null, pessoaId)
      toast.success('Plano de aula aplicado com sucesso')
      await recarregarMes()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao aplicar plano')
    } finally {
      setAplicando(null)
    }
  }

  const handleRemover = async (id: string) => {
    setRemovendo(id)
    try {
      await removerPlanoAulaAplicado(id, pessoaId)
      toast.success('Aplicação removida')
      await recarregarMes()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover')
    } finally {
      setRemovendo(null)
    }
  }

  const handleAplicarDoModal = async (planoAulaId: string) => {
    await handleAplicar(planoAulaId)
    setVisualizandoPlano(null)
  }

  const disciplinaSelecionada = disciplinas.find(d => d.matriz_disciplina_id === disciplinaId)
  const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })
  const mesAbrev = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()

  const totalAplicadasMes = [...planosMes.values()].reduce((acc, arr) => acc + arr.length, 0)
  const diasAplicadosMes = planosMes.size

  const statusDoDia = (d: string): StatusDia => {
    if (planosMes.has(d)) return 'aplicada'
    return d <= hojeStr ? 'pendente' : 'planejada'
  }

  const diaSemanaCompleto = (d: string) => {
    return capitalizar(new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' }))
  }

  const dataDrawerFormatada = drawerData
    ? capitalizar(new Date(drawerData + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }))
    : ''

  const aplicadosNoDia = drawerData ? planosMes.get(drawerData) || [] : []
  const diaStatus = drawerData ? statusDoDia(drawerData) : null
  const appliedIdsDia = new Set(aplicadosNoDia.map(pa => pa.plano_aula_id))
  const diasFuturos = new Set(diasComAula.filter(d => d > hojeStr))

  const planoCobreDia = (p: PlanoAula): boolean => {
    if (!drawerData) return false
    if (p.data_inicio && drawerData < p.data_inicio) return false
    if (p.data_fim && drawerData > p.data_fim) return false
    return true
  }

  const disponiveisParaDia = planosDisponiveis.filter(p => !appliedIdsDia.has(p.id) && planoCobreDia(p))
  const planosForaDoIntervalo = planosDisponiveis.some(p => !appliedIdsDia.has(p.id) && !planoCobreDia(p))

  const bnccGrupos = agruparBnccPorTipo(visualizandoPlano?.bncc_fields as BnccItem[] | undefined)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-8 pt-2 px-1">
        <div>
          <Select
            value={disciplinaId}
            onValueChange={v => { setDisciplinaId(v); setDrawerData(null) }}
          >
            <SelectTrigger className="min-w-[220px]">
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
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Mês anterior" onClick={() => navegarMes(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center text-sm font-medium capitalize tabular-nums">
            {nomeMes} {ano}
          </span>
          <Button variant="outline" size="icon" aria-label="Próximo mês" onClick={() => navegarMes(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setDrawerData(null); setMes(hoje.getMonth() + 1); setAno(hoje.getFullYear()) }}>
            Hoje
          </Button>
        </div>
      </div>

      <div className="space-y-5 px-1 pb-2">
        {!disciplinaId ? (
        <EmptyState
          icon={BookOpen}
          title="Selecione uma disciplina"
          description="Escolha uma disciplina para visualizar e gerenciar os planos de aula dos dias letivos."
        />
      ) : loadingDias ? (
        <Card>
          <div className="space-y-3 p-6">
            <div className="h-16 rounded-lg bg-muted animate-pulse" />
            <div className="h-16 rounded-lg bg-muted animate-pulse" />
            <div className="h-16 rounded-lg bg-muted animate-pulse" />
          </div>
        </Card>
      ) : diasComAula.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhum dia letivo no mês"
          description="Não há dias com aula para esta disciplina neste mês. Verifique o quadro de horários da turma."
        />
      ) : (
        <>
          <div
            className={cn(
              'flex items-start gap-3 rounded-lg border px-4 py-3',
              totalAplicadasMes > 0 ? 'border-success/20 bg-success/10' : 'border-border bg-card'
            )}
            role="status"
          >
            {totalAplicadasMes > 0 ? (
              <CalendarCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <div>
              <p className={cn('text-[15px] font-semibold', totalAplicadasMes > 0 ? 'text-success' : 'text-foreground')}>
                {totalAplicadasMes > 0
                  ? `${totalAplicadasMes} ${totalAplicadasMes === 1 ? 'aula aplicada' : 'aulas aplicadas'} em ${nomeMes}`
                  : `Nenhuma aula aplicada em ${nomeMes} ainda`}
              </p>
              <p className={cn('mt-0.5 text-[13px]', totalAplicadasMes > 0 ? 'text-success/80' : 'text-muted-foreground')}>
                {totalAplicadasMes > 0
                  ? `${diasAplicadosMes} ${diasAplicadosMes === 1 ? 'dia possui plano' : 'dias possuem plano'} neste mês. Clique em um dia para gerenciar.`
                  : 'Clique em um dia abaixo para atribuir um plano de aula.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {diasComAula.map(d => {
              const diaNum = parseInt(d.split('-')[2], 10)
              const aplicados = planosMes.get(d) || []
              const status = statusDoDia(d)
              const isAplicada = status === 'aplicada'
              const isFuturo = diasFuturos.has(d)
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => { if (!isFuturo) setDrawerData(d) }}
                  aria-label={`Gerenciar plano de aula de ${diaSemanaCompleto(d)}, ${diaNum} de ${nomeMes}`}
                  aria-disabled={isFuturo}
                  title={isFuturo ? 'Aula em data futura — não é possível atribuir plano' : undefined}
                  className={cn(
                    'group flex w-full flex-col gap-2.5 rounded-lg border bg-card p-3 text-left transition-colors',
                    !isFuturo && 'hover:border-primary/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                    isFuturo && 'cursor-not-allowed opacity-60',
                    isAplicada && 'border-success/30'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex w-12 shrink-0 flex-col items-center justify-center rounded-md border py-1',
                        isAplicada
                          ? 'border-success/25 bg-success/10 text-success'
                          : 'border-border bg-muted/40 text-foreground'
                      )}
                    >
                      <span className={cn('text-[9px] font-bold uppercase tracking-wider', isAplicada ? 'text-success/80' : 'text-muted-foreground')}>
                        {mesAbrev}
                      </span>
                      <span className="mt-0.5 text-[18px] font-bold leading-none tabular-nums">
                        {String(diaNum).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="min-w-0 flex-1 truncate text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                      {diaSemanaCompleto(d)}
                    </p>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                  </div>

                  <div className="border-t border-border/60 pt-2.5">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        'min-w-0 flex-1 truncate text-[14px] font-semibold',
                        isAplicada ? 'text-success' : 'text-foreground'
                      )}>
                        {aplicados.length > 0 ? aplicados[0].plano_aula.tema : 'Nenhum plano atribuído'}
                      </p>
                      {isAplicada ? (
                        <StatusBadge status="success">
                          <CalendarCheck2 className="h-3 w-3" /> Aplicada
                        </StatusBadge>
                      ) : status === 'pendente' ? (
                        <StatusBadge status="warning">
                          <Clock className="h-3 w-3" /> Pendente
                        </StatusBadge>
                      ) : (
                        <StatusBadge status="muted">
                          <Lock className="h-3 w-3" /> Bloqueado
                        </StatusBadge>
                      )}
                    </div>
                    <p className="mt-1 truncate text-[12px] text-muted-foreground">
                      {aplicados.length > 0
                        ? (aplicados[0].plano_aula.conteudo || 'Sem conteúdo programático')
                        : (status === 'pendente'
                          ? 'Aula já realizada sem plano registrado'
                          : 'Aula em data futura')}
                    </p>
                    {aplicados.length > 1 && (
                      <p className="mt-1 text-[11px] font-medium text-success tabular-nums">
                        +{aplicados.length - 1} plano{aplicados.length - 1 > 1 ? 's' : ''} aplicado{aplicados.length - 1 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
      </div>

      <Sheet open={!!drawerData} onOpenChange={v => { if (!v) { setDrawerData(null); setVisualizandoPlano(null) } }}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="shrink-0 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <SheetTitle className="text-[16px] font-semibold">{dataDrawerFormatada}</SheetTitle>
            </div>
            <SheetDescription className="text-[13px] text-muted-foreground">
              {disciplinaSelecionada?.nome || 'Diário de Classe'} · Plano de Aula
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {aplicadosNoDia.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-lg border border-success/20 bg-success/10 px-3.5 py-3">
                  <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-[14px] font-semibold text-success">Aula já aplicada</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-success/80">
                      Este dia já possui plano de aula aplicado. Para corrigir, remova o plano atribuído e selecione novamente.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    Plano(s) aplicado(s) · {aplicadosNoDia.length}
                  </h4>
                  <div className="space-y-2">
                    {aplicadosNoDia.map(pa => (
                      <Card key={pa.id} className="border-l-4 border-l-success/60">
                        <CardContent className="px-3.5 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h5 className="text-[15px] font-semibold text-foreground">{pa.plano_aula.tema}</h5>
                            {pa.plano_aula.periodos && pa.plano_aula.periodos.length > 0 && (
                              <StatusBadge status="muted">{formatarPeriodos(pa.plano_aula.periodos)}</StatusBadge>
                            )}
                          </div>
                          {pa.plano_aula.conteudo && (
                            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                              {pa.plano_aula.conteudo}
                            </p>
                          )}
                          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                            {pa.plano_aula.data_inicio && pa.plano_aula.data_fim && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatarDataBR(pa.plano_aula.data_inicio)} — {formatarDataBR(pa.plano_aula.data_fim)}
                              </span>
                            )}
                            {pa.plano_aula.bncc_fields && Array.isArray(pa.plano_aula.bncc_fields) && pa.plano_aula.bncc_fields.length > 0 && (
                              <span className="flex items-center gap-1" title="Possui campos BNCC">
                                <GraduationCap className="h-3 w-3" />
                                BNCC
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/gestao-pedagogica/plano-ensino/${pa.plano_aula.plano_ensino_id}`, '_blank')}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver plano
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemover(pa.id)}
                              disabled={removendo === pa.id}
                            >
                              {removendo === pa.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                              Remover
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-[14px] font-semibold text-primary">
                      {diaStatus === 'pendente' ? 'Aula pendente de plano' : 'Dia disponível para planejamento'}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                      {diaStatus === 'pendente'
                        ? 'Esta aula já foi realizada e ainda não possui plano registrado.'
                        : 'Atribua um plano de aula a este dia para planejar a aula.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <ClipboardList className="h-3.5 w-3.5 text-primary" />
                    Planos disponíveis · {disponiveisParaDia.length}
                  </h4>

                  {loadingDisponiveis ? (
                    <div className="space-y-2">
                      <div className="h-28 rounded-lg bg-muted animate-pulse" />
                      <div className="h-28 rounded-lg bg-muted animate-pulse" />
                    </div>
                  ) : planosDisponiveis.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                      <BookOpen className="mx-auto h-6 w-6 text-muted-foreground/40" />
                      <p className="mt-2 text-[14px] font-medium text-foreground">Nenhum plano de ensino encontrado</p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        Crie um plano de aula no{' '}
                        <Link href="/gestao-pedagogica/plano-ensino" className="font-medium text-primary underline underline-offset-2">
                          Plano de Ensino
                        </Link>{' '}
                        primeiro.
                      </p>
                    </div>
                  ) : disponiveisParaDia.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                      {planosForaDoIntervalo ? (
                        <>
                          <CalendarX2 className="mx-auto h-6 w-6 text-muted-foreground/40" />
                          <p className="mt-2 text-[14px] font-medium text-foreground">Nenhum plano vale para esta data</p>
                          <p className="mt-1 text-[13px] text-muted-foreground">
                            Os planos de aula desta disciplina não abrangem a data selecionada.
                          </p>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mx-auto h-6 w-6 text-success/60" />
                          <p className="mt-2 text-[14px] font-medium text-foreground">Todos os planos já foram atribuídos a este dia</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {disponiveisParaDia.map(plano => (
                        <Card key={plano.id} className="border-l-4 border-l-primary/40 transition-colors hover:border-l-primary">
                          <CardContent className="px-3.5 py-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h5 className="text-[15px] font-semibold text-foreground">{plano.tema}</h5>
                              {plano.periodos && plano.periodos.length > 0 && (
                                <StatusBadge status="muted">{formatarPeriodos(plano.periodos)}</StatusBadge>
                              )}
                            </div>
                            {plano.conteudo && (
                              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                                {plano.conteudo}
                              </p>
                            )}
                            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                              {plano.data_inicio && plano.data_fim && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" />
                                  {formatarDataBR(plano.data_inicio)} — {formatarDataBR(plano.data_fim)}
                                </span>
                              )}
                              {plano.bncc_fields && Array.isArray(plano.bncc_fields) && plano.bncc_fields.length > 0 && (
                                <span className="flex items-center gap-1" title="Possui campos BNCC">
                                  <GraduationCap className="h-3 w-3" />
                                  BNCC
                                </span>
                              )}
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => setVisualizandoPlano(plano)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Visualizar
                              </Button>
                              <Button
                                size="sm"
                                className="gap-1.5"
                                onClick={() => handleAplicar(plano.id)}
                                disabled={aplicando === plano.id}
                              >
                                {aplicando === plano.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CalendarCheck2 className="h-3.5 w-3.5" />
                                )}
                                Atribuir ao dia
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!visualizandoPlano} onOpenChange={v => { if (!v) setVisualizandoPlano(null) }}>
        {visualizandoPlano && (
          <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 p-0">
            <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <DialogTitle className="text-[16px] font-semibold">Detalhes do Plano de Aula</DialogTitle>
              </div>
              <DialogDescription className="text-[13px] text-muted-foreground">
                Revise as informações do plano antes de aplicar ao dia.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <GrupoDetalhe icon={BookOpen} titulo="Informações Principais">
                  <CampoDetalhe label="Tema">
                    <p className="text-[16px] font-semibold text-foreground">{visualizandoPlano.tema}</p>
                  </CampoDetalhe>

                  {visualizandoPlano.periodos && visualizandoPlano.periodos.length > 0 && (
                    <CampoDetalhe label="Período">
                      <div className="flex flex-wrap gap-1.5">
                        {visualizandoPlano.periodos.map(per => (
                          <StatusBadge key={per} status="info">{per}º Período</StatusBadge>
                        ))}
                      </div>
                    </CampoDetalhe>
                  )}

                  {visualizandoPlano.conteudo && (
                    <CampoDetalhe label="Conteúdo">
                      <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                        {visualizandoPlano.conteudo}
                      </p>
                    </CampoDetalhe>
                  )}

                  {(visualizandoPlano.data_inicio || visualizandoPlano.data_fim) && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {visualizandoPlano.data_inicio && (
                        <CampoDetalhe label="Data início">
                          <p className="text-[14px] font-medium text-foreground tabular-nums">
                            {formatarDataBR(visualizandoPlano.data_inicio)}
                          </p>
                        </CampoDetalhe>
                      )}
                      {visualizandoPlano.data_fim && (
                        <CampoDetalhe label="Data fim">
                          <p className="text-[14px] font-medium text-foreground tabular-nums">
                            {formatarDataBR(visualizandoPlano.data_fim)}
                          </p>
                        </CampoDetalhe>
                      )}
                    </div>
                  )}
                </GrupoDetalhe>

                {bnccGrupos.length > 0 && (
                  <GrupoDetalhe icon={GraduationCap} titulo="Estrutura BNCC">
                    <div className="space-y-3">
                      {bnccGrupos.map(grupo => (
                        <div key={grupo.tipo}>
                          <p className="mb-1 text-[13px] font-medium text-foreground">{grupo.label}</p>
                          <ul className="space-y-1.5">
                            {grupo.itens.map((item, idx) => (
                              <li key={idx} className="rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
                                <span className="font-mono text-[12px] font-semibold text-primary">
                                  {item.codigo || item.nome || item.tipo}
                                </span>
                                {item.descricao && (
                                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{item.descricao}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </GrupoDetalhe>
                )}

                {(visualizandoPlano.recursos_didaticos || visualizandoPlano.metodologia || visualizandoPlano.avaliacao || visualizandoPlano.referencias) && (
                  <GrupoDetalhe icon={ListChecks} titulo="Outras Informações">
                    {visualizandoPlano.recursos_didaticos && (
                      <CampoDetalhe label="Recursos Didáticos">
                        <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                          {visualizandoPlano.recursos_didaticos}
                        </p>
                      </CampoDetalhe>
                    )}
                    {visualizandoPlano.metodologia && (
                      <CampoDetalhe label="Metodologia">
                        <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                          {visualizandoPlano.metodologia}
                        </p>
                      </CampoDetalhe>
                    )}
                    {visualizandoPlano.avaliacao && (
                      <CampoDetalhe label="Avaliação">
                        <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                          {visualizandoPlano.avaliacao}
                        </p>
                      </CampoDetalhe>
                    )}
                    {visualizandoPlano.referencias && (
                      <CampoDetalhe label="Referências">
                        <p className="text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                          {visualizandoPlano.referencias}
                        </p>
                      </CampoDetalhe>
                    )}
                  </GrupoDetalhe>
                )}
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
              <Button variant="outline" onClick={() => setVisualizandoPlano(null)}>
                Sair
              </Button>
              <Button onClick={() => handleAplicarDoModal(visualizandoPlano.id)} disabled={aplicando === visualizandoPlano.id}>
                {aplicando === visualizandoPlano.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <CalendarCheck2 className="h-3.5 w-3.5" />
                )}
                Atribuir ao dia
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
