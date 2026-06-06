'use client'

import { useState, useEffect } from 'react'
import { getDadosPessoais, type DadosPessoais } from '@/lib/actions/painel-pessoa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Calendar, Hash, MapPin, Phone, Mail, Loader2 } from 'lucide-react'

type Props = {
  pessoaId: string
  pessoaLogadaId: string | null
}

function calcularIdade(dataNasc: string | null): number | null {
  if (!dataNasc) return null
  const hoje = new Date()
  const nasc = new Date(dataNasc + 'T12:00:00')
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const mesDiff = hoje.getMonth() - nasc.getMonth()
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}

export default function CardIdentificacao({ pessoaId, pessoaLogadaId }: Props) {
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
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" />Identificação</CardTitle></CardHeader>
        <CardContent><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></CardContent>
      </Card>
    )
  }

  if (!dados) return null

  const idade = calcularIdade(dados.data_nascimento)

  const linhas = [
    { label: 'Nome', valor: dados.nome_completo, icon: User },
    { label: 'Nascimento', valor: dados.data_nascimento ? new Date(dados.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR') : null, icon: Calendar },
    { label: 'Idade', valor: idade !== null ? `${idade} anos` : null, icon: Calendar },
    { label: 'Sexo', valor: dados.sexo || null, icon: User },
    { label: 'CPF', valor: dados.cpf || null, icon: Hash },
    { label: 'Endereço', valor: [dados.logradouro, dados.bairro].filter(Boolean).join(' - ') || null, icon: MapPin },
    { label: 'Celular', valor: dados.telefone_celular || null, icon: Phone },
    { label: 'Telefone', valor: dados.telefone_fixo || null, icon: Phone },
    { label: 'E-mail', valor: dados.email || null, icon: Mail },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          Identificação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {linhas.map(l => l.valor ? (
            <div key={l.label} className="flex items-start gap-2 text-sm">
              <l.icon className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground">{l.label}: </span>
                <span>{l.valor}</span>
              </div>
            </div>
          ) : null)}
        </div>
      </CardContent>
    </Card>
  )
}
