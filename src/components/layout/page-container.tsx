import { cn } from '@/lib/utils'

type PageContainerProps = {
  children: React.ReactNode
  maxWidth?: 'default' | 'dashboard'
  className?: string
}

export function PageContainer({ children, maxWidth = 'default', className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto pb-8 px-4',
        maxWidth === 'dashboard' && 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  )
}