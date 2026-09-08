import { getEscolaPortal } from '@/lib/actions/portal-escola'
import { PortalProvider } from '@/components/portal/portal-provider'
import { PortalShell } from '@/components/portal/portal-shell'
import { PortalOrientacao } from '@/components/portal/portal-orientacao'

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const escola = await getEscolaPortal(slug)

  if (!escola.ok) {
    return <PortalOrientacao variante={escola.motivo === 'desabilitada' ? 'indisponivel' : 'orientacao'} />
  }

  return (
    <PortalProvider
      escola={{
        schoolId: escola.schoolId,
        slug: escola.slug,
        nome: escola.branding.nome,
        branding: escola.branding,
      }}
    >
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  )
}
