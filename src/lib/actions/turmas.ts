'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import { garantirTurmaAberta } from './garantir-turma-aberta'
import { COMPATIBILIDADE_MEDIACAO_TURMA_ETAPA } from '@/data/censo/tipo-turma-mediacao'
import { codigoTipoTurma } from '@/data/censo/tipo-turma-codigos'
import { MAX_ATIVIDADES_POR_TURMA } from '@/data/censo/atividades-complementares'

const supabase = getSupabaseAdmin()

async function validarPermWrite(recurso: string, acao: 'criar' | 'editar' | 'excluir', pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, acao)
  }
}

const MODULO_TURMAS = 'Turmas'

async function registrarTurma(
  acao: 'criar' | 'editar' | 'excluir',
  entidade: string,
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  registro_nome?: string | null,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: MODULO_TURMAS,
    entidade,
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

async function nomeTurma(turmaId: string): Promise<string | null> {
  const { data } = await supabase.from('turmas').select('nome').eq('id', turmaId).maybeSingle()
  return data?.nome || null
}

async function nomePessoa(personId: string | null | undefined): Promise<string | null> {
  if (!personId) return null
  const { data } = await supabase.from('people').select('nome_completo').eq('id', personId).maybeSingle()
  return data?.nome_completo || null
}

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
  etapa_ensino_id: string | null
  multietapa: boolean
  turnos: Turno[]
  dias_funcionamento: string[]
  tipos_turma: string[]
  organizacao_curricular: string[]
  areas_itinerario: string[]
  tipo_curso: string | null
  curso_tecnico_id: string | null
  forma_organizacao: string | null
  atividade_complementar_1: string | null
  atividade_complementar_2: string | null
  atividade_complementar_3: string | null
  atividade_complementar_4: string | null
  atividade_complementar_5: string | null
  atividade_complementar_6: string | null
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
  atividades_ids: string[]
  person_nome?: string
}

export type TurmaMultietapa = {
  id: string
  turma_id: string
  etapa_ensino_id: string
  etapa_nome?: string
}

const TIPOS_COM_ETAPA = ['Curricular', 'Curricular com Atividade Complementar']
const TIPOS_COM_ATIVIDADES = ['Atividade Complementar', 'Curricular com Atividade Complementar']

function codigoMediacao(mediacao: string): string {
  if (mediacao === 'Presencial') return '1'
  if (mediacao === 'Semipresencial') return '2'
  if (mediacao === 'Educação a Distância - EAD') return '3'
  return String(mediacao ?? '')
}

// Validação server-side espelho da matriz oficial Tipo x Etapa (Tabela de Etapas 2026)
function validarMatrizTipoEtapa(t: {
  tipo_mediacao?: string | null
  tipos_turma?: string[] | null
  etapa_agregada?: string | null
  etapa_codigo?: string | null
}) {
  const tipos = t.tipos_turma || []
  if (tipos.length === 0) throw new Error('Selecione ao menos um tipo de turma')
  if (!TIPOS_COM_ETAPA.includes(tipos[0])) return
  const med = codigoMediacao(t.tipo_mediacao || '')
  const tipoCod = codigoTipoTurma(tipos)
  const entradas = COMPATIBILIDADE_MEDIACAO_TURMA_ETAPA.filter(c => c.tipo_mediacao === med && c.tipo_turma === tipoCod)
  if (entradas.some(c => c.etapa_agregada === '-')) return
  const agreg = t.etapa_agregada ? String(t.etapa_agregada) : ''
  const etapaNum = t.etapa_codigo && /^\d+$/.test(String(t.etapa_codigo)) ? parseInt(String(t.etapa_codigo), 10) : null
  if (!agreg || etapaNum == null) {
    throw new Error('Selecione a Etapa Agregada e a Etapa de Ensino compatíveis com o Tipo de Turma.')
  }
  const ok = entradas.some(c =>
    c.etapa_agregada === agreg &&
    (c.etapas_ensino.length === 0 || c.etapas_ensino.includes(etapaNum))
  )
  if (!ok) {
    throw new Error('A combinação de Tipo de Mediação, Tipo de Turma e Etapa não é compatível (Tabela de Etapas 2026).')
  }
}

function validarAtividadesTurma(t: { tipos_turma?: string[] | null } & Record<string, unknown>) {
  const tipos = t.tipos_turma || []
  const exige = tipos.some(tipo => TIPOS_COM_ATIVIDADES.includes(tipo))
  const codigos = [1, 2, 3, 4, 5, 6]
    .map(i => t[`atividade_complementar_${i}`])
    .filter(c => c && String(c).trim() !== '')
    .map(c => String(c).trim())
  if (!exige) return
  if (codigos.length === 0) {
    throw new Error('Turma com atividade complementar deve ter ao menos uma atividade')
  }
  if (codigos.length > MAX_ATIVIDADES_POR_TURMA) {
    throw new Error(`Turma admite no máximo ${MAX_ATIVIDADES_POR_TURMA} atividades complementares`)
  }
  if (new Set(codigos).size !== codigos.length) {
    throw new Error('As atividades complementares não podem se repetir na mesma turma')
  }
}

export async function getAnoLetivoAtivo(schoolId: string | null | null) {
  let query = supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('status', 'ativo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as { id: string; descricao: string; status: string } | null
}

export async function getTurmas(
  schoolId: string | null,
  search?: string,
  etapaId?: string,
  anoLetivoId?: string,
  tipoTurma?: string,
) {
  let query = supabase
    .from('turmas')
    .select('*, academico_etapas_ensino(etapa_nome, etapa_tipo, etapa_codigo)')

  if (schoolId) query = query.eq('school_id', schoolId)
  if (search) query = query.ilike('nome', `%${search}%`)
  if (etapaId) query = query.eq('etapa_ensino_id', etapaId)
  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)
  if (tipoTurma) query = query.contains('tipos_turma', JSON.stringify([tipoTurma]))

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as any[]
}

export async function getTurma(id: string, schoolId?: string | null) {
  let turmaQuery = supabase.from('turmas').select('*, academico_etapas_ensino(etapa_nome, etapa_tipo)').eq('id', id);
  if (schoolId) turmaQuery = turmaQuery.eq('school_id', schoolId);

  const [turmaResult, disciplinasResult, profissionaisResult, multietapaResult] = await Promise.all([
    turmaQuery.single(),
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
  etapa_ensino_id: string | null
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
  multietapa_subetapas_ids?: string[]
  etapa_agregada?: string | null
  etapa_codigo?: string | null
  turma_especial?: string | null
  eixo_qualificacao?: string | null
  atividade_complementar_1?: string | null
  atividade_complementar_2?: string | null
  atividade_complementar_3?: string | null
  atividade_complementar_4?: string | null
  atividade_complementar_5?: string | null
  atividade_complementar_6?: string | null
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'criar', pessoaId)
  validarMatrizTipoEtapa(data as any)
  validarAtividadesTurma(data as any)
  const { disciplinas, multietapa_etapas, multietapa_subetapas_ids, ...turmaData } = data

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
      multietapa_subetapas_ids: multietapa_subetapas_ids || [],
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

  await registrarTurma('criar', 'turmas', turma.id, pessoaId, turma.school_id, turma.nome, null, turma)

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
  etapa_ensino_id?: string | null
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
  multietapa_subetapas_ids?: string[]
  etapa_agregada?: string | null
  etapa_codigo?: string | null
  turma_especial?: string | null
  eixo_qualificacao?: string | null
  atividade_complementar_1?: string | null
  atividade_complementar_2?: string | null
  atividade_complementar_3?: string | null
  atividade_complementar_4?: string | null
  atividade_complementar_5?: string | null
  atividade_complementar_6?: string | null
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'editar', pessoaId)
  await garantirTurmaAberta(id)
  const { disciplinas, multietapa_etapas, multietapa_subetapas_ids, ...updateData } = data

  const { data: anterior } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  // Valida o estado final (atual + anterior) contra a matriz oficial e atividades
  validarMatrizTipoEtapa({ ...(anterior as any), ...updateData } as any)
  validarAtividadesTurma({ ...(anterior as any), ...updateData } as any)

  if (updateData.turnos) {
    updateData.turnos = JSON.parse(JSON.stringify(updateData.turnos)) as any
  }

  const { error } = await supabase.from('turmas').update({
    ...updateData,
    multietapa_subetapas_ids: multietapa_subetapas_ids || (updateData as any).multietapa_subetapas_ids || [],
  }).eq('id', id)
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

  const { data: final } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  await registrarTurma('editar', 'turmas', id, pessoaId, final?.school_id || anterior?.school_id, final?.nome || anterior?.nome, anterior, final)
}

export async function deleteTurma(id: string, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'excluir', pessoaId)
  await garantirTurmaAberta(id)

  const { data: anterior } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  await Promise.all([
    supabase.from('turmas_disciplinas').delete().eq('turma_id', id),
    supabase.from('turmas_profissionais').delete().eq('turma_id', id),
    supabase.from('turmas_multietapa').delete().eq('turma_id', id),
  ])
  const { error } = await supabase.from('turmas').delete().eq('id', id)
  if (error) throw error

  if (anterior) {
    await registrarTurma('excluir', 'turmas', id, pessoaId, anterior.school_id, anterior.nome, anterior, null)
  }
}

export async function toggleTurmaAtiva(id: string, ativo: boolean, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'editar', pessoaId)
  await garantirTurmaAberta(id)

  const { data: anterior } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('turmas').update({ ativo }).eq('id', id)
  if (error) throw error

  const { data: final } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  await registrarTurma('editar', 'turmas', id, pessoaId, final?.school_id || anterior?.school_id, final?.nome || anterior?.nome, anterior, final)
}

export async function addProfissionalTurma(data: {
  turma_id: string
  person_id: string
  vinculo_profissional_id?: string | null
  data_inicio: string
  disciplinas_ids?: string[]
  atividades_ids?: string[]
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'editar', pessoaId)
  const { data: criado, error } = await supabase.from('turmas_profissionais').insert({
    turma_id: data.turma_id,
    person_id: data.person_id,
    vinculo_profissional_id: data.vinculo_profissional_id || null,
    data_inicio: data.data_inicio,
    disciplinas_ids: data.disciplinas_ids || [],
    atividades_ids: data.atividades_ids || [],
  }).select().single()
  if (error) throw error

  if (data.disciplinas_ids?.length) {
    await sincronizarProfessorQuadro(data.turma_id, data.person_id, data.disciplinas_ids)
  }

  const turmaNome = await nomeTurma(data.turma_id)
  const pessoaNome = await nomePessoa(data.person_id)
  const { data: turmaRows } = await supabase.from('turmas').select('school_id').eq('id', data.turma_id).maybeSingle()
  await registrarTurma('criar', 'turmas_profissionais', criado.id, pessoaId, turmaRows?.school_id, pessoaNome || turmaNome, null, criado)
}

async function sincronizarProfessorQuadro(turmaId: string, professorId: string, disciplinasIds: string[]) {
  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!quadro) return

  await supabase
    .from('quadro_aulas_horarios')
    .update({ professor_id: professorId })
    .eq('quadro_aula_id', quadro.id)
    .in('disciplina_id', disciplinasIds)
    .eq('ativo', true)
}

export async function updateProfissionalTurma(id: string, data: {
  vinculo_profissional_id?: string | null
  data_inicio?: string
  data_encerramento?: string | null
  ativo?: boolean
  disciplinas_ids?: string[]
  atividades_ids?: string[]
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'editar', pessoaId)

  // Data de término (inativação) não pode ser futura
  if (data.data_encerramento) {
    const hoje = new Date()
    const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
    if (String(data.data_encerramento).slice(0, 10) > hojeISO) {
      throw new Error('A Data de Término do vínculo não pode ser posterior à data atual')
    }
  }

  const { data: anterior } = await supabase
    .from('turmas_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('turmas_profissionais').update(data).eq('id', id)
  if (error) throw error

  if (anterior && data.disciplinas_ids) {
    const idsAntigos = (anterior.disciplinas_ids || []) as string[]
    const idsNovos = data.disciplinas_ids
    const idsRemover = idsAntigos.filter(d => !idsNovos.includes(d))
    const idsAdicionar = idsNovos.filter(d => !idsAntigos.includes(d))

    const { data: quadro } = await supabase
      .from('quadro_aulas')
      .select('id')
      .eq('turma_id', anterior.turma_id)
      .eq('ativo', true)
      .maybeSingle()

    if (quadro) {
      if (idsRemover.length > 0) {
        await supabase
          .from('quadro_aulas_horarios')
          .update({ professor_id: null })
          .eq('quadro_aula_id', quadro.id)
          .in('disciplina_id', idsRemover)
          .eq('ativo', true)
      }
      if (idsAdicionar.length > 0) {
        await supabase
          .from('quadro_aulas_horarios')
          .update({ professor_id: anterior.person_id })
          .eq('quadro_aula_id', quadro.id)
          .in('disciplina_id', idsAdicionar)
          .eq('ativo', true)
      }
    }
  }

  const finalVinculo = await supabase
    .from('turmas_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const pessoaNome = await nomePessoa(anterior?.person_id)
  const turmaNome = anterior?.turma_id ? await nomeTurma(anterior.turma_id) : null
  const { data: turmaRows } = await supabase.from('turmas').select('school_id').eq('id', anterior?.turma_id).maybeSingle()
  await registrarTurma('editar', 'turmas_profissionais', id, pessoaId, turmaRows?.school_id, pessoaNome || turmaNome, anterior, finalVinculo.data)
}

export async function removeProfissionalTurma(id: string, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.turmas', 'editar', pessoaId)

  const { data: vinculo } = await supabase
    .from('turmas_profissionais')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('turmas_profissionais').delete().eq('id', id)
  if (error) throw error

  if (vinculo) {
    if (vinculo.disciplinas_ids?.length) {
      const { data: quadro } = await supabase
        .from('quadro_aulas')
        .select('id')
        .eq('turma_id', vinculo.turma_id)
        .eq('ativo', true)
        .maybeSingle()

      if (quadro) {
        await supabase
          .from('quadro_aulas_horarios')
          .update({ professor_id: null })
          .eq('quadro_aula_id', quadro.id)
          .in('disciplina_id', vinculo.disciplinas_ids)
          .eq('ativo', true)
      }
    }

    const pessoaNome = await nomePessoa(vinculo.person_id)
    const turmaNome = vinculo.turma_id ? await nomeTurma(vinculo.turma_id) : null
    const { data: turmaRows } = await supabase.from('turmas').select('school_id').eq('id', vinculo.turma_id).maybeSingle()
    await registrarTurma('excluir', 'turmas_profissionais', id, pessoaId, turmaRows?.school_id, pessoaNome || turmaNome, vinculo, null)
  }
}

export async function getDisciplinasPorMatriz(etapaEnsinoId: string, schoolId: string | null, anoLetivoId: string) {
  let query = supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativa', true)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data: matrizes, error } = await query
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

export async function getAnosLetivosAdmin(schoolId: string | null) {
  let query = supabase
    .from('academico_anos_letivos')
    .select('*')
    .order('descricao', { ascending: false })

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as any[]
}

export async function getProfissionaisAtivos(schoolId: string | null) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, codigo_pessoa, perfil')
    .eq('ativo', true)
    .order('nome_completo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query

  if (error) throw error
  return ((data ?? []) as any[]).filter((p: any) => Array.isArray(p.perfil) && p.perfil.includes('profissional'))
    .map((p: any) => ({ id: p.id, nome_completo: p.nome_completo, codigo_pessoa: p.codigo_pessoa }))
}

export async function getVinculosAtivosProfissional(personId: string) {
  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .select('*, funcao:funcao_id(id, nome, tipo_censo)')
    .eq('person_id', personId)
    .eq('situacao', '1')

  if (error) throw error
  return (data ?? []) as any[]
}
