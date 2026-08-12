'use client'

import { useState, useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'

type EtapaEnsino = {
  id: string
  etapa_nome: string
  etapa_tipo: string
  etapa_codigo: number
}

type Disciplina = { id: string; nome: string; tipo_ensino: string }
type AreaConhecimento = { id: string; nome: string }

function getBroadTipo(tipo: string): 'infantil' | 'fundamental' | 'medio' {
  const t = tipo.toLowerCase()
  if (t.includes('infantil') || t.includes('creche') || t.includes('pre')) return 'infantil'
  if (t.includes('fundamental') || t.includes('ano')) return 'fundamental'
  return 'medio'
}

function getEtapaDb(nome: string): string {
  const n = nome?.toLowerCase() || ''
  if (n.includes('creche')) return 'creche'
  if (n.includes('pre') || n.includes('pré')) return 'pre-escola'
  return nome
}

export default function BNCCConsultaPage() {
  const { schoolId } = useAuth()
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [etapa, setEtapa] = useState('')

  const [faixaEtaria, setFaixaEtaria] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [areaId, setAreaId] = useState('')

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [areas, setAreas] = useState<AreaConhecimento[]>([])
  const [faixas, setFaixas] = useState<string[]>([])

  const [dados, setDados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGrupo, setExpandedGrupo] = useState<string | null>(null)

  const reqRef = useRef(0)

  const etapaSelecionada = etapas.find(e => e.etapa_nome === etapa)
  const tipo = etapaSelecionada ? getBroadTipo(etapaSelecionada.etapa_tipo) : null

  useEffect(() => {
    loadEtapas()
    loadDisciplinas()
    loadAreas()
  }, [schoolId])

  useEffect(() => {
    setFaixaEtaria(''); setDisciplina(''); setAreaId('')
    setExpandedGrupo(null)
  }, [etapa])

  useEffect(() => {
    if (tipo === 'infantil') loadFaixas()
  }, [tipo, etapa])

  useEffect(() => {
    loadDados()
  }, [tipo, etapa, faixaEtaria, disciplina, areaId])

  async function loadEtapas() {
    const data = await getEtapasEnsino(schoolId)
    if (data && data.length > 0) {
      const filtered = data.filter(e => !e.etapa_nome?.toLowerCase().includes('unificada'))
      setEtapas(filtered)
    }
  }

  async function loadDisciplinas() {
    const supabase = getSupabaseClient()
    const { data: bnccDiscs } = await supabase
      .from('bncc_unidades_tematicas')
      .select('disciplina')
      .not('disciplina', 'is', null)
    if (!bnccDiscs) { setDisciplinas([]); return }
    const nomesBncc = [...new Set(bnccDiscs.map(d => d.disciplina))]
    const { data } = await supabase
      .from('academico_disciplinas')
      .select('id, nome, tipo_ensino')
      .eq('school_id', schoolId)
      .eq('ativo', true)
      .in('nome', nomesBncc)
      .order('nome')
    if (data && data.length > 0) {
      setDisciplinas(data)
    } else {
      setDisciplinas(nomesBncc.map(n => ({ id: n, nome: n, tipo_ensino: '' })))
    }
  }

  async function loadAreas() {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('bncc_areas_conhecimento')
      .select('id, nome')
      .eq('tipo_ensino', 'medio')
      .order('nome')
    if (data) setAreas(data)
  }

  async function loadFaixas() {
    const supabase = getSupabaseClient()
    const etapaDb = getEtapaDb(etapa || '')
    const { data } = await supabase
      .from('bncc_objetivos')
      .select('faixa_etaria')
      .eq('etapa', etapaDb)
      .not('faixa_etaria', 'is', null)
    if (data) {
      const unique = [...new Set(data.map(d => d.faixa_etaria))].filter(Boolean) as string[]
      setFaixas(unique)
    }
  }

  async function loadDados() {
    if (!etapa || !tipo) { setDados([]); setLoading(false); return }
    const reqId = ++reqRef.current
    setLoading(true)
    const supabase = getSupabaseClient()

    if (tipo === 'fundamental' && !disciplina) {
      setDados([])
      setLoading(false)
      return
    }
    if (tipo === 'medio' && !areaId) {
      setDados([])
      setLoading(false)
      return
    }

    try {
      if (tipo === 'infantil') {
        let q = supabase.from('bncc_objetivos').select('*').eq('etapa', getEtapaDb(etapa))
        if (faixaEtaria) q = q.eq('faixa_etaria', faixaEtaria)
        const { data } = await q
        if (reqId === reqRef.current) setDados(data || [])
      } else if (tipo === 'fundamental') {
        let q = supabase.from('bncc_habilidades').select(`
          id, codigo_bncc, descricao, anos, etapa_ensino,
          objeto_conhecimento:bncc_objetos_conhecimento!inner(
            id, objeto_conhecimento,
            unidade_tematica:bncc_unidades_tematicas!inner(id, unidade_tematica, disciplina)
          )
        `)
        q = q.eq('objeto_conhecimento.unidade_tematica.disciplina', disciplina)
        const { data } = await q
        // Filtrar pelo ano escolar no cliente (contorna bug do contains JSONB)
        const anoMatch = etapa.match(/(\d+)º/)
        const anoEscolar = anoMatch ? `${anoMatch[1]}º` : null
        const filtered = anoEscolar
          ? (data || []).filter((h: any) => Array.isArray(h.anos) && h.anos.includes(anoEscolar))
          : (data || [])
        if (reqId === reqRef.current) setDados(filtered as any[])
      } else {
        let q = supabase.from('bncc_habilidades_medio')
          .select('id, codigo, descricao, competencia_codigo')
        q = q.eq('area_id', areaId)
        q = q.order('competencia_codigo').order('codigo')
        const { data } = await q
        if (reqId === reqRef.current) setDados((data || []) as any[])
      }
    } catch {
      if (reqId === reqRef.current) setDados([])
    }
    if (reqId === reqRef.current) setLoading(false)
  }

  const grupos = dados.reduce((acc: any, d: any) => {
    let chave = ''
    if (tipo === 'infantil') chave = d.campo_experiencia || 'Sem campo'
    else if (tipo === 'fundamental') chave = d.objeto_conhecimento?.unidade_tematica?.unidade_tematica || 'Sem unidade'
    else chave = `Competência ${d.competencia_codigo}`
    if (!acc[chave]) acc[chave] = []
    const exists = acc[chave].some((e: any) => (e.codigo_bncc || e.codigo) === (d.codigo_bncc || d.codigo))
    if (!exists) acc[chave].push(d)
    return acc
  }, {} as Record<string, any[]>)

  const totalUnicos = new Set(dados.map((d: any) => d.codigo_bncc || d.codigo)).size

  const tituloAgrupamento = tipo === 'infantil'
    ? 'Campos de Experiências'
    : tipo === 'fundamental'
      ? 'Unidades Temáticas'
      : 'Competências Específicas'

  const descricaoAgrupamento = tipo === 'infantil'
    ? `Objetivos de aprendizagem agrupados por campo de experiência — ${etapa}`
    : tipo === 'fundamental'
      ? `Habilidades agrupadas por unidade temática — ${etapa}`
      : 'Habilidades agrupadas por competência específica'

  return (
    <PageContainer>
      <PageHeader
        title="Consulta da BNCC"
        description="Base Nacional Comum Curricular"
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar>
          <Select value={etapa} onValueChange={setEtapa}>
            <SelectTrigger className="w-auto min-w-[240px] h-9">
              <SelectValue placeholder="Selecione uma Etapa de Ensino" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" sideOffset={5}>
              {(() => {
                const grupos: Record<string, EtapaEnsino[]> = {}
                for (const e of etapas) {
                  const chave = getBroadTipo(e.etapa_tipo)
                  if (!grupos[chave]) grupos[chave] = []
                  grupos[chave].push(e)
                }
                const labels: Record<string, string> = {
                  infantil: 'Educação Infantil',
                  fundamental: 'Ensino Fundamental',
                  medio: 'Ensino Médio'
                }
                return Object.entries(grupos).flatMap(([tipo, lista]) => [
                  <SelectGroup key={tipo}>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                      {labels[tipo] || tipo}
                    </SelectLabel>
                    {lista.map(e => (
                      <SelectItem key={e.id} value={e.etapa_nome}>{e.etapa_nome}</SelectItem>
                    ))}
                  </SelectGroup>
                ])
              })()}
            </SelectContent>
          </Select>

          {tipo === 'infantil' && (
            <Select value={faixaEtaria} onValueChange={setFaixaEtaria}>
              <SelectTrigger className="w-auto min-w-[220px] h-9">
                <SelectValue placeholder="Selecione uma faixa etária" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5}>
                {faixas.map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {tipo === 'fundamental' && (
            <Select value={disciplina} onValueChange={setDisciplina}>
              <SelectTrigger className="w-auto min-w-[200px] h-9">
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5}>
                {disciplinas.map(d => (
                  <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {tipo === 'medio' && (
            <Select value={areaId} onValueChange={setAreaId}>
              <SelectTrigger className="w-auto min-w-[200px] h-9">
                <SelectValue placeholder="Selecione uma área" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={5}>
                {areas.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {dados.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 shadow-sm">
              <span className="text-[15px] font-bold text-primary-foreground tabular-nums">{totalUnicos}</span>
              <span className="text-xs font-medium text-primary-foreground/80">
                {tipo === 'infantil' ? 'objetivos' : 'habilidades'}
              </span>
            </span>
          )}
        </FilterBar>
      </PageSection>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : dados.length === 0 ? (
        <Card className="border-0 shadow-sm animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            {!etapa ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione os filtros</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>etapa de ensino</strong> para consultar a BNCC.
                </p>
              </>
            ) : tipo === 'fundamental' && !disciplina ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione a disciplina</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>disciplina</strong> para visualizar as habilidades.
                </p>
              </>
            ) : tipo === 'medio' && !areaId ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione a área</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>área do conhecimento</strong> para visualizar as habilidades.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Nenhum registro encontrado para os filtros selecionados.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden animate-fade-in-up">
          <CardHeader className="bg-muted/40 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-[20px] font-semibold text-foreground tracking-tight">{tituloAgrupamento}</CardTitle>
                <p className="text-[15px] text-muted-foreground mt-1">{descricaoAgrupamento}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 shadow-sm shrink-0">
                <span className="text-[15px] font-bold text-primary-foreground tabular-nums">{Object.keys(grupos).length}</span>
                <span className="text-xs font-medium text-primary-foreground/80">
                  {tipo === 'infantil' ? 'campos' : 'grupos'}
                </span>
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-4 bg-muted/30">
          {Object.entries(grupos as Record<string, any[]>).map(([grupo, items], idx) => (
            <Card key={grupo} className="border-0 shadow-sm animate-fade-in-up">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 bg-muted/30"
                onClick={() => setExpandedGrupo(expandedGrupo === grupo ? null : grupo)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">{grupo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 shadow-sm">
                      <span className="text-[15px] font-bold text-primary-foreground tabular-nums">{items.length}</span>
                      <span className="text-xs font-medium text-primary-foreground/80">
                        {tipo === 'infantil' ? 'objetivos' : 'habilidades'}
                      </span>
                    </span>
                    {expandedGrupo === grupo ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedGrupo === grupo && (
                <CardContent className="space-y-3">
                  {items.map((item: any) => (
                    <div key={item.id || item.codigo} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <Badge className="shrink-0 font-mono text-xs bg-primary text-primary-foreground border-0">
                          {item.codigo_bncc || item.codigo}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-foreground leading-relaxed">{item.descricao}</p>
                          {item.anos && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {(item.anos as string[]).map((a, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
