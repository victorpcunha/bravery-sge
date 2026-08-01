export function isParecerVazio(texto: string | null | undefined): boolean {
  if (!texto) return true
  const semTags = texto
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00A0/g, ' ')
    .trim()
  return semTags.length === 0
}
