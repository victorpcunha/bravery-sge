'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Check, Save } from 'lucide-react'

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

export default function AvaliacaoIndicadores({
  turmaId,
  alunos,
  disciplinas,
  quantidadePeriodosNivel,
}: Props) {
  const { schoolId } = useAuth()
  const [periodo, setPeriodo] = useState(1)
  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [indicadores, setIndicadores] = useState<IndicadorComNiveis[]>([])
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoIndicador[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const { pessoaId, pode } = usePermissoes(schoolId || '')

  const carregar = useCallback(async () => {
    if (!turmaId) return
    if (!disciplinaId) {
      setIndicadores([])
      setAvaliacoes([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [inds, avals] = await Promise.all([
        getIndicadoresDaTurma(turmaId, disciplinaId, pessoaId),
        listarAvaliacoesIndicadores(turmaId, periodo, pessoaId),
      ])
      setIndicadores(inds)
      setAvaliacoes(avals)
    } catch (e) {
      console.error('Erro ao carregar indicadores:', e)
      toast.error('Erro ao carregar indicadores')
    } finally {
      setLoading(false)
    }
  }, [turmaId, disciplinaId, periodo])

  useEffect(() => {
    carregar()
  }, [carregar])

  const getAvaliacao = (alunoId: string, indicadorId: string) => {
    return avaliacoes.find(
      a => a.aluno_id === alunoId && a.indicador_id === indicadorId
    )
  }

  const handleNivelClick = async (
    alunoId: string,
    indicadorId: string,
    nivelId: string | null
  ) => {
    if (!schoolId) return
    setSalvando(true)
    try {
      const current = getAvaliacao(alunoId, indicadorId)
      const newNivelId =
        current?.nivel_id === nivelId ? null : nivelId

      await salvarAvaliacaoIndicador(
        schoolId,
        turmaId,
        alunoId,
        indicadorId,
        periodo,
        newNivelId,
        current?.observacao || null,
        pessoaId
      )

      setAvaliacoes(prev => {
        const next = [...prev]
        const idx = next.findIndex(
          a => a.aluno_id === alunoId && a.indicador_id === indicadorId
        )
        if (idx >= 0) {
          if (newNivelId) {
            next[idx] = { ...next[idx], nivel_id: newNivelId }
          } else {
            next.splice(idx, 1)
          }
        } else if (newNivelId) {
          next.push({
            id: '',
            aluno_id: alunoId,
            indicador_id: indicadorId,
            periodo,
            nivel_id: newNivelId,
            observacao: null,
          })
        }
        return next
      })
    } catch (e) {
      console.error('Erro ao salvar avaliação:', e)
      toast.error('Erro ao salvar avaliação')
    } finally {
      setSalvando(false)
    }
  }

  const handleObservacaoChange = async (
    alunoId: string,
    indicadorId: string,
    observacao: string
  ) => {
    if (!schoolId) return
    const current = getAvaliacao(alunoId, indicadorId)

    try {
      await salvarAvaliacaoIndicador(
        schoolId,
        turmaId,
        alunoId,
        indicadorId,
        periodo,
        current?.nivel_id || null,
        observacao || null,
        pessoaId
      )

      setAvaliacoes(prev => {
        const next = [...prev]
        const idx = next.findIndex(
          a => a.aluno_id === alunoId && a.indicador_id === indicadorId
        )
        if (idx >= 0) {
          next[idx] = { ...next[idx], observacao: observacao || null }
        } else if (observacao) {
          next.push({
            id: '',
            aluno_id: alunoId,
            indicador_id: indicadorId,
            periodo,
            nivel_id: null,
            observacao,
          })
        }
        return next
      })
    } catch (e) {
      console.error('Erro ao salvar observação:', e)
      toast.error('Erro ao salvar observação')
    }
  }

  const podeEditar = pode.editar('gestao-pedagogica.diario-classe')

  const periodos = Array.from(
    { length: quantidadePeriodosNivel || 4 },
    (_, i) => i + 1
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Período
          </label>
          <select
            value={periodo}
            onChange={e => setPeriodo(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm"
          >
            {periodos.map(p => (
              <option key={p} value={p}>
                {p}º Período
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Disciplina / Campo
          </label>
          <select
            value={disciplinaId}
            onChange={e => setDisciplinaId(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm min-w-[180px]"
          >
            <option value="">Selecione uma disciplina</option>
            {disciplinas.map(d => (
              <option key={d.disciplina_id} value={d.disciplina_id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          Carregando indicadores...
        </div>
      ) : !disciplinaId ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Selecione uma disciplina para visualizar os indicadores.</p>
        </div>
      ) : indicadores.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          Nenhum indicador encontrado para esta disciplina.
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {alunos.map((aluno, idx) => (
            <AccordionItem key={aluno.id} value={aluno.id}>
              <AccordionTrigger className="px-3 hover:no-underline hover:bg-muted/20 rounded-md">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {aluno.nome_completo}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {indicadores.filter(ind => {
                      const av = getAvaliacao(aluno.id, ind.id)
                      return av?.nivel_id
                    }).length}
                    /{indicadores.length} avaliados
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-3 space-y-3">
                  {indicadores.map(ind => {
                    const av = getAvaliacao(aluno.id, ind.id)
                    return (
                      <div
                        key={ind.id}
                        className="rounded-lg border p-3"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {ind.codigo && (
                                <span className="text-muted-foreground mr-1">
                                  {ind.codigo} —
                                </span>
                              )}
                              {ind.descricao}
                            </p>
                            {ind.campo_experiencia && (
                              <span className="text-xs text-muted-foreground">
                                {ind.campo_experiencia}
                              </span>
                            )}
                          </div>
                        </div>

                        {ind.niveis.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {ind.niveis.map(nivel => {
                              const isSelected = av?.nivel_id === nivel.id
                              return (
                                <button
                                  key={nivel.id}
                                  type="button"
                                  disabled={!podeEditar || salvando}
                                  onClick={() =>
                                    handleNivelClick(
                                      aluno.id,
                                      ind.id,
                                      nivel.id
                                    )
                                  }
                                  className={cn(
                                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                      : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
                                    (!podeEditar || salvando) &&
                                      'opacity-60 cursor-not-allowed'
                                  )}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3" />
                                  )}
                                  {nivel.sigla || nivel.descricao}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {ind.niveis.length === 0 && (
                          <p className="text-xs text-muted-foreground/50 italic mt-1">
                            Nenhum nível configurado para este indicador.
                          </p>
                        )}

                        <textarea
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
                            'w-full mt-2 px-2.5 py-1.5 rounded-md text-xs border border-border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all',
                            !podeEditar && 'opacity-60 cursor-not-allowed'
                          )}
                        />
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
