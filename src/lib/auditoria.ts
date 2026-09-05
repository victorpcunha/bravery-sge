import { getSupabaseAdmin } from '@/lib/auth'

const supabase = getSupabaseAdmin()

export type AcaoAuditoria = 'criar' | 'editar' | 'excluir'

export type DadosAuditoria = {
  school_id?: string | null
  pessoa_id?: string | null
  modulo: string
  entidade: string
  entidade_id?: string | null
  registro_nome?: string | null
  acao: AcaoAuditoria
  dados_anteriores?: Record<string, unknown> | null
  dados_novos?: Record<string, unknown> | null
}

export type ResumoAuditoria = {
  turma?: string | null
  turma_id?: string | null
  disciplina?: string | null
  periodo?: string | null
  quantidade?: number
  [key: string]: unknown
}

export type DadosAuditoriaAgregada = Omit<DadosAuditoria, 'acao' | 'dados_anteriores'> & {
  resumo: ResumoAuditoria
  dados_novos?: Record<string, unknown> | null
}

// Campos de metadados ignorados no diff por campo (mantidos nos snapshots)
const CAMPOS_IGNORADOS_DIFF = new Set(['id', 'created_at', 'updated_at', 'created_by', 'updated_by', 'deleted_at'])

function normalizarValor(valor: unknown): unknown {
  if (valor === null || valor === undefined) return ''
  if (typeof valor === 'string' && valor.trim() === '') return ''
  return valor
}

function valoresIguais(a: unknown, b: unknown): boolean {
  const na = normalizarValor(a)
  const nb = normalizarValor(b)
  if (na === '' && nb === '') return true
  if (typeof na === 'object' || typeof nb === 'object') {
    return JSON.stringify(na) === JSON.stringify(nb)
  }
  if (typeof na === 'number' && typeof nb === 'number' && Number.isNaN(na) && Number.isNaN(nb)) return true
  return na === nb || String(na) === String(nb)
}

function serializarParaExibicao(valor: unknown): unknown {
  if (valor === null || valor === undefined) return ''
  if (typeof valor === 'object') {
    try {
      return JSON.stringify(valor)
    } catch {
      return String(valor)
    }
  }
  return valor
}

/**
 * Calcula o diff campo a campo entre dois snapshots.
 * Retorna [{ campo, anterior, novo }] apenas para campos realmente alterados.
 */
export function computarAlteracoes(
  anteriores?: Record<string, unknown> | null,
  novos?: Record<string, unknown> | null
): { campo: string; anterior: unknown; novo: unknown }[] {
  if (!anteriores && !novos) return []

  const ant = anteriores || {}
  const novo = novos || {}
  const campos = new Set([...Object.keys(ant), ...Object.keys(novo)])
  const alteracoes: { campo: string; anterior: unknown; novo: unknown }[] = []

  for (const campo of campos) {
    if (CAMPOS_IGNORADOS_DIFF.has(campo)) continue
    const valorAnt = ant[campo]
    const valorNovo = novo[campo]
    if (valoresIguais(valorAnt, valorNovo)) continue
    alteracoes.push({
      campo,
      anterior: serializarParaExibicao(valorAnt),
      novo: serializarParaExibicao(valorNovo),
    })
  }

  return alteracoes
}

/**
 * Resolve um rótulo humano ("Registro afetado") a partir do registro,
 * com base na entidade. Usado na listagem e na busca da tela de auditoria.
 */
export function nomearRegistro(entidade: string, row: Record<string, unknown> | null | undefined): string {
  if (!row) return ''

  const porPrioridade: (string | undefined)[] = []
  const rowMap = row as Record<string, unknown>

  const pref = (campos: string[]) => {
    for (const c of campos) {
      const v = rowMap[c]
      if (typeof v === 'string' && v.trim() !== '') return v
      if (typeof v === 'number' && !Number.isNaN(v)) return String(v)
    }
    return undefined
  }

  switch (entidade) {
    case 'people':
      porPrioridade.push(pref(['nome_completo', 'name']))
      break
    case 'schools':
      porPrioridade.push(pref(['nome_escola', 'name']))
      break
    case 'turmas':
    case 'academico_disciplinas':
    case 'indicadores_avaliacao':
    case 'perfis':
    case 'funcoes_profissionais':
    case 'academico_subetapas':
      porPrioridade.push(pref(['nome']))
      break
    case 'academico_matrizes_curriculares':
    case 'academico_calendarios':
    case 'academico_calendario_eventos':
    case 'academico_anos_letivos':
    case 'academico_etapas_ensino':
    case 'academico_metodos_avaliacao':
      porPrioridade.push(pref(['descricao', 'nome', 'ano']))
      break
    case 'quadro_aulas':
    case 'planos_aula':
      porPrioridade.push(pref(['descricao', 'titulo', 'assunto', 'nome']))
      break
    case 'planos_ensino':
      porPrioridade.push(pref(['nome', 'titulo', 'descricao']))
      break
    case 'agenda_compromissos':
      porPrioridade.push(pref(['titulo', 'descricao', 'assunto']))
      break
    case 'academico_matriculas':
      porPrioridade.push(pref(['aluno_nome', 'nome_completo', 'numero_chamada', 'id']))
      break
    case 'academico_matriculas_movimentacoes':
      porPrioridade.push(pref(['tipo', 'id']))
      break
    default:
      porPrioridade.push(pref(['nome_completo', 'nome', 'descricao', 'titulo', 'tipo', 'label', 'name']))
  }

  porPrioridade.push(pref(['id']))
  return porPrioridade.find(p => p && p.trim() !== '') || String(rowMap.id || '')
}

/**
 * Registro de auditoria padrão (Master-Data): um registro por operação,
 * com diff campo a campo (edição) ou conteúdo completo (criação/exclusão).
 * É best-effort: falhas de auditoria nunca bloqueiam a operação principal.
 */
export async function registrarAuditoria(data: DadosAuditoria): Promise<void> {
  const alteracoes =
    data.acao === 'editar'
      ? computarAlteracoes(data.dados_anteriores, data.dados_novos)
      : null

  try {
    await supabase.from('auditoria').insert({
      school_id: data.school_id || null,
      pessoa_id: data.pessoa_id || null,
      modulo: data.modulo,
      entidade: data.entidade,
      entidade_id: data.entidade_id || null,
      registro_nome: data.registro_nome || nomearRegistro(data.entidade, data.dados_novos || data.dados_anteriores || null),
      acao: data.acao,
      dados_anteriores: data.dados_anteriores || null,
      dados_novos: data.dados_novos || null,
      alteracoes,
      resumo: null,
    })
  } catch (err) {
    console.error('Falha ao registrar auditoria:', err)
  }
}

/**
 * Registro de auditoria agregado (alto volume): um registro por sessão de
 * salvamento (Frequência, Notas, Parecer, Conselho, Fechamento), com
 * turma/disciplina/período e quantidade de alunos afetados.
 * Não gera diff campo a campo.
 */
export async function registrarAuditoriaAgregada(data: DadosAuditoriaAgregada): Promise<void> {
  try {
    await supabase.from('auditoria').insert({
      school_id: data.school_id || null,
      pessoa_id: data.pessoa_id || null,
      modulo: data.modulo,
      entidade: data.entidade,
      entidade_id: data.entidade_id || null,
      registro_nome: data.registro_nome || nomearRegistro(data.entidade, data.dados_novos || null),
      acao: 'editar',
      dados_anteriores: null,
      dados_novos: data.dados_novos || null,
      alteracoes: null,
      resumo: {
        turma: data.resumo.turma || null,
        turma_id: data.resumo.turma_id || null,
        disciplina: data.resumo.disciplina || null,
        periodo: data.resumo.periodo || null,
        quantidade: data.resumo.quantidade || 0,
      },
    })
  } catch (err) {
    console.error('Falha ao registrar auditoria agregada:', err)
  }
}