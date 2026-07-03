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

type AlunosPorDeficienciaItem = {
  nome: string
  quantidade: number
}

type Props = {
  data: AlunosPorDeficienciaItem[]
  className?: string
}

const BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export default function AlunosPorDeficienciaChart({ data, className }: Props) {
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Alunos por Deficiência</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
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
                width={140}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 13,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--card)',
                  color: 'var(--foreground)',
                }}
                formatter={(value: unknown) => [Number(value), 'Alunos']}
              />
              <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} maxBarSize={32} cursor="default" activeBar={false}>
                {sorted.map((_, i) => (
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
