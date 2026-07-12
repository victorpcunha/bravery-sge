import { supabase } from '@/lib/supabase'

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

export async function createAnoLetivo(ano: Partial<AnoLetivo>) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .insert(ano)
    .select()
    .single()

  if (error) throw error
  return data as AnoLetivo
}

export async function updateAnoLetivo(id: string, ano: Partial<AnoLetivo>) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .update(ano)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as AnoLetivo
}

export async function deleteAnoLetivo(id: string) {
  const { error } = await supabase
    .from('academico_anos_letivos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function encerrarAnoLetivo(id: string) {
  const { data, error } = await supabase
    .from('academico_anos_letivos')
    .update({ status: 'encerrado' })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
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

export async function createCalendario(calendario: Partial<Calendario>) {
  const { data, error } = await supabase
    .from('academico_calendarios')
    .insert(calendario)
    .select()
    .single()

  if (error) throw error
  return data as Calendario
}

export async function updateCalendario(id: string, calendario: Partial<Calendario>) {
  const { data, error } = await supabase
    .from('academico_calendarios')
    .update(calendario)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Calendario
}

export async function deleteCalendario(id: string) {
  const { error } = await supabase
    .from('academico_calendarios')
    .delete()
    .eq('id', id)

  if (error) throw error
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

export async function createEvento(evento: Partial<EventoCalendario>) {
  const { data, error } = await supabase
    .from('academico_calendario_eventos')
    .insert(evento)
    .select()
    .single()

  if (error) throw error
  return data as EventoCalendario
}

export async function updateEvento(id: string, evento: Partial<EventoCalendario>) {
  const { data, error } = await supabase
    .from('academico_calendario_eventos')
    .update(evento)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as EventoCalendario
}

export async function deleteEvento(id: string) {
  const { error } = await supabase
    .from('academico_calendario_eventos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// Utilitários
// ============================================

export function gerarDiasCalendario(dataInicio: string, dataTermino: string) {
  const inicio = new Date(dataInicio)
  const termino = new Date(dataTermino)
  const dias: { date: Date; diaSemana: number }[] = []
  
  const current = new Date(inicio)
  while (current <= termino) {
    dias.push({
      date: new Date(current),
      diaSemana: current.getDay()
    })
    current.setDate(current.getDate() + 1)
  }
  
  return dias
}

export function getDiasLetivosPorMes(dias: { date: Date; diaSemana: number }[], eventos: EventoCalendario[]) {
  const meses: Record<string, { dias: { date: Date; diaSemana: number; isLetivo: boolean; isRecesso: boolean }[]; totalLetivos: number }> = {}
  
  dias.forEach(dia => {
    const mesKey = `${dia.date.getFullYear()}-${String(dia.date.getMonth() + 1).padStart(2, '0')}`
    
    if (!meses[mesKey]) {
      meses[mesKey] = { dias: [], totalLetivos: 0 }
    }
    
    // Buscar TODOS os eventos que cobrem este dia (find() pega só o primeiro)
    const diaNormalizado = `${dia.date.getFullYear()}-${String(dia.date.getMonth() + 1).padStart(2, '0')}-${String(dia.date.getDate()).padStart(2, '0')}`
    const eventosDoDia = eventos.filter(e => {
      const dataInicioNorm = e.data_inicio.split('T')[0]
      const dataTerminoNorm = e.data_termino.split('T')[0]
      return diaNormalizado >= dataInicioNorm && diaNormalizado <= dataTerminoNorm
    })
    
    let isLetivo: boolean
    let isRecesso: boolean
    
    if (eventosDoDia.length > 0) {
      // Precedência: recesso > dia_letivo > nao_letivo > default
      const temRecesso = eventosDoDia.some(e => e.tipo === 'recesso')
      const temDiaLetivo = eventosDoDia.some(e => e.tipo === 'dia_letivo')
      const temNaoLetivo = eventosDoDia.some(e => e.tipo === 'nao_letivo')

      if (temRecesso) {
        isLetivo = false; isRecesso = true
      } else if (temDiaLetivo) {
        isLetivo = true; isRecesso = false
      } else if (temNaoLetivo) {
        isLetivo = false; isRecesso = false
      } else {
        isLetivo = dia.diaSemana !== 0 && dia.diaSemana !== 6; isRecesso = false
      }
    } else {
      isLetivo = dia.diaSemana !== 0 && dia.diaSemana !== 6; isRecesso = false
    }
    
    meses[mesKey].dias.push({
      date: dia.date,
      diaSemana: dia.diaSemana,
      isLetivo,
      isRecesso
    })
    
    if (isLetivo) {
      meses[mesKey].totalLetivos++
    }
  })
  
  return meses
}