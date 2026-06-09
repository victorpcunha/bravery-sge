import { Suspense } from 'react'
import MatriculaCadastroContent from './content'

export default async function MatriculaCadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      </div>
    }>
      <MatriculaCadastroContent searchParams={params} />
    </Suspense>
  )
}
