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
}

export async function listarTurmasDiario(schoolId: string, pessoaId: string, anoLetivoId?: string) {
  const perfil = await supabase
    .from('people')
    .select('perfil_id')
    .eq('id', pessoaId)
    .single()
    .then(r => r.data)

  if (!perfil?.perfil_id) {
    throw new Error('Usuário sem perfil de acesso')
  }

  const { data: perfilData } = await supabase
    .from('perfis')
    .select('usa_vinculo_turma')
    .eq('id', perfil.perfil_id)
    .single()

  const usaVinculo = perfilData?.usa_vinculo_turma ?? false

  let query = supabase
    .from('turmas')
    .select(`
      id, nome, turno,
      academico_etapas_ensino!inner(etapa_nome),
      academico_subetapas(subetapa_nome: nome)
    `)
    .eq('school_id', schoolId)
    .eq('ativa', true)

  if (anoLetivoId) {
    query = query.eq('ano_letivo_id', anoLetivoId)
  }

  if (usaVinculo) {
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
      .eq('situacao_matricula', 'em_andamento')

    const { data: sub } = await supabase
      .from('academico_matrizes_curriculares')
      .select('capacidade')
      .eq('id', t.matriz_curricular_id)
      .single()

    return {
      id: t.id,
      nome: t.nome,
      etapa_nome: t.academico_etapas_ensino?.etapa_nome || '',
      subetapa_nome: t.academico_subetapas?.subetapa_nome || null,
      total_alunos: count || 0,
      capacidade: sub?.capacidade || 0,
      turno: t.turno || '',
    } as TurmaDiario
  }))

  return turmasComAlunos
}

export async function getAlunosDaTurma(turmaId: string) {
  const { data, error } = await supabase
    .from('academico_matriculas')
    .select(`
      id as matricula_id,
      people!inner(id, nome_completo, numero_chamada)
    `)
    .eq('turma_id', turmaId)
    .eq('situacao_matricula', 'em_andamento')
    .order('people(nome_completo)')

  if (error) throw error

  return (data || []).map((m: any) => ({
    id: m.people.id,
    nome_completo: m.people.nome_completo,
    numero_chamada: m.people.numero_chamada,
    matricula_id: m.matricula_id,
  })) as AlunoMatriculado[]
}

export async function gerarNumeroChamada(turmaId: string) {
  const alunos = await getAlunosDaTurma(turmaId)
  const ordenados = alunos.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo))

  for (let i = 0; i < ordenados.length; i++) {
    const { error } = await supabase
      .from('people')
      .update({ numero_chamada: i + 1 })
      .eq('id', ordenados[i].id)

    if (error) throw error
  }

  return ordenados.length
}

export async function getDisciplinasDiario(turmaId: string, pessoaId?: string) {
  let query = supabase
    .from('turmas_disciplinas')
    .select(`
      id,
      disciplina:disciplinas!inner(id, nome, nome_abreviado)
    `)
    .eq('turma_id', turmaId)

  if (pessoaId) {
    const { data: perfil } = await supabase
      .from('people')
      .select('perfil_id')
      .eq('id', pessoaId)
      .single()

    if (perfil?.perfil_id) {
      const { data: p } = await supabase
        .from('perfis')
        .select('usa_vinculo_turma')
        .eq('id', perfil.perfil_id)
        .single()

      if (p?.usa_vinculo_turma) {
        const { data: vinculos } = await supabase
          .from('turmas_profissionais')
          .select('disciplina_id')
          .eq('turma_id', turmaId)
          .eq('person_id', pessoaId)

        const disciplinaIds = vinculos?.map(v => v.disciplina_id).filter(Boolean) || []
        if (disciplinaIds.length === 0) return []
        query = query.in('disciplina_id', disciplinaIds)
      }
    }
  }

  const { data, error } = await query.order('disciplina(nome)')

  if (error) throw error

  return (data || []).map((d: any) => ({
    id: d.id,
    disciplina_id: d.disciplina?.id,
    nome: d.disciplina?.nome || '',
    nome_abreviado: d.disciplina?.nome_abreviado || '',
  }))
}

export async function getMetodoAvaliacaoDaTurma(turmaId: string) {
  const { data, error } = await supabase
    .from('turmas')
    .select(`
      matriz_curricular:matriz_curricular_id(
        metodo_avaliacao:metodo_avaliacao_id(
          id, nome, criterio_frequencia, tipos_avaliacao,
          quantidade_periodos_numerico, quantidade_periodos_parecer,
          quantidade_periodos_conceito, quantidade_periodos_nivel
        )
      )
    `)
    .eq('id', turmaId)
    .single()

  if (error) throw error
  return (data as any)?.matriz_curricular?.metodo_avaliacao || null
}
