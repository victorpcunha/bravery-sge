'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ShieldAlert, School } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import DocumentosTabs from '@/components/documentos/documentos-tabs'

export default function DocumentosPage() {
  const { user, loading: authLoading, schoolId, isSuperAdmin, allSchools } = useAuth()
  const router = useRouter()
  const { loaded: permLoaded, pessoaId, pode } = usePermissoes(schoolId || '')
  const [escolaContexto, setEscolaContexto] = useState('')

  const escolaAuto = isSuperAdmin && allSchools.length === 1 ? allSchools[0].id : ''
  const escolaOperacional = isSuperAdmin ? escolaContexto || escolaAuto || null : schoolId

  if (authLoading || !permLoaded) {
    return (
      <PageContainer>
        <PageHeader
          icon={FileText}
          title="Documentos"
          description="Documentos oficiais e relatórios da Unidade Escolar"
        />
        <PageSection variant="default" title="Carregando...">
          <div className="space-y-3 animate-pulse">
            <div className="h-10 w-full bg-muted rounded-lg" />
            <div className="h-32 w-full bg-muted rounded-lg" />
          </div>
        </PageSection>
      </PageContainer>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const podeOficiais = isSuperAdmin ? true : pode.visualizar('documentos.oficiais')
  const podePreencher = isSuperAdmin ? true : pode.visualizar('documentos.preencher')
  const podeRelatorios = isSuperAdmin ? true : pode.visualizar('relatorios')

  if (!podeOficiais && !podePreencher && !podeRelatorios) {
    return (
      <PageContainer>
        <PageHeader
          icon={FileText}
          title="Documentos"
          description="Documentos oficiais e relatórios da Unidade Escolar"
        />
        <PageSection variant="default" title="Acesso">
          <EmptyState
            icon={ShieldAlert}
            title="Sem permissão"
            description="Seu perfil não possui permissão para acessar o módulo de Documentos. Peça ao gestor da escola para conceder o recurso desejado (Documentos Oficiais, Preenchimento Manual ou Relatórios) ao seu perfil."
          />
        </PageSection>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        icon={FileText}
        title="Documentos"
        description="Documentos oficiais e relatórios da Unidade Escolar"
      />

      {!schoolId && !isSuperAdmin && (
        <PageSection variant="default" title="Unidade Escolar" className="mb-6">
          <EmptyState
            icon={School}
            title="Nenhuma unidade escolar"
            description="Você não possui unidade escolar vinculada para gerar documentos."
          />
        </PageSection>
      )}

      {isSuperAdmin && (
        <PageSection variant="compact" title="Unidade Escolar" className="mb-6">
          <div className="max-w-md">
            <Label className="mb-1.5 block text-[14px] font-medium text-foreground">
              Unidade Escolar <span className="text-destructive">*</span>
            </Label>
            <Select value={escolaContexto || escolaAuto} onValueChange={setEscolaContexto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade escolar" />
              </SelectTrigger>
              <SelectContent>
                {allSchools.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nome_escola}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PageSection>
      )}

      <DocumentosTabs
        schoolId={escolaOperacional}
        pessoaId={pessoaId}
        podeOficiais={podeOficiais}
        podePreencher={podePreencher}
        podeRelatorios={podeRelatorios}
      />
    </PageContainer>
  )
}