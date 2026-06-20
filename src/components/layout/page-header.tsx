import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: LucideIcon
}

type PageHeaderProps = {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

export function PageHeader({ title, description, icon: Icon, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 animate-fade-in-up', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3" aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            const ItemIcon = item.icon
            return (
              <span key={item.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {ItemIcon && <ItemIcon className="h-3.5 w-3.5 shrink-0" />}
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn('text-foreground font-medium', isLast && 'truncate')}>
                    {ItemIcon && <ItemIcon className="h-3.5 w-3.5 shrink-0" />}
                    {item.label}
                  </span>
                )}
              </span>
            )
          })}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}