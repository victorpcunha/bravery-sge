'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Lightbulb } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'

const areaColor = 'from-primary to-secondary'
const areaBadgeColor = 'bg-primary/10 text-primary'

export default function AreasConhecimentoPage() {
  const [tipoEnsino, setTipoEnsino] = useState('medio')
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
    <PageContainer>
      <PageHeader
        title="Áreas do Conhecimento"
        description="Competências Específicas da BNCC por Área do Conhecimento"
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar>
          <Select value={tipoEnsino} onValueChange={(v) => { setTipoEnsino(v); setSelectedArea(null) }}>
            <SelectTrigger className="w-auto min-w-[200px] h-9">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" sideOffset={5}>
              <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
              <SelectItem value="medio">Ensino Médio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedArea || ''} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-auto min-w-[220px] h-9">
              <SelectValue placeholder="Selecione uma área" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" sideOffset={5}>
              {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterBar>
      </PageSection>

      {loadingAreas ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : areas.length === 0 ? (
        <Card className="border-0 shadow-sm animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhuma área encontrada</h3>
            <p className="text-muted-foreground text-center">Não há áreas do conhecimento cadastradas para o tipo de ensino selecionado.</p>
          </CardContent>
        </Card>
      ) : currentArea && (
        <Card className="border-0 shadow-sm animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${areaColor} flex items-center justify-center`}>
                  <Lightbulb className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">Competências Específicas de {currentArea.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tipoEnsino === 'fundamental' ? 'Ensino Fundamental' : 'Ensino Médio'}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm ${areaBadgeColor}`}>
                <span className="text-[15px] font-bold tabular-nums">{currentArea.competencias_count}</span>
                <span className="text-xs font-medium opacity-80">competências</span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCompetencias ? (
              <div className="text-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div></div>
            ) : competencias.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhuma competência cadastrada.</p>
            ) : (
              <div className="space-y-4">
                {competencias.map((comp) => (
                  <div key={comp.id} className="p-5 rounded-xl border border-border/50 bg-card/50 hover:bg-muted/50 transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${areaColor} flex items-center justify-center`}>
                        <span className="text-sm font-bold text-primary-foreground">{comp.codigo}</span>
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

      <div className="mt-8 p-5 bg-muted/50 rounded-2xl border border-border">
        <p className="text-sm text-muted-foreground">Fonte: Base Nacional Comum Curricular (BNCC) - 2018</p>
      </div>
    </PageContainer>
  )
}
