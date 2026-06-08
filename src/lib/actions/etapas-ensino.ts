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
}

export type Subetapa = {
  id: string
  etapa_ensino_id: string
  nome: string
  created_at: string
}

export async function getEtapasEnsino(schoolId: string | null) {
  let query = supabase
    .from('academico_etapas_ensino')
    .select('*')
    .eq('ativa', true)
    .order('etapa_codigo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query

  if (error) throw error
  return data as EtapaEnsino[]
}

export async function getSubetapas(etapaEnsinoId: string) {
  const { data, error } = await supabase
    .from('academico_subetapas')
    .select('*')
    .eq('etapa_ensino_id', etapaEnsinoId)
    .order('nome')

  if (error) throw error
  return data as Subetapa[]
}
