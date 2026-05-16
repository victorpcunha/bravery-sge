'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { getSupabaseClient } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { School, Users, GraduationCap, UserCheck, Calendar } from 'lucide-react'

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

  // Since this is a client component, we need to fetch data differently
  // For now, show basic dashboard without data
  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-[#64748b] mt-1">Bem-vindo ao Sistema de Gestão Escolar Bravery</p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-0 shadow-md hover:shadow-lg transition-all duration-200 card-glass animate-fade-in-up delay-75">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1D3557] rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Olá, {user.email?.split('@')[0]}!</h2>
                <p className="text-[#64748b] mt-1">
                  Você está logado no sistema de gestão escolar. Para começar, cadastre os dados da sua escola no módulo &quot;Escola&quot; no menu lateral.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 card-glass animate-fade-in-up delay-150">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748b]">Docentes</p>
                  <p className="text-2xl font-bold text-[#1D3557]">0</p>
                </div>
                <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#1D3557]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 card-glass animate-fade-in-up delay-225">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748b]">Turmas</p>
                  <p className="text-2xl font-bold text-[#457B9D]">0</p>
                </div>
                <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#457B9D]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 card-glass animate-fade-in-up delay-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748b]">Alunos</p>
                  <p className="text-2xl font-bold text-[#4FB3BF]">0</p>
                </div>
                <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#4FB3BF]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 card-glass animate-fade-in-up delay-375">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#64748b]">Ano Letivo</p>
                  <p className="text-2xl font-bold text-[#2BAE66]">2026</p>
                </div>
                <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#2BAE66]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="border-0 shadow-md card-glass animate-fade-in-up delay-450">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-[#f1f5f9] rounded-md flex items-center justify-center">
                  <School className="w-4 h-4 text-[#1D3557]" />
                </div>
                <span className="text-sm font-medium text-[#334155]">Cadastrar dados da escola</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-[#f1f5f9] rounded-md flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#457B9D]" />
                </div>
                <span className="text-sm font-medium text-[#334155]">Cadastrar docentes</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-[#f1f5f9] rounded-md flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-[#457B9D]" />
                </div>
                <span className="text-sm font-medium text-[#334155]">Criar turmas</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors cursor-pointer group">
                <div className="w-8 h-8 bg-[#f1f5f9] rounded-md flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-[#4FB3BF]" />
                </div>
                <span className="text-sm font-medium text-[#334155]">Matricular alunos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}