// Documentos disponíveis no Portal do Responsável por escola (spec 041).
// Módulo neutro (sem 'use server'): fonte canônica de ids, títulos e
// categorias. Turbopack exige que 'use server' exporte só async — por isso os
// helpers vivem aqui e as actions em portal-documentos.ts / portal.ts consomem.

export type CategoriaDocumentoPortal = 'oficial' | 'manual'

export type DocumentoPortalInfo = {
  id: string
  titulo: string
  categoria: CategoriaDocumentoPortal
}

export const DOCUMENTOS_PORTAL = [
  { id: 'declaracao', titulo: 'Declaração de Matrícula', categoria: 'oficial' },
  { id: 'ficha', titulo: 'Ficha Individual do Aluno', categoria: 'oficial' },
  { id: 'boletim', titulo: 'Boletim Escolar', categoria: 'oficial' },
  { id: 'historico', titulo: 'Histórico Escolar', categoria: 'oficial' },
] as const satisfies readonly DocumentoPortalInfo[]

export type DocumentoPortalId = (typeof DOCUMENTOS_PORTAL)[number]['id']

export function idsDocumentosPortal(): string[] {
  return DOCUMENTOS_PORTAL.map(d => d.id)
}

export function ehDocumentoPortalConhecido(id: string): boolean {
  return DOCUMENTOS_PORTAL.some(d => d.id === id)
}

/** Mapa id → liberado com tudo liberado (padrão opt-out). */
export function todosDocumentosLiberados(): Record<string, boolean> {
  const mapa: Record<string, boolean> = {}
  for (const d of DOCUMENTOS_PORTAL) mapa[d.id] = true
  return mapa
}

/**
 * Normaliza linhas do banco em mapa id → liberado.
 * Ausência de linha ou lista nula (migration não aplicada) = liberado.
 * Ids desconhecidos vindos do banco são ignorados.
 */
export function normalizarDocumentosLiberados(
  linhas: Array<{ documento_id: string; liberado: boolean | null }> | null | undefined
): Record<string, boolean> {
  const base = todosDocumentosLiberados()
  if (!linhas) return base
  for (const l of linhas) {
    if (!ehDocumentoPortalConhecido(l.documento_id)) continue
    if (l.liberado === false) base[l.documento_id] = false
  }
  return base
}
