import { supabase } from '@/lib/supabase'

export type School = {
  id: string
  tipo_registro: string
  codigo_inep: string | null
  nome_escola: string
  cnpj: string | null
  cpf_gestor: string | null
  nome_gestor: string | null
  cpf_secretario: string | null
  nome_secretario: string | null
  telefone_1: string | null
  telefone_2: string | null
  email: string | null
  situacao_funcionamento: string
  dependencia_administrativa: string
  dependencia_administrativa_estadual: string | null
  categoria_escola_privada: string | null
  formato_organizacional: string
  localizacao: string
  created_at: string
  updated_at: string
}

export async function getSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('nome_escola', { ascending: true })

  if (error) throw error
  return data as School[]
}

export async function getSchool(id: string) {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as School
}

export async function getFirstSchool() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, nome_escola')
    .limit(1)
    .single()

  if (error) throw error
  return data as { id: string, nome_escola: string }
}

export async function createSchool(school: Partial<School>) {
  const { data, error } = await supabase
    .from('schools')
    .insert(school)
    .select()
    .single()

  if (error) throw error
  return data as School
}

export async function updateSchool(id: string, school: Partial<School>) {
  const { data, error } = await supabase
    .from('schools')
    .update(school)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as School
}

export async function deleteSchool(id: string) {
  const { error } = await supabase
    .from('schools')
    .delete()
    .eq('id', id)

  if (error) throw error
}