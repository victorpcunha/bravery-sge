'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarDays, GraduationCap, BookOpen } from 'lucide-react'
import { TabCalendarios } from './TabCalendarios'
import { TabEtapas } from './TabEtapas'
import { TabMatrizes } from './TabMatrizes'

export default function GestaoAcademicaPage() {
  const { user, schoolId, loading } = useAuth()
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

  return (
      <PageContainer>
        <PageHeader
          title="Gestão Acadêmica"
          description="Configure a estrutura acadêmica da escola"
        />

        <Tabs defaultValue="calendarios" className="w-full">
          <TabsList className="inline-flex h-auto rounded-xl bg-muted border border-border p-1 mb-8">
            <TabsTrigger value="calendarios" className="gap-2 px-5 py-2.5 text-[15px] font-medium rounded-lg text-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
              <CalendarDays className="w-5 h-5" />
              Calendários
            </TabsTrigger>
            <TabsTrigger value="etapas" className="gap-2 px-5 py-2.5 text-[15px] font-medium rounded-lg text-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
              <GraduationCap className="w-5 h-5" />
              Etapas
            </TabsTrigger>
            <TabsTrigger value="matrizes" className="gap-2 px-5 py-2.5 text-[15px] font-medium rounded-lg text-foreground data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm">
              <BookOpen className="w-5 h-5" />
              Matrizes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendarios">
            <TabCalendarios schoolId={schoolId} />
          </TabsContent>

          <TabsContent value="etapas">
            <TabEtapas schoolId={schoolId} />
          </TabsContent>

          <TabsContent value="matrizes">
            <TabMatrizes schoolId={schoolId} />
          </TabsContent>
        </Tabs>
      </PageContainer>
  )
}