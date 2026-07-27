'use client'

import { useState, useEffect } from 'react'
import { getOcorrencias, type Ocorrencia } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StatusBadge } from '@/components/feedback/status-badge'
import { AlertCircle, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  schoolId: string | null
  pessoaLogadaId: string | null
}

const STATUS_TIPO: Record<string, 'destructive' | 'warning'> = {
  disciplinar: 'destructive',
  pedagogica: 'warning',
}

function statusTipo(tipo: string): 'destructive' | 'warning' | 'muted' {
  return STATUS_TIPO[tipo] || 'muted'
}

export default function CardOcorrencias({ pessoaId, schoolId, pessoaLogadaId }: Props) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getOcorrencias(pessoaId, schoolId, pessoaLogadaId)
      .then(setOcorrencias)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pessoaId, schoolId, pessoaLogadaId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[15px] flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Ocorrências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[15px] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Ocorrências
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ocorrencias.length === 0 ? (
          <p className="text-[14px] text-muted-foreground">Nenhuma ocorrência registrada.</p>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {ocorrencias.map(o => (
                <div key={o.id} className="rounded-lg border border-border p-3 text-[14px] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={statusTipo(o.tipo)}>
                      {o.tipo}
                    </StatusBadge>
                    <span className="text-[13px] text-muted-foreground tabular-nums">
                      {new Date(o.data_ocorrencia).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[14px]">{o.descricao}</p>
                  {o.turma_nome && (
                    <p className="text-[13px] text-muted-foreground">Turma: {o.turma_nome}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
