'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/ui/stat-card'
import { BookOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight, Layers, CalendarRange, Box } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { SearchInput } from '@/components/layout/search-input'
import { cn } from '@/lib/utils'

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
  const { schoolId } = useAuth()
  const [disciplina, setDisciplina] = useState('')
  const [etapa, setEtapa] = useState('')
  const [disciplinasList, setDisciplinasList] = useState<Disciplina[]>([])
  const [etapasList, setEtapasList] = useState<EtapaEnsino[]>([])
  const [habilidades, setHabilidades] = useState<Habilidade[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedObjeto, setExpandedObjeto] = useState<string | null>(null)
  const [expandedUnidade, setExpandedUnidade] = useState<string | null>(null)

  useEffect(() => {
    loadDisciplinas()
    loadEtapas()
  }, [])

  useEffect(() => {
    loadHabilidades()
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

  async function loadHabilidades() {
    if (!disciplina || !etapa) {
      setHabilidades([])
      setLoading(false)
      return
    }
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

      if (disciplina) {
        q = q.eq('objeto_conhecimento.unidade_tematica.disciplina', disciplina)
      }

      const { data, error } = await q

      if (error || !data) {
        console.error('Habilidades error:', error)
        setHabilidades([])
      } else {
        const habilidadesData = data as unknown as Habilidade[]
        
        let filtered = habilidadesData
        if (etapa) {
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
  const totalObjetos = Object.values(groupedByUnidade).reduce(
    (acc, objetos) => acc + Object.keys(objetos).length,
    0
  )

  return (
    <PageContainer>
      <PageHeader
        title="Habilidades"
        description="Habilidades do Ensino Fundamental conforme BNCC"
        actions={
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Nova Habilidade
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
            placeholder="Buscar por código ou descrição..."
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
      ) : habilidades.length === 0 ? (
        <Card className="border-0 shadow-sm animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            {!disciplina || !etapa ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecione os filtros</h3>
                <p className="text-muted-foreground text-center">
                  Escolha uma <strong>disciplina</strong> e uma <strong>etapa de ensino</strong> para visualizar as habilidades.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma habilidade encontrada</h3>
                <p className="text-muted-foreground text-center">
                  Não há habilidades cadastradas para os filtros selecionados.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedByUnidade).map(([unidade, objetos]) => {
            const totalHabilidadesUnidade = Object.values(objetos).flat().length
            const unidadeIsOpen = expandedUnidade === unidade
            return (
              <Card key={unidade} className="border-0 shadow-sm overflow-hidden">
                <CardHeader
                  className="bg-muted/30 border-b border-border cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setExpandedUnidade(unidadeIsOpen ? null : unidade)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg font-semibold text-foreground">{unidade}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {Object.keys(objetos).length} Objeto(s) de Conhecimento
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 shadow-sm">
                        <span className="text-[15px] font-bold text-primary-foreground tabular-nums">{totalHabilidadesUnidade}</span>
                        <span className="text-xs font-medium text-primary-foreground/80">habilidades</span>
                      </span>
                      <span className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                        unidadeIsOpen
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {unidadeIsOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {unidadeIsOpen && (
                  <CardContent className="pt-3 space-y-2">
                  {Object.entries(objetos).map(([objeto, habilidadesObj]) => {
                    const objetoKey = `${unidade}|${objeto}`
                    const isOpen = expandedObjeto === objetoKey
                    return (
                      <div key={objeto} className="border border-border rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedObjeto(isOpen ? null : objetoKey)}
                          className="w-full flex items-center justify-between gap-4 px-4 py-3 bg-card hover:bg-muted/50 transition-all duration-200 text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={cn(
                              'w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors',
                              isOpen
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            )}>
                              {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </span>
                            <span className="font-medium text-foreground text-[15px]">{objeto}</span>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs bg-card">
                            {habilidadesObj.length} habilidade{habilidadesObj.length === 1 ? '' : 's'}
                          </Badge>
                        </button>

                        {isOpen && (
                          <div className="pl-4 sm:pl-6 bg-muted/20 border-t border-border/50">
                            <div className="py-3 pr-4 space-y-2.5">
                              {habilidadesObj.map(h => (
                                <div key={h.id} className="p-3.5 rounded-lg border border-border/50 bg-card hover:bg-muted/40 transition-all duration-200">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1">
                                      <Badge className="shrink-0 font-mono text-xs bg-primary text-primary-foreground border-0 shadow-sm mt-0.5">
                                        {h.codigo_bncc}
                                      </Badge>
                                      <div className="flex-1">
                                        <p className="text-sm text-foreground leading-relaxed">{h.descricao}</p>
                                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                          <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground mr-0.5">
                                            <CalendarRange className="h-3 w-3" />
                                            Etapas:
                                          </span>
                                          {h.anos?.map((ano, i) => (
                                            <span key={i} className="inline-flex items-center justify-center min-w-[26px] h-[22px] px-1.5 rounded-md bg-secondary/10 text-secondary text-xs font-semibold border border-secondary/20">
                                              {ano}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
                )}
              </Card>
            )
          })}
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