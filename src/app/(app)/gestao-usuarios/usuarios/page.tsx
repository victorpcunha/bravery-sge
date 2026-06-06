'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, ToggleLeft, RotateCcw, UserCheck, Search, Users } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
import { getPeople, deletePerson, inativarPessoa, reativarPessoa, type Person } from '@/lib/actions/people'
import { PessoaForm } from './PessoaForm'
import { toast } from 'sonner'

const perfilLabels: Record<string, string> = {
  aluno: 'Aluno',
  profissional: 'Profissional',
  gestor: 'Gestor',
  responsavel: 'Responsável',
}

const perfilColors: Record<string, string> = {
  aluno: 'bg-warning/10 text-warning',
  profissional: 'bg-primary/10 text-primary',
  gestor: 'bg-accent/10 text-accent',
  responsavel: 'bg-success/10 text-success',
}

const PERFIS = [
  { value: '', label: 'Todos' },
  { value: 'aluno', label: 'Aluno' },
  { value: 'profissional', label: 'Profissional' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'responsavel', label: 'Responsável' },
]

export default function UsuariosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [schoolId, setSchoolId] = useState('')
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

  useEffect(() => {
    if (!user) return
    getFirstSchool().then(s => setSchoolId(s.id)).catch(() => {})
  }, [user])

  const loadPessoas = useCallback(async () => {
    if (!schoolId) return
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

  if (authLoading || !schoolId) {
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
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-1">
              Cadastro único de usuários (Registro 30 INEP)
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 animate-fade-in-up">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-fade-in-up">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-10 [&_[data-slot='input']]:border-slate-300"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {PERFIS.map(p => (
                <Button
                  key={p.value}
                  variant={perfilFiltro === p.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPerfilFiltro(p.value)}
                  className={perfilFiltro === p.value ? '' : 'border-slate-300'}
                >
                  {p.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant={mostrarInativos ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMostrarInativos(v => !v)}
                className={mostrarInativos ? '' : 'border-slate-300'}
              >
                <ToggleLeft className="mr-1.5 h-3.5 w-3.5" />
                {mostrarInativos ? 'Ocultar inativos' : 'Mostrar inativos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        {loading ? (
          <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-fade-in-up">
            <CardContent className="py-12">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : pessoas.length === 0 ? (
          <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-fade-in-up">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum usuário cadastrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Cadastre usuários para registrar no Censo INEP 2026.
              </p>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pessoas.map((pessoa, index) => (
              <Card
                key={pessoa.id}
                className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-200 animate-fade-in-up cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
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
                          <Badge key={p} className={`${perfilColors[p] || ''} border-0`}>
                            {perfilLabels[p] || p}
                          </Badge>
                        ))}
                        {!pessoa.ativo && (
                          <Badge className="bg-slate-200 text-slate-500 border-0">Inativo</Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(pessoa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {pessoa.ativo ? (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleInativar(pessoa.id)} disabled={inativando === pessoa.id}>
                          <ToggleLeft className="h-4 w-4 text-amber-600" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon-sm" onClick={() => handleReativar(pessoa.id)} disabled={inativando === pessoa.id}>
                          <RotateCcw className="h-4 w-4 text-green-600" />
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

        <div className="mt-6 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Total: {pessoas.length} usuário(s)</h4>
              <p className="text-sm text-muted-foreground">
                Dados enviados ao Censo INEP 2026 (Registro 30 - 110 campos)
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

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