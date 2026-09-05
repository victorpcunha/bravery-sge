'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts'
import { chartTooltipContentStyle, chartTooltipWrapperStyle } from '@/components/dashboard/chart-helpers'

export type FechamentoPieDatum = {
  name: string
  value: number
  color: string
}

function renderActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, isActive } = props
  const raio = outerRadius + (isActive ? 6 : 0)
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={raio}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {isActive && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground text-[15px] font-bold tabular-nums">
            {payload?.value ?? 0}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            {payload?.name ?? ''}
          </text>
        </>
      )}
    </g>
  )
}

export function FechamentoPieChart({ data }: { data: FechamentoPieDatum[] }) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  )

  const dadosValidos = sorted.filter(d => d.value > 0)

  if (dadosValidos.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-[14px] text-muted-foreground">
        Sem dados para exibir.
      </div>
    )
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dadosValidos}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={84}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
            activeShape={renderActiveShape}
            inactiveShape={renderActiveShape}
          >
            {dadosValidos.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTooltipContentStyle}
            wrapperStyle={chartTooltipWrapperStyle}
            formatter={(value: any) => [value, 'Alunos']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}