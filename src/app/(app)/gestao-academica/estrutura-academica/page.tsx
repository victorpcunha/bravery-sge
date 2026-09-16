'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { ModernTabs } from '@/components/ui/modern-tabs'
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

        <ModernTabs
          tabs={[
            { value: 'calendarios', label: 'Calendários' },
            { value: 'etapas', label: 'Etapas' },
            { value: 'matrizes', label: 'Matrizes' },
          ]}
          defaultValue="calendarios"
          urlSync={false}
          fullWidth
          listClassName="sm:w-1/2"
        >
          <TabCalendarios schoolId={schoolId} />
          <TabEtapas schoolId={schoolId} />
          <TabMatrizes schoolId={schoolId} />
        </ModernTabs>
      </PageContainer>
  )
}