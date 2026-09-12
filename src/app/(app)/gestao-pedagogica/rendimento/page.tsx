'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import RendimentoPageClient from '@/components/rendimento/rendimento-page-client'

export default function RendimentoPage() {
  const { schoolId } = useAuth()

  return (
    <PageContainer maxWidth="dashboard">
      <RendimentoPageClient schoolId={schoolId} />
    </PageContainer>
  )
}
