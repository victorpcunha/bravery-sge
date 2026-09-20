// Validação do lote da Importação Inicial (spec 039).
// Módulo neutro (sem 'use server'): helpers puros + validação por linha
// (com acesso a Supabase, no padrão de censo-situacao-final-helpers).
// Consumido pelas Server Actions de src/lib/actions/importacao.ts.

import { getSupabaseAdmin } from '@/lib/auth'
import { cpfValido } from './actions/censo-situacao-final-helpers'
import {
  CABECALHO_ALUNO,
  CABECALHO_PROFISSIONAL,
  erro,
  texto,
  type ErroLinha,
  type LinhaArquivo,
} from './importacao-modelos'

const supabase = getSupabaseAdmin()

/** Remove máscara e retorna só dígitos; null se vazio. */
export function normalizarCpf(valor: unknown): string | null {
  const digitos = texto(valor).replace(/\D/g, '')
  return digitos === '' ? null : digitos
}

/** Aceita código ('1'/'2') ou rótulo (masculino/m/feminino/f). Null se irreconhecível. */
export function normalizarSexo(valor: unknown): '1' | '2' | null {
  const t = texto(valor).toLowerCase()
  if (t === '1' || t === 'masculino' || t === 'm') return '1'
  if (t === '2' || t === 'feminino' || t === 'f') return '2'
  return null
}

/**
 * Aceita DD/MM/AAAA ou AAAA-MM-DD. Retorna ISO (AAAA-MM-DD) ou null.
 * Rejeita datas inexistentes (ex.: 31/02) e futuras quando `rejeitarFuturas`.
 */
export function parseData(valor: unknown, rejeitarFuturas = true): string | null {
  const t = texto(valor)
  if (!t) return null
  let iso: string | null = null
  const br = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  const isoMatch = t.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (br) {
    iso = `${br[3]}-${br[2]}-${br[1]}`
  } else if (isoMatch) {
    iso = t
  } else {
    return null
  }
  const d = new Date(`${iso}T12:00:00`)
  if (isNaN(d.getTime())) return null
  // Recompõe para barrar datas inexistentes normalizadas pelo Date (ex.: 31/02 → 03/03)
  const [y, m, day] = iso.split('-').map(Number)
  if (d.getFullYear() !== y || d.getMonth() + 1 !== m || d.getDate() !== day) return null
  if (rejeitarFuturas) {
    const hoje = new Date()
    const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
    if (iso > hojeISO) return null
  }
  return iso
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function emailValido(valor: unknown): boolean {
  return EMAIL_RE.test(texto(valor))
}

/** CPF com 11 dígitos + dígito verificador (helper compartilhado do Censo, R-05). */
export function cpfComDigitoValido(cpfSomenteDigitos: string): boolean {
  return cpfValido(cpfSomenteDigitos)
}

/**
 * Escopo por escola do ator (padrão managers.ts:35-47 + superadmin).
 * Superadmin (`is_super_admin`) ou pessoa inexistente/sem vínculo passa;
 * usuário comum só opera na própria escola.
 */
export async function exigirEscopoEscola(pessoaId: string | null | undefined, schoolId: string) {
  if (!pessoaId) return
  const { data: ator, error } = await supabase
    .from('people')
    .select('school_id, is_super_admin')
    .eq('id', pessoaId)
    .maybeSingle()
  if (error) throw error
  if (!ator) return
  if ((ator as any).is_super_admin) return
  if ((ator as any).school_id !== schoolId) {
    throw new Error('Acesso negado: unidade fora do seu escopo.')
  }
}

// ---------------------------------------------------------------------------
// Validação do tipo ALUNO
// ---------------------------------------------------------------------------

export type AlunoValidado = {
  linha: number
  nome_completo: string
  cpf: string | null
  data_nascimento: string
  sexo: '1' | '2'
  filiacao_1: string
  filiacao_2: string
  filiacao_declarada: '0' | '1'
  certidao_nascimento: string | null
}

function idxAluno(): Record<string, number> {
  const m: Record<string, number> = {}
  CABECALHO_ALUNO.forEach((c, i) => {
    m[c] = i
  })
  return m
}

/** CPFs já ativos na escola (1 query em lote — mesmo critério de verificarCpfDuplicado). */
async function cpfsAtivosDaEscola(schoolId: string, cpfs: string[]): Promise<Set<string>> {
  if (cpfs.length === 0) return new Set()
  const { data, error } = await supabase
    .from('people')
    .select('cpf')
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .in('cpf', cpfs)
  if (error) throw error
  return new Set(((data || []) as { cpf: string }[]).map((r) => r.cpf))
}

function validarCamposPessoais(
  linha: number,
  v: string[],
  i: Record<string, number>,
): { erros: ErroLinha[]; nome: string; cpf: string | null; nascimento: string | null; sexo: '1' | '2' | null } {
  const erros: ErroLinha[] = []
  const nome = texto(v[i['nome_completo']])
  if (!nome) {
    erros.push(erro(linha, 'Nome completo', 'Nome completo não informado.', 'Preencha o nome completo da pessoa.'))
  }

  let cpf: string | null = null
  const cpfRaw = normalizarCpf(v[i['cpf']])
  if (cpfRaw) {
    if (!/^\d{11}$/.test(cpfRaw)) {
      erros.push(erro(linha, 'CPF', 'CPF deve ter 11 dígitos.', 'Confira a digitação (só números, 11 dígitos) ou deixe em branco e informe a matrícula da certidão (alunos).'))
    } else if (!cpfComDigitoValido(cpfRaw)) {
      erros.push(erro(linha, 'CPF', 'CPF inválido (dígito verificador não confere).', 'Confira os 11 dígitos ou deixe em branco e informe a matrícula da certidão (alunos).'))
    } else {
      cpf = cpfRaw
    }
  }

  const nascimento = parseData(v[i['data_nascimento']], true)
  if (!nascimento) {
    erros.push(erro(linha, 'Data de Nascimento', 'Data de nascimento inválida ou futura.', 'Use o formato DD/MM/AAAA com uma data passada válida.'))
  }

  const sexo = normalizarSexo(v[i['sexo']])
  if (!sexo) {
    erros.push(erro(linha, 'Sexo', 'Sexo não reconhecido.', 'Informe 1 ou Masculino; 2 ou Feminino.'))
  }

  return { erros, nome, cpf, nascimento, sexo }
}

/** Valida todas as linhas do tipo aluno. Não persiste nada. */
export async function validarLinhasAluno(
  schoolId: string,
  linhas: LinhaArquivo[],
): Promise<{ validas: AlunoValidado[]; erros: ErroLinha[] }> {
  const i = idxAluno()
  const validas: AlunoValidado[] = []
  const erros: ErroLinha[] = []

  // Mapa CPF → primeira linha (duplicidade dentro do arquivo)
  const cpfPrimeiraLinha = new Map<string, number>()
  for (const l of linhas) {
    const cpf = normalizarCpf(l.valores[i['cpf']])
    if (cpf && /^\d{11}$/.test(cpf) && !cpfPrimeiraLinha.has(cpf)) {
      cpfPrimeiraLinha.set(cpf, l.numeroLinha)
    }
  }
  const cpfsEscola = await cpfsAtivosDaEscola(schoolId, [...cpfPrimeiraLinha.keys()])

  for (const l of linhas) {
    const v = l.valores
    const base = validarCamposPessoais(l.numeroLinha, v, i)
    const linhaErros = [...base.erros]

    const certidao = texto(v[i['matricula_certidao']])
    if (certidao.length > 32) {
      linhaErros.push(erro(l.numeroLinha, 'Matrícula da certidão', 'Matrícula da certidão excede 32 caracteres.', 'Confira a matrícula da certidão de nascimento.'))
    }
    if (!base.cpf && !certidao) {
      linhaErros.push(erro(l.numeroLinha, 'CPF', 'CPF e matrícula da certidão ausentes — ao menos um é obrigatório.', 'Informe o CPF (11 dígitos válidos) ou a matrícula da certidão de nascimento.'))
    }
    if (base.cpf) {
      const primeira = cpfPrimeiraLinha.get(base.cpf)
      if (primeira !== undefined && primeira !== l.numeroLinha) {
        linhaErros.push(erro(l.numeroLinha, 'CPF', `CPF repetido no arquivo (primeira ocorrência na linha ${primeira}).`, 'Remova a linha duplicada ou corrija o CPF.'))
      }
      if (cpfsEscola.has(base.cpf)) {
        linhaErros.push(erro(l.numeroLinha, 'CPF', 'Já existe uma pessoa ativa com este CPF nesta escola.', 'Trate o caso manualmente na tela de Usuários; a linha não será importada nem alterará o cadastro existente.'))
      }
    }

    if (linhaErros.length > 0) {
      erros.push(...linhaErros)
      continue
    }

    const fil1 = ''
    const fil2 = ''
    validas.push({
      linha: l.numeroLinha,
      nome_completo: base.nome,
      cpf: base.cpf,
      data_nascimento: base.nascimento as string,
      sexo: base.sexo as '1' | '2',
      filiacao_1: fil1 || 'Não declarado',
      filiacao_2: fil2 || 'Não declarado',
      filiacao_declarada: fil1 || fil2 ? '1' : '0',
      certidao_nascimento: certidao || null,
    })
  }

  return { validas, erros }
}

// ---------------------------------------------------------------------------
// Validação do tipo PROFISSIONAL
// ---------------------------------------------------------------------------

export type ProfissionalValidado = {
  linha: number
  nome_completo: string
  cpf: string
  data_nascimento: string
  sexo: '1' | '2'
  email: string
}

function idxProfissional(): Record<string, number> {
  const m: Record<string, number> = {}
  CABECALHO_PROFISSIONAL.forEach((c, i) => {
    m[c] = i
  })
  return m
}

/** Valida todas as linhas do tipo profissional. Não persiste nada. */
export async function validarLinhasProfissional(
  schoolId: string,
  linhas: LinhaArquivo[],
): Promise<{ validas: ProfissionalValidado[]; erros: ErroLinha[] }> {
  const i = idxProfissional()
  const validas: ProfissionalValidado[] = []
  const erros: ErroLinha[] = []

  const cpfPrimeiraLinha = new Map<string, number>()
  for (const l of linhas) {
    const cpf = normalizarCpf(l.valores[i['cpf']])
    if (cpf && /^\d{11}$/.test(cpf) && !cpfPrimeiraLinha.has(cpf)) {
      cpfPrimeiraLinha.set(cpf, l.numeroLinha)
    }
  }
  const cpfsEscola = await cpfsAtivosDaEscola(schoolId, [...cpfPrimeiraLinha.keys()])

  for (const l of linhas) {
    const v = l.valores
    const base = validarCamposPessoais(l.numeroLinha, v, i)
    const linhaErros = [...base.erros]

    if (!base.cpf) {
      linhaErros.push(erro(l.numeroLinha, 'CPF', 'CPF é obrigatório para Profissional.', 'Informe um CPF válido com 11 dígitos.'))
    } else {
      const primeira = cpfPrimeiraLinha.get(base.cpf)
      if (primeira !== undefined && primeira !== l.numeroLinha) {
        linhaErros.push(erro(l.numeroLinha, 'CPF', `CPF repetido no arquivo (primeira ocorrência na linha ${primeira}).`, 'Remova a linha duplicada ou corrija o CPF.'))
      }
      if (cpfsEscola.has(base.cpf)) {
        linhaErros.push(erro(l.numeroLinha, 'CPF', 'Já existe uma pessoa ativa com este CPF nesta escola.', 'Trate o caso manualmente na tela de Usuários; a linha não será importada nem alterará o cadastro existente.'))
      }
    }

    const email = texto(v[i['email']])
    if (!email) {
      linhaErros.push(erro(l.numeroLinha, 'E-mail', 'E-mail é obrigatório para Profissional.', 'Informe o e-mail do profissional.'))
    } else if (!emailValido(email)) {
      linhaErros.push(erro(l.numeroLinha, 'E-mail', 'E-mail em formato inválido.', 'Confira o endereço (ex.: nome@escola.edu.br).'))
    }

    if (linhaErros.length > 0) {
      erros.push(...linhaErros)
      continue
    }

    validas.push({
      linha: l.numeroLinha,
      nome_completo: base.nome,
      cpf: base.cpf as string,
      data_nascimento: base.nascimento as string,
      sexo: base.sexo as '1' | '2',
      email,
    })
  }

  return { validas, erros }
}
