'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'
import { Plus, Pencil, BookOpen, Ban, CheckCircle2 } from 'lucide-react'
import { AREAS_CONHECIMENTO } from '@/data/censo/areas-conhecimento'
import {
  listarDisciplinas,
  getAreasConhecimento,
  criarDisciplina,
  atualizarDisciplina,
  toggleDisciplinaAtiva,
  excluirDisciplina,
  type Disciplina,
} from '@/lib/actions/disciplinas'

interface AreaConhecimento {
  id: number
  nome: string
}

export default function DisciplinasPage() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const router = useRouter()

  const [loadingPage, setLoadingPage] = useState(true)
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [areas, setAreas] = useState<AreaConhecimento[]>([])
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editando, setEditando] = useState<Disciplina | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [diretrizFilter, setDiretrizFilter] = useState('__all__')
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Disciplina | null>(null)
  const [toggleTarget, setToggleTarget] = useState<Disciplina | null>(null)
  const [toggling, setToggling] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    area_codigo: '' as string,
    codigo_inep: '' as string,
    diretriz_curricular: '' as string,
  })

  useEffect(() => { if (!authLoading && !user) router.push('/login') }, [user, authLoading, router])

  useEffect(() => { if (user) loadData() }, [user, selectedSchoolId])

  async function loadData() {
    try {
      const effectiveId = selectedSchoolId || schoolId
      const [disciplinasRes, areasRes] = await Promise.all([
        listarDisciplinas(effectiveId),
        getAreasConhecimento(),
      ])
      if (disciplinasRes) setDisciplinas(disciplinasRes)
      if (areasRes) setAreas(areasRes)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoadingPage(false)
    }
  }

  function openCreateModal() {
    setEditando(null)
    setFormData({ nome: '', sigla: '', area_codigo: '', codigo_inep: '', diretriz_curricular: '' })
    setShowModal(true)
  }

  function openEditModal(disciplina: Disciplina) {
    setEditando(disciplina)
    setFormData({
      nome: disciplina.nome,
      sigla: disciplina.sigla || '',
      area_codigo: disciplina.area_codigo?.toString() || '',
      codigo_inep: disciplina.codigo_inep != null ? String(disciplina.codigo_inep).padStart(2, '0') : '',
      diretriz_curricular: disciplina.diretriz_curricular || '',
    })
    setShowModal(true)
  }

  function formatCodigoInep(codigo: number | null) {
    if (codigo == null) return '-'
    return String(codigo).padStart(2, '0')
  }

  function nomeCodigoInep(codigo: number | null) {
    if (codigo == null) return null
    return AREAS_CONHECIMENTO.find(a => parseInt(a.codigo, 10) === codigo)?.nome || null
  }

  async function handleSave() {
    if (!formData.nome.trim()) { toast.error('Nome é obrigatório'); return }
    try {
      setSaving(true)
      const school_id = selectedSchoolId || schoolId
      if (!school_id) throw new Error('Escola não encontrada')

      const payload = {
        school_id,
        nome: formData.nome,
        nome_abreviado: formData.sigla || null,
        sigla: formData.sigla || null,
        area_codigo: formData.area_codigo ? parseInt(formData.area_codigo, 10) : null,
        codigo_inep: formData.codigo_inep ? parseInt(formData.codigo_inep, 10) : null,
        diretriz_curricular: formData.diretriz_curricular || null,
        is_padrao_mec: false,
        ativo: true,
      }

      if (editando) {
        await atualizarDisciplina(editando.id, payload as any, pessoaId)
        toast.success('Disciplina atualizada')
      } else {
        await criarDisciplina(payload as any, pessoaId)
        toast.success('Disciplina criada')
      }
      setShowModal(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar disciplina')
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmToggle() {
    if (!toggleTarget) return
    const reativar = !toggleTarget.ativo
    try {
      setToggling(true)
      await toggleDisciplinaAtiva(toggleTarget.id, reativar, pessoaId)
      toast.success(reativar ? 'Disciplina ativada' : 'Disciplina inativada')
      setToggleTarget(null)
      loadData()
    } catch {
      toast.error(reativar ? 'Erro ao ativar disciplina' : 'Erro ao inativar disciplina')
    } finally {
      setToggling(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await excluirDisciplina(deleteTarget.id, pessoaId)
      toast.success('Disciplina excluída')
      setDeleteTarget(null)
      setShowModal(false)
      loadData()
    } catch { toast.error('Erro ao excluir disciplina') }
  }

  const filteredDisciplinas = disciplinas.filter(d => {
    const matchesSearch = d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.sigla && d.sigla.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filtroAtivo === 'ativos' && !d.ativo) return false
    if (filtroAtivo === 'inativos' && d.ativo) return false
    if (diretrizFilter !== '__all__' && d.diretriz_curricular !== diretrizFilter) return false
    return matchesSearch
  })

  if (authLoading || loadingPage) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px] max-w-[280px]">
            <Label className="text-xs text-muted-foreground mb-1 block">Buscar</Label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por nome ou sigla..." className="h-9 w-full rounded-md border border-border bg-transparent pl-10 pr-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
            </div>
          </div>
          {isSuperAdmin && allSchools.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Escola</Label>
              <Select value={selectedSchoolId ?? ''} onValueChange={v => setSelectedSchoolId(v || null)}>
                <SelectTrigger className="w-auto min-w-[200px] h-9 border-border">
                  <SelectValue placeholder="Selecione uma Escola" />
                </SelectTrigger>
                <SelectContent>
                  {allSchools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
            <Select value={filtroAtivo} onValueChange={v => setFiltroAtivo(v as any)}>
              <SelectTrigger className="w-auto min-w-[130px] h-9 border-border">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="ativos">Ativas</SelectItem>
                <SelectItem value="inativos">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Diretriz</Label>
            <Select value={diretrizFilter} onValueChange={setDiretrizFilter}>
              <SelectTrigger className="w-auto min-w-[150px] h-9 border-border">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas</SelectItem>
                <SelectItem value="bncc">BNCC</SelectItem>
                <SelectItem value="parte_diversificada">Parte Diversificada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PageSection>

      <PageSection
        variant="flush"
        title={`${filteredDisciplinas.length} disciplina${filteredDisciplinas.length !== 1 ? 's' : ''}`}
        actions={<Button size="sm" onClick={openCreateModal}><Plus className="mr-2 h-4 w-4" />Nova Disciplina</Button>}
      >
        {filteredDisciplinas.length === 0 ? (
          <EmptyState icon={BookOpen} title="Nenhuma disciplina encontrada" description="Crie uma nova disciplina ou ajuste os filtros." />
        ) : (
          <>
            {/* Mobile: lista de cards */}
            <ul className="block md:hidden space-y-3 p-4">
              {filteredDisciplinas.map(disciplina => (
                <li
                  key={disciplina.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground truncate">
                        {disciplina.nome}
                      </p>
                      <p className="text-[13px] text-muted-foreground tabular-nums mt-0.5">
                        {disciplina.sigla ? `${disciplina.sigla} • ` : ''}INEP {formatCodigoInep(disciplina.codigo_inep)}
                      </p>
                    </div>
                    <StatusBadge status={disciplina.ativo ? 'success' : 'muted'} className="shrink-0">
                      {disciplina.ativo ? 'Ativa' : 'Inativa'}
                    </StatusBadge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {disciplina.is_padrao_mec && <StatusBadge status="info">MEC</StatusBadge>}
                    <span className="inline-flex items-center text-[13px] text-muted-foreground">
                      {areas.find(a => a.id === Number(disciplina.area_codigo))?.nome || 'Sem área'}
                    </span>
                    <span className="inline-flex items-center text-[13px] text-muted-foreground">
                      • {disciplina.diretriz_curricular === 'bncc' ? 'BNCC' : disciplina.diretriz_curricular === 'parte_diversificada' ? 'Parte Diversificada' : 'Sem diretriz'}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(disciplina)}
                      className="flex-1 min-h-[44px]"
                    >
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Editar
                    </Button>
                    {disciplina.ativo ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToggleTarget(disciplina)}
                        className="flex-1 min-h-[44px] text-destructive hover:text-destructive"
                      >
                        <Ban className="mr-1.5 h-4 w-4" />
                        Inativar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToggleTarget(disciplina)}
                        className="flex-1 min-h-[44px]"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Ativar
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: tabela */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted text-foreground">Nome</TableHead>
                    <TableHead className="bg-muted text-foreground">Sigla</TableHead>
                    <TableHead className="bg-muted text-foreground">Área</TableHead>
                    <TableHead className="bg-muted text-foreground">Código INEP</TableHead>
                    <TableHead className="bg-muted text-foreground">Diretriz</TableHead>
                    <TableHead className="bg-muted text-foreground">Status</TableHead>
                    <TableHead className="bg-muted text-foreground w-[90px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisciplinas.map(disciplina => (
                    <TableRow key={disciplina.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {disciplina.is_padrao_mec && <StatusBadge status="info">MEC</StatusBadge>}
                          <span className="font-medium text-foreground">{disciplina.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{disciplina.sigla || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{areas.find(a => a.id === Number(disciplina.area_codigo))?.nome || '-'}</TableCell>
                      <TableCell
                        className="text-muted-foreground tabular-nums"
                        title={nomeCodigoInep(disciplina.codigo_inep) || undefined}
                      >
                        {formatCodigoInep(disciplina.codigo_inep)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {disciplina.diretriz_curricular === 'bncc' && 'BNCC'}
                        {disciplina.diretriz_curricular === 'parte_diversificada' && 'Parte Diversificada'}
                        {!disciplina.diretriz_curricular && '-'}
                      </TableCell>
                      <TableCell><StatusBadge status={disciplina.ativo ? 'success' : 'muted'}>{disciplina.ativo ? 'Ativa' : 'Inativa'}</StatusBadge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(disciplina)} title="Editar" aria-label={`Editar ${disciplina.nome}`}><Pencil className="h-4 w-4" /></Button>
                          {disciplina.ativo ? (
                            <Button variant="ghost" size="icon-sm" onClick={() => setToggleTarget(disciplina)} title="Inativar" aria-label={`Inativar ${disciplina.nome}`}><Ban className="h-4 w-4 text-destructive" /></Button>
                          ) : (
                            <Button variant="ghost" size="icon-sm" onClick={() => setToggleTarget(disciplina)} title="Ativar" aria-label={`Ativar ${disciplina.nome}`}><CheckCircle2 className="h-4 w-4 text-success" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </PageSection>

      <Dialog open={showModal} onOpenChange={open => !open && setShowModal(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editando ? 'Editar Disciplina' : 'Nova Disciplina'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="font-medium block mb-2">Nome <span className="text-destructive">*</span></Label>
              <Input className="border-border" placeholder="Ex: Matemática, Português..." value={formData.nome} onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium block mb-2">Sigla</Label>
                <Input className="border-border" placeholder="Ex: MAT, PORT" value={formData.sigla} maxLength={10} onChange={e => setFormData(prev => ({ ...prev, sigla: e.target.value.toUpperCase() }))} />
              </div>
              <div>
                <Label className="font-medium block mb-2">Área do Conhecimento</Label>
                <Select value={formData.area_codigo} onValueChange={v => setFormData(prev => ({ ...prev, area_codigo: v }))}>
                  <SelectTrigger className="[&>span]:truncate"><SelectValue placeholder="Selecione a área" /></SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-80 overflow-y-auto">
                    {areas.map(area => <SelectItem key={area.id} value={area.id.toString()}>{area.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium block mb-2">Código INEP</Label>
                <Select value={formData.codigo_inep} onValueChange={v => setFormData(prev => ({ ...prev, codigo_inep: v }))}>
                  <SelectTrigger className="[&>span]:truncate"><SelectValue placeholder="Selecione o código INEP" /></SelectTrigger>
                  <SelectContent position="popper" sideOffset={5} className="max-h-80 overflow-y-auto">
                    {AREAS_CONHECIMENTO.map(item => (
                      <SelectItem key={item.codigo} value={item.codigo}>
                        {item.codigo} — {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[13px] text-muted-foreground mt-1.5">Tabela oficial INEP 2026 (Censo Escolar).</p>
              </div>
              <div>
                <Label className="font-medium block mb-2">Diretriz Curricular</Label>
                <Select value={formData.diretriz_curricular} onValueChange={v => setFormData(prev => ({ ...prev, diretriz_curricular: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione uma diretriz" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bncc">BNCC</SelectItem>
                    <SelectItem value="parte_diversificada">Parte Diversificada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3 gap-2 bg-muted/30">
            {editando && !editando.is_padrao_mec && (
              <Button variant="destructive" className="mr-auto" onClick={() => { setShowModal(false); setDeleteTarget(editando) }}>Excluir</Button>
            )}
            <Button variant="outline" onClick={() => setShowModal(false)} className="min-h-[40px] sm:min-h-[44px]">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="min-h-[40px] sm:min-h-[44px]">{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="Excluir Disciplina"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={!!toggleTarget}
        onOpenChange={open => { if (!open) setToggleTarget(null) }}
        title={toggleTarget?.ativo ? 'Inativar Disciplina' : 'Ativar Disciplina'}
        description={
          toggleTarget?.ativo
            ? `Deseja realmente inativar "${toggleTarget?.nome}" para esta escola? Ela deixará de ficar disponível para novos vínculos, mas o histórico será preservado.`
            : `Deseja realmente reativar "${toggleTarget?.nome}" para esta escola?`
        }
        confirmLabel={toggleTarget?.ativo ? 'Sim, Inativar' : 'Sim, Ativar'}
        variant={toggleTarget?.ativo ? 'destructive' : 'warning'}
        onConfirm={handleConfirmToggle}
        loading={toggling}
      />
    </PageContainer>
  )
}
