'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PieChartIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { colorPorIndice, chartTooltipContentStyle, chartTooltipWrapperStyle, chartLegendFormatter, tooltipFormatter } from '@/components/dashboard/chart-helpers'
import { cn } from '@/lib/utils'

type AlunosPorModalidadeItem = {
  modalidade: string
  quantidade: number
}

type Props = {
  data: AlunosPorModalidadeItem[]
  className?: string
}

export default function AlunosPorModalidadeChart({ data, className }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Alunos por Modalidade</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={PieChartIcon}
            title="Sem dados"
            description="Nenhum dado de alunos por modalidade disponível."
          />
        </CardContent>
      </Card>
    )
  }

  const sorted = [...data].sort((a, b) => b.quantidade - a.quantidade)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Alunos por Modalidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sorted}
                dataKey="quantidade"
                nameKey="modalidade"
                cx="50%"
                cy="45%"
                outerRadius={88}
                innerRadius={48}
                paddingAngle={2}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {sorted.map((_, i) => (
                  <Cell key={i} fill={colorPorIndice(i)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                wrapperStyle={chartTooltipWrapperStyle}
                formatter={tooltipFormatter('Alunos')}
              />
              <Legend
                verticalAlign="bottom"
                height={32}
                iconType="circle"
                iconSize={8}
                formatter={chartLegendFormatter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
