'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

// ------- Tipos -------

export type Indicador = {
  id: string
  school_id: string
  ano_letivo_id: string
  etapa_ensino_id: string
  subetapa_id: string | null
  campo_experiencia: string | null
  disciplina_id: string | null
  codigo: string | null
  descricao: string
  periodos_ids: string[]
  origem: 'matriz' | 'manual'
  objetivo_bncc_id: string | null
  utilizado: boolean
  ativo: boolean
  created_at: string
  updated_at: string
  niveis?: IndicadorNivel[]
}

export type IndicadorNivel = {
  id: string
  indicador_id: string
  descricao: string
  sigla: string | null
  ordem: number
  origem: 'metodo' | 'personalizado'
  metodo_nivel_id: string | null
  created_at: string
}

export type FiltrosIndicadores = {
  ano_letivo_id?: string
  etapa_ensino_id?: string
  subetapa_id?: string
  campo_experiencia?: string
  disciplina_id?: string
}

// ------- Listagem com filtros -------

export async function getIndicadores(schoolId: string, filtros: FiltrosIndicadores) {
  let query = supabase
    .from('indicadores_avaliacao')
    .select('*, disciplina:disciplina_id(nome), bncc_objetivo:objetivo_bncc_id(codigo_bncc, descricao)')
    .eq('school_id', schoolId)
    .eq('ativo', true)

  if (filtros.ano_letivo_id) query = query.eq('ano_letivo_id', filtros.ano_letivo_id)
  if (filtros.etapa_ensino_id) query = query.eq('etapa_ensino_id', filtros.etapa_ensino_id)
  if (filtros.subetapa_id) query = query.eq('subetapa_id', filtros.subetapa_id)
  if (filtros.campo_experiencia) query = query.eq('campo_experiencia', filtros.campo_experiencia)
  if (filtros.disciplina_id) query = query.eq('disciplina_id', filtros.disciplina_id)

  const { data, error } = await query.order('created_at', { ascending: true })
  if (error) throw error
  return data as any[]
}

export async function getIndicador(id: string) {
  const { data, error } = await supabase
    .from('indicadores_avaliacao')
    .select('*, disciplina:disciplina_id(nome), bncc_objetivo:objetivo_bncc_id(codigo_bncc, descricao)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as any
}

// ------- CRUD Indicador -------

export async function createIndicador(data: {
  school_id: string
  ano_letivo_id: string
  etapa_ensino_id: string
  subetapa_id?: string | null
  campo_experiencia?: string | null
  disciplina_id?: string | null
  codigo?: string | null
  descricao: string
  periodos_ids?: string[]
  origem?: string
  objetivo_bncc_id?: string | null
}) {
  const { data: indicador, error } = await supabase
    .from('indicadores_avaliacao')
    .insert({
      school_id: data.school_id,
      ano_letivo_id: data.ano_letivo_id,
      etapa_ensino_id: data.etapa_ensino_id,
      subetapa_id: data.subetapa_id || null,
      campo_experiencia: data.campo_experiencia || null,
      disciplina_id: data.disciplina_id || null,
      codigo: data.codigo || null,
      descricao: data.descricao,
      periodos_ids: data.periodos_ids || [],
      origem: data.origem || 'manual',
      objetivo_bncc_id: data.objetivo_bncc_id || null,
    })
    .select()
    .single()

  if (error) throw error
  return indicador
}

export async function updateIndicador(id: string, data: {
  descricao?: string
  periodos_ids?: string[]
}) {
  const { error } = await supabase
    .from('indicadores_avaliacao')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

export async function deleteIndicador(id: string) {
  const { data: ind, error: errCheck } = await supabase
    .from('indicadores_avaliacao')
    .select('utilizado')
    .eq('id', id)
    .single()

  if (errCheck) throw errCheck
  if (ind?.utilizado) throw new Error('Este indicador já foi utilizado em avaliações e não pode ser removido.')

  const { error } = await supabase
    .from('indicadores_avaliacao')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
}

// ------- CRUD Níveis do Indicador -------

export async function getIndicadorNiveis(indicadorId: string) {
  const { data, error } = await supabase
    .from('indicadores_niveis')
    .select('*')
    .eq('indicador_id', indicadorId)
    .order('ordem', { ascending: true })

  if (error) throw error
  return data as IndicadorNivel[]
}

export async function salvarNiveisIndicador(
  indicadorId: string,
  niveis: {
    metodo_nivel_ids: string[]
    personalizados: { descricao: string; sigla?: string }[]
  }
) {
  // Buscar levels atuais
  const { data: atuais } = await supabase
    .from('indicadores_niveis')
    .select('id, metodo_nivel_id')
    .eq('indicador_id', indicadorId)

  const atuaisMap = new Map((atuais || []).map(n => [n.metodo_nivel_id, n.id]))

  // Remover níveis do método que foram desmarcados
  for (const a of atuais || []) {
    if (a.metodo_nivel_id && !niveis.metodo_nivel_ids.includes(a.metodo_nivel_id)) {
      await supabase.from('indicadores_niveis').delete().eq('id', a.id)
    }
  }

  // Buscar dados completos dos níveis do método para adicionar
  if (niveis.metodo_nivel_ids.length > 0) {
    const idsParaAdicionar = niveis.metodo_nivel_ids.filter(id => !atuaisMap.has(id))

    if (idsParaAdicionar.length > 0) {
      const { data: metodosNiveis } = await supabase
        .from('academico_metodos_niveis')
        .select('id, descricao, sigla, ordem')
        .in('id', idsParaAdicionar)

      if (metodosNiveis) {
        const inserts = metodosNiveis.map(mn => ({
          indicador_id: indicadorId,
          descricao: mn.descricao,
          sigla: mn.sigla,
          ordem: mn.ordem,
          origem: 'metodo' as const,
          metodo_nivel_id: mn.id,
        }))
        if (inserts.length > 0) {
          const { error } = await supabase.from('indicadores_niveis').insert(inserts)
          if (error) throw error
        }
      }
    }
  }

  // Adicionar níveis personalizados novos
  if (niveis.personalizados.length > 0) {
    const { data: existentes } = await supabase
      .from('indicadores_niveis')
      .select('descricao, origem')
      .eq('indicador_id', indicadorId)
      .eq('origem', 'personalizado')

    const descricoesExistentes = new Set((existentes || []).map(n => n.descricao.toLowerCase()))

    const novosPersonalizados = niveis.personalizados
      .filter(n => !descricoesExistentes.has(n.descricao.toLowerCase()))

    if (novosPersonalizados.length > 0) {
      const { data: maxOrdem } = await supabase
        .from('indicadores_niveis')
        .select('ordem')
        .eq('indicador_id', indicadorId)
        .order('ordem', { ascending: false })
        .limit(1)

      let ordem = (maxOrdem && maxOrdem[0]?.ordem != null ? maxOrdem[0].ordem : 0) + 1

      const inserts = novosPersonalizados.map(n => ({
        indicador_id: indicadorId,
        descricao: n.descricao,
        sigla: n.sigla || null,
        ordem: ordem++,
        origem: 'personalizado' as const,
        metodo_nivel_id: null,
      }))
      const { error } = await supabase.from('indicadores_niveis').insert(inserts)
      if (error) throw error
    }
  }
}

export async function deleteIndicadorNivel(id: string) {
  const { error } = await supabase
    .from('indicadores_niveis')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ------- Importação da Matriz (apenas Infantil) -------

export async function importarIndicadoresDaMatriz(
  schoolId: string,
  anoLetivoId: string,
  etapaEnsinoId: string
) {
  const { count, error: countError } = await supabase
    .from('indicadores_avaliacao')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ativo', true)

  if (countError) throw countError
  if (count && count > 0) throw new Error('Já existem indicadores cadastrados para esta combinação.')

  const { data: etapa } = await supabase
    .from('academico_etapas_ensino')
    .select('etapa_tipo')
    .eq('id', etapaEnsinoId)
    .single()

  if (!etapa) throw new Error('Etapa de ensino não encontrada')

  const isInfantil = etapa.etapa_tipo?.toLowerCase().includes('infantil')

  if (!isInfantil) {
    throw new Error('A importação automática está disponível apenas para Educação Infantil. Para Ensino Fundamental, Médio ou EJA, crie os indicadores manualmente.')
  }

  // Buscar matriz e dados auxiliares
  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('id, metodo_avaliacao_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ativa', true)
    .limit(1)
    .maybeSingle()

  if (!matriz) throw new Error('Nenhuma matriz curricular ativa encontrada para esta etapa.')

  const { data: periodos } = await supabase
    .from('academico_matriz_periodos')
    .select('id, periodo_ordem')
    .eq('matriz_id', matriz.id)
    .order('periodo_ordem')

  const periodoIds = (periodos || []).map(p => p.id)

  // Buscar objetivos BNCC para Infantil
  const { data: objetivos } = await supabase
    .from('bncc_objetivos')
    .select('*')
    .eq('tipo_ensino', 'infantil')
    .order('campo_experiencia')
    .order('codigo_bncc')

  if (!objetivos || objetivos.length === 0) {
    throw new Error('Nenhum objetivo BNCC encontrado para Educação Infantil. Verifique se os dados foram carregados.')
  }

  const indicadores = objetivos.map(obj => ({
    school_id: schoolId,
    ano_letivo_id: anoLetivoId,
    etapa_ensino_id: etapaEnsinoId,
    subetapa_id: null,
    campo_experiencia: obj.campo_experiencia,
    disciplina_id: null,
    codigo: obj.codigo_bncc,
    descricao: obj.descricao,
    periodos_ids: periodoIds,
    origem: 'matriz' as const,
    objetivo_bncc_id: obj.id,
  }))

  const { error } = await supabase.from('indicadores_avaliacao').insert(indicadores)
  if (error) throw error

  // Para cada indicador criado, copiar os níveis do método
  if (matriz.metodo_avaliacao_id) {
    const { data: niveis } = await supabase
      .from('academico_metodos_niveis')
      .select('id, descricao, sigla, ordem')
      .eq('metodo_id', matriz.metodo_avaliacao_id)
      .order('ordem')

    if (niveis && niveis.length > 0) {
      const { data: novosIndicadores } = await supabase
        .from('indicadores_avaliacao')
        .select('id')
        .eq('school_id', schoolId)
        .eq('ano_letivo_id', anoLetivoId)
        .eq('etapa_ensino_id', etapaEnsinoId)
        .eq('ativo', true)

      if (novosIndicadores) {
        const niveisInserts = novosIndicadores.flatMap(ind =>
          niveis.map(n => ({
            indicador_id: ind.id,
            descricao: n.descricao,
            sigla: n.sigla,
            ordem: n.ordem,
            origem: 'metodo' as const,
            metodo_nivel_id: n.id,
          }))
        )

        if (niveisInserts.length > 0) {
          await supabase.from('indicadores_niveis').insert(niveisInserts)
        }
      }
    }
  }

  return { total: indicadores.length, origem: 'matriz' }
}

// ------- Queries auxiliares -------

export async function getCamposExperiencia() {
  const { data, error } = await supabase
    .from('bncc_objetivos')
    .select('campo_experiencia')
    .order('campo_experiencia')

  if (error) throw error

  const campos = [...new Set((data || []).map(d => d.campo_experiencia))]
  return campos
}


export async function getPeriodosMatriz(schoolId: string, anoLetivoId: string, etapaEnsinoId: string) {
  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ativa', true)
    .limit(1)
    .maybeSingle()

  if (!matriz) return []

  const { data: periodos } = await supabase
    .from('academico_matriz_periodos')
    .select('id, periodo_nome, periodo_ordem')
    .eq('matriz_id', matriz.id)
    .order('periodo_ordem')

  return (periodos || []) as any[]
}

export async function getOpcoesRegistro(schoolId: string, anoLetivoId: string, etapaEnsinoId: string) {
  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ativa', true)
    .limit(1)
    .maybeSingle()

  if (!matriz) return []

  const { data: niveis } = await supabase
    .from('academico_metodos_niveis')
    .select('id, descricao, sigla, ordem')
    .eq('metodo_id', matriz.metodo_avaliacao_id)
    .order('ordem')

  return (niveis || []) as any[]
}

export async function getDisciplinasMatriz(schoolId: string, anoLetivoId: string, etapaEnsinoId: string) {
  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('etapa_ensino_id', etapaEnsinoId)
    .eq('ativa', true)
    .limit(1)
    .maybeSingle()

  if (!matriz) return []

  const { data: periodos } = await supabase
    .from('academico_matriz_periodos')
    .select('id')
    .eq('matriz_id', matriz.id)

  if (!periodos || periodos.length === 0) return []

  const periodoIds = periodos.map(p => p.id)

  const { data: disciplinas } = await supabase
    .from('academico_matriz_disciplinas')
    .select('disciplina_id, academico_disciplinas(nome)')
    .in('periodo_id', periodoIds)

  const seen = new Set<string>()
  const unicas = (disciplinas || []).filter(d => {
    if (seen.has(d.disciplina_id)) return false
    seen.add(d.disciplina_id)
    return true
  })

  return unicas as any[]
}
