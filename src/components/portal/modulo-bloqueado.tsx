'use client'

import { ShieldAlert, type LucideIcon } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Card } from '@/components/ui/card'

// Bloqueio de módulo oculto no Portal do Responsável (spec 040, FR-005/PE-402).
// O enforcement real é server-side (`exigirModuloVisivel`); aqui só a
// orientação amigável, sem expor dados do módulo.
export function ModuloBloqueado({
  titulo,
  rotulo,
  icon,
}: {
  titulo: string
  rotulo: string
  icon: LucideIcon
}) {
  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader title={titulo} icon={icon} />
      <Card className="shadow-xs">
        <EmptyState
          icon={ShieldAlert}
          title="Módulo indisponível"
          description={`A escola optou por não exibir ${rotulo} no portal. Procure a secretaria.`}
        />
      </Card>
    </PageContainer>
  )
}
