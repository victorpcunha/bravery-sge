'use client'

import { ErroValidacao } from '@/lib/actions/censo-types'
import { ValidacaoErroItem } from './validacao-erro-item'
import { Badge } from '@/components/ui/badge'

interface Props {
  titulo: string
  registro: string
  erros: ErroValidacao[]
}

export function ValidacaoAba({ titulo, registro, erros }: Props) {
  if (erros.length === 0) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
        <span className="text-success text-lg">✓</span>
        <span>Nenhuma inconsistência encontrada para {titulo}</span>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-2 px-4 pt-2">
        <Badge variant="destructive" className="text-xs">{erros.length}</Badge>
        <span className="text-sm text-muted-foreground">inconsistências encontradas</span>
      </div>
      <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {erros.map((erro, i) => (
          <ValidacaoErroItem key={`${registro}-${i}`} erro={erro} />
        ))}
      </div>
    </div>
  )
}
