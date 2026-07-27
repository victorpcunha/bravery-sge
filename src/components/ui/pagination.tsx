'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  className?: string
  showItemCount?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  showItemCount = true,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange(page)
  }

  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {showItemCount && (
        <p className="text-[13px] text-muted-foreground tabular-nums order-2 sm:order-1">
          Mostrando <span className="font-medium text-foreground">{start}</span> a{' '}
          <span className="font-medium text-foreground">{end}</span> de{' '}
          <span className="font-medium text-foreground">{totalItems}</span>
        </p>
      )}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(currentPage - 1)}
          disabled={!canPrev}
          aria-label="Página anterior"
          className="min-h-[36px] min-w-[36px]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="px-3 text-[13px] text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">{currentPage}</span> / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goTo(currentPage + 1)}
          disabled={!canNext}
          aria-label="Próxima página"
          className="min-h-[36px] min-w-[36px]"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
