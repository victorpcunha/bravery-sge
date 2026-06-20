import { Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'

export default function DocentesPage() {
  return (
    <PageContainer maxWidth="default">
      <PageHeader
        title="Docentes"
        description="Gerencie os professores da escola"
        icon={Users}
      />
      <PageSection title="Docentes">
        <EmptyState
          icon={Users}
          title="Módulo em desenvolvimento"
          description="O cadastro de docentes estará disponível em breve."
        />
      </PageSection>
    </PageContainer>
  )
}
