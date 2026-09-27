'use client'

import { FolderOpen } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { usePortal } from '@/components/portal/portal-provider'
import { ModuloBloqueado } from '@/components/portal/modulo-bloqueado'
import DocumentosPortal from '@/components/portal/documentos-portal'

export default function PortalDocumentosPage() {
  const { aluno, escola } = usePortal()
  if (!aluno) return null

  if (escola?.modulosVisiveis.documentos === false) {
    return <ModuloBloqueado titulo="Documentos" rotulo="os Documentos" icon={FolderOpen} />
  }

  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        title="Documentos"
        description={`${aluno.nome} · ${aluno.turmaNome}`}
        icon={FolderOpen}
      />
      <DocumentosPortal />
    </PageContainer>
  )
}
