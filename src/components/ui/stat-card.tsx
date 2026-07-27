import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  value: string | number
  label: string
  trend?: { value: string; positive?: boolean }
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  size?: 'default' | 'hero'
  className?: string
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
}

const sizeStyles = {
  default: {
    wrapper: 'p-5',
    iconBox: 'p-2.5 rounded-xl',
    icon: 'h-5 w-5',
    value: 'text-[36px]',
    label: 'text-[14px] mt-1.5',
  },
  hero: {
    wrapper: 'p-6 sm:p-7',
    iconBox: 'p-3 rounded-2xl',
    icon: 'h-6 w-6',
    value: 'text-[44px] sm:text-[48px]',
    label: 'text-[15px] sm:text-base mt-2',
  },
}

export function StatCard({ icon: Icon, value, label, trend, variant = 'default', size = 'default', className }: StatCardProps) {
  const s = sizeStyles[size]
  return (
    <div className={cn(
      'rounded-xl border border-border bg-card shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
      s.wrapper,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(s.iconBox, variantStyles[variant])}>
          <Icon className={s.icon} />
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
      <div className={cn(size === 'hero' ? 'mt-4' : 'mt-3')}>
        <p className={cn(
          'font-bold leading-none text-foreground tracking-tight tabular-nums',
          s.value
        )}>
          {value}
        </p>
        <p className={cn('font-medium text-muted-foreground', s.label)}>
          {label}
        </p>
      </div>
    </div>
  )
}