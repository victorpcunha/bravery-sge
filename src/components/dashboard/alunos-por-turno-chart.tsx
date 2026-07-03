'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { PieChartIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

type AlunosPorTurnoItem = {
  turno: string
  quantidade: number
}

type Props = {
  data: AlunosPorTurnoItem[]
  className?: string
}

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export default function AlunosPorTurnoChart({ data, className }: Props) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Alunos por Turno</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={PieChartIcon}
            title="Sem dados"
            description="Nenhum dado de alunos por turno disponível."
          />
        </CardContent>
      </Card>
    )
  }

  const sorted = [...data].sort((a, b) => b.quantidade - a.quantidade)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Alunos por Turno</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sorted}
                dataKey="quantidade"
                nameKey="turno"
                cx="50%"
                cy="45%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={3}
                stroke="none"
              >
                {sorted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
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
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                fontSize={12}
                formatter={(value: string) => (
                  <span style={{ color: 'var(--foreground)', fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
