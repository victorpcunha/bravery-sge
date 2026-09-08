'use client'

import { useEffect, useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { getTermoVigente, type TermoVigente } from '@/lib/actions/portal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Visualização somente-leitura dos termos (a partir do "Termos" no sidebar).
export function TermosModal({ open, onOpenChange }: Props) {
  const [termo, setTermo] = useState<TermoVigente | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getTermoVigente()
      .then(setTermo)
      .catch(() => setTermo(null))
      .finally(() => setLoading(false))
  }, [open ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[20px] flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Termos de Uso e Privacidade
            {termo && <span className="text-[13px] font-medium text-muted-foreground">v{termo.versao}</span>}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          </div>
        ) : !termo ? (
          <EmptyState
            icon={FileText}
            title="Termo indisponível"
            description="Não foi possível carregar o termo. Procure a secretaria da escola."
          />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{termo.conteudo}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
