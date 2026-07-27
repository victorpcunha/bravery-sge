'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  chartTooltipContentStyle,
  chartTooltipWrapperStyle,
  chartLegendFormatter,
  tooltipFormatter,
  useIsMobile,
  truncateLabel,
  CHART_SINGLE_BAR_GRADIENT_ID,
} from '@/components/dashboard/chart-helpers'
import { cn } from '@/lib/utils'

type AlunosPorDeficienciaItem = {
  nome: string
  quantidade: number
}

type Props = {
  data: AlunosPorDeficienciaItem[]
  className?: string
}

export default function AlunosPorDeficienciaChart({ data, className }: Props) {
  const isMobile = useIsMobile()

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Alunos por Deficiência</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="Sem dados"
            description="Nenhum dado de alunos por deficiência disponível."
          />
        </CardContent>
      </Card>
    )
  }

  const sorted = [...data].sort((a, b) => b.quantidade - a.quantidade)
  const maxLabelChars = isMobile ? 10 : 22

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Alunos por Deficiência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 4, bottom: 8 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id={CHART_SINGLE_BAR_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nome"
                tick={{ fontSize: 12, fill: 'var(--foreground)' }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 100 : 160}
                tickFormatter={(v) => truncateLabel(String(v), maxLabelChars)}
              />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                wrapperStyle={chartTooltipWrapperStyle}
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                formatter={tooltipFormatter('Alunos')}
              />
              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                iconSize={8}
                formatter={chartLegendFormatter}
              />
              <Bar
                dataKey="quantidade"
                name="Alunos"
                fill={`url(#${CHART_SINGLE_BAR_GRADIENT_ID})`}
                radius={[0, 6, 6, 0]}
                maxBarSize={28}
                cursor="default"
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
