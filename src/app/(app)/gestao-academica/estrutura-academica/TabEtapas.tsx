'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import { Plus, ChevronDown, ChevronRight, ShieldAlert, Pencil, Trash2 } from 'lucide-react'
import { StatusBadge } from '@/components/feedback/status-badge'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import {
  getTodasEtapasEnsino,
  upsertEtapaEnsino,
  getSubetapas,
  criarSubetapa,
  atualizarSubetapa,
  removerSubetapa,
} from '@/lib/actions/etapas-ensino'

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
  const { isSuperAdmin, allSchools } = useAuth()
  const { pode, loaded: permLoaded } = usePermissoes(schoolId)

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoLetivoId, setAnoLetivoId] = useState<string | null>(null)

  const [etapasAtivas, setEtapasAtivas] = useState<EtapaAtiva>({})
  const [subetapas, setSubetapas] = useState<SubetapasData>({})
  const [showSubetapaModal, setShowSubetapaModal] = useState(false)
  const [etapaSelecionada, setEtapaSelecionada] = useState<number | null>(null)
  const [novaSubetapaNome, setNovaSubetapaNome] = useState('')
  const [editingSubetapa, setEditingSubetapa] = useState<{ etapaCodigo: number; id: string; nome: string } | null>(null)
  const [openGroups, setOpenGroups] = useState<string[]>(['Educação Infantil'])
  const [loading, setLoading] = useState(true)

  const effectiveSchoolId = selectedSchoolId || schoolId

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) return
    if (!effectiveSchoolId) { setLoading(false); return }
    loadAnosLetivos()
  }, [effectiveSchoolId, isSuperAdmin, allSchools, selectedSchoolId])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoId) return
    loadEtapas()
  }, [effectiveSchoolId, anoLetivoId])

  async function loadAnosLetivos() {
    if (!effectiveSchoolId) return
    try {
      const anos = await getAnosLetivosAtivos(effectiveSchoolId)
      setAnosLetivos(anos)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) {
        setAnoLetivoId(ativo.id)
      } else if (anos.length > 0) {
        setAnoLetivoId(anos[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar anos letivos:', error)
      setLoading(false)
    }
  }

  async function loadEtapas() {
    if (!effectiveSchoolId || !anoLetivoId) return
    try {
      setLoading(true)
      const etapasData = await getTodasEtapasEnsino(effectiveSchoolId, anoLetivoId)
      const etapasAtivasMap: EtapaAtiva = {}
      const subetapasMap: SubetapasData = {}

      for (const etapa of etapasData) {
        etapasAtivasMap[etapa.etapa_codigo] = etapa.ativa
        const subs = await getSubetapas(etapa.id)
        if (subs.length > 0) {
          subetapasMap[etapa.etapa_codigo] = subs.map(s => ({ id: s.id, nome: s.nome }))
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
    if (!anoLetivoId) { toast.error('Selecione um ano letivo'); return }
    const novoEstado = !etapasAtivas[codigo]
    try {
      const etapaInfo = gruposEtapas.flatMap(g => g.etapas).find(e => e.codigo === codigo)
      if (!etapaInfo) return
      await upsertEtapaEnsino(effectiveSchoolId!, anoLetivoId, codigo, etapaInfo.nome, etapaInfo.tipo, novoEstado)
      setEtapasAtivas(prev => ({ ...prev, [codigo]: novoEstado }))
      toast.success(novoEstado ? 'Etapa ativada' : 'Etapa desativada')
    } catch (error) {
      console.error('Erro ao salvar etapa:', error)
      toast.error('Erro ao salvar etapa')
    }
  }

  async function handleAddSubetapa(codigo: number) {
    setEtapaSelecionada(codigo)
    setNovaSubetapaNome('')
    setEditingSubetapa(null)
    setShowSubetapaModal(true)
  }

  async function handleEditSubetapa(etapaCodigo: number, sub: { id: string; nome: string }) {
    setEtapaSelecionada(etapaCodigo)
    setNovaSubetapaNome(sub.nome)
    setEditingSubetapa({ etapaCodigo, id: sub.id, nome: sub.nome })
    setShowSubetapaModal(true)
  }

  async function confirmAddSubetapa(keepOpen: boolean = false) {
    if (!novaSubetapaNome.trim()) return

    try {
      if (editingSubetapa) {
        await atualizarSubetapa(editingSubetapa.id, novaSubetapaNome.trim())
        setSubetapas(prev => ({
          ...prev,
          [editingSubetapa.etapaCodigo]: prev[editingSubetapa.etapaCodigo].map(s =>
            s.id === editingSubetapa.id ? { ...s, nome: novaSubetapaNome.trim() } : s
          )
        }))
        setShowSubetapaModal(false)
        setEtapaSelecionada(null)
        setNovaSubetapaNome('')
        setEditingSubetapa(null)
        toast.success('Subetapa atualizada!')
        return
      }

      if (!etapaSelecionada || !anoLetivoId) return
      const etapaInfo = gruposEtapas.flatMap(g => g.etapas).find(e => e.codigo === etapaSelecionada)
      if (!etapaInfo) return
      const etapaId = await upsertEtapaEnsino(effectiveSchoolId!, anoLetivoId, etapaSelecionada, etapaInfo.nome, etapaInfo.tipo, false)
      const newSubetapa = await criarSubetapa(etapaId, novaSubetapaNome.trim())
      setSubetapas(prev => ({
        ...prev,
        [etapaSelecionada]: [...(prev[etapaSelecionada] || []), { id: newSubetapa.id, nome: newSubetapa.nome }]
      }))
      if (keepOpen) {
        setNovaSubetapaNome('')
        toast.success('Subetapa adicionada!')
      } else {
        setShowSubetapaModal(false)
        setEtapaSelecionada(null)
        setNovaSubetapaNome('')
        toast.success('Subetapa adicionada!')
      }
    } catch (error) {
      console.error('Erro ao salvar subetapa:', error)
      toast.error('Erro ao salvar subetapa')
    }
  }

  async function removeSubetapa(etapaCodigo: number, subetapaId: string) {
    try {
      await removerSubetapa(subetapaId)
      setSubetapas(prev => ({ ...prev, [etapaCodigo]: prev[etapaCodigo].filter(s => s.id !== subetapaId) }))
      toast.success('Subetapa removida')
    } catch (error) {
      console.error('Erro ao remover subetapa:', error)
      toast.error('Erro ao remover subetapa')
    }
  }

  function toggleGroup(titulo: string) {
    setOpenGroups(prev => prev.includes(titulo) ? prev.filter(t => t !== titulo) : [...prev, titulo])
  }

  if (!permLoaded) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-[16px] font-semibold">Etapas de Ensino</CardTitle></CardHeader>
        <CardContent><div className="flex items-center justify-center py-8"><span className="text-sm text-muted-foreground">Carregando...</span></div></CardContent>
      </Card>
    )
  }

  if (!pode.visualizar('gestao-academica.estrutura-academica.etapas')) {
    return <EmptyState icon={ShieldAlert} title="Sem permissão" description="Você não tem permissão para acessar Etapas de Ensino." />
  }

  return (
    <>
      {/* School + Ano Letivo filters */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        {isSuperAdmin && allSchools.length > 0 && (
          <div className="max-w-md">
            <Label className="text-xs text-muted-foreground mb-1 block">Escola</Label>
            <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v); setAnoLetivoId(null); setEtapasAtivas({}); setSubetapas({}) }}>
              <SelectTrigger className="w-full border-border">
                <SelectValue placeholder="Selecione uma Escola" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        {(effectiveSchoolId || !isSuperAdmin) && anosLetivos.length > 0 && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
            <Select value={anoLetivoId ?? ''} onValueChange={setAnoLetivoId}>
              <SelectTrigger className="w-[160px] border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {isSuperAdmin && !selectedSchoolId ? (
        <EmptyState icon={ShieldAlert} title="Selecione uma Escola" description="Escolha uma escola para gerenciar as etapas de ensino." />
      ) : !anoLetivoId ? (
        <EmptyState icon={ShieldAlert} title="Selecione um Ano Letivo" description="Escolha um ano letivo para visualizar as etapas." />
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-[16px] font-semibold text-foreground">Etapas de Ensino</CardTitle>
          </CardHeader>
          {loading ? (
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <span className="text-sm text-muted-foreground ml-3">Carregando...</span>
              </div>
            </CardContent>
          ) : (
          <CardContent>
            <div className="space-y-4">
              {gruposEtapas.map((grupo) => {
                const isOpen = openGroups.includes(grupo.titulo)
                const etapasAtivasNoGrupo = grupo.etapas.filter(e => etapasAtivas[e.codigo] === true).length
                return (
                  <div key={grupo.titulo} className="rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleGroup(grupo.titulo)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-muted-foreground">
                        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </span>
                      <span className="text-[15px] font-semibold text-foreground flex-1">{grupo.titulo}</span>
                      {etapasAtivasNoGrupo > 0 && (
                        <StatusBadge status="success">{etapasAtivasNoGrupo} ativa{etapasAtivasNoGrupo > 1 ? 's' : ''}</StatusBadge>
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                        {grupo.etapas.map((etapa) => (
                          <div key={etapa.codigo}>
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card/50">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Switch
                                  checked={etapasAtivas[etapa.codigo] === true}
                                  onCheckedChange={() => toggleEtapa(etapa.codigo)}
                                />
                                <span className={`text-xs font-medium ${etapasAtivas[etapa.codigo] ? 'text-success' : 'text-muted-foreground'}`}>
                                  {etapasAtivas[etapa.codigo] ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-foreground flex-1">{etapa.nome}</span>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                                  INEP {etapa.codigo}
                                </span>
                                {etapa.aceitaSubetapa && (
                                  <Button size="xs" variant="outline" onClick={() => handleAddSubetapa(etapa.codigo)}>
                                    <Plus className="w-3 h-3 mr-1" />Subetapa
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Subetapas desta etapa */}
                            {subetapas[etapa.codigo] && subetapas[etapa.codigo].length > 0 && (
                              <div className="mt-1.5 ml-10 space-y-1">
                                {subetapas[etapa.codigo].map(sub => (
                                  <div key={sub.id} className="flex items-center justify-between p-2 rounded border border-border bg-muted/30">
                                    <span className="text-sm text-foreground">{sub.nome}</span>
                                    <div className="flex items-center gap-0.5">
                                      <Button variant="ghost" size="icon-sm" onClick={() => handleEditSubetapa(etapa.codigo, sub)} title="Editar">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon-sm" onClick={() => removeSubetapa(etapa.codigo, sub.id)} title="Excluir">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
          )}
        </Card>
      )}

      {/* Modal: Subetapa (criar/editar) */}
      <Dialog open={showSubetapaModal} onOpenChange={(open) => { setShowSubetapaModal(open); if (!open) { setEditingSubetapa(null); setEtapaSelecionada(null); setNovaSubetapaNome('') } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingSubetapa ? 'Editar Subetapa' : 'Adicionar Subetapa'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium block mb-2">Nome da Subetapa <span className="text-destructive">*</span></Label>
              <Input className="border-border" placeholder="Ex: Maternal, 1º Ano, etc." value={novaSubetapaNome} onChange={e => setNovaSubetapaNome(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') editingSubetapa ? confirmAddSubetapa() : confirmAddSubetapa(true) }} autoFocus />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-3">
            <Button variant="ghost" onClick={() => { setShowSubetapaModal(false); setEditingSubetapa(null); setEtapaSelecionada(null); setNovaSubetapaNome('') }}>Cancelar</Button>
            {editingSubetapa ? (
              <Button onClick={() => confirmAddSubetapa()}>Salvar</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => confirmAddSubetapa(true)}>Adicionar e criar outro</Button>
                <Button onClick={() => confirmAddSubetapa()}>Adicionar</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
