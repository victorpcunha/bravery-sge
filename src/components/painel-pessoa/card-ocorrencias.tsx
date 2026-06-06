'use client'

import { useState, useEffect } from 'react'
import { getOcorrencias, type Ocorrencia } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  schoolId: string
  pessoaLogadaId: string | null
}

const COR_TIPO: Record<string, string> = {
  disciplinar: 'bg-red-100 text-red-700 border-red-200',
  pedagogica: 'bg-amber-100 text-amber-700 border-amber-200',
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
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" />Ocorrências</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          Ocorrências
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ocorrencias.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma ocorrência registrada.</p>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-2">
              {ocorrencias.map(o => (
                <div key={o.id} className="rounded-lg border p-3 text-sm space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`text-xs px-1.5 py-0 ${COR_TIPO[o.tipo] || ''}`}>
                      {o.tipo}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(o.data_ocorrencia).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm">{o.descricao}</p>
                  {o.turma_nome && (
                    <p className="text-xs text-muted-foreground">Turma: {o.turma_nome}</p>
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
