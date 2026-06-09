'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
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
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground">Gestão Acadêmica</h1>
          <p className="text-muted-foreground mt-1">
            Configure a estrutura acadêmica da escola
          </p>
        </div>

        <Tabs defaultValue="calendarios" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="calendarios" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              Calendários
            </TabsTrigger>
            <TabsTrigger value="etapas" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Etapas
            </TabsTrigger>
            <TabsTrigger value="matrizes" className="gap-2">
              <BookOpen className="w-4 h-4" />
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
      </div>
  )
}