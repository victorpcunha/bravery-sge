// Resolve area_codigo INEP a partir dos ids guardados em
// `turmas_profissionais.disciplinas_ids`.
//
// Esses ids sao da MATRIZ (academico_matriz_disciplinas — é o que o
// TurmaForm/Quadro gravam), nao da disciplina. Buscar area_codigo direto
// em `academico_disciplinas` por esses ids nunca casa e zera as áreas do
// Registro 50. Retorna matrizId -> area_codigo (só os resolvidos).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapearAreasPorMatriz(sb: any, ids: (string | null | undefined)[]): Promise<Map<string, number>> {
  const mapa = new Map<string, number>()
  const unicos = [...new Set((ids || []).filter(Boolean).map((id) => String(id)))]
  if (unicos.length === 0) return mapa

  const { data: mds } = await sb
    .from('academico_matriz_disciplinas')
    .select('id, disciplina_id, academico_disciplinas(area_codigo)')
    .in('id', unicos)

  const porMatriz = new Map<string, any>()
  for (const md of (mds || []) as any[]) porMatriz.set(String(md.id), md)

  // disciplina_ids a resolver (via matriz + ids já-diretos por compatibilidade)
  const discIds = new Set<string>()
  for (const md of porMatriz.values()) {
    if (md.disciplina_id) discIds.add(String(md.disciplina_id))
  }
  for (const id of unicos) {
    if (!porMatriz.has(id)) discIds.add(id)
  }

  const areaPorDisc = new Map<string, number>()
  if (discIds.size > 0) {
    const { data: discs } = await sb
      .from('academico_disciplinas')
      .select('id, area_codigo')
      .in('id', [...discIds])
    for (const d of (discs || []) as any[]) {
      if (d.area_codigo != null) areaPorDisc.set(String(d.id), Number(d.area_codigo))
    }
  }

  for (const id of unicos) {
    const md = porMatriz.get(id)
    const direto = md?.academico_disciplinas?.area_codigo
    if (direto != null) {
      mapa.set(id, Number(direto))
      continue
    }
    const viaDisc = md?.disciplina_id ? areaPorDisc.get(String(md.disciplina_id)) : areaPorDisc.get(id)
    if (viaDisc != null) mapa.set(id, viaDisc)
  }

  return mapa
}
