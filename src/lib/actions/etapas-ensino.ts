'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

const MODULO_ETAPAS = 'Estrutura Acadêmica — Etapas'

async function registrarEtapa(
  acao: 'criar' | 'editar' | 'excluir',
  entidade: string,
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  registro_nome?: string | null,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: MODULO_ETAPAS,
    entidade,
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

export type EtapaEnsino = {
  id: string
  school_id: string
  etapa_codigo: number
  etapa_nome: string
  etapa_tipo: string
  ativa: boolean
  ano_letivo_id: string | null
}

export type Subetapa = {
  id: string
  etapa_ensino_id: string
  nome: string
  created_at: string
}

export async function getEtapasEnsino(schoolId: string | null, anoLetivoId?: string | null, skipDedup?: boolean) {
  let query = supabase
    .from('academico_etapas_ensino')
    .select('*')
    .eq('ativa', true)
    .order('etapa_codigo')

  if (schoolId) query = query.eq('school_id', schoolId)
  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)

  const { data, error } = await query

  if (error) throw error

  // Deduplicar por etapa_codigo quando não filtrado por ano letivo
  if (!anoLetivoId && !skipDedup) {
    const seen = new Set<number>()
    return ((data ?? []) as EtapaEnsino[]).filter(e => {
      if (seen.has(e.etapa_codigo)) return false
      seen.add(e.etapa_codigo)
      return true
    })
  }

  return (data ?? []) as EtapaEnsino[]
}

export async function getSubetapas(etapaEnsinoId: string) {
  const { data, error } = await supabase
    .from('academico_subetapas')
    .select('*')
    .eq('etapa_ensino_id', etapaEnsinoId)
    .order('nome')

  if (error) throw error
  return (data ?? []) as Subetapa[]
}

export async function getTodasEtapasEnsino(schoolId: string, anoLetivoId?: string | null) {
  let query = supabase
    .from('academico_etapas_ensino')
    .select('*')
    .eq('school_id', schoolId)
    .order('etapa_codigo')

  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)

  const { data, error } = await query

  if (error) throw error
  return (data ?? []) as EtapaEnsino[]
}

export async function upsertEtapaEnsino(schoolId: string, anoLetivoId: string, etapaCodigo: number, etapaNome: string, etapaTipo: string, ativa: boolean, pessoaId?: string | null) {
  const { data: existing } = await supabase
    .from('academico_etapas_ensino')
    .select('id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_codigo', etapaCodigo)
    .maybeSingle()

  if (existing) {
    const { data: anterior } = await supabase
      .from('academico_etapas_ensino')
      .select('*')
      .eq('id', existing.id)
      .maybeSingle()

    const { error } = await supabase
      .from('academico_etapas_ensino')
      .update({ ativa })
      .eq('id', existing.id)
    if (error) throw error

    const { data: final } = await supabase
      .from('academico_etapas_ensino')
      .select('*')
      .eq('id', existing.id)
      .maybeSingle()

    await registrarEtapa('editar', 'academico_etapas_ensino', existing.id, pessoaId, schoolId, etapaNome, anterior, final)
    return existing.id
  } else {
    const { data, error } = await supabase
      .from('academico_etapas_ensino')
      .insert({ school_id: schoolId, ano_letivo_id: anoLetivoId, etapa_codigo: etapaCodigo, etapa_nome: etapaNome, etapa_tipo: etapaTipo, ativa })
      .select('id')
      .single()
    if (error) throw error

    const { data: criado } = await supabase
      .from('academico_etapas_ensino')
      .select('*')
      .eq('id', data.id)
      .maybeSingle()
    await registrarEtapa('criar', 'academico_etapas_ensino', data.id, pessoaId, schoolId, etapaNome, null, criado)
    return data.id
  }
}

export async function criarSubetapa(etapaEnsinoId: string, nome: string, pessoaId?: string | null) {
  const { data: etapa } = await supabase
    .from('academico_etapas_ensino')
    .select('school_id')
    .eq('id', etapaEnsinoId)
    .maybeSingle()

  const { data, error } = await supabase
    .from('academico_subetapas')
    .insert({ etapa_ensino_id: etapaEnsinoId, nome })
    .select('id, nome, etapa_ensino_id, created_at')
    .single()
  if (error) throw error

  await registrarEtapa('criar', 'academico_subetapas', data.id, pessoaId, etapa?.school_id, nome, null, data)
  return data as Subetapa
}

export async function atualizarSubetapa(id: string, nome: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_subetapas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_subetapas')
    .update({ nome })
    .eq('id', id)
  if (error) throw error

  const { data: final } = await supabase
    .from('academico_subetapas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data: etapa } = await supabase
    .from('academico_etapas_ensino')
    .select('school_id')
    .eq('id', anterior?.etapa_ensino_id)
    .maybeSingle()

  await registrarEtapa('editar', 'academico_subetapas', id, pessoaId, etapa?.school_id, nome, anterior, final)
}

export async function removerSubetapa(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_subetapas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_subetapas')
    .delete()
    .eq('id', id)
  if (error) throw error

  if (anterior) {
    const { data: etapa } = await supabase
      .from('academico_etapas_ensino')
      .select('school_id')
      .eq('id', anterior.etapa_ensino_id)
      .maybeSingle()

    await registrarEtapa('excluir', 'academico_subetapas', id, pessoaId, etapa?.school_id, anterior.nome, anterior, null)
  }
}
