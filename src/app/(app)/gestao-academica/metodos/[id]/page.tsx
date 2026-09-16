'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { deleteMetodo } from '@/lib/actions/metodos'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { MetodoForm } from '@/components/metodos/metodo-form'
import { ArrowLeft, ClipboardList, ShieldAlert, Trash2, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'gestao-academica.metodos'

export default function MetodoEditarPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </PageContainer>
      }
    >
      <EditarMetodoForm />
    </Suspense>
  )
}

function EditarMetodoForm() {
  const router = useRouter()
  const params = useTabParams()
  const id = params.id as string
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')

  const pessoaId = pid ?? null
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const voltar = () => router.push('/gestao-academica/metodos')
  const podeEditar = pode.editar(RECURSO)
  const podeExcluir = pode.excluir(RECURSO)

  const handleExcluir = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await deleteMetodo(id, pessoaId)
      toast.success('Método excluído')
      voltar()
    } catch {
      toast.error('Erro ao excluir método')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Método de Avaliação"
          description="Altere os critérios e regras deste método de avaliação"
          icon={ClipboardList}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de métodos, selecione uma escola e edite o método por lá."
            action={
              <Button variant="outline" onClick={voltar}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Voltar
              </Button>
            }
          />
        </Card>
      </PageContainer>
    )
  }

  if (permLoaded && !pode.visualizar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Método de Avaliação"
          description="Altere os critérios e regras deste método de avaliação"
          icon={ClipboardList}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar este método de avaliação."
          action={
            <Button variant="outline" onClick={voltar}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          }
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Método de Avaliação"
        description="Altere os critérios e regras deste método de avaliação"
        icon={ClipboardList}
        actions={
          <div className="flex items-center gap-2">
            {podeExcluir && (
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={voltar}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        }
      />

      {!schoolId || !id ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !permLoaded ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !podeEditar ? (
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão para editar"
          description="Você pode visualizar, mas não tem permissão para alterar este método de avaliação."
          action={
            <Button variant="outline" onClick={voltar}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          }
        />
      ) : (
        <MetodoForm
          key={id}
          schoolId={schoolId}
          editId={id}
          onSaved={voltar}
          onCancel={voltar}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir método de avaliação"
        description="Tem certeza que deseja excluir este método permanentemente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
