'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import type { ErroValidacao } from './censo-types'
import type { ResultadoValidacaoSituacaoFinal } from './censo-situacao-final-types'
import {
  criarErroSF,
  parseEtapa,
  ineiValido,
  cpfValido,
  etapaNome,
  turmaEscolarizacaoNaoIfExclusiva,
  admitidaApos,
  resolverEtapaMatricula,
  carregarMapEtapas,
} from './censo-situacao-final-helpers'
import {
  codigoSituacaoFinal,
  ETAPAS_EI,
  ETAPAS_SEM_APROVACAO,
  ETAPAS_SEM_MOVIMENTACAO,
  ETAPAS_EM_ANDAMENTO,
  ETAPAS_FINAIS_CONCLUINTE,
  ETAPAS_TURMA_EXIGEM_ETAPA,
  ETAPAS_ADMISSAO_POR_TURMA,
  FUNCAO_GESTOR_REGEX,
} from '@/data/censo/situacao-final'

const supabase = getSupabaseAdmin()

const criarErro = criarErroSF

// ---------------------------------------------------------------------------
// REGISTRO 89 — ESCOLA + GESTOR
// ---------------------------------------------------------------------------

export async function validarRegistro89(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school } = await supabase
    .from('schools')
    .select('id, nome_escola, codigo_inep, situacao_funcionamento')
    .eq('id', schoolId)
    .single()
  if (!school) {
    erros.push(criarErro('89', 'codigo_inep', 2, 'ESCOLA_NAO_ENCONTRADA',
      'Escola não encontrada.', schoolId, 'Escola', schoolId, schoolId, 'escola', 'codigo_inep'))
    return erros
  }

  const nomeEscola = (school.nome_escola as string) || 'Escola'
  const codigoInep = school.codigo_inep as string | null

  // Campo 2 — Código da escola - INEP (8 numéricos)
  if (!codigoInep || !/^\d{8}$/.test(codigoInep)) {
    erros.push(criarErro('89', 'codigo_inep', 2, 'CODIGO_INEP_ESCOLA',
      'Deve ter 8 caracteres numéricos.', schoolId, nomeEscola, schoolId,
      codigoInep || '(vazio)', 'escola', 'codigo_inep'))
  }

  // Escola com situação "Extinta" não pode constar no arquivo
  if (school.situacao_funcionamento === '3') {
    erros.push(criarErro('89', 'situacao_funcionamento', 2, 'ESCOLA_EXTINTA',
      'A escola informada não pode ter a situação de funcionamento igual a "Extinta".',
      schoolId, nomeEscola, schoolId,
      school.situacao_funcionamento as string, 'escola', 'situacao_funcionamento'))
  }

  // Gestor — mesmos critérios da Matrícula Inicial (R40)
  const { data: gestores } = await supabase
    .from('vinculos_profissionais')
    .select('*, people(id, nome_completo, cpf), funcoes_profissionais(nome)')
    .eq('school_id', schoolId)
    .eq('situacao', '1')

  const gestor = (gestores || []).find((g) => {
    if (!g.person_id) return false
    const nomeFuncao = (g.funcoes_profissionais as any)?.nome || ''
    return FUNCAO_GESTOR_REGEX.test(nomeFuncao)
  })
  const pessoaGestor = (gestor as any)?.people || null

  if (!pessoaGestor) {
    erros.push(criarErro('89', 'gestor', 3, 'GESTOR_NAO_ENCONTRADO',
      'Nenhum gestor escolar vinculado com função de diretor/gestor. Vincule o gestor na escola.',
      schoolId, nomeEscola, schoolId, '(nenhum)', 'gestor', 'gestor'))
    return erros
  }

  // Campo 3 — Número do CPF do Gestor Escolar (11 numéricos)
  const cpf = (pessoaGestor.cpf as string) || ''
  if (!/^\d{11}$/.test(cpf)) {
    erros.push(criarErro('89', 'cpf', 3, 'CPF_GESTOR_FORMATO',
      'Deve ter 11 caracteres numéricos.', pessoaGestor.id, pessoaGestor.nome_completo || 'Gestor',
      schoolId, cpf || '(vazio)', 'gestor', 'cpf'))
  } else if (cpf === '00000000191') {
    erros.push(criarErro('89', 'cpf', 3, 'CPF_NAO_PERMITIDO',
      'O CPF 00000000191 não pode ser usado.', pessoaGestor.id, pessoaGestor.nome_completo || 'Gestor',
      schoolId, cpf, 'gestor', 'cpf'))
  } else if (!cpfValido(cpf)) {
    erros.push(criarErro('89', 'cpf', 3, 'CPF_INVALIDO',
      'CPF inválido conforme dígitos verificadores.', pessoaGestor.id, pessoaGestor.nome_completo || 'Gestor',
      schoolId, cpf, 'gestor', 'cpf'))
  }

  // Campo 4 — Nome do Gestor (≤100, alfabético, sem acento/acentuação)
  const nome = (pessoaGestor.nome_completo as string) || ''
  if (!nome.trim()) {
    erros.push(criarErro('89', 'nome_gestor', 4, 'NOME_GESTOR_VAZIO',
      'Deve ser preenchido com o nome do gestor.', pessoaGestor.id, nome, schoolId,
      '(vazio)', 'gestor', 'nome_gestor'))
  } else if (
    nome.length > 100 ||
    !/^[A-Za-zÀ-ÿ .'-]+$/.test(nome) ||
    /[ÁÀÂÃÉÊÍÓÔÕÚÇáàâãéêíóôõúç]/i.test(nome) &&
    !/^[A-Z][A-Za-z .'-]+$/.test(nome)
  ) {
    erros.push(criarErro('89', 'nome_gestor', 4, 'NOME_GESTOR_INVALIDO',
      'Deve ter até 100 caracteres alfabéticos e ser preenchido sem acentuação.',
      pessoaGestor.id, nome, schoolId, nome, 'gestor', 'nome_gestor'))
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 90 — SITUAÇÃO DO ALUNO (escolarização)
// ---------------------------------------------------------------------------

export async function validarRegistro90(
  schoolId: string,
  anoLetivoId: string,
): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school } = await supabase
    .from('schools')
    .select('id, nome_escola, codigo_inep')
    .eq('id', schoolId)
    .single()
  if (!school || !/^\d{8}$/.test(school.codigo_inep as string)) {
    return erros
  }

  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, nome, codigo_inep, etapa_codigo, tipo_mediacao, tipos_turma, fgb, ifa, iftp, ita')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const turmasElegiveis = (turmas || []).filter((t) => turmaEscolarizacaoNaoIfExclusiva(t))
  const turmaMap = new Map((turmas || []).map((t) => [t.id as string, t]))

  const matsElegiveis = (matriculas || []).filter((m) => {
    const turma = turmaMap.get(m.turma_id as string)
    return turma && turmasElegiveis.some((t) => t.id === turma.id)
  })

  // Alunos (pessoas) — lookup por inep_id
  const alunoIds = [...new Set(matsElegiveis.map((m) => m.aluno_id).filter(Boolean))]
  const alunoMap = new Map<string, any>()
  if (alunoIds.length > 0) {
    const { data: pessoas } = await supabase
      .from('people')
      .select('id, nome_completo, inep_id')
      .in('id', alunoIds as string[])
    for (const p of pessoas || []) alunoMap.set(p.id, p)
  }

  const etapaMap = await carregarMapEtapas(matsElegiveis)

  for (const m of matsElegiveis) {
    const turma = turmaMap.get(m.turma_id as string) as Record<string, any> | undefined
    const pessoa = alunoMap.get(m.aluno_id as string)
    if (!turma || !pessoa) continue

    const entidadeId = m.id as string
    const entidadeNome = (pessoa.nome_completo as string) || 'Aluno'
    const turmaId = turma.id as string
    const etapaNum = resolverEtapaMatricula(m, etapaMap, parseEtapa(turma.etapa_codigo as string))

    // Campo 4 — Código da turma - INEP
    if (!ineiValido(turma.codigo_inep as string)) {
      erros.push(criarErro('90', 'codigo_inep', 4, 'TURMA_SEM_INEP',
        'Deve ter até 10 caracteres numéricos (código INEP da turma).',
        turmaId, turma.nome || 'Turma', schoolId,
        turma.codigo_inep || '(vazio)', 'turma', 'codigo_inep'))
    }

    // Campo 5 — Código de identificação única do aluno - INEP
    const alunoInep = pessoa.inep_id || m.inep_id
    if (!ineiValido(alunoInep as string)) {
      erros.push(criarErro('90', 'inep_id', 5, 'ALUNO_SEM_INEP',
        'Deve ter 12 caracteres numéricos (código de identificação única do aluno - INEP).',
        m.aluno_id as string, entidadeNome, schoolId,
        alunoInep || '(vazio)', 'aluno', 'inep_id'))
    }

    // Campo 7 — Código da matrícula
    if (!m.codigo_matricula_censo || isNaN(parseInt(String(m.codigo_matricula_censo), 10))) {
      erros.push(criarErro('90', 'codigo_matricula_censo', 7, 'MATRICULA_SEM_CODIGO',
        'Deve ter até 12 caracteres numéricos (código da matrícula recebido no arquivo de exportação).',
        entidadeId, entidadeNome, schoolId,
        m.codigo_matricula_censo || '(vazio)', 'matricula', 'codigo_matricula_censo'))
    }

    // Campo 8 — Situação do aluno
    validaSituacaoMomento(
      erros, '90', 8, m, entidadeId, entidadeNome, schoolId,
      etapaNum,
    )
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 91 — ADMITIDO APÓS
// ---------------------------------------------------------------------------

export async function validarRegistro91(
  schoolId: string,
  anoLetivoId: string,
): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school } = await supabase
    .from('schools')
    .select('id, nome_escola, codigo_inep')
    .eq('id', schoolId)
    .single()
  if (!school || !/^\d{8}$/.test(school.codigo_inep as string)) {
    return erros
  }

  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, nome, codigo_inep, etapa_codigo, tipo_mediacao, tipos_turma, fgb, ifa, iftp, ita')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const turmasElegiveis = (turmas || []).filter((t) => turmaEscolarizacaoNaoIfExclusiva(t))
  const turmaMap = new Map((turmas || []).map((t) => [t.id as string, t]))

  const matsAdmitidos = (matriculas || []).filter((m) => {
    const turma = turmaMap.get(m.turma_id as string)
    if (!turma || !turmasElegiveis.some((t) => t.id === turma.id)) return false
    return admitidaApos(m.data_matricula as string)
  })

  const alunoIds = [...new Set(matsAdmitidos.map((m) => m.aluno_id).filter(Boolean))]
  const alunoMap = new Map<string, any>()
  if (alunoIds.length > 0) {
    const { data: pessoas } = await supabase
      .from('people')
      .select('id, nome_completo, inep_id')
      .in('id', alunoIds as string[])
    for (const p of pessoas || []) alunoMap.set(p.id, p)
  }

  const etapaMap = await carregarMapEtapas(matsAdmitidos)

  for (const m of matsAdmitidos) {
    const turma = turmaMap.get(m.turma_id as string) as Record<string, any> | undefined
    const pessoa = alunoMap.get(m.aluno_id as string)
    if (!turma || !pessoa) continue

    const entidadeId = m.id as string
    const entidadeNome = (pessoa.nome_completo as string) || 'Aluno'
    const turmaId = turma.id as string
    const turmaEtapaNum = parseEtapa(turma.etapa_codigo as string)
    const alunoEtapaNum = resolverEtapaMatricula(m, etapaMap, turmaEtapaNum)

    // Campo 4 — Código da turma - INEP
    if (!ineiValido(turma.codigo_inep as string)) {
      erros.push(criarErro('91', 'codigo_inep', 4, 'TURMA_SEM_INEP',
        'Deve ter até 10 caracteres numéricos (código da turma - INEP).',
        turmaId, turma.nome || 'Turma', schoolId,
        turma.codigo_inep || '(vazio)', 'turma', 'codigo_inep'))
    }

    // Campo 5 — Código de identificação única do aluno - INEP
    const alunoInep = pessoa.inep_id || m.inep_id
    if (!ineiValido(alunoInep as string)) {
      erros.push(criarErro('91', 'inep_id', 5, 'ALUNO_SEM_INEP',
        'Deve ter 12 caracteres numéricos (código de identificação única do aluno - INEP).',
        m.aluno_id as string, entidadeNome, schoolId,
        alunoInep || '(vazio)', 'aluno', 'inep_id'))
    }

    // Campo 9 — Código da etapa (obrigatório em turmas 3,22,23,56,64,72)
    const exigeEtapa = turmaEtapaNum !== null && ETAPAS_TURMA_EXIGEM_ETAPA.includes(turmaEtapaNum)
    if (exigeEtapa && alunoEtapaNum === null) {
      erros.push(criarErro('91', 'etapa_codigo', 9, 'ETAPA_OBRIGATORIA',
        `Deve ser preenchido quando a etapa da turma em [Código da turma - INEP] for ${turmaEtapaNum}.`,
        entidadeId, entidadeNome, schoolId, '(vazio)', 'matricula', 'etapa_codigo'))
    } else if (alunoEtapaNum !== null && turmaEtapaNum !== null && ETAPAS_ADMISSAO_POR_TURMA[turmaEtapaNum]) {
      const permitidas = ETAPAS_ADMISSAO_POR_TURMA[turmaEtapaNum]
      if (!permitidas.includes(alunoEtapaNum)) {
        erros.push(criarErro('91', 'etapa_codigo', 9, 'ETAPA_NAO_PERMITIDA',
          `O código pertence a uma turma cuja etapa (${etapaNome(turmaEtapaNum)}) não permite a etapa ${etapaNome(alunoEtapaNum)} para a matrícula admitida após.`,
          entidadeId, entidadeNome, schoolId, String(alunoEtapaNum), 'matricula', 'etapa_codigo'))
      }
    }

    // Campo 10 — Situação do aluno (mesmas regras do 90)
    validaSituacaoMomento(
      erros, '91', 10, m, entidadeId, entidadeNome, schoolId,
      alunoEtapaNum ?? turmaEtapaNum,
    )
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGRA COMUM — CAMPO "SITUAÇÃO DO ALUNO" (registros 90 e 91)
// ---------------------------------------------------------------------------

function validaSituacaoMomento(
  erros: ErroValidacao[],
  registro: '90' | '91',
  numeroCampo: number,
  m: Record<string, any>,
  entidadeId: string,
  entidadeNome: string,
  schoolId: string,
  etapaNum: number | null,
): void {
  const situacaoCenso = codigoSituacaoFinal(m.situacao as string)
  const etapaStr = etapaNum === null ? '' : etapaNome(etapaNum)

  if (!situacaoCenso || !/^[1-8]$/.test(situacaoCenso)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_INVALIDA',
      'Deve ser preenchido com 1, 2, 3, 4, 5, 6, 7 ou 8.',
      entidadeId, entidadeNome, schoolId, String(m.situacao || '(vazio)'), 'matricula', 'situacao'))
    return
  }

  if (etapaNum === null) return

  // Registro 90 — "Admitido após" → somente 1 (Transferido) ou 2 (Deixou de frequentar)
  // (no Registro 91 todos os alunos já são admitidos após — a regra não se aplica)
  if (registro === '90' && admitidaApos(m.data_matricula as string) && !['1', '2'].includes(situacaoCenso)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_ADMITIDO_APOS',
      'Deve ser preenchido com 1 ou 2, pois o aluno foi "admitido após".',
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }

  // Educação Infantil → somente 1, 2, 3 e 8
  if (ETAPAS_EI.includes(etapaNum) && !['1', '2', '3', '8'].includes(situacaoCenso)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_EI',
      `Deve ser preenchido com 1, 2, 3 ou 8 quando a matrícula for de Educação Infantil, mas a matrícula está em ${etapaStr}.`,
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }

  // Etapa 1/2 → não pode ser 4, 5 ou 6
  if (ETAPAS_SEM_APROVACAO.includes(etapaNum) && ['4', '5', '6'].includes(situacaoCenso)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_EI_SEM_RESULTADO',
      'Situação não permitida para a etapa informada (Educação Infantil não possui reprovação/aprovação).',
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }

  // Não pode ser 6 — Aprovado concluinte — fora das etapas finais
  if (situacaoCenso === '6' && !ETAPAS_FINAIS_CONCLUINTE.includes(etapaNum)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_CONCLUINTE',
      `Não pode ser preenchido com 6 nessa etapa de ensino (${etapaStr}).`,
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }

  // Não pode ser 8 — Em andamento — fora das etapas EJA/EM
  if (situacaoCenso === '8' && !ETAPAS_EM_ANDAMENTO.includes(etapaNum)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_EM_ANDAMENTO',
      `Não pode ser preenchido com 8 nessa etapa de ensino (${etapaStr}).`,
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }

  // Não pode ser 7 — Sem movimentação — fora das etapas 1 e 2
  if (situacaoCenso === '7' && !ETAPAS_SEM_MOVIMENTACAO.includes(etapaNum)) {
    erros.push(criarErro(registro, 'situacao', numeroCampo, 'SITUACAO_SEM_MOVIMENTACAO',
      `Não pode ser 7 quando a etapa da matrícula não for 1 ou 2 (${etapaStr}).`,
      entidadeId, entidadeNome, schoolId, situacaoCenso, 'matricula', 'situacao'))
  }
}

// ---------------------------------------------------------------------------
// RESUME — contagens para exibição
// ---------------------------------------------------------------------------

export async function contagemSituacaoFinal(
  schoolId: string,
  anoLetivoId: string,
): Promise<{ total_matriculas_90: number; total_admitidos_apos_91: number; total_sem_inep: number }> {
  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, codigo_inep, etapa_codigo, tipo_mediacao, tipos_turma, fgb, ifa, iftp, ita')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('aluno_id, turma_id, data_matricula, inep_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const elegiveis = (turmas || []).filter((t) => turmaEscolarizacaoNaoIfExclusiva(t))
  const elegiveisIds = new Set(elegiveis.map((t) => t.id))
  const mats = (matriculas || []).filter((m) => elegiveisIds.has(m.turma_id as string))

  const alunoIds = [...new Set(mats.map((m) => m.aluno_id).filter(Boolean))] as string[]
  const pessoasSemInep = new Set<string>()
  if (alunoIds.length > 0) {
    const { data: pessoas } = await supabase
      .from('people')
      .select('id, inep_id')
      .in('id', alunoIds)
    for (const p of pessoas || []) {
      if (!p.inep_id) pessoasSemInep.add(p.id)
    }
  }

  return {
    total_matriculas_90: mats.filter((m) => !admitidaApos(m.data_matricula as string)).length,
    total_admitidos_apos_91: mats.filter((m) => admitidaApos(m.data_matricula as string)).length,
    total_sem_inep: pessoasSemInep.size,
  }
}

// ---------------------------------------------------------------------------
// MAIN ENTRY POINT
// ---------------------------------------------------------------------------

export async function validarSituacaoFinal(
  schoolId: string,
  anoLetivoId: string,
): Promise<ResultadoValidacaoSituacaoFinal> {
  const [erros89, erros90, erros91, resumo] = await Promise.all([
    validarRegistro89(schoolId),
    validarRegistro90(schoolId, anoLetivoId),
    validarRegistro91(schoolId, anoLetivoId),
    contagemSituacaoFinal(schoolId, anoLetivoId),
  ])

  const total_erros = erros89.length + erros90.length + erros91.length

  return {
    valido: total_erros === 0,
    total_erros,
    erros_por_registro: {
      registro89: erros89,
      registro90: erros90,
      registro91: erros91,
    },
    resumo,
  }
}