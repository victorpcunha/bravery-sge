'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

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

export async function createVinculoProfissional(vinculo: Partial<VinculoProfissional>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .insert(vinculo)
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .single()

  if (error) throw error

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo')
    .eq('id', data.person_id)
    .maybeSingle()

  await registrarAuditoria({
    school_id: data.school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Vínculos Profissionais',
    entidade: 'vinculos_profissionais',
    entidade_id: data.id,
    registro_nome: pessoa?.nome_completo || null,
    acao: 'criar',
    dados_novos: data,
  })
  return data as VinculoProfissionalWithFuncao
}

export async function updateVinculoProfissional(id: string, vinculo: Partial<VinculoProfissional>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('vinculos_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .update(vinculo)
    .eq('id', id)
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .single()

  if (error) throw error

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo')
    .eq('id', data.person_id)
    .maybeSingle()

  await registrarAuditoria({
    school_id: data.school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Vínculos Profissionais',
    entidade: 'vinculos_profissionais',
    entidade_id: id,
    registro_nome: pessoa?.nome_completo || null,
    acao: 'editar',
    dados_anteriores: anterior,
    dados_novos: data,
  })
  return data as VinculoProfissionalWithFuncao
}

export async function deleteVinculoProfissional(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('vinculos_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('vinculos_profissionais')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    const { data: pessoa } = await supabase
      .from('people')
      .select('nome_completo')
      .eq('id', anterior.person_id)
      .maybeSingle()

    await registrarAuditoria({
      school_id: anterior.school_id,
      pessoa_id: pessoaId || null,
      modulo: 'Vínculos Profissionais',
      entidade: 'vinculos_profissionais',
      entidade_id: id,
      registro_nome: pessoa?.nome_completo || null,
      acao: 'excluir',
      dados_anteriores: anterior,
    })
  }
}
