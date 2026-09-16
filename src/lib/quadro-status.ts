/**
 * SPEC 030 — Status derivado do Quadro de Aulas.
 *
 * O status gravado no banco (`quadro_aulas.status`, default 'futuro') nunca foi
 * recalculado, então todo quadro aparecia como "Futuro" mesmo dentro da vigência.
 * A exibição agora deriva o status de data_inicial/data_final vs hoje.
 * Comparação por string YYYY-MM-DD (sem `new Date()`) para evitar shift UTC.
 */

export type StatusQuadro = 'futuro' | 'ativo' | 'encerrado' | 'inativo'

function hojeLocalISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function resolverStatusQuadro(
  q: { status?: string | null; data_inicial?: string | null; data_final?: string | null },
  hojeRef?: string
): StatusQuadro {
  if (q.status === 'inativo') return 'inativo'
  const hoje = (hojeRef || hojeLocalISO()).slice(0, 10)
  const ini = q.data_inicial?.slice(0, 10)
  const fim = q.data_final?.slice(0, 10)
  if (!ini || !fim) return 'futuro'
  if (hoje < ini) return 'futuro'
  if (hoje > fim) return 'encerrado'
  return 'ativo'
}
