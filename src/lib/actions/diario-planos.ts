'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import { type PlanoAula } from './plano-ensino'
import { garantirTurmaAberta, verificarTurmaFechadaPublica } from './garantir-turma-aberta'

const RESOURCE = 'gestao-pedagogica.diario-classe.planos'
const supabase = getSupabaseAdmin()

async function validarPermRead(pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'visualizar')
  }
}

async function validarPermWrite(pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'editar')
  }
}

type PlanoAplicado = {
  id: string
  turma_id: string
  matriz_disciplina_id: string
  data_aula: string
  horario_id: string | null
  plano_aula_id: string
  created_by: string | null
  created_at: string
  plano_aula: PlanoAula
}

export async function listarDiasComAula(
  turmaId: string,
  matrizDisciplinaId: string,
  ano: number,
  mes: number,
  pessoaId?: string | null
): Promise<string[]> {
  await validarPermRead(pessoaId)

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id, data_inicial, data_final')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!quadro) return []

  const { data: horarios } = await supabase
    .from('quadro_aulas_horarios')
    .select('dia_semana')
    .eq('quadro_aula_id', quadro.id)
    .eq('disciplina_id', matrizDisciplinaId)
    .eq('ativo', true)

  if (!horarios?.length) return []

  const diasSemana = new Set(horarios.map(h => h.dia_semana))
  const dataInicial = new Date(quadro.data_inicial)
  const dataFinal = new Date(quadro.data_final)
  const primeiroDia = new Date(ano, mes - 1, 1)
  const ultimoDia = new Date(ano, mes, 0)
  const dias: string[] = []

  for (let d = new Date(primeiroDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
    if (!diasSemana.has(d.getDay())) continue
    if (d < dataInicial || d > dataFinal) continue
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dias.push(`${y}-${m}-${day}`)
  }

  return dias
}

export async function listarPlanosAplicados(
  turmaId: string,
  matrizDisciplinaId: string,
  dataAula: string,
  pessoaId?: string | null
): Promise<PlanoAplicado[]> {
  await validarPermRead(pessoaId)

  const { data } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('*, plano_aula:plano_aula_id(*)')
    .eq('turma_id', turmaId)
    .eq('matriz_disciplina_id', matrizDisciplinaId)
    .eq('data_aula', dataAula)

  return (data || []) as unknown as PlanoAplicado[]
}

export async function listarPlanosAplicadosMes(
  turmaId: string,
  matrizDisciplinaId: string,
  ano: number,
  mes: number,
  pessoaId?: string | null
): Promise<PlanoAplicado[]> {
  await validarPermRead(pessoaId)

  const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`
  const ultimoDia = `${ano}-${String(mes).padStart(2, '0')}-${new Date(ano, mes, 0).getDate()}`

  const { data } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('*, plano_aula:plano_aula_id(*)')
    .eq('turma_id', turmaId)
    .eq('matriz_disciplina_id', matrizDisciplinaId)
    .gte('data_aula', primeiroDia)
    .lte('data_aula', ultimoDia)

  return (data || []) as unknown as PlanoAplicado[]
}

export async function listarPlanosDisponiveis(
  turmaId: string,
  matrizDisciplinaId: string,
  pessoaId?: string | null
): Promise<PlanoAula[]> {
  await validarPermRead(pessoaId)

  const { data: vinculos } = await supabase
    .from('planos_ensino_disciplinas')
    .select('plano_ensino_id')
    .eq('matriz_disciplina_id', matrizDisciplinaId)

  if (!vinculos?.length) return []

  const ids = [...new Set(vinculos.map(v => v.plano_ensino_id))]

  const { data: planosEnsino } = await supabase
    .from('planos_ensino')
    .select('id')
    .in('id', ids)
    .eq('turma_id', turmaId)

  if (!planosEnsino?.length) return []

  const validIds = planosEnsino.map(p => p.id)

  const { data: aulas } = await supabase
    .from('planos_aula')
    .select('*')
    .in('plano_ensino_id', validIds)
    .order('data_inicio', { ascending: false, nullsFirst: false })

  return (aulas || []) as PlanoAula[]
}

export async function aplicarPlanoAula(
  turmaId: string,
  matrizDisciplinaId: string,
  dataAula: string,
  planoAulaId: string,
  horarioId?: string | null,
  pessoaId?: string | null
) {
  await validarPermWrite(pessoaId)
  await garantirTurmaAberta(turmaId)

  const hoje = new Date()
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  if (dataAula > hojeStr) {
    throw new Error('Não é possível aplicar um plano de aula em uma data futura.')
  }

  const { error } = await supabase
    .from('academico_diario_planos_aplicados')
    .insert({
      turma_id: turmaId,
      matriz_disciplina_id: matrizDisciplinaId,
      data_aula: dataAula,
      plano_aula_id: planoAulaId,
      horario_id: horarioId || null,
      created_by: pessoaId,
    })

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este plano de aula já está aplicado nesta data/horário.')
    }
    throw error
  }

  const { data: registro } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('*')
    .match({ turma_id: turmaId, matriz_disciplina_id: matrizDisciplinaId, data_aula: dataAula, plano_aula_id: planoAulaId, horario_id: horarioId || null })
    .maybeSingle()

  const { data: turma } = await supabase.from('turmas').select('nome, school_id').eq('id', turmaId).maybeSingle()
  await registrarAuditoria({
    school_id: turma?.school_id || null,
    pessoa_id: pessoaId || null,
    modulo: 'Plano de Ensino',
    entidade: 'academico_diario_planos_aplicados',
    entidade_id: registro?.id || null,
    registro_nome: turma?.nome || null,
    acao: 'criar',
    dados_novos: registro || { turma_id: turmaId, matriz_disciplina_id: matrizDisciplinaId, data_aula: dataAula, plano_aula_id: planoAulaId, horario_id: horarioId || null },
  })
}

export async function removerPlanoAulaAplicado(
  id: string,
  pessoaId?: string | null
) {
  await validarPermWrite(pessoaId)

  const { data: plano } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('turma_id')
    .eq('id', id)
    .maybeSingle()

  if (plano?.turma_id && await verificarTurmaFechadaPublica(plano.turma_id)) {
    throw new Error('A turma está fechada. Não é possível realizar alterações.')
  }

  const { data: anterior } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('academico_diario_planos_aplicados')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    const { data: turma } = await supabase.from('turmas').select('nome, school_id').eq('id', anterior.turma_id).maybeSingle()
    await registrarAuditoria({
      school_id: turma?.school_id || null,
      pessoa_id: pessoaId || null,
      modulo: 'Plano de Ensino',
      entidade: 'academico_diario_planos_aplicados',
      entidade_id: id,
      registro_nome: turma?.nome || null,
      acao: 'excluir',
      dados_anteriores: anterior,
    })
  }
}

export async function listarDiasComPlanoAplicado(
  turmaId: string,
  matrizDisciplinaId: string,
  ano: number,
  mes: number,
  pessoaId?: string | null
): Promise<string[]> {
  await validarPermRead(pessoaId)

  const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`
  const ultimoDia = `${ano}-${String(mes).padStart(2, '0')}-${new Date(ano, mes, 0).getDate()}`

  const { data } = await supabase
    .from('academico_diario_planos_aplicados')
    .select('data_aula')
    .eq('turma_id', turmaId)
    .eq('matriz_disciplina_id', matrizDisciplinaId)
    .gte('data_aula', primeiroDia)
    .lte('data_aula', ultimoDia)

  if (!data) return []
  return [...new Set(data.map(d => d.data_aula))]
}
