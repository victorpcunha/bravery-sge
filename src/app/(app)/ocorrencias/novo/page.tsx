'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { criarOcorrencia } from '@/lib/actions/ocorrencias'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { OcorrenciaForm, type OcorrenciaFormValues } from '@/components/ocorrencias/ocorrencia-form'
import { ArrowLeft, AlertTriangle, ShieldAlert, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'gestao-academica.ocorrencias'

export default function OcorrenciaNovaPage() {
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
      <NovaOcorrenciaForm />
    </Suspense>
  )
}

function NovaOcorrenciaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  const voltar = () => router.push('/ocorrencias')

  const handleSave = async (values: OcorrenciaFormValues) => {
    if (!schoolId) {
      toast.error('Escola não selecionada')
      return
    }
    if (!values.tipo) {
      toast.error('Selecione o tipo da ocorrência (Positiva ou Negativa)')
      return
    }
    setSaving(true)
    try {
      await criarOcorrencia(schoolId, {
        titulo: values.titulo,
        tipo: values.tipo,
        dataOcorrencia: values.dataOcorrencia,
        detalhes: values.detalhes,
        apresentarPortal: values.apresentarPortal,
        profissionalIds: values.profissionalIds,
        alunoIds: values.alunoIds,
      }, pessoaId)
      toast.success('Ocorrência registrada')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar ocorrência')
    } finally {
      setSaving(false)
    }
  }

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Nova Ocorrência"
          description="Registre uma ocorrência positiva ou negativa dos alunos"
          icon={AlertTriangle}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de ocorrências, selecione uma escola e clique em 'Nova Ocorrência'."
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
          title="Nova Ocorrência"
          description="Registre uma ocorrência positiva ou negativa dos alunos"
          icon={AlertTriangle}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para criar ocorrências. Fale com o gestor da escola."
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
        title="Nova Ocorrência"
        description="Registre uma ocorrência positiva ou negativa dos alunos"
        icon={AlertTriangle}
        actions={
          <Button variant="outline" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar
          </Button>
        }
      />

      {schoolId && (
        <OcorrenciaForm
          schoolId={schoolId}
          pessoaId={pessoaId}
          saving={saving}
          onCancel={voltar}
          onSave={handleSave}
        />
      )}
    </PageContainer>
  )
}
