import { PageSection } from '@/components/layout/page-section'
import { cn } from '@/lib/utils'

type OcupacaoCardProps = {
  data: { capacidadeTotal: number; matriculasAtivas: number }
  className?: string
}

function corPorPercentual(percentage: number): string {
  if (percentage > 100) return 'bg-destructive'
  if (percentage >= 80) return 'bg-warning'
  return 'bg-success'
}

export function OcupacaoCard({ data, className }: OcupacaoCardProps) {
  const { capacidadeTotal, matriculasAtivas } = data
  const percentage = capacidadeTotal > 0 ? Math.round((matriculasAtivas / capacidadeTotal) * 100) : 0

  return (
    <PageSection
      title="Taxa de Ocupação da Escola"
      description="Vagas preenchidas nas turmas"
      className={className}
    >
      {capacidadeTotal === 0 ? (
        <p className="text-[15px] text-muted-foreground py-4">Nenhuma turma cadastrada</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[15px]">
            <span className="text-muted-foreground tabular-nums">
              {matriculasAtivas.toLocaleString('pt-BR')} /{' '}
              {capacidadeTotal.toLocaleString('pt-BR')} vagas
            </span>
            <span className="font-semibold text-foreground tabular-nums">{percentage}%</span>
          </div>
          <div
            className="h-2 w-full rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Taxa de ocupação: ${percentage}%`}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                corPorPercentual(percentage)
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {percentage > 100 && (
            <p className="text-[13px] text-destructive">
              {percentage - 100}% acima da capacidade total
            </p>
          )}
        </div>
      )}
    </PageSection>
  )
}
