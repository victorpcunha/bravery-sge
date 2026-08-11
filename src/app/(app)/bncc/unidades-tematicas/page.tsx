'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { BookOpen, Plus, Layers, Box } from 'lucide-react'
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

type UnidadeTematica = {
  id: string
  unidade_tematica: string
  disciplina: string
  etapa_ensino: string
  objetos_count: number
  habilidades_count: number
}

export default function UnidadesTematicasPage() {
  const { schoolId } = useAuth()
  const [disciplina, setDisciplina] = useState('')
  const [etapa, setEtapa] = useState('')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [unidades, setUnidades] = useState<UnidadeTematica[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDisciplinas()
    loadEtapas()
  }, [])

  useEffect(() => {
    loadUnidades()
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

  async function loadUnidades() {
    if (!disciplina || !etapa) {
      setUnidades([])
      setLoading(false)
      return
    }
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
        
        filtered = filtered.filter(u => u.disciplina === disciplina)
        
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
              
              const anoNormalizado = etapa.replace(/ Ano$/, '')
              habilidadesCount = habilidadesData?.filter((h: { anos: string[] }) => 
                h.anos?.some((a: string) => a.includes(anoNormalizado))
              ).length || 0
            }
            
            const filteredObjCount = objetosIds.length
            
            return {
              ...unidade,
              objetos_count: filteredObjCount,
              habilidades_count: habilidadesCount
            }
          })
        )
        
        const finalFiltered = unidadesComContagem.filter(u => u.habilidades_count > 0)
        
        setUnidades(finalFiltered)
      }
    } catch (err) {
      setUnidades([])
    }
    setLoading(false)
  }

  const filteredUnidades = unidades.filter(u => {
    const matchesSearch = searchTerm === '' ||
      u.unidade_tematica.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalUnidades = filteredUnidades.length
  const totalObjetos = filteredUnidades.reduce((acc, u) => acc + u.objetos_count, 0)
  const totalHabilidades = filteredUnidades.reduce((acc, u) => acc + u.habilidades_count, 0)

  return (
    <PageContainer>
      <PageHeader
        title="Unidades Temáticas e Práticas de Linguagem"
        description="Unidades Temáticas do Ensino Fundamental e Médio conforme BNCC"
        actions={
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Unidade
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
            placeholder="Buscar unidade temática..."
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
      ) : unidades.length === 0 ? (
        <Card className="border-0 shadow-sm animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            {!disciplina || !etapa ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione os filtros</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>disciplina</strong> e uma <strong>etapa de ensino</strong> para visualizar as unidades temáticas.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma unidade temática encontrada</h3>
                <p className="text-muted-foreground text-center">
                  Não há unidades temáticas cadastradas para os filtros selecionados.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUnidades.map((unidade, index) => (
            <Card 
              key={unidade.id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {unidade.unidade_tematica}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {unidade.disciplina} • {unidade.etapa_ensino === 'anos_iniciais' ? 'Anos Iniciais' : 'Anos Finais'}
                    </p>
                  </div>
                  <Badge 
                    className="ml-2"
                    style={{ 
                      backgroundColor: unidade.etapa_ensino === 'anos_iniciais' ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'color-mix(in srgb, var(--secondary) 12%, transparent)',
                      color: unidade.etapa_ensino === 'anos_iniciais' ? 'var(--primary)' : 'var(--secondary)'
                    }}
                  >
                    {unidade.etapa_ensino === 'anos_iniciais' ? '1º-5º' : '6º-9º'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{unidade.objetos_count}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Objetos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-secondary">{unidade.habilidades_count}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Habilidades</span>
                  </div>
                </div>
              </CardContent>
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