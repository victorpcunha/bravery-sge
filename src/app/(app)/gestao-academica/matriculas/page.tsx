'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Search, DoorOpen } from 'lucide-react'
import { getAnosLetivosAtivos } from '@/lib/actions/quadro-aulas'
import { getMatriculas, getTurmasAtivas, type FiltrosMatriculas } from '@/lib/actions/matriculas'
import { getEtapasEnsino } from '@/lib/actions/etapas-ensino'

function formatData(data: string) {
  if (!data) return ''
  const d = new Date(data + 'T00:00:00')
  return d.toLocaleDateString('pt-BR')
}

const situacaoColors: Record<string, string> = {
  Ativo: 'bg-success/10 text-success border-success/20',
  Transferido: 'bg-info/10 text-info border-info/20',
  Desistente: 'bg-warning/10 text-warning border-warning/20',
  'Óbito': 'bg-muted text-foreground border-border',
  Reclassificado: 'bg-purple-100 text-purple-700 border-purple-200',
  Remanejado: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Aprovado: 'bg-success/10 text-success border-success/20',
  'Aprovado por conselho de classe': 'bg-lime-100 text-lime-700 border-lime-200',
  Reprovado: 'bg-destructive/10 text-destructive border-destructive/20',
  'Reprovado por frequência': 'bg-warning/10 text-warning border-warning/20',
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
    return <div className="container mx-auto py-8 px-4"><div className="text-center text-muted-foreground">Carregando...</div></div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Alunos Matriculados</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie as matrículas dos alunos nas turmas
          </p>
        </div>
        <Link href="/gestao-academica/matriculas/cadastro">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Matrícula
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
        <CardHeader className="bg-muted/40 border-b border-border py-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* Listagem */}
      <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <CardHeader className="bg-muted/40 border-b border-border py-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {matriculas.length} matrícula{matriculas.length !== 1 ? 's' : ''} encontrada{matriculas.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Carregando...</div>
          ) : matriculas.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <DoorOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>Nenhuma matrícula encontrada.</p>
              <p className="text-xs mt-1">Clique em "Nova Matrícula" para começar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/80">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Aluno</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Turma</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Etapa</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Data Matrícula</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Situação</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {matriculas.map((m: any) => (
                    <tr key={m.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{m.aluno?.nome_completo || '—'}</div>
                        <div className="text-[11px] text-muted-foreground">{m.aluno?.cpf || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.turma?.nome || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.etapa?.etapa_nome || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatData(m.data_matricula)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[11px] px-1.5 py-0 ${situacaoColors[m.situacao] || ''}`}>
                          {m.situacao}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/gestao-academica/matriculas/cadastro?id=${m.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                            Editar
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
