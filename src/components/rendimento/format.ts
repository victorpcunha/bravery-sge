export function fmtMedia(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—'
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

export function fmtPct(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—'
  return `${v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

export function fmtInt(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—'
  return v.toLocaleString('pt-BR')
}

export function fmtEvolucao(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—'
  const sinal = v > 0 ? '+' : ''
  return `${sinal}${v.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`
}

// Paleta de séries com matizes distintos, definida pelo solicitante
// (exceção documentada à regra de tokens: cores de série do Recharts).
// Ao esgotar as cores, repete com tracejado para manter a identificação.
export const CORES_EVOLUCAO = [
  '#AB274F',
  '#FF4F00',
  '#A52A2A',
  '#FFBF00',
  '#8DB600',
  '#00B9E8',
  '#B284BE',
  '#007FFF',
  '#8A2BE2',
]
