'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Building2, ChevronLeft } from 'lucide-react'
import { getFuncoes, createFuncao, updateFuncao, deleteFuncao, inicializarFuncoesPadrao, type FuncaoProfissional } from '@/lib/actions/funcoes-profissionais'
import { CENSO_FUNCOES } from '@/data/funcoes-censo'
import { toast } from 'sonner'

export default function FuncoesPage() {
  const { user, loading: authLoading, schoolId } = useAuth()
  const router = useRouter()
  const [funcoes, setFuncoes] = useState<FuncaoProfissional[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<FuncaoProfissional | null>(null)
  const [formNome, setFormNome] = useState('')
  const [formTipoCenso, setFormTipoCenso] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!schoolId) return
    inicializarFuncoesPadrao(schoolId).catch(() => { /* já existem */ })
  }, [schoolId])

  useEffect(() => {
    if (!schoolId) return
    loadFuncoes()
  }, [schoolId])

  const loadFuncoes = async () => {
    if (!schoolId) return
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

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta função permanentemente?')) return
    try {
      await deleteFuncao(id)
      toast.success('Função excluída')
      loadFuncoes()
    } catch {
      toast.error('Erro ao excluir')
    }
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
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/gestao-usuarios/usuarios')} className="hover:bg-muted">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Funções</h1>
                <p className="text-muted-foreground mt-1">
                  Cadastro de funções profissionais vinculadas ao Censo INEP
                </p>
              </div>
            </div>
          </div>
          <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary/90 animate-fade-in-up">
            <Plus className="mr-2 h-4 w-4" /> Nova Função
          </Button>
        </div>

        <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Funções cadastradas ({funcoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Carregando...</div>
            ) : funcoes.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Nenhuma função cadastrada. Clique em "Nova Função".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-medium">Nome</th>
                      <th className="text-left px-6 py-3 font-medium">Tipo Censo INEP</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                      <th className="text-right px-6 py-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcoes.map(f => {
                      const censo = CENSO_FUNCOES.find(c => c.codigo === f.tipo_censo)
                      return (
                        <tr key={f.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">{f.nome}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {censo ? `Campo ${censo.codigo} - ${censo.nome}` : f.tipo_censo || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${f.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                              {f.ativo ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(f)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(f.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
    </>
  )
}
