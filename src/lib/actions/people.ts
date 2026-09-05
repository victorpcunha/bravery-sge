'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria as registrarAuditoriaFramework } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type Person = {
  id: string
  school_id: string
  tipo_registro: string
  codigo_inep: string | null
  codigo_pessoa: number
  inep_id: string | null
  cpf: string | null
  nome_completo: string
  data_nascimento: string | null
  filiacao_declarada: string | null
  filiacao_1: string | null
  filiacao_2: string | null
  sexo: string | null
  cor_raca: string | null
  povo_indigena: string | null
  nacionalidade: string | null
  pais_nacionalidade: string | null
  municipio_nascimento: string | null
  perfil: string[] | null
  email: string | null
  telefone_celular: string | null
  telefone_fixo: string | null
  whatsapp: string | null
  telefone_secundario: string | null
  email_responsavel: string | null
  ativo: boolean
  // Deficiência / TEA / AH (17-28)
  deficiencia: boolean | null
  cegueira: boolean | null
  baixa_visao: boolean | null
  visao_monocular: boolean | null
  surdez: boolean | null
  deficiencia_auditiva: boolean | null
  surdocegueira: boolean | null
  deficiencia_fisica: boolean | null
  deficiencia_intelectual: boolean | null
  deficiencia_multipla: boolean | null
  tea: boolean | null
  altas_habilidades: boolean | null
  // Transtornos (29-35)
  transtorno_aprendizagem: boolean | null
  discalculia: boolean | null
  disgrafia: boolean | null
  dislalia: boolean | null
  dislexia: boolean | null
  tdah: boolean | null
  tpac: boolean | null
  // Recursos SAEB (36-49)
  auxilio_ledor: boolean | null
  auxilio_transcricao: boolean | null
  guia_interprete: boolean | null
  tradutor_libras: boolean | null
  leitura_labial: boolean | null
  prova_ampliada: boolean | null
  prova_superampliada: boolean | null
  cd_audio: boolean | null
  prova_libras: boolean | null
  prova_video_libras: boolean | null
  material_braille: boolean | null
  prova_braille: boolean | null
  tempo_adicional: boolean | null
  nenhum_recurso: boolean | null
  // Endereço
  certidao_nascimento: string | null
  pais_residencia: string | null
  cep: string | null
  municipio_residencia: string | null
  bairro: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  referencia: string | null
  zona_residencia: string | null
  localizacao_diferenciada: string | null
  // Escolaridade (56-69)
  escolaridade: string | null
  tipo_ensino_medio: string | null
  curso_superior_1: string | null
  ano_conclusao_1: number | null
  ies_1: string | null
  curso_superior_2: string | null
  ano_conclusao_2: number | null
  ies_2: string | null
  curso_superior_3: string | null
  ano_conclusao_3: number | null
  ies_3: string | null
  area_pedagogica_1: string | null
  area_pedagogica_2: string | null
  area_pedagogica_3: string | null
  // Curso Superior — campos extras
  curso_situacao_1: string | null
  curso_situacao_2: string | null
  curso_situacao_3: string | null
  curso_data_termino_1: string | null
  curso_data_termino_2: string | null
  curso_data_termino_3: string | null
  curso_data_inicio_1: string | null
  curso_data_inicio_2: string | null
  curso_data_inicio_3: string | null
  curso_carga_horaria_1: string | null
  curso_carga_horaria_2: string | null
  curso_carga_horaria_3: string | null
  // Pós-Graduação (70-88)
  pos_tipo_1: string | null
  pos_area_1: string | null
  pos_ano_1: number | null
  pos_tipo_2: string | null
  pos_area_2: string | null
  pos_ano_2: number | null
  pos_tipo_3: string | null
  pos_area_3: string | null
  pos_ano_3: number | null
  pos_tipo_4: string | null
  pos_area_4: string | null
  pos_ano_4: number | null
  pos_tipo_5: string | null
  pos_area_5: string | null
  pos_ano_5: number | null
  pos_tipo_6: string | null
  pos_area_6: string | null
  pos_ano_6: number | null
  sem_pos: boolean | null
  // Formação Continuada (89-107)
  form_creche: boolean | null
  form_pre_escola: boolean | null
  form_alfabetizacao: boolean | null
  form_anos_iniciais: boolean | null
  form_anos_finais: boolean | null
  form_medio: boolean | null
  form_eja: boolean | null
  form_especial: boolean | null
  form_indigena: boolean | null
  form_campo: boolean | null
  form_ambiental: boolean | null
  form_direitos: boolean | null
  form_bilingue: boolean | null
  form_tic: boolean | null
  form_integral: boolean | null
  form_genero: boolean | null
  form_direitos_crianca: boolean | null
  form_etnico_raciais: boolean | null
  form_gestao_escolar: boolean | null
  form_outros: boolean | null
  sem_formacao: boolean | null
  recebeu_formacao: boolean | null
  perfil_id: string | null
  data_inativacao: string | null
  motivo_inativacao: 'falecimento' | 'solicitacao_pessoa' | null
  created_at: string
  updated_at: string
}

export type ResponsavelAluno = {
  id: string
  responsavel_id: string
  aluno_id: string
  tipo_vinculo: string
  principal: boolean
  autorizado_retirar: boolean
  autorizado_boleto: boolean
  receber_comunicados: boolean
  created_at: string
  updated_at: string
}

export async function getPeople(schoolId: string | null, search?: string, perfil?: string, mostrarInativos?: boolean) {
  let query = supabase
    .from('people')
    .select('*')
    .order('codigo_pessoa', { ascending: true })

  if (schoolId) query = query.eq('school_id', schoolId)

  if (!mostrarInativos) query = query.eq('ativo', true)
  if (search) query = query.ilike('nome_completo', `%${search}%`)
  if (perfil) query = query.contains('perfil', [perfil])

  const { data, error } = await query
  if (error) throw error
  return data as Person[]
}

export async function getPerson(id: string, schoolId?: string | null) {
  let query = supabase
    .from('people')
    .select('*')
    .eq('id', id)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query.single()

  if (error) throw error
  return data as Person
}

async function verificarCpfDuplicado(cpf: string | null, schoolId: string | null, ignoreId?: string) {
  if (!cpf) return
  let query = supabase
    .from('people')
    .select('id')
    .eq('cpf', cpf)
    .eq('ativo', true)

  if (schoolId) query = query.eq('school_id', schoolId)
  if (ignoreId) query = query.neq('id', ignoreId)
  const { data } = await query.limit(1)
  if (data && data.length > 0) throw new Error('Já existe uma pessoa com este CPF nesta escola')
}

async function registrarAuditoriaPessoa(
  acao: 'criar' | 'editar' | 'excluir',
  entidade: string,
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoriaFramework({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Usuários',
    entidade,
    entidade_id,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

export async function createPerson(person: Partial<Person>, pessoaId?: string | null) {
  await verificarCpfDuplicado(person.cpf ?? null, person.school_id!)

  // Gerar código sequencial por escola
  const { data: maxResult } = await supabase
    .from('people')
    .select('codigo_pessoa')
    .eq('school_id', person.school_id)
    .order('codigo_pessoa', { ascending: false })
    .limit(1)

  const nextCode = (maxResult?.[0]?.codigo_pessoa as number ?? 0) + 1

  let { data, error } = await supabase
    .from('people')
    .insert({ ...person, codigo_pessoa: nextCode })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // Tentar novamente com o próximo código disponível (race condition no MAX)
      const { data: maxResult2 } = await supabase
        .from('people')
        .select('codigo_pessoa')
        .eq('school_id', person.school_id)
        .order('codigo_pessoa', { ascending: false })
        .limit(1)

      const nextCode2 = (maxResult2?.[0]?.codigo_pessoa as number ?? 0) + 1

      const res2 = await supabase
        .from('people')
        .insert({ ...person, codigo_pessoa: nextCode2 })
        .select()
        .single()

      if (res2.error) throw res2.error
      data = res2.data
    } else {
      throw error
    }
  }

  await registrarAuditoriaPessoa('criar', 'people', data.id, pessoaId, data.school_id, null, data)
  return data as Person
}

export async function updatePerson(id: string, person: Partial<Person>, pessoaId?: string | null) {
  await verificarCpfDuplicado(person.cpf ?? null, person.school_id!, id)

  const { data: anterior } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('people')
    .update(person)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await registrarAuditoriaPessoa('editar', 'people', id, pessoaId, data.school_id, anterior, data)
  return data as Person
}

export async function deletePerson(id: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    await registrarAuditoriaPessoa('excluir', 'people', id, pessoaId, anterior.school_id, anterior, null)
  }
}

export async function inativarPessoa(id: string, pessoaResponsavelId?: string | null) {
  const { data: pessoa } = await supabase.from('people').select('*').eq('id', id).single()
  if (!pessoa) throw new Error('Pessoa não encontrada')
  await atualizarSituacaoPessoa(id, {
    ativo: false,
    dataInativacao: new Date().toISOString().slice(0, 10),
    motivo: null,
    pessoaResponsavelId: pessoaResponsavelId || null,
  })
}

export async function reativarPessoa(id: string, pessoaResponsavelId?: string | null) {
  await atualizarSituacaoPessoa(id, {
    ativo: true,
    dataInativacao: null,
    motivo: null,
    pessoaResponsavelId: pessoaResponsavelId || null,
  })
}

export async function atualizarSituacaoPessoa(
  personId: string,
  params: {
    ativo: boolean
    dataInativacao?: string | null
    motivo: 'falecimento' | 'solicitacao_pessoa' | null
    pessoaResponsavelId?: string | null
  },
) {
  const { data: pessoaAtual, error: errPessoa } = await supabase
    .from('people')
    .select('*')
    .eq('id', personId)
    .single()

  if (errPessoa || !pessoaAtual) throw new Error('Pessoa não encontrada')

  if (!params.ativo && !params.motivo) {
    throw new Error('Selecione o motivo de inativação')
  }

  // Bloqueia inativação por solicitação da pessoa quando o aluno possui
  // matrícula ativa no ano letivo atual (a movimentação deve vir antes)
  if (!params.ativo && params.motivo === 'solicitacao_pessoa' && pessoaAtual.perfil?.includes('aluno')) {
    const matriculasAtivas = await buscarMatriculasAtivas(personId, pessoaAtual.school_id)
    if (matriculasAtivas.length > 0) {
      throw new Error(
        'O aluno possui matrícula ativa no ano letivo atual. Antes de inativar, realize uma movimentação na matrícula para alterar a situação (ex.: Transferido).',
      )
    }
  }

  const dataInativacao = params.ativo ? null : (params.dataInativacao || new Date().toISOString().slice(0, 10))
  const motivo = params.ativo ? null : params.motivo

  // Atualiza a situação na tabela people
  const { error: errUpdate } = await supabase
    .from('people')
    .update({
      ativo: params.ativo,
      data_inativacao: dataInativacao,
      motivo_inativacao: motivo,
    })
    .eq('id', personId)

  if (errUpdate) throw errUpdate

  // Bloqueio / liberação de acesso (Supabase Auth)
  await atualizarAcessoAuth(personId, params.ativo)

  // Automação: Óbito em matrículas do aluno (apenas motivo falecimento)
  if (!params.ativo && params.motivo === 'falecimento' && pessoaAtual.perfil?.includes('aluno')) {
    await registrarObitoMatriculas(personId, params.pessoaResponsavelId || null, dataInativacao!)
  }

  // Reativação: reverte matrículas marcadas como Óbito pela automação de falecimento
  if (params.ativo && pessoaAtual.perfil?.includes('aluno')) {
    await restaurarMatriculasPorReativacao(personId)
  }

  // Auditoria
  await registrarAuditoriaSituacao({
    school_id: pessoaAtual.school_id,
    entidade_id: personId,
    pessoa_id: params.pessoaResponsavelId || null,
    dados_anteriores: {
      ativo: pessoaAtual.ativo,
      data_inativacao: pessoaAtual.data_inativacao ?? null,
      motivo_inativacao: pessoaAtual.motivo_inativacao ?? null,
    },
    dados_novos: {
      ativo: params.ativo,
      data_inativacao: dataInativacao,
      motivo_inativacao: motivo,
    },
  })

  return { ativo: params.ativo, data_inativacao: dataInativacao, motivo_inativacao: motivo }
}

export type MatriculaAtivaInfo = {
  id: string
  anoLetivo: string
  turma: string | null
  dataMatricula: string
}

async function buscarMatriculasAtivas(pessoaId: string, schoolId?: string | null): Promise<MatriculaAtivaInfo[]> {
  let query = supabase
    .from('academico_matriculas')
    .select(`
      id,
      data_matricula,
      academico_anos_letivos(descricao),
      turmas(nome)
    `)
    .eq('aluno_id', pessoaId)
    .eq('ativo', true)
    .eq('situacao', 'Ativo')
    .eq('academico_anos_letivos.status', 'ativo')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error) throw error

  return (data || []).map((m: any) => ({
    id: m.id,
    anoLetivo: m.academico_anos_letivos?.descricao || '',
    turma: m.turmas?.nome || null,
    dataMatricula: m.data_matricula,
  }))
}

export async function pessoaPossuiMatriculaAtiva(
  pessoaId: string,
  schoolId?: string | null,
): Promise<{ possui: boolean; matriculas: MatriculaAtivaInfo[] }> {
  const matriculas = await buscarMatriculasAtivas(pessoaId, schoolId)
  return { possui: matriculas.length > 0, matriculas }
}

async function atualizarAcessoAuth(personId: string, ativo: boolean) {
  try {
    const { data: authUser, error: errRpc } = await supabase.rpc('fn_buscar_auth_user_por_pessoa', {
      p_person_id: personId,
    })

    if (errRpc || !authUser || authUser.length === 0) return

    const primeiroAuthUser = authUser[0] as { user_id: string }
    const authUserId = primeiroAuthUser.user_id
    if (ativo) {
      await supabase.auth.admin.updateUserById(authUserId, { ban_duration: 'none' })
    } else {
      await supabase.auth.admin.updateUserById(authUserId, { ban_duration: '100000000h' })
    }
  } catch {
    // Sem auth user vinculado ou erro transitório — não bloqueia o fluxo principal
  }
}

async function registrarObitoMatriculas(personId: string, profissionalId: string | null, dataObito: string) {
  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('id')
    .eq('aluno_id', personId)
    .eq('ativo', true)

  if (!matriculas || matriculas.length === 0) return

  for (const m of matriculas) {
    await supabase
      .from('academico_matriculas')
      .update({ situacao: 'Óbito', data_saida: dataObito })
      .eq('id', m.id)

    await supabase.from('academico_matriculas_movimentacoes').insert({
      matricula_id: m.id,
      tipo: 'Obito',
      data_movimentacao: dataObito,
      profissional_id: profissionalId,
      observacoes: 'Inativação por falecimento registrada no cadastro do usuário',
      dados_complementares: {},
    })
  }
}

async function restaurarMatriculasPorReativacao(personId: string) {
  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('id')
    .eq('aluno_id', personId)
    .eq('ativo', true)
    .eq('situacao', 'Óbito')

  if (!matriculas || matriculas.length === 0) return

  const ids = matriculas.map((m) => m.id)

  const { error: errMat } = await supabase
    .from('academico_matriculas')
    .update({ situacao: 'Ativo', data_saida: null })
    .in('id', ids)

  if (errMat) throw errMat

  await supabase
    .from('academico_matriculas_movimentacoes')
    .update({ ativo: false })
    .in('matricula_id', ids)
    .eq('tipo', 'Obito')
}

async function registrarAuditoriaSituacao(data: {
  school_id: string
  entidade_id: string
  pessoa_id: string | null
  dados_anteriores: Record<string, unknown>
  dados_novos: Record<string, unknown>
}) {
  await registrarAuditoriaFramework({
    school_id: data.school_id,
    pessoa_id: data.pessoa_id,
    modulo: 'Usuários',
    entidade: 'people',
    entidade_id: data.entidade_id,
    registro_nome: (data.dados_novos?.nome_completo as string) || (data.dados_anteriores?.nome_completo as string) || null,
    acao: 'editar',
    dados_anteriores: data.dados_anteriores,
    dados_novos: data.dados_novos,
  })
}

// ============================================
// Responsável - Vínculos com Alunos
// ============================================

export async function getVinculosResponsavel(responsavelId: string) {
  const { data, error } = await supabase
    .from('responsavel_alunos')
    .select('*, aluno:aluno_id(id, nome_completo, codigo_pessoa)')
    .eq('responsavel_id', responsavelId)

  if (error) throw error
  return data as any[]
}

export async function vincularResponsavel(
  responsavelId: string,
  alunoId: string,
  dados: Partial<ResponsavelAluno>,
  pessoaId?: string | null
) {
  const { data: anterior } = await supabase
    .from('responsavel_alunos')
    .select('*')
    .eq('responsavel_id', responsavelId)
    .eq('aluno_id', alunoId)
    .maybeSingle()

  const { data, error } = await supabase
    .from('responsavel_alunos')
    .upsert({
      responsavel_id: responsavelId,
      aluno_id: alunoId,
      tipo_vinculo: dados.tipo_vinculo || '3',
      principal: dados.principal || false,
      autorizado_retirar: dados.autorizado_retirar ?? true,
      autorizado_boleto: dados.autorizado_boleto ?? true,
      receber_comunicados: dados.receber_comunicados ?? true,
    })
    .select()
    .single()

  if (error) throw error

  const { data: aluno } = await supabase
    .from('people')
    .select('nome_completo, school_id')
    .eq('id', alunoId)
    .maybeSingle()

  await registrarAuditoriaPessoa(
    anterior ? 'editar' : 'criar',
    'responsavel_alunos',
    data.id,
    pessoaId,
    aluno?.school_id,
    anterior,
    data,
  )
  return data
}

export async function desvincularResponsavel(responsavelId: string, alunoId: string, pessoaId?: string | null) {
  const { data: anterior } = await supabase
    .from('responsavel_alunos')
    .select('*')
    .eq('responsavel_id', responsavelId)
    .eq('aluno_id', alunoId)
    .maybeSingle()

  const { error } = await supabase
    .from('responsavel_alunos')
    .delete()
    .eq('responsavel_id', responsavelId)
    .eq('aluno_id', alunoId)

  if (error) throw error

  if (anterior) {
    const { data: aluno } = await supabase
      .from('people')
      .select('school_id')
      .eq('id', alunoId)
      .maybeSingle()

    await registrarAuditoriaPessoa('excluir', 'responsavel_alunos', anterior.id, pessoaId, aluno?.school_id, anterior, null)
  }
}

// ============================================
// Utilitários
// ============================================

export async function buscarAlunos(schoolId: string | null, search?: string) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, codigo_pessoa')
    .eq('ativo', true)
    .contains('perfil', ['aluno'])
    .order('nome_completo')

  if (schoolId) query = query.eq('school_id', schoolId)

  if (search) query = query.ilike('nome_completo', `%${search}%`)

  const { data, error } = await query.limit(20)
  if (error) throw error
  return data as { id: string; nome_completo: string; codigo_pessoa: number }[]
}

export async function getPessoaPorEmail(email: string, schoolId: string | null) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, perfil_id')
    .eq('email', email)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getPessoaPorCpf(cpf: string, schoolId?: string | null) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, email')
    .eq('cpf', cpf)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query.maybeSingle()

  if (error) throw error
  return data
}

export async function getPessoaPorInep(inepId: string, schoolId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('id')
    .eq('inep_id', inepId)
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error
  return data as { id: string } | null
}

function validarSenha(senha: string): string | null {
  if (senha.length < 10) return 'Senha deve ter no mínimo 10 caracteres'
  if (!/[A-Z]/.test(senha)) return 'Senha deve conter pelo menos uma letra maiúscula'
  if (!/[a-z]/.test(senha)) return 'Senha deve conter pelo menos uma letra minúscula'
  if (!/[0-9]/.test(senha)) return 'Senha deve conter pelo menos um número'
  if (!/[^A-Za-z0-9]/.test(senha)) return 'Senha deve conter pelo menos um caractere especial'
  return null
}

export async function criarAuthUser(params: {
  email: string
  password: string
  personId: string
  schoolId: string
}, pessoaId?: string | null) {
  const erroSenha = validarSenha(params.password)
  if (erroSenha) throw new Error(erroSenha)

  const { data, error } = await supabase.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
    user_metadata: { person_id: params.personId },
  })

  if (error) throw error
  if (!data.user) throw new Error('Erro ao criar usuário de autenticação')

  const userId = data.user.id

  const { error: linkError } = await supabase
    .from('user_schools')
    .insert({ user_id: userId, school_id: params.schoolId })

  if (linkError) throw linkError

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo')
    .eq('id', params.personId)
    .maybeSingle()

  await registrarAuditoriaPessoa(
    'criar',
    'user_schools',
    userId,
    pessoaId,
    params.schoolId,
    null,
    { email: params.email, user_id: userId, school_id: params.schoolId, pessoa: pessoa?.nome_completo || null },
  )

  return data.user
}

export async function salvarSaudeEstudante(
  personId: string,
  schoolId: string | null,
  data: { medicamentos?: string | null },
  pessoaId?: string | null
) {
  let existingQuery = supabase
    .from('saude_estudantes')
    .select('*')
    .eq('person_id', personId)

  if (schoolId) existingQuery = existingQuery.eq('school_id', schoolId)

  const { data: existing } = await existingQuery.maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('saude_estudantes')
      .update({
        medicamentos: data.medicamentos || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
    if (error) throw error

    await registrarAuditoriaPessoa(
      'editar',
      'saude_estudantes',
      existing.id,
      pessoaId,
      schoolId,
      existing,
      { ...existing, medicamentos: data.medicamentos || null },
    )
  } else {
    const { data: criado, error } = await supabase
      .from('saude_estudantes')
      .insert({
        person_id: personId,
        school_id: schoolId,
        medicamentos: data.medicamentos || null,
      })
      .select()
      .single()
    if (error) throw error

    await registrarAuditoriaPessoa('criar', 'saude_estudantes', criado.id, pessoaId, schoolId, null, criado)
  }
}

export async function buscarSaudeEstudante(
  personId: string,
  schoolId: string
): Promise<{ medicamentos: string | null } | null> {
  let query = supabase
    .from('saude_estudantes')
    .select('medicamentos')
    .eq('person_id', personId)

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data } = await query
    .maybeSingle()

  return data as { medicamentos: string | null } | null
}
