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
        <div className="space-y-5">
          {data.map((item, i) => (
            <div
              key={item.turma}
              className={cn(
                'flex flex-col gap-2.5',
                i > 0 && 'pt-5 border-t border-border'
              )}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" aria-hidden="true" />
                <h4 className="text-[15px] font-semibold text-foreground truncate">
                  {item.turma}
                </h4>
              </div>
              <ul className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-1.5 sm:items-center">
                {item.disciplinas.map((disciplina) => (
                  <li key={disciplina}>
                    <StatusBadge status="warning">{disciplina}</StatusBadge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  )
}
