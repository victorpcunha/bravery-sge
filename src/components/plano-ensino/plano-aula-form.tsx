'use client'

import { useState, useEffect } from 'react'
import {
  criarPlanoAula,
  editarPlanoAula,
  calcularAulasDoQuadro,
  type PlanoAula,
  type PlanoEnsinoDisciplina,
  type AulasQuadroDisciplina,
} from '@/lib/actions/plano-ensino'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FormCard } from '@/components/layout/form-card'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { Loader2, Save, X, CalendarDays, Clock } from 'lucide-react'
import { toast } from 'sonner'

type BnccItem = {
  tipo: string
  id: string
  codigo?: string
  nome?: string
  descricao?: string
}

type PlanoAulaFormProps = {
  planoId: string
  turmaId: string
  disciplinas: PlanoEnsinoDisciplina[]
  periodos: number[]
  periodoInicial: number
  etapaTipo: string
  anoEscolar?: string
  bnccData: any
  bnccLoading: boolean
  editingAula: PlanoAula | null
  pessoaId: string | null
  onCancel: () => void
  onSaved: () => void
}

function formatarMinutos(minutos: number) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${String(m).padStart(2, '0')}`
}

export function PlanoAulaForm({
  planoId,
  turmaId,
  disciplinas,
  periodos,
  periodoInicial,
  etapaTipo,
  anoEscolar,
  bnccData,
  bnccLoading,
  editingAula,
  pessoaId,
  onCancel,
  onSaved,
}: PlanoAulaFormProps) {
  const [tema, setTema] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [recursos, setRecursos] = useState('')
  const [metodologia, setMetodologia] = useState('')
  const [avaliacao, setAvaliacao] = useState('')
  const [referencias, setReferencias] = useState('')
  const [selectedPeriodos, setSelectedPeriodos] = useState<number[]>([periodoInicial])
  const [selectedBncc, setSelectedBncc] = useState<BnccItem[]>([])
  const [saving, setSaving] = useState(false)

  const [aulasQuadro, setAulasQuadro] = useState<{ porDisciplina: AulasQuadroDisciplina[]; total_aulas: number; total_minutos: number } | null>(null)
  const [calculando, setCalculando] = useState(false)

  useEffect(() => {
    setTema(editingAula?.tema || '')
    setConteudo(editingAula?.conteudo || '')
    setDataInicio(editingAula?.data_inicio || '')
    setDataFim(editingAula?.data_fim || '')
    setRecursos(editingAula?.recursos_didaticos || '')
    setMetodologia(editingAula?.metodologia || '')
    setAvaliacao(editingAula?.avaliacao || '')
    setReferencias(editingAula?.referencias || '')
    setSelectedPeriodos(editingAula?.periodos?.length ? editingAula.periodos : [periodoInicial])
    setSelectedBncc(editingAula?.bncc_fields || [])
    setAulasQuadro(null)
  }, [editingAula, periodoInicial])

  useEffect(() => {
    if (!dataInicio || !dataFim) {
      setAulasQuadro(null)
      setCalculando(false)
      return
    }
    let cancel = false
    setCalculando(true)
    const timer = setTimeout(() => {
      calcularAulasDoQuadro(
        turmaId,
        disciplinas.map(d => d.matriz_disciplina_id),
        dataInicio,
        dataFim,
        pessoaId
      )
        .then(res => { if (!cancel) setAulasQuadro(res) })
        .catch(() => { if (!cancel) setAulasQuadro(null) })
        .finally(() => { if (!cancel) setCalculando(false) })
    }, 500)
    return () => { cancel = true; clearTimeout(timer) }
  }, [dataInicio, dataFim, turmaId, disciplinas, pessoaId])

  const selectedN1Ids = selectedBncc
    .filter(x => ['unidade_tematica', 'campo_experiencia', 'area_conhecimento'].includes(x.tipo))
    .map(x => x.id)
  const selectedN2Ids = selectedBncc
    .filter(x => ['objeto_conhecimento', 'competencia'].includes(x.tipo))
    .map(x => x.id)

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

  const isInfantil = etapaTipo === 'infantil'
  const isFundamental = ['fundamental_inicial', 'fundamental_final', 'fundamental_outros', 'eja'].includes(etapaTipo)
  const isMedio = etapaTipo === 'medio'

  const handleSave = async () => {
    if (!tema.trim()) {
      toast.error('O campo Tema é obrigatório')
      return
    }
    if (selectedPeriodos.length === 0) {
      toast.error('Selecione pelo menos um período')
      return
    }
    if (!dataInicio) {
      toast.error('O campo Data Inicial é obrigatório')
      return
    }
    if (!dataFim) {
      toast.error('O campo Data Final é obrigatório')
      return
    }
    if (!conteudo.trim()) {
      toast.error('O campo Conteúdo é obrigatório')
      return
    }
    if (isInfantil) {
      if (!selectedBncc.some(x => x.tipo === 'campo_experiencia')) {
        toast.error('Selecione pelo menos um Campo de Experiência')
        return
      }
      if (!selectedBncc.some(x => x.tipo === 'objetivo')) {
        toast.error('Selecione pelo menos um Objetivo de Aprendizagem')
        return
      }
    } else if (isFundamental) {
      if (!selectedBncc.some(x => x.tipo === 'unidade_tematica')) {
        toast.error('Selecione pelo menos uma Unidade Temática')
        return
      }
      if (!selectedBncc.some(x => x.tipo === 'objeto_conhecimento')) {
        toast.error('Selecione pelo menos um Objeto de Conhecimento')
        return
      }
      if (!selectedBncc.some(x => x.tipo === 'habilidade')) {
        toast.error('Selecione pelo menos uma Habilidade')
        return
      }
    } else if (isMedio) {
      if (!selectedBncc.some(x => x.tipo === 'area_conhecimento')) {
        toast.error('Selecione pelo menos uma Área de Conhecimento')
        return
      }
      if (!selectedBncc.some(x => x.tipo === 'competencia')) {
        toast.error('Selecione pelo menos uma Competência Específica')
        return
      }
      if (!selectedBncc.some(x => x.tipo === 'habilidade_medio')) {
        toast.error('Selecione pelo menos uma Habilidade')
        return
      }
    }
    setSaving(true)
    const payload = {
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
    }
    try {
      if (editingAula) {
        await editarPlanoAula(editingAula.id, payload, pessoaId)
        toast.success('Plano de aula atualizado')
      } else {
        await criarPlanoAula({ ...payload, plano_ensino_id: planoId }, pessoaId)
        toast.success('Plano de aula criado')
      }
      onSaved()
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  // Filtro automático por ano escolar (derivado da turma). OC/UT são filtrados em
  // cascata: mantém apenas OCs com ≥1 habilidade do ano e UTs com ≥1 OC do ano.
  // Sem ano escolar definido (multietapa/EJA/outros) → mostra tudo.
  const anoAlvo = isFundamental && anoEscolar ? `${anoEscolar}º` : null
  const habilidadeDoAno = (h: any) => {
    if (!anoAlvo) return true
    const anos = Array.isArray(h.anos) ? h.anos : (h.anos ? JSON.parse(h.anos) : [])
    return anos.includes(anoAlvo)
  }
  const habilidadesFiltradas = anoAlvo
    ? (bnccData?.habilidades || []).filter(habilidadeDoAno)
    : (bnccData?.habilidades || [])
  const objetosFiltrados = anoAlvo
    ? (bnccData?.objetos_conhecimento || []).filter((o: any) =>
        habilidadesFiltradas.some((h: any) => h.objeto_conhecimento_id === o.id)
      )
    : (bnccData?.objetos_conhecimento || [])
  const unidadesFiltradas = anoAlvo
    ? (bnccData?.unidades_tematicas || []).filter((u: any) =>
        objetosFiltrados.some((o: any) => o.unidade_tematica_id === u.id)
      )
    : (bnccData?.unidades_tematicas || [])

  return (
    <div className="space-y-6">
      <FormCard title="Identificação e Conteúdo" description="Tema, períodos, datas e conteúdo programático da aula">
        <div className="space-y-4">
          <div>
            <Label htmlFor="plano-aula-tema" className="text-[14px] font-medium">Tema *</Label>
            <Input
              id="plano-aula-tema"
              value={tema}
              onChange={e => setTema(e.target.value)}
              placeholder="Ex: Frações"
              className="mt-1 h-10"
            />
          </div>

          <div>
            <Label className="text-[14px] font-medium">Períodos *</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {periodos.map(per => (
                <ClickablePill
                  key={per}
                  label={`${per}º Período`}
                  active={selectedPeriodos.includes(per)}
                  onClick={() => togglePeriodo(per)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plano-aula-data-inicio" className="text-[14px] font-medium">Data Inicial *</Label>
              <Input id="plano-aula-data-inicio" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} aria-required="true" className="mt-1 h-10" />
            </div>
            <div>
              <Label htmlFor="plano-aula-data-fim" className="text-[14px] font-medium">Data Final *</Label>
              <Input id="plano-aula-data-fim" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} aria-required="true" className="mt-1 h-10" />
            </div>
          </div>

          {dataInicio && dataFim && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-primary/70" />
                  Aulas no período
                </p>
                {calculando && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>
              {calculando && !aulasQuadro ? (
                <p className="text-[13px] text-muted-foreground">Calculando...</p>
              ) : aulasQuadro && aulasQuadro.porDisciplina.length > 0 ? (
                <div className="space-y-1">
                  {aulasQuadro.porDisciplina.map(item => {
                    const disc = disciplinas.find(d => d.matriz_disciplina_id === item.matriz_disciplina_id)
                    return (
                      <div key={item.matriz_disciplina_id} className="flex items-center justify-between text-[13px] gap-2">
                        <span className="font-medium text-foreground truncate">{disc?.nome || 'Disciplina'}</span>
                        <span className="text-muted-foreground tabular-nums shrink-0">
                          {item.total_aulas} aula{item.total_aulas === 1 ? '' : 's'}
                          {item.total_minutos > 0 ? ` · ${formatarMinutos(item.total_minutos)}` : ''}
                        </span>
                      </div>
                    )
                  })}
                  {aulasQuadro.porDisciplina.length > 1 && (
                    <div className="flex items-center justify-between text-[13px] border-t border-border pt-1.5 mt-1.5 gap-2">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {aulasQuadro.total_aulas} aulas · {formatarMinutos(aulasQuadro.total_minutos)}
                      </span>
                    </div>
                  )}
                  <p className="text-[12px] text-muted-foreground mt-1.5">
                    Baseado no Quadro de Aulas ativo no período informado.
                  </p>
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Nenhuma aula encontrada no Quadro de Aulas para este período.
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="plano-aula-conteudo" className="text-[14px] font-medium">Conteúdo *</Label>
            <Textarea id="plano-aula-conteudo" value={conteudo} onChange={e => setConteudo(e.target.value)} rows={3}
              aria-required="true" className="mt-1" placeholder="Conteúdo programático da aula" />
          </div>
        </div>
      </FormCard>

      <FormCard title="Estrutura da BNCC" description="Selecione os componentes curriculares referentes à BNCC">
        {bnccLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ) : bnccData ? (
          <div className="space-y-5">
            {isInfantil && (
              <>
                <div>
                  <Label className="text-[14px] font-medium text-muted-foreground">Campos de Experiência *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bnccData.campos_experiencia?.map((c: any) => (
                      <ClickablePill
                        key={c.id}
                        label={`${c.sigla} — ${c.nome}`}
                        active={isBnccSelected('campo_experiencia', c.id)}
                        onClick={() => toggleBnccItem({ tipo: 'campo_experiencia', id: c.id, nome: c.sigla + ' - ' + c.nome })}
                      />
                    ))}
                  </div>
                </div>
                {selectedN1Ids.length > 0 && (
                  <div>
                    <Label className="text-[14px] font-medium text-muted-foreground">Objetivos de Aprendizagem *</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-2 border rounded-lg p-3">
                      {bnccData.objetivos
                        ?.filter((o: any) => selectedBncc
                          .filter(x => x.tipo === 'campo_experiencia')
                          .some(c => o.campo_experiencia?.toLowerCase().includes(c.nome?.toLowerCase() || '')))
                        .map((o: any) => (
                          <label key={o.id} className="flex items-start gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={isBnccSelected('objetivo', o.id)}
                              onCheckedChange={() => toggleBnccItem({ tipo: 'objetivo', id: o.id, codigo: o.codigo_bncc, descricao: o.descricao })}
                            />
                            <div>
                              <Badge variant="outline" className="font-mono text-[11px] bg-primary/5 text-primary border-primary/20">
                                {o.codigo_bncc}
                              </Badge>
                              <p className="text-[13px] text-muted-foreground mt-0.5">{o.descricao}</p>
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
                  <Label className="text-[14px] font-medium text-muted-foreground">Unidades Temáticas *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {unidadesFiltradas.map((u: any) => (
                      <ClickablePill
                        key={u.id}
                        label={u.unidade_tematica}
                        active={isBnccSelected('unidade_tematica', u.id)}
                        onClick={() => toggleBnccItem({ tipo: 'unidade_tematica', id: u.id, nome: u.unidade_tematica })}
                      />
                    ))}
                  </div>
                </div>
                {selectedN1Ids.length > 0 && (
                  <div>
                    <Label className="text-[14px] font-medium text-muted-foreground">Objetos de Conhecimento *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {objetosFiltrados
                        ?.filter((o: any) => selectedN1Ids.includes(o.unidade_tematica_id))
                        .map((o: any) => (
                          <ClickablePill
                            key={o.id}
                            label={o.objeto_conhecimento}
                            title={o.objeto_conhecimento}
                            active={isBnccSelected('objeto_conhecimento', o.id)}
                            onClick={() => toggleBnccItem({ tipo: 'objeto_conhecimento', id: o.id, nome: o.objeto_conhecimento })}
                          />
                        ))}
                    </div>
                  </div>
                )}
                {selectedN2Ids.length > 0 && (
                  <div>
                    <Label className="text-[14px] font-medium text-muted-foreground">Habilidades *</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-2 border rounded-lg p-3">
                      {habilidadesFiltradas
                        ?.filter((h: any) => selectedN2Ids.includes(h.objeto_conhecimento_id))
                        .map((h: any) => (
                          <label key={h.id} className="flex items-start gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={isBnccSelected('habilidade', h.id)}
                              onCheckedChange={() => toggleBnccItem({ tipo: 'habilidade', id: h.id, codigo: h.codigo_bncc, descricao: h.descricao })}
                            />
                            <div>
                              <Badge variant="outline" className="font-mono text-[11px] bg-primary/5 text-primary border-primary/20">
                                {h.codigo_bncc}
                              </Badge>
                              <p className="text-[13px] text-muted-foreground mt-0.5">{h.descricao}</p>
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
                  <Label className="text-[14px] font-medium text-muted-foreground">Áreas de Conhecimento *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bnccData.areas_conhecimento?.map((a: any) => (
                      <ClickablePill
                        key={a.id}
                        label={a.nome}
                        active={isBnccSelected('area_conhecimento', a.id)}
                        onClick={() => toggleBnccItem({ tipo: 'area_conhecimento', id: a.id, nome: a.nome })}
                      />
                    ))}
                  </div>
                </div>
                {selectedN1Ids.length > 0 && (
                  <div>
                    <Label className="text-[14px] font-medium text-muted-foreground">Competências Específicas *</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bnccData.competencias
                        ?.filter((c: any) => selectedN1Ids.includes(c.area_id))
                        .map((c: any) => (
                          <ClickablePill
                            key={c.id}
                            label={`Competência ${c.codigo}`}
                            title={c.descricao}
                            active={isBnccSelected('competencia', c.id)}
                            onClick={() => toggleBnccItem({ tipo: 'competencia', id: c.id, codigo: c.codigo, descricao: c.descricao })}
                          />
                        ))}
                    </div>
                  </div>
                )}
                {selectedN2Ids.length > 0 && (
                  <div>
                    <Label className="text-[14px] font-medium text-muted-foreground">Habilidades *</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-2 border rounded-lg p-3">
                      {bnccData.habilidades_medio
                        ?.filter((h: any) => selectedN2Ids.some(compId => {
                          const comp = bnccData.competencias?.find((c: any) => c.id === compId)
                          return comp && h.area_id === comp.area_id && h.competencia_codigo === comp.codigo
                        }))
                        .map((h: any) => (
                          <label key={h.id} className="flex items-start gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={isBnccSelected('habilidade_medio', h.id)}
                              onCheckedChange={() => toggleBnccItem({ tipo: 'habilidade_medio', id: h.id, codigo: h.codigo, descricao: h.descricao })}
                            />
                            <div>
                              <Badge variant="outline" className="font-mono text-[11px] bg-primary/5 text-primary border-primary/20">
                                {h.codigo}
                              </Badge>
                              <p className="text-[13px] text-muted-foreground mt-0.5">{h.descricao}</p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <p className="text-[15px] text-muted-foreground">Não foi possível carregar os dados da BNCC.</p>
        )}
      </FormCard>

      <FormCard title="Planejamento Pedagógico" description="Recursos, estratégias, avaliação e referências da aula">
        <div className="space-y-4">
          <div>
            <Label className="text-[14px] font-medium">Recursos Didáticos</Label>
            <Textarea value={recursos} onChange={e => setRecursos(e.target.value)} rows={2}
              className="mt-1" placeholder="Recursos utilizados na aula" />
          </div>
          <div>
            <Label className="text-[14px] font-medium">Metodologia</Label>
            <Textarea value={metodologia} onChange={e => setMetodologia(e.target.value)} rows={2}
              className="mt-1" placeholder="Estratégias e métodos de ensino" />
          </div>
          <div>
            <Label className="text-[14px] font-medium">Avaliação</Label>
            <Textarea value={avaliacao} onChange={e => setAvaliacao(e.target.value)} rows={2}
              className="mt-1" placeholder="Forma de avaliação da aula" />
          </div>
          <div>
            <Label className="text-[14px] font-medium">Referências</Label>
            <Textarea value={referencias} onChange={e => setReferencias(e.target.value)} rows={2}
              className="mt-1" placeholder="Referências bibliográficas" />
          </div>
        </div>
      </FormCard>

      <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-t border-border flex justify-end gap-3">
        <Button variant="outline" size="lg" className="h-11 min-w-[120px]" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-1.5" />
          Cancelar
        </Button>
        <Button size="lg" className="h-11 min-w-[140px] shadow-md" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
          {saving ? 'Salvando...' : editingAula ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}
