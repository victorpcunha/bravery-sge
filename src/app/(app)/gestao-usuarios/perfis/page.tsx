'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Plus, Shield } from 'lucide-react'
import { listarPerfis, type Perfil } from '@/lib/actions/perfis'
import { PerfilFiltros } from '@/components/perfis/perfil-filtros'
import { PerfilGrid } from '@/components/perfis/perfil-grid'
import { usePermissoes } from '@/hooks/use-permissoes'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'

export default function PerfisPage() {
  const { user, loading: authLoading, schoolId } = useAuth()
  const router = useRouter()
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [situacao, setSituacao] = useState('todas')
  const { loaded: permLoaded, pode, pessoaId, isSetup } = usePermissoes(schoolId)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])



  useEffect(() => {
    loadPerfis()
  }, [schoolId, search, situacao])

  useEffect(() => {
    if (permLoaded && schoolId && !isSetup && !pode.visualizar('gestao-usuarios.perfis')) {
      toast.error('Você não tem permissão para acessar esta página')
      router.push('/')
    }
  }, [permLoaded, schoolId, isSetup])

  const loadPerfis = async () => {
    setLoading(true)
    try {
      const ativo = situacao === 'todas' ? undefined : situacao === 'ativas'
      const data = await listarPerfis(schoolId, { search: search || undefined, ativo })
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este perfil?')) return
    try {
      const { excluirPerfil } = await import('@/lib/actions/perfis')
      await excluirPerfil(id, pessoaId || undefined)
      toast.success('Perfil excluído')
      loadPerfis()
    } catch {
      toast.error('Erro ao excluir perfil')
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
      <PageContainer>
        <PageHeader
          title="Perfis e Permissões"
          description="Gerencie os perfis de acesso e permissões do sistema"
          icon={Shield}
          actions={pode.criar('gestao-usuarios.perfis') ? (
            <Button onClick={() => router.push('/gestao-usuarios/perfis/novo')}>
              <Plus className="mr-2 h-4 w-4" /> Novo Perfil
            </Button>
          ) : undefined}
        />

        <PerfilFiltros
          search={search}
          onSearchChange={setSearch}
          situacao={situacao}
          onSituacaoChange={setSituacao}
        />

        <PageSection
          title="Perfis cadastrados"
          actions={<span className="text-sm text-muted-foreground">{perfis.length} registro(s)</span>}
          variant="flush"
        >
          <PerfilGrid
            perfis={perfis}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            podeEditar={pode.editar('gestao-usuarios.perfis')}
            podeExcluir={pode.excluir('gestao-usuarios.perfis')}
          />
        </PageSection>
      </PageContainer>
  )
}
