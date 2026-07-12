import { cn } from '@/lib/utils'

type PageSectionProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  variant?: 'default' | 'flush' | 'compact'
  className?: string
}

const variantStyles = {
  default: {
    wrapper: 'rounded-xl border border-border bg-card shadow-xs',
    header: 'px-6 py-4 border-b border-border',
    body: 'p-6',
  },
  flush: {
    wrapper: 'rounded-xl border border-border bg-card shadow-xs',
    header: 'px-6 py-4 border-b border-border',
    body: 'p-0',
  },
  compact: {
    wrapper: 'rounded-xl border border-border bg-card shadow-xs',
    header: 'px-4 py-3 border-b border-border',
    body: 'p-4',
  },
}

export function PageSection({ title, description, actions, children, variant = 'default', className }: PageSectionProps) {
  const styles = variantStyles[variant]

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={cn(styles.header, 'flex items-start justify-between gap-4 flex-wrap')}>
        <div className="min-w-0">
          <h2 className="text-[20px] font-semibold leading-snug text-foreground tracking-tight">{title}</h2>
          {description && (
            <p className="text-[15px] text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}