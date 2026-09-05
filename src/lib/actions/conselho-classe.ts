'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { registrarAuditoriaAgregada } from '@/lib/auditoria'

const supabase = getSupabaseAdmin()

async function registrarConselhoAgg(
  pessoaId: string | null,
  turmaId: string,
  matrizDisciplinaId: string | null,
  periodo: number,
  quantidade: number,
  entidade: string
) {
  const { data: turma } = await supabase.from('turmas').select('school_id, nome').eq('id', turmaId).maybeSingle()
  let disciplinaNome: string | null = null
  if (matrizDisciplinaId) {
    const { data } = await supabase
      .from('academico_matriz_disciplinas')
      .select('academico_disciplinas(nome)')
      .eq('id', matrizDisciplinaId)
      .maybeSingle()
    disciplinaNome = (data as any)?.academico_disciplinas?.nome || null
  }
  await registrarAuditoriaAgregada({
    school_id: turma?.school_id || null,
    pessoa_id: pessoaId || null,
    modulo: 'Conselho de Classe',
    entidade,
    entidade_id: turmaId,
    registro_nome: turma?.nome || null,
    resumo: {
      turma: turma?.nome || null,
      turma_id: turmaId,
      disciplina: disciplinaNome,
      periodo: `Período ${periodo}`,
      quantidade,
    },
  })
}

export type DisciplinaDesempenho = {
  disciplina_id: string
  nome: string
  frequencia: number | null
  total_faltas: number | null
  media_periodo: number | null
  media_minima: number | null
  nota_conselho: number | null
  parecer: string | null
}

export type AlunoDesempenho = {
  aluno_id: string
  nome: string
  disciplinas: DisciplinaDesempenho[]
}

export type AlunoReprovado = {
  matricula_id: string
  aluno_id: string
  nome: string
  situacao: string
}

async function getMetodoIdDaTurma(turmaId: string) {
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
    .maybeSingle()

  return matriz?.metodo_avaliacao_id || null
}

export async function verificarPreRequisitos(turmaId: string) {
  const metodoId = await getMetodoIdDaTurma(turmaId)
  if (!metodoId) {
    return { ok: false as const, erro: 'Turma sem método de avaliação configurado' }
  }

  const [{ data: metodo }, { data: numerico }] = await Promise.all([
    supabase
      .from('academico_metodos_avaliacao')
      .select('tipos_avaliacao')
      .eq('id', metodoId)
      .maybeSingle(),
    supabase
      .from('academico_metodos_avaliacao_numerico')
      .select('permite_conselho_componente')
      .eq('metodo_id', metodoId)
      .maybeSingle(),
  ])

  const tipos = (metodo as any)?.tipos_avaliacao || {}
  if (tipos.numerico !== true) {
    return { ok: false as const, erro: 'O método de avaliação da turma não é do tipo numérico' }
  }

  if ((numerico as any)?.permite_conselho_componente !== true) {
    return { ok: false as const, erro: 'Conselho de Classe não habilitado no método de avaliação' }
  }

  return { ok: true as const }
}

export async function listarAlunosAbaixoMedia(
  schoolId: string | null,
  turmaId: string,
  periodo: number,
  disciplinaId?: string
): Promise<AlunoDesempenho[]> {
  const metodoId = await getMetodoIdDaTurma(turmaId)
  if (!metodoId) return []

  const { data: numerico } = await supabase
    .from('academico_metodos_avaliacao_numerico')
    .select('media_maxima_periodo, tipo_media_periodo, limitar_avaliacoes, avaliacoes_list, recuperacao_periodo_substitutiva')
    .eq('metodo_id', metodoId)
    .maybeSingle()

  if (!numerico) return []

  const { data: metodoFreq } = await supabase
    .from('academico_metodos_avaliacao')
    .select('criterio_frequencia')
    .eq('id', metodoId)
    .maybeSingle()

  const criterioFrequencia = (metodoFreq as any)?.criterio_frequencia || 'por_dia'

  const mediaMaxima = Number((numerico as any).media_maxima_periodo || 10)
  const tipoMedia = (numerico as any).tipo_media_periodo || 'ponderada'
  const recuperacaoPeriodoSubstitutiva = (numerico as any).recuperacao_periodo_substitutiva ?? false
  const limitarAv = (numerico as any).limitar_avaliacoes ?? false
  const avaliacoesList = ((numerico as any).avaliacoes_list || []) as { nome: string; peso: number; nota_maxima: number }[]
  const pesoMap = new Map<string, number>()
  for (const av of avaliacoesList) {
    pesoMap.set(av.nome, av.peso)
  }

  let matrizQuery = supabase
    .from('academico_matrizes_curriculares')
    .select('id')
    .eq('ano_letivo_id', (await supabase.from('turmas').select('ano_letivo_id').eq('id', turmaId).maybeSingle()).data?.ano_letivo_id)
    .eq('etapa_ensino_id', (await supabase.from('turmas').select('etapa_ensino_id').eq('id', turmaId).maybeSingle()).data?.etapa_ensino_id)

  if (schoolId) matrizQuery = matrizQuery.eq('school_id', schoolId)

  const { data: matriz } = await matrizQuery.maybeSingle()

  const { data: aprovacao } = await supabase
    .from('academico_metodos_avaliacao_aprovacao')
    .select('media_minima')
    .eq('metodo_id', metodoId)
    .maybeSingle()

  const mediaMinima = Number((aprovacao as any)?.media_minima || 7)

  const { data: matriculas } = await supabase
    .from('academico_matriculas')
    .select('aluno_id')
    .eq('turma_id', turmaId)
    .eq('situacao', 'Ativo')

  if (!matriculas?.length) return []

  const alunoIds = matriculas.map(m => m.aluno_id)

  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', alunoIds)

  const nomeMap = new Map<string, string>()
  for (const p of pessoas || []) {
    nomeMap.set(p.id, p.nome_completo)
  }

  let query = supabase
    .from('turmas_disciplinas')
    .select('matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
    .eq('turma_id', turmaId)

  if (disciplinaId) {
    query = query.eq('matriz_disciplina_id', disciplinaId)
  }

  const { data: disciplinas } = await query
  if (!disciplinas?.length) return []

  const disciplinaIds = disciplinas.map((d: any) => d.matriz_disciplina_id)

  const { data: notas } = await supabase
    .from('academico_notas')
    .select('aluno_id, disciplina_id, valor, descricao')
    .in('aluno_id', alunoIds)
    .in('disciplina_id', disciplinaIds)
    .eq('periodo', periodo)

  const { data: resultadosConselho } = await supabase
    .from('conselho_classe_resultados')
    .select('aluno_id, matriz_disciplina_id, nota_conselho, parecer')
    .eq('turma_id', turmaId)
    .eq('periodo', periodo)

  const conselhoKey = (alunoId: string, discId: string) => `${alunoId}|${discId}`
  const conselhoMap = new Map<string, { nota_conselho: number | null; parecer: string | null }>()
  for (const r of resultadosConselho || []) {
    conselhoMap.set(conselhoKey(r.aluno_id, r.matriz_disciplina_id), {
      nota_conselho: r.nota_conselho,
      parecer: r.parecer,
    })
  }

  const notasPorAlunoDisc = new Map<string, { valor: number; descricao: string | null }[]>()
  for (const n of notas || []) {
    const key = `${n.aluno_id}|${n.disciplina_id}`
    if (!notasPorAlunoDisc.has(key)) {
      notasPorAlunoDisc.set(key, [])
    }
    if (n.valor !== null) {
      notasPorAlunoDisc.get(key)!.push({ valor: Number(n.valor), descricao: n.descricao })
    }
  }

  type FreqEntry = { presencas: number; faltas: number; total: number }
  const freqPorAlunoDisc = new Map<string, FreqEntry>()
  const freqPorAluno = new Map<string, FreqEntry>()

  if (criterioFrequencia === 'por_aula') {
    const { data: freqAulas } = await supabase
      .from('academico_frequencias_aula')
      .select('aluno_id, disciplina_id, status')
      .eq('turma_id', turmaId)
      .in('aluno_id', alunoIds)
      .in('disciplina_id', disciplinaIds)
    for (const f of freqAulas || []) {
      if (!f.status) continue
      const key = `${f.aluno_id}|${f.disciplina_id}`
      const e = freqPorAlunoDisc.get(key) || { presencas: 0, faltas: 0, total: 0 }
      e.total++
      if (f.status === 'P' || f.status === 'FJ') e.presencas++
      if (f.status === 'F' || f.status === 'FJ') e.faltas++
      freqPorAlunoDisc.set(key, e)
    }
  } else {
    const { data: freqDias } = await supabase
      .from('academico_frequencias_dia')
      .select('aluno_id, status')
      .eq('turma_id', turmaId)
      .in('aluno_id', alunoIds)
    for (const f of freqDias || []) {
      if (!f.status) continue
      const e = freqPorAluno.get(f.aluno_id) || { presencas: 0, faltas: 0, total: 0 }
      e.total++
      if (f.status === 'P' || f.status === 'FJ') e.presencas++
      if (f.status === 'F' || f.status === 'FJ') e.faltas++
      freqPorAluno.set(f.aluno_id, e)
    }
  }

  const resultado: AlunoDesempenho[] = []

  for (const alunoId of alunoIds) {
    const disciplinasAluno: DisciplinaDesempenho[] = []

    for (const disc of disciplinas as any[]) {
      const discId = disc.matriz_disciplina_id
      const notasAluno = notasPorAlunoDisc.get(`${alunoId}|${discId}`) || []
      const conselho = conselhoMap.get(conselhoKey(alunoId, discId))

      let mediaPeriodo: number | null = null

      if (notasAluno.length > 0) {
        if (tipoMedia === 'somatoria') {
          const soma = notasAluno.reduce((a, n) => a + n.valor, 0)
          mediaPeriodo = Math.min(soma, mediaMaxima)
        } else {
          let somaPonderada = 0
          let somaPesos = 0
          for (const n of notasAluno) {
            const peso = pesoMap.get(n.descricao || '') ?? 1
            somaPonderada += n.valor * peso
            somaPesos += peso
          }
          mediaPeriodo = somaPesos > 0 ? somaPonderada / somaPesos : null
          if (mediaPeriodo !== null) {
            mediaPeriodo = Math.min(mediaPeriodo, mediaMaxima)
            mediaPeriodo = Math.round(mediaPeriodo * 100) / 100
          }
        }
      }

      if (mediaPeriodo !== null && mediaPeriodo < mediaMinima) {
        const notaConselho = conselho?.nota_conselho ?? null
        let mediaPeriodoEfetiva = mediaPeriodo
        if (notaConselho !== null) {
          mediaPeriodoEfetiva = recuperacaoPeriodoSubstitutiva
            ? Math.max(mediaPeriodo, notaConselho)
            : notaConselho
        }
        const freq = criterioFrequencia === 'por_aula'
          ? freqPorAlunoDisc.get(`${alunoId}|${discId}`)
          : freqPorAluno.get(alunoId)
        const frequencia = freq && freq.total > 0 ? Math.round((freq.presencas / freq.total) * 100) : null
        const totalFaltas = freq ? freq.faltas : null
        disciplinasAluno.push({
          disciplina_id: discId,
          nome: (disc.academico_matriz_disciplinas as any)?.academico_disciplinas?.nome || '',
          frequencia,
          total_faltas: totalFaltas,
          media_periodo: mediaPeriodoEfetiva,
          media_minima: mediaMinima,
          nota_conselho: notaConselho,
          parecer: conselho?.parecer ?? null,
        })
      }
    }

    if (disciplinasAluno.length > 0) {
      resultado.push({
        aluno_id: alunoId,
        nome: nomeMap.get(alunoId) || '',
        disciplinas: disciplinasAluno,
      })
    }
  }

  return resultado
}

export async function listarAlunosReprovados(
  schoolId: string | null,
  turmaId: string
): Promise<AlunoReprovado[]> {
  let query = supabase
    .from('academico_matriculas')
    .select('id, aluno_id, situacao')
    .eq('turma_id', turmaId)
    .in('situacao', ['Reprovado', 'Reprovado por frequência'])

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data: matriculas } = await query

  if (!matriculas?.length) return []

  const alunoIds = matriculas.map(m => m.aluno_id)

  const { data: pessoas } = await supabase
    .from('people')
    .select('id, nome_completo')
    .in('id', alunoIds)

  const nomeMap = new Map<string, string>()
  for (const p of pessoas || []) {
    nomeMap.set(p.id, p.nome_completo)
  }

  return matriculas.map(m => ({
    matricula_id: m.id,
    aluno_id: m.aluno_id,
    nome: nomeMap.get(m.aluno_id) || '',
    situacao: m.situacao,
  }))
}

export async function salvarNotaConselho(
  schoolId: string | null,
  turmaId: string,
  matrizDisciplinaId: string,
  alunoId: string,
  periodo: number,
  notaConselho: number | null,
  parecer: string | null,
  pessoaId: string | null
) {
  try {
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.conselho-classe', 'editar')
    }

    const { data: existing } = await supabase
      .from('conselho_classe_resultados')
      .select('id')
      .eq('turma_id', turmaId)
      .eq('matriz_disciplina_id', matrizDisciplinaId)
      .eq('aluno_id', alunoId)
      .eq('periodo', periodo)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase
        .from('conselho_classe_resultados')
        .update({
          nota_conselho: notaConselho,
          parecer,
          updated_by: pessoaId,
        })
        .eq('id', existing.id)

      if (error) return { success: false as const, error: error.message }
    } else {
      const { error } = await supabase
        .from('conselho_classe_resultados')
        .insert({
          school_id: schoolId,
          turma_id: turmaId,
          matriz_disciplina_id: matrizDisciplinaId,
          aluno_id: alunoId,
          periodo,
          nota_conselho: notaConselho,
          parecer,
          created_by: pessoaId,
          updated_by: pessoaId,
        })

      if (error) return { success: false as const, error: error.message }
    }

    await registrarConselhoAgg(pessoaId, turmaId, matrizDisciplinaId, periodo, 1, 'conselho_classe_resultados')

    return { success: true as const }
  } catch (e: any) {
    return { success: false as const, error: e?.message || 'Erro interno ao salvar' }
  }
}

export async function alternarAprovacaoConselho(
  schoolId: string | null,
  matriculaId: string,
  aprovado: boolean,
  pessoaId: string | null
) {
  try {
    if (pessoaId) {
      const { validarPermissaoServer } = await import('./perfis')
      await validarPermissaoServer(pessoaId, 'gestao-pedagogica.conselho-classe', 'editar')
    }

    const { data: matricula } = await supabase
      .from('academico_matriculas')
      .select('turma_id')
      .eq('id', matriculaId)
      .maybeSingle()

    const { error } = await supabase
      .from('academico_matriculas')
      .update({
        situacao: aprovado ? 'Aprovado por conselho de classe' : 'Reprovado',
      })
      .eq('id', matriculaId)
      .eq('school_id', schoolId)

    if (error) return { success: false as const, error: error.message }

    if (matricula?.turma_id) {
      const { data: turma } = await supabase.from('turmas').select('school_id, nome').eq('id', matricula.turma_id).maybeSingle()
      await registrarAuditoriaAgregada({
        school_id: turma?.school_id || schoolId,
        pessoa_id: pessoaId || null,
        modulo: 'Conselho de Classe',
        entidade: 'academico_matriculas',
        entidade_id: matricula.turma_id,
        registro_nome: turma?.nome || null,
        resumo: {
          turma: turma?.nome || null,
          turma_id: matricula.turma_id,
          disciplina: null,
          periodo: null,
          quantidade: 1,
        },
      })
    }

    return { success: true as const }
  } catch (e: any) {
    return { success: false as const, error: e?.message || 'Erro interno ao alternar aprovação' }
  }
}

export async function listarTurmasConselho(schoolId: string | null, anoLetivoId: string) {
  let query = supabase
    .from('turmas')
    .select('id, nome, turnos')
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
    .order('nome')

  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query

  if (error) throw error
  return (data || []) as { id: string; nome: string; turnos: string[] }[]
}

export async function listarDisciplinasConselho(turmaId: string) {
  const { data, error } = await supabase
    .from('turmas_disciplinas')
    .select('matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
    .eq('turma_id', turmaId)

  if (error) throw error
  return ((data || []) as any[]).map((d: any) => ({
    matriz_disciplina_id: d.matriz_disciplina_id,
    nome: d.academico_matriz_disciplinas?.academico_disciplinas?.nome || '',
  }))
}
