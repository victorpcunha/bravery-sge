'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { getFuncaoCenso50 } from '@/data/censo/funcoes-registro-50'
import { codigoTipoTurma, codigoFormaOrganizacao } from '@/data/censo/tipo-turma-codigos'
import { derivarAreasDeDisciplinas } from '@/data/censo/areas-turma'
import { mapearAreasPorMatriz } from '@/lib/censo-areas-prof'
import { validarCenso as validarCensoInternal } from './censo-regras'
import { ResultadoValidacao, ResultadoExportacao } from './censo-types'

// Tipos que possuem Etapa (demais exportam etapa nula) — espelho de TurmaForm/turmas.ts
const TIPOS_COM_ETAPA_CENSO = ['Curricular', 'Curricular com Atividade Complementar']

export { validarCensoInternal as validarCenso }

export async function exportarCenso(schoolId: string, anoLetivoId: string): Promise<ResultadoExportacao> {
  const validacao = await validarCensoInternal(schoolId, anoLetivoId)

  if (!validacao.valido) {
    const todosErros = [
      ...validacao.erros_por_registro.registro00,
      ...validacao.erros_por_registro.registro10,
      ...validacao.erros_por_registro.registro20,
      ...validacao.erros_por_registro.registro30,
      ...validacao.erros_por_registro.registro40,
      ...validacao.erros_por_registro.registro50,
      ...validacao.erros_por_registro.registro60,
    ]
    return { sucesso: false, erros: todosErros }
  }

  const sb = getSupabaseAdmin()

  const { data: school } = await sb.from('schools').select('*').eq('id', schoolId).single()
  if (!school) return { sucesso: false, erros: [] }

  const { data: anoLetivo } = await sb
    .from('academico_anos_letivos')
    .select('id, descricao, data_inicio, data_termino, status')
    .eq('id', anoLetivoId)
    .single()
  if (!anoLetivo) return { sucesso: false, erros: [] }

  const situacao = school.situacao_funcionamento
  const isDesativada = situacao === '2' || situacao === '3'

  const { data: turmas } = await sb
    .from('turmas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ano_letivo_id', anoLetivoId)
    .eq('ativo', true)

  const { data: pessoas } = await sb.from('people').select('*').eq('school_id', schoolId)

  const { data: profissionais } = await sb
    .from('turmas_profissionais')
    .select('id, turma_id, person_id, disciplinas_ids, vinculo_profissional_id')
    .not('person_id', 'is', null)

  const { data: matriculas } = await sb
    .from('academico_matriculas')
    .select('*')
    .eq('school_id', schoolId)
    .eq('ativo', true)

  const turmaIds = new Set((turmas || []).map((t: any) => t.id))
  const turmaIdsArr = Array.from(turmaIds)

  // Derive horarios from Quadro de Aulas
  const { data: quadroHorarios } = await sb
    .from('quadro_aulas_horarios')
    .select('dia_semana, horario_inicial, horario_final, quadro_aulas!inner(turma_id)')
    .in('quadro_aulas.turma_id', turmaIdsArr)
    .eq('quadro_aulas.ativo', true)
    .eq('ativo', true)

  // Build map: turma_id → { '1': 'HH:MM-HH:MM', '2': ... }
  const horariosPorTurma = new Map<string, Record<string, string>>()
  for (const h of (quadroHorarios || [])) {
    const turmaId = (h as any).quadro_aulas?.turma_id
    if (!turmaId) continue
    const dia = String(h.dia_semana)
    const inicio = String(h.horario_inicial || '').substring(0, 5)
    const fim = String(h.horario_final || '').substring(0, 5)
    if (!inicio || !fim) continue
    if (!horariosPorTurma.has(turmaId)) horariosPorTurma.set(turmaId, {})
    const entry = horariosPorTurma.get(turmaId)!
    if (!entry[dia] || inicio < entry[dia].substring(0, 5)) {
      entry[dia] = `${inicio}-${fim}`
    } else {
      const [, f] = entry[dia].split('-')
      if (fim > f) entry[dia] = `${entry[dia].substring(0, 5)}-${fim}`
    }
  }

  // Derive areas from turmas_disciplinas
  const { data: turmasDiscs } = await sb
    .from('turmas_disciplinas')
    .select('turma_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')
    .in('turma_id', turmaIdsArr)

  // Build map: turma_id → Set of INEP area keys (derive from disciplina names;
  // mesma derivacao da validacao — ver src/data/censo/areas-turma.ts)
  const areasPorTurma = new Map<string, Set<string>>()
  for (const td of (turmasDiscs || [])) {
    const turmaId = td.turma_id
    const disc = (td as any).academico_matriz_disciplinas?.academico_disciplinas?.nome
    if (!disc || !turmaId) continue
    const derivadas = derivarAreasDeDisciplinas([String(disc)])
    if (derivadas.size === 0) continue
    if (!areasPorTurma.has(turmaId)) areasPorTurma.set(turmaId, new Set())
    for (const areaKey of derivadas) areasPorTurma.get(turmaId)!.add(areaKey)
  }

  const profsDaEscola = (profissionais || []).filter((p: any) => turmaIds.has(p.turma_id))
  const matsDaEscola = (matriculas || []).filter((m: any) => turmaIds.has(m.turma_id))

  // Build lookup maps for Registro 50 derivation
  const vinculoProfIdsR50 = [...new Set((profissionais || []).map((p: any) => p.vinculo_profissional_id).filter(Boolean))]
  const vinculoProfMapR50 = new Map<string, any>()
  if (vinculoProfIdsR50.length > 0) {
    const { data: vps } = await sb
      .from('vinculos_profissionais')
      .select('id, regime_contratacao, funcao_id')
      .in('id', vinculoProfIdsR50 as string[])
    for (const vp of (vps || [])) vinculoProfMapR50.set(vp.id, vp)
  }

  const funcaoIdsR50 = [...new Set(Array.from(vinculoProfMapR50.values()).map((vp) => vp.funcao_id).filter(Boolean))]
  const funcaoProfMapR50 = new Map<string, any>()
  if (funcaoIdsR50.length > 0) {
    const { data: fps } = await sb
      .from('funcoes_profissionais')
      .select('id, nome')
      .in('id', funcaoIdsR50 as string[])
    for (const fp of (fps || [])) funcaoProfMapR50.set(fp.id, fp)
  }

  // disciplinas_ids guarda ids da MATRIZ — resolve area via helper (nunca
  // bate buscando direto em academico_disciplinas)
  const allDiscIdsR50 = [...new Set((profissionais || []).flatMap((p: any) => (p.disciplinas_ids || []) as string[]))]
  const discAreaMapR50 = await mapearAreasPorMatriz(sb, allDiscIdsR50)

  const turmasMapR50 = new Map((turmas || []).map((t: any) => [t.id, t]))

  const linhas: string[] = []

  // Ordem v4 (Regras Gerais 11-17): 00, 10, 20, 30, 40, 50, 60, 99.
  // Desativada (2/3): somente 00, 30 e 40 (regra 18).
  linhas.push(buildRegistro00(school, anoLetivo))
  if (!isDesativada) {
    linhas.push(buildRegistro10(school))
  }

  // Mapa id → pessoa (chaves dos registros 30/40/50/60)
  const pessoasMap = new Map((pessoas || []).map((p: any) => [String(p.id), p]))

    if (!isDesativada) {
      for (const turma of turmas || []) {
        linhas.push(buildRegistro20(turma, school, horariosPorTurma, areasPorTurma))
      }
    }

  // Pessoas com vínculo (mesma regra da validação R30): gestores, profissionais
  // com turma ou alunos com matrícula. Responsáveis e afins não entram no 30.
  // Gestores — tabela managers (cargo/critério/situação), mesma fonte da validação
  const { data: managersRows } = await sb
    .from('managers')
    .select('id, person_id, cargo, criterio_acesso, situacao_funcional')
    .not('person_id', 'is', null)

  const idsComVinculo = new Set<string>()
  for (const mng of managersRows || []) {
    if ((mng as any).person_id) idsComVinculo.add(String((mng as any).person_id))
  }
  for (const p of profsDaEscola) {
    if ((p as any).person_id) idsComVinculo.add(String((p as any).person_id))
  }
  for (const m of matsDaEscola) {
    if ((m as any).aluno_id) idsComVinculo.add(String((m as any).aluno_id))
  }

  let totalRegistro30 = 0
  for (const pessoa of pessoas || []) {
    if (!idsComVinculo.has(String((pessoa as any).id))) continue
    linhas.push(buildRegistro30(pessoa, school))
    totalRegistro30++
  }

  const gestorLines: string[] = []
  const seenGestorIds = new Set<string>()
  for (const mng of managersRows || []) {
    const personId = mng.person_id ? String(mng.person_id) : ''
    if (!personId || seenGestorIds.has(personId)) continue
    const pessoa = pessoasMap.get(personId)
    if (!pessoa) continue
    seenGestorIds.add(personId)
    gestorLines.push(buildRegistro40(mng, pessoa, school))
  }
  if (gestorLines.length === 0 && !isDesativada) {
    // Fallback: check if any person has a perfil with gestor access
    const { data: perfisGestor } = await sb
      .from('perfis')
      .select('id')
      .ilike('nome', '%gestor%')
      .limit(1)

    if (perfisGestor?.length) {
      const { data: peopleGestor } = await sb
        .from('people')
        .select('*')
        .eq('school_id', schoolId)
        .eq('perfil_id', perfisGestor[0].id)
        .limit(3)

      for (const pg of peopleGestor || []) {
        gestorLines.push(buildRegistro40(
          { cargo: '1', criterio_acesso: '', situacao_funcional: '' },
          pg, school,
        ))
      }
    }
  }
  for (const gl of gestorLines) {
    linhas.push(gl)
  }

  if (!isDesativada) {
    for (const p of profsDaEscola) {
      linhas.push(buildRegistro50(p, school, vinculoProfMapR50, funcaoProfMapR50, discAreaMapR50, turmasMapR50, pessoasMap))
    }

    for (const m of matsDaEscola) {
      linhas.push(buildRegistro60(m, school, pessoasMap, turmasMapR50))
    }
  }

  linhas.push('99|')

  const conteudo = linhas.join('\r\n').toUpperCase()

  const totalMatriculas = isDesativada ? 0 : (matsDaEscola?.length || 0)
  const totalProfs = isDesativada ? 0 : (profsDaEscola?.length || 0)
  const totalTurmas = isDesativada ? 0 : (turmas || []).length

  return {
    sucesso: true,
    arquivo: {
      conteudo,
      nome: `${(school.codigo_inep || 'escola').replace(/[^A-Za-z0-9]/g, '_')}_${anoLetivoId}`.substring(0, 20) + '.txt',
      encoding: 'ISO-8859-1',
      tamanho_bytes: Buffer.from(conteudo, 'utf-8').length,
      total_linhas: linhas.length,
      registros: {
        escola: 1,
        registro00: 1,
        registro10: isDesativada ? 0 : 1,
        registro20: totalTurmas,
        registro30: totalRegistro30,
        registro40: gestorLines.length,
        registro50: totalProfs,
        registro60: totalMatriculas,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// REGISTRO 00 — DADOS CADASTRAIS DA ESCOLA (46 fields)
// ---------------------------------------------------------------------------

function buildRegistro00(school: any, anoLetivo?: any): string {
  const fields = [
    '00',
    school.codigo_inep || '',
    school.situacao_funcionamento || '',
    formatDate(anoLetivo?.data_inicio ?? school.data_inicio_ano),
    formatDate(anoLetivo?.data_termino ?? school.data_fim_ano),
    (school.nome_escola || '').replace(/[^A-Za-z0-9À-ÿªº\-\/\.\, ]/g, ''),
    school.cep || '',
    school.municipio || '',
    school.distrito || '',
    (school.endereco || ''),
    school.numero || '',
    (school.complemento || ''),
    (school.bairro || ''),
    school.ddd || '',
    school.telefone_1 || '',
    school.telefone_2 || '',
    (school.email || ''),
    school.codigo_orgao_regional || '',
    school.localizacao || '',
    school.localizacao_diferenciada || '',
    school.dependencia_administrativa || '',
    boolToStr(school.orgao_secretaria_educacao),
    boolToStr(school.orgao_seguranca),
    boolToStr(school.orgao_saude),
    boolToStr(school.orgao_outro),
    boolToStr(school.mant_empresa),
    boolToStr(school.mant_sindicatos),
    boolToStr(school.mant_ong),
    boolToStr(school.mant_sem_fins_lucrativos),
    boolToStr(school.mant_sistema_s),
    boolToStr(school.mant_oscip),
    school.categoria_escola_privada || '',
    boolToStr(school.parceria_estadual),
    boolToStr(school.parceria_municipal),
    boolToStr(school.contr_est_colaboracao),
    boolToStr(school.contr_est_fomento),
    boolToStr(school.contr_est_cooperacao),
    boolToStr(school.contr_est_prestacao),
    boolToStr(school.contr_est_coop_tecnica),
    boolToStr(school.contr_est_consorcio),
    boolToStr(school.contr_mun_colaboracao),
    boolToStr(school.contr_mun_fomento),
    boolToStr(school.contr_mun_cooperacao),
    boolToStr(school.contr_mun_prestacao),
    boolToStr(school.contr_mun_coop_tecnica),
    boolToStr(school.contr_mun_consorcio),
    school.cnpj_mantenedora || '',
    school.cnpj_escola || school.cnpj || '',
    school.regulamentacao || '',
    school.esfera_regulamentacao || '',
    school.unidade_vinculada || '',
    school.codigo_escola_sede || '',
    school.codigo_ies || '',
  ]
  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 10 — INFRAESTRUTURA DA ESCOLA (185 data fields)
// ---------------------------------------------------------------------------

function buildRegistro10(school: any): string {
  const b = (f: string) => boolToStr(school[f])
  const s = (f: string) => (school[f] ?? '').toString()

  const fields = [
    '10',
    school.codigo_inep || '',

    // Locais de funcionamento (3-8)
    b('local_predio'),
    b('local_salas_outra'),
    b('local_galpao'),
    b('local_socioeducativa'),
    b('local_prisional'),
    b('local_outros'),

    // Ocupação e compartilhamento (9-16)
    s('forma_ocupacao'),
    b('predio_compartilhado'),
    s('compartilha_codigo_1'),
    s('compartilha_codigo_2'),
    s('compartilha_codigo_3'),
    s('compartilha_codigo_4'),
    s('compartilha_codigo_5'),
    s('compartilha_codigo_6'),

    // Água (17-23)
    b('agua_potavel'),
    b('agua_rede_publica'),
    b('agua_poco_artesiano'),
    b('agua_cacimba'),
    b('agua_fonte'),
    b('agua_carro_pipa'),
    b('agua_inexistente'),

    // Energia (24-27)
    b('energia_rede_publica'),
    b('energia_gerador'),
    b('energia_renovavel'),
    b('energia_inexistente'),

    // Esgoto (28-31)
    b('esgoto_rede_publica'),
    b('esgoto_fossa_septica'),
    b('esgoto_fossa_rudimentar'),
    b('esgoto_inexistente'),

    // Lixo destinação (32-36)
    b('lixo_coleta'),
    b('lixo_queima'),
    b('lixo_enterra'),
    b('lixo_destinacao_licenciada'),
    b('lixo_outra_area'),

    // Lixo tratamento (37-40)
    b('lixo_separacao'),
    b('lixo_reaproveitamento'),
    b('lixo_reciclagem'),
    b('lixo_sem_tratamento'),

    // Dependências físicas (41-80)
    b('dep_almoxarifado'),
    b('dep_area_verde'),
    b('dep_auditorio'),
    b('dep_banheiro'),
    b('dep_banheiro_pcd'),
    b('dep_banheiro_infantil'),
    b('dep_banheiro_funcionarios'),
    b('dep_vestiario'),
    b('dep_biblioteca'),
    b('dep_cozinha'),
    b('dep_despensa'),
    b('dep_dormitorio_aluno'),
    b('dep_dormitorio_professor'),
    b('dep_lab_ciencias'),
    b('dep_lab_informatica'),
    b('dep_lab_robotica'),
    b('dep_lab_profissional'),
    b('dep_parque_infantil'),
    b('dep_patio_coberto'),
    b('dep_patio_descoberto'),
    b('dep_piscina'),
    b('dep_quadra_coberta'),
    b('dep_quadra_descoberta'),
    b('dep_refeitorio'),
    b('dep_sala_repouso'),
    b('dep_sala_artes'),
    b('dep_sala_musica'),
    b('dep_sala_danca'),
    b('dep_sala_multiuso'),
    b('dep_terreirao'),
    b('dep_viveiro'),
    b('dep_sala_diretoria'),
    b('dep_sala_leitura'),
    b('dep_sala_professores'),
    b('dep_sala_aee'),
    b('dep_sala_secretaria'),
    b('dep_oficinas'),
    b('dep_estudio'),
    b('dep_horta'),
    b('dep_nenhuma'),

    // Acessibilidade (81-90)
    b('acess_corrimao'),
    b('acess_elevador'),
    b('acess_pisos_tateis'),
    b('acess_portas_80cm'),
    b('acess_rampas'),
    b('acess_sinalizacao_luminosa'),
    b('acess_sinalizacao_sonora'),
    b('acess_sinalizacao_tatil'),
    b('acess_sinalizacao_visual'),
    b('acess_nenhum'),

    // Salas de aula (91-95)
    s('qtd_salas_dentro'),
    s('qtd_salas_fora'),
    s('qtd_salas_climatizadas'),
    s('qtd_salas_acessiveis'),
    s('qtd_salas_leitura'),

    // Equipamentos (96-107)
    b('eq_antena_parabolica'),
    b('eq_computadores'),
    b('eq_copiadora'),
    b('eq_impressora'),
    b('eq_impressora_multifuncional'),
    b('eq_scanner'),
    b('eq_nenhum'),
    s('qtd_dvd'),
    s('qtd_som'),
    s('qtd_tv'),
    s('qtd_lousa_digital'),
    s('qtd_projetor'),
    s('qtd_desktop_alunos'),
    s('qtd_portateis_alunos'),
    s('qtd_tablets_alunos'),

    // Internet (111-118)
    b('internet_administrativo'),
    b('internet_ensino'),
    b('internet_alunos'),
    b('internet_comunidade'),
    b('internet_inexistente'),
    s('internet_equip_alunos'),
    b('internet_banda_larga'),
    s('rede_local'),

    // Profissionais (119-138)
    s('prof_agronomos'),
    s('prof_assistente_social'),
    s('prof_aux_admin'),
    s('prof_aux_servicos'),
    s('prof_bibliotecario'),
    s('prof_bombeiro'),
    s('prof_coordenador'),
    s('prof_fonoaudiologo'),
    s('prof_nutricionista'),
    s('prof_psicologo'),
    s('prof_cozinheiro'),
    s('prof_supervisao'),
    s('prof_secretario'),
    s('prof_seguranca'),
    s('prof_tecnicos'),
    s('prof_vice_diretor'),
    s('prof_orientador_comun'),
    s('prof_tradutor_libras'),
    s('prof_revisor_braille'),
    s('prof_nenhum'),

    // Alimentação escolar (139) — v4 posiciona entre profissionais e materiais
    b('alimentacao_escolar'),

    // Materiais pedagógicos (140-159)
    b('mat_acervo_multimidia'),
    b('mat_brinquedos_infantil'),
    b('mat_cientificos'),
    b('mat_amplificacao_som'),
    b('mat_audiovisuais'),
    b('mat_horta'),
    b('mat_instrumentos_musicais'),
    b('mat_jogos_educativos'),
    b('mat_kits_robotica'),
    b('mat_atividades_culturais'),
    b('mat_educacao_emocional'),
    b('mat_educacao_profissional'),
    b('mat_pratica_desportiva'),
    b('mat_bilingue_surdos'),
    b('mat_educacao_indigena'),
    b('mat_etnico_raciais'),
    b('mat_educacao_campo'),
    b('mat_educacao_quilombola'),
    b('mat_educacao_especial'),
    b('mat_nenhum'),

    // Línguas (160-163)
    s('lingua_ensino'),
    s('codigo_lingua_indigena_1'),
    s('codigo_lingua_indigena_2'),
    s('codigo_lingua_indigena_3'),

    // Gestão escolar (164-173)
    b('exame_selecao'),
    b('cota_ppi'),
    b('cota_renda'),
    b('cota_escola_publica'),
    b('cota_pcd'),
    b('cota_outros'),
    b('cota_nenhum'),
    b('site_blog'),
    b('compartilha_espacos'),
    b('usa_entorno'),

    // Órgãos colegiados (174-179)
    b('org_associacao_pais'),
    b('org_associacao_mestres'),
    b('org_conselho_escolar'),
    b('org_gremio'),
    b('org_outros'),
    b('org_nenhum'),

    // PPP e ambientais (180-187)
    s('ppp_atualizado'),
    b('educacao_ambiental'),
    b('amb_conteudo'),
    b('amb_componente'),
    b('amb_eixo'),
    b('amb_eventos'),
    b('amb_transversal'),
    b('amb_nenhum'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 20 — TURMA (v4: 66 campos)
// ---------------------------------------------------------------------------

function buildRegistro20(turma: any, school: any, horariosPorTurma?: Map<string, Record<string, string>>, areasPorTurma?: Map<string, Set<string>>): string {
  // EI não exporta áreas (v4: nulas) — as disciplinas seguem no quadro
  const etapaEI20 = ['1', '2', '3'].includes(String(turma.etapa_codigo || ''))
  const b = (f: string) => {
    if (etapaEI20) return ''
    if (areasPorTurma) {
      const areas = areasPorTurma.get(turma.id)
      if (areas) return areas.has(f) ? '1' : '0'
    }
    return boolToStr(turma[f])
  }
  const s = (f: string) => (turma[f] ?? '').toString()
  // Campos 's' booleanos: sempre 0/1 (nunca nulo)
  const obg01 = (v: any) => (v === true || v === 'true' || v === '1' || v === 1 ? '1' : '0')

  // Derive horarios from Quadro de Aulas if available, fallback to column
  const h = (dia: number): string => {
    if (horariosPorTurma) {
      const entry = horariosPorTurma.get(turma.id)
      if (entry?.[String(dia)]) return entry[String(dia)]
    }
    return s(`horario_${['domingo','segunda','terca','quarta','quinta','sexta','sabado'][dia]}`)
  }

  // Derive FGB/IFA/IFTP from organizacao_curricular JSONB
  const org = (turma.organizacao_curricular || []) as string[]
  const hasFgb = org.some((o: string) => /formação geral/i.test(o)) || !!turma.fgb
  const hasIfa = org.some((o: string) => /itinerário formativo de aprofundamento/i.test(o)) || !!turma.ifa
  const hasIftp = org.some((o: string) => /itinerário de formação técnica/i.test(o)) || !!turma.iftp

  // Derive itinerary areas from areas_itinerario JSONB
  const itinAreas = (turma.areas_itinerario || []) as string[]
  const hasIlinguagens = itinAreas.some((a: string) => /linguagens/i.test(a)) || !!turma.ifa_linguagens
  const hasImatematica = itinAreas.some((a: string) => /matemática/i.test(a)) || !!turma.ifa_matematica
  const hasInatureza = itinAreas.some((a: string) => /natureza/i.test(a)) || !!turma.ifa_natureza
  const hasIhumanas = itinAreas.some((a: string) => /humanas/i.test(a)) || !!turma.ifa_humanas

  // Códigos INEP a partir dos rótulos gravados no modal (spec 029 FR-020)
  const tiposLista = Array.isArray(turma.tipos_turma) ? turma.tipos_turma as string[] : []
  const tipoTurmaCodigo = codigoTipoTurma(tiposLista)
  const mediacaoCodigo = turma.tipo_mediacao === 'Presencial' ? '1'
    : turma.tipo_mediacao === 'Semipresencial' ? '2'
    : turma.tipo_mediacao === 'Educação a Distância - EAD' ? '3'
    : s('tipo_mediacao')
  // Etapa só é exportada p/ Curricular / Curricular+Complementar (demais = nulo)
  const comEtapa = tiposLista.some(t => TIPOS_COM_ETAPA_CENSO.includes(t))
  // v4: FGB/IFA/IFTP e itinerário nulos fora de agregada 304/305
  const agregEM20 = ['304', '305'].includes(String(turma.etapa_agregada || ''))
  const gFgb = agregEM20 && hasFgb
  const gIfa = agregEM20 && hasIfa
  const gIftp = agregEM20 && hasIftp
  const atv = (i: number) => {
    const v = turma[`atividade_complementar_${i}`]
    return v && String(v).trim() !== '' ? String(v).trim() : ''
  }
  const codCursoTec = s('codigo_curso_tecnico')

  // Ordem v4 (66 campos: 1 + 2..66)
  const fields = [
    '20',
    school.codigo_inep || '', // 2 — escola
    codTurmaEntidade(turma), // 3 — código na entidade
    turma.codigo_inep || '', // 4 — código no INEP
    s('nome'), // 5
    mediacaoCodigo, // 6

    // Horários (7-13, derivados do Quadro de Aulas)
    h(0), h(1), h(2), h(3), h(4), h(5), h(6),

    tipoTurmaCodigo, // 14
    atv(1), atv(2), atv(3), atv(4), atv(5), atv(6), // 15-20
    '', // 21 — local de funcionamento diferenciado (sem coluna)
    s('turma_especial'), // 22
    comEtapa ? s('etapa_agregada') : '', // 23
    comEtapa ? s('etapa_codigo') : '', // 24
    s('eixo_qualificacao'), // 25
    hasIftp ? '' : codCursoTec, // 26 — código do curso
    s('carga_horaria_curso'), // 27
    comEtapa ? codigoFormaOrganizacao(turma.forma_organizacao) : '', // 28
    obg01(turma.formacao_alternancia), // 29

    // Organização curricular (30-32)
    gFgb ? '1' : (agregEM20 ? '0' : ''),
    gIfa ? '1' : (agregEM20 ? '0' : ''),
    gIftp ? '1' : (agregEM20 ? '0' : ''),

    // Itinerário formativo (33-36)
    (gIfa && hasIlinguagens) ? '1' : (gIfa ? '0' : ''),
    (gIfa && hasImatematica) ? '1' : (gIfa ? '0' : ''),
    (gIfa && hasInatureza) ? '1' : (gIfa ? '0' : ''),
    (gIfa && hasIhumanas) ? '1' : (gIfa ? '0' : ''),

    s('tipo_curso_iftp') && gIftp ? s('tipo_curso_iftp') : '', // 37
    hasIftp ? codCursoTec : '', // 38 — código do curso técnico

    // Áreas do conhecimento (39-65)
    b('area_quimica'),
    b('area_fisica'),
    b('area_matematica_turma'),
    b('area_biologia'),
    b('area_ciencias'),
    b('area_portugues'),
    b('area_ingles'),
    b('area_espanhol'),
    b('area_outra_estrangeira'),
    b('area_arte'),
    b('area_ed_fisica'),
    b('area_historia'),
    b('area_geografia'),
    b('area_filosofia'),
    b('area_informatica'),
    b('area_profissionalizantes'),
    b('area_libras'),
    b('area_pedagogicas'),
    b('area_ensino_religioso'),
    b('area_lingua_indigena'),
    b('area_estudos_sociais'),
    b('area_sociologia'),
    b('area_frances'),
    b('area_portugues_sl'),
    b('area_estagio'),
    b('area_projeto_vida'),
    b('area_outras'),

    obg01(turma.turma_bilingue), // 66
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 30 — PESSOA (v4: 110 campos)
// ---------------------------------------------------------------------------

function buildRegistro30(pessoa: any, school: any): string {
  const b = (f: string) => boolToStr(pessoa[f])
  const s = (f: string) => (pessoa[f] ?? '').toString()
  // Campos numericos opcionais: '0'/0 e legado de vazio → exporta nulo (v4 exige nulo)
  const n = (f: string) => {
    const v = (pessoa[f] ?? '').toString().trim()
    return v === '' || v === '0' ? '' : v
  }
  // localizacao_diferenciada pode vir boolean do banco legado → nulo
  const locDifRaw = (pessoa as any).localizacao_diferenciada
  const locDif = typeof locDifRaw === 'boolean' ? '' : (locDifRaw ?? '').toString()

  const fields = [
    '30',
    school.codigo_inep || '', // 2
    codPessoaSistema(pessoa), // 3 — código no sistema próprio (igual no 40/50/60)

    // Identificadores (4-7)
    s('inep_id'),
    s('cpf'),
    s('nome_completo'),
    formatDate(pessoa.data_nascimento),

    // Filiação (8-10)
    s('filiacao_declarada'),
    s('filiacao_1'),
    s('filiacao_2'),

    // Demográfico (11-16) — ordem v4: sexo, cor, povo, nacionalidade, país, município
    s('sexo'),
    s('cor_raca'),
    s('povo_indigena'),
    s('nacionalidade'),
    s('pais_nacionalidade'),
    s('municipio_nascimento'),

    // Deficiências (17-28)
    b('deficiencia'),
    b('cegueira'),
    b('baixa_visao'),
    b('visao_monocular'),
    b('surdez'),
    b('deficiencia_auditiva'),
    b('surdocegueira'),
    b('deficiencia_fisica'),
    b('deficiencia_intelectual'),
    b('deficiencia_multipla'),
    b('tea'),

    // Altas habilidades (33)
    b('altas_habilidades'),

    // Transtornos (34-40)
    b('transtorno_aprendizagem'),
    b('discalculia'),
    b('disgrafia'),
    b('dislalia'),
    b('dislexia'),
    b('tdah'),
    b('tpac'),

    // Recursos de acessibilidade (41-54)
    b('auxilio_ledor'),
    b('auxilio_transcricao'),
    b('guia_interprete'),
    b('tradutor_libras'),
    b('leitura_labial'),
    b('prova_ampliada'),
    b('prova_superampliada'),
    b('cd_audio'),
    b('prova_libras'),
    b('prova_video_libras'),
    b('material_braille'),
    b('prova_braille'),
    b('tempo_adicional'),
    b('nenhum_recurso'),

    // Certidão (50)
    s('certidao_nascimento'),

  // Residência (51-55) — v4 posiciona após a certidão
  s('pais_residencia'),
  s('cep'),
  s('municipio_residencia'),
  s('zona_residencia'),
  locDif,

    // Escolaridade (56-57)
    s('escolaridade'),
    s('tipo_ensino_medio'),

    // Cursos superiores (58-66) — '0' e legado de campo vazio: exporta nulo.
    // Ordem v4: trio por curso (curso, ano, IES)
    n('curso_superior_1'),
    n('ano_conclusao_1'),
    n('ies_1'),
    n('curso_superior_2'),
    n('ano_conclusao_2'),
    n('ies_2'),
    n('curso_superior_3'),
    n('ano_conclusao_3'),
    n('ies_3'),

    // Áreas pedagógicas (67-69)
    s('area_pedagogica_1'),
    s('area_pedagogica_2'),
    s('area_pedagogica_3'),

    // Pós-graduação (70-87)
    s('pos_tipo_1'), s('pos_area_1'), n('pos_ano_1'),
    s('pos_tipo_2'), s('pos_area_2'), n('pos_ano_2'),
    s('pos_tipo_3'), s('pos_area_3'), n('pos_ano_3'),
    s('pos_tipo_4'), s('pos_area_4'), n('pos_ano_4'),
    s('pos_tipo_5'), s('pos_area_5'), n('pos_ano_5'),
    s('pos_tipo_6'), s('pos_area_6'), n('pos_ano_6'),
    b('sem_pos'),

    // Formação continuada (89-109)
    b('form_creche'),
    b('form_pre_escola'),
    b('form_alfabetizacao'),
    b('form_anos_iniciais'),
    b('form_anos_finais'),
    b('form_medio'),
    b('form_eja'),
    b('form_especial'),
    b('form_indigena'),
    b('form_campo'),
    b('form_ambiental'),
    b('form_direitos'),
    b('form_bilingue'),
    b('form_tic'),
    b('form_integral'),
    b('form_genero'),
    b('form_direitos_crianca'),
    b('form_etnico_raciais'),
    b('form_gestao_escolar'),
    b('form_outros'),
    b('sem_formacao'),

    // Email (110) — e-mail não admite espaço
    s('email').replace(/\s+/g, ''),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 40 — GESTOR ESCOLAR (v4: 7 campos, sem e-mail)
// Fonte: tabela managers (cargo/critério/situação), como a validação.
// ---------------------------------------------------------------------------

function buildRegistro40(manager: any, pessoa: any, school: any): string {
  const fields = [
    '40',
    school.codigo_inep || '', // 2
    codPessoaSistema(pessoa), // 3 — igual ao campo 3 do registro 30
    ((pessoa.inep_id ?? '') as string).toString(), // 4
    (manager.cargo ?? '').toString(), // 5 — 1 Diretor, 2 Outro
    (manager.criterio_acesso ?? '').toString(), // 6
    (manager.situacao_funcional ?? '').toString(), // 7
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 50 — PROFISSIONAL POR TURMA (v4: 38 campos)
// ---------------------------------------------------------------------------

function buildRegistro50(
  prof: any,
  school: any,
  vinculoProfMap: Map<string, any>,
  funcaoProfMap: Map<string, any>,
  discAreaMap: Map<string, number>,
  turmasMap: Map<string, any>,
  pessoasMap: Map<string, any>,
): string {
  const pessoa = prof.person_id ? pessoasMap.get(String(prof.person_id)) : null
  const turma = prof.turma_id ? turmasMap.get(prof.turma_id) : null

  const vp = prof.vinculo_profissional_id ? vinculoProfMap.get(prof.vinculo_profissional_id) : null
  const fp = vp?.funcao_id ? funcaoProfMap.get(vp.funcao_id) : null
  const funcaoCenso = getFuncaoCenso50(fp?.nome || '')
  // v4 50.c8: 1-4 quando função 1/5/6 + pública, senão nulo
  const depPub = ['1', '2', '3'].includes(String((school as any)?.dependencia_administrativa || ''))
  const situacaoFuncional = (['1', '5', '6'].includes(funcaoCenso) && depPub)
    ? (vp?.regime_contratacao || '')
    : ''

  const eDocente = funcaoCenso === '1' || funcaoCenso === '5'
  const disciplinasIds = (prof.disciplinas_ids || []) as string[]
  // v4 50.c9-33: só função 1/5 (ordenadas)
  const areaCodes = eDocente ? [...new Set(
    disciplinasIds
      .map((did: string) => discAreaMap.get(did))
      .filter((c): c is number => c != null)
      .map((c: number) => String(c).padStart(2, '0')),
  )].sort() : []
  const areaSlots: string[] = []
  for (let i = 0; i < 25; i++) {
    areaSlots.push(i < areaCodes.length ? areaCodes[i] : '')
  }

  const itinAreas = (turma?.areas_itinerario || []) as string[]
  const lecLinguagens = itinAreas.some((a: string) => /linguagens/i.test(a))
  const lecMatematica = itinAreas.some((a: string) => /matemática/i.test(a))
  const lecNatureza = itinAreas.some((a: string) => /natureza/i.test(a))
  const lecHumanas = itinAreas.some((a: string) => /humanas/i.test(a))
  const lecIftp = itinAreas.some((a: string) => /(técnica|tecnica|iftp)/i.test(a))
  const tFgb50 = !!turma?.fgb
  const tIfa50 = !!turma?.ifa
  const tIftp50 = !!turma?.iftp
  // v4 50.c34-37: só função 1/5 + FGB + IFA; c38: só 1/5/9 + IFTP
  const lec134 = eDocente && tFgb50 && tIfa50
  const lec8 = (eDocente || funcaoCenso === '9') && tIftp50

  // Ordem v4 (38 campos)
  const fields = [
    '50',
    school.codigo_inep || '', // 2
    codPessoaSistema(pessoa || { id: prof.person_id }), // 3 — igual ao campo 3 do 30
    ((pessoa?.inep_id ?? '') as string).toString(), // 4
    turma ? codTurmaEntidade(turma) : '', // 5
    turma?.codigo_inep || '', // 6 — código da turma no INEP
    funcaoCenso, // 7
    situacaoFuncional, // 8
    areaSlots[0], areaSlots[1], areaSlots[2], areaSlots[3], areaSlots[4], // 9-33
    areaSlots[5], areaSlots[6], areaSlots[7], areaSlots[8], areaSlots[9],
    areaSlots[10], areaSlots[11], areaSlots[12], areaSlots[13], areaSlots[14],
    areaSlots[15], areaSlots[16], areaSlots[17], areaSlots[18], areaSlots[19],
    areaSlots[20], areaSlots[21], areaSlots[22], areaSlots[23], areaSlots[24],
    lec134 ? (lecLinguagens ? '1' : '0') : '', // 34
    lec134 ? (lecMatematica ? '1' : '0') : '', // 35
    lec134 ? (lecNatureza ? '1' : '0') : '', // 36
    lec134 ? (lecHumanas ? '1' : '0') : '', // 37
    lec8 ? (lecIftp ? '1' : '0') : '', // 38
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 60 — MATRÍCULA DO ALUNO (v4: 33 campos)
// ---------------------------------------------------------------------------

function buildRegistro60(
  matricula: any,
  school: any,
  pessoasMap: Map<string, any>,
  turmasMap: Map<string, any>,
): string {
  const b = (f: string) => boolToStr(matricula[f])
  const s = (f: string) => (matricula[f] ?? '').toString()
  const pessoa = matricula.aluno_id ? pessoasMap.get(String(matricula.aluno_id)) : null
  const turma = matricula.turma_id ? turmasMap.get(matricula.turma_id) : null

  // Gates v4 (nulos fora de contexto)
  const tiposLista60 = Array.isArray(turma?.tipos_turma) ? turma.tipos_turma as string[] : []
  const tipoCod60 = codigoTipoTurma(tiposLista60)
  const med60raw = String(turma?.tipo_mediacao || '')
  const med60 = med60raw === 'Presencial' ? '1' : med60raw === 'Semipresencial' ? '2' : med60raw === 'Educação a Distância - EAD' ? '3' : med60raw
  const ehAEE60 = tipoCod60 === '5'
  const curricPres60 = (tipoCod60 === '6' || tipoCod60 === '9') && med60 === '1'
  const pais76 = String(pessoa?.pais_residencia || '') === '76'
  const gateTransp60 = pais76 && (med60 === '1' || med60 === '2') && (tipoCod60 === '6' || tipoCod60 === '9')
  const temTransp60 = matricula.transporte_escolar === true || matricula.transporte_escolar === 'true' || matricula.transporte_escolar === '1'
  const etapa60 = turma?.etapa_codigo ? String(turma.etapa_codigo) : ''
  const gateCarga60 = !!turma?.iftp || ['39', '40', '67', '68', '73', '75'].includes(etapa60)
  const aee = (f: string) => (ehAEE60 ? b(f) : '')
  const veic = (f: string) => (temTransp60 ? b(f) : '')

  // Ordem v4 (33 campos; sem "situação" — não existe no layout 2026)
  const fields = [
    '60',
    school.codigo_inep || '', // 2

    // Identificação (3-7)
    codPessoaSistema(pessoa || { id: matricula.aluno_id }), // 3 — igual ao campo 3 do 30
    ((pessoa?.inep_id ?? matricula.inep_id ?? '') as string).toString(), // 4
    turma ? codTurmaEntidade(turma) : '', // 5
    turma?.codigo_inep || '', // 6 — código da turma no INEP
    s('codigo_matricula_censo'), // 7

    // Turma multi + carga horária IFTP (8-9)
    s('turma_multi'),
    gateCarga60 ? s('carga_horaria_iftp') : '',

    // AEE (10-20)
    aee('aee_funcao_cognitiva'),
    aee('aee_vida_autonoma'),
    aee('aee_enriquecimento'),
    aee('aee_informatica'),
    aee('aee_libras'),
    aee('aee_portugues_sl'),
    aee('aee_soroban'),
    aee('aee_braille'),
    aee('aee_orientacao'),
    aee('aee_caa'),
    aee('aee_recursos'),

    // Escolarização externa (21)
    curricPres60 ? s('escolarizacao_externa') : '',

    // Transporte (22-23)
    gateTransp60 ? b('transporte_escolar') : '',
    gateTransp60 && temTransp60 ? s('transporte_responsavel') : '',

    // Veículos (24-33)
    veic('veiculo_bicicleta'),
    veic('veiculo_microonibus'),
    veic('veiculo_onibus'),
    veic('veiculo_tracao'),
    veic('veiculo_vans'),
    veic('veiculo_outro'),
    veic('veiculo_aqua_5'),
    veic('veiculo_aqua_15'),
    veic('veiculo_aqua_35'),
    veic('veiculo_aqua_mais'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function boolToStr(val: any): string {
  if (val === true || val === 'true' || val === '1') return '1'
  if (val === false || val === 'false' || val === '0') return '0'
  return ''
}

/**
 * "Código da pessoa física no sistema próprio" (v4 30/40/50/60, campo 3,
 * tm 20 alfa). Regra única para o arquivo inteiro não quebrar a
 * correspondência entre registros: inep_id → cpf → 20 hex do UUID.
 */
function codPessoaSistema(p: any): string {
  const inep = ((p?.inep_id ?? '') as string).toString().trim()
  if (inep) return inep.slice(0, 20)
  const cpf = ((p?.cpf ?? '') as string).toString().replace(/\D/g, '')
  if (cpf) return cpf.slice(0, 20)
  return ((p?.id ?? '') as string).toString().replace(/-/g, '').slice(0, 20)
}

/**
 * "Código da Turma na Entidade/Escola" (v4 20/50/60, tm 20 alfa).
 * Regra única: nome (até 20) → 20 hex do UUID.
 */
function codTurmaEntidade(t: any): string {
  const nome = ((t?.nome ?? '') as string).toString().trim()
  if (nome) return nome.slice(0, 20)
  return ((t?.id ?? '') as string).toString().replace(/-/g, '').slice(0, 20)
}

function formatDate(d: any): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return String(d || '')
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${date.getFullYear()}`
}