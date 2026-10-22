// Helpers puros do domínio financeiro (spec 043).
// Módulo neutro: sem 'use server' — apenas funções síncronas testáveis.

import type {
  Configuracao,
  SituacaoMatriculaFat,
  SituacaoMensalidade,
  SituacaoMensalidadeDerivada,
} from './faturamento-tipos'

export function ultimoDiaDoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate()
}

export function competenciaDe(ano: number, mes: number): string {
  return `${ano}-${String(mes).padStart(2, '0')}-01`
}

export function mesDeCompetencia(competencia: string): number {
  return Number(competencia.slice(5, 7))
}

export function anoDeCompetencia(competencia: string): number {
  return Number(competencia.slice(0, 4))
}

export function calcularVencimento(ano: number, mes: number, dia: number): string {
  const diaAjustado = Math.min(dia, ultimoDiaDoMes(ano, mes))
  return `${ano}-${String(mes).padStart(2, '0')}-${String(diaAjustado).padStart(2, '0')}`
}

export function gerarCompetencias(ano: number, mesInicial: number, mesFinal: number): string[] {
  const lista: string[] = []
  for (let mes = mesInicial; mes <= mesFinal; mes++) {
    lista.push(competenciaDe(ano, mes))
  }
  return lista
}

export function hojeISO(): string {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function somenteData(iso: string): string {
  return iso.slice(0, 10)
}

export function derivarSituacaoMensalidade(
  situacao: SituacaoMensalidade,
  vencimento: string,
  hoje: string = hojeISO()
): SituacaoMensalidadeDerivada {
  if (situacao === 'pendente' && somenteData(vencimento) < somenteData(hoje)) return 'vencida'
  return situacao
}

export function derivarSituacaoMatricula(
  temPlano: boolean,
  mensalidades: { situacao: SituacaoMensalidade; vencimento: string }[],
  hoje: string = hojeISO()
): SituacaoMatriculaFat {
  if (!temPlano) return 'sem_plano'
  const hojeDia = somenteData(hoje)
  let temPendente = false
  for (const m of mensalidades) {
    if (m.situacao !== 'pendente') continue
    if (somenteData(m.vencimento) < hojeDia) return 'vencida'
    temPendente = true
  }
  return temPendente ? 'pendente' : 'em_dia'
}

export function resolverConfiguracao(
  etapaEnsinoId: string,
  configuracoes: Pick<Configuracao, 'id' | 'etapa_ids'>[]
): { configId: string | null; ambigua: boolean } {
  const cobre = configuracoes.filter(
    c => c.etapa_ids !== null && c.etapa_ids.includes(etapaEnsinoId)
  )
  if (cobre.length === 1) return { configId: cobre[0].id, ambigua: false }
  if (cobre.length > 1) {
    const ordenadas = [...cobre].sort((a, b) => (a.etapa_ids?.length ?? 0) - (b.etapa_ids?.length ?? 0))
    const menor = ordenadas[0].etapa_ids?.length ?? 0
    const empatadas = ordenadas.filter(c => (c.etapa_ids?.length ?? 0) === menor)
    if (empatadas.length > 1) return { configId: null, ambigua: true }
    return { configId: ordenadas[0].id, ambigua: false }
  }
  const geral = configuracoes.find(c => c.etapa_ids === null)
  return { configId: geral ? geral.id : null, ambigua: false }
}

export function mesDeDataISO(dataISO: string): number {
  return Number(somenteData(dataISO).slice(5, 7))
}

export function anoDeDataISO(dataISO: string): number {
  return Number(somenteData(dataISO).slice(0, 4))
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarCompetencia(competencia: string): string {
  const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const mes = mesDeCompetencia(competencia)
  const ano = anoDeCompetencia(competencia)
  return `${nomes[mes - 1]}/${ano}`
}

export const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function somenteDigitos(texto: string, max = 12): string {
  return texto.replace(/\D/g, '').slice(0, max).replace(/^0+(?=\d)/, '')
}

export function formatarCentavosParaBRL(digitos: string): string {
  const n = Number(digitos === '' ? '0' : digitos) / 100
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function centavosDeValor(valor: number): string {
  return String(Math.round(valor * 100))
}
