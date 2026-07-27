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
          <p className="text-[15px] text-muted-foreground py-4">Sem dados de frequência</p>
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
        <div className="relative w-40 h-40">
          <PieChart width={160} height={160}>
            <Pie
              data={chartData}
              cx={80}
              cy={80}
              innerRadius={54}
              outerRadius={76}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="var(--success)" />
              <Cell fill="var(--muted)" />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[36px] font-bold leading-none text-foreground tabular-nums">
              {percentage}%
            </span>
            <span className="text-[13px] text-muted-foreground mt-1">presença</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-4 text-[13px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="text-muted-foreground">Presenças: {presencas.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="text-muted-foreground">Faltas: {faltas.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
