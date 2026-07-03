'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
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

const BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export default function FrequenciaPorTurmaChart({ data, className }: Props) {
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
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
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
                width={80}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 13,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                }}
                formatter={formatterFrequencia}
              />
              <Bar dataKey="taxa" radius={[0, 6, 6, 0]} maxBarSize={32}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
