'use client'

import { ResultadoValidacao } from '@/lib/actions/censo-types'
import { Badge } from '@/components/ui/badge'

interface Props {
  resultado: ResultadoValidacao | null
}

export function ValidacaoResumo({ resultado }: Props) {
  if (!resultado) return null

  return (
    <div className="flex items-center gap-3 mb-4">
      <Badge variant={resultado.valido ? 'default' : 'destructive'} className="text-sm px-3 py-1">
        {resultado.valido ? '0 inconsistências' : `${resultado.total_erros} inconsistências`}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {resultado.valido ? 'Pronto para exportar' : 'Corrija os erros antes de exportar'}
      </span>
    </div>
  )
}
