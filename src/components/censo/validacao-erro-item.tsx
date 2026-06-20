'use client'

import { ErroValidacao } from '@/lib/actions/censo-types'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface Props {
  erro: ErroValidacao
}

export function ValidacaoErroItem({ erro }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 px-4 border-b border-border last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{erro.mensagem}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Campo: {erro.campo_inep} (#{erro.numero_campo}) — {erro.entidade_nome}
          {erro.valor_atual && (
            <span className="ml-2 text-destructive">Valor atual: {erro.valor_atual}</span>
          )}
        </p>
      </div>
      <a href={erro.url_correcao} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm" className="shrink-0 gap-1 text-xs">
          <ExternalLink className="size-3" />
          Corrigir
        </Button>
      </a>
    </div>
  )
}
