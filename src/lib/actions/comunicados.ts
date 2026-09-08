'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

const RECURSO = 'portal.comunicados'
const MODULO = 'Portal — Comunicados'

export type ComunicadoEscopo = {
  tipo: 'geral' | 'turmas'
  etapa_ids?: string[]
  turma_ids?: string[]
}

export type Comunicado = {
  id: string
  school_id: string
  ano_letivo_id: string | null
  titulo: string
  descricao: string
  data_comunicado: string
  visivel_de: string | null
  visivel_ate: string | null
  escopo: ComunicadoEscopo
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ComunicadoLista = {
  id: string
  titulo: string
  descricaoResumida: string
  dataEnvio: string
  dataFinal: string | null
  etapaNomes: string[]
  turmaNomes: string[]
  estado: 'agendado' | 'vigente' | 'expirado'
}

export type ComunicadoDetalhe = {
  id: string
  anoLetivoId: string | null
  etapaIds: string[]
  turmaIds: string[]
  titulo: string
  descricao: string
  visivelDe: string | null
  visivelAte: string | null
}

export type ComunicadoFiltros = {
  anoLetivoId: string
  dataEnvio?: string
  dataFinal?: string
  etapaId?: string
  turmaId?: string
}

export type ComunicadoInput = {
  anoLetivoId: string
  etapaIds?: string[]
  turmaIds: string[]
  titulo: string
  descricao: string
  visivelDe: string
  visivelAte: string
}

function limparTexto(valor: unknown, maxLength?: number): string {
  if (typeof valor !== 'string') return ''
  const t = valor.trim()
  return maxLength ? t.slice(0, maxLength) : t
}

function dataISO(valor: string | null | undefined): string | null {
  if (!valor) return null
  const d = new Date(valor)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function estadoVisibilidade(visivelDe: string | null, visivelAte: string | null): ComunicadoLista['estado'] {
  const agora = Date.now()
  if (visivelDe && new Date(visivelDe).getTime() > agora) return 'agendado'
  if (visivelAte && new Date(visivelAte).getTime() < agora) return 'expirado'
  return 'vigente'
}

async function validarAnoAtivo(schoolId: string, anoLetivoId: string) {
  const { data: ano, error } = await supabase
    .from('academico_anos_letivos')
    .select('id')
    .eq('id', anoLetivoId)
    .eq('school_id', schoolId)
    .eq('status', 'ativo')
    .maybeSingle()

  if (error) throw error
  if (!ano) throw new Error('Ano letivo inválido — selecione o ano letivo ativo')
}

async function validarTurmas(schoolId: string, anoLetivoId: string, turmaIds: string[]) {
  if (turmaIds.length === 0) throw new Error('Selecione ao menos uma turma')
  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('id')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .in('id', turmaIds)

  if (error) throw error
  if ((turmas ?? []).length !== turmaIds.length) {
    throw new Error('Uma ou mais turmas selecionadas não pertencem a este ano letivo')
  }
}

/**
 * Deriva o snapshot de etapas a partir das turmas selecionadas
 * (etapa principal + extras de turmas_multietapa). Substitui a
 * seleção manual de etapas na UI (removida — só turmas bastam).
 */
async function derivarEtapas(turmaIds: string[]): Promise<string[]> {
  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('id, etapa_ensino_id')
    .in('id', turmaIds)

  if (error) throw error

  const { data: multi } = await supabase
    .from('turmas_multietapa')
    .select('turma_id, etapa_ensino_id')
    .in('turma_id', turmaIds)

  const etapas = new Set<string>()
  for (const t of (turmas ?? []) as Array<{ id: string; etapa_ensino_id: string }>) {
    if (t.etapa_ensino_id) etapas.add(t.etapa_ensino_id)
  }
  for (const m of (multi ?? []) as Array<{ turma_id: string; etapa_ensino_id: string }>) {
    if (m.etapa_ensino_id) etapas.add(m.etapa_ensino_id)
  }
  return [...etapas]
}

function validarPeriodo(visivelDe: string, visivelAte: string) {
  const de = new Date(visivelDe)
  const ate = new Date(visivelAte)
  if (isNaN(de.getTime()) || isNaN(ate.getTime())) {
    throw new Error('Informe um período de visualização válido')
  }
  if (de.getTime() >= ate.getTime()) {
    throw new Error('O fim da visualização deve ser posterior ao início')
  }
}

export async function listarComunicados(
  schoolId: string,
  filtros: ComunicadoFiltros,
  pessoaId?: string | null
): Promise<ComunicadoLista[]> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')

  let query = supabase
    .from('comunicados')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', filtros.anoLetivoId)
    .order('data_comunicado', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  const linhas = (data ?? []) as Comunicado[]

  const turmaIdsTodas = [...new Set(linhas.flatMap(l => l.escopo?.turma_ids ?? []))]
  const { data: turmas } = turmaIdsTodas.length
    ? await supabase
        .from('turmas')
        .select('id, nome, etapa_ensino_id, academico_etapas_ensino(etapa_nome)')
        .in('id', turmaIdsTodas)
    : { data: [] as unknown[] }

  const turmaPorId = new Map<string, { nome: string; etapaNome: string | null }>()
  for (const t of (turmas ?? []) as Array<{
    id: string
    nome: string
    academico_etapas_ensino: { etapa_nome: string } | null
  }>) {
    turmaPorId.set(t.id, { nome: t.nome, etapaNome: t.academico_etapas_ensino?.etapa_nome ?? null })
  }

  const { data: etapas } = await supabase
    .from('academico_etapas_ensino')
    .select('id, etapa_nome')
    .eq('school_id', schoolId)
  const etapaPorId = new Map<string, string>()
  for (const e of (etapas ?? []) as Array<{ id: string; etapa_nome: string }>) {
    etapaPorId.set(e.id, e.etapa_nome)
  }

  const filtroDe = filtros.dataEnvio ? new Date(`${filtros.dataEnvio}T00:00:00`) : null
  const filtroAte = filtros.dataFinal ? new Date(`${filtros.dataFinal}T23:59:59`) : null

  return linhas
    .filter(l => {
      const esc = l.escopo ?? { tipo: 'geral' }
      if (filtros.turmaId) {
        if (esc.tipo !== 'turmas' || !esc.turma_ids?.includes(filtros.turmaId)) return false
      }
      if (filtros.etapaId) {
        const ids = esc.etapa_ids ?? []
        if (!ids.includes(filtros.etapaId)) return false
      }
      if (filtroDe || filtroAte) {
        const inicio = l.visivel_de ? new Date(l.visivel_de) : new Date(`${l.data_comunicado}T00:00:00`)
        const fim = l.visivel_ate ? new Date(l.visivel_ate) : null
        if (filtroDe && fim && fim < filtroDe) return false
        if (filtroAte && inicio > filtroAte) return false
      }
      return true
    })
    .map(l => {
      const esc = l.escopo ?? { tipo: 'geral' }
      const ids = esc.turma_ids ?? []
      const turmaNomes = ids.map(id => turmaPorId.get(id)?.nome).filter((n): n is string => !!n)
      const etapaNomes = [...new Set([
        ...(esc.etapa_ids ?? []).map(id => etapaPorId.get(id)).filter((n): n is string => !!n),
        ...ids.map(id => turmaPorId.get(id)?.etapaNome).filter((n): n is string => !!n),
      ])]
      const dataEnvio = dataISO(l.visivel_de) ?? l.data_comunicado
      return {
        id: l.id,
        titulo: l.titulo,
        descricaoResumida: l.descricao.length > 100 ? `${l.descricao.slice(0, 100)}…` : l.descricao,
        dataEnvio,
        dataFinal: dataISO(l.visivel_ate),
        etapaNomes,
        turmaNomes,
        estado: estadoVisibilidade(l.visivel_de, l.visivel_ate),
      }
    })
}

export async function getComunicado(
  id: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<ComunicadoDetalhe | null> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')

  const { data, error } = await supabase
    .from('comunicados')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const l = data as Comunicado
  const esc = l.escopo ?? { tipo: 'geral' }
  return {
    id: l.id,
    anoLetivoId: l.ano_letivo_id,
    etapaIds: esc.etapa_ids ?? [],
    turmaIds: esc.turma_ids ?? [],
    titulo: l.titulo,
    descricao: l.descricao,
    visivelDe: l.visivel_de,
    visivelAte: l.visivel_ate,
  }
}

export async function criarComunicado(
  schoolId: string,
  input: ComunicadoInput,
  pessoaId?: string | null
): Promise<{ id: string }> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'criar')

  const titulo = limparTexto(input.titulo, 200)
  const descricao = limparTexto(input.descricao)
  if (!titulo) throw new Error('Informe o título do comunicado')
  if (!descricao) throw new Error('Informe a descrição do comunicado')
  validarPeriodo(input.visivelDe, input.visivelAte)
  await validarAnoAtivo(schoolId, input.anoLetivoId)
  await validarTurmas(schoolId, input.anoLetivoId, input.turmaIds)
  const etapaIds = input.etapaIds?.length ? input.etapaIds : await derivarEtapas(input.turmaIds)

  const payload = {
    school_id: schoolId,
    ano_letivo_id: input.anoLetivoId,
    titulo,
    descricao,
    data_comunicado: dataISO(input.visivelDe),
    visivel_de: new Date(input.visivelDe).toISOString(),
    visivel_ate: new Date(input.visivelAte).toISOString(),
    escopo: { tipo: 'turmas', etapa_ids: etapaIds, turma_ids: input.turmaIds },
    created_by: pessoaId || null,
  }

  const { data, error } = await supabase
    .from('comunicados')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'comunicados',
    entidade_id: (data as { id: string }).id,
    registro_nome: titulo,
    acao: 'criar',
    dados_novos: payload,
  })

  return { id: (data as { id: string }).id }
}

export async function atualizarComunicado(
  id: string,
  schoolId: string,
  input: ComunicadoInput,
  pessoaId?: string | null
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'editar')

  const { data: anterior, error: errAnterior } = await supabase
    .from('comunicados')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (errAnterior) throw errAnterior
  if (!anterior) throw new Error('Comunicado não encontrado')

  const titulo = limparTexto(input.titulo, 200)
  const descricao = limparTexto(input.descricao)
  if (!titulo) throw new Error('Informe o título do comunicado')
  if (!descricao) throw new Error('Informe a descrição do comunicado')
  validarPeriodo(input.visivelDe, input.visivelAte)
  await validarAnoAtivo(schoolId, input.anoLetivoId)
  await validarTurmas(schoolId, input.anoLetivoId, input.turmaIds)
  const etapaIds = input.etapaIds?.length ? input.etapaIds : await derivarEtapas(input.turmaIds)

  const payload = {
    ano_letivo_id: input.anoLetivoId,
    titulo,
    descricao,
    data_comunicado: dataISO(input.visivelDe),
    visivel_de: new Date(input.visivelDe).toISOString(),
    visivel_ate: new Date(input.visivelAte).toISOString(),
    escopo: { tipo: 'turmas', etapa_ids: etapaIds, turma_ids: input.turmaIds },
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('comunicados')
    .update(payload)
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'comunicados',
    entidade_id: id,
    registro_nome: titulo,
    acao: 'editar',
    dados_anteriores: anterior,
    dados_novos: payload,
  })
}

export async function excluirComunicado(
  id: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'excluir')

  const { data: anterior, error: errAnterior } = await supabase
    .from('comunicados')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (errAnterior) throw errAnterior
  if (!anterior) throw new Error('Comunicado não encontrado')

  const { error } = await supabase
    .from('comunicados')
    .delete()
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'comunicados',
    entidade_id: id,
    registro_nome: (anterior as Comunicado).titulo,
    acao: 'excluir',
    dados_anteriores: anterior,
  })
}
