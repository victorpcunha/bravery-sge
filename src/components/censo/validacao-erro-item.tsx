'use client'

import { ErroValidacao } from '@/lib/actions/censo-types'
import { Button } from '@/components/ui/button'
import { ExternalLink, School } from 'lucide-react'
import { getAbaEscola, SECAO_AMIGAVEL } from '@/data/censo/rotulos-campos'

interface Props {
  erro: ErroValidacao
}

export function ValidacaoErroItem({ erro }: Props) {
  const aba = getAbaEscola(erro.campo_destino || erro.campo_inep)
  const abaLabel = aba?.abaLabel || (erro.secao ? SECAO_AMIGAVEL[erro.secao] : null) || erro.registro
  const campoLabel = erro.campo_amigavel || erro.campo_inep

  return (
    <div className="flex items-start justify-between gap-4 py-3 px-4 border-b border-border last:border-b-0">
      <div className="min-w-0 flex-1 space-y-2">
        <p className="break-words text-sm font-medium text-foreground">{erro.mensagem}</p>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 font-medium text-primary">
            Aba: {abaLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-1 font-medium text-foreground">
            Campo: {campoLabel}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <School className="size-3.5" />
            {erro.entidade_nome}
          </span>
          {erro.valor_atual && (
            <span className="inline-flex items-center gap-1 text-destructive">
              <span className="font-medium">Valor atual:</span>
              {erro.valor_atual_descricao
                ? `${erro.valor_atual} (${erro.valor_atual_descricao})`
                : erro.valor_atual}
            </span>
          )}
        </div>
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