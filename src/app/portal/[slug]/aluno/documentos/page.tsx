'use client'

import { FolderOpen } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { usePortal } from '@/components/portal/portal-provider'

export default function PortalDocumentosPage() {
  const { aluno } = usePortal()
  if (!aluno) return null

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Documentos"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={FolderOpen}
      />
      <div className="rounded-xl border border-border bg-card shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="Em breve"
          description="Os documentos do aluno estarão disponíveis aqui em uma próxima versão."
        />
      </div>
    </PageContainer>
  )
}
