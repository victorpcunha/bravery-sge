'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TabEtapasProps {
  schoolId: string | null
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEtapas()
  }, [schoolId])

  async function loadEtapas() {
    try {
      setLoading(true)

      const { data: etapasData, error: etapasError } = await supabase
        .from('academico_etapas_ensino')
        .select('*')
        .eq('school_id', schoolId)

      if (etapasError) throw etapasError

      const etapasAtivasMap: EtapaAtiva = {}
      const subetapasMap: SubetapasData = {}

      for (const etapa of etapasData || []) {
        etapasAtivasMap[etapa.etapa_codigo] = etapa.ativa

        const { data: subetapasData } = await supabase
          .from('academico_subetapas')
          .select('*')
          .eq('etapa_ensino_id', etapa.id)

        if (subetapasData && subetapasData.length > 0) {
          subetapasMap[etapa.etapa_codigo] = subetapasData.map(s => ({
            id: s.id,
            nome: s.nome
          }))
        }
      }

      setEtapasAtivas(etapasAtivasMap)
      setSubetapas(subetapasMap)
    } catch (error) {
      console.error('Erro ao carregar etapas:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleEtapa(codigo: number) {
    const novoEstado = !etapasAtivas[codigo]

    try {
      const etapaInfo = gruposEtapas
        .flatMap(g => g.etapas)
        .find(e => e.codigo === codigo)

      if (!etapaInfo) return

      const { data: existing } = await supabase
        .from('academico_etapas_ensino')
        .select('id')
        .eq('school_id', schoolId)
        .eq('etapa_codigo', codigo)
        .single()

      if (existing) {
        await supabase
          .from('academico_etapas_ensino')
          .update({ ativa: novoEstado })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('academico_etapas_ensino')
          .insert({
            school_id: schoolId,
            etapa_codigo: codigo,
            etapa_nome: etapaInfo.nome,
            etapa_tipo: etapaInfo.tipo,
            ativa: novoEstado
          })
      }

      setEtapasAtivas(prev => ({
        ...prev,
        [codigo]: novoEstado
      }))

      toast.success(novoEstado ? 'Etapa ativada' : 'Etapa desativada')
    } catch (error) {
      console.error('Erro ao salvar etapa:', error)
      toast.error('Erro ao salvar etapa')
    }
  }

  async function handleAddSubetapa(codigo: number) {
    setEtapaSelecionada(codigo)
    setNovaSubetapaNome('')
    setShowSubetapaModal(true)
  }

  async function confirmAddSubetapa() {
    if (!novaSubetapaNome.trim() || etapaSelecionada === null) return

    try {
      const etapaInfo = gruposEtapas
        .flatMap(g => g.etapas)
        .find(e => e.codigo === etapaSelecionada)

      if (!etapaInfo) return

      const { data: existingEtapa } = await supabase
        .from('academico_etapas_ensino')
        .select('id')
        .eq('school_id', schoolId)
        .eq('etapa_codigo', etapaSelecionada)
        .single()

      let etapaId: string

      if (existingEtapa) {
        etapaId = existingEtapa.id
      } else {
        const { data: newEtapa } = await supabase
          .from('academico_etapas_ensino')
          .insert({
            school_id: schoolId,
            etapa_codigo: etapaSelecionada,
            etapa_nome: etapaInfo.nome,
            etapa_tipo: etapaInfo.tipo,
            ativa: false
          })
          .select('id')
          .single()

        if (!newEtapa) throw new Error('Erro ao criar etapa')
        etapaId = newEtapa.id
      }

      const { data: newSubetapa, error } = await supabase
        .from('academico_subetapas')
        .insert({
          etapa_ensino_id: etapaId,
          nome: novaSubetapaNome.trim()
        })
        .select()
        .single()

      if (error) throw error

      setSubetapas(prev => ({
        ...prev,
        [etapaSelecionada]: [
          ...(prev[etapaSelecionada] || []),
          { id: newSubetapa.id, nome: newSubetapa.nome }
        ]
      }))

      setShowSubetapaModal(false)
      setEtapaSelecionada(null)
      setNovaSubetapaNome('')
      toast.success('Subetapa adicionada com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar subetapa:', error)
      toast.error('Erro ao adicionar subetapa')
    }
  }

  async function removeSubetapa(etapaCodigo: number, subetapaId: string) {
    try {
      await supabase
        .from('academico_subetapas')
        .delete()
        .eq('id', subetapaId)

      setSubetapas(prev => ({
        ...prev,
        [etapaCodigo]: prev[etapaCodigo].filter(s => s.id !== subetapaId)
      }))

      toast.success('Subetapa removida')
    } catch (error) {
      console.error('Erro ao remover subetapa:', error)
      toast.error('Erro ao remover subetapa')
    }
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
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Etapas de Ensino
          </CardTitle>
        </CardHeader>
        {loading ? (
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          </CardContent>
        ) : (
        <CardContent>
          <div className="space-y-3">
            {gruposEtapas.map((grupo) => (
              <div key={grupo.titulo} className="rounded-lg border border-border bg-card overflow-hidden">
                <Button
                  variant="ghost"
                  onClick={() => toggleGroup(grupo.titulo)}
                  className="w-full justify-start gap-2 text-primary font-medium px-4 py-3"
                >
                  {openGroups.includes(grupo.titulo) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {grupo.titulo}
                </Button>
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    display: openGroups.includes(grupo.titulo) ? 'block' : 'none',
                  }}
                >
                  <div className="px-4 pb-4 space-y-3">
                    {grupo.etapas.map((etapa) => (
                      <div
                        key={etapa.codigo}
                        className="p-3 rounded-lg border border-border bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={etapasAtivas[etapa.codigo] === true}
                                onCheckedChange={() => toggleEtapa(etapa.codigo)}
                                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-border"
                              />
                              <span className="text-sm font-medium text-primary">
                                {etapasAtivas[etapa.codigo] ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">
                              {etapa.nome}
                            </span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
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
                          <div className="mt-3 border-t border-border pt-3">
                            <div className="text-xs text-muted-foreground font-medium mb-2">
                              Subetapas ({subetapas[etapa.codigo].length})
                            </div>
                            <div className="space-y-2">
                              {subetapas[etapa.codigo].map((sub) => (
                                <div
                                  key={sub.id}
                                  className="flex items-center justify-between p-2 bg-muted rounded border border-border"
                                >
                                  <span className="text-sm text-foreground">{sub.nome}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubetapa(etapa.codigo, sub.id)}
                            className="text-destructive text-xs"
                          >
                            Remover
                          </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        )}
      </Card>

      {/* Modal: Adicionar Subetapa */}
      <Dialog open={showSubetapaModal} onOpenChange={setShowSubetapaModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Subetapa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium block mb-2">
                Nome da Subetapa <span className="text-destructive">*</span>
              </Label>
              <Input 
                className="border-border focus:border-primary focus:ring-primary/20 bg-card"
                placeholder="Ex: Maternal, 1º Ano, etc."
                value={novaSubetapaNome}
                onChange={e => setNovaSubetapaNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmAddSubetapa()}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-3">
            <Button variant="outline" onClick={() => setShowSubetapaModal(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmAddSubetapa}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}