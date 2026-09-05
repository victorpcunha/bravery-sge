'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoria } from '@/lib/auditoria'
import type { HistoricoManualRecord } from './painel-pessoa'

const supabase = getSupabaseAdmin()
const RESOURCE = 'gestao-usuarios.painel-aluno'

export type HistoricoManualInput = {
  person_id: string
  school_id: string
  ano: number
  carga_horaria?: number | null
  dias_letivos?: number | null
  media_aprovacao?: number | null
  estado?: string | null
  municipio?: string | null
  unidade_escolar?: string | null
  etapa_ensino_id?: string | null
  situacao?: string | null
  observacoes?: string | null
  disciplinas?: Array<{
    disciplina_id?: string | null
    disciplina_nome?: string | null
    media_final: number
    carga_horaria_anual?: number | null
    parte_diversificada?: boolean
  }>
}

export async function adicionarHistoricoManual(
  data: HistoricoManualInput,
  pessoaId?: string | null
) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'criar')
  }

  if (!data.person_id || !data.school_id || !data.ano) {
    throw new Error('Campos obrigatorios: person_id, school_id, ano')
  }

  const { data: registro, error } = await supabase
    .from('historico_manual')
    .insert({
      person_id: data.person_id,
      school_id: data.school_id,
      ano: data.ano,
      carga_horaria: data.carga_horaria || null,
      dias_letivos: data.dias_letivos || null,
      media_aprovacao: data.media_aprovacao || null,
      estado: data.estado || null,
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

  if (data.disciplinas?.length) {
    const discRows = data.disciplinas.map(d => ({
      historico_manual_id: registro.id,
      disciplina_id: d.parte_diversificada ? null : (d.disciplina_id || null),
      disciplina_nome: d.parte_diversificada ? (d.disciplina_nome || null) : null,
      media_final: d.media_final,
      carga_horaria_anual: d.carga_horaria_anual || null,
      parte_diversificada: d.parte_diversificada || false,
    }))

    const { error: discError } = await supabase
      .from('historico_manual_disciplinas')
      .insert(discRows)

    if (discError) throw discError
  }

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo')
    .eq('id', data.person_id)
    .maybeSingle()

  await registrarAuditoria({
    school_id: data.school_id,
    pessoa_id: pessoaId || null,
    modulo: 'Histórico Escolar',
    entidade: 'historico_manual',
    entidade_id: registro.id,
    registro_nome: pessoa?.nome_completo || null,
    acao: 'criar',
    dados_novos: registro,
  })

  return registro
}

export async function listarHistoricoManual(
  personId: string,
  pessoaLogadaId?: string | null
): Promise<HistoricoManualRecord[]> {
  if (pessoaLogadaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaLogadaId, RESOURCE, 'visualizar')
  }

  const { data: registros, error } = await supabase
    .from('historico_manual')
    .select(`
      id,
      person_id,
      ano,
      carga_horaria,
      dias_letivos,
      estado,
      municipio,
      unidade_escolar,
      situacao,
      observacoes,
      academico_etapas_ensino!etapa_ensino_id(nome)
    `)
    .eq('person_id', personId)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!registros?.length) return []

  const ids = registros.map(r => r.id)

  const { data: disciplinas } = await supabase
    .from('historico_manual_disciplinas')
    .select(`
      id,
      historico_manual_id,
      disciplina_id,
      disciplina_nome,
      media_final,
      carga_horaria_anual,
      parte_diversificada,
      academico_disciplinas!disciplina_id(nome)
    `)
    .in('historico_manual_id', ids)

  const discMap = new Map<string, HistoricoManualRecord['disciplinas']>()
  for (const d of disciplinas || []) {
    if (!discMap.has(d.historico_manual_id)) discMap.set(d.historico_manual_id, [])
    discMap.get(d.historico_manual_id)!.push({
      id: d.id,
      disciplina_id: d.disciplina_id,
      disciplina_nome: d.disciplina_nome || (d.academico_disciplinas as unknown as { nome: string } | null)?.nome || '',
      media_final: d.media_final,
      carga_horaria_anual: d.carga_horaria_anual,
      parte_diversificada: d.parte_diversificada,
    })
  }

  return registros.map(r => ({
    id: r.id,
    person_id: r.person_id,
    year_name: r.ano != null ? String(r.ano) : '',
    carga_horaria: r.carga_horaria,
    dias_letivos: r.dias_letivos,
    estado: r.estado,
    municipio: r.municipio,
    unidade_escolar: r.unidade_escolar,
    etapa_nome: (r.academico_etapas_ensino as unknown as { nome: string })?.nome || null,
    situacao: r.situacao,
    observacoes: r.observacoes,
    disciplinas: discMap.get(r.id) || [],
  }))
}

export async function removerHistoricoManual(
  id: string,
  pessoaId?: string | null
) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'excluir')
  }

  const { data: anterior } = await supabase
    .from('historico_manual')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  const { error } = await supabase
    .from('historico_manual')
    .delete()
    .eq('id', id)

  if (error) throw error

  if (anterior) {
    const { data: pessoa } = await supabase
      .from('people')
      .select('nome_completo')
      .eq('id', anterior.person_id)
      .maybeSingle()

    await registrarAuditoria({
      school_id: anterior.school_id,
      pessoa_id: pessoaId || null,
      modulo: 'Histórico Escolar',
      entidade: 'historico_manual',
      entidade_id: id,
      registro_nome: pessoa?.nome_completo || null,
      acao: 'excluir',
      dados_anteriores: anterior,
    })
  }
}

export async function getConfigEscola(
  schoolId: string | null,
  pessoaId?: string | null
): Promise<{ permite_historico_manual: boolean }> {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, RESOURCE, 'visualizar')
  }

  let query = supabase
    .from('schools')
    .select('permite_historico_manual')

  if (schoolId) query = query.eq('id', schoolId)

  const { data } = await query.single()

  return { permite_historico_manual: data?.permite_historico_manual || false }
}
