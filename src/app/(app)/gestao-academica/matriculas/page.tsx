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
import { Plus, DoorOpen, GraduationCap, Pencil } from 'lucide-react'
import { getMatriculas } from '@/lib/actions/matriculas'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
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
  const { user, schoolId, isSuperAdmin, allSchools, loading: authLoading } = useAuth()
  const router = useRouter()
  const [matriculas, setMatriculas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [situacaoFilter, setSituacaoFilter] = useState('__all__')
  const [anoLetivoFiltro, setAnoLetivoFiltro] = useState('')
  const [anosLetivos, setAnosLetivos] = useState<any[]>([])

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
      const data = await getMatriculas(effectiveSchoolId, { ano_letivo_id: anoLetivoFiltro || undefined })
      setMatriculas(data)
    } catch { toast.error('Erro ao carregar matrículas') }
    finally { setLoading(false) }
  }, [effectiveSchoolId, anoLetivoFiltro])

  useEffect(() => { loadMatriculas() }, [loadMatriculas])

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
        <FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar por nome do aluno...">
          {isSuperAdmin && allSchools.length > 0 && (
            <Select value={selectedSchoolId ?? ''} onValueChange={(v) => { setSelectedSchoolId(v || null); setAnoLetivoFiltro('') }}>
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
          <div className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Data Matrícula</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[90px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(m => {
                  const status = labelSituacaoMatricula(m.situacao || 'Ativo')
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <span className="font-medium text-foreground">{m.aluno?.nome_completo || m.pessoa?.nome_completo}</span>
                        {m.aluno?.cpf && <span className="text-[11px] text-muted-foreground block">CPF: {m.aluno.cpf}</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{m.turma?.nome || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{m.etapa_ensino?.etapa_nome || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(m.data_matricula)}</TableCell>
                      <TableCell><StatusBadge status={mapSituacao(status)}>{status}</StatusBadge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/gestao-academica/matriculas/cadastro?id=${m.id}`}><Pencil className="h-4 w-4" /></Link>
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
    </PageContainer>
  )
}
