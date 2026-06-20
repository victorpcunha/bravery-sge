import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type StatusBadgeProps = {
  status: 'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'muted'
  children: React.ReactNode
  className?: string
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-accent/10 text-accent border-accent/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
  muted: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('border', statusStyles[status], className)}
    >
      {children}
    </Badge>
  )
}