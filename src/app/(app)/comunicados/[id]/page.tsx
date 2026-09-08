'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getAnosLetivos } from '@/lib/actions/calendarios'
import { getComunicado, atualizarComunicado, excluirComunicado, type ComunicadoDetalhe } from '@/lib/actions/comunicados'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { ComunicadoForm, type ComunicadoFormValues } from '@/components/comunicados/comunicado-form'
import { combinarDataHora } from '@/components/comunicados/periodo-visibilidade-field'
import { ArrowLeft, Megaphone, ShieldAlert, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'portal.comunicados'

function splitDataHora(iso: string | null): { data: string; hora: string } {
  if (!iso) return { data: '', hora: '' }
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/)
  if (!m) return { data: '', hora: '' }
  return { data: m[1], hora: m[2] }
}

export default function ComunicadoEditarPage() {
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
      <EditarComunicadoForm />
    </Suspense>
  )
}

function EditarComunicadoForm() {
  const router = useRouter()
  const params = useTabParams()
  const id = params.id as string
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [detalhe, setDetalhe] = useState<ComunicadoDetalhe | null>(null)
  const [anoDescricao, setAnoDescricao] = useState('')
  const [loading, setLoading] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { loaded: permLoaded, pessoaId: pid, pode } = usePermissoes(schoolId || '')

  useEffect(() => {
    if (pid !== undefined) setPessoaId(pid)
  }, [pid])

  useEffect(() => {
    if (!permLoaded || !schoolId || !id) return
    if (!pode.visualizar(RECURSO)) {
      setLoading(false)
      return
    }
    Promise.all([getComunicado(id, schoolId, pessoaId), getAnosLetivos(schoolId)])
      .then(([d, anos]) => {
        if (!d) {
          setNaoEncontrado(true)
          return
        }
        setDetalhe(d)
        setAnoDescricao(anos.find(a => a.id === d.anoLetivoId)?.descricao ?? '')
      })
      .catch(() => setNaoEncontrado(true))
      .finally(() => setLoading(false))
  }, [permLoaded, schoolId, id, pessoaId, pode])

  const voltar = () => router.push('/comunicados')
  const podeEditar = pode.editar(RECURSO)
  const podeExcluir = pode.excluir(RECURSO)

  const handleSave = async (values: ComunicadoFormValues) => {
    if (!schoolId || !detalhe?.anoLetivoId) return
    setSaving(true)
    try {
      await atualizarComunicado(id, schoolId, {
        anoLetivoId: detalhe.anoLetivoId,
        turmaIds: values.turmaIds,
        titulo: values.titulo,
        descricao: values.descricao,
        visivelDe: combinarDataHora(values.dataInicio, values.horaInicio),
        visivelAte: combinarDataHora(values.dataFim, values.horaFim),
      }, pessoaId)
      toast.success('Comunicado atualizado')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar comunicado')
    } finally {
      setSaving(false)
    }
  }

  const handleExcluir = async () => {
    if (!schoolId) return
    setDeleting(true)
    try {
      await excluirComunicado(id, schoolId, pessoaId)
      toast.success('Comunicado excluído')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir comunicado')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (!loading && permLoaded && !pode.visualizar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Comunicado"
          description="Altere os dados do comunicado"
          icon={Megaphone}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar este comunicado."
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

  if (!loading && naoEncontrado) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Comunicado"
          description="Altere os dados do comunicado"
          icon={Megaphone}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={AlertCircle}
            title="Comunicado não encontrado"
            description="O comunicado pode ter sido excluído ou pertence a outra escola."
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

  const de = splitDataHora(detalhe?.visivelDe ?? null)
  const ate = splitDataHora(detalhe?.visivelAte ?? null)

  return (
    <PageContainer>
      <PageHeader
        title="Editar Comunicado"
        description="Altere os dados do comunicado"
        icon={Megaphone}
        actions={
          <div className="flex items-center gap-2">
            {podeExcluir && detalhe && (
              <Button variant="outline" onClick={() => setDeleteOpen(true)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1.5" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={voltar}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          </div>
        }
      />

      {loading || !detalhe || !schoolId ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !podeEditar ? (
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão para editar"
          description="Você pode visualizar, mas não tem permissão para alterar este comunicado."
          action={
            <Button variant="outline" onClick={voltar}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          }
        />
      ) : (
        <ComunicadoForm
          key={detalhe.id}
          schoolId={schoolId}
          anoLetivo={{ id: detalhe.anoLetivoId ?? '', descricao: anoDescricao }}
          initial={{
            turmaIds: detalhe.turmaIds,
            titulo: detalhe.titulo,
            descricao: detalhe.descricao,
            dataInicio: de.data,
            dataFim: ate.data,
            horaInicio: de.hora,
            horaFim: ate.hora,
          }}
          saving={saving}
          submitLabel="Atualizar"
          onCancel={voltar}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir comunicado"
        description="Deseja excluir este comunicado? Ele deixará de ser exibido no Portal dos Responsáveis. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
