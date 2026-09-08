// Helpers puros do slug do Portal por Escola (client-safe: sem 'use server').
// Usados pelo EscolaForm (sugestão/validação client) e por portal-escola.ts.

export const SLUGS_RESERVADOS = [
  'login',
  'logout',
  'termo',
  'aluno',
  'selecionar-aluno',
  'documentos',
  'api',
  'portal',
  '_next',
  'favicon.ico',
]

export const SLUG_MAX_LENGTH = 60

/** Normaliza texto para slug: minúsculas, sem acentos, hífens. */
export function normalizarSlug(valor: string): string {
  return (valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
}

/** Sugere slug a partir do nome da escola. Não sobrescreve valor existente. */
export function sugerirSlug(nomeEscola: string, atual?: string | null): string {
  if (atual && atual.trim()) return atual
  return normalizarSlug(nomeEscola)
}

export function ehSlugReservado(slug: string): boolean {
  return SLUGS_RESERVADOS.includes((slug || '').toLowerCase())
}
