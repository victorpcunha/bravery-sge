'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

const RECURSO = 'gestao-academica.ocorrencias'
const MODULO = 'Gestão Acadêmica — Ocorrências'

export type TipoOcorrencia = 'positiva' | 'negativa'

export type Envolvido = {
  id: string
  nome: string
}

export type OcorrenciaLista = {
  id: string
  titulo: string
  tipo: TipoOcorrencia
  dataOcorrencia: string
  apresentarPortal: boolean
  descricaoResumida: string
  profissionais: Envolvido[]
  alunos: Envolvido[]
}

export type OcorrenciaDetalhe = {
  id: string
  titulo: string
  tipo: TipoOcorrencia
  dataOcorrencia: string
  detalhes: string
  apresentarPortal: boolean
  profissionalIds: string[]
  alunoIds: string[]
}

export type OcorrenciaFiltros = {
  dataInicial?: string
  dataFinal?: string
  profissionalIds?: string[]
  alunoIds?: string[]
  tipo?: TipoOcorrencia
}

export type OcorrenciaInput = {
  titulo: string
  tipo: TipoOcorrencia
  dataOcorrencia: string
  detalhes: string
  apresentarPortal: boolean
  profissionalIds: string[]
  alunoIds: string[]
}

type OcorrenciaLinha = {
  id: string
  school_id: string
  titulo: string
  tipo: string
  data_ocorrencia: string
  detalhes: string
  apresentar_portal: boolean | null
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

function resumir(texto: string, limite = 100): string {
  return texto.length > limite ? `${texto.slice(0, limite)}…` : texto
}

function validarTipo(tipo: unknown): TipoOcorrencia {
  if (tipo !== 'positiva' && tipo !== 'negativa') {
    throw new Error('Selecione o tipo da ocorrência (Positiva ou Negativa)')
  }
  return tipo
}

async function validarAlunos(schoolId: string, alunoIds: string[]) {
  if (alunoIds.length === 0) throw new Error('Selecione ao menos um aluno envolvido')
  const { data: pessoas, error } = await supabase
    .from('people')
    .select('id, school_id')
    .in('id', alunoIds)

  if (error) throw error
  const linhas = (pessoas ?? []) as Array<{ id: string; school_id: string | null }>
  if (linhas.length !== alunoIds.length) {
    throw new Error('Um ou mais alunos selecionados não foram encontrados')
  }
  if (linhas.some(p => p.school_id !== schoolId)) {
    throw new Error('Um ou mais alunos selecionados não pertencem a esta escola')
  }
}

async function validarProfissionais(schoolId: string, profissionalIds: string[]) {
  if (profissionalIds.length === 0) throw new Error('Selecione ao menos um profissional da ocorrência')
  const selecionaveis = await listarProfissionaisSelecionaveis(schoolId, null, true)
  const idsValidos = new Set(selecionaveis.map(p => p.id))
  if (profissionalIds.some(id => !idsValidos.has(id))) {
    throw new Error('Um ou mais profissionais selecionados não possuem vínculo ativo nesta escola')
  }
}

export async function listarProfissionaisSelecionaveis(
  schoolId: string,
  pessoaId?: string | null,
  skipPermissao = false
): Promise<Envolvido[]> {
  if (!skipPermissao) {
    const { validarPermissaoEstrita } = await import('./perfis')
    await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')
  }

  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .select('pessoa:person_id(id, nome_completo, ativo, perfil)')
    .eq('school_id', schoolId)
    .eq('situacao', '1')

  if (error) throw error

  const mapa = new Map<string, string>()
  for (const v of (data ?? []) as Array<{
    pessoa: { id: string; nome_completo: string; ativo: boolean; perfil: string[] | null } | Array<{ id: string; nome_completo: string; ativo: boolean; perfil: string[] | null }> | null
  }>) {
    const rel = v.pessoa
    const pessoa = Array.isArray(rel) ? rel[0] : rel
    if (!pessoa || !pessoa.ativo) continue
    const perfil = pessoa.perfil || []
    if (!perfil.includes('profissional') && !perfil.includes('gestor')) continue
    if (!mapa.has(pessoa.id)) mapa.set(pessoa.id, pessoa.nome_completo)
  }

  return [...mapa.entries()]
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

/**
 * Resolve nomes de pessoas por ids com escopo da escola (usado para
 * exibir chips de envolvidos já gravados, inclusive profissionais
 * desativados depois do registro — nome histórico preservado).
 */
export async function resolverNomesPessoas(
  schoolId: string,
  ids: string[],
  pessoaId?: string | null
): Promise<Envolvido[]> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('people')
    .select('id, nome_completo, school_id')
    .in('id', ids)

  if (error) throw error
  return ((data ?? []) as Array<{ id: string; nome_completo: string; school_id: string | null }>)
    .filter(p => p.school_id === schoolId)
    .map(p => ({ id: p.id, nome: p.nome_completo }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

async function buscarIdsJunction(
  tabela: 'ocorrencias_alunos' | 'ocorrencias_profissionais',
  coluna: 'aluno_id' | 'profissional_id',
  ids: string[]
): Promise<string[] | null> {
  if (ids.length === 0) return null
  const { data, error } = await supabase
    .from(tabela)
    .select(`ocorrencia_id, ${coluna}`)
    .in(coluna, ids)

  if (error) throw error
  return [...new Set(((data ?? []) as Array<{ ocorrencia_id: string }>).map(r => r.ocorrencia_id))]
}

async function resolverNomes(
  ocorrenciaIds: string[]
): Promise<{ profissionaisPorOcorrencia: Map<string, Envolvido[]>; alunosPorOcorrencia: Map<string, Envolvido[]> }> {
  const profissionaisPorOcorrencia = new Map<string, Envolvido[]>()
  const alunosPorOcorrencia = new Map<string, Envolvido[]>()
  if (ocorrenciaIds.length === 0) return { profissionaisPorOcorrencia, alunosPorOcorrencia }

  const [{ data: vincProf }, { data: vincAlunos }] = await Promise.all([
    supabase.from('ocorrencias_profissionais').select('ocorrencia_id, profissional_id').in('ocorrencia_id', ocorrenciaIds),
    supabase.from('ocorrencias_alunos').select('ocorrencia_id, aluno_id').in('ocorrencia_id', ocorrenciaIds),
  ])

  const profIds = [...new Set(((vincProf ?? []) as Array<{ profissional_id: string }>).map(v => v.profissional_id))]
  const alunoIds = [...new Set(((vincAlunos ?? []) as Array<{ aluno_id: string }>).map(v => v.aluno_id))]

  const [{ data: profs }, { data: alunos }] = await Promise.all([
    profIds.length
      ? supabase.from('people').select('id, nome_completo').in('id', profIds)
      : Promise.resolve({ data: [] as unknown[] }),
    alunoIds.length
      ? supabase.from('people').select('id, nome_completo').in('id', alunoIds)
      : Promise.resolve({ data: [] as unknown[] }),
  ])

  const nomeProf = new Map<string, string>()
  for (const p of (profs ?? []) as Array<{ id: string; nome_completo: string }>) nomeProf.set(p.id, p.nome_completo)
  const nomeAluno = new Map<string, string>()
  for (const p of (alunos ?? []) as Array<{ id: string; nome_completo: string }>) nomeAluno.set(p.id, p.nome_completo)

  for (const v of (vincProf ?? []) as Array<{ ocorrencia_id: string; profissional_id: string }>) {
    const nome = nomeProf.get(v.profissional_id)
    if (!nome) continue
    const lista = profissionaisPorOcorrencia.get(v.ocorrencia_id) ?? []
    lista.push({ id: v.profissional_id, nome })
    profissionaisPorOcorrencia.set(v.ocorrencia_id, lista)
  }
  for (const v of (vincAlunos ?? []) as Array<{ ocorrencia_id: string; aluno_id: string }>) {
    const nome = nomeAluno.get(v.aluno_id)
    if (!nome) continue
    const lista = alunosPorOcorrencia.get(v.ocorrencia_id) ?? []
    lista.push({ id: v.aluno_id, nome })
    alunosPorOcorrencia.set(v.ocorrencia_id, lista)
  }

  return { profissionaisPorOcorrencia, alunosPorOcorrencia }
}

export async function listarOcorrencias(
  schoolId: string,
  filtros: OcorrenciaFiltros,
  pessoaId?: string | null
): Promise<OcorrenciaLista[]> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')

  if (filtros.dataInicial && filtros.dataFinal && filtros.dataInicial > filtros.dataFinal) {
    throw new Error('A data inicial deve ser anterior ou igual à data final')
  }

  const [idsPorProf, idsPorAluno] = await Promise.all([
    buscarIdsJunction('ocorrencias_profissionais', 'profissional_id', filtros.profissionalIds ?? []),
    buscarIdsJunction('ocorrencias_alunos', 'aluno_id', filtros.alunoIds ?? []),
  ])

  let idsFiltro: string[] | null = null
  if (idsPorProf !== null || idsPorAluno !== null) {
    const conjuntos = [idsPorProf, idsPorAluno].filter((l): l is string[] => l !== null)
    // Filtros de envolvidos combinam por OR: basta vínculo com um deles
    idsFiltro = [...new Set(conjuntos.flat())]
    if (idsFiltro.length === 0) return []
  }

  let query = supabase
    .from('ocorrencias')
    .select('id, school_id, titulo, tipo, data_ocorrencia, detalhes, apresentar_portal')
    .eq('school_id', schoolId)
    .order('data_ocorrencia', { ascending: false })

  if (filtros.tipo) query = query.eq('tipo', filtros.tipo)
  if (filtros.dataInicial) query = query.gte('data_ocorrencia', filtros.dataInicial)
  if (filtros.dataFinal) query = query.lte('data_ocorrencia', filtros.dataFinal)
  if (idsFiltro !== null) query = query.in('id', idsFiltro)

  const { data, error } = await query
  if (error) throw error
  const linhas = (data ?? []) as OcorrenciaLinha[]

  const { profissionaisPorOcorrencia, alunosPorOcorrencia } = await resolverNomes(linhas.map(l => l.id))

  return linhas.map(l => ({
    id: l.id,
    titulo: l.titulo,
    tipo: l.tipo as TipoOcorrencia,
    dataOcorrencia: l.data_ocorrencia,
    apresentarPortal: l.apresentar_portal ?? false,
    descricaoResumida: resumir(l.detalhes),
    profissionais: (profissionaisPorOcorrencia.get(l.id) ?? []).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    alunos: (alunosPorOcorrencia.get(l.id) ?? []).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
  }))
}

export async function getOcorrencia(
  id: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<OcorrenciaDetalhe | null> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'visualizar')

  const { data, error } = await supabase
    .from('ocorrencias')
    .select('id, school_id, titulo, tipo, data_ocorrencia, detalhes, apresentar_portal')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const l = data as OcorrenciaLinha

  const [{ data: vincProf }, { data: vincAlunos }] = await Promise.all([
    supabase.from('ocorrencias_profissionais').select('profissional_id').eq('ocorrencia_id', id),
    supabase.from('ocorrencias_alunos').select('aluno_id').eq('ocorrencia_id', id),
  ])

  return {
    id: l.id,
    titulo: l.titulo,
    tipo: l.tipo as TipoOcorrencia,
    dataOcorrencia: l.data_ocorrencia,
    detalhes: l.detalhes,
    apresentarPortal: l.apresentar_portal ?? false,
    profissionalIds: ((vincProf ?? []) as Array<{ profissional_id: string }>).map(v => v.profissional_id),
    alunoIds: ((vincAlunos ?? []) as Array<{ aluno_id: string }>).map(v => v.aluno_id),
  }
}

function validarInput(input: OcorrenciaInput) {
  const titulo = limparTexto(input.titulo, 150)
  const detalhes = limparTexto(input.detalhes, 500)
  const tipo = validarTipo(input.tipo)
  if (titulo.length < 3) throw new Error('Informe o título da ocorrência (mínimo 3 caracteres)')
  if (!dataISO(input.dataOcorrencia)) throw new Error('Informe uma data válida para a ocorrência')
  if (!detalhes) throw new Error('Informe a descrição da ocorrência')
  if (input.detalhes.trim().length > 500) throw new Error('A descrição está limitada a 500 caracteres')
  return { titulo, detalhes, tipo, dataOcorrencia: dataISO(input.dataOcorrencia) as string }
}

export async function criarOcorrencia(
  schoolId: string,
  input: OcorrenciaInput,
  pessoaId?: string | null
): Promise<{ id: string }> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'criar')

  const { titulo, detalhes, tipo, dataOcorrencia } = validarInput(input)
  await validarAlunos(schoolId, input.alunoIds)
  await validarProfissionais(schoolId, input.profissionalIds)

  const payload = {
    school_id: schoolId,
    titulo,
    tipo,
    data_ocorrencia: dataOcorrencia,
    detalhes,
    apresentar_portal: input.apresentarPortal,
  }

  const { data, error } = await supabase
    .from('ocorrencias')
    .insert(payload)
    .select('id')
    .single()

  if (error) throw error
  const id = (data as { id: string }).id

  const { error: errAlunos } = await supabase
    .from('ocorrencias_alunos')
    .insert(input.alunoIds.map(aluno_id => ({ ocorrencia_id: id, aluno_id })))
  if (errAlunos) {
    await supabase.from('ocorrencias').delete().eq('id', id)
    throw errAlunos
  }

  const { error: errProf } = await supabase
    .from('ocorrencias_profissionais')
    .insert(input.profissionalIds.map(profissional_id => ({ ocorrencia_id: id, profissional_id })))
  if (errProf) {
    await supabase.from('ocorrencias').delete().eq('id', id)
    throw errProf
  }

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'ocorrencias',
    entidade_id: id,
    registro_nome: titulo,
    acao: 'criar',
    dados_novos: { ...payload, alunoIds: input.alunoIds, profissionalIds: input.profissionalIds },
  })

  return { id }
}

export async function atualizarOcorrencia(
  id: string,
  schoolId: string,
  input: OcorrenciaInput,
  pessoaId?: string | null
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'editar')

  const { data: anterior, error: errAnterior } = await supabase
    .from('ocorrencias')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (errAnterior) throw errAnterior
  if (!anterior) throw new Error('Ocorrência não encontrada')

  const { titulo, detalhes, tipo, dataOcorrencia } = validarInput(input)
  await validarAlunos(schoolId, input.alunoIds)
  await validarProfissionais(schoolId, input.profissionalIds)

  const payload = {
    titulo,
    tipo,
    data_ocorrencia: dataOcorrencia,
    detalhes,
    apresentar_portal: input.apresentarPortal,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('ocorrencias')
    .update(payload)
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) throw error

  await supabase.from('ocorrencias_alunos').delete().eq('ocorrencia_id', id)
  await supabase.from('ocorrencias_profissionais').delete().eq('ocorrencia_id', id)

  const { error: errAlunos } = await supabase
    .from('ocorrencias_alunos')
    .insert(input.alunoIds.map(aluno_id => ({ ocorrencia_id: id, aluno_id })))
  if (errAlunos) throw errAlunos

  const { error: errProf } = await supabase
    .from('ocorrencias_profissionais')
    .insert(input.profissionalIds.map(profissional_id => ({ ocorrencia_id: id, profissional_id })))
  if (errProf) throw errProf

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'ocorrencias',
    entidade_id: id,
    registro_nome: titulo,
    acao: 'editar',
    dados_anteriores: anterior,
    dados_novos: { ...payload, alunoIds: input.alunoIds, profissionalIds: input.profissionalIds },
  })
}

export async function excluirOcorrencia(
  id: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO, 'excluir')

  const { data: anterior, error: errAnterior } = await supabase
    .from('ocorrencias')
    .select('*')
    .eq('id', id)
    .eq('school_id', schoolId)
    .maybeSingle()

  if (errAnterior) throw errAnterior
  if (!anterior) throw new Error('Ocorrência não encontrada')

  const { error } = await supabase
    .from('ocorrencias')
    .delete()
    .eq('id', id)
    .eq('school_id', schoolId)

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: MODULO,
    entidade: 'ocorrencias',
    entidade_id: id,
    registro_nome: (anterior as OcorrenciaLinha).titulo,
    acao: 'excluir',
    dados_anteriores: anterior,
  })
}
