'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { ChevronLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import {
  buscarPerfil,
  criarPerfil,
  editarPerfil,
  listarPermissoes,
  salvarPermissoes,
  type Perfil,
  type RecursoComPermissao,
} from '@/lib/actions/perfis'
import { PerfilForm } from '@/components/perfis/perfil-form'
import { usePermissoes } from '@/hooks/use-permissoes'
import { toast } from 'sonner'

type PageProps = {
  params: Promise<{ id: string }>
}

export default function PerfilCadastroPage({ params }: PageProps) {
  const { id } = use(params)
  const isNew = id === 'novo'

  const { user, loading: authLoading, schoolId } = useAuth()
  const router = useRouter()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [recursos, setRecursos] = useState<RecursoComPermissao[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { loaded: permLoaded, pode, isSetup, pessoaId } = usePermissoes(schoolId)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])



  useEffect(() => {
    loadData()
  }, [schoolId])

  useEffect(() => {
    if (permLoaded && !isSetup) {
      if (isNew && !pode.criar('gestao-usuarios.perfis')) {
        toast.error('Você não tem permissão para criar perfis')
        router.push('/gestao-usuarios/perfis')
      }
      if (!isNew && !pode.editar('gestao-usuarios.perfis')) {
        toast.error('Você não tem permissão para editar perfis')
        router.push('/gestao-usuarios/perfis')
      }
    }
  }, [permLoaded, schoolId, isSetup])

  const loadData = async () => {
    setLoading(true)
    try {
      const recursosData = await listarPermissoes(schoolId, id === 'novo' ? '' : id)

      if (!isNew) {
        const perfilData = await buscarPerfil(id)
        setPerfil(perfilData)
      }

      setRecursos(recursosData)
    } catch (e: any) {
      toast.error('Erro ao carregar dados: ' + (e?.message || 'desconhecido'))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: {
    nome: string
    descricao: string
    ativo: boolean
    usa_vinculo_turma: boolean
    permissoes: { recurso_id: string; visualizar: boolean; criar: boolean; editar: boolean; excluir: boolean }[]
  }) => {
    setSaving(true)
    try {
      if (isNew) {
        const created = await criarPerfil({
          school_id: schoolId!,
          nome: data.nome,
          descricao: data.descricao,
          ativo: data.ativo,
          usa_vinculo_turma: data.usa_vinculo_turma,
          created_by: pessoaId || undefined,
        })

        await salvarPermissoes(schoolId!, created.id, data.permissoes, pessoaId || undefined)
        toast.success('Perfil criado com sucesso!')
      } else {
        await editarPerfil(id, {
          nome: data.nome,
          descricao: data.descricao,
          ativo: data.ativo,
          usa_vinculo_turma: data.usa_vinculo_turma,
          updated_by: pessoaId || undefined,
        })

        await salvarPermissoes(schoolId!, id, data.permissoes, pessoaId || undefined)
        toast.success('Perfil atualizado com sucesso!')
      }

      router.push('/gestao-usuarios/perfis')
    } catch (e: any) {
      toast.error('Erro: ' + (e?.message || 'desconhecido'))
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading || !permLoaded) {
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
      <PageContainer className="max-w-5xl">
        <PageHeader
          title={isNew ? 'Novo Perfil' : 'Editar Perfil'}
          description={isNew ? 'Crie um novo perfil de acesso' : `Editando: ${perfil?.nome || ''}`}
          icon={Shield}
          actions={
            <Button variant="outline" size="sm" onClick={() => router.push('/gestao-usuarios/perfis')}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          }
        />

        <PageSection
          title={isNew ? 'Configurar novo perfil' : 'Editar configurações do perfil'}
          variant="default"
        >
          <PerfilForm
            perfil={perfil}
            recursos={recursos}
            onSave={handleSave}
            onCancel={() => router.push('/gestao-usuarios/perfis')}
            saving={saving}
          />
        </PageSection>
      </PageContainer>
  )
}
