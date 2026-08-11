'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { BookOpen, Plus, ChevronDown, ChevronRight, Layers, Box } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { SearchInput } from '@/components/layout/search-input'

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
  const [disciplina, setDisciplina] = useState('')
  const [etapa, setEtapa] = useState('')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [objetos, setObjetos] = useState<ObjetoConhecimento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedUnidade, setExpandedUnidade] = useState<string | null>(null)

  useEffect(() => {
    loadDisciplinas()
    loadEtapas()
  }, [])

  useEffect(() => {
    loadObjetos()
  }, [disciplina, etapa])

  async function loadDisciplinas() {
    try {
      const supabase = getSupabaseClient()
      const { data: bnccDiscs } = await supabase
        .from('bncc_unidades_tematicas')
        .select('disciplina')
        .not('disciplina', 'is', null)

      if (!bnccDiscs) { setDisciplinasList([]); return }

      const nomesBncc: string[] = [...new Set(bnccDiscs.map(d => d.disciplina))]

      if (!schoolId) {
        setDisciplinasList(nomesBncc.map(n => ({ id: n, nome: n, tipo_ensino: '' })))
        return
      }

      const { data } = await supabase
        .from('academico_disciplinas')
        .select('id, nome, tipo_ensino')
        .eq('school_id', schoolId)
        .eq('ativo', true)
        .in('nome', nomesBncc)
        .order('nome')

      if (data && data.length > 0) {
        setDisciplinasList(data as Disciplina[])
      } else {
        setDisciplinasList(nomesBncc.map(n => ({ id: n, nome: n, tipo_ensino: '' })))
      }
    } catch (err) {
      console.error(err)
      setDisciplinasList([])
    }
  }

  async function loadEtapas() {
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('bncc_habilidades')
        .select('anos')

      const anosSet = new Set<string>()
      data?.forEach((h: any) => {
        (h.anos || []).forEach((a: string) => anosSet.add(a))
      })

      const sorted = [...anosSet].sort((a, b) => {
        const na = parseInt(a)
        const nb = parseInt(b)
        return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb)
      })

      setEtapasList(sorted.map(ano => ({
        id: ano,
        etapa_nome: `${ano} Ano`,
        etapa_tipo: 'fundamental',
        etapa_codigo: parseInt(ano) || 0,
      })))
    } catch (err) {
      console.error(err)
      setEtapasList([])
    }
  }

  async function loadObjetos() {
    if (!disciplina || !etapa) {
      setObjetos([])
      setLoading(false)
      return
    }
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
        
        filtered = filtered.filter(o => o.unidade_tematica?.disciplina === disciplina)
        
        const objetosComContagem = await Promise.all(
          filtered.map(async (obj) => {
            const { count } = await supabase
              .from('bncc_habilidades')
              .select('*', { count: 'exact', head: true })
              .eq('objeto_conhecimento_id', obj.id)
            
            let habilidadesCount = count || 0
            
            if (habilidadesCount > 0) {
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
        
        const finalFiltered = objetosComContagem.filter(o => o.habilidades_count > 0)
        
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
  const totalUnidades = Object.keys(groupedByUnidade).length

  return (
    <PageContainer>
      <PageHeader
        title="Objetos de Conhecimento"
        description="Objetos de Conhecimento do Ensino Fundamental e Médio conforme BNCC"
        actions={
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Novo Objeto
          </Button>
        }
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Selecione uma disciplina" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" sideOffset={5}>
              {disciplinasList.map(d => (
                <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={etapa} onValueChange={setEtapa}>
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Selecione uma Etapa de Ensino" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" sideOffset={5}>
              {etapasList.map(e => (
                <SelectItem key={e.id} value={e.etapa_nome}>{e.etapa_nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar objeto de conhecimento..."
          />
        </FilterBar>
      </PageSection>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Layers}
          value={totalUnidades}
          label="Unidades Temáticas"
          variant="success"
        />
        <StatCard
          icon={Box}
          value={totalObjetos}
          label="Objetos de Conhecimento"
          variant="warning"
        />
        <StatCard
          icon={BookOpen}
          value={totalHabilidades}
          label="Habilidades Cadastradas"
          variant="default"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : objetos.length === 0 ? (
        <Card className="border-0 shadow-sm animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            {!disciplina || !etapa ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione os filtros</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>disciplina</strong> e uma <strong>etapa de ensino</strong> para visualizar os objetos de conhecimento.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum objeto de conhecimento encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Não há objetos de conhecimento cadastrados para os filtros selecionados.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByUnidade).map(([unidade, data], index) => (
            <Card 
              key={unidade} 
              className="border-0 shadow-sm"
            >
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 bg-muted/30"
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
                      className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-200"
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

      <div className="mt-8 p-5 bg-muted/50 rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">
          Fonte: Base Nacional Comum Curricular (BNCC) - 2018
        </p>
      </div>
    </PageContainer>
  )
}