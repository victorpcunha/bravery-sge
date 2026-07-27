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
  Cell,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  corTaxaFrequencia,
  chartTooltipContentStyle,
  chartTooltipWrapperStyle,
  chartLegendFormatter,
  SemanticLegend,
  useIsMobile,
  truncateLabel,
} from '@/components/dashboard/chart-helpers'
import { cn } from '@/lib/utils'

type FrequenciaPorTurmaItem = {
  turma: string
  presencas: number
  total: number
}

type Props = {
  data: FrequenciaPorTurmaItem[]
  className?: string
}

export default function FrequenciaPorTurmaChart({ data, className }: Props) {
  const isMobile = useIsMobile()

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Frequência por Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="Sem dados"
            description="Nenhum dado de frequência por turma disponível."
          />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(d => ({
    ...d,
    taxa: d.total > 0 ? Math.round((d.presencas / d.total) * 100) : 0,
  }))

  const formatterFrequencia = (value: unknown, _name: unknown, props: unknown) => {
    const entry = props as { payload: { presencas: number; total: number; taxa: number } }
    return [`${entry.payload.presencas}/${entry.payload.total} (${entry.payload.taxa}%)`, 'Frequência']
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Frequência por Turma</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="turma"
                tick={{ fontSize: 12, fill: 'var(--foreground)' }}
                axisLine={false}
                tickLine={false}
                width={isMobile ? 70 : 90}
                tickFormatter={(v) => truncateLabel(String(v), isMobile ? 8 : 14)}
              />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                wrapperStyle={chartTooltipWrapperStyle}
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                formatter={formatterFrequencia}
              />
              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                iconSize={8}
                formatter={chartLegendFormatter}
              />
              <Bar dataKey="taxa" radius={[0, 6, 6, 0]} maxBarSize={28} cursor="default" activeBar={false}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={corTaxaFrequencia(d.taxa)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <SemanticLegend
            items={[
              { label: 'Boa (≥90%)', colorVar: 'var(--success)' },
              { label: 'Atenção (75-90%)', colorVar: 'var(--warning)' },
              { label: 'Crítica (<75%)', colorVar: 'var(--destructive)' },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  )
}
