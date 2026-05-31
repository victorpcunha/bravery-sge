'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  salvarNota,
  salvarRecuperacao,
  listarNotas,
  listarRecuperacoes,
  recalcularTurma,
  getDescricoesNotas,
  getNumericoConfig,
  type Nota,
  type Recuperacao,
  type DesempenhoAluno,
} from '@/lib/actions/avaliacoes-numericas'
import { type AlunoMatriculado } from '@/lib/actions/diario-classe'
import { getFirstSchool } from '@/lib/actions/schools'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Plus, Save, Calculator, Check, X, AlertTriangle } from 'lucide-react'

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

export default function AvaliacoesNumericas({
  turmaId,
  alunos,
  disciplinas,
  quantidadePeriodosNumerico,
  metodoId,
}: Props) {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState(1)
  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [notas, setNotas] = useState<Nota[]>([])
  const [recuperacoes, setRecuperacoes] = useState<Recuperacao[]>([])
  const [descricoes, setDescricoes] = useState<string[]>([])
  const [limitarAvaliacoes, setLimitarAvaliacoes] = useState(false)
  const [avaliacoesPredefinidas, setAvaliacoesPredefinidas] = useState<{ nome: string; peso: number }[]>([])
  const [desempenhos, setDesempenhos] = useState<DesempenhoAluno[]>([])
  const [loading, setLoading] = useState(true)
  const [calculando, setCalculando] = useState(false)
  const [novaDescricao, setNovaDescricao] = useState('')
  const [subAba, setSubAba] = useState('registro')
  const [datasAvaliacoes, setDatasAvaliacoes] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    getFirstSchool().then(s => {
      if (s) setSchoolId(s.id)
    })
  }, [])

  const { pessoaId, pode } = usePermissoes(schoolId || '')
  const podeEditar = pode.editar('gestao-pedagogica.diario-classe')

  const carregar = useCallback(async () => {
    if (!disciplinaId || !turmaId) return
    setLoading(true)
    try {
      const [notasData, recsData, descs, numericoConfig] = await Promise.all([
        listarNotas(turmaId, periodo, disciplinaId, pessoaId),
        listarRecuperacoes(turmaId, disciplinaId, pessoaId),
        getDescricoesNotas(turmaId, periodo, disciplinaId, pessoaId),
        metodoId ? getNumericoConfig(metodoId) : Promise.resolve(null),
      ])
      setNotas(notasData)
      setRecuperacoes(recsData)

      const limitar = numericoConfig?.limitar_avaliacoes ?? false
      const predefs = (numericoConfig?.avaliacoes_list || []) as { nome: string; peso: number }[]
      setLimitarAvaliacoes(limitar)
      setAvaliacoesPredefinidas(predefs)

      if (limitar && predefs.length > 0) {
        setDescricoes(predefs.map(a => a.nome))
      } else {
        setDescricoes(descs.map(d => d.descricao!).filter(Boolean))
      }

      const datas = new Map<string, string>()
      notasData.forEach(n => {
        if (n.descricao && n.data_aplicacao && !datas.has(n.descricao)) {
          datas.set(n.descricao, n.data_aplicacao)
        }
      })
      setDatasAvaliacoes(datas)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [turmaId, periodo, disciplinaId, pessoaId, metodoId])

  useEffect(() => {
    if (disciplinaId) carregar()
    else setLoading(false)
  }, [carregar, disciplinaId])

  const getNota = (alunoId: string, descricao: string) => {
    return notas.find(n => n.aluno_id === alunoId && n.descricao === descricao)
  }

  const handleNotaChange = async (
    alunoId: string,
    descricao: string,
    valor: string
  ) => {
    if (!schoolId) return
    const numValor = valor === '' ? null : parseFloat(valor)
    const existing = getNota(alunoId, descricao)
    const dataAplicacao = datasAvaliacoes.get(descricao) || null

    try {
      await salvarNota(
        schoolId,
        turmaId,
        alunoId,
        disciplinaId,
        periodo,
        numValor,
        descricao,
        dataAplicacao,
        existing?.id || null,
        pessoaId
      )
      setNotas(prev => {
        const next = [...prev]
        if (existing) {
          const idx = next.findIndex(n => n.id === existing.id)
          if (idx >= 0) next[idx] = { ...next[idx], valor: numValor }
        } else {
          next.push({
            id: Math.random().toString(),
            aluno_id: alunoId,
            disciplina_id: disciplinaId,
            periodo,
            valor: numValor,
            descricao,
            data_aplicacao: null,
          })
        }
        return next
      })
    } catch {
      toast.error('Erro ao salvar nota')
    }
  }

  const handleAdicionarAvaliacao = async () => {
    if (!novaDescricao.trim()) return
    setDescricoes(prev => [...prev, novaDescricao.trim()])
    setDatasAvaliacoes(prev => {
      const next = new Map(prev)
      next.set(novaDescricao.trim(), new Date().toISOString().split('T')[0])
      return next
    })
    setNovaDescricao('')
  }

  const handleCalcular = async () => {
    if (!disciplinaId) return
    setCalculando(true)
    try {
      const resultados = await recalcularTurma(
        turmaId,
        disciplinaId,
        quantidadePeriodosNumerico,
        pessoaId
      )
      setDesempenhos(resultados)
      setSubAba('resumo')
    } catch {
      toast.error('Erro ao calcular desempenho')
    } finally {
      setCalculando(false)
    }
  }

  const getRecuperacaoAluno = (alunoId: string) => {
    return recuperacoes.find(
      r =>
        r.aluno_id === alunoId &&
        r.tipo === 'final'
    )
  }

  const handleRecChange = async (alunoId: string, valor: string) => {
    if (!schoolId) return
    const numValor = valor === '' ? null : parseFloat(valor)
    const existing = getRecuperacaoAluno(alunoId)

    try {
      await salvarRecuperacao(
        schoolId,
        turmaId,
        alunoId,
        disciplinaId,
        'final',
        null,
        numValor,
        existing?.id || null,
        pessoaId
      )
      setRecuperacoes(prev => {
        const next = [...prev]
        if (existing) {
          const idx = next.findIndex(r => r.id === existing.id)
          if (idx >= 0) next[idx] = { ...next[idx], valor: numValor }
        } else {
          next.push({
            id: Math.random().toString(),
            aluno_id: alunoId,
            disciplina_id: disciplinaId,
            periodo: null,
            tipo: 'final',
            valor: numValor,
          })
        }
        return next
      })
    } catch {
      toast.error('Erro ao salvar recuperação')
    }
  }

  const getDesempenho = (alunoId: string) => {
    return desempenhos.find(d => d.aluno_id === alunoId)
  }

  const periodos = Array.from(
    { length: quantidadePeriodosNumerico || 4 },
    (_, i) => i + 1
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Disciplina
          </label>
          <select
            value={disciplinaId}
            onChange={e => {
              setDisciplinaId(e.target.value)
              setSubAba('registro')
            }}
            className="h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm min-w-[180px]"
          >
            <option value="">Selecione...</option>
            {disciplinas.map(d => (
              <option key={d.matriz_disciplina_id} value={d.matriz_disciplina_id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleCalcular}
          disabled={calculando || !disciplinaId}
        >
          <Calculator className="h-4 w-4 mr-1" />
          {calculando ? 'Calculando...' : 'Calcular Desempenho'}
        </Button>
      </div>

      {!disciplinaId ? (
        <div className="py-8 text-center text-muted-foreground">
          Selecione uma disciplina para começar.
        </div>
      ) : (
        <Tabs value={subAba} onValueChange={setSubAba}>
        <TabsList className="mb-4">
          <TabsTrigger value="registro">Registro</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="registro">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {periodos.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodo(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                    periodo === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {p}º Período
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {descricoes.map(d => (
                <Badge key={d} variant="secondary">
                  {d}
                </Badge>
              ))}
              {!limitarAvaliacoes && podeEditar && (
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Nova avaliação..."
                    value={novaDescricao}
                    onChange={e => setNovaDescricao(e.target.value)}
                    className="h-8 w-40 text-xs"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAdicionarAvaliacao()
                    }}
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
              )}
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-3 min-w-[180px] font-medium">
                      Aluno
                    </th>
                    {descricoes.map(d => (
                      <th key={d} className="text-center py-2 px-2 font-medium min-w-[80px]">
                        <div>{d}</div>
                        <input
                          type="date"
                          value={datasAvaliacoes.get(d) || ''}
                          onChange={e => {
                            setDatasAvaliacoes(prev => {
                              const next = new Map(prev)
                              next.set(d, e.target.value)
                              return next
                            })
                          }}
                          className="mt-1 h-6 w-full text-[10px] px-1 rounded border border-slate-200 bg-transparent text-muted-foreground"
                          disabled={!podeEditar}
                        />
                      </th>
                    ))}
                    <th className="text-center py-2 px-2 font-medium min-w-[80px] text-muted-foreground">
                      Média
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno, idx) => {
                    const notasAluno = descricoes
                      .map(d => getNota(aluno.id, d))
                      .filter(Boolean) as Nota[]
                    const valores = notasAluno
                      .map(n => n.valor)
                      .filter((v): v is number => v !== null)
                    const media =
                      valores.length > 0
                        ? Math.round(
                            (valores.reduce((a, b) => a + b, 0) / valores.length) * 100
                          ) / 100
                        : null

                    return (
                      <tr
                        key={aluno.id}
                        className={cn(
                          'border-b border-slate-100',
                          idx % 2 === 0 && 'bg-white',
                          idx % 2 === 1 && 'bg-slate-50/30'
                        )}
                      >
                        <td className="py-2 px-3 text-sm font-medium">
                          {aluno.nome_completo}
                        </td>
                        {descricoes.map(d => {
                          const nota = getNota(aluno.id, d)
                          return (
                            <td key={d} className="py-1 px-1 text-center">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                value={nota?.valor ?? ''}
                                onChange={e =>
                                  handleNotaChange(aluno.id, d, e.target.value)
                                }
                                disabled={!podeEditar}
                                className="h-8 w-16 text-center mx-auto text-sm"
                              />
                            </td>
                          )
                        })}
                        <td className="text-center py-2 px-2">
                          {media !== null && (
                            <span
                              className={cn(
                                'text-sm font-semibold',
                                media >= 7
                                  ? 'text-green-600'
                                  : media >= 5
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                              )}
                            >
                              {media.toFixed(2)}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resumo">
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 min-w-[180px] font-medium">
                    Aluno
                  </th>
                  {periodos.map(p => (
                    <th key={p} className="text-center py-2 px-2 font-medium min-w-[64px]">
                      {p}º P
                    </th>
                  ))}
                  <th className="text-center py-2 px-2 font-medium min-w-[72px] text-muted-foreground">
                    Anual
                  </th>
                  <th className="text-center py-2 px-2 font-medium min-w-[72px] text-muted-foreground">
                    Rec
                  </th>
                  <th className="text-center py-2 px-2 font-medium min-w-[72px]">
                    Final
                  </th>
                  <th className="text-center py-2 px-2 font-medium min-w-[80px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno, idx) => {
                  const d = getDesempenho(aluno.id)
                  return (
                    <tr
                      key={aluno.id}
                      className={cn(
                        'border-b border-slate-100',
                        idx % 2 === 0 && 'bg-white',
                        idx % 2 === 1 && 'bg-slate-50/30'
                      )}
                    >
                      <td className="py-2 px-3 text-sm font-medium">
                        {aluno.nome_completo}
                      </td>
                      {periodos.map(p => {
                        const m = d?.medias_periodo[p - 1]
                        return (
                          <td key={p} className="text-center py-2 px-2 text-sm">
                            {m !== null && m !== undefined
                              ? m.toFixed(2)
                              : '-'}
                          </td>
                        )
                      })}
                      <td className="text-center py-2 px-2 text-sm font-semibold">
                        {d?.media_anual !== null
                          ? d?.media_anual?.toFixed(2)
                          : '-'}
                      </td>
                      <td className="text-center py-2 px-2">
                        {d?.status === 'recuperacao' || d?.recuperacao !== null ? (
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            value={d?.recuperacao ?? ''}
                            onChange={e =>
                              handleRecChange(aluno.id, e.target.value)
                            }
                            disabled={!podeEditar}
                            className="h-7 w-16 text-center mx-auto text-xs"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="text-center py-2 px-2 text-sm font-bold">
                        {d?.media_final !== null
                          ? d?.media_final?.toFixed(2)
                          : '-'}
                      </td>
                      <td className="text-center py-2 px-2">
                        {d?.status === 'aprovado' && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            <Check className="h-3 w-3 mr-1" /> Aprovado
                          </Badge>
                        )}
                        {d?.status === 'recuperacao' && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Recuperação
                          </Badge>
                        )}
                        {d?.status === 'reprovado' && (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
                            <X className="h-3 w-3 mr-1" /> Reprovado
                          </Badge>
                        )}
                        {!d?.status && (
                          <span className="text-xs text-muted-foreground">
                            {desempenhos.length > 0 ? '-' : 'Calcule'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
