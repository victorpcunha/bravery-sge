'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria as registrarAuditoriaFramework } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type Perfil = {
  id: string
  school_id: string
  nome: string
  descricao: string | null
  ativo: boolean
  usa_vinculo_turma: boolean
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export type Recurso = {
  id: string
  codigo: string
  nome: string
  modulo: string
  ativo: boolean
  created_at: string
}

export type Permissao = {
  id: string
  school_id: string
  perfil_id: string
  recurso_id: string
  visualizar: boolean
  criar: boolean
  editar: boolean
  excluir: boolean
  created_at: string
}

export type RecursoComPermissao = Recurso & {
  permissao: {
    visualizar: boolean
    criar: boolean
    editar: boolean
    excluir: boolean
  } | null
}

// ------- Perfis -------

export async function listarPerfis(schoolId: string | null, params?: { search?: string; ativo?: boolean }) {
  let query = supabase
    .from('perfis')
    .select('*')

  if (schoolId) query = query.eq('school_id', schoolId)

  if (params?.search) {
    query = query.ilike('nome', `%${params.search}%`)
  }
  if (params?.ativo !== undefined) {
    query = query.eq('ativo', params.ativo)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Perfil[]
}

export async function buscarPerfil(id: string) {
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Perfil
}

export async function criarPerfil(data: {
  school_id: string
  nome: string
  descricao?: string
  ativo?: boolean
  usa_vinculo_turma?: boolean
  created_by?: string
}) {
  if (data.created_by) {
    await validarPermissaoServer(data.created_by, 'gestao-usuarios.perfis', 'criar')
  }

  const { data: created, error } = await supabase
    .from('perfis')
    .insert({
      school_id: data.school_id,
      nome: data.nome,
      descricao: data.descricao || null,
      ativo: data.ativo ?? true,
      usa_vinculo_turma: data.usa_vinculo_turma ?? false,
      created_by: data.created_by || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Já existe um perfil com este nome')
    throw error
  }

  await registrarAuditoria({
    school_id: data.school_id,
    entidade: 'perfil',
    entidade_id: created.id,
    acao: 'criar',
    dados_novos: { nome: created.nome, descricao: created.descricao, ativo: created.ativo },
    pessoa_id: data.created_by,
  })

  return created as Perfil
}

export async function editarPerfil(id: string, data: {
  nome?: string
  descricao?: string
  ativo?: boolean
  usa_vinculo_turma?: boolean
  updated_by?: string
}) {
  if (data.updated_by) {
    await validarPermissaoServer(data.updated_by, 'gestao-usuarios.perfis', 'editar')
  }

  const { data: updated, error } = await supabase
    .from('perfis')
    .update({
      ...data,
      updated_by: data.updated_by || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Já existe um perfil com este nome')
    throw error
  }

  await registrarAuditoria({
    school_id: updated.school_id,
    entidade: 'perfil',
    entidade_id: id,
    acao: 'editar',
    dados_novos: { nome: updated.nome, descricao: updated.descricao, ativo: updated.ativo },
    pessoa_id: data.updated_by,
  })

  return updated as Perfil
}

export async function excluirPerfil(id: string, pessoaId?: string) {
  if (pessoaId) {
    await validarPermissaoServer(pessoaId, 'gestao-usuarios.perfis', 'excluir')
  }

  const { data: perfilExcluido, error } = await supabase
    .from('perfis')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  if (perfilExcluido) {
    await registrarAuditoria({
      school_id: perfilExcluido.school_id,
      entidade: 'perfil',
      entidade_id: id,
      acao: 'excluir',
      dados_anteriores: { nome: perfilExcluido.nome, descricao: perfilExcluido.descricao, ativo: perfilExcluido.ativo },
      pessoa_id: pessoaId,
    })
  }
}

// ------- Permissões -------

export async function listarPermissoes(schoolId: string | null, perfilId?: string) {
  const { data: recursos, error: errRecursos } = await supabase
    .from('recursos')
    .select('*')
    .eq('ativo', true)
    .order('modulo')
    .order('nome')

  if (errRecursos) throw errRecursos

  if (!perfilId) {
    return (recursos || []).map(r => ({
      ...r,
      permissao: null,
    })) as RecursoComPermissao[]
  }

  let permissoesQuery = supabase
    .from('perfis_permissoes')
    .select('*')
    .eq('perfil_id', perfilId)

  if (schoolId) permissoesQuery = permissoesQuery.eq('school_id', schoolId)

  const { data: permissoes, error: errPerms } = await permissoesQuery

  if (errPerms) throw errPerms

  const permissoesMap = new Map((permissoes || []).map(p => [p.recurso_id, p]))

  return recursos.map(recurso => ({
    ...recurso,
    permissao: permissoesMap.get(recurso.id) ? {
      visualizar: permissoesMap.get(recurso.id)!.visualizar,
      criar: permissoesMap.get(recurso.id)!.criar,
      editar: permissoesMap.get(recurso.id)!.editar,
      excluir: permissoesMap.get(recurso.id)!.excluir,
    } : null,
  })) as RecursoComPermissao[]
}

export async function salvarPermissoes(
  schoolId: string | null,
  perfilId: string,
  permissoes: { recurso_id: string; visualizar: boolean; criar: boolean; editar: boolean; excluir: boolean }[],
  pessoaId?: string
) {
  const { data: perfil } = await supabase
    .from('perfis')
    .select('id, ativo, school_id')
    .eq('id', perfilId)
    .single()

  if (!perfil) throw new Error('Perfil não encontrado')
  if (!perfil.ativo) throw new Error('Não é possível alterar permissões de um perfil inativo')

  const effectiveSchoolId = schoolId || perfil.school_id
  if (!effectiveSchoolId) throw new Error('Não foi possível determinar a escola do perfil')

  let anterioresQuery = supabase
    .from('perfis_permissoes')
    .select('recurso_id, visualizar, criar, editar, excluir')
    .eq('perfil_id', perfilId)

  if (effectiveSchoolId) anterioresQuery = anterioresQuery.eq('school_id', effectiveSchoolId)

  const { data: permissoesAnteriores } = await anterioresQuery

  const upsertData = permissoes.map(p => ({
    school_id: effectiveSchoolId,
    perfil_id: perfilId,
    recurso_id: p.recurso_id,
    visualizar: p.visualizar,
    criar: p.criar,
    editar: p.editar,
    excluir: p.excluir,
    updated_by: pessoaId || null,
  }))

  const { error } = await supabase
    .from('perfis_permissoes')
    .upsert(upsertData, { onConflict: 'perfil_id, recurso_id' })

  if (error) throw error

  await registrarAuditoria({
    school_id: effectiveSchoolId,
    entidade: 'permissoes',
    entidade_id: perfilId,
    acao: 'editar',
    dados_anteriores: permissoesAnteriores || [],
    dados_novos: permissoes,
    pessoa_id: pessoaId,
  })
}

// ------- Auditoria -------

async function registrarAuditoria(data: {
  school_id: string
  entidade: string
  entidade_id: string
  acao: 'criar' | 'editar' | 'excluir'
  dados_anteriores?: any
  dados_novos?: any
  pessoa_id?: string | null
}) {
  await registrarAuditoriaFramework({
    school_id: data.school_id,
    pessoa_id: data.pessoa_id || null,
    modulo: 'Perfis e Permissões',
    entidade: data.entidade,
    entidade_id: data.entidade_id,
    registro_nome: data.dados_novos?.nome || data.dados_anteriores?.nome || null,
    acao: data.acao,
    dados_anteriores: data.dados_anteriores || null,
    dados_novos: data.dados_novos || null,
  })
}

// ------- Validação -------

export type PermissoesPorRecurso = Record<string, {
  visualizar: boolean
  criar: boolean
  editar: boolean
  excluir: boolean
}>

export async function getPermissoesPorPessoa(pessoaId: string): Promise<PermissoesPorRecurso> {
  const { data: pessoa, error: errPessoa } = await supabase
    .from('people')
    .select('school_id, perfil_id')
    .eq('id', pessoaId)
    .single()

  if (errPessoa || !pessoa || !pessoa.perfil_id) return {}

  const { data: permissoes, error } = await supabase
    .from('perfis_permissoes')
    .select('recurso_id, visualizar, criar, editar, excluir')
    .eq('perfil_id', pessoa.perfil_id)
    .eq('school_id', pessoa.school_id)

  if (error || !permissoes) return {}

  const { data: recursos } = await supabase
    .from('recursos')
    .select('id, codigo')
    .in('id', permissoes.map(p => p.recurso_id))

  if (!recursos) return {}

  const recursoCodigoMap = new Map(recursos.map(r => [r.id, r.codigo]))
  const result: PermissoesPorRecurso = {}

  for (const p of permissoes) {
    const codigo = recursoCodigoMap.get(p.recurso_id)
    if (codigo) {
      result[codigo] = {
        visualizar: p.visualizar,
        criar: p.criar,
        editar: p.editar,
        excluir: p.excluir,
      }
    }
  }

  return result
}

export async function validarPermissao(
  pessoaId: string,
  recursoCodigo: string,
  acao: 'visualizar' | 'criar' | 'editar' | 'excluir'
) {
  const { data: pessoa } = await supabase
    .from('people')
    .select('school_id, perfil_id')
    .eq('id', pessoaId)
    .maybeSingle()

  if (!pessoa) return true
  if (!pessoa.perfil_id) return true

  const { data: perfil } = await supabase
    .from('perfis')
    .select('ativo')
    .eq('id', pessoa.perfil_id)
    .single()

  if (!perfil || !perfil.ativo) return false

  const { data: recurso } = await supabase
    .from('recursos')
    .select('id')
    .eq('codigo', recursoCodigo)
    .single()

  if (!recurso) return false

  const { data: permissao } = await supabase
    .from('perfis_permissoes')
    .select(acao)
    .eq('perfil_id', pessoa.perfil_id)
    .eq('recurso_id', recurso.id)
    .eq('school_id', pessoa.school_id)
    .single()

  if (!permissao) return false
  return (permissao as any)[acao] === true
}

export async function validarPermissaoServer(
  pessoaId: string,
  recursoCodigo: string,
  acao: 'visualizar' | 'criar' | 'editar' | 'excluir'
) {
  const permitido = await validarPermissao(pessoaId, recursoCodigo, acao)
  if (!permitido) {
    throw new Error('Acesso negado: permissão insuficiente')
  }
}

// -------- Validação estrita (exige perfil com permissão) --------

export async function validarPermissaoEstrita(
  pessoaId: string,
  recursoCodigo: string,
  acao: 'visualizar' | 'criar' | 'editar' | 'excluir'
) {
  if (!pessoaId) {
    return
  }

  const { data: pessoa } = await supabase
    .from('people')
    .select('perfil_id')
    .eq('id', pessoaId)
    .maybeSingle()

  if (!pessoa?.perfil_id) {
    throw new Error('Acesso negado: permissão insuficiente')
  }

  await validarPermissaoServer(pessoaId, recursoCodigo, acao)
}
