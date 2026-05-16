import { getSupabaseClient } from '@/lib/auth'

export type AreaConhecimento = {
  id: string
  nome: string
  tipo_ensino: 'fundamental' | 'medio'
  descricao: string | null
  competencias_count?: number
}

export type Competencia = {
  id: string
  area_id: string
  codigo: string
  descricao: string
}

export async function getAreasConhecimento(tipoEnsino: 'fundamental' | 'medio'): Promise<AreaConhecimento[]> {
  const supabase = getSupabaseClient()
  
  const { data: areas } = await supabase
    .from('bncc_areas_conhecimento')
    .select(`
      id,
      nome,
      tipo_ensino,
      descricao
    `)
    .eq('tipo_ensino', tipoEnsino)
    .order('nome')
  
  if (!areas) return []

  const areasComContagem = await Promise.all(
    areas.map(async (area) => {
      const { count } = await supabase
        .from('bncc_competencias')
        .select('*', { count: 'exact', head: true })
        .eq('area_id', area.id)
      
      return { ...area, competencias_count: count || 0 } as AreaConhecimento
    })
  )

  return areasComContagem
}

export async function getCompetencias(areaId: string): Promise<Competencia[]> {
  const supabase = getSupabaseClient()
  
  const { data } = await supabase
    .from('bncc_competencias')
    .select('*')
    .eq('area_id', areaId)
    .order('codigo')
  
  return data || []
}

export type HabilidadeMedio = {
  codigo: string
  descricao: string
  area_id: string
  competencia_codigo: string
}

export async function getHabilidadesPorCompetencia(competenciaId: string): Promise<HabilidadeMedio[]> {
  const supabase = getSupabaseClient()

  // Get competence info
  const { data: competencia } = await supabase
    .from('bncc_competencias')
    .select('area_id, codigo')
    .eq('id', competenciaId)
    .single()

  if (!competencia) return []

  // Get habilidades via junction table
  const { data: habilidades } = await supabase
    .from('bncc_habilidades_medio')
    .select('*')
    .eq('area_id', competencia.area_id)
    .eq('competencia_codigo', competencia.codigo)
    .order('codigo')

  return habilidades || []
}
