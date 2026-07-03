'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

export type ParecerDescritivo = {
  id: string
  aluno_id: string
  periodo: number
  texto_parecer: string | null
}

export async function salvarParecer(
  schoolId: string | null,
  alunoId: string,
  periodo: number,
  texto: string,
  pessoaId: string | null
) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.parecer', 'editar')
  }

  const { data: existing } = await supabase
    .from('academico_pareceres_descritivos')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('periodo', periodo)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('academico_pareceres_descritivos')
      .update({ texto_parecer: texto, updated_by: pessoaId })
      .eq('id', existing.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('academico_pareceres_descritivos')
      .insert({
        school_id: schoolId,
        aluno_id: alunoId,
        periodo,
        texto_parecer: texto,
        created_by: pessoaId,
        updated_by: pessoaId,
      })

    if (error) throw error
  }

  return { success: true }
}

export async function listarPareceres(alunoId: string) {
  const { data, error } = await supabase
    .from('academico_pareceres_descritivos')
    .select('id, aluno_id, periodo, texto_parecer')
    .eq('aluno_id', alunoId)
    .order('periodo')

  if (error) throw error
  return (data || []) as ParecerDescritivo[]
}

export async function listarPareceresDaTurma(turmaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.parecer', pessoaId)
  const { data: matriculas, error: errMat } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (errMat) throw errMat
  if (!matriculas?.length) return []

  const alunoIds = matriculas.map(m => m.aluno_id)

  const { data, error } = await supabase
    .from('academico_pareceres_descritivos')
    .select('id, aluno_id, periodo, texto_parecer')
    .in('aluno_id', alunoIds)
    .order('periodo')

  if (error) throw error
  return (data || []) as ParecerDescritivo[]
}
