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
  numero: string | null
  bairro: string | null
  complemento: string | null
  municipio_residencia: string | null
  telefone_celular: string | null
  telefone_fixo: string | null
  whatsapp: string | null
  telefone_secundario: string | null
  email: string | null
  filiacao_declarada: string | null
  filiacao_1: string | null
  filiacao_2: string | null
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
  turma_id: string
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

export type NotasDetalhadas = {
  disciplinas: Array<{
    disciplina_id: string
    disciplina_nome: string
    periodos: Array<{
      periodo: number
      nota: number | null
      nota_original: number | null
      faltas: number
      tem_recuperacao: boolean
      nota_recuperacao: number | null
    }>
    media_final: number | null
    total_faltas: number
    frequencia_percentual: number | null
  }>
  total_dias_letivos: number | null
}

export type IndicadoresAvaliados = {
  disciplinas: Array<{
    disciplina_id: string
    disciplina_nome: string
    indicadores: Array<{
      indicador_id: string
      descricao: string
      periodos: Array<{
        periodo: number
        nivel_id: string | null
        nivel_descricao: string | null
        nivel_sigla: string | null
        observacao: string | null
      }>
    }>
  }>
}

export type HistoricoManualRecord = {
  id: string
  person_id: string
  year_name: string
  carga_horaria: number | null
  dias_letivos: number | null
  estado: string | null
  municipio: string | null
  unidade_escolar: string | null
  etapa_nome: string | null
  situacao: string | null
  observacoes: string | null
  disciplinas: Array<{
    id: string
    disciplina_id: string | null
    disciplina_nome: string
    media_final: number
    carga_horaria_anual: number | null
    parte_diversificada: boolean
  }>
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

  if (!rpcError && rpcData && rpcData.length > 0) return rpcData as PessoaResumida[]

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
    .select('id, nome_completo, data_nascimento, sexo, cpf, logradouro, numero, bairro, complemento, municipio_residencia, telefone_celular, telefone_fixo, whatsapp, telefone_secundario, email, filiacao_declarada, filiacao_1, filiacao_2')
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

  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  const criterioMap = await resolverCriterioFrequencia(
    turma ? [{ id: turmaId, ...turma }] : []
  )
  const freqTable = criterioMap.get(turmaId) === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'

  const { count: presencas, error: errP } = await supabase
    .from(freqTable)
    .select('*', { count: 'exact', head: true })
    .eq('turma_id', turmaId)
    .eq('aluno_id', pessoaId)
    .in('status', ['P', 'FJ'])

  if (errP) return null

  const { count: total, error: errT } = await supabase
    .from(freqTable)
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

type TurmaCombo = {
  id: string
  school_id: string
  ano_letivo_id: string
  etapa_ensino_id: string | null
}

async function resolverCriterioFrequencia(turmas: TurmaCombo[]): Promise<Map<string, string>> {
  const mapa = new Map<string, string>()
  if (!turmas.length) return mapa

  const combosUnicos = new Map<string, TurmaCombo>()
  for (const t of turmas) {
    if (!t.school_id || !t.ano_letivo_id || !t.etapa_ensino_id) continue
    const key = `${t.school_id}|${t.ano_letivo_id}|${t.etapa_ensino_id}`
    combosUnicos.set(key, t)
  }

  const metodoPorCombo = new Map<string, string>()
  if (combosUnicos.size) {
    const orFilters = [...combosUnicos.values()].map(
      c =>
        `and(school_id.eq.${c.school_id},ano_letivo_id.eq.${c.ano_letivo_id},etapa_ensino_id.eq.${c.etapa_ensino_id})`
    )
    const { data: matrizes } = await supabase
      .from('academico_matrizes_curriculares')
      .select('school_id, ano_letivo_id, etapa_ensino_id, metodo_avaliacao_id')
      .or(orFilters.join(','))

    const metodoIds = [...new Set((matrizes || []).map(m => m.metodo_avaliacao_id).filter(Boolean))]
    const criterioPorMetodo = new Map<string, string>()
    if (metodoIds.length) {
      const { data: metodos } = await supabase
        .from('academico_metodos_avaliacao')
        .select('id, criterio_frequencia')
        .in('id', metodoIds)
      for (const mt of metodos || []) {
        criterioPorMetodo.set(mt.id, mt.criterio_frequencia || 'por_dia')
      }
    }

    for (const m of matrizes || []) {
      const key = `${m.school_id}|${m.ano_letivo_id}|${m.etapa_ensino_id}`
      if (m.metodo_avaliacao_id) {
        metodoPorCombo.set(key, criterioPorMetodo.get(m.metodo_avaliacao_id) || 'por_dia')
      }
    }
  }

  for (const t of turmas) {
    const key = `${t.school_id}|${t.ano_letivo_id}|${t.etapa_ensino_id}`
    mapa.set(t.id, metodoPorCombo.get(key) || 'por_dia')
  }

  return mapa
}

export async function getHistoricoSistema(
  pessoaId: string,
  pessoaLogadaId?: string | null
): Promise<HistoricoAno[]> {
  await validarPermRead(pessoaLogadaId)

  const { data, error } = await supabase
    .from('academico_matriculas')
    .select('id, ano_letivo_id, turma_id, situacao')
    .eq('aluno_id', pessoaId)
    .order('created_at', { ascending: false })

  if (!data?.length) return []

  const anoIds = [...new Set(data.map(m => m.ano_letivo_id))]
  const turmaIds = [...new Set(data.map(m => m.turma_id))]

  const { data: anos } = await supabase
    .from('academico_anos_letivos')
    .select('id, descricao')
    .in('id', anoIds)

  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, nome, school_id, ano_letivo_id, etapa_ensino_id')
    .in('id', turmaIds)

  const etapaIds = [...new Set((turmas || []).map(t => t.etapa_ensino_id).filter(Boolean))]
  const { data: etapas } = etapaIds.length
    ? await supabase.from('academico_etapas_ensino').select('id, etapa_nome').in('id', etapaIds)
    : { data: [] }

  const anoMap = new Map<string, number>()
  for (const a of anos || []) {
    const num = parseInt((a as any).descricao?.toString().replace(/\D/g, ''))
    if (!isNaN(num)) anoMap.set(a.id, num)
  }
  const turmaMap = new Map((turmas || []).map(t => [t.id, t]))
  const etapaMap = new Map((etapas || []).map((e: any) => [e.id, e.etapa_nome]))

  const criterioMap = await resolverCriterioFrequencia((turmas || []) as TurmaCombo[])

  const historico: HistoricoAno[] = []

  for (const m of data) {
    const rawAno = anoMap.get(m.ano_letivo_id)
    const ano = rawAno ?? 0
    const turma = turmaMap.get(m.turma_id)
    const freqTable = criterioMap.get(m.turma_id) === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'

    const { count: presencas } = await supabase
      .from(freqTable)
      .select('*', { count: 'exact', head: true })
      .eq('aluno_id', pessoaId)
      .eq('turma_id', m.turma_id)
      .in('status', ['P', 'FJ'])

    const { count: total } = await supabase
      .from(freqTable)
      .select('*', { count: 'exact', head: true })
      .eq('aluno_id', pessoaId)
      .eq('turma_id', m.turma_id)
      .neq('status', null)

    historico.push({
      ano_letivo_id: m.ano_letivo_id,
      ano,
      turma_id: m.turma_id,
      turma_nome: turma?.nome || '',
      etapa_nome: turma ? etapaMap.get(turma.etapa_ensino_id) || '' : '',
      situacao: m.situacao,
      frequencia_percentual: total ? Math.round((presencas! / total) * 100) : null,
    })
  }

  return historico
}

export async function getNotasDetalhadas(
  pessoaId: string,
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<NotasDetalhadas> {
  await validarPermRead(pessoaLogadaId)

  const { data: notas } = await supabase
    .from('academico_notas')
    .select('disciplina_id, periodo, valor, descricao')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .order('periodo')

  const { data: recuperacoes } = await supabase
    .from('academico_recuperacoes')
    .select('disciplina_id, periodo, tipo, valor')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)

  const { data: matricula } = await supabase
    .from('academico_matriculas')
    .select('data_matricula, data_saida')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .maybeSingle()

  const dataInicio = matricula?.data_matricula || null
  const dataFim = matricula?.data_saida || null

  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  let tipoMediaPeriodo = 'ponderada'
  let mediaMaximaPeriodo = 10
  let criterioFrequencia = 'por_dia'
  let pesoMap = new Map<string, number>()

  if (turma) {
    const { data: matriz } = await supabase
      .from('academico_matrizes_curriculares')
      .select('metodo_avaliacao_id')
      .eq('school_id', turma.school_id)
      .eq('ano_letivo_id', turma.ano_letivo_id)
      .eq('etapa_ensino_id', turma.etapa_ensino_id)
      .maybeSingle()

    if (matriz?.metodo_avaliacao_id) {
      const { data: metodo } = await supabase
        .from('academico_metodos_avaliacao')
        .select('criterio_frequencia')
        .eq('id', matriz.metodo_avaliacao_id)
        .maybeSingle()

      if (metodo) criterioFrequencia = metodo.criterio_frequencia || 'por_dia'

      const { data: numerico } = await supabase
        .from('academico_metodos_avaliacao_numerico')
        .select('tipo_media_periodo, media_maxima_periodo, limitar_avaliacoes, avaliacoes_list')
        .eq('metodo_id', matriz.metodo_avaliacao_id)
        .maybeSingle()

      if (numerico) {
        tipoMediaPeriodo = (numerico as any).tipo_media_periodo || 'ponderada'
        mediaMaximaPeriodo = Number((numerico as any).media_maxima_periodo || 10)
        const avList = (numerico as any).avaliacoes_list || []
        if (Array.isArray(avList)) {
          for (const av of avList) {
            if (av?.nome) pesoMap.set(av.nome, Number(av.peso) || 1)
          }
        }
      }
    }
  }

  const discMap = new Map<string, Map<number, Array<{ valor: number | null; descricao: string | null }>>>()

  for (const n of notas || []) {
    if (!discMap.has(n.disciplina_id)) discMap.set(n.disciplina_id, new Map())
    const perMap = discMap.get(n.disciplina_id)!
    if (!perMap.has(n.periodo)) perMap.set(n.periodo, [])
    perMap.get(n.periodo)!.push({ valor: n.valor, descricao: n.descricao })
  }

  const recMap = new Map<string, Map<number, { valor: number | null; tipo: string }>>()
  for (const r of recuperacoes || []) {
    if (!recMap.has(r.disciplina_id)) recMap.set(r.disciplina_id, new Map())
    recMap.get(r.disciplina_id)!.set(r.periodo, { valor: r.valor, tipo: r.tipo })
  }

  const discIds = [...discMap.keys()]
  const { data: nomes } = discIds.length
    ? await supabase.from('academico_matriz_disciplinas').select('id, disciplina:disciplina_id(nome)').in('id', discIds)
    : { data: [] }

  const mapaNomes = new Map<string, string>()
  for (const n of nomes || []) {
    const disciplina = n.disciplina as unknown as { nome: string } | null
    mapaNomes.set(n.id, disciplina?.nome || n.id)
  }

  const freqTable = criterioFrequencia === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'
  const dateCol = criterioFrequencia === 'por_aula' ? 'data_aula' : 'dia_letivo'

  let faltasQuery = supabase
    .from(freqTable)
    .select('disciplina_id')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .in('status', ['F', 'FJ'])

  if (dataInicio) faltasQuery = faltasQuery.gte(dateCol, dataInicio)
  if (dataFim) faltasQuery = faltasQuery.lte(dateCol, dataFim)

  const { data: faltas } = await faltasQuery

  const faltaMap = new Map<string, number>()
  for (const f of faltas || []) {
    const did = (f as any).disciplina_id
    if (did) faltaMap.set(did, (faltaMap.get(did) || 0) + 1)
  }

  const totalFaltasGeral = faltas?.length || 0
  const faltasPorDisciplina = criterioFrequencia === 'por_aula'

  let freqPresencasQuery = supabase
    .from(freqTable)
    .select('*', { count: 'exact', head: true })
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)

  if (dataInicio) freqPresencasQuery = freqPresencasQuery.gte(dateCol, dataInicio)
  if (dataFim) freqPresencasQuery = freqPresencasQuery.lte(dateCol, dataFim)

  const { count: totalPresencas } = await freqPresencasQuery.in('status', ['P', 'FJ'])

  let freqTotalQuery = supabase
    .from(freqTable)
    .select('*', { count: 'exact', head: true })
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)

  if (dataInicio) freqTotalQuery = freqTotalQuery.gte(dateCol, dataInicio)
  if (dataFim) freqTotalQuery = freqTotalQuery.lte(dateCol, dataFim)

  const { count: totalDias } = await freqTotalQuery.neq('status', null)

  const freqPercGeral = totalDias ? Math.round((totalPresencas! / totalDias) * 100) : null

  const freqPorDiscMap = new Map<string, { presencas: number; total: number }>()

  if (criterioFrequencia === 'por_aula') {
    let freqDiscQuery = supabase
      .from('academico_frequencias_aula')
      .select('disciplina_id, status')
      .eq('aluno_id', pessoaId)
      .eq('turma_id', turmaId)

    if (dataInicio) freqDiscQuery = freqDiscQuery.gte('data_aula', dataInicio)
    if (dataFim) freqDiscQuery = freqDiscQuery.lte('data_aula', dataFim)

    const { data: freqDiscData } = await freqDiscQuery

    for (const f of freqDiscData || []) {
      const did = (f as any).disciplina_id
      if (!did) continue
      if (!freqPorDiscMap.has(did)) freqPorDiscMap.set(did, { presencas: 0, total: 0 })
      const entry = freqPorDiscMap.get(did)!
      entry.total++
      if ((f as any).status === 'P' || (f as any).status === 'FJ') entry.presencas++
    }
  }

  const disciplinas = discIds.map(id => {
    const perMap = discMap.get(id)!
    const recDiscMap = recMap.get(id)
    const totalFaltas = faltasPorDisciplina ? (faltaMap.get(id) || 0) : totalFaltasGeral

    const periodos = [...perMap.entries()]
      .sort(([a], [b]) => a - b)
      .map(([periodo, notasArray]) => {
        const notasValidas = notasArray.filter(n => n.valor !== null) as Array<{ valor: number; descricao: string | null }>
        let notaOriginal: number | null = null

        if (notasValidas.length === 0) {
          // null
        } else if (tipoMediaPeriodo === 'somatoria') {
          notaOriginal = Math.min(
            notasValidas.reduce((a, n) => a + n.valor, 0),
            mediaMaximaPeriodo
          )
        } else {
          let somaPonderada = 0
          let somaPesos = 0
          for (const n of notasValidas) {
            const peso = pesoMap.get(n.descricao || '') ?? 1
            somaPonderada += n.valor * peso
            somaPesos += peso
          }
          notaOriginal = somaPesos > 0
            ? Math.round(Math.min(somaPonderada / somaPesos, mediaMaximaPeriodo) * 100) / 100
            : null
        }

        const rec = recDiscMap?.get(periodo)
        const temRecuperacao = rec?.valor != null && (rec.tipo === 'periodo' || rec.tipo === 'avaliacao')
        const notaRecuperacao = temRecuperacao ? rec!.valor : null
        const nota = temRecuperacao && notaRecuperacao != null
          ? Math.max(notaOriginal ?? 0, notaRecuperacao)
          : notaOriginal

        const faltasDisc = faltaMap.get(id) || 0

        return {
          periodo,
          nota,
          nota_original: notaOriginal,
          faltas: 0,
          tem_recuperacao: temRecuperacao,
          nota_recuperacao: notaRecuperacao,
        }
      })

    const notasValidasPeriodo = periodos.map(p => p.nota).filter(n => n !== null) as number[]
    const mediaFinal = notasValidasPeriodo.length
      ? Math.round((notasValidasPeriodo.reduce((a, b) => a + b, 0) / notasValidasPeriodo.length) * 100) / 100
      : null

    const freqDisc = freqPorDiscMap.get(id)
    const freqPerc = freqDisc
      ? (freqDisc.total ? Math.round((freqDisc.presencas / freqDisc.total) * 100) : null)
      : freqPercGeral

    return {
      disciplina_id: id,
      disciplina_nome: mapaNomes.get(id) || id,
      periodos,
      media_final: mediaFinal,
      total_faltas: totalFaltas,
      frequencia_percentual: freqPerc,
    }
  })

  return { disciplinas, total_dias_letivos: totalDias }
}

export async function getIndicadoresAvaliados(
  pessoaId: string,
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<IndicadoresAvaliados> {
  await validarPermRead(pessoaLogadaId)

  const { data } = await supabase
    .from('academico_avaliacoes_indicadores')
    .select(`
      indicador_id,
      periodo,
      nivel_id,
      observacao,
      indicadores_avaliacao!indicador_id(
        descricao,
        disciplina_id,
        campo_experiencia
      )
    `)
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .order('periodo')

  if (!data?.length) return { disciplinas: [] }

  const discMap = new Map<string, {
    disciplina_id: string | null
    campo_experiencia: string | null
    indicadores: Map<string, {
      indicador_id: string
      descricao: string
      periodos: Map<number, { nivel_id: string | null; nivel_descricao: string | null; nivel_sigla: string | null; observacao: string | null }>
    }>
  }>()

  const nivelIds = new Set<string>()
  for (const a of data) {
    const ind = a.indicadores_avaliacao as unknown as { descricao: string; disciplina_id: string; campo_experiencia: string } | null
    if (!ind?.descricao) continue
    if (a.nivel_id) nivelIds.add(a.nivel_id)

    const key = ind.disciplina_id || ind.campo_experiencia || '__sem_vinculo__'

    if (!discMap.has(key)) {
      discMap.set(key, {
        disciplina_id: ind.disciplina_id || null,
        campo_experiencia: ind.campo_experiencia || null,
        indicadores: new Map(),
      })
    }
    const disc = discMap.get(key)!
    if (!disc.indicadores.has(a.indicador_id)) {
      disc.indicadores.set(a.indicador_id, {
        indicador_id: a.indicador_id,
        descricao: ind.descricao,
        periodos: new Map(),
      })
    }
    disc.indicadores.get(a.indicador_id)!.periodos.set(a.periodo, {
      nivel_id: a.nivel_id,
      nivel_descricao: null,
      nivel_sigla: null,
      observacao: a.observacao,
    })
  }

  const { data: niveis } = nivelIds.size
    ? await supabase.from('indicadores_niveis').select('id, descricao, sigla').in('id', [...nivelIds])
    : { data: [] }

  const nivelMap = new Map<string, { descricao: string; sigla: string }>()
  for (const n of niveis || []) {
    nivelMap.set(n.id, { descricao: n.descricao, sigla: n.sigla })
  }

  const discIds = [...discMap.values()].map(d => d.disciplina_id).filter(Boolean) as string[]
  const { data: discNomes } = discIds.length
    ? await supabase.from('academico_disciplinas').select('id, nome').in('id', discIds)
    : { data: [] }

  const discNomeMap = new Map<string, string>()
  for (const d of discNomes || []) {
    discNomeMap.set(d.id, d.nome)
  }

  const disciplinas = [...discMap.values()].map(disc => {
    const indicadores = [...disc.indicadores.values()].map(ind => {

      const periodos = [...ind.periodos.entries()]
        .sort(([a], [b]) => a - b)
        .map(([periodo, p]) => {
          const nivelInfo = p.nivel_id ? nivelMap.get(p.nivel_id) : null
          return {
            periodo,
            nivel_id: p.nivel_id,
            nivel_descricao: nivelInfo?.descricao || null,
            nivel_sigla: nivelInfo?.sigla || null,
            observacao: p.observacao,
          }
        })
      return { indicador_id: ind.indicador_id, descricao: ind.descricao, periodos }
    })

    const nome =
      (disc.disciplina_id && discNomeMap.get(disc.disciplina_id)) ||
      disc.campo_experiencia ||
      'Sem vínculo'

    return {
      disciplina_id: disc.disciplina_id || disc.campo_experiencia || nome,
      disciplina_nome: nome,
      indicadores,
    }
  })

  return { disciplinas }
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

export async function getSituacaoMatricula(
  pessoaId: string,
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<string | null> {
  await validarPermRead(pessoaLogadaId)

  const { data } = await supabase
    .from('academico_matriculas')
    .select('situacao')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .maybeSingle()

  return data?.situacao || null
}

export async function getDisciplinasDaTurma(
  turmaId: string,
  pessoaLogadaId?: string | null
): Promise<number> {
  await validarPermRead(pessoaLogadaId)

  const { count } = await supabase
    .from('turmas_disciplinas')
    .select('id', { count: 'exact', head: true })
    .eq('turma_id', turmaId)

  return count || 0
}

export type ResumoAluno = {
  frequencia_percentual: number | null
  frequencia_presencas: number | null
  frequencia_total: number | null
  desempenho_percentual: number | null
  desempenho_turma: number | null
  total_disciplinas: number
  total_ocorrencias: number
}

export async function getResumoAluno(
  pessoaId: string,
  turmaId: string,
  schoolId: string | null,
  pessoaLogadaId?: string | null
): Promise<ResumoAluno | null> {
  await validarPermRead(pessoaLogadaId)

  const criterio = await getCriterioFrequenciaTurma(turmaId, pessoaLogadaId)
  const freqTable = criterio === 'por_aula' ? 'academico_frequencias_aula' : 'academico_frequencias_dia'
  const dateCol = criterio === 'por_aula' ? 'data_aula' : 'dia_letivo'

  const { data: matricula } = await supabase
    .from('academico_matriculas')
    .select('data_matricula, data_saida')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .maybeSingle()

  const dataInicio = matricula?.data_matricula || null
  const dataFim = matricula?.data_saida || null

  let presencasQuery = supabase
    .from(freqTable)
    .select('*', { count: 'exact', head: true })
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)

  if (dataInicio) presencasQuery = presencasQuery.gte(dateCol, dataInicio)
  if (dataFim) presencasQuery = presencasQuery.lte(dateCol, dataFim)

  const { count: presencas } = await presencasQuery.in('status', ['P', 'FJ'])

  let totalQuery = supabase
    .from(freqTable)
    .select('*', { count: 'exact', head: true })
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)

  if (dataInicio) totalQuery = totalQuery.gte(dateCol, dataInicio)
  if (dataFim) totalQuery = totalQuery.lte(dateCol, dataFim)

  const { count: totalFreq } = await totalQuery.neq('status', null)

  const freqPerc = totalFreq ? Math.round((presencas! / totalFreq) * 100) : null

  const { count: totalDisciplinas } = await supabase
    .from('turmas_disciplinas')
    .select('id', { count: 'exact', head: true })
    .eq('turma_id', turmaId)

  let ocoQuery = supabase
    .from('ocorrencias')
    .select('id', { count: 'exact', head: true })
    .eq('person_id', pessoaId)

  if (schoolId) ocoQuery = ocoQuery.eq('school_id', schoolId)

  const { count: totalOcorrencias } = await ocoQuery.eq('turma_id', turmaId)

  const { data: notasAluno } = await supabase
    .from('academico_notas')
    .select('valor')
    .eq('aluno_id', pessoaId)
    .eq('turma_id', turmaId)
    .not('valor', 'is', null)

  const { data: notasTurma } = await supabase
    .from('academico_notas')
    .select('valor')
    .eq('turma_id', turmaId)
    .not('valor', 'is', null)

  let desempenhoPerc: number | null = null
  if (notasAluno && notasAluno.length > 0) {
    const soma = notasAluno.reduce((acc, n) => acc + Number(n.valor), 0)
    desempenhoPerc = Math.round((soma / notasAluno.length) * 10) / 10
  }

  let desempenhoTurma: number | null = null
  if (notasTurma && notasTurma.length > 0) {
    const soma = notasTurma.reduce((acc, n) => acc + Number(n.valor), 0)
    desempenhoTurma = Math.round((soma / notasTurma.length) * 10) / 10
  }

  return {
    frequencia_percentual: freqPerc,
    frequencia_presencas: presencas ?? null,
    frequencia_total: totalFreq ?? null,
    desempenho_percentual: desempenhoPerc,
    desempenho_turma: desempenhoTurma,
    total_disciplinas: totalDisciplinas || 0,
    total_ocorrencias: totalOcorrencias || 0,
  }
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
    .select('id, etapa_nome')
    .order('etapa_nome')

  return (data || []).map((e: any) => ({ id: e.id, nome: e.etapa_nome }))
}
