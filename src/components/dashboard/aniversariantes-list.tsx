import { Cake } from 'lucide-react'
import { PageSection } from '@/components/layout/page-section'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

type AniversariantesListProps = {
  data: { nome: string; data: string; turma: string }[]
  className?: string
}

function formatDate(dateStr: string) {
  try {
    const [, month, day] = dateStr.split('-')
    return `${day}/${month}`
  } catch {
    return dateStr
  }
}

export function AniversariantesList({ data, className }: AniversariantesListProps) {
  return (
    <PageSection
      title="Aniversariantes do Mês"
      description="Alunos com matrícula ativa que fazem aniversário este mês"
      className={className}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={Cake}
          title="Nenhum aniversariante este mês"
          description="Não há alunos com matrícula ativa fazendo aniversário no mês corrente."
        />
      ) : (
        <ul className="divide-y divide-border">
          {data.map((item, i) => (
            <li
              key={`${item.nome}-${i}`}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                <Cake className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-foreground truncate">{item.nome}</p>
                <p className="text-[13px] text-muted-foreground">
                  {formatDate(item.data)} — {item.turma}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  )
}
