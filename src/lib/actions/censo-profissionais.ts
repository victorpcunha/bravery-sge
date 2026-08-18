'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type ProfissionalCenso = {
  id: string
  nome_completo: string
  cpf: string | null
  data_nascimento: string | null
  tipo_censo: string
}

export type ResumoProfissionalCenso = {
  tipo_censo: string
  total: number
}

export async function getProfissionaisCenso(schoolId: string | null) {
  if (!schoolId) {
    return { resumo: [] as ResumoProfissionalCenso[], profissionais: [] as ProfissionalCenso[] }
  }

  const { data, error } = await supabase
    .from('vinculos_profissionais')
    .select('funcao:funcao_id(tipo_censo), pessoa:person_id(id, nome_completo, cpf, data_nascimento, ativo, perfil)')
    .eq('school_id', schoolId)
    .eq('situacao', '1')

  if (error) throw error

  const resumo: Record<string, number> = {}
  const profissionaisMap = new Map<string, ProfissionalCenso & { tipo_censo: string }>()

  for (const v of data || []) {
    const relFuncao = (v as any).funcao
    const funcaoTipo = Array.isArray(relFuncao) ? (relFuncao[0]?.tipo_censo as string | null) : (relFuncao?.tipo_censo as string | null)
    const pessoa = (v as any).pessoa as {
      id: string
      nome_completo: string
      cpf: string | null
      data_nascimento: string | null
      ativo: boolean
      perfil: string[] | null
    } | null

    if (!funcaoTipo || !pessoa) continue
    if (!pessoa.ativo) continue
    const perfil = pessoa.perfil || []
    if (!perfil.includes('profissional') && !perfil.includes('gestor')) continue

    resumo[funcaoTipo] = (resumo[funcaoTipo] || 0) + 1
    if (!profissionaisMap.has(pessoa.id)) {
      profissionaisMap.set(pessoa.id, {
        id: pessoa.id,
        nome_completo: pessoa.nome_completo,
        cpf: pessoa.cpf,
        data_nascimento: pessoa.data_nascimento,
        tipo_censo: funcaoTipo,
      })
    }
  }

  const resumoArray = Object.entries(resumo).map(([tipo_censo, total]) => ({ tipo_censo, total }))
  const profissionais = Array.from(profissionaisMap.values())

  return { resumo: resumoArray, profissionais }
}