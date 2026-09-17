'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import RematriculasClient from '@/components/rematriculas/rematriculas-client'

export default function RematriculasPage() {
  const { schoolId } = useAuth()

  return (
    <PageContainer maxWidth="dashboard">
      <RematriculasClient schoolId={schoolId} />
    </PageContainer>
  )
}
