'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { MetodoForm } from '@/components/metodos/metodo-form'
import { ArrowLeft, ClipboardList, ShieldAlert, School } from 'lucide-react'

const RECURSO = 'gestao-academica.metodos'

export default function MetodoNovoPage() {
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
      <NovoMetodoForm />
    </Suspense>
  )
}

function NovoMetodoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const voltar = () => router.push('/gestao-academica/metodos')

  const { loaded: permLoaded, pode } = usePermissoes(schoolId || '')

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Novo Método de Avaliação"
          description="Configure todos os critérios e regras para este método de avaliação"
          icon={ClipboardList}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de métodos, selecione uma escola e clique em 'Novo Método'."
            action={
              <Button onClick={voltar}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Voltar
              </Button>
            }
          />
        </Card>
      </PageContainer>
    )
  }

  if (permLoaded && !pode.criar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader
          title="Novo Método de Avaliação"
          description="Configure todos os critérios e regras para este método de avaliação"
          icon={ClipboardList}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para criar métodos de avaliação. Fale com o gestor da escola."
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
        title="Novo Método de Avaliação"
        description="Configure todos os critérios e regras para este método de avaliação"
        icon={ClipboardList}
        actions={
          <Button variant="outline" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar
          </Button>
        }
      />

      {!schoolId ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <MetodoForm
          schoolId={schoolId}
          editId={null}
          onSaved={voltar}
          onCancel={voltar}
        />
      )}
    </PageContainer>
  )
}
