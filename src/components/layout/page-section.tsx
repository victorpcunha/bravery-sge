import { cn } from '@/lib/utils'

type PageSectionProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageSection({ title, description, actions, children, className }: PageSectionProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-xs', className)}>
      <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h2 className="text-base font-heading font-semibold text-foreground tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}