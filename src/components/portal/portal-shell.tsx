'use client'

import { usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { usePortal } from '@/components/portal/portal-provider'
import { PortalSidebar } from '@/components/portal/portal-sidebar'
import { PortalTopbar } from '@/components/portal/portal-topbar'

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { loading, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  // Rotas sem shell (login e termo não exibem Sidebar/Topbar de dados)
  const ehRotaNua = pathname === `${base}/login` || pathname === `${base}/termo`

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-[14px] text-muted-foreground">Carregando portal...</p>
      </div>
    )
  }

  if (ehRotaNua) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <PortalSidebar />
      <div className="lg:pl-64">
        <PortalTopbar />
        <main className="py-6">{children}</main>
      </div>
    </div>
  )
}
