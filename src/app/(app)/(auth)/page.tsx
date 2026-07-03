'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { getDashboardData, type DashboardData } from '@/lib/actions/dashboard'
import { School, Users, GraduationCap, UserCheck, BookOpen, AlertTriangle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AlunosPorEtapaChart from '@/components/dashboard/alunos-por-etapa-chart'
import AlunosPorTipoChart from '@/components/dashboard/alunos-por-tipo-chart'
import AlunosPorDeficienciaChart from '@/components/dashboard/alunos-por-deficiencia-chart'
import AlunosPorTranstornoChart from '@/components/dashboard/alunos-por-transtorno-chart'
import AlunosPorModalidadeChart from '@/components/dashboard/alunos-por-modalidade-chart'
import AlunosPorTurnoChart from '@/components/dashboard/alunos-por-turno-chart'
import { OcupacaoCard } from '@/components/dashboard/ocupacao-card'
import { FrequenciaMediaCard } from '@/components/dashboard/frequencia-media-card'
import { RiscoEvasaoTable } from '@/components/dashboard/risco-evasao-table'
import { AniversariantesList } from '@/components/dashboard/aniversariantes-list'
import { TurmasSemProfessorList } from '@/components/dashboard/turmas-sem-professor-list'
import OcupacaoPorTurmaChart from '@/components/dashboard/ocupacao-por-turma-chart'
import FrequenciaPorTurmaChart from '@/components/dashboard/frequencia-por-turma-chart'

export default function DashboardPage() {
  const { user, loading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const effectiveId = selectedSchoolId ?? schoolId
    getDashboardData(effectiveId)
      .then(setData)
      .catch((err) => {
        setError(err.message || 'Erro ao carregar dados do dashboard')
      })
  }, [user, schoolId, selectedSchoolId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-foreground font-medium">Erro ao carregar dashboard</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  const schoolName = isSuperAdmin
    ? selectedSchoolId
      ? allSchools.find(s => s.id === selectedSchoolId)?.nome_escola || 'Escola'
      : 'Visão Global'
    : allSchools.find(s => s.id === schoolId)?.nome_escola || 'Escola'

  const titulo = data?.anoLetivo
    ? `Dashboard — Ano Letivo ${data.anoLetivo.descricao}`
    : 'Dashboard'

  return (
    <div className="min-h-screen bg-background">
      <PageContainer maxWidth="dashboard">
        <PageHeader
          icon={School}
          title={titulo}
          description={`Olá, ${user.email?.split('@')[0]}! Bem-vindo ao Bravery SGE`}
        />

        {isSuperAdmin && (
          <div className="mb-8 space-y-3">
            <div className="p-5 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground">
                Você está no modo <strong className="text-foreground">Super Admin</strong>. Escola atual: <strong className="text-foreground">{schoolName}</strong>
              </p>
            </div>
            <div className="max-w-xs">
              <Select
                value={selectedSchoolId ?? '__all__'}
                onValueChange={(v) => setSelectedSchoolId(v === '__all__' ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as escolas</SelectItem>
                  {allSchools.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Users}
            value={data?.docentes ?? 0}
            label="Docentes"
            variant="default"
          />
          <StatCard
            icon={GraduationCap}
            value={data?.turmas ?? 0}
            label="Turmas"
            variant="default"
          />
          <StatCard
            icon={UserCheck}
            value={data?.alunos ?? 0}
            label="Alunos"
            variant="default"
          />
          <StatCard
            icon={BookOpen}
            value={data?.matriculas ?? 0}
            label="Matrículas"
            variant="default"
          />
        </div>

        {/* Aniversariantes */}
        <div className="mb-6">
          <AniversariantesList data={data?.aniversariantes ?? []} />
        </div>

        {/* Alunos por Etapa + Tipo de Turma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AlunosPorEtapaChart data={data?.alunosPorEtapa ?? []} />
          <AlunosPorTipoChart data={data?.alunosPorTipoTurma ?? []} />
        </div>

        {/* Deficiência + Transtorno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AlunosPorDeficienciaChart data={data?.alunosPorDeficiencia ?? []} />
          <AlunosPorTranstornoChart data={data?.alunosPorTranstorno ?? []} />
        </div>

        {/* Ocupação + Frequência */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OcupacaoCard data={data?.ocupacao ?? { capacidadeTotal: 0, matriculasAtivas: 0 }} />
          <FrequenciaMediaCard data={data?.frequenciaMedia ?? null} />
        </div>

        {/* Modalidade + Turno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AlunosPorModalidadeChart data={data?.alunosPorModalidade ?? []} />
          <AlunosPorTurnoChart data={data?.alunosPorTurno ?? []} />
        </div>

        {/* Ocupação por Turma + Frequência por Turma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <OcupacaoPorTurmaChart data={data?.ocupacaoPorTurma ?? []} />
          <FrequenciaPorTurmaChart data={data?.frequenciaPorTurma ?? []} />
        </div>

        {/* Risco de Evasão */}
        <div className="mb-6">
          <RiscoEvasaoTable data={data?.riscoEvasao ?? []} />
        </div>

        {/* Turmas sem Professor */}
        <div className="mb-6">
          <TurmasSemProfessorList data={data?.turmasSemProfessor ?? []} />
        </div>
      </PageContainer>
    </div>
  )
}
