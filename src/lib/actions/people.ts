'use server'

import { getSupabaseAdmin } from '@/lib/auth'

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
  auxiliary_transcricao: boolean | null
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

export async function getPeople(schoolId: string, search?: string, perfil?: string, mostrarInativos?: boolean) {
  let query = supabase
    .from('people')
    .select('*')
    .eq('school_id', schoolId)
    .order('nome_completo', { ascending: true })

  if (!mostrarInativos) query = query.eq('ativo', true)
  if (search) query = query.ilike('nome_completo', `%${search}%`)
  if (perfil) query = query.contains('perfil', [perfil])

  const { data, error } = await query
  if (error) throw error
  return data as Person[]
}

export async function getPerson(id: string) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Person
}

async function verificarCpfDuplicado(cpf: string | null, schoolId: string, ignoreId?: string) {
  if (!cpf) return
  let query = supabase
    .from('people')
    .select('id')
    .eq('cpf', cpf)
    .eq('school_id', schoolId)
    .eq('ativo', true)
  if (ignoreId) query = query.neq('id', ignoreId)
  const { data } = await query.limit(1)
  if (data && data.length > 0) throw new Error('Já existe uma pessoa com este CPF nesta escola')
}

export async function createPerson(person: Partial<Person>) {
  await verificarCpfDuplicado(person.cpf ?? null, person.school_id!)

  // Gerar código sequencial por escola
  const { data: maxResult } = await supabase
    .from('people')
    .select('codigo_pessoa')
    .eq('school_id', person.school_id)
    .order('codigo_pessoa', { ascending: false })
    .limit(1)

  const nextCode = (maxResult?.[0]?.codigo_pessoa as number ?? 0) + 1

  const { data, error } = await supabase
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

      const { data: data2, error: error2 } = await supabase
        .from('people')
        .insert({ ...person, codigo_pessoa: nextCode2 })
        .select()
        .single()

      if (error2) throw error2
      return data2 as Person
    }
    throw error
  }
  return data as Person
}

export async function updatePerson(id: string, person: Partial<Person>) {
  await verificarCpfDuplicado(person.cpf ?? null, person.school_id!, id)

  const { data, error } = await supabase
    .from('people')
    .update(person)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Person
}

export async function deletePerson(id: string) {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function inativarPessoa(id: string) {
  const { error } = await supabase
    .from('people')
    .update({ ativo: false })
    .eq('id', id)

  if (error) throw error
}

export async function reativarPessoa(id: string) {
  const { error } = await supabase
    .from('people')
    .update({ ativo: true })
    .eq('id', id)

  if (error) throw error
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
  dados: Partial<ResponsavelAluno>
) {
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
  return data
}

export async function desvincularResponsavel(responsavelId: string, alunoId: string) {
  const { error } = await supabase
    .from('responsavel_alunos')
    .delete()
    .eq('responsavel_id', responsavelId)
    .eq('aluno_id', alunoId)

  if (error) throw error
}

// ============================================
// Utilitários
// ============================================

export async function buscarAlunos(schoolId: string, search?: string) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, codigo_pessoa')
    .eq('ativo', true)
    .eq('school_id', schoolId)
    .contains('perfil', ['aluno'])
    .order('nome_completo')

  if (search) query = query.ilike('nome_completo', `%${search}%`)

  const { data, error } = await query.limit(20)
  if (error) throw error
  return data as { id: string; nome_completo: string; codigo_pessoa: number }[]
}

export async function getPessoaPorEmail(email: string, schoolId: string) {
  const { data, error } = await supabase
    .from('people')
    .select('id, nome_completo, perfil_id')
    .eq('email', email)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getPessoaPorCpf(cpf: string) {
  const { data, error } = await supabase
    .from('people')
    .select('id, nome_completo, email')
    .eq('cpf', cpf)
    .maybeSingle()

  if (error) throw error
  return data
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
}) {
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

  return data.user
}
