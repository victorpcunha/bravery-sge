'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'

const areaColors: Record<string, string> = {
  'Linguagens e suas tecnologias': 'from-primary to-secondary',
  'Matemática e suas tecnologias': 'from-success to-success/80',
  'Ciências da Natureza e suas tecnologias': 'from-info to-info/80',
  'Ciências Humanas e Sociais Aplicadas': 'from-warning to-warning/80',
  'Computação': 'from-ring to-ring/80',
}

const AREA_LINGUAGENS = 'Linguagens e suas tecnologias'

const camposAtuacao = [
  { value: 'vida_pessoal', label: 'Vida Pessoal' },
  { value: 'vida_publica', label: 'Vida Pública' },
  { value: 'praticas_estudo', label: 'Práticas de Estudo e Pesquisa' },
  { value: 'jornalistico_midiatico', label: 'Jornalístico-Midiático' },
  { value: 'artistico_literario', label: 'Artístico-Literário' },
]

const campoColors: Record<string, string> = {
  vida_pessoal: 'from-primary to-secondary',
  vida_publica: 'from-warning to-warning/80',
  praticas_estudo: 'from-success to-success/80',
  jornalistico_midiatico: 'from-info to-info/80',
  artistico_literario: 'from-destructive to-destructive/80',
}

export default function CompetenciasHabilidadesPage() {
  const [areas, setAreas] = useState<any[]>([])
  const [selectedArea, setSelectedArea] = useState('')
  const [componente, setComponente] = useState('geral')
  const [competencias, setCompetencias] = useState<any[]>([])
  const [habilidades, setHabilidades] = useState<any[]>([])
  const [loadingAreas, setLoadingAreas] = useState(true)
  const [loading, setLoading] = useState(false)
  const [expandedCampo, setExpandedCampo] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  useEffect(() => { loadAreas() }, [])
  useEffect(() => { if (selectedArea) { loadCompetencias(selectedArea); setComponente('geral'); setHabilidades([]) } }, [selectedArea])

  useEffect(() => {
    if (selectedArea && componente === 'lingua_portuguesa') loadLP()
    else if (selectedArea && componente === 'geral') loadGerais()
  }, [selectedArea, componente])

  async function loadAreas() {
    setLoadingAreas(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_areas_conhecimento').select('id, nome, tipo_ensino').eq('tipo_ensino', 'medio').order('nome')
      setAreas(data || [])
    } catch { setAreas([]) }
    setLoadingAreas(false)
  }

  async function loadCompetencias(areaId: string) {
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_competencias').select('*').eq('area_id', areaId).order('codigo')
      setCompetencias(data || [])
    } catch { setCompetencias([]) }
  }

  async function loadGerais() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_habilidades_medio').select('codigo, descricao, competencia_codigo').eq('area_id', selectedArea).eq('componente', 'geral').order('competencia_codigo').order('codigo')
      setHabilidades(data || [])
    } catch { setHabilidades([]) }
    setLoading(false)
  }

  async function loadLP() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_habilidades_medio').select('codigo, descricao, competencia_codigo').eq('componente', 'lingua_portuguesa').eq('area_id', selectedArea).order('competencia_codigo').order('codigo')
      setHabilidades(data || [])
    } catch { setHabilidades([]) }
    setLoading(false)
  }

  const currentArea = areas.find((a: any) => a.id === selectedArea)
  const showComponente = currentArea?.nome === AREA_LINGUAGENS
  const isLp = componente === 'lingua_portuguesa'

  const habilidadesPorCampo = isLp ? camposAtuacao.map(campo => {
    const doCampo = habilidades.filter((h: any) => {
      const num = Number(h.codigo.replace('EM13LP', ''))
      if (num <= 18) return true
      if (num >= 19 && num <= 22) return campo.value === 'vida_pessoal'
      if (num >= 23 && num <= 27) return campo.value === 'vida_publica'
      if (num >= 28 && num <= 35) return campo.value === 'praticas_estudo'
      if (num >= 36 && num <= 45) return campo.value === 'jornalistico_midiatico'
      if (num >= 46 && num <= 54) return campo.value === 'artistico_literario'
      return false
    })
    const grouped = doCampo.reduce((acc: any, h: any) => {
      if (!acc[h.competencia_codigo]) acc[h.competencia_codigo] = []
      acc[h.competencia_codigo].push(h)
      return acc
    }, {})
    return { ...campo, habilidades: doCampo, grouped }
  }).filter(c => c.habilidades.length > 0) : []

  const habilidadesPorComp = !isLp ? habilidades.reduce((acc: any, h: any) => {
    if (!acc[h.competencia_codigo]) {
      const comp = competencias.find((c: any) => c.codigo === h.competencia_codigo)
      acc[h.competencia_codigo] = { competencia: comp || null, habilidades: [] }
    }
    acc[h.competencia_codigo].habilidades.push(h)
    return acc
  }, {}) : {}

  const totalHabilidades = habilidades.length
  const compKeys = Object.keys(habilidadesPorComp).sort((a, b) => Number(a) - Number(b))

  return (
    <PageContainer>
      <PageHeader
        title="Competências e Habilidades"
        description={`Habilidades da BNCC do Ensino Médio${isLp ? ' - Língua Portuguesa por Campo de Atuação' : ''}`}
      />

      <Card className="mb-6 border-0 shadow-sm animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tipo de Ensino</label>
              <div className="h-10 flex items-center px-3 bg-card/80 border border-border rounded-lg text-sm text-foreground font-medium">Ensino Médio</div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Área do Conhecimento</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={5}>
                  {areas.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {showComponente && (
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Componente</label>
                <Select value={componente} onValueChange={setComponente}>
                  <SelectTrigger className="border-border focus:border-primary [&_svg:not([class*='rotate'])]:rotate-0"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={5}>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="lingua_portuguesa">Língua Portuguesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedArea ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Selecione uma Área</h3>
            <p className="text-muted-foreground text-center">Escolha a Área do Conhecimento e o Componente.</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div><p className="text-muted-foreground">Carregando...</p></div>
      ) : isLp ? (
        <div className="space-y-4 animate-fade-in-up">
          <Badge className="bg-primary/10 text-primary text-sm px-4 py-2">{totalHabilidades} habilidade(s)</Badge>
          {habilidadesPorCampo.map(campo => {
            const isExp = expandedCampo === campo.value
            return (
              <Card key={campo.value} className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="cursor-pointer hover:bg-muted/30" onClick={() => setExpandedCampo(isExp ? null : campo.value)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${campoColors[campo.value] || 'from-primary to-secondary'} flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground">{campo.label}</CardTitle>
                        <p className="text-sm text-muted-foreground">{campo.habilidades.length} habilidade(s)</p>
                      </div>
                    </div>
                    {isExp ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </CardHeader>
                {isExp && (
                  <CardContent className="pt-0 space-y-4">
                    {Object.entries(campo.grouped).sort(([a]: any, [b]: any) => Number(a) - Number(b)).map(([compCodigo, habs]: any) => {
                      const cExp = expandedCard === `lp-${campo.value}-${compCodigo}`
                      return (
                        <div key={compCodigo} className="border border-border rounded-xl overflow-hidden">
                          <div className="cursor-pointer hover:bg-muted/30 p-4 bg-card/50 flex items-center justify-between"
                            onClick={() => setExpandedCard(cExp ? null : `lp-${campo.value}-${compCodigo}`)}>
                            <span className="font-medium text-foreground text-sm">Competência {compCodigo}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{(habs as any[]).length}</Badge>
                              {cExp ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </div>
                          </div>
                          {cExp && (
                            <div className="p-4 space-y-3 bg-muted/20">
                              {(habs as any[]).map((hab: any, i: number) => (
                                <div key={hab.codigo + i} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50">
                                  <div className="flex items-start gap-3">
                                    <Badge className="shrink-0 font-mono text-xs bg-primary text-primary-foreground border-0 mt-0.5">{hab.codigo}</Badge>
                                    <p className="text-sm text-foreground leading-relaxed">{hab.descricao}</p>
                                  </div>
                                </div>
                              ))}
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
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <Badge className="bg-primary/10 text-primary text-sm px-4 py-2">{totalHabilidades} habilidade(s)</Badge>
          {compKeys.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-8"><p className="text-muted-foreground">Nenhuma habilidade encontrada.</p></CardContent>
            </Card>
          ) : (
            compKeys.map(compCodigo => {
              const item = habilidadesPorComp[compCodigo]
              const comp = item.competencia
              const isExp = expandedCard === `comp-${compCodigo}`
              return (
                <Card key={compCodigo} className="border-0 shadow-sm overflow-hidden">
                  <CardHeader className="cursor-pointer hover:bg-muted/30" onClick={() => setExpandedCard(isExp ? null : `comp-${compCodigo}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${areaColors[currentArea?.nome || ''] || 'from-primary to-secondary'} flex items-center justify-center`}>
                          <Lightbulb className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">Competência Específica {compCodigo}</CardTitle>
                          <p className="text-sm text-muted-foreground">{item.habilidades.length} habilidade(s)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.habilidades.length} habilidade(s)</Badge>
                        {isExp ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                      </div>
                    </div>
                  </CardHeader>
                  {isExp && (
                    <CardContent className="pt-0 space-y-4">
                      {comp && (
                        <p className="text-sm text-foreground leading-relaxed italic border-l-4 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r-lg">{comp.descricao}</p>
                      )}
                      <div className="space-y-3">
                        {item.habilidades.map((hab: any, i: number) => (
                          <div key={hab.codigo + i} className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50">
                            <div className="flex items-start gap-3">
                              <Badge className="shrink-0 font-mono text-xs bg-primary text-primary-foreground border-0 mt-0.5">{hab.codigo}</Badge>
                              <p className="text-sm text-foreground leading-relaxed">{hab.descricao}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })
          )}
        </div>
      )}

      <div className="mt-8 p-5 bg-muted/50 rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">Fonte: Base Nacional Comum Curricular (BNCC) - 2018</p>
      </div>
    </PageContainer>
  )
}
