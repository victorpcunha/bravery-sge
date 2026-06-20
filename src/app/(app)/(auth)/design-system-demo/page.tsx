'use client'

import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LayoutDashboard, List, FileEdit, Eye, ArrowRight } from 'lucide-react'

const pages = [
  {
    title: 'Listagem',
    description: 'PageContainer + PageHeader + FilterBar + PageSection(flush) + Table + StatusBadge + EmptyState + DropdownMenu',
    href: '/design-system-demo/list',
    icon: List,
    layout: 'Listagem',
  },
  {
    title: 'Cadastro (Form)',
    description: 'PageContainer + PageHeader(breadcrumbs) + FormCard + Input + Select + Textarea + Button + ConfirmDialog',
    href: '/design-system-demo/form',
    icon: FileEdit,
    layout: 'Cadastro/Edição',
  },
  {
    title: 'Visualização (Detail)',
    description: 'PageContainer + PageHeader(breadcrumbs) + PageSection + StatusBadge + Card',
    href: '/design-system-demo/detail',
    icon: Eye,
    layout: 'Visualização',
  },
  {
    title: 'Dashboard',
    description: 'PageContainer(maxWidth="dashboard") + PageHeader + StatCard + PageSection + StatusBadge',
    href: '/design-system-demo/dashboard',
    icon: LayoutDashboard,
    layout: 'Dashboard',
  },
]

export default function DesignSystemDemoPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Design System — Referência"
        description="Páginas de referência demonstrando layouts oficiais com componentes do Design System"
      />

      <PageSection title="Layouts Oficiais" description="Clique para visualizar cada layout com componentes reais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
                      <page.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{page.title}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">{page.layout}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{page.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </PageSection>

      <PageSection title="Componentes Disponíveis" description="Lista de componentes oficiais do Design System" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'PageContainer', desc: 'Container com maxWidth', file: 'layout/page-container.tsx' },
            { name: 'PageHeader', desc: 'Cabeçalho com ícone, breadcrumbs', file: 'layout/page-header.tsx' },
            { name: 'PageSection', desc: 'Seção com variant (default/flush/compact)', file: 'layout/page-section.tsx' },
            { name: 'FilterBar', desc: 'Barra de filtros com SearchInput', file: 'layout/filter-bar.tsx' },
            { name: 'SearchInput', desc: 'Campo de busca com ícone', file: 'layout/search-input.tsx' },
            { name: 'FormCard', desc: 'Card para formulários', file: 'layout/form-card.tsx' },
            { name: 'StatusBadge', desc: 'Badge semântico (success/warning/...)', file: 'feedback/status-badge.tsx' },
            { name: 'ConfirmDialog', desc: 'Confirmação destrutiva', file: 'feedback/confirm-dialog.tsx' },
            { name: 'EmptyState', desc: 'Estado vazio com ícone e ação', file: 'ui/empty-state.tsx' },
            { name: 'StatCard', desc: 'Card de estatística', file: 'ui/stat-card.tsx' },
          ].map((comp) => (
            <div key={comp.name} className="p-3 rounded-lg border border-border bg-background">
              <p className="text-sm font-medium text-foreground">{comp.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{comp.desc}</p>
              <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{comp.file}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Anti-Padrões Proibidos" description="Padrões que NÃO devem ser usados no código" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { bad: 'text-white em botões', good: 'text-primary-foreground ou Button default' },
            { bad: 'shadow-[rgba]', good: 'shadow-sm ou shadow-md' },
            { bad: 'card-glass', good: 'PageSection ou Card' },
            { bad: '<button> nativo', good: '<Button> shadcn' },
            { bad: '<table> nativo', good: '<Table> shadcn' },
            { bad: 'container mx-auto py-8 px-4', good: '<PageContainer>' },
            { bad: 'bg-purple-100 text-purple-700', good: '<StatusBadge status="...">' },
            { bad: 'ml-64 (sidebar hardcoded)', good: 'Remover (layout gerencia sidebar)' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
              <p className="text-xs font-medium text-destructive line-through">{item.bad}</p>
              <p className="text-xs font-medium text-success mt-1">{item.good}</p>
            </div>
          ))}
        </div>
      </PageSection>
    </PageContainer>
  )
}