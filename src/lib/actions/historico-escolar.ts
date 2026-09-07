'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { validarPermissaoDocumentos, montarEscola, type IdentidadeEscola } from './documentos'
import { resolverMetodoBoletim } from './boletim'
import { calcularDesempenhoAluno } from './avaliacoes-numericas'
import { listarHistoricoManual } from './historico-manual'

const supabase = getSupabaseAdmin()

// ─── Tipos ───

export type DisciplinaHistorico = {
  nome: string
  nota: number | null
}

export type AnoHistorico = {
  key: string
  origem: 'sistema' | 'manual'
  anoRotulo: string
  anoOrdenacao: number
  unidadeEscolar: string | null
  localidade: string | null
  etapa: string | null
  turma: string | null
  situacao: string | null
  emAndamento: boolean
  numerico: boolean
  disciplinas: DisciplinaHistorico[]
}

export type DadosHistoricoEscolar = {
  aluno: {
    nome_completo: string
    data_nascimento: string | null
    cpf: string | null
    inep_id: string | null
  }
  anos: AnoHistorico[]
  escola: IdentidadeEscola
}

// ─── Busca de alunos (todos os anos da escola) ───

export type AlunoHistoricoResumo = {
  id: string
  nome_completo: string
  cpf: string | null
  turma_nome: string | null
  situacao: string | null
}

export async function buscarAlunosComHistorico(
  termo: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<AlunoHistoricoResumo[]> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const t = termo.trim()
  if (t.length < 3) return []
  const cpfDigits = t.replace(/\D/g, '')

  let pessoasQuery = supabase.from('people').select('id, nome_completo, cpf')

  if (schoolId) pessoasQuery = pessoasQuery.eq('school_id', schoolId)

  pessoasQuery = cpfDigits
    ? pessoasQuery.or(`nome_completo.ilike.%${t}%,cpf.ilike.%${cpfDigits}%`)
    : pessoasQuery.ilike('nome_completo', `%${t}%`)

  const { data: pessoas, error: pessoasError } = await pessoasQuery.limit(30)

  if (pessoasError) throw new Error(`Erro ao buscar alunos: ${pessoasError.message}`)
  if (!pessoas || pessoas.length === 0) return []

  const ids = pessoas.map(p => p.id)

  const { data: matriculas, error: matError } = await supabase
    .from('academico_matriculas')
    .select('aluno_id, situacao, ativo, data_matricula, turma:turma_id(nome)')
    .eq('school_id', schoolId)
    .in('aluno_id', ids)

  if (matError) throw new Error(`Erro ao buscar matrículas: ${matError.message}`)

  const porAluno = new Map<string, AlunoHistoricoResumo>()
  const ordenadas = [...(matriculas || [])].sort(
    (a, b) =>
      Number(b.ativo) - Number(a.ativo) ||
      String(b.data_matricula || '').localeCompare(String(a.data_matricula || ''))
  )

  for (const m of ordenadas) {
    if (porAluno.has(m.aluno_id)) continue
    const p = pessoas.find(x => x.id === m.aluno_id)
    if (!p) continue
    porAluno.set(m.aluno_id, {
      id: p.id,
      nome_completo: p.nome_completo,
      cpf: p.cpf,
      turma_nome: (m.turma as unknown as { nome?: string } | null)?.nome || null,
      situacao: m.situacao || null,
    })
  }

  return Array.from(porAluno.values())
}

// ─── Dados do documento ───

type RawMatriculaHistorico = {
  id: string
  situacao: string
  ativo: boolean
  data_matricula: string | null
  ano_letivo_id: string
  turma: { id: string; nome: string; fechada: boolean; data_fechamento: string | null } | null
  etapa: { etapa_nome: string } | null
  academico_anos_letivos: { descricao: string } | null
}

function extrairAno(descricao: string): number {
  const m = descricao.match(/\d{4}/)
  return m ? Number(m[0]) : 0
}

export async function getDadosHistoricoEscolar(
  alunoId: string,
  _anoLetivoId: string,
  schoolId: string,
  pessoaId?: string | null
): Promise<DadosHistoricoEscolar> {
  await validarPermissaoDocumentos(pessoaId, 'documentos.oficiais')

  const { data: pessoa } = await supabase
    .from('people')
    .select('nome_completo, data_nascimento, cpf, inep_id')
    .eq('id', alunoId)
    .maybeSingle()

  if (!pessoa) {
    throw new Error('Aluno não encontrado.')
  }

  const { data: rawMatriculas, error: matError } = await supabase
    .from('academico_matriculas')
    .select(
      'id, situacao, ativo, data_matricula, ano_letivo_id, ' +
        'turma:turma_id(id, nome, fechada, data_fechamento), ' +
        'etapa:etapa_ensino_id(etapa_nome), academico_anos_letivos(descricao)'
    )
    .eq('school_id', schoolId)
    .eq('aluno_id', alunoId)

  if (matError) throw new Error(`Erro ao carregar a trajetória do aluno: ${matError.message}`)

  const matriculas = (rawMatriculas || []) as unknown as RawMatriculaHistorico[]

  const escola = await montarEscola(schoolId)
  const unidadeAtual = escola.nome_fantasia || escola.nome_escola || null

  // Agrupa por ano letivo; elege a matrícula representante:
  // prefere a turma em que o Fechamento foi efetivamente realizado.
  const porAno = new Map<string, RawMatriculaHistorico[]>()
  for (const m of matriculas) {
    if (!m.ano_letivo_id) continue
    if (!porAno.has(m.ano_letivo_id)) porAno.set(m.ano_letivo_id, [])
    porAno.get(m.ano_letivo_id)!.push(m)
  }

  const anos: AnoHistorico[] = []

  for (const [, grupo] of porAno) {
    const ordenado = [...grupo].sort(
      (a, b) =>
        Number(b.turma?.fechada ?? false) - Number(a.turma?.fechada ?? false) ||
        String(b.turma?.data_fechamento || '').localeCompare(String(a.turma?.data_fechamento || '')) ||
        Number(b.ativo) - Number(a.ativo) ||
        String(b.data_matricula || '').localeCompare(String(a.data_matricula || ''))
    )
    const rep = ordenado[0]
    const turma = rep.turma
    if (!turma) continue

    const descricao = rep.academico_anos_letivos?.descricao || ''
    const fechada = turma.fechada === true

    const ano: AnoHistorico = {
      key: `sys-${rep.ano_letivo_id}`,
      origem: 'sistema',
      anoRotulo: descricao || '—',
      anoOrdenacao: extrairAno(descricao),
      unidadeEscolar: unidadeAtual,
      localidade: null,
      etapa: rep.etapa?.etapa_nome || null,
      turma: turma.nome || null,
      situacao: fechada ? rep.situacao || null : 'Em Andamento',
      emAndamento: !fechada,
      numerico: false,
      disciplinas: [],
    }

    if (fechada) {
      const metodo = await resolverMetodoBoletim(turma.id)
      if (metodo.temNumerico) {
        ano.numerico = true

        const { data: relacoes } = await supabase
          .from('turmas_disciplinas')
          .select(
            'matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))'
          )
          .eq('turma_id', turma.id)

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
        const disciplinas = Array.from(mapaNomes.entries())
          .map(([id, nome]) => ({ id, nome }))
          .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

        const desempenhos = await Promise.all(
          disciplinas.map(d => calcularDesempenhoAluno(turma.id, alunoId, d.id, metodo.qtd))
        )

        ano.disciplinas = disciplinas.map((d, i) => ({
          nome: d.nome,
          nota: desempenhos[i]?.media_final ?? null,
        }))
      }
    }

    anos.push(ano)
  }

  // Histórico escolar anterior (registro manual) — sem filtro de permissão extra:
  // a permissão de documentos.oficiais já foi validada acima.
  const manuais = await listarHistoricoManual(alunoId)

  for (const h of manuais) {
    const disciplinas = [...(h.disciplinas || [])]
      .map(d => ({
        nome: d.disciplina_nome || 'Disciplina',
        nota: d.media_final != null ? Number(d.media_final) : null,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

    const localidade = [h.municipio, h.estado].filter(Boolean).join('/') || null

    anos.push({
      key: `man-${h.id}`,
      origem: 'manual',
      anoRotulo: h.year_name || '—',
      anoOrdenacao: Number(h.year_name) || 0,
      unidadeEscolar: h.unidade_escolar || null,
      localidade,
      etapa: h.etapa_nome || null,
      turma: null,
      situacao: h.situacao || null,
      emAndamento: false,
      numerico: disciplinas.length > 0,
      disciplinas,
    })
  }

  anos.sort(
    (a, b) => a.anoOrdenacao - b.anoOrdenacao || a.anoRotulo.localeCompare(b.anoRotulo, 'pt-BR')
  )

  if (anos.length === 0) {
    throw new Error('Nenhum registro acadêmico encontrado para este aluno.')
  }

  return {
    aluno: {
      nome_completo: pessoa.nome_completo,
      data_nascimento: pessoa.data_nascimento || null,
      cpf: pessoa.cpf || null,
      inep_id: pessoa.inep_id || null,
    },
    anos,
    escola,
  }
}
