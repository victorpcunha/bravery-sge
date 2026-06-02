'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

async function validarPermWrite(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'editar')
  }
}

const RESOURCE = 'gestao-pedagogica.plano-ensino'

// ─── Tipos ───

export type PlanoEnsino = {
  id: string
  school_id: string
  turma_id: string
  ano_letivo_id: string
  etapa_id: string
  subetapa_id: string | null
  is_interdisciplinar: boolean
  turma_nome?: string
  etapa_nome?: string
  etapa_tipo?: string
  disciplinas?: { id: string; nome: string }[]
  total_aulas?: number
  created_at: string
}

export type PlanoAula = {
  id: string
  plano_ensino_id: string
  periodos: number[]
  tema: string
  conteudo: string | null
  data_inicio: string | null
  data_fim: string | null
  recursos_didaticos: string | null
  metodologia: string | null
  avaliacao: string | null
  referencias: string | null
  bncc_fields: any[]
}

export type BnccFieldItem = {
  tipo: string
  id: string
  [key: string]: any
}

// ─── FASE 1: Listagem ───

export async function listarPlanosEnsino(
  schoolId: string,
  pessoaId: string | null,
  anoLetivoId?: string,
  turmaId?: string
) {
  await validarPermRead(RESOURCE, pessoaId)

  let usaVinculo = false

  if (pessoaId) {
    const perfil = await supabase
      .from('people')
      .select('perfil_id')
      .eq('id', pessoaId)
      .maybeSingle()
      .then(r => r.data)

    if (perfil?.perfil_id) {
      const { data: perfilData } = await supabase
        .from('perfis')
        .select('usa_vinculo_turma')
        .eq('id', perfil.perfil_id)
        .maybeSingle()

      usaVinculo = perfilData?.usa_vinculo_turma ?? false
    }
  }

  let query = supabase
    .from('planos_ensino')
    .select(`
      id, school_id, turma_id, ano_letivo_id, etapa_id, subetapa_id,
      is_interdisciplinar, created_at,
      turmas!inner(nome),
      academico_etapas_ensino!inner(etapa_nome, etapa_tipo)
    `)
    .eq('school_id', schoolId)

  if (anoLetivoId) {
    query = query.eq('ano_letivo_id', anoLetivoId)
  }
  if (turmaId) {
    query = query.eq('turma_id', turmaId)
  }

  if (usaVinculo && pessoaId) {
    const { data: vinculos } = await supabase
      .from('turmas_profissionais')
      .select('turma_id')
      .eq('person_id', pessoaId)

    const turmaIds = vinculos?.map(v => v.turma_id) || []
    if (turmaIds.length === 0) return []
    query = query.in('turma_id', turmaIds)
  }

  const { data } = await query.order('created_at', { ascending: false })
  if (!data) return []

  const planos = await Promise.all(
    (data as any[]).map(async (p) => {
      const { data: discData } = await supabase
        .from('planos_ensino_disciplinas')
        .select('matriz_disciplina_id')
        .eq('plano_ensino_id', p.id)

      const matrizIds = discData?.map(d => d.matriz_disciplina_id) || []

      let disciplinas: { id: string; nome: string }[] = []
      if (matrizIds.length > 0) {
        const { data: matrizes } = await supabase
          .from('academico_matriz_disciplinas')
          .select('id, disciplina_id')
          .in('id', matrizIds)

        const discIds = matrizes?.map(m => m.disciplina_id).filter(Boolean) || []
        if (discIds.length > 0) {
          const { data: nomes } = await supabase
            .from('academico_disciplinas')
            .select('id, nome')
            .in('id', discIds)

          disciplinas = (nomes || []).map(d => ({ id: d.id, nome: d.nome }))
        }
      }

      const { count } = await supabase
        .from('planos_aula')
        .select('*', { count: 'exact', head: true })
        .eq('plano_ensino_id', p.id)

      return {
        id: p.id,
        school_id: p.school_id,
        turma_id: p.turma_id,
        ano_letivo_id: p.ano_letivo_id,
        etapa_id: p.etapa_id,
        subetapa_id: p.subetapa_id,
        is_interdisciplinar: p.is_interdisciplinar,
        turma_nome: (p.turmas as any)?.nome || '',
        etapa_nome: (p.academico_etapas_ensino as any)?.etapa_nome || '',
        etapa_tipo: (p.academico_etapas_ensino as any)?.etapa_tipo || '',
        disciplinas,
        total_aulas: count || 0,
        created_at: p.created_at,
      }
    })
  )

  return planos as PlanoEnsino[]
}

// ─── FASE 2: Criação ───

export async function criarPlanoEnsino(
  data: {
    school_id: string
    turma_id: string
    ano_letivo_id: string
    etapa_id: string
    subetapa_id?: string | null
    disciplinas: string[]
    is_interdisciplinar: boolean
  },
  pessoaId?: string | null
) {
  await validarPermWrite(RESOURCE, pessoaId)

  if (!data.turma_id || !data.ano_letivo_id || !data.etapa_id) {
    throw new Error('Turma, Ano Letivo e Etapa são obrigatórios')
  }

  const { data: plano, error } = await supabase
    .from('planos_ensino')
    .insert({
      school_id: data.school_id,
      turma_id: data.turma_id,
      ano_letivo_id: data.ano_letivo_id,
      etapa_id: data.etapa_id,
      subetapa_id: data.subetapa_id || null,
      is_interdisciplinar: data.is_interdisciplinar,
      created_by: pessoaId,
      updated_by: pessoaId,
    })
    .select()
    .single()

  if (error) throw error

  if (data.disciplinas.length > 0) {
    const discInsert = data.disciplinas.map(matriz_disciplina_id => ({
      plano_ensino_id: plano.id,
      matriz_disciplina_id,
    }))

    const { error: discError } = await supabase
      .from('planos_ensino_disciplinas')
      .insert(discInsert)

    if (discError) throw discError
  }

  return plano
}

export async function excluirPlanoEnsino(id: string, pessoaId?: string | null) {
  await validarPermWrite(RESOURCE, pessoaId)

  const { error } = await supabase
    .from('planos_ensino')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── FASE 3: Períodos ───

export async function listarPeriodosPlanoEnsino(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma) return { quantidade_periodos: 4, periodos: [1, 2, 3, 4] }

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)

  const metodoId = matriz?.[0]?.metodo_avaliacao_id

  if (metodoId) {
    const { data: metodo } = await supabase
      .from('academico_metodos_avaliacao')
      .select('quantidade_periodos_numerico, quantidade_periodos_parecer, quantidade_periodos_conceito, quantidade_periodos_nivel')
      .eq('id', metodoId)
      .maybeSingle()

    if (metodo) {
      const qtd = (metodo as any).quantidade_periodos_numerico
        || (metodo as any).quantidade_periodos_parecer
        || (metodo as any).quantidade_periodos_conceito
        || (metodo as any).quantidade_periodos_nivel
        || 4

      return {
        quantidade_periodos: qtd,
        periodos: Array.from({ length: qtd }, (_, i) => i + 1),
      }
    }
  }

  return { quantidade_periodos: 4, periodos: [1, 2, 3, 4] }
}

// ─── FASE 4: Planos de Aula ───

export async function listarPlanoAula(planoEnsinoId: string, periodo?: number) {
  await validarPermRead(RESOURCE)

  let query = supabase
    .from('planos_aula')
    .select('*')
    .eq('plano_ensino_id', planoEnsinoId)
    .order('data_inicio', { ascending: true })

  if (periodo) {
    query = query.overlaps('periodos', [periodo])
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as PlanoAula[]
}

export async function criarPlanoAula(
  data: {
    plano_ensino_id: string
    periodos: number[]
    tema: string
    conteudo?: string | null
    data_inicio?: string | null
    data_fim?: string | null
    recursos_didaticos?: string | null
    metodologia?: string | null
    avaliacao?: string | null
    referencias?: string | null
    bncc_fields?: any[]
  },
  pessoaId?: string | null
) {
  await validarPermWrite(RESOURCE, pessoaId)

  if (!data.tema.trim()) throw new Error('Tema é obrigatório')

  const { data: aula, error } = await supabase
    .from('planos_aula')
    .insert({
      plano_ensino_id: data.plano_ensino_id,
      periodos: data.periodos,
      tema: data.tema.trim(),
      conteudo: data.conteudo || null,
      data_inicio: data.data_inicio || null,
      data_fim: data.data_fim || null,
      recursos_didaticos: data.recursos_didaticos || null,
      metodologia: data.metodologia || null,
      avaliacao: data.avaliacao || null,
      referencias: data.referencias || null,
      bncc_fields: data.bncc_fields || [],
      created_by: pessoaId,
      updated_by: pessoaId,
    })
    .select()
    .single()

  if (error) throw error
  return aula as PlanoAula
}

export async function editarPlanoAula(
  id: string,
  data: {
    periodos?: number[]
    tema?: string
    conteudo?: string | null
    data_inicio?: string | null
    data_fim?: string | null
    recursos_didaticos?: string | null
    metodologia?: string | null
    avaliacao?: string | null
    referencias?: string | null
    bncc_fields?: any[]
  },
  pessoaId?: string | null
) {
  await validarPermWrite(RESOURCE, pessoaId)

  const updateData: any = { updated_by: pessoaId }
  if (data.periodos !== undefined) updateData.periodos = data.periodos
  if (data.tema !== undefined) updateData.tema = data.tema.trim()
  if (data.conteudo !== undefined) updateData.conteudo = data.conteudo
  if (data.data_inicio !== undefined) updateData.data_inicio = data.data_inicio
  if (data.data_fim !== undefined) updateData.data_fim = data.data_fim
  if (data.recursos_didaticos !== undefined) updateData.recursos_didaticos = data.recursos_didaticos
  if (data.metodologia !== undefined) updateData.metodologia = data.metodologia
  if (data.avaliacao !== undefined) updateData.avaliacao = data.avaliacao
  if (data.referencias !== undefined) updateData.referencias = data.referencias
  if (data.bncc_fields !== undefined) updateData.bncc_fields = data.bncc_fields

  const { error } = await supabase
    .from('planos_aula')
    .update(updateData)
    .eq('id', id)

  if (error) throw error
}

export async function excluirPlanoAula(id: string, pessoaId?: string | null) {
  await validarPermWrite(RESOURCE, pessoaId)

  const { error } = await supabase
    .from('planos_aula')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Helpers ───

export async function getTurmaEtapaEnsino(turmaId: string) {
  const { data } = await supabase
    .from('turmas')
    .select('etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  return {
    etapa_id: (data as any)?.etapa_ensino_id || '',
  }
}

// ─── FASE 5: BNCC ───

type BnccCamposExperiencia = { id: string; sigla: string; nome: string }
type BnccObjetivo = { id: string; codigo_bncc: string; descricao: string; campo_experiencia: string; faixa_etaria: string }
type BnccUnidadeTematica = { id: string; unidade_tematica: string; disciplina: string; etapa_ensino: string }
type BnccObjetoConhecimento = { id: string; objeto_conhecimento: string; unidade_tematica_id: string }
type BnccHabilidade = { id: string; codigo_bncc: string; descricao: string; anos: string[]; objeto_conhecimento_id: string }
type BnccAreaConhecimento = { id: string; nome: string; tipo_ensino: string }
type BnccCompetencia = { id: string; area_id: string; codigo: string; descricao: string }
type BnccHabilidadeMedio = { id: string; codigo: string; descricao: string; area_id: string; competencia_codigo: string }

export async function buscarBNCCBase(etapaTipo: string, disciplinaNome?: string) {
  const resultado: any = { etapa_tipo: etapaTipo }

  if (etapaTipo === 'infantil') {
    const { data: campos } = await supabase
      .from('bncc_campos_experiencia')
      .select('id, sigla, nome')
      .order('sigla')

    const { data: objetivos } = await supabase
      .from('bncc_objetivos')
      .select('id, codigo_bncc, descricao, campo_experiencia, faixa_etaria')
      .eq('tipo_ensino', 'infantil')
      .order('codigo_bncc')

    resultado.campos_experiencia = campos as BnccCamposExperiencia[] || []
    resultado.objetivos = objetivos as BnccObjetivo[] || []

  } else if (etapaTipo === 'fundamental_inicial' || etapaTipo === 'fundamental_final' || etapaTipo === 'fundamental_outros' || etapaTipo === 'eja') {
    const etapaEnsinoDB = etapaTipo === 'fundamental_inicial' ? 'anos_iniciais'
      : etapaTipo === 'fundamental_final' ? 'anos_finais'
      : null

    let query = supabase
      .from('bncc_unidades_tematicas')
      .select('id, unidade_tematica, disciplina, etapa_ensino')
      .order('unidade_tematica')

    if (disciplinaNome) query = query.eq('disciplina', disciplinaNome)
    if (etapaEnsinoDB) query = query.eq('etapa_ensino', etapaEnsinoDB)

    const { data: unidades } = await query

    const { data: objetos } = await supabase
      .from('bncc_objetos_conhecimento')
      .select('id, objeto_conhecimento, unidade_tematica_id')
      .order('objeto_conhecimento')

    const { data: habilidades } = await supabase
      .from('bncc_habilidades')
      .select('id, codigo_bncc, descricao, anos, objeto_conhecimento_id')
      .order('codigo_bncc')

    resultado.unidades_tematicas = unidades as BnccUnidadeTematica[] || []
    resultado.objetos_conhecimento = objetos as BnccObjetoConhecimento[] || []
    resultado.habilidades = habilidades as BnccHabilidade[] || []

  } else if (etapaTipo === 'medio') {
    const { data: areas } = await supabase
      .from('bncc_areas_conhecimento')
      .select('id, nome, tipo_ensino')
      .eq('tipo_ensino', 'medio')
      .order('nome')

    const { data: competencias } = await supabase
      .from('bncc_competencias')
      .select('id, area_id, codigo, descricao')
      .order('codigo')

    const { data: habilidades } = await supabase
      .from('bncc_habilidades_medio')
      .select('id, codigo, descricao, area_id, competencia_codigo')
      .order('codigo')

    resultado.areas_conhecimento = areas as BnccAreaConhecimento[] || []
    resultado.competencias = competencias as BnccCompetencia[] || []
    resultado.habilidades_medio = habilidades as BnccHabilidadeMedio[] || []
  }

  return resultado
}

// ─── FASE 6: Integração com Diário de Classe ───

export async function listarPlanoAulaPorMes(
  turmaId: string,
  matrizDisciplinaId: string,
) {
  const { data: planos } = await supabase
    .from('planos_ensino_disciplinas')
    .select('plano_ensino_id')
    .eq('matriz_disciplina_id', matrizDisciplinaId)

  if (!planos || planos.length === 0) return []

  const planoIds = planos.map(p => p.plano_ensino_id)

  const { data: planosEnsino } = await supabase
    .from('planos_ensino')
    .select('id')
    .in('id', planoIds)
    .eq('turma_id', turmaId)

  if (!planosEnsino || planosEnsino.length === 0) return []

  const validIds = planosEnsino.map(p => p.id)

  const { data: aulas } = await supabase
    .from('planos_aula')
    .select('*')
    .in('plano_ensino_id', validIds)
    .order('data_inicio', { ascending: true })

  return (aulas || []) as PlanoAula[]
}
