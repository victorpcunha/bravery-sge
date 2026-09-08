'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { ehSlugReservado, normalizarSlug } from '@/lib/portal-slug'

const supabase = getSupabaseAdmin()

export type EscolaPortalBranding = {
  nome: string
  logo: string | null
  imagemFundo: string | null
  textoLogin: string | null
}

export type EscolaPortal =
  | { ok: true; schoolId: string; slug: string; branding: EscolaPortalBranding }
  | { ok: false; motivo: 'desconhecida' | 'desabilitada' }

/**
 * Resolve a escola pelo slug (público, pré-auth: retorna só branding).
 * Desconhecida/reservada e desabilitada têm o mesmo formato de negação;
 * a distinção de mensagem acontece na view (orientação vs indisponível).
 */
export async function getEscolaPortal(slug: string): Promise<EscolaPortal> {
  const norm = normalizarSlug(slug)
  if (!norm || ehSlugReservado(norm)) return { ok: false, motivo: 'desconhecida' }

  const { data: school } = await supabase
    .from('schools')
    .select('id, nome_escola, portal_habilitado, portal_slug')
    .eq('portal_slug', norm)
    .maybeSingle()

  const s = school as unknown as {
    id: string
    nome_escola: string
    portal_habilitado?: boolean
  } | null

  if (!s) return { ok: false, motivo: 'desconhecida' }
  if (s.portal_habilitado !== true) return { ok: false, motivo: 'desabilitada' }

  const { data: config } = await supabase
    .from('documentos_config')
    .select('nome_fantasia, logo, portal_imagem_fundo, portal_texto_login')
    .eq('school_id', s.id)
    .maybeSingle()

  const c = (config || {}) as unknown as {
    nome_fantasia?: string | null
    logo?: string | null
    portal_imagem_fundo?: string | null
    portal_texto_login?: string | null
  }

  const imagemFundo =
    typeof c.portal_imagem_fundo === 'string' && c.portal_imagem_fundo.startsWith('data:image/')
      ? c.portal_imagem_fundo
      : null
  const logo =
    typeof c.logo === 'string' && c.logo.startsWith('data:image/') ? c.logo : null

  return {
    ok: true,
    schoolId: s.id,
    slug: norm,
    branding: {
      nome: c.nome_fantasia?.trim() || s.nome_escola,
      logo,
      imagemFundo,
      textoLogin: c.portal_texto_login?.trim() || null,
    },
  }
}

/** Unicidade server-side do slug (chamado pelo cadastro; UNIQUE no banco como trava final). */
export async function validarSlugUnico(
  slug: string,
  schoolId?: string
): Promise<{ ok: true } | { ok: false; erro: string }> {
  const norm = normalizarSlug(slug)
  if (!norm) return { ok: false, erro: 'Informe o link do portal (slug).' }
  if (ehSlugReservado(norm)) return { ok: false, erro: 'Este link é reservado pelo sistema. Escolha outro.' }

  let query = supabase.from('schools').select('id').eq('portal_slug', norm).limit(1)
  if (schoolId) query = query.neq('id', schoolId)
  const { data } = await query.maybeSingle()
  if (data) return { ok: false, erro: 'Este link já está em uso por outra escola.' }
  return { ok: true }
}
