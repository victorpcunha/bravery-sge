'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  const { schoolId } = useAuth()
  const [periodo, setPeriodo] = useState(1)
  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [notas, setNotas] = useState<Nota[]>([])
  const [recuperacoes, setRecuperacoes] = useState<Recuperacao[]>([])
  const [descricoes, setDescricoes] = useState<string[]>([])
  const [limitarAvaliacoes, setLimitarAvaliacoes] = useState(false)
  const [avaliacoesPredefinidas, setAvaliacoesPredefinidas] = useState<{ nome: string; peso: number; nota_maxima: number }[]>([])
  const [desempenhos, setDesempenhos] = useState<DesempenhoAluno[]>([])
  const [loading, setLoading] = useState(true)
  const [calculando, setCalculando] = useState(false)
  const [novaDescricao, setNovaDescricao] = useState('')
  const [subAba, setSubAba] = useState('registro')
  const [datasAvaliacoes, setDatasAvaliacoes] = useState<Map<string, string>>(new Map())

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
      const predefs = (numericoConfig?.avaliacoes_list || []) as { nome: string; peso: number; nota_maxima: number }[]
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

      try {
        const resultados = await recalcularTurma(turmaId, disciplinaId, quantidadePeriodosNumerico, pessoaId)
        setDesempenhos(resultados)
      } catch {
      }
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

  const getNotaMaxima = (descricao: string) => {
    return avaliacoesPredefinidas.find(a => a.nome === descricao)?.nota_maxima ?? 10
  }

  const getPeso = (descricao: string) => {
    return avaliacoesPredefinidas.find(a => a.nome === descricao)?.peso ?? 1
  }

  const getNota = (alunoId: string, descricao: string) => {
    return notas.find(n => n.aluno_id === alunoId && n.descricao === descricao)
  }

  const handleNotaChange = async (
    alunoId: string,
    descricao: string,
    valor: string
  ) => {
    const max = getNotaMaxima(descricao)
    const rawValor = valor === '' ? null : parseFloat(valor)
    const numValor = rawValor !== null ? Math.min(rawValor, max) : null
    const existing = getNota(alunoId, descricao)
    const dataAplicacao = datasAvaliacoes.get(descricao) || null

    try {
      const result = await salvarNota(
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
      if (!result.success) {
        toast.error('Erro ao salvar nota: ' + result.error)
        return
      }
      setNotas(prev => {
        const next = [...prev]
        if (existing) {
          const idx = next.findIndex(n => n.id === existing.id)
          if (idx >= 0) next[idx] = { ...next[idx], valor: numValor }
        } else if (result.id) {
          next.push({
            id: result.id,
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
    const numValor = valor === '' ? null : parseFloat(valor)
    const existing = getRecuperacaoAluno(alunoId)

    try {
      const result = await salvarRecuperacao(
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
      if (!result.success) {
        toast.error('Erro ao salvar recuperação: ' + result.error)
        return
      }
      setRecuperacoes(prev => {
        const next = [...prev]
        if (existing) {
          const idx = next.findIndex(r => r.id === existing.id)
          if (idx >= 0) next[idx] = { ...next[idx], valor: numValor }
        } else if (result.id) {
          next.push({
            id: result.id,
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
          <Select value={disciplinaId} onValueChange={v => {
            setDisciplinaId(v)
            setSubAba('registro')
            setDesempenhos([])
          }}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Selecione..." />
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
        <div className="flex-1" />
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
                <Button
                  key={p}
                  variant={periodo === p ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPeriodo(p)}
                  className={cn(
                    periodo !== p && 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {p}º Período
                </Button>
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

            <div className="overflow-x-auto border border-border rounded-lg">
              <Table className="min-w-max text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left py-2 px-3 min-w-[180px] font-medium">
                      Aluno
                    </TableHead>
                    {descricoes.map(d => (
                      <TableHead key={d} className="text-center py-2 px-2 font-medium min-w-[80px]">
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
                          className="mt-1 h-6 w-full text-[10px] px-1 rounded border border-border bg-transparent text-muted-foreground"
                          disabled={!podeEditar}
                        />
                      </TableHead>
                    ))}
                    <TableHead className="text-center py-2 px-2 font-medium min-w-[80px] text-muted-foreground">
                      Média
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunos.map((aluno, idx) => {
                    const notasAluno = descricoes
                      .map(d => getNota(aluno.id, d))
                      .filter(Boolean) as Nota[]
                    const valores = notasAluno
                      .map(n => ({ valor: n.valor, peso: getPeso(n.descricao!) }))
                      .filter((v): v is { valor: number; peso: number } => v.valor !== null)
                    const somaPesos = valores.reduce((a, v) => a + v.peso, 0)
                    const media =
                      valores.length > 0 && somaPesos > 0
                        ? Math.round(
                            (valores.reduce((a, v) => a + v.valor * v.peso, 0) / somaPesos) * 100
                          ) / 100
                        : null

                    return (
                      <TableRow
                        key={aluno.id}
                        className={cn(
                          idx % 2 === 0 && 'bg-card',
                          idx % 2 === 1 && 'bg-muted/30'
                        )}
                      >
                        <TableCell className="py-2 px-3 text-sm font-medium">
                          {aluno.nome_completo}
                        </TableCell>
                        {descricoes.map(d => {
                          const nota = getNota(aluno.id, d)
                          return (
                            <TableCell key={d} className="py-1 px-1 text-center">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={getNotaMaxima(d)}
                                value={nota?.valor ?? ''}
                                onChange={e =>
                                  handleNotaChange(aluno.id, d, e.target.value)
                                }
                                disabled={!podeEditar}
                                className="h-8 w-16 text-center mx-auto text-sm"
                              />
                            </TableCell>
                          )
                        })}
                        <TableCell className="text-center py-2 px-2">
                          {media !== null && (
                            <span
                              className={cn(
                                'text-sm font-semibold',
                                media >= 7
                                  ? 'text-success'
                                  : media >= 5
                                  ? 'text-warning'
                                  : 'text-destructive'
                              )}
                            >
                              {media.toFixed(2)}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resumo">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Médias por período, anual e status final.</span>
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
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table className="min-w-max text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left py-2 px-3 min-w-[180px] font-medium">
                    Aluno
                  </TableHead>
                  {periodos.map(p => (
                    <TableHead key={p} className="text-center py-2 px-2 font-medium min-w-[64px]">
                      {p}º P
                    </TableHead>
                  ))}
                  <TableHead className="text-center py-2 px-2 font-medium min-w-[72px] text-muted-foreground">
                    Anual
                  </TableHead>
                  <TableHead className="text-center py-2 px-2 font-medium min-w-[72px] text-muted-foreground">
                    Rec
                  </TableHead>
                  <TableHead className="text-center py-2 px-2 font-medium min-w-[72px]">
                    Final
                  </TableHead>
                  <TableHead className="text-center py-2 px-2 font-medium min-w-[80px]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((aluno, idx) => {
                  const d = getDesempenho(aluno.id)
                  return (
                    <TableRow
                      key={aluno.id}
                      className={cn(
                        idx % 2 === 0 && 'bg-card',
                        idx % 2 === 1 && 'bg-muted/30'
                      )}
                    >
                      <TableCell className="py-2 px-3 text-sm font-medium">
                        {aluno.nome_completo}
                      </TableCell>
                      {periodos.map(p => {
                        const m = d?.medias_periodo[p - 1]
                        return (
                          <TableCell key={p} className="text-center py-2 px-2 text-sm">
                            {m !== null && m !== undefined
                              ? m.toFixed(2)
                              : '-'}
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-center py-2 px-2 text-sm font-semibold">
                        {d?.media_anual !== null
                          ? d?.media_anual?.toFixed(2)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center py-2 px-2">
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
                      </TableCell>
                      <TableCell className="text-center py-2 px-2 text-sm font-bold">
                        {d?.media_final !== null
                          ? d?.media_final?.toFixed(2)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-center py-2 px-2">
                        {d?.status === 'aprovado' && (
                          <StatusBadge status="success">
                            <Check className="h-3 w-3 mr-1" /> Aprovado
                          </StatusBadge>
                        )}
                        {d?.status === 'recuperacao' && (
                          <StatusBadge status="warning">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Recuperação
                          </StatusBadge>
                        )}
                        {d?.status === 'reprovado' && (
                          <StatusBadge status="destructive">
                            <X className="h-3 w-3 mr-1" /> Reprovado
                          </StatusBadge>
                        )}
                        {!d?.status && (
                          <span className="text-xs text-muted-foreground">
                            {desempenhos.length > 0 ? '-' : 'Calcule'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
