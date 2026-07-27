import { supabase } from '@/lib/supabase'
import { getEtapasEnsino, getSubetapas, type EtapaEnsino, type Subetapa } from './etapas-ensino'

export type MatrizCurricular = {
  id: string
  school_id: string
  ano_letivo_id: string
  etapa_ensino_id: string
  subetapa_id: string | null
  metodo_avaliacao_id: string
  descricao: string
  data_inicial: string
  data_final: string
  turnos: string[]
  tipo_turma: string[]
  aulas_diarias_regular: number | null
  aulas_semanais_regular: number | null
  aulas_anuais_regular: number | null
  duracao_aula_regular: number | null
  aulas_diarias_integral: number | null
  aulas_semanais_integral: number | null
  aulas_anuais_integral: number | null
  duracao_aula_integral: number | null
  ativa: boolean
  created_at: string
  updated_at: string
  academico_etapas_ensino?: { etapa_nome: string; etapa_tipo: string } | null
  academico_metodos_avaliacao?: { nome: string } | null
}

export type PeriodoMatriz = {
  id: string
  matriz_id: string
  periodo_ordem: number
  periodo_nome: string
  created_at: string
}

export type DisciplinaMatriz = {
  id: string
  periodo_id: string
  disciplina_id: string
  desconsidera_reprovacao: boolean
  carga_horaria_regular_minutos: number | null
  carga_horaria_integral_minutos: number | null
  tipo_disciplina: 'base_comum' | 'parte_diversificada'
  created_at: string
}

export type MetodoAvaliacao = {
  id: string
  school_id: string
  nome: string
  descricao: string | null
  criterio_frequencia: 'por_dia' | 'por_aula'
  frecuencia_minima: number
  tipos_avaliacao: string[]
  quantidade_periodos_numerico: number | null
  quantidade_periodos_parecer: number | null
  quantidade_periodos_conceito: number | null
  quantidade_periodos_nivel: number | null
  ativo: boolean
}

export type Disciplina = {
  id: string
  school_id: string
  nome: string
  nome_abreviado: string | null
  componente: string
  tipo_ensino: string
  carga_horaria_padrao: number | null
  ativo: boolean
}

// ============================================
// Matrizes Curriculares
// ============================================

export async function getMatrizes(schoolId: string | null, anoLetivoId?: string, etapaId?: string) {
  let query = supabase
    .from('academico_matrizes_curriculares')
    .select('*, academico_etapas_ensino(etapa_nome, etapa_tipo), academico_metodos_avaliacao(nome)')

  if (schoolId) query = query.eq('school_id', schoolId)

  if (anoLetivoId) {
    query = query.eq('ano_letivo_id', anoLetivoId)
  }

  if (etapaId) {
    query = query.eq('etapa_ensino_id', etapaId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as any[]
}

export async function getMatriz(id: string) {
  const { data, error } = await supabase
    .from('academico_matrizes_curriculares')
    .select('*, academico_etapas_ensino(etapa_nome, etapa_tipo), academico_metodos_avaliacao(nome)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as MatrizCurricular
}

export async function createMatriz(matriz: Partial<MatrizCurricular>) {
  const { data, error } = await supabase
    .from('academico_matrizes_curriculares')
    .insert(matriz)
    .select()
    .single()

  if (error) throw error
  return data as MatrizCurricular
}

export async function updateMatriz(id: string, matriz: Partial<MatrizCurricular>) {
  const { data, error } = await supabase
    .from('academico_matrizes_curriculares')
    .update(matriz)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as MatrizCurricular
}

export async function deleteMatriz(id: string) {
  const { error } = await supabase
    .from('academico_matrizes_curriculares')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleMatrizAtiva(id: string, ativa: boolean) {
  const { data, error } = await supabase
    .from('academico_matrizes_curriculares')
    .update({ ativa })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as MatrizCurricular
}

// ============================================
// Métodos de Avaliação
// ============================================

export async function getMetodosAvaliacao(schoolId: string | null) {
  let query = supabase
    .from('academico_metodos_avaliacao')
    .select('*')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query.order('nome')

  if (error) throw error
  return data as MetodoAvaliacao[]
}

// ============================================
// Disciplinas
// ============================================

export async function getDisciplinas(schoolId: string | null, tipoEnsino?: string) {
  let query = supabase
    .from('academico_disciplinas')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  if (tipoEnsino && tipoEnsino !== 'todos') {
    query = query.or(`tipo_ensino.eq.${tipoEnsino},tipo_ensino.eq.todos`)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Disciplina[]
}

// ============================================
// Períodos da Matriz
// ============================================

export async function getPeriodos(matrizId: string) {
  const { data, error } = await supabase
    .from('academico_matriz_periodos')
    .select('*')
    .eq('matriz_id', matrizId)
    .order('periodo_ordem')

  if (error) throw error
  return data as PeriodoMatriz[]
}

export async function createPeriodos(matrizId: string, quantidade: number, nomes: string[]) {
  const periodos = Array.from({ length: quantidade }, (_, i) => ({
    matriz_id: matrizId,
    periodo_ordem: i + 1,
    periodo_nome: nomes[i] || `${i + 1}º Período`
  }))

  const { data, error } = await supabase
    .from('academico_matriz_periodos')
    .insert(periodos)
    .select()

  if (error) throw error
  return data as PeriodoMatriz[]
}

// ============================================
// Disciplinas da Matriz
// ============================================

export async function getDisciplinasPorPeriodo(periodoId: string) {
  const { data, error } = await supabase
    .from('academico_matriz_disciplinas')
    .select('*, academico_disciplinas(nome, nome_abreviado, componente)')
    .eq('periodo_id', periodoId)
    .order('created_at')

  if (error) throw error
  return data as any[]
}

export async function createDisciplinaMatriz(disciplina: Partial<DisciplinaMatriz>) {
  const { data, error } = await supabase
    .from('academico_matriz_disciplinas')
    .insert(disciplina)
    .select()
    .single()

  if (error) throw error
  return data as DisciplinaMatriz
}

export async function deleteDisciplinaMatriz(id: string) {
  // Remove habilidades vinculadas
  await supabase.from('academico_matriz_habilidades_bncc').delete().eq('matriz_disciplina_id', id)
  await supabase.from('academico_matriz_habilidades_manuais').delete().eq('matriz_disciplina_id', id)
  // Remove a disciplina
  const { error } = await supabase
    .from('academico_matriz_disciplinas')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateDisciplinaMatriz(id: string, data: Partial<DisciplinaMatriz>) {
  const { error } = await supabase
    .from('academico_matriz_disciplinas')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

export async function substituirHabilidades(
  disciplinaId: string,
  bnccCodigos: string[],
  manuais: { codigo: string; descricao: string }[]
) {
  await Promise.all([
    supabase.from('academico_matriz_habilidades_bncc').delete().eq('matriz_disciplina_id', disciplinaId),
    supabase.from('academico_matriz_habilidades_manuais').delete().eq('matriz_disciplina_id', disciplinaId),
  ])

  const { error: err1 } = await supabase
    .from('academico_matriz_habilidades_bncc')
    .insert(bnccCodigos.map(c => ({ matriz_disciplina_id: disciplinaId, habilidade_codigo: c })))

  if (err1) throw err1

  if (manuais.length > 0) {
    const { error: err2 } = await supabase
      .from('academico_matriz_habilidades_manuais')
      .insert(manuais.map(h => ({ matriz_disciplina_id: disciplinaId, codigo: h.codigo, descricao: h.descricao })))

    if (err2) throw err2
  }
}

// ============================================
// Habilidades BNCC
// ============================================

export async function getHabilidadesBNCC(disciplinaId: string) {
  const { data, error } = await supabase
    .from('academico_matriz_habilidades_bncc')
    .select('*')
    .eq('matriz_disciplina_id', disciplinaId)

  if (error) throw error
  return data as any[]
}

export async function addHabilidadeBNCC(disciplinaId: string, habilidadeCodigo: string) {
  const { data, error } = await supabase
    .from('academico_matriz_habilidades_bncc')
    .insert({ matriz_disciplina_id: disciplinaId, habilidade_codigo: habilidadeCodigo })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeHabilidadeBNCC(id: string) {
  const { error } = await supabase
    .from('academico_matriz_habilidades_bncc')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Habilidades Manuais
// ============================================

export async function getHabilidadesManuais(disciplinaId: string) {
  const { data, error } = await supabase
    .from('academico_matriz_habilidades_manuais')
    .select('*')
    .eq('matriz_disciplina_id', disciplinaId)
    .order('created_at')

  if (error) throw error
  return data as any[]
}

export async function addHabilidadeManual(disciplinaId: string, codigo: string, descricao: string) {
  const { data, error } = await supabase
    .from('academico_matriz_habilidades_manuais')
    .insert({ matriz_disciplina_id: disciplinaId, codigo, descricao })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeHabilidadeManual(id: string) {
  const { error } = await supabase
    .from('academico_matriz_habilidades_manuais')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Replicar disciplinas para outros períodos
// ============================================

export async function replicarDisciplinas(
  matrizId: string, 
  periodoOrigemId: string, 
  periodoDestinoIds: string[]
) {
  // Buscar disciplinas do período de origem
  const { data: disciplinasOrigem, error: errorBusca } = await supabase
    .from('academico_matriz_disciplinas')
    .select('*')
    .eq('periodo_id', periodoOrigemId)

  if (errorBusca) throw errorBusca
  if (!disciplinasOrigem?.length) return true

  // Para cada período destino, remover disciplinas existentes e inserir as novas
  for (const periodoDestinoId of periodoDestinoIds) {
    // Remove disciplinas existentes no período destino
    const { data: existentes } = await supabase
      .from('academico_matriz_disciplinas')
      .select('id')
      .eq('periodo_id', periodoDestinoId)

    if (existentes?.length) {
      const ids = existentes.map(d => d.id)
      await supabase.from('academico_matriz_habilidades_bncc').delete().in('matriz_disciplina_id', ids)
      await supabase.from('academico_matriz_habilidades_manuais').delete().in('matriz_disciplina_id', ids)
      await supabase.from('academico_matriz_disciplinas').delete().in('id', ids)
    }

    // Inserir novas disciplinas
    const novasDisciplinas = disciplinasOrigem.map(d => ({
      periodo_id: periodoDestinoId,
      disciplina_id: d.disciplina_id,
      desconsidera_reprovacao: d.desconsidera_reprovacao,
      carga_horaria_regular_minutos: d.carga_horaria_regular_minutos,
      carga_horaria_integral_minutos: d.carga_horaria_integral_minutos,
      tipo_disciplina: d.tipo_disciplina
    }))

    const { data: inseridas, error: errorInsert } = await supabase
      .from('academico_matriz_disciplinas')
      .insert(novasDisciplinas)
      .select()

    if (errorInsert) throw errorInsert

    // Copiar habilidades vinculadas (BNCC e manuais)
    for (let i = 0; i < disciplinasOrigem.length; i++) {
      const origem = disciplinasOrigem[i]
      const destino = inseridas?.[i]
      if (!destino) continue

      const { data: bnccs } = await supabase
        .from('academico_matriz_habilidades_bncc')
        .select('habilidade_codigo')
        .eq('matriz_disciplina_id', origem.id)

      if (bnccs?.length) {
        await supabase.from('academico_matriz_habilidades_bncc').insert(
          bnccs.map(h => ({ matriz_disciplina_id: destino.id, habilidade_codigo: h.habilidade_codigo }))
        )
      }

      const { data: manuais } = await supabase
        .from('academico_matriz_habilidades_manuais')
        .select('codigo, descricao')
        .eq('matriz_disciplina_id', origem.id)

      if (manuais?.length) {
        await supabase.from('academico_matriz_habilidades_manuais').insert(
          manuais.map(h => ({ matriz_disciplina_id: destino.id, codigo: h.codigo, descricao: h.descricao }))
        )
      }
    }
  }

  return true
}

// ============================================
// Buscar habilidades BNCC do sistema
// ============================================

export async function getHabilidadesBNCCSistema(tipoEnsino?: string, componente?: string) {
  let query = supabase
    .from('bncc_objetivos')
    .select('codigo_bncc, descricao, tipo_ensino, campo_experiencia')
    .order('codigo_bncc')

  if (tipoEnsino) {
    query = query.eq('tipo_ensino', tipoEnsino)
  }

  if (componente) {
    query = query.like('campo_experiencia', `%${componente}%`)
  }

  const { data, error } = await query.limit(100)

  if (error) throw error
  return data as any[]
}

// ============================================
// Buscar habilidades BNCC por disciplina + etapa
// ============================================

export async function getHabilidadesBNCCPorDisciplinaEtapa(disciplinaNome: string, etapaEnsino: string) {
  // Mapear etapa_tipo do sistema para os valores usados nas tabelas BNCC
  const etapaDB = etapaEnsino === 'fundamental_inicial' ? 'anos_iniciais'
    : etapaEnsino === 'fundamental_final' ? 'anos_finais'
    : etapaEnsino === 'infantil' ? 'infantil'
    : etapaEnsino === 'medio' ? 'medio'
    : etapaEnsino

  // Infantil: dados estão na tabela bncc_objetivos (estrutura plana)
  if (etapaDB === 'infantil') {
    let queryInf = supabase
      .from('bncc_objetivos')
      .select('codigo_bncc, descricao, campo_experiencia, faixa_etaria')
      .eq('tipo_ensino', 'infantil')
      .order('codigo_bncc')

    if (disciplinaNome) {
      queryInf = queryInf.like('campo_experiencia', `%${disciplinaNome}%`)
    }

    const { data, error } = await queryInf.limit(200)
    if (error) throw error

    return ((data as any[]) || []).map(h => ({
      codigo_bncc: h.codigo_bncc,
      descricao: h.descricao,
      unidade_tematica: h.campo_experiencia,
      objeto_conhecimento: h.faixa_etaria,
    }))
  }

  // Medio: dados estão na tabela bncc_habilidades_medio (estrutura diferente)
  if (etapaDB === 'medio') {
    const { data, error } = await supabase
      .from('bncc_habilidades_medio')
      .select(`
        codigo, descricao, componente,
        area:area_id(nome)
      `)
      .order('codigo')
      .limit(200)

    if (error) throw error

    const seen = new Set<string>()
    return ((data as any[]) || []).filter((h: any) => {
      if (seen.has(h.codigo)) return false
      seen.add(h.codigo)
      return true
    }).map((h: any) => ({
      codigo_bncc: h.codigo,
      descricao: h.descricao,
      unidade_tematica: h.area?.nome || h.componente || '',
      objeto_conhecimento: '',
    }))
  }

  // Fundamental: dados em bncc_habilidades via inner joins
  let query = supabase
    .from('bncc_habilidades')
    .select(`
      id, codigo_bncc, descricao, anos,
      objeto_conhecimento:bncc_objetos_conhecimento!inner(
        id, objeto_conhecimento,
        unidade_tematica:bncc_unidades_tematicas!inner(
          id, unidade_tematica, disciplina
        )
      )
    `)
    .eq('objeto_conhecimento.unidade_tematica.etapa_ensino', etapaDB)

  if (disciplinaNome) {
    query = query.eq('objeto_conhecimento.unidade_tematica.disciplina', disciplinaNome)
  }

  const { data, error } = await query.limit(200)

  if (error) throw error

  // Se não encontrou por nome exato, tenta buscar sem o filtro de disciplina
  let results = (data as any[]) || []
  if (results.length === 0 && disciplinaNome) {
    const { data: fallbackData, error: fbError } = await supabase
      .from('bncc_habilidades')
      .select(`
        id, codigo_bncc, descricao, anos,
        objeto_conhecimento:bncc_objetos_conhecimento!inner(
          id, objeto_conhecimento,
          unidade_tematica:bncc_unidades_tematicas!inner(
            id, unidade_tematica, disciplina
          )
        )
      `)
      .eq('objeto_conhecimento.unidade_tematica.etapa_ensino', etapaDB)
      .limit(200)
    if (!fbError && fallbackData) {
      // Filtrar client-side por nome de disciplina (case-insensitive)
      const discLower = disciplinaNome.toLowerCase()
      results = (fallbackData as any[]).filter((h: any) => {
        const d = h.objeto_conhecimento?.unidade_tematica?.disciplina || ''
        return d.toLowerCase() === discLower
      })
    }
  }

  const seen = new Set<string>()
  const deduped = results.filter((h: any) => {
    if (seen.has(h.codigo_bncc)) return false
    seen.add(h.codigo_bncc)
    return true
  })

  return deduped
}
