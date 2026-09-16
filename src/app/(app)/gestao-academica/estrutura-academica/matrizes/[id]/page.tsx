'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getMatriz } from '@/lib/actions/matrizes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { MatrizForm } from '../../MatrizForm'
import { ArrowLeft, GraduationCap, ShieldAlert, AlertCircle } from 'lucide-react'

const RECURSO = 'gestao-academica.estrutura-academica.matrizes'
const BASE = '/gestao-academica/estrutura-academica'

export default function MatrizEditarPage() {
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
      <EditarMatrizContent />
    </Suspense>
  )
}

function EditarMatrizContent() {
  const router = useRouter()
  const params = useTabParams()
  const id = params.id as string
  const { schoolId: authSchoolId, isSuperAdmin, loading: authLoading } = useAuth()

  const [loadedSchool, setLoadedSchool] = useState<string | null>(null)
  const [fetchDone, setFetchDone] = useState(false)
  const [naoEncontrada, setNaoEncontrada] = useState(false)

  const schoolId = isSuperAdmin ? loadedSchool : authSchoolId
  const loading = authLoading || (isSuperAdmin && !!id && !fetchDone)

  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (!isSuperAdmin || !id) return
    let alive = true
    getMatriz(id)
      .then(m => {
        if (!alive) return
        if (!m) setNaoEncontrada(true)
        else setLoadedSchool(m.school_id)
      })
      .catch(() => { if (alive) setNaoEncontrada(true) })
      .finally(() => { if (alive) setFetchDone(true) })
    return () => { alive = false }
  }, [id, isSuperAdmin])

  const voltar = () => router.push(BASE)
  const podeEditar = pode.editar(RECURSO)

  if (!loading && !isSuperAdmin && !schoolId) {
    return (
      <PageContainer>
        <PageHeader title="Editar Matriz Curricular" description="Altere identificação, carga horária, períodos e disciplinas" icon={GraduationCap} />
        <EmptyState
          icon={ShieldAlert}
          title="Sem escola vinculada"
          description="Seu usuário não está vinculado a uma escola."
          action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
        />
      </PageContainer>
    )
  }

  if (!loading && permLoaded && schoolId && !pode.visualizar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader title="Editar Matriz Curricular" description="Altere identificação, carga horária, períodos e disciplinas" icon={GraduationCap} />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para acessar matrizes curriculares."
          action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
        />
      </PageContainer>
    )
  }

  if (!loading && naoEncontrada) {
    return (
      <PageContainer>
        <PageHeader title="Editar Matriz Curricular" description="Altere identificação, carga horária, períodos e disciplinas" icon={GraduationCap} />
        <Card className="shadow-sm">
          <EmptyState
            icon={AlertCircle}
            title="Matriz não encontrada"
            description="A matriz pode ter sido excluída ou pertence a outra escola."
            action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
          />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Editar Matriz Curricular"
        description="Altere identificação, carga horária, períodos e disciplinas"
        icon={GraduationCap}
        actions={
          <Button variant="outline" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />Voltar
          </Button>
        }
      />
      {loading || !schoolId ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !podeEditar ? (
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão para editar"
          description="Você pode visualizar, mas não tem permissão para alterar esta matriz."
          action={<Button variant="outline" onClick={voltar}><ArrowLeft className="h-4 w-4 mr-1.5" />Voltar</Button>}
        />
      ) : (
        <MatrizForm
          key={`${id}-${pessoaId ?? 'x'}`}
          schoolId={schoolId}
          matrizId={id}
          onSaved={voltar}
          onCancel={voltar}
        />
      )}
    </PageContainer>
  )
}
