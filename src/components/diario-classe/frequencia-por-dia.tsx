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
import { getFirstSchool } from '@/lib/actions/schools'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Props = {
  turmaId: string
  alunos: AlunoMatriculado[]
  disciplinas?: any[]
}

const STATUS_CYCLE: (FrequenciaDia['status'] | null)[] = [null, 'P', 'F', 'FJ']

function nextStatus(current: FrequenciaDia['status'] | null): FrequenciaDia['status'] | null {
  const idx = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}

export default function FrequenciaPorDia({ turmaId, alunos, disciplinas }: Props) {
  const { user } = useAuth()
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [dias, setDias] = useState<number[]>([])
  const [frequencias, setFrequencias] = useState<Map<string, FrequenciaDia['status']>>(new Map())
  const [loading, setLoading] = useState(true)
  const [estatisticas, setEstatisticas] = useState<EstatisticasFrequencia | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [salvando, setSalvando] = useState<Set<string>>(new Set())
  const [semCalendario, setSemCalendario] = useState(false)

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

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

  useEffect(() => {
    carregar()
  }, [carregar])

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

  const handleToggle = async (alunoId: string, dia: number) => {
    const key = `${alunoId}_${dia}`
    const current = frequencias.get(key) || null
    const newVal = nextStatus(current)

    if (!schoolId) return

    const savingKey = `${key}_${newVal}`
    setSalvando(prev => new Set(prev).add(savingKey))

    try {
      const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
      await registrarFrequenciaDia(schoolId, turmaId, alunoId, diaStr, newVal, pessoaId)
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

  const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })

  const nomeDiaSemana = (dia: number) => {
    const d = new Date(ano, mes - 1, dia)
    return d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)
  }

  const calcPercentual = (alunoId: string) => {
    let presentes = 0
    let validos = 0
    const aluno = alunos.find(a => a.id === alunoId)
    if (!aluno) return null

    dias.forEach(dia => {
      const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`

      if (aluno.data_matricula && diaStr < aluno.data_matricula) return
      if (aluno.data_saida && diaStr > aluno.data_saida) return

      validos++
      const key = `${alunoId}_${dia}`
      const s = frequencias.get(key)
      if (s === 'P') presentes++
    })

    return validos > 0 ? Math.round((presentes / validos) * 100) : null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
        </div>
        <Button variant="ghost" size="sm" onClick={() => {
          setAno(hoje.getFullYear())
          setMes(hoje.getMonth() + 1)
        }}>
          Hoje
        </Button>
      </div>

      {estatisticas && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-lg font-bold text-foreground">{estatisticas.totalDiasLetivos}</div>
            <div className="text-[10px] text-muted-foreground">Dias Letivos</div>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-lg font-bold text-green-600">{estatisticas.diasRegistrados}</div>
            <div className="text-[10px] text-muted-foreground">Dias c/ Registro</div>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-lg font-bold text-amber-600">{estatisticas.diasPendentes}</div>
            <div className="text-[10px] text-muted-foreground">Dias Pendentes</div>
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
        <div className="py-8 text-center text-muted-foreground text-sm">
          Carregando dias letivos...
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={() => {
              if (!schoolId) return
              let count = 0
              dias.forEach(dia => {
                const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                alunos.forEach(aluno => {
                  if (aluno.data_matricula && diaStr < aluno.data_matricula) return
                  if (aluno.data_saida && diaStr > aluno.data_saida) return
                  const key = `${aluno.id}_${dia}`
                  const current = frequencias.get(key) || null
                  if (current !== 'P') {
                    registrarFrequenciaDia(schoolId, turmaId, aluno.id, diaStr, 'P', pessoaId).then(() => {
                      setFrequencias(prev => {
                        const next = new Map(prev)
                        next.set(key, 'P')
                        return next
                      })
                      count++
                    }).catch(() => {})
                  }
                })
              })
              setTimeout(() => {
                toast.success(`${count} aluno(s) marcados como presente`)
                recarregarEstatisticas()
              }, 500)
            }}>
              <Check className="h-3.5 w-3.5 mr-1" />
              Marcar todos presentes
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              if (!schoolId) return
              let count = 0
              dias.forEach(dia => {
                const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                alunos.forEach(aluno => {
                  if (aluno.data_matricula && diaStr < aluno.data_matricula) return
                  if (aluno.data_saida && diaStr > aluno.data_saida) return
                  const key = `${aluno.id}_${dia}`
                  const current = frequencias.get(key) || null
                  if (current) {
                    const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                    registrarFrequenciaDia(schoolId, turmaId, aluno.id, diaStr, null, pessoaId).then(() => {
                      setFrequencias(prev => {
                        const next = new Map(prev)
                        next.delete(key)
                        return next
                      })
                      count++
                    }).catch(() => {})
                  }
                })
              })
              setTimeout(() => {
                toast.success(`${count} registro(s) removidos`)
                recarregarEstatisticas()
              }, 500)
            }}>
              <X className="h-3.5 w-3.5 mr-1" />
              Limpar tudo
            </Button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-max text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="sticky left-0 bg-muted text-left py-2 px-3 min-w-[180px] z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] font-medium">
                    Aluno
                  </th>
                  {dias.map(dia => {
                    const diaSem = nomeDiaSemana(dia)
                    return (
                      <th
                        key={dia}
                        className="py-2 px-1 text-center font-normal w-8"
                      >
                        <div>{dia}</div>
                        <div className="text-[10px]">{diaSem}</div>
                      </th>
                    )
                  })}
                  <th className="py-2 px-2 text-center font-medium w-16">%</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno, idx) => {
                  const percentual = calcPercentual(aluno.id)
                  return (
                    <tr key={aluno.id} className={cn(
                      "border-b border-slate-100 hover:bg-slate-50/40",
                      idx % 2 === 0 && "bg-white",
                      idx % 2 === 1 && "bg-slate-50/30"
                    )}>
                      <td className={cn(
                        "sticky left-0 py-2 px-3 text-sm font-medium z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]",
                        idx % 2 === 0 && "bg-white",
                        idx % 2 === 1 && "bg-slate-50/30"
                      )}>
                        {aluno.nome_completo}
                      </td>
                      {dias.map(dia => {
                        const key = `${aluno.id}_${dia}`
                        const status = frequencias.get(key) || null
                        const isSaving = salvando.has(`${key}_P`) || salvando.has(`${key}_F`) || salvando.has(`${key}_FJ`) || salvando.has(`${key}_null`)
                        const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
                        const isFuture = diaStr > hojeStr
                        const isBeforeMatricula = aluno.data_matricula ? diaStr < aluno.data_matricula : false
                        const isAfterSaida = aluno.data_saida ? diaStr > aluno.data_saida : false
                        const isOutsidePeriod = isBeforeMatricula || isAfterSaida
                        const disabled = isSaving || isFuture || isOutsidePeriod

                        let tooltip = ''
                        if (isFuture) tooltip = 'Data futura'
                        else if (isBeforeMatricula) tooltip = 'Aluno ainda não matriculado nesta data'
                        else if (isAfterSaida) tooltip = 'Aluno não pertence mais à turma nesta data'

                        return (
                          <td key={dia} className={cn(
                            "py-1 px-0.5 text-center",
                            isOutsidePeriod && "opacity-40"
                          )}>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={!isOutsidePeriod ? () => handleToggle(aluno.id, dia) : undefined}
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
                              title={tooltip || `${aluno.nome_completo} - Dia ${dia}`}
                            >
                              {status === 'P' && <Check className="h-3.5 w-3.5" />}
                              {status === 'F' && <X className="h-3.5 w-3.5" />}
                              {status === 'FJ' && <AlertTriangle className="h-3.5 w-3.5" />}
                              {!status && '-'}
                            </button>
                          </td>
                        )
                      })}
                      <td className="py-2 px-2 text-center">
                        {percentual !== null && (
                          <span className={cn(
                            "text-xs font-semibold",
                            percentual >= 75 && "text-green-600",
                            percentual >= 50 && percentual < 75 && "text-amber-600",
                            percentual < 50 && "text-red-600"
                          )}>
                            {percentual}%
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
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
            <span className="text-muted-foreground/60 italic">Células apagadas = fora do período ativo do aluno</span>
          </div>
        </>
      )}
    </div>
  )
}
