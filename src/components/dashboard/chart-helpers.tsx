'use client'

import { useEffect, useState } from 'react'
import type { TooltipProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export const CHART_BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export const CHART_SINGLE_BAR_GRADIENT_ID = 'barPrimaryGradient'

export function colorPorIndice(i: number): string {
  return CHART_BAR_COLORS[i % CHART_BAR_COLORS.length]
}

export function corTaxaOcupacao(taxa: number): string {
  if (taxa <= 80) return 'var(--success)'
  if (taxa <= 100) return 'var(--warning)'
  return 'var(--destructive)'
}

export function corTaxaFrequencia(taxa: number): string {
  if (taxa >= 90) return 'var(--success)'
  if (taxa >= 75) return 'var(--warning)'
  return 'var(--destructive)'
}

export const chartTooltipContentStyle: React.CSSProperties = {
  fontSize: 13,
  borderRadius: 8,
  border: '1px solid var(--border)',
  backgroundColor: 'var(--popover)',
  color: 'var(--popover-foreground)',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  padding: '8px 12px',
}

export const chartTooltipWrapperStyle: React.CSSProperties = {
  maxWidth: 240,
  fontSize: 12,
}

export const chartLegendFormatter = (value: string): string => value

export type ChartTooltipFormatter = NonNullable<
  TooltipProps<ValueType, NameType>['formatter']
>

export function tooltipFormatter(label: string): ChartTooltipFormatter {
  return ((value: ValueType) => [Number(value).toLocaleString('pt-BR'), label]) as ChartTooltipFormatter
}

export type SemanticLegendItem = {
  label: string
  colorVar: string
}

export function SemanticLegend({ items }: { items: SemanticLegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.colorVar }}
            aria-hidden="true"
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function useIsMobile(breakpointPx = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpointPx])

  return isMobile
}

export function truncateLabel(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value
  return `${value.slice(0, maxChars - 1).trimEnd()}…`
}

