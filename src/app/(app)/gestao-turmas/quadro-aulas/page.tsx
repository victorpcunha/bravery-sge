'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, GraduationCap, Calendar, Pencil, Trash2, Eye } from 'lucide-react'
import { getQuadrosAulas, getAnosLetivosAtivos, deleteQuadroAula, toggleQuadroAulaAtivo } from '@/lib/actions/quadro-aulas'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'

const STATUS_MAP: Record<string, { label: string; status: 'success' | 'muted' | 'info' | 'destructive' }> = {
  futuro: { label: 'Futuro', status: 'info' },
  ativo: { label: 'Ativo', status: 'success' },
  inativo: { label: 'Inativo', status: 'muted' },
  encerrado: { label: 'Encerrado', status: 'destructive' },
}

const DIAS_NOME = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

export default function QuadrosAulasPage() {
  const { user, loading: authLoading, schoolId } = useAuth()
  const router = useRouter()
  const { pessoaId } = usePermissoes(schoolId)
  const [quadros, setQuadros] = useState<any[]>([])
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoFiltro, setAnoFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    getAnosLetivosAtivos(schoolId).then(anos => {
      setAnosLetivos(anos)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setAnoFiltro(ativo.id)
    }).catch((e) => {
      console.error('Erro init listagem:', e)
    })
  }, [schoolId])

  useEffect(() => {
    loadQuadros()
  }, [schoolId])

  const loadQuadros = async () => {
    setLoading(true)
    try {
      const data = await getQuadrosAulas(schoolId, anoFiltro || undefined)
      setQuadros(data)
    } catch (e) {
      console.error('Erro loadQuadros:', e)
      toast.error('Erro ao carregar quadros de aulas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuadros()
  }, [anoFiltro])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este quadro de aulas?')) return
    try {
      await deleteQuadroAula(id, pessoaId)
      toast.success('Quadro excluído')
      loadQuadros()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir quadro')
    }
  }

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      await toggleQuadroAulaAtivo(id, ativo, pessoaId)
      toast.success(ativo ? 'Quadro reativado' : 'Quadro inativado')
      loadQuadros()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao alterar status')
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={GraduationCap}
        title="Quadro de Aulas"
        description="Grade horária das turmas"
        actions={
          <Button onClick={() => router.push('/gestao-turmas/quadro-aulas/cadastro')}>
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Quadro de Aula
          </Button>
        }
      />

      <PageSection
        title="Quadros cadastrados"
        variant="flush"
        actions={
          <Select value={anoFiltro} onValueChange={setAnoFiltro}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por ano letivo" />
            </SelectTrigger>
            <SelectContent>
              {anosLetivos.map((ano: any) => (
                <SelectItem key={ano.id} value={ano.id}>{ano.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : quadros.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Nenhum quadro de aulas encontrado"
            description="Crie um novo quadro de aulas para organizar a grade horária da sua escola."
            action={
              <Button onClick={() => router.push('/gestao-turmas/quadro-aulas/cadastro')}>
                <Plus className="h-4 w-4 mr-1.5" />
                Novo Quadro de Aula
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Ano Letivo</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Alteração</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quadros.map((q: any) => {
                const st = STATUS_MAP[q.status] || STATUS_MAP.futuro
                return (
                  <TableRow key={q.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {q.turma?.codigo_inep ? `${q.turma.codigo_inep} - ` : ''}{q.turma?.nome}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{q.academico_anos_letivos?.descricao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(q.data_inicial)} - {formatDate(q.data_final)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={st.status}>{st.label}</StatusBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {q.updated_at ? new Date(q.updated_at).toLocaleString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => router.push(`/gestao-turmas/quadro-aulas/cadastro?id=${q.id}`)}
                          title="Visualizar/Editar">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => handleToggleAtivo(q.id, !q.ativo)}
                          title={q.ativo ? 'Inativar' : 'Reativar'}>
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => handleDelete(q.id)}
                          title="Excluir">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </PageSection>
    </PageContainer>
  )
}
