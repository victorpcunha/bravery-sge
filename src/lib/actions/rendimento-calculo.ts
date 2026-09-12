// Cálculo puro do Painel de Rendimento Escolar (spec 028).
// Módulo sem diretiva 'use server': constantes, matemática do engine e
// classificação — consumidos pelas server actions (rendimento.ts) e,
// quando necessário, por componentes client. Nenhuma regra acadêmica
// nova: tudo espelha o engine de avaliacoes-numericas.ts.

import type { ConfigNumericaCompleta } from './avaliacoes-numericas'

export const RENDIMENTO_RESOURCE = 'gestao-pedagogica.rendimento'

// Faixas fixas da Distribuição do Rendimento (spec FR-005)
export const FAIXAS_RENDIMENTO = [
  { faixa: '9,0–10,0', min: 9, max: 10 },
  { faixa: '7,0–8,9', min: 7, max: 8.999 },
  { faixa: '5,0–6,9', min: 5, max: 6.999 },
  { faixa: 'Abaixo de 5,0', min: -Infinity, max: 4.999 },
] as const

// Margem mínima de variação p/ tendência (spec FR-011: 1,0 ponto = 10% da escala)
export const MARGEM_TENDENCIA = 1.0

export type CategoriaSituacao = 'adequado' | 'atencao' | 'risco'
export type TendenciaAluno = 'melhorando' | 'estavel' | 'queda'

export type MotivoSituacao =
  | 'media_abaixo'
  | 'frequencia_abaixo'
  | 'rendimento_frequencia'
  | 'media_proxima_limite'
  | 'frequencia_proxima_limite'
  | 'queda_rendimento'

export const ROTULOS_MOTIVO: Record<MotivoSituacao, string> = {
  media_abaixo: 'Média abaixo do esperado',
  frequencia_abaixo: 'Frequência abaixo do esperado',
  rendimento_frequencia: 'Rendimento + frequência',
  media_proxima_limite: 'Próximo do limite da média',
  frequencia_proxima_limite: 'Próximo do limite da frequência',
  queda_rendimento: 'Queda de rendimento',
}

// ─── Engine (movido de avaliacoes-numericas.ts sem alteração de regra) ───

export type NotaDbRow = { periodo: number; valor: number | string | null; descricao: string | null }
export type RecuperacaoDbRow = {
  periodo: number | null
  tipo: string
  descricao: string | null
  valor: number | string | null
}
export type ConselhoDbRow = { periodo: number; nota_conselho: number | null }

// Matemática pura das médias por período (pesos, somatória, recuperações,
// conselho). Mesma regra para 1 disciplina (calcularDesempenhoAluno) ou lote
// (calcularMediasPeriodoTurma, Painel de Rendimento).
export function computarMediasPeriodo(
  notasData: NotaDbRow[],
  recuperacoesData: RecuperacaoDbRow[],
  conselhoData: ConselhoDbRow[],
  config: ConfigNumericaCompleta,
  quantidadePeriodos: number
): { medias: (number | null)[]; conselho: (number | null)[] } {
  const periodos = Array.from({ length: quantidadePeriodos }, (_, i) => i + 1)

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

  return { medias: mediasPeriodo, conselho: conselhoPeriodos }
}

// Espelha calcularDesempenhoAluno p/ média anual (pesos/somatória sobre
// períodos com nota). Recuperação final NÃO aplicada: o painel mostra o
// rendimento dos períodos (mesma base do Boletim, que usa medias_periodo).
export function computarMediaAnual(medias: (number | null)[], config: ConfigNumericaCompleta): number | null {
  if (!medias.some(m => m !== null)) return null
  if (config.tipo_resultado_final === 'somatoria') {
    let soma = 0
    for (const m of medias) if (m !== null) soma += m
    return Math.min(soma, config.media_maxima_periodo)
  }
  const pesos = config.pesos_periodos
  let somaPonderada = 0
  let somaPesos = 0
  for (let i = 0; i < medias.length; i++) {
    if (medias[i] !== null) {
      somaPonderada += medias[i]! * (pesos[i] || 1)
      somaPesos += pesos[i] || 1
    }
  }
  if (somaPesos === 0) return null
  return Math.round((somaPonderada / somaPesos) * 100) / 100
}

export function mediaLista(valores: (number | null)[]): number | null {
  const validos = valores.filter((v): v is number => v !== null)
  if (validos.length === 0) return null
  return Math.round((validos.reduce((a, b) => a + b, 0) / validos.length) * 100) / 100
}

export function dentroJanela(data: string, inicio: string | null, fim: string | null): boolean {
  if (inicio && data < inicio) return false
  if (fim && data > fim) return false
  return true
}

// ─── Classificação + tendência (R-05, R-07) ───

export type LinhaClassificacao = {
  mediaAtual: number | null
  mediaAnterior: number | null
  frequencia: number | null
}

export function classificarLinha(
  linha: LinhaClassificacao,
  mediaMinima: number,
  freqMin: number,
  faixaPp: number,
  mediaMaxima: number
): { categoria: CategoriaSituacao; motivos: MotivoSituacao[]; tendencia: TendenciaAluno } {
  const motivos: MotivoSituacao[] = []
  const media = linha.mediaAtual
  const freq = linha.frequencia

  const mediaAbaixo = media !== null && media < mediaMinima
  const freqAbaixo = freq !== null && freq < freqMin

  if (mediaAbaixo && freqAbaixo) motivos.push('rendimento_frequencia')
  else {
    if (mediaAbaixo) motivos.push('media_abaixo')
    if (freqAbaixo) motivos.push('frequencia_abaixo')
  }

  let categoria: CategoriaSituacao = 'adequado'
  if (mediaAbaixo || freqAbaixo) {
    categoria = 'risco'
  } else {
    const bandaMedia = mediaMinima + (faixaPp / 100) * mediaMaxima
    const bandaFreq = freqMin + faixaPp
    const proxMedia = media !== null && media < bandaMedia
    const proxFreq = freq !== null && freq < bandaFreq
    const queda = linha.mediaAtual !== null && linha.mediaAnterior !== null
      && (linha.mediaAnterior - linha.mediaAtual) >= MARGEM_TENDENCIA
    if (proxMedia) motivos.push('media_proxima_limite')
    if (proxFreq) motivos.push('frequencia_proxima_limite')
    if (queda) motivos.push('queda_rendimento')
    if (proxMedia || proxFreq || queda) categoria = 'atencao'
  }

  let tendencia: TendenciaAluno = 'estavel'
  if (linha.mediaAtual !== null && linha.mediaAnterior !== null) {
    const diff = linha.mediaAtual - linha.mediaAnterior
    if (diff >= MARGEM_TENDENCIA) tendencia = 'melhorando'
    else if (diff <= -MARGEM_TENDENCIA) tendencia = 'queda'
  }

  return { categoria, motivos, tendencia }
}
