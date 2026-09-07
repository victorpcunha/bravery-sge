'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { validarPermissaoDocumentos, montarEscola, type IdentidadeEscola } from './documentos'
import {
  resolverMetodoBoletim,
  listarPeriodosAvaliativos,
  type PeriodoBoletim,
} from './boletim'
import { montarMotivoBloqueio } from '@/lib/metodo-bloqueio'
import { getNumericoConfigCompleta, type ConfigNumericaCompleta } from './avaliacoes-numericas'

const supabase = getSupabaseAdmin()

const ROTULO_RELATORIO = 'o Relatório de Desempenho'

// ─── Tipos ───

export type FiltrosRelatorioDesempenho = {
  anoLetivoId: string
  turmaId: string
  matrizDisciplinaId?: string | null
  periodoOrdem: number
}

export type DisciplinaDesempenho = {
  matrizDisciplinaId: string
  nome: string
}

export type ContextoTurmaDesempenho = {
  bloqueado: boolean
  motivo: string | null
  metodoNome: string | null
  mediaMinima: number | null
  disciplinas: DisciplinaDesempenho[]
  periodos: PeriodoBoletim[]
}

export type DisciplinaAlunoDesempenho = {
  disciplinaNome: string
  media: number
  situacao: 'acima' | 'abaixo'
}

export type AlunoRelatorioDesempenho = {
  alunoId: string
  alunoNome: string
  mediaGeral: number
  abaixoMinima: boolean
  disciplinas: DisciplinaAlunoDesempenho[]
}

export type DadosRelatorioDesempenho = {
  alunos: AlunoRelatorioDesempenho[]
  totalAlunos: number
  mediaGeral: number | null
  abaixoMinima: number
  porSituacao: { situacao: 'acima' | 'abaixo'; quantidade: number }[]
  filtrosAplicados: {
    anoLetivoDescricao: string
    turmaNome: string
    disciplinaNome: string | null
    periodoOrdem: number
    periodoNome: string
    mediaMinima: number
    metodoNome: string | null
  }
  escola: IdentidadeEscola
}

type NotaRow = {
  aluno_id: string
  disciplina_id: string
  periodo: number
  valor: number | string | null
  descricao: string | null
}

type RecRow = {
  aluno_id: string
  disciplina_id: string
  periodo: number | null
  tipo: string
  valor: number | string | null
  descricao: string | null
}

type ConselhoRow = {
  aluno_id: string
  matriz_disciplina_id: string
  periodo: number
  nota_conselho: number | string | null
}

// ─── Motor de cálculo — espelha calcularDesempenhoAluno em lote ───
// Mesmas regras do Diário/Fechamento (pesos, somatória, recuperações,
// conselho), calculadas sobre dados já carregados para a turma inteira.

function calcularMediaPeriodo(
  alunoId: string,
  discId: string,
  ordem: number,
  config: ConfigNumericaCompleta,
  notas: NotaRow[],
  recs: RecRow[],
  conselhos: ConselhoRow[]
): number | null {
  const notasDisc = notas.filter(n => n.aluno_id === alunoId && n.disciplina_id === discId)
  const recsDisc = recs.filter(r => r.aluno_id === alunoId && r.disciplina_id === discId)

  const pesoMap = new Map<string, number>()
  for (const av of config.avaliacoes_list) pesoMap.set(av.nome, av.peso)

  const recAvaliacao = new Map<string, number>()
  for (const rec of recsDisc) {
    if (rec.tipo !== 'avaliacao' || rec.periodo !== ordem || rec.valor === null || !rec.descricao) continue
    recAvaliacao.set(rec.descricao, Number(rec.valor))
  }

  const notasDoPeriodo = notasDisc
    .filter(n => n.periodo === ordem && n.valor !== null)
    .map(n => {
      const recVal = n.descricao ? recAvaliacao.get(n.descricao) : undefined
      if (recVal === undefined) return n
      return config.recuperacao_substitutiva
        ? { ...n, valor: recVal }
        : { ...n, valor: Math.max(Number(n.valor), recVal) }
    })

  let media: number | null = null
  if (notasDoPeriodo.length > 0) {
    if (config.tipo_media_periodo === 'somatoria') {
      const soma = notasDoPeriodo.reduce((acc, n) => acc + Number(n.valor), 0)
      media = Math.min(soma, config.media_maxima_periodo)
    } else {
      let somaPonderada = 0
      let somaPesos = 0
      for (const n of notasDoPeriodo) {
        const peso = pesoMap.get(n.descricao ?? '') ?? 1
        somaPonderada += Number(n.valor) * peso
        somaPesos += peso
      }
      const bruta = somaPesos > 0 ? somaPonderada / somaPesos : 0
      media = Math.round(Math.min(bruta, config.media_maxima_periodo) * 100) / 100
    }
  }

  for (const rec of recsDisc) {
    if (rec.tipo !== 'periodo' || rec.periodo !== ordem || rec.valor === null) continue
    const recVal = Number(rec.valor)
    media = config.recuperacao_periodo_substitutiva
      ? media === null ? recVal : Math.max(media, recVal)
      : recVal
  }

  for (const c of conselhos) {
    if (c.aluno_id !== alunoId || c.matriz_disciplina_id !== discId || c.periodo !== ordem) continue
    if (c.nota_conselho === null) continue
    const conselhoVal = Number(c.nota_conselho)
    media = config.recuperacao_periodo_substitutiva
      ? media === null ? conselhoVal : Math.max(media, conselhoVal)
      : conselhoVal
  }

  return media
}

// ─── Helpers ───

async function listarDisciplinasDaTurma(turmaId: string): Promise<DisciplinaDesempenho[]> {
  const { data: relacoes } = await supabase
    .from('turmas_disciplinas')
    .select(
      'matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))'
    )
    .eq('turma_id', turmaId)

  const mapaNomes = new Map<string, string>()
  for (const r of relacoes || []) {
    const md = r.academico_matriz_disciplinas as unknown as {
      disciplina_id: string
      academico_disciplinas: { nome: string } | null
    } | null
    if (!md) continue
    if (!mapaNomes.has(r.matriz_disciplina_id)) {
      mapaNomes.set(r.matriz_disciplina_id, md.academico_disciplinas?.nome || 'Disciplina')
    }
  }
  return Array.from(mapaNomes.entries())
    .map(([matrizDisciplinaId, nome]) => ({ matrizDisciplinaId, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

// ─── Server actions ───

export async function getContextoTurmaDesempenho(
  turmaId: string,
  anoLetivoId: string,
  pessoaId?: string | null
): Promise<ContextoTurmaDesempenho> {
  await validarPermissaoDocumentos(pessoaId, 'relatorios')

  if (!turmaId) throw new Error('Selecione a turma para gerar o relatório.')

  const metodo = await resolverMetodoBoletim(turmaId)

  if (!metodo.metodoId) {
    return {
      bloqueado: true,
      motivo: 'Não há Método de Avaliação configurado para a turma selecionada.',
      metodoNome: null,
      mediaMinima: null,
      disciplinas: [],
      periodos: [],
    }
  }

  if (!metodo.temNumerico) {
    return {
      bloqueado: true,
      motivo: montarMotivoBloqueio(metodo, ROTULO_RELATORIO),
      metodoNome: metodo.nome,
      mediaMinima: null,
      disciplinas: [],
      periodos: [],
    }
  }

  const [config, disciplinas, avaliativos] = await Promise.all([
    getNumericoConfigCompleta(metodo.metodoId, metodo.qtd),
    listarDisciplinasDaTurma(turmaId),
    listarPeriodosAvaliativos(anoLetivoId, turmaId, metodo.qtd),
  ])

  const periodos: PeriodoBoletim[] =
    avaliativos.length > 0
      ? avaliativos
      : Array.from({ length: metodo.qtd }, (_, i) => ({
          ordem: i + 1,
          nome: `Período ${i + 1}`,
          data_inicio: null,
          data_termino: null,
        }))

  return {
    bloqueado: false,
    motivo: null,
    metodoNome: metodo.nome,
    mediaMinima: config.media_minima,
    disciplinas,
    periodos,
  }
}

export async function getDadosRelatorioDesempenho(
  schoolId: string,
  filtros: FiltrosRelatorioDesempenho,
  pessoaId?: string | null
): Promise<DadosRelatorioDesempenho> {
  await validarPermissaoDocumentos(pessoaId, 'relatorios')

  const anoLetivoId = filtros.anoLetivoId?.trim()
  const turmaId = filtros.turmaId?.trim()
  const ordem = filtros.periodoOrdem
  if (!anoLetivoId) throw new Error('Selecione o ano letivo para gerar o relatório.')
  if (!turmaId) throw new Error('Selecione a turma para gerar o relatório.')
  if (!ordem || ordem < 1) throw new Error('Selecione o período de avaliação para gerar o relatório.')

  const metodo = await resolverMetodoBoletim(turmaId)
  if (!metodo.metodoId) {
    throw new Error('Não há Método de Avaliação configurado para a turma selecionada.')
  }
  if (!metodo.temNumerico) {
    throw new Error(montarMotivoBloqueio(metodo, ROTULO_RELATORIO))
  }
  if (ordem > metodo.qtd) {
    throw new Error('Período de avaliação inválido para o Método de Avaliação da turma.')
  }

  const disciplinaFiltro = filtros.matrizDisciplinaId?.trim() || null

  const [config, disciplinas, turmaRow, anoRow, matriculasRes, notasRes, recsRes, conselhosRes, escola] =
    await Promise.all([
      getNumericoConfigCompleta(metodo.metodoId, metodo.qtd),
      listarDisciplinasDaTurma(turmaId),
      supabase.from('turmas').select('nome').eq('id', turmaId).maybeSingle(),
      supabase.from('academico_anos_letivos').select('descricao').eq('id', anoLetivoId).maybeSingle(),
      supabase
        .from('academico_matriculas')
        .select('aluno_id')
        .eq('turma_id', turmaId)
        .eq('ativo', true),
      supabase
        .from('academico_notas')
        .select('aluno_id, disciplina_id, periodo, valor, descricao')
        .eq('turma_id', turmaId),
      supabase
        .from('academico_recuperacoes')
        .select('aluno_id, disciplina_id, periodo, tipo, valor, descricao')
        .eq('turma_id', turmaId),
      supabase
        .from('conselho_classe_resultados')
        .select('aluno_id, matriz_disciplina_id, periodo, nota_conselho')
        .eq('turma_id', turmaId),
      montarEscola(schoolId),
    ])

  if (matriculasRes.error) throw new Error(`Erro ao carregar matrículas: ${matriculasRes.error.message}`)
  if (notasRes.error) throw new Error(`Erro ao carregar notas: ${notasRes.error.message}`)
  if (recsRes.error) throw new Error(`Erro ao carregar recuperações: ${recsRes.error.message}`)
  if (conselhosRes.error) throw new Error(`Erro ao carregar conselho de classe: ${conselhosRes.error.message}`)

  const mediaMinima = config.media_minima
  const notas = (notasRes.data || []) as NotaRow[]
  const recs = (recsRes.data || []) as RecRow[]
  const conselhos = (conselhosRes.data || []) as ConselhoRow[]

  const disciplinasConsideradas = disciplinaFiltro
    ? disciplinas.filter(d => d.matrizDisciplinaId === disciplinaFiltro)
    : disciplinas

  const alunoIds = Array.from(new Set((matriculasRes.data || []).map(m => m.aluno_id)))
  const nomeMap = new Map<string, string>()
  if (alunoIds.length > 0) {
    const { data: pessoas } = await supabase.from('people').select('id, nome_completo').in('id', alunoIds)
    for (const p of pessoas || []) nomeMap.set(p.id, p.nome_completo as string)
  }

  const linhas: { alunoId: string; disciplinaNome: string; media: number }[] = []
  for (const alunoId of alunoIds) {
    for (const d of disciplinasConsideradas) {
      const media = calcularMediaPeriodo(alunoId, d.matrizDisciplinaId, ordem, config, notas, recs, conselhos)
      if (media === null) continue
      linhas.push({ alunoId, disciplinaNome: d.nome, media })
    }
  }

  const porAluno = new Map<string, { alunoId: string; alunoNome: string; itens: { disciplinaNome: string; media: number }[] }>()
  for (const alunoId of alunoIds) {
    const alunoNome = (nomeMap.get(alunoId) || '').trim() || '—'
    porAluno.set(alunoId, { alunoId, alunoNome, itens: [] })
  }
  for (const l of linhas) {
    porAluno.get(l.alunoId)?.itens.push({ disciplinaNome: l.disciplinaNome, media: l.media })
  }

  const alunos: AlunoRelatorioDesempenho[] = []
  for (const grupo of porAluno.values()) {
    if (grupo.itens.length === 0) continue
    grupo.itens.sort((a, b) => a.disciplinaNome.localeCompare(b.disciplinaNome, 'pt-BR'))
    const disciplinas = grupo.itens.map(item => ({
      disciplinaNome: item.disciplinaNome,
      media: item.media,
      situacao: (item.media >= mediaMinima ? 'acima' : 'abaixo') as 'acima' | 'abaixo',
    }))
    const mediaGeralAluno =
      Math.round((grupo.itens.reduce((acc, item) => acc + item.media, 0) / grupo.itens.length) * 100) / 100
    alunos.push({
      alunoId: grupo.alunoId,
      alunoNome: grupo.alunoNome,
      mediaGeral: mediaGeralAluno,
      abaixoMinima: disciplinas.some(d => d.situacao === 'abaixo'),
      disciplinas,
    })
  }
  alunos.sort((a, b) => a.alunoNome.localeCompare(b.alunoNome, 'pt-BR'))

  const totalAlunos = alunos.length
  const abaixoMinima = alunos.filter(a => a.abaixoMinima).length
  const todasMedias = alunos.flatMap(a => a.disciplinas.map(d => d.media))
  const mediaGeral =
    todasMedias.length > 0
      ? Math.round((todasMedias.reduce((acc, m) => acc + m, 0) / todasMedias.length) * 100) / 100
      : null

  const avaliativos = await listarPeriodosAvaliativos(anoLetivoId, turmaId, metodo.qtd)
  const periodoEncontrado = avaliativos.find(p => p.ordem === ordem)
  const periodoNome = periodoEncontrado ? periodoEncontrado.nome : `Período ${ordem}`

  return {
    alunos,
    totalAlunos,
    mediaGeral,
    abaixoMinima,
    porSituacao: [
      { situacao: 'acima', quantidade: totalAlunos - abaixoMinima },
      { situacao: 'abaixo', quantidade: abaixoMinima },
    ],
    filtrosAplicados: {
      anoLetivoDescricao: (anoRow.data?.descricao as string) || '',
      turmaNome: (turmaRow.data?.nome as string) || '',
      disciplinaNome: disciplinaFiltro
        ? (disciplinas.find(d => d.matrizDisciplinaId === disciplinaFiltro)?.nome || null)
        : null,
      periodoOrdem: ordem,
      periodoNome,
      mediaMinima,
      metodoNome: metodo.nome,
    },
    escola,
  }
}
