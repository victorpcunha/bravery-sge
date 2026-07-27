'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

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

export async function upsertEtapaEnsino(schoolId: string, anoLetivoId: string, etapaCodigo: number, etapaNome: string, etapaTipo: string, ativa: boolean) {
  const { data: existing } = await supabase
    .from('academico_etapas_ensino')
    .select('id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_codigo', etapaCodigo)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('academico_etapas_ensino')
      .update({ ativa })
      .eq('id', existing.id)
    if (error) throw error
    return existing.id
  } else {
    const { data, error } = await supabase
      .from('academico_etapas_ensino')
      .insert({ school_id: schoolId, ano_letivo_id: anoLetivoId, etapa_codigo: etapaCodigo, etapa_nome: etapaNome, etapa_tipo: etapaTipo, ativa })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }
}

export async function criarSubetapa(etapaEnsinoId: string, nome: string) {
  const { data, error } = await supabase
    .from('academico_subetapas')
    .insert({ etapa_ensino_id: etapaEnsinoId, nome })
    .select('id, nome, etapa_ensino_id, created_at')
    .single()
  if (error) throw error
  return data as Subetapa
}

export async function atualizarSubetapa(id: string, nome: string) {
  const { error } = await supabase
    .from('academico_subetapas')
    .update({ nome })
    .eq('id', id)
  if (error) throw error
}

export async function removerSubetapa(id: string) {
  const { error } = await supabase
    .from('academico_subetapas')
    .delete()
    .eq('id', id)
  if (error) throw error
}
