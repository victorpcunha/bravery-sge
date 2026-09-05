'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type Disciplina = {
  id: string
  school_id: string
  nome: string
  nome_abreviado: string | null
  sigla: string | null
  area_codigo: number | null
  componente: string
  tipo_ensino: string
  codigo_inep: number | null
  diretriz_curricular: string | null
  carga_horaria_padrao: number | null
  ativo: boolean
  is_padrao_mec: boolean
  created_at: string
  updated_at: string
}

export type AreaConhecimento = {
  id: number
  nome: string
}

const MODULO = 'Disciplinas'

async function registrar(
  acao: 'criar' | 'editar' | 'excluir',
  id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'academico_disciplinas',
    entidade_id: id,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

export async function listarDisciplinas(schoolId: string | null) {
  let query = supabase
    .from('academico_disciplinas')
    .select('*')
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return data as Disciplina[]
}

export async function getAreasConhecimento() {
  const { data, error } = await supabase
    .from('academico_areas')
    .select('*')
    .order('nome')

  if (error) throw error
  return data as AreaConhecimento[]
}

export async function criarDisciplina(payload: Partial<Disciplina>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('academico_disciplinas')
    .insert(payload)
    .select()
    .single()

  if (error) throw error

  await registrar('criar', data.id, pessoaId, data.school_id, null, data)
  return data as Disciplina
}

export async function atualizarDisciplina(id: string, payload: Partial<Disciplina>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_disciplinas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('academico_disciplinas')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrar('editar', id, pessoaId, data.school_id, anterior, data)
  return data as Disciplina
}

export async function toggleDisciplinaAtiva(id: string, ativo: boolean, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_disciplinas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('academico_disciplinas')
    .update({ ativo, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrar('editar', id, pessoaId, data.school_id, anterior, data)
  return data as Disciplina
}

export async function excluirDisciplina(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_disciplinas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_disciplinas')
    .delete()
    .eq('id', id)

  if (error) throw error

  await registrar('excluir', id, pessoaId, anterior?.school_id, anterior, null)
}