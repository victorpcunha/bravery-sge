'use client'

import { useState, useEffect } from 'react'
import { getDadosPessoais, type DadosPessoais } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  pessoaLogadaId: string | null
}

export default function CardContato({ pessoaId, pessoaLogadaId }: Props) {
  const [dados, setDados] = useState<DadosPessoais | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDadosPessoais(pessoaId, pessoaLogadaId)
      .then(setDados)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pessoaId, pessoaLogadaId])

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" />Contato</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  if (!dados) return null

  const temTelefoneCelular = !!dados.telefone_celular
  const temTelefoneFixo = !!dados.telefone_fixo
  const temEmail = !!dados.email

  if (!temTelefoneCelular && !temTelefoneFixo && !temEmail) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-500" />
            Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum contato cadastrado.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          Contato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dados.telefone_celular && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Cel: {dados.telefone_celular}</span>
            </div>
          )}
          {dados.telefone_fixo && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Fixo: {dados.telefone_fixo}</span>
            </div>
          )}
          {dados.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{dados.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
