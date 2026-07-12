'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Plus, GraduationCap, Calendar, Trash2, Eye } from 'lucide-react'
import { getQuadrosAulas, getAnosLetivosAtivos, deleteQuadroAula } from '@/lib/actions/quadro-aulas'
import { toast } from 'sonner'

const STATUS_MAP: Record<string, { label: string; status: 'success' | 'muted' | 'info' | 'destructive' }> = {
  futuro: { label: 'Futuro', status: 'info' },
  ativo: { label: 'Ativo', status: 'success' },
  inativo: { label: 'Inativo', status: 'muted' },
  encerrado: { label: 'Encerrado', status: 'destructive' },
}

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

export default function QuadrosAulasPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const { pessoaId } = usePermissoes(schoolId)
  const [quadros, setQuadros] = useState<any[]>([])
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [anoFiltro, setAnoFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
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
    getAnosLetivosAtivos(effectiveSchoolId).then(anos => {
      setAnosLetivos(anos)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setAnoFiltro(ativo.id)
    }).catch(() => {})
  }, [schoolId, selectedSchoolId, isSuperAdmin, allSchools])

  const effectiveSchoolId = selectedSchoolId || schoolId

  const loadQuadros = useCallback(async () => {
    const school = effectiveSchoolId
    if (!school) return
    setLoading(true)
    try {
      const data = await getQuadrosAulas(school, anoFiltro || undefined)
      setQuadros(data)
    } catch {
      toast.error('Erro ao carregar quadros de aulas')
    } finally {
      setLoading(false)
    }
  }, [effectiveSchoolId, anoFiltro])

  useEffect(() => {
    loadQuadros()
  }, [loadQuadros])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteQuadroAula(deleteId, pessoaId)
      toast.success('Quadro excluído')
      setDeleteId(null)
      loadQuadros()
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao excluir quadro')
    }
  }

  const filteredQuadros = search
    ? quadros.filter((q: any) =>
        q.turma?.nome?.toLowerCase().includes(search.toLowerCase()) ||
        q.turma?.codigo_inep?.toLowerCase().includes(search.toLowerCase())
      )
    : quadros

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
    <>
      <PageContainer>
        <PageHeader
          icon={GraduationCap}
          title="Quadro de Aulas"
          description="Grade horária das turmas"
        />

        <PageSection variant="compact" title="Filtros" className="mb-6">
          <FilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome da turma..."
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
                  {allSchools.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {anosLetivos.length > 0 && (
              <Select value={anoFiltro} onValueChange={setAnoFiltro}>
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
        ) : filteredQuadros.length === 0 ? (
          <Card className="shadow-sm">
            <EmptyState
              icon={GraduationCap}
              title={search ? 'Nenhum quadro encontrado' : 'Nenhum quadro de aulas encontrado'}
              description={search ? 'Tente com outro nome de turma.' : 'Crie um novo quadro de aulas para organizar a grade horária da sua escola.'}
              action={
                <Button onClick={() => router.push('/gestao-turmas/quadro-aulas/cadastro')}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Quadro de Aula
                </Button>
              }
            />
          </Card>
        ) : (
          <PageSection variant="flush" title={`${filteredQuadros.length} quadro(s)`} actions={
            <Button onClick={() => router.push('/gestao-turmas/quadro-aulas/cadastro')} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Novo Quadro de Aula
            </Button>
          }>
            <div className="px-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Ano Letivo</TableHead>
                    <TableHead>Vigência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Alteração</TableHead>
                    <TableHead className="w-[90px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuadros.map((q: any) => {
                    const st = STATUS_MAP[q.status] || STATUS_MAP.futuro
                    return (
                      <TableRow key={q.id}>
                        <TableCell>
                          <span className="font-medium text-foreground">
                            {q.turma?.codigo_inep ? `${q.turma.codigo_inep} - ` : ''}{q.turma?.nome}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{q.academico_anos_letivos?.descricao}</TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(q.data_inicial)} - {formatDate(q.data_final)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={st.status}>{st.label}</StatusBadge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {q.updated_at ? new Date(q.updated_at).toLocaleString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <Button variant="ghost" size="icon-sm"
                              onClick={() => router.push(`/gestao-turmas/quadro-aulas/cadastro?id=${q.id}`)}
                              title="Visualizar/Editar">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm"
                              onClick={() => setDeleteId(q.id)}
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
            </div>
          </PageSection>
        )}
      </PageContainer>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir quadro de aulas"
        description="Excluir este quadro de aulas permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  )
}
