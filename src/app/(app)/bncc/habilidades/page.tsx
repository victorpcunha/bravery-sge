'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, Search, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'

type Disciplina = {
  id: string
  nome: string
  tipo_ensino: string
}

type EtapaEnsino = {
  id: string
  etapa_nome: string
  etapa_tipo: string
  etapa_codigo: number
}

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

export default function HabilidadesPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [disciplina, setDisciplina] = useState('all')
  const [etapa, setEtapa] = useState('all')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [habilidades, setHabilidades] = useState<Habilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedUnidade, setExpandedUnidade] = useState<string | null>(null)
  const [expandedObjeto, setExpandedObjeto] = useState<string | null>(null)

  useEffect(() => {
    async function loadSchool() {
      try {
        const school = await getFirstSchool()
        setSchoolId(school.id)
      } catch (err) {
        console.error(err)
      }
    }
    loadSchool()
  }, [])

  useEffect(() => {
    if (schoolId) {
      loadDisciplinas()
      loadEtapas()
    }
  }, [schoolId])

  useEffect(() => {
    loadHabilidades()
  }, [disciplina, etapa])

  async function loadDisciplinas() {
    if (!schoolId) return
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('academico_disciplinas')
        .select('id, nome, tipo_ensino')
        .eq('school_id', schoolId)
        .eq('ativo', true)
        .order('nome')
      
      if (data) setDisciplinasList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadEtapas() {
    if (!schoolId) return
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('academico_etapas_ensino')
        .select('id, etapa_nome, etapa_tipo, etapa_codigo')
        .eq('school_id', schoolId)
        .eq('ativa', true)
        .order('etapa_codigo')
      
      if (data) setEtapasList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadHabilidades() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      let q = supabase.from('bncc_habilidades').select(`
          id,
          codigo_bncc,
          descricao,
          anos,
          etapa_ensino,
          objeto_conhecimento:bncc_objetos_conhecimento!inner(
            id,
            objeto_conhecimento,
            unidade_tematica:bncc_unidades_tematicas!inner(
              id,
              unidade_tematica,
              disciplina
            )
          )
        `)

      if (disciplina !== 'all') {
        q = q.eq('objeto_conhecimento.unidade_tematica.disciplina', disciplina)
      }

      const { data, error } = await q

      if (error || !data) {
        console.error('Habilidades error:', error)
        setHabilidades([])
      } else {
        const habilidadesData = data as unknown as Habilidade[]
        
        let filtered = habilidadesData
        if (etapa !== 'all') {
          const anoNormalizado = etapa.replace(/ Ano$/, '')
          filtered = filtered.filter(h => {
            const match = h.anos?.some((a: string) => a.includes(anoNormalizado))
            return match === true
          })
        }
        
        setHabilidades(filtered)
      }
    } catch (err) {
      setHabilidades([])
    }
    setLoading(false)
  }

  const filteredHabilidades = habilidades.filter(h => {
    const matchesSearch = searchTerm === '' || 
      h.codigo_bncc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const groupedByUnidade = filteredHabilidades.reduce((acc, h) => {
    const unidade = h.objeto_conhecimento?.unidade_tematica?.unidade_tematica || 'Sem unidade'
    if (!acc[unidade]) {
      acc[unidade] = {}
    }
    const objeto = h.objeto_conhecimento?.objeto_conhecimento || 'Sem objeto'
    if (!acc[unidade][objeto]) {
      acc[unidade][objeto] = []
    }
    const exists = acc[unidade][objeto].some(e => e.codigo_bncc === h.codigo_bncc)
    if (!exists) {
      acc[unidade][objeto].push(h)
    }
    return acc
  }, {} as Record<string, Record<string, Habilidade[]>>)

  const uniqueCodes = new Set(filteredHabilidades.map(h => h.codigo_bncc))
  const totalHabilidades = uniqueCodes.size
  const totalUnidades = Object.keys(groupedByUnidade).length

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Habilidades</h1>
            <p className="text-[#64748b] mt-1">
              Habilidades do Ensino Fundamental e Médio conforme BNCC
            </p>
          </div>
          <Button className="bg-[#1D3557] hover:bg-[#457B9D]" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Habilidade
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-[#334155]">Disciplina</label>
              <Select value={disciplina} onValueChange={setDisciplina}>
                <SelectTrigger className="bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Disciplinas</SelectItem>
                  {disciplinasList.map(d => (
                    <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-[#334155]">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Anos</SelectItem>
                  {etapasList.map(e => (
                    <SelectItem key={e.id} value={e.etapa_nome}>{e.etapa_nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block text-[#334155]">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
                <input
                  type="text"
                  placeholder="Buscar por código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 border border-[#e2e8f0] rounded-lg focus:border-[#1D3557] focus:ring-[#1D3557]/20 outline-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Badge className="bg-[#1D3557]/10 text-[#1D3557] hover:bg-[#1D3557]/20 text-lg px-4 py-2">
          {totalHabilidades} Habilidades cadastradas
        </Badge>
        <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 text-lg px-4 py-2">
          {totalUnidades} Unidades Temáticas
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557] mx-auto mb-4"></div>
          <p className="text-[#64748b]">Carregando...</p>
        </div>
      ) : habilidades.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1D3557]/10 to-[#457B9D]/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-[#1D3557]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma habilidade encontrada</h3>
            <p className="text-[#64748b] text-center">
              Não há habilidades cadastradas para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByUnidade).map(([unidade, objetos], unitIndex) => (
            <Card 
              key={unidade} 
              className="border-0 shadow-md card-glass animate-fade-in-up"
              style={{ animationDelay: `${unitIndex * 50}ms` }}
            >
              <CardHeader 
                className="cursor-pointer hover:bg-[#f8fafc]/80 transition-all duration-200 bg-[#f8fafc]/50"
                onClick={() => setExpandedUnidade(expandedUnidade === unidade ? null : unidade)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#0f172a]">{unidade}</CardTitle>
                    <p className="text-sm text-[#64748b] mt-1">
                      {Object.keys(objetos).length} Objeto(s) de Conhecimento
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 border-0">
                      {Object.values(objetos).flat().length} habilidades
                    </Badge>
                    {expandedUnidade === unidade ? (
                      <ChevronDown className="h-5 w-5 text-[#64748b]" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-[#64748b]" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedUnidade === unidade && (
                <CardContent className="space-y-4 pt-0">
                  {Object.entries(objetos).map(([objeto, habilidadesObj]) => (
                    <div key={objeto} className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                      <div 
                        className="cursor-pointer hover:bg-[#f8fafc]/80 p-4 bg-white/50 transition-all duration-200"
                        onClick={() => setExpandedObjeto(expandedObjeto === objeto ? null : objeto)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#334155]">{objeto}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {habilidadesObj.length} habilidades
                            </Badge>
                            {expandedObjeto === objeto ? (
                              <ChevronDown className="h-4 w-4 text-[#64748b]" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-[#64748b]" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedObjeto === objeto && (
                        <div className="p-4 space-y-3 bg-[#f8fafc]/30">
                          {habilidadesObj.map(h => (
                            <div 
                              key={h.id}
                              className="p-4 rounded-xl border border-[#e2e8f0]/50 bg-white/50 hover:bg-[#f8fafc]/80 transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                  <Badge className="shrink-0 font-mono text-xs bg-gradient-to-r from-[#1D3557] to-[#457B9D] text-white border-0">
                                    {h.codigo_bncc}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="text-sm text-[#334155] leading-relaxed">{h.descricao}</p>
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                      {h.anos?.map((ano, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {ano}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b] hover:text-[#1D3557]">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b] hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
        <p className="text-sm text-[#64748b]">
          Fonte: Base Nacional Comum Curricular (BNCC) - 2018
        </p>
      </div>
    </div>
  )
}