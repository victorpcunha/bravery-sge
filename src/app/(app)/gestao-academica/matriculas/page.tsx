'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'
import { Plus, DoorOpen, GraduationCap } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { FilterBar } from '@/components/layout/filter-bar'
import { StatusBadge } from '@/components/feedback/status-badge'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getMatriculas, getTurmasAtivas, type FiltrosMatriculas } from '@/lib/actions/matriculas'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'

function formatData(data: string) {
  if (!data) return ''
  const d = new Date(data + 'T00:00:00')
  return d.toLocaleDateString('pt-BR')
}

function mapSituationToStatus(situacao: string): 'success' | 'warning' | 'destructive' | 'info' | 'muted' {
  if (['Ativo', 'Aprovado', 'Aprovado por conselho de classe'].includes(situacao)) return 'success'
  if (['Transferido', 'Reclassificado', 'Remanejado'].includes(situacao)) return 'info'
  if (['Desistente', 'Reprovado por frequência'].includes(situacao)) return 'warning'
  if (['Reprovado'].includes(situacao)) return 'destructive'
  return 'muted'
}

export default function MatriculasPage() {
  const router = useRouter()
  const { user, schoolId, loading: authLoading } = useAuth()

  const [anosLetivos, setAnosLetivos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [etapas, setEtapas] = useState<any[]>([])

  const [filtroAno, setFiltroAno] = useState('')
  const [filtroTurma, setFiltroTurma] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('')

  const [matriculas, setMatriculas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    loadInitial()
  }, [user])

  const loadInitial = async () => {
    try {
      const [anos, etapasList] = await Promise.all([
        getAnosLetivosAtivos(schoolId!),
        getEtapasEnsino(schoolId!),
      ])
      setAnosLetivos(anos)
      setEtapas(etapasList)
      const ativo = anos.find((a: any) => a.status === 'ativo')
      if (ativo) setFiltroAno(ativo.id)
    } catch (e) {
      console.error('Erro init:', e)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!filtroAno) return
    loadTurmas()
  }, [schoolId, filtroAno])

  const loadTurmas = async () => {
    try {
      const data = await getTurmasAtivas(schoolId!, filtroAno)
      setTurmas(data)
    } catch (e) {
      console.error('Erro ao carregar turmas:', e)
    }
  }

  useEffect(() => {
    loadMatriculas()
  }, [schoolId, filtroAno, filtroTurma, filtroEtapa])

  const loadMatriculas = async () => {
    setLoading(true)
    try {
      const filtros: FiltrosMatriculas = {}
      if (filtroAno) filtros.ano_letivo_id = filtroAno
      if (filtroTurma) filtros.turma_id = filtroTurma
      if (filtroEtapa) filtros.etapa_ensino_id = filtroEtapa

      const data = await getMatriculas(schoolId!, filtros)
      setMatriculas(data)
    } catch (e) {
      console.error('Erro ao carregar matrículas:', e)
      toast.error('Erro ao carregar matrículas')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
          icon={GraduationCap}
          title="Alunos Matriculados"
          description="Gerencie as matrículas dos alunos nas turmas"
        actions={
          <Link href="/gestao-academica/matriculas/cadastro">
            <Button>
              <Plus className="h-4 w-4" />
              Nova Matrícula
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        <PageSection variant="compact" title="Filtros">
          <FilterBar>
            <div className="w-48">
              <Label className="text-xs text-muted-foreground mb-1 block">Ano Letivo</Label>
              <Select value={filtroAno} onValueChange={v => { setFiltroAno(v); setFiltroTurma(''); setFiltroEtapa('') }}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {anosLetivos.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-56">
              <Label className="text-xs text-muted-foreground mb-1 block">Turma</Label>
              <Select value={filtroTurma} onValueChange={v => { setFiltroTurma(v); setFiltroEtapa('') }}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {turmas.map((t: any) => (
                    <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-56">
              <Label className="text-xs text-muted-foreground mb-1 block">Etapa</Label>
              <Select value={filtroEtapa} onValueChange={v => setFiltroEtapa(v === 'all' ? '' : v)}>
                <SelectTrigger className="h-9 border-border">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {etapas.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>{e.etapa_nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FilterBar>
        </PageSection>

        <PageSection
          variant="flush"
          title={`${matriculas.length} matrícula${matriculas.length !== 1 ? 's' : ''} encontrada${matriculas.length !== 1 ? 's' : ''}`}
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : matriculas.length === 0 ? (
            <EmptyState
              icon={DoorOpen}
              title="Nenhuma matrícula encontrada"
              description='Clique em "Nova Matrícula" para começar.'
              action={
                <Link href="/gestao-academica/matriculas/cadastro">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Nova Matrícula
                  </Button>
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="text-xs uppercase">Aluno</TableHead>
                  <TableHead className="text-xs uppercase">Turma</TableHead>
                  <TableHead className="text-xs uppercase">Etapa</TableHead>
                  <TableHead className="text-xs uppercase">Data Matrícula</TableHead>
                  <TableHead className="text-xs uppercase">Situação</TableHead>
                  <TableHead className="text-xs uppercase text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculas.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{m.aluno?.nome_completo || '—'}</div>
                      <div className="text-[11px] text-muted-foreground">{m.aluno?.cpf || ''}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.turma?.nome || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{m.etapa?.etapa_nome || '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatData(m.data_matricula)}</TableCell>
                    <TableCell>
                      <StatusBadge status={mapSituationToStatus(m.situacao)} className="text-[11px] px-1.5 py-0">
                        {m.situacao}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/gestao-academica/matriculas/cadastro?id=${m.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Editar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      </div>
    </PageContainer>
  )
}
