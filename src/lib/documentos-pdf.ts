import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/** Converte data ISO (Y-M-D) para Date local, evitando o deslocamento de um dia do UTC. */
export function parseDataLocal(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return new Date(iso)
}

export function dataNascimentoExtenso(iso: string | null | undefined): string {
  if (!iso) return '____'
  const d = parseDataLocal(iso)
  if (Number.isNaN(d.getTime())) return '____'
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatarCpf(cpf: string | null | undefined): string {
  if (!cpf) return '—'
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11) return cpf
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export function formatarCep(cep: string | null | undefined): string {
  if (!cep) return '—'
  const d = cep.replace(/\D/g, '')
  if (d.length !== 8) return cep
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

/** Data no formato dd/mm/aaaa (local, sem deslocamento UTC). */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = parseDataLocal(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return format(d, 'dd/MM/yyyy', { locale: ptBR })
}

const PARTICULAS = new Set([
  'da', 'de', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas',
  'com', 'sem', 'para', 'por', 'ou', 'ao', 'aos', 'a', 'as', 'y', 'von',
])

/** Converte um nome para exibição em Title Case, mantendo partículas comuns em minúsculas. */
export function nomeTitulo(nome: string | null | undefined): string {
  if (!nome) return ''
  const palavras = nome.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (palavras.length === 0) return ''
  return palavras
    .map((p, i) => {
      if (i > 0 && PARTICULAS.has(p)) return p
      return p.charAt(0).toUpperCase() + p.slice(1)
    })
    .join(' ')
}

export function enderecoCompleto(escola: {
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  cep: string
}): string {
  const partes = [
    escola.logradouro,
    escola.numero,
    escola.bairro,
    escola.municipio,
    escola.cep ? `CEP ${escola.cep}` : '',
  ].map(p => p.trim()).filter(Boolean)
  return partes.join(', ')
}