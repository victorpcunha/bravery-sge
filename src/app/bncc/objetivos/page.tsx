'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type BNCCObjetivo = {
  id: string
  tipo_ensino: string
  etapa: string
  faixa_etaria: string
  campo_experiencia: string
  codigo_bncc: string
  descricao: string
}

const etapas = [
  { value: 'creche', label: 'Creche (0-3 anos)' },
  { value: 'pre-escola', label: 'Pré-escola (4-5 anos)' }
]

const camposExperiencia = [
  'Corpo, Gestos e Movimento',
  'Escuta, Fala, Pensamento e Imaginação',
  'Espaços, tempos, quantidades, relações e transformações',
  'O eu, o outro e o nós',
  'Traços, Sons, Cores e Formas'
]

export default function ObjetivosPage() {
  const [etapa, setEtapa] = useState('creche')
  const [campoExperiencia, setCampoExperiencia] = useState('all')
  const [objetivos, setObjetivos] = useState<BNCCObjetivo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadObjectives()
  }, [etapa, campoExperiencia])

  async function loadObjectives() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('bncc_objetivos')
        .select('*')
        .eq('tipo_ensino', 'infantil')
        .eq('etapa', etapa)

      const { data, error } = await query

      if (error || !data) {
        setObjetivos([])
      } else {
        setObjetivos(data)
      }
    } catch (err) {
      setObjetivos([])
    }
    setLoading(false)
  }

  const filteredObjetivos = objetivos.filter(obj => {
    const matchesCampo = campoExperiencia === 'all' || obj.campo_experiencia === campoExperiencia
    const matchesSearch = searchTerm === '' || 
      obj.codigo_bncc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCampo && matchesSearch
  })

  const groupedByCampo = filteredObjetivos.reduce((acc, obj) => {
    if (!acc[obj.campo_experiencia]) {
      acc[obj.campo_experiencia] = []
    }
    acc[obj.campo_experiencia].push(obj)
    return acc
  }, {} as Record<string, BNCCObjetivo[]>)

  return (
    <div className="container mx-auto py-8 px-4 md:pl-64">
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0f172a]">Objetivos de Aprendizagem e Desenvolvimento</h1>
            <p className="text-[#64748b] mt-1">
              Habilidades e competências do Ensino Infantil conforme BNCC
            </p>
          </div>
          <Button className="bg-[#1D3557] hover:bg-[#457B9D]">
            <Plus className="w-4 h-4 mr-2" />
            Novo Objetivo
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-[#334155]">Etapa de Ensino</label>
              <Select value={etapa} onValueChange={setEtapa}>
                <SelectTrigger className="bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {etapas.map(e => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-[#334155]">Campo de Experiência</label>
              <Select value={campoExperiencia} onValueChange={setCampoExperiencia}>
                <SelectTrigger className="bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Campos</SelectItem>
                  {camposExperiencia.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
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

      {/* Totais */}
      <div className="flex gap-4 mb-6">
        <Badge className="bg-[#1D3557]/10 text-[#1D3557] hover:bg-[#1D3557]/20 text-lg px-4 py-2">
          {filteredObjetivos.length} Objetivos cadastrados
        </Badge>
        {campoExperiencia === 'all' && (
          <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 text-lg px-4 py-2">
            {Object.keys(groupedByCampo).length} Campos de Experiência
          </Badge>
        )}
      </div>

      {/* Lista por Campo de Experiência */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557] mx-auto mb-4"></div>
          <p className="text-[#64748b]">Carregando...</p>
        </div>
      ) : filteredObjetivos.length === 0 ? (
        <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1D3557]/10 to-[#457B9D]/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-[#1D3557]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhum objetivo encontrado</h3>
            <p className="text-[#64748b] text-center">
              Não há objetivos de aprendizagem cadastrados para os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCampo).map(([campo, objetivosDoCampo], index) => (
            <Card 
              key={campo} 
              className="border-0 shadow-md card-glass animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="bg-[#f8fafc]/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#0f172a]">{campo}</CardTitle>
                  <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 border-0">
                    {objetivosDoCampo.length} objetivos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {objetivosDoCampo.map(obj => (
                  <div 
                    key={obj.id}
                    className="p-4 rounded-xl border border-[#e2e8f0]/50 bg-white/50 hover:bg-[#f8fafc]/80 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Badge className="shrink-0 font-mono text-xs bg-gradient-to-r from-[#1D3557] to-[#457B9D] text-white border-0">
                          {obj.codigo_bncc}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-[#334155] leading-relaxed">{obj.descricao}</p>
                          <p className="text-xs text-[#64748b] mt-2">
                            {obj.faixa_etaria}
                          </p>
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