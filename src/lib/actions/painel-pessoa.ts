'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()
const RESOURCE = 'gestao-usuarios.painel-aluno'

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

// ─── Tipos ───

export type PessoaResumida = {
  id: string
  nome_completo: string
  cpf: string
}

export type TurmaResumida = {
  id: string
  nome: string
  etapa_nome: string
}

export type DadosPessoais = {
  id: string
  nome_completo: string
  data_nascimento: string | null
  sexo: string | null
  cpf: string | null
  logradouro: string | null
  bairro: string | null
  telefone_celular: string | null
  telefone_fixo: string | null
  email: string | null
}

export type SaudeEstudante = {
  medicamentos: string | null
  condicoes: string | null
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
}

export type FrequenciaGeral = {
  percentual: number
  presencas: number
  total: number
}

export type FrequenciaPorDisciplina = {
  disciplina_id: string
  disciplina_nome: string
  percentual: number
  presencas: number
  total: number
}

export type DesempenhoComparativo = {
  disciplinas: Array<{
    disciplina_id: string
    disciplina_nome: string
    aluno_nota: number | null
    turma_media: number
  }>
  periodo: number
}

export type PeriodoAvaliacao = {
  numero: number
  label: string
}

export type HistoricoAno = {
  ano_letivo_id: string
  ano: number
  turma_nome: string
  etapa_nome: string
  situacao: string
  frequencia_percentual: number | null
}

export type Ocorrencia = {
  id: string
  tipo: string
  descricao: string
  data_ocorrencia: string
  turma_nome: string | null
}

export type QuadroAulaItem = {
  dia_semana: number
  horario_inicial: string
  horario_final: string
  disciplina_nome: string
  professor_nome: string | null
}

// ─── Server Actions ───

export async function buscarPessoasMatriculadas(
  termo: string,
  schoolId: string | null,
  pessoaId?: string | null
): Promise<PessoaResumida[]> {
  await validarPermRead(pessoaId)

  let anoQuery = supabase
    .from('academico_anos_letivos')
    .select('id')
    .eq('status', 'ativo')

  if (schoolId) anoQuery = anoQuery.eq('school_id', schoolId)

  const { data: anoVigente } = await anoQuery.maybeSingle()

  if (!anoVigente) throw new Error('Nenhum ano letivo ativo encontrado para esta escola.')

  const cpfDigits = termo.replace(/\D/g, '')

  // Busca pessoas que tenham matrícula ativa no ano letivo vigente da escola
  // Tenta RPC primeiro (mais performática)
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    'buscar_pessoas_matriculadas',
    {
      p_termo: termo,
      p_cpf_digits: cpfDigits || null,
      p_school_id: schoolId,
    }
  )

  if (!rpcError && rpcData) return rpcData as PessoaResumida[]

  // Fallback: busca pessoas por nome e filtra matrículas ativas
  let pessoasQuery = supabase
    .from('people')
    .select('id, nome_completo, cpf')

  if (schoolId) pessoasQuery = pessoasQuery.eq('school_id', schoolId)

  if (cpfDigits) {
    pessoasQuery = pessoasQuery
      .or(`nome_completo.ilike.%${termo}%,cpf.ilike.%${cpfDigits}%`)
  } else {
    pessoasQuery = pessoasQuery.ilike('nome_completo', `%${termo}%`)
  }

  const { data: pessoas, error: pessoasError } = await pessoasQuery.limit(30)

  if (pessoasError) throw new Error(`Erro ao buscar pessoas: ${pessoasError.message}`)
  if (!pessoas || pessoas.length === 0) return []

  const pessoaIds = pessoas.map(p => p.id)

  let matriculasQuery = supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('ano_letivo_id', anoVigente.id)
    .eq('ativo', true)
    .in('aluno_id', pessoaIds)

  if (schoolId) matriculasQuery = matriculasQuery.eq('school_id', schoolId)

  const { data: matriculas, error: matriculasError } = await matriculasQuery

  if (matriculasError) throw new Error(`Erro ao verificar matrículas: ${matriculasError.message}`)
  if (!matriculas || matriculas.length === 0) return []

  const matriculadosIds = new Set(matriculas.map(m => m.aluno_id))

  return pessoas
    .filter(p => matriculadosIds.has(p.id))
    .map(p => ({ id: p.id, nome_completo: p.nome_completo || '', cpf: p.cpf || '' }))
}

export async function getTurmasDaPessoa(
  pessoaId: string,
  schoolId: string | null,
  pessoaLogadaId?: string | null
): Promise<TurmaResumida[]> {
  await validarPermRead(pessoaLogadaId)

  let anoVigente: { id: string; descricao?: string; status?: string } | null = null

  let anoAtivoQuery = supabase
    .from('academico_anos_letivos')
    .select('id, descricao, status')
    .eq('status', 'ativo')

  if (schoolId) anoAtivoQuery = anoAtivoQuery.eq('school_id', schoolId)

  const { data: anoAtivo, error: errAno } = await anoAtivoQuery.maybeSingle()

  if (errAno) throw new Error(`Erro ao buscar ano letivo: ${errAno.message}`)

  if (anoAtivo) {
    anoVigente = anoAtivo
  } else {
    let ultimoQuery = supabase
      .from('academico_anos_letivos')
      .select('id')
      .order('data_inicio', { ascending: false })

    if (schoolId) ultimoQuery = ultimoQuery.eq('school_id', schoolId)

    const { data: ultimo } = await ultimoQuery
      .limit(1)
      .maybeSingle()
    if (ultimo) anoVigente = ultimo
  }

  if (!anoVigente) return []

  let matTurmaQuery = supabase
    .from('academico_matriculas')
    .select('turma_id, turmas!turma_id(nome, etapa_ensino_id)')
    .eq('aluno_id', pessoaId)
    .eq('ano_letivo_id', anoVigente.id)
    .eq('ativo', true)

  if (schoolId) matTurmaQuery = matTurmaQuery.eq('school_id', schoolId)

  const { data, error: errMat } = await matTurmaQuery

  if (errMat) throw new Error(`Erro ao buscar matrículas: ${errMat.message}`)
  if (!data || data.length === 0) return []

  // Busca nomes das etapas
  const etapaIds = [...new Set(data.map(m => (m.turmas as any)?.etapa_ensino_id).filter(Boolean))]
  const { data: etapas } = await supabase
    .from('academico_etapas_ensino')
    .select('id, nome')
    .in('id', etapaIds)

  const mapaEtapas = new Map((etapas || []).map(e => [e.id, e.nome]))

  return data.map(item => ({
    id: item.turma_id,
    nome: (item.turmas as any)?.nome || '',
    etapa_nome: mapaEtapas.get((item.turmas as any)?.etapa_ensino_id) || '',
  }))
}

export async function getDadosPessoais(
  pessoaId: string,
  pessoaLogadaId?: string | null
): Promise<DadosPessoais | null> {
  await validarPermRead(pessoaLogadaId)

  const { data } = await supabase
    .from('people')
    .select('id, nome_completo, data_nascimento, sexo, cpf, logradouro, bairro, telefone_celular, telefone_fixo, email')
    .eq('id', pessoaId)
    .single()

  if (!data) return null
  return data as DadosPessoais
}

export async function getSaudeEstudante(
  pessoaId: string,
  schoolId: string | null,
  pessoaLogadaId?: string | null
): Promise<SaudeEstudante | null> {
  await validarPermRead(pessoaLogadaId)

  let saudeQuery = supabase
    .from('saude_estudantes')
    .select('medicamentos, condicoes')
    .eq('person_id', pessoaId)

  if (schoolId) saudeQuery = saudeQuery.eq('school_id', schoolId)

  const [saudeRes, peopleRes] = await Promise.all([
    saudeQuery.maybeSingle(),
    supabase
      .from('people')
      .select(`
        deficiencia, cegueira, baixa_visao, visao_monocular,
        surdez, deficiencia_auditiva, surdocegueira,
        deficiencia_fisica, deficiencia_intelectual, deficiencia_multipla,
        tea, altas_habilidades, transtorno_aprendizagem,
        discalculia, disgrafia, dislalia, dislexia, tdah, tpac,
        auxilio_ledor, auxiliary_transcricao, guia_interprete,
        tradutor_libras, leitura_labial, prova_ampliada,
        prova_superampliada, cd_audio, prova_libras,
        prova_video_libras, material_braille, prova_braille,
        tempo_adicional, nenhum_recurso
      `)
      .eq('id', pessoaId)
      .maybeSingle(),
  ])

  return {
    medicamentos: saudeRes.data?.medicamentos || null,
    condicoes: saudeRes.data?.condicoes || null,
    ...(peopleRes.data || {}),
  } as SaudeEstudante
}

export async function getFrequenciaGeral(
  pessoaId: string,
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<FrequenciaGeral | null> {
  await validarPermRead(pessoaLogadaId)

  const { count: presencas, error: errP } = await supabase
    .from('academico_frequencias_dia')
    .select('*', { count: 'exact', head: true })
    .eq('turma_id', turmaId)
    .eq('aluno_id', pessoaId)
    .in('status', ['P', 'FJ'])

  if (errP) return null

  const { count: total, error: errT } = await supabase
    .from('academico_frequencias_dia')
    .select('*', { count: 'exact', head: true })
    .eq('turma_id', turmaId)
    .eq('aluno_id', pessoaId)
    .neq('status', null)

  if (errT || !total) return null

  return {
    percentual: Math.round((presencas! / total) * 100),
    presencas: presencas!,
    total,
  }
}

export async function getFrequenciaPorDisciplina(
  pessoaId: string,
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<FrequenciaPorDisciplina[]> {
  await validarPermRead(pessoaLogadaId)

  const { data } = await supabase
    .from('academico_frequencias_aula')
    .select('disciplina_id, status')
    .eq('turma_id', turmaId)
    .eq('aluno_id', pessoaId)

  if (!data?.length) return []

  const agrupado: Record<string, { presencas: number; total: number }> = {}

  for (const r of data) {
    if (!agrupado[r.disciplina_id]) agrupado[r.disciplina_id] = { presencas: 0, total: 0 }
    agrupado[r.disciplina_id].total++
    if (r.status === 'P' || r.status === 'FJ') agrupado[r.disciplina_id].presencas++
  }

  const discIds = Object.keys(agrupado)

  const { data: nomes } = await supabase
    .from('academico_matriz_disciplinas')
    .select('id, disciplina:disciplina_id(nome)')
    .in('id', discIds)

  const mapaNomes = new Map<string, string>()
  if (nomes) {
    for (const n of nomes) {
      const disciplina = n.disciplina as unknown as { nome: string } | null
      mapaNomes.set(n.id, disciplina?.nome || n.id)
    }
  }

  return Object.entries(agrupado).map(([disciplina_id, vals]) => ({
    disciplina_id,
    disciplina_nome: mapaNomes.get(disciplina_id) || disciplina_id,
    percentual: Math.round((vals.presencas / vals.total) * 100),
    presencas: vals.presencas,
    total: vals.total,
  }))
}

export async function getPeriodosAvaliacao(
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<PeriodoAvaliacao[]> {
  await validarPermRead(pessoaLogadaId)

  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .single()

  if (!turma) return []

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)
    .maybeSingle()

  if (!matriz?.metodo_avaliacao_id) return []

  const { data: metodo } = await supabase
    .from('academico_metodos_avaliacao')
    .select('quantidade_periodos_numerico')
    .eq('id', matriz.metodo_avaliacao_id)
    .single()

  const qtd = metodo?.quantidade_periodos_numerico || 0
  const periodos: PeriodoAvaliacao[] = []

  for (let i = 1; i <= qtd; i++) {
    periodos.push({ numero: i, label: `${i}º Período` })
  }

  return periodos
}

export async function getDesempenhoComparativo(
  pessoaId: string,
  turmaId: string,
  periodo: number | null,
  pessoaLogadaId?: string | null
): Promise<DesempenhoComparativo | null> {
  await validarPermRead(pessoaLogadaId)

  const query = supabase
    .from('academico_notas')
    .select('aluno_id, disciplina_id, valor')
    .eq('turma_id', turmaId)
    .not('valor', 'is', null)

  if (periodo) query.eq('periodo', periodo)

  const { data } = await query

  if (!data?.length) return null

  // Agrupar por disciplina
  const discMap = new Map<string, { notasAluno: number[]; notasTurma: number[] }>()
  for (const n of data) {
    if (!discMap.has(n.disciplina_id)) {
      discMap.set(n.disciplina_id, { notasAluno: [], notasTurma: [] })
    }
    const entry = discMap.get(n.disciplina_id)!
    if (n.aluno_id === pessoaId) entry.notasAluno.push(n.valor!)
    entry.notasTurma.push(n.valor!)
  }

  const discIds = [...discMap.keys()]

  // Buscar nomes das disciplinas
  const { data: nomes } = await supabase
    .from('academico_matriz_disciplinas')
    .select('id, disciplina:disciplina_id(nome)')
    .in('id', discIds)

  const mapaNomes = new Map<string, string>()
  if (nomes) {
    for (const n of nomes) {
      const disciplina = n.disciplina as unknown as { nome: string } | null
      mapaNomes.set(n.id, disciplina?.nome || n.id)
    }
  }

  const disciplinas = discIds.map(id => {
    const entry = discMap.get(id)!
    const mediaAluno = entry.notasAluno.length
      ? Math.round((entry.notasAluno.reduce((a, b) => a + b, 0) / entry.notasAluno.length) * 100) / 100
      : null
    const mediaTurma = Math.round((entry.notasTurma.reduce((a, b) => a + b, 0) / entry.notasTurma.length) * 100) / 100

    return {
      disciplina_id: id,
      disciplina_nome: mapaNomes.get(id) || id,
      aluno_nota: mediaAluno,
      turma_media: mediaTurma,
    }
  })

  return { disciplinas, periodo: periodo || 0 }
}

export async function getHistoricoSistema(
  pessoaId: string,
  pessoaLogadaId?: string | null
): Promise<HistoricoAno[]> {
  await validarPermRead(pessoaLogadaId)

  const { data } = await supabase
    .from('academico_matriculas')
    .select(`
      id, ano_letivo_id, turma_id, situacao,
      academico_anos_letivos!ano_letivo_id(ano),
      turmas!turma_id(nome, academico_etapas_ensino!etapa_ensino_id(nome))
    `)
    .eq('aluno_id', pessoaId)
    .order('created_at', { ascending: false })

  if (!data) return []

  const historico: HistoricoAno[] = []

  for (const m of data) {
    const ano = (m.academico_anos_letivos as any)?.ano
    if (!ano) continue

    const { count: presencas } = await supabase
      .from('academico_frequencias_dia')
      .select('*', { count: 'exact', head: true })
      .eq('aluno_id', pessoaId)
      .eq('turma_id', m.turma_id)
      .in('status', ['P', 'FJ'])

    const { count: total } = await supabase
      .from('academico_frequencias_dia')
      .select('*', { count: 'exact', head: true })
      .eq('aluno_id', pessoaId)
      .eq('turma_id', m.turma_id)
      .neq('status', null)

    historico.push({
      ano_letivo_id: m.ano_letivo_id,
      ano,
      turma_nome: (m.turmas as any)?.nome || '',
      etapa_nome: (m.turmas as any)?.academico_etapas_ensino?.nome || '',
      situacao: m.situacao,
      frequencia_percentual: total ? Math.round((presencas! / total) * 100) : null,
    })
  }

  return historico
}

export async function getQuadroAulas(
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<QuadroAulaItem[]> {
  await validarPermRead(pessoaLogadaId)

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id')
    .eq('turma_id', turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!quadro) return []

  const { data: horarios } = await supabase
    .from('quadro_aulas_horarios')
    .select('dia_semana, horario_inicial, horario_final, disciplina_id')
    .eq('quadro_aula_id', quadro.id)
    .eq('ativo', true)
    .order('dia_semana')
    .order('horario_inicial')

  if (!horarios) return []

  const discIds = [...new Set(horarios.map(h => h.disciplina_id).filter(Boolean as unknown as any))] as string[]

  const { data: discNames } = discIds.length
    ? await supabase
        .from('academico_matriz_disciplinas')
        .select('id, disciplina:disciplina_id(nome)')
        .in('id', discIds)
    : { data: [] }

  const mapaNomes = new Map<string, string>()
  if (discNames) {
    for (const d of discNames) {
      const disciplina = d.disciplina as unknown as { nome: string } | null
      mapaNomes.set(d.id, disciplina?.nome || d.id)
    }
  }

  return horarios.map(h => ({
    dia_semana: h.dia_semana,
    horario_inicial: h.horario_inicial.slice(0, 5),
    horario_final: h.horario_final.slice(0, 5),
    disciplina_nome: h.disciplina_id ? mapaNomes.get(h.disciplina_id) || '' : '',
    professor_nome: null,
  }))
}

export async function getOcorrencias(
  pessoaId: string,
  schoolId: string | null,
  pessoaLogadaId?: string | null
): Promise<Ocorrencia[]> {
  await validarPermRead(pessoaLogadaId)

  let ocoQuery = supabase
    .from('ocorrencias')
    .select('id, tipo, descricao, data_ocorrencia, turma_id')
    .eq('person_id', pessoaId)
    .order('data_ocorrencia', { ascending: false })
    .limit(50)

  if (schoolId) ocoQuery = ocoQuery.eq('school_id', schoolId)

  const { data } = await ocoQuery

  if (!data) return []

  const turmaIds = [...new Set(data.filter(d => d.turma_id).map(d => d.turma_id!))]

  const { data: turmas } = turmaIds.length
    ? await supabase.from('turmas').select('id, nome').in('id', turmaIds)
    : { data: [] }

  const mapaTurmas = new Map((turmas || []).map(t => [t.id, t.nome]))

  return data.map(d => ({
    id: d.id,
    tipo: d.tipo,
    descricao: d.descricao,
    data_ocorrencia: d.data_ocorrencia,
    turma_nome: d.turma_id ? mapaTurmas.get(d.turma_id) || null : null,
  }))
}

export async function getCriterioFrequenciaTurma(
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<string | null> {
  await validarPermRead(pessoaLogadaId)

  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .single()

  if (!turma) return null

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)
    .maybeSingle()

  if (!matriz?.metodo_avaliacao_id) return null

  const { data: metodo } = await supabase
    .from('academico_metodos_avaliacao')
    .select('criterio_frequencia')
    .eq('id', matriz.metodo_avaliacao_id)
    .single()

  return metodo?.criterio_frequencia || null
}

export async function listarAnosLetivos(schoolId: string | null): Promise<{ id: string; ano: number }[]> {
  let query = supabase
    .from('academico_anos_letivos')
    .select('id, ano')
    .order('ano', { ascending: false })

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data } = await query

  return (data || []) as { id: string; ano: number }[]
}

export async function listarEtapasEnsino(): Promise<{ id: string; nome: string }[]> {
  const { data } = await supabase
    .from('academico_etapas_ensino')
    .select('id, nome')
    .order('nome')

  return (data || []) as { id: string; nome: string }[]
}
