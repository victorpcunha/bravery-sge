'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { PageContainer } from '@/components/layout/page-container'
import ConselhoClassePageClient from './conselho-classe-page-client'

export default function ConselhoClassePage() {
  const { schoolId } = useAuth()

  return (
    <PageContainer>
      <ConselhoClassePageClient schoolId={schoolId} />
    </PageContainer>
  )
}
