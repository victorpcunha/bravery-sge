'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { getFirstSchool } from '@/lib/actions/schools'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle } from 'lucide-react'
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
}

const STATUS_CYCLE: (FrequenciaAula['status'] | null)[] = [null, 'P', 'F', 'FJ']

function nextStatus(current: FrequenciaAula['status'] | null): FrequenciaAula['status'] | null {
  const idx = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}

export default function FrequenciaPorAula({ turmaId, alunos, disciplinas }: Props) {
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
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState<Set<string>>(new Set())

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

  const { pessoaId } = usePermissoes(schoolId || '')

  const disciplinaSelecionada = disciplinas.find(d => d.matriz_disciplina_id === disciplinaId)

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

  useEffect(() => {
    carregar()
  }, [carregar])

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

  const handleToggle = async (alunoId: string, horarioId: string, dataAula: string) => {
    const key = `${alunoId}_${horarioId}_${dataAula}`
    const current = frequencias.get(key) || null
    const newVal = nextStatus(current)

    if (!schoolId) return

    const savingKey = `${key}_${newVal}`
    setSalvando(prev => new Set(prev).add(savingKey))

    try {
      const result = await registrarFrequenciaAula(schoolId, turmaId, horarioId, alunoId, dataAula, newVal, pessoaId)
      if (!result.success) {
        toast.error(result.error || 'Erro ao registrar frequência')
        return
      }
      setFrequencias(prev => {
        const next = new Map(prev)
        if (newVal) {
          next.set(key, newVal)
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

  const handleMarcarTodos = async (horarioId: string, dataAula: string, presente: boolean) => {
    if (!schoolId) return
    const status = presente ? 'P' : null
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
        const result = await registrarFrequenciaAula(schoolId, turmaId, horarioId, aluno.id, dataAula, status as any, pessoaId)
        if (!result.success) {
          erros++
          toast.error(`${aluno.nome_completo}: ${result.error}`)
          continue
        }
        const key = `${aluno.id}_${horarioId}_${dataAula}`
        setFrequencias(prev => {
          const next = new Map(prev)
          if (status) {
            next.set(key, status)
          } else {
            next.delete(key)
          }
          return next
        })
      }
      if (erros === 0) {
        toast.success(presente ? 'Todos presentes nesta aula' : 'Frequências removidas')
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
      const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'long' })
      acc.push({ data: aula.data, diaSemana, aulas: [aula] })
    }
    return acc
  }, [])

  const formatarDataCurta = (dataStr: string) => {
    const d = new Date(dataStr + 'T12:00:00')
    const dia = String(d.getDate()).padStart(2, '0')
    const mesNum = String(d.getMonth() + 1).padStart(2, '0')
    return `${dia}/${mesNum}`
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Disciplina
          </label>
          <select
            value={disciplinaId}
            onChange={e => setDisciplinaId(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm min-w-[200px]"
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map(d => (
              <option key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="icon" onClick={() => {
            if (mes === 1) { setMes(12); setAno(a => a - 1) }
            else setMes(m => m - 1)
          }}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize min-w-[140px] text-center">
            {nomeMes} {ano}
          </span>
          <Button variant="outline" size="icon" onClick={() => {
            if (mes === 12) { setMes(1); setAno(a => a + 1) }
            else setMes(m => m + 1)
          }}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            setAno(hoje.getFullYear())
            setMes(hoje.getMonth() + 1)
          }}>
            Hoje
          </Button>
        </div>
      </div>

      {!disciplinaId ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Selecione uma disciplina para lançar a frequência.</p>
        </div>
      ) : loading ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          Carregando aulas...
        </div>
      ) : aulas.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma aula encontrada para {disciplinaSelecionada?.nome || 'esta disciplina'} neste mês.</p>
          <p className="text-xs mt-1">Verifique o quadro de horários da turma.</p>
        </div>
      ) : (
        <>
          {loadingStats ? (
            <div className="text-xs text-muted-foreground mb-3">Carregando indicadores...</div>
          ) : estatisticas && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-foreground">{estatisticas.totalDiasLetivos}</div>
                <div className="text-[10px] text-muted-foreground">Dias Letivos</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-foreground">{estatisticas.diasDisciplina ?? '-'}</div>
                <div className="text-[10px] text-muted-foreground">Dias da Disciplina</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-green-600">{estatisticas.diasRegistrados}</div>
                <div className="text-[10px] text-muted-foreground">Dias c/ Registro</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-amber-600">{estatisticas.diasPendentes}</div>
                <div className="text-[10px] text-muted-foreground">Dias Pendentes</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-foreground">{estatisticas.totalAulas ?? '-'}</div>
                <div className="text-[10px] text-muted-foreground">Aulas no Quadro</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-green-600">{estatisticas.aulasRegistradas ?? '-'}</div>
                <div className="text-[10px] text-muted-foreground">Aulas c/ Registro</div>
              </div>
              <div className="rounded-lg border bg-card p-3 text-center">
                <div className="text-lg font-bold text-amber-600">{estatisticas.aulasPendentes ?? '-'}</div>
                <div className="text-[10px] text-muted-foreground">Aulas Pendentes</div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-max text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th
                    rowSpan={2}
                    className="sticky left-0 bg-muted text-left py-2 px-3 min-w-[180px] z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                  >
                    Aluno
                  </th>
                  {aulasPorData.map(grupo => (
                    <th
                      key={grupo.data}
                      colSpan={grupo.aulas.length}
                      className="py-2 px-1 text-center font-medium border-l border-slate-200"
                    >
                      <div className="text-xs capitalize">{grupo.diaSemana}</div>
                      <div className="text-sm font-bold">{formatarDataCurta(grupo.data)}</div>
                    </th>
                  ))}
                </tr>
                <tr className="border-b bg-muted/30">
                  {aulasPorData.map(grupo =>
                    grupo.aulas.map((aula) => {
                      const alunosValidosAula = alunos.filter(al => {
                        if (al.data_matricula && aula.data < al.data_matricula) return false
                        if (al.data_saida && aula.data > al.data_saida) return false
                        return true
                      })
                      const allPresent = alunosValidosAula.length > 0 && alunosValidosAula.every(aluno => {
                        const k = `${aluno.id}_${aula.horario_id}_${aula.data}`
                        return frequencias.get(k) === 'P'
                      })
                      const isFuture = aula.data > hojeStr

                      return (
                        <th
                          key={`${aula.horario_id}_${aula.data}`}
                          className={cn(
                            "py-1.5 px-1 text-center font-normal text-muted-foreground border-l border-slate-200 min-w-[64px] transition-colors group relative",
                            isFuture ? "cursor-default opacity-50" : "cursor-pointer hover:bg-primary/10"
                          )}
                          onClick={() => !isFuture && handleMarcarTodos(aula.horario_id, aula.data, !allPresent)}
                          title={isFuture ? 'Data futura' : (allPresent ? 'Clique para limpar todos' : 'Clique para marcar todos como presente')}
                        >
                          <div className="text-[10px] font-semibold">{aula.numero_aula}ª Aula</div>
                          <div className="text-[10px]">{aula.horario_inicial}</div>
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        </th>
                      )
                    })
                  )}
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno, idx) => (
                  <tr key={aluno.id} className={cn(
                    "border-b border-slate-100 hover:bg-slate-50/40",
                    idx % 2 === 0 && "bg-white",
                    idx % 2 === 1 && "bg-slate-50/30"
                  )}>
                    <td className={cn(
                      "sticky left-0 py-2 px-3 text-sm font-medium z-20 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.12)]",
                      idx % 2 === 0 && "bg-white",
                      idx % 2 === 1 && "bg-slate-50/30"
                    )}>
                      {aluno.nome_completo}
                    </td>
                      {aulasPorData.map(grupo =>
                        grupo.aulas.map(aula => {
                          const key = `${aluno.id}_${aula.horario_id}_${aula.data}`
                          const status = frequencias.get(key) || null
                          const isSaving = salvando.has(`${key}_P`) || salvando.has(`${key}_F`) || salvando.has(`${key}_FJ`)
                          const isFuture = aula.data > hojeStr
                          const isBeforeMatricula = aluno.data_matricula ? aula.data < aluno.data_matricula : false
                          const isAfterSaida = aluno.data_saida ? aula.data > aluno.data_saida : false
                          const isOutsidePeriod = isBeforeMatricula || isAfterSaida
                          const disabled = isSaving || isFuture || isOutsidePeriod

                          let tooltip = ''
                          if (isFuture) tooltip = 'Data futura'
                          else if (isBeforeMatricula) tooltip = 'Aluno ainda não matriculado nesta data'
                          else if (isAfterSaida) tooltip = 'Aluno não pertence mais à turma nesta data'

                          return (
                            <td key={key} className={cn(
                              "py-1 px-0.5 text-center border-l border-slate-100",
                              isOutsidePeriod && "opacity-40"
                            )}>
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={!isOutsidePeriod ? () => handleToggle(aluno.id, aula.horario_id, aula.data) : undefined}
                                className={cn(
                                  "w-7 h-7 rounded-md text-xs font-bold transition-all flex items-center justify-center mx-auto",
                                  !disabled && !isOutsidePeriod && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                                  isOutsidePeriod && "cursor-not-allowed",
                                  status === 'P' && "bg-green-100 text-green-700 hover:bg-green-200",
                                  status === 'F' && "bg-red-100 text-red-700 hover:bg-red-200",
                                  status === 'FJ' && "bg-amber-100 text-amber-700 hover:bg-amber-200",
                                  !status && !disabled && !isOutsidePeriod && "bg-transparent text-muted-foreground/30 hover:bg-slate-100 hover:text-muted-foreground/60",
                                  !status && (isFuture || isOutsidePeriod) && "bg-transparent text-muted-foreground/10",
                                  isFuture && "cursor-default",
                                  isSaving && "opacity-50 cursor-wait"
                                )}
                                title={tooltip || `${aluno.nome_completo}`}
                              >
                              {status === 'P' && <Check className="h-3.5 w-3.5" />}
                              {status === 'F' && <X className="h-3.5 w-3.5" />}
                              {status === 'FJ' && <AlertTriangle className="h-3.5 w-3.5" />}
                              {!status && '-'}
                            </button>
                          </td>
                        )
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-600" /> Presente
            </span>
            <span className="flex items-center gap-1">
              <X className="h-3 w-3 text-red-600" /> Falta
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-600" /> Falta Justificada
            </span>
            <span className="text-muted-foreground/60">Clique para alternar</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-muted-foreground/60">Clique no cabeçalho da aula para marcar todos</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-muted-foreground/60 italic">Células apagadas = fora do período ativo do aluno</span>
          </div>
        </>
      )}
    </div>
  )
}
