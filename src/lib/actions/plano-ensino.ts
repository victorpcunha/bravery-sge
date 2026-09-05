'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

const MODULO_PLANO = 'Plano de Ensino'

async function registrarPlano(
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
    modulo: MODULO_PLANO,
    entidade,
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

async function nomeTurmaPlano(turmaId: string): Promise<string | null> {
  const { data } = await supabase.from('turmas').select('nome').eq('id', turmaId).maybeSingle()
  return data?.nome || null
}

async function contextoPlanoAula(planoEnsinoId: string): Promise<{ school_id?: string; turma_id?: string; nome?: string | null }> {
  const { data } = await supabase
    .from('planos_ensino')
    .select('school_id, turma_id')
    .eq('id', planoEnsinoId)
    .maybeSingle()
  if (!data) return {}
  const nomeTurma = await nomeTurmaPlano(data.turma_id)
  return { school_id: data.school_id, turma_id: data.turma_id, nome: nomeTurma || null }
}

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

export type PlanoEnsinoDisciplina = {
  matriz_disciplina_id: string
  disciplina_id: string
  nome: string
  nome_abreviado: string
}

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
  disciplinas?: PlanoEnsinoDisciplina[]
  professores?: { matriz_disciplina_id: string; nome: string }[]
  periodos?: number[]
  aulas_quadro?: number
  horas_quadro?: number
  ultima_atualizacao?: string | null
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
  updated_at?: string | null
}

export type BnccFieldItem = {
  tipo: string
  id: string
  [key: string]: any
}

export type ListarPlanosEnsinoOptions = {
  anoLetivoId?: string
  turmaId?: string
  matrizDisciplinaId?: string
  periodos?: number[]
}

// ─── Helpers de datas / Quadro de Aulas ───

type QuadroTurma = {
  quadro: { id: string; data_inicial: string; data_final: string } | null
  horarios: {
    id: string
    dia_semana: number
    horario_inicial: string
    horario_final: string
    disciplina_id: string
  }[]
}

function isoToDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function maxIso(a?: string | null, b?: string | null) {
  if (!a) return b || ''
  if (!b) return a
  return a > b ? a : b
}

function minIso(a?: string | null, b?: string | null) {
  if (!a) return b || ''
  if (!b) return a
  return a < b ? a : b
}

function minutosDoHorario(inicio: string, fim: string) {
  const [hi, mi] = (inicio || '').split(':').map(Number)
  const [hf, mf] = (fim || '').split(':').map(Number)
  if (Number.isNaN(hi) || Number.isNaN(hf)) return 50
  return (hf * 60 + (mf || 0)) - (hi * 60 + (mi || 0))
}

async function carregarQuadroDaTurma(turmaId: string): Promise<QuadroTurma> {
  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id, data_inicial, data_final')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!quadro) return { quadro: null, horarios: [] }

  const { data: horarios } = await supabase
    .from('quadro_aulas_horarios')
    .select('id, dia_semana, horario_inicial, horario_final, disciplina_id')
    .eq('quadro_aula_id', quadro.id)
    .eq('ativo', true)

  return {
    quadro: { id: quadro.id, data_inicial: quadro.data_inicial, data_final: quadro.data_final },
    horarios: horarios || [],
  }
}

function contarAulasNoIntervalo(
  quadro: { data_inicial: string; data_final: string },
  horarios: QuadroTurma['horarios'],
  matrizIds: string[],
  dataInicio?: string | null,
  dataFim?: string | null
) {
  if (!matrizIds.length || !dataInicio || !dataFim) {
    return { totalAulas: 0, totalMinutos: 0 }
  }

  const inicio = maxIso(dataInicio, quadro.data_inicial)
  const fim = minIso(dataFim, quadro.data_final)
  if (!inicio || !fim || inicio > fim) return { totalAulas: 0, totalMinutos: 0 }

  const horariosDisc = horarios.filter(h => matrizIds.includes(h.disciplina_id))
  if (!horariosDisc.length) return { totalAulas: 0, totalMinutos: 0 }

  const primeiro = isoToDate(inicio)
  const ultimo = isoToDate(fim)
  let totalAulas = 0
  let totalMinutos = 0

  for (const h of horariosDisc) {
    for (let d = new Date(primeiro); d <= ultimo; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== h.dia_semana) continue
      totalAulas++
      totalMinutos += minutosDoHorario(h.horario_inicial, h.horario_final)
    }
  }

  return { totalAulas, totalMinutos }
}

// ─── FASE 1: Listagem ───

export async function listarPlanosEnsino(
  schoolId: string | null,
  pessoaId: string | null,
  opts?: ListarPlanosEnsinoOptions
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
      is_interdisciplinar, created_at, updated_at,
      turmas!inner(nome),
      academico_etapas_ensino!inner(etapa_nome, etapa_tipo)
    `)

  if (schoolId) query = query.eq('school_id', schoolId)

  if (opts?.anoLetivoId) {
    query = query.eq('ano_letivo_id', opts.anoLetivoId)
  }
  if (opts?.turmaId) {
    query = query.eq('turma_id', opts.turmaId)
  }

  if (opts?.matrizDisciplinaId) {
    const { data: planosDaDisc } = await supabase
      .from('planos_ensino_disciplinas')
      .select('plano_ensino_id')
      .eq('matriz_disciplina_id', opts.matrizDisciplinaId)

    const planoIds = planosDaDisc?.map(p => p.plano_ensino_id) || []
    if (planoIds.length === 0) return []
    query = query.in('id', planoIds)
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
  if (!data || data.length === 0) return []

  const planoIds = (data as any[]).map(p => p.id)

  // Disciplinas vinculadas (batch)
  const { data: planosDisc } = await supabase
    .from('planos_ensino_disciplinas')
    .select('plano_ensino_id, matriz_disciplina_id')
    .in('plano_ensino_id', planoIds)

  const matrizIds = [...new Set((planosDisc || []).map(d => d.matriz_disciplina_id))]

  const matrizMap = new Map<string, string>() // matriz id → disciplina id
  if (matrizIds.length > 0) {
    const { data: matrizes } = await supabase
      .from('academico_matriz_disciplinas')
      .select('id, disciplina_id')
      .in('id', matrizIds)

    for (const m of matrizes || []) matrizMap.set(m.id, m.disciplina_id)
  }

  const discIds = [...new Set([...matrizMap.values()].filter(Boolean))]
  const discMap = new Map<string, { id: string; nome: string; nome_abreviado: string }>()
  if (discIds.length > 0) {
    const { data: disciplinas } = await supabase
      .from('academico_disciplinas')
      .select('id, nome, nome_abreviado')
      .in('id', discIds)

    for (const d of disciplinas || []) discMap.set(d.id, d)
  }

  // Planos de aula (batch)
  const { data: planosAula } = await supabase
    .from('planos_aula')
    .select('plano_ensino_id, periodos, data_inicio, data_fim, updated_at')
    .in('plano_ensino_id', planoIds)

  const aulasPorPlano = new Map<string, PlanoAula[]>()
  for (const pa of planosAula || []) {
    const list = aulasPorPlano.get(pa.plano_ensino_id) || []
    list.push(pa as PlanoAula)
    aulasPorPlano.set(pa.plano_ensino_id, list)
  }

  // Filtro por períodos (client-side)
  const periodosFiltro = opts?.periodos?.filter(Boolean) || []
  let planosFiltrados = data as any[]
  if (periodosFiltro.length > 0) {
    planosFiltrados = planosFiltrados.filter(p => {
      const aulas = aulasPorPlano.get(p.id) || []
      return aulas.some(pa => (pa.periodos || []).some(per => periodosFiltro.includes(per)))
    })
  }

  const turmaIds = [...new Set(planosFiltrados.map(p => p.turma_id))]

  // Professores por turma (turmas_profissionais)
  const profPorTurma = new Map<string, Map<string, string[]>>()
  if (turmaIds.length > 0) {
    const { data: vinculos } = await supabase
      .from('turmas_profissionais')
      .select('turma_id, person_id, disciplinas_ids, people(nome_completo)')
      .in('turma_id', turmaIds)
      .eq('ativo', true)

    for (const v of vinculos || []) {
      const nome = (v.people as any)?.nome_completo || ''
      for (const matrizId of (v.disciplinas_ids || []) as string[]) {
        let inner = profPorTurma.get(v.turma_id)
        if (!inner) {
          inner = new Map()
          profPorTurma.set(v.turma_id, inner)
        }
        const nomes = inner.get(matrizId) || []
        if (nome) nomes.push(nome)
        inner.set(matrizId, nomes)
      }
    }
  }

  // Quadro de Aulas por turma (batch)
  const quadroPorTurma = new Map<string, QuadroTurma>()
  if (turmaIds.length > 0) {
    const { data: quadros } = await supabase
      .from('quadro_aulas')
      .select('id, turma_id, data_inicial, data_final')
      .in('turma_id', turmaIds)
      .eq('ativo', true)

    if (quadros?.length) {
      const quadroIds = quadros.map(q => q.id)
      const { data: horarios } = await supabase
        .from('quadro_aulas_horarios')
        .select('id, quadro_aula_id, dia_semana, horario_inicial, horario_final, disciplina_id')
        .in('quadro_aula_id', quadroIds)
        .eq('ativo', true)

      for (const q of quadros) {
        quadroPorTurma.set(q.turma_id, {
          quadro: { id: q.id, data_inicial: q.data_inicial, data_final: q.data_final },
          horarios: (horarios || []).filter(h => h.quadro_aula_id === q.id),
        })
      }
    }
  }

  const planos = planosFiltrados.map((p: any) => {
    const discRows = (planosDisc || []).filter(d => d.plano_ensino_id === p.id)
    const disciplinas: PlanoEnsinoDisciplina[] = discRows.map(dr => {
      const discId = matrizMap.get(dr.matriz_disciplina_id)
      const disc = discId ? discMap.get(discId) : undefined
      return {
        matriz_disciplina_id: dr.matriz_disciplina_id,
        disciplina_id: discId || '',
        nome: disc?.nome || '',
        nome_abreviado: disc?.nome_abreviado || '',
      }
    })

    const aulasDoPlano = aulasPorPlano.get(p.id) || []
    const periodosSet = new Set<number>()
    for (const pa of aulasDoPlano) for (const per of pa.periodos || []) periodosSet.add(per)

    let ultima = p.updated_at || p.created_at
    for (const pa of aulasDoPlano) {
      if (pa.updated_at && pa.updated_at > ultima) ultima = pa.updated_at
    }

    let aulasQuadro = 0
    let minutosQuadro = 0
    const qd = quadroPorTurma.get(p.turma_id)
    const matrizDoPlano = disciplinas.map(d => d.matriz_disciplina_id)
    if (qd?.quadro && matrizDoPlano.length) {
      for (const pa of aulasDoPlano) {
        if (!pa.data_inicio || !pa.data_fim) continue
        const c = contarAulasNoIntervalo(qd.quadro, qd.horarios, matrizDoPlano, pa.data_inicio, pa.data_fim)
        aulasQuadro += c.totalAulas
        minutosQuadro += c.totalMinutos
      }
    }

    const profs = profPorTurma.get(p.turma_id)
    const professores: { matriz_disciplina_id: string; nome: string }[] = []
    if (profs) {
      for (const d of disciplinas) {
        for (const nome of profs.get(d.matriz_disciplina_id) || []) {
          professores.push({ matriz_disciplina_id: d.matriz_disciplina_id, nome })
        }
      }
    }

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
      professores,
      periodos: [...periodosSet].sort((a, b) => a - b),
      aulas_quadro: aulasQuadro,
      horas_quadro: minutosQuadro,
      ultima_atualizacao: ultima || null,
      created_at: p.created_at,
    }
  })

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

  const nomeTurma = await nomeTurmaPlano(data.turma_id)
  await registrarPlano('criar', 'planos_ensino', plano.id, pessoaId, data.school_id, nomeTurma || null, null, plano)
  return plano
}

export async function excluirPlanoEnsino(id: string, pessoaId?: string | null) {
  await validarPermWrite(RESOURCE, pessoaId)

  const { data: anterior } = await supabase
    .from('planos_ensino')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('planos_ensino')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    const nomeTurma = anterior.turma_id ? await nomeTurmaPlano(anterior.turma_id) : null
    await registrarPlano('excluir', 'planos_ensino', id, pessoaId, anterior.school_id, nomeTurma || null, anterior, null)
  }
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

export type PlanoAulaQuadro = PlanoAula & {
  aulas_quadro?: number | null
  horas_quadro?: number | null
}

export async function listarPlanoAulaComQuadro(
  planoEnsinoId: string,
  turmaId: string,
  matrizDisciplinaIds: string[],
  periodo?: number,
  pessoaId?: string | null
): Promise<PlanoAulaQuadro[]> {
  await validarPermRead(RESOURCE, pessoaId)

  const aulas = await listarPlanoAula(planoEnsinoId, periodo)
  const ids = (matrizDisciplinaIds || []).filter(Boolean)
  if (!ids.length) return aulas.map(pa => ({ ...pa, aulas_quadro: null, horas_quadro: null }))

  const { quadro, horarios } = await carregarQuadroDaTurma(turmaId)

  return aulas.map(pa => {
    if (!quadro || !pa.data_inicio || !pa.data_fim) {
      return { ...pa, aulas_quadro: null, horas_quadro: null }
    }
    const c = contarAulasNoIntervalo(quadro, horarios, ids, pa.data_inicio, pa.data_fim)
    return { ...pa, aulas_quadro: c.totalAulas, horas_quadro: c.totalMinutos }
  })
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

  const ctx = await contextoPlanoAula(data.plano_ensino_id)
  await registrarPlano('criar', 'planos_aula', aula.id, pessoaId, ctx.school_id, ctx.nome || null, null, aula)
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

  const { data: anterior } = await supabase
    .from('planos_aula')
    .select('*')
    .eq('id', id)
    .maybeSingle()

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

  const { data: final } = await supabase
    .from('planos_aula')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const ctx = final?.plano_ensino_id ? await contextoPlanoAula(final.plano_ensino_id) : {}
  await registrarPlano('editar', 'planos_aula', id, pessoaId, ctx.school_id, ctx.nome || null, anterior, final)
}

export async function excluirPlanoAula(id: string, pessoaId?: string | null) {
  await validarPermWrite(RESOURCE, pessoaId)

  const { data: anterior } = await supabase
    .from('planos_aula')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('planos_aula')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    const ctx = anterior.plano_ensino_id ? await contextoPlanoAula(anterior.plano_ensino_id) : {}
    await registrarPlano('excluir', 'planos_aula', id, pessoaId, ctx.school_id, ctx.nome || null, anterior, null)
  }
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

// ─── Cômputo de aulas do Quadro de Aulas ───

export type AulasQuadroDisciplina = {
  matriz_disciplina_id: string
  total_aulas: number
  total_minutos: number
}

export async function calcularAulasDoQuadro(
  turmaId: string,
  matrizDisciplinaIds: string[],
  dataInicio: string,
  dataFim: string,
  pessoaId?: string | null
): Promise<{ porDisciplina: AulasQuadroDisciplina[]; total_aulas: number; total_minutos: number }> {
  await validarPermRead(RESOURCE, pessoaId)

  const ids = (matrizDisciplinaIds || []).filter(Boolean)
  if (!ids.length || !dataInicio || !dataFim) {
    return { porDisciplina: [], total_aulas: 0, total_minutos: 0 }
  }

  const { quadro, horarios } = await carregarQuadroDaTurma(turmaId)
  if (!quadro) return { porDisciplina: [], total_aulas: 0, total_minutos: 0 }

  const porDisciplina: AulasQuadroDisciplina[] = []
  let totalAulas = 0
  let totalMinutos = 0

  for (const matrizId of ids) {
    const c = contarAulasNoIntervalo(quadro, horarios, [matrizId], dataInicio, dataFim)
    porDisciplina.push({
      matriz_disciplina_id: matrizId,
      total_aulas: c.totalAulas,
      total_minutos: c.totalMinutos,
    })
    totalAulas += c.totalAulas
    totalMinutos += c.totalMinutos
  }

  return { porDisciplina, total_aulas: totalAulas, total_minutos: totalMinutos }
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

function normalizarDisciplina(nome: string): string {
  return (nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

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

    const baseQuery = () =>
      supabase
        .from('bncc_unidades_tematicas')
        .select('id, unidade_tematica, disciplina, etapa_ensino')
        .order('unidade_tematica')

    let unidades: BnccUnidadeTematica[] = []

    if (disciplinaNome) {
      const queryExata = baseQuery().eq('disciplina', disciplinaNome)
      if (etapaEnsinoDB) queryExata.eq('etapa_ensino', etapaEnsinoDB)
      const { data: exatos } = await queryExata
      unidades = (exatos as BnccUnidadeTematica[]) || []
    }

    if (unidades.length === 0) {
      const queryTodas = baseQuery()
      if (etapaEnsinoDB) queryTodas.eq('etapa_ensino', etapaEnsinoDB)
      const { data: todas } = await queryTodas
      const todasLinhas = (todas as BnccUnidadeTematica[]) || []
      if (disciplinaNome) {
        const alvo = normalizarDisciplina(disciplinaNome)
        unidades = todasLinhas.filter(u => normalizarDisciplina(u.disciplina).includes(alvo))
        if (unidades.length === 0) {
          unidades = todasLinhas.filter(u => alvo.includes(normalizarDisciplina(u.disciplina)))
        }
      } else {
        unidades = todasLinhas
      }
    }

    const { data: objetos } = await supabase
      .from('bncc_objetos_conhecimento')
      .select('id, objeto_conhecimento, unidade_tematica_id')
      .order('objeto_conhecimento')

    const { data: habilidades } = await supabase
      .from('bncc_habilidades')
      .select('id, codigo_bncc, descricao, anos, objeto_conhecimento_id')
      .order('codigo_bncc')

    resultado.unidades_tematicas = unidades
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
