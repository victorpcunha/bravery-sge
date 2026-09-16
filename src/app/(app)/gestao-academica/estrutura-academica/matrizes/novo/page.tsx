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
import { MatrizForm } from '../../MatrizForm'
import { ArrowLeft, GraduationCap, ShieldAlert, School } from 'lucide-react'

const RECURSO = 'gestao-academica.estrutura-academica.matrizes'
const BASE = '/gestao-academica/estrutura-academica'

export default function MatrizNovoPage() {
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
      <NovaMatrizContent />
    </Suspense>
  )
}

function NovaMatrizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  const voltar = () => router.push(BASE)

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader title="Nova Matriz Curricular" description="Cadastre a matriz e continue o preenchimento dos períodos na mesma página" icon={GraduationCap} />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a aba Matrizes, selecione uma escola e clique em 'Nova Matriz'."
            action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
          />
        </Card>
      </PageContainer>
    )
  }

  if (permLoaded && !pode.criar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader title="Nova Matriz Curricular" description="Cadastre a matriz e continue o preenchimento dos períodos na mesma página" icon={GraduationCap} />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para criar matrizes curriculares. Fale com o gestor da escola."
          action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Nova Matriz Curricular"
        description="Cadastre a matriz e continue o preenchimento dos períodos na mesma página"
        icon={GraduationCap}
        actions={
          <Button variant="outline" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />Voltar
          </Button>
        }
      />
      {!schoolId ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <MatrizForm
          key={pessoaId ?? 'novo'}
          schoolId={schoolId}
          matrizId={null}
          onSaved={voltar}
          onCancel={voltar}
          onCreated={(id) => router.push(`${BASE}/matrizes/${id}`)}
        />
      )}
    </PageContainer>
  )
}
