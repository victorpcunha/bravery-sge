import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  value: string | number
  label: string
  trend?: { value: string; positive?: boolean }
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
}

export function StatCard({ icon: Icon, value, label, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2.5 rounded-xl', variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-heading font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  )
}