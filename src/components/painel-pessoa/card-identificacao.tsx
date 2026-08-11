'use client'

import { useState, useEffect } from 'react'
import { getDadosPessoais, type DadosPessoais } from '@/lib/actions/painel-pessoa'
import { StatusBadge } from '@/components/feedback/status-badge'
import { getMunicipioByCodigo } from '@/data/municipios'
import { Calendar, IdCard, MapPin, Mail, Mars, Venus, Phone, Users, Loader2 } from 'lucide-react'

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

function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return '—'
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  const primeira = partes[0][0] || ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

function formatarEndereco(dados: DadosPessoais): string {
  const partes: string[] = []
  if (dados.logradouro) {
    partes.push(dados.numero ? `${dados.logradouro}, ${dados.numero}` : dados.logradouro)
  }
  if (dados.complemento) partes.push(dados.complemento)
  if (dados.bairro) partes.push(dados.bairro)
  const municipio = dados.municipio_residencia ? getMunicipioByCodigo(dados.municipio_residencia) : undefined
  if (municipio) partes.push(`${municipio.nome} - ${municipio.nomeUF}`)
  else if (dados.municipio_residencia) partes.push(dados.municipio_residencia)
  return partes.length > 0 ? partes.join(' · ') : '—'
}

function formatarDataNascimento(dataNasc: string | null): string {
  if (!dataNasc) return '—'
  return new Date(dataNasc + 'T12:00:00').toLocaleDateString('pt-BR')
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
      <div className="space-y-4" aria-busy="true">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-muted rounded-md animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-20 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!dados) return null

  const idade = calcularIdade(dados.data_nascimento)
  const badge = situacao ? situacaoBadge(situacao) : null
  const temFiliacao1 = !!dados.filiacao_1
  const temFiliacao2 = !!dados.filiacao_2
  const filiacaoDeclarada = dados.filiacao_declarada === '1' || temFiliacao1 || temFiliacao2

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[15px] font-bold text-primary-foreground">
            {iniciais(dados.nome_completo)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[20px] font-bold text-foreground leading-tight truncate">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calendar className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">Nascimento</p>
            <p className="text-[15px] font-medium text-foreground">
              {formatarDataNascimento(dados.data_nascimento)}
              {idade !== null && <span className="text-[13px] text-muted-foreground font-normal"> ({idade} anos)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            {isSexoMasculino(dados.sexo) ? (
              <Mars className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Venus className="h-4 w-4" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">Sexo</p>
            <p className="text-[15px] font-medium text-foreground">{formatarSexo(dados.sexo)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <IdCard className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">CPF</p>
            <p className="text-[15px] font-medium text-foreground tabular-nums">{formatarCpf(dados.cpf)}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
            <Phone className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">Telefone principal (WhatsApp)</p>
            <p className="text-[15px] font-medium text-foreground tabular-nums">{dados.whatsapp || '—'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <Phone className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">Telefone secundário</p>
            <p className="text-[15px] font-medium text-foreground tabular-nums">{dados.telefone_secundario || '—'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">E-mail</p>
            <p className="text-[15px] font-medium text-foreground truncate">{dados.email || '—'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 min-w-0 sm:col-span-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-muted-foreground">Endereço</p>
            <p className="text-[15px] font-medium text-foreground">{formatarEndereco(dados)}</p>
          </div>
        </div>

        {filiacaoDeclarada && (
          <div className="flex items-start gap-3 min-w-0 sm:col-span-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 min-w-0 flex-1">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-muted-foreground">Filiação 1 (mãe)</p>
                <p className="text-[15px] font-medium text-foreground truncate">{temFiliacao1 ? dados.filiacao_1 : '—'}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-muted-foreground">Filiação 2 (pai)</p>
                <p className="text-[15px] font-medium text-foreground truncate">{temFiliacao2 ? dados.filiacao_2 : '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
