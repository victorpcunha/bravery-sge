'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell } from 'recharts'
import { cn } from '@/lib/utils'

type FrequenciaMediaCardProps = {
  data: { presencas: number; total: number } | null
  className?: string
}

export function FrequenciaMediaCard({ data, className }: FrequenciaMediaCardProps) {
  if (!data || data.total === 0) {
    return (
      <Card className={cn('flex flex-col', className)}>
        <CardHeader>
          <CardTitle>Frequência Média da Escola</CardTitle>
          <CardDescription>Presenças / Total de registros</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4">Sem dados de frequência</p>
        </CardContent>
      </Card>
    )
  }

  const { presencas, total } = data
  const faltas = total - presencas
  const percentage = Math.round((presencas / total) * 100)

  const chartData = [
    { name: 'Presenças', value: presencas },
    { name: 'Faltas', value: faltas },
  ]

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Frequência Média da Escola</CardTitle>
        <CardDescription>Presenças / Total de registros</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-36 h-36">
          <PieChart width={144} height={144}>
            <Pie
              data={chartData}
              cx={72}
              cy={72}
              innerRadius={48}
              outerRadius={68}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill="hsl(var(--primary))" />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-heading font-bold text-foreground">
              {percentage}%
            </span>
            <span className="text-xs text-muted-foreground">presença</span>
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Presenças: {presencas}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="text-muted-foreground">Faltas: {faltas}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
