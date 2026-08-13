'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Plus, ShieldAlert } from 'lucide-react'
import { EscolaForm } from '@/components/censo/escola-form'
import { createSchool } from '@/lib/actions/schools'
import { toast } from 'sonner'
import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import type { BreadcrumbItem } from '@/components/layout/page-header'

export default function NovaEscolaPage() {
  const router = useRouter()
  const { user, loading: authLoading, schoolId, isSuperAdmin } = useAuth()
  const { loaded: permLoaded, pessoaId, isSetup, pode } = usePermissoes(isSuperAdmin ? null : schoolId)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const podeCriar = !isSetup && pode.criar('escolas')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const handleSubmit = async (data: Record<string, any>) => {
    if (!podeCriar) return
    setIsSubmitting(true)
    try {
      await createSchool({ ...data, tipo_registro: '00' }, pessoaId || undefined)
      toast.success('Escola criada com sucesso!')
      router.push('/escolas')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao criar escola')
    } finally {
      setIsSubmitting(false)
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Unidade Escolar', href: '/escolas' },
    { label: 'Nova Escola' },
  ]

  if (authLoading || !permLoaded) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!podeCriar) {
    return (
      <PageContainer>
        <PageHeader icon={ShieldAlert} title="Nova Escola" description="Cadastre uma nova unidade escolar" />
        <Card className="shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="Seu perfil não possui permissão para criar unidades escolares."
          />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Plus}
        title="Nova Escola"
        description="Cadastre uma nova unidade escolar no sistema"
        breadcrumbs={breadcrumbs}
      />

      <EscolaForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title=""
        onCancel={() => router.push('/escolas')}
        submitLabel="Salvar Escola"
      />
    </PageContainer>
  )
}