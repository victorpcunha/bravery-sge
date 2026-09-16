'use client'

import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export function showCopyToast(value: string) {
  toast.custom(
    () => (
      <div className="relative w-[320px] overflow-hidden rounded-lg border border-border bg-card shadow-md">
        <div className="flex items-start gap-3 px-4 py-3">
          <span className="rounded-md bg-primary/10 p-2 shrink-0">
            <Copy className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground">
              Copiado para a área de transferência
            </p>
            <p className="text-[13px] text-muted-foreground tabular-nums truncate">
              {value}
            </p>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full w-full bg-primary animate-copy-progress" />
        </div>
      </div>
    ),
    { duration: 3000 }
  )
}

async function copyValue(raw: string, display: string) {
  try {
    await navigator.clipboard.writeText(raw)
    showCopyToast(display)
  } catch {
    toast.error('Não foi possível copiar')
  }
}

type CopyChipProps = {
  raw?: string | null
  display: string
}

export function CopyChip({ raw, display }: CopyChipProps) {
  if (!raw || !raw.trim()) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted/40 py-0.5 pr-1 pl-2">
      <span className="text-[13px] font-medium text-foreground tabular-nums whitespace-nowrap">
        {display}
      </span>
      <button
        type="button"
        aria-label={`Copiar ${display}`}
        title="Copiar"
        onClick={(e) => {
          e.stopPropagation()
          copyValue(raw, display)
        }}
        className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent/15 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </span>
  )
}
