'use client'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { ImportacaoForm } from '@/components/importacao/importacao-form'
import { FileUp } from 'lucide-react'

export default function ImportacaoInicialPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Importação Inicial"
        description="Importe alunos e profissionais em lote para uma unidade escolar a partir de um arquivo CSV."
        icon={FileUp}
      />
      <ImportacaoForm />
    </PageContainer>
  )
}
