'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import { garantirTurmaAberta } from './garantir-turma-aberta'

const supabase = getSupabaseAdmin()

async function dadosMatricula(matriculaId: string): Promise<{ aluno_nome?: string; school_id?: string }> {
  const { data } = await supabase
    .from('academico_matriculas')
    .select('school_id, aluno_id, people(nome_completo)')
    .eq('id', matriculaId)
    .maybeSingle()

  return {
    aluno_nome: (data as any)?.people?.nome_completo || null,
    school_id: (data as any)?.school_id || null,
  }
}

async function registrarMatricula(
  acao: 'criar' | 'editar' | 'excluir',
  entidade: string,
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
    modulo: 'Alunos Matriculados',
    entidade,
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

async function garantirMatriculaTurmaAberta(matriculaId: string) {
  const { data } = await supabase
    .from('academico_matriculas')
    .select('turma_id')
    .eq('id', matriculaId)
    .maybeSingle()
  if (data?.turma_id) await garantirTurmaAberta(data.turma_id)
}

// ------- Tipos -------

export type Matricula = {
  id: string
  school_id: string
  aluno_id: string
  ano_letivo_id: string
  turma_id: string
  etapa_ensino_id: string
  subetapa_id: string | null
  data_matricula: string
  codigo_matricula: number | null
  codigo_inep: string | null
  forma_ingresso: string
  escolarizacao_externa: string
  observacoes: string | null
  transporte_responsavel: string
  transporte_veiculos: any
  situacao: string
  ativo: boolean
  created_at: string
  updated_at: string
  // Joins
  aluno?: { nome_completo: string; cpf: string }
  turma?: { nome: string; codigo_inep: string }
  etapa?: { etapa_nome: string }
  subetapa?: { nome: string }
}

export type Movimentacao = {
  id: string
  matricula_id: string
  tipo: 'Transferencia' | 'Reclassificacao' | 'Remanejamento' | 'Desistencia' | 'Obito'
  data_movimentacao: string
  data_registro: string
  profissional_id: string
  observacoes: string | null
  dados_complementares: any
  ativo: boolean
  created_at: string
  updated_at: string
  profissional?: { nome: string }
}

export type FiltrosMatriculas = {
  ano_letivo_id?: string
  turma_id?: string
  etapa_ensino_id?: string
}

// ------- Listagem -------

export async function getMatriculas(schoolId: string | null, filtros: FiltrosMatriculas) {
  let query = supabase
    .from('academico_matriculas')
    .select('*, aluno:aluno_id(nome_completo, cpf), turma:turma_id(nome, codigo_inep), etapa:etapa_ensino_id(etapa_nome), subetapa:subetapa_id(nome)')
    .eq('ativo', true)
    .order('codigo_matricula', { ascending: true })
    .order('created_at', { ascending: false })

  if (schoolId) query = query.eq('school_id', schoolId)

  if (filtros.ano_letivo_id) query = query.eq('ano_letivo_id', filtros.ano_letivo_id)
  if (filtros.turma_id) query = query.eq('turma_id', filtros.turma_id)
  if (filtros.etapa_ensino_id) query = query.eq('etapa_ensino_id', filtros.etapa_ensino_id)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getMatricula(id: string, schoolId?: string | null) {
  let query = supabase
    .from('academico_matriculas')
    .select('*, aluno:aluno_id(nome_completo, cpf), turma:turma_id(nome, codigo_inep, turnos), etapa:etapa_ensino_id(etapa_nome, etapa_tipo), subetapa:subetapa_id(nome)')
    .eq('id', id)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query.single()

  if (error) throw error
  return data as any
}

// ------- Regra Geral de Matrícula (duplicidade + conflito de horário) -------
// Vale para TODA criação de matrícula (Nova Matrícula, Rematrículas e qualquer
// fluxo futuro), pois é aplicada no server antes de qualquer escrita:
// 1. Um aluno não pode ter duas matrículas simultâneas em turmas Curriculares.
// 2. Curricular + AEE/Atividade Complementar podem coexistir (tipos diferentes).
// 3. Mesmo entre tipos diferentes, Turno + Dias de Funcionamento não podem se
//    sobrepor (conflito de horário).

type CategoriaTurma = 'curricular' | 'aee' | 'complementar' | 'outra'

function classificarTurma(tiposTurma: unknown): CategoriaTurma {
  const lista = Array.isArray(tiposTurma) ? tiposTurma.map(String) : tiposTurma ? [String(tiposTurma)] : []
  const rotulo = (lista[0] || '').toLowerCase()
  if (rotulo.includes('curricular')) return 'curricular'
  if (rotulo.includes('aee') || rotulo.includes('atendimento educacional')) return 'aee'
  if (rotulo.includes('complementar')) return 'complementar'
  return 'outra'
}

function nomesTurnos(turnos: unknown): string[] {
  if (!Array.isArray(turnos)) return []
  return turnos
    .map((t) => {
      if (typeof t === 'string') return t
      if (t && typeof t === 'object') return String((t as any).turno || '')
      return ''
    })
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function listaDias(dias: unknown): string[] {
  if (!Array.isArray(dias)) return []
  return dias.map(String).map((s) => s.trim().toLowerCase()).filter(Boolean)
}

// 'Integral' ocupa o dia todo: conflita com qualquer outro turno no mesmo dia.
function turnosConflitam(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false
  if (a.includes('integral') || b.includes('integral')) return true
  return a.some((t) => b.includes(t))
}

function diasSobrepostos(a: string[], b: string[]): string[] {
  const setB = new Set(b)
  return a.filter((d) => setB.has(d))
}

async function validarRegraGeralMatricula(args: {
  aluno_id: string
  ano_letivo_id: string
  turma_id: string
  ignoreMatriculaId?: string | null
}) {
  const { data: novaTurma, error: errTurma } = await supabase
    .from('turmas')
    .select('id, nome, tipos_turma, turnos, dias_funcionamento')
    .eq('id', args.turma_id)
    .maybeSingle()
  if (errTurma) throw errTurma
  if (!novaTurma) throw new Error('Turma não encontrada')

  let query = supabase
    .from('academico_matriculas')
    .select('id, turma_id, turmas!inner(id, nome, tipos_turma, turnos, dias_funcionamento)')
    .eq('aluno_id', args.aluno_id)
    .eq('ano_letivo_id', args.ano_letivo_id)
    .eq('ativo', true)
    .eq('situacao', 'Ativo')
  if (args.ignoreMatriculaId) query = query.neq('id', args.ignoreMatriculaId)

  const { data: existentes, error } = await query
  if (error) throw error
  if (!existentes || existentes.length === 0) return

  const novaCategoria = classificarTurma((novaTurma as any).tipos_turma)
  const novosTurnos = nomesTurnos((novaTurma as any).turnos)
  const novosDias = listaDias((novaTurma as any).dias_funcionamento)

  for (const m of (existentes as any[])) {
    const t = m.turmas
    if (!t || t.id === args.turma_id) continue
    const nomeExistente = t.nome || 'turma já matriculada'

    // 1. Duplicidade curricular (vale mesmo sem sobreposição de horário)
    if (novaCategoria === 'curricular' && classificarTurma(t.tipos_turma) === 'curricular') {
      throw new Error(`Este aluno já possui uma matrícula ativa em turma Curricular (${nomeExistente})`)
    }

    // 2. Conflito de turno/dia (vale para qualquer combinação de tipos)
    const diasEmComum = diasSobrepostos(novosDias, listaDias(t.dias_funcionamento))
    if (diasEmComum.length > 0 && turnosConflitam(novosTurnos, nomesTurnos(t.turnos))) {
      throw new Error(`Conflito de turno/dia com a turma ${nomeExistente}, já matriculada`)
    }
  }
}

// ------- CRUD Matrícula -------

export async function createMatricula(data: {
  school_id: string
  aluno_id: string
  ano_letivo_id: string
  turma_id: string
  etapa_ensino_id: string
  subetapa_id?: string | null
  data_matricula: string
  forma_ingresso: string
  escolarizacao_externa: string
  observacoes?: string | null
  transporte_responsavel?: string
  transporte_veiculos?: any
}, pessoaId?: string | null) {
  await garantirTurmaAberta(data.turma_id)

  // Regra Geral de Matrícula: duplicidade curricular + conflito de turno/dia
  await validarRegraGeralMatricula({
    aluno_id: data.aluno_id,
    ano_letivo_id: data.ano_letivo_id,
    turma_id: data.turma_id,
  })

  // Código sequencial de matrícula por escola (max+1; UNIQUE protege concorrência)
  const { data: ultimo } = await supabase
    .from('academico_matriculas')
    .select('codigo_matricula')
    .eq('school_id', data.school_id)
    .order('codigo_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()
  const proximoCodigo = ((ultimo?.codigo_matricula as number) || 0) + 1

  const { data: matricula, error } = await supabase
    .from('academico_matriculas')
    .insert({
      school_id: data.school_id,
      aluno_id: data.aluno_id,
      ano_letivo_id: data.ano_letivo_id,
      turma_id: data.turma_id,
      etapa_ensino_id: data.etapa_ensino_id,
      subetapa_id: data.subetapa_id || null,
      data_matricula: data.data_matricula,
      codigo_matricula: proximoCodigo,
      forma_ingresso: data.forma_ingresso,
      escolarizacao_externa: data.escolarizacao_externa,
      observacoes: data.observacoes || null,
      transporte_responsavel: data.transporte_responsavel || '1',
      turma_multi: (data as any).turma_multi || null,
      carga_horaria_iftp: (data as any).carga_horaria_iftp || null,
      aee_funcao_cognitiva: (data as any).aee_funcao_cognitiva || false,
      aee_vida_autonoma: (data as any).aee_vida_autonoma || false,
      aee_enriquecimento: (data as any).aee_enriquecimento || false,
      aee_informatica: (data as any).aee_informatica || false,
      aee_libras: (data as any).aee_libras || false,
      aee_portugues_sl: (data as any).aee_portugues_sl || false,
      aee_soroban: (data as any).aee_soroban || false,
      aee_braille: (data as any).aee_braille || false,
      aee_orientacao: (data as any).aee_orientacao || false,
      aee_caa: (data as any).aee_caa || false,
      aee_recursos: (data as any).aee_recursos || false,
      veiculo_bicicleta: (data as any).veiculo_bicicleta || false,
      veiculo_microonibus: (data as any).veiculo_microonibus || false,
      veiculo_onibus: (data as any).veiculo_onibus || false,
      veiculo_tracao: (data as any).veiculo_tracao || false,
      veiculo_vans: (data as any).veiculo_vans || false,
      veiculo_outro: (data as any).veiculo_outro || false,
      veiculo_aqua_5: (data as any).veiculo_aqua_5 || false,
      veiculo_aqua_15: (data as any).veiculo_aqua_15 || false,
      veiculo_aqua_35: (data as any).veiculo_aqua_35 || false,
      veiculo_aqua_mais: (data as any).veiculo_aqua_mais || false,
    })
    .select()
    .single()

  if (error) throw error
  const { data: aluno } = await supabase
    .from('people')
    .select('nome_completo')
    .eq('id', data.aluno_id)
    .maybeSingle()
  await registrarMatricula('criar', 'academico_matriculas', matricula.id, pessoaId, matricula.school_id, aluno?.nome_completo || null, null, matricula)
  return matricula
}

export async function updateMatricula(id: string, data: {
  data_matricula?: string
  turma_id?: string
  etapa_ensino_id?: string
  subetapa_id?: string | null
  forma_ingresso?: string
  escolarizacao_externa?: string
  observacoes?: string | null
  transporte_responsavel?: string
  transporte_veiculos?: any
}, pessoaId?: string | null) {
  await garantirMatriculaTurmaAberta(id)

  const { data: anterior } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  // Troca de turma no Editar também respeita a Regra Geral (ignora o próprio vínculo)
  if (data.turma_id && anterior && data.turma_id !== (anterior as any).turma_id) {
    await validarRegraGeralMatricula({
      aluno_id: (anterior as any).aluno_id,
      ano_letivo_id: (anterior as any).ano_letivo_id,
      turma_id: data.turma_id,
      ignoreMatriculaId: id,
    })
  }

  const { error } = await supabase
    .from('academico_matriculas')
    .update(data)
    .eq('id', id)

  if (error) throw error

  const { data: final } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const info = await dadosMatricula(id)
  await registrarMatricula('editar', 'academico_matriculas', id, pessoaId, info.school_id || anterior?.school_id, info.aluno_nome || null, anterior, final)
}

export async function deleteMatricula(id: string, pessoaId: string) {
  const { validarPermissaoServer } = await import('./perfis')
  await validarPermissaoServer(pessoaId, 'gestao-academica.matriculas', 'excluir')

  const { data: anterior } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!anterior) throw new Error('Matrícula não encontrada')

  const { error } = await supabase
    .from('academico_matriculas')
    .delete()
    .eq('id', id)

  if (error) {
    // 23503 = violação de chave estrangeira (lançamentos vinculados)
    if ((error as any).code === '23503') {
      throw new Error('Não é possível excluir: este vínculo possui lançamentos vinculados (frequência, avaliações ou pareceres)')
    }
    throw error
  }

  const info = await dadosMatricula(id).catch(() => ({ aluno_nome: null, school_id: null }))
  await registrarMatricula('excluir', 'academico_matriculas', id, pessoaId, (anterior as any).school_id || info.school_id, info.aluno_nome || null, anterior, null)
}

// ------- Movimentações -------

export async function getMovimentacoes(matriculaId: string) {
  const { data, error } = await supabase
    .from('academico_matriculas_movimentacoes')
    .select('*, profissional:profissional_id(nome_completo)')
    .eq('matricula_id', matriculaId)
    .eq('ativo', true)
    .order('data_movimentacao', { ascending: false })

  if (error) throw error
  return data as Movimentacao[]
}

export async function salvarMovimentacoes(
  pessoaId: string,
  matriculaId: string,
  movimentacoes: {
    id?: string
    tipo: string
    data_movimentacao: string
    profissional_id: string
    observacoes?: string | null
    dados_complementares?: any
    removido?: boolean
  }[]
) {
  const { validarPermissaoServer } = await import('./perfis')
  await validarPermissaoServer(pessoaId, 'gestao-academica.matriculas.movimentacoes', 'editar')
  await garantirMatriculaTurmaAberta(matriculaId)

  const pendentes = movimentacoes.filter(m => !m.removido)

  const infoMatricula = await dadosMatricula(matriculaId)
  const moduloMov = 'Movimentações de Alunos'
  const escolaId = infoMatricula.school_id || null
  const alunoNome = infoMatricula.aluno_nome || null

  // Remover movimentações marcadas para exclusão
  const paraRemover = movimentacoes.filter(m => m.removido && m.id)
  for (const m of paraRemover) {
    const { data: anterior } = await supabase
      .from('academico_matriculas_movimentacoes')
      .select('*')
      .eq('id', m.id!)
      .maybeSingle()

    await supabase.from('academico_matriculas_movimentacoes').update({ ativo: false }).eq('id', m.id!)

    if (anterior) {
      await registrarAuditoria({
        school_id: escolaId,
        pessoa_id: pessoaId || null,
        modulo: moduloMov,
        entidade: 'academico_matriculas_movimentacoes',
        entidade_id: m.id!,
        registro_nome: alunoNome,
        acao: 'excluir',
        dados_anteriores: anterior,
      })
    }
  }

  // Inserir ou atualizar movimentações
  for (const m of pendentes) {
    if (m.id) {
      const { data: anterior } = await supabase
        .from('academico_matriculas_movimentacoes')
        .select('*')
        .eq('id', m.id)
        .maybeSingle()

      await supabase.from('academico_matriculas_movimentacoes').update({
        data_movimentacao: m.data_movimentacao,
        observacoes: m.observacoes,
        dados_complementares: m.dados_complementares || {},
      }).eq('id', m.id)

      const { data: final } = await supabase
        .from('academico_matriculas_movimentacoes')
        .select('*')
        .eq('id', m.id)
        .maybeSingle()

      await registrarAuditoria({
        school_id: escolaId,
        pessoa_id: pessoaId || null,
        modulo: moduloMov,
        entidade: 'academico_matriculas_movimentacoes',
        entidade_id: m.id,
        registro_nome: alunoNome,
        acao: 'editar',
        dados_anteriores: anterior,
        dados_novos: final,
      })
    } else {
      const { data: criado, error } = await supabase.from('academico_matriculas_movimentacoes').insert({
        matricula_id: matriculaId,
        tipo: m.tipo,
        data_movimentacao: m.data_movimentacao,
        profissional_id: m.profissional_id,
        observacoes: m.observacoes,
        dados_complementares: m.dados_complementares || {},
      }).select().single()
      if (error) throw error

      await registrarAuditoria({
        school_id: escolaId,
        pessoa_id: pessoaId || null,
        modulo: moduloMov,
        entidade: 'academico_matriculas_movimentacoes',
        entidade_id: criado.id,
        registro_nome: alunoNome,
        acao: 'criar',
        dados_novos: criado,
      })
    }
  }

  // Atualizar situação da matrícula e data_saida baseada nas movimentações
  if (pendentes.length === 0) {
    // Todas as movimentações removidas — aluno volta a ficar ativo
    await supabase
      .from('academico_matriculas')
      .update({ situacao: 'Ativo', data_saida: null })
      .eq('id', matriculaId)
  } else {
    const ultimo = pendentes[pendentes.length - 1]
    const situacaoMap: Record<string, string> = {
      Transferencia: 'Transferido',
      Reclassificacao: 'Reclassificado',
      Remanejamento: 'Remanejado',
      Desistencia: 'Desistente',
      Obito: 'Óbito',
    }

    const novaSituacao = situacaoMap[ultimo.tipo]
    if (novaSituacao) {
      await supabase
        .from('academico_matriculas')
        .update({
          situacao: novaSituacao,
          data_saida: ultimo.data_movimentacao,
        })
        .eq('id', matriculaId)
    }
  }
}

// ------- Dispensas (removido — spec 034) -------
// A funcionalidade de Dispensa de Disciplinas foi removida do sistema.
// Tabela `academico_matriculas_dispensas` dropada via patch_remove_dispensas.sql.

// ------- Queries auxiliares -------

export async function getAlunos(schoolId: string | null) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, cpf, data_nascimento')
    .contains('perfil', ['aluno'])
    .eq('ativo', true)
    .order('nome_completo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getTurmasAtivas(schoolId: string | null, anoLetivoId: string) {
  let query = supabase
    .from('turmas')
    .select('id, nome, codigo_inep, turnos, tipos_turma, etapas_ensino_ids, multietapa')
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error
  return data as any[]
}

export async function getEtapasDaTurma(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('etapas_ensino_ids, multietapa')
    .eq('id', turmaId)
    .single()

  if (!turma) return []

  if (turma.etapas_ensino_ids && turma.etapas_ensino_ids.length > 0) {
    const { data: etapas } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_nome')
      .in('id', turma.etapas_ensino_ids)
      .eq('ativa', true)
      .order('etapa_nome')

    return (etapas || []) as any[]
  }

  return []
}

export async function getSubetapasDaEtapa(etapaId: string) {
  const { data, error } = await supabase
    .from('academico_subetapas')
    .select('id, nome')
    .eq('etapa_ensino_id', etapaId)
    .order('nome')

  if (error) throw error
  return data as any[]
}

// Busca direta por id (garantia de exibição: valor gravado pode estar fora
// da lista filtrada por turma/ativa, e o Select renderizaria em branco)
export async function getEtapaById(etapaId: string) {
  const { data } = await supabase
    .from('academico_etapas_ensino')
    .select('id, etapa_nome')
    .eq('id', etapaId)
    .maybeSingle()

  return data as any
}

export async function getSubetapaById(subetapaId: string) {
  const { data } = await supabase
    .from('academico_subetapas')
    .select('id, nome')
    .eq('id', subetapaId)
    .maybeSingle()

  return data as any
}

// Resolve em batch os nomes de etapas/turmas referenciados nas movimentações
export async function getNomesReferenciaMovimentacoes(etapaIds: string[], turmaIds: string[]) {
  const etapas: Record<string, string> = {}
  const turmas: Record<string, string> = {}

  const idsEtapas = [...new Set((etapaIds || []).filter(Boolean))]
  const idsTurmas = [...new Set((turmaIds || []).filter(Boolean))]

  if (idsEtapas.length > 0) {
    const { data } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_nome')
      .in('id', idsEtapas)
    for (const e of (data || []) as any[]) etapas[e.id] = e.etapa_nome
  }

  if (idsTurmas.length > 0) {
    const { data } = await supabase
      .from('turmas')
      .select('id, nome')
      .in('id', idsTurmas)
    for (const t of (data || []) as any[]) turmas[t.id] = t.nome
  }

  return { etapas, turmas }
}

export async function getAnoLetivoAtivo(schoolId: string | null) {
  let query = supabase
    .from('academico_anos_letivos')
    .select('*')
    .eq('status', 'ativo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as any
}
