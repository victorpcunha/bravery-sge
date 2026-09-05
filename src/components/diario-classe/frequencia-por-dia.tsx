'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  registrarFrequenciaDia,
  listarFrequenciasDia,
  getDiasLetivosDaTurma,
  getEstatisticasFrequencia,
  type EstatisticasFrequencia,
  type AlunoMatriculado,
  type FrequenciaDia,
} from '@/lib/actions/diario-classe'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, CalendarDays, Info, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas?: any[]
  readOnly?: boolean
}

const STATUS_LIST: { value: FrequenciaDia['status']; label: string; icon: React.ReactNode; classes: string }[] = [
  { value: 'P', label: 'Presente', icon: <Check className="h-3.5 w-3.5" />, classes: 'bg-success text-white hover:bg-success/90' },
  { value: 'F', label: 'Ausente', icon: <X className="h-3.5 w-3.5" />, classes: 'bg-destructive text-white hover:bg-destructive/90' },
  { value: 'FJ', label: 'Justificado', icon: <AlertTriangle className="h-3.5 w-3.5" />, classes: 'bg-warning text-white hover:bg-warning/90' },
]

export default function FrequenciaPorDia({ turmaId, alunos, disciplinas, readOnly = false }: Props) {
  const { user, schoolId } = useAuth()
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [dias, setDias] = useState<number[]>([])
  const [frequencias, setFrequencias] = useState<Map<string, FrequenciaDia['status']>>(new Map())
  const [loading, setLoading] = useState(true)
  const [estatisticas, setEstatisticas] = useState<EstatisticasFrequencia | null>(null)
  const [salvando, setSalvando] = useState<Set<string>>(new Set())
  const [semCalendario, setSemCalendario] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null)

  const { pessoaId } = usePermissoes(schoolId || '')

  const carregar = useCallback(async () => {
    setLoading(true)
    setSemCalendario(false)
    try {
      const diasLetivos = await getDiasLetivosDaTurma(turmaId, ano, mes)
      if (diasLetivos.length === 0) {
        setSemCalendario(true)
        setDias([])
        setFrequencias(new Map())
        return
      }
      setDias(diasLetivos)

      const lista = await listarFrequenciasDia(turmaId, ano, mes, pessoaId)
      const map = new Map<string, FrequenciaDia['status']>()
      lista.forEach(f => {
        const parts = f.dia_letivo.split('-')
        const dia = parseInt(parts[2], 10)
        const key = `${f.aluno_id}_${dia}`
        map.set(key, f.status)
      })
      setFrequencias(map)
    } catch {
      toast.error('Erro ao carregar dias letivos')
    } finally {
      setLoading(false)
    }
  }, [turmaId, ano, mes])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!turmaId) return
    getEstatisticasFrequencia(turmaId, undefined, pessoaId)
      .then(setEstatisticas)
      .catch(() => {})
  }, [turmaId, pessoaId])

  const recarregarEstatisticas = useCallback(() => {
    getEstatisticasFrequencia(turmaId, undefined, pessoaId)
      .then(setEstatisticas)
      .catch(() => {})
  }, [turmaId, pessoaId])

  const handleRegistrar = async (alunoId: string, dia: number, status: FrequenciaDia['status'] | null) => {
    if (readOnly) return
    const key = `${alunoId}_${dia}`
    const savingKey = `${key}_${status}`
    setSalvando(prev => new Set(prev).add(savingKey))
    setPopoverOpen(null)

    try {
      const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      await registrarFrequenciaDia(schoolId, turmaId, alunoId, diaStr, status, pessoaId)
      setFrequencias(prev => {
        const next = new Map(prev)
        if (status) { next.set(key, status) }
        else { next.delete(key) }
        return next
      })
      recarregarEstatisticas()
    } catch {
      toast.error('Erro ao registrar frequência')
    } finally {
      setSalvando(prev => {
        const next = new Set(prev)
        next.delete(savingKey)
        return next
      })
    }
  }

  const handleMarcarTodosDia = async (dia: number, status: FrequenciaDia['status'] | null) => {
    if (readOnly) return
    const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    const alunosValidos = alunos.filter(al => {
      if (al.data_matricula && diaStr < al.data_matricula) return false
      if (al.data_saida && diaStr > al.data_saida) return false
      return true
    })
    if (alunosValidos.length === 0) { toast.info('Nenhum aluno ativo nesta data'); return }

    try {
      let erros = 0
      for (const aluno of alunosValidos) {
        await registrarFrequenciaDia(schoolId, turmaId, aluno.id, diaStr, status, pessoaId)
        const key = `${aluno.id}_${dia}`
        setFrequencias(prev => {
          const next = new Map(prev)
          if (status) { next.set(key, status) }
          else { next.delete(key) }
          return next
        })
      }
      if (erros === 0) {
        toast.success(status === 'P' ? 'Todos presentes' : status === 'F' ? 'Todos ausentes' : 'Registros removidos')
      }
      recarregarEstatisticas()
    } catch {
      toast.error('Erro ao marcar frequência')
    }
  }

  const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })

  const nomeDiaSemana = (dia: number) => {
    const d = new Date(ano, mes - 1, dia)
    return d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3).toUpperCase()
  }

  const alunosVisiveis = alunos.filter(a => !a.data_saida)

  const resumoPorDia: { dia: number; totalP: number; totalF: number; totalFJ: number }[] = []
  if (dias.length > 0) {
    dias.forEach(dia => {
      let totalP = 0, totalF = 0, totalFJ = 0
      alunosVisiveis.forEach(aluno => {
        const key = `${aluno.id}_${dia}`
        const s = frequencias.get(key)
        if (s === 'P') totalP++
        else if (s === 'F') totalF++
        else if (s === 'FJ') totalFJ++
      })
      resumoPorDia.push({ dia, totalP, totalF, totalFJ })
    })
  }

  const tabelaTemConteudo = dias.some(dia => {
    const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return diaStr <= hojeStr
  })

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => {
            if (mes === 1) { setMes(12); setAno(a => a - 1) }
            else setMes(m => m - 1)
          }}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize min-w-[140px] text-center tabular-nums">
            {nomeMes} {ano}
          </span>
          <Button variant="outline" size="icon" onClick={() => {
            if (mes === 12) { setMes(1); setAno(a => a + 1) }
            else setMes(m => m + 1)
          }}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setAno(hoje.getFullYear()); setMes(hoje.getMonth() + 1) }}>
            Hoje
          </Button>
        </div>
      </div>

      {estatisticas && (
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
            <div className="text-base font-bold text-foreground tabular-nums">{estatisticas.totalDiasLetivos}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Dias Letivos no mês</div>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
            <div className="text-base font-bold text-success tabular-nums">{estatisticas.diasRegistrados}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Dias c/ Registro</div>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
            <div className="text-base font-bold text-warning tabular-nums">{estatisticas.diasPendentes}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Dias Pendentes</div>
          </div>
        </div>
      )}

      {semCalendario ? (
        <div className="py-12 text-center text-muted-foreground">
          <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum dia letivo encontrado para este mês.</p>
          <p className="text-xs mt-1">Configure o calendário escolar em Gestão Acadêmica.</p>
        </div>
      ) : loading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Carregando dias letivos...</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 rounded-lg bg-muted/40 border border-border px-4 py-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-success"><Check className="h-2.5 w-2.5 text-white" /></span>
              Presente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-destructive"><X className="h-2.5 w-2.5 text-white" /></span>
              Ausente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-warning"><AlertTriangle className="h-2.5 w-2.5 text-white" /></span>
              Justificado
            </span>
            <span className="hidden sm:block text-muted-foreground/40">|</span>
            <span className="flex items-center gap-1.5 rounded-md bg-primary/10 text-primary font-medium px-2.5 py-1">
              <Info className="h-3.5 w-3.5" />
              Clique na célula para abrir opções
            </span>
          </div>

          <div className="overflow-auto border border-border rounded-lg">
            <Table className="min-w-max text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-muted/50 text-left py-2.5 px-3 min-w-[180px] z-20 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Aluno
                  </TableHead>
                  {dias.map(dia => {
                    const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                    const isFuture = diaStr > hojeStr
                    const alunosAtivos = alunosVisiveis.filter(al => {
                      if (al.data_matricula && diaStr < al.data_matricula) return false
                      if (al.data_saida && diaStr > al.data_saida) return false
                      return true
                    })
                    const allPresent = alunosAtivos.length > 0 && alunosAtivos.every(al => {
                      const k = `${al.id}_${dia}`
                      return frequencias.get(k) === 'P'
                    })

                    return (
                      <TableHead
                        key={dia}
                        className={cn(
                          "py-2 px-1 text-center border-l border-border min-w-[48px]",
                          isFuture ? "opacity-50" : "cursor-pointer"
                        )}
                      >
                        <div className="text-[13px] font-bold tabular-nums">{dia}</div>
                        <div className="text-[10px] font-normal text-muted-foreground">{nomeDiaSemana(dia)}</div>
                        {!isFuture && (
                          <div className="flex justify-center mt-0.5">
                            <Popover
                              open={popoverOpen === `header_dia_${dia}`}
                              onOpenChange={(o) => setPopoverOpen(o ? `header_dia_${dia}` : null)}
                            >
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors"
                                  title="Opções de frequência"
                                >
                                  <Users className="h-2.5 w-2.5" />
                                  {allPresent ? 'Limpar' : 'Todos'}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent side="bottom" align="center" className="w-52 p-1" sideOffset={4}>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMarcarTodosDia(dia, allPresent ? null : 'P')}
                                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors w-full text-left text-foreground hover:bg-muted"
                                  >
                                    <span className={cn(
                                      "flex h-5 w-5 items-center justify-center rounded-sm",
                                      allPresent ? "bg-muted text-muted-foreground" : "bg-success text-white"
                                    )}>
                                      <Check className="h-3 w-3" />
                                    </span>
                                    {allPresent ? 'Limpar' : 'Marcar todos como presente'}
                                  </button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosVisiveis.map((aluno, idx) => (
                  <TableRow key={aluno.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="sticky left-0 bg-card py-2 px-3 text-sm font-medium z-10">
                      {aluno.nome_completo}
                    </TableCell>
                    {dias.map(dia => {
                      const key = `${aluno.id}_${dia}`
                      const status = frequencias.get(key) || null
                      const isSaving = salvando.has(`${key}_P`) || salvando.has(`${key}_F`) || salvando.has(`${key}_FJ`)
                      const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                      const isFuture = diaStr > hojeStr
                      const isBeforeMatricula = aluno.data_matricula ? diaStr < aluno.data_matricula : false
                      const isAfterSaida = aluno.data_saida ? diaStr > aluno.data_saida : false
                      const isOutsidePeriod = isBeforeMatricula || isAfterSaida
                      const disabled = readOnly || isSaving || isFuture || isOutsidePeriod
                      const popoverKey = `${key}_popover`

                      return (
                        <TableCell key={dia} className={cn(
                          "py-1 px-0.5 text-center border-l border-border",
                          isOutsidePeriod && "opacity-30"
                        )}>
                          {disabled || isOutsidePeriod ? (
                            <div className={cn(
                              "h-8 w-8 rounded-md mx-auto flex items-center justify-center",
                              isFuture && "border border-dashed border-muted-foreground/20 bg-transparent",
                              isOutsidePeriod && "bg-transparent"
                            )}>
                              {status === 'P' && <Check className="h-3.5 w-3.5 text-success" />}
                              {status === 'F' && <X className="h-3.5 w-3.5 text-destructive" />}
                              {status === 'FJ' && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                            </div>
                          ) : (
                            <Popover open={popoverOpen === popoverKey} onOpenChange={(o) => setPopoverOpen(o ? popoverKey : null)}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  disabled={disabled || isSaving}
                                  className={cn(
                                    "h-8 w-8 rounded-md mx-auto flex items-center justify-center transition-all",
                                    !status && "border border-dashed border-muted-foreground/30 bg-transparent hover:border-primary/50 hover:bg-primary/5",
                                    status === 'P' && "bg-success text-white shadow-xs",
                                    status === 'F' && "bg-destructive text-white shadow-xs",
                                    status === 'FJ' && "bg-warning text-white shadow-xs",
                                    isSaving && "opacity-50 animate-pulse",
                                    !disabled && "cursor-pointer"
                                  )}
                                  title={status ? 'Clique para alterar' : 'Clique para registrar'}
                                >
                                  {status === 'P' && <Check className="h-4 w-4" />}
                                  {status === 'F' && <X className="h-4 w-4" />}
                                  {status === 'FJ' && <AlertTriangle className="h-4 w-4" />}
                                  {!status && <span className="text-muted-foreground/30 text-[10px] font-medium">—</span>}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent side="right" align="center" className="w-40 p-1" sideOffset={4}>
                                <div className="flex flex-col gap-0.5">
                                  {STATUS_LIST.map(item => {
                                    const isAtivo = status === item.value
                                    return (
                                      <button
                                        key={item.value}
                                        type="button"
                                        onClick={() => handleRegistrar(aluno.id, dia, isAtivo ? null : item.value)}
                                        className={cn(
                                          "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors w-full text-left",
                                          isAtivo ? item.classes : "text-foreground hover:bg-muted"
                                        )}
                                      >
                                        <span className={cn(
                                          "flex h-5 w-5 items-center justify-center rounded-sm",
                                          isAtivo ? "bg-white/20" : item.classes
                                        )}>
                                          {item.icon}
                                        </span>
                                        {isAtivo ? `Remover ${item.label}` : item.label}
                                      </button>
                                    )
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}

                {tabelaTemConteudo && (
                  <TableRow className="bg-muted/30 border-t-2 border-border font-medium">
                    <TableCell className="sticky left-0 bg-muted/30 py-2 px-3 text-[12px] font-semibold text-foreground z-10">
                      Resumo
                    </TableCell>
                    {resumoPorDia.map(r => (
                      <TableCell key={`res_${r.dia}`} className="py-2 px-1 text-center border-l border-border">
                        <div className="flex flex-col items-center gap-1 text-[11px]">
                          <span className="text-success font-semibold">{r.totalP} P</span>
                          <span className="text-destructive font-semibold">{r.totalF} F</span>
                          <span className="text-warning font-semibold">{r.totalFJ} FJ</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}