'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react'

interface TabEtapasProps {
  schoolId: string
}

interface Etapa {
  codigo: number
  nome: string
  tipo: string
  aceitaSubetapa: boolean
}

interface GrupoEtapas {
  titulo: string
  etapas: Etapa[]
}

const gruposEtapas: GrupoEtapas[] = [
  {
    titulo: 'Educação Infantil',
    etapas: [
      { codigo: 1, nome: 'Creche (0 a 3 anos)', tipo: 'infantil', aceitaSubetapa: true },
      { codigo: 2, nome: 'Pré-escola (4 e 5 anos)', tipo: 'infantil', aceitaSubetapa: true },
      { codigo: 3, nome: 'Infantil Unificada (0 a 5 anos)', tipo: 'infantil', aceitaSubetapa: true },
    ]
  },
  {
    titulo: 'Ensino Fundamental - Anos Iniciais',
    etapas: [
      { codigo: 14, nome: '1º Ano', tipo: 'fundamental_inicial', aceitaSubetapa: false },
      { codigo: 15, nome: '2º Ano', tipo: 'fundamental_inicial', aceitaSubetapa: false },
      { codigo: 16, nome: '3º Ano', tipo: 'fundamental_inicial', aceitaSubetapa: false },
      { codigo: 17, nome: '4º Ano', tipo: 'fundamental_inicial', aceitaSubetapa: false },
      { codigo: 18, nome: '5º Ano', tipo: 'fundamental_inicial', aceitaSubetapa: false },
    ]
  },
  {
    titulo: 'Ensino Fundamental - Anos Finais',
    etapas: [
      { codigo: 19, nome: '6º Ano', tipo: 'fundamental_final', aceitaSubetapa: false },
      { codigo: 20, nome: '7º Ano', tipo: 'fundamental_final', aceitaSubetapa: false },
      { codigo: 21, nome: '8º Ano', tipo: 'fundamental_final', aceitaSubetapa: false },
      { codigo: 41, nome: '9º Ano', tipo: 'fundamental_final', aceitaSubetapa: false },
    ]
  },
  {
    titulo: 'Ensino Médio',
    etapas: [
      { codigo: 25, nome: '1ª Série', tipo: 'medio', aceitaSubetapa: false },
      { codigo: 26, nome: '2ª Série', tipo: 'medio', aceitaSubetapa: false },
      { codigo: 27, nome: '3ª Série', tipo: 'medio', aceitaSubetapa: false },
      { codigo: 28, nome: '4ª Série', tipo: 'medio', aceitaSubetapa: false },
      { codigo: 29, nome: 'Não Seriada', tipo: 'medio', aceitaSubetapa: false },
    ]
  },
  {
    titulo: 'Fundamental - Outros',
    etapas: [
      { codigo: 22, nome: 'Multi', tipo: 'fundamental_outros', aceitaSubetapa: false },
      { codigo: 23, nome: 'Correção de Fluxo', tipo: 'fundamental_outros', aceitaSubetapa: false },
      { codigo: 56, nome: 'Multietapa', tipo: 'fundamental_outros', aceitaSubetapa: true },
    ]
  },
  {
    titulo: 'EJA',
    etapas: [
      { codigo: 69, nome: 'Anos Iniciais (1º segmento)', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 70, nome: 'Anos Finais (2º segmento)', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 72, nome: 'Anos Iniciais e Finais (Multietapas)', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 71, nome: 'Ensino Médio (3º segmento)', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 74, nome: 'Técnico Integrado', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 73, nome: 'FIC Integrado - Fundamental', tipo: 'eja', aceitaSubetapa: true },
      { codigo: 67, nome: 'FIC Integrado - Médio', tipo: 'eja', aceitaSubetapa: true },
    ]
  },
]

interface Subetapa {
  id: string
  nome: string
}

interface EtapaAtiva {
  [codigo: number]: boolean
}

interface SubetapasData {
  [codigo: number]: Subetapa[]
}

export function TabEtapas({ schoolId }: TabEtapasProps) {
  const [etapasAtivas, setEtapasAtivas] = useState<EtapaAtiva>({})
  const [subetapas, setSubetapas] = useState<SubetapasData>({})
  const [showSubetapaModal, setShowSubetapaModal] = useState(false)
  const [etapaSelecionada, setEtapaSelecionada] = useState<number | null>(null)
  const [novaSubetapaNome, setNovaSubetapaNome] = useState('')
  const [openGroups, setOpenGroups] = useState<string[]>(['Educação Infantil'])

  function toggleEtapa(codigo: number) {
    setEtapasAtivas(prev => ({
      ...prev,
      [codigo]: !prev[codigo]
    }))
    toast.success(etapasAtivas[codigo] ? 'Etapa desativada' : 'Etapa ativada')
  }

  function handleAddSubetapa(codigo: number) {
    setEtapaSelecionada(codigo)
    setNovaSubetapaNome('')
    setShowSubetapaModal(true)
  }

  function confirmAddSubetapa() {
    if (!novaSubetapaNome.trim() || etapaSelecionada === null) return
    
    setSubetapas(prev => ({
      ...prev,
      [etapaSelecionada]: [
        ...(prev[etapaSelecionada] || []),
        { id: crypto.randomUUID(), nome: novaSubetapaNome }
      ]
    }))
    
    setShowSubetapaModal(false)
    setEtapaSelecionada(null)
    setNovaSubetapaNome('')
    toast.success('Subetapa adicionada com sucesso!')
  }

  function toggleGroup(titulo: string) {
    setOpenGroups(prev => 
      prev.includes(titulo) 
        ? prev.filter(t => t !== titulo)
        : [...prev, titulo]
    )
  }

  return (
    <>
      <Card className="border-0 shadow-md card-glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#0f172a]">
            Etapas de Ensino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" value={openGroups} onValueChange={setOpenGroups}>
            {gruposEtapas.map((grupo) => (
              <AccordionItem key={grupo.titulo} value={grupo.titulo} className="border-[#e2e8f0]">
                <AccordionTrigger className="text-[#1D3557] font-medium hover:no-underline hover:bg-[#f1f5f9] px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    {openGroups.includes(grupo.titulo) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    {grupo.titulo}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-2">
                  <div className="space-y-3">
                    {grupo.etapas.map((etapa) => (
                      <div 
                        key={etapa.codigo}
                        className="p-3 rounded-lg border border-[#e2e8f0] bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`etapa-${etapa.codigo}`}
                                checked={etapasAtivas[etapa.codigo] === true}
                                onChange={() => toggleEtapa(etapa.codigo)}
                                className="w-4 h-4 text-[#1D3557]"
                              />
                              <span className="text-sm text-[#334155]">Ativo</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`etapa-${etapa.codigo}`}
                                checked={etapasAtivas[etapa.codigo] === false || etapasAtivas[etapa.codigo] === undefined}
                                onChange={() => toggleEtapa(etapa.codigo)}
                                className="w-4 h-4 text-[#64748b]"
                              />
                              <span className="text-sm text-[#334155]">Inativo</span>
                            </label>
                            <span className="font-medium text-[#0f172a] ml-2">
                              {etapa.nome}
                            </span>
                            <span className="text-xs text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded">
                              INEP: {etapa.codigo}
                            </span>
                          </div>
                          {etapa.aceitaSubetapa && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => handleAddSubetapa(etapa.codigo)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar Subetapa
                            </Button>
                          )}
                        </div>
                        
                        {/* Subetapas */}
                        {subetapas[etapa.codigo] && subetapas[etapa.codigo].length > 0 && (
                          <div className="mt-3 pl-8 space-y-2">
                            <Accordion type="multiple" className="border-0">
                              <AccordionItem value={`subetapas-${etapa.codigo}`} className="border-0">
                                <AccordionTrigger className="text-xs text-[#64748b] hover:no-underline py-1">
                                  Ver subetapas ({subetapas[etapa.codigo].length})
                                </AccordionTrigger>
                                <AccordionContent className="pl-2">
                                  <div className="space-y-2">
                                    {subetapas[etapa.codigo].map((sub) => (
                                      <div 
                                        key={sub.id}
                                        className="flex items-center justify-between p-2 bg-[#f8fafc] rounded border border-[#e2e8f0]"
                                      >
                                        <span className="text-sm text-[#334155]">{sub.nome}</span>
                                        <button
                                          onClick={() => {
                                            setSubetapas(prev => ({
                                              ...prev,
                                              [etapa.codigo]: prev[etapa.codigo].filter(s => s.id !== sub.id)
                                            }))
                                          }}
                                          className="text-[#dc2626] text-xs hover:underline"
                                        >
                                          Remover
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Modal: Adicionar Subetapa */}
      <Dialog open={showSubetapaModal} onOpenChange={setShowSubetapaModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Subetapa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Nome da Subetapa <span className="text-red-500">*</span>
              </Label>
              <Input 
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557] focus:ring-[#1D3557]/20 bg-white"
                placeholder="Ex: Maternal, 1º Ano, etc."
                value={novaSubetapaNome}
                onChange={e => setNovaSubetapaNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmAddSubetapa()}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-3">
            <button
              type="button"
              onClick={() => setShowSubetapaModal(false)}
              className="px-4 py-2 rounded-lg border-2 border-[#e2e8f0] bg-white text-[#334155] font-medium text-sm transition-all duration-200 cursor-pointer hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmAddSubetapa}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1D3557] to-[#16304a] text-white font-medium text-sm transition-all duration-200 cursor-pointer hover:shadow-lg"
            >
              Adicionar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}