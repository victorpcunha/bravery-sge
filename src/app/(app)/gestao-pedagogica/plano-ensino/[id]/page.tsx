'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import {
  listarPlanoAula,
  criarPlanoAula,
  editarPlanoAula,
  excluirPlanoAula,
  listarPeriodosPlanoEnsino,
  buscarBNCCBase,
  type PlanoAula,
} from '@/lib/actions/plano-ensino'
import { listarPlanosEnsino } from '@/lib/actions/plano-ensino'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, BookOpen, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type BnccItem = {
  tipo: string
  id: string
  codigo?: string
  nome?: string
  descricao?: string
}

export default function PlanoEnsinoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const planoId = params.id as string
  const { user, schoolId } = useAuth()
  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [plano, setPlano] = useState<any>(null)
  const [periodos, setPeriodos] = useState<number[]>([])
  const [periodoAtivo, setPeriodoAtivo] = useState(1)
  const [aulas, setAulas] = useState<PlanoAula[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [tema, setTema] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [recursos, setRecursos] = useState('')
  const [metodologia, setMetodologia] = useState('')
  const [avaliacao, setAvaliacao] = useState('')
  const [referencias, setReferencias] = useState('')
  const [selectedPeriodos, setSelectedPeriodos] = useState<number[]>([])
  const [saving, setSaving] = useState(false)

  // BNCC state
  const [bnccData, setBnccData] = useState<any>(null)
  const [bnccLoading, setBnccLoading] = useState(false)
  const [selectedBncc, setSelectedBncc] = useState<BnccItem[]>([])

  // Derived BNCC filters: IDs of N1 (unidade_tematica/campo_experiencia/area_conhecimento) and N2 (objeto_conhecimento/competencia)
  // selected from the UI; N3 (habilidades) filters by N2
  const selectedN1Ids = selectedBncc
    .filter(x => ['unidade_tematica', 'campo_experiencia', 'area_conhecimento'].includes(x.tipo))
    .map(x => x.id)
  const selectedN2Ids = selectedBncc
    .filter(x => ['objeto_conhecimento', 'competencia'].includes(x.tipo))
    .map(x => x.id)

  // BNCC selection drilldown
  const [bnccNivel1, setBnccNivel1] = useState<string[]>([])

  const { loaded: permLoaded, pessoaId: pid } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const carregarPlano = useCallback(async () => {
    if (!planoId) return
    setLoading(true)
    try {
      const planos = await listarPlanosEnsino(schoolId, pessoaId)
      const encontrado = planos.find(p => p.id === planoId)
      if (encontrado) {
        setPlano(encontrado)
        const { periodos } = await listarPeriodosPlanoEnsino(encontrado.turma_id)
        setPeriodos(periodos)
        setPeriodoAtivo(periodos[0] || 1)
        setSelectedPeriodos([periodos[0] || 1])
      }
    } catch {
      toast.error('Erro ao carregar plano')
    } finally {
      setLoading(false)
    }
  }, [schoolId, pessoaId, planoId])

  useEffect(() => {
    carregarPlano()
  }, [carregarPlano])

  const carregarAulas = useCallback(async () => {
    if (!planoId) return
    try {
      const data = await listarPlanoAula(planoId, periodoAtivo)
      setAulas(data)
    } catch {
      toast.error('Erro ao carregar planos de aula')
    }
  }, [planoId, periodoAtivo])

  useEffect(() => {
    if (planoId) carregarAulas()
  }, [carregarAulas])

  useEffect(() => {
    if (!plano?.etapa_tipo) return
    setBnccLoading(true)
    const disc = plano.disciplinas?.[0]?.nome || undefined
    buscarBNCCBase(plano.etapa_tipo, disc)
      .then(setBnccData)
      .catch(() => toast.error('Erro ao carregar dados BNCC'))
      .finally(() => setBnccLoading(false))
  }, [plano?.etapa_tipo, plano?.id])

  const resetForm = () => {
    setTema('')
    setConteudo('')
    setDataInicio('')
    setDataFim('')
    setRecursos('')
    setMetodologia('')
    setAvaliacao('')
    setReferencias('')
    setSelectedPeriodos(periodos.length > 0 ? [periodoAtivo] : [1])
    setSelectedBncc([])
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (aula: PlanoAula) => {
    setTema(aula.tema)
    setConteudo(aula.conteudo || '')
    setDataInicio(aula.data_inicio || '')
    setDataFim(aula.data_fim || '')
    setRecursos(aula.recursos_didaticos || '')
    setMetodologia(aula.metodologia || '')
    setAvaliacao(aula.avaliacao || '')
    setReferencias(aula.referencias || '')
    setSelectedPeriodos(aula.periodos || [periodoAtivo])
    setSelectedBncc(aula.bncc_fields || [])
    setEditingId(aula.id)
    setShowForm(true)
  }

  const togglePeriodo = (p: number) => {
    setSelectedPeriodos(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const toggleBnccItem = (item: BnccItem) => {
    setSelectedBncc(prev => {
      const exists = prev.find(x => x.tipo === item.tipo && x.id === item.id)
      if (exists) return prev.filter(x => x !== exists)
      return [...prev, item]
    })
  }

  const isBnccSelected = (tipo: string, id: string) =>
    selectedBncc.some(x => x.tipo === tipo && x.id === id)

  const handleSave = async () => {
    if (!tema.trim()) {
      toast.error('O campo Tema é obrigatório')
      return
    }
    if (selectedPeriodos.length === 0) {
      toast.error('Selecione pelo menos um período')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await editarPlanoAula(editingId, {
          periodos: selectedPeriodos,
          tema: tema.trim(),
          conteudo: conteudo || null,
          data_inicio: dataInicio || null,
          data_fim: dataFim || null,
          recursos_didaticos: recursos || null,
          metodologia: metodologia || null,
          avaliacao: avaliacao || null,
          referencias: referencias || null,
          bncc_fields: selectedBncc,
        }, pessoaId)
        toast.success('Plano de aula atualizado')
      } else {
        await criarPlanoAula({
          plano_ensino_id: planoId,
          periodos: selectedPeriodos,
          tema: tema.trim(),
          conteudo: conteudo || null,
          data_inicio: dataInicio || null,
          data_fim: dataFim || null,
          recursos_didaticos: recursos || null,
          metodologia: metodologia || null,
          avaliacao: avaliacao || null,
          referencias: referencias || null,
          bncc_fields: selectedBncc,
        }, pessoaId)
        toast.success('Plano de aula criado')
      }
      resetForm()
      carregarAulas()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const handleExcluir = async (id: string) => {
    if (!confirm('Excluir este plano de aula?')) return
    try {
      await excluirPlanoAula(id, pessoaId)
      setAulas(prev => prev.filter(a => a.id !== id))
      toast.success('Plano de aula excluído')
    } catch {
      toast.error('Erro ao excluir')
    }
  }

  const etapaTipo = plano?.etapa_tipo || ''
  const isInfantil = etapaTipo === 'infantil'
  const isFundamental = ['fundamental_inicial', 'fundamental_final', 'fundamental_outros', 'eja'].includes(etapaTipo)
  const isMedio = etapaTipo === 'medio'

  if (loading) {
    return (
      <>
        <div className=" container mx-auto py-8 px-4 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full rounded-lg mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </>
    )
  }

  if (!plano) {
    return (
      <>
        <div className=" container mx-auto py-8 px-4 max-w-5xl">
          <p className="text-muted-foreground">Plano não encontrado.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className=" container mx-auto py-8 px-4 max-w-5xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push('/gestao-pedagogica/plano-ensino')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>

        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-foreground">{plano.turma_nome}</h2>
            <p className="text-sm text-muted-foreground mt-1">{plano.etapa_nome}</p>
            {plano.disciplinas.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {plano.disciplinas.map((d: any) => (
                  <span key={d.id} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{d.nome}</span>
                ))}
              </div>
            )}
            {plano.is_interdisciplinar && (
              <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded inline-block mt-2">Interdisciplinar</span>
            )}
          </CardContent>
        </Card>

        <Tabs value={String(periodoAtivo)} onValueChange={v => setPeriodoAtivo(Number(v))}>
          <TabsList className="mb-4">
            {periodos.map(p => (
              <TabsTrigger key={p} value={String(p)}>{p}º Período</TabsTrigger>
            ))}
          </TabsList>

          {periodos.map(p => (
            <TabsContent key={p} value={String(p)}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Planos de Aula — {p}º Período</h3>
                {!showForm && (
                  <Button size="sm" onClick={() => { resetForm(); setShowForm(true) }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Criar Plano de Aula
                  </Button>
                )}
              </div>

              {showForm && (
                <Card className="mb-6 border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      {editingId ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Tema *</Label>
                      <Input value={tema} onChange={e => setTema(e.target.value)} placeholder="Ex: Frações" className="mt-1" />
                    </div>

                    <div>
                      <Label className="text-xs">Períodos *</Label>
                      <div className="flex flex-wrap gap-3 mt-1">
                        {periodos.map(per => (
                          <label key={per} className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <Checkbox checked={selectedPeriodos.includes(per)} onCheckedChange={() => togglePeriodo(per)} />
                            {per}º Período
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Conteúdo</Label>
                      <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} rows={3}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y"
                        placeholder="Conteúdo programático da aula" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Data Início</Label>
                        <Input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs">Data Fim</Label>
                        <Input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="mt-1" />
                      </div>
                    </div>

                    {/* BNCC selectors */}
                    {bnccData && (
                      <div className="space-y-4 pt-2 border-t">
                        <Label className="text-xs font-semibold">Estrutura BNCC</Label>

                        {isInfantil && (
                          <>
                            <div>
                              <Label className="text-xs text-muted-foreground">Campos de Experiência</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {bnccData.campos_experiencia?.map((c: any) => (
                                  <Badge key={c.id} variant={isBnccSelected('campo_experiencia', c.id) ? 'default' : 'outline'}
                                    className="cursor-pointer" onClick={() => toggleBnccItem({ tipo: 'campo_experiencia', id: c.id, nome: c.sigla + ' - ' + c.nome })}>
                                    {c.sigla} — {c.nome}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedN1Ids.length > 0 && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Objetivos de Aprendizagem</Label>
                                <div className="max-h-48 overflow-y-auto space-y-1 mt-1 border rounded-lg p-2">
                                  {bnccData.objetivos
                                    ?.filter((o: any) => selectedN1Ids.length === 0 || selectedBncc
                                      .filter(x => x.tipo === 'campo_experiencia')
                                      .some(c => o.campo_experiencia?.toLowerCase().includes(c.nome?.toLowerCase() || '')))
                                    .map((o: any) => (
                                      <label key={o.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <Checkbox checked={isBnccSelected('objetivo', o.id)}
                                          onCheckedChange={() => toggleBnccItem({ tipo: 'objetivo', id: o.id, codigo: o.codigo_bncc, descricao: o.descricao })} />
                                        <div>
                                          <span className="font-mono text-xs font-semibold">{o.codigo_bncc}</span>
                                          <p className="text-xs text-muted-foreground">{o.descricao}</p>
                                        </div>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {isFundamental && (
                          <>
                            <div>
                              <Label className="text-xs text-muted-foreground">Unidades Temáticas</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {bnccData.unidades_tematicas?.map((u: any) => (
                                  <Badge key={u.id} variant={isBnccSelected('unidade_tematica', u.id) ? 'default' : 'outline'}
                                    className="cursor-pointer" onClick={() => toggleBnccItem({ tipo: 'unidade_tematica', id: u.id, nome: u.unidade_tematica })}>
                                    {u.unidade_tematica}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedN1Ids.length > 0 && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Objetos de Conhecimento</Label>
                                <div className="max-h-36 overflow-y-auto space-y-1 mt-1 border rounded-lg p-2">
                                  {bnccData.objetos_conhecimento
                                    ?.filter((o: any) => selectedN1Ids.includes(o.unidade_tematica_id))
                                    .map((o: any) => (
                                      <label key={o.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <Checkbox checked={isBnccSelected('objeto_conhecimento', o.id)}
                                          onCheckedChange={() => toggleBnccItem({ tipo: 'objeto_conhecimento', id: o.id, nome: o.objeto_conhecimento })} />
                                        <span className="text-xs">{o.objeto_conhecimento}</span>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                            {selectedN2Ids.length > 0 && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Habilidades</Label>
                                <div className="max-h-48 overflow-y-auto space-y-1 mt-1 border rounded-lg p-2">
                                  {bnccData.habilidades
                                    ?.filter((h: any) => selectedN2Ids.includes(h.objeto_conhecimento_id))
                                    .map((h: any) => (
                                      <label key={h.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <Checkbox checked={isBnccSelected('habilidade', h.id)}
                                          onCheckedChange={() => toggleBnccItem({ tipo: 'habilidade', id: h.id, codigo: h.codigo_bncc, descricao: h.descricao })} />
                                        <div>
                                          <span className="font-mono text-xs font-semibold">{h.codigo_bncc}</span>
                                          <p className="text-xs text-muted-foreground">{h.descricao}</p>
                                        </div>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {isMedio && (
                          <>
                            <div>
                              <Label className="text-xs text-muted-foreground">Áreas de Conhecimento</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {bnccData.areas_conhecimento?.map((a: any) => (
                                  <Badge key={a.id} variant={isBnccSelected('area_conhecimento', a.id) ? 'default' : 'outline'}
                                    className="cursor-pointer" onClick={() => toggleBnccItem({ tipo: 'area_conhecimento', id: a.id, nome: a.nome })}>
                                    {a.nome}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedN1Ids.length > 0 && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Competências Específicas</Label>
                                <div className="max-h-36 overflow-y-auto space-y-1 mt-1 border rounded-lg p-2">
                                  {bnccData.competencias
                                    ?.filter((c: any) => selectedN1Ids.includes(c.area_id))
                                    .map((c: any) => (
                                      <label key={c.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <Checkbox checked={isBnccSelected('competencia', c.id)}
                                          onCheckedChange={() => toggleBnccItem({ tipo: 'competencia', id: c.id, codigo: c.codigo, descricao: c.descricao })} />
                                        <div>
                                          <span className="font-mono text-xs font-semibold">Competência {c.codigo}</span>
                                          <p className="text-xs text-muted-foreground">{c.descricao}</p>
                                        </div>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                            {selectedN2Ids.length > 0 && (
                              <div>
                                <Label className="text-xs text-muted-foreground">Habilidades</Label>
                                <div className="max-h-48 overflow-y-auto space-y-1 mt-1 border rounded-lg p-2">
                                  {bnccData.habilidades_medio
                                    ?.filter((h: any) => selectedN2Ids.some(compId => {
                                      const comp = bnccData.competencias?.find((c: any) => c.id === compId)
                                      return comp && h.area_id === comp.area_id && h.competencia_codigo === comp.codigo
                                    }))
                                    .map((h: any) => (
                                      <label key={h.id} className="flex items-start gap-2 text-sm cursor-pointer">
                                        <Checkbox checked={isBnccSelected('habilidade_medio', h.id)}
                                          onCheckedChange={() => toggleBnccItem({ tipo: 'habilidade_medio', id: h.id, codigo: h.codigo, descricao: h.descricao })} />
                                        <div>
                                          <span className="font-mono text-xs font-semibold">{h.codigo}</span>
                                          <p className="text-xs text-muted-foreground">{h.descricao}</p>
                                        </div>
                                      </label>
                                    ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="text-xs">Recursos Didáticos</Label>
                      <textarea value={recursos} onChange={e => setRecursos(e.target.value)} rows={2}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y"
                        placeholder="Recursos utilizados na aula" />
                    </div>
                    <div>
                      <Label className="text-xs">Metodologia</Label>
                      <textarea value={metodologia} onChange={e => setMetodologia(e.target.value)} rows={2}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y"
                        placeholder="Estratégias e métodos de ensino" />
                    </div>
                    <div>
                      <Label className="text-xs">Avaliação</Label>
                      <textarea value={avaliacao} onChange={e => setAvaliacao(e.target.value)} rows={2}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y"
                        placeholder="Forma de avaliação da aula" />
                    </div>
                    <div>
                      <Label className="text-xs">Referências</Label>
                      <textarea value={referencias} onChange={e => setReferencias(e.target.value)} rows={2}
                        className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm resize-y"
                        placeholder="Referências bibliográficas" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        <X className="h-3.5 w-3.5 mr-1" /> Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                        {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {aulas.length === 0 && !showForm && (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Nenhum Plano de Aula cadastrado.</p>
                </div>
              )}

              {aulas.length > 0 && (
                <div className="space-y-3">
                  {aulas.map(aula => (
                    <Card key={aula.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-foreground">{aula.tema}</h4>
                              {aula.periodos && aula.periodos.length > 0 && (
                                <div className="flex gap-1">
                                  {aula.periodos.map(per => (
                                    <span key={per} className="text-[10px] bg-info/10 text-info border border-info/20 px-1.5 py-0.5 rounded">{per}ºP</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {aula.conteudo && (
                              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{aula.conteudo}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                              {aula.data_inicio && <span>Início: {aula.data_inicio}</span>}
                              {aula.data_fim && <span>Fim: {aula.data_fim}</span>}
                              {aula.recursos_didaticos && <span>Recursos: {aula.recursos_didaticos}</span>}
                              {aula.metodologia && <span>Metodologia: {aula.metodologia}</span>}
                              {aula.avaliacao && <span>Avaliação: {aula.avaliacao}</span>}
                              {aula.referencias && <span>Referências: {aula.referencias}</span>}
                            </div>
                            {aula.bncc_fields && aula.bncc_fields.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {aula.bncc_fields.map((item: any, idx: number) => (
                                  <span key={idx} className="text-[10px] bg-success/5 text-success border border-success/20 px-1.5 py-0.5 rounded">
                                    {item.codigo || item.nome || item.tipo}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-4 shrink-0">
                            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(aula)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleExcluir(aula.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
