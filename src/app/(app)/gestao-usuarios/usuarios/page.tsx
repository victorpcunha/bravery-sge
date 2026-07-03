'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2, ToggleLeft, UserCheck, Users } from 'lucide-react'
import { getPeople, deletePerson, inativarPessoa, reativarPessoa, type Person } from '@/lib/actions/people'
import { PessoaForm } from './PessoaForm'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FilterBar } from '@/components/layout/filter-bar'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const perfilLabels: Record<string, string> = {
  aluno: 'Aluno',
  profissional: 'Profissional',
  gestor: 'Gestor',
  responsavel: 'Responsável',
}

const perfilStatusMap: Record<string, 'warning' | 'primary' | 'info' | 'success'> = {
  aluno: 'warning',
  profissional: 'primary',
  gestor: 'info',
  responsavel: 'success',
}

const PERFIS = [
  { value: '', label: 'Todos' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'profissional', label: 'Profissional' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'responsavel', label: 'Responsável' },
]

function formatCpf(cpf: string | null) {
  if (!cpf) return '—'
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export default function UsuariosPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const [pessoas, setPessoas] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [perfilFiltro, setPerfilFiltro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editPerson, setEditPerson] = useState<Person | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [inativando, setInativando] = useState<string | null>(null)
  const [mostrarInativos, setMostrarInativos] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const loadPessoas = useCallback(async () => {
    setLoading(true)
    try {
      const effectiveId = isSuperAdmin ? selectedSchoolId : schoolId
      const data = await getPeople(effectiveId, search || undefined, perfilFiltro || undefined, mostrarInativos)
      setPessoas(data)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [schoolId, isSuperAdmin, selectedSchoolId, search, perfilFiltro, mostrarInativos])

  useEffect(() => { loadPessoas() }, [loadPessoas])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(deleteTarget.id)
    try {
      await deletePerson(deleteTarget.id)
      toast.success('Usuário excluído permanentemente')
      setDeleteTarget(null)
      loadPessoas()
    } catch {
      toast.error('Erro ao excluir usuário')
    } finally {
      setDeleting(null)
    }
  }

  const handleInativar = async (id: string) => {
    setInativando(id)
    try {
      await inativarPessoa(id)
      toast.success('Usuário inativado')
      loadPessoas()
    } catch {
      toast.error('Erro ao inativar usuário')
    } finally {
      setInativando(null)
    }
  }

  const handleReativar = async (id: string) => {
    setInativando(id)
    try {
      await reativarPessoa(id)
      toast.success('Usuário reativado')
      loadPessoas()
    } catch {
      toast.error('Erro ao reativar usuário')
    } finally {
      setInativando(null)
    }
  }

  const handleEdit = (p: Person) => {
    setEditPerson(p)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditPerson(null)
    setModalOpen(true)
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditPerson(null)
    loadPessoas()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          title="Usuários"
          description="Cadastro único de usuários (Registro 30 INEP)"
          icon={Users}
        />

        <PageSection variant="compact" title="Filtros" className="mb-6">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome..."
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
            <div className="flex gap-2 flex-wrap">
              {PERFIS.map(p => (
                <Button
                  key={p.value}
                  variant={perfilFiltro === p.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPerfilFiltro(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <Button
              variant={mostrarInativos ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMostrarInativos(v => !v)}
            >
              <ToggleLeft className="mr-1.5 h-3.5 w-3.5" />
              {mostrarInativos ? 'Ocultar inativos' : 'Mostrar inativos'}
            </Button>
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
        ) : pessoas.length === 0 ? (
          <Card className="shadow-sm">
            <EmptyState
              icon={Users}
              title="Nenhum usuário cadastrado"
              description="Cadastre usuários para registrar no Censo INEP 2026."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              }
            />
          </Card>
        ) : (
          <PageSection variant="flush" title={`${pessoas.length} usuário(s)`} actions={
            <Button onClick={handleCreate} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          }>
            <div className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>INEP</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[90px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pessoas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell>
                      <span className="font-medium text-foreground">{pessoa.nome_completo}</span>
                      {pessoa.codigo_pessoa && (
                        <span className="text-xs text-muted-foreground ml-2">#{pessoa.codigo_pessoa}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatCpf(pessoa.cpf)}</TableCell>
                    <TableCell className="text-muted-foreground">{pessoa.inep_id || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {(pessoa.perfil || []).map(p => (
                          <StatusBadge key={p} status={perfilStatusMap[p] || 'muted'}>
                            {perfilLabels[p] || p}
                          </StatusBadge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pessoa.ativo ? 'success' : 'destructive'}>
                        {pessoa.ativo ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(pessoa)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(pessoa)}
                          disabled={deleting === pessoa.id}
                        >
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

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditPerson(null) }}}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>{editPerson ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editPerson ? 'Edite os dados cadastrais.' : 'Preencha os dados cadastrais (Registro 30 INEP).'}
            </DialogDescription>
          </DialogHeader>
          <PessoaForm
            schoolId={schoolId}
            person={editPerson}
            onSaved={handleSaved}
            onCancel={() => { setModalOpen(false); setEditPerson(null) }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Excluir usuário"
        description="Tem certeza? Esta ação é permanente e não pode ser desfeita. Todos os dados deste usuário serão excluídos."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
        loading={!!deleting}
      />
    </>
  )
}
