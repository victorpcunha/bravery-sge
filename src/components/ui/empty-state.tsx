import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('py-16 text-center animate-fade-in', className)}
    >
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-2xl bg-muted/50">
          <Icon className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">{description}</p>
      )}
      {action && (
        <div className="mt-5">{action}</div>
      )}
    </div>
  )
}