'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { REMATRICULAS_RESOURCE } from '@/lib/rematriculas'
import { createMatricula } from './matriculas'
import { validarPermissaoServer } from './perfis'

const supabase = getSupabaseAdmin()

// ------- Tipos (contratos em specs/035-rematriculas/contracts/rematriculas-actions.md) -------

export type SituacaoRematricula =
  | 'Aprovado'
  | 'Aprovado por conselho de classe'
  | 'Aprovado concluinte'
  | 'Reprovado'
  | 'Reprovado por frequência'

export type AlunoElegivel = {
  matriculaOrigemId: string
  alunoId: string
  nome: string
  cpf: string
  situacao: string
}

export type ListarElegiveisResult = {
  alunos: AlunoElegivel[]
  jaMatriculados: number
}

export type ItemLote = {
  alunoId: string
  turmaDestinoId: string
  etapaDestinoId: string
}

export type FalhaItem = {
  alunoId: string
  nome: string
  motivo: string
  proximoPasso: string
}

export type RematricularLoteResult = {
  criados: { alunoId: string; nome: string; matriculaId: string }[]
  falhas: FalhaItem[]
  jaMatriculados: number
}

// ------- Listagem (T009) -------

export async function listarAlunosElegiveis(input: {
  schoolId: string
  turmaOrigemId: string
  situacoes: SituacaoRematricula[]
  anoDestinoId: string
  pessoaId?: string | null
}): Promise<ListarElegiveisResult> {
  const { schoolId, turmaOrigemId, situacoes, anoDestinoId } = input
  if (!schoolId || !turmaOrigemId || !anoDestinoId || situacoes.length === 0) {
    return { alunos: [], jaMatriculados: 0 }
  }

  const { data: origem, error } = await supabase
    .from('academico_matriculas')
    .select('id, aluno_id, situacao, aluno:aluno_id(nome_completo, cpf)')
    .eq('school_id', schoolId)
    .eq('turma_id', turmaOrigemId)
    .eq('ativo', true)
    .in('situacao', situacoes)

  if (error) throw error

  const { data: noDestino } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoDestinoId)
    .eq('ativo', true)

  const idsNoDestino = new Set(((noDestino || []) as any[]).map(d => d.aluno_id as string))

  const alunos = ((origem || []) as any[])
    .filter(m => !idsNoDestino.has(m.aluno_id as string))
    .map(m => ({
      matriculaOrigemId: m.id as string,
      alunoId: m.aluno_id as string,
      nome: (m.aluno?.nome_completo as string) || 'Sem nome',
      cpf: (m.aluno?.cpf as string) || '—',
      situacao: m.situacao as string,
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  return { alunos, jaMatriculados: (origem || []).length - alunos.length }
}

// ------- Salvamento em lote (T012) -------

function hojeLocal(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

function mensagemAmigavel(e: unknown): string {
  const msg = e instanceof Error ? e.message : 'Erro ao criar matrícula'
  // createMatricula já retorna mensagens operacionais (Regra Geral, turma fechada)
  return msg
}

export async function rematricularLote(input: {
  schoolId: string
  anoDestinoId: string
  turmaOrigemId: string
  familiaSituacao: 'aprovado' | 'reprovado'
  etapaOrigemId: string
  dataMatricula: string
  itens: ItemLote[]
  pessoaId?: string | null
}): Promise<RematricularLoteResult> {
  const { schoolId, anoDestinoId, turmaOrigemId, familiaSituacao, etapaOrigemId, dataMatricula, itens, pessoaId } = input

  if (!pessoaId) throw new Error('Acesso negado: permissão insuficiente')
  await validarPermissaoServer(pessoaId, REMATRICULAS_RESOURCE, 'criar')

  if (!schoolId || !anoDestinoId || !turmaOrigemId || !etapaOrigemId) {
    throw new Error('Origem e destino inválidos. Revise os filtros antes de salvar.')
  }
  if (!dataMatricula || dataMatricula > hojeLocal()) {
    throw new Error('Informe uma Data de Matrícula válida (hoje ou data passada).')
  }
  if (familiaSituacao !== 'aprovado' && familiaSituacao !== 'reprovado') {
    throw new Error('Situação de origem inválida.')
  }
  if (itens.length === 0) {
    throw new Error('Selecione ao menos um aluno para rematricular.')
  }

  // Contexto de origem (para validação de escopo e observações)
  const [{ data: etapaOrigem }, { data: turmaOrigem }, { data: anoOrigem }] = await Promise.all([
    supabase.from('academico_etapas_ensino').select('id, etapa_codigo, etapa_nome, school_id').eq('id', etapaOrigemId).maybeSingle(),
    supabase.from('turmas').select('id, nome, school_id').eq('id', turmaOrigemId).maybeSingle(),
    supabase.from('academico_anos_letivos').select('id, descricao, school_id').eq('school_id', schoolId).eq('status', 'encerrado').order('descricao', { ascending: false }).limit(1).maybeSingle(),
  ])
  if (!etapaOrigem || (etapaOrigem as any).school_id !== schoolId) {
    throw new Error('Etapa de origem inválida para esta escola.')
  }

  // Turmas de destino referenciadas (escopo + ano + etapa)
  const turmaIds = [...new Set(itens.map(i => i.turmaDestinoId))]
  const { data: turmasDest } = await supabase
    .from('turmas')
    .select('id, nome, ano_letivo_id, school_id, ativo, etapas_ensino_ids')
    .in('id', turmaIds)
  const turmaMap = new Map(((turmasDest || []) as any[]).map(t => [t.id as string, t]))

  const etapaIds = [...new Set(itens.map(i => i.etapaDestinoId))]
  const { data: etapasDest } = await supabase
    .from('academico_etapas_ensino')
    .select('id, etapa_codigo, etapa_nome, school_id')
    .in('id', etapaIds)
  const etapaMap = new Map(((etapasDest || []) as any[]).map(e => [e.id as string, e]))

  // Nomes para retorno / falhas
  const alunoIds = [...new Set(itens.map(i => i.alunoId))]
  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', alunoIds)
  const nomeMap = new Map(((pessoas || []) as any[]).map(p => [p.id as string, (p.nome_completo as string) || 'Aluno']))

  // Re-checagem anti-duplicidade (condição de corrida / duplo disparo)
  const { data: noDestino } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoDestinoId)
    .eq('ativo', true)
  const idsNoDestino = new Set(((noDestino || []) as any[]).map(d => d.aluno_id as string))

  const origemDesc = `Rematrícula ${(anoOrigem as any)?.descricao || ''} — ${(turmaOrigem as any)?.nome || ''}`.trim()

  const criados: RematricularLoteResult['criados'] = []
  const falhas: FalhaItem[] = []
  let jaMatriculados = 0

  for (const item of itens) {
    const nome = nomeMap.get(item.alunoId) || 'Aluno'

    if (idsNoDestino.has(item.alunoId)) {
      jaMatriculados++
      continue
    }

    const turma = turmaMap.get(item.turmaDestinoId) as any
    if (!turma || turma.school_id !== schoolId || turma.ano_letivo_id !== anoDestinoId || turma.ativo !== true) {
      falhas.push({
        alunoId: item.alunoId, nome,
        motivo: `Turma de destino inválida (${turma?.nome || 'não encontrada'}).`,
        proximoPasso: 'Escolha outra turma de destino já criada no novo ano letivo.',
      })
      continue
    }
    if (!((turma.etapas_ensino_ids || []) as string[]).includes(item.etapaDestinoId)) {
      falhas.push({
        alunoId: item.alunoId, nome,
        motivo: `A turma ${turma.nome} não pertence à etapa de destino selecionada.`,
        proximoPasso: 'Ajuste a turma de destino do aluno para a mesma etapa.',
      })
      continue
    }

    const etapaDest = etapaMap.get(item.etapaDestinoId) as any
    const mesmaEtapa = !!etapaDest && etapaDest.etapa_codigo === (etapaOrigem as any).etapa_codigo
    if (familiaSituacao === 'aprovado' && mesmaEtapa) {
      falhas.push({
        alunoId: item.alunoId, nome,
        motivo: 'Aluno aprovado deve avançar de etapa.',
        proximoPasso: 'Escolha uma etapa de destino diferente da etapa de origem.',
      })
      continue
    }
    if (familiaSituacao === 'reprovado' && !mesmaEtapa) {
      falhas.push({
        alunoId: item.alunoId, nome,
        motivo: 'Aluno reprovado permanece na mesma etapa.',
        proximoPasso: 'Escolha a etapa de origem como etapa de destino.',
      })
      continue
    }

    try {
      const matricula = await createMatricula({
        school_id: schoolId,
        aluno_id: item.alunoId,
        ano_letivo_id: anoDestinoId,
        turma_id: item.turmaDestinoId,
        etapa_ensino_id: item.etapaDestinoId,
        data_matricula: dataMatricula,
        forma_ingresso: 'Normal',
        escolarizacao_externa: 'Não recebe escolarização fora da escola',
        observacoes: origemDesc || null,
      }, pessoaId)
      idsNoDestino.add(item.alunoId)
      criados.push({ alunoId: item.alunoId, nome, matriculaId: (matricula as any).id })
    } catch (e) {
      falhas.push({
        alunoId: item.alunoId, nome,
        motivo: mensagemAmigavel(e),
        proximoPasso: 'Ajuste a situação do aluno em Alunos Matriculados e tente novamente.',
      })
    }
  }

  return { criados, falhas, jaMatriculados }
}
