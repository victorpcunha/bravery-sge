'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react'
import { getMetodos, deleteMetodo, type MetodoAvaliacao } from '@/lib/actions/metodos'
import { toast } from 'sonner'

const tipoLabels: Record<string, string> = {
  numerico: 'Numérico',
  parecer: 'Parecer',
  conceito: 'Conceito',
  nivel: 'Nível',
}

export default function MetodosAvaliacaoPage() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const router = useRouter()
  const [metodos, setMetodos] = useState<MetodoAvaliacao[]>([])
  const [loading, setLoading] = useState(true)
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
      await deleteMetodo(deleteTarget, pessoaId)
      toast.success('Método excluído')
      setDeleteTarget(null)
      loadMetodos()
    } catch { toast.error('Erro ao excluir método') }
  }

  const escolaQuery = isSuperAdmin && selectedSchoolId ? `?escola=${selectedSchoolId}` : ''
  const goNovo = () => router.push(`/gestao-academica/metodos/novo${escolaQuery}`)
  const goEditar = (id: string) => router.push(`/gestao-academica/metodos/${id}${escolaQuery}`)

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
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nome..." searchClassName="flex-none w-1/3 min-w-[220px]">
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
          <Card className="shadow-sm"><CardContent className="py-16"><EmptyState icon={ClipboardList} title={search ? 'Nenhum método encontrado' : 'Nenhum método cadastrado'} description={search ? 'Tente outro nome.' : 'Crie um método de avaliação.'} action={<Button onClick={goNovo}><Plus className="mr-2 h-4 w-4" />Novo Método</Button>} /></CardContent></Card>
        ) : (
          <PageSection variant="flush" title={`${filtered.length} método(s)`} actions={<Button size="sm" onClick={goNovo}><Plus className="mr-2 h-4 w-4" />Novo Método</Button>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted text-[13px] uppercase tracking-wider">Descrição</TableHead>
                  <TableHead className="bg-muted text-[13px] uppercase tracking-wider">Critério Frequência</TableHead>
                  <TableHead className="bg-muted text-[13px] uppercase tracking-wider">Freq. Mínima</TableHead>
                  <TableHead className="bg-muted text-[13px] uppercase tracking-wider">Tipos de Avaliação</TableHead>
                  <TableHead className="bg-muted text-[13px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-[90px] bg-muted text-[13px] uppercase tracking-wider">Ações</TableHead>
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
                          <Button variant="ghost" size="icon-sm" onClick={() => goEditar(m.id)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </PageSection>
        )}
      </PageContainer>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }} title="Excluir método de avaliação" description="Tem certeza que deseja excluir este método permanentemente?" confirmLabel="Excluir" variant="destructive" onConfirm={handleDelete} />
    </>
  )
}
