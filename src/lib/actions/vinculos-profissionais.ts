'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type VinculoProfissional = {
  id: string
  person_id: string
  school_id: string
  regime_contratacao: string | null
  funcao_id: string | null
  situacao: string | null
  data_inicio: string | null
  carga_horaria: number | null
  observacoes: string | null
  data_inicio_afastamento: string | null
  data_termino_afastamento: string | null
  data_termino: string | null
  created_at: string
  updated_at: string
}

export type VinculoProfissionalWithFuncao = VinculoProfissional & {
  funcao: { id: string; nome: string; tipo_censo: string | null } | null
}

export async function getVinculosProfissionais(personId: string) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .eq('person_id', personId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as VinculoProfissionalWithFuncao[]
}

export async function createVinculoProfissional(vinculo: Partial<VinculoProfissional>) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .insert(vinculo)
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .single()

  if (error) throw error
  return data as VinculoProfissionalWithFuncao
}

export async function updateVinculoProfissional(id: string, vinculo: Partial<VinculoProfissional>) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .update(vinculo)
    .eq('id', id)
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .single()

  if (error) throw error
  return data as VinculoProfissionalWithFuncao
}

export async function deleteVinculoProfissional(id: string) {
  const { error } = await supabase
    .from('vinculos_profissionais')
    .delete()
    .eq('id', id)

  if (error) throw error
}
