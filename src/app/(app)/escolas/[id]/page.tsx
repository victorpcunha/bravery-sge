'use client'

import { useRouter, useParams } from 'next/navigation'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EscolaForm } from '@/components/censo/escola-form'
import { getSchool, updateSchool, deleteSchool } from '@/lib/actions/schools'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import type { BreadcrumbItem } from '@/components/layout/page-header'

export default function EditarEscolaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [defaultValues, setDefaultValues] = useState<Record<string, any> | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSchool(id).then((school) => {
      if (school) setDefaultValues(school as any)
      setLoading(false)
    }).catch(() => {
      toast.error('Erro ao carregar dados da escola')
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true)
    try {
      await updateSchool(id, data)
      toast.success('Escola atualizada com sucesso!')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar escola')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta escola?')) return
    try {
      await deleteSchool(id)
      toast.success('Escola excluída com sucesso!')
      router.push('/escolas')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao excluir escola')
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </PageContainer>
    )
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Escolas', href: '/escolas' },
    { label: 'Editar Escola' },
  ]

  return (
    <PageContainer>
      <PageHeader
        icon={Pencil}
        title="Editar Escola"
        description="Altere os dados cadastrais da escola"
        breadcrumbs={breadcrumbs}
        actions={
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        }
      />

      <EscolaForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onCancel={() => router.push('/escolas')}
        submitLabel="Salvar Alterações"
      />
    </PageContainer>
  )
}