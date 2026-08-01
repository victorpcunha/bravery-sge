'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import sanitizeHtml from 'sanitize-html'
import { isParecerVazio } from '@/lib/parecer-utils'

const supabase = getSupabaseAdmin()

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

function sanitizarParecer(texto: string): string {
  const limpo = sanitizeHtml(texto, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'strike',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'hr',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    allowedAttributes: {},
  })
  return isParecerVazio(limpo) ? '' : limpo
}

export type ParecerDescritivo = {
  id: string
  aluno_id: string
  disciplina_id: string | null
  periodo: number
  texto_parecer: string | null
  updated_at: string | null
}

export async function salvarParecer(
  schoolId: string | null,
  alunoId: string,
  periodo: number,
  texto: string,
  pessoaId: string | null,
  disciplinaId: string | null = null
) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.parecer', 'editar')
  }

  const textoLimpo = sanitizarParecer(texto)

  let query = supabase
    .from('academico_pareceres_descritivos')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('periodo', periodo)

  if (disciplinaId) {
    query = query.eq('disciplina_id', disciplinaId)
  } else {
    query = query.is('disciplina_id', null)
  }

  const { data: existing } = await query.maybeSingle()

  let updatedAt: string

  if (existing) {
    const { data, error } = await supabase
      .from('academico_pareceres_descritivos')
      .update({ texto_parecer: textoLimpo, updated_by: pessoaId })
      .eq('id', existing.id)
      .select('updated_at')
      .single()

    if (error) throw error
    updatedAt = data?.updated_at || new Date().toISOString()
  } else {
    const { data, error } = await supabase
      .from('academico_pareceres_descritivos')
      .insert({
        school_id: schoolId,
        aluno_id: alunoId,
        disciplina_id: disciplinaId,
        periodo,
        texto_parecer: textoLimpo,
        created_by: pessoaId,
        updated_by: pessoaId,
      })
      .select('updated_at')
      .single()

    if (error) throw error
    updatedAt = data?.updated_at || new Date().toISOString()
  }

  return { success: true, updated_at: updatedAt }
}

export async function listarPareceres(alunoId: string, disciplinaId?: string | null) {
  let query = supabase
    .from('academico_pareceres_descritivos')
    .select('id, aluno_id, disciplina_id, periodo, texto_parecer, updated_at')
    .eq('aluno_id', alunoId)

  if (disciplinaId) {
    query = query.eq('disciplina_id', disciplinaId)
  } else {
    query = query.is('disciplina_id', null)
  }

  const { data, error } = await query.order('periodo')

  if (error) throw error
  return (data || []) as ParecerDescritivo[]
}

export async function listarPareceresDaTurma(
  turmaId: string,
  pessoaId?: string | null,
  disciplinaId?: string | null
) {
  await validarPermRead('gestao-pedagogica.diario-classe.parecer', pessoaId)
  const { data: matriculas, error: errMat } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (errMat) throw errMat
  if (!matriculas?.length) return []

  const alunoIds = matriculas.map(m => m.aluno_id)

  let query = supabase
    .from('academico_pareceres_descritivos')
    .select('id, aluno_id, disciplina_id, periodo, texto_parecer, updated_at')
    .in('aluno_id', alunoIds)

  if (disciplinaId) {
    query = query.eq('disciplina_id', disciplinaId)
  } else {
    query = query.is('disciplina_id', null)
  }

  const { data, error } = await query.order('periodo')

  if (error) throw error
  return (data || []) as ParecerDescritivo[]
}
