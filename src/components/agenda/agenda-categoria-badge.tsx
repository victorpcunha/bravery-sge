'use client'

import { cn } from '@/lib/utils'

type Categoria = 'reuniao' | 'aula' | 'formacao' | 'outro'

const categoriaConfig: Record<Categoria, { label: string; className: string }> = {
  reuniao: {
    label: 'Reunião',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  aula: {
    label: 'Aula',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  formacao: {
    label: 'Formação',
    className: 'bg-success/10 text-success border-success/20',
  },
  outro: {
    label: 'Outro',
    className: 'bg-muted text-muted-foreground border-border',
  },
}

type Props = {
  categoria: Categoria
  className?: string
}

export function AgendaCategoriaBadge({ categoria, className }: Props) {
  const config = categoriaConfig[categoria] || categoriaConfig.outro

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-tight',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
