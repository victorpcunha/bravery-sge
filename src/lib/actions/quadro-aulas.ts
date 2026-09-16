'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import { garantirTurmaAberta } from './garantir-turma-aberta'

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

async function dadosQuadroAula(quadroAulaId: string): Promise<{ nome?: string; school_id?: string }> {
  const { data } = await supabase
    .from('quadro_aulas')
    .select('id, school_id, turma_id')
    .eq('id', quadroAulaId)
    .maybeSingle()

  if (!data) return {}
  const { data: turma } = await supabase
    .from('turmas')
    .select('nome')
    .eq('id', data.turma_id)
    .maybeSingle()
  return { nome: turma?.nome || null, school_id: data.school_id }
}

async function registrarQuadro(
  acao: 'criar' | 'editar' | 'excluir',
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  registro_nome?: string | null,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Quadro de Aulas',
    entidade: 'quadro_aulas',
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
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
  await garantirTurmaAberta(data.turma_id)
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

  const { data: turma } = await supabase.from('turmas').select('nome').eq('id', quadro.turma_id).maybeSingle()
  await registrarQuadro('criar', quadro.id, pessoaId, quadro.school_id, turma?.nome || null, null, quadro)

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

  const { data: anterior } = await supabase
    .from('quadro_aulas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('turma_id, school_id')
    .eq('id', id)
    .maybeSingle()
  if (quadro?.turma_id) await garantirTurmaAberta(quadro.turma_id)

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

  const { data: final } = await supabase
    .from('quadro_aulas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const info = await dadosQuadroAula(id)
  await registrarQuadro('editar', id, pessoaId, info.school_id || anterior?.school_id, info.nome || anterior?.nome, anterior, final)
}

export async function deleteQuadroAula(id: string, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'excluir', pessoaId)

  const { data: anterior } = await supabase
    .from('quadro_aulas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('quadro_aulas').delete().eq('id', id)
  if (error) throw error

  if (anterior) {
    const info = await dadosQuadroAula(id)
    await registrarQuadro('excluir', id, pessoaId, info.school_id || anterior.school_id, info.nome || anterior.nome, anterior, null)
  }
}

export async function toggleQuadroAulaAtivo(id: string, ativo: boolean, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'editar', pessoaId)

  const { data: anterior } = await supabase
    .from('quadro_aulas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase.from('quadro_aulas').update({ ativo }).eq('id', id)
  if (error) throw error

  const { data: final } = await supabase
    .from('quadro_aulas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (anterior) {
    const info = await dadosQuadroAula(id)
    await registrarQuadro('editar', id, pessoaId, info.school_id || anterior.school_id, info.nome || anterior.nome, anterior, final)
  }
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
  ignoreQuadroId?: string,
  // SPEC 030 FR-011: só conflita com quadros cuja vigência se sobrepõe a este período
  vigencia?: { dataInicial: string; dataFinal: string }
): Promise<ConflitoInfo[]> {
  const { data, error } = await supabase
    .from('quadro_aulas_horarios')
    .select(`
      horario_inicial, horario_final, dia_semana,
      professor:professor_id(nome_completo),
      quadro:quadro_aula_id!inner(
        id, turma_id, data_inicial, data_final, status, ativo,
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
  const novaIni = vigencia?.dataInicial?.slice(0, 10)
  const novaFim = vigencia?.dataFinal?.slice(0, 10)

  const conflitos: ConflitoInfo[] = []

  for (const row of data as any[]) {
    if (ignoreQuadroId && row.quadro?.id === ignoreQuadroId) continue
    // SPEC 030 FR-011: ignora quadros inativos e sem sobreposição de vigência
    if (row.quadro?.ativo === false || row.quadro?.status === 'inativo') continue
    if (novaIni && novaFim) {
      const exIni = row.quadro?.data_inicial?.slice(0, 10)
      const exFim = row.quadro?.data_final?.slice(0, 10)
      if (exIni && exFim && (novaFim < exIni || novaIni > exFim)) continue
    }

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

// ------- Aulas Extras (SPEC 030) -------

export type AulaExtra = {
  id?: string
  horario_inicial: string
  horario_final: string
  disciplina_id: string | null
  professor_id: string | null
}

export type DataExtra = {
  id: string
  quadro_aula_id: string
  data_aula: string
  intervalos: Intervalo[]
  aulas: AulaExtra[]
}

const DIAS_FUNCIONAMENTO_MAP: Record<string, number> = {
  'Domingo': 0, 'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3,
  'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6,
}

/**
 * Dias letivos extras do Calendário da Etapa da turma (ex: sábados letivos).
 * Derivação em tempo real — dias vazios não persistem (SPEC 030 FR-012/FR-014).
 * Retorna YYYY-MM-DD ordenadas, excluindo os dias de funcionamento regular.
 */
export async function getDiasExtrasDoCalendario(
  turmaId: string,
  dataInicial?: string,
  dataFinal?: string
): Promise<string[]> {
  const { data: turma } = await supabase
    .from('turmas')
    .select('ano_letivo_id, etapa_ensino_id, dias_funcionamento')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma?.ano_letivo_id) return []

  // Etapas: principal + multietapa (união)
  const etapaIds = new Set<string>()
  if (turma.etapa_ensino_id) etapaIds.add(turma.etapa_ensino_id)
  const { data: multi } = await supabase
    .from('turmas_multietapa')
    .select('etapa_ensino_id')
    .eq('turma_id', turmaId)
  for (const m of multi || []) {
    if (m.etapa_ensino_id) etapaIds.add(m.etapa_ensino_id)
  }

  const codigos = new Set<string>()
  if (etapaIds.size > 0) {
    const { data: etapas } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_codigo')
      .in('id', [...etapaIds])
    for (const e of etapas || []) {
      codigos.add(String((e as any).id))
      if ((e as any).etapa_codigo != null) codigos.add(String((e as any).etapa_codigo))
    }
  }

  const { data: calendarios } = await supabase
    .from('academico_calendarios')
    .select('id')
    .eq('ano_letivo_id', turma.ano_letivo_id)

  const calendarioIds = (calendarios || []).map(c => c.id)
  if (!calendarioIds.length) return []

  const { data: eventos } = await supabase
    .from('academico_calendario_eventos')
    .select('data_inicio, data_termino, etapas')
    .in('calendario_id', calendarioIds)
    .eq('tipo', 'dia_letivo')

  const aplicaveis = (eventos || []).filter(ev => {
    const etapasEv = Array.isArray(ev.etapas) ? (ev.etapas as string[]) : []
    if (!etapasEv.length) return true
    if ([...codigos].some(c => etapasEv.includes(c))) return true
    return false
  })

  // Dias de funcionamento regular (não são "extras")
  const diasFunc = Array.isArray(turma.dias_funcionamento) && turma.dias_funcionamento.length > 0
    ? new Set(turma.dias_funcionamento.map((d: string) => DIAS_FUNCIONAMENTO_MAP[d]).filter((d: number) => d !== undefined))
    : new Set([1, 2, 3, 4, 5])

  const ini = dataInicial?.slice(0, 10)
  const fim = dataFinal?.slice(0, 10)
  const datas = new Set<string>()

  for (const ev of aplicaveis) {
    const eIni = String(ev.data_inicio || '').slice(0, 10)
    const eFim = String(ev.data_termino || '').slice(0, 10)
    if (!eIni || !eFim) continue
    const start = ini && eIni < ini ? ini : eIni
    const end = fim && eFim > fim ? fim : eFim
    if (start > end) continue
    const [sy, sm, sd] = start.split('-').map(Number)
    const [ey, em, ed] = end.split('-').map(Number)
    const d = new Date(sy, sm - 1, sd, 12, 0, 0)
    const last = new Date(ey, em - 1, ed, 12, 0, 0)
    while (d <= last) {
      if (!diasFunc.has(d.getDay())) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        datas.add(`${y}-${m}-${day}`)
      }
      d.setDate(d.getDate() + 1)
    }
  }

  return [...datas].sort()
}

export async function getExtrasDoQuadro(quadroId: string): Promise<DataExtra[]> {
  const { data: datas, error } = await supabase
    .from('quadro_aulas_datas_extras')
    .select('*')
    .eq('quadro_aula_id', quadroId)
    .order('data_aula')

  if (error) {
    if ((error as any)?.code === '42P01' || (error as any)?.message?.includes?.('does not exist')) return []
    throw error
  }
  if (!datas?.length) return []

  const { data: horarios } = await supabase
    .from('quadro_aulas_extras_horarios')
    .select('*, disciplina:disciplina_id(academico_disciplinas(nome)), professor:professor_id(nome_completo)')
    .in('data_extra_id', datas.map(d => d.id))
    .eq('ativo', true)
    .order('horario_inicial')

  const porData = new Map<string, any[]>()
  for (const h of horarios || []) {
    const arr = porData.get(h.data_extra_id) || []
    arr.push(h)
    porData.set(h.data_extra_id, arr)
  }

  return datas.map(d => ({
    id: d.id,
    quadro_aula_id: d.quadro_aula_id,
    data_aula: String(d.data_aula).slice(0, 10),
    intervalos: (d.intervalos || []) as Intervalo[],
    aulas: (porData.get(d.id) || []).map(h => ({
      id: h.id,
      horario_inicial: String(h.horario_inicial).slice(0, 5),
      horario_final: String(h.horario_final).slice(0, 5),
      disciplina_id: h.disciplina_id || null,
      professor_id: h.professor_id || null,
    })),
  }))
}

export async function saveExtrasDoQuadro(
  quadroId: string,
  extras: { data_aula: string; intervalos?: Intervalo[]; aulas: AulaExtra[] }[],
  pessoaId?: string | null
) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'editar', pessoaId)

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('turma_id, school_id')
    .eq('id', quadroId)
    .maybeSingle()
  if (!quadro) throw new Error('Quadro não encontrado')
  await garantirTurmaAberta(quadro.turma_id)

  const { data: anteriores } = await supabase
    .from('quadro_aulas_datas_extras')
    .select('id, data_aula')
    .eq('quadro_aula_id', quadroId)
  const porData = new Map((anteriores || []).map(a => [String(a.data_aula).slice(0, 10), a.id]))

  for (const ex of extras) {
    const dataAula = ex.data_aula.slice(0, 10)
    let dataExtraId = porData.get(dataAula)

    if (!dataExtraId) {
      const { data: novo, error } = await supabase
        .from('quadro_aulas_datas_extras')
        .insert({ quadro_aula_id: quadroId, data_aula: dataAula, intervalos: ex.intervalos || [] })
        .select('id')
        .single()
      if (error) throw error
      dataExtraId = novo.id
    } else {
      const { error } = await supabase
        .from('quadro_aulas_datas_extras')
        .update({ intervalos: ex.intervalos || [] })
        .eq('id', dataExtraId)
      if (error) throw error
    }

    // Soft-inativa anteriores e reinsere (paridade com updateQuadroAula)
    await supabase.from('quadro_aulas_extras_horarios').update({ ativo: false }).eq('data_extra_id', dataExtraId)

    const validas = (ex.aulas || []).filter(a =>
      a.horario_inicial && a.horario_final && a.horario_final > a.horario_inicial && a.disciplina_id
    )
    if (validas.length > 0) {
      const { error } = await supabase.from('quadro_aulas_extras_horarios').insert(
        validas.map(a => ({
          data_extra_id: dataExtraId,
          horario_inicial: a.horario_inicial.slice(0, 5),
          horario_final: a.horario_final.slice(0, 5),
          disciplina_id: a.disciplina_id,
          professor_id: a.professor_id || null,
        }))
      )
      if (error) throw error
    }
  }

  const info = await dadosQuadroAula(quadroId)
  await registrarQuadro('editar', quadroId, pessoaId, info.school_id || quadro.school_id, info.nome || null, null, { aulas_extras: extras.length })
}

/**
 * Remove um bloco de data extra. SPEC 030 FR-014:
 * com frequência lançada → bloqueia (throws); sem → remove (UI confirma antes).
 */
export async function removerDataExtra(dataExtraId: string, pessoaId?: string | null) {
  await validarPermWrite('gestao-turmas.quadro-aulas', 'editar', pessoaId)

  const { data: bloco } = await supabase
    .from('quadro_aulas_datas_extras')
    .select('id, data_aula, quadro_aula_id, quadro:quadro_aula_id!inner(turma_id)')
    .eq('id', dataExtraId)
    .maybeSingle()

  if (!bloco) throw new Error('Data extra não encontrada')
  const turmaId = (bloco.quadro as any)?.turma_id
  const dataAula = String(bloco.data_aula).slice(0, 10)
  if (turmaId) await garantirTurmaAberta(turmaId)

  const [freqAula, freqDia] = await Promise.all([
    supabase.from('academico_frequencias_aula').select('id').eq('turma_id', turmaId).eq('data_aula', dataAula).limit(1),
    supabase.from('academico_frequencias_dia').select('id').eq('turma_id', turmaId).eq('dia_letivo', dataAula).limit(1),
  ])
  if ((freqAula.data?.length || 0) > 0 || (freqDia.data?.length || 0) > 0) {
    throw new Error('Não é possível remover esta data porque já existe frequência registrada para este dia. Exclua primeiro o registro de frequência no Diário de Classe.')
  }

  const { error } = await supabase.from('quadro_aulas_datas_extras').delete().eq('id', dataExtraId)
  if (error) throw error

  const info = await dadosQuadroAula(bloco.quadro_aula_id)
  await registrarQuadro('editar', bloco.quadro_aula_id, pessoaId, info.school_id, info.nome || null, null, { data_extra_removida: dataAula })
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
