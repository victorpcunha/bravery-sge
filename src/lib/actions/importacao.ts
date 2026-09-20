'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import {
  MAX_LINHAS_LOTE,
  MODULO_IMPORTACAO,
  RECURSO_IMPORTACAO,
  erro,
  type ErroLinha,
  type LinhaArquivo,
  type ResultadoLote,
  type TipoImportacao,
} from '@/lib/importacao-modelos'
import {
  exigirEscopoEscola,
  validarLinhasAluno,
  validarLinhasProfissional,
  type AlunoValidado,
  type ProfissionalValidado,
} from '@/lib/importacao-validacao'
import { validarCabecalho } from '@/lib/importacao-modelos'

const supabase = getSupabaseAdmin()

async function exigirPermissao(pessoaId: string | null | undefined, acao: 'visualizar' | 'criar') {
  const { validarPermissaoEstrita } = await import('./perfis')
  await validarPermissaoEstrita(pessoaId || '', RECURSO_IMPORTACAO, acao)
}

async function exigirEscolaExiste(schoolId: string) {
  const { data, error } = await supabase.from('schools').select('id').eq('id', schoolId).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Unidade escolar não encontrada. Cadastre a unidade antes de importar.')
}

function montarResultado(
  totalRecebidas: number,
  totalCriadas: number,
  erros: ErroLinha[],
  criadosIds: string[],
): ResultadoLote {
  const ordenados = [...erros].sort((a, b) => a.linha - b.linha || a.campo.localeCompare(b.campo))
  return {
    totalRecebidas,
    totalCriadas,
    totalRejeitadas: totalRecebidas - totalCriadas,
    erros: ordenados,
    criadosIds,
  }
}

async function validarNucleo(
  schoolId: string,
  tipo: TipoImportacao,
  linhas: LinhaArquivo[],
  cabecalho?: string[],
): Promise<{ validas: (AlunoValidado | ProfissionalValidado)[]; erros: ErroLinha[]; tipo: TipoImportacao }> {
  if (!schoolId) throw new Error('Selecione a unidade escolar.')
  await exigirEscolaExiste(schoolId)
  if (cabecalho) {
    const errosCabecalho = validarCabecalho(tipo, cabecalho)
    if (errosCabecalho.length > 0) {
      const e = errosCabecalho[0]
      throw new Error(`${e.mensagem} ${e.orientacao}`)
    }
  }
  if (!linhas || linhas.length === 0) {
    throw new Error('O arquivo não tem linhas para importar. Preencha ao menos uma linha além do cabeçalho.')
  }
  if (linhas.length > MAX_LINHAS_LOTE) {
    throw new Error(`O arquivo tem ${linhas.length} linhas (limite de ${MAX_LINHAS_LOTE}). Divida em arquivos menores.`)
  }
  if (tipo === 'aluno') {
    const r = await validarLinhasAluno(schoolId, linhas)
    return { ...r, tipo }
  }
  const r = await validarLinhasProfissional(schoolId, linhas)
  return { ...r, tipo }
}

export async function validarLoteImportacao(
  schoolId: string,
  tipo: TipoImportacao,
  linhas: LinhaArquivo[],
  pessoaId?: string | null,
  cabecalho?: string[],
): Promise<ResultadoLote> {
  await exigirPermissao(pessoaId, 'visualizar')
  await exigirEscopoEscola(pessoaId, schoolId)
  const { erros } = await validarNucleo(schoolId, tipo, linhas, cabecalho)
  return montarResultado(linhas.length, 0, erros, [])
}

export async function confirmarLoteImportacao(
  schoolId: string,
  tipo: TipoImportacao,
  linhas: LinhaArquivo[],
  pessoaId?: string | null,
  cabecalho?: string[],
): Promise<ResultadoLote> {
  await exigirPermissao(pessoaId, 'criar')
  await exigirEscopoEscola(pessoaId, schoolId)
  // Revalidação integral — nenhuma confiança no preview do cliente (R-02)
  const { validas, erros, tipo: tipoValidado } = await validarNucleo(schoolId, tipo, linhas, cabecalho)

  const { createPerson } = await import('./people')
  const { registrarAuditoriaAgregada } = await import('@/lib/auditoria')

  const criadosIds: string[] = []
  const errosFinais = [...erros]
  for (const item of validas) {
    try {
      if (tipoValidado === 'aluno') {
        const a = item as AlunoValidado
        const criado = await createPerson(
          {
            school_id: schoolId,
            nome_completo: a.nome_completo,
            cpf: a.cpf,
            data_nascimento: a.data_nascimento,
            sexo: a.sexo,
            filiacao_1: a.filiacao_1,
            filiacao_2: a.filiacao_2,
            filiacao_declarada: a.filiacao_declarada,
            certidao_nascimento: a.certidao_nascimento,
            perfil: ['aluno'],
          },
          pessoaId || null,
        )
        criadosIds.push(criado.id)
      } else {
        // Profissional: só dados pessoais (5 colunas). O vínculo
        // (regime, função, situação, início, carga horária) é completado
        // depois na tela de Usuários.
        const p = item as ProfissionalValidado
        const criado = await createPerson(
          {
            school_id: schoolId,
            nome_completo: p.nome_completo,
            cpf: p.cpf,
            data_nascimento: p.data_nascimento,
            sexo: p.sexo,
            email: p.email,
            perfil: ['profissional'],
          },
          pessoaId || null,
        )
        criadosIds.push(criado.id)
      }
    } catch (e) {
      errosFinais.push(
        erro(
          (item as AlunoValidado).linha,
          'geral',
          `Não foi possível criar este ${tipoValidado === 'aluno' ? 'aluno' : 'profissional'} (${e instanceof Error ? e.message : 'erro inesperado'}).`,
          'Confira os dados da linha e tente novamente; as demais linhas válidas foram criadas.',
        ),
      )
    }
  }

  // Auditoria agregada do lote (best-effort — nunca bloqueia a importação).
  // Observação: createPerson já registra 1 auditoria individual por pessoa
  // (idêntico à criação manual na tela de Usuários); o registro abaixo é a
  // visão consolidada do lote (R-08).
  try {
    await registrarAuditoriaAgregada({
      school_id: schoolId,
      pessoa_id: pessoaId || null,
      modulo: MODULO_IMPORTACAO,
      entidade: 'people',
      registro_nome: `Importação inicial — ${tipo === 'aluno' ? 'Alunos' : 'Profissionais'}`,
      dados_novos: null,
      resumo: {
        tipo,
        totalRecebidas: linhas.length,
        totalCriadas: criadosIds.length,
        totalRejeitadas: linhas.length - criadosIds.length,
        quantidade: criadosIds.length,
      },
    })
  } catch (e) {
    console.error('[importacao] falha ao registrar auditoria agregada:', e)
  }

  return montarResultado(linhas.length, criadosIds.length, errosFinais, criadosIds)
}
