'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'

type Disciplina = {
  id: string
  nome: string
}

type EtapaEnsino = {
  id: string
  etapa_nome: string
}

type UnidadeTematica = {
  id: string
  unidade_tematica: string
  disciplina: string
  etapa_ensino: string
  objetos_count: number
  habilidades_count: number
}

export default function UnidadesTematicasPage() {
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [disciplina, setDisciplina] = useState('all')
  const [etapa, setEtapa] = useState('all')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [unidades, setUnidades] = useState<UnidadeTematica[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUnidade, setExpandedUnidade] = useState<string | null>(null)

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
    loadUnidades()
  }, [disciplina, etapa])

  async function loadDisciplinas() {
    if (!schoolId) return
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('academico_disciplinas')
        .select('id, nome')
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
        .select('id, etapa_nome')
        .eq('school_id', schoolId)
        .eq('ativa', true)
        .order('etapa_nome')
      
      if (data) setEtapasList(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function loadUnidades() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('bncc_unidades_tematicas')
        .select('*')

      const { data, error } = await query

      if (error || !data) {
        setUnidades([])
      } else {
        const unidadesData = data as unknown as UnidadeTematica[]
        
        let filtered = unidadesData
        
        if (disciplina !== 'all') {
          filtered = filtered.filter(u => u.disciplina === disciplina)
        }
        
        const unidadesComContagem = await Promise.all(
          filtered.map(async (unidade) => {
            const { data: objetosData } = await supabase
              .from('bncc_objetos_conhecimento')
              .select('id')
              .eq('unidade_tematica_id', unidade.id)
            
            const objetosIds = objetosData?.map(o => o.id) || []
            
            let habilidadesCount = 0
            if (objetosIds.length > 0) {
              const { data: habilidadesData } = await supabase
                .from('bncc_habilidades')
                .select('anos')
                .in('objeto_conhecimento_id', objetosIds)
              
              if (etapa === 'all') {
                habilidadesCount = habilidadesData?.length || 0
              } else {
                const anoNormalizado = etapa.replace(/ Ano$/, '')
                habilidadesCount = habilidadesData?.filter((h: { anos: string[] }) => 
                  h.anos?.some((a: string) => a.includes(anoNormalizado))
                ).length || 0
              }
            }
            
            const filteredObjCount = etapa === 'all' 
              ? (objetosData?.length || 0)
              : objetosIds.length
            
            return {
              ...unidade,
              objetos_count: filteredObjCount,
              habilidades_count: habilidadesCount
            }
          })
        )
        
        const finalFiltered = etapa === 'all'
          ? unidadesComContagem
          : unidadesComContagem.filter(u => u.habilidades_count > 0)
        
        setUnidades(finalFiltered)
      }
    } catch (err) {
      setUnidades([])
    }
    setLoading(false)
  }

  const totalUnidades = unidades.length
  const totalObjetos = unidades.reduce((acc, u) => acc + u.objetos_count, 0)
  const totalHabilidades = unidades.reduce((acc, u) => acc + u.habilidades_count, 0)

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Unidades Temáticas e Práticas de Linguagem</h1>
            <p className="text-[#64748b] mt-1">
              Unidades Temáticas do Ensino Fundamental e Médio conforme BNCC
            </p>
          </div>
          <Button className="bg-[#1D3557] hover:bg-[#457B9D]" disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-[#334155]">Disciplina</label>
              <Select value={disciplina} onValueChange={setDisciplina}>
                <SelectTrigger className="border-2 border-[#e2e8f0] focus:border-[#1D3557] [&_svg:not([class*='rotate'])]:rotate-0">
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
              <label className="text-sm font-medium mb-2 block text-[#334155]">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="border-2 border-[#e2e8f0] focus:border-[#1D3557] [&_svg:not([class*='rotate'])]:rotate-0">
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

            <div className="flex items-end">
              <div className="flex gap-2">
                <Badge className="bg-[#1D3557]/10 text-[#1D3557] hover:bg-[#1D3557]/20 text-sm px-3 py-1">
                  {totalUnidades} Unidades
                </Badge>
                <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 text-sm px-3 py-1">
                  {totalObjetos} Objetos
                </Badge>
                <Badge className="bg-[#4FB3BF]/10 text-[#4FB3BF] hover:bg-[#4FB3BF]/20 text-sm px-3 py-1">
                  {totalHabilidades} Habilidades
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557] mx-auto mb-4"></div>
          <p className="text-[#64748b]">Carregando...</p>
        </div>
      ) : unidades.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1D3557]/10 to-[#457B9D]/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-[#1D3557]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhuma unidade temática encontrada</h3>
            <p className="text-[#64748b] text-center">
              Não há unidades temáticas cadastradas para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unidades.map((unidade, index) => (
            <Card 
              key={unidade.id} 
              className="border-0 shadow-md card-glass hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-[#0f172a]">
                      {unidade.unidade_tematica}
                    </CardTitle>
                    <p className="text-sm text-[#64748b] mt-1">
                      {unidade.disciplina} • {unidade.etapa_ensino === 'anos_iniciais' ? 'Anos Iniciais' : 'Anos Finais'}
                    </p>
                  </div>
                  <Badge 
                    className="ml-2"
                    style={{ 
                      backgroundColor: unidade.etapa_ensino === 'anos_iniciais' ? '#1D355720' : '#457B9D20',
                      color: unidade.etapa_ensino === 'anos_iniciais' ? '#1D3557' : '#457B9D'
                    }}
                  >
                    {unidade.etapa_ensino === 'anos_iniciais' ? '1º-5º' : '6º-9º'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1D3557]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#1D3557]">{unidade.objetos_count}</span>
                    </div>
                    <span className="text-sm text-[#64748b]">Objetos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#457B9D]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#457B9D]">{unidade.habilidades_count}</span>
                    </div>
                    <span className="text-sm text-[#64748b]">Habilidades</span>
                  </div>
                </div>
              </CardContent>
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