import { PageSection } from '@/components/layout/page-section'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type RiscoEvasaoTableProps = {
  data: {
    turma: string
    totalAlunos: number
    alunosBaixaFrequencia: number
    percentualMedioFaltas: number
  }[]
  className?: string
}

function corPorPercentual(percentual: number): string {
  if (percentual > 40) return 'text-destructive'
  if (percentual > 25) return 'text-warning'
  return 'text-success'
}

export function RiscoEvasaoTable({ data, className }: RiscoEvasaoTableProps) {
  if (data.length === 0) {
    return (
      <PageSection
        title="Risco de Evasão"
        description="Turmas com alunos acima de 25% de faltas"
        className={className}
      >
        <EmptyState
          icon={AlertTriangle}
          title="Nenhuma turma com risco de evasão"
          description="Não foram encontradas turmas com alunos em situação de baixa frequência."
        />
      </PageSection>
    )
  }

  return (
    <PageSection
      title="Risco de Evasão"
      description="Turmas com alunos acima de 25% de faltas"
      className={className}
    >
      {/* Mobile: lista de cards (PE-602) */}
      <ul className="block md:hidden space-y-3">
        {data.map((row) => (
          <li
            key={row.turma}
            className="rounded-lg border border-border bg-card p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-[15px] font-semibold text-foreground truncate flex-1 min-w-0">
                {row.turma}
              </p>
              <span
                className={cn(
                  'shrink-0 text-[15px] font-bold tabular-nums',
                  corPorPercentual(row.percentualMedioFaltas)
                )}
              >
                {row.percentualMedioFaltas}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-muted-foreground tabular-nums">
              <span>{row.totalAlunos} alunos</span>
              <span>{row.alunosBaixaFrequencia} baixa frequência</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: tabela */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turma</TableHead>
              <TableHead>Alunos</TableHead>
              <TableHead>Alunos com Baixa Frequência</TableHead>
              <TableHead>% Médio de Faltas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.turma}>
                <TableCell className="font-medium">{row.turma}</TableCell>
                <TableCell className="tabular-nums">{row.totalAlunos}</TableCell>
                <TableCell className="tabular-nums">{row.alunosBaixaFrequencia}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'font-medium tabular-nums',
                      corPorPercentual(row.percentualMedioFaltas)
                    )}
                  >
                    {row.percentualMedioFaltas}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageSection>
  )
}
