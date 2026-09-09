'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTabParams } from '@/lib/tab-params'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { getOcorrencia, atualizarOcorrencia, excluirOcorrencia, resolverNomesPessoas, type OcorrenciaDetalhe } from '@/lib/actions/ocorrencias'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'
import { OcorrenciaForm, type OcorrenciaFormValues, type OcorrenciaFormInitial } from '@/components/ocorrencias/ocorrencia-form'
import { ArrowLeft, AlertTriangle, ShieldAlert, Trash2, AlertCircle, School } from 'lucide-react'
import { toast } from 'sonner'

const RECURSO = 'gestao-academica.ocorrencias'

export default function OcorrenciaEditarPage() {
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
      <EditarOcorrenciaForm />
    </Suspense>
  )
}

function EditarOcorrenciaForm() {
  const router = useRouter()
  const params = useTabParams()
  const id = params.id as string
  const searchParams = useSearchParams()
  const escolaParam = searchParams.get('escola')
  const { schoolId: authSchoolId, isSuperAdmin } = useAuth()
  const schoolId = isSuperAdmin ? escolaParam : authSchoolId

  const [pessoaId, setPessoaId] = useState<string | null>(null)
  const [initial, setInitial] = useState<OcorrenciaFormInitial | null>(null)
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
    if (!permLoaded) return
    if (!id) {
      setNaoEncontrado(true)
      setLoading(false)
      return
    }
    if (!schoolId) return
    if (!pode.visualizar(RECURSO)) {
      setLoading(false)
      return
    }
    getOcorrencia(id, schoolId, pessoaId)
      .then(async (d: OcorrenciaDetalhe | null) => {
        if (!d) {
          setNaoEncontrado(true)
          return
        }
        const nomes = await resolverNomesPessoas(schoolId, [...d.profissionalIds, ...d.alunoIds], pessoaId)
        const porId = new Map(nomes.map(n => [n.id, n.nome]))
        const profIds = new Set(d.profissionalIds)
        const nomesProfissionais: Record<string, string> = {}
        const nomesAlunos: Record<string, string> = {}
        for (const [nid, nome] of porId) {
          if (profIds.has(nid)) nomesProfissionais[nid] = nome
          else nomesAlunos[nid] = nome
        }
        setInitial({
          titulo: d.titulo,
          tipo: d.tipo,
          dataOcorrencia: d.dataOcorrencia,
          detalhes: d.detalhes,
          apresentarPortal: d.apresentarPortal,
          profissionalIds: d.profissionalIds,
          alunoIds: d.alunoIds,
          nomesProfissionais,
          nomesAlunos,
        })
      })
      .catch(() => setNaoEncontrado(true))
      .finally(() => setLoading(false))
  }, [permLoaded, schoolId, id, pessoaId, pode])

  const voltar = () => router.push('/ocorrencias')
  const podeEditar = pode.editar(RECURSO)
  const podeExcluir = pode.excluir(RECURSO)

  const handleSave = async (values: OcorrenciaFormValues) => {
    if (!schoolId || !values.tipo) return
    setSaving(true)
    try {
      await atualizarOcorrencia(id, schoolId, {
        titulo: values.titulo,
        tipo: values.tipo,
        dataOcorrencia: values.dataOcorrencia,
        detalhes: values.detalhes,
        apresentarPortal: values.apresentarPortal,
        profissionalIds: values.profissionalIds,
        alunoIds: values.alunoIds,
      }, pessoaId)
      toast.success('Ocorrência atualizada')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar ocorrência')
    } finally {
      setSaving(false)
    }
  }

  const handleExcluir = async () => {
    if (!schoolId) return
    setDeleting(true)
    try {
      await excluirOcorrencia(id, schoolId, pessoaId)
      toast.success('Ocorrência excluída')
      voltar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir ocorrência')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (isSuperAdmin && !escolaParam) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Ocorrência"
          description="Altere os dados da ocorrência"
          icon={AlertTriangle}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={School}
            title="Selecione uma escola"
            description="Volte para a lista de ocorrências, selecione uma escola e abra a ocorrência para editar."
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

  if (!loading && permLoaded && !pode.visualizar(RECURSO)) {
    return (
      <PageContainer>
        <PageHeader
          title="Editar Ocorrência"
          description="Altere os dados da ocorrência"
          icon={AlertTriangle}
        />
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão"
          description="Você não tem permissão para visualizar esta ocorrência."
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
          title="Editar Ocorrência"
          description="Altere os dados da ocorrência"
          icon={AlertTriangle}
        />
        <Card className="shadow-sm">
          <EmptyState
            icon={AlertCircle}
            title="Ocorrência não encontrada"
            description="A ocorrência pode ter sido excluída ou pertence a outra escola."
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

  return (
    <PageContainer>
      <PageHeader
        title="Editar Ocorrência"
        description="Altere os dados da ocorrência"
        icon={AlertTriangle}
        actions={
          <div className="flex items-center gap-2">
            {podeExcluir && initial && (
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

      {loading || !initial || !schoolId ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !podeEditar ? (
        <EmptyState
          icon={ShieldAlert}
          title="Sem permissão para editar"
          description="Você pode visualizar, mas não tem permissão para alterar esta ocorrência."
          action={
            <Button variant="outline" onClick={voltar}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar
            </Button>
          }
        />
      ) : (
        <OcorrenciaForm
          key={id}
          schoolId={schoolId}
          pessoaId={pessoaId}
          initial={initial}
          saving={saving}
          submitLabel="Atualizar"
          onCancel={voltar}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir ocorrência"
        description="Deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        loading={deleting}
        onConfirm={handleExcluir}
      />
    </PageContainer>
  )
}
