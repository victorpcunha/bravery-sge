'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

// ------- Tipos -------

export type Matricula = {
  id: string
  school_id: string
  aluno_id: string
  ano_letivo_id: string
  turma_id: string
  etapa_ensino_id: string
  subetapa_id: string | null
  data_matricula: string
  codigo_inep: string | null
  forma_ingresso: string
  escolarizacao_externa: string
  observacoes: string | null
  transporte_responsavel: string
  transporte_veiculos: any
  situacao: string
  ativo: boolean
  created_at: string
  updated_at: string
  // Joins
  aluno?: { nome_completo: string; cpf: string }
  turma?: { nome: string; codigo_inep: string }
  etapa?: { etapa_nome: string }
  subetapa?: { nome: string }
}

export type Movimentacao = {
  id: string
  matricula_id: string
  tipo: 'Transferencia' | 'Reclassificacao' | 'Remanejamento' | 'Desistencia' | 'Obito'
  data_movimentacao: string
  data_registro: string
  profissional_id: string
  observacoes: string | null
  dados_complementares: any
  ativo: boolean
  created_at: string
  updated_at: string
  profissional?: { nome: string }
}

export type Dispensa = {
  id: string
  matricula_id: string
  disciplina_id: string
  motivo: string
  ativo: boolean
  created_at: string
  disciplina?: { nome: string }
}

export type FiltrosMatriculas = {
  ano_letivo_id?: string
  turma_id?: string
  etapa_ensino_id?: string
}

// ------- Listagem -------

export async function getMatriculas(schoolId: string, filtros: FiltrosMatriculas) {
  let query = supabase
    .from('academico_matriculas')
    .select('*, aluno:aluno_id(nome_completo, cpf), turma:turma_id(nome, codigo_inep), etapa:etapa_ensino_id(etapa_nome), subetapa:subetapa_id(nome)')
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (filtros.ano_letivo_id) query = query.eq('ano_letivo_id', filtros.ano_letivo_id)
  if (filtros.turma_id) query = query.eq('turma_id', filtros.turma_id)
  if (filtros.etapa_ensino_id) query = query.eq('etapa_ensino_id', filtros.etapa_ensino_id)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getMatricula(id: string) {
  const { data, error } = await supabase
    .from('academico_matriculas')
    .select('*, aluno:aluno_id(nome_completo, cpf), turma:turma_id(nome, codigo_inep, turnos), etapa:etapa_ensino_id(etapa_nome, etapa_tipo), subetapa:subetapa_id(nome)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as any
}

// ------- CRUD Matrícula -------

export async function createMatricula(data: {
  school_id: string
  aluno_id: string
  ano_letivo_id: string
  turma_id: string
  etapa_ensino_id: string
  subetapa_id?: string | null
  data_matricula: string
  forma_ingresso: string
  escolarizacao_externa: string
  observacoes?: string | null
  transporte_responsavel?: string
  transporte_veiculos?: any
}) {
  const { data: matricula, error } = await supabase
    .from('academico_matriculas')
    .insert({
      school_id: data.school_id,
      aluno_id: data.aluno_id,
      ano_letivo_id: data.ano_letivo_id,
      turma_id: data.turma_id,
      etapa_ensino_id: data.etapa_ensino_id,
      subetapa_id: data.subetapa_id || null,
      data_matricula: data.data_matricula,
      forma_ingresso: data.forma_ingresso,
      escolarizacao_externa: data.escolarizacao_externa,
      observacoes: data.observacoes || null,
      transporte_responsavel: data.transporte_responsavel || 'Não utiliza',
      transporte_veiculos: data.transporte_veiculos || {},
    })
    .select()
    .single()

  if (error) throw error
  return matricula
}

export async function updateMatricula(id: string, data: {
  turma_id?: string
  etapa_ensino_id?: string
  subetapa_id?: string | null
  forma_ingresso?: string
  escolarizacao_externa?: string
  observacoes?: string | null
  transporte_responsavel?: string
  transporte_veiculos?: any
}) {
  const { error } = await supabase
    .from('academico_matriculas')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

// ------- Movimentações -------

export async function getMovimentacoes(matriculaId: string) {
  const { data, error } = await supabase
    .from('academico_matriculas_movimentacoes')
    .select('*, profissional:profissional_id(nome_completo)')
    .eq('matricula_id', matriculaId)
    .eq('ativo', true)
    .order('data_movimentacao', { ascending: false })

  if (error) throw error
  return data as Movimentacao[]
}

export async function salvarMovimentacoes(
  matriculaId: string,
  movimentacoes: {
    id?: string
    tipo: string
    data_movimentacao: string
    profissional_id: string
    observacoes?: string | null
    dados_complementares?: any
    removido?: boolean
  }[]
) {
  const pendentes = movimentacoes.filter(m => !m.removido)

  // Remover movimentações marcadas para exclusão
  const paraRemover = movimentacoes.filter(m => m.removido && m.id)
  for (const m of paraRemover) {
    await supabase.from('academico_matriculas_movimentacoes').update({ ativo: false }).eq('id', m.id!)
  }

  // Inserir ou atualizar movimentações
  for (const m of pendentes) {
    if (m.id) {
      await supabase.from('academico_matriculas_movimentacoes').update({
        data_movimentacao: m.data_movimentacao,
        observacoes: m.observacoes,
        dados_complementares: m.dados_complementares || {},
      }).eq('id', m.id)
    } else {
      await supabase.from('academico_matriculas_movimentacoes').insert({
        matricula_id: matriculaId,
        tipo: m.tipo,
        data_movimentacao: m.data_movimentacao,
        profissional_id: m.profissional_id,
        observacoes: m.observacoes,
        dados_complementares: m.dados_complementares || {},
      })
    }
  }

  // Atualizar situação da matrícula baseada no último tipo de movimentação
  const ultimo = pendentes.length > 0 ? pendentes[pendentes.length - 1] : null
  if (ultimo) {
    const situacaoMap: Record<string, string> = {
      Transferencia: 'Transferido',
      Reclassificacao: 'Reclassificado',
      Remanejamento: 'Remanejado',
      Desistencia: 'Desistente',
      Obito: 'Óbito',
    }

    const novaSituacao = situacaoMap[ultimo.tipo]
    if (novaSituacao) {
      await supabase
        .from('academico_matriculas')
        .update({ situacao: novaSituacao })
        .eq('id', matriculaId)
    }
  }
}

// ------- Dispensas -------

export async function getDispensas(matriculaId: string) {
  const { data, error } = await supabase
    .from('academico_matriculas_dispensas')
    .select('*, disciplina:disciplina_id(nome)')
    .eq('matricula_id', matriculaId)
    .eq('ativo', true)

  if (error) throw error
  return data as Dispensa[]
}

export async function adicionarDispensa(matriculaId: string, disciplinaId: string, motivo: string) {
  const { data, error } = await supabase
    .from('academico_matriculas_dispensas')
    .insert({
      matricula_id: matriculaId,
      disciplina_id: disciplinaId,
      motivo,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerDispensa(id: string) {
  const { error } = await supabase
    .from('academico_matriculas_dispensas')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
}

// ------- Queries auxiliares -------

export async function getAlunos(schoolId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('id, nome_completo, cpf, data_nascimento')
    .eq('school_id', schoolId)
    .contains('perfil', ['aluno'])
    .eq('ativo', true)
    .order('nome_completo')

  if (error) throw error
  return data as any[]
}

export async function getTurmasAtivas(schoolId: string, anoLetivoId: string) {
  const { data, error } = await supabase
    .from('turmas')
    .select('id, nome, codigo_inep, turnos, tipos_turma, etapas_ensino_ids, multietapa')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
    .order('nome')

  if (error) throw error
  return data as any[]
}

export async function getEtapasDaTurma(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('etapas_ensino_ids, multietapa')
    .eq('id', turmaId)
    .single()

  if (!turma) return []

  if (turma.etapas_ensino_ids && turma.etapas_ensino_ids.length > 0) {
    const { data: etapas } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_nome')
      .in('id', turma.etapas_ensino_ids)
      .eq('ativa', true)
      .order('etapa_nome')

    return (etapas || []) as any[]
  }

  return []
}

export async function getSubetapasDaEtapa(etapaId: string) {
  const { data, error } = await supabase
    .from('academico_subetapas')
    .select('id, nome')
    .eq('etapa_ensino_id', etapaId)
    .order('nome')

  if (error) throw error
  return data as any[]
}

export async function getDisciplinasDaTurma(turmaId: string) {
  // Buscar disciplinas via turmas_disciplinas → academico_matriz_disciplinas → academico_disciplinas
  const { data: vinculadas } = await supabase
    .from('turmas_disciplinas')
    .select('id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
    .eq('turma_id', turmaId)

  if (vinculadas && vinculadas.length > 0) {
    return vinculadas.map(d => {
      const md = (d as any).academico_matriz_disciplinas
      return {
        disciplina_id: md?.disciplina_id,
        nome: md?.academico_disciplinas?.nome || 'Sem nome',
      }
    }).filter(d => d.disciplina_id) as any[]
  }

  // Fallback: buscar da matriz curricular da turma
  const { data: turma } = await supabase
    .from('turmas')
    .select('ano_letivo_id, etapas_ensino_ids')
    .eq('id', turmaId)
    .single()

  if (!turma) return []

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('school_id', (await supabase.from('turmas').select('school_id').eq('id', turmaId).single()).data?.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .in('etapa_ensino_id', turma.etapas_ensino_ids || [])
    .eq('ativa', true)
    .limit(1)
    .maybeSingle()

  if (!matriz) return []

  const { data: periodos } = await supabase
    .from('academico_matriz_periodos')
    .select('id')
    .eq('matriz_id', matriz.id)

  if (!periodos || periodos.length === 0) return []

  const { data: disciplinas } = await supabase
    .from('academico_matriz_disciplinas')
    .select('disciplina_id, academico_disciplinas(nome)')
    .in('periodo_id', periodos.map(p => p.id))

  const seen = new Set<string>()
  return ((disciplinas || []).filter(d => {
    if (seen.has(d.disciplina_id)) return false
    seen.add(d.disciplina_id)
    return true
  })) as any[]
}

export async function getAnoLetivoAtivo(schoolId: string) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('school_id', schoolId)
    .eq('status', 'ativo')
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as any
}
