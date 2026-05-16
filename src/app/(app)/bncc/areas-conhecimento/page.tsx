'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lightbulb } from 'lucide-react'

const areaColors: Record<string, string> = {
  'Linguagens': 'from-primary to-secondary',
  'Linguagens e suas tecnologias': 'from-primary to-secondary',
  'Matemática': 'from-success to-success/80',
  'Matemática e suas tecnologias': 'from-success to-success/80',
  'Ciências da Natureza': 'from-info to-info/80',
  'Ciências da Natureza e suas tecnologias': 'from-info to-info/80',
  'Ciências Humanas': 'from-warning to-warning/80',
  'Ciências Humanas e Sociais Aplicadas': 'from-warning to-warning/80',
  'Ensino Religioso': 'from-destructive to-destructive/80',
  'Computação': 'from-ring to-ring/80',
}

const areaBadgeColors: Record<string, string> = {
  'Linguagens': 'bg-primary/10 text-primary',
  'Linguagens e suas tecnologias': 'bg-primary/10 text-primary',
  'Matemática': 'bg-success/10 text-success',
  'Matemática e suas tecnologias': 'bg-success/10 text-success',
  'Ciências da Natureza': 'bg-info/10 text-info',
  'Ciências da Natureza e suas tecnologias': 'bg-info/10 text-info',
  'Ciências Humanas': 'bg-warning/10 text-warning',
  'Ciências Humanas e Sociais Aplicadas': 'bg-warning/10 text-warning',
  'Ensino Religioso': 'bg-destructive/10 text-destructive',
  'Computação': 'bg-ring/10 text-ring',
}

export default function AreasConhecimentoPage() {
  const [tipoEnsino, setTipoEnsino] = useState('fundamental')
  const [areas, setAreas] = useState<any[]>([])
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [competencias, setCompetencias] = useState<any[]>([])
  const [loadingAreas, setLoadingAreas] = useState(true)
  const [loadingCompetencias, setLoadingCompetencias] = useState(false)

  useEffect(() => { loadAreas() }, [tipoEnsino])
  useEffect(() => { if (selectedArea) loadCompetencias(selectedArea) }, [selectedArea])

  async function loadAreas() {
    setLoadingAreas(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_areas_conhecimento').select('id, nome, tipo_ensino, descricao').eq('tipo_ensino', tipoEnsino).order('nome')
      if (data) {
        const withCount = await Promise.all(data.map(async (a) => {
          const { count } = await supabase.from('bncc_competencias').select('*', { count: 'exact', head: true }).eq('area_id', a.id)
          return { ...a, competencias_count: count || 0 }
        }))
        setAreas(withCount)
        if (withCount.length > 0) setSelectedArea(withCount[0].id)
      }
    } catch { setAreas([]) }
    setLoadingAreas(false)
  }

  async function loadCompetencias(areaId: string) {
    setLoadingCompetencias(true)
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase.from('bncc_competencias').select('*').eq('area_id', areaId).order('codigo')
      setCompetencias(data || [])
    } catch { setCompetencias([]) }
    setLoadingCompetencias(false)
  }

  const currentArea = areas.find(a => a.id === selectedArea)

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-foreground">Áreas do Conhecimento</h1>
        <p className="text-muted-foreground mt-1">Competências Específicas da BNCC por Área do Conhecimento</p>
      </div>

      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Tipo de Ensino</label>
              <Select value={tipoEnsino} onValueChange={(v) => { setTipoEnsino(v); setSelectedArea(null) }}>
                <SelectTrigger className="bg-card/80 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">Área do Conhecimento</label>
              <Select value={selectedArea || ''} onValueChange={setSelectedArea}>
                <SelectTrigger className="bg-card/80 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              {currentArea && (
                <Badge className={`${areaBadgeColors[currentArea.nome] || 'bg-primary/10 text-primary'} text-sm px-3 py-1`}>
                  {currentArea.competencias_count} competências
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {loadingAreas ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : areas.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma área encontrada</h3>
            <p className="text-muted-foreground text-center">Não há áreas do conhecimento cadastradas para o tipo de ensino selecionado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area, index) => (
              <Card key={area.id} className={`border-0 shadow-md card-glass hover:shadow-lg transition-all duration-300 animate-fade-in-up cursor-pointer ${selectedArea === area.id ? 'ring-2 ring-primary' : ''}`}
                style={{ animationDelay: `${index * 75}ms` }} onClick={() => setSelectedArea(area.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${areaColors[area.nome] || 'from-primary to-secondary'} flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground">{area.nome}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{area.competencias_count} competências</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {currentArea && (
            <Card className="border-0 shadow-md card-glass animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${areaColors[currentArea.nome] || 'from-primary to-secondary'} flex items-center justify-center`}>
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground">Competências Específicas de {currentArea.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{tipoEnsino === 'fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'}</p>
                    </div>
                  </div>
                  <Badge className={`${areaBadgeColors[currentArea.nome] || 'bg-primary/10 text-primary'} text-sm px-3 py-1`}>{currentArea.competencias_count} competências</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loadingCompetencias ? (
                  <div className="text-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div></div>
                ) : competencias.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhuma competência cadastrada.</p>
                ) : (
                  <div className="space-y-4">
                    {competencias.map((comp, index) => (
                      <div key={comp.id} className="p-5 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex items-start gap-4">
                          <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${areaColors[currentArea.nome] || 'from-primary to-secondary'} flex items-center justify-center`}>
                            <span className="text-sm font-bold text-white">{comp.codigo}</span>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm text-foreground leading-relaxed">{comp.descricao}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="mt-8 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up delay-300">
        <p className="text-sm text-muted-foreground">Fonte: Base Nacional Comum Curricular (BNCC) - 2018</p>
      </div>
    </div>
  )
}
