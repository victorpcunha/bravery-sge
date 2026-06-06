'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()
const RESOURCE = 'gestao-usuarios.painel-aluno'

export async function adicionarHistoricoManual(
  data: {
    person_id: string
    school_id: string
    ano_letivo_id: string
    carga_horaria?: number | null
    dias_letivos?: number | null
    media_aprovacao?: number | null
    municipio?: string | null
    unidade_escolar?: string | null
    etapa_ensino_id?: string | null
    situacao?: string | null
    observacoes?: string | null
  },
  pessoaId?: string | null
) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'criar')
  }

  if (!data.person_id || !data.school_id || !data.ano_letivo_id) {
    throw new Error('Campos obrigatórios: person_id, school_id, ano_letivo_id')
  }

  const { data: registro, error } = await supabase
    .from('historico_manual')
    .insert({
      person_id: data.person_id,
      school_id: data.school_id,
      ano_letivo_id: data.ano_letivo_id,
      carga_horaria: data.carga_horaria || null,
      dias_letivos: data.dias_letivos || null,
      media_aprovacao: data.media_aprovacao || null,
      municipio: data.municipio || null,
      unidade_escolar: data.unidade_escolar || null,
      etapa_ensino_id: data.etapa_ensino_id || null,
      situacao: data.situacao || null,
      observacoes: data.observacoes || null,
      created_by: pessoaId,
      updated_by: pessoaId,
    })
    .select()
    .single()

  if (error) throw error
  return registro
}

export async function getConfigEscola(
  schoolId: string,
  pessoaId?: string | null
): Promise<{ permite_historico_manual: boolean }> {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'visualizar')
  }

  const { data } = await supabase
    .from('schools')
    .select('permite_historico_manual')
    .eq('id', schoolId)
    .single()

  return { permite_historico_manual: data?.permite_historico_manual || false }
}
