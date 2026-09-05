'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type Compromisso = {
  id: string
  school_id: string
  pessoa_id: string
  titulo: string
  data_inicial: string
  data_final: string
  horario_inicial: string | null
  horario_final: string | null
  dia_todo: boolean
  categoria: 'reuniao' | 'aula' | 'formacao' | 'outro'
  detalhes: string | null
  created_at: string
  updated_at: string
}

export type CompromissoInput = {
  titulo: string
  data_inicial: string
  data_final: string
  horario_inicial?: string | null
  horario_final?: string | null
  dia_todo: boolean
  categoria: 'reuniao' | 'aula' | 'formacao' | 'outro'
  detalhes?: string | null
}

export async function listarCompromissos(
  schoolId: string | null,
  pessoaId: string | null,
  mes: number,
  ano: number,
  filtro: 'hoje' | 'semana' | 'mes'
): Promise<Record<string, Compromisso[]>> {
  if (!pessoaId || !schoolId) return {}

  const { data, error } = await supabase
    .from('agenda_compromissos')
    .select('*')
    .eq('pessoa_id', pessoaId)
    .eq('school_id', schoolId)
    .gte('data_inicial', `${ano}-${String(mes).padStart(2, '0')}-01`)
    .lte('data_inicial', `${ano}-${String(mes).padStart(2, '0')}-31`)
    .order('data_inicial', { ascending: true })
    .order('horario_inicial', { ascending: true, nullsFirst: true })

  if (error) {
    console.error('Erro ao listar compromissos:', error)
    return {}
  }

  const hoje = new Date()
  const hojeStr = hoje.toISOString().split('T')[0]

  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - hoje.getDay())
  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(inicioSemana.getDate() + 6)

  let filtrados = (data || []) as Compromisso[]

  if (filtro === 'hoje') {
    filtrados = filtrados.filter((c) => c.data_inicial === hojeStr)
  } else if (filtro === 'semana') {
    filtrados = filtrados.filter(
      (c) => c.data_inicial >= inicioSemana.toISOString().split('T')[0] && c.data_inicial <= fimSemana.toISOString().split('T')[0]
    )
  }

  const agrupados: Record<string, Compromisso[]> = {}
  for (const c of filtrados) {
    const chave = c.data_inicial
    if (!agrupados[chave]) agrupados[chave] = []
    agrupados[chave].push(c)
  }

  return agrupados
}

export async function criarCompromisso(
  schoolId: string,
  pessoaId: string,
  input: CompromissoInput
) {
  if (!schoolId || !pessoaId) {
    return { error: 'Usuário não autenticado' }
  }

  if (!input.titulo?.trim()) {
    return { error: 'Título é obrigatório' }
  }

  if (!input.data_inicial || !input.data_final) {
    return { error: 'Datas são obrigatórias' }
  }

  if (!input.dia_todo && (!input.horario_inicial || !input.horario_final)) {
    return { error: 'Horários são obrigatórios para compromissos que não são dia todo' }
  }

  const { data, error } = await supabase
    .from('agenda_compromissos')
    .insert({
      school_id: schoolId,
      pessoa_id: pessoaId,
      titulo: input.titulo.trim(),
      data_inicial: input.data_inicial,
      data_final: input.data_final,
      horario_inicial: input.dia_todo ? null : input.horario_inicial || null,
      horario_final: input.dia_todo ? null : input.horario_final || null,
      dia_todo: input.dia_todo,
      categoria: input.categoria,
      detalhes: input.detalhes?.trim() || null,
      created_by: pessoaId,
      updated_by: pessoaId,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar compromisso:', error)
    return { error: 'Erro ao salvar compromisso' }
  }

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Agenda',
    entidade: 'agenda_compromissos',
    entidade_id: data.id,
    registro_nome: data.titulo,
    acao: 'criar',
    dados_novos: data,
  })

  return { data: data as Compromisso }
}

export async function excluirCompromisso(id: string, pessoaId: string) {
  if (!id || !pessoaId) {
    return { error: 'Parâmetros inválidos' }
  }

  const { data: anterior } = await supabase
    .from('agenda_compromissos')
    .select('*')
    .eq('id', id)
    .eq('pessoa_id', pessoaId)
    .maybeSingle()

  const { error } = await supabase
    .from('agenda_compromissos')
    .delete()
    .eq('id', id)
    .eq('pessoa_id', pessoaId)

  if (error) {
    console.error('Erro ao excluir compromisso:', error)
    return { error: 'Erro ao excluir compromisso' }
  }

  if (anterior) {
    await registrarAuditoria({
      school_id: anterior.school_id,
      pessoa_id: pessoaId || null,
      modulo: 'Agenda',
      entidade: 'agenda_compromissos',
      entidade_id: id,
      registro_nome: anterior.titulo,
      acao: 'excluir',
      dados_anteriores: anterior,
    })
  }

  return { success: true }
}
