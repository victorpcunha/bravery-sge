'use client'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import type { BreadcrumbItem } from '@/components/layout/page-header'

const breadcrumbs: BreadcrumbItem[] = [
  { label: 'Pessoas', href: '/design-system-demo' },
  { label: 'Ana Silva' },
]

export function DetailPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={MapPin}
        title="Ana Silva"
        description="Exemplo de página de visualização usando Design System"
        breadcrumbs={breadcrumbs}
        actions={
          <Button><Pencil className="mr-2 h-4 w-4" />Editar</Button>
        }
      />

      <PageSection title="Informações Pessoais" description="Dados básicos de cadastro" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Nome Completo</p>
            <p className="text-sm font-medium text-foreground">Ana Carolina da Silva</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">CPF</p>
            <p className="text-sm font-medium text-foreground">123.456.789-00</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tipo</p>
            <StatusBadge status="primary">Docente</StatusBadge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge status="success">Ativo</StatusBadge>
          </div>
        </div>
      </PageSection>

      <PageSection title="Contato" description="Email, telefone e endereço" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">ana.silva@email.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 shrink-0">
              <Phone className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="text-sm font-medium text-foreground">(11) 98765-4321</p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="Turmas Associadas" description="Turmas onde esta pessoa atua">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { nome: 'Turma A - 6º Ano', turno: 'Matutino', periodo: '2026' },
            { nome: 'Turma B - 7º Ano', turno: 'Vespertino', periodo: '2026' },
            { nome: 'Turma C - 8º Ano', turno: 'Noturno', periodo: '2026' },
          ].map((turma) => (
            <Card key={turma.nome} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground">{turma.nome}</p>
                <p className="text-xs text-muted-foreground mt-1">{turma.turno} — {turma.periodo}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>
    </PageContainer>
  )
}