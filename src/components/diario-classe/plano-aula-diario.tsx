'use client'

import { useState, useEffect } from 'react'
import {
  listarDiasComAula,
  listarPlanosAplicados,
  listarPlanosDisponiveis,
  listarDiasComPlanoAplicado,
  aplicarPlanoAula,
  removerPlanoAulaAplicado,
} from '@/lib/actions/diario-planos'
import { type PlanoAula } from '@/lib/actions/plano-ensino'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Calendar,
  GraduationCap,
} from 'lucide-react'
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

type Props = {
  turmaId: string
  disciplinas: DisciplinaItem[]
  pessoaId: string | null
}

export default function PlanoAulaDiario({ turmaId, disciplinas, pessoaId }: Props) {
  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

  const [disciplinaId, setDisciplinaId] = useState<string>('')
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [dataSelecionada, setDataSelecionada] = useState(hojeStr)
  const [diasComAula, setDiasComAula] = useState<string[]>([])
  const [planosAplicados, setPlanosAplicados] = useState<PlanoAplicado[]>([])
  const [planosDisponiveis, setPlanosDisponiveis] = useState<PlanoAula[]>([])
  const [loadingDias, setLoadingDias] = useState(false)
  const [loadingAplicados, setLoadingAplicados] = useState(false)
  const [loadingDisponiveis, setLoadingDisponiveis] = useState(false)
  const [diasComPlano, setDiasComPlano] = useState<Set<string>>(new Set())
  const [aplicando, setAplicando] = useState<string | null>(null)
  const [removendo, setRemovendo] = useState<string | null>(null)

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
    listarDiasComPlanoAplicado(turmaId, disciplinaId, ano, mes, pessoaId)
      .then(dias => setDiasComPlano(new Set(dias)))
      .catch(() => {})
  }, [turmaId, disciplinaId, ano, mes, pessoaId, planosAplicados])

  useEffect(() => {
    if (!disciplinaId) return
    setLoadingDisponiveis(true)
    listarPlanosDisponiveis(turmaId, disciplinaId, pessoaId)
      .then(setPlanosDisponiveis)
      .catch(() => toast.error('Erro ao carregar planos disponíveis'))
      .finally(() => setLoadingDisponiveis(false))
  }, [turmaId, disciplinaId, pessoaId])

  useEffect(() => {
    if (!disciplinaId || !dataSelecionada) return
    setLoadingAplicados(true)
    listarPlanosAplicados(turmaId, disciplinaId, dataSelecionada, pessoaId)
      .then(setPlanosAplicados)
      .catch(() => toast.error('Erro ao carregar planos aplicados'))
      .finally(() => setLoadingAplicados(false))
  }, [turmaId, disciplinaId, dataSelecionada, pessoaId])

  useEffect(() => {
    if (diasComAula.length > 0 && !diasComAula.includes(dataSelecionada)) {
      setDataSelecionada(diasComAula[0])
    }
  }, [diasComAula, dataSelecionada])

  const navegarMes = (delta: number) => {
    let novoMes = mes + delta
    let novoAno = ano
    if (novoMes < 1) { novoMes = 12; novoAno-- }
    if (novoMes > 12) { novoMes = 1; novoAno++ }
    setMes(novoMes)
    setAno(novoAno)
  }

  const handleAplicar = async (planoAulaId: string) => {
    setAplicando(planoAulaId)
    try {
      await aplicarPlanoAula(turmaId, disciplinaId, dataSelecionada, planoAulaId, null, pessoaId)
      toast.success('Plano de aula aplicado com sucesso')
      const [aplicados, disponiveis, dias] = await Promise.all([
        listarPlanosAplicados(turmaId, disciplinaId, dataSelecionada, pessoaId),
        listarPlanosDisponiveis(turmaId, disciplinaId, pessoaId),
        listarDiasComPlanoAplicado(turmaId, disciplinaId, ano, mes, pessoaId),
      ])
      setPlanosAplicados(aplicados)
      setPlanosDisponiveis(disponiveis)
      setDiasComPlano(new Set(dias))
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao aplicar plano')
    } finally {
      setAplicando(null)
    }
  }

  const handleRemover = async (id: string) => {
    setRemovendo(id)
    try {
      await removerPlanoAulaAplicado(id, pessoaId)
      toast.success('Aplicação removida')
      const [aplicados, disponiveis, dias] = await Promise.all([
        listarPlanosAplicados(turmaId, disciplinaId, dataSelecionada, pessoaId),
        listarPlanosDisponiveis(turmaId, disciplinaId, pessoaId),
        listarDiasComPlanoAplicado(turmaId, disciplinaId, ano, mes, pessoaId),
      ])
      setPlanosAplicados(aplicados)
      setPlanosDisponiveis(disponiveis)
      setDiasComPlano(new Set(dias))
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao remover')
    } finally {
      setRemovendo(null)
    }
  }

  const appliedIds = new Set(planosAplicados.map(pa => pa.plano_aula_id))
  const planosNaoAplicados = planosDisponiveis.filter(p => !appliedIds.has(p.id))

  const nomeMes = new Date(ano, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1 min-w-[220px]">
          <label className="text-xs text-muted-foreground font-medium">Disciplina</label>
          <Select value={disciplinaId} onValueChange={v => { setDisciplinaId(v); setDataSelecionada('') }}>
            <SelectTrigger>
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
      </div>

      {!disciplinaId ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Selecione uma disciplina para gerenciar os planos de aula.
        </p>
      ) : loadingDias ? (
        <p className="text-sm text-muted-foreground text-center py-12">Carregando dias com aula...</p>
      ) : diasComAula.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Nenhum dia com aula encontrado para esta disciplina no período letivo.
        </p>
      ) : (
        <>
          <div>
            <div className="flex items-center justify-between mb-3">
              <Button variant="outline" size="sm" onClick={() => navegarMes(-1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> {new Date(ano, mes - 2).toLocaleDateString('pt-BR', { month: 'short' })}
              </Button>
              <span className="text-sm font-medium capitalize">{nomeMes} {ano}</span>
              <Button variant="outline" size="sm" onClick={() => navegarMes(1)}>
                {new Date(ano, mes).toLocaleDateString('pt-BR', { month: 'short' })} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diasComAula.map(d => {
                const diaNum = parseInt(d.split('-')[2], 10)
                const isSelected = d === dataSelecionada
                const temPlanos = diasComPlano.has(d)
                return (
                  <Button
                    key={d}
                    variant="ghost"
                    size="icon"
                    onClick={() => setDataSelecionada(d)}
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                        : "bg-card border border-border hover:border-primary/40 hover:bg-accent text-foreground"
                    )}
                    title={new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')}
                  >
                    {diaNum}
                    {temPlanos && (
                      <span className={cn(
                        "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-background",
                        isSelected ? "bg-primary-foreground" : "bg-success"
                      )} />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Planos Aplicados em {new Date(dataSelecionada + 'T12:00:00').toLocaleDateString('pt-BR')}
                {loadingAplicados && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
              </h3>

              {loadingAplicados ? (
                <p className="text-xs text-muted-foreground py-4">Carregando...</p>
              ) : planosAplicados.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum plano aplicado nesta data.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Selecione um plano disponível ao lado.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {planosAplicados.map(pa => (
                    <Card key={pa.id} className="border-l-4 border-l-success/60">
                      <CardContent className="py-3 px-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-medium text-sm">{pa.plano_aula.tema}</h4>
                              {pa.plano_aula.periodos && pa.plano_aula.periodos.length > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {pa.plano_aula.periodos.join(', ')}
                                </Badge>
                              )}
                            </div>
                            {pa.plano_aula.conteudo && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pa.plano_aula.conteudo}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground/60">
                              {pa.plano_aula.data_inicio && pa.plano_aula.data_fim && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {pa.plano_aula.data_inicio} — {pa.plano_aula.data_fim}
                                </span>
                              )}
                              {pa.plano_aula.bncc_fields && Array.isArray(pa.plano_aula.bncc_fields) && pa.plano_aula.bncc_fields.length > 0 && (
                                <span className="flex items-center gap-1" title="Possui campos BNCC">
                                  <GraduationCap className="h-3 w-3" />
                                  BNCC
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7"
                              onClick={() => window.open(`/gestao-pedagogica/plano-ensino/${pa.plano_aula.plano_ensino_id}`, '_blank')}
                              title="Ver no Plano de Ensino"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleRemover(pa.id)} disabled={removendo === pa.id} title="Remover aplicação"
                            >
                              {removendo === pa.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-info" />
                Planos Disponíveis
                {loadingDisponiveis && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                {!loadingDisponiveis && (
                  <span className="text-xs text-muted-foreground font-normal">
                    ({planosNaoAplicados.length} disponíveis)
                  </span>
                )}
              </h3>

              {loadingDisponiveis ? (
                <p className="text-xs text-muted-foreground py-4">Carregando...</p>
              ) : planosDisponiveis.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum plano de ensino encontrado.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Crie um plano de aula no{' '}
                    <a href="/gestao-pedagogica/plano-ensino" className="text-primary underline underline-offset-2">
                      Plano de Ensino
                    </a>
                    {' '}primeiro.
                  </p>
                </div>
              ) : planosNaoAplicados.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border rounded-lg">
                  <CheckCircle2 className="h-6 w-6 mx-auto text-success mb-2" />
                  <p className="text-sm text-muted-foreground">Todos os planos já foram aplicados nesta data.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {planosNaoAplicados.map(plano => (
                    <Card key={plano.id} className="border-l-4 border-l-info/50 hover:border-l-info transition-colors">
                      <CardContent className="py-2.5 px-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-medium text-sm">{plano.tema}</h4>
                              {plano.periodos && plano.periodos.length > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {plano.periodos.join(', ')}
                                </Badge>
                              )}
                            </div>
                            {plano.conteudo && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{plano.conteudo}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground/60">
                              {plano.data_inicio && plano.data_fim && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {plano.data_inicio} — {plano.data_fim}
                                </span>
                              )}
                              {plano.bncc_fields && Array.isArray(plano.bncc_fields) && plano.bncc_fields.length > 0 && (
                                <span className="flex items-center gap-1" title="Possui campos BNCC">
                                  <GraduationCap className="h-3 w-3" />
                                  BNCC
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm" variant="outline"
                            className="shrink-0 h-7 text-xs"
                            onClick={() => handleAplicar(plano.id)}
                            disabled={aplicando === plano.id}
                          >
                            {aplicando === plano.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            )}
                            Aplicar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
