'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Pencil, Trash2, ClipboardList, AlertCircle } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
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
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [schoolId, setSchoolId] = useState('')
  const [metodos, setMetodos] = useState<MetodoAvaliacao[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    const init = async () => {
      try {
        const school = await getFirstSchool()
        setSchoolId(school.id)
      } catch (err) {
        console.error('Erro ao carregar escola:', err)
      }
    }
    init()
  }, [user])

  const loadMetodos = useCallback(async () => {
    if (!schoolId) return
    setLoading(true)
    try {
      const data = await getMetodos(schoolId)
      setMetodos(data)
    } catch (err) {
      console.error('Erro ao carregar métodos:', err)
      toast.error('Erro ao carregar métodos de avaliação')
    } finally {
      setLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    loadMetodos()
  }, [loadMetodos])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este método de avaliação?')) return
    setDeleting(id)
    try {
      await deleteMetodo(id)
      toast.success('Método excluído com sucesso')
      loadMetodos()
    } catch (err) {
      console.error('Erro ao excluir:', err)
      toast.error('Erro ao excluir método')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (id: string) => {
    setEditId(id)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditId(null)
    setModalOpen(true)
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditId(null)
    loadMetodos()
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
            <h1 className="text-3xl font-bold text-foreground">Métodos de Avaliação</h1>
            <p className="text-muted-foreground mt-1">
              Configure os critérios de avaliação para as matrizes curriculares
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 transition-all duration-200 animate-fade-in-up">
            <Plus className="mr-2 h-4 w-4" />
            Novo Método de Avaliação
          </Button>
        </div>

        {loading ? (
          <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-fade-in-up">
            <CardContent className="py-12">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : metodos.length === 0 ? (
          <Card className="border-border shadow-sm card-glass animate-fade-in-up">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum método cadastrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Crie um método de avaliação para definir os critérios que serão utilizados nas matrizes curriculares.
              </p>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                Novo Método de Avaliação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] animate-fade-in-up">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Critério Frequência</TableHead>
                    <TableHead>Frequência Mínima</TableHead>
                    <TableHead>Tipos de Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metodos.map((metodo) => (
                    <TableRow key={metodo.id}>
                      <TableCell className="font-medium">{metodo.nome}</TableCell>
                      <TableCell>
                        {metodo.criterio_frequencia === 'por_dia' ? 'Por Dia Letivo' : 'Por Aula Dada'}
                      </TableCell>
                      <TableCell>{metodo.frecuencia_minima}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(metodo.tipos_avaliacao || {}).map(([key, val]) =>
                            val ? (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {tipoLabels[key] || key}
                              </Badge>
                            ) : null
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={metodo.ativo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                          {metodo.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(metodo.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(metodo.id)} disabled={deleting === metodo.id}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Editar Método de Avaliação' : 'Novo Método de Avaliação'}</DialogTitle>
            <DialogDescription>
              Configure todos os critérios e regras para este método de avaliação.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <MetodosForm
              schoolId={schoolId}
              editId={editId}
              onSaved={handleSaved}
              onCancel={() => setModalOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
