'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoriaAgregada } from '@/lib/auditoria'
import { garantirTurmaAberta } from './garantir-turma-aberta'

const supabase = getSupabaseAdmin()

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

export type IndicadorComNiveis = {
  id: string
  descricao: string
  codigo: string | null
  campo_experiencia: string | null
  disciplina_id: string | null
  niveis: {
    id: string
    descricao: string
    sigla: string | null
    ordem: number
  }[]
}

export type AvaliacaoIndicador = {
  id: string
  aluno_id: string
  indicador_id: string
  periodo: number
  nivel_id: string | null
  observacao: string | null
  updated_at: string | null
}

export async function getIndicadoresDaTurma(
  turmaId: string,
  disciplinaId?: string,
  pessoaId?: string | null
) {
  await validarPermRead('gestao-pedagogica.diario-classe.indicadores', pessoaId)
  const { data: turma, error: err1 } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (err1) throw err1
  if (!turma) return []

  let query = supabase
    .from('indicadores_avaliacao')
    .select('id, descricao, codigo, campo_experiencia, disciplina_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)
    .eq('ativo', true)

  if (disciplinaId) {
    query = query.eq('disciplina_id', disciplinaId)
  } else {
    return []
  }

  const { data: indicadores, error: err2 } = await query.order('descricao')

  if (err2) throw err2
  if (!indicadores?.length) return []

  const indicadorIds = indicadores.map(i => i.id)

  const { data: niveis } = await supabase
    .from('indicadores_niveis')
    .select('id, indicador_id, descricao, sigla, ordem')
    .in('indicador_id', indicadorIds)
    .order('ordem')

  const niveisPorIndicador = new Map<string, any[]>()
  ;(niveis || []).forEach(n => {
    if (!niveisPorIndicador.has(n.indicador_id)) {
      niveisPorIndicador.set(n.indicador_id, [])
    }
    niveisPorIndicador.get(n.indicador_id)!.push(n)
  })

  return indicadores.map(ind => ({
    ...ind,
    niveis: niveisPorIndicador.get(ind.id) || [],
  })) as IndicadorComNiveis[]
}

export async function salvarAvaliacaoIndicador(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  indicadorId: string,
  periodo: number,
  nivelId: string | null,
  observacao: string | null,
  pessoaId: string | null
) {
  await garantirTurmaAberta(turmaId)
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.indicadores', 'editar')
  }

  const { data: existing } = await supabase
    .from('academico_avaliacoes_indicadores')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('indicador_id', indicadorId)
    .eq('periodo', periodo)
    .maybeSingle()

  let updatedAt: string | null = null

  if (existing) {
    const { data, error } = await supabase
      .from('academico_avaliacoes_indicadores')
      .update({ nivel_id: nivelId, observacao, updated_by: pessoaId })
      .eq('id', existing.id)
      .select('updated_at')
      .single()

    if (error) throw error
    updatedAt = data?.updated_at ?? null
  } else {
    const { data, error } = await supabase
      .from('academico_avaliacoes_indicadores')
      .insert({
        school_id: schoolId,
        turma_id: turmaId,
        aluno_id: alunoId,
        indicador_id: indicadorId,
        periodo,
        nivel_id: nivelId,
        observacao,
        created_by: pessoaId,
        updated_by: pessoaId,
      })
      .select('updated_at')
      .single()

    if (error) throw error
    updatedAt = data?.updated_at ?? null
  }

  const { data: turma } = await supabase.from('turmas').select('school_id, nome').eq('id', turmaId).maybeSingle()
  await registrarAuditoriaAgregada({
    school_id: turma?.school_id || null,
    pessoa_id: pessoaId || null,
    modulo: 'Diário de Classe — Avaliações por Indicadores',
    entidade: 'academico_avaliacoes_indicadores',
    entidade_id: turmaId,
    registro_nome: turma?.nome || null,
    resumo: {
      turma: turma?.nome || null,
      turma_id: turmaId,
      disciplina: null,
      periodo: `Período ${periodo}`,
      quantidade: 1,
    },
  })

  return { success: true, updated_at: updatedAt }
}

export async function listarAvaliacoesIndicadores(
  turmaId: string,
  options: {
    periodo?: number
    indicadorIds?: string[]
    pessoaId?: string | null
  } = {}
) {
  await validarPermRead('gestao-pedagogica.diario-classe.indicadores', options.pessoaId)
  let query = supabase
    .from('academico_avaliacoes_indicadores')
    .select('id, aluno_id, indicador_id, periodo, nivel_id, observacao, updated_at')
    .eq('turma_id', turmaId)

  if (options.periodo != null) {
    query = query.eq('periodo', options.periodo)
  }
  if (options.indicadorIds?.length) {
    query = query.in('indicador_id', options.indicadorIds)
  }

  const { data, error } = await query

  if (error) throw error
  return (data || []) as AvaliacaoIndicador[]
}
