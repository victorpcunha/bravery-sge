'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type LinhaAuditoria = {
  id: string
  created_at: string
  school_id: string | null
  pessoa_id: string | null
  modulo: string
  entidade: string
  entidade_id: string | null
  registro_nome: string | null
  acao: 'criar' | 'editar' | 'excluir'
  dados_anteriores: Record<string, unknown> | null
  dados_novos: Record<string, unknown> | null
  alteracoes: { campo: string; anterior: unknown; novo: unknown }[] | null
  resumo: Record<string, unknown> | null
  people: { nome_completo: string } | null
  schools: { nome_escola: string } | null
}

export type FiltrosAuditoria = {
  buscar?: string
  escolaId?: string | null
  pessoaId?: string | null
  modulo?: string | null
  tipoAcao?: 'criar' | 'editar' | 'excluir' | null
  dataInicial?: string | null
  dataFinal?: string | null
}

export type ResultadoAuditoria = {
  rows: LinhaAuditoria[]
  total: number
}

export async function validarSuperAdmin(pessoaId: string | null | undefined): Promise<boolean> {
  if (!pessoaId) return false
  const { data } = await supabase
    .from('people')
    .select('is_super_admin')
    .eq('id', pessoaId)
    .maybeSingle()
  return data?.is_super_admin === true
}

function sanitizarTermoBusca(termo: string): string {
  return termo.replace(/[%_*]/g, '')
}

export async function listarAuditoria(
  filtros: FiltrosAuditoria,
  pagina = 1,
  porPagina = 10,
  pessoaId?: string | null
): Promise<ResultadoAuditoria> {
  if (!(await validarSuperAdmin(pessoaId))) {
    throw new Error('Acesso negado: apenas Superadmin pode consultar a auditoria')
  }

  const start = (pagina - 1) * porPagina
  const end = start + porPagina - 1

  let query = supabase
    .from('auditoria')
    .select('*, people(nome_completo), schools(nome_escola)', { count: 'exact' })

  if (filtros.escolaId) query = query.eq('school_id', filtros.escolaId)
  if (filtros.pessoaId) query = query.eq('pessoa_id', filtros.pessoaId)
  if (filtros.modulo) query = query.eq('modulo', filtros.modulo)
  if (filtros.tipoAcao) query = query.eq('acao', filtros.tipoAcao)
  if (filtros.dataInicial) query = query.gte('created_at', `${filtros.dataInicial}T00:00:00`)
  if (filtros.dataFinal) query = query.lte('created_at', `${filtros.dataFinal}T23:59:59`)

  if (filtros.buscar) {
    const termo = sanitizarTermoBusca(filtros.buscar)
    if (termo) {
      query = query.or(
        `registro_nome.ilike.%${termo}%,dados_novos::text.ilike.%${termo}%,dados_anteriores::text.ilike.%${termo}%`
      )
    }
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) throw error

  return {
    rows: (data || []) as unknown as LinhaAuditoria[],
    total: count || 0,
  }
}

export async function listarModulosAuditoria(): Promise<string[]> {
  const { data, error } = await supabase
    .from('auditoria')
    .select('modulo')
    .order('modulo', { ascending: true })

  if (error) throw error
  const modulos = new Set((data || []).map(d => d.modulo).filter(Boolean))
  return [...modulos]
}

export async function listarProfissionaisAuditoria(escolaId?: string | null) {
  let query = supabase
    .from('people')
    .select('id, nome_completo, school_id')
    .order('nome_completo', { ascending: true })
    .limit(1000)

  if (escolaId) query = query.eq('school_id', escolaId)

  const { data, error } = await query
  if (error) throw error
  return (data || []) as { id: string; nome_completo: string; school_id: string }[]
}