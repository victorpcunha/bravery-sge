'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

type Disciplina = {
  id: string
  nome: string
  tipo_ensino: string
}

type EtapaEnsino = {
  id: string
  etapa_nome: string
  etapa_tipo: string
}

type ObjetoConhecimento = {
  id: string
  objeto_conhecimento: string
  unidade_tematica: {
    id: string
    unidade_tematica: string
    disciplina: string
    etapa_ensino: string
  }
  habilidades_count: number
}

export default function ObjetosConhecimentoPage() {
  const { schoolId } = useAuth()
  const [disciplina, setDisciplina] = useState('all')
  const [etapa, setEtapa] = useState('all')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [objetos, setObjetos] = useState<ObjetoConhecimento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedUnidade, setExpandedUnidade] = useState<string | null>(null)

  useEffect(() => {
    if (schoolId) {
      loadDisciplinas()
      loadEtapas()
    }
  }, [schoolId])

  useEffect(() => {
    loadObjetos()
  }, [disciplina, etapa])

  async function loadDisciplinas() {
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
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('academico_etapas_ensino')
        .select('id, etapa_nome, etapa_tipo')
        .eq('school_id', schoolId)
        .eq('ativa', true)
        .order('etapa_nome')
      
      if (data) setEtapasList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadObjetos() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('bncc_objetos_conhecimento')
        .select(`
          id,
          objeto_conhecimento,
          unidade_tematica:bncc_unidades_tematicas(
            id,
            unidade_tematica,
            disciplina,
            etapa_ensino
          )
        `)

      const { data, error } = await query

      if (error || !data) {
        setObjetos([])
      } else {
        const objetosData = data as unknown as ObjetoConhecimento[]

        // Deduplica por texto + unidade temática (mesmo objeto aparece em vários anos)
        const vistos = new Set<string>()
        const dedup: ObjetoConhecimento[] = []
        for (const obj of objetosData) {
          const chave = `${obj.objeto_conhecimento}|${obj.unidade_tematica?.unidade_tematica}`
          if (!vistos.has(chave)) {
            vistos.add(chave)
            dedup.push(obj)
          }
        }
        
        let filtered = dedup
        
        if (disciplina !== 'all') {
          filtered = filtered.filter(o => o.unidade_tematica?.disciplina === disciplina)
        }
        
        const objetosComContagem = await Promise.all(
          filtered.map(async (obj) => {
            const { count } = await supabase
              .from('bncc_habilidades')
              .select('*', { count: 'exact', head: true })
              .eq('objeto_conhecimento_id', obj.id)
            
            let habilidadesCount = count || 0
            
            if (etapa !== 'all' && habilidadesCount > 0) {
              const { data: habilidades } = await supabase
                .from('bncc_habilidades')
                .select('anos')
                .eq('objeto_conhecimento_id', obj.id)
              
              const anoNormalizado = etapa.replace(/ Ano$/, '')
              const temAno = habilidades?.some((h: { anos: string[] }) => 
                h.anos?.some((a: string) => a.includes(anoNormalizado))
              )
              
              if (!temAno) habilidadesCount = 0
            }
            
            return { ...obj, habilidades_count: habilidadesCount }
          })
        )
        
        const finalFiltered = etapa === 'all' 
          ? objetosComContagem 
          : objetosComContagem.filter(o => o.habilidades_count > 0)
        
        setObjetos(finalFiltered)
      }
    } catch (err) {
      setObjetos([])
    }
    setLoading(false)
  }

  const filteredObjetos = objetos.filter(obj => {
    const matchesSearch = searchTerm === '' || 
      obj.objeto_conhecimento.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const groupedByUnidade = filteredObjetos.reduce((acc, obj) => {
    const unidade = obj.unidade_tematica?.unidade_tematica || 'Sem unidade'
    if (!acc[unidade]) {
      acc[unidade] = {
        disciplina: obj.unidade_tematica?.disciplina || '',
        etapa: obj.unidade_tematica?.etapa_ensino || '',
        objetos: []
      }
    }
    acc[unidade].objetos.push(obj)
    return acc
  }, {} as Record<string, { disciplina: string, etapa: string, objetos: ObjetoConhecimento[] }>)

  const totalObjetos = filteredObjetos.length
  const totalHabilidades = objetos.reduce((acc, obj) => acc + obj.habilidades_count, 0)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Objetos de Conhecimento</h1>
            <p className="text-muted-foreground mt-1">
              Objetos de Conhecimento do Ensino Fundamental e Médio conforme BNCC
            </p>
          </div>
          <Button className="bg-primary hover:bg-secondary" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Novo Objeto
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Disciplina</label>
              <Select value={disciplina} onValueChange={setDisciplina}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem value="all">Todas as Disciplinas</SelectItem>
                  {disciplinasList.map(d => (
                    <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="border-2 border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  <SelectItem value="all">Todos os Anos</SelectItem>
                  {etapasList.map(e => (
                    <SelectItem key={e.id} value={e.etapa_nome}>{e.etapa_nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block text-foreground">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar objeto de conhecimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card/80 border border-border rounded-lg focus:border-primary focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-lg px-4 py-2">
          {totalObjetos} Objetos de Conhecimento
        </Badge>
        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 text-lg px-4 py-2">
          {totalHabilidades} Habilidades linkedas
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : objetos.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum objeto de conhecimento encontrado</h3>
            <p className="text-muted-foreground text-center">
              Não há objetos de conhecimento cadastrados para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByUnidade).map(([unidade, data], index) => (
            <Card 
              key={unidade} 
              className="border-0 shadow-md card-glass animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader 
                className="cursor-pointer hover:bg-primary-foreground/80 transition-all duration-200 bg-primary-foreground/50"
                onClick={() => setExpandedUnidade(expandedUnidade === unidade ? null : unidade)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{unidade}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.disciplina} • {data.etapa === 'anos_iniciais' ? 'Anos Iniciais' : 'Anos Finais'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">
                      {data.objetos.length} objeto(s)
                    </Badge>
                    {expandedUnidade === unidade ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedUnidade === unidade && (
                <CardContent className="space-y-3 pt-0">
                  {data.objetos.map(obj => (
                    <div 
                      key={obj.id}
                      className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-primary-foreground/80 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{obj.objeto_conhecimento}</p>
                        <Badge variant="outline" className="text-xs">
                          {obj.habilidades_count} habilidade(s)
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up delay-300">
        <p className="text-sm text-muted-foreground">
          Fonte: Base Nacional Comum Curricular (BNCC) - 2018
        </p>
      </div>
    </div>
  )
}