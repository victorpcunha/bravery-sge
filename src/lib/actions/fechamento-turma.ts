'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { getNumericoConfigCompleta, type ConfigNumericaCompleta } from './avaliacoes-numericas'
import { SITUACOES_RESULTADO_FINAL, SITUACOES_SAIDA, ETAPAS_FINAIS_INEP } from '@/lib/situacoes-matricula'
import { registrarAuditoriaAgregada } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

// ------- Tipos -------

export type DisciplinaFechamento = {
  matriz_disciplina_id: string
  disciplina_id: string
  nome: string
}

export type DisciplinaAlunoFechamento = {
  matriz_disciplina_id: string
  nome: string
  medias_periodo: (number | null)[]
  media_anual: number | null
  media_final: number | null
  recuperacao: number | null
  status: 'aprovado' | 'recuperacao' | 'reprovado' | 'em_andamento' | null
  pendente: boolean
}

export type AlunoFechamento = {
  matricula_id: string
  aluno_id: string
  numero_chamada: number | null
  nome_completo: string
  situacao: string
  data_saida: string | null
  frequencia_percentual: number | null
  media_anual: number | null
  media_final: number | null
  disciplinas: DisciplinaAlunoFechamento[]
  pendente: boolean
  resultado: string | null
}

export type DadosFechamentoTurma = {
  turma: {
    id: string
    nome: string
    fechada: boolean
    data_fechamento: string | null
    etapa_nome: string
    etapa_tipo: string
    ano_letivo_descricao: string
    metodo_nome: string | null
  }
  metodo: {
    media_minima: number
    media_minima_recuperacao: number
    frecuencia_minima: number
    quantidade_periodos: number
    criterio_frequencia: 'por_dia' | 'por_aula'
    temNumerico: boolean
    permite_recuperacao_final: boolean
  }
  disciplinas: DisciplinaFechamento[]
  alunos: AlunoFechamento[]
  ehInfantil: boolean
  ehEtapaFinal: boolean
}

type NotaRow = { aluno_id: string; disciplina_id: string; periodo: number; valor: number | string | null; descricao: string | null }
type RecRow = { aluno_id: string; disciplina_id: string; periodo: number | null; tipo: string; valor: number | string | null; descricao: string | null }
type ConselhoRow = { aluno_id: string; matriz_disciplina_id: string; periodo: number; nota_conselho: number | null }
type FrequenciaRow = { aluno_id: string; status: string | null }

// ------- Helpers -------

async function validarPerm(recurso: string, acao: 'visualizar' | 'editar', pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, acao)
  }
}

export async function verificarTurmaFechada(turmaId: string): Promise<boolean> {
  const { data } = await supabase.from('turmas').select('fechada').eq('id', turmaId).maybeSingle()
  return data?.fechada === true
}

async function resolverMetodoFechamento(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  let metodoId: string | null = null
  let tiposAvaliacao: Record<string, unknown> | null = null
  let nome: string | null = null
  let qtd = 4
  let freqMin = 75
  let criterio: 'por_dia' | 'por_aula' = 'por_dia'

  if (turma) {
    const { data: matriz } = await supabase
      .from('academico_matrizes_curriculares')
      .select('metodo_avaliacao_id')
      .eq('school_id', turma.school_id)
      .eq('ano_letivo_id', turma.ano_letivo_id)
      .eq('etapa_ensino_id', turma.etapa_ensino_id)

    metodoId = matriz?.[0]?.metodo_avaliacao_id || null
  }

  if (metodoId) {
    const { data: metodo } = await supabase
      .from('academico_metodos_avaliacao')
      .select('nome, criterio_frequencia, frecuencia_minima, quantidade_periodos_numerico, tipos_avaliacao')
      .eq('id', metodoId)
      .maybeSingle()

    if (metodo) {
      nome = metodo.nome || null
      qtd = Number(metodo.quantidade_periodos_numerico) || 4
      freqMin = metodo.frecuencia_minima != null ? Number(metodo.frecuencia_minima) : 75
      criterio = metodo.criterio_frequencia === 'por_aula' ? 'por_aula' : 'por_dia'
      tiposAvaliacao = metodo.tipos_avaliacao as Record<string, unknown> | null
    }
  }

  const config = await getNumericoConfigCompleta(metodoId, qtd)
  const temNumerico = tiposAvaliacao?.numerico === true || tiposAvaliacao?.numerico === 'true'

  return {
    metodoId,
    nome,
    qtd,
    freqMin,
    criterio,
    config,
    temNumerico,
  }
}

async function resolverFasesTurma(turmaId: string): Promise<{ ehInfantil: boolean; ehEtapaFinal: boolean }> {
  const { data: turma } = await supabase
    .from('turmas')
    .select('etapa_ensino_id, etapas_ensino_ids')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma) return { ehInfantil: false, ehEtapaFinal: false }

  const ids = Array.isArray(turma.etapas_ensino_ids) && turma.etapas_ensino_ids.length > 0
    ? turma.etapas_ensino_ids
    : [turma.etapa_ensino_id].filter(Boolean)

  const { data: etapas } = await supabase
    .from('academico_etapas_ensino')
    .select('etapa_tipo, etapa_codigo')
    .in('id', ids)

  const lista = etapas || []
  return {
    ehInfantil: lista.some(e => String(e.etapa_tipo || '').toLowerCase().includes('infantil')),
    ehEtapaFinal: lista.some(e => ETAPAS_FINAIS_INEP.includes(Number(e.etapa_codigo))),
  }
}

// Motor de cálculo — espelha calcularDesempenhoAluno em lote (dados já carregados)
function calcularDisciplina(
  alunoId: string,
  discId: string,
  qtdPeriodos: number,
  config: ConfigNumericaCompleta,
  notas: NotaRow[],
  recs: RecRow[],
  conselhos: ConselhoRow[]
): DisciplinaAlunoFechamento {
  const periodos = Array.from({ length: qtdPeriodos }, (_, i) => i + 1)
  const notasDisc = notas.filter(n => n.aluno_id === alunoId && n.disciplina_id === discId)
  const recsDisc = recs.filter(r => r.aluno_id === alunoId && r.disciplina_id === discId)
  const conselhoDisc = conselhos.filter(c => c.aluno_id === alunoId && c.matriz_disciplina_id === discId)

  const pesoMap = new Map<string, number>()
  for (const av of config.avaliacoes_list) pesoMap.set(av.nome, av.peso)

  const recAvaliacaoPorPeriodo = new Map<number, Map<string, number>>()
  for (const rec of recsDisc) {
    if (rec.tipo !== 'avaliacao' || rec.periodo === null || rec.valor === null || !rec.descricao) continue
    let porPeriodo = recAvaliacaoPorPeriodo.get(rec.periodo)
    if (!porPeriodo) {
      porPeriodo = new Map<string, number>()
      recAvaliacaoPorPeriodo.set(rec.periodo, porPeriodo)
    }
    porPeriodo.set(rec.descricao, Number(rec.valor))
  }

  const mediasPeriodo: (number | null)[] = periodos.map(p => {
    const recAvaliacao = recAvaliacaoPorPeriodo.get(p) || new Map<string, number>()
    const notasDoPeriodo = notasDisc
      .filter(n => n.periodo === p && n.valor !== null)
      .map(n => {
        const recVal = n.descricao ? recAvaliacao.get(n.descricao) : undefined
        if (recVal === undefined) return n
        return config.recuperacao_substitutiva
          ? { ...n, valor: recVal }
          : { ...n, valor: Math.max(Number(n.valor), recVal) }
      })

    if (notasDoPeriodo.length === 0) return null

    if (config.tipo_media_periodo === 'somatoria') {
      const soma = notasDoPeriodo.reduce((acc, n) => acc + Number(n.valor), 0)
      return Math.min(soma, config.media_maxima_periodo)
    }

    let somaPonderada = 0
    let somaPesos = 0
    for (const n of notasDoPeriodo) {
      const peso = pesoMap.get(n.descricao ?? '') ?? 1
      somaPonderada += Number(n.valor) * peso
      somaPesos += peso
    }
    const media = somaPesos > 0 ? somaPonderada / somaPesos : 0
    const capped = Math.min(media, config.media_maxima_periodo)
    return Math.round(capped * 100) / 100
  })

  for (const rec of recsDisc) {
    if (rec.tipo !== 'periodo' || rec.periodo === null || rec.valor === null) continue
    const idx = rec.periodo - 1
    if (idx >= 0 && idx < mediasPeriodo.length) {
      const recVal = Number(rec.valor)
      mediasPeriodo[idx] = config.recuperacao_periodo_substitutiva
        ? mediasPeriodo[idx] === null ? recVal : Math.max(mediasPeriodo[idx]!, recVal)
        : recVal
    }
  }

  const conselhoPorPeriodo = new Map<number, number>()
  for (const c of conselhoDisc) {
    if (c.nota_conselho === null) continue
    const conselhoVal = Number(c.nota_conselho)
    conselhoPorPeriodo.set(c.periodo, conselhoVal)
    const idx = c.periodo - 1
    if (idx >= 0 && idx < mediasPeriodo.length) {
      mediasPeriodo[idx] = config.recuperacao_periodo_substitutiva
        ? mediasPeriodo[idx] === null ? conselhoVal : Math.max(mediasPeriodo[idx]!, conselhoVal)
        : conselhoVal
    }
  }

  let mediaAnual: number | null = null
  if (mediasPeriodo.some(m => m !== null)) {
    const pesos = config.pesos_periodos.slice(0, mediasPeriodo.length)
    if (config.tipo_resultado_final === 'somatoria') {
      let soma = 0
      for (const m of mediasPeriodo) if (m !== null) soma += m
      mediaAnual = Math.min(soma, config.media_maxima_periodo)
    } else {
      let somaPonderada = 0
      let somaPesos = 0
      for (let i = 0; i < mediasPeriodo.length; i++) {
        if (mediasPeriodo[i] !== null) {
          somaPonderada += mediasPeriodo[i]! * (pesos[i] || 1)
          somaPesos += pesos[i] || 1
        }
      }
      mediaAnual = somaPesos > 0 ? somaPonderada / somaPesos : null
      if (mediaAnual !== null) mediaAnual = Math.round(mediaAnual * 100) / 100
    }
  }

  const recFinal = recsDisc.find(r => r.tipo === 'final' && r.valor !== null)
  const valorRecFinal = recFinal ? Number(recFinal.valor) : null

  let mediaFinal: number | null = null
  let status: DisciplinaAlunoFechamento['status'] = null

  if (mediaAnual !== null) {
    if (config.permite_recuperacao_final && valorRecFinal !== null) {
      if (config.recuperacao_final_substitutiva) {
        mediaFinal = Math.max(mediaAnual, valorRecFinal)
      } else if (config.usa_media_ponderada_recuperacao) {
        const totalPeso = config.peso_media_anual + config.peso_recuperacao_final
        mediaFinal = ((mediaAnual * config.peso_media_anual) + (valorRecFinal * config.peso_recuperacao_final)) / totalPeso
      } else {
        mediaFinal = valorRecFinal
      }
      mediaFinal = Math.round(mediaFinal * 100) / 100
      status = mediaFinal >= (config.recuperacao_final_substitutiva ? config.media_minima : config.media_minima_recuperacao)
        ? 'aprovado'
        : 'reprovado'
    } else if (mediaAnual >= config.media_minima) {
      mediaFinal = mediaAnual
      status = 'aprovado'
    } else if (config.permite_recuperacao_final && valorRecFinal === null) {
      mediaFinal = mediaAnual
      status = 'recuperacao'
    } else if (config.aprovacao_automatica) {
      mediaFinal = mediaAnual
      status = 'aprovado'
    } else {
      mediaFinal = mediaAnual
      status = 'reprovado'
    }
  }

  const avaliacaoCompleta = mediasPeriodo.every(m => m !== null)
  if (mediaAnual !== null && status !== null && !avaliacaoCompleta) {
    status = 'em_andamento'
  }

  const pendente = status === null || status === 'em_andamento' || status === 'recuperacao'

  return {
    matriz_disciplina_id: discId,
    nome: '',
    medias_periodo: mediasPeriodo,
    media_anual: mediaAnual != null ? Math.round(mediaAnual * 100) / 100 : null,
    media_final: mediaFinal != null ? Math.round(mediaFinal * 100) / 100 : null,
    recuperacao: valorRecFinal,
    status,
    pendente,
  }
}

function mediaGeral(valores: (number | null)[]): number | null {
  const validos = valores.filter((v): v is number => v !== null)
  if (validos.length === 0) return null
  return Math.round((validos.reduce((a, b) => a + b, 0) / validos.length) * 100) / 100
}

// ------- Leitura dos dados do fechamento -------

export async function getDadosFechamentoTurma(
  turmaId: string,
  pessoaId?: string | null
): Promise<DadosFechamentoTurma> {
  await validarPerm('gestao-pedagogica.fechamento.fechar', 'visualizar', pessoaId)

  const [turmaResult, disciplinas] = await Promise.all([
    supabase
      .from('turmas')
      .select('id, nome, fechada, data_fechamento, turnos, ano_letivo_id, etapa_ensino_id, etapas_ensino_ids')
      .eq('id', turmaId)
      .maybeSingle(),
    getDisciplinasDiarioFechamento(turmaId),
  ])

  const turma = turmaResult.data
  if (!turma) throw new Error('Turma não encontrada')

  const anoDescricao = await supabase
    .from('academico_anos_letivos')
    .select('descricao')
    .eq('id', turma.ano_letivo_id)
    .maybeSingle()
    .then(r => r.data?.descricao || '')

  const fases = await resolverFasesTurma(turmaId)
  const metodo = await resolverMetodoFechamento(turmaId)

  const etapaPrincipal = await supabase
    .from('academico_etapas_ensino')
    .select('etapa_nome, etapa_tipo')
    .eq('id', turma.etapa_ensino_id)
    .maybeSingle()
    .then(r => r.data)

  const [{ data: matriculas }, { data: notas }, { data: recs }, { data: conselhos }, frequenciaMap] = await Promise.all([
    supabase
      .from('academico_matriculas')
      .select('id, aluno_id, situacao, data_saida, numero_chamada')
      .eq('turma_id', turmaId)
      .eq('ativo', true),
    supabase.from('academico_notas').select('aluno_id, disciplina_id, periodo, valor, descricao').eq('turma_id', turmaId),
    supabase.from('academico_recuperacoes').select('aluno_id, disciplina_id, periodo, tipo, valor, descricao').eq('turma_id', turmaId),
    supabase
      .from('conselho_classe_resultados')
      .select('aluno_id, matriz_disciplina_id, periodo, nota_conselho')
      .eq('turma_id', turmaId),
    resolverFrequencias(turmaId, metodo.criterio),
  ])

  const listaMatriculas = matriculas || []
  const alunoIds = listaMatriculas.map(m => m.aluno_id)

  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', alunoIds)

  const pessoaMap = new Map((pessoas || []).map(p => [p.id, p.nome_completo]))
  const discMap = new Map(disciplinas.map(d => [d.matriz_disciplina_id, d.nome]))

  const alunos: AlunoFechamento[] = listaMatriculas.map(m => {
    const computed = disciplinas.map(d =>
      calcularDisciplina(
        m.aluno_id,
        d.matriz_disciplina_id,
        metodo.qtd,
        metodo.config,
        (notas || []) as NotaRow[],
        (recs || []) as RecRow[],
        (conselhos || []) as ConselhoRow[]
      )
    )

    computed.forEach(c => { c.nome = discMap.get(c.matriz_disciplina_id) || c.nome })

    const disciplinasComNumerico = metodo.temNumerico ? computed : []
    const pendente = disciplinasComNumerico.some(d => d.pendente)

    const frequencia = frequenciaMap.get(m.aluno_id) ?? null
    const mediaAnual = mediaGeral(computed.map(c => c.media_anual))
    const mediaFinal = mediaGeral(computed.map(c => c.media_final))

    let resultado: string | null = null
    if (isSituacaoFinalOuSaida(m.situacao)) {
      resultado = m.situacao
    } else if (!pendente) {
      resultado = resolverResultado(
        m.situacao,
        disciplinasComNumerico,
        frequencia,
        metodo,
        fases
      )
    }

    return {
      matricula_id: m.id,
      aluno_id: m.aluno_id,
      numero_chamada: m.numero_chamada ?? null,
      nome_completo: pessoaMap.get(m.aluno_id) || '',
      situacao: m.situacao,
      data_saida: m.data_saida,
      frequencia_percentual: frequencia,
      media_anual: mediaAnual,
      media_final: mediaFinal,
      disciplinas: computed,
      pendente: m.situacao === 'Ativo' && pendente,
      resultado,
    }
  })

  return {
    turma: {
      id: turma.id,
      nome: turma.nome,
      fechada: turma.fechada === true,
      data_fechamento: turma.data_fechamento || null,
      etapa_nome: etapaPrincipal?.etapa_nome || '',
      etapa_tipo: etapaPrincipal?.etapa_tipo || '',
      ano_letivo_descricao: anoDescricao,
      metodo_nome: metodo.nome,
    },
    metodo: {
      media_minima: metodo.config.media_minima,
      media_minima_recuperacao: metodo.config.media_minima_recuperacao,
      frecuencia_minima: metodo.freqMin,
      quantidade_periodos: metodo.qtd,
      criterio_frequencia: metodo.criterio,
      temNumerico: metodo.temNumerico,
      permite_recuperacao_final: metodo.config.permite_recuperacao_final,
    },
    disciplinas,
    alunos,
    ehInfantil: fases.ehInfantil,
    ehEtapaFinal: fases.ehEtapaFinal,
  }
}

async function getDisciplinasDiarioFechamento(turmaId: string): Promise<DisciplinaFechamento[]> {
  const { data: turmasDisc } = await supabase
    .from('turmas_disciplinas')
    .select('matriz_disciplina_id')
    .eq('turma_id', turmaId)

  const matrizIds = (turmasDisc || []).map(td => td.matriz_disciplina_id).filter(Boolean)

  const { data: matrizes } = await supabase
    .from('academico_matriz_disciplinas')
    .select('id, disciplina_id')
    .in('id', matrizIds)

  const matrizMap = new Map((matrizes || []).map(m => [m.id, m.disciplina_id]))
  const discIds = matrizes?.map(m => m.disciplina_id).filter(Boolean) || []

  const { data: disciplinas } = await supabase
    .from('academico_disciplinas')
    .select('id, nome')
    .in('id', discIds)
    .order('nome')

  const discMap = new Map((disciplinas || []).map(d => [d.id, d.nome]))

  return (turmasDisc || [])
    .map(td => ({
      matriz_disciplina_id: td.matriz_disciplina_id,
      disciplina_id: matrizMap.get(td.matriz_disciplina_id) || '',
      nome: discMap.get(matrizMap.get(td.matriz_disciplina_id) || '') || '',
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome))
}

async function resolverFrequencias(turmaId: string, criterio: 'por_dia' | 'por_aula'): Promise<Map<string, number>> {
  const table = criterio === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'
  const { data } = await supabase
    .from(table)
    .select('aluno_id, status')
    .eq('turma_id', turmaId)

  const grupos = new Map<string, { presencas: number; total: number }>()
  for (const r of (data || []) as FrequenciaRow[]) {
    if (!r.status) continue
    const g = grupos.get(r.aluno_id) || { presencas: 0, total: 0 }
    g.total++
    if (r.status === 'P' || r.status === 'FJ') g.presencas++
    grupos.set(r.aluno_id, g)
  }

  const result = new Map<string, number>()
  for (const [aluno_id, g] of grupos.entries()) {
    if (g.total > 0) result.set(aluno_id, Math.round((g.presencas / g.total) * 100))
  }
  return result
}

function isSituacaoFinalOuSaida(situacao: string): boolean {
  return (SITUACOES_RESULTADO_FINAL as readonly string[]).includes(situacao)
    || (SITUACOES_SAIDA as readonly string[]).includes(situacao)
}

type MetodoResultado = {
  freqMin: number
  temNumerico: boolean
  qtd: number
  criterio: 'por_dia' | 'por_aula'
  metodoId: string | null
  nome: string | null
  config: ConfigNumericaCompleta
}

function resolverResultado(
  situacao: string,
  disciplinas: DisciplinaAlunoFechamento[],
  frequencia: number | null,
  metodo: MetodoResultado,
  fases: { ehInfantil: boolean; ehEtapaFinal: boolean }
): string {
  if (situacao !== 'Ativo') return situacao

  const reprovouFrequencia = frequencia !== null && frequencia < metodo.freqMin

  if (fases.ehInfantil) return 'Sem movimentação'

  if (reprovouFrequencia) return 'Reprovado por frequência'

  if (disciplinas.some(d => d.status === 'reprovado')) return 'Reprovado'

  if (fases.ehEtapaFinal) return 'Aprovado concluinte'

  return 'Aprovado'
}

// ------- Fechamento -------

export async function fecharTurma(turmaId: string, pessoaId?: string | null) {
  await validarPerm('gestao-pedagogica.fechamento.fechar', 'editar', pessoaId)

  const dados = await getDadosFechamentoTurma(turmaId, pessoaId)
  if (dados.turma.fechada) throw new Error('A turma já está fechada')

  const pendentes = dados.alunos.filter(a => a.situacao === 'Ativo' && a.pendente)
  if (pendentes.length > 0) {
    throw new Error(
      `Existem ${pendentes.length} aluno(s) com avaliações pendentes. Finalize as notas/recuperações antes de fechar a turma.`
    )
  }

  const resultados = dados.alunos
    .filter(a => a.situacao === 'Ativo' && a.resultado)
    .map(a => ({
      matricula_id: a.matricula_id,
      aluno_id: a.aluno_id,
      situacao: a.resultado as string,
    }))

  const today = new Date().toISOString().slice(0, 10)

  for (const r of resultados) {
    const { error } = await supabase
      .from('academico_matriculas')
      .update({ situacao: r.situacao })
      .eq('id', r.matricula_id)
    if (error) throw error
  }

  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id')
    .eq('id', turmaId)
    .maybeSingle()

  const { error: errTurma } = await supabase
    .from('turmas')
    .update({ fechada: true, data_fechamento: today, fechada_por: pessoaId || null })
    .eq('id', turmaId)
  if (errTurma) throw errTurma

  await registrarAuditoriaFechamento({
    school_id: turma?.school_id || '',
    turma_id: turmaId,
    pessoa_id: pessoaId || null,
    resultados,
    data_fechamento: today,
  })

  return {
    success: true,
    total: resultados.length,
    contagem: contarResultados(resultados),
    resultados,
  }
}

function contarResultados(resultados: { situacao: string }[]) {
  const c: Record<string, number> = {}
  for (const r of resultados) {
    c[r.situacao] = (c[r.situacao] || 0) + 1
  }
  return c
}

async function registrarAuditoriaFechamento(data: {
  school_id: string
  turma_id: string
  pessoa_id: string | null
  resultados: { matricula_id: string; aluno_id: string; situacao: string }[]
  data_fechamento: string
}) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('nome')
    .eq('id', data.turma_id)
    .maybeSingle()

  await registrarAuditoriaAgregada({
    school_id: data.school_id,
    pessoa_id: data.pessoa_id,
    modulo: 'Fechamento de Turma',
    entidade: 'turmas',
    entidade_id: data.turma_id,
    registro_nome: turma?.nome || null,
    dados_novos: {
      status: 'fechada',
      data_fechamento: data.data_fechamento,
      resultados: data.resultados,
    },
    resumo: {
      turma: turma?.nome || null,
      turma_id: data.turma_id,
      quantidade: data.resultados.length,
    },
  })
}

// ------- Desfazer fechamento -------

export async function desfazerFechamento(turmaId: string, pessoaId?: string | null) {
  await validarPerm('gestao-pedagogica.fechamento.desfazer', 'editar', pessoaId)

  const { data: turma } = await supabase
    .from('turmas')
    .select('fechada, school_id, nome')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma?.fechada) throw new Error('A turma não está fechada')

  const { data: auditoria } = await supabase
    .from('auditoria')
    .select('dados_novos')
    .eq('entidade', 'turmas')
    .eq('entidade_id', turmaId)
    .eq('modulo', 'Fechamento de Turma')
    .order('created_at', { ascending: false })
    .limit(10)

  const fechamento = (auditoria || []).find(a => a.dados_novos?.status === 'fechada')
  const snapshot = (fechamento?.dados_novos?.resultados || []) as { matricula_id: string; aluno_id: string; situacao: string }[]

  if (snapshot.length === 0) {
    throw new Error('Não foi possível localizar o registro de fechamento na auditoria.')
  }

  const revertidos: { matricula_id: string; aluno_id: string; situacao_anterior: string; situacao_nova: string }[] = []

  for (const r of snapshot) {
    const { error } = await supabase
      .from('academico_matriculas')
      .update({ situacao: 'Ativo' })
      .eq('id', r.matricula_id)
    if (error) throw error
    revertidos.push({
      matricula_id: r.matricula_id,
      aluno_id: r.aluno_id,
      situacao_anterior: r.situacao,
      situacao_nova: 'Ativo',
    })
  }

  const { error: errTurma } = await supabase
    .from('turmas')
    .update({ fechada: false, data_fechamento: null, fechada_por: null })
    .eq('id', turmaId)
  if (errTurma) throw errTurma

  // Auditoria do desfazer: registra o resultado anterior de cada aluno revertido
  await registrarAuditoriaAgregada({
    school_id: turma.school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Fechamento de Turma',
    entidade: 'turmas',
    entidade_id: turmaId,
    registro_nome: turma.nome || null,
    dados_novos: { status: 'ativa', revertidos },
    resumo: {
      turma_id: turmaId,
      quantidade: revertidos.length,
    },
  })

  return { success: true, total: revertidos.length }
}