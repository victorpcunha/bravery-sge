'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria, registrarAuditoriaAgregada } from '@/lib/auditoria'
import {
  anoDeDataISO,
  calcularVencimento,
  gerarCompetencias,
  mesDeDataISO,
  resolverConfiguracao,
} from '@/lib/faturamento-calculo'
import type {
  Abrangencia,
  ConfigInput,
  FalhaLote,
  ResumoGeracao,
  ResultadoLote,
} from '@/lib/faturamento-tipos'

const supabase = getSupabaseAdmin()

const FAT_RECURSO_COBRANCAS = 'faturamento.cobrancas'
const FAT_RECURSO_CONFIG = 'faturamento.configuracao'

async function exigirPermissao(
  pessoaId: string | null | undefined,
  recurso: string,
  acao: 'visualizar' | 'criar' | 'editar' | 'excluir'
) {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', recurso, acao)
}

async function auditarFaturamento(
  acao: 'criar' | 'editar' | 'excluir',
  entidade: string,
  entidade_id: string,
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  registro_nome?: string | null,
  dados_anteriores?: Record<string, unknown> | null,
  dados_novos?: Record<string, unknown> | null
) {
  await registrarAuditoria({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Faturamento',
    entidade,
    entidade_id,
    registro_nome: registro_nome || null,
    acao,
    dados_anteriores: dados_anteriores || null,
    dados_novos: dados_novos || null,
  })
}

async function auditarFaturamentoMassa(
  pessoaId: string | null | undefined,
  school_id: string | null | undefined,
  entidade: string,
  resumo: Record<string, unknown> & { quantidade?: number }
) {
  await registrarAuditoriaAgregada({
    school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Faturamento',
    entidade,
    resumo,
  })
}

async function nomeMatricula(matriculaId: string): Promise<{ aluno_nome: string | null; school_id: string | null }> {
  const { data } = await supabase
    .from('academico_matriculas')
    .select('school_id, people:aluno_id(nome_completo)')
    .eq('id', matriculaId)
    .maybeSingle()
  const people = (data as unknown as { people?: { nome_completo?: string } | null })?.people
  return {
    aluno_nome: people?.nome_completo || null,
    school_id: (data as { school_id?: string } | null)?.school_id || null,
  }
}

export { exigirPermissao, auditarFaturamento, auditarFaturamentoMassa, nomeMatricula }

// ------- Configuração de Faturamento (US5) -------

export type ConfiguracaoRow = {
  id: string
  school_id: string
  ano_letivo_id: string
  titulo: string | null
  etapa_ids: string[] | null
  valor_mensalidade: number
  dia_vencimento: number
  mes_inicial: number
  mes_final: number
  ativo: boolean
}

export type ConfigFormInput = ConfigInput & { id?: string }

export async function getEtapasEnsino(schoolId: string | null, anoLetivoId?: string | null) {
  let query = supabase
    .from('academico_etapas_ensino')
    .select('id, etapa_codigo, etapa_nome')
    .eq('ativa', true)
    .order('etapa_codigo')
  if (schoolId) query = query.eq('school_id', schoolId)
  if (anoLetivoId) query = query.eq('ano_letivo_id', anoLetivoId)
  const { data, error } = await query
  if (error) throw new Error('Não foi possível carregar as etapas de ensino')
  return (data || []) as { id: string; etapa_codigo: number; etapa_nome: string }[]
}

export async function getConfiguracoes(schoolId: string, anoLetivoId: string) {
  const { data, error } = await supabase
    .from('faturamento_configuracoes')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
    .order('created_at', { ascending: true })
  if (error) throw new Error('Não foi possível carregar as configurações de faturamento')
  return (data || []) as ConfiguracaoRow[]
}

function validarConfigInput(input: ConfigInput) {
  if (!input.ano_letivo_id) throw new Error('Selecione o ano letivo')
  if (!input.titulo || !input.titulo.trim()) throw new Error('Informe um título para identificar a configuração')
  if (input.titulo.trim().length > 120) throw new Error('Título deve ter no máximo 120 caracteres')
  if (!(input.valor_mensalidade > 0)) throw new Error('Informe um valor de mensalidade maior que zero')
  if (!Number.isInteger(input.dia_vencimento) || input.dia_vencimento < 1 || input.dia_vencimento > 31) {
    throw new Error('Dia de vencimento deve estar entre 1 e 31')
  }
  if (!Number.isInteger(input.mes_inicial) || input.mes_inicial < 1 || input.mes_inicial > 12) {
    throw new Error('Mês inicial inválido')
  }
  if (!Number.isInteger(input.mes_final) || input.mes_final < 1 || input.mes_final > 12) {
    throw new Error('Mês final inválido')
  }
  if (input.mes_final < input.mes_inicial) throw new Error('Mês final deve ser maior ou igual ao mês inicial')
}

export async function salvarConfiguracao(
  schoolId: string,
  input: ConfigFormInput,
  pessoaId?: string | null
) {
  await exigirPermissao(pessoaId, FAT_RECURSO_CONFIG, input.id ? 'editar' : 'criar')
  validarConfigInput(input)

  const payload = {
    school_id: schoolId,
    ano_letivo_id: input.ano_letivo_id,
    titulo: input.titulo.trim(),
    etapa_ids: input.etapa_ids && input.etapa_ids.length > 0 ? input.etapa_ids : null,
    valor_mensalidade: input.valor_mensalidade,
    dia_vencimento: input.dia_vencimento,
    mes_inicial: input.mes_inicial,
    mes_final: input.mes_final,
  }

  if (input.id) {
    const { data: anterior } = await supabase
      .from('faturamento_configuracoes')
      .select('*')
      .eq('id', input.id)
      .eq('school_id', schoolId)
      .maybeSingle()
    if (!anterior) throw new Error('Configuração não encontrada')
    const { data, error } = await supabase
      .from('faturamento_configuracoes')
      .update(payload)
      .eq('id', input.id)
      .select()
      .single()
    if (error) throw new Error('Não foi possível salvar a configuração')
    await auditarFaturamento('editar', 'faturamento_configuracoes', data.id, pessoaId, schoolId, data.titulo || `Configuração ${data.mes_inicial}–${data.mes_final}`, anterior, data)
    return data as ConfiguracaoRow
  }

  const { data, error } = await supabase
    .from('faturamento_configuracoes')
    .insert(payload)
    .select()
    .single()
  if (error) throw new Error('Não foi possível salvar a configuração')
  await auditarFaturamento('criar', 'faturamento_configuracoes', data.id, pessoaId, schoolId, data.titulo || `Configuração ${data.mes_inicial}–${data.mes_final}`, null, data)
  return data as ConfiguracaoRow
}

export async function excluirConfiguracao(id: string, schoolId: string, pessoaId?: string | null) {
  await exigirPermissao(pessoaId, FAT_RECURSO_CONFIG, 'excluir')
  const { data: anterior } = await supabase
    .from('faturamento_configuracoes')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()
  if (!anterior) throw new Error('Configuração não encontrada')
  const { error } = await supabase
    .from('faturamento_configuracoes')
    .delete()
    .eq('id', id)
  if (error) throw new Error('Não foi possível excluir a configuração')
  await auditarFaturamento('excluir', 'faturamento_configuracoes', id, pessoaId, schoolId, 'Configuração excluída', anterior, null)
}

// ------- Geração em massa (US1) -------

type MatriculaElegivel = {
  id: string
  aluno_id: string
  turma_id: string
  etapa_ensino_id: string
  data_matricula: string
  aluno_nome: string
}

async function carregarMatriculasElegiveis(
  schoolId: string,
  abrangencia: Abrangencia
): Promise<MatriculaElegivel[]> {
  let query = supabase
    .from('academico_matriculas')
    .select('id, aluno_id, turma_id, etapa_ensino_id, data_matricula, aluno:aluno_id(nome_completo)')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', abrangencia.anoLetivoId)
    .eq('ativo', true)
    .eq('situacao', 'Ativo')

  if (abrangencia.turmaId) query = query.eq('turma_id', abrangencia.turmaId)
  if (abrangencia.etapaId) query = query.eq('etapa_ensino_id', abrangencia.etapaId)
  if (abrangencia.matriculaIds && abrangencia.matriculaIds.length > 0) {
    query = query.in('id', abrangencia.matriculaIds)
  }

  const { data, error } = await query
  if (error) throw new Error('Não foi possível carregar as matrículas elegíveis')
  return ((data || []) as any[]).map(m => ({
    id: m.id,
    aluno_id: m.aluno_id,
    turma_id: m.turma_id,
    etapa_ensino_id: m.etapa_ensino_id,
    data_matricula: (m.data_matricula || '').slice(0, 10),
    aluno_nome: m.aluno?.nome_completo || 'Aluno',
  }))
}

async function carregarResponsaveisPrincipais(alunoIds: string[]): Promise<Record<string, string>> {
  const mapa: Record<string, string> = {}
  if (alunoIds.length === 0) return mapa
  const { data } = await supabase
    .from('responsavel_alunos')
    .select('aluno_id, responsavel_id, principal')
    .in('aluno_id', alunoIds)
  for (const v of (data || []) as any[]) {
    if (!mapa[v.aluno_id] || v.principal) mapa[v.aluno_id] = v.responsavel_id
  }
  return mapa
}

type PlanoSimulado = {
  matricula: MatriculaElegivel
  configId: string | null
  valor: number
  dia: number
  mesInicial: number
  mesFinal: number
  responsavelId: string | null
}

async function resolverPlanos(
  schoolId: string,
  abrangencia: Abrangencia,
  overrides?: Partial<ConfigInput>
): Promise<{
  simulados: PlanoSimulado[]
  jaConfiguradas: number
  inconsistentes: ResumoGeracao['inconsistentes']
  naoAfetadas: number
}> {
  const matriculas = await carregarMatriculasElegiveis(schoolId, abrangencia)
  const configs = await getConfiguracoes(schoolId, abrangencia.anoLetivoId)

  const { data: planosExistentes } = await supabase
    .from('faturamento_planos')
    .select('matricula_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', abrangencia.anoLetivoId)
    .in('matricula_id', matriculas.map(m => m.id))
  const comPlano = new Set(((planosExistentes || []) as any[]).map(p => p.matricula_id))

  const responsaveis = await carregarResponsaveisPrincipais(matriculas.map(m => m.aluno_id))

  const simulados: PlanoSimulado[] = []
  const inconsistentes: ResumoGeracao['inconsistentes'] = []
  let jaConfiguradas = 0
  let naoAfetadas = 0

  for (const m of matriculas) {
    if (comPlano.has(m.id)) { jaConfiguradas++; continue }

    let configId: string | null = null
    let valor: number
    let dia: number
    let mesIni: number
    let mesFim: number

    if (overrides && overrides.valor_mensalidade) {
      valor = overrides.valor_mensalidade
      dia = overrides.dia_vencimento || 10
      mesIni = overrides.mes_inicial || 1
      mesFim = overrides.mes_final || 12
    } else {
      const resolvida = resolverConfiguracao(m.etapa_ensino_id, configs)
      if (resolvida.ambigua) {
        inconsistentes.push({
          matriculaId: m.id, alunoNome: m.aluno_nome,
          motivo: 'Mais de uma configuração cobre a etapa desta matrícula',
          proximoPasso: 'Ajuste as configurações para eliminar a sobreposição e gere novamente',
        })
        continue
      }
      if (!resolvida.configId) {
        inconsistentes.push({
          matriculaId: m.id, alunoNome: m.aluno_nome,
          motivo: 'Nenhuma configuração cobre a etapa desta matrícula',
          proximoPasso: 'Cadastre uma configuração para a etapa ou um padrão geral',
        })
        continue
      }
      const cfg = configs.find(c => c.id === resolvida.configId)!
      configId = cfg.id
      valor = Number(cfg.valor_mensalidade)
      dia = cfg.dia_vencimento
      mesIni = cfg.mes_inicial
      mesFim = cfg.mes_final
    }

    const mesEntrada = mesDeDataISO(m.data_matricula)
    if (!mesEntrada || mesEntrada < 1 || mesEntrada > 12) {
      inconsistentes.push({
        matriculaId: m.id, alunoNome: m.aluno_nome,
        motivo: 'Data de matrícula inválida',
        proximoPasso: 'Corrija a data da matrícula e gere novamente',
      })
      continue
    }
    const mesInicial = Math.max(mesIni, mesEntrada)
    if (mesInicial > mesFim) {
      naoAfetadas++
      continue
    }

    simulados.push({
      matricula: m, configId, valor, dia,
      mesInicial, mesFinal: mesFim,
      responsavelId: responsaveis[m.aluno_id] || null,
    })
  }

  return { simulados, jaConfiguradas, inconsistentes, naoAfetadas }
}

export async function simularGeracao(
  schoolId: string,
  abrangencia: Abrangencia,
  overrides?: Partial<ConfigInput>
): Promise<ResumoGeracao> {
  const { simulados, jaConfiguradas, inconsistentes, naoAfetadas } =
    await resolverPlanos(schoolId, abrangencia, overrides)

  let mensalidadesEstimadas = 0
  let valorTotalPrevisto = 0
  let semResponsavel = 0
  for (const s of simulados) {
    const qtd = s.mesFinal - s.mesInicial + 1
    mensalidadesEstimadas += qtd
    valorTotalPrevisto += qtd * s.valor
    if (!s.responsavelId) semResponsavel++
  }

  return {
    totalMatriculas: simulados.length + jaConfiguradas + inconsistentes.length + naoAfetadas,
    seguirãoPadrao: simulados.length,
    jaConfiguradas,
    inconsistentes,
    naoAfetadas,
    semResponsavel,
    mensalidadesEstimadas,
    valorTotalPrevisto: simulados.length > 0 ? Math.round(valorTotalPrevisto * 100) / 100 : null,
  }
}

export async function gerarPlanosEmMassa(
  schoolId: string,
  abrangencia: Abrangencia,
  opts: { substituir?: boolean; configId?: string },
  pessoaId?: string | null
): Promise<ResultadoLote> {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'criar')

  const overrides = opts.configId
    ? await carregarOverridesDeConfig(schoolId, opts.configId)
    : undefined
  const { simulados, jaConfiguradas } = await resolverPlanos(schoolId, abrangencia, overrides)

  const criados: string[] = []
  const falhas: FalhaLote[] = []
  const aCriar: Record<string, unknown>[] = []
  const mensalidadesBatch: Record<string, unknown>[] = []
  let preservados = jaConfiguradas

  const { data: ano } = await supabase
    .from('academico_anos_letivos')
    .select('data_inicio')
    .eq('id', abrangencia.anoLetivoId)
    .maybeSingle()
  const anoRef = ano?.data_inicio ? anoDeDataISO(String(ano.data_inicio).slice(0, 10)) : new Date().getFullYear()

  for (const s of simulados) {
    const { data: existente } = await supabase
      .from('faturamento_planos')
      .select('id')
      .eq('matricula_id', s.matricula.id)
      .maybeSingle()

    if (existente) {
      if (!opts.substituir) { preservados++; continue }
      const { data: pagas } = await supabase
        .from('faturamento_mensalidades')
        .select('id')
        .eq('plano_id', existente.id)
        .eq('situacao', 'pago')
        .limit(1)
      if (pagas && pagas.length > 0) {
        falhas.push({
          id: s.matricula.id, nome: s.matricula.aluno_nome,
          motivo: 'Plano possui mensalidades pagas e não pode ser substituído',
          proximoPasso: 'Ajuste o plano individualmente',
        })
        continue
      }
      await supabase.from('faturamento_planos').delete().eq('id', existente.id)
    }

    const qtd = s.mesFinal - s.mesInicial + 1
    const planoId = crypto.randomUUID()
    aCriar.push({
      id: planoId,
      school_id: schoolId,
      matricula_id: s.matricula.id,
      ano_letivo_id: abrangencia.anoLetivoId,
      responsavel_id: s.responsavelId,
      valor_mensalidade: s.valor,
      dia_vencimento: s.dia,
      mes_inicial: s.mesInicial,
      mes_final: s.mesFinal,
      qtd_mensalidades: qtd,
      config_origem_id: s.configId,
      situacao: 'ativo',
    })
    for (const [idx, comp] of gerarCompetencias(anoRef, s.mesInicial, s.mesFinal).entries()) {
      const [a, m] = comp.split('-').map(Number)
      mensalidadesBatch.push({
        plano_id: planoId,
        competencia: comp,
        numero_parcela: idx + 1,
        valor: s.valor,
        vencimento: calcularVencimento(a, m, s.dia),
        situacao: 'pendente',
      })
    }
    criados.push(planoId)
  }

  // Inserts em lote (planos e mensalidades) — 1 registro de auditoria agregado ao final
  for (let i = 0; i < aCriar.length; i += 200) {
    const { error } = await supabase.from('faturamento_planos').insert(aCriar.slice(i, i + 200))
    if (error) throw new Error('Não foi possível gerar os planos — nenhuma alteração foi aplicada')
  }
  for (let i = 0; i < mensalidadesBatch.length; i += 500) {
    const { error } = await supabase.from('faturamento_mensalidades').insert(mensalidadesBatch.slice(i, i + 500))
    if (error) {
      await supabase.from('faturamento_planos').delete().in('id', criados)
      throw new Error('Não foi possível gerar as mensalidades — nenhuma alteração foi aplicada')
    }
  }

  await auditarFaturamentoMassa(pessoaId, schoolId, 'faturamento_planos', {
    quantidade: criados.length,
    preservados,
    falhas: falhas.length,
    operacao: opts.substituir ? 'geracao_massa_substituicao' : 'geracao_massa',
  })

  return { criados, falhas, preservados }
}

async function carregarOverridesDeConfig(
  schoolId: string,
  configId: string
): Promise<Partial<ConfigInput>> {
  const { data } = await supabase
    .from('faturamento_configuracoes')
    .select('*')
    .eq('id', configId)
    .eq('school_id', schoolId)
    .maybeSingle()
  if (!data) throw new Error('Configuração não encontrada')
  return {
    valor_mensalidade: Number(data.valor_mensalidade),
    dia_vencimento: data.dia_vencimento,
    mes_inicial: data.mes_inicial,
    mes_final: data.mes_final,
  }
}

// ------- Visão Geral (US2) -------

export type FiltrosVisao = {
  anoLetivoId: string
  turmaId?: string
  de?: string
  ate?: string
}

export async function getVisaoGeral(
  schoolId: string | null,
  filtros: FiltrosVisao
) {
  if (!schoolId) throw new Error('Selecione uma unidade escolar')
  if (!filtros.anoLetivoId) throw new Error('Selecione o ano letivo')

  let planosQuery = supabase
    .from('faturamento_planos')
    .select('id, matricula_id, responsavel_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', filtros.anoLetivoId)

  if (filtros.turmaId) {
    const { data: mats } = await supabase
      .from('academico_matriculas')
      .select('id')
      .eq('turma_id', filtros.turmaId)
    const idsTurma = ((mats || []) as any[]).map(m => m.id)
    // Turma sem matrículas: nenhum plano pode corresponder
    if (idsTurma.length === 0) {
      const configsVazias = await getConfiguracoes(schoolId, filtros.anoLetivoId)
      return {
        previsto: 0, recebido: 0, emAberto: 0, vencido: 0,
        pendencias: configsVazias.length === 0
          ? [{ tipo: 'config_incompleta', quantidade: 1, acao: 'Criar configuração padrão', href: '/faturamento/configuracao' }]
          : [],
      }
    }
    planosQuery = planosQuery.in('matricula_id', idsTurma)
  }

  const { data: planos, error: erroPlanos } = await planosQuery
  if (erroPlanos) throw new Error('Não foi possível carregar a visão geral')
  const listaPlanos = (planos || []) as any[]
  const planoIds = listaPlanos.map(p => p.id)

  let previsto = 0
  let recebido = 0
  let emAberto = 0
  let vencido = 0
  let qtdVencidas = 0
  const hoje = new Date()
  const hojeDia = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

  if (planoIds.length > 0) {
    let mensQuery = supabase
      .from('faturamento_mensalidades')
      .select('valor, vencimento, situacao, competencia')
      .in('plano_id', planoIds)
    if (filtros.de) mensQuery = mensQuery.gte('competencia', filtros.de)
    if (filtros.ate) mensQuery = mensQuery.lte('competencia', filtros.ate)
    const { data: mensalidades, error: erroMens } = await mensQuery
    if (erroMens) throw new Error('Não foi possível carregar as mensalidades')
    for (const m of (mensalidades || []) as any[]) {
      if (m.situacao === 'cancelado' || m.situacao === 'isento') continue
      const valor = Number(m.valor)
      if (m.situacao === 'pago') { recebido += valor; previsto += valor; continue }
      previsto += valor
      if (String(m.vencimento).slice(0, 10) < hojeDia) { vencido += valor; qtdVencidas++ }
      else { emAberto += valor }
    }
  }

  // Pendências
  const pendencias: { tipo: string; quantidade: number; acao: string; href: string }[] = []

  const elegiveis = await carregarMatriculasElegiveis(schoolId, {
    anoLetivoId: filtros.anoLetivoId,
    turmaId: filtros.turmaId,
  })
  if (elegiveis.length > 0) {
    const { data: comPlano } = await supabase
      .from('faturamento_planos')
      .select('matricula_id')
      .eq('school_id', schoolId)
      .eq('ano_letivo_id', filtros.anoLetivoId)
      .in('matricula_id', elegiveis.map(e => e.id))
    const semPlano = elegiveis.length - ((comPlano || []) as any[]).length
    if (semPlano > 0) {
      pendencias.push({
        tipo: 'sem_plano',
        quantidade: semPlano,
        acao: 'Configurar em massa',
        href: '/faturamento/cobrancas',
      })
    }
  }

  if (qtdVencidas > 0) {
    pendencias.push({
      tipo: 'vencidas',
      quantidade: qtdVencidas,
      acao: 'Ver vencidas',
      href: '/faturamento/cobrancas',
    })
  }

  const semResp = listaPlanos.filter(p => !p.responsavel_id).length
  if (semResp > 0) {
    pendencias.push({
      tipo: 'sem_responsavel',
      quantidade: semResp,
      acao: 'Vincular responsável',
      href: '/faturamento/cobrancas',
    })
  }

  const configs = await getConfiguracoes(schoolId, filtros.anoLetivoId)
  if (configs.length === 0) {
    pendencias.push({
      tipo: 'config_incompleta',
      quantidade: 1,
      acao: 'Criar configuração padrão',
      href: '/faturamento/configuracao',
    })
  }

  const arredondar = (v: number) => Math.round(v * 100) / 100
  return {
    previsto: arredondar(previsto),
    recebido: arredondar(recebido),
    emAberto: arredondar(emAberto),
    vencido: arredondar(vencido),
    pendencias,
  }
}

// ------- Cobranças e baixa (US3) -------

export type FiltrosCobrancas = {
  anoLetivoId: string
  turmaId?: string
  busca?: string
  responsavelId?: string
  situacao: 'todas' | 'pagas' | 'em_aberto' | 'vencidas' | 'canceladas' | 'isentas'
  competenciaDe?: string
  competenciaAte?: string
  page: number
}

export type CobrancaItem = {
  id: string
  plano_id: string
  matricula_id: string
  competencia: string
  numero_parcela: number
  valor: number
  vencimento: string
  situacao: 'pendente' | 'pago' | 'cancelado' | 'isento'
  derivada: 'pendente' | 'pago' | 'cancelado' | 'isento' | 'vencida'
  pago_em: string | null
  forma_baixa: string | null
  aluno_nome: string
  turma_nome: string
  responsavel_nome: string | null
}

const PAGE_SIZE = 10

const SITUACAO_FILTRO_MAP: Record<string, string> = {
  pagas: 'pago',
  canceladas: 'cancelado',
  isentas: 'isento',
}

export async function listarCobrancas(
  schoolId: string | null,
  filtros: FiltrosCobrancas
): Promise<{ total: number; itens: CobrancaItem[] }> {
  if (!schoolId) throw new Error('Selecione uma unidade escolar')

  let planosQuery = supabase
    .from('faturamento_planos')
    .select('id, matricula_id, responsavel_id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', filtros.anoLetivoId)

  if (filtros.turmaId) {
    const { data: mats } = await supabase
      .from('academico_matriculas')
      .select('id')
      .eq('turma_id', filtros.turmaId)
    const idsTurma = ((mats || []) as any[]).map(m => m.id)
    // Turma sem matrículas: nenhum plano pode corresponder
    if (idsTurma.length === 0) return { total: 0, itens: [] }
    planosQuery = planosQuery.in('matricula_id', idsTurma)
  }
  if (filtros.responsavelId) planosQuery = planosQuery.eq('responsavel_id', filtros.responsavelId)

  const { data: planos, error: erroPlanos } = await planosQuery
  if (erroPlanos) throw new Error('Não foi possível carregar as cobranças (planos)')
  const listaPlanos = (planos || []) as any[]
  if (listaPlanos.length === 0) return { total: 0, itens: [] }

  let mensQuery = supabase
    .from('faturamento_mensalidades')
    .select('id, plano_id, competencia, numero_parcela, valor, vencimento, situacao, pago_em, forma_baixa')
    .in('plano_id', listaPlanos.map(p => p.id))
    .order('vencimento', { ascending: true })
  if (filtros.competenciaDe) mensQuery = mensQuery.gte('competencia', filtros.competenciaDe)
  if (filtros.competenciaAte) mensQuery = mensQuery.lte('competencia', filtros.competenciaAte)

  const { data: mensalidades, error: erroMens } = await mensQuery
  if (erroMens) throw new Error('Não foi possível carregar as cobranças')

  const planoDe = new Map(listaPlanos.map(p => [p.id, p]))
  const matriculaIds = [...new Set(listaPlanos.map(p => p.matricula_id))]
  const { data: mats } = await supabase
    .from('academico_matriculas')
    .select('id, turma:turma_id(nome), aluno:aluno_id(nome_completo)')
    .in('id', matriculaIds)
  const matDe = new Map(((mats || []) as any[]).map(m => [m.id, m]))

  const respIds = [...new Set(listaPlanos.map(p => p.responsavel_id).filter(Boolean))]
  let respDe = new Map<string, string>()
  if (respIds.length > 0) {
    const { data: resps } = await supabase.from('people').select('id, nome_completo').in('id', respIds)
    respDe = new Map(((resps || []) as any[]).map(r => [r.id, r.nome_completo]))
  }

  const hoje = new Date()
  const hojeDia = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  const busca = (filtros.busca || '').toLowerCase().trim()

  const todos: CobrancaItem[] = []
  for (const m of (mensalidades || []) as any[]) {
    const plano = planoDe.get(m.plano_id)
    const mat = matDe.get(plano.matricula_id) as any
    const alunoNome = mat?.aluno?.nome_completo || 'Aluno'
    const turmaNome = mat?.turma?.nome || '—'
    const respNome = plano.responsavel_id ? respDe.get(plano.responsavel_id) || null : null
    const derivada = m.situacao === 'pendente' && String(m.vencimento).slice(0, 10) < hojeDia ? 'vencida' : m.situacao

    if (filtros.situacao !== 'todas') {
      if (filtros.situacao === 'em_aberto' && !(derivada === 'pendente' || derivada === 'vencida')) continue
      else if (filtros.situacao === 'vencidas' && derivada !== 'vencida') continue
      else if (filtros.situacao !== 'em_aberto' && filtros.situacao !== 'vencidas') {
        const alvo = SITUACAO_FILTRO_MAP[filtros.situacao] || filtros.situacao
        if (derivada !== alvo) continue
      }
    }
    if (busca && !`${alunoNome} ${respNome || ''}`.toLowerCase().includes(busca)) continue

    todos.push({
      id: m.id,
      plano_id: m.plano_id,
      matricula_id: plano.matricula_id,
      competencia: String(m.competencia).slice(0, 10),
      numero_parcela: m.numero_parcela,
      valor: Number(m.valor),
      vencimento: String(m.vencimento).slice(0, 10),
      situacao: m.situacao,
      derivada,
      pago_em: m.pago_em ? String(m.pago_em).slice(0, 10) : null,
      forma_baixa: m.forma_baixa,
      aluno_nome: alunoNome,
      turma_nome: turmaNome,
      responsavel_nome: respNome,
    })
  }

  const total = todos.length
  const inicio = (Math.max(1, filtros.page) - 1) * PAGE_SIZE
  return { total, itens: todos.slice(inicio, inicio + PAGE_SIZE) }
}

export async function baixarMensalidades(
  ids: string[],
  baixa: { pagoEm: string; forma: string; observacao?: string },
  pessoaId?: string | null
) {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'editar')
  if (!ids || ids.length === 0) throw new Error('Selecione ao menos uma mensalidade')
  if (!baixa.pagoEm) throw new Error('Informe a data do pagamento')
  if (!baixa.forma.trim()) throw new Error('Informe a forma de pagamento')

  const { data: mensalidades } = await supabase
    .from('faturamento_mensalidades')
    .select('id, situacao, plano_id')
    .in('id', ids)

  const pendentes = ((mensalidades || []) as any[]).filter(m => m.situacao === 'pendente')
  const ignoradas = ((mensalidades || []) as any[])
    .filter(m => m.situacao !== 'pendente')
    .map(m => ({ id: m.id, motivo: `Mensalidade já está "${m.situacao}"` }))

  let baixadas = 0
  let schoolId: string | null = null
  for (const m of pendentes) {
    const { error } = await supabase
      .from('faturamento_mensalidades')
      .update({
        situacao: 'pago',
        pago_em: baixa.pagoEm,
        forma_baixa: baixa.forma.trim(),
        observacao: baixa.observacao?.trim() || null,
        baixa_por: pessoaId || null,
      })
      .eq('id', m.id)
      .eq('situacao', 'pendente')
    if (!error) baixadas++
  }

  if (pendentes.length > 0) {
    const { data: plano } = await supabase
      .from('faturamento_planos')
      .select('school_id')
      .eq('id', pendentes[0].plano_id)
      .maybeSingle()
    schoolId = plano?.school_id || null
  }

  await auditarFaturamentoMassa(pessoaId, schoolId, 'faturamento_mensalidades', {
    quantidade: baixadas,
    ignoradas: ignoradas.length,
    operacao: 'baixa_manual',
    forma: baixa.forma.trim(),
  })

  return { baixadas, ignoradas }
}

export async function isentarMensalidades(ids: string[], motivo: string, pessoaId?: string | null) {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'editar')
  if (!ids || ids.length === 0) throw new Error('Selecione ao menos uma mensalidade')
  if (!motivo.trim()) throw new Error('Informe o motivo da isenção')
  return alterarSituacaoMensalidades(ids, 'isento', motivo.trim(), pessoaId, 'isencao')
}

export async function cancelarMensalidades(ids: string[], motivo: string, pessoaId?: string | null) {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'editar')
  if (!ids || ids.length === 0) throw new Error('Selecione ao menos uma mensalidade')
  if (!motivo.trim()) throw new Error('Informe o motivo do cancelamento')
  return alterarSituacaoMensalidades(ids, 'cancelado', motivo.trim(), pessoaId, 'cancelamento')
}

async function alterarSituacaoMensalidades(
  ids: string[],
  situacao: 'isento' | 'cancelado',
  motivo: string,
  pessoaId: string | null | undefined,
  operacao: string
) {
  const { data: mensalidades } = await supabase
    .from('faturamento_mensalidades')
    .select('id, situacao, plano_id')
    .in('id', ids)

  const pendentes = ((mensalidades || []) as any[]).filter(m => m.situacao === 'pendente')
  let alteradas = 0
  let schoolId: string | null = null
  for (const m of pendentes) {
    const { error } = await supabase
      .from('faturamento_mensalidades')
      .update({ situacao, observacao: motivo, baixa_por: pessoaId || null })
      .eq('id', m.id)
      .eq('situacao', 'pendente')
    if (!error) alteradas++
  }

  if (pendentes.length > 0) {
    const { data: plano } = await supabase
      .from('faturamento_planos')
      .select('school_id')
      .eq('id', pendentes[0].plano_id)
      .maybeSingle()
    schoolId = plano?.school_id || null
  }

  await auditarFaturamentoMassa(pessoaId, schoolId, 'faturamento_mensalidades', {
    quantidade: alteradas,
    operacao,
    motivo,
  })

  return { alteradas }
}

// ------- Plano individual e saída (US4) -------

export type PlanoDetalhado = {
  id: string
  school_id: string
  matricula_id: string
  ano_letivo_id: string
  responsavel_id: string | null
  responsavel_nome: string | null
  aluno_nome: string
  turma_nome: string
  valor_mensalidade: number
  dia_vencimento: number
  mes_inicial: number
  mes_final: number
  qtd_mensalidades: number
  config_origem_id: string | null
  situacao: string
  mensalidades: {
    id: string
    competencia: string
    numero_parcela: number
    valor: number
    vencimento: string
    situacao: 'pendente' | 'pago' | 'cancelado' | 'isento'
    pago_em: string | null
    forma_baixa: string | null
  }[]
}

export async function getPlanoPorMatricula(matriculaId: string): Promise<PlanoDetalhado | null> {
  const { data: plano } = await supabase
    .from('faturamento_planos')
    .select('*')
    .eq('matricula_id', matriculaId)
    .maybeSingle()
  if (!plano) return null

  const [{ data: mensalidades }, mat] = await Promise.all([
    supabase
      .from('faturamento_mensalidades')
      .select('id, competencia, numero_parcela, valor, vencimento, situacao, pago_em, forma_baixa')
      .eq('plano_id', plano.id)
      .order('competencia', { ascending: true }),
    nomeMatricula(matriculaId),
  ])

  let responsavelNome: string | null = null
  if (plano.responsavel_id) {
    const { data: resp } = await supabase
      .from('people')
      .select('nome_completo')
      .eq('id', plano.responsavel_id)
      .maybeSingle()
    responsavelNome = resp?.nome_completo || null
  }

  const { data: matFull } = await supabase
    .from('academico_matriculas')
    .select('turma:turma_id(nome), ano:ano_letivo_id(data_inicio)')
    .eq('id', matriculaId)
    .maybeSingle()

  return {
    id: plano.id,
    school_id: plano.school_id,
    matricula_id: plano.matricula_id,
    ano_letivo_id: plano.ano_letivo_id,
    responsavel_id: plano.responsavel_id,
    responsavel_nome: responsavelNome,
    aluno_nome: mat.aluno_nome || 'Aluno',
    turma_nome: (matFull as any)?.turma?.nome || '—',
    valor_mensalidade: Number(plano.valor_mensalidade),
    dia_vencimento: plano.dia_vencimento,
    mes_inicial: plano.mes_inicial,
    mes_final: plano.mes_final,
    qtd_mensalidades: plano.qtd_mensalidades,
    config_origem_id: plano.config_origem_id,
    situacao: plano.situacao,
    mensalidades: ((mensalidades || []) as any[]).map(m => ({
      ...m,
      valor: Number(m.valor),
      competencia: String(m.competencia).slice(0, 10),
      vencimento: String(m.vencimento).slice(0, 10),
      pago_em: m.pago_em ? String(m.pago_em).slice(0, 10) : null,
    })),
  }
}

export type PlanoIndividualInput = {
  matricula_id: string
  valor_mensalidade: number
  dia_vencimento: number
  mes_inicial: number
  mes_final: number
  responsavel_id?: string | null
  config_origem_id?: string | null
}

function validarPlanoInput(input: Omit<PlanoIndividualInput, 'matricula_id'>) {
  if (!(input.valor_mensalidade >= 0)) throw new Error('Informe um valor válido')
  if (!Number.isInteger(input.dia_vencimento) || input.dia_vencimento < 1 || input.dia_vencimento > 31) {
    throw new Error('Dia de vencimento deve estar entre 1 e 31')
  }
  if (input.mes_final < input.mes_inicial) throw new Error('Mês final deve ser maior ou igual ao mês inicial')
}

function hojeCorte(): string {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

async function anoRefDaMatricula(matriculaId: string): Promise<number> {
  const { data } = await supabase
    .from('academico_matriculas')
    .select('ano:ano_letivo_id(data_inicio)')
    .eq('id', matriculaId)
    .maybeSingle()
  const inicio = (data as any)?.ano?.data_inicio
  return inicio ? anoDeDataISO(String(inicio).slice(0, 10)) : new Date().getFullYear()
}

export async function criarPlanoIndividual(
  schoolId: string,
  input: PlanoIndividualInput,
  pessoaId?: string | null
) {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'criar')
  validarPlanoInput(input)

  const { data: mat } = await supabase
    .from('academico_matriculas')
    .select('id, school_id, ano_letivo_id, aluno_id')
    .eq('id', input.matricula_id)
    .eq('school_id', schoolId)
    .maybeSingle()
  if (!mat) throw new Error('Matrícula não encontrada')

  const { data: existente } = await supabase
    .from('faturamento_planos')
    .select('id')
    .eq('matricula_id', input.matricula_id)
    .maybeSingle()
  if (existente) throw new Error('Esta matrícula já possui plano — edite o plano existente')

  const anoRef = await anoRefDaMatricula(input.matricula_id)
  const qtd = input.mes_final - input.mes_inicial + 1
  const { data: plano, error: erroPlano } = await supabase
    .from('faturamento_planos')
    .insert({
      school_id: schoolId,
      matricula_id: input.matricula_id,
      ano_letivo_id: mat.ano_letivo_id,
      responsavel_id: input.responsavel_id || null,
      valor_mensalidade: input.valor_mensalidade,
      dia_vencimento: input.dia_vencimento,
      mes_inicial: input.mes_inicial,
      mes_final: input.mes_final,
      qtd_mensalidades: qtd,
      config_origem_id: input.config_origem_id || null,
      situacao: 'ativo',
    })
    .select()
    .single()
  if (erroPlano || !plano) throw new Error('Não foi possível criar o plano')

  const mensalidades = gerarCompetencias(anoRef, input.mes_inicial, input.mes_final).map((comp, idx) => {
    const [a, m] = comp.split('-').map(Number)
    return {
      plano_id: plano.id,
      competencia: comp,
      numero_parcela: idx + 1,
      valor: input.valor_mensalidade,
      vencimento: calcularVencimento(a, m, input.dia_vencimento),
      situacao: 'pendente',
    }
  })
  const { error: erroMens } = await supabase.from('faturamento_mensalidades').insert(mensalidades)
  if (erroMens) {
    await supabase.from('faturamento_planos').delete().eq('id', plano.id)
    throw new Error('Não foi possível gerar as mensalidades')
  }

  const mat2 = await nomeMatricula(input.matricula_id)
  await auditarFaturamento('criar', 'faturamento_planos', plano.id, pessoaId, schoolId, mat2.aluno_nome, null, {
    matricula_id: input.matricula_id, valor: input.valor_mensalidade,
  })
  return getPlanoPorMatricula(input.matricula_id)
}

export async function atualizarPlano(
  planoId: string,
  patch: Partial<Omit<PlanoIndividualInput, 'matricula_id' | 'config_origem_id'>>,
  pessoaId?: string | null
) {
  await exigirPermissao(pessoaId, FAT_RECURSO_COBRANCAS, 'editar')

  const { data: anterior } = await supabase
    .from('faturamento_planos')
    .select('*')
    .eq('id', planoId)
    .maybeSingle()
  if (!anterior) throw new Error('Plano não encontrado')

  const novo = {
    valor_mensalidade: patch.valor_mensalidade ?? Number(anterior.valor_mensalidade),
    dia_vencimento: patch.dia_vencimento ?? anterior.dia_vencimento,
    mes_inicial: patch.mes_inicial ?? anterior.mes_inicial,
    mes_final: patch.mes_final ?? anterior.mes_final,
    responsavel_id: patch.responsavel_id !== undefined ? patch.responsavel_id : anterior.responsavel_id,
  }
  validarPlanoInput(novo)

  const mudouFinanceiro =
    novo.valor_mensalidade !== Number(anterior.valor_mensalidade) ||
    novo.dia_vencimento !== anterior.dia_vencimento ||
    novo.mes_inicial !== anterior.mes_inicial ||
    novo.mes_final !== anterior.mes_final

  const { error: erroUpdate } = await supabase
    .from('faturamento_planos')
    .update({
      ...novo,
      qtd_mensalidades: novo.mes_final - novo.mes_inicial + 1,
      config_origem_id: mudouFinanceiro ? null : anterior.config_origem_id,
    })
    .eq('id', planoId)
  if (erroUpdate) throw new Error('Não foi possível atualizar o plano')

  if (mudouFinanceiro) {
    // Regenera apenas mensalidades ainda pendentes; pagas/isentas/canceladas são preservadas
    await supabase
      .from('faturamento_mensalidades')
      .delete()
      .eq('plano_id', planoId)
      .eq('situacao', 'pendente')
    const anoRef = await anoRefDaMatricula(anterior.matricula_id)
    const { data: mantidas } = await supabase
      .from('faturamento_mensalidades')
      .select('competencia')
      .eq('plano_id', planoId)
    const mantidasSet = new Set(((mantidas || []) as any[]).map(m => String(m.competencia).slice(0, 10)))
    const novas = gerarCompetencias(anoRef, novo.mes_inicial, novo.mes_final)
      .filter(c => !mantidasSet.has(c))
      .map((comp, idx) => {
        const [a, m] = comp.split('-').map(Number)
        return {
          plano_id: planoId,
          competencia: comp,
          numero_parcela: idx + 1,
          valor: novo.valor_mensalidade,
          vencimento: calcularVencimento(a, m, novo.dia_vencimento),
          situacao: 'pendente',
        }
      })
    if (novas.length > 0) {
      const { error: erroNovas } = await supabase.from('faturamento_mensalidades').insert(novas)
      if (erroNovas) throw new Error('Plano atualizado, mas houve falha ao regenerar mensalidades')
    }
    // Renumera todas as parcelas do plano pela ordem de competência
    const { data: todas } = await supabase
      .from('faturamento_mensalidades')
      .select('id, competencia')
      .eq('plano_id', planoId)
      .order('competencia', { ascending: true })
    let n = 1
    for (const t of (todas || []) as any[]) {
      await supabase.from('faturamento_mensalidades').update({ numero_parcela: n++ }).eq('id', t.id)
    }
  }

  const { data: atualizado } = await supabase
    .from('faturamento_planos')
    .select('*')
    .eq('id', planoId)
    .single()
  const mat = await nomeMatricula(anterior.matricula_id)
  await auditarFaturamento('editar', 'faturamento_planos', planoId, pessoaId, anterior.school_id, mat.aluno_nome, anterior, atualizado)
  return getPlanoPorMatricula(anterior.matricula_id)
}

export async function tratarSaidaMatricula(
  matriculaId: string,
  cancelarFuturas: boolean,
  pessoaId?: string | null
): Promise<{ canceladas: number }> {
  if (!cancelarFuturas)   return { canceladas: 0 }

  const { data: plano } = await supabase
    .from('faturamento_planos')
    .select('id, school_id')
    .eq('matricula_id', matriculaId)
    .maybeSingle()
  if (!plano) return { canceladas: 0 }

  const { data: mat } = await supabase
    .from('academico_matriculas')
    .select('data_saida')
    .eq('id', matriculaId)
    .maybeSingle()
  const corte = mat?.data_saida ? String(mat.data_saida).slice(0, 10) : hojeCorte()

  let query = supabase
    .from('faturamento_mensalidades')
    .select('id')
    .eq('plano_id', plano.id)
    .eq('situacao', 'pendente')
  if (corte) query = query.gt('vencimento', corte)
  const { data: futuras } = await query

  let canceladas = 0
  for (const f of (futuras || []) as any[]) {
    const { error } = await supabase
      .from('faturamento_mensalidades')
      .update({ situacao: 'cancelado', baixa_por: pessoaId || null })
      .eq('id', f.id)
      .eq('situacao', 'pendente')
    if (!error) canceladas++
  }

  if (canceladas > 0) {
    await supabase.from('faturamento_planos').update({ situacao: 'encerrado' }).eq('id', plano.id)
    const info = await nomeMatricula(matriculaId)
    await auditarFaturamentoMassa(pessoaId, plano.school_id, 'faturamento_mensalidades', {
      quantidade: canceladas,
      operacao: 'cancelamento_saida',
      matricula_id: matriculaId,
      aluno: info.aluno_nome,
    })
  }

  return { canceladas }
}

export async function getResponsaveisDaMatricula(matriculaId: string) {
  const { data: mat } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('id', matriculaId)
    .maybeSingle()
  if (!mat) return []
  const { data } = await supabase
    .from('responsavel_alunos')
    .select('responsavel_id, principal, responsavel:responsavel_id(id, nome_completo)')
    .eq('aluno_id', mat.aluno_id)
  return ((data || []) as any[]).map(v => ({
    id: v.responsavel?.id || v.responsavel_id,
    nome_completo: v.responsavel?.nome_completo || 'Responsável',
    principal: !!v.principal,
  }))
}
