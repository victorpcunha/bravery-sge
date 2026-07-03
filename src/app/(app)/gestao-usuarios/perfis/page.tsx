'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Shield } from 'lucide-react'
import { listarPerfis, type Perfil } from '@/lib/actions/perfis'
import { PerfilFiltros } from '@/components/perfis/perfil-filtros'
import { PerfilGrid } from '@/components/perfis/perfil-grid'
import { usePermissoes } from '@/hooks/use-permissoes'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { ConfirmDialog } from '@/components/feedback/confirm-dialog'

export default function PerfisPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [situacao, setSituacao] = useState('todas')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const { loaded: permLoaded, pode, pessoaId, isSetup } = usePermissoes(schoolId)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const effectiveId = isSuperAdmin ? selectedSchoolId : schoolId

  useEffect(() => {
    loadPerfis()
  }, [effectiveId, search, situacao])

  useEffect(() => {
    if (permLoaded && effectiveId && !isSetup && !pode.visualizar('gestao-usuarios.perfis')) {
      toast.error('Você não tem permissão para acessar esta página')
      router.push('/')
    }
  }, [permLoaded, effectiveId, isSetup])

  const loadPerfis = async () => {
    setLoading(true)
    try {
      const ativo = situacao === 'todas' ? undefined : situacao === 'ativas'
      const data = await listarPerfis(effectiveId, { search: search || undefined, ativo })
      setPerfis(data)
    } catch {
      toast.error('Erro ao carregar perfis')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (perfil: Perfil) => {
    router.push(`/gestao-usuarios/perfis/${perfil.id}`)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const { excluirPerfil } = await import('@/lib/actions/perfis')
      await excluirPerfil(deleteTarget, pessoaId || undefined)
      toast.success('Perfil excluído')
      setDeleteTarget(null)
      loadPerfis()
    } catch {
      toast.error('Erro ao excluir perfil')
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || (!permLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageContainer>
        <PageHeader
          title="Perfis e Permissões"
          description="Gerencie os perfis de acesso e permissões do sistema"
          icon={Shield}
        />

        <PageSection variant="compact" title="Filtros" className="mb-6">
          {isSuperAdmin && allSchools.length > 0 && (
            <Select
              value={selectedSchoolId ?? '__all__'}
              onValueChange={(v) => setSelectedSchoolId(v === '__all__' ? null : v)}
            >
              <SelectTrigger className="w-auto min-w-[180px] h-9">
                <SelectValue placeholder="Todas as escolas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todas as escolas</SelectItem>
                {allSchools.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.nome_escola}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <PerfilFiltros
            search={search}
            onSearchChange={setSearch}
            situacao={situacao}
            onSituacaoChange={setSituacao}
          />
        </PageSection>

        <PageSection
          title="Perfis cadastrados"
          variant="flush"
          actions={
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{perfis.length} registro(s)</span>
              {pode.criar('gestao-usuarios.perfis') && (
                <Button onClick={() => router.push('/gestao-usuarios/perfis/novo')} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Novo Perfil
                </Button>
              )}
            </div>
          }
        >
          <div className="px-4">
            <PerfilGrid
              perfis={perfis}
              loading={loading}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteTarget(id)}
              podeEditar={pode.editar('gestao-usuarios.perfis')}
              podeExcluir={pode.excluir('gestao-usuarios.perfis')}
            />
          </div>
        </PageSection>
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Excluir perfil"
        description="Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
