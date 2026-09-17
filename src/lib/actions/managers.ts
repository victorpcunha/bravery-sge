'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

export type Manager = {
  id: string
  person_id: string | null
  cargo: string | null
  criterio_acesso: string | null
  situacao_funcional: string | null
}

export type ManagerComPessoa = Manager & {
  nome_completo: string | null
  cpf: string | null
  inep_id: string | null
}

const CARGOS = ['1', '2']
const CRITERIOS = ['1', '2', '3', '4', '5', '6', '7']
const SITUACOES = ['1', '2', '3', '4']
const MAX_GESTORES = 3

function limparCodigo(valor: unknown, permitidos: string[]): string | null {
  if (typeof valor !== 'string') return null
  const t = valor.trim()
  if (!t) return null
  if (!permitidos.includes(t)) throw new Error('Código inválido para o campo do gestor.')
  return t
}

async function exigirPessoaDaEscola(personId: string, schoolId: string) {
  const { data: pessoa, error } = await supabase
    .from('people')
    .select('id, school_id, inep_id, cpf')
    .eq('id', personId)
    .maybeSingle()

  if (error) throw error
  if (!pessoa || (pessoa as any).school_id !== schoolId) {
    throw new Error('A pessoa selecionada não pertence a esta unidade escolar.')
  }
  return pessoa as { id: string; school_id: string; inep_id: string | null; cpf: string | null }
}

/** Mesma regra do exportador (codPessoaSistema): inep → cpf → 20 hex do UUID. */
function codigoPessoaSistema(p: { id: string; inep_id: string | null; cpf: string | null }): string {
  const inep = (p.inep_id || '').trim()
  if (inep) return inep.slice(0, 20)
  const cpf = (p.cpf || '').replace(/\D/g, '')
  if (cpf) return cpf.slice(0, 20)
  return String(p.id).replace(/-/g, '').slice(0, 20)
}

async function managersDaEscola(schoolId: string) {
  const { data, error } = await supabase
    .from('managers')
    .select('id, person_id, cargo, criterio_acesso, situacao_funcional, people!inner(id, nome_completo, cpf, inep_id, school_id)')
    .eq('people.school_id', schoolId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []) as any[]
}

export async function listarManagers(schoolId: string): Promise<ManagerComPessoa[]> {
  const rows = await managersDaEscola(schoolId)
  return rows.map((r) => ({
    id: r.id,
    person_id: r.person_id,
    cargo: r.cargo,
    criterio_acesso: r.criterio_acesso,
    situacao_funcional: r.situacao_funcional,
    nome_completo: r.people?.nome_completo || null,
    cpf: r.people?.cpf || null,
    inep_id: r.people?.inep_id || null,
  }))
}

export type PessoaOpcao = {
  id: string
  nome_completo: string
  cpf: string | null
  inep_id: string | null
}

/**
 * Busca pessoas da escola por nome/CPF para o seletor de gestor
 * (debounce 300ms no cliente, mínimo 3 caracteres).
 */
export async function buscarPessoasEscola(termo: string, schoolId: string): Promise<PessoaOpcao[]> {
  const t = (termo || '').trim()
  if (!schoolId || t.length < 3) return []

  const digitos = t.replace(/\D/g, '')
  let query = supabase
    .from('people')
    .select('id, nome_completo, cpf, inep_id')
    .eq('school_id', schoolId)
    .limit(20)

  if (digitos.length >= 3) {
    query = query.or(`nome_completo.ilike.%${t}%,cpf.ilike.%${digitos}%`)
  } else {
    query = query.ilike('nome_completo', `%${t}%`)
  }

  const { data, error } = await query.order('nome_completo', { ascending: true })
  if (error) throw error
  return (data || []) as PessoaOpcao[]
}

export async function adicionarManager(
  schoolId: string,
  input: { person_id: string; cargo: string | null; criterio_acesso: string | null; situacao_funcional: string | null },
  pessoaId?: string | null,
): Promise<ManagerComPessoa> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  if (!input.person_id) throw new Error('Selecione a pessoa.')
  const pessoa = await exigirPessoaDaEscola(input.person_id, schoolId)

  const existentes = await managersDaEscola(schoolId)
  if (existentes.length >= MAX_GESTORES) {
    throw new Error(`A escola já possui ${MAX_GESTORES} gestores (máximo do INEP).`)
  }
  if (existentes.some((r) => String(r.person_id) === String(input.person_id))) {
    throw new Error('Esta pessoa já está cadastrada como gestora.')
  }

  const { data: escola } = await supabase
    .from('schools')
    .select('codigo_inep')
    .eq('id', schoolId)
    .maybeSingle()

  const payload = {
    person_id: input.person_id,
    cargo: limparCodigo(input.cargo, CARGOS),
    criterio_acesso: limparCodigo(input.criterio_acesso, CRITERIOS),
    situacao_funcional: limparCodigo(input.situacao_funcional, SITUACOES),
    // Colunas legadas da tabela (codigo_pessoa é NOT NULL)
    codigo_inep: (escola as any)?.codigo_inep || null,
    codigo_pessoa: codigoPessoaSistema({ id: input.person_id, inep_id: pessoa.inep_id, cpf: pessoa.cpf }),
    inep_id: pessoa.inep_id || null,
  }

  const { data, error } = await supabase
    .from('managers')
    .insert(payload)
    .select('id, person_id, cargo, criterio_acesso, situacao_funcional')
    .single()

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Unidade Escolar',
    entidade: 'managers',
    entidade_id: (data as any).id,
    acao: 'criar',
    dados_novos: data,
  })

  const lista = await listarManagers(schoolId)
  const criado = lista.find((m) => m.id === (data as any).id)
  if (!criado) throw new Error('Gestor criado, mas não foi localizado na listagem.')
  return criado
}

export async function atualizarManager(
  schoolId: string,
  managerId: string,
  input: { cargo: string | null; criterio_acesso: string | null; situacao_funcional: string | null },
  pessoaId?: string | null,
): Promise<ManagerComPessoa> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  const existentes = await managersDaEscola(schoolId)
  const anterior = existentes.find((r) => String(r.id) === String(managerId))
  if (!anterior) throw new Error('Gestor não encontrado nesta unidade escolar.')

  const payload = {
    cargo: limparCodigo(input.cargo, CARGOS),
    criterio_acesso: limparCodigo(input.criterio_acesso, CRITERIOS),
    situacao_funcional: limparCodigo(input.situacao_funcional, SITUACOES),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('managers')
    .update(payload)
    .eq('id', managerId)
    .select('id, person_id, cargo, criterio_acesso, situacao_funcional')
    .single()

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Unidade Escolar',
    entidade: 'managers',
    entidade_id: managerId,
    acao: 'editar',
    dados_anteriores: anterior,
    dados_novos: data,
  })

  const lista = await listarManagers(schoolId)
  const atualizado = lista.find((m) => m.id === managerId)
  if (!atualizado) throw new Error('Gestor atualizado, mas não foi localizado na listagem.')
  return atualizado
}

export async function removerManager(
  schoolId: string,
  managerId: string,
  pessoaId?: string | null,
): Promise<void> {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', 'escolas', 'editar')

  const existentes = await managersDaEscola(schoolId)
  const anterior = existentes.find((r) => String(r.id) === String(managerId))
  if (!anterior) throw new Error('Gestor não encontrado nesta unidade escolar.')

  const { error } = await supabase
    .from('managers')
    .delete()
    .eq('id', managerId)

  if (error) throw error

  await registrarAuditoria({
    school_id: schoolId,
    pessoa_id: pessoaId || null,
    modulo: 'Unidade Escolar',
    entidade: 'managers',
    entidade_id: managerId,
    acao: 'excluir',
    dados_anteriores: anterior,
  })
}
