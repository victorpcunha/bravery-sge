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

export function RiscoEvasaoTable({ data, className }: RiscoEvasaoTableProps) {
  return (
    <PageSection
      title="Risco de Evasão"
      description="Turmas com alunos acima de 25% de faltas"
      variant="flush"
      className={className}
    >
      {data.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="Nenhuma turma com risco de evasão"
          description="Não foram encontradas turmas com alunos em situação de baixa frequência."
        />
      ) : (
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
                <TableCell>{row.totalAlunos}</TableCell>
                <TableCell>{row.alunosBaixaFrequencia}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'font-medium',
                      row.percentualMedioFaltas > 40
                        ? 'text-destructive'
                        : row.percentualMedioFaltas > 25
                          ? 'text-warning'
                          : 'text-success'
                    )}
                  >
                    {row.percentualMedioFaltas}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageSection>
  )
}
