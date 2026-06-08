'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { FUNCOES_PADRAO, CENSO_FUNCOES } from '@/data/funcoes-censo'

const supabase = getSupabaseAdmin()

export type FuncaoProfissional = {
  id: string
  school_id: string
  nome: string
  tipo_censo: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export async function inicializarFuncoesPadrao(schoolId: string | null) {
  let query = supabase
    .from('funcoes_profissionais')
    .select('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data: existentes } = await query

  const nomesExistentes = new Set(existentes?.map(f => f.nome) || [])

  const todasFuncoes = [
    ...FUNCOES_PADRAO.map(f => ({ nome: f.nome, tipo_censo: f.tipo_censo, school_id: schoolId })),
    ...CENSO_FUNCOES.map(f => ({ nome: f.nome, tipo_censo: f.codigo, school_id: schoolId })),
  ]

  const novas = todasFuncoes.filter(f => !nomesExistentes.has(f.nome))

  if (novas.length > 0) {
    const { error } = await supabase.from('funcoes_profissionais').insert(novas)
    if (error) throw error
  }
}

export async function getFuncoes(schoolId: string | null, apenasAtivas = true) {
  let query = supabase
    .from('funcoes_profissionais')
    .select('*')
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  if (apenasAtivas) query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) throw error
  return data as FuncaoProfissional[]
}

export async function createFuncao(funcao: Partial<FuncaoProfissional>) {
  const { data, error } = await supabase
    .from('funcoes_profissionais')
    .insert(funcao)
    .select()
    .single()

  if (error) throw error
  return data as FuncaoProfissional
}

export async function updateFuncao(id: string, funcao: Partial<FuncaoProfissional>) {
  const { data, error } = await supabase
    .from('funcoes_profissionais')
    .update(funcao)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as FuncaoProfissional
}

export async function deleteFuncao(id: string) {
  const { error } = await supabase
    .from('funcoes_profissionais')
    .delete()
    .eq('id', id)

  if (error) throw error
}
