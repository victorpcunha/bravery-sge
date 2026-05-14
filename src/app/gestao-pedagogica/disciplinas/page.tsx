'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getFirstSchool } from '@/lib/actions/schools'

interface Disciplina {
  id: string
  school_id: string
  nome: string
  nome_abreviado: string | null
  sigla: string | null
  area_codigo: number | null
  componente: string
  tipo_ensino: string
  codigo_inep: number | null
  diretriz_curricular: string | null
  carga_horaria_padrao: number | null
  ativo: boolean
  is_padrao_mec: boolean
  created_at: string
  updated_at: string
}

interface AreaConhecimento {
  id: number
  nome: string
}

interface ComponenteINEP {
  codigo: number
  nome: string
  area_codigo: number
}

export default function DisciplinasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [loadingPage, setLoadingPage] = useState(true)
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [areas, setAreas] = useState<AreaConhecimento[]>([])
  const [componentesINEP, setComponentesINEP] = useState<ComponenteINEP[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showAtivarModal, setShowAtivarModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editando, setEditando] = useState<Disciplina | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [disciplinaParaAtivar, setDisciplinaParaAtivar] = useState<Disciplina | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    area_codigo: '' as string,
    codigo_inep: '' as string,
    diretriz_curricular: 'nenhuma',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  async function loadData() {
    try {
      const [disciplinasRes, areasRes, componentesRes] = await Promise.all([
        supabase.from('academico_disciplinas').select('*').order('nome'),
        supabase.from('academico_areas').select('*').order('nome'),
        supabase.from('academico_componentes_inep').select('*').order('nome'),
      ])

      if (disciplinasRes.data) setDisciplinas(disciplinasRes.data)
      if (areasRes.data) setAreas(areasRes.data)
      if (componentesRes.data) setComponentesINEP(componentesRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoadingPage(false)
    }
  }

  function openCreateModal() {
    setEditando(null)
    setFormData({
      nome: '',
      sigla: '',
      area_codigo: '',
      codigo_inep: '',
      diretriz_curricular: 'nenhuma',
    })
    setShowModal(true)
  }

  function openEditModal(disciplina: Disciplina) {
    setEditando(disciplina)
    setFormData({
      nome: disciplina.nome,
      sigla: disciplina.sigla || '',
      area_codigo: disciplina.area_codigo?.toString() || '',
      codigo_inep: disciplina.codigo_inep?.toString() || '',
      diretriz_curricular: disciplina.diretriz_curricular || 'nenhuma',
    })
    setShowModal(true)
  }

  function openAtivarModal(disciplina: Disciplina) {
    setDisciplinaParaAtivar(disciplina)
    setShowAtivarModal(true)
  }

  async function handleSave() {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    try {
      setSaving(true)
      const school = await getFirstSchool()
      if (!school) throw new Error('Escola não encontrada')

      const payload = {
        school_id: school.id,
        nome: formData.nome,
        nome_abreviado: formData.sigla || null,
        sigla: formData.sigla || null,
        area_codigo: formData.area_codigo ? parseInt(formData.area_codigo) : null,
        codigo_inep: formData.codigo_inep ? parseInt(formData.codigo_inep) : null,
        diretriz_curricular: formData.diretriz_curricular,
        is_padrao_mec: false,
        ativo: true,
      }

      if (editando) {
        const { error } = await supabase
          .from('academico_disciplinas')
          .update({
            nome: payload.nome,
            nome_abreviado: payload.nome_abreviado,
            sigla: payload.sigla,
            area_codigo: payload.area_codigo,
            codigo_inep: payload.codigo_inep,
            diretriz_curricular: payload.diretriz_curricular,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editando.id)

        if (error) throw error
        toast.success('Disciplina atualizada com sucesso')
      } else {
        const { error } = await supabase
          .from('academico_disciplinas')
          .insert(payload)

        if (error) throw error
        toast.success('Disciplina criada com sucesso')
      }

      setShowModal(false)
      loadData()
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      toast.error(error.message || 'Erro ao salvar disciplina')
    } finally {
      setSaving(false)
    }
  }

  async function handleInativar(disciplina: Disciplina) {
    try {
      const { error } = await supabase
        .from('academico_disciplinas')
        .update({ ativo: false, updated_at: new Date().toISOString() })
        .eq('id', disciplina.id)

      if (error) throw error
      toast.success('Disciplina inativada com sucesso')
      loadData()
    } catch (error) {
      console.error('Erro ao inativar:', error)
      toast.error('Erro ao inativar disciplina')
    }
  }

  async function handleAtivar() {
    if (!disciplinaParaAtivar) return

    try {
      const { error } = await supabase
        .from('academico_disciplinas')
        .update({ ativo: true, updated_at: new Date().toISOString() })
        .eq('id', disciplinaParaAtivar.id)

      if (error) throw error
      toast.success('Disciplina ativada com sucesso')
      setShowAtivarModal(false)
      loadData()
    } catch (error) {
      console.error('Erro ao ativar:', error)
      toast.error('Erro ao ativar disciplina')
    }
  }

  const filteredDisciplinas = disciplinas.filter(d => {
    const matchesSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.sigla && d.sigla.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (filtroAtivo === 'ativos') return matchesSearch && d.ativo
    if (filtroAtivo === 'inativos') return matchesSearch && !d.ativo
    return matchesSearch
  })

  const componentesFiltrados = formData.area_codigo 
    ? componentesINEP.filter(c => c.area_codigo === parseInt(formData.area_codigo))
    : componentesINEP

  if (authLoading || loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D3557]"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[#64748b] mb-2">
              <button onClick={() => router.push('/gestao-pedagogica')} className="hover:text-[#1D3557]">
                Gestão Pedagógica
              </button>
              <span>/</span>
              <span className="text-[#1D3557] font-medium">Disciplinas</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1D3557]">Disciplinas</h1>
            <p className="text-[#64748b]">Gerencie as disciplinas ofertadas pela escola</p>
          </div>

          {/* Barra de busca e filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                <Input
                  placeholder="Buscar por nome ou sigla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                />
              </div>
              
              <Select value={filtroAtivo} onValueChange={(v: any) => setFiltroAtivo(v)}>
                <SelectTrigger className="w-40 border-2 border-[#cbd5e1]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="ativos">Ativas</SelectItem>
                  <SelectItem value="inativos">Inativas</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={openCreateModal}
                className="bg-[#1D3557] hover:bg-[#163454]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Disciplina
              </Button>
            </div>
          </div>

          {/* Lista de Disciplinas */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-[#334155]">Nome</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#334155]">Sigla</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#334155]">Área</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#334155]">Código INEP</th>
                  <th className="text-left p-4 text-sm font-semibold text-[#334155]">Diretriz</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#334155]">Status</th>
                  <th className="text-center p-4 text-sm font-semibold text-[#334155]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisciplinas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#64748b]">
                      Nenhuma disciplina encontrada
                    </td>
                  </tr>
                ) : (
                  filteredDisciplinas.map((disciplina) => (
                    <tr key={disciplina.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {disciplina.is_padrao_mec && (
                            <span className="text-xs bg-[#457B9D] text-white px-2 py-0.5 rounded">MEC</span>
                          )}
                          <span className="text-[#334155] font-medium">{disciplina.nome}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#64748b]">{disciplina.sigla || '-'}</td>
                      <td className="p-4 text-[#64748b]">
                        {areas.find(a => a.codigo === disciplina.area_codigo)?.nome || '-'}
                      </td>
                      <td className="p-4 text-[#64748b]">{disciplina.codigo_inep || '-'}</td>
                      <td className="p-4 text-[#64748b]">
                        {disciplina.diretriz_curricular === 'bncc' && 'BNCC'}
                        {disciplina.diretriz_curricular === 'parte_diversificada' && 'Parte Diversificada'}
                        {disciplina.diretriz_curricular === 'nenhuma' && '-'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          disciplina.ativo 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {disciplina.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-[#64748b] hover:text-[#1D3557]"
                            onClick={() => openEditModal(disciplina)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {!disciplina.is_padrao_mec && (
                            disciplina.ativo ? (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8 text-[#64748b] hover:text-red-600"
                                onClick={() => handleInativar(disciplina)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-8 w-8 text-[#64748b] hover:text-green-600"
                                onClick={() => openAtivarModal(disciplina)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Criar/Editar */}
      <Dialog open={showModal} onOpenChange={(open) => !open && setShowModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              {editando ? 'Editar Disciplina' : 'Nova Disciplina'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#334155] font-medium block mb-2">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Ex: Matemática, Português..."
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Sigla
                </Label>
                <Input
                  placeholder="Ex: MAT, PORT"
                  value={formData.sigla}
                  maxLength={10}
                  onChange={(e) => setFormData(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                  className="border-2 border-[#cbd5e1] focus:border-[#1D3557]"
                />
              </div>

              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Área do Conhecimento
                </Label>
                <Select 
                  value={formData.area_codigo} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, area_codigo: value, codigo_inep: '' }))}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1]">
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-80 overflow-y-auto">
                    {areas.map(area => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Código INEP
                </Label>
                <Select 
                  value={formData.codigo_inep} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, codigo_inep: value }))}
                  disabled={!formData.area_codigo}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1]">
                    <SelectValue placeholder={formData.area_codigo ? "Selecione" : "Selecione a área primeiro"} />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-80 overflow-y-auto">
                    {componentesFiltrados.map(comp => (
                      <SelectItem key={comp.codigo} value={comp.codigo.toString()}>
                        {comp.codigo} - {comp.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[#334155] font-medium block mb-2">
                  Diretriz Curricular
                </Label>
                <Select 
                  value={formData.diretriz_curricular} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, diretriz_curricular: value }))}
                >
                  <SelectTrigger className="border-2 border-[#cbd5e1]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma</SelectItem>
                    <SelectItem value="bncc">BNCC</SelectItem>
                    <SelectItem value="parte_diversificada">Parte Diversificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1D3557] hover:bg-[#163454]"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ativar */}
      <Dialog open={showAtivarModal} onOpenChange={(open) => !open && setShowAtivarModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#0f172a]">
              Ativar Disciplina
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-[#334155]">
              Tem certeza que deseja ativar a disciplina <strong>{disciplinaParaAtivar?.nome}</strong>?
            </p>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowAtivarModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAtivar}
              className="bg-green-600 hover:bg-green-700"
            >
              Ativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}