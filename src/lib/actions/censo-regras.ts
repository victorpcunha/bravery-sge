'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { getFuncaoCenso50 } from '@/data/censo/funcoes-registro-50'
import type { ErroValidacao, ResultadoValidacao } from './censo-types'

// Reference data (INEP catalog tables / Annexes)
import { IDADES_PERMITIDAS } from '@/data/censo/idades-permitidas'
import { RECURSOS_DEFICIENCIAS, RECURSOS_TRANSTORNOS } from '@/data/censo/recursos-deficiencias'
import { FORMAS_CONTRATACAO } from '@/data/censo/contratacao-dependencia'
import { ETAPAS_FORMAS_ORGANIZACAO } from '@/data/censo/etapas-formas-organizacao'
import { ETAPAS_ENSINO } from '@/data/censo/etapas-ensino'
import { AREAS_CONHECIMENTO } from '@/data/censo/areas-conhecimento'
import { COMPATIBILIDADE_MEDIACAO_TURMA_ETAPA } from '@/data/censo/tipo-turma-mediacao'
import { MUNICIPIOS_CEARA } from '@/data/censo/municipios-ceara'

const supabase = getSupabaseAdmin()

// ---------------------------------------------------------------------------
// MAIN ENTRY POINT
// ---------------------------------------------------------------------------

export async function validarCenso(
  schoolId: string,
  anoLetivoId: string,
): Promise<ResultadoValidacao> {
  const resultado: ResultadoValidacao = {
    valido: false,
    total_erros: 0,
    erros_por_registro: {
      registro00: [],
      registro10: [],
      registro20: [],
      registro30: [],
      registro40: [],
      registro50: [],
      registro60: [],
    },
    erros_vinculos: [],
  }

  const [
    erros00,
    erros10,
    erros20,
    erros30,
    erros40,
    erros50,
    erros60,
    errosVinculos,
    errosDescaracterizacao,
    errosHorarios,
  ] = await Promise.all([
    validarRegistro00(schoolId, anoLetivoId),
    validarRegistro10(schoolId),
    validarRegistro20(schoolId),
    validarRegistro30(schoolId),
    validarRegistro40(schoolId),
    validarRegistro50(schoolId),
    validarRegistro60(schoolId),
    validarVinculosAluno(schoolId),
    validarDescaracterizacao(schoolId),
    validarHorariosCoincidentes(schoolId),
  ])

  resultado.erros_por_registro.registro00 = erros00
  resultado.erros_por_registro.registro10 = erros10
  resultado.erros_por_registro.registro20 = erros20
  resultado.erros_por_registro.registro30 = erros30
  resultado.erros_por_registro.registro40 = erros40
  resultado.erros_por_registro.registro50 = erros50
  resultado.erros_por_registro.registro60 = erros60

  // Cross-cutting errors go into erros_vinculos for now
  resultado.erros_vinculos = [
    ...errosVinculos,
    ...errosDescaracterizacao,
    ...errosHorarios,
  ]

  resultado.total_erros =
    erros00.length +
    erros10.length +
    erros20.length +
    erros30.length +
    erros40.length +
    erros50.length +
    erros60.length +
    resultado.erros_vinculos.length

  resultado.valido = resultado.total_erros === 0

  return resultado
}

// ---------------------------------------------------------------------------
// REGISTRO 00 — DADOS DA ESCOLA
// ---------------------------------------------------------------------------

export async function validarRegistro00(schoolId: string, anoLetivoId?: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single()

  if (error || !school) {
    erros.push(
      criarErro(
        '00', 'id', 0,
        'Registro obrigatório',
        'Escola não encontrada no banco de dados.',
        schoolId, schoolId, schoolId,
        schoolId,
      ),
    )
    return erros
  }

  const { data: anoLetivo } = anoLetivoId
    ? await supabase
        .from('academico_anos_letivos')
        .select('id, descricao, data_inicio, data_termino, status')
        .eq('id', anoLetivoId)
        .single()
    : { data: null }

  const entidadeId = schoolId
  const entidadeNome = school.nome_escola || schoolId

  const addErro = (
    campo_inep: string,
    numero_campo: number,
    regra: string,
    mensagem: string,
    valor_atual?: string,
    secao?: string,
    campo_destino?: string,
  ) => {
    erros.push(
      criarErro(
        '00', campo_inep, numero_campo, regra, mensagem,
        entidadeId, entidadeNome, schoolId,
        valor_atual, secao, campo_destino,
      ),
    )
  }

  const situacao = school.situacao_funcionamento
  const isAtiva = situacao === '1'
  const dependencia = school.dependencia_administrativa

  // -----------------------------------------------------------------------
  // 1. OBRIGATORIEDADE BÁSICA
  // -----------------------------------------------------------------------

  // 1a. codigo_inep — obrigatório, 8 dígitos numéricos
  const codigoInep = school.codigo_inep
  if (!codigoInep || !/^\d{8}$/.test(codigoInep)) {
    addErro(
      'codigo_inep', 2,
      'Código INEP da escola',
      'Deve ter 8 caracteres numéricos.',
      codigoInep || '(vazio)',
      'identificacao',
      'codigo_inep',
    )
  }

  // 1b. situacao_funcionamento — obrigatório, 1, 2 ou 3
  if (!situacao || !/^[123]$/.test(situacao)) {
    addErro(
      'situacao_funcionamento', 3,
      'Situação de funcionamento',
      'Deve ser 1, 2 ou 3.',
      situacao || '(vazio)',
      'identificacao',
      'situacao_funcionamento',
    )
  }

  // 1c. nome_escola — obrigatório, 4 a 100 caracteres, apenas A-Z 0-9 ª º -
  const nomeEscola = school.nome_escola
  if (!nomeEscola) {
    addErro(
      'nome_escola', 6,
      'Nome da escola',
      'Deve ter de 4 a 100 caracteres permitidos.',
      '(vazio)',
      'identificacao',
      'nome_escola',
    )
  } else if (
    nomeEscola.length < 4 ||
    nomeEscola.length > 100 ||
    !/^[A-Za-zÀ-ÿ0-9 ªº\-\.\/\s]+$/.test(nomeEscola)
  ) {
    addErro(
      'nome_escola', 6,
      'Nome da escola',
      'Deve ter de 4 a 100 caracteres permitidos (letras, números, ª, º, hífen, espaço).',
      nomeEscola,
      'identificacao',
      'nome_escola',
    )
  }

  // 1d. localizacao — obrigatório, 1 ou 2
  const localizacao = school.localizacao
  if (!localizacao || !/^[12]$/.test(localizacao)) {
    addErro(
      'localizacao', 20,
      'Localização',
      'Deve ser 1 ou 2.',
      localizacao || '(vazio)',
      'identificacao',
      'localizacao',
    )
  }

  // 1e. localizacao_diferenciada — obrigatório, 1/2/3/7/8
  const locDif = school.localizacao_diferenciada
  if (!locDif || !/^[12378]$/.test(locDif)) {
    addErro(
      'localizacao_diferenciada', 21,
      'Localização diferenciada',
      'Deve ser 1, 2, 3, 7 ou 8.',
      locDif || '(vazio)',
      'identificacao',
      'localizacao_diferenciada',
    )
  }

  // 1f. dependencia_administrativa — obrigatório, 1-4
  if (!dependencia || !/^[1234]$/.test(dependencia)) {
    addErro(
      'dependencia_administrativa', 19,
      'Dependência administrativa',
      'Deve ser 1, 2, 3 ou 4.',
      dependencia || '(vazio)',
      'identificacao',
      'dependencia_administrativa',
    )
  }

  // -----------------------------------------------------------------------
  // Only run situational validations when situacao is valid
  // (if situacao is invalid, no point validating conditional fields)
  // -----------------------------------------------------------------------
  const situacaoValida = !!(situacao && /^[123]$/.test(situacao))

  // -----------------------------------------------------------------------
  // 2. ENDEREÇO
  // -----------------------------------------------------------------------

  // 2a. cep — 8 dígitos numéricos
  const cep = school.cep
  if (cep && !/^\d{8}$/.test(cep)) {
    addErro(
      'cep', 7,
      'CEP',
      'Deve ter 8 caracteres numéricos.',
      cep,
      'endereco',
      'cep',
    )
  }

  // 2b. municipio — 7 dígitos numéricos
  const municipio = school.municipio
  if (municipio && !/^\d{7}$/.test(municipio)) {
    addErro(
      'municipio', 9,
      'Código do município',
      'Deve ter 7 caracteres numéricos.',
      municipio,
      'endereco',
      'municipio',
    )
  }

  // 2c. distrito — 2 dígitos numéricos
  const distrito = school.distrito
  if (distrito && !/^\d{2}$/.test(distrito)) {
    addErro(
      'distrito', 8,
      'Código do distrito',
      'Deve ter 2 caracteres numéricos.',
      distrito,
      'endereco',
      'distrito',
    )
  }

  // 2d. endereco — até 100 caracteres permitidos
  const endereco = school.endereco
  if (endereco && endereco.length > 100) {
    addErro(
      'endereco', 10,
      'Endereço da escola',
      'Deve ter até 100 caracteres permitidos.',
      endereco.substring(0, 100) + '...',
      'endereco',
      'endereco',
    )
  }

  // -----------------------------------------------------------------------
  // 3. DATAS DO ANO LETIVO (apenas quando situacao = '1')
  // -----------------------------------------------------------------------

  if (isAtiva) {
    const dataInicio = anoLetivo?.data_inicio || school.data_inicio_ano
    const dataFim = anoLetivo?.data_termino || school.data_fim_ano

    if (!dataInicio) {
      addErro(
        'data_inicio_ano', 4,
        'Data de início do ano letivo',
        'Data de início do ano letivo é obrigatória quando a escola está em atividade.',
        '(vazio)',
        'ano-letivo',
        'data_inicio_ano',
      )
    } else if (isNaN(new Date(dataInicio).getTime())) {
      addErro(
        'data_inicio_ano', 4,
        'Data de início do ano letivo',
        'Data de início do ano letivo inválida.',
        String(dataInicio),
        'ano-letivo',
        'data_inicio_ano',
      )
    }

    if (!dataFim) {
      addErro(
        'data_fim_ano', 5,
        'Data de término do ano letivo',
        'Data de término do ano letivo é obrigatória quando a escola está em atividade.',
        '(vazio)',
        'ano-letivo',
        'data_fim_ano',
      )
    } else if (isNaN(new Date(dataFim).getTime())) {
      addErro(
        'data_fim_ano', 5,
        'Data de término do ano letivo',
        'Data de término do ano letivo inválida.',
        String(dataFim),
        'ano-letivo',
        'data_fim_ano',
      )
    } else if (dataInicio && new Date(dataInicio) >= new Date(dataFim)) {
      addErro(
        'data_fim_ano', 5,
        'Data de término do ano letivo',
        'Deve ser posterior à data de início do ano letivo.',
        new Date(dataFim).toLocaleDateString('pt-BR'),
        'ano-letivo',
        'data_fim_ano',
      )
    }
  }

  // -----------------------------------------------------------------------
  // 4. TELEFONE
  // -----------------------------------------------------------------------

  const ddd = school.ddd
  const tel1 = school.telefone_1
  const tel2 = school.telefone_2

  // 4a. DDD: se preenchido, 2 dígitos
  if (ddd && !/^\d{2}$/.test(ddd)) {
    addErro(
      'ddd', 14,
      'DDD',
      'Deve ter 2 caracteres numéricos.',
      ddd,
      'contato',
      'ddd',
    )
  }

  // 4b. DDD × Município: DDD deve corresponder à Tabela de DDD do INEP
  if (ddd && /^\d{2}$/.test(ddd) && municipio && /^\d{7}$/.test(municipio)) {
    const municipioEncontrado = MUNICIPIOS_CEARA.find(m => m.codigo === municipio)
    if (municipioEncontrado && municipioEncontrado.ddd && ddd !== municipioEncontrado.ddd) {
      addErro(
        'ddd', 14,
        'DDD × Município',
        `O DDD deve corresponder à Tabela de DDD do Censo Escolar para ${municipioEncontrado.nome}.`,
        ddd,
        'contato',
        'ddd',
      )
    }
  }

  const validarTelefone = (
    valor: string | null | undefined,
    campo: string,
    numCampo: number,
  ): boolean => {
    if (!valor) return true
    if (!/^\d{8,9}$/.test(valor)) {
      addErro(
        campo, numCampo,
        'Telefone',
        'Deve ter 8 ou 9 caracteres numéricos.',
        valor,
        'contato',
        campo,
      )
      return false
    }
    if (/(\d)\1{7,8}/.test(valor)) {
      addErro(
        campo, numCampo,
        'Telefone',
        'Não pode ter todos os dígitos iguais.',
        valor,
        'contato',
        campo,
      )
      return false
    }
    if (valor.length === 9 && valor[0] !== '9') {
      addErro(
        campo, numCampo,
        'Telefone',
        'Telefone com 9 dígitos deve iniciar com 9.',
        valor,
        'contato',
        campo,
      )
      return false
    }
    return true
  }

  validarTelefone(tel1, 'telefone_1', 15)
  validarTelefone(tel2, 'telefone_2', 16)

  // Telefone 2 deve ser diferente de telefone 1
  if (tel1 && tel2 && tel1 === tel2) {
    addErro(
      'telefone_2', 16,
      'Telefone 2',
      'Deve ser diferente do telefone 1.',
      tel2,
      'contato',
      'telefone_2',
    )
  }

  // Se DDD preenchido, ao menos um telefone deve estar preenchido
  if (ddd && /^\d{2}$/.test(ddd) && !tel1 && !tel2) {
    addErro(
      'telefone_1', 15,
      'DDD sem telefone',
      'Ao informar DDD, ao menos um telefone deve ser preenchido.',
      '(vazio)',
      'contato',
      'telefone_1',
    )
  }

  // v4: Se DDD não preenchido, telefones devem ser nulos
  if (!ddd && (tel1 || tel2)) {
    addErro(
      'ddd', 14,
      'DDD',
      'Se o DDD não for preenchido, os campos de telefone devem ser nulos.',
      '(vazio)',
      'contato',
      'ddd',
    )
  }

  // -----------------------------------------------------------------------
  // 5. CONDICIONAIS
  // -----------------------------------------------------------------------

  // 5a. localizacao_diferenciada não pode ser '1' quando localizacao = '1' (urbana)
  if (locDif === '1' && localizacao === '1') {
    addErro(
      'localizacao_diferenciada', 21,
      'Localização diferenciada × Localização',
      'Localização diferenciada não pode ser "1" (não se aplica) quando a localização é urbana.',
      locDif,
      'identificacao',
      'localizacao_diferenciada',
    )
  }

  // 5b. dependencia_administrativa não pode ser '3' neste município específico
  if (dependencia === '3' && municipio === '5300108') {
    addErro(
      'dependencia_administrativa', 19,
      'Dependência administrativa',
      'Dependência administrativa "Municipal" não é permitida para o município 5300108.',
      dependencia,
      'identificacao',
      'dependencia_administrativa',
    )
  }

  // -----------------------------------------------------------------------
  // 6. MANTENEDORA (dependencia = '4' AND situacao = '1')
  // -----------------------------------------------------------------------

  if (dependencia === '4' && isAtiva) {
    const mantFields = [
      school.mant_empresa,
      school.mant_sindicatos,
      school.mant_ong,
      school.mant_sem_fins_lucrativos,
      school.mant_sistema_s,
      school.mant_oscip,
    ]
    if (!mantFields.some(Boolean)) {
      addErro(
        'mant_empresa', 22,
        'Mantenedora da escola privada',
        'Ao menos uma opção de mantenedora deve ser informada para escolas privadas em atividade.',
        '(nenhuma selecionada)',
        'mantenedora',
        'mant_empresa',
      )
    }
  }

  // -----------------------------------------------------------------------
  // 7. ÓRGÃOS VINCULADOS (dependencia = 1/2/3)
  // -----------------------------------------------------------------------

  if (situacaoValida && /^[123]$/.test(dependencia || '')) {
    const orgaoFields = [
      school.orgao_secretaria_educacao,
      school.orgao_seguranca,
      school.orgao_saude,
      school.orgao_outro,
    ]
    if (!orgaoFields.some(Boolean)) {
      addErro(
        'orgao_secretaria_educacao', 49,
        'Órgão vinculado',
        'Ao menos um órgão vinculado deve ser informado para escolas públicas.',
        '(nenhum selecionado)',
        'administrativo',
        'orgao_secretaria_educacao',
      )
    }
  }

  // -----------------------------------------------------------------------
  // 8. PARCERIAS
  // -----------------------------------------------------------------------

  const getDependenciaNome = (): string => {
    if (dependencia === '1') return 'Federal'
    if (dependencia === '2') return 'Estadual'
    if (dependencia === '3') return 'Municipal'
    if (dependencia === '4') {
      return school.categoria_escola_privada === '1'
        ? 'Privada (Particular)'
        : 'Privada (não Particular)'
    }
    return ''
  }

  const depNome = getDependenciaNome()

  // 8a. Parceria Estadual
  if (school.parceria_estadual) {
    const contrEst = {
      colaboracao: school.contr_est_colaboracao,
      fomento: school.contr_est_fomento,
      cooperacao: school.contr_est_cooperacao,
      prestacao: school.contr_est_prestacao,
      coop_tecnica: school.contr_est_coop_tecnica,
      consorcio: school.contr_est_consorcio,
    }

    const temContrEst = Object.values(contrEst).some(Boolean)
    if (!temContrEst) {
      addErro(
        'parceria_estadual', 28,
        'Parceria Estadual',
        'Ao marcar parceria estadual, ao menos uma forma de contratação deve ser informada.',
        '(nenhuma contratação selecionada)',
        'parcerias',
        'parceria_estadual',
      )
    }

    // Validar compatibilidade com dependência
    const contrEstMappings: [string, number, boolean | null | undefined][] = [
      ['Termo de colaboração (Lei 13.019)', 30, contrEst.colaboracao],
      ['Termo de fomento (Lei 13.019)', 31, contrEst.fomento],
      ['Acordo de cooperação (Lei 13.019)', 32, contrEst.cooperacao],
      ['Contrato de prestação de serviço', 33, contrEst.prestacao],
      ['Termo de cooperação técnica e financeira', 34, contrEst.coop_tecnica],
      ['Contrato de consórcio público / Convênio de cooperação', 35, contrEst.consorcio],
    ]

    for (const [forma, campoNum, ativo] of contrEstMappings) {
      if (!ativo) continue
      const entry = FORMAS_CONTRATACAO.find((f) => f.forma === forma)
      if (entry && !entry.dependencias_permitidas.includes(depNome)) {
        addErro(
          `contr_est_${forma.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}`,
          campoNum,
          'Forma de contratação × Dependência (Anexo 5)',
          `A forma "${forma}" não é compatível com a dependência "${depNome}".`,
          'Sim',
          'parcerias',
          `contr_est_${forma.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}`,
        )
      }
    }
  }

  // 8b. Parceria Municipal
  if (school.parceria_municipal) {
    const contrMun = {
      colaboracao: school.contr_mun_colaboracao,
      fomento: school.contr_mun_fomento,
      cooperacao: school.contr_mun_cooperacao,
      prestacao: school.contr_mun_prestacao,
      coop_tecnica: school.contr_mun_coop_tecnica,
      consorcio: school.contr_mun_consorcio,
    }

    const temContrMun = Object.values(contrMun).some(Boolean)
    if (!temContrMun) {
      addErro(
        'parceria_municipal', 29,
        'Parceria Municipal',
        'Ao marcar parceria municipal, ao menos uma forma de contratação deve ser informada.',
        '(nenhuma contratação selecionada)',
        'parcerias',
        'parceria_municipal',
      )
    }

    const contrMunMappings: [string, number, boolean | null | undefined][] = [
      ['Termo de colaboração (Lei 13.019)', 36, contrMun.colaboracao],
      ['Termo de fomento (Lei 13.019)', 37, contrMun.fomento],
      ['Acordo de cooperação (Lei 13.019)', 38, contrMun.cooperacao],
      ['Contrato de prestação de serviço', 39, contrMun.prestacao],
      ['Termo de cooperação técnica e financeira', 40, contrMun.coop_tecnica],
      ['Contrato de consórcio público / Convênio de cooperação', 41, contrMun.consorcio],
    ]

    for (const [forma, campoNum, ativo] of contrMunMappings) {
      if (!ativo) continue
      const entry = FORMAS_CONTRATACAO.find((f) => f.forma === forma)
      if (entry && !entry.dependencias_permitidas.includes(depNome)) {
        addErro(
          `contr_mun_${forma.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}`,
          campoNum,
          'Forma de contratação × Dependência (Anexo 5)',
          `A forma "${forma}" não é compatível com a dependência "${depNome}".`,
          'Sim',
          'parcerias',
          `contr_mun_${forma.split(' ')[0].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}`,
        )
      }
    }
  }

  // -----------------------------------------------------------------------
  // 9. CNPJ
  // -----------------------------------------------------------------------

  const validarCNPJ = (cnpj: string | null | undefined): boolean => {
    if (!cnpj || !/^\d{14}$/.test(cnpj)) return false
    if (/^(\d)\1{13}$/.test(cnpj)) return false

    const calc = (digits: number[], pesos: number[]): number => {
      let sum = 0
      for (let i = 0; i < pesos.length; i++) {
        sum += digits[i] * pesos[i]
      }
      const remainder = sum % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    const d = cnpj.split('').map(Number)
    return (
      calc(d, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === d[12] &&
      calc(d, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === d[13]
    )
  }

  // 9a. cnpj_mantenedora (v4: quando situacao='1' E dependencia='4')
  // Obrigatório quando mant_sem_fins_lucrativos=1 E regulamentacao=1
  if (isAtiva && dependencia === '4') {
    const cnpjMant = school.cnpj_mantenedora
    const mantObrigatorio = school.mant_sem_fins_lucrativos && school.regulamentacao === '1'

    if (cnpjMant && !validarCNPJ(cnpjMant)) {
      addErro(
        'cnpj_mantenedora', 47,
        'CNPJ da mantenedora',
        'CNPJ inválido — deve ter 14 dígitos com dígitos verificadores corretos.',
        cnpjMant,
        'documentos',
        'cnpj_mantenedora',
      )
    } else if (!cnpjMant && mantObrigatorio) {
      addErro(
        'cnpj_mantenedora', 47,
        'CNPJ da mantenedora',
        'CNPJ da mantenedora é obrigatório quando a mantenedora é sem fins lucrativos e a regulamentação é "Sim" (1).',
        '(vazio)',
        'documentos',
        'cnpj_mantenedora',
      )
    }
  } else if (school.cnpj_mantenedora) {
    addErro(
      'cnpj_mantenedora', 47,
      'CNPJ da mantenedora',
      'CNPJ da mantenedora só pode ser preenchido quando a situação é "Em atividade" (1) e a dependência é "Privada" (4).',
      school.cnpj_mantenedora,
      'documentos',
      'cnpj_mantenedora',
    )
  }

  // 9b. cnpj_escola (quando situacao='1' E dependencia='4')
  if (isAtiva && dependencia === '4') {
    const cnpjEscola = school.cnpj_escola
    if (!cnpjEscola) {
      addErro(
        'cnpj_escola', 48,
        'CNPJ da escola',
        'CNPJ da escola é obrigatório para escolas privadas em atividade.',
        '(vazio)',
        'documentos',
        'cnpj_escola',
      )
    } else if (!validarCNPJ(cnpjEscola)) {
      addErro(
        'cnpj_escola', 48,
        'CNPJ da escola',
        'CNPJ inválido — deve ter 14 dígitos com dígitos verificadores corretos.',
        cnpjEscola,
        'documentos',
        'cnpj_escola',
      )
    }
  }

  // -----------------------------------------------------------------------
  // 10. REGULAMENTAÇÃO (apenas quando situacao = '1')
  // -----------------------------------------------------------------------

  if (isAtiva) {
    const regulamentacao = school.regulamentacao
    if (regulamentacao && !/^[012]$/.test(regulamentacao)) {
      addErro(
        'regulamentacao', 42,
        'Regulamentação',
        'Deve ser 0, 1 ou 2.',
        regulamentacao,
        'regulamentacao',
        'regulamentacao',
      )
    }

    // esfera_regulamentacao obrigatória quando regulamentacao é 1 ou 2
    if (regulamentacao === '1' || regulamentacao === '2') {
      const esfera = school.esfera_regulamentacao
      if (!esfera || !/^[12345]$/.test(esfera)) {
        addErro(
          'esfera_regulamentacao', 43,
          'Esfera de regulamentação',
          'Deve ser informada (1 a 5) quando a regulamentação é 1 ou 2.',
          esfera || '(vazio)',
          'regulamentacao',
          'esfera_regulamentacao',
        )
      } else {
        // v4 regra 3: Não pode ser 3 ou 4 quando dependencia = 1 ou 2
        if ((dependencia === '1' || dependencia === '2') && (esfera === '3' || esfera === '4')) {
          addErro(
            'esfera_regulamentacao', 43,
            'Esfera de regulamentação × Dependência',
            'Esfera "Municipal" ou "Estadual e Municipal" não é permitida para escolas federais ou estaduais.',
            esfera,
            'regulamentacao',
            'esfera_regulamentacao',
          )
        }
        // v4 regra 4: Não pode ser 3 ou 4 quando municipio = 5300108
        if (municipio === '5300108' && (esfera === '3' || esfera === '4')) {
          addErro(
            'esfera_regulamentacao', 43,
            'Esfera de regulamentação × Município',
            'Esfera "Municipal" ou "Estadual e Municipal" não é permitida para o município 5300108.',
            esfera,
            'regulamentacao',
            'esfera_regulamentacao',
          )
        }
      }
    }
  }

  // -----------------------------------------------------------------------
  // 11. UNIDADE VINCULADA (apenas quando situacao = '1')
  // -----------------------------------------------------------------------

  if (isAtiva) {
    const unidadeVinculada = school.unidade_vinculada
    if (unidadeVinculada && !/^[012]$/.test(unidadeVinculada)) {
      addErro(
        'unidade_vinculada', 44,
        'Unidade vinculada',
        'Deve ser 0, 1 ou 2.',
        unidadeVinculada,
        'vinculo',
        'unidade_vinculada',
      )
    }

    // codigo_escola_sede quando unidade_vinculada = '1'
    if (unidadeVinculada === '1') {
      const codSede = school.codigo_escola_sede
      if (!codSede || !/^\d{8}$/.test(codSede)) {
        addErro(
          'codigo_escola_sede', 45,
          'Código da escola sede',
          'Deve ter 8 caracteres numéricos quando a unidade é vinculada.',
          codSede || '(vazio)',
          'vinculo',
          'codigo_escola_sede',
        )
      }
    }

    // codigo_ies quando unidade_vinculada = '2'
    if (unidadeVinculada === '2') {
      const codIes = school.codigo_ies
      if (!codIes || codIes.length !== 9) {
        addErro(
          'codigo_ies', 46,
          'Código IES',
          'Deve ter 9 caracteres quando a unidade é vinculada a IES.',
          codIes || '(vazio)',
          'vinculo',
          'codigo_ies',
        )
      }
    }
  }

  // -----------------------------------------------------------------------
  // 12. EMAIL
  // -----------------------------------------------------------------------

  const email = school.email
  if (email) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      addErro(
        'email', 17,
        'Endereço eletrônico (e-mail)',
        'Formato de e-mail inválido.',
        email,
        'contato',
        'email',
      )
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 10 — INFRAESTRUTURA DA ESCOLA
// ---------------------------------------------------------------------------

export async function validarRegistro10(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school, error } = await supabase.from('schools').select('*').eq('id', schoolId).single()

  if (error || !school) {
    return [
      criarErro(
        '10', 'school', 0, 'REGISTRO_NAO_ENCONTRADO',
        `Escola ${schoolId} não encontrada.`,
        schoolId, '', schoolId, '', 'infraestrutura',
      ),
    ]
  }

  const nomeEscola: string = school.nome_escola || ''
  const b = (field: string): boolean => !!school[field]
  const n = (field: string): number => Number(school[field]) || 0
  const s = (field: string): string => (school[field] ?? '').toString()

  // -----------------------------------------------------------------------
  // HELPERS
  // -----------------------------------------------------------------------

  function todosFalse(campos: string[]): boolean {
    return campos.every((c) => !b(c))
  }

  function nenhumTrue(campos: string[]): boolean {
    return campos.every((c) => !b(c))
  }

  // Validate "pelo menos um deve ser 1" for a boolean group
  function validarGrupoBoolean(
    nomeGrupo: string,
    campos: string[],
    numeroCampoBase: number,
  ): void {
    if (todosFalse(campos)) {
      erros.push(
        criarErro(
          '10', campos[0], numeroCampoBase, 'PELO_MENOS_UM',
          `${nomeGrupo}: pelo menos um campo deve ser informado.`,
          schoolId, nomeEscola, schoolId, '', 'infraestrutura', campos[0],
        ),
      )
    }
  }

  // Validate "pelo menos um > 0" for a numeric group (profissionais)
  function validarGrupoNumerico(
    nomeGrupo: string,
    campos: string[],
    numeroCampoBase: number,
  ): void {
    const todosZero = campos.every((c) => n(c) === 0)
    if (todosZero) {
      erros.push(
        criarErro(
          '10', campos[0], numeroCampoBase, 'PELO_MENOS_UM',
          `${nomeGrupo}: pelo menos um profissional deve ser informado.`,
          schoolId, nomeEscola, schoolId, '', 'infraestrutura', campos[0],
        ),
      )
    }
  }

  // Validate "nenhum dos listados" — if nenhum is true, no other field can be true
  function validarNenhum(
    nomeGrupo: string,
    campoNenhum: string,
    outrosCampos: string[],
    numeroCampoNenhum: number,
  ): void {
    if (!b(campoNenhum)) return
    const conflitantes = outrosCampos.filter((c) => b(c))
    if (conflitantes.length > 0) {
      erros.push(
        criarErro(
          '10', campoNenhum, numeroCampoNenhum, 'NENHUM_CONFLITANTE',
          `${nomeGrupo}: "${campoNenhum}" está marcado mas outros campos do grupo também estão: ${conflitantes.join(', ')}.`,
          schoolId, nomeEscola, schoolId, s(campoNenhum), 'infraestrutura', campoNenhum,
        ),
      )
    }
  }

  // -----------------------------------------------------------------------
  // 1. GRUPOS "PELO MENOS UM DEVE SER 1"
  // -----------------------------------------------------------------------

  // Locais de funcionamento (campos 3-8)
  const LOCAIS_FUNC = ['local_predio', 'local_salas_outra', 'local_galpao', 'local_socioeducativa', 'local_prisional', 'local_outros']
  validarGrupoBoolean('Locais de funcionamento', LOCAIS_FUNC, 3)

  // Abastecimento de água (campos 18-23)
  const AGUA = ['agua_rede_publica', 'agua_poco_artesiano', 'agua_cacimba', 'agua_fonte', 'agua_carro_pipa', 'agua_inexistente']
  validarGrupoBoolean('Abastecimento de água', AGUA, 18)

  // Energia elétrica (campos 24-27)
  const ENERGIA = ['energia_rede_publica', 'energia_gerador', 'energia_renovavel', 'energia_inexistente']
  validarGrupoBoolean('Energia elétrica', ENERGIA, 24)

  // Esgotamento sanitário (campos 28-31)
  const ESGOTO = ['esgoto_rede_publica', 'esgoto_fossa_septica', 'esgoto_fossa_rudimentar', 'esgoto_inexistente']
  validarGrupoBoolean('Esgotamento sanitário', ESGOTO, 28)

  // Destinação do lixo (campos 32-36)
  const LIXO_DEST = ['lixo_coleta', 'lixo_queima', 'lixo_enterra', 'lixo_destinacao_licenciada', 'lixo_outra_area']
  validarGrupoBoolean('Destinação do lixo', LIXO_DEST, 32)

  // Tratamento do lixo (campos 37-40)
  const LIXO_TRAT = ['lixo_separacao', 'lixo_reaproveitamento', 'lixo_reciclagem', 'lixo_sem_tratamento']
  validarGrupoBoolean('Tratamento do lixo', LIXO_TRAT, 37)

  // Dependências físicas (campos 41-80) — 40 fields
  const DEPENDENCIAS = [
    'dep_almoxarifado', 'dep_area_verde', 'dep_auditorio', 'dep_banheiro',
    'dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario',
    'dep_biblioteca', 'dep_cozinha', 'dep_despensa', 'dep_dormitorio_aluno',
    'dep_dormitorio_professor', 'dep_lab_ciencias', 'dep_lab_informatica', 'dep_lab_robotica',
    'dep_lab_profissional', 'dep_parque_infantil', 'dep_patio_coberto', 'dep_patio_descoberto',
    'dep_piscina', 'dep_quadra_coberta', 'dep_quadra_descoberta', 'dep_refeitorio',
    'dep_sala_repouso', 'dep_sala_artes', 'dep_sala_musica', 'dep_sala_danca',
    'dep_sala_multiuso', 'dep_terreirao', 'dep_viveiro', 'dep_sala_diretoria',
    'dep_sala_leitura', 'dep_sala_professores', 'dep_sala_aee', 'dep_sala_secretaria',
    'dep_oficinas', 'dep_estudio', 'dep_horta', 'dep_nenhuma',
  ]
  validarGrupoBoolean('Dependências físicas', DEPENDENCIAS, 41)

  // Acessibilidade (campos 81-90) — 10 fields
  const ACESSIBILIDADE = [
    'acess_corrimao', 'acess_elevador', 'acess_pisos_tateis', 'acess_portas_80cm',
    'acess_rampas', 'acess_sinalizacao_luminosa', 'acess_sinalizacao_sonora',
    'acess_sinalizacao_tatil', 'acess_sinalizacao_visual', 'acess_nenhum',
  ]
  validarGrupoBoolean('Acessibilidade', ACESSIBILIDADE, 81)

  // Equipamentos (campos 96-102) — 7 fields
  const EQUIPAMENTOS = [
    'eq_antena_parabolica', 'eq_computadores', 'eq_copiadora', 'eq_impressora',
    'eq_impressora_multifuncional', 'eq_scanner', 'eq_nenhum',
  ]
  validarGrupoBoolean('Equipamentos', EQUIPAMENTOS, 96)

  // Internet (campos 111-115) — 5 fields
  const INTERNET = ['internet_administrativo', 'internet_ensino', 'internet_alunos', 'internet_comunidade', 'internet_inexistente']
  validarGrupoBoolean('Internet', INTERNET, 111)

  // Profissionais (campos 119-138) — 20 fields, numeric
  const PROFISSIONAIS = [
    'prof_agronomos', 'prof_assistente_social', 'prof_aux_admin', 'prof_aux_servicos',
    'prof_bibliotecario', 'prof_bombeiro', 'prof_coordenador', 'prof_fonoaudiologo',
    'prof_nutricionista', 'prof_psicologo', 'prof_cozinheiro', 'prof_supervisao',
    'prof_secretario', 'prof_seguranca', 'prof_tecnicos', 'prof_vice_diretor',
    'prof_orientador_comun', 'prof_tradutor_libras', 'prof_revisor_braille', 'prof_nenhum',
  ]
  validarGrupoNumerico('Profissionais', PROFISSIONAIS, 119)

  // Materiais pedagógicos (campos 140-159) — 20 fields
  const MATERIAIS = [
    'mat_acervo_multimidia', 'mat_brinquedos_infantil', 'mat_cientificos', 'mat_amplificacao_som',
    'mat_audiovisuais', 'mat_horta', 'mat_instrumentos_musicais', 'mat_jogos_educativos',
    'mat_kits_robotica', 'mat_atividades_culturais', 'mat_educacao_emocional',
    'mat_educacao_profissional', 'mat_pratica_desportiva', 'mat_bilingue_surdos',
    'mat_educacao_indigena', 'mat_etnico_raciais', 'mat_educacao_campo',
    'mat_educacao_quilombola', 'mat_educacao_especial', 'mat_nenhum',
  ]
  validarGrupoBoolean('Materiais pedagógicos', MATERIAIS, 140)

  // Órgãos colegiados (campos 174-179) — 6 fields
  const ORGAOS = ['org_associacao_pais', 'org_associacao_mestres', 'org_conselho_escolar', 'org_gremio', 'org_outros', 'org_nenhum']
  validarGrupoBoolean('Órgãos colegiados', ORGAOS, 174)

  // -----------------------------------------------------------------------
  // 2. "NENHUM DOS LISTADOS" — se nenhum=true, nenhum outro pode ser true
  // -----------------------------------------------------------------------

  validarNenhum('Abastecimento de água', 'agua_inexistente', ['agua_rede_publica', 'agua_poco_artesiano', 'agua_cacimba', 'agua_fonte', 'agua_carro_pipa'], 23)
  validarNenhum('Energia elétrica', 'energia_inexistente', ['energia_rede_publica', 'energia_gerador', 'energia_renovavel'], 27)
  validarNenhum('Esgotamento sanitário', 'esgoto_inexistente', ['esgoto_rede_publica', 'esgoto_fossa_septica', 'esgoto_fossa_rudimentar'], 31)

  // Fossa rudimentar (30) não pode ser 1 quando Fossa séptica (29) for 1
  if (b('esgoto_fossa_rudimentar') && b('esgoto_fossa_septica')) {
    erros.push(
      criarErro(
        '10', 'esgoto_fossa_rudimentar', 30, 'CONFLITO_FOSSAS',
        'Esgotamento sanitário: "Fossa rudimentar/comum" não pode ser marcada quando "Fossa séptica" está marcada.',
        schoolId, nomeEscola, schoolId, s('esgoto_fossa_rudimentar'), 'infraestrutura', 'esgoto_fossa_rudimentar',
      ),
    )
  }
  validarNenhum('Dependências físicas', 'dep_nenhuma', DEPENDENCIAS.filter((c) => c !== 'dep_nenhuma'), 80)

  // Banheiro (44) deve ser 1 quando qualquer dos campos 45-48 for 1
  const BANHEIROS_DETALHADOS = ['dep_banheiro_pcd', 'dep_banheiro_infantil', 'dep_banheiro_funcionarios', 'dep_vestiario']
  if (!b('dep_banheiro') && BANHEIROS_DETALHADOS.some((c) => b(c))) {
    erros.push(
      criarErro(
        '10', 'dep_banheiro', 44, 'BANHEIRO_OBRIGATORIO',
        'Banheiro deve ser marcado quando qualquer banheiro acessível, de educação infantil, exclusivo para funcionários ou vestiário com chuveiro estiver marcado.',
        schoolId, nomeEscola, schoolId, s('dep_banheiro'), 'infraestrutura', 'dep_banheiro',
      ),
    )
  }
  validarNenhum('Acessibilidade', 'acess_nenhum', ACESSIBILIDADE.filter((c) => c !== 'acess_nenhum'), 90)
  validarNenhum('Equipamentos', 'eq_nenhum', EQUIPAMENTOS.filter((c) => c !== 'eq_nenhum'), 102)
  validarNenhum('Internet', 'internet_inexistente', ['internet_administrativo', 'internet_ensino', 'internet_alunos', 'internet_comunidade'], 115)

  // Profissionais nenhum — numeric check
  if (n('prof_nenhum') > 0) {
    const outrosProf = PROFISSIONAIS.filter((c) => c !== 'prof_nenhum')
    const conflitantesProf = outrosProf.filter((c) => n(c) > 0)
    if (conflitantesProf.length > 0) {
      erros.push(
        criarErro(
          '10', 'prof_nenhum', 138, 'NENHUM_CONFLITANTE',
          `Profissionais: "prof_nenhum" está preenchido mas outros profissionais também estão: ${conflitantesProf.join(', ')}.`,
          schoolId, nomeEscola, schoolId, String(n('prof_nenhum')), 'infraestrutura', 'prof_nenhum',
        ),
      )
    }
  }

  validarNenhum('Materiais pedagógicos', 'mat_nenhum', MATERIAIS.filter((c) => c !== 'mat_nenhum'), 159)
  validarNenhum('Órgãos colegiados', 'org_nenhum', ['org_associacao_pais', 'org_associacao_mestres', 'org_conselho_escolar', 'org_gremio', 'org_outros'], 179)

  // -----------------------------------------------------------------------
  // 3. CONDICIONAIS
  // -----------------------------------------------------------------------

  // forma_ocupacao: only if local_predio is true
  if (!b('local_predio') && s('forma_ocupacao')) {
    erros.push(
      criarErro(
        '10', 'forma_ocupacao', 9, 'CONDICIONAL_LOCAL_PREDIO',
        'forma_ocupacao só deve ser informada quando local_predio for verdadeiro.',
        schoolId, nomeEscola, schoolId, s('forma_ocupacao'), 'infraestrutura', 'forma_ocupacao',
      ),
    )
  }

  // predio_compartilhado: only if local_predio is true
  if (!b('local_predio') && b('predio_compartilhado')) {
    erros.push(
      criarErro(
        '10', 'predio_compartilhado', 10, 'CONDICIONAL_LOCAL_PREDIO',
        'predio_compartilhado só deve ser marcado quando local_predio for verdadeiro.',
        schoolId, nomeEscola, schoolId, 'true', 'infraestrutura', 'predio_compartilhado',
      ),
    )
  }

  // compartilha_codigo_1..6: only if predio_compartilhado is true; must be sequential
  const compartilhaCodes = [1, 2, 3, 4, 5, 6].map((i) => ({
    col: `compartilha_codigo_${i}` as string,
    num: 10 + i,
    val: s(`compartilha_codigo_${i}`),
  }))

  if (b('predio_compartilhado')) {
    let foundEmpty = false
    for (const c of compartilhaCodes) {
      if (!c.val) {
        foundEmpty = true
      } else if (foundEmpty) {
        erros.push(
          criarErro(
            '10', c.col, c.num, 'SEQUENCIALIDADE',
            `Códigos de compartilhamento devem ser preenchidos sequencialmente (sem lacunas). "${c.col}" está preenchido mas o código anterior está vazio.`,
            schoolId, nomeEscola, schoolId, c.val, 'infraestrutura', c.col,
          ),
        )
        break
      }
    }

    // At least compartilha_codigo_1 must be filled
    if (!s('compartilha_codigo_1')) {
      erros.push(
        criarErro(
          '10', 'compartilha_codigo_1', 11, 'CONDICIONAL_PREDIO_COMPARTILHADO',
          'Pelo menos o código da escola 1 deve ser informado quando predio_compartilhado é verdadeiro.',
          schoolId, nomeEscola, schoolId, '', 'infraestrutura', 'compartilha_codigo_1',
        ),
      )
    }
  } else {
    for (const c of compartilhaCodes) {
      if (c.val) {
        erros.push(
          criarErro(
            '10', c.col, c.num, 'CONDICIONAL_PREDIO_COMPARTILHADO',
            `${c.col} só deve ser informado quando predio_compartilhado for verdadeiro.`,
            schoolId, nomeEscola, schoolId, c.val, 'infraestrutura', c.col,
          ),
        )
      }
    }
  }

  // Quantidades de salas
  const totalSalas = n('qtd_salas_dentro') + n('qtd_salas_fora')

  // qtd_salas_dentro: 1-9999 when local_predio is true
  if (b('local_predio')) {
    if (n('qtd_salas_dentro') < 1 || n('qtd_salas_dentro') > 9999) {
      erros.push(
        criarErro(
          '10', 'qtd_salas_dentro', 91, 'FAIXA_INVALIDA',
          'qtd_salas_dentro deve ser entre 1 e 9999 quando local_predio for verdadeiro.',
          schoolId, nomeEscola, schoolId, String(n('qtd_salas_dentro')), 'infraestrutura', 'qtd_salas_dentro',
        ),
      )
    }
  }

  // qtd_salas_fora: v4 — opcional. Se preenchido, 1-9999
  if (n('qtd_salas_fora') > 0 && (n('qtd_salas_fora') < 1 || n('qtd_salas_fora') > 9999)) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_fora', 92, 'FAIXA_INVALIDA',
        'Quando preenchido, qtd_salas_fora deve ser entre 1 e 9999.',
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_fora')), 'infraestrutura', 'qtd_salas_fora',
      ),
    )
  }

  // qtd_salas_dentro: deve ser nulo quando local_predio for falso
  if (!b('local_predio') && n('qtd_salas_dentro') > 0) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_dentro', 91, 'DEVE_SER_NULO',
        'qtd_salas_dentro deve ser nulo quando o prédio escolar não estiver marcado.',
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_dentro')), 'infraestrutura', 'qtd_salas_dentro',
      ),
    )
  }

  // qtd_salas_fora: obrigatório quando local_predio for falso
  if (!b('local_predio') && n('qtd_salas_fora') < 1) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_fora', 92, 'OBRIGATORIO',
        'qtd_salas_fora é obrigatório quando o prédio escolar não estiver marcado.',
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_fora')), 'infraestrutura', 'qtd_salas_fora',
      ),
    )
  }

  // 93-95: 1-9999 quando dentro/fora preenchido, senão nulo
  const temSalas = n('qtd_salas_dentro') > 0 || n('qtd_salas_fora') > 0
  const camposSalasDetalhe: { campo: string; num: number; nome: string }[] = [
    { campo: 'qtd_salas_climatizadas', num: 93, nome: 'qtd_salas_climatizadas' },
    { campo: 'qtd_salas_acessiveis', num: 94, nome: 'qtd_salas_acessiveis' },
    { campo: 'qtd_salas_leitura', num: 95, nome: 'qtd_salas_leitura' },
  ]
  for (const cs of camposSalasDetalhe) {
    if (temSalas) {
      if (n(cs.campo) < 1 || n(cs.campo) > 9999) {
        erros.push(
          criarErro(
            '10', cs.campo, cs.num, 'FAIXA_INVALIDA',
            `${cs.nome} deve ser entre 1 e 9999 quando houver salas de aula dentro ou fora do prédio.`,
            schoolId, nomeEscola, schoolId, String(n(cs.campo)), 'infraestrutura', cs.campo,
          ),
        )
      }
    } else if (n(cs.campo) > 0) {
      erros.push(
        criarErro(
          '10', cs.campo, cs.num, 'DEVE_SER_NULO',
          `${cs.nome} deve ser nulo quando não houver salas de aula dentro ou fora do prédio.`,
          schoolId, nomeEscola, schoolId, String(n(cs.campo)), 'infraestrutura', cs.campo,
        ),
      )
    }
  }

  // qtd_salas_climatizadas ≤ total salas
  if (n('qtd_salas_climatizadas') > totalSalas) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_climatizadas', 93, 'EXCEDE_TOTAL',
        `qtd_salas_climatizadas (${n('qtd_salas_climatizadas')}) não pode exceder o total de salas (${totalSalas}).`,
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_climatizadas')), 'infraestrutura', 'qtd_salas_climatizadas',
      ),
    )
  }

  // qtd_salas_acessiveis ≤ total salas
  if (n('qtd_salas_acessiveis') > totalSalas) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_acessiveis', 94, 'EXCEDE_TOTAL',
        `qtd_salas_acessiveis (${n('qtd_salas_acessiveis')}) não pode exceder o total de salas (${totalSalas}).`,
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_acessiveis')), 'infraestrutura', 'qtd_salas_acessiveis',
      ),
    )
  }

  // qtd_salas_leitura ≤ total salas
  if (n('qtd_salas_leitura') > totalSalas) {
    erros.push(
      criarErro(
        '10', 'qtd_salas_leitura', 95, 'EXCEDE_TOTAL',
        `qtd_salas_leitura (${n('qtd_salas_leitura')}) não pode exceder o total de salas (${totalSalas}).`,
        schoolId, nomeEscola, schoolId, String(n('qtd_salas_leitura')), 'infraestrutura', 'qtd_salas_leitura',
      ),
    )
  }

  // internet_equip_alunos: 1/2/3 only if internet_alunos is true
  const iea = s('internet_equip_alunos')
  if (iea && !b('internet_alunos')) {
    erros.push(
      criarErro(
        '10', 'internet_equip_alunos', 116, 'CONDICIONAL_INTERNET_ALUNOS',
        'internet_equip_alunos só deve ser informado quando internet_alunos for verdadeiro.',
        schoolId, nomeEscola, schoolId, iea, 'infraestrutura', 'internet_equip_alunos',
      ),
    )
  }
  if (iea && !['1', '2', '3'].includes(iea)) {
    erros.push(
      criarErro(
        '10', 'internet_equip_alunos', 116, 'VALOR_INVALIDO',
        'internet_equip_alunos deve ser 1, 2 ou 3.',
        schoolId, nomeEscola, schoolId, iea, 'infraestrutura', 'internet_equip_alunos',
      ),
    )
  }

  // internet_banda_larga: only if internet_inexistente is false
  if (b('internet_banda_larga') && b('internet_inexistente')) {
    erros.push(
      criarErro(
        '10', 'internet_banda_larga', 117, 'CONDICIONAL_INTERNET_INEXISTENTE',
        'internet_banda_larga não pode ser marcado quando internet_inexistente for verdadeiro.',
        schoolId, nomeEscola, schoolId, 'true', 'infraestrutura', 'internet_banda_larga',
      ),
    )
  }

  // rede_local: 0-3
  const rl = s('rede_local')
  if (rl && !['0', '1', '2', '3'].includes(rl)) {
    erros.push(
      criarErro(
        '10', 'rede_local', 118, 'VALOR_INVALIDO',
        'rede_local deve ser 0, 1, 2 ou 3.',
        schoolId, nomeEscola, schoolId, rl, 'infraestrutura', 'rede_local',
      ),
    )
  }

  // lingua_ensino: 0-3
  const le = s('lingua_ensino')
  if (le && !['0', '1', '2', '3'].includes(le)) {
    erros.push(
      criarErro(
        '10', 'lingua_ensino', 160, 'VALOR_INVALIDO',
        'lingua_ensino deve ser 0, 1, 2 ou 3.',
        schoolId, nomeEscola, schoolId, le, 'infraestrutura', 'lingua_ensino',
      ),
    )
  }

  // codigo_lingua_indigena_1..3: only if lingua_ensino is 1 or 3
  if (le !== '1' && le !== '3') {
    for (let i = 1; i <= 3; i++) {
      const campo = `codigo_lingua_indigena_${i}`
      const val = s(campo)
      if (val) {
        erros.push(
          criarErro(
            '10', campo, 160 + i, 'CONDICIONAL_LINGUA_INDIGENA',
            `${campo} só deve ser informado quando lingua_ensino for 1 ou 3.`,
            schoolId, nomeEscola, schoolId, val, 'infraestrutura', campo,
          ),
        )
      }
    }
  }

  // cota fields: only if exame_selecao is true
  const COTAS = [
    { col: 'cota_ppi', num: 165 },
    { col: 'cota_renda', num: 166 },
    { col: 'cota_escola_publica', num: 167 },
    { col: 'cota_pcd', num: 168 },
    { col: 'cota_outros', num: 169 },
    { col: 'cota_nenhum', num: 170 },
  ]
  if (!b('exame_selecao')) {
    for (const c of COTAS) {
      if (b(c.col)) {
        erros.push(
          criarErro(
            '10', c.col, c.num, 'CONDICIONAL_EXAME_SELECAO',
            `${c.col} só deve ser informado quando exame_selecao for verdadeiro.`,
            schoolId, nomeEscola, schoolId, 'true', 'infraestrutura', c.col,
          ),
        )
      }
    }
  }

  // educacao_ambiental: amb_* fields only if true
  if (!b('educacao_ambiental')) {
    const AMB_FIELDS = [
      { col: 'amb_conteudo', num: 182 },
      { col: 'amb_componente', num: 183 },
      { col: 'amb_eixo', num: 184 },
      { col: 'amb_eventos', num: 185 },
      { col: 'amb_transversal', num: 186 },
      { col: 'amb_nenhum', num: 187 },
    ]
    for (const a of AMB_FIELDS) {
      if (b(a.col)) {
        erros.push(
          criarErro(
            '10', a.col, a.num, 'CONDICIONAL_EDUCACAO_AMBIENTAL',
            `${a.col} só deve ser informado quando educacao_ambiental for verdadeiro.`,
            schoolId, nomeEscola, schoolId, 'true', 'infraestrutura', a.col,
          ),
        )
      }
    }
  }

  // alimentacao_escolar: if true, must have at least one in-person/semi class (done via cross-check in validarVinculosAluno)

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 20 — TURMAS
// ---------------------------------------------------------------------------

export async function validarRegistro20(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: turmas, error } = await supabase
    .from('turmas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ativo', true)

  if (error || !turmas || turmas.length === 0) {
    return erros
  }

  // Pre-query professionals, students, and quadro de aulas for all turmas at once
  const turmaIds = turmas.map((t) => t.id)
  const [profResult, matResult, quadroResult] = await Promise.all([
    supabase.from('turmas_profissionais').select('turma_id').in('turma_id', turmaIds),
    supabase.from('academico_matriculas').select('turma_id').eq('situacao', 'Ativo').in('turma_id', turmaIds),
    supabase.from('quadro_aulas_horarios')
      .select('quadro_aula_id, dia_semana, horario_inicial, horario_final, quadro_aulas!inner(turma_id)')
      .in('quadro_aulas.turma_id', turmaIds)
      .eq('quadro_aulas.ativo', true)
      .eq('ativo', true),
  ])

  const turmasComProfissional = new Set((profResult.data || []).map((r: { turma_id: string }) => r.turma_id))
  const turmasComAluno = new Set((matResult.data || []).map((r: { turma_id: string }) => r.turma_id))

  // Derive INEP horarios from Quadro de Aulas
  // Map: turma_id → Record<dia_semana, { min: string, max: string }>
  const horariosDerivados = new Map<string, Record<string, { inicio: string; fim: string }>>()
  for (const h of (quadroResult.data || [])) {
    const turmaId = (h as any).quadro_aulas?.turma_id
    if (!turmaId) continue
    const dia = String(h.dia_semana)
    const inicio = String(h.horario_inicial || '').substring(0, 5)
    const fim = String(h.horario_final || '').substring(0, 5)
    if (!inicio || !fim) continue

    if (!horariosDerivados.has(turmaId)) {
      horariosDerivados.set(turmaId, {})
    }
    const diaMap = horariosDerivados.get(turmaId)!
    if (!diaMap[dia] || inicio < diaMap[dia].inicio) {
      if (!diaMap[dia]) diaMap[dia] = { inicio, fim }
      else diaMap[dia].inicio = inicio
    }
    if (!diaMap[dia] || fim > diaMap[dia].fim) {
      if (!diaMap[dia]) diaMap[dia] = { inicio, fim }
      else diaMap[dia].fim = fim
    }
  }

  const DIA_MAP_TO_INEP: Record<string, string> = {
    '0': 'horario_domingo', '1': 'horario_segunda', '2': 'horario_terca',
    '3': 'horario_quarta', '4': 'horario_quinta', '5': 'horario_sexta', '6': 'horario_sabado',
  }

  const DIAS_SEMANA = [
    'horario_domingo', 'horario_segunda', 'horario_terca',
    'horario_quarta', 'horario_quinta', 'horario_sexta', 'horario_sabado',
  ]

  const AREAS = [
    'area_quimica', 'area_fisica', 'area_matematica_turma', 'area_biologia',
    'area_ciencias', 'area_portugues', 'area_ingles', 'area_espanhol',
    'area_outra_estrangeira', 'area_arte', 'area_ed_fisica', 'area_historia',
    'area_geografia', 'area_filosofia', 'area_informatica', 'area_profissionalizantes',
    'area_libras', 'area_pedagogicas', 'area_ensino_religioso', 'area_lingua_indigena',
    'area_estudos_sociais', 'area_sociologia', 'area_frances', 'area_portugues_sl',
    'area_estagio', 'area_projeto_vida', 'area_outras',
  ]

  const ATIVIDADES_COMPLEMENTARES = [
    'atividade_complementar_1', 'atividade_complementar_2', 'atividade_complementar_3',
    'atividade_complementar_4', 'atividade_complementar_5', 'atividade_complementar_6',
  ]

  const ETAPAS_SEM_ALTERNANCIA = new Set([1, 2, 3, 14, 15, 16, 17, 18, 56])
  const ETAPAS_EDUCACAO_INFANTIL = new Set([1, 2, 3])
  const HORARIO_REGEX = /^\d{2}:\d{2}-\d{2}:\d{2}$/

  function addErro(
    turma: Record<string, unknown>,
    campoInep: string,
    numeroCampo: number,
    regra: string,
    mensagem: string,
    valorAtual?: string,
    secao?: string,
    campoDestino?: string,
  ) {
    erros.push(
      criarErro(
        '20', campoInep, numeroCampo, regra, mensagem,
        String(turma.id), String(turma.nome || ''), schoolId,
        valorAtual, secao, campoDestino,
      ),
    )
  }

  for (const turma of turmas) {
    const nome = String(turma.nome ?? '')
    const tipoMediacao = String(turma.tipo_mediacao ?? '')
    const tipoTurma = String(turma.tipo_turma ?? '')
    const etapaCodigoRaw = turma.etapa_codigo ? String(turma.etapa_codigo) : ''
    const etapaAgregada = turma.etapa_agregada ? String(turma.etapa_agregada) : ''
    const formaOrganizacao = turma.forma_organizacao ? String(turma.forma_organizacao) : ''
    const formacaoAlternancia = !!turma.formacao_alternancia

    const etapaNum = /^\d+$/.test(etapaCodigoRaw) ? parseInt(etapaCodigoRaw, 10) : null

    // -------------------------------------------------------------------
    // 1. nome: required, 1-80 chars
    // -------------------------------------------------------------------
    if (!nome || nome.length < 1 || nome.length > 80) {
      addErro(turma, 'nome', 1, 'Nome da turma',
        'Nome da turma é obrigatório e deve ter entre 1 e 80 caracteres.',
        nome || '(vazio)', 'identificacao', 'nome')
    }

    // -------------------------------------------------------------------
    // 2. tipo_mediacao: required, 1, 2 or 3
    // -------------------------------------------------------------------
    if (!tipoMediacao || !['1', '2', '3'].includes(tipoMediacao)) {
      addErro(turma, 'tipo_mediacao', 2, 'Tipo de mediação',
        'Deve ser 1 (Presencial), 2 (Semipresencial) ou 3 (EAD).',
        tipoMediacao || '(vazio)', 'identificacao', 'tipo_mediacao')
    }

    // -------------------------------------------------------------------
    // 3. Horários (when tipo_mediacao = '1' — Presencial)
    // Derivados do Quadro de Aulas (quadro_aulas_horarios)
    // -------------------------------------------------------------------
    if (tipoMediacao === '1') {
      const turmaHorarios = horariosDerivados.get(turma.id as string)
      const horariosPreenchidos = DIAS_SEMANA.filter((h) => {
        const diaInep = Object.keys(DIA_MAP_TO_INEP).find((k) => DIA_MAP_TO_INEP[k] === h)
        return diaInep && turmaHorarios?.[diaInep]
      })

      if (horariosPreenchidos.length === 0) {
        addErro(turma, 'horario_segunda', 3, 'Horários da turma',
          'Pelo menos um dia da semana com horário deve ser informado quando a mediação for Presencial. Configure o Quadro de Aulas.',
          '', 'horarios', 'horario_segunda')
      } else {
        for (const campo of horariosPreenchidos) {
          const diaInep = Object.keys(DIA_MAP_TO_INEP).find((k) => DIA_MAP_TO_INEP[k] === campo)!
          const h = turmaHorarios?.[diaInep]
          if (!h) continue
          const valor = `${h.inicio}-${h.fim}`

          if (!HORARIO_REGEX.test(valor)) {
            addErro(turma, campo, 3, 'Formato de horário',
              `Horário de "${campo}" deve estar no formato hh:mm-hh:mm (ex: 07:00-11:30).`,
              valor, 'horarios', campo)
            continue
          }

          const [inicio, fim] = valor.split('-')
          const [hi, mi] = inicio.split(':').map(Number)
          const [hf, mf] = fim.split(':').map(Number)

          if (isNaN(hi) || isNaN(mi) || isNaN(hf) || isNaN(mf)) continue

          if (mi % 5 !== 0 || mf % 5 !== 0) {
            addErro(turma, campo, 3, 'Minutos do horário',
              `Horário "${campo}": os minutos devem ser múltiplos de 5. Valor: ${valor}`,
              valor, 'horarios', campo)
          }

          const inicioMin = hi * 60 + mi
          const fimMin = hf * 60 + mf
          if (inicioMin >= fimMin) {
            addErro(turma, campo, 3, 'Ordem do horário',
              `Horário "${campo}": a hora de início (${inicio}) deve ser anterior à hora de término (${fim}).`,
              valor, 'horarios', campo)
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 4. tipo_turma: required, 4, 5, 6 or 9
    // -------------------------------------------------------------------
    if (!tipoTurma || !['4', '5', '6', '9'].includes(tipoTurma)) {
      addErro(turma, 'tipo_turma', 4, 'Tipo de turma',
        'Deve ser 4 (Atividade Complementar), 5 (AEE), 6 (Regular) ou 9 (Multisseriada/Outro).',
        tipoTurma || '(vazio)', 'identificacao', 'tipo_turma')
    }

    // -------------------------------------------------------------------
    // 5. Atividades complementares (when tipo_turma = '4' or '9')
    // -------------------------------------------------------------------
    if (tipoTurma === '4' || tipoTurma === '9') {
      const atvPreenchidas = ATIVIDADES_COMPLEMENTARES
        .filter((a) => {
          const val = turma[a]
          return val && String(val).trim() !== ''
        })
        .map((a) => String(turma[a]).trim())

      if (atvPreenchidas.length === 0) {
        addErro(turma, 'atividade_complementar_1', 5, 'Atividades complementares',
          'Pelo menos uma atividade complementar deve ser informada para este tipo de turma.',
          '', 'organizacao', 'atividade_complementar_1')
      } else {
        const unique = new Set(atvPreenchidas)
        if (unique.size !== atvPreenchidas.length) {
          addErro(turma, 'atividade_complementar_1', 5, 'Atividades complementares duplicadas',
            'As atividades complementares não podem ter valores duplicados.',
            atvPreenchidas.join(', '), 'organizacao', 'atividade_complementar_1')
        }
      }
    }

    // -------------------------------------------------------------------
    // 6. Etapa (when tipo_turma = '6' or '9')
    // -------------------------------------------------------------------
    if (tipoTurma === '6' || tipoTurma === '9') {
      if (!etapaAgregada) {
        addErro(turma, 'etapa_agregada', 6, 'Etapa agregada',
          'Etapa agregada é obrigatória para este tipo de turma.',
          '', 'organizacao', 'etapa_agregada')
      }
      if (!etapaCodigoRaw) {
        addErro(turma, 'etapa_codigo', 7, 'Etapa de ensino',
          'Etapa de ensino (código INEP) é obrigatória para este tipo de turma.',
          '', 'organizacao', 'etapa_codigo')
      }

      // v4 — Anexo 7: Compatibilidade mediação × tipo turma × etapa
      if (tipoMediacao && tipoTurma && etapaAgregada) {
        const compativel = COMPATIBILIDADE_MEDIACAO_TURMA_ETAPA.some((c) => {
          if (c.tipo_mediacao !== tipoMediacao || c.tipo_turma !== tipoTurma) return false
          if (c.etapa_agregada === '-' || c.etapa_agregada === etapaAgregada) {
            if (c.etapas_ensino.length === 0 || (etapaNum !== null && c.etapas_ensino.includes(etapaNum))) {
              return true
            }
          }
          return false
        })
        if (!compativel) {
          addErro(turma, 'etapa_codigo', 7, 'Etapa × Mediação × Tipo (Anexo 7)',
            `A combinação de Tipo de mediação, Tipo de turma e Etapa não é compatível conforme o Anexo 7.`,
            etapaCodigoRaw, 'organizacao', 'etapa_codigo')
        }
      }
    }

    // -------------------------------------------------------------------
    // 7. Forma de organização × Etapa (Anexo 6)
    //    Only when etapa is not 1,2,3 (Educação Infantil has no forma)
    // -------------------------------------------------------------------
    if (etapaNum !== null && !ETAPAS_EDUCACAO_INFANTIL.has(etapaNum)) {
      if (formaOrganizacao) {
        const etapaEntry = ETAPAS_FORMAS_ORGANIZACAO.find((e) => e.etapa_codigo === etapaNum)
        if (etapaEntry) {
          const formaNum = parseInt(formaOrganizacao, 10)
          if (isNaN(formaNum) || !etapaEntry.formas.includes(formaNum)) {
            addErro(turma, 'forma_organizacao', 8, 'Forma de organização × Etapa (Anexo 6)',
              `Forma de organização "${formaOrganizacao}" não é compatível com a etapa "${etapaEntry.etapa_nome}". Formas válidas: ${etapaEntry.formas.join(', ')}.`,
              formaOrganizacao, 'organizacao', 'forma_organizacao')
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 8. Formação em alternância × Etapa
    //    Must be false when etapa in [1,2,3,14,15,16,17,18,56]
    // -------------------------------------------------------------------
    if (formacaoAlternancia && etapaNum !== null && ETAPAS_SEM_ALTERNANCIA.has(etapaNum)) {
      addErro(turma, 'formacao_alternancia', 9, 'Formação em alternância × Etapa',
        'Formação em alternância não é permitida para esta etapa de ensino (Educação Infantil, EF Anos Iniciais ou Multietapa).',
        'Sim', 'organizacao', 'formacao_alternancia')
    }

    // -------------------------------------------------------------------
    // 9. Áreas do conhecimento (when etapa not 1,2,3)
    // -------------------------------------------------------------------
    if (etapaNum !== null && !ETAPAS_EDUCACAO_INFANTIL.has(etapaNum)) {
      const temArea = AREAS.some((a) => turma[a] === true)
      if (!temArea) {
        addErro(turma, 'area_quimica', 10, 'Áreas do conhecimento',
          'Pelo menos uma área do conhecimento deve ser informada para esta etapa.',
          '', 'areas', 'area_quimica')
      }
    }

    // -------------------------------------------------------------------
    // 10. Tem profissional vinculado?
    // -------------------------------------------------------------------
    if (!turmasComProfissional.has(String(turma.id))) {
      addErro(turma, 'vinculo_profissional', 11, 'Vínculo profissional (Registro 50)',
        `A turma "${nome}" não possui profissional vinculado. Toda turma deve ter ao menos um profissional.`,
        '', 'vinculos', 'vinculo_profissional')
    }

    // -------------------------------------------------------------------
    // 11. Tem aluno vinculado?
    // -------------------------------------------------------------------
    if (!turmasComAluno.has(String(turma.id))) {
      addErro(turma, 'vinculo_aluno', 12, 'Vínculo aluno (Registro 60)',
        `A turma "${nome}" não possui aluno vinculado com situação Ativo.`,
        '', 'vinculos', 'vinculo_aluno')
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 30 — PESSOAS (ALUNOS, PROFISSIONAIS, GESTORES)
// ---------------------------------------------------------------------------

export async function validarRegistro30(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: pessoas } = await supabase.from('people').select('*').eq('school_id', schoolId)
  if (!pessoas || pessoas.length === 0) return erros

  // Filter vinculações to only the people we queried (managers/turmas_profissionais lack school_id)
  const pessoaIds = pessoas.map((p) => String(p.id))

  const [managersResult, profsResult, matsResult] = await Promise.all([
    pessoaIds.length > 0
      ? supabase.from('managers').select('person_id').in('person_id', pessoaIds)
      : { data: [] },
    pessoaIds.length > 0
      ? supabase.from('turmas_profissionais').select('person_id, turma_id').in('person_id', pessoaIds)
      : { data: [] },
    supabase.from('academico_matriculas').select('aluno_id, turma_id').eq('school_id', schoolId).eq('situacao', 'Ativo'),
  ])

  const gestorIds = new Set((managersResult.data || []).map((r: { person_id: string }) => r.person_id))

  const profTurmasPorPessoa = new Map<string, string[]>()
  for (const r of (profsResult.data || [])) {
    const pid = String(r.person_id)
    if (!profTurmasPorPessoa.has(pid)) profTurmasPorPessoa.set(pid, [])
    profTurmasPorPessoa.get(pid)!.push(String(r.turma_id))
  }

  const alunoTurmasPorPessoa = new Map<string, string[]>()
  for (const r of (matsResult.data || [])) {
    const pid = String(r.aluno_id)
    if (!alunoTurmasPorPessoa.has(pid)) alunoTurmasPorPessoa.set(pid, [])
    alunoTurmasPorPessoa.get(pid)!.push(String(r.turma_id))
  }

  // Resolve turma etapas for alunos
  const allTurmaIds = [...new Set([
    ...Array.from(profTurmasPorPessoa.values()).flat(),
    ...Array.from(alunoTurmasPorPessoa.values()).flat(),
  ])]

  const { data: turmasEtapas } = allTurmaIds.length > 0
    ? await supabase.from('turmas').select('id, etapa_codigo').in('id', allTurmaIds)
    : { data: null }

  const turmaEtapaMap = new Map<string, string>()
  for (const t of (turmasEtapas || [])) {
    if (t.etapa_codigo) turmaEtapaMap.set(String(t.id), String(t.etapa_codigo))
  }

  const anoAtual = new Date().getFullYear()

  // --- Helpers ---

  const b = (pessoa: Record<string, unknown>, field: string): boolean => !!pessoa[field]
  const s = (pessoa: Record<string, unknown>, field: string): string => {
    const v = pessoa[field]
    return v == null ? '' : String(v)
  }

  function addErro(
    pessoa: Record<string, unknown>,
    campoInep: string,
    numeroCampo: number,
    regra: string,
    mensagem: string,
    valorAtual?: string,
    secao?: string,
    campoDestino?: string,
  ) {
    erros.push(
      criarErro(
        '30', campoInep, numeroCampo, regra, mensagem,
        String(pessoa.id), String(pessoa.nome_completo || ''), schoolId,
        valorAtual, secao, campoDestino,
      ),
    )
  }

  function calcularIdade(dataNascimento: string | null): number | null {
    if (!dataNascimento) return null
    const nasc = new Date(dataNascimento)
    if (isNaN(nasc.getTime())) return null
    return anoAtual - nasc.getFullYear()
  }

  // CPF check-digit validation (standard Receita Federal algorithm)
  function validarCPF(cpf: string): boolean {
    const digits = cpf.replace(/\D/g, '')
    if (digits.length !== 11) return false
    if (/^(\d)\1{10}$/.test(digits)) return false

    const calc = (ds: number[], pesos: number[]): number => {
      let sum = 0
      for (let i = 0; i < pesos.length; i++) sum += ds[i] * pesos[i]
      const r = sum % 11
      return r < 2 ? 0 : 11 - r
    }

    const d = digits.split('').map(Number)
    return (
      calc(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) === d[9] &&
      calc(d, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) === d[10]
    )
  }

  // Campo numbers for deficiências (INEP mapping)
  const DEF_CAMPOS: [string, number, string][] = [
    ['cegueira', 18, 'Cegueira'],
    ['baixa_visao', 19, 'Baixa visão'],
    ['visao_monocular', 20, 'Visão monocular'],
    ['surdez', 21, 'Surdez'],
    ['deficiencia_auditiva', 22, 'Deficiência auditiva'],
    ['surdocegueira', 23, 'Surdocegueira'],
    ['deficiencia_fisica', 24, 'Deficiência física'],
    ['deficiencia_intelectual', 25, 'Deficiência intelectual'],
  ]

  const TRANSTORNO_COLS = ['discalculia', 'disgrafia', 'dislalia', 'dislexia', 'tdah', 'tpac']
  const TRANSTORNO_NAMES: Record<string, string> = {
    discalculia: 'Discalculia', disgrafia: 'Disgrafia', dislalia: 'Dislalia',
    dislexia: 'Dislexia', tdah: 'TDAH', tpac: 'TPAC',
  }

  // RECURSO campo → people column mapping
  const RECURSO_CAMPO_COL: Record<number, string> = {
    36: 'auxilio_ledor', 37: 'auxiliary_transcricao', 38: 'guia_interprete',
    39: 'tradutor_libras', 40: 'leitura_labial', 41: 'prova_ampliada',
    42: 'prova_superampliada', 43: 'cd_audio', 44: 'prova_libras',
    45: 'prova_video_libras', 46: 'material_braille', 48: 'tempo_adicional',
  }

  const ETAPAS_CPF_OBRIGATORIO = new Set([67, 69, 70, 71, 72, 73, 74])

  // --- Loop over each person ---

  for (const pessoa of pessoas) {
    const pid = String(pessoa.id)
    const nomeCompleto = s(pessoa, 'nome_completo')
    const temGestor = gestorIds.has(pid)
    const temProfissional = profTurmasPorPessoa.has(pid)
    const temAluno = alunoTurmasPorPessoa.has(pid)

    if (!temGestor && !temProfissional && !temAluno) continue

    const cpf = s(pessoa, 'cpf')
    const dataNascimento = s(pessoa, 'data_nascimento')
    const idade = calcularIdade(dataNascimento)
    const nacionalidade = s(pessoa, 'nacionalidade')

    // Get etapa codes for aluno turmas
    const etapasAluno: number[] = []
    if (temAluno) {
      const turmaIds = alunoTurmasPorPessoa.get(pid) || []
      for (const tid of turmaIds) {
        const ec = turmaEtapaMap.get(tid)
        if (ec && /^\d+$/.test(ec)) etapasAluno.push(parseInt(ec, 10))
      }
    }

    // -------------------------------------------------------------------
    // 1. CPF validation
    // -------------------------------------------------------------------
    let cpfObrigatorio = false

    if (temGestor) {
      cpfObrigatorio = true
    }
    if (temProfissional && (nacionalidade === '1' || nacionalidade === '2')) {
      cpfObrigatorio = true
    }
    if (temAluno) {
      if (etapasAluno.some((ec) => ETAPAS_CPF_OBRIGATORIO.has(ec))) {
        cpfObrigatorio = true
      }
    }

    if (cpfObrigatorio) {
      if (!cpf) {
        addErro(pessoa, 'cpf', 1, 'CPF obrigatório',
          'CPF é obrigatório para este vínculo (gestor, profissional com nacionalidade BR/estrangeira, ou aluno de EJA/FIC).',
          '(vazio)', 'documentos', 'cpf')
      } else if (!validarCPF(cpf)) {
        addErro(pessoa, 'cpf', 1, 'CPF inválido',
          'CPF inválido — deve ter 11 dígitos com dígitos verificadores corretos.',
          cpf, 'documentos', 'cpf')
      }
    } else if (cpf && !validarCPF(cpf)) {
      addErro(pessoa, 'cpf', 1, 'CPF inválido',
        'CPF informado é inválido — deve ter 11 dígitos com dígitos verificadores corretos.',
        cpf, 'documentos', 'cpf')
    }

    // -------------------------------------------------------------------
    // 2. Nome validation (when CPF is null)
    // -------------------------------------------------------------------
    if (!cpf) {
      const palavras = nomeCompleto.trim().split(/\s+/).filter(Boolean)

      if (palavras.length <= 1) {
        addErro(pessoa, 'nome_completo', 2, 'Nome com menos de 2 palavras',
          'Nome deve ter ao menos 2 palavras (nome e sobrenome).',
          nomeCompleto || '(vazio)', 'identificacao', 'nome_completo')
      } else {
        if (palavras[0].length <= 1 || palavras[1].length <= 1) {
          addErro(pessoa, 'nome_completo', 2, 'Palavras do nome muito curtas',
            'As duas primeiras palavras do nome devem ter mais de 1 caractere cada.',
            nomeCompleto, 'identificacao', 'nome_completo')
        }
      }

      // Check for >4 repeated characters in sequence
      const repeatedMatch = nomeCompleto.match(/(.)\1{4,}/)
      if (repeatedMatch) {
        addErro(pessoa, 'nome_completo', 2, 'Caracteres repetidos no nome',
          `Nome contém sequência de caracteres repetidos: "${repeatedMatch[0]}". Máximo permitido: 4 caracteres iguais consecutivos.`,
          nomeCompleto, 'identificacao', 'nome_completo')
      }
    }

    // -------------------------------------------------------------------
    // 3. Idade × Vínculo
    // -------------------------------------------------------------------
    if (idade !== null) {
      if (temGestor) {
        const g = IDADES_PERMITIDAS.profissionais.gestor
        if (idade < g.min || idade > g.max) {
          addErro(pessoa, 'data_nascimento', 3, 'Idade do gestor',
            `Idade do gestor: ${idade} anos. Faixa permitida: ${g.min} a ${g.max} anos.`,
            String(idade), 'identificacao', 'data_nascimento')
        }
      }

      if (temProfissional) {
        const p = IDADES_PERMITIDAS.profissionais.profissional
        if (idade < p.min || idade > p.max) {
          addErro(pessoa, 'data_nascimento', 4, 'Idade do profissional',
            `Idade do profissional: ${idade} anos. Faixa permitida: ${p.min} a ${p.max} anos.`,
            String(idade), 'identificacao', 'data_nascimento')
        }
      }

      if (temAluno) {
        for (const etapaCod of etapasAluno) {
          const entry = IDADES_PERMITIDAS.alunos.find((a) => a.etapa_codigo === etapaCod)
          if (entry && (idade < entry.idade_min || idade > entry.idade_max)) {
            addErro(pessoa, 'data_nascimento', 5, 'Idade do aluno × Etapa',
              `Idade do aluno: ${idade} anos. Faixa permitida para ${entry.etapa_nome}: ${entry.idade_min} a ${entry.idade_max} anos.`,
              String(idade), 'identificacao', 'data_nascimento')
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 4. Deficiência incompatibility rules (10 rules)
    // -------------------------------------------------------------------

    const defAtivas = DEF_CAMPOS.filter(([col]) => b(pessoa, col)).map(([col, num, nome]) => ({ col, num, nome }))
    const defAtivasSet = new Set(defAtivas.map((d) => d.col))
    const transtornosAtivos = TRANSTORNO_COLS.filter((col) => b(pessoa, col))
    const temDeficiencia = defAtivas.length > 0
    const temTranstorno = transtornosAtivos.length > 0
    const tea = b(pessoa, 'tea')
    const altasHabilidades = b(pessoa, 'altas_habilidades')
    const deficienciaMultipla = b(pessoa, 'deficiencia_multipla')

    // Logar ajuda para deficiências ativas
    const defNomes = (cols: string[]): string => cols.map((c) => {
      const found = DEF_CAMPOS.find(([col]) => col === c)
      return found ? found[2] : c
    }).join(', ')

    // Rule (b): Cegueira + Baixa Visão
    if (defAtivasSet.has('cegueira') && defAtivasSet.has('baixa_visao')) {
      addErro(pessoa, 'cegueira', 18, 'Incompatibilidade: Cegueira + Baixa Visão',
        'Cegueira e Baixa Visão não podem ser marcadas simultaneamente.',
        '', 'deficiencias', 'baixa_visao')
    }

    // Rule (c): Cegueira + Visão Monocular
    if (defAtivasSet.has('cegueira') && defAtivasSet.has('visao_monocular')) {
      addErro(pessoa, 'cegueira', 18, 'Incompatibilidade: Cegueira + Visão Monocular',
        'Cegueira e Visão Monocular não podem ser marcadas simultaneamente.',
        '', 'deficiencias', 'visao_monocular')
    }

    // Rules (a) + (j): Surdocegueira cannot coexist with Cegueira, Baixa Visão, Surdez, Def. Auditiva
    if (defAtivasSet.has('surdocegueira')) {
      const conflitosSurdocegueira = ['cegueira', 'baixa_visao', 'surdez', 'deficiencia_auditiva']
        .filter((c) => defAtivasSet.has(c))
      for (const conflito of conflitosSurdocegueira) {
        const nomeConflito = DEF_CAMPOS.find(([col]) => col === conflito)?.[2] || conflito
        addErro(pessoa, conflito, 19, 'Incompatibilidade: Surdocegueira + outra deficiência',
          `Surdocegueira não pode coexistir com "${nomeConflito}" (a surdocegueira já contempla ambas as condições).`,
          '', 'deficiencias', conflito)
      }
    }

    // Rule (a)/alternative: Cegueira + Surdez (if surdocegueira is NOT marked)
    if (!defAtivasSet.has('surdocegueira') && defAtivasSet.has('cegueira') && defAtivasSet.has('surdez')) {
      addErro(pessoa, 'cegueira', 18, 'Incompatibilidade: Cegueira + Surdez',
        'Cegueira e Surdez não podem ser marcadas simultaneamente. Use Surdocegueira.',
        '', 'deficiencias', 'surdez')
    }

    // Rule (d): Surdez + Deficiência Auditiva
    if (defAtivasSet.has('surdez') && defAtivasSet.has('deficiencia_auditiva')) {
      addErro(pessoa, 'surdez', 21, 'Incompatibilidade: Surdez + Def. Auditiva',
        'Surdez e Deficiência Auditiva não podem ser marcadas simultaneamente.',
        '', 'deficiencias', 'deficiencia_auditiva')
    }

    // Rule (e): Deficiência Múltipla cannot coexist with any single deficiência (except surdocegueira)
    if (deficienciaMultipla) {
      const defsExcetoSurdocegueira = defAtivas.filter((d) => d.col !== 'surdocegueira')
      if (defsExcetoSurdocegueira.length > 0) {
        addErro(pessoa, 'deficiencia_multipla', 26, 'Incompatibilidade: Def. Múltipla + deficiência específica',
          `Deficiência Múltipla não pode coexistir com deficiências específicas: ${defNomes(defsExcetoSurdocegueira.map((d) => d.col))}.`,
          '', 'deficiencias', 'deficiencia_multipla')
      }
      // Also validate >=2 of campos 18-25
      const qtdDef18a25 = DEF_CAMPOS.filter(([col]) => b(pessoa, col)).length
      if (qtdDef18a25 < 2) {
        addErro(pessoa, 'deficiencia_multipla', 26, 'Def. Múltipla sem deficiências suficientes',
          'Deficiência Múltipla marcada mas menos de 2 deficiências (campos 18-25) estão ativas.',
          '', 'deficiencias', 'deficiencia_multipla')
      }
    }

    // Rule (f): TEA + Def. Intelectual cannot add outras deficiências (except surdocegueira)
    if (tea && b(pessoa, 'deficiencia_intelectual')) {
      const outrasDefs = defAtivas.filter((d) =>
        d.col !== 'deficiencia_intelectual' && d.col !== 'surdocegueira' &&
        d.col !== 'tea' && !['discalculia', 'disgrafia', 'dislalia', 'dislexia', 'tdah', 'tpac'].includes(d.col),
      )
      if (outrasDefs.length > 0) {
        addErro(pessoa, 'tea', 27, 'Incompatibilidade: TEA + Def. Intelectual + outra deficiência',
          `TEA com Deficiência Intelectual não pode ter outras deficiências adicionais: ${defNomes(outrasDefs.map((d) => d.col))}.`,
          '', 'deficiencias', 'tea')
      }
    }

    // Rule (g): Any deficiência + Transtornos
    if (temDeficiencia && temTranstorno) {
      addErro(pessoa, 'transtorno_aprendizagem', 30, 'Incompatibilidade: Deficiência + Transtorno',
        `Transtornos (${transtornosAtivos.map((c) => TRANSTORNO_NAMES[c] || c).join(', ')}) não devem ser marcados quando há deficiências ativas.`,
        '', 'deficiencias', 'transtorno_aprendizagem')
    }

    // Rule (h): Altas Habilidades é exclusiva
    if (altasHabilidades && (temDeficiencia || temTranstorno)) {
      addErro(pessoa, 'altas_habilidades', 28, 'Incompatibilidade: Altas Habilidades + outra condição',
        'Altas Habilidades/Superdotação não pode coexistir com outras deficiências ou transtornos.',
        '', 'deficiencias', 'altas_habilidades')
    }

    // Rule (i): Def. Intelectual + Transtornos → redundantes
    if (b(pessoa, 'deficiencia_intelectual') && temTranstorno) {
      addErro(pessoa, 'deficiencia_intelectual', 25, 'Incompatibilidade: Def. Intelectual + Transtorno',
        `Transtornos são redundantes quando há Deficiência Intelectual: ${transtornosAtivos.map((c) => TRANSTORNO_NAMES[c] || c).join(', ')}.`,
        '', 'deficiencias', 'deficiencia_intelectual')
    }

    // -------------------------------------------------------------------
    // 5. Recursos × Deficiências (Anexo 4)
    // -------------------------------------------------------------------
    const recursosAtivos: { campo: number; col: string; nome: string }[] = []

    for (const [campo, col] of Object.entries(RECURSO_CAMPO_COL)) {
      if (b(pessoa, col)) {
        const entry = RECURSOS_DEFICIENCIAS.find((r) => r.recurso_campo === Number(campo))
        recursosAtivos.push({ campo: Number(campo), col, nome: entry?.recurso_nome || col })
      }
    }

    if (recursosAtivos.length > 0 && !temDeficiencia) {
      addErro(pessoa, 'auxilio_ledor', 36, 'Recursos sem deficiência',
        'Recursos de acessibilidade estão marcados mas a pessoa não possui nenhuma deficiência.',
        '', 'recursos', 'auxilio_ledor')
    }

    if (temDeficiencia) {
      for (const recurso of recursosAtivos) {
        const entry = RECURSOS_DEFICIENCIAS.find((r) => r.recurso_campo === recurso.campo)
        if (!entry) continue

        for (const def of defAtivas) {
          const compat = entry.compatibilidade[def.col]
          if (compat === 'N') {
            addErro(pessoa, recurso.col, recurso.campo, 'Recurso × Deficiência (Anexo 4 - regra N)',
              `Recurso "${recurso.nome}" não é permitido para a deficiência "${def.nome}" (regra N do Anexo 4).`,
              '', 'recursos', recurso.col)
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 6. Recursos × Transtornos (only 36, 37, 48 allowed)
    // -------------------------------------------------------------------
    if (temTranstorno && recursosAtivos.length > 0) {
      const RECURSOS_PERMITIDOS_TRANSTORNO = new Set([36, 37, 48])
      const recursosInvalidos = recursosAtivos.filter((r) => !RECURSOS_PERMITIDOS_TRANSTORNO.has(r.campo))

      for (const recurso of recursosInvalidos) {
        addErro(pessoa, recurso.col, recurso.campo, 'Recurso × Transtorno (não permitido)',
          `Recurso "${recurso.nome}" não é compatível com transtornos de aprendizagem. Apenas Auxílio Ledor (36), Auxílio Transcrição (37) e Tempo Adicional (48) são permitidos.`,
          '', 'recursos', recurso.col)
      }
    }

    // -------------------------------------------------------------------
    // 7. Formação acadêmica (if temGestor or temProfissional)
    // -------------------------------------------------------------------
    if (temGestor || temProfissional) {
      const escolaridade = s(pessoa, 'escolaridade')
      if (!escolaridade) {
        addErro(pessoa, 'escolaridade', 6, 'Escolaridade obrigatória',
          'Escolaridade é obrigatória para gestores e profissionais.',
          '', 'formacao', 'escolaridade')
      }

      // Cursos superiores: validate format
      for (let i = 1; i <= 3; i++) {
        const cursoCol = `curso_superior_${i}`
        const anoCol = `ano_conclusao_${i}`
        const iesCol = `ies_${i}`

        const curso = s(pessoa, cursoCol)
        const ano = s(pessoa, anoCol)
        const ies = s(pessoa, iesCol)

        if (curso) {
          if (curso.length !== 6 || !/^\d+$/.test(curso)) {
            addErro(pessoa, cursoCol, 7, 'Código de curso superior inválido',
              `Curso superior ${i}: código deve ter 6 dígitos numéricos.`,
              curso, 'formacao', cursoCol)
          }
        }
        if (ano) {
          const anoNum = parseInt(ano, 10)
          if (isNaN(anoNum) || anoNum < 1900 || anoNum > anoAtual) {
            addErro(pessoa, anoCol, 7, 'Ano de conclusão inválido',
              `Curso superior ${i}: ano de conclusão "${ano}" é inválido. Deve estar entre 1900 e ${anoAtual}.`,
              ano, 'formacao', anoCol)
          }
        }
        if (ies) {
          if (ies.length !== 6 || !/^\d+$/.test(ies)) {
            addErro(pessoa, iesCol, 7, 'Código IES inválido',
              `Curso superior ${i}: código da IES deve ter 6 dígitos numéricos.`,
              ies, 'formacao', iesCol)
          }
        }
      }
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 40 — GESTORES
// ---------------------------------------------------------------------------

export async function validarRegistro40(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: escola, error: errEscola } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single()

  if (errEscola || !escola) {
    erros.push(
      criarErro('40', 'school', 0, 'REGISTRO_NAO_ENCONTRADO',
        `Escola ${schoolId} não encontrada.`,
        schoolId, '', schoolId, '', 'gestores'),
    )
    return erros
  }

  const nomeEscola = escola.nome_escola || ''
  const dependencia = escola.dependencia_administrativa
  const isPublica = dependencia === '1' || dependencia === '2' || dependencia === '3'
  const situacao = escola.situacao_funcionamento

  const addErro = (
    campo_inep: string,
    numero_campo: number,
    regra: string,
    mensagem: string,
    entidadeId: string,
    entidadeNome: string,
    valor_atual?: string,
  ) => {
    erros.push(
      criarErro(
        '40', campo_inep, numero_campo, regra, mensagem,
        entidadeId, entidadeNome, schoolId,
        valor_atual, 'gestores', campo_inep,
      ),
    )
  }

  // -----------------------------------------------------------------------
  // 1. COLETAR GESTORES
  // -----------------------------------------------------------------------

  const gestores: {
    id: string
    person_id: string | null
    cpf: string | null
    nome: string
    cargo: string
    criterio_acesso: string | null
    situacao_funcional: string | null
    origem: 'schools' | 'managers'
  }[] = []

  // 1a. Gestor principal da tabela schools
  if (escola.cpf_gestor) {
    const { data: pessoa } = await supabase
      .from('people')
      .select('id, nome_completo')
      .eq('cpf', escola.cpf_gestor)
      .maybeSingle()

    gestores.push({
      id: pessoa?.id || 'unknown',
      person_id: pessoa?.id || null,
      cpf: escola.cpf_gestor,
      nome: escola.nome_gestor || pessoa?.nome_completo || 'Gestor (schools)',
      cargo: '', // não definido na tabela schools, será validado abaixo
      criterio_acesso: null,
      situacao_funcional: null,
      origem: 'schools',
    })
  }

  // 1b. Gestores da tabela managers (via people.school_id)
  const { data: managers, error: errMan } = await supabase
    .from('managers')
    .select('id, person_id, cargo, criterio_acesso, situacao_funcional')
    .not('person_id', 'is', null)

  if (!errMan && managers) {
    for (const m of managers) {
      if (!m.person_id) continue
      const { data: p } = await supabase
        .from('people')
        .select('id, nome_completo, cpf, school_id')
        .eq('id', m.person_id)
        .maybeSingle()

      if (!p || p.school_id !== schoolId) continue

      // Deduplicar com gestor da schools
      if (p.cpf && gestores.some((g) => g.cpf === p.cpf)) continue

      gestores.push({
        id: m.id,
        person_id: m.person_id,
        cpf: p.cpf || null,
        nome: p.nome_completo || 'Gestor (managers)',
        cargo: m.cargo || '',
        criterio_acesso: m.criterio_acesso || null,
        situacao_funcional: m.situacao_funcional || null,
        origem: 'managers',
      })
    }
  }

  // -----------------------------------------------------------------------
  // 2. MAX 3 GESTORES
  // -----------------------------------------------------------------------

  if (gestores.length > 3) {
    addErro(
      'cargo', 1,
      'Máximo de gestores',
      `A escola possui ${gestores.length} gestores. O INEP aceita no máximo 3 gestores por escola.`,
      schoolId, nomeEscola,
      String(gestores.length),
    )
    // Continua validando apenas os 3 primeiros
  }

  const gestoresParaValidar = gestores.slice(0, 3)

  // -----------------------------------------------------------------------
  // 3a. Pré-buscar pessoas referenciadas pelos gestores (Registro 30)
  // -----------------------------------------------------------------------

  const personIdsGestores = gestoresParaValidar
    .map((g) => g.person_id)
    .filter((id): id is string => !!id)

  const pessoasGestoresMap = new Map<string, { id: string; nome_completo: string }>()
  if (personIdsGestores.length > 0) {
    const { data: pessoasBatch } = await supabase
      .from('people')
      .select('id, nome_completo')
      .in('id', personIdsGestores)
    if (pessoasBatch) {
      for (const p of pessoasBatch) {
        pessoasGestoresMap.set(p.id, p)
      }
    }
  }

  // -----------------------------------------------------------------------
  // 3. VALIDAR CADA GESTOR
  // -----------------------------------------------------------------------

  for (const gestor of gestoresParaValidar) {
    const entidadeId = gestor.id
    const entidadeNome = gestor.nome

    // 3b. Pessoa deve existir na tabela people (Registro 30)
    if (!gestor.person_id) {
      addErro(
        'codigo_pessoa', 2,
        'Gestor sem pessoa',
        `O gestor "${gestor.nome}" (CPF: ${gestor.cpf || 'não informado'}) não possui vínculo com uma pessoa na base (Registro 30).`,
        entidadeId, entidadeNome,
        gestor.cpf || '(vazio)',
      )
      continue
    }

    if (!pessoasGestoresMap.has(gestor.person_id)) {
      addErro(
        'codigo_pessoa', 2,
        'Pessoa não encontrada',
        `Pessoa com ID ${gestor.person_id} não encontrada na base (Registro 30).`,
        entidadeId, entidadeNome,
        gestor.person_id,
      )
      continue
    }

    // 3c. Cargo deve ser '1' (Diretor) ou '2' (Outro Cargo)
    if (!gestor.cargo || !['1', '2'].includes(gestor.cargo)) {
      addErro(
        'cargo', 1,
        'Cargo do gestor',
        'O cargo deve ser 1 (Diretor) ou 2 (Outro Cargo).',
        entidadeId, entidadeNome,
        gestor.cargo || '(vazio)',
      )
    }

    // 3d. Critério de acesso (quando cargo='1' e situacao_funcionamento='1')
    if (gestor.cargo === '1' && situacao === '1') {
      if (!gestor.criterio_acesso) {
        addErro(
          'criterio_acesso', 3,
          'Critério de acesso',
          'Critério de acesso é obrigatório para diretores em escolas em atividade.',
          entidadeId, entidadeNome,
          '(vazio)',
        )
      } else if (!['1', '2', '3', '4', '5', '6', '7'].includes(gestor.criterio_acesso)) {
        addErro(
          'criterio_acesso', 3,
          'Critério de acesso',
          'Critério de acesso deve ser 1, 2, 3, 4, 5, 6 ou 7.',
          entidadeId, entidadeNome,
          gestor.criterio_acesso,
        )
      } else {
        // 3e. Critério × Dependência
        if (isPublica && gestor.criterio_acesso === '1') {
          addErro(
            'criterio_acesso', 3,
            'Critério de acesso × Dependência',
            'Critério de acesso "1" (proprietário) não é permitido para escolas públicas.',
            entidadeId, entidadeNome,
            gestor.criterio_acesso,
          )
        }
        if (dependencia === '4' && ['4', '5', '6'].includes(gestor.criterio_acesso)) {
          addErro(
            'criterio_acesso', 3,
            'Critério de acesso × Dependência',
            `Critério de acesso "${gestor.criterio_acesso}" (concurso/eleição/processo seletivo) não é permitido para escolas privadas.`,
            entidadeId, entidadeNome,
            gestor.criterio_acesso,
          )
        }
      }

      // 3f. Situação funcional (quando cargo='1' e situacao='1' e publica)
      if (isPublica) {
        if (!gestor.situacao_funcional) {
          addErro(
            'situacao_funcional', 4,
            'Situação funcional',
            'Situação funcional é obrigatória para diretores em escolas públicas em atividade.',
            entidadeId, entidadeNome,
            '(vazio)',
          )
        } else if (!['1', '2', '3', '4'].includes(gestor.situacao_funcional)) {
          addErro(
            'situacao_funcional', 4,
            'Situação funcional',
            'Situação funcional deve ser 1 (Concursado), 2 (Contrato Temporário), 3 (Contrato Terceirizado) ou 4 (Contrato CLT).',
            entidadeId, entidadeNome,
            gestor.situacao_funcional,
          )
        }
      }
    }
  }

  return erros
}
// ---------------------------------------------------------------------------
// REGISTRO 50 — PROFISSIONAIS POR TURMA
// ---------------------------------------------------------------------------

// Maps turma.area_* boolean fields to their INEP area codes (2-char)
const AREA_BOOL_TO_CODIGO: Record<string, string> = {
  area_quimica: '01',
  area_fisica: '02',
  area_matematica_turma: '03',
  area_biologia: '04',
  area_ciencias: '05',
  area_portugues: '06',
  area_ingles: '07',
  area_espanhol: '08',
  area_outra_estrangeira: '09',
  area_arte: '10',
  area_ed_fisica: '11',
  area_historia: '12',
  area_geografia: '13',
  area_filosofia: '14',
  area_informatica: '16',
  area_profissionalizantes: '17',
  area_libras: '23',
  area_pedagogicas: '25',
  area_ensino_religioso: '26',
  area_lingua_indigena: '27',
  area_estudos_sociais: '28',
  area_sociologia: '29',
  area_frances: '30',
  area_portugues_sl: '31',
  area_estagio: '32',
  area_projeto_vida: '33',
  area_outras: '99',
}

function getCodigosAreaTurma(turma: Record<string, unknown>): string[] {
  const codigos: string[] = []
  for (const [key, codigo] of Object.entries(AREA_BOOL_TO_CODIGO)) {
    if (turma[key as string]) codigos.push(codigo)
  }
  return codigos
}

function isEad(turma: Record<string, unknown>): boolean {
  return turma.tipo_mediacao === 'Educação a Distância - EAD'
}

function tipoMediacaoCodigo(turma: Record<string, unknown>): string {
  const v = turma.tipo_mediacao
  if (v === 'Presencial') return '1'
  if (v === 'Semipresencial') return '2'
  if (v === 'Educação a Distância - EAD') return '3'
  return String(v ?? '')
}

function turmaHasTipo(turma: Record<string, unknown>, tipo: string): boolean {
  const tt = turma.tipos_turma
  if (!tt) return false
  if (Array.isArray(tt)) return tt.includes(tipo)
  if (typeof tt === 'string') {
    try {
      const arr = JSON.parse(tt)
      return Array.isArray(arr) && arr.includes(tipo)
    } catch {
      return tt.includes(tipo)
    }
  }
  return false
}

export async function validarRegistro50(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: escola, error: errEscola } = await supabase
    .from('schools')
    .select('dependencia_administrativa')
    .eq('id', schoolId)
    .single()

  if (errEscola || !escola) {
    erros.push(
      criarErro('50', 'school', 0, 'REGISTRO_NAO_ENCONTRADO',
        `Escola ${schoolId} não encontrada.`,
        schoolId, '', schoolId, '', 'profissionais'),
    )
    return erros
  }

  const dependencia = escola.dependencia_administrativa
  const isPublica = dependencia === '1' || dependencia === '2' || dependencia === '3'

  const { data: vinculos, error: errVinc } = await supabase
    .from('turmas_profissionais')
    .select('id, turma_id, person_id, ativo, disciplinas_ids, vinculo_profissional_id')

  if (errVinc || !vinculos || vinculos.length === 0) return erros

  const turmaIds = [...new Set(vinculos.map((v) => v.turma_id))]
  const { data: turmas, error: errTur } = await supabase
    .from('turmas')
    .select('id, nome, tipo_mediacao, tipos_turma, etapa_codigo, fgb, ifa, iftp, ifa_linguagens, ifa_matematica, ifa_natureza, ifa_humanas, areas_itinerario, area_quimica, area_fisica, area_matematica_turma, area_biologia, area_ciencias, area_portugues, area_ingles, area_espanhol, area_outra_estrangeira, area_arte, area_ed_fisica, area_historia, area_geografia, area_filosofia, area_informatica, area_profissionalizantes, area_libras, area_pedagogicas, area_ensino_religioso, area_lingua_indigena, area_estudos_sociais, area_sociologia, area_frances, area_portugues_sl, area_estagio, area_projeto_vida, area_outras, school_id')
    .in('id', turmaIds)

  if (errTur || !turmas) return erros

  const turmaMap = new Map(turmas.map((t) => [t.id, t]))

  // Build lookup maps for derived data
  const vinculoProfIds = [...new Set(vinculos.map((v) => v.vinculo_profissional_id).filter(Boolean))]
  const vinculoProfMap = new Map<string, any>()
  if (vinculoProfIds.length > 0) {
    const { data: vps } = await supabase
      .from('vinculos_profissionais')
      .select('id, regime_contratacao, funcao_id')
      .in('id', vinculoProfIds as string[])
    for (const vp of (vps || [])) vinculoProfMap.set(vp.id, vp)
  }

  const funcaoIds = [...new Set(Array.from(vinculoProfMap.values()).map((vp) => vp.funcao_id).filter(Boolean))]
  const funcaoProfMap = new Map<string, any>()
  if (funcaoIds.length > 0) {
    const { data: fps } = await supabase
      .from('funcoes_profissionais')
      .select('id, nome')
      .in('id', funcaoIds as string[])
    for (const fp of (fps || [])) funcaoProfMap.set(fp.id, fp)
  }

  const allDiscIds = [...new Set(vinculos.flatMap((v) => (v.disciplinas_ids || []) as string[]))]
  const discAreaMap = new Map<string, number>()
  if (allDiscIds.length > 0) {
    const { data: discs } = await supabase
      .from('academico_disciplinas')
      .select('id, area_codigo')
      .in('id', allDiscIds)
    for (const d of (discs || [])) {
      if (d.area_codigo != null) discAreaMap.set(d.id, d.area_codigo)
    }
  }

  const derivarFuncao = (v: any): string => {
    const vp = v.vinculo_profissional_id ? vinculoProfMap.get(v.vinculo_profissional_id) : null
    const fp = vp?.funcao_id ? funcaoProfMap.get(vp.funcao_id) : null
    return getFuncaoCenso50(fp?.nome || '')
  }

  const vinculosPorTurma = new Map<string, typeof vinculos>()
  for (const v of vinculos) {
    if (!vinculosPorTurma.has(v.turma_id)) vinculosPorTurma.set(v.turma_id, [])
    vinculosPorTurma.get(v.turma_id)!.push(v)
  }

  const FUNCOES_NAO_EAD = ['1', '2', '3', '4', '7', '8']
  const FUNCOES_SO_EAD = ['5', '6']

  for (const [turmaId, vincs] of vinculosPorTurma) {
    const turma = turmaMap.get(turmaId) as Record<string, unknown> | undefined
    if (!turma) continue
    const turmaNome = (turma.nome as string) || turmaId
    const turmaEad = isEad(turma)
    const codigosAreaTurma = getCodigosAreaTurma(turma)
    const turmaFgb = !!turma.fgb
    const turmaIfa = !!turma.ifa
    const turmaIftp = !!turma.iftp

    for (const v of vincs) {
      const entidadeId = v.turma_id as string
      const entidadeNome = turmaNome
      const funcao = derivarFuncao(v)

      const addErro = (
        campo: string,
        numCampo: number,
        regra: string,
        msg: string,
        val?: string,
      ) => {
        erros.push(
          criarErro('50', campo, numCampo, regra, msg,
            entidadeId, entidadeNome, schoolId, val, 'profissionais', campo),
        )
      }

      // 1. Função deve ser '1'-'9'
      if (funcao && !['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(funcao)) {
        addErro('funcao_censo', 9, 'Função inválida',
          `Função "${funcao}" não é um código INEP válido (1-9).`, funcao)
        continue
      }

      if (!funcao) {
        addErro('funcao_censo', 9, 'Função obrigatória',
          'A função INEP (funcao_censo) deve ser informada (1-9).', '(vazio)')
        continue
      }

      // 2. Função × Tipo de Mediação
      if (turmaEad && FUNCOES_NAO_EAD.includes(funcao)) {
        const nomesFuncao: Record<string, string> = {
          '1': 'Docente', '2': 'Auxiliar', '3': 'Profissional/Monitor',
          '4': 'Tradutor/Intérprete de Libras', '7': 'Guia-Intérprete', '8': 'Intérprete de Libras',
        }
        addErro('funcao_censo', 9, 'Função × Mediação',
          `Função "${funcao}" (${nomesFuncao[funcao] || ''}) não é permitida para turmas EAD.`,
          funcao)
      }

      if (!turmaEad && FUNCOES_SO_EAD.includes(funcao)) {
        const nomesFuncao: Record<string, string> = { '5': 'Docente Titular', '6': 'Docente Tutor' }
        addErro('funcao_censo', 9, 'Função × Mediação',
          `Função "${funcao}" (${nomesFuncao[funcao] || ''}) só é permitida para turmas EAD.`,
          funcao)
      }

      // 3. Função '2' (Auxiliar) apenas para turma curricular
      if (funcao === '2') {
        if (turmaHasTipo(turma, 'aee') || turmaHasTipo(turma, 'complementar')) {
          addErro('funcao_censo', 9, 'Função × Tipo de turma',
            'Função "2" (Auxiliar) não é permitida para turmas AEE ou de atividade complementar.',
            funcao)
        }
      }

      // 4. Função '3' (Monitor) apenas para turma com atividade complementar
      if (funcao === '3') {
        if (!turmaHasTipo(turma, 'complementar') && !turmaHasTipo(turma, 'atividade_complementar')) {
          addErro('funcao_censo', 9, 'Função × Tipo de turma',
            'Função "3" (Profissional/Monitor) só é permitida para turmas com atividade complementar.',
            funcao)
        }
      }

      // 5. Função '9' (Auxiliar AEE) apenas quando turma.iftp = true
      if (funcao === '9') {
        if (!turmaIftp) {
          addErro('funcao_censo', 9, 'Função × IFTP',
            'Função "9" (Auxiliar AEE) só é permitida para turmas com IFTP.',
            funcao)
        }
      }

      // 6. No Tradutor/Tutor EAD exclusivo
      // Se todos os profissionais da turma são do tipo 4 (tradutor_libras) ou 6 (docente_tutor_ead), erro
      const tiposRestritos = new Set(vincs.map((x) => derivarFuncao(x)))
      if (tiposRestritos.size > 0) {
        const todosRestritos = [...tiposRestritos].every((f) => f === '4' || f === '6')
        if (todosRestritos) {
          addErro('funcao_censo', 9, 'Turma sem docente principal',
            'A turma não pode ter apenas Tradutor de Libras (4) ou Docente Tutor EAD (6). Deve haver ao menos um docente principal (1, 5, etc.).',
            [...tiposRestritos].join(','))
        }
      }

      // 7. Situação funcional (função '1','5','6' + pública)
      if (['1', '5', '6'].includes(funcao) && isPublica) {
        const vpSit = v.vinculo_profissional_id ? vinculoProfMap.get(v.vinculo_profissional_id) : null
        const sf = vpSit?.regime_contratacao || ''
        if (!sf) {
          addErro('situacao_funcional', 10, 'Situação funcional obrigatória',
            'Situação funcional é obrigatória para docentes em escolas públicas.', '(vazio)')
        } else if (!['1', '2', '3', '4'].includes(sf)) {
          addErro('situacao_funcional', 10, 'Situação funcional inválida',
            `Situação funcional "${sf}" inválida. Deve ser 1 (Concursado), 2 (Contrato Temporário), 3 (Contrato Terceirizado) ou 4 (Contrato CLT).`, sf)
        }
      }

      // 8. Áreas — sequentiality (sem lacunas)
      if (funcao === '1' || funcao === '5') {
        const disciplinasIds = (v.disciplinas_ids || []) as string[]
        const areaCodes = [...new Set(
          disciplinasIds
            .map((did: string) => discAreaMap.get(did))
            .filter((c): c is number => c != null)
            .map((c: number) => String(c).padStart(2, '0')),
        )]
        const areas: (string | null)[] = []
        for (let i = 0; i < 25; i++) {
          areas.push(i < areaCodes.length ? areaCodes[i] : null)
        }

        let foundEmpty = false
        for (let i = 0; i < areas.length; i++) {
          if (!areas[i]) {
            foundEmpty = true
          } else if (foundEmpty) {
            addErro(`area_censo_${i + 1}`, 10 + i, 'Sequencialidade de áreas',
              `Área do conhecimento "${areas[i]}" preenchida na posição ${i + 1} mas a posição anterior está vazia. Preencha as áreas sem lacunas.`,
              areas[i] || undefined)
            break
          }
        }

        // Cada área preenchida deve ser uma área que a turma oferece
        for (let i = 0; i < areas.length; i++) {
          const areaCod = areas[i]
          if (!areaCod) continue
          if (!codigosAreaTurma.includes(areaCod)) {
            addErro(`area_censo_${i + 1}`, 10 + i, 'Área não ofertada',
              `A área "${areaCod}" (posição ${i + 1}) não é ofertada pela turma "${turmaNome}".`,
              areaCod)
          }
        }
      }

      // 9. Itinerário (FGB+IFA) — pelo menos um leciona_* deve ser true
      if (turmaFgb && turmaIfa) {
        const itinAreas = (turma.areas_itinerario || []) as string[]
        const lecLing = itinAreas.some((a: string) => /linguagens/i.test(a))
        const lecMat = itinAreas.some((a: string) => /matemática/i.test(a))
        const lecNat = itinAreas.some((a: string) => /natureza/i.test(a))
        const lecHum = itinAreas.some((a: string) => /humanas/i.test(a))

        if (!lecLing && !lecMat && !lecNat && !lecHum) {
          addErro('leciona_linguagens', 36, 'Itinerário formativo obrigatório',
            'Para turmas com FGB+IFA, pelo menos um dos campos "leciona_linguagens", "leciona_matematica", "leciona_natureza" ou "leciona_humanas" deve ser verdadeiro.',
            '(todos false)')
        }
      }
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO 60 — MATRÍCULAS DE ALUNOS
// ---------------------------------------------------------------------------

// Mapa: etapa_codigo da turma → turma_multi valores permitidos (6 regras)
const TURMA_MULTI_PERMITIDOS: Record<string, number[]> = {
  '3': [1, 2], // Ed Infantil Unificada → Creche ou Pré-escola
  '22': [14, 15, 16, 17, 18, 19, 20, 21, 41], // Multi EF → anos iniciais/finais
  '23': [14, 15, 16, 17, 18, 19, 20, 21, 41], // Correção de Fluxo → anos EF
  '56': [69, 70, 72], // Multietapa → EJA EF
}

const AEE_FIELDS = [
  'aee_funcao_cognitiva', 'aee_vida_autonoma', 'aee_enriquecimento',
  'aee_informatica', 'aee_libras', 'aee_portugues_sl',
  'aee_soroban', 'aee_braille', 'aee_orientacao',
  'aee_caa', 'aee_recursos',
]

const VEICULO_FIELDS = [
  'veiculo_bicicleta', 'veiculo_microonibus', 'veiculo_onibus',
  'veiculo_tracao', 'veiculo_vans', 'veiculo_outro',
  'veiculo_aqua_5', 'veiculo_aqua_15', 'veiculo_aqua_35', 'veiculo_aqua_mais',
]

function calcularIdade(dataNascimento: string | null, dataRef: Date): number | null {
  if (!dataNascimento) return null
  const nasc = new Date(dataNascimento)
  if (isNaN(nasc.getTime())) return null
  let idade = dataRef.getFullYear() - nasc.getFullYear()
  const mesRef = dataRef.getMonth()
  const diaRef = dataRef.getDate()
  if (
    nasc.getMonth() > mesRef ||
    (nasc.getMonth() === mesRef && nasc.getDate() > diaRef)
  ) {
    idade--
  }
  return idade
}

// Checa se turma_multi é compatível com etapa de EM (25-29, 35-38)
function ehEtapaEM(etapaCodigo: string | null): boolean {
  if (!etapaCodigo) return false
  const cod = parseInt(etapaCodigo, 10)
  if (isNaN(cod)) return false
  return (cod >= 25 && cod <= 29) || (cod >= 35 && cod <= 38)
}

// Checa se turma_multi é compatível com etapa EJA EF (69, 70, 72)
function ehEtapaEJAFund(etapaCodigo: string | null): boolean {
  if (!etapaCodigo) return false
  return ['69', '70', '72'].includes(etapaCodigo)
}

function turmaIsCurricular(turma: Record<string, unknown>): boolean {
  return !turmaHasTipo(turma, 'aee') && !turmaHasTipo(turma, 'complementar') && !turmaHasTipo(turma, 'atividade_complementar')
}

export async function validarRegistro60(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const dataRef = new Date(2026, 4, 27) // Última quarta-feira de maio de 2026

  const { data: matriculas, error: errMat } = await supabase
    .from('academico_matriculas')
    .select('*')
    .eq('school_id', schoolId)

  if (errMat || !matriculas || matriculas.length === 0) return erros

  const turmaIds = [...new Set(matriculas.map((m) => m.turma_id).filter(Boolean))]
  const alunoIds = [...new Set(matriculas.map((m) => m.aluno_id).filter(Boolean))]

  const [
    { data: turmasList },
    { data: pessoasList },
  ] = await Promise.all([
    turmaIds.length > 0
      ? supabase.from('turmas').select('*').in('id', turmaIds)
      : Promise.resolve({ data: [] }),
    alunoIds.length > 0
      ? supabase.from('people').select('id, nome_completo, data_nascimento, pais_residencia').in('id', alunoIds)
      : Promise.resolve({ data: [] }),
  ])

  const turmaMap60 = new Map((turmasList || []).map((t) => [t.id, t]))
  const pessoaMap = new Map((pessoasList || []).map((p) => [p.id, p]))

  for (const m of matriculas) {
    const turma = turmaMap60.get(m.turma_id) as Record<string, unknown> | undefined
    const pessoa = pessoaMap.get(m.aluno_id) as Record<string, unknown> | undefined
    if (!turma || !pessoa) continue

    const entidadeId = m.id as string
    const entidadeNome = (pessoa.nome_completo as string) || 'Aluno'
    const etapaCodigo = (turma.etapa_codigo as string) || null
    const turmaNome = (turma.nome as string) || ''
    const tipoMed = tipoMediacaoCodigo(turma)

    const addErro = (
      campo: string,
      numCampo: number,
      regra: string,
      msg: string,
      val?: string,
    ) => {
      erros.push(
        criarErro('60', campo, numCampo, regra, msg,
          entidadeId, entidadeNome, schoolId, val, 'matriculas', campo),
      )
    }

    // -------------------------------------------------------------------
    // 1. TURMA MULTI
    // -------------------------------------------------------------------

    const turmaMultiRaw = m.turma_multi as string | null
    if (turmaMultiRaw) {
      const turmaMultiCod = parseInt(turmaMultiRaw, 10)

      let permitidos: number[] | null = null
      let nomeRegra = ''

      if (etapaCodigo && TURMA_MULTI_PERMITIDOS[etapaCodigo]) {
        permitidos = TURMA_MULTI_PERMITIDOS[etapaCodigo]
        nomeRegra = `Etapa ${etapaCodigo}`
      } else if (ehEtapaEM(etapaCodigo)) {
        permitidos = [25, 26, 27, 28, 29, 35, 36, 37, 38]
        nomeRegra = 'Ensino Médio'
      } else if (ehEtapaEJAFund(etapaCodigo)) {
        permitidos = [69, 70, 72]
        nomeRegra = 'EJA Ensino Fundamental'
      }

      if (permitidos) {
        if (!permitidos.includes(turmaMultiCod)) {
          addErro('turma_multi', 10, 'Turma Multi × Etapa',
            `turma_multi "${turmaMultiRaw}" não é válido para ${nomeRegra}. Valores permitidos: ${permitidos.join(', ')}.`,
            turmaMultiRaw)
        }
      }
    }

    // -------------------------------------------------------------------
    // 2. IDADE × ETAPA
    // -------------------------------------------------------------------

    const dataNasc = pessoa.data_nascimento as string | null
    if (dataNasc && etapaCodigo) {
      const cod = parseInt(etapaCodigo, 10)
      if (!isNaN(cod)) {
        const idade = calcularIdade(dataNasc, dataRef)
        if (idade !== null) {
          const faixa = IDADES_PERMITIDAS.alunos.find((a) => a.etapa_codigo === cod)
          if (faixa) {
            if (idade < faixa.idade_min || idade > faixa.idade_max) {
              addErro('data_nascimento', 5, 'Idade × Etapa',
                `Idade do aluno: ${idade} anos, mas a etapa "${faixa.etapa_nome}" exige idade entre ${faixa.idade_min} e ${faixa.idade_max} anos.`,
                String(idade))
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 3. AEE (quando turma.tipo_turma = '5')
    // -------------------------------------------------------------------

    if (turmaHasTipo(turma, 'aee') || turmaHasTipo(turma, '5')) {
      const aeeTrue = AEE_FIELDS.filter((f) => !!(m[f as keyof typeof m]))
      if (aeeTrue.length === 0) {
        addErro('aee_funcao_cognitiva', 12, 'AEE obrigatório',
          'Pelo menos um tipo de Atendimento Educacional Especializado (AEE) deve ser informado para turmas do tipo AEE.',
          '(nenhum)')
      }
    }

    // -------------------------------------------------------------------
    // 4. TRANSPORTE
    // -------------------------------------------------------------------

    const paisResidencia = (pessoa.pais_residencia as string) || ''
    if (
      paisResidencia === '76' &&
      ['1', '2'].includes(tipoMed) &&
      turmaIsCurricular(turma)
    ) {
      const responsavel = (m.transporte_responsavel as string) || ''
      const veiculosTrue = VEICULO_FIELDS.filter((f) => !!(m[f as keyof typeof m]))
      const temVeiculo = veiculosTrue.length > 0
      const temResponsavel = !!responsavel && ['2', '3'].includes(responsavel)

      if (temResponsavel || temVeiculo) {
        // Responsável obrigatório
        if (!temResponsavel) {
          addErro('transporte_responsavel', 25, 'Transporte escolar',
            'O responsável pelo transporte escolar é obrigatório quando há veículos informados.',
            '(vazio)')
        }

        // Pelo menos um veículo
        if (!temVeiculo) {
          addErro('veiculo_bicicleta', 26, 'Transporte escolar',
            'Pelo menos um tipo de veículo de transporte escolar deve ser informado.',
            '(nenhum)')
        }

        // Não podem estar TODOS os veículos true
        if (veiculosTrue.length === VEICULO_FIELDS.length) {
          addErro('veiculo_bicicleta', 26, 'Transporte escolar',
            'Todos os veículos de transporte não podem estar marcados simultaneamente.',
            'todos marcados')
        }
      }
    }

    // -------------------------------------------------------------------
    // 5. ESCOLARIZAÇÃO EXTERNA
    // -------------------------------------------------------------------

    const turmaCurricular = turmaIsCurricular(turma)
    const isPresencial = tipoMed === '1'

    if (turmaCurricular && isPresencial) {
      const escExt = m.escolarizacao_externa as string | null
      if (escExt && !['1', '2', '3'].includes(escExt)) {
        addErro('escolarizacao_externa', 23, 'Escolarização externa',
          'Escolarização externa deve ser 1 (exclusiva), 2 (complementar) ou 3 (não se aplica).',
          escExt)
      }
      if (!escExt) {
        addErro('escolarizacao_externa', 23, 'Escolarização externa',
          'Escolarização externa deve ser informada (1=exclusiva, 2=complementar, 3=não se aplica) para turmas curriculares presenciais.',
          '(vazio)')
      }
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// REGISTRO XX — VÍNCULOS DE ALUNO (CROSS-REGISTER)
// ---------------------------------------------------------------------------

export async function validarVinculosAluno(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: matriculas, error } = await supabase
    .from('academico_matriculas')
    .select('aluno_id, turma_id, turmas!inner(id, nome, tipo_turma, etapa_codigo, tipo_mediacao, iftp)')
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .eq('turmas.ativo', true)

  if (error || !matriculas?.length) return erros

  const byAluno: Record<string, (typeof matriculas)[0][]> = {}
  for (const m of matriculas) {
    if (!m.aluno_id) continue
    if (!byAluno[m.aluno_id]) byAluno[m.aluno_id] = []
    byAluno[m.aluno_id].push(m)
  }

  const { data: school } = await supabase.from('schools').select('nome_escola').eq('id', schoolId).single()
  const escolaNome = school?.nome_escola || schoolId

  for (const [alunoId, links] of Object.entries(byAluno)) {
    if (links.length <= 1) continue

    const turmaNomes = links.map((l) => (l.turmas as any)?.nome || '').filter(Boolean).join(', ')

    // Total escolarizacao links (non-AEE): max 4
    const escolarizacao = links.filter((l) => {
      const tt = ((l.turmas as any)?.tipo_turma || '').toString().toUpperCase()
      return !tt.includes('AEE')
    })
    if (escolarizacao.length > 4) {
      erros.push(criarErro(
        '60', 'vinculo', 0, 'MAX_ESCOLARIZACAO',
        `Aluno possui ${escolarizacao.length} vínculos de escolarização (máximo 4 permitidos). Turmas: ${turmaNomes}`,
        alunoId, `Aluno ${alunoId}`, schoolId, String(escolarizacao.length), 'vinculos', 'vinculo',
      ))
    }

    // Non-AEE excluding etapas 39,40,64,68: max 2
    const etapasRestritas = escolarizacao.filter((l) => {
      const etapa = parseInt((l.turmas as any)?.etapa_codigo || '0', 10)
      return ![39, 40, 64, 68].includes(etapa)
    })
    if (etapasRestritas.length > 2) {
      erros.push(criarErro(
        '60', 'vinculo', 0, 'MAX_NAO_AEE_RESTRITO',
        `Aluno possui ${etapasRestritas.length} vínculos de escolarização não-técnicos (máximo 2 permitidos). Turmas: ${turmaNomes}`,
        alunoId, `Aluno ${alunoId}`, schoolId, String(etapasRestritas.length), 'vinculos', 'vinculo',
      ))
    }

    // AEE/Complementar: max 4
    const aee = links.filter((l) => {
      const tt = ((l.turmas as any)?.tipo_turma || '').toString().toUpperCase()
      return tt.includes('AEE') || tt.includes('COMPLEMENTAR')
    })
    if (aee.length > 4) {
      erros.push(criarErro(
        '60', 'vinculo', 0, 'MAX_AEE',
        `Aluno possui ${aee.length} vínculos AEE/Complementar (máximo 4 permitidos). Turmas: ${turmaNomes}`,
        alunoId, `Aluno ${alunoId}`, schoolId, String(aee.length), 'vinculos', 'vinculo',
      ))
    }

    // IFTP exclusivo + etapas 1,2,14-18 conflict
    const hasIftp = links.some((l) => !!(l.turmas as any)?.iftp)
    const hasEtapaInfantil = links.some((l) => {
      const etapa = parseInt((l.turmas as any)?.etapa_codigo || '0', 10)
      return [1, 2, 14, 15, 16, 17, 18].includes(etapa)
    })
    if (hasIftp && hasEtapaInfantil) {
      erros.push(criarErro(
        '60', 'iftp', 0, 'IFTP_CONFLITO_ETAPA',
        `Aluno vinculado simultaneamente a turma IFTP e turma de Educação Infantil/EF Anos Iniciais. Isto não é permitido.`,
        alunoId, `Aluno ${alunoId}`, schoolId, '', 'vinculos', 'iftp',
      ))
    }

    // Duplicate: same student in same turma twice
    const turmaIds = links.map((l) => l.turma_id)
    const dups = turmaIds.filter((id, idx) => turmaIds.indexOf(id) !== idx)
    if (dups.length > 0) {
      erros.push(criarErro(
        '60', 'turma_id', 0, 'MATRICULA_DUPLICADA',
        `Aluno matriculado mais de uma vez na mesma turma.`,
        alunoId, `Aluno ${alunoId}`, schoolId, '', 'vinculos', 'turma_id',
      ))
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// VALIDAÇÃO DE DESCARACTERIZAÇÃO (CROSS-REGISTER INTEGRITY)
// ---------------------------------------------------------------------------

export async function validarDescaracterizacao(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: school, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', schoolId)
    .single()

  if (error || !school) {
    erros.push(criarErro(
      '00', 'id', 0, 'ESCOLA_NAO_ENCONTRADA',
      'Escola não encontrada no banco de dados.',
      schoolId, '', schoolId, '', 'identificacao',
    ))
    return erros
  }

  const nomeEscola: string = school.nome_escola || schoolId

  // 1. codigo_inep obrigatório para exportação
  if (!school.codigo_inep || !/^\d{8}$/.test(school.codigo_inep)) {
    erros.push(criarErro(
      '00', 'codigo_inep', 2, 'CODIGO_INEP_OBRIGATORIO',
      'A escola não possui código INEP válido. A exportação está bloqueada. Obtenha o código INEP junto ao órgão competente.',
      schoolId, nomeEscola, schoolId, school.codigo_inep || '(vazio)',
      'identificacao', 'codigo_inep',
    ))
  }

  // 2. Escola paralisada/extinta só deve ter registros 00, 30, 40
  const situacao = school.situacao_funcionamento
  if (situacao === '2' || situacao === '3') {
    const { data: turmas, error: turmasErr } = await supabase
      .from('turmas')
      .select('id, nome')
      .eq('school_id', schoolId)
      .eq('ativo', true)

    if (!turmasErr && turmas && turmas.length > 0) {
      const nomes = turmas.map((t: any) => t.nome || '').filter(Boolean).join(', ')
      erros.push(criarErro(
        '00', 'situacao_funcionamento', 3, 'ESCOLA_PARALISADA_COM_TURMAS',
        `Escola está ${situacao === '2' ? 'paralisada' : 'extinta'} mas possui ${turmas.length} turma(s) ativa(s): ${nomes}. Apenas registros 00, 30 e 40 devem ser exportados para escolas nesta situação.`,
        schoolId, nomeEscola, schoolId, situacao,
        'identificacao', 'situacao_funcionamento',
      ))
    }
  }

  // 3. Profissional lecionando na turma onde é aluno
  const { data: profs } = await supabase
    .from('turmas_profissionais')
    .select('person_id, turma_id')
    .eq('turmas.school_id', schoolId)
    .not('person_id', 'is', null)

  const { data: mats } = await supabase
    .from('academico_matriculas')
    .select('aluno_id, turma_id')
    .eq('school_id', schoolId)
    .eq('ativo', true)

  if (profs?.length && mats?.length) {
    const profSet = new Map<string, Set<string>>()
    for (const p of profs) {
      if (!profSet.has(p.person_id)) profSet.set(p.person_id, new Set())
      profSet.get(p.person_id)!.add(p.turma_id)
    }

    for (const m of mats) {
      if (!m.aluno_id) continue
      const turmasProf = profSet.get(m.aluno_id)
      if (turmasProf?.has(m.turma_id)) {
        erros.push(criarErro(
          '50', 'person_id', 0, 'PROFISSIONAL_E_ALUNO_MESMA_TURMA',
          `Pessoa é profissional e aluno na mesma turma. Verifique o vínculo.`,
          m.aluno_id, `Pessoa ${m.aluno_id}`, schoolId, '', 'vinculos', 'person_id',
        ))
      }
    }
  }

  // 4. Global limits
  const { count: turmaCount } = await supabase
    .from('turmas')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', schoolId)
    .eq('ativo', true)

  if (turmaCount && turmaCount > 1500) {
    erros.push(criarErro(
      '20', 'id', 0, 'LIMITE_TURMAS',
      `A escola possui ${turmaCount} turmas ativas. O limite INEP é de 1500 turmas.`,
      schoolId, nomeEscola, schoolId, String(turmaCount), 'vinculos',
    ))
  }

  return erros
}

// ---------------------------------------------------------------------------
// VALIDAÇÃO DE HORÁRIOS COINCIDENTES (PROFESSIONAL SCHEDULE CONFLICTS)
// ---------------------------------------------------------------------------

export async function validarHorariosCoincidentes(schoolId: string): Promise<ErroValidacao[]> {
  const erros: ErroValidacao[] = []

  const { data: matriculas, error } = await supabase
    .from('academico_matriculas')
    .select(`
      aluno_id,
      turmas!inner(
        id, nome, tipo_mediacao,
        horario_domingo, horario_segunda, horario_terca,
        horario_quarta, horario_quinta, horario_sexta, horario_sabado
      )
    `)
    .eq('school_id', schoolId)
    .eq('ativo', true)
    .eq('turmas.ativo', true)
    .in('turmas.tipo_mediacao', ['Presencial', '1'])

  if (error || !matriculas?.length) return erros

  const byAluno: Record<string, (typeof matriculas)[0][]> = {}
  for (const m of matriculas) {
    if (!m.aluno_id) continue
    if (!byAluno[m.aluno_id]) byAluno[m.aluno_id] = []
    byAluno[m.aluno_id].push(m)
  }

  const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

  function parseHorario(h: string | null | undefined): [number, number] | null {
    if (!h || typeof h !== 'string') return null
    const match = h.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/)
    if (!match) return null
    const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
    const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10)
    if (start >= end) return null
    return [start, end]
  }

  function hasOverlap(a: [number, number], b: [number, number]): boolean {
    return a[0] < b[1] && b[0] < a[1]
  }

  const { data: school } = await supabase.from('schools').select('nome_escola').eq('id', schoolId).single()
  const escolaNome = school?.nome_escola || schoolId

  for (const [alunoId, links] of Object.entries(byAluno)) {
    if (links.length < 2) continue

    for (let i = 0; i < links.length; i++) {
      const t1 = (links[i].turmas as any) || {}
      for (let j = i + 1; j < links.length; j++) {
        const t2 = (links[j].turmas as any) || {}

        for (const dia of diasSemana) {
          const h1 = parseHorario(t1[`horario_${dia}`])
          const h2 = parseHorario(t2[`horario_${dia}`])
          if (h1 && h2 && hasOverlap(h1, h2)) {
            const n1 = t1.nome || t1.id
            const n2 = t2.nome || t2.id
            erros.push(criarErro(
              '60', 'horario', 0, 'HORARIOS_COINCIDENTES',
              `Aluno matriculado em turmas com horários conflitantes: "${n1}" e "${n2}" se sobrepõem em ${dia}.`,
              alunoId, `Aluno ${alunoId}`, schoolId, '', 'vinculos', 'horario',
            ))
          }
        }
      }
    }
  }

  return erros
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Builds the correction URL for an identified validation error,
 * mapping each INEP register to its corresponding management screen
 * with optional section tab and field focus parameters.
 */
function getCorrectionUrl(
  schoolId: string,
  registro: string,
  entidadeId: string,
  entidadeNome: string,
  secao?: string,
  campo?: string,
): string {
  const params = new URLSearchParams()

  switch (registro) {
    case '00':
    case '10': {
      // Both map to school edit page, differentiated by tab
      const tab = secao || ''
      let url = `/escolas/${schoolId}`
      if (tab) params.set('tab', tab)
      if (campo) params.set('field', campo)
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    case '20': {
      // Turma edit page (specific turma)
      return `/gestao-turmas/turmas/${entidadeId}`
    }

    case '30': {
      // Person edit page with optional tab
      let url = `/gestao-usuarios/usuarios/${entidadeId}`
      if (secao) params.set('tab', secao)
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    case '40': {
      // School gestores tab
      return `/escolas/${schoolId}?tab=gestores`
    }

    case '50': {
      // Quadro de Aulas filtered by turma
      let url = `/gestao-turmas/quadro-aulas/`
      if (entidadeId) params.set('turma', entidadeId)
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    case '60': {
      // Matrículas filtered by turma
      let url = `/gestao-academica/matriculas/`
      if (entidadeId) params.set('turma', entidadeId)
      if (params.size > 0) url += `?${params.toString()}`
      return url
    }

    default:
      return `/escolas/${schoolId}`
  }
}

/**
 * Creates a fully populated ErroValidacao object.
 * All fields are set — callers only need to provide the specific error details.
 */
function criarErro(
  registro: string,
  campo_inep: string,
  numero_campo: number,
  regra: string,
  mensagem: string,
  entidade_id: string,
  entidade_nome: string,
  schoolId: string,
  valor_atual?: string,
  secao?: string,
  campo_destino?: string,
): ErroValidacao {
  return {
    registro,
    campo_inep,
    numero_campo,
    regra,
    mensagem,
    valor_atual: valor_atual ?? null,
    entidade_id,
    entidade_nome,
    url_correcao: getCorrectionUrl(
      schoolId,
      registro,
      entidade_id,
      entidade_nome,
      secao,
      campo_destino,
    ),
    secao: secao ?? null,
    campo_destino: campo_destino ?? null,
  }
}
