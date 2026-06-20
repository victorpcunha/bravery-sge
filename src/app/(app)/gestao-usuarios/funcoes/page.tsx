'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { getFuncoes, createFuncao, updateFuncao, deleteFuncao, inicializarFuncoesPadrao, type FuncaoProfissional } from '@/lib/actions/funcoes-profissionais'
import { CENSO_FUNCOES } from '@/data/funcoes-censo'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'

export default function FuncoesPage() {
  const { user, loading: authLoading, schoolId } = useAuth()
  const router = useRouter()
  const [funcoes, setFuncoes] = useState<FuncaoProfissional[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<FuncaoProfissional | null>(null)
  const [formNome, setFormNome] = useState('')
  const [formTipoCenso, setFormTipoCenso] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    inicializarFuncoesPadrao(schoolId).catch(() => { /* já existem */ })
  }, [schoolId])

  useEffect(() => {
    loadFuncoes()
  }, [schoolId])

  const loadFuncoes = async () => {
    setLoading(true)
    try {
      const data = await getFuncoes(schoolId, false)
      setFuncoes(data)
    } catch {
      toast.error('Erro ao carregar funções')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenNew = () => {
    setEditItem(null)
    setFormNome('')
    setFormTipoCenso('')
    setModalOpen(true)
  }

  const handleOpenEdit = (f: FuncaoProfissional) => {
    setEditItem(f)
    setFormNome(f.nome)
    setFormTipoCenso(f.tipo_censo || '')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formNome.trim()) { toast.error('Nome é obrigatório'); return }
    try {
      if (editItem) {
        await updateFuncao(editItem.id, { nome: formNome.trim(), tipo_censo: formTipoCenso || null })
        toast.success('Função atualizada!')
      } else {
        await createFuncao({ nome: formNome.trim(), tipo_censo: formTipoCenso || null, school_id: schoolId! })
        toast.success('Função criada!')
      }
      setModalOpen(false)
      loadFuncoes()
    } catch (err: any) {
      toast.error('Erro: ' + (err?.message || 'desconhecido'))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteFuncao(deleteId)
      toast.success('Função excluída')
      loadFuncoes()
    } catch {
      toast.error('Erro ao excluir')
    } finally {
      setDeleteId(null)
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-24">
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
          title="Funções"
          description="Cadastro de funções profissionais vinculadas ao Censo INEP"
          icon={Building2}
          breadcrumbs={[
            { label: 'Gestão de Usuários', href: '/gestao-usuarios/usuarios' },
            { label: 'Funções' }
          ]}
          actions={<Button onClick={handleOpenNew}><Plus className="mr-2 h-4 w-4" /> Nova Função</Button>}
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : funcoes.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nenhuma função cadastrada"
            description="Clique em 'Nova Função' para adicionar."
            action={<Button onClick={handleOpenNew}><Plus className="mr-2 h-4 w-4" /> Nova Função</Button>}
          />
        ) : (
          <PageSection variant="flush" title={`Funções cadastradas (${funcoes.length})`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase tracking-wider">Nome</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Tipo Censo INEP</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcoes.map(f => {
                  const censo = CENSO_FUNCOES.find(c => c.codigo === f.tipo_censo)
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.nome}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {censo ? `Campo ${censo.codigo} - ${censo.nome}` : f.tipo_censo || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={f.ativo ? 'success' : 'muted'}>
                          {f.ativo ? 'Ativa' : 'Inativa'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(f)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(f.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </PageSection>
        )}
      </PageContainer>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Editar Função' : 'Nova Função'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Função *</Label>
              <Input value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="Ex: Porteiro" />
            </div>
            <div className="space-y-2">
              <Label>Tipo Censo INEP (Registro 10)</Label>
              <Select value={formTipoCenso} onValueChange={setFormTipoCenso}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo censo (opcional)" /></SelectTrigger>
                <SelectContent>
                  {CENSO_FUNCOES.map(c => (
                    <SelectItem key={c.codigo} value={c.codigo}>
                      Campo {c.codigo} - {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Opcional. Vincule esta função ao campo do Censo INEP para contabilização automática.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editItem ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir função"
        description="Deseja excluir esta função permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}