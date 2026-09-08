'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { validarPermissaoDocumentos, montarEscola, type IdentidadeEscola } from './documentos'
import { montarMotivoBloqueio } from '@/lib/metodo-bloqueio'
import { calcularDesempenhoAluno } from './avaliacoes-numericas'

const supabase = getSupabaseAdmin()

// ─── Tipos ───

export type PeriodoBoletim = {
  ordem: number
  nome: string
  data_inicio: string | null
  data_termino: string | null
}

export type LinhaBoletim = {
  matriz_disciplina_id: string
  disciplina_nome: string
  nota_periodo: number | null
  frequencia_percentual: number | null
  total_faltas: number | null
}

export type DadosBoletim = {
  aluno: {
    nome_completo: string
    cpf: string | null
  }
  matricula: {
    id: string
    situacao: string
    data_matricula: string | null
    data_saida: string | null
    turma_id: string
    turma_nome: string
    turnos: string[]
    etapa_nome: string | null
    ano_letivo_descricao: string
  }
  escola: IdentidadeEscola
  periodo: PeriodoBoletim
  criterio_frequencia: 'por_dia' | 'por_aula'
  metodo_nome: string | null
  disciplinas: LinhaBoletim[]
  resultado_geral: {
    media_periodo: number | null
    frequencia_percentual: number | null
    total_faltas: number | null
  }
}

// ─── Helpers ───

export type MetodoBoletim = {
  metodoId: string | null
  nome: string | null
  tiposAvaliacao: Record<string, unknown> | null
  qtd: number
  criterio: 'por_dia' | 'por_aula'
  temNumerico: boolean
}

export async function resolverMetodoBoletim(turmaId: string): Promise<MetodoBoletim> {
  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  let metodoId: string | null = null
  if (turma) {
    const { data: matriz } = await supabase
      .from('academico_matrizes_curriculares')
      .select('metodo_avaliacao_id')
      .eq('school_id', turma.school_id)
      .eq('ano_letivo_id', turma.ano_letivo_id)
      .eq('etapa_ensino_id', turma.etapa_ensino_id)

    metodoId = matriz?.[0]?.metodo_avaliacao_id || null
  }

  let nome: string | null = null
  let tiposAvaliacao: Record<string, unknown> | null = null
  let qtd = 4
  let criterio: 'por_dia' | 'por_aula' = 'por_dia'

  if (metodoId) {
    const { data: metodo } = await supabase
      .from('academico_metodos_avaliacao')
      .select('nome, criterio_frequencia, quantidade_periodos_numerico, tipos_avaliacao')
      .eq('id', metodoId)
      .maybeSingle()

    if (metodo) {
      nome = metodo.nome || null
      qtd = Number(metodo.quantidade_periodos_numerico) || 4
      criterio = metodo.criterio_frequencia === 'por_aula' ? 'por_aula' : 'por_dia'
      tiposAvaliacao = metodo.tipos_avaliacao as Record<string, unknown> | null
    }
  }

  const flagNumerico = tiposAvaliacao?.numerico
  const temNumerico = flagNumerico === true || flagNumerico === 'true'

  return { metodoId, nome, tiposAvaliacao, qtd, criterio, temNumerico }
}

export async function listarPeriodosAvaliativos(
  anoLetivoId: string,
  turmaId: string,
  limite: number
): Promise<PeriodoBoletim[]> {
  const { data: turma } = await supabase
    .from('turmas')
    .select('etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()
  const etapaId = turma?.etapa_ensino_id || null

  let etapaCodigo: string | null = null
  if (etapaId) {
    const { data: etapa } = await supabase
      .from('academico_etapas_ensino')
      .select('etapa_codigo')
      .eq('id', etapaId)
      .maybeSingle()
    etapaCodigo = etapa ? String(etapa.etapa_codigo) : null
  }

  const { data: calendarios } = await supabase
    .from('academico_calendarios')
    .select('id')
    .eq('ano_letivo_id', anoLetivoId)

  const calendarioIds = (calendarios || []).map(c => c.id)
  if (!calendarioIds.length) return []

  const { data: eventos } = await supabase
    .from('academico_calendario_eventos')
    .select('descricao, data_inicio, data_termino, etapas')
    .in('calendario_id', calendarioIds)
    .eq('tipo', 'periodo_avaliativo')

  const aplicaveis = (eventos || [])
    .filter(ev => {
      const etapasEv = Array.isArray(ev.etapas) ? (ev.etapas as string[]) : []
      if (!etapasEv.length) return true
      if (etapaCodigo && etapasEv.includes(etapaCodigo)) return true
      if (etapaId && etapasEv.includes(etapaId)) return true
      return false
    })
    .sort((a, b) => String(a.data_inicio || '').localeCompare(String(b.data_inicio || '')))

  return aplicaveis.slice(0, limite).map((ev, i) => ({
    ordem: i + 1,
    nome: ev.descricao || `Período ${i + 1}`,
    data_inicio: String(ev.data_inicio || '') || null,
    data_termino: String(ev.data_termino || '') || null,
  }))
}

async function buscarPeriodoBoletim(
  anoLetivoId: string,
  turmaId: string,
  qtd: number,
  ordem: number
): Promise<PeriodoBoletim> {
  const periodos = await listarPeriodosAvaliativos(anoLetivoId, turmaId, qtd)
  const encontrado = periodos.find(p => p.ordem === ordem)
  if (encontrado) return encontrado
  return { ordem, nome: `Período ${ordem}`, data_inicio: null, data_termino: null }
}

type FrequenciaResultado = {
  frequencia_percentual: number | null
  total_faltas: number | null
  total_aulas: number
  presencas: number
}

export async function calcularFrequenciaBoletim(
  turmaId: string,
  alunoId: string,
  criterio: 'por_dia' | 'por_aula',
  dataMatricula: string | null,
  dataSaida: string | null,
  dataInicioPeriodo: string | null,
  dataTerminoPeriodo: string | null
): Promise<{
  porDisciplina: Map<string, FrequenciaResultado>
  geral: FrequenciaResultado
}> {
  const tabela = criterio === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'
  const dataCol = criterio === 'por_aula' ? 'data_aula' : 'dia_letivo'
  // Só as colunas usadas no cálculo (evita tráfego de linhas completas)
  const colunas: string =
    criterio === 'por_aula'
      ? 'status, horario_id, disciplina_id, data_aula'
      : 'status, dia_letivo'

  let horariosAtivos = new Set<string>()
  if (criterio === 'por_aula') {
    const { data: quadro } = await supabase
      .from('quadro_aulas')
      .select('id')
      .eq('turma_id', turmaId)
      .eq('ativo', true)
      .maybeSingle()
    if (quadro?.id) {
      const { data: horarios } = await supabase
        .from('quadro_aulas_horarios')
        .select('id')
        .eq('quadro_aula_id', quadro.id)
        .eq('ativo', true)
      horariosAtivos = new Set((horarios || []).map(h => h.id))
    }
  }

  let query = supabase
    .from(tabela)
    .select(colunas)
    .eq('turma_id', turmaId)
    .eq('aluno_id', alunoId)

  if (dataMatricula) query = query.gte(dataCol, dataMatricula)
  if (dataSaida) query = query.lte(dataCol, dataSaida)
  if (dataInicioPeriodo) query = query.gte(dataCol, dataInicioPeriodo)
  if (dataTerminoPeriodo) query = query.lte(dataCol, dataTerminoPeriodo)

  const { data: registrosRaw } = await query
  const registros = ((registrosRaw || []) as unknown) as Array<{
    status: string | null
    horario_id?: string | null
    disciplina_id?: string | null
  }>

  const porDisciplina = new Map<string, { presencas: number; faltas: number; total: number }>()
  const geral = { presencas: 0, faltas: 0, total: 0 }

  for (const r of registros) {
    if (!r.status) continue
    if (criterio === 'por_aula' && !horariosAtivos.has(r.horario_id as string)) continue
    const chave = criterio === 'por_aula' ? (r.disciplina_id || '') : ''
    const grupo = chave ? porDisciplina.get(chave) || { presencas: 0, faltas: 0, total: 0 } : geral
    grupo.total++
    if (r.status === 'P' || r.status === 'FJ') grupo.presencas++
    if (r.status === 'F' || r.status === 'FJ') grupo.faltas++
    if (chave) porDisciplina.set(chave, grupo)
  }

  const montar = (g: { presencas: number; faltas: number; total: number }): FrequenciaResultado => ({
    frequencia_percentual: g.total > 0 ? Math.round((g.presencas / g.total) * 100) : null,
    total_faltas: g.total > 0 ? g.faltas : null,
    total_aulas: g.total,
    presencas: g.presencas,
  })

  const resultadoPorDisciplina = new Map<string, FrequenciaResultado>()
  for (const [id, g] of porDisciplina) resultadoPorDisciplina.set(id, montar(g))

  return { porDisciplina: resultadoPorDisciplina, geral: montar(geral) }
}

// ─── Server actions ───

export async function getPeriodosBoletim(
  alunoId: string,
  anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<{ periodos: PeriodoBoletim[]; bloqueado: boolean; motivo: string | null }> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const { data: matricula } = await supabase
    .from('academico_matriculas')
    .select('turma:turma_id(id)')
    .eq('school_id', schoolId)
    .eq('aluno_id', alunoId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()

  const turmaId = (matricula?.turma as unknown as { id?: string } | null)?.id
  if (!turmaId) {
    return {
      periodos: [],
      bloqueado: true,
      motivo: 'Aluno ou matrícula não encontrados para o ano letivo selecionado.',
    }
  }

  const metodo = await resolverMetodoBoletim(turmaId)

  if (!metodo.metodoId) {
    return {
      periodos: [],
      bloqueado: true,
      motivo: 'Não há Método de Avaliação configurado para a turma do aluno no ano letivo selecionado.',
    }
  }

  if (!metodo.temNumerico) {
    return { periodos: [], bloqueado: true, motivo: montarMotivoBloqueio(metodo) }
  }

  let periodos = await listarPeriodosAvaliativos(anoLetivoId, turmaId, metodo.qtd)
  if (periodos.length === 0) {
    periodos = Array.from({ length: metodo.qtd }, (_, i) => ({
      ordem: i + 1,
      nome: `Período ${i + 1}`,
      data_inicio: null,
      data_termino: null,
    }))
  }

  return { periodos, bloqueado: false, motivo: null }
}

type RawMatriculaBoletim = {
  id: string
  situacao: string
  data_matricula: string | null
  data_saida: string | null
  turma: { id: string; nome: string; turnos: unknown[] | null } | null
  etapa: { etapa_nome: string } | null
  academico_anos_letivos: { descricao: string } | null
}

export async function getDadosBoletim(
  alunoId: string,
  anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null,
  periodoOrdem?: number
): Promise<DadosBoletim> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const ordem = periodoOrdem ?? 1

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo, cpf')
    .eq('id', alunoId)
    .maybeSingle()

  const { data: rawMatricula } = await supabase
    .from('academico_matriculas')
    .select(
      'id, situacao, data_matricula, data_saida, ' +
        'turma:turma_id(id, nome, turnos), ' +
        'etapa:etapa_ensino_id(etapa_nome), academico_anos_letivos(descricao)'
    )
    .eq('school_id', schoolId)
    .eq('aluno_id', alunoId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()

  const matricula = rawMatricula as unknown as RawMatriculaBoletim | null
  const turma = matricula?.turma ?? null

  if (!pessoa || !matricula || !turma) {
    throw new Error('Aluno ou matrícula não encontrados para o ano letivo selecionado.')
  }

  const metodo = await resolverMetodoBoletim(turma.id)
  if (!metodo.temNumerico) {
    throw new Error(montarMotivoBloqueio(metodo))
  }

  const periodo = await buscarPeriodoBoletim(anoLetivoId, turma.id, metodo.qtd, ordem)

  const { data: relacoes } = await supabase
    .from('turmas_disciplinas')
    .select(
      'matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))'
    )
    .eq('turma_id', turma.id)

  const mapaNomes = new Map<string, string>()
  for (const r of relacoes || []) {
    const md = r.academico_matriz_disciplinas as unknown as {
      disciplina_id: string
      academico_disciplinas: { nome: string } | null
    } | null
    if (!md) continue
    if (!mapaNomes.has(r.matriz_disciplina_id)) {
      mapaNomes.set(r.matriz_disciplina_id, md.academico_disciplinas?.nome || 'Disciplina')
    }
  }
  const disciplinas = Array.from(mapaNomes.entries())
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  const desempenhos = await Promise.all(
    disciplinas.map(d => calcularDesempenhoAluno(turma.id, alunoId, d.id, metodo.qtd))
  )
  const notaPorDisciplina = new Map<string, number | null>()
  for (let i = 0; i < disciplinas.length; i++) {
    const medias = desempenhos[i]?.medias_periodo || []
    const nota =
      ordem >= 1 && ordem <= medias.length ? medias[ordem - 1] ?? null : null
    notaPorDisciplina.set(disciplinas[i].id, nota)
  }

  const freq = await calcularFrequenciaBoletim(
    turma.id,
    alunoId,
    metodo.criterio,
    matricula.data_matricula,
    matricula.data_saida,
    periodo.data_inicio,
    periodo.data_termino
  )

  const linhas: LinhaBoletim[] = disciplinas.map(d => {
    const f = freq.porDisciplina.get(d.id)
    return {
      matriz_disciplina_id: d.id,
      disciplina_nome: d.nome,
      nota_periodo: notaPorDisciplina.get(d.id) ?? null,
      frequencia_percentual: metodo.criterio === 'por_aula' ? (f?.frequencia_percentual ?? null) : null,
      total_faltas: metodo.criterio === 'por_aula' ? (f?.total_faltas ?? null) : null,
    }
  })

  const notasValidas = linhas
    .map(l => l.nota_periodo)
    .filter((n): n is number => n !== null)
  const mediaPeriodo =
    notasValidas.length > 0
      ? Math.round((notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length) * 100) / 100
      : null

  const faltasValidas = linhas
    .map(l => l.total_faltas)
    .filter((n): n is number => n !== null)
  const totalFaltas =
    metodo.criterio === 'por_dia'
      ? freq.geral.total_faltas
      : faltasValidas.length > 0
        ? faltasValidas.reduce((a, b) => a + b, 0)
        : null

  const turnos = Array.isArray(turma.turnos)
    ? turma.turnos
        .map(t => (typeof t === 'string' ? t : (t as { turno?: string } | null)?.turno || ''))
        .filter(Boolean)
    : []

  const escola = await montarEscola(schoolId)

  return {
    aluno: {
      nome_completo: pessoa.nome_completo,
      cpf: pessoa.cpf || null,
    },
    matricula: {
      id: matricula.id,
      situacao: matricula.situacao,
      data_matricula: matricula.data_matricula || null,
      data_saida: matricula.data_saida || null,
      turma_id: turma.id,
      turma_nome: turma.nome || '—',
      turnos,
      etapa_nome: matricula.etapa?.etapa_nome || null,
      ano_letivo_descricao: matricula.academico_anos_letivos?.descricao || '',
    },
    escola,
    periodo,
    criterio_frequencia: metodo.criterio,
    metodo_nome: metodo.nome,
    disciplinas: linhas,
    resultado_geral: {
      media_periodo: mediaPeriodo,
      frequencia_percentual: metodo.criterio === 'por_dia' ? freq.geral.frequencia_percentual : null,
      total_faltas: totalFaltas,
    },
  }
}