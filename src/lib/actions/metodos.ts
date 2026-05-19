import { supabase } from '@/lib/supabase'

export interface MetodoAvaliacao {
  id: string
  school_id: string
  nome: string
  descricao: string | null
  criterio_frequencia: string
  frecuencia_minima: number
  tipos_avaliacao: Record<string, boolean>
  quantidade_periodos_numerico: number | null
  quantidade_periodos_parecer: number | null
  quantidade_periodos_conceito: number | null
  quantidade_periodos_nivel: number | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface MetodoNumerico {
  id: string
  metodo_id: string
  forma_registro: string
  permite_recuperacao: string | null
  tipo_media_periodo: string
  tipo_resultado_final: string
  media_maxima_periodo: number
  permite_conselho_componente: boolean
  atribui_media_minima_conselho: boolean
  usa_media_5_conceito: boolean
  permite_recuperacao_final_reprovados: boolean
  recuperacao_substitutiva: boolean
  recuperacao_periodo_substitutiva: boolean
  realizava_avaliacao_reclassificacao: boolean
}

export interface MetodoAprovacao {
  id: string
  metodo_id: string
  aprovacao_automatica: boolean
  media_minima: number
  pesos_periodos: number[]
  permite_recuperacao_final: boolean
  media_minima_recuperacao: number
  usa_media_ponderada_recuperacao: boolean
  peso_media_anual: number
  peso_recuperacao_final: number
}

export interface MetodoArredondamento {
  id: string
  metodo_id: string
  tipo_arredondamento: string | null
  intervalo_inicial: number | null
  intervalo_final: number | null
  margem_decimal: number | null
  aplica_media_periodo: boolean
  aplica_media_anual: boolean
  aplica_media_final: boolean
}

export interface MetodoConceito {
  id?: string
  metodo_id?: string
  descricao: string
  sigla: string
  cor_fundo: string
  cor_letra: string
  eh_conceito_final: boolean
  ordem: number
}

export interface MetodoNivel {
  id?: string
  metodo_id?: string
  descricao: string
  sigla: string
  cor_fundo: string
  cor_letra: string
  ordem: number
}

export interface MetodoParecer {
  id: string
  metodo_id: string
  registro_geral: boolean
}

export interface MetodoCompleto {
  principal: MetodoAvaliacao
  numerico: MetodoNumerico | null
  aprovacao: MetodoAprovacao | null
  arredondamento: MetodoArredondamento | null
  conceitos: MetodoConceito[]
  niveis: MetodoNivel[]
  parecer: MetodoParecer | null
}

export async function getMetodos(schoolId: string) {
  const { data, error } = await supabase
    .from('academico_metodos_avaliacao')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as MetodoAvaliacao[]
}

export async function getMetodoCompleto(id: string) {
  const { data: principal, error: err1 } = await supabase
    .from('academico_metodos_avaliacao')
    .select('*')
    .eq('id', id)
    .single()

  if (err1) throw err1

  const [numerico, aprovacao, arredondamento, conceitos, niveis, parecer] = await Promise.all([
    supabase.from('academico_metodos_avaliacao_numerico').select('*').eq('metodo_id', id).maybeSingle(),
    supabase.from('academico_metodos_avaliacao_aprovacao').select('*').eq('metodo_id', id).maybeSingle(),
    supabase.from('academico_metodos_avaliacao_arredondamento').select('*').eq('metodo_id', id).maybeSingle(),
    supabase.from('academico_metodos_conceitos').select('*').eq('metodo_id', id).order('ordem'),
    supabase.from('academico_metodos_niveis').select('*').eq('metodo_id', id).order('ordem'),
    supabase.from('academico_metodos_parecer').select('*').eq('metodo_id', id).maybeSingle(),
  ])

  return {
    principal: principal as MetodoAvaliacao,
    numerico: numerico.data as MetodoNumerico | null,
    aprovacao: aprovacao.data as MetodoAprovacao | null,
    arredondamento: arredondamento.data as MetodoArredondamento | null,
    conceitos: (conceitos.data || []) as MetodoConceito[],
    niveis: (niveis.data || []) as MetodoNivel[],
    parecer: parecer.data as MetodoParecer | null,
  } as MetodoCompleto
}

async function upsertNumerico(metodoId: string, data: Partial<MetodoNumerico>) {
  const payload = { metodo_id: metodoId, ...data }
  const { error } = await supabase
    .from('academico_metodos_avaliacao_numerico')
    .upsert(payload, { onConflict: 'metodo_id' })

  if (error) throw error
}

async function upsertAprovacao(metodoId: string, data: Partial<MetodoAprovacao>) {
  const payload = { metodo_id: metodoId, ...data }
  const { error } = await supabase
    .from('academico_metodos_avaliacao_aprovacao')
    .upsert(payload, { onConflict: 'metodo_id' })

  if (error) throw error
}

async function upsertArredondamento(metodoId: string, data: Partial<MetodoArredondamento>) {
  const payload = { metodo_id: metodoId, ...data }
  const { error } = await supabase
    .from('academico_metodos_avaliacao_arredondamento')
    .upsert(payload, { onConflict: 'metodo_id' })

  if (error) throw error
}

async function upsertParecer(metodoId: string, data: Partial<MetodoParecer>) {
  const payload = { metodo_id: metodoId, ...data }
  const { error } = await supabase
    .from('academico_metodos_parecer')
    .upsert(payload, { onConflict: 'metodo_id' })

  if (error) throw error
}

export type SaveMetodoPayload = {
  principal: Partial<MetodoAvaliacao>
  numerico: Partial<MetodoNumerico> | null
  aprovacao: Partial<MetodoAprovacao> | null
  arredondamento: Partial<MetodoArredondamento> | null
  parecer: Partial<MetodoParecer> | null
  conceitos: Partial<MetodoConceito>[]
  niveis: Partial<MetodoNivel>[]
}

export async function saveMetodo(schoolId: string, payload: SaveMetodoPayload) {
  const { id: _, ...principalData } = payload.principal
  const isUpdate = !!payload.principal.id

  let metodoId: string

  if (isUpdate) {
    metodoId = payload.principal.id!
    const { error } = await supabase
      .from('academico_metodos_avaliacao')
      .update(principalData)
      .eq('id', metodoId)

    if (error) throw error
  } else {
    const { data, error } = await supabase
      .from('academico_metodos_avaliacao')
      .insert({ ...principalData, school_id: schoolId })
      .select('id')
      .single()

    if (error) throw error
    metodoId = data.id
  }

  const tipos = payload.principal.tipos_avaliacao || {}

  if (tipos.numerico) {
    if (payload.numerico) {
      await upsertNumerico(metodoId, payload.numerico)
    }
    if (payload.aprovacao) {
      await upsertAprovacao(metodoId, payload.aprovacao)
    }
    if (payload.arredondamento) {
      await upsertArredondamento(metodoId, payload.arredondamento)
    }
  } else {
    await supabase.from('academico_metodos_avaliacao_numerico').delete().eq('metodo_id', metodoId)
    await supabase.from('academico_metodos_avaliacao_aprovacao').delete().eq('metodo_id', metodoId)
    await supabase.from('academico_metodos_avaliacao_arredondamento').delete().eq('metodo_id', metodoId)
  }

  if (tipos.parecer && payload.parecer) {
    await upsertParecer(metodoId, payload.parecer)
  } else {
    await supabase.from('academico_metodos_parecer').delete().eq('metodo_id', metodoId)
  }

  if (tipos.conceito) {
    await supabase.from('academico_metodos_conceitos').delete().eq('metodo_id', metodoId)
    if (payload.conceitos.length > 0) {
      const conceitosData = payload.conceitos.map((c, i) => ({
        metodo_id: metodoId,
        descricao: c.descricao,
        sigla: c.sigla,
        cor_fundo: c.cor_fundo || '#E2E8F0',
        cor_letra: c.cor_letra || '#1E293B',
        eh_conceito_final: c.eh_conceito_final || false,
        ordem: i,
      }))
      const { error } = await supabase.from('academico_metodos_conceitos').insert(conceitosData)
      if (error) throw error
    }
  } else {
    await supabase.from('academico_metodos_conceitos').delete().eq('metodo_id', metodoId)
  }

  if (tipos.nivel) {
    await supabase.from('academico_metodos_niveis').delete().eq('metodo_id', metodoId)
    if (payload.niveis.length > 0) {
      const niveisData = payload.niveis.map((n, i) => ({
        metodo_id: metodoId,
        descricao: n.descricao,
        sigla: n.sigla,
        cor_fundo: n.cor_fundo || '#E2E8F0',
        cor_letra: n.cor_letra || '#1E293B',
        ordem: i,
      }))
      const { error } = await supabase.from('academico_metodos_niveis').insert(niveisData)
      if (error) throw error
    }
  } else {
    await supabase.from('academico_metodos_niveis').delete().eq('metodo_id', metodoId)
  }

  return metodoId
}

export async function deleteMetodo(id: string) {
  const { error } = await supabase
    .from('academico_metodos_avaliacao')
    .delete()
    .eq('id', id)

  if (error) throw error
}
