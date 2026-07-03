import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type OcupacaoCardProps = {
  data: { capacidadeTotal: number; matriculasAtivas: number }
  className?: string
}

export function OcupacaoCard({ data, className }: OcupacaoCardProps) {
  const { capacidadeTotal, matriculasAtivas } = data
  const percentage = capacidadeTotal > 0 ? Math.round((matriculasAtivas / capacidadeTotal) * 100) : 0

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Taxa de Ocupação da Escola</CardTitle>
        <CardDescription>Vagas preenchidas nas turmas</CardDescription>
      </CardHeader>
      <CardContent>
        {capacidadeTotal === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhuma turma cadastrada</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {matriculasAtivas} / {capacidadeTotal} vagas
              </span>
              <span className="font-semibold text-foreground">{percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
