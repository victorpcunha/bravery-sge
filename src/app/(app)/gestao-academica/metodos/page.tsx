'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react'
import { getMetodos, deleteMetodo, type MetodoAvaliacao } from '@/lib/actions/metodos'
import { MetodosForm } from './MetodosForm'
import { toast } from 'sonner'

const tipoLabels: Record<string, string> = {
  numerico: 'Numérico',
  parecer: 'Parecer',
  conceito: 'Conceito',
  nivel: 'Nível',
}

export default function MetodosAvaliacaoPage() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading } = useAuth()
  const router = useRouter()
  const [metodos, setMetodos] = useState<MetodoAvaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos'>('ativos')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) return
  }, [])

  const effectiveSchoolId = selectedSchoolId || schoolId

  const loadMetodos = useCallback(async () => {
    if (!effectiveSchoolId) return
    setLoading(true)
    try {
      const data = await getMetodos(effectiveSchoolId)
      setMetodos(data)
    } catch {
      toast.error('Erro ao carregar métodos')
    } finally {
      setLoading(false)
    }
  }, [effectiveSchoolId])

  useEffect(() => { loadMetodos() }, [loadMetodos])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMetodo(deleteTarget)
      toast.success('Método excluído')
      setDeleteTarget(null)
      loadMetodos()
    } catch { toast.error('Erro ao excluir método') }
  }

  const handleSaved = () => { setModalOpen(false); setEditId(null); loadMetodos() }

  const filtered = metodos
    .filter(m => statusFilter === 'ativos' ? m.ativo : !m.ativo)
    .filter(m => !search || m.nome.toLowerCase().includes(search.toLowerCase()))

  if (authLoading) {
    return <PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          icon={ClipboardList}
          title="Métodos de Avaliação"
          description="Configure os critérios de avaliação para as matrizes curriculares"
        />

        <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nome...">
          {isSuperAdmin && allSchools.length > 0 && (
            <Select value={selectedSchoolId ?? ''} onValueChange={(v) => setSelectedSchoolId(v || null)}>
              <SelectTrigger className="w-auto min-w-[200px] h-9 border-border">
                <SelectValue placeholder="Selecione uma Escola" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </FilterBar>
        <div className="flex items-end gap-4 flex-wrap mt-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
          <div className="flex gap-1">
            <Button size="sm" variant={statusFilter === 'ativos' ? 'default' : 'outline'} onClick={() => setStatusFilter('ativos')}>Ativos</Button>
            <Button size="sm" variant={statusFilter === 'inativos' ? 'default' : 'outline'} onClick={() => setStatusFilter('inativos')}>Inativos</Button>
          </div>
          </div>
        </div>
        </PageSection>

        {isSuperAdmin && !selectedSchoolId ? (
          <Card className="shadow-sm"><CardContent className="py-16"><EmptyState icon={ClipboardList} title="Selecione uma Escola" description="Escolha uma escola para gerenciar os métodos." /></CardContent></Card>
        ) : loading ? (
          <Card className="shadow-sm"><CardContent className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}</CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card className="shadow-sm"><CardContent className="py-16"><EmptyState icon={ClipboardList} title={search ? 'Nenhum método encontrado' : 'Nenhum método cadastrado'} description={search ? 'Tente outro nome.' : 'Crie um método de avaliação.'} action={<Button onClick={() => { setEditId(null); setModalOpen(true) }}><Plus className="mr-2 h-4 w-4" />Novo Método</Button>} /></CardContent></Card>
        ) : (
          <PageSection variant="flush" title={`${filtered.length} método(s)`} actions={<Button size="sm" onClick={() => { setEditId(null); setModalOpen(true) }}><Plus className="mr-2 h-4 w-4" />Novo Método</Button>}>
            <div className="px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Critério Frequência</TableHead>
                    <TableHead>Freq. Mínima</TableHead>
                    <TableHead>Tipos de Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[90px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(m => (
                    <TableRow key={m.id}>
                      <TableCell><span className="font-medium text-foreground">{m.nome}</span></TableCell>
                      <TableCell className="text-muted-foreground">{m.criterio_frequencia === 'por_dia' ? 'Por Dia Letivo' : 'Por Aula Dada'}</TableCell>
                      <TableCell className="text-muted-foreground">{m.frecuencia_minima}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(m.tipos_avaliacao || {}).map(([key, val]) =>
                            val ? <StatusBadge key={key} status="info">{tipoLabels[key] || key}</StatusBadge> : null
                          )}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={m.ativo ? 'success' : 'muted'}>{m.ativo ? 'Ativo' : 'Inativo'}</StatusBadge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="icon-sm" onClick={() => { setEditId(m.id); setModalOpen(true) }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PageSection>
        )}
      </PageContainer>

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditId(null) } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{editId ? 'Editar Método de Avaliação' : 'Novo Método de Avaliação'}</DialogTitle>
            <DialogDescription>Configure todos os critérios e regras para este método de avaliação.</DialogDescription>
          </DialogHeader>
          <MetodosForm schoolId={effectiveSchoolId} editId={editId} onSaved={handleSaved} onCancel={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} title="Excluir método de avaliação" description="Tem certeza que deseja excluir este método permanentemente?" confirmLabel="Excluir" variant="destructive" onConfirm={handleDelete} />
    </>
  )
}
