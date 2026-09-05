'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  registrarFrequenciaAula,
  listarFrequenciasAula,
  getAulasDaTurma,
  getEstatisticasFrequencia,
  type EstatisticasFrequencia,
  type AlunoMatriculado,
  type AulaQuadro,
  type FrequenciaAula,
} from '@/lib/actions/diario-classe'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, Info, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type DisciplinaItem = {
  id: string
  matriz_disciplina_id: string
  disciplina_id: string
  nome: string
  nome_abreviado: string
}

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas: DisciplinaItem[]
  readOnly?: boolean
}

const STATUS_LIST: { value: FrequenciaAula['status']; label: string; icon: React.ReactNode; classes: string }[] = [
  { value: 'P', label: 'Presente', icon: <Check className="h-3.5 w-3.5" />, classes: 'bg-success text-white hover:bg-success/90' },
  { value: 'F', label: 'Ausente', icon: <X className="h-3.5 w-3.5" />, classes: 'bg-destructive text-white hover:bg-destructive/90' },
  { value: 'FJ', label: 'Justificado', icon: <AlertTriangle className="h-3.5 w-3.5" />, classes: 'bg-warning text-white hover:bg-warning/90' },
]

export default function FrequenciaPorAula({ turmaId, alunos, disciplinas, readOnly = false }: Props) {
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [aulas, setAulas] = useState<AulaQuadro[]>([])
  const [frequencias, setFrequencias] = useState<Map<string, FrequenciaAula['status']>>(new Map())
  const [loading, setLoading] = useState(false)
  const [estatisticas, setEstatisticas] = useState<EstatisticasFrequencia | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const { schoolId } = useAuth()
  const [salvando, setSalvando] = useState<Set<string>>(new Set())
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const { pessoaId } = usePermissoes(schoolId || '')

  const carregar = useCallback(async () => {
    if (!disciplinaId || !turmaId) {
      setAulas([])
      setFrequencias(new Map())
      return
    }
    setLoading(true)
    try {
      const aulasData = await getAulasDaTurma(turmaId, disciplinaId, ano, mes, pessoaId)
      setAulas(aulasData)

      if (aulasData.length > 0) {
        const lista = await listarFrequenciasAula(turmaId, disciplinaId, ano, mes, pessoaId)
        const map = new Map<string, FrequenciaAula['status']>()
        lista.forEach(f => {
          const key = `${f.aluno_id}_${f.horario_id}_${f.data_aula}`
          map.set(key, f.status)
        })
        setFrequencias(map)
      } else {
        setFrequencias(new Map())
      }
    } catch {
      toast.error('Erro ao carregar aulas')
    } finally {
      setLoading(false)
    }
  }, [turmaId, disciplinaId, ano, mes, pessoaId])

  useEffect(() => { carregar() }, [carregar])

  useEffect(() => {
    if (!disciplinaId || !turmaId) {
      setEstatisticas(null)
      return
    }
    setLoadingStats(true)
    getEstatisticasFrequencia(turmaId, disciplinaId, pessoaId)
      .then(setEstatisticas)
      .catch(() => {})
      .finally(() => setLoadingStats(false))
  }, [disciplinaId, turmaId, pessoaId])

  const recarregarEstatisticas = useCallback(() => {
    if (!disciplinaId || !turmaId) return
    getEstatisticasFrequencia(turmaId, disciplinaId, pessoaId)
      .then(setEstatisticas)
      .catch(() => {})
  }, [disciplinaId, turmaId, pessoaId])

  const handleRegistrar = async (
    alunoId: string,
    horarioId: string,
    dataAula: string,
    status: FrequenciaAula['status'] | null
  ) => {
    const key = `${alunoId}_${horarioId}_${dataAula}`
    const savingKey = `${key}_${status}`
    setSalvando(prev => new Set(prev).add(savingKey))
    setPopoverOpen(null)

    try {
      const result = await registrarFrequenciaAula(schoolId, turmaId, horarioId, alunoId, dataAula, status, pessoaId)
      if (!result.success) {
        toast.error(result.error || 'Erro ao registrar frequência')
        return
      }
      setFrequencias(prev => {
        const next = new Map(prev)
        if (status) {
          next.set(key, status)
        } else {
          next.delete(key)
        }
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

  const handleMarcarTodos = async (horarioId: string, dataAula: string, status: FrequenciaAula['status'] | null) => {
    if (readOnly) return
    const alunosValidos = alunos.filter(aluno => {
      if (aluno.data_matricula && dataAula < aluno.data_matricula) return false
      if (aluno.data_saida && dataAula > aluno.data_saida) return false
      return true
    })
    if (alunosValidos.length === 0) {
      toast.info('Nenhum aluno ativo nesta data')
      return
    }
    const savingKeys = new Set<string>()
    alunosValidos.forEach(aluno => {
      savingKeys.add(`${aluno.id}_${horarioId}_${dataAula}_${status}`)
    })
    setSalvando(prev => new Set([...prev, ...savingKeys]))

    try {
      let erros = 0
      for (const aluno of alunosValidos) {
        const result = await registrarFrequenciaAula(schoolId, turmaId, horarioId, aluno.id, dataAula, status, pessoaId)
        if (!result.success) { erros++; continue }
        const key = `${aluno.id}_${horarioId}_${dataAula}`
        setFrequencias(prev => {
          const next = new Map(prev)
          if (status) { next.set(key, status) }
          else { next.delete(key) }
          return next
        })
      }
      if (erros === 0) {
        toast.success(status === 'P' ? 'Todos marcados como presente' : status === 'F' ? 'Todos marcados como ausente' : 'Frequências removidas')
      } else {
        toast.error(`${erros} aluno(s) com erro`)
      }
      recarregarEstatisticas()
    } catch {
      toast.error('Erro ao marcar frequência em lote')
    } finally {
      setSalvando(prev => {
        const next = new Set(prev)
        savingKeys.forEach(k => next.delete(k))
        return next
      })
    }
  }

  const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })

  const aulasPorData = aulas.reduce<{ data: string; diaSemana: string; aulas: AulaQuadro[] }[]>((acc, aula) => {
    const grupo = acc.find(g => g.data === aula.data)
    if (grupo) {
      grupo.aulas.push(aula)
    } else {
      const d = new Date(aula.data + 'T12:00:00')
      const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '')
      acc.push({ data: aula.data, diaSemana, aulas: [aula] })
    }
    return acc
  }, [])

  const formatarDataCurta = (dataStr: string) => {
    const d = new Date(dataStr + 'T12:00:00')
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const alunosVisiveis = alunos.filter(a => !a.data_saida)

  const resumoPorAula = aulasPorData.map(grupo =>
    grupo.aulas.map(aula => {
      let totalP = 0, totalF = 0, totalFJ = 0
      alunosVisiveis.forEach(aluno => {
        const key = `${aluno.id}_${aula.horario_id}_${aula.data}`
        const s = frequencias.get(key)
        if (s === 'P') totalP++
        else if (s === 'F') totalF++
        else if (s === 'FJ') totalFJ++
      })
      return { horario_id: aula.horario_id, data: aula.data, totalP, totalF, totalFJ }
    })
  ).flat()

  const resumoMap = new Map(resumoPorAula.map(r => [`${r.horario_id}_${r.data}`, r]))

  const tabelaTemConteudo = aulasPorData.some(grupo =>
    grupo.aulas.some(aula => {
      const hojeLocal = new Date()
      const aulaDate = new Date(aula.data + 'T12:00:00')
      return aulaDate <= hojeLocal
    })
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-8 pt-2 px-1">
        <div>
          <Select value={disciplinaId} onValueChange={setDisciplinaId}>
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

      {!disciplinaId ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Selecione uma disciplina para lançar a frequência.</p>
        </div>
      ) : loading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">Carregando aulas...</div>
      ) : aulas.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma aula encontrada para esta disciplina neste mês.</p>
          <p className="text-xs mt-1">Verifique o quadro de horários da turma.</p>
        </div>
      ) : (
        <>
          {loadingStats ? (
            <div className="text-xs text-muted-foreground mb-4">Carregando indicadores...</div>
          ) : estatisticas && (
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-foreground tabular-nums">{estatisticas.diasDisciplina ?? '-'}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Dias da Disc.</div>
              </div>
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-success tabular-nums">{estatisticas.diasRegistrados}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Dias c/ Registro</div>
              </div>
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-warning tabular-nums">{estatisticas.diasPendentes}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Dias Pendentes</div>
              </div>
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-foreground tabular-nums">{estatisticas.totalAulas ?? '-'}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Aulas no Quadro</div>
              </div>
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-success tabular-nums">{estatisticas.aulasRegistradas ?? '-'}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Aulas c/ Registro</div>
              </div>
              <div className="rounded-md border border-border bg-card px-3 py-2 text-center whitespace-nowrap">
                <div className="text-base font-bold text-warning tabular-nums">{estatisticas.aulasPendentes ?? '-'}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Aulas Pendentes</div>
              </div>
            </div>
          )}

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
            <span className="hidden sm:block text-muted-foreground/40">|</span>
            <span className="flex items-center gap-1.5 rounded-md bg-primary/10 text-primary font-medium px-2.5 py-1">
              <Info className="h-3.5 w-3.5" />
              Clique no cabeçalho da aula para marcar todos
            </span>
          </div>

          <div className="overflow-auto border border-border rounded-lg" ref={tableRef}>
            <Table className="min-w-max text-xs">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="sticky left-0 bg-muted/50 text-left py-2.5 px-3 min-w-[180px] z-20 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Aluno
                  </TableHead>
                  {aulasPorData.map(grupo => (
                    <TableHead
                      key={grupo.data}
                      colSpan={grupo.aulas.length}
                      className="py-2 px-1 text-center font-semibold border-l border-border text-[12px] text-foreground"
                    >
                      <div>{formatarDataCurta(grupo.data)}</div>
                      <div className="text-[10px] font-normal text-muted-foreground">{grupo.diaSemana}</div>
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card text-left py-1.5 px-3 min-w-[180px] z-20" />
                  {aulasPorData.map(grupo =>
                    grupo.aulas.map((aula) => {
                      const isFuture = aula.data > hojeStr
                      const alunosValidosAula = alunosVisiveis.filter(al => {
                        if (al.data_matricula && aula.data < al.data_matricula) return false
                        if (al.data_saida && aula.data > al.data_saida) return false
                        return true
                      })
                      const allPresent = alunosValidosAula.length > 0 && alunosValidosAula.every(al => {
                        const k = `${al.id}_${aula.horario_id}_${aula.data}`
                        return frequencias.get(k) === 'P'
                      })

                      return (
                        <TableHead
                          key={`${aula.horario_id}_${aula.data}`}
                          className={cn(
                            "py-1.5 px-1 text-center font-normal text-muted-foreground border-l border-border min-w-[56px]",
                            isFuture ? "opacity-50" : "cursor-pointer"
                          )}
                        >
                          <div className="text-[11px] font-semibold">Aula {aula.numero_aula}ª</div>
                          <div className="text-[10px]">{aula.horario_inicial}</div>
                          {!isFuture && (
                            <div className="flex justify-center mt-0.5">
                              <Popover
                                open={popoverOpen === `header_aula_${aula.horario_id}_${aula.data}`}
                                onOpenChange={(o) => setPopoverOpen(o ? `header_aula_${aula.horario_id}_${aula.data}` : null)}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors"
                                    title={allPresent ? 'Clique para opções de frequência' : 'Clique para opções de frequência'}
                                  >
                                    <Users className="h-2.5 w-2.5" />
                                    {allPresent ? 'Limpar' : 'Todos'}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" align="center" className="w-52 p-1" sideOffset={4}>
                                  <div className="flex flex-col gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() => handleMarcarTodos(aula.horario_id, aula.data, allPresent ? null : 'P')}
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
                    })
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosVisiveis.map((aluno, idx) => (
                  <TableRow key={aluno.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className={cn(
                      "sticky left-0 py-2 px-3 text-sm font-medium z-10",
                      "bg-card"
                    )}>
                      {aluno.nome_completo}
                    </TableCell>
                    {aulasPorData.map(grupo =>
                      grupo.aulas.map(aula => {
                        const key = `${aluno.id}_${aula.horario_id}_${aula.data}`
                        const status = frequencias.get(key) || null
                        const isSaving = salvando.has(`${key}_P`) || salvando.has(`${key}_F`) || salvando.has(`${key}_FJ`)
                        const isFuture = aula.data > hojeStr
                        const isBeforeMatricula = aluno.data_matricula ? aula.data < aluno.data_matricula : false
                        const isAfterSaida = aluno.data_saida ? aula.data > aluno.data_saida : false
                        const isOutsidePeriod = isBeforeMatricula || isAfterSaida
                        const disabled = readOnly || isSaving || isFuture || isOutsidePeriod
                        const popoverKey = `${key}_popover`

                        let tooltip = ''
                        if (isFuture) tooltip = 'Data futura'
                        else if (isBeforeMatricula) tooltip = 'Aluno ainda não matriculado'
                        else if (isAfterSaida) tooltip = 'Aluno não pertence mais à turma'

                        return (
                          <TableCell key={key} className={cn(
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
                                    title={tooltip || (status ? 'Clique para alterar' : 'Clique para registrar')}
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
                                          onClick={() => handleRegistrar(aluno.id, aula.horario_id, aula.data, isAtivo ? null : item.value)}
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
                      })
                    )}
                  </TableRow>
                ))}

                {tabelaTemConteudo && (
                  <TableRow className="bg-muted/30 border-t-2 border-border font-medium">
                    <TableCell className="sticky left-0 bg-muted/30 py-2 px-3 text-[12px] font-semibold text-foreground z-10">
                      Resumo
                    </TableCell>
                    {aulasPorData.map(grupo =>
                      grupo.aulas.map(aula => {
                        const resumo = resumoMap.get(`${aula.horario_id}_${aula.data}`)
                        return (
                          <TableCell key={`res_${aula.horario_id}_${aula.data}`} className="py-2 px-1 text-center border-l border-border">
                            <div className="flex flex-col items-center gap-1 text-[11px]">
                              <span className="text-success font-semibold">{resumo?.totalP ?? 0} P</span>
                              <span className="text-destructive font-semibold">{resumo?.totalF ?? 0} F</span>
                              <span className="text-warning font-semibold">{resumo?.totalFJ ?? 0} FJ</span>
                            </div>
                          </TableCell>
                        )
                      })
                    )}
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