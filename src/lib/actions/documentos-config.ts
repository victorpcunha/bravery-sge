'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type ConfigDocumentos = {
  id: string
  school_id: string
  nome_escola_doc: string | null
  cnpj_doc: string | null
  logradouro_doc: string | null
  numero_doc: string | null
  bairro_doc: string | null
  municipio_doc: string | null
  cep_doc: string | null
  telefone_doc: string | null
  email_doc: string | null
  nome_fantasia: string | null
  site: string | null
  mantenedora: string | null
  cabecalho: string | null
  rodape: string | null
  responsavel_nome: string | null
  responsavel_cargo: string | null
  logo: string | null
  created_at: string
  updated_at: string
}

function limparTexto(valor: unknown, maxLength?: number): string | null {
  if (typeof valor !== 'string') return null
  const t = valor.trim()
  if (!t) return null
  return maxLength ? t.slice(0, maxLength) : t
}

function limparDigitos(valor: unknown, maxLength: number): string | null {
  if (typeof valor !== 'string') return null
  const d = valor.replace(/\D/g, '').slice(0, maxLength)
  return d || null
}

function sanitizarLogo(valor: unknown): string | null {
  if (typeof valor !== 'string') return null
  if (!valor.startsWith('data:image/')) return null
  return valor
}

/**
 * Remove o logo (blob base64) dos snapshots de auditoria para evitar
 * inflar o JSONB da tabela de auditoria.
 */
function semLogo(registro: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!registro) return null
  const copia: Record<string, unknown> = { ...registro }
  if (copia.logo) {
    copia.logo = 'data:image/* [imagem oculta na auditoria]'
  }
  return copia
}

export async function getConfigDocumentos(schoolId: string): Promise<ConfigDocumentos | null> {
  const { data, error } = await supabase
    .from('documentos_config')
    .select('*')
    .eq('school_id', schoolId)
    .maybeSingle()

  if (error) throw error
  return data as ConfigDocumentos | null
}

export async function salvarConfigDocumentos(
  schoolId: string,
  data: Partial<ConfigDocumentos>,
  pessoaId?: string | null
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  const payload: Record<string, unknown> = {
    nome_escola_doc: limparTexto(data.nome_escola_doc, 100),
    cnpj_doc: limparDigitos(data.cnpj_doc, 14),
    logradouro_doc: limparTexto(data.logradouro_doc, 120),
    numero_doc: limparTexto(data.numero_doc, 10),
    bairro_doc: limparTexto(data.bairro_doc, 60),
    municipio_doc: limparDigitos(data.municipio_doc, 7),
    cep_doc: limparDigitos(data.cep_doc, 8),
    telefone_doc: limparTexto(data.telefone_doc, 60),
    email_doc: limparTexto(data.email_doc, 120),
    nome_fantasia: limparTexto(data.nome_fantasia, 120),
    site: limparTexto(data.site, 200),
    mantenedora: limparTexto(data.mantenedora),
    cabecalho: limparTexto(data.cabecalho),
    rodape: limparTexto(data.rodape),
    responsavel_nome: limparTexto(data.responsavel_nome, 120),
    responsavel_cargo: limparTexto(data.responsavel_cargo, 120),
    logo: sanitizarLogo(data.logo),
  }

  const { data: anterior } = await supabase
    .from('documentos_config')
    .select('*')
    .eq('school_id', schoolId)
    .maybeSingle()

  if (anterior) {
    const { error } = await supabase
      .from('documentos_config')
      .update({ ...payload, updated_at: new Date().toISOString(), updated_by: pessoaId || null })
      .eq('school_id', schoolId)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('documentos_config')
      .insert({ school_id: schoolId, ...payload, created_by: pessoaId || null, updated_by: pessoaId || null })

    if (error) throw error
  }

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Unidade Escolar',
    entidade: 'documentos_config',
    entidade_id: schoolId,
    acao: anterior ? 'editar' : 'criar',
    dados_anteriores: semLogo(anterior || null),
    dados_novos: payload,
  })
}