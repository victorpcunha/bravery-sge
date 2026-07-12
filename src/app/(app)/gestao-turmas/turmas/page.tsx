'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'
import {
  getTurmas, deleteTurma, toggleTurmaAtiva,
  getAnoLetivoAtivo, getAnosLetivosAdmin,
} from '@/lib/actions/turmas'
import { TurmaForm } from './TurmaForm'
import { toast } from 'sonner'

const TIPOS_TURMA_FILTRO = [
  { value: '', label: 'Todos' },
  { value: 'Atendimento Educacional Especializado (AEE)', label: 'AEE' },
  { value: 'Curricular', label: 'Curricular' },
  { value: 'Atividade Complementar', label: 'Atividade Complementar' },
]

export default function TurmasPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const { pessoaId } = usePermissoes(schoolId)
  const [anoLetivo, setAnoLetivo] = useState<{ id: string; descricao: string } | null>(null)
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [etapas, setEtapas] = useState<any[]>([])

  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState<string>('')
  const [tipoTurmaFiltro, setTipoTurmaFiltro] = useState<string>('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) {
      setSelectedSchoolId(allSchools[0].id)
      return
    }
    const effectiveSchoolId = selectedSchoolId || schoolId
    if (!effectiveSchoolId) return
    Promise.all([
      getAnoLetivoAtivo(effectiveSchoolId),
      getAnosLetivosAdmin(effectiveSchoolId),
    ]).then(async ([ano, anos]) => {
      if (ano) setAnoLetivo(ano)
      setAnosLetivos(anos || [])
      if (ano) setAnoLetivoFiltro(ano.id)
      const etapasResult = await getEtapasEnsino(effectiveSchoolId, ano?.id)
      setEtapas(etapasResult || [])
    }).catch(() => {})
  }, [schoolId, selectedSchoolId, isSuperAdmin, allSchools])

  const loadTurmas = useCallback(async () => {
    const effectiveSchoolId = selectedSchoolId || schoolId
    if (!effectiveSchoolId) return
    setLoading(true)
    try {
      const anoLetivoId = anoLetivoFiltro || anoLetivo?.id
      const data = await getTurmas(
        effectiveSchoolId,
        search || undefined,
        undefined,
        anoLetivoId,
        tipoTurmaFiltro || undefined,
      )
      setTurmas(data)
    } catch { toast.error('Erro ao carregar turmas') }
    finally { setLoading(false) }
  }, [schoolId, isSuperAdmin, selectedSchoolId, search, anoLetivoFiltro, anoLetivo, tipoTurmaFiltro])

  useEffect(() => { loadTurmas() }, [loadTurmas])

  const handleOpenNew = () => {
    setEditId(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (id: string) => {
    setEditId(id)
    setDialogOpen(true)
  }

  const handleSaved = () => {
    setDialogOpen(false)
    setEditId(null)
    loadTurmas()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteTurma(deleteId, pessoaId)
      toast.success('Turma excluída')
      setDeleteId(null)
      loadTurmas()
    } catch (e: any) { toast.error(e?.message || 'Erro ao excluir') }
  }

  const handleToggleAtiva = async (id: string, ativo: boolean) => {
    try {
      await toggleTurmaAtiva(id, ativo, pessoaId)
      toast.success(ativo ? 'Turma ativada' : 'Turma inativada')
      loadTurmas()
    } catch (e: any) { toast.error(e?.message || 'Erro ao alterar status') }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          icon={GraduationCap}
          title="Turmas"
          description="Cadastro de turmas conforme Registro 20 do Censo Escolar"
        />

        <PageSection variant="compact" title="Filtros" className="mb-6">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar turma por nome..."
          >
            {isSuperAdmin && allSchools.length > 0 && (
              <Select
                value={selectedSchoolId ?? '__all__'}
                onValueChange={(v) => setSelectedSchoolId(v === '__all__' ? null : v)}
              >
                <SelectTrigger className="w-auto min-w-[180px] h-9">
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as escolas</SelectItem>
                  {allSchools.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {anosLetivos.length > 0 && (
              <Select
                value={anoLetivoFiltro}
                onValueChange={setAnoLetivoFiltro}
              >
                <SelectTrigger className="w-auto min-w-[140px] h-9">
                  <SelectValue placeholder="Ano letivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosLetivos.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2 flex-wrap">
              {TIPOS_TURMA_FILTRO.map(t => (
                <Button
                  key={t.value}
                  variant={tipoTurmaFiltro === t.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTipoTurmaFiltro(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </FilterBar>
        </PageSection>

        {loading ? (
          <Card className="shadow-sm">
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </Card>
        ) : turmas.length === 0 ? (
          <Card className="shadow-sm">
            <EmptyState
              icon={GraduationCap}
              title="Nenhuma turma encontrada"
              description='Clique em "Nova Turma" para cadastrar.'
              action={
                <Button onClick={handleOpenNew}>
                  <Plus className="mr-2 h-4 w-4" /> Nova Turma
                </Button>
              }
            />
          </Card>
        ) : (
          <PageSection variant="flush" title={`${turmas.length} turma(s)`} actions={
            <Button onClick={handleOpenNew} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Nova Turma
            </Button>
          }>
            <div className="px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[90px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turmas.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <span className="font-medium text-foreground">{t.nome}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t.modalidade}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.academico_etapas_ensino?.etapa_nome || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.turnos?.map((tn: any) => tn.turno).join(', ') || '—'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.ativo ? 'success' : 'muted'}>
                          {t.ativo ? 'Ativa' : 'Inativa'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(t.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(t.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditId(null) }}}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>{editId ? 'Editar Turma' : 'Nova Turma'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Edite os dados da turma.' : 'Preencha os dados da turma (Registro 20 INEP).'}
            </DialogDescription>
          </DialogHeader>
          <TurmaForm
            schoolId={isSuperAdmin ? selectedSchoolId : schoolId}
            anoLetivo={anoLetivo}
            etapas={etapas}
            editId={editId}
            pessoaId={pessoaId}
            onSaved={handleSaved}
            onCancel={() => { setDialogOpen(false); setEditId(null) }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir turma"
        description="Excluir esta turma permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}