'use client'

import { useAuth } from '@/components/providers/auth-provider'
import ConselhoClassePageClient from './conselho-classe-page-client'

export default function ConselhoClassePage() {
  const { schoolId } = useAuth()

  return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <ConselhoClassePageClient schoolId={schoolId} />
      </div>
  )
}
