'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoriaAgregada } from '@/lib/auditoria'
import { garantirTurmaAberta } from './garantir-turma-aberta'

const supabase = getSupabaseAdmin()

async function registrarNotasAgg(
  pessoaId: string | null,
  turmaId: string,
  disciplinaId: string,
  periodo: number | null,
  quantidade: number,
  modulo: string,
  entidade: string
) {
  const { data: turma } = await supabase.from('turmas').select('school_id, nome').eq('id', turmaId).maybeSingle()
  const { data: disciplina } = await supabase.from('academico_disciplinas').select('nome').eq('id', disciplinaId).maybeSingle()
  await registrarAuditoriaAgregada({
    school_id: turma?.school_id || null,
    pessoa_id: pessoaId || null,
    modulo,
    entidade,
    entidade_id: turmaId,
    registro_nome: turma?.nome || null,
    resumo: {
      turma: turma?.nome || null,
      turma_id: turmaId,
      disciplina: disciplina?.nome || null,
      periodo: periodo !== null ? `Período ${periodo}` : null,
      quantidade,
    },
  })
}

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

export type Nota = {
  id: string
  aluno_id: string
  disciplina_id: string
  periodo: number
  valor: number | null
  descricao: string | null
  data_aplicacao: string | null
}

export type Recuperacao = {
  id: string
  aluno_id: string
  disciplina_id: string
  periodo: number | null
  tipo: 'avaliacao' | 'periodo' | 'final'
  descricao: string | null
  valor: number | null
}

export type DesempenhoAluno = {
  aluno_id: string
  medias_periodo: (number | null)[]
  conselho_periodos: (number | null)[]
  media_anual: number | null
  recuperacao: number | null
  media_final: number | null
  status: 'aprovado' | 'recuperacao' | 'reprovado' | 'em_andamento' | null
}

export type AvaliacaoPredefinida = { nome: string; peso: number; nota_maxima: number }

export type ConfigNumericaCompleta = {
  forma_registro: string
  tipo_media_periodo: string
  tipo_resultado_final: string
  media_maxima_periodo: number
  permite_recuperacao: string[]
  recuperacao_substitutiva: boolean
  recuperacao_periodo_substitutiva: boolean
  recuperacao_final_substitutiva: boolean
  limitar_avaliacoes: boolean
  avaliacoes_list: AvaliacaoPredefinida[]
  aprovacao_automatica: boolean
  media_minima: number
  pesos_periodos: number[]
  permite_recuperacao_final: boolean
  permite_recuperacao_final_para_reprovados: boolean
  media_minima_recuperacao: number
  usa_media_ponderada_recuperacao: boolean
  peso_media_anual: number
  peso_recuperacao_final: number
}

type NumericoConfigRow = {
  forma_registro?: string | null
  tipo_media_periodo?: string | null
  tipo_resultado_final?: string | null
  media_maxima_periodo?: number | string | null
  permite_recuperacao?: string | null
  recuperacao_substitutiva?: boolean | null
  recuperacao_periodo_substitutiva?: boolean | null
  recuperacao_final_substitutiva?: boolean | null
  limitar_avaliacoes?: boolean | null
  avaliacoes_list?: AvaliacaoPredefinida[] | null
  permite_recuperacao_final_reprovados?: boolean | null
}

type AprovacaoConfigRow = {
  aprovacao_automatica?: boolean | null
  media_minima?: number | string | null
  pesos_periodos?: number[] | null
  permite_recuperacao_final?: boolean | null
  media_minima_recuperacao?: number | string | null
  usa_media_ponderada_recuperacao?: boolean | null
  peso_media_anual?: number | string | null
  peso_recuperacao_final?: number | string | null
}

function parsePermiteRecuperacao(valor: string | null | undefined): string[] {
  if (!valor) return []
  const str = String(valor).trim()
  if (str === '' || str === 'nenhum') return []
  return str.split(',').map(s => s.trim()).filter(Boolean)
}

function configNumericaPadrao(quantidadePeriodos: number): ConfigNumericaCompleta {
  return {
    forma_registro: 'decimal',
    tipo_media_periodo: 'ponderada',
    tipo_resultado_final: 'media_periodos',
    media_maxima_periodo: 10,
    permite_recuperacao: [],
    recuperacao_substitutiva: false,
    recuperacao_periodo_substitutiva: false,
    recuperacao_final_substitutiva: false,
    limitar_avaliacoes: false,
    avaliacoes_list: [],
    aprovacao_automatica: false,
    media_minima: 7,
    pesos_periodos: Array(quantidadePeriodos).fill(1),
    permite_recuperacao_final: false,
    permite_recuperacao_final_para_reprovados: false,
    media_minima_recuperacao: 5,
    usa_media_ponderada_recuperacao: false,
    peso_media_anual: 1,
    peso_recuperacao_final: 1,
  }
}

async function getConfigNumerica(metodoId: string, quantidadePeriodos?: number): Promise<ConfigNumericaCompleta> {
  const [numerico, aprovacao] = await Promise.all([
    supabase
      .from('academico_metodos_avaliacao_numerico')
      .select('*')
      .eq('metodo_id', metodoId)
      .maybeSingle()
      .then(r => r.data),
    supabase
      .from('academico_metodos_avaliacao_aprovacao')
      .select('*')
      .eq('metodo_id', metodoId)
      .maybeSingle()
      .then(r => r.data),
  ])

  const padrao = configNumericaPadrao(quantidadePeriodos || 4)
  const n = (numerico ?? {}) as NumericoConfigRow
  const a = (aprovacao ?? {}) as AprovacaoConfigRow
  const pesos = a.pesos_periodos as number[] | undefined

  return {
    forma_registro: n.forma_registro || padrao.forma_registro,
    tipo_media_periodo: n.tipo_media_periodo || padrao.tipo_media_periodo,
    tipo_resultado_final: n.tipo_resultado_final || padrao.tipo_resultado_final,
    media_maxima_periodo: Number(n.media_maxima_periodo ?? padrao.media_maxima_periodo),
    permite_recuperacao: parsePermiteRecuperacao(n.permite_recuperacao),
    recuperacao_substitutiva: n.recuperacao_substitutiva ?? padrao.recuperacao_substitutiva,
    recuperacao_periodo_substitutiva: n.recuperacao_periodo_substitutiva ?? padrao.recuperacao_periodo_substitutiva,
    recuperacao_final_substitutiva: n.recuperacao_final_substitutiva ?? padrao.recuperacao_final_substitutiva,
    limitar_avaliacoes: n.limitar_avaliacoes ?? padrao.limitar_avaliacoes,
    avaliacoes_list: (n.avaliacoes_list || []) as AvaliacaoPredefinida[],
    aprovacao_automatica: a.aprovacao_automatica ?? padrao.aprovacao_automatica,
    media_minima: Number(a.media_minima ?? padrao.media_minima),
    pesos_periodos: Array.isArray(pesos) && pesos.length > 0 ? pesos : padrao.pesos_periodos,
    permite_recuperacao_final: a.permite_recuperacao_final ?? padrao.permite_recuperacao_final,
    permite_recuperacao_final_para_reprovados:
      n.permite_recuperacao_final_reprovados ?? padrao.permite_recuperacao_final_para_reprovados,
    media_minima_recuperacao: Number(a.media_minima_recuperacao ?? padrao.media_minima_recuperacao),
    usa_media_ponderada_recuperacao: a.usa_media_ponderada_recuperacao ?? padrao.usa_media_ponderada_recuperacao,
    peso_media_anual: Number(a.peso_media_anual ?? padrao.peso_media_anual),
    peso_recuperacao_final: Number(a.peso_recuperacao_final ?? padrao.peso_recuperacao_final),
  }
}

export async function getNumericoConfigCompleta(
  metodoId: string | null | undefined,
  quantidadePeriodos?: number
): Promise<ConfigNumericaCompleta> {
  if (!metodoId) return configNumericaPadrao(quantidadePeriodos || 4)
  return getConfigNumerica(metodoId, quantidadePeriodos)
}

export async function getNumericoConfig(metodoId: string) {
  const { data } = await supabase
    .from('academico_metodos_avaliacao_numerico')
    .select('limitar_avaliacoes, avaliacoes_list')
    .eq('metodo_id', metodoId)
    .maybeSingle()
  const row = (data ?? {}) as NumericoConfigRow
  return {
    limitar_avaliacoes: row.limitar_avaliacoes ?? false,
    avaliacoes_list: (row.avaliacoes_list || []) as AvaliacaoPredefinida[],
  }
}

export async function getMetodoIdDaTurma(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma) return null

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)

  return matriz?.[0]?.metodo_avaliacao_id || null
}

// ── FASE 5: Server Actions ──

async function limparConselhoDeClasse(
  disciplinaId: string,
  alunoId: string,
  periodo: number,
  pessoaId: string | null
): Promise<boolean> {
  const { data, error } = await supabase
    .from('conselho_classe_resultados')
    .update({ nota_conselho: null, parecer: null, updated_by: pessoaId })
    .eq('matriz_disciplina_id', disciplinaId)
    .eq('aluno_id', alunoId)
    .eq('periodo', periodo)
    .select('id')

  if (error) return false
  return (data?.length ?? 0) > 0
}

export async function salvarNota(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  periodo: number,
  valor: number | null,
  descricao: string | null,
  dataAplicacao: string | null,
  notaId: string | null,
  pessoaId: string | null
) {
  try {
    await garantirTurmaAberta(turmaId)
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.avaliacoes', 'editar')
    }

    if (notaId) {
      const { data: atual } = await supabase
        .from('academico_notas')
        .select('valor')
        .eq('id', notaId)
        .maybeSingle()
      const atualValor = atual ? (atual.valor === null ? null : Number(atual.valor)) : null
      const novoValor = valor === null ? null : Number(valor)
      const valorMudou = atualValor !== novoValor

      const { data, error } = await supabase
        .from('academico_notas')
        .update({ valor, descricao, data_aplicacao: dataAplicacao, updated_by: pessoaId })
        .eq('id', notaId)
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      const conselhoRemovido = valorMudou
        ? await limparConselhoDeClasse(disciplinaId, alunoId, periodo, pessoaId)
        : false
      await registrarNotasAgg(pessoaId, turmaId, disciplinaId, periodo, 1, 'Diário de Classe — Notas', 'academico_notas')
      return { success: true, id: data?.id || notaId, conselho_removido: conselhoRemovido }
    } else {
      const { data, error } = await supabase
        .from('academico_notas')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          periodo,
          valor,
          descricao,
          data_aplicacao: dataAplicacao,
          created_by: pessoaId,
          updated_by: pessoaId,
        })
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      const conselhoRemovido = await limparConselhoDeClasse(disciplinaId, alunoId, periodo, pessoaId)
      await registrarNotasAgg(pessoaId, turmaId, disciplinaId, periodo, 1, 'Diário de Classe — Notas', 'academico_notas')
      return { success: true, id: data?.id, conselho_removido: conselhoRemovido }
    }
  } catch (e: unknown) {
    return { success: false, error: mensagemErro(e) || 'Erro interno ao salvar nota' }
  }
}

export async function listarNotas(turmaId: string, periodo: number, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_notas')
    .select('id, aluno_id, disciplina_id, periodo, valor, descricao, data_aplicacao')
    .eq('turma_id', turmaId)
    .eq('periodo', periodo)
    .eq('disciplina_id', disciplinaId)
    .order('data_aplicacao', { ascending: false })

  if (error) throw error
  return (data || []) as Nota[]
}

export async function salvarRecuperacao(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  tipo: 'avaliacao' | 'periodo' | 'final',
  periodo: number | null,
  valor: number | null,
  descricao: string | null,
  recId: string | null,
  pessoaId: string | null
) {
  try {
    await garantirTurmaAberta(turmaId)
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.avaliacoes', 'editar')
    }

    if (recId) {
      const { data, error } = await supabase
        .from('academico_recuperacoes')
        .update({ valor, descricao, updated_by: pessoaId })
        .eq('id', recId)
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      const conselhoRemovido = periodo !== null
        ? await limparConselhoDeClasse(disciplinaId, alunoId, periodo, pessoaId)
        : false
      await registrarNotasAgg(pessoaId, turmaId, disciplinaId, periodo, 1, 'Diário de Classe — Notas', 'academico_recuperacoes')
      return { success: true, id: data?.id || recId, conselho_removido: conselhoRemovido }
    } else {
      const { data, error } = await supabase
        .from('academico_recuperacoes')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          tipo,
          periodo,
          valor,
          descricao,
          created_by: pessoaId,
          updated_by: pessoaId,
        })
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      const conselhoRemovido = periodo !== null
        ? await limparConselhoDeClasse(disciplinaId, alunoId, periodo, pessoaId)
        : false
      await registrarNotasAgg(pessoaId, turmaId, disciplinaId, periodo, 1, 'Diário de Classe — Notas', 'academico_recuperacoes')
      return { success: true, id: data?.id, conselho_removido: conselhoRemovido }
    }
  } catch (e: unknown) {
    return { success: false, error: mensagemErro(e) || 'Erro interno ao salvar recuperação' }
  }
}

export async function listarRecuperacoes(turmaId: string, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_recuperacoes')
    .select('id, aluno_id, disciplina_id, periodo, tipo, descricao, valor')
    .eq('turma_id', turmaId)
    .eq('disciplina_id', disciplinaId)

  if (error) throw error
  return (data || []) as Recuperacao[]
}

export async function listarNotasTurmaDisciplina(turmaId: string, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_notas')
    .select('id, aluno_id, disciplina_id, periodo, valor, descricao, data_aplicacao')
    .eq('turma_id', turmaId)
    .eq('disciplina_id', disciplinaId)
    .order('data_aplicacao', { ascending: true })

  if (error) throw error
  return (data || []) as Nota[]
}

export async function limparNotasAluno(
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  periodo: number,
  pessoaId: string | null
) {
  try {
    await garantirTurmaAberta(turmaId)
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.avaliacoes', 'editar')
    }

    const { error } = await supabase
      .from('academico_notas')
      .delete()
      .eq('turma_id', turmaId)
      .eq('aluno_id', alunoId)
      .eq('disciplina_id', disciplinaId)
      .eq('periodo', periodo)

    if (error) return { success: false, error: error.message }
    const conselhoRemovido = await limparConselhoDeClasse(disciplinaId, alunoId, periodo, pessoaId)
    await registrarNotasAgg(pessoaId, turmaId, disciplinaId, periodo, 1, 'Diário de Classe — Notas', 'academico_notas')
    return { success: true, conselho_removido: conselhoRemovido }
  } catch (e: unknown) {
    return { success: false, error: mensagemErro(e) || 'Erro interno ao limpar notas' }
  }
}

export async function getDescricoesNotas(turmaId: string, periodo: number, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_notas')
    .select('descricao, data_aplicacao')
    .eq('turma_id', turmaId)
    .eq('periodo', periodo)
    .eq('disciplina_id', disciplinaId)
    .not('descricao', 'is', null)
    .order('data_aplicacao', { ascending: true })

  if (error) throw error
  const seen = new Set<string>()
  return (data || []).filter(n => {
    if (seen.has(n.descricao!)) return false
    seen.add(n.descricao!)
    return true
  })
}

// ── FASE 6: Engine de Cálculo ──

type NotaDbRow = { periodo: number; valor: number | string | null; descricao: string | null }
type RecuperacaoDbRow = {
  periodo: number | null
  tipo: string
  descricao: string | null
  valor: number | string | null
}

function mensagemErro(e: unknown): string {
  return e instanceof Error ? e.message : 'Erro interno'
}

export async function calcularDesempenhoAluno(
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  quantidadePeriodos: number
): Promise<DesempenhoAluno> {
  const metodoId = await getMetodoIdDaTurma(turmaId)

  const config = metodoId
    ? await getConfigNumerica(metodoId, quantidadePeriodos)
    : configNumericaPadrao(quantidadePeriodos)

  const periodos = Array.from({ length: quantidadePeriodos }, (_, i) => i + 1)

  const [notasData, recuperacoesData, conselhoData] = await Promise.all([
    supabase
      .from('academico_notas')
      .select('periodo, valor, descricao')
      .eq('aluno_id', alunoId)
      .eq('disciplina_id', disciplinaId)
      .then(r => (r.data || []) as NotaDbRow[]),
    supabase
      .from('academico_recuperacoes')
      .select('periodo, tipo, descricao, valor')
      .eq('aluno_id', alunoId)
      .eq('disciplina_id', disciplinaId)
      .then(r => (r.data || []) as RecuperacaoDbRow[]),
    supabase
      .from('conselho_classe_resultados')
      .select('periodo, nota_conselho')
      .eq('aluno_id', alunoId)
      .eq('matriz_disciplina_id', disciplinaId)
      .then(r => (r.data || []) as { periodo: number; nota_conselho: number | null }[]),
  ])

  const pesoMap = new Map<string, number>()
  for (const av of config.avaliacoes_list) {
    pesoMap.set(av.nome, av.peso)
  }

  // Recuperação por avaliação: a nota recuperada substitui a nota original da avaliação
  const recAvaliacaoPorPeriodo = new Map<number, Map<string, number>>()
  for (const rec of recuperacoesData) {
    if (rec.tipo !== 'avaliacao' || rec.periodo === null || rec.valor === null || !rec.descricao) continue
    let porPeriodo = recAvaliacaoPorPeriodo.get(rec.periodo)
    if (!porPeriodo) {
      porPeriodo = new Map<string, number>()
      recAvaliacaoPorPeriodo.set(rec.periodo, porPeriodo)
    }
    porPeriodo.set(rec.descricao, Number(rec.valor))
  }

  // Calcular média de cada período
  const mediasPeriodo: (number | null)[] = periodos.map(p => {
    const recAvaliacao = recAvaliacaoPorPeriodo.get(p) || new Map<string, number>()
    const notasDoPeriodo = notasData
      .filter((n): n is NotaDbRow => n.periodo === p && n.valor !== null)
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

  // Aplicar recuperação por período: substitui a média do período, ou mantém a maior se substitutiva
  for (const rec of recuperacoesData) {
    if (rec.tipo !== 'periodo' || rec.periodo === null || rec.valor === null) continue
    const idx = rec.periodo - 1
    if (idx >= 0 && idx < mediasPeriodo.length) {
      const recVal = Number(rec.valor)
      mediasPeriodo[idx] = config.recuperacao_periodo_substitutiva
        ? mediasPeriodo[idx] === null
          ? recVal
          : Math.max(mediasPeriodo[idx]!, recVal)
        : recVal
    }
  }

  // Aplicar nota do conselho de classe por período: substitui a média do período,
  // ou mantém a maior se a recuperação por período for substitutiva
  const conselhoPorPeriodo = new Map<number, number>()
  for (const c of conselhoData) {
    if (c.nota_conselho === null) continue
    const conselhoVal = Number(c.nota_conselho)
    conselhoPorPeriodo.set(c.periodo, conselhoVal)
    const idx = c.periodo - 1
    if (idx >= 0 && idx < mediasPeriodo.length) {
      mediasPeriodo[idx] = config.recuperacao_periodo_substitutiva
        ? mediasPeriodo[idx] === null
          ? conselhoVal
          : Math.max(mediasPeriodo[idx]!, conselhoVal)
        : conselhoVal
    }
  }
  const conselhoPeriodos = periodos.map(p => conselhoPorPeriodo.get(p) ?? null)

  // Calcular média anual
  let mediaAnual: number | null = null

  if (mediasPeriodo.some(m => m !== null)) {
    const pesos = config.pesos_periodos.slice(0, mediasPeriodo.length)
    if (config.tipo_resultado_final === 'somatoria') {
      let soma = 0
      for (const m of mediasPeriodo) {
        if (m !== null) soma += m
      }
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
      if (mediaAnual !== null) {
        mediaAnual = Math.round(mediaAnual * 100) / 100
      }
    }
  }

  // Recuperação final
  const recFinal = recuperacoesData.find(
    r => r.tipo === 'final' && r.valor !== null
  )
  const valorRecFinal = recFinal ? Number(recFinal.valor) : null

  let mediaFinal: number | null = null
  let status: DesempenhoAluno['status'] = null

  if (mediaAnual !== null) {
    if (config.permite_recuperacao_final && valorRecFinal !== null) {
      if (config.recuperacao_final_substitutiva) {
        mediaFinal = Math.max(mediaAnual, valorRecFinal)
      } else if (config.usa_media_ponderada_recuperacao) {
        const pesoAnual = config.peso_media_anual
        const pesoRec = config.peso_recuperacao_final
        const totalPeso = pesoAnual + pesoRec
        mediaFinal = ((mediaAnual * pesoAnual) + (valorRecFinal * pesoRec)) / totalPeso
      } else {
        mediaFinal = valorRecFinal
      }
      mediaFinal = Math.round(mediaFinal * 100) / 100

      if (config.recuperacao_final_substitutiva) {
        status = mediaFinal >= config.media_minima ? 'aprovado' : 'reprovado'
      } else {
        status = mediaFinal >= config.media_minima_recuperacao ? 'aprovado' : 'reprovado'
      }
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

  // Avaliação incompleta: enquanto algum bimestre estiver sem notas, a situação é provisória
  const avaliacaoCompleta = mediasPeriodo.every(m => m !== null)
  if (mediaAnual !== null && status !== null && !avaliacaoCompleta) {
    status = 'em_andamento'
  }

  return {
    aluno_id: alunoId,
    medias_periodo: mediasPeriodo,
    conselho_periodos: conselhoPeriodos,
    media_anual: mediaAnual ? Math.round(mediaAnual * 100) / 100 : null,
    recuperacao: valorRecFinal,
    media_final: mediaFinal,
    status,
  }
}

export async function recalcularTurma(
  turmaId: string,
  disciplinaId: string,
  quantidadePeriodos: number,
  pessoaId?: string | null
) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (!matriculas?.length) return []

  const resultados = await Promise.all(
    matriculas.map(m =>
      calcularDesempenhoAluno(turmaId, m.aluno_id, disciplinaId, quantidadePeriodos)
    )
  )

  return resultados
}
