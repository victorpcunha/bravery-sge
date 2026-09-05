'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import { FUNCOES_PADRAO, CENSO_FUNCOES } from '@/data/funcoes-censo'

const supabase = getSupabaseAdmin()

const MODULO_FUNCOES = 'Funções'

async function registrarFuncao(
  acao: 'criar' | 'editar' | 'excluir',
  entidade_id: string | null,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  registro_nome?: string | null,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: MODULO_FUNCOES,
    entidade: 'funcoes_profissionais',
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

export type FuncaoProfissional = {
  id: string
  school_id: string
  nome: string
  tipo_censo: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export async function inicializarFuncoesPadrao(schoolId: string | null, pessoaId?: string | null) {
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

    await registrarFuncao('criar', null, pessoaId, schoolId, 'Funções padrão', null, { quantidade: novas.length })
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

export async function createFuncao(funcao: Partial<FuncaoProfissional>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('funcoes_profissionais')
    .insert(funcao)
    .select()
    .single()

  if (error) throw error

  await registrarFuncao('criar', data.id, pessoaId, data.school_id, data.nome, null, data)
  return data as FuncaoProfissional
}

export async function updateFuncao(id: string, funcao: Partial<FuncaoProfissional>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('funcoes_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('funcoes_profissionais')
    .update(funcao)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrarFuncao('editar', id, pessoaId, data.school_id, data.nome, anterior, data)
  return data as FuncaoProfissional
}

export async function deleteFuncao(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('funcoes_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('funcoes_profissionais')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    await registrarFuncao('excluir', id, pessoaId, anterior.school_id, anterior.nome, anterior, null)
  }
}
