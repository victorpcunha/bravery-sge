import { PageSection } from '@/components/layout/page-section'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type TurmasSemProfessorListProps = {
  data: { turma: string; disciplinas: string[] }[]
  className?: string
}

export function TurmasSemProfessorList({ data, className }: TurmasSemProfessorListProps) {
  return (
    <PageSection
      title="Turmas sem Professor"
      description="Disciplinas sem profissional vinculado"
      className={className}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="Todas as disciplinas possuem professores vinculados"
          description="Nenhuma pendência de alocação encontrada."
        />
      ) : (
        <div className="divide-y divide-border">
          {data.map((item, i) => (
            <div key={i} className={cn('py-4', i === 0 && 'pt-0', i === data.length - 1 && 'pb-0')}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                <h4 className="text-sm font-semibold text-foreground">{item.turma}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 ml-6">
                {item.disciplinas.map((disciplina) => (
                  <StatusBadge key={disciplina} status="warning">
                    {disciplina}
                  </StatusBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  )
}
