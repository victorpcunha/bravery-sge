'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type Turma = {
  id: string
  school_id: string
  ano_letivo_id: string
  codigo_inep: string | null
  nome: string
  tipo_mediacao: string
  tipo_ensino: string | null
  capacidade_alunos: number
  local_funcionamento: string | null
  ciclo_inicio: string | null
  educacao_bilingue_surdos: boolean
  formacao_alternancia: boolean
  modalidade: string
  etapa_ensino_id: string
  multietapa: boolean
  turnos: Turno[]
  dias_funcionamento: string[]
  tipos_turma: string[]
  organizacao_curricular: string[]
  areas_itinerario: string[]
  tipo_curso: string | null
  curso_tecnico_id: string | null
  forma_organizacao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export type Turno = {
  turno: string
  horario_inicial: string
  horario_final: string
}

export type TurmaDisciplina = {
  id: string
  turma_id: string
  matriz_disciplina_id: string
  disciplina_nome?: string
  disciplina_id?: string
}

export type TurmaProfissional = {
  id: string
  turma_id: string
  person_id: string
  vinculo_profissional_id: string | null
  data_inicio: string
  data_encerramento: string | null
  ativo: boolean
  disciplinas_ids: string[]
  person_nome?: string
}

export type TurmaMultietapa = {
  id: string
  turma_id: string
  etapa_ensino_id: string
  etapa_nome?: string
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
  return data as { id: string; descricao: string; status: string } | null
}

export async function getTurmas(schoolId: string, search?: string, etapaId?: string) {
  let query = supabase
    .from('turmas')
    .select('*, academico_etapas_ensino(etapa_nome, etapa_tipo)')
    .eq('school_id', schoolId)

  if (search) query = query.ilike('nome', `%${search}%`)
  if (etapaId) query = query.eq('etapa_ensino_id', etapaId)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as any[]
}

export async function getTurma(id: string) {
  const [turmaResult, disciplinasResult, profissionaisResult, multietapaResult] = await Promise.all([
    supabase.from('turmas').select('*, academico_etapas_ensino(etapa_nome, etapa_tipo)').eq('id', id).single(),
    supabase.from('turmas_disciplinas').select('*, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))').eq('turma_id', id),
    supabase.from('turmas_profissionais').select('*, people(nome_completo)').eq('turma_id', id),
    supabase.from('turmas_multietapa').select('*, academico_etapas_ensino(etapa_nome)').eq('turma_id', id),
  ])

  if (turmaResult.error) throw turmaResult.error

  return {
    turma: turmaResult.data as any,
    disciplinas: (disciplinasResult.data || []) as any[],
    profissionais: (profissionaisResult.data || []) as any[],
    multietapa: (multietapaResult.data || []) as any[],
  }
}

export async function createTurma(data: {
  school_id: string
  ano_letivo_id: string
  nome: string
  tipo_mediacao: string
  tipo_ensino?: string | null
  capacidade_alunos: number
  local_funcionamento?: string | null
  ciclo_inicio?: string | null
  educacao_bilingue_surdos?: boolean
  formacao_alternancia?: boolean
  modalidade: string
  etapa_ensino_id: string
  multietapa?: boolean
  turnos?: Turno[]
  dias_funcionamento?: string[]
  tipos_turma?: string[]
  organizacao_curricular?: string[]
  areas_itinerario?: string[]
  tipo_curso?: string | null
  curso_tecnico_id?: string | null
  forma_organizacao?: string | null
  disciplinas?: string[]
  multietapa_etapas?: string[]
}) {
  const { disciplinas, multietapa_etapas, ...turmaData } = data

  const { data: turma, error } = await supabase
    .from('turmas')
    .insert({
      ...turmaData,
      educacao_bilingue_surdos: turmaData.educacao_bilingue_surdos || false,
      formacao_alternancia: turmaData.formacao_alternancia || false,
      multietapa: turmaData.multietapa || false,
      turnos: turmaData.turnos ? JSON.parse(JSON.stringify(turmaData.turnos)) : [],
      dias_funcionamento: turmaData.dias_funcionamento || [],
      tipos_turma: turmaData.tipos_turma || [],
      organizacao_curricular: turmaData.organizacao_curricular || [],
      areas_itinerario: turmaData.areas_itinerario || [],
    })
    .select()
    .single()

  if (error) throw error

  // Inserir disciplinas
  if (disciplinas && disciplinas.length > 0) {
    const disciplinasInsert = disciplinas.map(mdId => ({
      turma_id: turma.id,
      matriz_disciplina_id: mdId,
    }))
    const { error: errD } = await supabase.from('turmas_disciplinas').insert(disciplinasInsert)
    if (errD) throw errD
  }

  // Inserir multietapa
  if (multietapa_etapas && multietapa_etapas.length > 0) {
    const etapasInsert = multietapa_etapas.map(etapaId => ({
      turma_id: turma.id,
      etapa_ensino_id: etapaId,
    }))
    const { error: errM } = await supabase.from('turmas_multietapa').insert(etapasInsert)
    if (errM) throw errM
  }

  return turma
}

export async function updateTurma(id: string, data: {
  nome?: string
  tipo_mediacao?: string
  tipo_ensino?: string | null
  capacidade_alunos?: number
  local_funcionamento?: string | null
  ciclo_inicio?: string | null
  educacao_bilingue_surdos?: boolean
  formacao_alternancia?: boolean
  modalidade?: string
  etapa_ensino_id?: string
  multietapa?: boolean
  turnos?: Turno[]
  dias_funcionamento?: string[]
  tipos_turma?: string[]
  organizacao_curricular?: string[]
  areas_itinerario?: string[]
  tipo_curso?: string | null
  curso_tecnico_id?: string | null
  forma_organizacao?: string | null
  disciplinas?: string[]
  multietapa_etapas?: string[]
}) {
  const { disciplinas, multietapa_etapas, ...updateData } = data

  if (updateData.turnos) {
    updateData.turnos = JSON.parse(JSON.stringify(updateData.turnos)) as any
  }

  const { error } = await supabase.from('turmas').update(updateData).eq('id', id)
  if (error) throw error

  // Sincronizar disciplinas
  if (disciplinas !== undefined) {
    await supabase.from('turmas_disciplinas').delete().eq('turma_id', id)
    if (disciplinas.length > 0) {
      const { error: errD } = await supabase.from('turmas_disciplinas').insert(
        disciplinas.map(mdId => ({ turma_id: id, matriz_disciplina_id: mdId }))
      )
      if (errD) throw errD
    }
  }

  // Sincronizar multietapa
  if (multietapa_etapas !== undefined) {
    await supabase.from('turmas_multietapa').delete().eq('turma_id', id)
    if (multietapa_etapas.length > 0) {
      const { error: errM } = await supabase.from('turmas_multietapa').insert(
        multietapa_etapas.map(etapaId => ({ turma_id: id, etapa_ensino_id: etapaId }))
      )
      if (errM) throw errM
    }
  }
}

export async function deleteTurma(id: string) {
  await Promise.all([
    supabase.from('turmas_disciplinas').delete().eq('turma_id', id),
    supabase.from('turmas_profissionais').delete().eq('turma_id', id),
    supabase.from('turmas_multietapa').delete().eq('turma_id', id),
  ])
  const { error } = await supabase.from('turmas').delete().eq('id', id)
  if (error) throw error
}

export async function toggleTurmaAtiva(id: string, ativo: boolean) {
  const { error } = await supabase.from('turmas').update({ ativo }).eq('id', id)
  if (error) throw error
}

export async function addProfissionalTurma(data: {
  turma_id: string
  person_id: string
  vinculo_profissional_id?: string | null
  data_inicio: string
  disciplinas_ids?: string[]
}) {
  const { error } = await supabase.from('turmas_profissionais').insert({
    turma_id: data.turma_id,
    person_id: data.person_id,
    vinculo_profissional_id: data.vinculo_profissional_id || null,
    data_inicio: data.data_inicio,
    disciplinas_ids: data.disciplinas_ids || [],
  })
  if (error) throw error
}

export async function updateProfissionalTurma(id: string, data: {
  vinculo_profissional_id?: string | null
  data_inicio?: string
  data_encerramento?: string | null
  ativo?: boolean
  disciplinas_ids?: string[]
}) {
  const { error } = await supabase.from('turmas_profissionais').update(data).eq('id', id)
  if (error) throw error
}

export async function removeProfissionalTurma(id: string) {
  const { error } = await supabase.from('turmas_profissionais').delete().eq('id', id)
  if (error) throw error
}

export async function getDisciplinasPorMatriz(etapaEnsinoId: string, schoolId: string, anoLetivoId: string) {
  const { data: matrizes, error } = await supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('school_id', schoolId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativa', true)
    .limit(1)

  if (error) throw error
  if (!matrizes || matrizes.length === 0) return []

  const matrizId = matrizes[0].id

  const { data: periodos } = await supabase
    .from('academico_matriz_periodos')
    .select('id')
    .eq('matriz_id', matrizId)

  if (!periodos || periodos.length === 0) return []

  const periodoIds = periodos.map(p => p.id)

  const { data: disciplinas, error: errD } = await supabase
    .from('academico_matriz_disciplinas')
    .select('*, academico_disciplinas(nome, nome_abreviado, componente)')
    .in('periodo_id', periodoIds)
    .order('created_at')

  if (errD) throw errD

  // Deduplicar por disciplina_id (mesma disciplina pode estar em vários períodos)
  const seen = new Set<string>()
  const unicas = (disciplinas || []).filter(d => {
    if (seen.has(d.disciplina_id)) return false
    seen.add(d.disciplina_id)
    return true
  })

  return unicas as any[]
}

export async function getEtapasEnsinoAdmin(schoolId: string) {
  const { data, error } = await supabase
    .from('academico_etapas_ensino')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ativa', true)
    .order('etapa_codigo')

  if (error) throw error
  return data as any[]
}

export async function getAnosLetivosAdmin(schoolId: string) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('school_id', schoolId)
    .order('descricao', { ascending: false })

  if (error) throw error
  return data as any[]
}

export async function getProfissionaisAtivos(schoolId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('id, nome_completo, codigo_pessoa, perfil')
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .order('nome_completo')

  if (error) throw error
  const all = data as any[] || []
  return all.filter(p => Array.isArray(p.perfil) && p.perfil.includes('profissional'))
    .map(p => ({ id: p.id, nome_completo: p.nome_completo, codigo_pessoa: p.codigo_pessoa }))
}

export async function getVinculosAtivosProfissional(personId: string) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .eq('person_id', personId)
    .eq('situacao', '1')

  if (error) throw error
  return data as any[]
}
