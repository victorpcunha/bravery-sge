'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { Plus, DoorOpen, GraduationCap, Pencil, Trash2 } from 'lucide-react'
import { getMatriculas, deleteMatricula } from '@/lib/actions/matriculas'
import { getTurmasAtivas } from '@/lib/actions/matriculas'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { useTabActive } from '@/lib/tab-params'
import { labelSituacaoMatricula, variantSituacaoMatricula, SITUACOES_MATRICULA } from '@/lib/situacoes-matricula'
import { toast } from 'sonner'

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('T')[0].split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y}`
}

function mapSituacao(status: string) {
  return variantSituacaoMatricula(status)
}

const SITUACOES = Object.values(SITUACOES_MATRICULA)

export default function AlunosMatriculadosPage() {
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading, pessoaId } = useAuth()
  const router = useRouter()
  const [matriculas, setMatriculas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [situacaoFilter, setSituacaoFilter] = useState('__all__')
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmaFiltro, setTurmaFiltro] = useState('__all__')
  const [turmas, setTurmas] = useState<any[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const tabActive = useTabActive()

  useEffect(() => { if (!authLoading && !user) router.push('/login') }, [user, authLoading, router])

  const effectiveSchoolId = selectedSchoolId || schoolId

  useEffect(() => {
    if (isSuperAdmin && allSchools.length > 0 && !selectedSchoolId) return
    if (!effectiveSchoolId) { setLoading(false); return }
    getAnosLetivosAtivos(effectiveSchoolId).then(anos => {
      setAnosLetivos(anos)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setAnoLetivoFiltro(ativo.id)
      else if (anos.length > 0) setAnoLetivoFiltro(anos[0].id)
    })
  }, [effectiveSchoolId, isSuperAdmin, allSchools, selectedSchoolId])

  const loadMatriculas = useCallback(async () => {
    if (!effectiveSchoolId) return
    setLoading(true)
    try {
      const data = await getMatriculas(effectiveSchoolId, {
        ano_letivo_id: anoLetivoFiltro || undefined,
        turma_id: turmaFiltro !== '__all__' ? turmaFiltro : undefined,
      })
      setMatriculas(data)
    } catch { toast.error('Erro ao carregar matrículas') }
    finally { setLoading(false) }
  }, [effectiveSchoolId, anoLetivoFiltro, turmaFiltro])

  useEffect(() => {
    if (!effectiveSchoolId || !anoLetivoFiltro) { setTurmas([]); return }
    getTurmasAtivas(effectiveSchoolId, anoLetivoFiltro)
      .then(t => {
        setTurmas(t)
        setTurmaFiltro(prev => (prev !== '__all__' && !t.some((x: any) => x.id === prev)) ? '__all__' : prev)
      })
      .catch(() => setTurmas([]))
  }, [effectiveSchoolId, anoLetivoFiltro])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMatricula(deleteTarget, pessoaId || '')
      toast.success('Vínculo excluído')
      setDeleteTarget(null)
      loadMatriculas()
    } catch (e: any) { toast.error(e.message || 'Erro ao excluir vínculo') }
  }

  useEffect(() => {
    if (tabActive) loadMatriculas()
  }, [tabActive, loadMatriculas])

  const filtered = matriculas.filter(m => {
    const nome = m.aluno?.nome_completo || m.pessoa?.nome_completo || ''
    if (search && !nome.toLowerCase().includes(search.toLowerCase())) return false
    if (situacaoFilter !== '__all__' && labelSituacaoMatricula(m.situacao || 'Ativo') !== situacaoFilter) return false
    return true
  })

  if (authLoading) {
    return <PageContainer><div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div></PageContainer>
  }

  return (
    <PageContainer>
      <PageHeader
        icon={GraduationCap}
        title="Alunos Matriculados"
        description="Gerencie as matrículas dos alunos nas turmas"
      />

      <PageSection variant="compact" title="Filtros" className="mb-6">
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nome do aluno..." searchClassName="flex-none w-64">
          {isSuperAdmin && allSchools.length > 0 && (
            <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v || null); setAnoLetivoFiltro(''); setTurmaFiltro('__all__') }}>
              <SelectTrigger className="w-auto min-w-[200px] h-9 border-border">
                <SelectValue placeholder="Selecione uma Escola" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </FilterBar>
        <div className="flex items-end gap-4 flex-wrap mt-3">
          {anosLetivos.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
            <Select value={anoLetivoFiltro} onValueChange={setAnoLetivoFiltro}>
              <SelectTrigger className="w-auto min-w-[140px] h-9 border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>)}
              </SelectContent>
            </Select>
            </div>
          )}
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Turma</Label>
          <Select value={turmaFiltro} onValueChange={setTurmaFiltro}>
            <SelectTrigger className="w-auto min-w-[180px] h-9 border-border">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas</SelectItem>
              {turmas.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Situação</Label>
          <Select value={situacaoFilter} onValueChange={setSituacaoFilter}>
            <SelectTrigger className="w-auto min-w-[140px] h-9 border-border">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas</SelectItem>
              {SITUACOES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          </div>
        </div>
      </PageSection>

      {isSuperAdmin && !selectedSchoolId ? (
        <Card className="shadow-sm"><CardContent className="py-16"><EmptyState icon={DoorOpen} title="Selecione uma Escola" description="Escolha uma escola para ver as matrículas." /></CardContent></Card>
      ) : loading ? (
        <Card className="shadow-sm"><CardContent className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}</CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card className="shadow-sm"><CardContent className="py-16"><EmptyState icon={DoorOpen} title={search ? 'Nenhum aluno encontrado' : 'Nenhuma matrícula'} description={search ? 'Tente outro nome.' : 'Cadastre a primeira matrícula.'} action={<Link href="/gestao-academica/matriculas/cadastro"><Button><Plus className="mr-2 h-4 w-4" />Nova Matrícula</Button></Link>} /></CardContent></Card>
      ) : (
        <PageSection variant="flush" title={`${filtered.length} aluno(s) matriculado(s)`} actions={
          <Link href="/gestao-academica/matriculas/cadastro"><Button size="sm"><Plus className="mr-2 h-4 w-4" />Nova Matrícula</Button></Link>
        }>
          {/* Mobile: lista de cards */}
          <ul className="block md:hidden space-y-3 p-4">
            {filtered.map(m => {
              const status = labelSituacaoMatricula(m.situacao || 'Ativo')
              return (
                <li key={m.id} className="rounded-lg border border-border bg-card p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-foreground truncate">
                        {m.codigo_matricula != null ? (
                          <span className="text-[13px] font-medium text-muted-foreground tabular-nums mr-1.5">#{m.codigo_matricula}</span>
                        ) : null}
                        {m.aluno?.nome_completo || m.pessoa?.nome_completo}
                      </p>
                    </div>
                    <StatusBadge status={mapSituacao(status)} className="shrink-0">{status}</StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground tabular-nums mb-3">
                    <span>{m.turma?.nome || '—'}</span>
                    <span>{m.etapa?.etapa_nome || '—'}</span>
                    <span>{formatDate(m.data_matricula)}</span>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <Button variant="outline" size="sm" asChild className="flex-1 min-h-[44px]">
                      <Link href={`/gestao-academica/matriculas/cadastro?id=${m.id}`}>
                        <Pencil className="mr-1.5 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(m.id)}
                      className="flex-1 min-h-[44px] text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted text-foreground w-[80px]">ID</TableHead>
                <TableHead className="bg-muted text-foreground">Aluno</TableHead>
                <TableHead className="bg-muted text-foreground">Turma</TableHead>
                <TableHead className="bg-muted text-foreground">Etapa</TableHead>
                <TableHead className="bg-muted text-foreground">Data Matrícula</TableHead>
                <TableHead className="bg-muted text-foreground">Situação</TableHead>
                <TableHead className="bg-muted text-foreground w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => {
                const status = labelSituacaoMatricula(m.situacao || 'Ativo')
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono tabular-nums text-muted-foreground">{m.codigo_matricula ?? '—'}</TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{m.aluno?.nome_completo || m.pessoa?.nome_completo}</span>
                      {m.aluno?.cpf && <span className="text-[11px] text-muted-foreground block">CPF: {m.aluno.cpf}</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.turma?.nome || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{m.etapa?.etapa_nome || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(m.data_matricula)}</TableCell>
                    <TableCell><StatusBadge status={mapSituacao(status)}>{status}</StatusBadge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/gestao-academica/matriculas/cadastro?id=${m.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(m.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </div>
        </PageSection>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Excluir vínculo acadêmico"
        description="Tem certeza que deseja excluir este vínculo permanentemente? A movimentação vinculada também será excluída."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </PageContainer>
  )
}
