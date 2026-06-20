'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const { user, schoolId, loading: authLoading } = useAuth()
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
      const school_id = schoolId
      if (!school_id) throw new Error('Escola não encontrada')

      const payload = {
        school_id,
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
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </PageContainer>
    )
  }

  if (!user) return null

  return (
    <PageContainer>
      <PageHeader
        title="Disciplinas"
        description="Gerencie as disciplinas ofertadas pela escola"
        icon={BookOpen}
        breadcrumbs={[
          { label: 'Gestão Pedagógica', href: '/gestao-pedagogica' },
          { label: 'Disciplinas' },
        ]}
        actions={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Disciplina
          </Button>
        }
      />

      {/* Filtros */}
      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por nome ou sigla..."
        >
          <Select value={filtroAtivo} onValueChange={(v: any) => setFiltroAtivo(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="ativos">Ativas</SelectItem>
              <SelectItem value="inativos">Inativas</SelectItem>
            </SelectContent>
          </Select>
        </FilterBar>
      </PageSection>

      {/* Tabela de Disciplinas */}
      <PageSection
        variant="flush"
        title={`${filteredDisciplinas.length} disciplina${filteredDisciplinas.length !== 1 ? 's' : ''}`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Código INEP</TableHead>
              <TableHead>Diretriz</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDisciplinas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState
                    icon={BookOpen}
                    title="Nenhuma disciplina encontrada"
                    description="Crie uma nova disciplina para começar ou ajuste os filtros de busca."
                    action={
                      <Button onClick={openCreateModal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Disciplina
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredDisciplinas.map((disciplina) => (
                <TableRow key={disciplina.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {disciplina.is_padrao_mec && (
                        <StatusBadge status="info">MEC</StatusBadge>
                      )}
                      <span className="font-medium text-foreground">{disciplina.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{disciplina.sigla || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {areas.find(a => a.id === Number(disciplina.area_codigo))?.nome || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{disciplina.codigo_inep || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {disciplina.diretriz_curricular === 'bncc' && 'BNCC'}
                    {disciplina.diretriz_curricular === 'parte_diversificada' && 'Parte Diversificada'}
                    {disciplina.diretriz_curricular === 'nenhuma' && '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={disciplina.ativo ? 'success' : 'destructive'}>
                      {disciplina.ativo ? 'Ativa' : 'Inativa'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(disciplina)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!disciplina.is_padrao_mec && (
                        disciplina.ativo ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleInativar(disciplina)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openAtivarModal(disciplina)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </PageSection>

      {/* Modal de Criar/Editar */}
      <Dialog open={showModal} onOpenChange={(open) => !open && setShowModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editando ? 'Editar Disciplina' : 'Nova Disciplina'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="font-medium block mb-2">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Ex: Matemática, Português..."
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium block mb-2">
                  Sigla
                </Label>
                <Input
                  placeholder="Ex: MAT, PORT"
                  value={formData.sigla}
                  maxLength={10}
                  onChange={(e) => setFormData(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                />
              </div>

              <div>
                <Label className="font-medium block mb-2">
                  Área do Conhecimento
                </Label>
                <Select
                  value={formData.area_codigo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, area_codigo: value, codigo_inep: '' }))}
                >
                  <SelectTrigger>
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
                <Label className="font-medium block mb-2">
                  Código INEP
                </Label>
                <Select
                  value={formData.codigo_inep}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, codigo_inep: value }))}
                  disabled={!formData.area_codigo}
                >
                  <SelectTrigger>
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
                <Label className="font-medium block mb-2">
                  Diretriz Curricular
                </Label>
                <Select
                  value={formData.diretriz_curricular}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, diretriz_curricular: value }))}
                >
                  <SelectTrigger>
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
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ativar */}
      <Dialog open={showAtivarModal} onOpenChange={(open) => !open && setShowAtivarModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Ativar Disciplina
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-foreground">
              Tem certeza que deseja ativar a disciplina <strong>{disciplinaParaAtivar?.nome}</strong>?
            </p>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setShowAtivarModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAtivar} className="bg-success hover:bg-success/90 text-primary-foreground">
              Ativar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
