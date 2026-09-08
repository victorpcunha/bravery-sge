'use client'

import { Megaphone } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ComunicadoResumo } from '@/lib/actions/portal'

type Props = {
  comunicado: ComunicadoResumo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatarData(iso: string) {
  const [a, m, d] = iso.split('-')
  return d && m && a ? `${d}/${m}/${a}` : iso
}

// Modal compartilhado do comunicado (Início + página de Comunicados).
export function ComunicadoModal({ comunicado, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[20px] flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary shrink-0" />
            <span className="truncate">{comunicado?.titulo}</span>
          </DialogTitle>
          <p className="text-[13px] text-muted-foreground tabular-nums">
            {comunicado ? formatarData(comunicado.data) : ''}
          </p>
        </DialogHeader>
        <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{comunicado?.descricao}</p>
      </DialogContent>
    </Dialog>
  )
}
