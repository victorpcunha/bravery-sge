// Helpers compartilhados do Censo Escolar — Situação do Aluno.
// Módulo sem diretiva 'use server': funções puras + acesso a Supabase,
// consumidas pelos módulos de validação e exportação (server actions).

import { getSupabaseAdmin } from '@/lib/auth'
import type { ErroValidacao } from './censo-types'
import { getCampoAmigavel, getDescricaoValor, gerarMensagemAmigavel } from '@/data/censo/rotulos-campos'
import { ETAPAS_ENSINO } from '@/data/censo/etapas-ensino'
import { DATA_REFERENCIA_CENSO } from '@/data/censo/referencias'

// ---------------------------------------------------------------------------
// VALORES/ETAPAS
// ---------------------------------------------------------------------------

export function parseEtapa(codigo: string | number | null | undefined): number | null {
  if (codigo === null || codigo === undefined || codigo === '') return null
  const n = typeof codigo === 'number' ? codigo : parseInt(String(codigo), 10)
  return Number.isNaN(n) ? null : n
}

export function etapaNome(codigo: number | null): string {
  if (codigo === null) return 'etapa desconhecida'
  const e = ETAPAS_ENSINO.find((x) => x.codigo === codigo)
  return e?.nome ?? `etapa ${codigo}`
}

export function ineiValido(codigo: string | null | undefined): boolean {
  return Boolean(codigo && /^\d{12}$/.test(codigo))
}

export function cpfValido(cpf: string | null | undefined): boolean {
  if (!cpf || !/^\d{11}$/.test(cpf)) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false
  for (let t = 9; t < 11; t++) {
    let soma = 0
    for (let i = 0; i < t; i++) soma += parseInt(cpf[i], 10) * (t + 1 - i)
    const dig = ((soma * 10) % 11) % 10
    if (parseInt(cpf[t], 10) !== dig) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// TURMAS — elegibilidade para os registros 90/91
// ---------------------------------------------------------------------------

export function turmaHasTipo(turma: Record<string, any>, tipo: string): boolean {
  const tt = turma.tipos_turma
  if (!tt) return false
  if (Array.isArray(tt)) return tt.includes(tipo)
  if (typeof tt === 'string') {
    try {
      const arr = JSON.parse(tt)
      return Array.isArray(arr) && arr.includes(tipo)
    } catch {
      return tt.includes(tipo)
    }
  }
  return false
}

export function turmaIsCurricular(turma: Record<string, any>): boolean {
  return !turmaHasTipo(turma, 'aee') && !turmaHasTipo(turma, 'complementar') && !turmaHasTipo(turma, 'atividade_complementar')
}

// Turma de itinerário formativo exclusivo = itinerário (IFA/IFTP/ITA) sem formação geral básica
function turmaIfExclusiva(turma: Record<string, any>): boolean {
  const temItinerario = Boolean(turma.ifa || turma.iftp || turma.ita)
  if (!temItinerario) return false
  const fgb = turma.fgb
  return !(fgb === true || fgb === '1' || fgb === 'true')
}

export function turmaEscolarizacaoNaoIfExclusiva(turma: Record<string, any>): boolean {
  if (!turma || !turmaIsCurricular(turma)) return false
  return !turmaIfExclusiva(turma)
}

// ---------------------------------------------------------------------------
// MATRÍCULAS
// ---------------------------------------------------------------------------

// Matrícula "admitida após" a data de referência do Censo (última quarta-feira de maio)
export function admitidaApos(dataMatricula: string | null | undefined): boolean {
  if (!dataMatricula) return false
  const d = new Date(dataMatricula)
  if (isNaN(d.getTime())) return false
  return d > DATA_REFERENCIA_CENSO
}

// Resolve o código INEP da etapa da matrícula: turma_multi > etapa da matrícula > etapa da turma
export function resolverEtapaMatricula(
  m: Record<string, any>,
  etapaMap: Map<string, number>,
  turmaEtapaNum: number | null,
): number | null {
  const multi = parseEtapa(m.turma_multi as string)
  if (multi !== null) return multi
  const viaEtapa = m.etapa_ensino_id ? etapaMap.get(m.etapa_ensino_id as string) : undefined
  if (viaEtapa !== undefined) return viaEtapa
  return turmaEtapaNum
}

export async function carregarMapEtapas(matriculas: Record<string, any>[]): Promise<Map<string, number>> {
  const ids = [...new Set(matriculas.map((m) => m.etapa_ensino_id).filter(Boolean))] as string[]
  const map = new Map<string, number>()
  if (ids.length === 0) return map
  const supabase = getSupabaseAdmin()
  const { data: etapas } = await supabase
    .from('academico_etapas_ensino')
    .select('id, etapa_codigo')
    .in('id', ids)
  for (const e of etapas || []) {
    const c = parseEtapa(e.etapa_codigo)
    if (c !== null) map.set(e.id, c)
  }
  return map
}

// ---------------------------------------------------------------------------
// ERROS — URL de correção + criação (equivalente a censo-regras.criarErro)
// ---------------------------------------------------------------------------

function getCorrectionUrlSF(
  schoolId: string,
  registro: string,
  entidadeId: string,
  entidadeNome: string,
  secao?: string,
): string {
  const params = new URLSearchParams()

  switch (registro) {
    case '89': {
      // Escola + gestor. Aba gestores para campos do gestor.
      let url = `/escolas/${schoolId}`
      if (secao === 'gestor' || secao === 'gestores') params.set('tab', 'gestores')
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    case '90':
    case '91': {
      // secao define o alvo da correção: turma / aluno / matrícula
      if (secao === 'turma') {
        let url = `/gestao-turmas/turmas`
        if (entidadeId) params.set('edit', entidadeId)
        if (params.size > 0) url += `?${params.toString()}`
        return url
      }
      if (secao === 'aluno') {
        let url = `/gestao-usuarios/usuarios`
        if (entidadeId) params.set('edit', entidadeId)
        if (params.size > 0) url += `?${params.toString()}`
        return url
      }
      // default → matrícula cadastro
      let url = `/gestao-academica/matriculas/cadastro`
      if (entidadeId) params.set('id', entidadeId)
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    default:
      return `/escolas/${schoolId}`
  }
}

export function criarErroSF(
  registro: string,
  campo_inep: string,
  numero_campo: number,
  regra: string,
  mensagem: string,
  entidade_id: string,
  entidade_nome: string,
  schoolId: string,
  valor_atual?: string,
  secao?: string,
  campo_destino?: string,
): ErroValidacao {
  const alvo = campo_destino || campo_inep
  return {
    registro,
    campo_inep,
    campo_amigavel: getCampoAmigavel(alvo),
    numero_campo,
    regra,
    mensagem: gerarMensagemAmigavel(alvo, mensagem),
    valor_atual: valor_atual ?? null,
    valor_atual_descricao: getDescricaoValor(alvo, valor_atual),
    entidade_id,
    entidade_nome,
    url_correcao: getCorrectionUrlSF(
      schoolId,
      registro,
      entidade_id,
      entidade_nome,
      secao,
    ),
    secao: secao ?? null,
    campo_destino: campo_destino ?? null,
  }
}