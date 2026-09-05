'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { codigoSituacaoFinal, ETAPAS_TURMA_EXIGEM_ETAPA, FUNCAO_GESTOR_REGEX } from '@/data/censo/situacao-final'
import type { ResultadoExportacaoSituacaoFinal } from './censo-situacao-final-types'
import { validarSituacaoFinal } from './censo-situacao-final-regras'
import {
  admitidaApos,
  parseEtapa,
  turmaEscolarizacaoNaoIfExclusiva,
  resolverEtapaMatricula,
  carregarMapEtapas,
} from './censo-situacao-final-helpers'

export { validarSituacaoFinal }

const supabase = getSupabaseAdmin()

// ---------------------------------------------------------------------------
// PRINCIPAIS
// ---------------------------------------------------------------------------

export async function exportarSituacaoFinal(
  schoolId: string,
  anoLetivoId: string,
): Promise<ResultadoExportacaoSituacaoFinal> {
  const resultado = await validarSituacaoFinal(schoolId, anoLetivoId)
  if (!resultado.valido) {
    const todosErros = [
      ...resultado.erros_por_registro.registro89,
      ...resultado.erros_por_registro.registro90,
      ...resultado.erros_por_registro.registro91,
    ]
    return { sucesso: false, erros: todosErros }
  }

  const { data: school } = await supabase
    .from('schools')
    .select('id, nome_escola, codigo_inep')
    .eq('id', schoolId)
    .single()
  if (!school) return { sucesso: false, erros: [] }

  // Gestor (Registro 89)
  const gestor = await buscarGestor(schoolId)

  // Turmas + matrículas elegíveis
  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, nome, codigo_inep, etapa_codigo, tipo_mediacao, tipos_turma, fgb, ifa, iftp, ita')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const elegiveis = (turmas || []).filter((t) => turmaEscolarizacaoNaoIfExclusiva(t))
  const elegiveisIds = new Set(elegiveis.map((t) => t.id))
  const turmaMap = new Map((turmas || []).map((t) => [t.id as string, t]))

  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const matsQualificadas = (matriculas || []).filter((m) => elegiveisIds.has(m.turma_id as string))
  const mats90 = matsQualificadas.filter((m) => !admitidaApos(m.data_matricula as string))
  const mats91 = matsQualificadas.filter((m) => admitidaApos(m.data_matricula as string))

  // Alunos (people)
  const alunoIds = [...new Set(matsQualificadas.map((m) => m.aluno_id).filter(Boolean))] as string[]
  const alunoMap = new Map<string, any>()
  if (alunoIds.length > 0) {
    const { data: pessoas } = await supabase
      .from('people')
      .select('id, nome_completo, inep_id')
      .in('id', alunoIds)
    for (const p of pessoas || []) alunoMap.set(p.id, p)
  }

  const etapaMap = await carregarMapEtapas(matsQualificadas)

  const linhas: string[] = []
  if (school && gestor) {
    linhas.push(buildRegistro89(school, gestor))
  } else {
    linhas.push(buildRegistro89(school, { cpf: '', nome_completo: '' }))
  }

  for (const m of mats90) {
    const turma = turmaMap.get(m.turma_id as string) as Record<string, any> | undefined
    const pessoa = alunoMap.get(m.aluno_id as string)
    if (!turma || !pessoa) continue
    linhas.push(buildRegistro90(m, pessoa, turma, school))
  }

  for (const m of mats91) {
    const turma = turmaMap.get(m.turma_id as string) as Record<string, any> | undefined
    const pessoa = alunoMap.get(m.aluno_id as string)
    if (!turma || !pessoa) continue
    linhas.push(buildRegistro91(m, pessoa, turma, school, etapaMap))
  }

  linhas.push('99|')

  const conteudo = linhas.join('\r\n').toUpperCase()

  return {
    sucesso: true,
    arquivo: {
      conteudo,
      nome: `${String(school.codigo_inep || 'escola').replace(/[^A-Za-z0-9]/g, '_')}_situacao_aluno_${anoLetivoId}`.substring(0, 20) + '.txt',
      encoding: 'ISO-8859-1',
      tamanho_bytes: Buffer.from(conteudo, 'utf-8').length,
      total_linhas: linhas.length,
      registros: {
        escola: 1,
        registro89: school && gestor ? 1 : 0,
        registro90: mats90.length,
        registro91: mats91.length,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// GESTOR
// ---------------------------------------------------------------------------

async function buscarGestor(schoolId: string): Promise<{ cpf: string; nome_completo: string } | null> {
  const { data: gestores } = await supabase
    .from('vinculos_profissionais')
    .select('people(cpf, nome_completo), funcoes_profissionais(nome)')
    .eq('school_id', schoolId)
    .eq('situacao', '1')

  const g = (gestores || []).find((g: any) => {
    const nomeFuncao = (g.funcoes_profissionais as any)?.nome || ''
    return FUNCAO_GESTOR_REGEX.test(nomeFuncao) && (g.people as any)?.cpf
  })
  if (!g) return null
  const p = (g as any).people
  return { cpf: p.cpf as string, nome_completo: p.nome_completo as string }
}

// ---------------------------------------------------------------------------
// BUILDERS
// ---------------------------------------------------------------------------

function buildRegistro89(school: any, gestor: { cpf: string; nome_completo: string }): string {
  return [
    '89',
    school.codigo_inep || '',
    (gestor.cpf || '').replace(/\D/g, ''),
    gestor.nome_completo || '',
  ].join('|')
}

function buildRegistro90(m: any, pessoa: any, turma: any, school: any): string {
  const codigoSituacao = codigoSituacaoFinal(m.situacao) || ''
  return [
    '90',
    school.codigo_inep || '',
    '',                                    // Código da turma na entidade/escola (não armazenado)
    turma.codigo_inep || '',
    pessoa.inep_id || m.inep_id || '',
    '',                                    // Código do aluno na entidade/escola (não armazenado)
    m.codigo_matricula_censo || '',
    codigoSituacao,
  ].join('|')
}

function buildRegistro91(
  m: any,
  pessoa: any,
  turma: any,
  school: any,
  etapaMap: Map<string, number>,
): string {
  const codigoSituacao = codigoSituacaoFinal(m.situacao) || ''
  const turmaEtapaNum = parseEtapa(turma.etapa_codigo as string)
  const alunoEtapaNum = resolverEtapaMatricula(m, etapaMap, turmaEtapaNum)
  const exigeEtapa = turmaEtapaNum !== null && ETAPAS_TURMA_EXIGEM_ETAPA.includes(turmaEtapaNum)

  return [
    '91',
    school.codigo_inep || '',
    '',                                    // Código da turma na entidade/escola (não armazenado)
    turma.codigo_inep || '',
    pessoa.inep_id || m.inep_id || '',
    '',                                    // Código do aluno na entidade/escola (não armazenado)
    '',                                    // Código da matrícula — deve ser nulo
    '',                                    // Tipo de mediação — nulo quando turma preenchida
    exigeEtapa ? (alunoEtapaNum ?? '') : '',
    codigoSituacao,
  ].join('|')
}