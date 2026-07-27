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
  corTaxaOcupacao,
  chartTooltipContentStyle,
  chartTooltipWrapperStyle,
  chartLegendFormatter,
  SemanticLegend,
  useIsMobile,
  truncateLabel,
} from '@/components/dashboard/chart-helpers'
import { cn } from '@/lib/utils'

type OcupacaoPorTurmaItem = {
  turma: string
  capacidade: number
  matriculas: number
}

type Props = {
  data: OcupacaoPorTurmaItem[]
  className?: string
}

export default function OcupacaoPorTurmaChart({ data, className }: Props) {
  const isMobile = useIsMobile()

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Ocupação por Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="Sem dados"
            description="Nenhum dado de ocupação por turma disponível."
          />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map(d => ({
    ...d,
    taxa: d.capacidade > 0 ? Math.round((d.matriculas / d.capacidade) * 100) : 0,
  }))

  const formatterOcupacao = (value: unknown, _name: unknown, props: unknown) => {
    const entry = props as { payload: { matriculas: number; capacidade: number; taxa: number } }
    return [`${entry.payload.matriculas}/${entry.payload.capacidade} (${entry.payload.taxa}%)`, 'Ocupação']
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ocupação por Turma</CardTitle>
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
                domain={[0, 120]}
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
                formatter={formatterOcupacao}
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
                  <Cell key={i} fill={corTaxaOcupacao(d.taxa)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <SemanticLegend
            items={[
              { label: 'Saudável (≤80%)', colorVar: 'var(--success)' },
              { label: 'Atenção (80-100%)', colorVar: 'var(--warning)' },
              { label: 'Lotada (>100%)', colorVar: 'var(--destructive)' },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  )
}
