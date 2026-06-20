import { Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import MatriculaCadastroContent from './content'

export default async function MatriculaCadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  return (
    <Suspense fallback={
      <PageContainer>
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      </PageContainer>
    }>
      <MatriculaCadastroContent searchParams={params} />
    </Suspense>
  )
}
