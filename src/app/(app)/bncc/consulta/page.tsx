'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
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

const camposExperiencia = [
  'Corpo, Gestos e Movimento',
  'Escuta, Fala, Pensamento e Imaginação',
  'Espaços, tempos, quantidades, relações e transformações',
  'O eu, o outro e o nós',
  'Traços, Sons, Cores e Formas'
]

const etapas = [
  { value: 'creche', label: 'Creche (0-3 anos)' },
  { value: 'pre-escola', label: 'Pré-escola (4-5 anos)' },
  { value: 'fundamental', label: 'Ensino Fundamental' },
  { value: 'medio', label: 'Ensino Médio' }
]

const faixasEtarias: Record<string, string[]> = {
  'creche': ['Bebês (zero a 1 ano e 6 meses)', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)'],
  'pre-escola': ['Crianças pequenas (4 anos a 5 anos e 11 meses)']
}

// Mock data quando não houver banco
const mockDados: BNCCObjetivo[] = [
  { id: '1', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG01', descricao: 'Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.' },
  { id: '2', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Corpo, Gestos e Movimento', codigo_bncc: 'EI01CG02', descricao: 'Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.' },
  { id: '3', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF01', descricao: 'Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.' },
  { id: '4', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Escuta, Fala, Pensamento e Imaginação', codigo_bncc: 'EI01EF02', descricao: 'Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.' },
  { id: '5', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Espaços, tempos, quantidades, relações e transformações', codigo_bncc: 'EI01ET01', descricao: 'Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura).' },
  { id: '6', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'O eu, o outro e o nós', codigo_bncc: 'EI01EO01', descricao: 'Perceber que suas ações têm efeitos nas outras crianças e nos adultos.' },
  { id: '7', tipo_ensino: 'infantil', etapa: 'creche', faixa_etaria: 'Bebês (zero a 1 ano e 6 meses)', campo_experiencia: 'Traços, Sons, Cores e Formas', codigo_bncc: 'EI01TS01', descricao: 'Explorar sons produzidos com o próprio corpo e com objetos do ambiente.' },
]

export default function BNCCConsultaPage() {
  const [etapa, setEtapa] = useState('creche')
  const [faixaEtaria, setFaixaEtaria] = useState('')
  const [objetivos, setObjetivos] = useState<BNCCObjetivo[]>([])
  const [expandedCampo, setExpandedCampo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadObjectives()
  }, [etapa, faixaEtaria])

  useEffect(() => {
    // Set default faixa etária based on etapa
    if (etapa === 'creche' && !faixaEtaria) {
      setFaixaEtaria('Bebês (zero a 1 ano e 6 meses)')
    } else if (etapa === 'pre-escola' && !faixaEtaria) {
      setFaixaEtaria('Crianças pequenas (4 anos a 5 anos e 11 meses)')
    }
  }, [etapa])

  async function loadObjectives() {
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      let query = supabase
        .from('bncc_objetivos')
        .select('*')
        .eq('tipo_ensino', 'infantil')
        .eq('etapa', etapa)

      if (faixaEtaria) {
        query = query.eq('faixa_etaria', faixaEtaria)
      }

      const { data, error } = await query

      if (error || !data || data.length === 0) {
        // Fallback to mock
        const filtered = mockDados.filter(obj => 
          obj.etapa === etapa && 
          (!faixaEtaria || obj.faixa_etaria === faixaEtaria)
        )
        setObjetivos(filtered)
      } else {
        setObjetivos(data)
      }
    } catch (err) {
      // Use mock on error
      const filtered = mockDados.filter(obj => 
        obj.etapa === etapa && 
        (!faixaEtaria || obj.faixa_etaria === faixaEtaria)
      )
      setObjetivos(filtered)
    }
    setLoading(false)
  }

  // Group by Campo de Experiência
  const groupedByCampo = objetivos.reduce((acc, obj) => {
    if (!acc[obj.campo_experiencia]) {
      acc[obj.campo_experiencia] = []
    }
    acc[obj.campo_experiencia].push(obj)
    return acc
  }, {} as Record<string, BNCCObjetivo[]>)

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:pl-64">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[#0f172a]">Consulta da BNCC</h1>
          <p className="text-[#64748b] mt-1">
            Base Nacional Comum Curricular - Objetivos de Aprendizagem
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6 border-0 shadow-md card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {(etapa === 'creche' || etapa === 'pre-escola') && (
                <div>
                  <label className="text-sm font-medium mb-2 block text-[#334155]">Faixa Etária</label>
                  <Select value={faixaEtaria} onValueChange={setFaixaEtaria}>
                    <SelectTrigger className="bg-white/80 border-[#e2e8f0] focus:border-[#1D3557] focus:ring-[#1D3557]/20">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {faixasEtarias[etapa]?.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block text-[#334155]">Total de Objetivos</label>
                <div className="h-10 flex items-center">
                  <Badge className="bg-[#1D3557]/10 text-[#1D3557] hover:bg-[#1D3557]/20 text-lg px-3 py-1">
                    {objetivos.length} objetivos
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados - Agrupados por Campo de Experiência */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D3557] mx-auto mb-4"></div>
            <p className="text-[#64748b]">Carregando...</p>
          </div>
        ) : objetivos.length === 0 ? (
          <Card className="border-0 shadow-lg card-glass animate-fade-in-up delay-150">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1D3557]/10 to-[#457B9D]/10 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="h-10 w-10 text-[#1D3557]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">Nenhum resultado encontrado</h3>
              <p className="text-[#64748b] text-center">
                Selecione outros filtros ou etapa de ensino.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {camposExperiencia.map((campo, index) => {
              if (!groupedByCampo[campo] || groupedByCampo[campo].length === 0) return null
              
              const isExpanded = expandedCampo === campo
              const objetivosDoCampo = groupedByCampo[campo]
              
              return (
                <Card key={campo} className="border-0 shadow-md card-glass animate-fade-in-up" style={{ animationDelay: `${index * 75 + 150}ms` }}>
                  <CardHeader 
                    className="cursor-pointer hover:bg-[#f8fafc]/80 transition-all duration-200"
                    onClick={() => setExpandedCampo(isExpanded ? null : campo)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-[#0f172a]">{campo}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#457B9D]/10 text-[#457B9D] hover:bg-[#457B9D]/20 border-0">{objetivosDoCampo.length}</Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-[#64748b]" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-[#64748b]" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="space-y-3">
                      {objetivosDoCampo.map(obj => (
                        <div 
                          key={obj.id}
                          className="p-4 rounded-xl border border-[#e2e8f0]/50 bg-white/50 hover:bg-[#f8fafc]/80 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <Badge className="shrink-0 font-mono text-xs bg-gradient-to-r from-[#1D3557] to-[#457B9D] text-white border-0">
                              {obj.codigo_bncc}
                            </Badge>
                            <p className="text-sm text-[#334155] leading-relaxed">{obj.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-8 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#e2e8f0]/50 shadow-sm animate-fade-in-up delay-300">
          <p className="text-sm text-[#64748b]">
            Fonte: Base Nacional Comum Curricular (BNCC) - 2018
          </p>
        </div>
      </div>
    </>
  )
}