'use server'

import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

async function validarPermRead(recurso: string, pessoaId?: string | null) {
  if (pessoaId) {
    const { validarPermissaoServer } = await import('./perfis')
    await validarPermissaoServer(pessoaId, recurso, 'visualizar')
  }
}

export type Nota = {
  id: string
  aluno_id: string
  disciplina_id: string
  periodo: number
  valor: number | null
  descricao: string | null
  data_aplicacao: string | null
}

export type Recuperacao = {
  id: string
  aluno_id: string
  disciplina_id: string
  periodo: number | null
  tipo: 'avaliacao' | 'periodo' | 'final'
  valor: number | null
}

export type DesempenhoAluno = {
  aluno_id: string
  medias_periodo: (number | null)[]
  media_anual: number | null
  recuperacao: number | null
  media_final: number | null
  status: 'aprovado' | 'recuperacao' | 'reprovado' | null
}

async function getConfigNumerica(metodoId: string) {
  const [numerico, aprovacao] = await Promise.all([
    supabase
      .from('academico_metodos_avaliacao_numerico')
      .select('*')
      .eq('metodo_id', metodoId)
      .maybeSingle()
      .then(r => r.data),
    supabase
      .from('academico_metodos_avaliacao_aprovacao')
      .select('*')
      .eq('metodo_id', metodoId)
      .maybeSingle()
      .then(r => r.data),
  ])

  return {
    forma_registro: (numerico as any)?.forma_registro || 'decimal',
    tipo_media_periodo: (numerico as any)?.tipo_media_periodo || 'ponderada',
    tipo_resultado_final: (numerico as any)?.tipo_resultado_final || 'media_periodos',
    media_maxima_periodo: Number((numerico as any)?.media_maxima_periodo || 10),
    permite_recuperacao: (numerico as any)?.permite_recuperacao || 'nenhum',
    recuperacao_substitutiva: (numerico as any)?.recuperacao_substitutiva || false,
    recuperacao_periodo_substitutiva: (numerico as any)?.recuperacao_periodo_substitutiva || false,
    limitar_avaliacoes: (numerico as any)?.limitar_avaliacoes ?? false,
    avaliacoes_list: ((numerico as any)?.avaliacoes_list || []) as { nome: string; peso: number; nota_maxima: number }[],
    aprovacao_automatica: (aprovacao as any)?.aprovacao_automatica ?? false,
    media_minima: Number((aprovacao as any)?.media_minima || 7),
    pesos_periodos: (aprovacao as any)?.pesos_periodos as number[] || [1],
    permite_recuperacao_final: (aprovacao as any)?.permite_recuperacao_final || false,
    media_minima_recuperacao: Number((aprovacao as any)?.media_minima_recuperacao || 5),
    usa_media_ponderada_recuperacao: (aprovacao as any)?.usa_media_ponderada_recuperacao || false,
    peso_media_anual: Number((aprovacao as any)?.peso_media_anual || 1),
    peso_recuperacao_final: Number((aprovacao as any)?.peso_recuperacao_final || 1),
  }
}

export async function getNumericoConfig(metodoId: string) {
  const { data } = await supabase
    .from('academico_metodos_avaliacao_numerico')
    .select('limitar_avaliacoes, avaliacoes_list')
    .eq('metodo_id', metodoId)
    .maybeSingle()
  return {
    limitar_avaliacoes: (data as any)?.limitar_avaliacoes ?? false,
    avaliacoes_list: ((data as any)?.avaliacoes_list || []) as { nome: string; peso: number; nota_maxima: number }[],
  }
}

export async function getMetodoIdDaTurma(turmaId: string) {
  const { data: turma } = await supabase
    .from('turmas')
    .select('school_id, ano_letivo_id, etapa_ensino_id')
    .eq('id', turmaId)
    .maybeSingle()

  if (!turma) return null

  const { data: matriz } = await supabase
    .from('academico_matrizes_curriculares')
    .select('metodo_avaliacao_id')
    .eq('school_id', turma.school_id)
    .eq('ano_letivo_id', turma.ano_letivo_id)
    .eq('etapa_ensino_id', turma.etapa_ensino_id)

  return matriz?.[0]?.metodo_avaliacao_id || null
}

// ── FASE 5: Server Actions ──

export async function salvarNota(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  periodo: number,
  valor: number | null,
  descricao: string | null,
  dataAplicacao: string | null,
  notaId: string | null,
  pessoaId: string | null
) {
  try {
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.avaliacoes', 'editar')
    }

    if (notaId) {
      const { data, error } = await supabase
        .from('academico_notas')
        .update({ valor, descricao, data_aplicacao: dataAplicacao, updated_by: pessoaId })
        .eq('id', notaId)
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      return { success: true, id: data?.id || notaId }
    } else {
      const { data, error } = await supabase
        .from('academico_notas')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          periodo,
          valor,
          descricao,
          data_aplicacao: dataAplicacao,
          created_by: pessoaId,
          updated_by: pessoaId,
        })
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      return { success: true, id: data?.id }
    }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro interno ao salvar nota' }
  }
}

export async function listarNotas(turmaId: string, periodo: number, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_notas')
    .select('id, aluno_id, disciplina_id, periodo, valor, descricao, data_aplicacao')
    .eq('turma_id', turmaId)
    .eq('periodo', periodo)
    .eq('disciplina_id', disciplinaId)
    .order('data_aplicacao', { ascending: false })

  if (error) throw error
  return (data || []) as Nota[]
}

export async function salvarRecuperacao(
  schoolId: string | null,
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  tipo: 'avaliacao' | 'periodo' | 'final',
  periodo: number | null,
  valor: number | null,
  recId: string | null,
  pessoaId: string | null
) {
  try {
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.diario-classe.avaliacoes', 'editar')
    }

    if (recId) {
      const { data, error } = await supabase
        .from('academico_recuperacoes')
        .update({ valor, updated_by: pessoaId })
        .eq('id', recId)
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      return { success: true, id: data?.id || recId }
    } else {
      const { data, error } = await supabase
        .from('academico_recuperacoes')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          aluno_id: alunoId,
          disciplina_id: disciplinaId,
          tipo,
          periodo,
          valor,
          created_by: pessoaId,
          updated_by: pessoaId,
        })
        .select('id')
        .maybeSingle()
      if (error) return { success: false, error: error.message }
      return { success: true, id: data?.id }
    }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro interno ao salvar recuperação' }
  }
}

export async function listarRecuperacoes(turmaId: string, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_recuperacoes')
    .select('id, aluno_id, disciplina_id, periodo, tipo, valor')
    .eq('turma_id', turmaId)
    .eq('disciplina_id', disciplinaId)

  if (error) throw error
  return (data || []) as Recuperacao[]
}

export async function getDescricoesNotas(turmaId: string, periodo: number, disciplinaId: string, pessoaId?: string | null) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data, error } = await supabase
    .from('academico_notas')
    .select('descricao, data_aplicacao')
    .eq('turma_id', turmaId)
    .eq('periodo', periodo)
    .eq('disciplina_id', disciplinaId)
    .not('descricao', 'is', null)
    .order('data_aplicacao', { ascending: true })

  if (error) throw error
  const seen = new Set<string>()
  return (data || []).filter(n => {
    if (seen.has(n.descricao!)) return false
    seen.add(n.descricao!)
    return true
  })
}

// ── FASE 6: Engine de Cálculo ──

export async function calcularDesempenhoAluno(
  turmaId: string,
  alunoId: string,
  disciplinaId: string,
  quantidadePeriodos: number
): Promise<DesempenhoAluno> {
  const metodoId = await getMetodoIdDaTurma(turmaId)

  const config = metodoId
    ? await getConfigNumerica(metodoId)
    : {
        forma_registro: 'decimal',
        tipo_media_periodo: 'ponderada',
        tipo_resultado_final: 'media_periodos',
        media_maxima_periodo: 10,
        permite_recuperacao: 'nenhum',
        recuperacao_substitutiva: false,
        recuperacao_periodo_substitutiva: false,
        limitar_avaliacoes: false,
        avaliacoes_list: [] as { nome: string; peso: number; nota_maxima: number }[],
        aprovacao_automatica: false,
        media_minima: 7,
        pesos_periodos: Array(quantidadePeriodos).fill(1),
        permite_recuperacao_final: false,
        media_minima_recuperacao: 5,
        usa_media_ponderada_recuperacao: false,
        peso_media_anual: 1,
        peso_recuperacao_final: 1,
      }

  const periodos = Array.from({ length: quantidadePeriodos }, (_, i) => i + 1)

  const [notasData, recuperacoesData] = await Promise.all([
    supabase
      .from('academico_notas')
      .select('periodo, valor, descricao')
      .eq('aluno_id', alunoId)
      .eq('disciplina_id', disciplinaId)
      .then(r => r.data || []),
    supabase
      .from('academico_recuperacoes')
      .select('periodo, tipo, valor')
      .eq('aluno_id', alunoId)
      .eq('disciplina_id', disciplinaId)
      .then(r => r.data || []),
  ])

  const pesoMap = new Map<string, number>()
  for (const av of config.avaliacoes_list) {
    pesoMap.set(av.nome, av.peso)
  }

  // Calcular média de cada período
  const mediasPeriodo: (number | null)[] = periodos.map(p => {
    const notasDoPeriodo = notasData
      .filter((n: any) => n.periodo === p && n.valor !== null)

    if (notasDoPeriodo.length === 0) return null

    if (config.tipo_media_periodo === 'somatoria') {
      const soma = notasDoPeriodo.reduce((a: number, n: any) => a + Number(n.valor), 0)
      return Math.min(soma, config.media_maxima_periodo)
    }

    let somaPonderada = 0
    let somaPesos = 0
    for (const n of notasDoPeriodo) {
      const peso = pesoMap.get(n.descricao) ?? 1
      somaPonderada += Number(n.valor) * peso
      somaPesos += peso
    }
    const media = somaPesos > 0 ? somaPonderada / somaPesos : 0
    const capped = Math.min(media, config.media_maxima_periodo)
    return Math.round(capped * 100) / 100
  })

  // Aplicar recuperação por período (se recuperacao_periodo_substitutiva)
  if (config.recuperacao_periodo_substitutiva) {
    recPeriodoLoop: for (const rec of recuperacoesData as any[]) {
      if (rec.tipo !== 'periodo' || rec.periodo === null || rec.valor === null) continue
      const idx = rec.periodo - 1
      if (idx >= 0 && idx < mediasPeriodo.length) {
        if (mediasPeriodo[idx] === null || Number(rec.valor) > mediasPeriodo[idx]!) {
          mediasPeriodo[idx] = Number(rec.valor)
        }
      }
    }
  }

  // Calcular média anual
  let mediaAnual: number | null = null

  if (mediasPeriodo.some(m => m !== null)) {
    const pesos = config.pesos_periodos.slice(0, mediasPeriodo.length)
    if (config.tipo_resultado_final === 'somatoria') {
      let soma = 0
      for (const m of mediasPeriodo) {
        if (m !== null) soma += m
      }
      mediaAnual = Math.min(soma, config.media_maxima_periodo)
    } else {
      let somaPonderada = 0
      let somaPesos = 0
      for (let i = 0; i < mediasPeriodo.length; i++) {
        if (mediasPeriodo[i] !== null) {
          somaPonderada += mediasPeriodo[i]! * (pesos[i] || 1)
          somaPesos += pesos[i] || 1
        }
      }
      mediaAnual = somaPesos > 0 ? somaPonderada / somaPesos : null
      if (mediaAnual !== null) {
        mediaAnual = Math.round(mediaAnual * 100) / 100
      }
    }
  }

  // Recuperação final
  const recFinal = (recuperacoesData as any[]).find(
    (r: any) => r.tipo === 'final' && r.valor !== null
  )
  const valorRecFinal = recFinal ? Number(recFinal.valor) : null

  let mediaFinal: number | null = null
  let status: DesempenhoAluno['status'] = null

  if (mediaAnual !== null) {
    if (config.aprovacao_automatica) {
      mediaFinal = mediaAnual
      status = 'aprovado'
    } else if (mediaAnual >= config.media_minima) {
      mediaFinal = mediaAnual
      status = 'aprovado'
    } else if (config.permite_recuperacao_final && valorRecFinal !== null) {
      if (config.usa_media_ponderada_recuperacao) {
        const pesoAnual = config.peso_media_anual
        const pesoRec = config.peso_recuperacao_final
        const totalPeso = pesoAnual + pesoRec
        mediaFinal = ((mediaAnual * pesoAnual) + (valorRecFinal * pesoRec)) / totalPeso
      } else {
        mediaFinal = valorRecFinal
      }
      mediaFinal = Math.round(mediaFinal * 100) / 100

      if (config.recuperacao_substitutiva) {
        status = mediaFinal >= config.media_minima ? 'aprovado' : 'reprovado'
      } else {
        status = mediaFinal >= config.media_minima_recuperacao ? 'aprovado' : 'reprovado'
      }
    } else if (config.permite_recuperacao_final && valorRecFinal === null) {
      mediaFinal = mediaAnual
      status = 'recuperacao'
    } else {
      mediaFinal = mediaAnual
      status = 'reprovado'
    }
  }

  return {
    aluno_id: alunoId,
    medias_periodo: mediasPeriodo,
    media_anual: mediaAnual ? Math.round(mediaAnual * 100) / 100 : null,
    recuperacao: valorRecFinal,
    media_final: mediaFinal,
    status,
  }
}

export async function recalcularTurma(
  turmaId: string,
  disciplinaId: string,
  quantidadePeriodos: number,
  pessoaId?: string | null
) {
  await validarPermRead('gestao-pedagogica.diario-classe.avaliacoes', pessoaId)
  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (!matriculas?.length) return []

  const resultados = await Promise.all(
    matriculas.map(m =>
      calcularDesempenhoAluno(turmaId, m.aluno_id, disciplinaId, quantidadePeriodos)
    )
  )

  return resultados
}
