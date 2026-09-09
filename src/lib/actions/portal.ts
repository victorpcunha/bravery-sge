'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import {
  calcularFrequenciaBoletim,
  listarPeriodosAvaliativos,
  resolverMetodoBoletim,
  type PeriodoBoletim,
} from './boletim'
import { getNumericoConfigCompleta } from './avaliacoes-numericas'
import { calcularMediasPeriodoTurma } from './avaliacoes-numericas'

const supabase = getSupabaseAdmin()

// ─── Tipos ───

export type PortalCtx = {
  schoolId: string
  matriculaId: string
  turmaId: string
  turmaNome: string
  anoLetivoId: string
  dataMatricula: string | null
  dataSaida: string | null
}

export type AlunoVinculado = {
  alunoId: string
  nome: string
  turmaNome: string | null
  etapaNome: string | null
  turnos: string[]
  principal: boolean
}

export type SessaoPortal = {
  responsavel: { id: string; nome: string; email: string }
  termoPendente: boolean
  termoVersao: number | null
  alunos: AlunoVinculado[]
}

// ─── Autorização (Constituição II): vínculo revalidado server-side em CADA action ───
//
// As funções do motor (boletim, painel-pessoa, documentos) autorizam via
// `pessoaId` + perfil interno (`validarPermissao*/validarPermRead`), que o
// responsável do portal não possui. Por isso são chamadas com pessoaId
// `undefined` (comportamento documentado: permissão interna é pulada) SOMENTE
// após `validarVinculoPortal` — a autorização do portal É o vínculo
// `responsavel_alunos` + flag `portal_acesso_habilitado`, verificados aqui.

export async function validarVinculoPortal(
  responsavelId: string,
  alunoId: string,
  schoolId?: string
): Promise<PortalCtx> {
  if (!responsavelId || !alunoId) throw new Error('Acesso negado')

  const { data: responsavel } = await supabase
    .from('people')
    .select('id, portal_acesso_habilitado')
    .eq('id', responsavelId)
    .maybeSingle()

  if (!responsavel || (responsavel as { portal_acesso_habilitado?: boolean }).portal_acesso_habilitado !== true) {
    throw new Error('Acesso negado')
  }

  const { data: vinculo } = await supabase
    .from('responsavel_alunos')
    .select('id')
    .eq('responsavel_id', responsavelId)
    .eq('aluno_id', alunoId)
    .maybeSingle()

  if (!vinculo) throw new Error('Acesso negado')

  const { data: matricula } = await supabase
    .from('academico_matriculas')
    .select('id, school_id, turma_id, ano_letivo_id, ativo, data_matricula, data_saida, turma:turma_id(id, nome)')
    .eq('aluno_id', alunoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()

  const m = matricula as unknown as {
    id: string
    school_id: string
    turma_id: string
    ano_letivo_id: string
    ativo: boolean
    data_matricula: string | null
    data_saida: string | null
    turma: { id: string; nome: string } | null
  } | null

  if (!m || !m.ativo || !m.turma) throw new Error('Acesso negado')
  // Escopo da escola do slug (spec 024): cross-escola nega mesmo com vínculo
  if (schoolId && m.school_id !== schoolId) throw new Error('Acesso negado')

  return {
    schoolId: m.school_id,
    matriculaId: m.id,
    turmaId: m.turma_id,
    turmaNome: m.turma.nome || '—',
    anoLetivoId: m.ano_letivo_id,
    dataMatricula: m.data_matricula || null,
    dataSaida: m.data_saida || null,
  }
}

function turnosTexto(turnos: unknown): string[] {
  if (!Array.isArray(turnos)) return []
  return turnos
    .map(t => (typeof t === 'string' ? t : (t as { turno?: string } | null)?.turno || ''))
    .filter(Boolean)
}

async function buscarMatriculaVigente(alunoId: string) {
  const { data } = await supabase
    .from('academico_matriculas')
    .select('id, ativo, school_id, turma:turma_id(id, nome, turnos), etapa:etapa_ensino_id(etapa_nome)')
    .eq('aluno_id', alunoId)
    .order('ativo', { ascending: false })
    .order('data_matricula', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data as unknown as {
    id: string
    ativo: boolean
    school_id: string
    turma: { id: string; nome: string; turnos: unknown } | null
    etapa: { etapa_nome: string } | null
  } | null
}

export async function getSessaoPortal(responsavelId: string, schoolId?: string): Promise<SessaoPortal> {
  if (!responsavelId) throw new Error('Acesso negado')

  const { data: responsavel } = await supabase
    .from('people')
    .select('id, nome_completo, email, portal_acesso_habilitado')
    .eq('id', responsavelId)
    .maybeSingle()

  const r = responsavel as unknown as {
    id: string
    nome_completo: string
    email: string
    portal_acesso_habilitado?: boolean
  } | null

  if (!r || r.portal_acesso_habilitado !== true) throw new Error('Acesso negado')

  const { data: termoAtivo } = await supabase
    .from('portal_termos')
    .select('id, versao')
    .eq('ativo', true)
    .maybeSingle()

  let termoPendente = true
  if (termoAtivo) {
    const { data: aceite } = await supabase
      .from('portal_aceites')
      .select('id')
      .eq('responsavel_id', responsavelId)
      .eq('termo_id', (termoAtivo as { id: string }).id)
      .maybeSingle()
    termoPendente = !aceite
  }

  const { data: vinculos } = await supabase
    .from('responsavel_alunos')
    .select('aluno_id, principal, aluno:aluno_id(id, nome_completo)')
    .eq('responsavel_id', responsavelId)

  const alunos: AlunoVinculado[] = []
  for (const v of (vinculos || []) as unknown as Array<{
    aluno_id: string
    principal: boolean
    aluno: { id: string; nome_completo: string } | null
  }>) {
    if (!v.aluno) continue
    const mat = await buscarMatriculaVigente(v.aluno_id)
    if (!mat || !mat.ativo || !mat.turma) continue
    // Escopo da escola do slug (spec 024): só alunos daquela escola
    if (schoolId && mat.school_id !== schoolId) continue
    alunos.push({
      alunoId: v.aluno_id,
      nome: v.aluno.nome_completo,
      turmaNome: mat.turma.nome || '—',
      etapaNome: mat.etapa?.etapa_nome || null,
      turnos: turnosTexto(mat.turma.turnos),
      principal: v.principal || false,
    })
  }

  alunos.sort((a, b) => Number(b.principal) - Number(a.principal) || a.nome.localeCompare(b.nome, 'pt-BR'))

  return {
    responsavel: { id: r.id, nome: r.nome_completo, email: r.email },
    termoPendente,
    termoVersao: (termoAtivo as { versao: number } | null)?.versao ?? null,
    alunos,
  }
}

// ─── US1 — Termo de Uso e Política de Privacidade (LGPD) ───

export type TermoVigente = {
  id: string
  versao: number
  conteudo: string
}

export async function getTermoVigente(): Promise<TermoVigente | null> {
  const { data } = await supabase
    .from('portal_termos')
    .select('id, versao, conteudo')
    .eq('ativo', true)
    .maybeSingle()
  return (data as unknown as TermoVigente | null) ?? null
}

export async function aceitarTermo(responsavelId: string): Promise<{ ok: true }> {
  if (!responsavelId) throw new Error('Acesso negado')

  const termo = await getTermoVigente()
  if (!termo) throw new Error('Termo indisponível. Procure a escola.')

  const { data: responsavel } = await supabase
    .from('people')
    .select('id, nome_completo')
    .eq('id', responsavelId)
    .maybeSingle()

  if (!responsavel) throw new Error('Acesso negado')

  // Idempotente: re-aceite da mesma versão não duplica
  await supabase
    .from('portal_aceites')
    .upsert(
      { responsavel_id: responsavelId, termo_id: termo.id },
      { onConflict: 'responsavel_id,termo_id' }
    )

  const nome = (responsavel as unknown as { nome_completo: string }).nome_completo
  await registrarAuditoria({
    school_id: null,
    pessoa_id: responsavelId,
    modulo: 'Portal do Responsável',
    entidade: 'portal_termo',
    entidade_id: termo.id,
    registro_nome: `Aceite do termo v${termo.versao} — ${nome}`,
    acao: 'criar',
    dados_anteriores: null,
    // Sem senha e sem conteúdo do termo no snapshot (LGPD)
    dados_novos: { responsavel_id: responsavelId, termo_id: termo.id, versao: termo.versao },
  })

  return { ok: true }
}

// ─── Helpers compartilhados (mesmo motor do sistema — R4) ───

async function mapaNomesDisciplinas(turmaId: string): Promise<Map<string, string>> {
  const { data: relacoes } = await supabase
    .from('turmas_disciplinas')
    .select('matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
    .eq('turma_id', turmaId)
  const mapa = new Map<string, string>()
  for (const r of (relacoes || []) as unknown as Array<{
    matriz_disciplina_id: string
    academico_matriz_disciplinas: {
      disciplina_id: string
      academico_disciplinas: { nome: string } | null
    } | null
  }>) {
    if (!r.academico_matriz_disciplinas) continue
    if (!mapa.has(r.matriz_disciplina_id)) {
      mapa.set(r.matriz_disciplina_id, r.academico_matriz_disciplinas.academico_disciplinas?.nome || 'Disciplina')
    }
  }
  return mapa
}

async function listarPeriodosPortal(ctx: PortalCtx, qtd: number): Promise<PeriodoBoletim[]> {
  let periodos = await listarPeriodosAvaliativos(ctx.anoLetivoId, ctx.turmaId, qtd)
  if (periodos.length === 0) {
    periodos = Array.from({ length: qtd }, (_, i) => ({
      ordem: i + 1,
      nome: `Período ${i + 1}`,
      data_inicio: null,
      data_termino: null,
    }))
  }
  return periodos
}

export type OcorrenciaResumo = {
  id: string
  titulo: string
  natureza: 'positiva' | 'negativa'
  data: string
  descricao: string
  lido: boolean
}

async function listarOcorrenciasPortal(
  ctx: PortalCtx,
  responsavelId: string,
  alunoId: string,
  natureza: 'todas' | 'positiva' | 'negativa',
  limite: number
): Promise<OcorrenciaResumo[]> {
  // Schema real (produção): vínculo N:N via ocorrencias_alunos;
  // colunas `titulo` / `tipo` (positiva|negativa) / `detalhes` / `apresentar_portal`.
  const { data: vinc } = await supabase
    .from('ocorrencias_alunos')
    .select('ocorrencia_id')
    .eq('aluno_id', alunoId)

  const ids = ((vinc || []) as Array<{ ocorrencia_id: string }>).map(v => v.ocorrencia_id)
  if (!ids.length) return []

  let query = supabase
    .from('ocorrencias')
    .select('id, titulo, tipo, detalhes, data_ocorrencia')
    .eq('school_id', ctx.schoolId)
    .eq('apresentar_portal', true)
    .in('id', ids)
    .order('data_ocorrencia', { ascending: false })
    .limit(limite)
  if (natureza !== 'todas') query = query.eq('tipo', natureza)
  const { data } = await query
  const lista = ((data || []) as unknown as Array<{
    id: string
    titulo: string
    tipo: 'positiva' | 'negativa'
    detalhes: string
    data_ocorrencia: string
  }>)

  const { data: leituras } = lista.length
    ? await supabase
        .from('ocorrencias_leituras')
        .select('ocorrencia_id')
        .eq('responsavel_id', responsavelId)
        .in('ocorrencia_id', lista.map(o => o.id))
    : { data: [] as Array<{ ocorrencia_id: string }> }

  const lidos = new Set(((leituras || []) as Array<{ ocorrencia_id: string }>).map(l => l.ocorrencia_id))

  return lista.map(o => ({
    id: o.id,
    titulo: o.titulo,
    natureza: o.tipo,
    data: o.data_ocorrencia,
    descricao: o.detalhes,
    lido: lidos.has(o.id),
  }))
}

export type ComunicadoResumo = {
  id: string
  titulo: string
  data: string
  descricao: string
  lido: boolean
}

async function listarComunicadosPortal(
  ctx: PortalCtx,
  responsavelId: string,
  alunoId: string,
  limite: number
): Promise<ComunicadoResumo[]> {
  const { data: comunicados } = await supabase
    .from('comunicados')
    .select('id, titulo, descricao, data_comunicado, escopo, visivel_de, visivel_ate')
    .eq('school_id', ctx.schoolId)
    .order('data_comunicado', { ascending: false })
    .limit(100)

  const agora = Date.now()
  const noEscopo = ((comunicados || []) as unknown as Array<{
    id: string
    titulo: string
    descricao: string
    data_comunicado: string
    escopo: { tipo?: string; turma_ids?: string[] } | null
    visivel_de: string | null
    visivel_ate: string | null
  }>).filter(c => {
    // Fora da janela de visualização (NULL = sem limite) não é exibido
    if (c.visivel_de && new Date(c.visivel_de).getTime() > agora) return false
    if (c.visivel_ate && new Date(c.visivel_ate).getTime() < agora) return false
    const esc = c.escopo || { tipo: 'geral' }
    if (esc.tipo === 'turmas') {
      return Array.isArray(esc.turma_ids) && esc.turma_ids.includes(ctx.turmaId)
    }
    return true
  }).slice(0, limite)

  const { data: leituras } = noEscopo.length
    ? await supabase
        .from('comunicados_leituras')
        .select('comunicado_id')
        .eq('responsavel_id', responsavelId)
        .in('comunicado_id', noEscopo.map(c => c.id))
    : { data: [] as Array<{ comunicado_id: string }> }

  const lidos = new Set(((leituras || []) as Array<{ comunicado_id: string }>).map(l => l.comunicado_id))

  return noEscopo.map(c => ({
    id: c.id,
    titulo: c.titulo,
    data: c.data_comunicado,
    descricao: c.descricao,
    lido: lidos.has(c.id),
  }))
}

// ─── US3 — Início ───

type FrequenciaAgregada = {
  frequencia_percentual: number | null
  total_faltas: number | null
  total_aulas: number
  presencas: number
}

/**
 * Totais gerais de frequência. O engine acumula o `geral` só no critério
 * por_dia; no por_aula o geral vem zerado e precisa ser agregado das
 * disciplinas (mesma matemática: FJ conta presença E falta).
 */
function agregarGeralFrequencia(
  freq: { porDisciplina: Map<string, FrequenciaAgregada>; geral: FrequenciaAgregada },
  criterio: 'por_dia' | 'por_aula'
): FrequenciaAgregada {
  if (criterio === 'por_dia') return freq.geral
  let total = 0
  let presencas = 0
  let faltas = 0
  for (const f of freq.porDisciplina.values()) {
    total += f.total_aulas
    presencas += f.presencas
    faltas += f.total_faltas ?? 0
  }
  return {
    frequencia_percentual: total > 0 ? Math.round((presencas / total) * 100) : null,
    total_faltas: total > 0 ? faltas : null,
    total_aulas: total,
    presencas,
  }
}

/** Média do período a partir das notas válidas (mesma fórmula do boletim). */
function mediaDoPeriodo(notas: Array<number | null>): number | null {
  const validas = notas.filter((n): n is number => n !== null)
  if (!validas.length) return null
  return Math.round((validas.reduce((a, b) => a + b, 0) / validas.length) * 100) / 100
}

export type InicioPortal = {
  presencaGeral: number | null
  totalAulas: number
  totalFaltas: number
  mediaGeral: { periodo: string; valor: number | null }
  totalOcorrencias: number
  turmaNumerica: boolean
  mediaMinima: number
  periodos: PeriodoBoletim[]
  comunicadosRecentes: ComunicadoResumo[]
  mediasDisciplina: Array<{ disciplina: string; media: number | null }>
  ocorrenciasRecentes: OcorrenciaResumo[]
}

export async function getInicioPortal(
  responsavelId: string,
  alunoId: string,
  periodoOrdem?: number,
  schoolId?: string
): Promise<InicioPortal> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  const metodo = await resolverMetodoBoletim(ctx.turmaId)
  const periodos = await listarPeriodosPortal(ctx, metodo.qtd)
  const ordem = periodoOrdem ?? periodos[0]?.ordem ?? 1
  const periodo = periodos.find(p => p.ordem === ordem) ?? periodos[0]

  const freq = await calcularFrequenciaBoletim(
    ctx.turmaId, alunoId, metodo.criterio, ctx.dataMatricula, ctx.dataSaida, null, null
  )
  const geral = agregarGeralFrequencia(freq, metodo.criterio)
  const cfgNumerica = await getNumericoConfigCompleta(metodo.metodoId, metodo.qtd)

  let mediaGeral: number | null = null
  let mediasDisciplina: Array<{ disciplina: string; media: number | null }> = []
  if (metodo.temNumerico) {
    const nomes = await mapaNomesDisciplinas(ctx.turmaId)
    const disciplinas = [...nomes.entries()]
      .map(([id, nome]) => ({ id, nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    // Lote com a mesma regra do engine (evita N×calcularDesempenhoAluno + montarEscola)
    const medias = await calcularMediasPeriodoTurma(
      ctx.turmaId, alunoId, disciplinas.map(d => d.id), metodo.qtd, metodo.metodoId
    )
    mediasDisciplina = disciplinas.map(d => {
      const arr = medias.get(d.id) || []
      const nota = ordem >= 1 && ordem <= arr.length ? (arr[ordem - 1] ?? null) : null
      return { disciplina: d.nome, media: nota }
    })
    mediaGeral = mediaDoPeriodo(mediasDisciplina.map(m => m.media))
  }

  const [comunicadosRecentes, ocorrenciasRecentes] = await Promise.all([
    listarComunicadosPortal(ctx, responsavelId, alunoId, 3),
    listarOcorrenciasPortal(ctx, responsavelId, alunoId, 'todas', 3),
  ])

  const { count: totalOcorrencias } = await supabase
    .from('ocorrencias_alunos')
    .select('ocorrencia_id, ocorrencias!inner(school_id, apresentar_portal)', { count: 'exact', head: true })
    .eq('aluno_id', alunoId)
    .eq('ocorrencias.school_id', ctx.schoolId)
    .eq('ocorrencias.apresentar_portal', true)

  return {
    presencaGeral: geral.frequencia_percentual,
    totalAulas: geral.total_aulas,
    totalFaltas: geral.total_faltas ?? 0,
    mediaGeral: { periodo: periodo?.nome ?? `Período ${ordem}`, valor: mediaGeral },
    totalOcorrencias: totalOcorrencias ?? 0,
    turmaNumerica: metodo.temNumerico,
    mediaMinima: Number(cfgNumerica.media_minima ?? 7),
    periodos,
    comunicadosRecentes,
    mediasDisciplina,
    ocorrenciasRecentes,
  }
}

// ─── Médias por período (troca leve de período no Início, sem refetch geral) ───

export type MediasInicio = {
  periodoNome: string
  mediaGeral: number | null
  mediasDisciplina: Array<{ disciplina: string; media: number | null }>
}

export async function getMediasInicio(
  responsavelId: string,
  alunoId: string,
  periodoOrdem: number,
  schoolId?: string
): Promise<MediasInicio> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  const metodo = await resolverMetodoBoletim(ctx.turmaId)
  if (!metodo.temNumerico) {
    return { periodoNome: `Período ${periodoOrdem}`, mediaGeral: null, mediasDisciplina: [] }
  }
  const periodos = await listarPeriodosPortal(ctx, metodo.qtd)
  const periodo = periodos.find(p => p.ordem === periodoOrdem) ?? periodos[0] ?? null
  const ordem = periodo?.ordem ?? periodoOrdem

  const nomes = await mapaNomesDisciplinas(ctx.turmaId)
  const disciplinas = [...nomes.entries()]
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  const medias = await calcularMediasPeriodoTurma(
    ctx.turmaId, alunoId, disciplinas.map(d => d.id), metodo.qtd, metodo.metodoId
  )
  const mediasDisciplina = disciplinas.map(d => {
    const arr = medias.get(d.id) || []
    const nota = ordem >= 1 && ordem <= arr.length ? (arr[ordem - 1] ?? null) : null
    return { disciplina: d.nome, media: nota }
  })
  return {
    periodoNome: periodo?.nome ?? `Período ${ordem}`,
    mediaGeral: mediaDoPeriodo(mediasDisciplina.map(m => m.media)),
    mediasDisciplina,
  }
}

// ─── US4 — Boletim ───

export type BoletimPortal = {
  bloqueado: boolean
  motivo: string | null
  periodos: PeriodoBoletim[]
  periodo: PeriodoBoletim | null
  avaliacoes: string[]
  mediaMinima: number
  metodoNome: string | null
  linhas: Array<{ disciplina: string; notas: Array<number | null>; media: number | null; temRecuperacao: boolean }>
}

export async function getBoletimPortal(
  responsavelId: string,
  alunoId: string,
  periodoOrdem?: number,
  schoolId?: string
): Promise<BoletimPortal> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  const metodo = await resolverMetodoBoletim(ctx.turmaId)

  if (!metodo.metodoId || !metodo.temNumerico) {
    const { montarMotivoBloqueio } = await import('@/lib/metodo-bloqueio')
    return {
      bloqueado: true,
      motivo: montarMotivoBloqueio(metodo),
      periodos: [],
      periodo: null,
      avaliacoes: [],
      mediaMinima: 7,
      metodoNome: metodo.nome,
      linhas: [],
    }
  }

  const periodos = await listarPeriodosPortal(ctx, metodo.qtd)
  const ordem = periodoOrdem ?? periodos[0]?.ordem ?? 1
  const periodoBoletim = periodos.find(p => p.ordem === ordem) ?? periodos[0] ?? null

  const cfg = await getNumericoConfigCompleta(metodo.metodoId, metodo.qtd)
  const nomesDisciplinas = await mapaNomesDisciplinas(ctx.turmaId)
  const disciplinas = [...nomesDisciplinas.entries()]
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  const discIds = disciplinas.map(d => d.id)
  const [notasRows, recRows, consRows] = await Promise.all([
    supabase
      .from('academico_notas')
      .select('disciplina_id, valor, descricao')
      .eq('aluno_id', alunoId)
      .eq('turma_id', ctx.turmaId)
      .eq('periodo', ordem)
      .then(r => (r.data || []) as Array<{ disciplina_id: string; valor: number | string | null; descricao: string | null }>),
    discIds.length
      ? supabase
          .from('academico_recuperacoes')
          .select('disciplina_id, tipo, descricao, valor')
          .eq('aluno_id', alunoId)
          .eq('periodo', ordem)
          .in('disciplina_id', discIds)
          .then(r => (r.data || []) as Array<{ disciplina_id: string; tipo: string; descricao: string | null; valor: number | string | null }>)
      : Promise.resolve([] as Array<{ disciplina_id: string; tipo: string; descricao: string | null; valor: number | string | null }>),
    discIds.length
      ? supabase
          .from('conselho_classe_resultados')
          .select('matriz_disciplina_id, nota_conselho')
          .eq('aluno_id', alunoId)
          .eq('periodo', ordem)
          .in('matriz_disciplina_id', discIds)
          .then(r => (r.data || []) as Array<{ matriz_disciplina_id: string; nota_conselho: number | null }>)
      : Promise.resolve([] as Array<{ matriz_disciplina_id: string; nota_conselho: number | null }>),
  ])

  // Colunas: avaliações do método (limitar) ou descrições lançadas no período
  let avaliacoes: string[] = []
  if (cfg.limitar_avaliacoes && cfg.avaliacoes_list.length > 0) {
    avaliacoes = cfg.avaliacoes_list.map(a => a.nome)
  } else {
    const distintas = new Set<string>()
    for (const n of notasRows) {
      if (n.descricao) distintas.add(n.descricao)
    }
    avaliacoes = [...distintas].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }

  // Recuperação por avaliação (mesma regra do engine: maior nota, ou substitutiva)
  const recMap = new Map<string, number>()
  for (const r of recRows) {
    if (r.tipo !== 'avaliacao' || r.valor === null || !r.descricao) continue
    recMap.set(`${r.disciplina_id}::${r.descricao}`, Number(r.valor))
  }

  const celula = (discId: string, nome: string): number | null => {
    const nota = notasRows.find(n => n.disciplina_id === discId && (n.descricao || '') === nome)
    if (!nota || nota.valor === null) return null
    const rec = recMap.get(`${discId}::${nome}`)
    if (rec === undefined) return Number(nota.valor)
    return cfg.recuperacao_substitutiva ? rec : Math.max(Number(nota.valor), rec)
  }

  const mediasLote = await calcularMediasPeriodoTurma(
    ctx.turmaId, alunoId, disciplinas.map(d => d.id), metodo.qtd, metodo.metodoId
  )

  const linhas = disciplinas.map(d => {
    const medias = mediasLote.get(d.id) || []
    const media = ordem >= 1 && ordem <= medias.length ? (medias[ordem - 1] ?? null) : null
    // Sinaliza média influenciada por recuperação/conselho no período
    const temRecuperacao =
      recRows.some(r => r.disciplina_id === d.id && (r.tipo === 'avaliacao' || r.tipo === 'periodo') && r.valor !== null) ||
      consRows.some(c => c.matriz_disciplina_id === d.id && c.nota_conselho !== null)
    return {
      disciplina: d.nome,
      notas: avaliacoes.map(a => celula(d.id, a)),
      media,
      temRecuperacao,
    }
  })

  return {
    bloqueado: false,
    motivo: null,
    periodos,
    periodo: periodoBoletim,
    avaliacoes,
    mediaMinima: Number(cfg.media_minima ?? 7),
    metodoNome: metodo.nome,
    linhas,
  }
}

// ─── US5 — Frequência ───

export type FrequenciaPortal = {
  criterio: 'por_dia' | 'por_aula'
  frequenciaMinima: number
  periodos: PeriodoBoletim[]
  periodo: PeriodoBoletim | null
  geral: { percentual: number | null; aulas: number; faltas: number }
  limiteFaltas: number
  porDisciplina: Array<{ disciplina: string; aulas: number; faltas: number; percentual: number | null }>
}

export async function getFrequenciaPortal(
  responsavelId: string,
  alunoId: string,
  periodoOrdem?: number,
  schoolId?: string
): Promise<FrequenciaPortal> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  const metodo = await resolverMetodoBoletim(ctx.turmaId)
  const periodos = await listarPeriodosPortal(ctx, metodo.qtd)
  const ordem = periodoOrdem ?? null
  const periodo = ordem ? (periodos.find(p => p.ordem === ordem) ?? null) : null

  let frequenciaMinima = 75
  if (metodo.metodoId) {
    const { data: met } = await supabase
      .from('academico_metodos_avaliacao')
      .select('frecuencia_minima')
      .eq('id', metodo.metodoId)
      .maybeSingle()
    frequenciaMinima = Number((met as { frecuencia_minima?: number | string } | null)?.frecuencia_minima ?? 75)
  }

  const freq = await calcularFrequenciaBoletim(
    ctx.turmaId,
    alunoId,
    metodo.criterio,
    ctx.dataMatricula,
    ctx.dataSaida,
    periodo?.data_inicio ?? null,
    periodo?.data_termino ?? null
  )
  const geral = agregarGeralFrequencia(freq, metodo.criterio)

  const nomes = await mapaNomesDisciplinas(ctx.turmaId)
  const disciplinas = [...nomes.entries()]
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  const porDisciplina = disciplinas.map(d => {
    const f = freq.porDisciplina.get(d.id)
    if (metodo.criterio === 'por_aula') {
      return {
        disciplina: d.nome,
        aulas: f?.total_aulas ?? 0,
        faltas: f?.total_faltas ?? 0,
        percentual: f?.frequencia_percentual ?? null,
      }
    }
    // Critério por dia: sem granularidade por disciplina — repete os totais gerais
    return {
      disciplina: d.nome,
      aulas: geral.total_aulas,
      faltas: geral.total_faltas ?? 0,
      percentual: geral.frequencia_percentual,
    }
  })

  return {
    criterio: metodo.criterio,
    frequenciaMinima,
    periodos,
    periodo,
    geral: {
      percentual: geral.frequencia_percentual,
      aulas: geral.total_aulas,
      faltas: geral.total_faltas ?? 0,
    },
    limiteFaltas: Math.floor(((100 - frequenciaMinima) / 100) * geral.total_aulas),
    porDisciplina,
  }
}

// ─── US6 — Horários, Ocorrências e Comunicados ───

export type HorarioPortal = {
  dia_semana: number
  inicio: string
  fim: string
  disciplina: string
  professor: string | null
  intervalo: boolean
}

export async function getHorariosPortal(
  responsavelId: string,
  alunoId: string,
  schoolId?: string
): Promise<{ turma: string; horarios: HorarioPortal[] }> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)

  const { data: quadro } = await supabase
    .from('quadro_aulas')
    .select('id')
    .eq('turma_id', ctx.turmaId)
    .eq('ativo', true)
    .maybeSingle()

  if (!(quadro as { id: string } | null)) return { turma: ctx.turmaNome, horarios: [] }

  const { data: horarios } = await supabase
    .from('quadro_aulas_horarios')
    .select('dia_semana, horario_inicial, horario_final, disciplina_id, professor_id')
    .eq('quadro_aula_id', (quadro as { id: string }).id)
    .eq('ativo', true)
    .order('dia_semana')
    .order('horario_inicial')

  const rows = (horarios || []) as unknown as Array<{
    dia_semana: number
    horario_inicial: string
    horario_final: string
    disciplina_id: string | null
    professor_id: string | null
  }>

  const nomesDisc = await mapaNomesDisciplinas(ctx.turmaId)
  const profIds = [...new Set(rows.map(r => r.professor_id).filter((id): id is string => !!id))]
  const mapaProfs = new Map<string, string>()
  if (profIds.length) {
    const { data: profs } = await supabase.from('people').select('id, nome_completo').in('id', profIds)
    for (const p of (profs || []) as Array<{ id: string; nome_completo: string }>) {
      mapaProfs.set(p.id, p.nome_completo)
    }
  }

  return {
    turma: ctx.turmaNome,
    horarios: rows.map(r => ({
      dia_semana: r.dia_semana,
      inicio: String(r.horario_inicial).slice(0, 5),
      fim: String(r.horario_final).slice(0, 5),
      disciplina: r.disciplina_id ? nomesDisc.get(r.disciplina_id) || '' : 'Intervalo',
      professor: r.professor_id ? mapaProfs.get(r.professor_id) || null : null,
      intervalo: !r.disciplina_id,
    })),
  }
}

export async function getOcorrenciasPortal(
  responsavelId: string,
  alunoId: string,
  filtro: 'todas' | 'positiva' | 'negativa',
  schoolId?: string
): Promise<OcorrenciaResumo[]> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  return listarOcorrenciasPortal(ctx, responsavelId, alunoId, filtro, 100)
}

export async function marcarOcorrenciaLida(
  responsavelId: string,
  alunoId: string,
  ocorrenciaId: string,
  schoolId?: string
): Promise<{ ok: true }> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)

  const { data: vinc } = await supabase
    .from('ocorrencias_alunos')
    .select('ocorrencia_id, ocorrencias!inner(school_id, apresentar_portal)')
    .eq('ocorrencia_id', ocorrenciaId)
    .eq('aluno_id', alunoId)
    .maybeSingle()

  const v = vinc as unknown as {
    ocorrencia_id: string
    ocorrencias: { school_id: string; apresentar_portal: boolean }
  } | null
  if (!v || v.ocorrencias.school_id !== ctx.schoolId || !v.ocorrencias.apresentar_portal) {
    throw new Error('Acesso negado')
  }

  await supabase
    .from('ocorrencias_leituras')
    .upsert(
      { ocorrencia_id: ocorrenciaId, responsavel_id: responsavelId },
      { onConflict: 'ocorrencia_id,responsavel_id' }
    )

  return { ok: true }
}

export async function getComunicadosPortal(
  responsavelId: string,
  alunoId: string,
  schoolId?: string
): Promise<ComunicadoResumo[]> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)
  return listarComunicadosPortal(ctx, responsavelId, alunoId, 100)
}

export async function marcarComunicadoLido(
  responsavelId: string,
  alunoId: string,
  comunicadoId: string,
  schoolId?: string
): Promise<{ ok: true }> {
  const ctx = await validarVinculoPortal(responsavelId, alunoId, schoolId)

  const { data: comunicado } = await supabase
    .from('comunicados')
    .select('id, escopo, visivel_de, visivel_ate')
    .eq('id', comunicadoId)
    .eq('school_id', ctx.schoolId)
    .maybeSingle()

  const c = comunicado as unknown as {
    id: string
    escopo: { tipo?: string; turma_ids?: string[] } | null
    visivel_de: string | null
    visivel_ate: string | null
  } | null
  if (!c) throw new Error('Acesso negado')

  const agora = Date.now()
  if (c.visivel_de && new Date(c.visivel_de).getTime() > agora) {
    throw new Error('Este comunicado não está mais disponível')
  }
  if (c.visivel_ate && new Date(c.visivel_ate).getTime() < agora) {
    throw new Error('Este comunicado não está mais disponível')
  }

  const esc = c.escopo || { tipo: 'geral' }
  const visivel = esc.tipo !== 'turmas' || (Array.isArray(esc.turma_ids) && esc.turma_ids.includes(ctx.turmaId))
  if (!visivel) throw new Error('Acesso negado')

  await supabase
    .from('comunicados_leituras')
    .upsert(
      { comunicado_id: comunicadoId, responsavel_id: responsavelId },
      { onConflict: 'comunicado_id,responsavel_id' }
    )

  return { ok: true }
}
