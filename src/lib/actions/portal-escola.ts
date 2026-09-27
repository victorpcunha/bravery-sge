'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { ehSlugReservado, normalizarSlug } from '@/lib/portal-slug'
import { normalizarVisiveis, todosVisiveis, type ModuloPortal, type ModulosVisiveis } from '@/lib/portal-modulos'
import { normalizarDocumentosLiberados } from '@/lib/portal-documentos'

const supabase = getSupabaseAdmin()

export type EscolaPortalBranding = {
  nome: string
  logo: string | null
  imagemFundo: string | null
  textoLogin: string | null
}

export type EscolaPortal =
  | { ok: true; schoolId: string; slug: string; branding: EscolaPortalBranding; modulosVisiveis: ModulosVisiveis; documentosLiberados: Record<string, boolean> }
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
    .select('id, nome_escola, portal_habilitado, portal_slug, portal_vis_boletim, portal_vis_frequencia, portal_vis_horarios, portal_vis_ocorrencias, portal_vis_comunicados, portal_vis_documentos')
    .eq('portal_slug', norm)
    .maybeSingle()

  const s = school as unknown as {
    id: string
    nome_escola: string
    portal_habilitado?: boolean
    portal_vis_boletim?: boolean | null
    portal_vis_frequencia?: boolean | null
    portal_vis_horarios?: boolean | null
    portal_vis_ocorrencias?: boolean | null
    portal_vis_comunicados?: boolean | null
    portal_vis_documentos?: boolean | null
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
    modulosVisiveis: normalizarVisiveis({
      boletim: s.portal_vis_boletim,
      frequencia: s.portal_vis_frequencia,
      horarios: s.portal_vis_horarios,
      ocorrencias: s.portal_vis_ocorrencias,
      comunicados: s.portal_vis_comunicados,
      documentos: s.portal_vis_documentos,
    }),
    documentosLiberados: await getDocumentosLiberadosMapa(s.id),
  }
}

/**
 * Leitura normalizada da disponibilidade de documentos (spec 041, opt-out).
 * Tabela ausente (migration não aplicada) = tudo liberado.
 */
async function getDocumentosLiberadosMapa(schoolId: string): Promise<Record<string, boolean>> {
  const { data } = await supabase
    .from('escola_portal_documentos')
    .select('documento_id, liberado')
    .eq('school_id', schoolId)
  return normalizarDocumentosLiberados(
    (data || []) as Array<{ documento_id: string; liberado: boolean | null }>
  )
}

/**
 * Enforcement server-side da visibilidade (spec 040, FR-005).
 * Chamar APÓS `validarVinculoPortal` nas actions de módulo do portal.
 * Erro distinto de 'Acesso negado' para a UI exibir orientação (PE-402).
 */
export async function exigirModuloVisivel(
  schoolId: string,
  modulo: ModuloPortal
): Promise<void> {
  if (!schoolId) throw new Error('Acesso negado')
  const coluna =
    modulo === 'boletim' ? 'portal_vis_boletim'
    : modulo === 'frequencia' ? 'portal_vis_frequencia'
    : modulo === 'horarios' ? 'portal_vis_horarios'
    : modulo === 'ocorrencias' ? 'portal_vis_ocorrencias'
    : modulo === 'comunicados' ? 'portal_vis_comunicados'
    : 'portal_vis_documentos'
  const { data } = await supabase
    .from('schools')
    .select(`id, ${coluna}`)
    .eq('id', schoolId)
    .maybeSingle()
  const flag = (data as unknown as Record<string, boolean | null> | null)?.[coluna]
  // Ausente/NULL (migration não aplicada) = visível (comportamento atual)
  if (flag === false) throw new Error('Módulo indisponível no portal desta escola')
}

/**
 * Enforcement server-side da disponibilidade por documento (spec 041, FR-006).
 * Chamar APÓS `validarVinculoPortal` + `exigirModuloVisivel('documentos')`.
 * Erro distinto de 'Acesso negado' para a UI exibir orientação (PE-402).
 * Ausência de linha (ou migration não aplicada) = liberado (opt-out).
 */
export async function exigirDocumentoLiberado(
  schoolId: string,
  documentoId: string
): Promise<void> {
  if (!schoolId || !documentoId) throw new Error('Acesso negado')
  const mapa = await getDocumentosLiberadosMapa(schoolId)
  if (mapa[documentoId] === false) throw new Error('Documento indisponível no portal desta escola')
}

/** Mapa de visibilidade para uso interno das actions (ex.: pular seções do Início). */
export async function getModulosVisiveis(schoolId: string): Promise<ModulosVisiveis> {
  if (!schoolId) return todosVisiveis()
  const { data } = await supabase
    .from('schools')
    .select('portal_vis_boletim, portal_vis_frequencia, portal_vis_horarios, portal_vis_ocorrencias, portal_vis_comunicados, portal_vis_documentos')
    .eq('id', schoolId)
    .maybeSingle()
  if (!data) return todosVisiveis()
  const s = data as unknown as {
    portal_vis_boletim?: boolean | null
    portal_vis_frequencia?: boolean | null
    portal_vis_horarios?: boolean | null
    portal_vis_ocorrencias?: boolean | null
    portal_vis_comunicados?: boolean | null
    portal_vis_documentos?: boolean | null
  }
  return normalizarVisiveis({
    boletim: s.portal_vis_boletim,
    frequencia: s.portal_vis_frequencia,
    horarios: s.portal_vis_horarios,
    ocorrencias: s.portal_vis_ocorrencias,
    comunicados: s.portal_vis_comunicados,
    documentos: s.portal_vis_documentos,
  })
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
