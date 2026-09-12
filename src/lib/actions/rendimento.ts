'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import {
  getNumericoConfigCompleta,
  type ConfigNumericaCompleta,
} from './avaliacoes-numericas'
import {
  RENDIMENTO_RESOURCE,
  FAIXAS_RENDIMENTO,
  MARGEM_TENDENCIA,
  ROTULOS_MOTIVO,
  computarMediasPeriodo,
  computarMediaAnual,
  mediaLista,
  dentroJanela,
  classificarLinha,
  type CategoriaSituacao,
  type TendenciaAluno,
  type MotivoSituacao,
} from './rendimento-calculo'
import { labelSituacaoMatricula, isSituacaoFinal } from '@/lib/situacoes-matricula'

const supabase = getSupabaseAdmin()

// ─── Tipos públicos ───

export type PeriodoOpcao = {
  ordem: number
  nome: string
  data_inicio: string | null
  data_termino: string | null
}

export type FiltrosRendimentoInput = {
  schoolId: string
  anoLetivoId: string
  periodoOrdem: number | null // null = ano letivo completo
}

export type KpisRendimento = {
  mediaGeral: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  pctFreqAbaixo: number | null
  freqMedia: number | null
  pctRisco: number | null
  totalAlunos: number
  totalAvaliados: number
}

export type PeriodoPanorama = {
  ordem: number
  nome: string
  media: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  pctFreqAbaixo: number | null
  avaliados: number
}

export type EtapaPanorama = {
  etapaId: string | null
  nome: string
  avaliados: number
  media: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  acima: number
  abaixo: number
  freqMedia: number | null
  evolucao: number | null
  porDisciplina: EtapaDisciplina[]
}

export type EtapaDisciplina = {
  disciplinaId: string
  nome: string
  avaliados: number
  media: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  acima: number
  abaixo: number
  freqMedia: number | null
  evolucao: number | null
}

export type TurmaPanorama = {
  turmaId: string
  nome: string
  etapaNome: string
  alunos: number
  media: number | null
  pctAcima: number | null
  frequencia: number | null
  porDisciplina: TurmaDisciplina[]
}

export type TurmaDisciplina = {
  disciplinaId: string
  nome: string
  avaliados: number
  media: number | null
  pctAcima: number | null
  frequencia: number | null
}

export type DisciplinaPanorama = {
  disciplinaId: string
  nome: string
  media: number | null
  pctAcima: number | null
  pctAbaixo: number | null
  pctFreqAbaixo: number | null
  avaliados: number
  evolucao: (number | null)[]
  distribuicao: { faixa: string; quantidade: number; percentual: number | null }[]
}

export type ClassificacaoAluno = {
  alunoId: string
  nome: string
  turmaId: string
  turmaNome: string
  media: number | null
  mediaAnterior: number | null
  frequencia: number | null
  categoria: CategoriaSituacao
  motivos: MotivoSituacao[]
  tendencia: TendenciaAluno
}

export type ResumoSituacao = {
  adequado: { quantidade: number; percentual: number | null }
  atencao: { quantidade: number; percentual: number | null }
  risco: { quantidade: number; percentual: number | null }
  total: number
}

export type ListaSituacao = {
  resumo: ResumoSituacao
  linhas: ClassificacaoAluno[]
}

export type DisciplinaDetalhe = { id: string; nome: string; media: number | null }

export type DetalheAluno = {
  mediaAtual: number | null
  mediaAnterior: number | null
  frequencia: number | null
  tendencia: TendenciaAluno
  porDisciplina: DisciplinaDetalhe[]
  pontosAtencao: string[]
}

export type DetalheTurma = {
  porDisciplina: { id: string; nome: string; media: number | null; avaliados: number }[]
  distribuicao: { faixa: string; quantidade: number; percentual: number | null }[]
  frequencia: number | null
  abaixoMedia: { alunoId: string; nome: string; media: number }[]
  evolucao: { ordem: number; nome: string; media: number | null }[]
}

export type SituacaoFinalPanorama = {
  vazio: boolean
  blocos: { situacaoDb: string; rotulo: string; quantidade: number; percentual: number | null }[]
  porTurma: { turmaId: string; turmaNome: string; valores: Record<string, number> }[]
  situacoes: string[]
  turmasNaoFechadas: { turmaId: string; turmaNome: string }[]
  total: number
}

// ─── Permissão ───

async function validarRendimento(pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RENDIMENTO_RESOURCE, 'visualizar')
  }
}

// ─── Contexto por turma (método, config, disciplinas, períodos) ───

type TurmaCtx = {
  id: string
  nome: string
  fechada: boolean
  etapaId: string | null
  etapaNome: string
  etapaCodigo: string | null
  metodoId: string
  metodoNome: string | null
  qtd: number
  criterio: 'por_dia' | 'por_aula'
  mediaMinima: number
  freqMin: number
  faixaPp: number
  mediaMaxima: number
  config: ConfigNumericaCompleta
  disciplinas: { id: string; disciplinaId: string; nome: string }[]
  periodos: PeriodoOpcao[]
}

function chunk<T>(arr: T[], size = 100): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

type EventoAvaliativo = {
  descricao: string | null
  data_inicio: string | null
  data_termino: string | null
  etapas: string[] | null
}

function montarPeriodos(
  eventos: EventoAvaliativo[],
  etapaCodigo: string | null,
  etapaId: string | null,
  qtd: number,
  filtrarEtapa: boolean
): PeriodoOpcao[] {
  const aplicaveis = eventos
    .filter(ev => {
      if (!filtrarEtapa) return true
      const etapasEv = Array.isArray(ev.etapas) ? ev.etapas : []
      if (!etapasEv.length) return true
      if (etapaCodigo && etapasEv.includes(etapaCodigo)) return true
      if (etapaId && etapasEv.includes(etapaId)) return true
      return false
    })
    .sort((a, b) => String(a.data_inicio || '').localeCompare(String(b.data_inicio || '')))
    .slice(0, qtd)

  if (aplicaveis.length > 0) {
    return aplicaveis.map((ev, i) => ({
      ordem: i + 1,
      nome: ev.descricao || `Período ${i + 1}`,
      data_inicio: ev.data_inicio ? String(ev.data_inicio) : null,
      data_termino: ev.data_termino ? String(ev.data_termino) : null,
    }))
  }
  return Array.from({ length: qtd }, (_, i) => ({
    ordem: i + 1,
    nome: `Período ${i + 1}`,
    data_inicio: null,
    data_termino: null,
  }))
}

async function carregarTurmasCtx(schoolId: string, anoLetivoId: string): Promise<TurmaCtx[]> {
  const { data: turmas } = await supabase
    .from('turmas')
    .select('id, nome, etapa_ensino_id, etapas_ensino_ids, fechada')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('nome')

  if (!turmas || turmas.length === 0) return []

  const etapaIds = Array.from(new Set(turmas.map(t => t.etapa_ensino_id).filter(Boolean) as string[]))
  let etapaMap = new Map<string, { nome: string; codigo: string | null }>()
  if (etapaIds.length > 0) {
    const { data: etapas } = await supabase
      .from('academico_etapas_ensino')
      .select('id, etapa_nome, etapa_codigo')
      .in('id', etapaIds)
    for (const e of etapas || []) {
      etapaMap.set(e.id, {
        nome: (e.etapa_nome as string) || 'Etapa',
        codigo: e.etapa_codigo != null ? String(e.etapa_codigo) : null,
      })
    }
  }

  const { data: matrizes } = await supabase
    .from('academico_matrizes_curriculares')
    .select('etapa_ensino_id, metodo_avaliacao_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)

  const metodoPorEtapa = new Map<string, string>()
  for (const m of matrizes || []) {
    if (m.etapa_ensino_id && m.metodo_avaliacao_id && !metodoPorEtapa.has(m.etapa_ensino_id)) {
      metodoPorEtapa.set(m.etapa_ensino_id, m.metodo_avaliacao_id as string)
    }
  }

  const metodoIds = Array.from(new Set([...metodoPorEtapa.values()]))
  type MetodoRow = {
    id: string
    nome: string | null
    criterio_frequencia: string | null
    frecuencia_minima: number | string | null
    quantidade_periodos_numerico: number | string | null
    tipos_avaliacao: Record<string, unknown> | null
    faixa_atencao_pp: number | string | null
  }
  let metodoMap = new Map<string, MetodoRow>()
  if (metodoIds.length > 0) {
    const { data: metodos } = await supabase
      .from('academico_metodos_avaliacao')
      .select('id, nome, criterio_frequencia, frecuencia_minima, quantidade_periodos_numerico, tipos_avaliacao, faixa_atencao_pp')
      .in('id', metodoIds)
    for (const m of (metodos || []) as MetodoRow[]) metodoMap.set(m.id, m)
  }

  const temNumerico = (tipos: Record<string, unknown> | null): boolean => {
    const flag = tipos?.numerico
    return flag === true || flag === 'true'
  }

  // Config do engine por método (cache)
  const configMap = new Map<string, ConfigNumericaCompleta>()
  const qtdMap = new Map<string, number>()
  for (const [etapaId, metodoId] of metodoPorEtapa) {
    const row = metodoMap.get(metodoId)
    if (!row || !temNumerico(row.tipos_avaliacao)) continue
    const qtd = Number(row.quantidade_periodos_numerico) || 4
    qtdMap.set(metodoId, qtd)
    if (!configMap.has(metodoId)) {
      configMap.set(metodoId, await getNumericoConfigCompleta(metodoId, qtd))
    }
  }

  // Disciplinas por turma (query pattern canônica)
  const turmaIds = turmas.map(t => t.id)
  const discPorTurma = new Map<string, { id: string; disciplinaId: string; nome: string }[]>()
  for (const grupo of chunk(turmaIds)) {
    const { data: relacoes } = await supabase
      .from('turmas_disciplinas')
      .select('turma_id, matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
      .in('turma_id', grupo)
    for (const r of relacoes || []) {
      const md = r.academico_matriz_disciplinas as unknown as {
        disciplina_id: string
        academico_disciplinas: { nome: string } | null
      } | null
      if (!md) continue
      const lista = discPorTurma.get(r.turma_id as string) || []
      if (!lista.some(d => d.id === r.matriz_disciplina_id)) {
        lista.push({
          id: r.matriz_disciplina_id as string,
          disciplinaId: (md.disciplina_id as string) || (r.matriz_disciplina_id as string),
          nome: md.academico_disciplinas?.nome || 'Disciplina',
        })
      }
      discPorTurma.set(r.turma_id as string, lista)
    }
  }
  for (const lista of discPorTurma.values()) lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  // Eventos avaliativos do ano (uma query; filtro por etapa em memória)
  const { data: calendarios } = await supabase
    .from('academico_calendarios')
    .select('id')
    .eq('ano_letivo_id', anoLetivoId)
  const calendarioIds = (calendarios || []).map(c => c.id)
  let eventos: EventoAvaliativo[] = []
  if (calendarioIds.length > 0) {
    const { data } = await supabase
      .from('academico_calendario_eventos')
      .select('descricao, data_inicio, data_termino, etapas')
      .in('calendario_id', calendarioIds)
      .eq('tipo', 'periodo_avaliativo')
    eventos = ((data || []) as unknown as EventoAvaliativo[]).map(ev => ({
      ...ev,
      etapas: Array.isArray(ev.etapas) ? ev.etapas : null,
    }))
  }

  const ctx: TurmaCtx[] = []
  for (const t of turmas) {
    const etapaId = (t.etapa_ensino_id as string) || null
    const metodoId = etapaId ? metodoPorEtapa.get(etapaId) || null : null
    const row = metodoId ? metodoMap.get(metodoId) : undefined
    if (!metodoId || !row || !temNumerico(row.tipos_avaliacao)) continue // Q1: só numérico
    const etapa = etapaId ? etapaMap.get(etapaId) : undefined
    const qtd = qtdMap.get(metodoId) || 4
    const config = configMap.get(metodoId)
    if (!config) continue
    ctx.push({
      id: t.id as string,
      nome: (t.nome as string) || 'Turma',
      fechada: (t.fechada as boolean) === true,
      etapaId,
      etapaNome: etapa?.nome || 'Etapa',
      etapaCodigo: etapa?.codigo || null,
      metodoId,
      metodoNome: (row.nome as string) || null,
      qtd,
      criterio: row.criterio_frequencia === 'por_aula' ? 'por_aula' : 'por_dia',
      mediaMinima: 7, // preenchida abaixo via academico_metodos_avaliacao_aprovacao
      freqMin: row.frecuencia_minima != null ? Number(row.frecuencia_minima) : 75,
      faixaPp: row.faixa_atencao_pp != null ? Number(row.faixa_atencao_pp) : 5,
      mediaMaxima: config.media_maxima_periodo,
      config,
      disciplinas: discPorTurma.get(t.id as string) || [],
      periodos: montarPeriodos(eventos, etapa?.codigo || null, etapaId, qtd, true),
    })
  }

  // media_minima vem de academico_metodos_avaliacao_aprovacao (mesma fonte do engine)
  const usados = Array.from(new Set(ctx.map(c => c.metodoId)))
  if (usados.length > 0) {
    const { data: aprov } = await supabase
      .from('academico_metodos_avaliacao_aprovacao')
      .select('metodo_id, media_minima')
      .in('metodo_id', usados)
    const minMap = new Map<string, number>()
    for (const a of aprov || []) {
      minMap.set(a.metodo_id as string, a.media_minima != null ? Number(a.media_minima) : 7)
    }
    for (const c of ctx) c.mediaMinima = minMap.get(c.metodoId) ?? 7
  }

  return ctx
}

// ─── Bulk loads (notas, recuperações, conselho, frequências, matrículas) ───

type NotaBulk = { turma_id: string; aluno_id: string; disciplina_id: string; periodo: number; valor: number | string | null; descricao: string | null }
type RecBulk = { turma_id: string; aluno_id: string; disciplina_id: string; periodo: number | null; tipo: string; valor: number | string | null; descricao: string | null }
type ConselhoBulk = { turma_id: string; aluno_id: string; matriz_disciplina_id: string; periodo: number; nota_conselho: number | string | null }
type FreqDiaBulk = { turma_id: string; aluno_id: string; dia_letivo: string; status: string | null }
type FreqAulaBulk = { turma_id: string; aluno_id: string; disciplina_id: string | null; horario_id: string | null; data_aula: string; status: string | null }
type MatriculaBulk = { turma_id: string; aluno_id: string; situacao: string | null; ativo: boolean | null; data_matricula: string | null; data_saida: string | null }

type BulkData = {
  notas: NotaBulk[]
  recs: RecBulk[]
  conselhos: ConselhoBulk[]
  freqDia: FreqDiaBulk[]
  freqAula: FreqAulaBulk[]
  freqDiaPorTurmaAluno: Map<string, Map<string, FreqDiaBulk[]>>
  freqAulaPorTurmaAluno: Map<string, Map<string, FreqAulaBulk[]>>
  matriculas: MatriculaBulk[]
  nomes: Map<string, string>
  horariosAtivos: Map<string, Set<string>> // turmaId -> horarios ativos (só por_aula)
}

async function carregarBulk(turmas: TurmaCtx[]): Promise<BulkData> {
  const ids = turmas.map(t => t.id)
  const bulk: BulkData = {
    notas: [], recs: [], conselhos: [], freqDia: [], freqAula: [],
    freqDiaPorTurmaAluno: new Map(), freqAulaPorTurmaAluno: new Map(),
    matriculas: [], nomes: new Map(), horariosAtivos: new Map(),
  }
  if (ids.length === 0) return bulk

  const porAulaIds = new Set(turmas.filter(t => t.criterio === 'por_aula').map(t => t.id))
  const porDiaIds = new Set(turmas.filter(t => t.criterio === 'por_dia').map(t => t.id))

  for (const grupo of chunk(ids)) {
    const [notas, recs, conselhos, matriculas] = await Promise.all([
      supabase.from('academico_notas').select('turma_id, aluno_id, disciplina_id, periodo, valor, descricao').in('turma_id', grupo).then(r => (r.data || []) as NotaBulk[]),
      supabase.from('academico_recuperacoes').select('turma_id, aluno_id, disciplina_id, periodo, tipo, valor, descricao').in('turma_id', grupo).then(r => (r.data || []) as RecBulk[]),
      supabase.from('conselho_classe_resultados').select('turma_id, aluno_id, matriz_disciplina_id, periodo, nota_conselho').in('turma_id', grupo).then(r => (r.data || []) as ConselhoBulk[]),
      supabase.from('academico_matriculas').select('turma_id, aluno_id, situacao, ativo, data_matricula, data_saida').in('turma_id', grupo).then(r => (r.data || []) as MatriculaBulk[]),
    ])
    bulk.notas.push(...notas)
    bulk.recs.push(...recs)
    bulk.conselhos.push(...conselhos)
    bulk.matriculas.push(...matriculas)

    const diaIds = grupo.filter(id => porDiaIds.has(id))
    if (diaIds.length > 0) {
      const dias = await supabase.from('academico_frequencias_dia').select('turma_id, aluno_id, dia_letivo, status').in('turma_id', diaIds).then(r => (r.data || []) as FreqDiaBulk[])
      bulk.freqDia.push(...dias)
    }
    const aulaIds = grupo.filter(id => porAulaIds.has(id))
    if (aulaIds.length > 0) {
      const aulas = await supabase.from('academico_frequencias_aula').select('turma_id, aluno_id, disciplina_id, horario_id, data_aula, status').in('turma_id', aulaIds).then(r => (r.data || []) as FreqAulaBulk[])
      bulk.freqAula.push(...aulas)
    }
  }

  // Horários ativos por turma por_aula (regra do Boletim)
  for (const grupo of chunk([...porAulaIds])) {
    const { data: quadros } = await supabase
      .from('quadro_aulas')
      .select('id, turma_id')
      .in('turma_id', grupo)
      .eq('ativo', true)
    const quadroIds = (quadros || []).map(q => q.id)
    const quadroPorTurma = new Map<string, string>()
    for (const q of quadros || []) quadroPorTurma.set(q.turma_id as string, q.id as string)
    if (quadroIds.length > 0) {
      const { data: horarios } = await supabase
        .from('quadro_aulas_horarios')
        .select('id, quadro_aula_id')
        .in('quadro_aula_id', quadroIds)
        .eq('ativo', true)
      const porQuadro = new Map<string, Set<string>>()
      for (const h of horarios || []) {
        const set = porQuadro.get(h.quadro_aula_id as string) || new Set<string>()
        set.add(h.id as string)
        porQuadro.set(h.quadro_aula_id as string, set)
      }
      for (const [turmaId, quadroId] of quadroPorTurma) {
        bulk.horariosAtivos.set(turmaId, porQuadro.get(quadroId) || new Set())
      }
    }
  }

  const alunoIds = Array.from(new Set(bulk.matriculas.map(m => m.aluno_id)))
  for (const grupo of chunk(alunoIds)) {
    const { data: pessoas } = await supabase.from('people').select('id, nome_completo').in('id', grupo)
    for (const p of pessoas || []) bulk.nomes.set(p.id as string, (p.nome_completo as string) || '—')
  }

  // Agrupa frequências por turma → aluno (evita O(n²) no cálculo por ordinal)
  for (const f of bulk.freqDia) {
    let porAluno = bulk.freqDiaPorTurmaAluno.get(f.turma_id)
    if (!porAluno) {
      porAluno = new Map()
      bulk.freqDiaPorTurmaAluno.set(f.turma_id, porAluno)
    }
    const lista = porAluno.get(f.aluno_id) || []
    lista.push(f)
    porAluno.set(f.aluno_id, lista)
  }
  for (const f of bulk.freqAula) {
    let porAluno = bulk.freqAulaPorTurmaAluno.get(f.turma_id)
    if (!porAluno) {
      porAluno = new Map()
      bulk.freqAulaPorTurmaAluno.set(f.turma_id, porAluno)
    }
    const lista = porAluno.get(f.aluno_id) || []
    lista.push(f)
    porAluno.set(f.aluno_id, lista)
  }

  return bulk
}

// ─── Cálculo por aluno (mesma regra do engine; puras em rendimento-calculo.ts) ───

export type LinhaAluno = {
  turmaId: string
  alunoId: string
  nome: string
  porDisciplina: { id: string; disciplinaId: string; nome: string; medias: (number | null)[]; anual: number | null }[]
  mediasOrdinal: (number | null)[] // média do aluno por ordinal (média das disciplinas com nota)
  freqOrdinal: (number | null)[] // frequência do aluno por ordinal (janela matrícula ∩ período)
  avaliadoOrdinal: boolean[] // ≥1 nota no ordinal
  mediaAtual: number | null // recorte selecionado (ordinal ou ano)
  mediaAnterior: number | null // ordinal anterior / penúltimo com dados
  avaliado: boolean // recorte selecionado
  frequencia: number | null // recorte selecionado
}

function computarLinhas(
  turmas: TurmaCtx[],
  bulk: BulkData,
  periodoOrdem: number | null
): LinhaAluno[] {
  // Dedupe matrícula por (turma, aluno): prefere Ativo, depois maior data_matricula
  const matPorChave = new Map<string, MatriculaBulk>()
  for (const m of bulk.matriculas) {
    const chave = `${m.turma_id}|${m.aluno_id}`
    const atual = matPorChave.get(chave)
    if (!atual) {
      matPorChave.set(chave, m)
      continue
    }
    const atualAtivo = atual.situacao === 'Ativo'
    const novoAtivo = m.situacao === 'Ativo'
    if (novoAtivo && !atualAtivo) {
      matPorChave.set(chave, m)
    } else if (novoAtivo === atualAtivo && String(m.data_matricula || '') > String(atual.data_matricula || '')) {
      matPorChave.set(chave, m)
    }
  }

  const notasPorTurma = new Map<string, NotaBulk[]>()
  for (const n of bulk.notas) {
    const l = notasPorTurma.get(n.turma_id) || []
    l.push(n)
    notasPorTurma.set(n.turma_id, l)
  }
  const recsPorTurma = new Map<string, RecBulk[]>()
  for (const r of bulk.recs) {
    const l = recsPorTurma.get(r.turma_id) || []
    l.push(r)
    recsPorTurma.set(r.turma_id, l)
  }
  const consPorTurma = new Map<string, ConselhoBulk[]>()
  for (const c of bulk.conselhos) {
    const l = consPorTurma.get(c.turma_id) || []
    l.push(c)
    consPorTurma.set(c.turma_id, l)
  }

  const linhas: LinhaAluno[] = []
  for (const t of turmas) {
    // Turma cujo ordinal não existe no próprio calendário: fora do recorte
    if (periodoOrdem !== null && !t.periodos.some(p => p.ordem === periodoOrdem)) continue

    const notas = notasPorTurma.get(t.id) || []
    const recs = recsPorTurma.get(t.id) || []
    const cons = consPorTurma.get(t.id) || []
    const ativos = bulk.horariosAtivos.get(t.id) || new Set<string>()

    const matriculasTurma = [...matPorChave.values()].filter(m => m.turma_id === t.id)
    for (const m of matriculasTurma) {
      const porDisciplina = t.disciplinas.map(d => {
        const notasDisc = notas.filter(n => n.aluno_id === m.aluno_id && n.disciplina_id === d.id)
        const recsDisc = recs.filter(r => r.aluno_id === m.aluno_id && r.disciplina_id === d.id)
        const consDisc = cons
          .filter(c => c.aluno_id === m.aluno_id && c.matriz_disciplina_id === d.id)
          .map(c => ({ periodo: c.periodo, nota_conselho: c.nota_conselho === null ? null : Number(c.nota_conselho) }))
        const { medias } = computarMediasPeriodo(notasDisc, recsDisc, consDisc, t.config, t.qtd)
        return { id: d.id, disciplinaId: d.disciplinaId, nome: d.nome, medias, anual: computarMediaAnual(medias, t.config) }
      })

      const mediasOrdinal: (number | null)[] = Array.from({ length: t.qtd }, (_, i) =>
        mediaLista(porDisciplina.map(d => d.medias[i] ?? null))
      )
      const avaliadoOrdinal: boolean[] = Array.from({ length: t.qtd }, (_, i) =>
        porDisciplina.some(d => (d.medias[i] ?? null) !== null)
      )

      // Frequência por ordinal: janela matrícula ∩ janela do período (regra do Boletim)
      const diasAluno = bulk.freqDiaPorTurmaAluno.get(t.id)?.get(m.aluno_id) || []
      const aulasAluno = bulk.freqAulaPorTurmaAluno.get(t.id)?.get(m.aluno_id) || []
      const freqJanela = (ini: string | null, fim: string | null): number | null => {
        let presencas = 0
        let total = 0
        if (t.criterio === 'por_dia') {
          for (const f of diasAluno) {
            if (!f.status || !dentroJanela(f.dia_letivo, ini, fim)) continue
            total++
            if (f.status === 'P' || f.status === 'FJ') presencas++
          }
        } else {
          for (const f of aulasAluno) {
            if (!f.status || !ativos.has(f.horario_id as string)) continue
            if (!dentroJanela(f.data_aula, ini, fim)) continue
            total++
            if (f.status === 'P' || f.status === 'FJ') presencas++
          }
        }
        return total > 0 ? Math.round((presencas / total) * 100) : null
      }
      const freqOrdinal: (number | null)[] = t.periodos.map(p => {
        const ini = [m.data_matricula, p.data_inicio].filter(Boolean).sort().pop() || null
        const fims = [m.data_saida, p.data_termino].filter(Boolean) as string[]
        const fim = fims.length > 0 ? fims.sort()[0] : null
        return freqJanela(ini, fim)
      })

      let mediaAtual: number | null
      let mediaAnterior: number | null
      if (periodoOrdem !== null) {
        mediaAtual = mediasOrdinal[periodoOrdem - 1] ?? null
        if (periodoOrdem > 1) {
          mediaAnterior = mediasOrdinal[periodoOrdem - 2] ?? null
        } else {
          mediaAnterior = null
        }
      } else {
        mediaAtual = mediaLista(porDisciplina.map(d => d.anual))
        const naoNulos = mediasOrdinal
          .map((v, i) => ({ v, i }))
          .filter(x => x.v !== null)
        mediaAnterior = naoNulos.length >= 2 ? naoNulos[naoNulos.length - 2].v : null
      }

      const temNota = periodoOrdem !== null
        ? (avaliadoOrdinal[periodoOrdem - 1] ?? false)
        : porDisciplina.some(d => d.anual !== null)

      // Frequência do recorte: ordinal selecionado ou ano completo (só janela da matrícula)
      const frequencia = periodoOrdem !== null
        ? (freqOrdinal[periodoOrdem - 1] ?? null)
        : freqJanela(m.data_matricula || null, m.data_saida || null)

      linhas.push({
        turmaId: t.id,
        alunoId: m.aluno_id,
        nome: (bulk.nomes.get(m.aluno_id) || '').trim() || '—',
        porDisciplina,
        mediasOrdinal,
        freqOrdinal,
        avaliadoOrdinal,
        mediaAtual,
        mediaAnterior,
        avaliado: temNota,
        frequencia,
      })
    }
  }
  return linhas
}

// ─── Server actions: filtros + panorama (US1) ───

export async function getPeriodosRendimento(
  schoolId: string,
  anoLetivoId: string,
  pessoaId?: string | null
): Promise<PeriodoOpcao[]> {
  await validarRendimento(pessoaId)
  if (!schoolId || !anoLetivoId) return []

  const { data: calendarios } = await supabase
    .from('academico_calendarios')
    .select('id')
    .eq('ano_letivo_id', anoLetivoId)
  const calendarioIds = (calendarios || []).map(c => c.id)
  if (calendarioIds.length === 0) return []

  const { data } = await supabase
    .from('academico_calendario_eventos')
    .select('descricao, data_inicio, data_termino, etapas')
    .in('calendario_id', calendarioIds)
    .eq('tipo', 'periodo_avaliativo')
  const eventos: EventoAvaliativo[] = ((data || []) as unknown as EventoAvaliativo[]).map(ev => ({
    ...ev,
    etapas: Array.isArray(ev.etapas) ? ev.etapas : null,
  }))

  if (eventos.length > 0) return montarPeriodos(eventos, null, null, eventos.length, false)

  // Fallback: maior quantidade de períodos numéricos entre os métodos do ano
  const { data: matrizes } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
  const metodoIds = Array.from(new Set((matrizes || []).map(m => m.metodo_avaliacao_id).filter(Boolean) as string[]))
  let qtd = 4
  if (metodoIds.length > 0) {
    const { data: metodos } = await supabase
      .from('academico_metodos_avaliacao')
      .select('quantidade_periodos_numerico')
      .in('id', metodoIds)
    for (const m of metodos || []) {
      const n = Number(m.quantidade_periodos_numerico) || 0
      if (n > qtd) qtd = n
    }
  }
  return Array.from({ length: qtd }, (_, i) => ({
    ordem: i + 1,
    nome: `Período ${i + 1}`,
    data_inicio: null,
    data_termino: null,
  }))
}

export type RecortePanorama = {
  periodoOrdem: number | null // null = ano letivo completo
  kpis: KpisRendimento
  porEtapa: EtapaPanorama[]
  porTurma: TurmaPanorama[]
  distribuicao: { faixa: string; quantidade: number; percentual: number | null }[]
  porDisciplina: DisciplinaPanorama[]
}

export type PanoramaRendimento = {
  porPeriodo: PeriodoPanorama[]
  recortes: RecortePanorama[]
}

export type FiltrosPanoramaInput = {
  schoolId: string
  anoLetivoId: string
}

function panoramaVazio(): PanoramaRendimento {
  return { porPeriodo: [], recortes: [] }
}

function pct(n: number, d: number): number | null {
  return d > 0 ? Math.round((n / d) * 1000) / 10 : null
}

type VisaoRecorte = {
  linha: LinhaAluno
  ctx: TurmaCtx
  media: number | null
  anterior: number | null
  avaliado: boolean
  freq: number | null
}

function agregarRecorte(
  turmasRecorte: TurmaCtx[],
  visoes: VisaoRecorte[],
  periodoOrdem: number | null,
  porPeriodo: PeriodoPanorama[],
  maxOrdem: number
): Omit<RecortePanorama, 'periodoOrdem'> {
  const avaliados = visoes.filter(v => v.avaliado)
  const totalAlunos = visoes.length
  const mediaGeral = mediaLista(avaliados.map(v => v.media))
  const acima = avaliados.filter(v => v.media !== null && v.media >= v.ctx.mediaMinima)
  const freqMedia = mediaLista(avaliados.map(v => v.freq))
  let risco = 0
  for (const v of avaliados) {
    const r = classificarLinha(
      { mediaAtual: v.media, mediaAnterior: v.anterior, frequencia: v.freq },
      v.ctx.mediaMinima, v.ctx.freqMin, v.ctx.faixaPp, v.ctx.mediaMaxima
    )
    if (r.categoria === 'risco') risco++
  }
  const comFreq = avaliados.filter(v => v.freq !== null)
  const freqAbaixo = comFreq.filter(v => (v.freq as number) < v.ctx.freqMin)

  // Por etapa (evolução vs. ordinal anterior com dados)
  const porEtapa: EtapaPanorama[] = []
  const etapaIds = Array.from(new Set(turmasRecorte.map(t => t.etapaId || 'sem-etapa')))
  for (const etapaId of etapaIds) {
    const visoesEtapa = avaliados.filter(v => (v.ctx.etapaId || 'sem-etapa') === etapaId)
    const ctx0 = turmasRecorte.find(t => (t.etapaId || 'sem-etapa') === etapaId)
    const acimaE = visoesEtapa.filter(v => v.media !== null && v.media >= v.ctx.mediaMinima)
    let evolucao: number | null = null
    if (periodoOrdem !== null && periodoOrdem > 1) {
      const atual = mediaLista(visoesEtapa.map(v => v.media))
      const ant = mediaLista(visoesEtapa.map(v =>
        periodoOrdem - 1 <= v.ctx.qtd ? (v.linha.mediasOrdinal[periodoOrdem - 2] ?? null) : null
      ))
      evolucao = atual !== null && ant !== null ? Math.round((atual - ant) * 100) / 100 : null
    } else if (periodoOrdem === null) {
      const ordens = porPeriodo.filter(p => p.media !== null).map(p => p.ordem)
      if (ordens.length >= 2) {
        const a = porPeriodo[ordens[ordens.length - 1] - 1].media as number
        const b = porPeriodo[ordens[ordens.length - 2] - 1].media as number
        evolucao = Math.round((a - b) * 100) / 100
      }
    }
    porEtapa.push({
      etapaId: etapaId === 'sem-etapa' ? null : etapaId,
      nome: ctx0?.etapaNome || 'Etapa',
      avaliados: visoesEtapa.length,
      media: mediaLista(visoesEtapa.map(v => v.media)),
      pctAcima: pct(acimaE.length, visoesEtapa.length),
      pctAbaixo: visoesEtapa.length > 0 ? pct(visoesEtapa.length - acimaE.length, visoesEtapa.length) : null,
      acima: acimaE.length,
      abaixo: visoesEtapa.length - acimaE.length,
      freqMedia: mediaLista(visoesEtapa.map(v => v.freq)),
      evolucao,
      porDisciplina: (() => {
        const mapa = new Map<string, { nome: string; itens: { visao: VisaoRecorte; valor: number | null; medias: (number | null)[] }[] }>()
        for (const v of visoesEtapa) {
          for (const d of v.linha.porDisciplina) {
            const valor = periodoOrdem !== null ? (d.medias[periodoOrdem - 1] ?? null) : d.anual
            const g = mapa.get(d.disciplinaId) || { nome: d.nome, itens: [] }
            g.itens.push({ visao: v, valor, medias: d.medias })
            mapa.set(d.disciplinaId, g)
          }
        }
        return [...mapa.entries()].map(([disciplinaId, g]) => {
          const av = g.itens.filter(e => e.valor !== null)
          const acimaD = av.filter(e => (e.valor as number) >= e.visao.ctx.mediaMinima)
          let evolucaoD: number | null = null
          if (periodoOrdem !== null && periodoOrdem > 1) {
            const mA = mediaLista(g.itens.map(e => e.medias[periodoOrdem - 1] ?? null))
            const mB = mediaLista(g.itens.map(e => e.medias[periodoOrdem - 2] ?? null))
            evolucaoD = mA !== null && mB !== null ? Math.round((mA - mB) * 100) / 100 : null
          }
          return {
            disciplinaId,
            nome: g.nome,
            avaliados: av.length,
            media: mediaLista(av.map(e => e.valor)),
            pctAcima: pct(acimaD.length, av.length),
            pctAbaixo: av.length > 0 ? pct(av.length - acimaD.length, av.length) : null,
            acima: acimaD.length,
            abaixo: av.length - acimaD.length,
            freqMedia: mediaLista(av.map(e => e.visao.freq)),
            evolucao: evolucaoD,
          }
        }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      })(),
    })
  }
  porEtapa.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  // Por turma
  const porTurma: TurmaPanorama[] = turmasRecorte
    .map(t => {
      const lt = avaliados.filter(v => v.linha.turmaId === t.id)
      const acimaT = lt.filter(v => v.media !== null && v.media >= t.mediaMinima)
      const discMapT = new Map<string, { nome: string; vs: VisaoRecorte[]; valores: (number | null)[] }>()
      for (const v of lt) {
        for (const d of v.linha.porDisciplina) {
          const valor = periodoOrdem !== null ? (d.medias[periodoOrdem - 1] ?? null) : d.anual
          if (valor === null) continue
          const g = discMapT.get(d.disciplinaId) || { nome: d.nome, vs: [], valores: [] }
          g.vs.push(v)
          g.valores.push(valor)
          discMapT.set(d.disciplinaId, g)
        }
      }
      const porDisciplina: TurmaDisciplina[] = [...discMapT.entries()].map(([disciplinaId, g]) => {
        const acimaD = g.valores.filter(m => (m as number) >= t.mediaMinima)
        return {
          disciplinaId,
          nome: g.nome,
          avaliados: g.valores.length,
          media: mediaLista(g.valores),
          pctAcima: pct(acimaD.length, g.valores.length),
          frequencia: mediaLista(g.vs.map(x => x.freq)),
        }
      }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
      return {
        turmaId: t.id,
        nome: t.nome,
        etapaNome: t.etapaNome,
        alunos: lt.length,
        media: mediaLista(lt.map(v => v.media)),
        pctAcima: pct(acimaT.length, lt.length),
        frequencia: mediaLista(lt.map(v => v.freq)),
        porDisciplina,
      }
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  // Por disciplina (agrupa pela disciplina base)
  type EntradaDisc = { visao: VisaoRecorte; valor: number | null; medias: (number | null)[] }
  const discMap = new Map<string, { nome: string; entradas: EntradaDisc[] }>()
  for (const v of visoes) {
    for (const d of v.linha.porDisciplina) {
      const valor = periodoOrdem !== null ? (d.medias[periodoOrdem - 1] ?? null) : d.anual
      const grupo = discMap.get(d.disciplinaId) || { nome: d.nome, entradas: [] }
      grupo.entradas.push({ visao: v, valor, medias: d.medias })
      discMap.set(d.disciplinaId, grupo)
    }
  }
  const porDisciplina: DisciplinaPanorama[] = [...discMap.entries()].map(([disciplinaId, g]) => {
    const av = g.entradas.filter(e => e.valor !== null)
    const acimaD = av.filter(e => (e.valor as number) >= e.visao.ctx.mediaMinima)
    const comFreqD = av.filter(e => e.visao.freq !== null)
    const freqAbaixoD = comFreqD.filter(e => (e.visao.freq as number) < e.visao.ctx.freqMin)
    return {
      disciplinaId,
      nome: g.nome,
      media: mediaLista(av.map(e => e.valor)),
      pctAcima: pct(acimaD.length, av.length),
      pctAbaixo: av.length > 0 ? pct(av.length - acimaD.length, av.length) : null,
      pctFreqAbaixo: pct(freqAbaixoD.length, comFreqD.length),
      avaliados: av.length,
      evolucao: Array.from({ length: maxOrdem }, (_, i) =>
        mediaLista(g.entradas.map(e => e.medias[i] ?? null))
      ),
      distribuicao: FAIXAS_RENDIMENTO.map(f => {
        const qtd = av.filter(e => (e.valor as number) >= f.min && (e.valor as number) <= f.max).length
        return { faixa: f.faixa, quantidade: qtd, percentual: pct(qtd, av.length) }
      }),
    }
  })
  porDisciplina.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  return {
    kpis: {
      mediaGeral,
      pctAcima: pct(acima.length, avaliados.length),
      pctAbaixo: avaliados.length > 0 ? pct(avaliados.length - acima.length, avaliados.length) : null,
      pctFreqAbaixo: pct(freqAbaixo.length, comFreq.length),
      freqMedia,
      pctRisco: pct(risco, avaliados.length),
      totalAlunos,
      totalAvaliados: avaliados.length,
    },
    porEtapa,
    porTurma,
    distribuicao: FAIXAS_RENDIMENTO.map(f => {
      const qtd = avaliados.filter(v => v.media !== null && v.media >= f.min && v.media <= f.max).length
      return { faixa: f.faixa, quantidade: qtd, percentual: pct(qtd, avaliados.length) }
    }),
    porDisciplina,
  }
}

export async function getPanoramaRendimento(
  filtros: FiltrosPanoramaInput,
  pessoaId?: string | null
): Promise<PanoramaRendimento> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId } = filtros
  if (!schoolId) throw new Error('Selecione a unidade escolar para ver o rendimento.')
  if (!anoLetivoId) throw new Error('Selecione o ano letivo para ver o rendimento.')

  const turmas = await carregarTurmasCtx(schoolId, anoLetivoId)
  if (turmas.length === 0) return panoramaVazio()

  const maxOrdem = Math.max(...turmas.map(t => t.qtd))

  const bulk = await carregarBulk(turmas)
  // Recorte nulo = sem filtro de ordinal (ano completo); visões por ordinal derivadas abaixo
  const linhas = computarLinhas(turmas, bulk, null)
  const ctxPorTurma = new Map(turmas.map(t => [t.id, t]))

  // Por período (todos os ordinais — alimenta a evolução)
  const porPeriodo: PeriodoPanorama[] = []
  for (let o = 1; o <= maxOrdem; o++) {
    const noOrdinal = linhas.filter(l => {
      const ctx = ctxPorTurma.get(l.turmaId)
      return ctx && o <= ctx.qtd
    })
    const av = noOrdinal.filter(l => l.avaliadoOrdinal[o - 1])
    const medias = av.map(l => l.mediasOrdinal[o - 1] ?? null)
    const acimaO = av.filter(l => {
      const ctx = ctxPorTurma.get(l.turmaId)!
      const m = l.mediasOrdinal[o - 1] ?? null
      return m !== null && m >= ctx.mediaMinima
    })
    const comFreq = av.filter(l => (l.freqOrdinal[o - 1] ?? null) !== null)
    const freqAbaixo = comFreq.filter(l => {
      const ctx = ctxPorTurma.get(l.turmaId)!
      return (l.freqOrdinal[o - 1] as number) < ctx.freqMin
    })
    const nome = turmas.map(t => t.periodos.find(p => p.ordem === o)?.nome).find(Boolean) || `Período ${o}`
    porPeriodo.push({
      ordem: o,
      nome,
      media: mediaLista(medias),
      pctAcima: pct(acimaO.length, av.length),
      pctAbaixo: av.length > 0 ? pct(av.length - acimaO.length, av.length) : null,
      pctFreqAbaixo: pct(freqAbaixo.length, comFreq.length),
      avaliados: av.length,
    })
  }

  // Um recorte por ordinal + ano completo, todos sobre o mesmo bulk
  const ordens: (number | null)[] = [null, ...Array.from({ length: maxOrdem }, (_, i) => i + 1)]
  const recortes: RecortePanorama[] = ordens.map(p => {
    const turmasRecorte = p === null ? turmas : turmas.filter(t => t.periodos.some(x => x.ordem === p))
    const ids = new Set(turmasRecorte.map(t => t.id))
    const visoes: VisaoRecorte[] = linhas
      .filter(l => ids.has(l.turmaId))
      .map(l => {
        const ctx = ctxPorTurma.get(l.turmaId)!
        return {
          linha: l,
          ctx,
          media: p === null ? l.mediaAtual : (l.mediasOrdinal[p - 1] ?? null),
          anterior: p === null ? l.mediaAnterior : p > 1 ? (l.mediasOrdinal[p - 2] ?? null) : null,
          avaliado: p === null ? l.avaliado : (l.avaliadoOrdinal[p - 1] ?? false),
          freq: p === null ? l.frequencia : (l.freqOrdinal[p - 1] ?? null),
        }
      })
    return { periodoOrdem: p, ...agregarRecorte(turmasRecorte, visoes, p, porPeriodo, maxOrdem) }
  })

  return { porPeriodo, recortes }
}

// ─── Recorte por etapa (filtros de Etapa dos cards da sub-aba Período) ───

export type RecorteEtapaInput = {
  schoolId: string
  anoLetivoId: string
  etapaId: string | null // null = todas
  periodoOrdem: number | null
}

export async function getRecorteEtapa(
  input: RecorteEtapaInput,
  pessoaId?: string | null
): Promise<RecortePanorama | null> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId, etapaId, periodoOrdem } = input
  if (!schoolId || !anoLetivoId) throw new Error('Dados insuficientes para filtrar por etapa.')

  const todas = await carregarTurmasCtx(schoolId, anoLetivoId)
  const turmas = etapaId === null
    ? todas
    : todas.filter(t => (t.etapaId || 'sem-etapa') === etapaId)
  if (turmas.length === 0) return null

  const maxOrdem = Math.max(...turmas.map(t => t.qtd))
  const bulk = await carregarBulk(turmas)
  const linhas = computarLinhas(turmas, bulk, null)
  const ctxPorTurma = new Map(turmas.map(t => [t.id, t]))
  const turmasRecorte = periodoOrdem === null
    ? turmas
    : turmas.filter(t => t.periodos.some(x => x.ordem === periodoOrdem))
  const ids = new Set(turmasRecorte.map(t => t.id))
  const visoes: VisaoRecorte[] = linhas
    .filter(l => ids.has(l.turmaId))
    .map(l => {
      const ctx = ctxPorTurma.get(l.turmaId)!
      return {
        linha: l,
        ctx,
        media: periodoOrdem === null ? l.mediaAtual : (l.mediasOrdinal[periodoOrdem - 1] ?? null),
        anterior: periodoOrdem === null ? l.mediaAnterior : periodoOrdem > 1 ? (l.mediasOrdinal[periodoOrdem - 2] ?? null) : null,
        avaliado: periodoOrdem === null ? l.avaliado : (l.avaliadoOrdinal[periodoOrdem - 1] ?? false),
        freq: periodoOrdem === null ? l.frequencia : (l.freqOrdinal[periodoOrdem - 1] ?? null),
      }
    })
  return { periodoOrdem, ...agregarRecorte(turmasRecorte, visoes, periodoOrdem, [], maxOrdem) }
}

// ─── Server actions: situação (US2) ───

export type FiltrosSituacaoOpcoes = {
  etapas: { id: string; nome: string }[]
  turmas: { id: string; nome: string; etapaId: string | null }[]
  disciplinas: { id: string; nome: string }[]
}

export async function getFiltrosSituacao(
  schoolId: string,
  anoLetivoId: string,
  pessoaId?: string | null
): Promise<FiltrosSituacaoOpcoes> {
  await validarRendimento(pessoaId)
  const vazio: FiltrosSituacaoOpcoes = { etapas: [], turmas: [], disciplinas: [] }
  if (!schoolId || !anoLetivoId) return vazio

  const turmas = await carregarTurmasCtx(schoolId, anoLetivoId)
  const etapaMap = new Map<string, string>()
  const discMap = new Map<string, string>()
  for (const t of turmas) {
    if (t.etapaId && !etapaMap.has(t.etapaId)) etapaMap.set(t.etapaId, t.etapaNome)
    for (const d of t.disciplinas) {
      if (!discMap.has(d.disciplinaId)) discMap.set(d.disciplinaId, d.nome)
    }
  }
  const ordenar = (a: { nome: string }, b: { nome: string }) => a.nome.localeCompare(b.nome, 'pt-BR')
  return {
    etapas: [...etapaMap.entries()].map(([id, nome]) => ({ id, nome })).sort(ordenar),
    turmas: turmas.map(t => ({ id: t.id, nome: t.nome, etapaId: t.etapaId })).sort(ordenar),
    disciplinas: [...discMap.entries()].map(([id, nome]) => ({ id, nome })).sort(ordenar),
  }
}

export type ListaSituacaoInput = FiltrosRendimentoInput & {
  etapaId?: string | null
  turmaId?: string | null
  disciplinaId?: string | null
}

export async function getListaSituacao(
  filtros: ListaSituacaoInput,
  pessoaId?: string | null
): Promise<ListaSituacao> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId, periodoOrdem, etapaId, turmaId, disciplinaId } = filtros
  if (!schoolId) throw new Error('Selecione a unidade escolar para ver a situação.')
  if (!anoLetivoId) throw new Error('Selecione o ano letivo para ver a situação.')

  const todasTurmas = await carregarTurmasCtx(schoolId, anoLetivoId)
  const turmas = todasTurmas.filter(t =>
    (!etapaId || (t.etapaId || 'sem-etapa') === etapaId) &&
    (!turmaId || t.id === turmaId)
  )
  const vazio: ListaSituacao = {
    resumo: {
      adequado: { quantidade: 0, percentual: null },
      atencao: { quantidade: 0, percentual: null },
      risco: { quantidade: 0, percentual: null },
      total: 0,
    },
    linhas: [],
  }
  if (turmas.length === 0) return vazio

  const bulk = await carregarBulk(turmas)
  const brutas = computarLinhas(turmas, bulk, periodoOrdem)
  // Filtro de disciplina: média do recorte passa a ser a da disciplina
  // (frequência continua a do aluno na turma)
  const linhas = brutas
    .map(l => {
      if (!disciplinaId) return l
      const entry = l.porDisciplina.find(d => d.disciplinaId === disciplinaId)
      if (!entry) return { ...l, avaliado: false }
      const valor = periodoOrdem !== null ? (entry.medias[periodoOrdem - 1] ?? null) : entry.anual
      const anterior = periodoOrdem !== null
        ? (periodoOrdem > 1 ? (entry.medias[periodoOrdem - 2] ?? null) : null)
        : (() => {
            const nn = entry.medias.map((v, i) => ({ v, i })).filter(x => x.v !== null)
            return nn.length >= 2 ? nn[nn.length - 2].v : null
          })()
      return { ...l, mediaAtual: valor, mediaAnterior: anterior, avaliado: valor !== null }
    })
    .filter(l => l.avaliado)
  const ctxPorTurma = new Map(turmas.map(t => [t.id, t]))
  const pct = (n: number, d: number): number | null => (d > 0 ? Math.round((n / d) * 1000) / 10 : null)

  const classificadas: ClassificacaoAluno[] = linhas.map(l => {
    const ctx = ctxPorTurma.get(l.turmaId)!
    const { categoria, motivos, tendencia } = classificarLinha(
      { mediaAtual: l.mediaAtual, mediaAnterior: l.mediaAnterior, frequencia: l.frequencia },
      ctx.mediaMinima, ctx.freqMin, ctx.faixaPp, ctx.mediaMaxima
    )
    return {
      alunoId: l.alunoId,
      nome: l.nome,
      turmaId: l.turmaId,
      turmaNome: ctx.nome,
      media: l.mediaAtual,
      mediaAnterior: l.mediaAnterior,
      frequencia: l.frequencia,
      categoria,
      motivos,
      tendencia,
    }
  })

  const cont = { adequado: 0, atencao: 0, risco: 0 }
  for (const c of classificadas) cont[c.categoria]++

  // Tabela: só atenção + risco (risco primeiro, depois queda, depois nome)
  const pesoCat = { risco: 0, atencao: 1, adequado: 2 } as const
  const pesoTend = { queda: 0, estavel: 1, melhorando: 2 } as const
  const tabela = classificadas
    .filter(c => c.categoria !== 'adequado')
    .sort((a, b) =>
      pesoCat[a.categoria] - pesoCat[b.categoria]
      || pesoTend[a.tendencia] - pesoTend[b.tendencia]
      || a.nome.localeCompare(b.nome, 'pt-BR')
    )

  return {
    resumo: {
      adequado: { quantidade: cont.adequado, percentual: pct(cont.adequado, classificadas.length) },
      atencao: { quantidade: cont.atencao, percentual: pct(cont.atencao, classificadas.length) },
      risco: { quantidade: cont.risco, percentual: pct(cont.risco, classificadas.length) },
      total: classificadas.length,
    },
    linhas: tabela,
  }
}

export type DetalheAlunoInput = FiltrosRendimentoInput & { turmaId: string; alunoId: string; disciplinaId?: string | null }

export async function getDetalheAluno(
  input: DetalheAlunoInput,
  pessoaId?: string | null
): Promise<DetalheAluno> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId, periodoOrdem, turmaId, alunoId, disciplinaId } = input
  if (!schoolId || !anoLetivoId || !turmaId || !alunoId) {
    throw new Error('Dados insuficientes para detalhar o aluno.')
  }

  const turmas = (await carregarTurmasCtx(schoolId, anoLetivoId)).filter(t => t.id === turmaId)
  if (turmas.length === 0) throw new Error('Turma sem avaliação numérica ou não encontrada.')
  const ctx = turmas[0]

  const bulk = await carregarBulk(turmas)
  const linha = computarLinhas(turmas, bulk, periodoOrdem).find(l => l.alunoId === alunoId)
  if (!linha) throw new Error('Aluno não encontrado na turma para o período selecionado.')

  // Filtro de disciplina: médias e classificação passam a ser da disciplina
  let mediaAtual = linha.mediaAtual
  let mediaAnterior = linha.mediaAnterior
  let entradasDisc = linha.porDisciplina
  if (disciplinaId) {
    const entry = linha.porDisciplina.find(d => d.disciplinaId === disciplinaId)
    if (entry) {
      mediaAtual = periodoOrdem !== null ? (entry.medias[periodoOrdem - 1] ?? null) : entry.anual
      mediaAnterior = periodoOrdem !== null
        ? (periodoOrdem > 1 ? (entry.medias[periodoOrdem - 2] ?? null) : null)
        : (() => {
            const nn = entry.medias.map((v, i) => ({ v, i })).filter(x => x.v !== null)
            return nn.length >= 2 ? nn[nn.length - 2].v : null
          })()
      entradasDisc = [entry]
    } else {
      mediaAtual = null
      mediaAnterior = null
      entradasDisc = []
    }
  }

  const porDisciplina: DisciplinaDetalhe[] = entradasDisc.map(d => ({
    id: d.id,
    nome: d.nome,
    media: periodoOrdem !== null ? (d.medias[periodoOrdem - 1] ?? null) : d.anual,
  }))

  const { motivos, tendencia } = classificarLinha(
    { mediaAtual, mediaAnterior, frequencia: linha.frequencia },
    ctx.mediaMinima, ctx.freqMin, ctx.faixaPp, ctx.mediaMaxima
  )
  const pontosAtencao = motivos.map(m => ROTULOS_MOTIVO[m])

  // Disciplina com maior queda (atual vs. anterior, no escopo do filtro)
  if (periodoOrdem !== null && periodoOrdem > 1) {
    let pior: { nome: string; diff: number } | null = null
    for (const d of entradasDisc) {
      const atual = d.medias[periodoOrdem - 1] ?? null
      const ant = d.medias[periodoOrdem - 2] ?? null
      if (atual === null || ant === null) continue
      const diff = atual - ant
      if (diff <= -MARGEM_TENDENCIA && (!pior || diff < pior.diff)) pior = { nome: d.nome, diff }
    }
    if (pior) pontosAtencao.push(`Queda de rendimento em ${pior.nome}`)
  }

  return {
    mediaAtual,
    mediaAnterior,
    frequencia: linha.frequencia,
    tendencia,
    porDisciplina: porDisciplina.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    pontosAtencao,
  }
}

// ─── Server actions: drill-down da turma (US3) ───

export type DetalheTurmaInput = FiltrosRendimentoInput & { turmaId: string }

export async function getDetalheTurma(
  input: DetalheTurmaInput,
  pessoaId?: string | null
): Promise<DetalheTurma> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId, periodoOrdem, turmaId } = input
  if (!schoolId || !anoLetivoId || !turmaId) {
    throw new Error('Dados insuficientes para detalhar a turma.')
  }

  const turmas = (await carregarTurmasCtx(schoolId, anoLetivoId)).filter(t => t.id === turmaId)
  if (turmas.length === 0) throw new Error('Turma sem avaliação numérica ou não encontrada.')
  const ctx = turmas[0]

  const bulk = await carregarBulk(turmas)
  const avaliados = computarLinhas(turmas, bulk, periodoOrdem).filter(l => l.avaliado)
  const pct = (n: number, d: number): number | null => (d > 0 ? Math.round((n / d) * 1000) / 10 : null)

  const porDisciplina = ctx.disciplinas.map(d => {
    const medias = avaliados.map(l => {
      const disc = l.porDisciplina.find(p => p.id === d.id)
      if (!disc) return null
      return periodoOrdem !== null ? (disc.medias[periodoOrdem - 1] ?? null) : disc.anual
    })
    const validas = medias.filter((m): m is number => m !== null)
    return {
      id: d.id,
      nome: d.nome,
      media: mediaLista(medias),
      avaliados: validas.length,
    }
  })

  const abaixoMedia = avaliados
    .filter(l => l.mediaAtual !== null && l.mediaAtual < ctx.mediaMinima)
    .map(l => ({ alunoId: l.alunoId, nome: l.nome, media: l.mediaAtual as number }))
    .sort((a, b) => a.media - b.media || a.nome.localeCompare(b.nome, 'pt-BR'))

  const evolucao = Array.from({ length: ctx.qtd }, (_, i) => {
    const o = i + 1
    const nome = ctx.periodos.find(p => p.ordem === o)?.nome || `Período ${o}`
    const av = avaliados.filter(l => l.avaliadoOrdinal[i])
    return { ordem: o, nome, media: mediaLista(av.map(l => l.mediasOrdinal[i] ?? null)) }
  })

  return {
    porDisciplina,
    distribuicao: FAIXAS_RENDIMENTO.map(f => {
      const qtd = avaliados.filter(l => l.mediaAtual !== null && l.mediaAtual >= f.min && l.mediaAtual <= f.max).length
      return { faixa: f.faixa, quantidade: qtd, percentual: pct(qtd, avaliados.length) }
    }),
    frequencia: mediaLista(avaliados.map(l => l.frequencia)),
    abaixoMedia,
    evolucao,
  }
}

// ─── Server actions: situação final (US4) ───

function situacaoFinalVazia(): SituacaoFinalPanorama {
  return { vazio: true, blocos: [], porTurma: [], situacoes: [], turmasNaoFechadas: [], total: 0 }
}

export async function getSituacaoFinal(
  schoolId: string,
  anoLetivoId: string,
  pessoaId?: string | null
): Promise<SituacaoFinalPanorama> {
  await validarRendimento(pessoaId)
  if (!schoolId) throw new Error('Selecione a unidade escolar para ver a situação final.')
  if (!anoLetivoId) throw new Error('Selecione o ano letivo para ver a situação final.')

  // Turmas do ano (id/nome/fechada) — direto, sem exigir método numérico
  const { data: turmasAno } = await supabase
    .from('turmas')
    .select('id, nome, fechada')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .order('nome')
  const todas = (turmasAno || []) as { id: string; nome: string; fechada: boolean }[]
  const turmasNaoFechadas = todas
    .filter(t => t.fechada !== true)
    .map(t => ({ turmaId: t.id, turmaNome: t.nome || 'Turma' }))
  const fechadas = todas.filter(t => t.fechada === true)
  if (fechadas.length === 0) return { ...situacaoFinalVazia(), turmasNaoFechadas }

  const pct = (n: number, d: number): number | null => (d > 0 ? Math.round((n / d) * 1000) / 10 : null)
  const nomePorTurma = new Map(fechadas.map(t => [t.id, t.nome || 'Turma']))

  // Matrículas das fechadas (dedupe por aluno/turma: situação final vence 'Ativo')
  const porTurmaValores = new Map<string, Record<string, number>>()
  const contagem = new Map<string, number>()
  for (const grupo of chunk(fechadas.map(t => t.id))) {
    const { data } = await supabase
      .from('academico_matriculas')
      .select('turma_id, aluno_id, situacao, data_matricula')
      .in('turma_id', grupo)
    const dedupe = new Map<string, { situacao: string; data: string }>()
    for (const m of data || []) {
      const chave = `${m.turma_id}|${m.aluno_id}`
      const sit = (m.situacao as string) || 'Ativo'
      const atual = dedupe.get(chave)
      if (!atual) {
        dedupe.set(chave, { situacao: sit, data: String(m.data_matricula || '') })
      } else {
        const atualFinal = isSituacaoFinal(atual.situacao)
        const novoFinal = isSituacaoFinal(sit)
        if ((novoFinal && !atualFinal) || (novoFinal === atualFinal && String(m.data_matricula || '') > atual.data)) {
          dedupe.set(chave, { situacao: sit, data: String(m.data_matricula || '') })
        }
      }
    }
    for (const [chave, v] of dedupe) {
      const turmaId = chave.split('|')[0]
      const valores = porTurmaValores.get(turmaId) || {}
      valores[v.situacao] = (valores[v.situacao] || 0) + 1
      porTurmaValores.set(turmaId, valores)
      contagem.set(v.situacao, (contagem.get(v.situacao) || 0) + 1)
    }
  }

  const total = [...contagem.values()].reduce((a, b) => a + b, 0)
  if (total === 0) return { ...situacaoFinalVazia(), turmasNaoFechadas }

  const situacoes = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s)

  return {
    vazio: false,
    blocos: situacoes.map(s => ({
      situacaoDb: s,
      rotulo: labelSituacaoMatricula(s),
      quantidade: contagem.get(s) || 0,
      percentual: pct(contagem.get(s) || 0, total),
    })),
    porTurma: fechadas.map(t => ({
      turmaId: t.id,
      turmaNome: nomePorTurma.get(t.id) || 'Turma',
      valores: porTurmaValores.get(t.id) || {},
    })),
    situacoes,
    turmasNaoFechadas,
    total,
  }
}

export type CruzamentoInput = { schoolId: string; anoLetivoId: string; situacaoDb: string }

export async function getCruzamentoRendimento(
  input: CruzamentoInput,
  pessoaId?: string | null
): Promise<{ ordens: { ordem: number; nome: string }[]; alunos: { alunoId: string; nome: string; turmaNome: string; medias: (number | null)[] }[] }> {
  await validarRendimento(pessoaId)
  const { schoolId, anoLetivoId, situacaoDb } = input
  if (!schoolId || !anoLetivoId || !situacaoDb) {
    throw new Error('Dados insuficientes para cruzar rendimento e resultado.')
  }

  const turmas = (await carregarTurmasCtx(schoolId, anoLetivoId)).filter(t => t.fechada)
  if (turmas.length === 0) return { ordens: [], alunos: [] }

  // Alunos das fechadas com a situação do recorte
  const alvo = new Set<string>() // `${turmaId}|${alunoId}`
  for (const grupo of chunk(turmas.map(t => t.id))) {
    const { data } = await supabase
      .from('academico_matriculas')
      .select('turma_id, aluno_id')
      .in('turma_id', grupo)
      .eq('situacao', situacaoDb)
    for (const m of data || []) alvo.add(`${m.turma_id}|${m.aluno_id}`)
  }
  if (alvo.size === 0) return { ordens: [], alunos: [] }

  const bulk = await carregarBulk(turmas)
  const linhas = computarLinhas(turmas, bulk, null).filter(l => alvo.has(`${l.turmaId}|${l.alunoId}`))
  const ctxPorTurma = new Map(turmas.map(t => [t.id, t]))
  const maxOrdem = Math.max(...turmas.map(t => t.qtd))

  const nomesPorOrdem: { ordem: number; nome: string }[] = []
  for (let o = 1; o <= maxOrdem; o++) {
    const nome = turmas.map(t => t.periodos.find(p => p.ordem === o)?.nome).find(Boolean) || `Período ${o}`
    nomesPorOrdem.push({ ordem: o, nome })
  }

  const alunos = linhas
    .map(l => ({
      alunoId: l.alunoId,
      nome: l.nome,
      turmaNome: ctxPorTurma.get(l.turmaId)?.nome || 'Turma',
      medias: l.mediasOrdinal,
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    .slice(0, 20)

  return { ordens: nomesPorOrdem, alunos }
}
