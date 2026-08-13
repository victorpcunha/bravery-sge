'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

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
  ddd: string | null
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

export type UserAuthInfo = {
  schoolIds: string[]
  isSuperAdmin: boolean
  allSchools: { id: string; nome_escola: string }[]
}

export async function getSchoolsEscopadas(ids: string[] | null) {
  let query = supabase
    .from('schools')
    .select('*')
    .order('nome_escola', { ascending: true })

  if (ids) query = query.in('id', ids)

  const { data, error } = await query

  if (error) throw error
  return data as School[]
}

export async function getSchool(id: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoEstrita } = await import('./perfis')
    await validarPermissaoEstrita(pessoaId, 'escolas', 'visualizar')
  }

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

export async function getUserAuthInfo(userId: string, email: string): Promise<UserAuthInfo> {
  const { data: userSchools } = await supabase
    .from('user_schools')
    .select('school_id')
    .eq('user_id', userId)

  const schoolIds = (userSchools || []).map((us: { school_id: string }) => us.school_id)

  let isSuperAdmin = false
  try {
    const { data: peopleRows } = await supabase
      .from('people')
      .select('is_super_admin')
      .eq('email', email.toLowerCase().trim())
      .limit(1)

    if (peopleRows && peopleRows.length > 0) {
      isSuperAdmin = peopleRows[0].is_super_admin === true
    }
  } catch {
    isSuperAdmin = false
  }

  let allSchools: { id: string; nome_escola: string }[] = []
  if (isSuperAdmin) {
    const { data: schools } = await supabase
      .from('schools')
      .select('id, nome_escola')
      .order('nome_escola', { ascending: true })

    allSchools = schools || []
  } else if (schoolIds.length > 0) {
    const { data: schools } = await supabase
      .from('schools')
      .select('id, nome_escola')
      .in('id', schoolIds)
      .order('nome_escola', { ascending: true })

    allSchools = schools || []
  } else {
    const { data: schools } = await supabase
      .from('schools')
      .select('id, nome_escola')
      .limit(1)

    if (schools && schools.length > 0) {
      allSchools = schools
      schoolIds.push(schools[0].id)
    }
  }

  return { schoolIds, isSuperAdmin, allSchools }
}

export async function createSchool(school: Partial<School>, pessoaId?: string | null) {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'criar')

  const { data, error } = await supabase
    .from('schools')
    .insert(school)
    .select()
    .single()

  if (error) throw error
  return data as School
}

export async function updateSchool(id: string, school: Partial<School>, pessoaId?: string | null) {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  const { data, error } = await supabase
    .from('schools')
    .update(school)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as School
}

export async function deleteSchool(id: string, pessoaId?: string | null) {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'excluir')

  const { error } = await supabase
    .from('schools')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getDashboardData(schoolId: string | null) {
  const buildCount = (table: string) => {
    let query = supabase.from(table).select('id', { count: 'exact', head: true })
    if (schoolId) query = query.eq('school_id', schoolId)
    return query
  }

  const [turmasRes, peopleRes] = await Promise.all([
    buildCount('turmas'),
    buildCount('people'),
  ])

  return {
    turmas: turmasRes.count || 0,
    alunos: peopleRes.count || 0,
  }
}