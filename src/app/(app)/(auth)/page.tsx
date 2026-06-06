'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { getSupabaseClient } from '@/lib/auth'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { PageSection } from '@/components/layout/page-section'
import { School, Users, GraduationCap, UserCheck, Calendar, ArrowRight } from 'lucide-react'

async function getSchoolInfo() {
  const supabase = getSupabaseClient()
  
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .limit(1)
    .single()

  const [teachersCount, classroomsCount, peopleCount] = await Promise.all([
    supabase.from('teachers').select('id', { count: 'exact' }),
    supabase.from('classrooms').select('id', { count: 'exact' }),
    supabase.from('people').select('id', { count: 'exact' }),
  ])

  return {
    school,
    teachers: teachersCount.count || 0,
    classrooms: classroomsCount.count || 0,
    people: peopleCount.count || 0,
  }
}

const nextSteps = [
  { icon: School, label: 'Cadastrar dados da escola', href: '/escolas' },
  { icon: Users, label: 'Cadastrar docentes', href: '/docentes' },
  { icon: GraduationCap, label: 'Criar turmas', href: '/gestao-turmas/turmas' },
  { icon: UserCheck, label: 'Matricular alunos', href: '/gestao-academica/matriculas' },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <PageHeader
            icon={School}
            title="Dashboard"
            description={`Olá, ${user.email?.split('@')[0]}! Bem-vindo ao Bravery SGE`}
          />

          {/* Welcome */}
          <div className="mb-8 p-5 rounded-xl bg-primary/5 border border-primary/10 animate-fade-in-up delay-75">
            <p className="text-sm text-muted-foreground">
              Você está logado no sistema de gestão escolar. Para começar, cadastre os dados da sua escola no módulo <strong className="text-foreground">&quot;Escola&quot;</strong> no menu lateral.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} value={0} label="Docentes" variant="default" className="animate-fade-in-up delay-75" />
            <StatCard icon={GraduationCap} value={0} label="Turmas" variant="default" className="animate-fade-in-up delay-150" />
            <StatCard icon={UserCheck} value={0} label="Alunos" variant="default" className="animate-fade-in-up delay-225" />
            <StatCard icon={Calendar} value="2026" label="Ano Letivo" variant="success" className="animate-fade-in-up delay-300" />
          </div>

          {/* Next Steps */}
          <PageSection title="Próximos Passos" className="animate-fade-in-up delay-375">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nextSteps.map((step) => (
                <button
                  key={step.href}
                  onClick={() => router.push(step.href)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors flex-1">{step.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </PageSection>
        </div>
      </div>
    </>
  )
}