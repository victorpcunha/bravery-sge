import { redirect } from 'next/navigation'

// Atalho: /portal/[slug] → /portal/[slug]/login.
// (Slug desconhecido/desabilitado nem chega aqui: o layout renderiza
// orientação/indisponível no lugar dos children.)
export default async function SlugRootPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/portal/${slug}/login`)
}
