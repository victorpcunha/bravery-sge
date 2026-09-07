'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { validarPermissaoDocumentos, montarEscola, type IdentidadeEscola } from './documentos'

const supabase = getSupabaseAdmin()

// ─── Tipos ───

export type FiltrosRelatorioMatriculas = {
  anoLetivoId: string
  turmaId?: string | null
  situacoes?: string[]
}

export type LinhaRelatorioMatricula = {
  alunoNome: string
  turmaNome: string
  anoLetivoDescricao: string
  dataMatricula: string | null
  situacao: string
}

export type ResumoPorTurma = {
  turmaNome: string
  quantidade: number
}

export type ResumoPorSituacao = {
  situacao: string
  quantidade: number
}

export type DadosRelatorioMatriculas = {
  linhas: LinhaRelatorioMatricula[]
  total: number
  porTurma: ResumoPorTurma[]
  porSituacao: ResumoPorSituacao[]
  filtrosAplicados: {
    anoLetivoDescricao: string
    turmaNome: string | null
    situacoes: string[]
  }
  escola: IdentidadeEscola
}

export type TurmaRelatorio = {
  id: string
  nome: string
}

type RawMatriculaRelatorio = {
  situacao: string | null
  data_matricula: string | null
  aluno: { nome_completo: string } | null
  turma: { nome: string } | null
  academico_anos_letivos: { descricao: string } | null
}

// ─── Server actions ───

export async function listarTurmasRelatorioMatriculas(
  schoolId: string,
  anoLetivoId: string,
  pessoaId?: string | null
): Promise<TurmaRelatorio[]> {
  await validarPermissaoDocumentos(pessoaId, 'relatorios')

  if (!anoLetivoId) return []

  const { data, error } = await supabase
    .from('turmas')
    .select('id, nome')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)
    .order('nome', { ascending: true })

  if (error) throw new Error(`Erro ao listar turmas: ${error.message}`)
  return (data || []) as TurmaRelatorio[]
}

export async function getDadosRelatorioMatriculas(
  schoolId: string,
  filtros: FiltrosRelatorioMatriculas,
  pessoaId?: string | null
): Promise<DadosRelatorioMatriculas> {
  await validarPermissaoDocumentos(pessoaId, 'relatorios')

  const anoLetivoId = filtros.anoLetivoId?.trim()
  if (!anoLetivoId) throw new Error('Selecione o ano letivo para gerar o relatório.')

  const turmaId = filtros.turmaId?.trim() || null
  const situacoes = (filtros.situacoes || []).map(s => s.trim()).filter(Boolean)

  let query = supabase
    .from('academico_matriculas')
    .select(
      'situacao, data_matricula, ' +
        'aluno:aluno_id(nome_completo), ' +
        'turma:turma_id(nome), ' +
        'academico_anos_letivos(descricao)'
    )
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)

  if (turmaId) query = query.eq('turma_id', turmaId)
  if (situacoes.length > 0) query = query.in('situacao', situacoes)

  const { data, error } = await query

  if (error) throw new Error(`Erro ao carregar matrículas: ${error.message}`)

  const linhas: LinhaRelatorioMatricula[] = ((data || []) as unknown as RawMatriculaRelatorio[])
    .map(r => ({
      alunoNome: r.aluno?.nome_completo?.trim() || '—',
      turmaNome: r.turma?.nome?.trim() || '—',
      anoLetivoDescricao: r.academico_anos_letivos?.descricao?.trim() || '',
      dataMatricula: r.data_matricula || null,
      situacao: (r.situacao || '').trim(),
    }))
    .sort((a, b) => {
      const t = a.turmaNome.localeCompare(b.turmaNome, 'pt-BR')
      if (t !== 0) return t
      return a.alunoNome.localeCompare(b.alunoNome, 'pt-BR')
    })

  const porTurmaMap = new Map<string, number>()
  const porSituacaoMap = new Map<string, number>()
  for (const l of linhas) {
    porTurmaMap.set(l.turmaNome, (porTurmaMap.get(l.turmaNome) || 0) + 1)
    porSituacaoMap.set(l.situacao, (porSituacaoMap.get(l.situacao) || 0) + 1)
  }

  const porTurma: ResumoPorTurma[] = Array.from(porTurmaMap.entries())
    .map(([turmaNome, quantidade]) => ({ turmaNome, quantidade }))
    .sort((a, b) => a.turmaNome.localeCompare(b.turmaNome, 'pt-BR'))

  const porSituacao: ResumoPorSituacao[] = Array.from(porSituacaoMap.entries())
    .map(([situacao, quantidade]) => ({ situacao, quantidade }))
    .sort((a, b) => a.situacao.localeCompare(b.situacao, 'pt-BR'))

  const anoLetivoDescricao =
    linhas[0]?.anoLetivoDescricao ||
    (
      await supabase
        .from('academico_anos_letivos')
        .select('descricao')
        .eq('id', anoLetivoId)
        .maybeSingle()
    ).data?.descricao ||
    ''
  let turmaNomeFiltro: string | null = null
  if (turmaId) {
    const { data: turma } = await supabase.from('turmas').select('nome').eq('id', turmaId).maybeSingle()
    turmaNomeFiltro = turma?.nome || null
  }

  const escola = await montarEscola(schoolId)

  return {
    linhas,
    total: linhas.length,
    porTurma,
    porSituacao,
    filtrosAplicados: {
      anoLetivoDescricao,
      turmaNome: turmaNomeFiltro,
      situacoes: [...situacoes],
    },
    escola,
  }
}
