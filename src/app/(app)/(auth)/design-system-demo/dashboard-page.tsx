'use client'

import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Users, GraduationCap, BookOpen, CheckCircle } from 'lucide-react'

export function DashboardPage() {
  return (
    <PageContainer maxWidth="dashboard">
      <PageHeader
        icon={GraduationCap}
        title="Dashboard"
        description="Exemplo de página dashboard usando Design System"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} value={12} label="Docentes" variant="default" />
        <StatCard icon={GraduationCap} value={340} label="Alunos" variant="success" />
        <StatCard icon={BookOpen} value={8} label="Turmas" variant="default" />
        <StatCard icon={CheckCircle} value="95%" label="Frequência" variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageSection title="Resumo de Turmas" description="Status das turmas ativas">
          <div className="space-y-3">
            {[
              { nome: '6º Ano A', alunos: 35, status: 'Ativo' },
              { nome: '7º Ano B', alunos: 42, status: 'Ativo' },
              { nome: '8º Ano C', alunos: 28, status: 'Ativo' },
              { nome: '9º Ano A', alunos: 38, status: 'Inativo' },
            ].map((turma) => (
              <div key={turma.nome} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{turma.nome}</p>
                  <p className="text-xs text-muted-foreground">{turma.alunos} alunos</p>
                </div>
                <StatusBadge status={turma.status === 'Ativo' ? 'success' : 'destructive'}>
                  {turma.status}
                </StatusBadge>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection title="Atividade Recente" description="Últimas ações no sistema">
          <div className="space-y-3">
            {[
              { desc: 'Nova matrícula registrada', tempo: '5 min atrás', tipo: 'success' },
              { desc: 'Frequência atualizada — Turma A', tempo: '15 min atrás', tipo: 'info' },
              { desc: 'Plano de aula cadastrado', tempo: '1h atrás', tipo: 'primary' },
              { desc: 'Aluno transferido — Turma B', tempo: '2h atrás', tipo: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm text-foreground">{item.desc}</p>
                <p className="text-xs text-muted-foreground">{item.tempo}</p>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </PageContainer>
  )
}