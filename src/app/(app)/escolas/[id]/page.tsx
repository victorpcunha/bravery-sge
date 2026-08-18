'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Trash2, ShieldAlert, Eye, ArrowLeft, School as SchoolIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EscolaForm } from '@/components/censo/escola-form'
import { getSchool, updateSchool, deleteSchool, type School } from '@/lib/actions/schools'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'

export default function UnidadeEscolarPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { user, loading: authLoading, schoolId, isSuperAdmin } = useAuth()
  const { loaded: permLoaded, pessoaId, isSetup, pode } = usePermissoes(isSuperAdmin ? null : schoolId)

  const [school, setSchool] = useState<School | null>(null)
  const [defaultValues, setDefaultValues] = useState<Record<string, any> | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const foraDeEscopo = !!schoolId && !isSuperAdmin && id !== schoolId
  const podeVisualizar = !foraDeEscopo && pode.visualizar('escolas')
  const podeEditar = podeVisualizar && !isSetup && pode.editar('escolas')
  const podeExcluir = podeVisualizar && !isSetup && pode.excluir('escolas')

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!permLoaded || !podeVisualizar) return

    getSchool(id, pessoaId || undefined)
      .then((s) => {
        setSchool(s)
        setDefaultValues(s as any)
        setLoading(false)
      })
      .catch(() => {
        setLoadError(true)
        setLoading(false)
      })
  }, [id, permLoaded, pessoaId, podeVisualizar])

  const handleSubmit = async (data: Record<string, any>) => {
    if (!podeEditar) return
    setIsSubmitting(true)
    try {
      await updateSchool(id, data, pessoaId || undefined)
      toast.success('Unidade Escolar atualizada com sucesso!')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar Unidade Escolar')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!['2', '3'].includes(school?.situacao_funcionamento || '')) {
      toast.error('Só é possível excluir unidades com situação "Paralisada" ou "Extinta"')
      setDeleteOpen(false)
      return
    }
    setDeleting(true)
    try {
      await deleteSchool(id, pessoaId || undefined)
      toast.success('Escola excluída com sucesso!')
      router.push('/escolas')
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao excluir escola')
      setDeleteOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const loadingUi = (
    <PageContainer>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </PageContainer>
  )

  if (authLoading || !permLoaded) return loadingUi

  if (!podeVisualizar) {
    return (
      <PageContainer>
        <PageHeader icon={ShieldAlert} title="Unidade Escolar" description="Acesso negado" />
        <Card className="shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="Seu perfil não possui permissão para visualizar esta unidade escolar."
          />
        </Card>
      </PageContainer>
    )
  }

  if (loading) return loadingUi

  if (loadError || !school) {
    return (
      <PageContainer>
        <PageHeader icon={ShieldAlert} title="Unidade Escolar" description="Acesso negado" />
        <Card className="shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="Seu perfil não possui permissão para visualizar esta unidade escolar."
          />
        </Card>
      </PageContainer>
    )
  }

  const situacao = school?.situacao_funcionamento
  const podeExcluirSituacao = situacao === '2' || situacao === '3'

  const abrirExclusao = () => {
    if (!podeExcluirSituacao) {
      toast.error('Só é possível excluir unidades com situação "Paralisada" ou "Extinta"')
      return
    }
    setDeleteOpen(true)
  }

  return (
    <PageContainer>
      <PageHeader
        icon={SchoolIcon}
        title={school.nome_escola}
        description="Dados cadastrais da unidade escolar (Registro 00)"
        actions={
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <Button variant="outline" size="sm" onClick={() => router.push('/escolas')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {podeExcluir && (
              <Button variant="destructive" size="sm" onClick={abrirExclusao}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
          </div>
        }
      />

      {!podeEditar && (
        <div className="mb-6 rounded-lg border border-warning bg-warning/10 p-4 flex items-start gap-3">
          <Eye className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-[15px] font-semibold text-foreground">Visualização somente</p>
            <p className="text-[15px] text-muted-foreground mt-0.5">
              Seu perfil não possui permissão para editar esta unidade. As alterações são controladas pelo Perfis e Permissões.
            </p>
          </div>
        </div>
      )}

      <EscolaForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        readOnly={!podeEditar}
        title=""
        schoolId={id}
        onCancel={() => router.push('/escolas')}
        submitLabel="Salvar Alterações"
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { if (!open) setDeleteOpen(false) }}
        title="Excluir unidade escolar"
        description={`Tem certeza que deseja excluir "${school.nome_escola}"? Esta ação é permanente e não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  )
}