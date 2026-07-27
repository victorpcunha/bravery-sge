'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { StatCard } from '@/components/ui/stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { FrequenciaHeroCard } from '@/components/dashboard/frequencia-hero-card'
import { DashboardTabs, type TabValue } from '@/components/dashboard/dashboard-tabs'
import { getDashboardData, type DashboardData } from '@/lib/actions/dashboard'
import { Users, GraduationCap, UserCheck, BookOpen, AlertTriangle } from 'lucide-react'

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

type SuperAdminBlockProps = {
  isSuperAdmin: boolean
  schoolName: string
  selectedSchoolId: string | null
  setSelectedSchoolId: (v: string | null) => void
  allSchools: { id: string; nome_escola: string }[]
}

function SuperAdminBlock({
  isSuperAdmin,
  schoolName,
  selectedSchoolId,
  setSelectedSchoolId,
  allSchools,
}: SuperAdminBlockProps) {
  if (!isSuperAdmin) return null
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
      <p className="text-[14px] text-muted-foreground">
        Você está no modo <strong className="text-foreground">Super Admin</strong>. Escola atual:{' '}
        <strong className="text-foreground">{schoolName}</strong>
      </p>
      <div className="w-full sm:w-64">
        <SelectWrapper
          value={selectedSchoolId ?? '__all__'}
          onChange={(v) => setSelectedSchoolId(v === '__all__' ? null : v)}
          options={[
            { value: '__all__', label: 'Todas as escolas' },
            ...allSchools.map((s) => ({ value: s.id, label: s.nome_escola })),
          ]}
        />
      </div>
    </div>
  )
}

type SelectWrapperProps = {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

function SelectWrapper({ value, onChange, options }: SelectWrapperProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Todas as escolas" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function VisaoGeralTab({ data }: { data: DashboardData | null }) {
  return (
    <div className="space-y-6">
      <FrequenciaHeroCard
        data={data?.frequenciaMedia ?? null}
        topTurmasFaltosas={data?.frequenciaPorTurma ?? []}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={UserCheck}
          value={data?.alunos ?? 0}
          label="Alunos"
          variant="default"
        />
        <StatCard
          icon={BookOpen}
          value={data?.matriculas ?? 0}
          label="Matrículas Ativas"
          variant="success"
        />
        <StatCard
          icon={Users}
          value={data?.docentes ?? 0}
          label="Docentes"
          variant="default"
        />
        <StatCard
          icon={GraduationCap}
          value={data?.turmas ?? 0}
          label="Turmas Ativas"
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AniversariantesList data={data?.aniversariantes ?? []} />
        </div>
        <OcupacaoCard data={data?.ocupacao ?? { capacidadeTotal: 0, matriculasAtivas: 0 }} />
      </div>

      <OcupacaoPorTurmaChart data={data?.ocupacaoPorTurma ?? []} />
    </div>
  )
}

function AcademicoTab({ data }: { data: DashboardData | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AlunosPorEtapaChart data={data?.alunosPorEtapa ?? []} />
      <AlunosPorTipoChart data={data?.alunosPorTipoTurma ?? []} />
      <AlunosPorDeficienciaChart data={data?.alunosPorDeficiencia ?? []} />
      <AlunosPorTranstornoChart data={data?.alunosPorTranstorno ?? []} />
      <AlunosPorModalidadeChart data={data?.alunosPorModalidade ?? []} />
      <AlunosPorTurnoChart data={data?.alunosPorTurno ?? []} />
    </div>
  )
}

function FrequenciaTab({ data }: { data: DashboardData | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FrequenciaMediaCard data={data?.frequenciaMedia ?? null} />
      <FrequenciaPorTurmaChart data={data?.frequenciaPorTurma ?? []} />
    </div>
  )
}

function AlertasTab({ data }: { data: DashboardData | null }) {
  return (
    <div className="space-y-6">
      <RiscoEvasaoTable data={data?.riscoEvasao ?? []} />
      <TurmasSemProfessorList data={data?.turmasSemProfessor ?? []} />
    </div>
  )
}

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
      ? allSchools.find((s) => s.id === selectedSchoolId)?.nome_escola || 'Escola'
      : 'Visão Global'
    : allSchools.find((s) => s.id === schoolId)?.nome_escola || 'Escola'

  const firstName =
    (user.email?.split('@')[0] || 'gestor')
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ') || 'Gestor'

  const tabs: { value: TabValue; label: string; badge?: number }[] = [
    { value: 'visao-geral', label: 'Visão Geral' },
    { value: 'academico', label: 'Acadêmico' },
    { value: 'frequencia', label: 'Frequência' },
    {
      value: 'alertas',
      label: 'Alertas',
      badge: data?.riscoEvasao ? data.riscoEvasao.length : 0,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageContainer maxWidth="dashboard">
        <DashboardHero
          userName={firstName}
          schoolName={schoolName}
          anoLetivoDescricao={data?.anoLetivo?.descricao ?? null}
        />

        <SuperAdminBlock
          isSuperAdmin={isSuperAdmin}
          schoolName={schoolName}
          selectedSchoolId={selectedSchoolId}
          setSelectedSchoolId={setSelectedSchoolId}
          allSchools={allSchools}
        />

        <DashboardTabs tabs={tabs}>
          <VisaoGeralTab data={data} />
          <AcademicoTab data={data} />
          <FrequenciaTab data={data} />
          <AlertasTab data={data} />
        </DashboardTabs>
      </PageContainer>
    </div>
  )
}
