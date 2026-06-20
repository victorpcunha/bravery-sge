// Mapeamento funções profissionais → código INEP Registro 50 (1-9)

export interface FuncaoRegistro50 {
  nome: string
  codigo: string  // 1-9
  descricao: string
}

export const FUNCOES_REGISTRO_50: FuncaoRegistro50[] = [
  { nome: 'Docente', codigo: '1', descricao: 'Docente' },
  { nome: 'Auxiliar/Assistente Educacional', codigo: '2', descricao: 'Auxiliar/assistente educacional' },
  { nome: 'Monitor de Atividade Complementar', codigo: '3', descricao: 'Profissional/monitor de atividade complementar' },
  { nome: 'Tradutor e Intérprete de Libras', codigo: '4', descricao: 'Tradutor e Intérprete de Libras' },
  { nome: 'Docente Titular EAD', codigo: '5', descricao: 'Docente titular - coordenador de tutoria (de módulo ou disciplina) - EAD' },
  { nome: 'Docente Tutor Auxiliar EAD', codigo: '6', descricao: 'Docente tutor - auxiliar (de módulo ou disciplina) - EAD' },
  { nome: 'Guia-Intérprete', codigo: '7', descricao: 'Guia-Intérprete' },
  { nome: 'Profissional de Apoio Escolar (PCD)', codigo: '8', descricao: 'Profissional de apoio escolar para aluno(a)s com deficiência (Lei 13.146/2015)' },
  { nome: 'Instrutor da Educação Profissional', codigo: '9', descricao: 'Instrutor da Educação Profissional' },
]

export function getFuncaoCenso50(nomeFuncao: string): string {
  const match = FUNCOES_REGISTRO_50.find(
    (f) => nomeFuncao.toLowerCase().includes(f.nome.toLowerCase())
  )
  return match?.codigo || ''
}
