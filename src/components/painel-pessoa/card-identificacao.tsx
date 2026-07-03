'use client'

import { useState, useEffect } from 'react'
import { getDadosPessoais, type DadosPessoais } from '@/lib/actions/painel-pessoa'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/feedback/status-badge'
import { User, Calendar, Hash, MapPin, Phone, Mail, Loader2, Venus, Mars } from 'lucide-react'

type Props = {
  pessoaId: string
  pessoaLogadaId: string | null
  situacao?: string | null
  turmaNome?: string | null
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

function situacaoBadge(situacao: string): { status: 'success' | 'warning' | 'destructive' | 'info' | 'muted'; label: string } {
  const s = situacao.toLowerCase()
  if (s === 'ativo' || s === 'aprovado' || s === 'aprovado por conselho de classe') return { status: 'success', label: situacao }
  if (s === 'transferido' || s === 'remanejado' || s === 'reclassificado') return { status: 'info', label: situacao }
  if (s === 'reprovado' || s === 'reprovado por frequência' || s === 'desistente' || s === 'óbito') return { status: 'destructive', label: situacao }
  return { status: 'muted', label: situacao }
}

export default function CardIdentificacao({ pessoaId, pessoaLogadaId, situacao, turmaNome }: Props) {
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
        <CardContent className="py-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!dados) return null

  const idade = calcularIdade(dados.data_nascimento)
  const badge = situacao ? situacaoBadge(situacao) : null

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">{dados.nome_completo}</h2>
              {turmaNome && <p className="text-sm text-muted-foreground mt-0.5">{turmaNome}</p>}
            </div>
          </div>
          {badge && (
            <StatusBadge status={badge.status} className="text-xs">
              {badge.label}
            </StatusBadge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Nascimento:</span>
            <span className="font-medium">{dados.data_nascimento ? new Date(dados.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}</span>
            {idade !== null && <span className="text-xs text-muted-foreground">({idade} anos)</span>}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {dados.sexo?.toLowerCase() === 'masculino' ? <Mars className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <Venus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
            <span className="text-xs text-muted-foreground">Sexo:</span>
            <span className="font-medium">{dados.sexo || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">CPF:</span>
            <span className="font-medium">{dados.cpf || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Celular:</span>
            <span className="font-medium">{dados.telefone_celular || '—'}</span>
          </div>

          <div className="flex items-start gap-2 text-sm col-span-1 md:col-span-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground">Endereço:</span>
            <span className="font-medium">{[dados.logradouro, dados.bairro].filter(Boolean).join(' - ') || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Telefone:</span>
            <span className="font-medium">{dados.telefone_fixo || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">E-mail:</span>
            <span className="font-medium truncate">{dados.email || '—'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}