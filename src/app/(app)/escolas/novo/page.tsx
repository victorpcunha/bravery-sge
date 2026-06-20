'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { EscolaForm } from '@/components/censo/escola-form'
import { createSchool } from '@/lib/actions/schools'
import { toast } from 'sonner'
import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import type { BreadcrumbItem } from '@/components/layout/page-header'

export default function NovaEscolaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    try {
      await createSchool({ ...data, tipo_registro: '00' })
      toast.success('Escola criada com sucesso!')
      router.push('/escolas')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao criar escola')
    } finally {
      setIsSubmitting(false)
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Escolas', href: '/escolas' },
    { label: 'Nova Escola' },
  ]

  return (
    <PageContainer>
      <PageHeader
        icon={Plus}
        title="Nova Escola"
        description="Cadastre uma nova escola no sistema"
        breadcrumbs={breadcrumbs}
      />

      <EscolaForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push('/escolas')}
        submitLabel="Salvar Escola"
      />
    </PageContainer>
  )
}