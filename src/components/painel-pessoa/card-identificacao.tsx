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

function formatarSexo(valor: string | null | undefined): string {
  if (!valor) return '—'
  const v = valor.toString().trim().toLowerCase()
  if (v === '1' || v === 'm' || v === 'masculino') return 'Masculino'
  if (v === '2' || v === 'f' || v === 'feminino') return 'Feminino'
  return valor
}

function isSexoMasculino(valor: string | null | undefined): boolean {
  if (!valor) return false
  const v = valor.toString().trim().toLowerCase()
  return v === '1' || v === 'm' || v === 'masculino'
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
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[18px] font-bold text-foreground leading-tight truncate">
                {dados.nome_completo}
              </h2>
              {turmaNome && <p className="text-[14px] text-muted-foreground mt-0.5">{turmaNome}</p>}
            </div>
          </div>
          {badge && (
            <StatusBadge status={badge.status} className="shrink-0">
              {badge.label}
            </StatusBadge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-2">
          <div className="flex items-center gap-2 text-[14px]">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground">Nascimento:</span>
            <span className="font-medium">
              {dados.data_nascimento ? new Date(dados.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
            </span>
            {idade !== null && <span className="text-[13px] text-muted-foreground">({idade} anos)</span>}
          </div>

          <div className="flex items-center gap-2 text-[14px]">
            {isSexoMasculino(dados.sexo) ? (
              <Mars className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <Venus className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-[13px] text-muted-foreground">Sexo:</span>
            <span className="font-medium">{formatarSexo(dados.sexo)}</span>
          </div>

          <div className="flex items-center gap-2 text-[14px]">
            <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground">CPF:</span>
            <span className="font-medium">{dados.cpf || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-[14px]">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground">Celular:</span>
            <span className="font-medium">{dados.telefone_celular || '—'}</span>
          </div>

          <div className="flex items-center gap-2 text-[14px]">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground">Telefone:</span>
            <span className="font-medium">{dados.telefone_fixo || '—'}</span>
          </div>

          <div className="flex items-start gap-2 text-[14px] col-span-1 sm:col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-[13px] text-muted-foreground">Endereço:</span>
            <span className="font-medium">
              {[dados.logradouro, dados.bairro].filter(Boolean).join(' - ') || '—'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[14px] min-w-0">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-[13px] text-muted-foreground">E-mail:</span>
            <span className="font-medium truncate">{dados.email || '—'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
