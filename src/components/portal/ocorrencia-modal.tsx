'use client'

import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/feedback/status-badge'
import type { OcorrenciaResumo } from '@/lib/actions/portal'

type Props = {
  ocorrencia: OcorrenciaResumo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

// Modal compartilhado da ocorrência (página de Ocorrências).
export function OcorrenciaModal({ ocorrencia, open, onOpenChange }: Props) {
  const positiva = ocorrencia?.natureza === 'positiva'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[20px] flex items-center gap-2">
            {positiva ? (
              <ThumbsUp className="h-5 w-5 text-success shrink-0" />
            ) : (
              <ThumbsDown className="h-5 w-5 text-destructive shrink-0" />
            )}
            <span className="truncate">{ocorrencia?.titulo}</span>
          </DialogTitle>
          <div className="flex items-center gap-2">
            {ocorrencia && (
              <StatusBadge status={positiva ? 'success' : 'destructive'}>
                {positiva ? 'Positiva' : 'Negativa'}
              </StatusBadge>
            )}
            <p className="text-[13px] text-muted-foreground tabular-nums">
              {ocorrencia ? formatarData(ocorrencia.data) : ''}
            </p>
          </div>
        </DialogHeader>
        <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{ocorrencia?.descricao}</p>
      </DialogContent>
    </Dialog>
  )
}
