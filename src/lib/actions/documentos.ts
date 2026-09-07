'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { getConfigDocumentos } from './documentos-config'
import { nomeMunicipioCeara } from '@/lib/documentos-config'
import sanitizeHtml from 'sanitize-html'

const supabase = getSupabaseAdmin()

// ─── Tipos ───

export type AlunoResumidoDocumento = {
  id: string
  nome_completo: string
  cpf: string | null
  turma_nome: string | null
  situacao: string | null
}

export type IdentidadeEscola = {
  nome_escola: string
  nome_fantasia: string
  cnpj: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  cep: string
  telefone: string
  email: string
  site: string
  mantenedora: string
  cabecalho: string
  rodape: string
  responsavel_nome: string
  responsavel_cargo: string
  logo: string | null
}

export type DadosDeclaracaoMatricula = {
  aluno: {
    nome_completo: string
    data_nascimento: string | null
    cpf: string | null
    filiacao_1: string | null
    filiacao_2: string | null
    municipio_nascimento: string | null
  }
  matricula: {
    id: string
    situacao: string
    data_matricula: string | null
    forma_ingresso: string | null
    codigo_inep: string | null
    turma_nome: string
    turma_codigo_inep: string | null
    turnos: string[]
    etapa_nome: string | null
    ano_letivo_descricao: string
  }
  escola: IdentidadeEscola
}

export type SaudeFicha = {
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
  transtorno_aprendizagem: boolean | null
  discalculia: boolean | null
  disgrafia: boolean | null
  dislalia: boolean | null
  dislexia: boolean | null
  tdah: boolean | null
  tpac: boolean | null
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
}

export type DadosFichaIndividual = {
  aluno: {
    nome_completo: string
    cpf: string | null
    data_nascimento: string | null
    sexo: string | null
    cor_raca: string | null
    nacionalidade: string | null
    municipio_nascimento: string | null
    inep_id: string | null
    filiacao_1: string | null
    filiacao_2: string | null
    cep: string | null
    municipio_residencia: string | null
    logradouro: string | null
    numero: string | null
    bairro: string | null
    complemento: string | null
  }
  saude: SaudeFicha
  matricula: {
    id: string
    situacao: string
    data_matricula: string | null
    turma_nome: string
    turnos: string[]
    etapa_nome: string | null
    ano_letivo_descricao: string
  }
  escola: IdentidadeEscola
}

// ─── Helpers ───

export async function validarPermissaoDocumentos(
  pessoaId: string | null | undefined,
  recurso: 'documentos.oficiais' | 'documentos.preencher' | 'relatorios'
) {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', recurso, 'visualizar')
}

function textoPlano(html: string | null | undefined): string {
  if (!html) return ''
  const limpo = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
  return limpo.replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim()
}

function formatCnpj(valor: string): string {
  const d = valor.replace(/\D/g, '')
  if (d.length !== 14) return valor
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

export async function montarEscola(schoolId: string): Promise<IdentidadeEscola> {
  const config = await getConfigDocumentos(schoolId)

  const { data: school } = await supabase
    .from('schools')
    .select('nome_escola, cnpj, endereco, numero, bairro, municipio, cep, email')
    .eq('id', schoolId)
    .maybeSingle()

  const municipioCodigo = (config?.municipio_doc || school?.municipio || '').trim()
  const municipio = (nomeMunicipioCeara(municipioCodigo) || municipioCodigo).trim()

  return {
    nome_escola: (config?.nome_escola_doc || school?.nome_escola || '').trim(),
    nome_fantasia: (config?.nome_fantasia || '').trim(),
    cnpj: formatCnpj((config?.cnpj_doc || school?.cnpj || '').trim()),
    logradouro: (config?.logradouro_doc || school?.endereco || '').trim(),
    numero: (config?.numero_doc || school?.numero || '').trim(),
    bairro: (config?.bairro_doc || school?.bairro || '').trim(),
    municipio,
    cep: (config?.cep_doc || school?.cep || '').trim(),
    telefone: (config?.telefone_doc || '').trim(),
    email: (config?.email_doc || school?.email || '').trim(),
    site: (config?.site || '').trim(),
    mantenedora: (config?.mantenedora || '').trim(),
    cabecalho: textoPlano(config?.cabecalho),
    rodape: textoPlano(config?.rodape),
    responsavel_nome: (config?.responsavel_nome || '').trim(),
    responsavel_cargo: (config?.responsavel_cargo || '').trim(),
    logo: config?.logo || null,
  }
}

// ─── Server actions ───

type RawMatriculaDeclaracao = {
  id: string
  situacao: string
  data_matricula: string | null
  forma_ingresso: string | null
  codigo_inep: string | null
  turma: { nome: string; codigo_inep: string | null; turnos: unknown[] | null } | null
  etapa: { etapa_nome: string } | null
  academico_anos_letivos: { descricao: string } | null
}

export async function buscarAlunosPorAnoLetivo(
  termo: string,
  anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<AlunoResumidoDocumento[]> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const t = termo.trim()
  if (t.length < 3) return []
  const cpfDigits = t.replace(/\D/g, '')

  let pessoasQuery = supabase.from('people').select('id, nome_completo, cpf')

  if (schoolId) pessoasQuery = pessoasQuery.eq('school_id', schoolId)

  pessoasQuery = cpfDigits
    ? pessoasQuery.or(`nome_completo.ilike.%${t}%,cpf.ilike.%${cpfDigits}%`)
    : pessoasQuery.ilike('nome_completo', `%${t}%`)

  const { data: pessoas, error: pessoasError } = await pessoasQuery.limit(30)

  if (pessoasError) throw new Error(`Erro ao buscar alunos: ${pessoasError.message}`)
  if (!pessoas || pessoas.length === 0) return []

  const ids = pessoas.map(p => p.id)

  const { data: matriculas, error: matError } = await supabase
    .from('academico_matriculas')
    .select('aluno_id, situacao, ativo, turma:turma_id(nome)')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .in('aluno_id', ids)

  if (matError) throw new Error(`Erro ao buscar matrículas: ${matError.message}`)

  const porAluno = new Map<string, AlunoResumidoDocumento>()
  const ordenadas = [...(matriculas || [])].sort((a, b) => Number(b.ativo) - Number(a.ativo))

  for (const m of ordenadas) {
    if (porAluno.has(m.aluno_id)) continue
    const p = pessoas.find(x => x.id === m.aluno_id)
    if (!p) continue
    porAluno.set(m.aluno_id, {
      id: p.id,
      nome_completo: p.nome_completo,
      cpf: p.cpf,
      turma_nome: (m.turma as unknown as { nome?: string } | null)?.nome || null,
      situacao: m.situacao || null,
    })
  }

  return Array.from(porAluno.values())
}

export async function getDadosDeclaracaoMatricula(
  alunoId: string,
  anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<DadosDeclaracaoMatricula> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo, data_nascimento, cpf, filiacao_1, filiacao_2, municipio_nascimento')
    .eq('id', alunoId)
    .maybeSingle()

  const { data: rawMatricula } = await supabase
    .from('academico_matriculas')
    .select(
      'id, situacao, data_matricula, forma_ingresso, codigo_inep, ' +
        'turma:turma_id(nome, codigo_inep, turnos), ' +
        'etapa:etapa_ensino_id(etapa_nome), academico_anos_letivos(descricao)'
    )
    .eq('school_id', schoolId)
    .eq('aluno_id', alunoId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()

  const matricula = rawMatricula as unknown as RawMatriculaDeclaracao | null

  if (!pessoa || !matricula) {
    throw new Error('Aluno ou matrícula não encontrados para o ano letivo selecionado.')
  }

  const turma = matricula.turma ?? { nome: '', codigo_inep: null, turnos: null }
  const etapa = matricula.etapa ?? { etapa_nome: '' }
  const ano = matricula.academico_anos_letivos ?? { descricao: '' }

  const turnos = Array.isArray(turma.turnos)
    ? turma.turnos
        .map(t => (typeof t === 'string' ? t : (t as { turno?: string } | null)?.turno || ''))
        .filter(Boolean)
    : []

  const escola = await montarEscola(schoolId)

  return {
    aluno: {
      nome_completo: pessoa.nome_completo,
      data_nascimento: pessoa.data_nascimento || null,
      cpf: pessoa.cpf || null,
      filiacao_1: pessoa.filiacao_1 || null,
      filiacao_2: pessoa.filiacao_2 || null,
      municipio_nascimento: pessoa.municipio_nascimento || null,
    },
    matricula: {
      id: matricula.id,
      situacao: matricula.situacao,
      data_matricula: matricula.data_matricula || null,
      forma_ingresso: matricula.forma_ingresso || null,
      codigo_inep: matricula.codigo_inep || null,
      turma_nome: turma.nome || '—',
      turma_codigo_inep: turma.codigo_inep || null,
      turnos,
      etapa_nome: etapa.etapa_nome || null,
      ano_letivo_descricao: ano.descricao || '',
    },
    escola,
  }
}

const COLUNAS_SAUDE_FICHA =
  'deficiencia, cegueira, baixa_visao, visao_monocular, ' +
  'surdez, deficiencia_auditiva, surdocegueira, ' +
  'deficiencia_fisica, deficiencia_intelectual, deficiencia_multipla, ' +
  'tea, altas_habilidades, transtorno_aprendizagem, ' +
  'discalculia, disgrafia, dislalia, dislexia, tdah, tpac, ' +
  'auxilio_ledor, auxilio_transcricao, guia_interprete, ' +
  'tradutor_libras, leitura_labial, prova_ampliada, ' +
  'prova_superampliada, cd_audio, prova_libras, ' +
  'prova_video_libras, material_braille, prova_braille, tempo_adicional'

type PessoaFichaRaw = {
  nome_completo: string
  cpf: string | null
  data_nascimento: string | null
  sexo: string | null
  cor_raca: string | null
  nacionalidade: string | null
  municipio_nascimento: string | null
  inep_id: string | null
  filiacao_1: string | null
  filiacao_2: string | null
  cep: string | null
  municipio_residencia: string | null
  logradouro: string | null
  numero: string | null
  bairro: string | null
  complemento: string | null
} & SaudeFicha

type RawMatriculaFicha = {
  id: string
  situacao: string
  data_matricula: string | null
  turma: { nome: string; turnos: unknown[] | null } | null
  etapa: { etapa_nome: string } | null
  academico_anos_letivos: { descricao: string } | null
}

export async function getDadosFichaIndividual(
  alunoId: string,
  anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<DadosFichaIndividual> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const { data: rawPessoa, error: pessoaError } = await supabase
    .from('people')
    .select(
      'nome_completo, cpf, data_nascimento, sexo, cor_raca, nacionalidade, ' +
        'municipio_nascimento, inep_id, filiacao_1, filiacao_2, ' +
        'cep, municipio_residencia, logradouro, numero, bairro, complemento, ' +
        COLUNAS_SAUDE_FICHA
    )
    .eq('id', alunoId)
    .maybeSingle()

  if (pessoaError) throw new Error(`Erro ao carregar dados do aluno: ${pessoaError.message}`)

  const { data: rawMatricula, error: matriculaError } = await supabase
    .from('academico_matriculas')
    .select(
      'id, situacao, data_matricula, ' +
        'turma:turma_id(nome, turnos), ' +
        'etapa:etapa_ensino_id(etapa_nome), academico_anos_letivos(descricao)'
    )
    .eq('school_id', schoolId)
    .eq('aluno_id', alunoId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (matriculaError) throw new Error(`Erro ao carregar a matrícula: ${matriculaError.message}`)

  const matricula = rawMatricula as unknown as RawMatriculaFicha | null

  const pessoa = rawPessoa as unknown as PessoaFichaRaw | null

  if (!pessoa || !matricula) {
    throw new Error('Aluno ou matrícula não encontrados para o ano letivo selecionado.')
  }

  const {
    nome_completo,
    cpf,
    data_nascimento,
    sexo,
    cor_raca,
    nacionalidade,
    municipio_nascimento,
    inep_id,
    filiacao_1,
    filiacao_2,
    cep,
    municipio_residencia,
    logradouro,
    numero,
    bairro,
    complemento,
    ...flagsSaude
  } = pessoa

  const turma = matricula.turma ?? { nome: '', turnos: null }
  const etapa = matricula.etapa ?? { etapa_nome: '' }
  const ano = matricula.academico_anos_letivos ?? { descricao: '' }

  const turnos = Array.isArray(turma.turnos)
    ? turma.turnos
        .map(t => (typeof t === 'string' ? t : (t as { turno?: string } | null)?.turno || ''))
        .filter(Boolean)
    : []

  const escola = await montarEscola(schoolId)

  return {
    aluno: {
      nome_completo,
      cpf: cpf || null,
      data_nascimento: data_nascimento || null,
      sexo: sexo || null,
      cor_raca: cor_raca || null,
      nacionalidade: nacionalidade || null,
      municipio_nascimento: municipio_nascimento || null,
      inep_id: inep_id || null,
      filiacao_1: filiacao_1 || null,
      filiacao_2: filiacao_2 || null,
      cep: cep || null,
      municipio_residencia: municipio_residencia || null,
      logradouro: logradouro || null,
      numero: numero || null,
      bairro: bairro || null,
      complemento: complemento || null,
    },
    saude: flagsSaude as SaudeFicha,
    matricula: {
      id: matricula.id,
      situacao: matricula.situacao,
      data_matricula: matricula.data_matricula || null,
      turma_nome: turma.nome || '—',
      turnos,
      etapa_nome: etapa.etapa_nome || null,
      ano_letivo_descricao: ano.descricao || '',
    },
    escola,
  }
}