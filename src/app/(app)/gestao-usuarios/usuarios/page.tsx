'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ClickablePill } from '@/components/ui/clickable-pill'
import { Label } from '@/components/ui/label'
import { StatCard } from '@/components/ui/stat-card'
import { CopyChip } from '@/components/usuarios/copy-chip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { Plus, Pencil, Trash2, Users, GraduationCap, Briefcase, HeartHandshake, School } from 'lucide-react'
import { getPeople, getPerson, deletePerson, inativarPessoa, reativarPessoa, type Person } from '@/lib/actions/people'
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

const ITEMS_PER_PAGE = 10

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

const STATUS_OPCOES = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativos', label: 'Ativos' },
  { value: 'inativos', label: 'Inativos' },
] as const

type StatusFiltro = typeof STATUS_OPCOES[number]['value']

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
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools, pessoaId } = useAuth()
  const router = useRouter()
  const [pessoas, setPessoas] = useState<Person[]>([])
  const [basePessoas, setBasePessoas] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [perfilFiltro, setPerfilFiltro] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editPerson, setEditPerson] = useState<Person | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [inativando, setInativando] = useState<string | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('todos')
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const editUrlProcessed = useRef(false)

  const effectiveSchoolId = isSuperAdmin ? selectedSchoolId : schoolId

  useEffect(() => {
    const stored = sessionStorage.getItem('usuarios_search')
    if (stored) {
      setSearch(stored)
      sessionStorage.removeItem('usuarios_search')
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(pessoas.length / ITEMS_PER_PAGE))
  const paginatedPessoas = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return pessoas.slice(start, start + ITEMS_PER_PAGE)
  }, [pessoas, currentPage])

  const filtrosAtivos = search.trim() !== '' || perfilFiltro !== '' || statusFiltro !== 'todos'

  const limparFiltros = () => {
    setSearch('')
    setPerfilFiltro('')
    setStatusFiltro('todos')
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [search, perfilFiltro, statusFiltro, selectedSchoolId])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const loadPessoas = useCallback(async () => {
    if (isSuperAdmin && !selectedSchoolId) {
      setPessoas([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const mostrarInativos = statusFiltro !== 'ativos'
      const data = await getPeople(effectiveSchoolId, search || undefined, perfilFiltro || undefined, mostrarInativos)
      setPessoas(statusFiltro === 'inativos' ? data.filter(p => !p.ativo) : data)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [effectiveSchoolId, isSuperAdmin, selectedSchoolId, search, perfilFiltro, statusFiltro])

  useEffect(() => { loadPessoas() }, [loadPessoas])

  const loadKpis = useCallback(async () => {
    if (isSuperAdmin && !selectedSchoolId) {
      setBasePessoas([])
      return
    }
    try {
      const data = await getPeople(effectiveSchoolId, undefined, undefined, true)
      setBasePessoas(data)
    } catch {
      // KPIs são acessórios: falha silenciosa mantém zeros
    }
  }, [effectiveSchoolId, isSuperAdmin, selectedSchoolId])

  useEffect(() => { loadKpis() }, [loadKpis])

  const kpis = useMemo(() => {
    const ativos = basePessoas.filter(p => p.ativo)
    const temPerfil = (p: Person, perfis: string[]) => (p.perfil || []).some(x => perfis.includes(x))
    return {
      total: ativos.length,
      alunos: ativos.filter(p => temPerfil(p, ['aluno'])).length,
      profissionais: ativos.filter(p => temPerfil(p, ['profissional', 'gestor'])).length,
      responsaveis: ativos.filter(p => temPerfil(p, ['responsavel'])).length,
    }
  }, [basePessoas])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(deleteTarget.id)
    try {
      await deletePerson(deleteTarget.id, pessoaId)
      toast.success('Usuário excluído permanentemente')
      setDeleteTarget(null)
      loadPessoas()
      loadKpis()
    } catch {
      toast.error('Erro ao excluir usuário')
    } finally {
      setDeleting(null)
    }
  }

  const handleInativar = async (id: string) => {
    setInativando(id)
    try {
      await inativarPessoa(id, pessoaId)
      toast.success('Usuário inativado')
      loadPessoas()
      loadKpis()
    } catch {
      toast.error('Erro ao inativar usuário')
    } finally {
      setInativando(null)
    }
  }

  const handleReativar = async (id: string) => {
    setInativando(id)
    try {
      await reativarPessoa(id, pessoaId)
      toast.success('Usuário reativado')
      loadPessoas()
      loadKpis()
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

  useEffect(() => {
    if (editUrlProcessed.current) return
    const editFromUrl = new URLSearchParams(window.location.search).get('edit')
    if (!editFromUrl) return
    const pessoa = pessoas.find((p) => p.id === editFromUrl)
    if (pessoa) {
      editUrlProcessed.current = true
      setEditPerson(pessoa)
      setModalOpen(true)
    } else if (pessoas.length > 0) {
      getPerson(editFromUrl, isSuperAdmin ? null : schoolId)
        .then((p) => {
          if (p) {
            editUrlProcessed.current = true
            setEditPerson(p)
            setModalOpen(true)
          }
        })
        .catch(() => {})
    }
  }, [pessoas])

  const handleSaved = () => {
    setModalOpen(false)
    setEditPerson(null)
    loadPessoas()
    loadKpis()
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
          icon={Users}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} value={kpis.total} label="Usuários Ativos" />
          <StatCard icon={GraduationCap} value={kpis.alunos} label="Alunos Ativos" variant="warning" />
          <StatCard icon={Briefcase} value={kpis.profissionais} label="Profissionais / Gestores Ativos" variant="success" />
          <StatCard icon={HeartHandshake} value={kpis.responsaveis} label="Responsáveis Ativos" variant="default" />
        </div>

        <PageSection variant="compact" title="Filtros" className="mb-6">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome..."
          >
            {isSuperAdmin && allSchools.length > 0 && (
              <Select
                value={selectedSchoolId ?? ''}
                onValueChange={(v) => setSelectedSchoolId(v || null)}
              >
                <SelectTrigger className="w-auto min-w-[180px] h-9">
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  {allSchools.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Tipo</Label>
              <div className="flex gap-2 flex-wrap">
                {PERFIS.map(p => (
                  <ClickablePill
                    key={p.value}
                    label={p.label}
                    active={perfilFiltro === p.value}
                    onClick={() => setPerfilFiltro(p.value)}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPCOES.map(s => (
                  <ClickablePill
                    key={s.value}
                    label={s.label}
                    active={statusFiltro === s.value}
                    onClick={() => setStatusFiltro(s.value)}
                  />
                ))}
              </div>
            </div>
          </FilterBar>
        </PageSection>

        {isSuperAdmin && !selectedSchoolId ? (
          <Card className="shadow-sm">
            <EmptyState
              icon={School}
              title="Selecione uma escola"
              description="Escolha uma unidade escolar no filtro acima para listar os usuários."
            />
          </Card>
        ) : loading ? (
          <Card className="shadow-sm">
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </Card>
        ) : pessoas.length === 0 ? (
          <Card className="shadow-sm">
            {filtrosAtivos ? (
              <EmptyState
                icon={Users}
                title="Nenhum resultado para os filtros aplicados"
                description="Tente ajustar a busca ou os filtros para encontrar usuários."
                action={
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                }
              />
            ) : (
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
            )}
          </Card>
        ) : (
          <PageSection variant="flush" title={`${pessoas.length} usuário(s)`} actions={
            <Button onClick={handleCreate} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          }>
            {/* Mobile: lista de cards (PE-602) */}
            <ul className="block md:hidden space-y-3 p-4">
              {paginatedPessoas.map((pessoa) => (
                <li
                  key={pessoa.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground truncate">
                        {pessoa.codigo_pessoa ? (
                          <span className="text-[13px] font-medium text-muted-foreground tabular-nums mr-1.5">#{pessoa.codigo_pessoa}</span>
                        ) : null}
                        {pessoa.nome_completo}
                      </p>
                    </div>
                    <StatusBadge
                      status={pessoa.ativo ? 'success' : 'destructive'}
                      className="shrink-0"
                    >
                      {pessoa.ativo ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground tabular-nums mb-3">
                    <CopyChip raw={pessoa.cpf} display={formatCpf(pessoa.cpf)} />
                    <CopyChip raw={pessoa.inep_id} display={pessoa.inep_id ? `INEP ${pessoa.inep_id}` : '—'} />
                  </div>
                  {(pessoa.perfil || []).length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-4">
                      {(pessoa.perfil || []).map(p => (
                        <StatusBadge key={p} status={perfilStatusMap[p] || 'muted'}>
                          {perfilLabels[p] || p}
                        </StatusBadge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pessoa)}
                      className="flex-1 min-h-[44px]"
                    >
                      <Pencil className="mr-1.5 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(pessoa)}
                      disabled={deleting === pessoa.id}
                      className="flex-1 min-h-[44px] text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop: tabela */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted text-foreground w-[80px]">ID</TableHead>
                    <TableHead className="bg-muted text-foreground">Nome Completo</TableHead>
                    <TableHead className="bg-muted text-foreground">CPF</TableHead>
                    <TableHead className="bg-muted text-foreground">INEP</TableHead>
                    <TableHead className="bg-muted text-foreground">Tipo</TableHead>
                    <TableHead className="bg-muted text-foreground">Status</TableHead>
                    <TableHead className="bg-muted text-foreground w-[90px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPessoas.map((pessoa) => (
                    <TableRow key={pessoa.id}>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {pessoa.codigo_pessoa ? `#${pessoa.codigo_pessoa}` : '—'}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">{pessoa.nome_completo}</span>
                      </TableCell>
                      <TableCell><CopyChip raw={pessoa.cpf} display={formatCpf(pessoa.cpf)} /></TableCell>
                      <TableCell><CopyChip raw={pessoa.inep_id} display={pessoa.inep_id || '—'} /></TableCell>
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
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={pessoas.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </PageSection>
        )}
      </PageContainer>

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditPerson(null) }}}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-[20px] font-semibold">{editPerson ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            <DialogDescription>
              {editPerson ? 'Edite os dados cadastrais.' : 'Preencha os dados cadastrais (Registro 30 INEP).'}
            </DialogDescription>
          </DialogHeader>
          <PessoaForm
            schoolId={effectiveSchoolId ?? null}
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
