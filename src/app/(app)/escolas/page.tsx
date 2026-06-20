import Link from 'next/link'
import { Plus, School, MapPin, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { PageSection } from '@/components/layout/page-section'
import { getSchools } from '@/lib/actions/schools'

const situacaoFuncionario = {
  '1': 'Em Atividade',
  '2': 'Paralisada',
  '3': 'Extinta',
  '4': 'Em Construção',
}

const dependenciaAdministrativa = {
  '1': 'Federal',
  '2': 'Estadual',
  '3': 'Municipal',
  '4': 'Privada',
}

const localizacao = {
  '1': 'Urbana',
  '2': 'Rural',
}

export default async function EscolasPage() {
  const schools = await getSchools()

  return (
    <PageContainer>
      <PageHeader
        icon={School}
        title="Escolas"
        description="Gerencie as unidades escolares (Registro 00)"
        actions={
          <Button asChild>
            <Link href="/escolas/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Link>
          </Button>
        }
      />

      {schools.length === 0 ? (
        <EmptyState
          icon={School}
          title="Nenhuma escola cadastrada"
          description="Comece cadastrando sua primeira escola para utilizar o sistema de gestão escolar."
          action={
            <Button asChild>
              <Link href="/escolas/novo">Cadastrar Primeira Escola</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <Link key={school.id} href={`/escolas/${school.id}`}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full group">
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                      {school.nome_escola}
                    </CardTitle>
                    <StatusBadge status={school.situacao_funcionamento === '1' ? 'success' : 'muted'}>
                      {situacaoFuncionario[school.situacao_funcionamento as keyof typeof situacaoFuncionario] || school.situacao_funcionamento}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {school.codigo_inep && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">INEP:</span>
                      <span>{school.codigo_inep}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center">
                      <School className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="font-medium">Tipo:</span>
                    <span>{dependenciaAdministrativa[school.dependencia_administrativa as keyof typeof dependenciaAdministrativa]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-7 h-7 bg-ring/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-ring" />
                    </div>
                    <span className="font-medium">Local:</span>
                    <span>{localizacao[school.localizacao as keyof typeof localizacao]}</span>
                  </div>
                  {school.telefone_1 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span>{school.telefone_1}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <span className="truncate">{school.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <PageSection
        title={`Total: ${schools.length} escola(s)`}
        description="Estes dados serão enviados ao Censo INEP 2026 (Registro 00)"
        actions={
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <School className="w-5 h-5 text-primary" />
          </div>
        }
        variant="compact"
        className="mt-8"
      >
        {' '}
      </PageSection>
    </PageContainer>
  )
}