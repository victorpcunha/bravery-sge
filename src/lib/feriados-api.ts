// Helpers de feriados nacionais (fonte: BrasilAPI) — módulo neutro, sem 'use server'.
// Usado por src/lib/actions/calendarios.ts (semeadura na escrita) e
// scripts/seed-feriados-existentes.mjs (backfill). Leitura nunca toca a API.

export type FeriadoNacional = { date: string; name: string }

export const PREFIXO_FERIADO_NACIONAL = 'Feriado Nacional –'

const TIMEOUT_MS = 8000

function normalizarData(valor: string): string {
  return valor.split('T')[0]
}

/** Anos civis distintos cobertos pelo intervalo [dataInicio, dataTermino] (YYYY-MM-DD). */
export function anosDoIntervalo(dataInicio: string, dataTermino: string): number[] {
  const inicio = Number(normalizarData(dataInicio).split('-')[0])
  const fim = Number(normalizarData(dataTermino).split('-')[0])
  const anos: number[] = []
  for (let ano = Math.min(inicio, fim); ano <= Math.max(inicio, fim); ano++) {
    anos.push(ano)
  }
  return anos
}

/** Só feriados com inicio <= date <= fim (comparação string YYYY-MM-DD). */
export function filtrarPorIntervalo(feriados: FeriadoNacional[], inicio: string, fim: string): FeriadoNacional[] {
  const ini = normalizarData(inicio)
  const term = normalizarData(fim)
  return feriados.filter(f => f.date >= ini && f.date <= term)
}

export type EventoFeriado = {
  calendario_id: string
  descricao: string
  tipo: 'recesso'
  data_inicio: string
  data_termino: string
  etapas: string[]
  recorrencia_tipo: 'nao_repete'
  recorrencia_dias: string[]
}

/** Mapeia um feriado para o shape de insert em academico_calendario_eventos. */
export function mapearParaEvento(feriado: FeriadoNacional, calendarioId: string): EventoFeriado {
  return {
    calendario_id: calendarioId,
    descricao: `${PREFIXO_FERIADO_NACIONAL} ${feriado.name}`,
    tipo: 'recesso',
    data_inicio: feriado.date,
    data_termino: feriado.date,
    etapas: [],
    recorrencia_tipo: 'nao_repete',
    recorrencia_dias: [],
  }
}

type FeriadoBruto = { date?: unknown; name?: unknown }

/**
 * Busca os feriados nacionais de um ano na BrasilAPI.
 * Rejeita em timeout (8s), HTTP != 2xx, rede ou payload inválido. Sem retry, sem cache.
 */
export async function buscarFeriadosNacionais(ano: number): Promise<FeriadoNacional[]> {
  const resposta = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!resposta.ok) {
    throw new Error(`BrasilAPI respondeu HTTP ${resposta.status}`)
  }
  const dados: unknown = await resposta.json()
  if (!Array.isArray(dados)) {
    throw new Error('BrasilAPI retornou payload inválido')
  }
  return (dados as FeriadoBruto[]).map(item => {
    if (typeof item?.date !== 'string' || typeof item?.name !== 'string') {
      throw new Error('BrasilAPI retornou item de feriado inválido')
    }
    return { date: item.date, name: item.name }
  })
}
