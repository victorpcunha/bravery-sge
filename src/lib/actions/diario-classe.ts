'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type TurmaDiario = {
  id: string
  nome: string
  etapa_nome: string
  subetapa_nome: string | null
  total_alunos: number
  capacidade: number
  turno: string
}

export type AlunoMatriculado = {
  id: string
  nome_completo: string
  numero_chamada: number | null
  matricula_id: string
  data_matricula?: string
  data_saida?: string | null
}

export async function listarTurmasDiario(schoolId: string | null, pessoaId: string | null, anoLetivoId?: string) {
  let usaVinculo = false

  if (pessoaId) {
    const perfil = await supabase
      .from('people')
      .select('perfil_id')
      .eq('id', pessoaId)
      .maybeSingle()
      .then(r => r.data)

    if (perfil?.perfil_id) {
      const { data: perfilData } = await supabase
        .from('perfis')
        .select('usa_vinculo_turma')
        .eq('id', perfil.perfil_id)
        .maybeSingle()

      usaVinculo = perfilData?.usa_vinculo_turma ?? false
    }
  }

  let query = supabase
    .from('turmas')
    .select(`
      id, nome, capacidade_alunos, turnos,
      academico_etapas_ensino(etapa_nome, etapa_tipo)
    `)
    .eq('ativo', true)

  if (schoolId) query = query.eq('school_id', schoolId)

  if (anoLetivoId) {
    query = query.eq('ano_letivo_id', anoLetivoId)
  }

  if (usaVinculo && pessoaId) {
    const { data: vinculos } = await supabase
      .from('turmas_profissionais')
      .select('turma_id')
      .eq('person_id', pessoaId)

    const turmaIds = vinculos?.map(v => v.turma_id) || []
    if (turmaIds.length === 0) return []
    query = query.in('id', turmaIds)
  }

  const { data: turmas, error } = await query.order('nome')

  if (error) throw error

  const turmasComAlunos = await Promise.all((turmas || []).map(async (t: any) => {
    const { count } = await supabase
      .from('academico_matriculas')
      .select('*', { count: 'exact', head: true })
      .eq('turma_id', t.id)
      .eq('situacao', 'Ativo')

    const turnosArray = Array.isArray(t.turnos) ? t.turnos : []
    const primeiroTurno = turnosArray[0]
    const turnoLabel = typeof primeiroTurno === 'object' ? primeiroTurno.turno : (primeiroTurno || '')

    return {
      id: t.id,
      nome: t.nome,
      etapa_nome: t.academico_etapas_ensino?.etapa_nome || '',
      subetapa_nome: null,
      total_alunos: count || 0,
      capacidade: t.capacidade_alunos || 0,
      turno: turnoLabel,
    } as TurmaDiario
  }))

  return turmasComAlunos
}

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

export type TurmaDiarioInfo = {
  id: string
  nome: string
  ano_letivo_descricao: string
  etapa_nome: string
  capacidade_alunos: number
  total_alunos: number
  quadro_aula_id: string | null
}

export async function getTurmaDiarioInfo(turmaId: string, pessoaId?: string | null): Promise<TurmaDiarioInfo | null> {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  const { data: turma, error } = await supabase
    .from('turmas')
    .select('id, nome, capacidade_alunos, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (error) throw error
  if (!turma) return null

  const results = await Promise.all([
    supabase.from('academico_etapas_ensino').select('etapa_nome').eq('id', turma.etapa_ensino_id).maybeSingle(),
    supabase.from('academico_anos_letivos').select('descricao').eq('id', turma.ano_letivo_id).maybeSingle(),
    supabase.from('academico_matriculas').select('*', { count: 'exact', head: true }).eq('turma_id', turmaId).eq('situacao', 'Ativo'),
    supabase.from('quadro_aulas').select('id').eq('turma_id', turmaId).eq('ativo', true).maybeSingle(),
  ])

  return {
    id: turma.id,
    nome: turma.nome,
    ano_letivo_descricao: results[1].data?.descricao || '',
    etapa_nome: results[0].data?.etapa_nome || '',
    capacidade_alunos: turma.capacidade_alunos || 0,
    total_alunos: results[2].count || 0,
    quadro_aula_id: results[3].data?.id || null,
  }
}

export async function getAlunosDaTurma(turmaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)
  const { data: matriculas, error } = await supabase
    .from('academico_matriculas')
    .select('id, aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (error) throw error
  if (!matriculas?.length) return []

  const pessoaIds = matriculas.map(m => m.aluno_id)

  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', pessoaIds)
    .order('nome_completo')

  const pessoaMap = new Map((pessoas || []).map(p => [p.id, p]))

  return matriculas.map(m => ({
    id: m.aluno_id,
    nome_completo: pessoaMap.get(m.aluno_id)?.nome_completo || '',
    numero_chamada: null,
    matricula_id: m.id,
  })) as AlunoMatriculado[]
}

export async function getAlunosDaTurmaComPeriodo(turmaId: string, pessoaId?: string | null): Promise<AlunoMatriculado[]> {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  const { data: matriculas, error } = await supabase
    .from('academico_matriculas')
    .select('id, aluno_id, data_matricula, data_saida')
    .eq('turma_id', turmaId)

  if (error) throw error
  if (!matriculas?.length) return []

  const pessoaIds = matriculas.map(m => m.aluno_id)

  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', pessoaIds)
    .order('nome_completo')

  const pessoaMap = new Map((pessoas || []).map(p => [p.id, p]))

  return matriculas.map(m => ({
    id: m.aluno_id,
    matricula_id: m.id,
    nome_completo: pessoaMap.get(m.aluno_id)?.nome_completo || '',
    numero_chamada: null,
    data_matricula: m.data_matricula,
    data_saida: m.data_saida,
  }))
}

export async function gerarNumeroChamada(turmaId: string, pessoaId?: string | null) {
  const alunos = await getAlunosDaTurma(turmaId, pessoaId)
  const ordenados = alunos.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo))
  return ordenados.length
}

export async function getDisciplinasDiario(turmaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  let usaVinculo = false
  let disciplinasFiltro: string[] | null = null

  if (pessoaId) {
    const { data: perfil } = await supabase
      .from('people')
      .select('perfil_id')
      .eq('id', pessoaId)
      .maybeSingle()

    if (perfil?.perfil_id) {
      const { data: perfilData } = await supabase
        .from('perfis')
        .select('usa_vinculo_turma')
        .eq('id', perfil.perfil_id)
        .maybeSingle()

      usaVinculo = perfilData?.usa_vinculo_turma ?? false
    }
  }

  if (usaVinculo && pessoaId) {
    const { data: vinculos } = await supabase
      .from('turmas_profissionais')
      .select('disciplinas_ids')
      .eq('turma_id', turmaId)
      .eq('person_id', pessoaId)

    if (vinculos?.length) {
      disciplinasFiltro = vinculos.flatMap(v => v.disciplinas_ids || [])
      if (disciplinasFiltro.length === 0) return []
    }
  }

  let query = supabase
    .from('turmas_disciplinas')
    .select('id, matriz_disciplina_id')
    .eq('turma_id', turmaId)

  if (disciplinasFiltro && disciplinasFiltro.length > 0) {
    query = query.in('matriz_disciplina_id', disciplinasFiltro)
  }

  const { data: turmasDisc, error: err2 } = await query

  if (err2) throw err2
  if (!turmasDisc?.length) return []

  const matrizIds = turmasDisc.map(td => td.matriz_disciplina_id).filter(Boolean)

  const { data: matrizes } = await supabase
    .from('academico_matriz_disciplinas')
    .select('id, disciplina_id')
    .in('id', matrizIds)

  const matrizMap = new Map((matrizes || []).map(m => [m.id, m.disciplina_id]))

  const discIds = matrizes?.map(m => m.disciplina_id).filter(Boolean) || []

  const { data: disciplinas } = await supabase
    .from('academico_disciplinas')
    .select('id, nome, nome_abreviado')
    .in('id', discIds)
    .order('nome')

  const discMap = new Map((disciplinas || []).map(d => [d.id, d]))

  return turmasDisc.map(td => {
    const disc = discMap.get(matrizMap.get(td.matriz_disciplina_id) || '')
    return {
      id: td.id,
      matriz_disciplina_id: td.matriz_disciplina_id,
      disciplina_id: disc?.id || '',
      nome: disc?.nome || '',
      nome_abreviado: disc?.nome_abreviado || '',
    }
  })
}

export type FrequenciaDia = {
  id: string
  aluno_id: string
  dia_letivo: string
  status: 'P' | 'F' | 'FJ' | null
}

export async function registrarFrequenciaDia(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  diaLetivo: string,
  status: 'P' | 'F' | 'FJ' | null,
  pessoaId: string | null
) {
  if (diaLetivo > new Date().toISOString().split('T')[0]) {
    return { success: false, error: 'Não é permitido registrar frequência em data futura' }
  }

  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe', 'editar')
  }

  if (status) {
    const { data: existing } = await supabase
      .from('academico_frequencias_dia')
      .select('id')
      .eq('turma_id', turmaId)
      .eq('aluno_id', alunoId)
      .eq('dia_letivo', diaLetivo)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('academico_frequencias_dia')
        .update({ status, updated_by: pessoaId })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('academico_frequencias_dia')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          aluno_id: alunoId,
          dia_letivo: diaLetivo,
          status,
          created_by: pessoaId,
          updated_by: pessoaId,
        })

      if (error) throw error
    }
  } else {
    await supabase
      .from('academico_frequencias_dia')
      .delete()
      .eq('turma_id', turmaId)
      .eq('aluno_id', alunoId)
      .eq('dia_letivo', diaLetivo)
  }

  return { success: true }
}

export async function listarFrequenciasDia(turmaId: string, ano: number, mes: number, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)
  const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`
  const dataFim = new Date(ano, mes, 0)
  const ultimoDia = `${ano}-${String(mes).padStart(2, '0')}-${String(dataFim.getDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('academico_frequencias_dia')
    .select('id, aluno_id, dia_letivo, status')
    .eq('turma_id', turmaId)
    .gte('dia_letivo', primeiroDia)
    .lte('dia_letivo', ultimoDia)

  if (error) throw error
  return (data || []) as FrequenciaDia[]
}

export async function getMetodoAvaliacaoDaTurma(turmaId: string) {
  const { data: turma, error: err1 } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (err1) throw err1
  if (!turma) return null

  const { data: matriz, error: err2 } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)

  if (err2) throw err2
  if (!matriz?.length) return null

  const metodoId = matriz[0].metodo_avaliacao_id

  const { data: metodo } = await supabase
    .from('academico_metodos_avaliacao')
    .select('id, nome, criterio_frequencia, tipos_avaliacao, quantidade_periodos_numerico, quantidade_periodos_parecer, quantidade_periodos_conceito, quantidade_periodos_nivel')
    .eq('id', metodoId)
    .maybeSingle()

  return metodo
}

export async function getDiasLetivosDaTurma(turmaId: string, ano: number, mes: number) {
  try {
    const { data: turma } = await supabase
      .from('turmas')
      .select('school_id, ano_letivo_id')
      .eq('id', turmaId)
      .maybeSingle()

    if (!turma) return gerarDiasUteis(ano, mes)

    const { data: calendarios } = await supabase
      .from('academico_calendarios')
      .select('id, data_inicio, data_termino')
      .eq('ano_letivo_id', turma.ano_letivo_id)

    const eventos = calendarios?.length
      ? await supabase
          .from('academico_calendario_eventos')
          .select('*')
          .in('calendario_id', calendarios.map(c => c.id))
          .then(r => r.data || [])
      : []

    const primeiroDia = new Date(ano, mes - 1, 1)
    const ultimoDia = new Date(ano, mes, 0)
    const dias: number[] = []

    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      const diaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const diaSemana = d.getDay()

      const evento = eventos.find((e: any) => {
        const eInicio = e.data_inicio.split('T')[0]
        const eFim = e.data_termino.split('T')[0]
        return diaStr >= eInicio && diaStr <= eFim
      })

      if (evento) {
        if (evento.tipo === 'dia_letivo') {
          dias.push(d.getDate())
        }
      } else if (diaSemana !== 0 && diaSemana !== 6) {
        dias.push(d.getDate())
      }
    }

    return dias
  } catch {
    return gerarDiasUteis(ano, mes)
  }
}

export type AulaQuadro = {
  horario_id: string
  data: string
  data_iso: string
  horario_inicial: string
  horario_final: string
  dia_semana: number
  numero_aula: number
}

export async function getAulasDaTurma(
  turmaId: string,
  matrizDisciplinaId: string,
  ano: number,
  mes: number,
  pessoaId?: string | null
): Promise<AulaQuadro[]> {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id, data_inicial, data_final')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!quadro) return []

  const { data: todosHorarios } = await supabase
    .from('quadro_aulas_horarios')
    .select('id, dia_semana, horario_inicial, horario_final, disciplina_id')
    .eq('quadro_aula_id', quadro.id)
    .eq('ativo', true)
    .order('horario_inicial')

  if (!todosHorarios?.length) return []

  const posicaoPorDia: Record<number, Map<string, number>> = {}
  for (const h of todosHorarios) {
    if (!posicaoPorDia[h.dia_semana]) posicaoPorDia[h.dia_semana] = new Map()
    posicaoPorDia[h.dia_semana].set(h.id, posicaoPorDia[h.dia_semana].size + 1)
  }

  const horariosFiltrados = todosHorarios.filter(h => h.disciplina_id === matrizDisciplinaId)

  if (!horariosFiltrados.length) return []

  const dataInicial = new Date(quadro.data_inicial)
  const dataFinal = new Date(quadro.data_final)
  const primeiroDia = new Date(ano, mes - 1, 1)
  const ultimoDia = new Date(ano, mes, 0)

  const aulas: AulaQuadro[] = []

  for (const horario of horariosFiltrados) {
    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== horario.dia_semana) continue

      const aulaData = new Date(d)
      if (aulaData < dataInicial || aulaData > dataFinal) continue

      const y = aulaData.getFullYear()
      const m = String(aulaData.getMonth() + 1).padStart(2, '0')
      const day = String(aulaData.getDate()).padStart(2, '0')

      aulas.push({
        horario_id: horario.id,
        data: `${y}-${m}-${day}`,
        data_iso: `${y}-${m}-${day}T${horario.horario_inicial}`,
        horario_inicial: horario.horario_inicial.slice(0, 5),
        horario_final: horario.horario_final.slice(0, 5),
        dia_semana: horario.dia_semana,
        numero_aula: posicaoPorDia[horario.dia_semana]?.get(horario.id) || 0,
      })
    }
  }

  aulas.sort((a, b) => a.data_iso.localeCompare(b.data_iso))
  return aulas
}

export type FrequenciaAula = {
  id: string
  horario_id: string
  aluno_id: string
  data_aula: string
  status: 'P' | 'F' | 'FJ' | null
}

export async function registrarFrequenciaAula(
  schoolId: string | null,
  turmaId: string,
  horarioId: string,
  alunoId: string,
  dataAula: string,
  status: 'P' | 'F' | 'FJ' | null,
  pessoaId: string | null
) {
  try {
    if (dataAula > new Date().toISOString().split('T')[0]) {
      return { success: false, error: 'Não é permitido registrar frequência em data futura' }
    }

    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe', 'editar')
    }

    const { data: horario } = await supabase
      .from('quadro_aulas_horarios')
      .select('disciplina_id')
      .eq('id', horarioId)
      .maybeSingle()

    if (!horario?.disciplina_id) {
      return { success: false, error: 'Horário sem disciplina vinculada' }
    }

    const disciplinaId = horario.disciplina_id

    if (status) {
      const { data: existing } = await supabase
        .from('academico_frequencias_aula')
        .select('id')
        .eq('horario_id', horarioId)
        .eq('aluno_id', alunoId)
        .eq('data_aula', dataAula)
        .maybeSingle()

      if (existing) {
        const { error } = await supabase
          .from('academico_frequencias_aula')
          .update({ status, updated_by: pessoaId })
          .eq('id', existing.id)
        if (error) return { success: false, error: error.message }
      } else {
        const { error } = await supabase
          .from('academico_frequencias_aula')
          .insert({
            school_id: schoolId,
            turma_id: turmaId,
            horario_id: horarioId,
            aluno_id: alunoId,
            disciplina_id: disciplinaId,
            data_aula: dataAula,
            status,
            created_by: pessoaId,
            updated_by: pessoaId,
          })
        if (error) return { success: false, error: error.message }
      }
    } else {
      const { error } = await supabase
        .from('academico_frequencias_aula')
        .delete()
        .eq('horario_id', horarioId)
        .eq('aluno_id', alunoId)
        .eq('data_aula', dataAula)
      if (error) return { success: false, error: error.message }
    }

    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro interno' }
  }
}

export async function listarFrequenciasAula(
  turmaId: string,
  matrizDisciplinaId: string,
  ano: number,
  mes: number,
  pessoaId?: string | null
): Promise<FrequenciaAula[]> {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`
  const dataFim = new Date(ano, mes, 0)
  const ultimoDia = `${ano}-${String(mes).padStart(2, '0')}-${String(dataFim.getDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('academico_frequencias_aula')
    .select('id, horario_id, aluno_id, data_aula, status')
    .eq('turma_id', turmaId)
    .eq('disciplina_id', matrizDisciplinaId)
    .gte('data_aula', primeiroDia)
    .lte('data_aula', ultimoDia)

  if (error) throw error
  return (data || []).map(d => ({
    ...d,
    status: d.status as 'P' | 'F' | 'FJ' | null,
  })) as FrequenciaAula[]
}

export type EstatisticasFrequencia = {
  totalDiasLetivos: number
  diasDisciplina?: number
  diasRegistrados: number
  totalAulas?: number
  aulasRegistradas?: number
  diasPendentes: number
  aulasPendentes?: number
}

export async function getEstatisticasFrequencia(
  turmaId: string,
  disciplinaId?: string,
  pessoaId?: string | null
): Promise<EstatisticasFrequencia> {
  await validarPermRead('gestao-pedagogica.diario-classe', pessoaId)

  const quadro = await supabase
    .from('quadro_aulas')
    .select('id, data_inicial, data_final, school_id')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()
    .then(r => r.data)

  if (!quadro) {
    return { totalDiasLetivos: 0, diasRegistrados: 0, diasPendentes: 0 }
  }

  const dataInicial = new Date(quadro.data_inicial)
  const dataFinal = new Date(quadro.data_final)

  let queryHorarios = supabase
    .from('quadro_aulas_horarios')
    .select('id, dia_semana, horario_inicial, horario_final')
    .eq('quadro_aula_id', quadro.id)
    .eq('ativo', true)

  if (disciplinaId) {
    queryHorarios = queryHorarios.eq('disciplina_id', disciplinaId)
  }

  const horarios = await queryHorarios.then(r => r.data || [])

  const eventos = await supabase
    .from('academico_calendarios')
    .select('id')
    .eq('school_id', quadro.school_id)
    .then(async r => {
      if (!r.data?.length) return []
      return supabase
        .from('academico_calendario_eventos')
        .select('data_inicio, data_termino, tipo')
        .in('calendario_id', r.data.map(c => c.id))
        .then(r2 => r2.data || [])
    })

  const diasLetivosSet = new Set<string>()
  const diasDisciplinaSet = new Set<string>()
  const aulasEsperadas: string[] = []
  const diasSemanaSet = new Set(horarios.map(h => h.dia_semana))

  for (let d = new Date(dataInicial); d <= dataFinal; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dataStr = `${y}-${m}-${day}`
    const diaSemana = d.getDay()

    if (diaSemana === 0 || diaSemana === 6) continue

    const evento = eventos.find((e: any) => dataStr >= e.data_inicio.split('T')[0] && dataStr <= e.data_termino.split('T')[0])

    if (evento) {
      if (evento.tipo !== 'dia_letivo') continue
    }

    diasLetivosSet.add(dataStr)

    if (diasSemanaSet.has(diaSemana)) {
      diasDisciplinaSet.add(dataStr)
      horarios.filter(h => h.dia_semana === diaSemana).forEach(h => {
        aulasEsperadas.push(`${h.id}_${dataStr}`)
      })
    }
  }

  const totalDiasLetivos = diasLetivosSet.size
  const diasDisciplina = disciplinaId ? diasDisciplinaSet.size : totalDiasLetivos
  const totalAulas = disciplinaId ? aulasEsperadas.length : 0

  let diasRegistrados = 0
  let aulasRegistradas = 0

  if (disciplinaId) {
    const { data: registros } = await supabase
      .from('academico_frequencias_aula')
      .select('horario_id, data_aula')
      .eq('turma_id', turmaId)
      .eq('disciplina_id', disciplinaId)
      .not('status', 'is', null)

    const diasSet = new Set<string>()
    const aulasSet = new Set<string>()
    ;(registros || []).forEach(r => {
      diasSet.add(r.data_aula)
      aulasSet.add(`${r.horario_id}_${r.data_aula}`)
    })
    diasRegistrados = diasSet.size
    aulasRegistradas = aulasSet.size
  } else {
    const { count } = await supabase
      .from('academico_frequencias_dia')
      .select('*', { count: 'exact', head: true })
      .eq('turma_id', turmaId)
      .not('status', 'is', null)

    diasRegistrados = count || 0
  }

  const result: EstatisticasFrequencia = {
    totalDiasLetivos,
    diasRegistrados,
    diasPendentes: (disciplinaId ? diasDisciplina : totalDiasLetivos) - diasRegistrados,
  }

  if (disciplinaId) {
    result.diasDisciplina = diasDisciplina
    result.totalAulas = totalAulas
    result.aulasRegistradas = aulasRegistradas
    result.aulasPendentes = totalAulas - aulasRegistradas
  }

  return result
}

function gerarDiasUteis(ano: number, mes: number) {
  const dias: number[] = []
  const total = new Date(ano, mes, 0).getDate()
  for (let dia = 1; dia <= total; dia++) {
    const d = new Date(ano, mes - 1, dia)
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dias.push(dia)
    }
  }
  return dias
}
