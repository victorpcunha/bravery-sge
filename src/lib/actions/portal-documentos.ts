'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import {
  DOCUMENTOS_PORTAL,
  ehDocumentoPortalConhecido,
  normalizarDocumentosLiberados,
} from '@/lib/portal-documentos'

const supabase = getSupabaseAdmin()

/**
 * Documentos disponíveis no Portal do Responsável por escola (spec 041).
 * Leitura normalizada id → liberado (ausência de linha = liberado, opt-out).
 */
export async function getDocumentosLiberados(schoolId: string): Promise<Record<string, boolean>> {
  if (!schoolId) {
    const base: Record<string, boolean> = {}
    for (const d of DOCUMENTOS_PORTAL) base[d.id] = true
    return base
  }
  const { data } = await supabase
    .from('escola_portal_documentos')
    .select('documento_id, liberado')
    .eq('school_id', schoolId)
  return normalizarDocumentosLiberados(
    (data || []) as Array<{ documento_id: string; liberado: boolean | null }>
  )
}

/**
 * Salva a disponibilidade de documentos no portal para a escola.
 * Exige permissão `escolas/editar` (FR-011) e audita o diff anterior → novo (FR-010).
 * Ids fora do catálogo são rejeitados (FR-009: só o que existe persiste).
 */
export async function salvarDocumentosPortal(
  schoolId: string,
  liberados: Record<string, boolean>,
  pessoaId?: string | null
): Promise<{ ok: true }> {
  if (!schoolId) throw new Error('Escola não informada')
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  const desconhecidos = Object.keys(liberados || {}).filter(id => !ehDocumentoPortalConhecido(id))
  if (desconhecidos.length > 0) {
    throw new Error(`Documento desconhecido: ${desconhecidos.join(', ')}`)
  }

  const anterior = await getDocumentosLiberados(schoolId)

  const linhas = DOCUMENTOS_PORTAL.map(d => ({
    school_id: schoolId,
    documento_id: d.id,
    liberado: (liberados || {})[d.id] !== false,
  }))

  const { error } = await supabase
    .from('escola_portal_documentos')
    .upsert(linhas, { onConflict: 'school_id,documento_id' })
  if (error) throw error

  const novo: Record<string, boolean> = {}
  for (const l of linhas) novo[l.documento_id] = l.liberado

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Portal — Documentos',
    entidade: 'escola_portal_documentos',
    entidade_id: schoolId,
    registro_nome: 'Documentos disponíveis no portal',
    acao: 'editar',
    dados_anteriores: anterior,
    dados_novos: novo,
  })

  return { ok: true }
}
