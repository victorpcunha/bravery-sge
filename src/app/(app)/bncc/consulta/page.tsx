'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

type EtapaEnsino = {
  id: string
  etapa_nome: string
  etapa_tipo: string
  etapa_codigo: number
}

type Disciplina = { id: string; nome: string; tipo_ensino: string }
type AreaConhecimento = { id: string; nome: string }

type Habilidade = {
  id: string
  codigo_bncc: string
  descricao: string
  anos: string[]
  etapa_ensino: string
  objeto_conhecimento: {
    id: string
    objeto_conhecimento: string
    unidade_tematica: {
      id: string
      unidade_tematica: string
      disciplina: string
    }
  }
}

type BNCCObjetivo = {
  id: string
  codigo_bncc: string
  descricao: string
  faixa_etaria: string
  campo_experiencia: string
}

type HabilidadeMedio = {
  id: string
  codigo: string
  descricao: string
  competencia_codigo: string
}

function getBroadTipo(tipo: string): 'infantil' | 'fundamental' | 'medio' {
  const t = tipo.toLowerCase()
  if (t.includes('infantil') || t.includes('creche') || t.includes('pre')) return 'infantil'
  if (t.includes('fundamental') || t.includes('ano')) return 'fundamental'
  return 'medio'
}

export default function BNCCConsultaPage() {
  const { schoolId } = useAuth()
  const [etapas, setEtapas] = useState<EtapaEnsino[]>([])
  const [etapa, setEtapa] = useState('')
  const [etapaTipo, setEtapaTipo] = useState('')

  const [faixaEtaria, setFaixaEtaria] = useState('')
  const [disciplina, setDisciplina] = useState('')
  const [areaId, setAreaId] = useState('')

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [areas, setAreas] = useState<AreaConhecimento[]>([])
  const [faixas, setFaixas] = useState<string[]>([])

  const [dados, setDados] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedGrupo, setExpandedGrupo] = useState<string | null>(null)

  useEffect(() => {
    loadEtapas()
    loadDisciplinas()
    loadAreas()
  }, [schoolId])

  useEffect(() => {
    setFaixaEtaria(''); setDisciplina(''); setAreaId('')
    if (etapa) {
      const found = etapas.find(e => e.etapa_nome === etapa)
      if (found) setEtapaTipo(found.etapa_tipo)
    }
  }, [etapa, etapas])

  useEffect(() => {
    if (!etapa || !etapaTipo) return
    const tipo = getBroadTipo(etapaTipo)
    if (tipo === 'infantil') loadFaixas()
  }, [etapa, etapaTipo])

  useEffect(() => {
    loadDados()
  }, [etapa, faixaEtaria, disciplina, areaId])

  async function loadEtapas() {
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_nome, etapa_tipo, etapa_codigo')
      .eq('school_id', schoolId)
      .eq('ativa', true)
      .order('etapa_codigo')
    if (data) {
      setEtapas(data)
      if (!etapa && data.length > 0) {
        setEtapa(data[0].etapa_nome)
        setEtapaTipo(data[0].etapa_tipo)
      }
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
    if (data) setDisciplinas(data)
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
    const { data } = await supabase
      .from('bncc_objetivos')
      .select('faixa_etaria')
      .eq('etapa', etapa)
      .not('faixa_etaria', 'is', null)
    if (data) {
      const unique = [...new Set(data.map(d => d.faixa_etaria))].filter(Boolean) as string[]
      setFaixas(unique)
      if (!faixaEtaria && unique.length > 0) setFaixaEtaria(unique[0])
    }
  }

  async function loadDados() {
    if (!etapa || !etapaTipo) { setDados([]); setLoading(false); return }
    setLoading(true)
    const supabase = getSupabaseClient()
    const tipo = getBroadTipo(etapaTipo)

    try {
      if (tipo === 'infantil') {
        let q = supabase.from('bncc_objetivos').select('*').eq('etapa', etapa)
        if (faixaEtaria) q = q.eq('faixa_etaria', faixaEtaria)
        const { data } = await q
        setDados(data || [])
      } else if (tipo === 'fundamental') {
        let q = supabase.from('bncc_habilidades').select(`
          id, codigo_bncc, descricao, anos, etapa_ensino,
          objeto_conhecimento:bncc_objetos_conhecimento!inner(
            id, objeto_conhecimento,
            unidade_tematica:bncc_unidades_tematicas!inner(id, unidade_tematica, disciplina)
          )
        `)
        if (disciplina) {
          q = q.eq('objeto_conhecimento.unidade_tematica.disciplina', disciplina)
        }
        const { data } = await q
        setDados((data || []) as any[])
      } else {
        let q = supabase.from('bncc_habilidades_medio')
          .select('id, codigo, descricao, competencia_codigo')
        if (areaId) q = q.eq('area_id', areaId)
        q = q.order('competencia_codigo').order('codigo')
        const { data } = await q
        setDados((data || []) as any[])
      }
    } catch {
      setDados([])
    }
    setLoading(false)
  }

  const tipo = etapaTipo ? getBroadTipo(etapaTipo) : null

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-foreground">Consulta da BNCC</h1>
        <p className="text-muted-foreground mt-1">
          Base Nacional Comum Curricular
        </p>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                  <SelectValue placeholder="Selecione" />
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
            </div>

            {tipo === 'infantil' && (
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Faixa Etária</label>
                <Select value={faixaEtaria} onValueChange={setFaixaEtaria}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="all">Todas</SelectItem>
                    {faixas.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {tipo === 'fundamental' && (
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Disciplina</label>
                <Select value={disciplina} onValueChange={setDisciplina}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="all">Todas</SelectItem>
                    {disciplinas.map(d => (
                      <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {tipo === 'medio' && (
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Área do Conhecimento</label>
                <Select value={areaId} onValueChange={setAreaId}>
                  <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="all">Todas</SelectItem>
                    {areas.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Total</label>
              <div className="h-10 flex items-center">
                <Badge className="bg-primary/10 text-primary text-lg px-3 py-1">
                  {totalUnicos} {tipo === 'infantil' ? 'objetivos' : 'habilidades'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : dados.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground text-center">
              Nenhum registro encontrado para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grupos as Record<string, any[]>).map(([grupo, items], idx) => (
            <Card key={grupo} className="border-0 shadow-md card-glass animate-fade-in-up">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 bg-muted/30"
                onClick={() => setExpandedGrupo(expandedGrupo === grupo ? null : grupo)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">{grupo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary/10 text-secondary border-0">{items.length}</Badge>
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
                        <Badge className="shrink-0 font-mono text-xs bg-gradient-to-r from-primary to-secondary text-white border-0">
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
        </div>
      )}
    </div>
  )
}
