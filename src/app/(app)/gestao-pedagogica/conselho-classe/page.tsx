'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import ConselhoClassePageClient from './conselho-classe-page-client'

export default function ConselhoClassePage() {
  const { schoolId } = useAuth()

  if (!schoolId) {
    return (
      <>
        <Sidebar />
        <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
          <p className="text-muted-foreground">Nenhuma escola encontrada.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4 max-w-5xl">
        <ConselhoClassePageClient schoolId={schoolId} />
      </div>
    </>
  )
}
