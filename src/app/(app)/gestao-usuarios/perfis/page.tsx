'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Shield, ShieldOff } from 'lucide-react'
import { getFirstSchool } from '@/lib/actions/schools'
import { listarPerfis, type Perfil } from '@/lib/actions/perfis'
import { PerfilFiltros } from '@/components/perfis/perfil-filtros'
import { PerfilGrid } from '@/components/perfis/perfil-grid'
import { usePermissoes } from '@/hooks/use-permissoes'
import { toast } from 'sonner'

export default function PerfisPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [schoolId, setSchoolId] = useState('')
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [situacao, setSituacao] = useState('todas')
  const { loaded: permLoaded, pode, pessoaId, isSetup } = usePermissoes(schoolId)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    getFirstSchool().then(s => setSchoolId(s.id)).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!schoolId) return
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

  if (authLoading || !schoolId || (!permLoaded)) {
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
      <Sidebar />
      <div className="md:pl-64 container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Perfis e Permissões</h1>
                <p className="text-muted-foreground mt-1">
                  Gerencie os perfis de acesso e permissões do sistema
                </p>
              </div>
            </div>
          </div>
          {pode.criar('gestao-usuarios.perfis') && (
            <Button
              onClick={() => router.push('/gestao-usuarios/perfis/novo')}
              className="bg-primary hover:bg-primary/90 animate-fade-in-up"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Perfil
            </Button>
          )}
        </div>

        <PerfilFiltros
          search={search}
          onSearchChange={setSearch}
          situacao={situacao}
          onSituacaoChange={setSituacao}
        />

        <Card className="border-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Perfis cadastrados ({perfis.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PerfilGrid
              perfis={perfis}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              podeEditar={pode.editar('gestao-usuarios.perfis')}
              podeExcluir={pode.excluir('gestao-usuarios.perfis')}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
