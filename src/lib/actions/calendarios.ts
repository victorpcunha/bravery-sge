'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import {
  PREFIXO_FERIADO_NACIONAL,
  anosDoIntervalo,
  buscarFeriadosNacionais,
  filtrarPorIntervalo,
  mapearParaEvento,
  type FeriadoNacional,
} from '@/lib/feriados-api'

const supabase = getSupabaseAdmin()

export type AnoLetivo = {
  id: string
  school_id: string
  descricao: string
  data_inicio: string
  data_termino: string
  status: 'ativo' | 'planejamento' | 'encerrado'
  created_at: string
  updated_at: string
}

export type Calendario = {
  id: string
  ano_letivo_id: string
  descricao: string
  data_inicio: string
  data_termino: string
  etapas: string[]
  created_at: string
  updated_at: string
}

export type EventoCalendario = {
  id: string
  calendario_id: string
  descricao: string
  tipo: 'dia_letivo' | 'recesso' | 'nao_letivo' | 'periodo_avaliativo'
  data_inicio: string
  data_termino: string
  etapas: string[]
  recorrencia_tipo: 'nao_repete' | 'todos_dias' | 'dias_semana'
  recorrencia_dias: string[]
  created_at: string
  updated_at: string
}

async function registrar(
  acao: 'criar' | 'editar' | 'excluir',
  modulo: string,
  entidade: string,
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo,
    entidade,
    entidade_id,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

async function schoolIdDoAnoLetivo(anoLetivoId: string): Promise<string | null> {
  const { data } = await supabase
    .from('academico_anos_letivos')
    .select('school_id')
    .eq('id', anoLetivoId)
    .maybeSingle()
  return data?.school_id || null
}

async function schoolIdDoCalendario(calendarioId: string): Promise<string | null> {
  const { data } = await supabase
    .from('academico_calendarios')
    .select('ano_letivo_id')
    .eq('id', calendarioId)
    .maybeSingle()
  if (!data?.ano_letivo_id) return null
  return schoolIdDoAnoLetivo(data.ano_letivo_id)
}

// ============================================
// Anos Letivos
// ============================================

export async function getAnosLetivos(schoolId: string | null) {
  let query = supabase
    .from('academico_anos_letivos')
    .select('*')
    .order('descricao', { ascending: false })

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query

  if (error) throw error
  return data as AnoLetivo[]
}

export async function getAnoLetivo(id: string) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as AnoLetivo
}

export async function createAnoLetivo(ano: Partial<AnoLetivo>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .insert(ano)
    .select()
    .single()

  if (error) throw error

  await registrar('criar', 'Estrutura Acadêmica — Anos Letivos', 'academico_anos_letivos', data.id, pessoaId, data.school_id, null, data)
  return data as AnoLetivo
}

export async function updateAnoLetivo(id: string, ano: Partial<AnoLetivo>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .update(ano)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrar('editar', 'Estrutura Acadêmica — Anos Letivos', 'academico_anos_letivos', id, pessoaId, data.school_id, anterior, data)
  return data as AnoLetivo
}

export async function deleteAnoLetivo(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_anos_letivos')
    .delete()
    .eq('id', id)

  if (error) throw error

  await registrar('excluir', 'Estrutura Acadêmica — Anos Letivos', 'academico_anos_letivos', id, pessoaId, anterior?.school_id, anterior, null)
}

export async function encerrarAnoLetivo(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .update({ status: 'encerrado' })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrar('editar', 'Estrutura Acadêmica — Anos Letivos', 'academico_anos_letivos', id, pessoaId, data.school_id, anterior, data)
  return data as AnoLetivo
}

// ============================================
// Calendários
// ============================================

export async function getCalendarios(anoLetivoId: string) {
  const { data, error } = await supabase
    .from('academico_calendarios')
    .select('*')
    .eq('ano_letivo_id', anoLetivoId)
    .order('descricao', { ascending: true })

  if (error) throw error
  return data as Calendario[]
}

export async function createCalendario(calendario: Partial<Calendario>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('academico_calendarios')
    .insert(calendario)
    .select()
    .single()

  if (error) throw error

  const schoolId = await schoolIdDoAnoLetivo(data.ano_letivo_id)
  await registrar('criar', 'Estrutura Acadêmica — Calendários', 'academico_calendarios', data.id, pessoaId, schoolId, null, data)

  const feriados = await semearFeriados(
    { id: data.id, data_inicio: data.data_inicio, data_termino: data.data_termino },
    pessoaId,
    schoolId,
    null
  )
  return { calendario: data as Calendario, feriados }
}

export type ResultadoSemeadura = { inseridos: number; ignorados: number; erro?: string }

type Intervalo = { inicio: string; fim: string }

function normalizarDia(valor: string): string {
  return valor.split('T')[0]
}

function intervalosSobrepostos(inicioA: string, fimA: string, inicioB: string, fimB: string): boolean {
  return normalizarDia(inicioA) <= normalizarDia(fimB) && normalizarDia(inicioB) <= normalizarDia(fimA)
}

const TIPOS_BLOQUEADORES = ['recesso', 'nao_letivo', 'dia_letivo']

/**
 * Semeia feriados nacionais como eventos `recesso` no calendário.
 * Best-effort: falha da fonte nunca lança — retorna `erro` e o calendário segue persistido.
 * Leitura nunca toca a API: tudo é lido/escrito em `academico_calendario_eventos`.
 */
async function semearFeriados(
  calendario: { id: string; data_inicio: string; data_termino: string },
  pessoaId: string | null | undefined,
  schoolId: string | null,
  somenteForaDe: Intervalo | null
): Promise<ResultadoSemeadura> {
  const inicio = normalizarDia(calendario.data_inicio)
  const fim = normalizarDia(calendario.data_termino)

  let todos: FeriadoNacional[] = []
  try {
    const porAno = await Promise.all(
      anosDoIntervalo(inicio, fim).map(ano => buscarFeriadosNacionais(ano))
    )
    todos = porAno.flat()
  } catch {
    return { inseridos: 0, ignorados: 0, erro: 'falha-fonte' }
  }

  const { data: existentes } = await supabase
    .from('academico_calendario_eventos')
    .select('descricao, tipo, data_inicio, data_termino')
    .eq('calendario_id', calendario.id)

  const eventos = existentes || []
  let inseridos = 0
  let ignorados = 0

  for (const feriado of filtrarPorIntervalo(todos, inicio, fim)) {
    if (somenteForaDe && feriado.date >= somenteForaDe.inicio && feriado.date <= somenteForaDe.fim) {
      ignorados++
      continue
    }
    const bloqueado = eventos.some(
      e => TIPOS_BLOQUEADORES.includes(e.tipo) &&
        intervalosSobrepostos(e.data_inicio, e.data_termino, feriado.date, feriado.date)
    )
    if (bloqueado) {
      ignorados++
      continue
    }
    const { data, error } = await supabase
      .from('academico_calendario_eventos')
      .insert(mapearParaEvento(feriado, calendario.id))
      .select()
      .single()
    if (error || !data) {
      return { inseridos, ignorados, erro: 'falha-banco' }
    }
    eventos.push({ descricao: data.descricao, tipo: data.tipo, data_inicio: data.data_inicio, data_termino: data.data_termino })
    await registrar('criar', 'Estrutura Acadêmica — Calendários', 'academico_calendario_eventos', data.id, pessoaId, schoolId, null, data)
    inseridos++
  }

  return { inseridos, ignorados }
}

async function temFeriadoSemeado(calendarioId: string): Promise<boolean> {
  const { count } = await supabase
    .from('academico_calendario_eventos')
    .select('id', { count: 'exact', head: true })
    .eq('calendario_id', calendarioId)
    .like('descricao', `${PREFIXO_FERIADO_NACIONAL}%`)
  return (count || 0) > 0
}

export async function updateCalendario(id: string, calendario: Partial<Calendario>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_calendarios')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('academico_calendarios')
    .update(calendario)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  const schoolId = data.ano_letivo_id ? await schoolIdDoAnoLetivo(data.ano_letivo_id) : null
  await registrar('editar', 'Estrutura Acadêmica — Calendários', 'academico_calendarios', id, pessoaId, schoolId, anterior, data)

  const semeado = await temFeriadoSemeado(id)
  const somenteForaDe = semeado && anterior?.data_inicio && anterior?.data_termino
    ? { inicio: normalizarDia(anterior.data_inicio), fim: normalizarDia(anterior.data_termino) }
    : null
  const feriados = await semearFeriados(
    { id, data_inicio: data.data_inicio, data_termino: data.data_termino },
    pessoaId,
    schoolId,
    somenteForaDe
  )
  return { calendario: data as Calendario, feriados }
}

export async function deleteCalendario(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_calendarios')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_calendarios')
    .delete()
    .eq('id', id)

  if (error) throw error

  const schoolId = anterior?.ano_letivo_id ? await schoolIdDoAnoLetivo(anterior.ano_letivo_id) : null
  await registrar('excluir', 'Estrutura Acadêmica — Calendários', 'academico_calendarios', id, pessoaId, schoolId, anterior, null)
}

// ============================================
// Eventos do Calendário
// ============================================

export async function getEventos(calendarioId: string) {
  const { data, error } = await supabase
    .from('academico_calendario_eventos')
    .select('*')
    .eq('calendario_id', calendarioId)
    .order('data_inicio', { ascending: true })

  if (error) throw error
  return data as EventoCalendario[]
}

export async function createEvento(evento: Partial<EventoCalendario>, pessoaId?: string | null) {
  const { data, error } = await supabase
    .from('academico_calendario_eventos')
    .insert(evento)
    .select()
    .single()

  if (error) throw error

  const schoolId = evento.calendario_id ? await schoolIdDoCalendario(evento.calendario_id) : null
  await registrar('criar', 'Estrutura Acadêmica — Calendários', 'academico_calendario_eventos', data.id, pessoaId, schoolId, null, data)
  return data as EventoCalendario
}

export async function updateEvento(id: string, evento: Partial<EventoCalendario>, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_calendario_eventos')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('academico_calendario_eventos')
    .update(evento)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  const schoolId = data.calendario_id ? await schoolIdDoCalendario(data.calendario_id) : null
  await registrar('editar', 'Estrutura Acadêmica — Calendários', 'academico_calendario_eventos', id, pessoaId, schoolId, anterior, data)
  return data as EventoCalendario
}

export async function deleteEvento(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('academico_calendario_eventos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_calendario_eventos')
    .delete()
    .eq('id', id)

  if (error) throw error

  const schoolId = anterior?.calendario_id ? await schoolIdDoCalendario(anterior.calendario_id) : null
  await registrar('excluir', 'Estrutura Acadêmica — Calendários', 'academico_calendario_eventos', id, pessoaId, schoolId, anterior, null)
}