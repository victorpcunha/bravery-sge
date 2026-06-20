'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, ToggleLeft, RotateCcw, UserCheck, Users } from 'lucide-react'
import { getPeople, deletePerson, inativarPessoa, reativarPessoa, type Person } from '@/lib/actions/people'
import { PessoaForm } from './PessoaForm'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { FilterBar } from '@/components/layout/filter-bar'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'

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

export default function UsuariosPage() {
  const { user, loading: authLoading, schoolId } = useAuth()
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

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const loadPessoas = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPeople(schoolId, search || undefined, perfilFiltro || undefined, mostrarInativos)
      setPessoas(data)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [schoolId, search, perfilFiltro, mostrarInativos])

  useEffect(() => { loadPessoas() }, [loadPessoas])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Esta ação é permanente e não pode ser desfeita.')) return
    if (!confirm('Confirmar exclusão permanente de todos os dados deste usuário?')) return
    setDeleting(id)
    try {
      await deletePerson(id)
      toast.success('Usuário excluído permanentemente')
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
          actions={
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          }
        />

        <PageSection variant="compact" title="Filtros" className="mb-6 animate-fade-in-up">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome..."
          >
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
          <Card className="shadow-sm animate-fade-in-up">
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </Card>
        ) : pessoas.length === 0 ? (
          <Card className="shadow-sm animate-fade-in-up">
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
          <div className="space-y-3">
            {pessoas.map((pessoa) => (
              <Card
                key={pessoa.id}
                className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{pessoa.nome_completo?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {pessoa.nome_completo}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-0.5">
                          {pessoa.cpf && <span className="text-xs text-muted-foreground">CPF: {pessoa.cpf}</span>}
                          {pessoa.codigo_pessoa && (
                            <span className="text-xs text-muted-foreground">
                              #{pessoa.codigo_pessoa}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-wrap">
                        {(pessoa.perfil || []).map(p => (
                          <StatusBadge key={p} status={perfilStatusMap[p] || 'muted'}>
                            {perfilLabels[p] || p}
                          </StatusBadge>
                        ))}
                        {!pessoa.ativo && (
                          <StatusBadge status="muted">Inativo</StatusBadge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(pessoa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {pessoa.ativo ? (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleInativar(pessoa.id)} disabled={inativando === pessoa.id}>
                          <ToggleLeft className="h-4 w-4 text-warning" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleReativar(pessoa.id)} disabled={inativando === pessoa.id}>
                          <RotateCcw className="h-4 w-4 text-success" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(pessoa.id)} disabled={deleting === pessoa.id}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <PageSection
          title={`Total: ${pessoas.length} usuário(s)`}
          description="Dados enviados ao Censo INEP 2026 (Registro 30 - 110 campos)"
          variant="compact"
          className="mt-6 animate-fade-in-up"
          actions={
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
          }
        >
          {' '}
        </PageSection>
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
    </>
  )
}