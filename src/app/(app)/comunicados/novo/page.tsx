'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivos } from '@/lib/actions/calendarios'
import { criarComunicado } from '@/lib/actions/comunicados'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { ComunicadoForm, type ComunicadoFormValues } from '@/components/comunicados/comunicado-form'
import { combinarDataHora } from '@/components/comunicados/periodo-visibilidade-field'
import { ArrowLeft, Megaphone, ShieldAlert, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'portal.comunicados'

export default function ComunicadoNovoPage() {
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
      <NovoComunicadoForm />
    </Suspense>
  )
}

function NovoComunicadoForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [anoAtivo, setAnoAtivo] = useState<{ id: string; descricao: string } | null>(null)
  const [loadingAno, setLoadingAno] = useState(true)
  const [saving, setSaving] = useState(false)

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  useEffect(() => {
    if (!schoolId) {
      setLoadingAno(false)
      return
    }
    getAnosLetivos(schoolId)
      .then(list => {
        const ativo = list.find(a => a.status === 'ativo')
        setAnoAtivo(ativo ? { id: ativo.id, descricao: ativo.descricao } : null)
      })
      .catch(() => {})
      .finally(() => setLoadingAno(false))
  }, [schoolId])

  const voltar = () => router.push('/comunicados')

  const handleSave = async (values: ComunicadoFormValues) => {
    if (!schoolId || !anoAtivo) {
      toast.error('Escola ou ano letivo não selecionado')
      return
    }
    setSaving(true)
    try {
      await criarComunicado(schoolId, {
        anoLetivoId: anoAtivo.id,
        turmaIds: values.turmaIds,
        titulo: values.titulo,
        descricao: values.descricao,
        visivelDe: combinarDataHora(values.dataInicio, values.horaInicio),
        visivelAte: combinarDataHora(values.dataFim, values.horaFim),
      }, pessoaId)
      toast.success('Comunicado registrado')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar comunicado')
    } finally {
      setSaving(false)
    }
  }

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Novo Comunicado"
          description="Registre um aviso para exibir no Portal dos Responsáveis"
          icon={Megaphone}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de comunicados, selecione uma escola e clique em 'Novo Comunicado'."
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
          title="Novo Comunicado"
          description="Registre um aviso para exibir no Portal dos Responsáveis"
          icon={Megaphone}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para criar comunicados. Fale com o gestor da escola."
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
        title="Novo Comunicado"
        description="Registre um aviso para exibir no Portal dos Responsáveis"
        icon={Megaphone}
        actions={
          <Button variant="outline" onClick={voltar}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Voltar
          </Button>
        }
      />

      {loadingAno ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !anoAtivo ? (
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Nenhum ano letivo ativo"
            description="Não há ano letivo ativo para esta escola."
            action={
              <Button variant="outline" onClick={voltar}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Voltar
              </Button>
            }
          />
        </Card>
      ) : (
        schoolId && (
          <ComunicadoForm
            schoolId={schoolId}
            anoLetivo={anoAtivo}
            saving={saving}
            onCancel={voltar}
            onSave={handleSave}
          />
        )
      )}
    </PageContainer>
  )
}
