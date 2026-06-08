'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type QuadroAula = {
  id: string
  school_id: string
  ano_letivo_id: string
  turma_id: string
  data_inicial: string
  data_final: string
  tempo_aula_minutos: number
  intervalos: Intervalo[]
  status: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export type Intervalo = {
  hora_inicial: string
  hora_final: string
}

export type GradeHorario = {
  dia_semana: number
  horario_inicial: string
  horario_final: string
  disciplina_id?: string | null
  professor_id?: string | null
  key: string
}

export type HorarioRow = {
  id?: string
  quadro_aula_id?: string
  dia_semana: number
  horario_inicial: string
  horario_final: string
  disciplina_id: string | null
  professor_id: string | null
}

// ------- Listagem -------

export async function getQuadrosAulas(schoolId: string | null, anoLetivoId?: string) {
  try {
    let query = supabase
      .from('quadro_aulas')
      .select('*, turma:turma_id(nome, codigo_inep), academico_anos_letivos(descricao)')

    if (schoolId) query = query.eq('school_id', schoolId)

    if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  } catch (e: any) {
    if (e?.code === '42P01' || e?.code === '42703' || e?.message?.includes?.('does not exist')) {
      return []
    }
    throw e
  }
}

export async function getQuadroAula(id: string, schoolId?: string | null) {
  try {
    let quadroQuery = supabase
      .from('quadro_aulas')
      .select('*, turma:turma_id(*), academico_anos_letivos(descricao)')
      .eq('id', id);
    if (schoolId) quadroQuery = quadroQuery.eq('school_id', schoolId);

    const [quadroResult, horariosResult] = await Promise.all([
      quadroQuery.single(),
      supabase
        .from('quadro_aulas_horarios')
        .select('*, disciplina:disciplina_id(academico_disciplinas(nome)), professor:professor_id(nome_completo)')
        .eq('quadro_aula_id', id)
        .eq('ativo', true)
        .order('dia_semana')
        .order('horario_inicial'),
    ])

    if (quadroResult.error) throw quadroResult.error

    return {
      quadro: quadroResult.data as any,
      horarios: (horariosResult.data || []) as any[],
    }
  } catch (e: any) {
    if (e?.code === '42P01' || e?.code === '42703' || e?.message?.includes?.('does not exist')) {
      return { quadro: null, horarios: [] }
    }
    throw e
  }
}

async function validarPermWrite(recurso: string, acao: 'criar' | 'editar' | 'excluir', pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, acao)
  }
}

// ------- CRUD -------

export async function createQuadroAula(data: {
  school_id: string
  ano_letivo_id: string
  turma_id: string
  data_inicial: string
  data_final: string
  tempo_aula_minutos: number
  intervalos?: Intervalo[]
  status?: string
  horarios?: HorarioRow[]
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'criar', pessoaId)
  const { horarios, ...quadroData } = data

  const { data: quadro, error } = await supabase
    .from('quadro_aulas')
    .insert({
      ...quadroData,
      intervalos: quadroData.intervalos || [],
      status: quadroData.status || 'futuro',
    })
    .select()
    .single()

  if (error) throw error

  if (horarios && horarios.length > 0) {
    const horariosInsert = horarios.map(h => ({
      quadro_aula_id: quadro.id,
      dia_semana: h.dia_semana,
      horario_inicial: h.horario_inicial,
      horario_final: h.horario_final,
      disciplina_id: h.disciplina_id || null,
      professor_id: h.professor_id || null,
    }))
    const { error: errH } = await supabase.from('quadro_aulas_horarios').insert(horariosInsert)
    if (errH) throw errH
  }

  return quadro
}

export async function updateQuadroAula(id: string, data: {
  data_inicial?: string
  data_final?: string
  tempo_aula_minutos?: number
  intervalos?: Intervalo[]
  status?: string
  ativo?: boolean
  horarios?: HorarioRow[]
}, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'editar', pessoaId)
  const { horarios, ...updateData } = data

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.from('quadro_aulas').update(updateData).eq('id', id)
    if (error) throw error
  }

  if (horarios !== undefined) {
    await supabase.from('quadro_aulas_horarios').update({ ativo: false }).eq('quadro_aula_id', id)

    if (horarios.length > 0) {
      const horariosInsert = horarios.map(h => ({
        quadro_aula_id: id,
        dia_semana: h.dia_semana,
        horario_inicial: h.horario_inicial,
        horario_final: h.horario_final,
        disciplina_id: h.disciplina_id || null,
        professor_id: h.professor_id || null,
      }))
      const { error: errH } = await supabase.from('quadro_aulas_horarios').insert(horariosInsert)
      if (errH) throw errH
    }
  }
}

export async function deleteQuadroAula(id: string, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'excluir', pessoaId)
  const { error } = await supabase.from('quadro_aulas').delete().eq('id', id)
  if (error) throw error
}

export async function toggleQuadroAulaAtivo(id: string, ativo: boolean, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'editar', pessoaId)
  const { error } = await supabase.from('quadro_aulas').update({ ativo }).eq('id', id)
  if (error) throw error
}

// ------- Geração da grade -------

export type SlotGerado = {
  dia_semana: number
  horario_inicial: string
  horario_final: string
}

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTimeStr(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

export async function gerarGradeHorarios(
  turnos: { turno: string; horario_inicial: string; horario_final: string }[],
  diasFuncionamento: string[],
  tempoAulaMinutos: number,
  intervalos: Intervalo[]
): Promise<SlotGerado[]> {
  const DIAS_MAP: Record<string, number> = {
    'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3,
    'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6,
  }

  const diasNumeros = diasFuncionamento
    .map(d => DIAS_MAP[d])
    .filter(d => d !== undefined)

  if (diasNumeros.length === 0) return []

  if (tempoAulaMinutos < 1) return []

  const intervalosMin = intervalos.map(i => ({
    inicio: parseTimeToMinutes(i.hora_inicial),
    fim: parseTimeToMinutes(i.hora_final),
  }))

  // Ordenar intervalos
  intervalosMin.sort((a, b) => a.inicio - b.inicio)

  const slots: SlotGerado[] = []

  for (const turno of turnos) {
    const start = parseTimeToMinutes(turno.horario_inicial)
    const end = parseTimeToMinutes(turno.horario_final)

    let current = start

    while (current + tempoAulaMinutos <= end) {
      const slotEnd = current + tempoAulaMinutos

      // Verificar sobreposição com intervalos
      let overlapping = false
      for (const iv of intervalosMin) {
        if (current < iv.fim && slotEnd > iv.inicio) {
          // Slot cruza com intervalo: pular para o fim do intervalo
          current = iv.fim
          overlapping = true
          break
        }
      }

      if (overlapping) continue

      // Slot válido: criar para cada dia
      for (const dia of diasNumeros) {
        slots.push({
          dia_semana: dia,
          horario_inicial: minutesToTimeStr(current),
          horario_final: minutesToTimeStr(slotEnd),
        })
      }

      current = slotEnd
    }
  }

  return slots
}

// ------- Validação de conflitos -------

export type ConflitoInfo = {
  horario_inicial: string
  horario_final: string
  dia_semana: number
  professor_id: string
  professor_nome: string
  turma_id: string
  turma_nome: string
  quadro_aula_id: string
}

export async function validarConflitosProfessor(
  professorId: string,
  diaSemana: number,
  horarioInicial: string,
  horarioFinal: string,
  ignoreQuadroId?: string
): Promise<ConflitoInfo[]> {
  const { data, error } = await supabase
    .from('quadro_aulas_horarios')
    .select(`
      horario_inicial, horario_final, dia_semana,
      professor:professor_id(nome_completo),
      quadro:quadro_aula_id!inner(
        id, turma_id,
        turma:turma_id(nome)
      )
    `)
    .eq('professor_id', professorId)
    .eq('dia_semana', diaSemana)
    .eq('ativo', true)
    .not('professor_id', 'is', null)

  if (error) throw error

  if (!data || data.length === 0) return []

  const currentStart = parseTimeToMinutes(horarioInicial)
  const currentEnd = parseTimeToMinutes(horarioFinal)

  const conflitos: ConflitoInfo[] = []

  for (const row of data as any[]) {
    if (ignoreQuadroId && row.quadro?.id === ignoreQuadroId) continue

    const existingStart = parseTimeToMinutes(row.horario_inicial)
    const existingEnd = parseTimeToMinutes(row.horario_final)

    // Verificar sobreposição
    if (currentStart < existingEnd && currentEnd > existingStart) {
      conflitos.push({
        horario_inicial: row.horario_inicial,
        horario_final: row.horario_final,
        dia_semana: row.dia_semana,
        professor_id: professorId,
        professor_nome: row.professor?.nome_completo || 'Desconhecido',
        turma_id: row.quadro?.turma_id,
        turma_nome: row.quadro?.turma?.nome || 'Desconhecida',
        quadro_aula_id: row.quadro?.id,
      })
    }
  }

  return conflitos
}

export async function validarSobreposicaoVigencia(
  turmaId: string,
  dataInicial: string,
  dataFinal: string,
  ignoreQuadroId?: string
): Promise<boolean> {
  let query = supabase
    .from('quadro_aulas')
    .select('id')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .neq('status', 'inativo')

  if (ignoreQuadroId) query = query.neq('id', ignoreQuadroId)

  const { data, error } = await query

  if (error) throw error
  if (!data || data.length === 0) return false

  const newStart = new Date(dataInicial).getTime()
  const newEnd = new Date(dataFinal).getTime()

  for (const row of data) {
    const { data: qData } = await supabase
      .from('quadro_aulas')
      .select('data_inicial, data_final')
      .eq('id', row.id)
      .single()

    if (qData) {
      const existingStart = new Date(qData.data_inicial).getTime()
      const existingEnd = new Date(qData.data_final).getTime()

      if (newStart <= existingEnd && newEnd >= existingStart) {
        return true // há sobreposição
      }
    }
  }

  return false
}

// ------- Turmas para select -------

export async function getTurmasAtivas(schoolId: string | null) {
  let query = supabase
    .from('turmas')
    .select('id, nome, codigo_inep, turnos, dias_funcionamento')
    .eq('ativo', true)
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getDisciplinasDaTurma(turmaId: string) {
  const { data, error } = await supabase
    .from('turmas_disciplinas')
    .select('*, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome, nome_abreviado))')
    .eq('turma_id', turmaId)

  if (error) throw error
  return data as any[]
}

export async function getProfessoresDaTurma(turmaId: string) {
  const { data, error } = await supabase
    .from('turmas_profissionais')
    .select('*, people(nome_completo, codigo_pessoa)')
    .eq('turma_id', turmaId)
    .eq('ativo', true)

  if (error) throw error
  return data as any[]
}

export async function getAnosLetivosAtivos(schoolId: string | null) {
  let query = supabase
    .from('academico_anos_letivos')
    .select('id, descricao, data_inicio, data_termino, status')
    .order('descricao', { ascending: false })

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}
