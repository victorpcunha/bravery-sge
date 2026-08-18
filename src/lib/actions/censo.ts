'use server'

import { getSupabaseAdmin } from '@/lib/auth'
import { getFuncaoCenso50 } from '@/data/censo/funcoes-registro-50'
import { validarCenso as validarCensoInternal } from './censo-regras'
import { ResultadoValidacao, ResultadoExportacao } from './censo-types'

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

  // Build map: turma_id → Set of INEP area codes (derive from disciplina names)
  const areasPorTurma = new Map<string, Set<string>>()
  const AREA_NAME_MAP: Record<string, string> = {
    'quimica': 'area_quimica', 'fisica': 'area_fisica', 'matematica': 'area_matematica_turma',
    'biologia': 'area_biologia', 'ciencias': 'area_ciencias', 'portugues': 'area_portugues',
    'português': 'area_portugues', 'ingles': 'area_ingles', 'inglês': 'area_ingles',
    'espanhol': 'area_espanhol', 'arte': 'area_arte', 'artes': 'area_arte',
    'educação física': 'area_ed_fisica', 'educacao fisica': 'area_ed_fisica', 'ed. física': 'area_ed_fisica',
    'historia': 'area_historia', 'história': 'area_historia', 'geografia': 'area_geografia',
    'filosofia': 'area_filosofia', 'informatica': 'area_informatica', 'informática': 'area_informatica',
    'computação': 'area_informatica', 'libras': 'area_libras', 'ensino religioso': 'area_ensino_religioso',
    'sociologia': 'area_sociologia', 'frances': 'area_frances', 'francês': 'area_frances',
    'estagio': 'area_estagio', 'estágio': 'area_estagio', 'projeto de vida': 'area_projeto_vida',
  }
  for (const td of (turmasDiscs || [])) {
    const turmaId = td.turma_id
    const disc = (td as any).academico_matriz_disciplinas?.academico_disciplinas?.nome?.toLowerCase()
    if (!disc || !turmaId) continue
    if (!areasPorTurma.has(turmaId)) areasPorTurma.set(turmaId, new Set())
    for (const [keyword, areaKey] of Object.entries(AREA_NAME_MAP)) {
      if (disc.includes(keyword)) areasPorTurma.get(turmaId)!.add(areaKey)
    }
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

  const allDiscIdsR50 = [...new Set((profissionais || []).flatMap((p: any) => (p.disciplinas_ids || []) as string[]))]
  const discAreaMapR50 = new Map<string, number>()
  if (allDiscIdsR50.length > 0) {
    const { data: discs } = await sb
      .from('academico_disciplinas')
      .select('id, area_codigo')
      .in('id', allDiscIdsR50)
    for (const d of (discs || [])) {
      if (d.area_codigo != null) discAreaMapR50.set(d.id, d.area_codigo)
    }
  }

  const turmasMapR50 = new Map((turmas || []).map((t: any) => [t.id, t]))

  const linhas: string[] = []

  linhas.push(buildRegistro00(school, anoLetivo))
  linhas.push(buildRegistro10(school))

    if (!isDesativada) {
      for (const turma of turmas || []) {
        linhas.push(buildRegistro20(turma, horariosPorTurma, areasPorTurma))
      }

    for (const p of profsDaEscola) {
      linhas.push(buildRegistro50(p, school, vinculoProfMapR50, funcaoProfMapR50, discAreaMapR50, turmasMapR50))
    }

    for (const m of matsDaEscola) {
      linhas.push(buildRegistro60(m, school))
    }
  }

  for (const pessoa of pessoas || []) {
    linhas.push(buildRegistro30(pessoa, school))
  }

  // Gestores — query via vinculos_profissionais with funcao type "gestor"
  const { data: gestores } = await sb
    .from('vinculos_profissionais')
    .select('*, people(id, nome_completo, inep_id, cpf, email), funcoes_profissionais(nome)')
    .eq('school_id', schoolId)
    .eq('situacao', '1')

  const gestorLines: string[] = []
  const seenGestorIds = new Set<string>()
  for (const g of gestores || []) {
    const personId = g.person_id
    if (!personId || seenGestorIds.has(personId)) continue
    const nomeFuncao = (g.funcoes_profissionais as any)?.nome || ''
    if (!/gestor|diretor|dirigente|coordenador/i.test(nomeFuncao)) continue
    seenGestorIds.add(personId)
    gestorLines.push(buildRegistro40(g, school))
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
        gestorLines.push(buildRegistro40Fallback(pg, school))
      }
    }
  }
  for (const gl of gestorLines) {
    linhas.push(gl)
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
        registro10: 1,
        registro20: totalTurmas,
        registro30: (pessoas || []).length,
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

    // Profissionais (116-135)
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

    // Materiais pedagógicos (136-155)
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

    // Línguas (156-160)
    s('lingua_ensino'),
    s('codigo_lingua_indigena_1'),
    s('codigo_lingua_indigena_2'),
    s('codigo_lingua_indigena_3'),

    // Gestão escolar (161-167 + 168-185)
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

    // Órgãos colegiados (171-176)
    b('org_associacao_pais'),
    b('org_associacao_mestres'),
    b('org_conselho_escolar'),
    b('org_gremio'),
    b('org_outros'),
    b('org_nenhum'),

    // PPP e ambientais (177-185)
    s('ppp_atualizado'),
    b('educacao_ambiental'),
    b('amb_conteudo'),
    b('amb_componente'),
    b('amb_eixo'),
    b('amb_eventos'),
    b('amb_transversal'),
    b('amb_nenhum'),
    b('alimentacao_escolar'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 20 — TURMA
// ---------------------------------------------------------------------------

function buildRegistro20(turma: any, horariosPorTurma?: Map<string, Record<string, string>>, areasPorTurma?: Map<string, Set<string>>): string {
  const b = (f: string) => {
    if (areasPorTurma) {
      const areas = areasPorTurma.get(turma.id)
      if (areas) return areas.has(f) ? '1' : '0'
    }
    return boolToStr(turma[f])
  }
  const s = (f: string) => (turma[f] ?? '').toString()

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

  const fields = [
    '20',
    turma.codigo_inep || s('id'),

    // Identificação
    s('nome'),
    s('tipo_mediacao'),
    s('tipos_turma'),
    s('etapa_codigo'),
    s('etapa_agregada'),

    // Horários (derivados do Quadro de Aulas)
    h(0), h(1), h(2), h(3), h(4), h(5), h(6),

    // Organização
    s('forma_organizacao'),
    s('turma_especial'),
    b('formacao_alternancia'),
    s('eixo_qualificacao'),
    s('codigo_curso_tecnico'),
    s('carga_horaria_curso'),

    // Itinerário formativo (derivado de organizacao_curricular + areas_itinerario)
    hasFgb ? '1' : '0',
    hasIfa ? '1' : '0',
    hasIftp ? '1' : '0',
    s('tipo_curso_iftp'),
    hasIlinguagens ? '1' : '0',
    hasImatematica ? '1' : '0',
    hasInatureza ? '1' : '0',
    hasIhumanas ? '1' : '0',

    // Áreas do conhecimento (32-58)
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

    // Extra
    s('turma_bilingue'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 30 — PESSOA (ALUNO / PROFISSIONAL / GESTOR)
// ---------------------------------------------------------------------------

function buildRegistro30(pessoa: any, school: any): string {
  const b = (f: string) => boolToStr(pessoa[f])
  const s = (f: string) => (pessoa[f] ?? '').toString()

  const fields = [
    '30',
    school.codigo_inep || '',

    // Identificadores (3-6)
    s('inep_id'),
    s('cpf'),
    s('nome_completo'),
    formatDate(pessoa.data_nascimento),

    // Filiação (7-9)
    s('filiacao_declarada'),
    s('filiacao_1'),
    s('filiacao_2'),

    // Demográfico (10-15)
    s('sexo'),
    s('cor_raca'),
    s('nacionalidade'),
    s('pais_nacionalidade'),
    s('municipio_nascimento'),
    s('povo_indigena'),

    // Residência (16-21)
    s('pais_residencia'),
    s('cep'),
    s('municipio_residencia'),
    s('zona_residencia'),
    (pessoa.localizacao_diferenciada || '').toString(),

    // Deficiências (22-32)
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

    // Certidão (55)
    s('certidao_nascimento'),

    // Escolaridade (56-57)
    s('escolaridade'),
    s('tipo_ensino_medio'),

    // Cursos superiores (58-66)
    s('curso_superior_1'),
    s('curso_superior_2'),
    s('curso_superior_3'),
    s('ano_conclusao_1'),
    s('ano_conclusao_2'),
    s('ano_conclusao_3'),
    s('ies_1'),
    s('ies_2'),
    s('ies_3'),

    // Áreas pedagógicas (67-69)
    s('area_pedagogica_1'),
    s('area_pedagogica_2'),
    s('area_pedagogica_3'),

    // Pós-graduação (70-87)
    s('pos_tipo_1'), s('pos_area_1'), s('pos_ano_1'),
    s('pos_tipo_2'), s('pos_area_2'), s('pos_ano_2'),
    s('pos_tipo_3'), s('pos_area_3'), s('pos_ano_3'),
    s('pos_tipo_4'), s('pos_area_4'), s('pos_ano_4'),
    s('pos_tipo_5'), s('pos_area_5'), s('pos_ano_5'),
    s('pos_tipo_6'), s('pos_area_6'), s('pos_ano_6'),
    s('sem_pos'),

    // Formação continuada (88-108)
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

    // Email (109)
    s('email'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 40 — GESTOR ESCOLAR (7 data fields)
// ---------------------------------------------------------------------------

function buildRegistro40(vinculo: any, school: any): string {
  const s = (obj: any, f: string) => ((obj || {})[f] ?? '').toString()
  const pessoa = vinculo.people || {}

  const fields = [
    '40',
    school.codigo_inep || '',
    s(pessoa, 'id'),
    s(pessoa, 'inep_id'),
    s(vinculo, 'funcao_id') || '1',
    vinculo.regime_contratacao || '',
    vinculo.situacao || '1',
    s(pessoa, 'email'),
  ]

  return fields.join('|')
}

function buildRegistro40Fallback(pessoa: any, school: any): string {
  const s = (f: string) => (pessoa[f] ?? '').toString()

  const fields = [
    '40',
    school.codigo_inep || '',
    s('id'),
    s('inep_id'),
    '1',
    '',
    '',
    s('email'),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 50 — PROFISSIONAL POR TURMA (38 data fields)
// ---------------------------------------------------------------------------

function buildRegistro50(
  prof: any,
  school: any,
  vinculoProfMap: Map<string, any>,
  funcaoProfMap: Map<string, any>,
  discAreaMap: Map<string, number>,
  turmasMap: Map<string, any>,
): string {
  const s = (f: string) => (prof[f] ?? '').toString()

  const vp = prof.vinculo_profissional_id ? vinculoProfMap.get(prof.vinculo_profissional_id) : null
  const fp = vp?.funcao_id ? funcaoProfMap.get(vp.funcao_id) : null
  const funcaoCenso = getFuncaoCenso50(fp?.nome || '')
  const situacaoFuncional = vp?.regime_contratacao || ''

  const disciplinasIds = (prof.disciplinas_ids || []) as string[]
  const areaCodes = [...new Set(
    disciplinasIds
      .map((did: string) => discAreaMap.get(did))
      .filter((c): c is number => c != null)
      .map((c: number) => String(c).padStart(2, '0')),
  )]
  const areaSlots: string[] = []
  for (let i = 0; i < 25; i++) {
    areaSlots.push(i < areaCodes.length ? areaCodes[i] : '')
  }

  const turma = prof.turma_id ? turmasMap.get(prof.turma_id) : null
  const itinAreas = (turma?.areas_itinerario || []) as string[]
  const lecLinguagens = itinAreas.some((a: string) => /linguagens/i.test(a))
  const lecMatematica = itinAreas.some((a: string) => /matemática/i.test(a))
  const lecNatureza = itinAreas.some((a: string) => /natureza/i.test(a))
  const lecHumanas = itinAreas.some((a: string) => /humanas/i.test(a))
  const lecIftp = itinAreas.some((a: string) => /(técnica|tecnica|iftp)/i.test(a))

  const fields = [
    '50',
    school.codigo_inep || '',
    s('person_id'),
    s('turma_id'),
    funcaoCenso,
    situacaoFuncional,
    areaSlots[0], areaSlots[1], areaSlots[2], areaSlots[3], areaSlots[4],
    areaSlots[5], areaSlots[6], areaSlots[7], areaSlots[8], areaSlots[9],
    areaSlots[10], areaSlots[11], areaSlots[12], areaSlots[13], areaSlots[14],
    areaSlots[15], areaSlots[16], areaSlots[17], areaSlots[18], areaSlots[19],
    areaSlots[20], areaSlots[21], areaSlots[22], areaSlots[23], areaSlots[24],
    boolToStr(lecLinguagens),
    boolToStr(lecMatematica),
    boolToStr(lecNatureza),
    boolToStr(lecHumanas),
    boolToStr(lecIftp),
  ]

  return fields.join('|')
}

// ---------------------------------------------------------------------------
// REGISTRO 60 — MATRÍCULA DO ALUNO (33 data fields)
// ---------------------------------------------------------------------------

function buildRegistro60(matricula: any, school: any): string {
  const b = (f: string) => boolToStr(matricula[f])
  const s = (f: string) => (matricula[f] ?? '').toString()

  const fields = [
    '60',
    school.codigo_inep || '',

    // Identificação (3-6)
    s('aluno_id'),
    s('inep_id'),
    s('turma_id'),
    s('codigo_matricula_censo'),

    // Situação (7)
    s('situacao'),

    // Turma multi + carga horária IFTP (8-9)
    s('turma_multi'),
    s('carga_horaria_iftp'),

    // AEE (10-20)
    b('aee_funcao_cognitiva'),
    b('aee_vida_autonoma'),
    b('aee_enriquecimento'),
    b('aee_informatica'),
    b('aee_libras'),
    b('aee_portugues_sl'),
    b('aee_soroban'),
    b('aee_braille'),
    b('aee_orientacao'),
    b('aee_caa'),
    b('aee_recursos'),

    // Escolarização externa (21)
    s('escolarizacao_externa'),

    // Transporte (22-23)
    b('transporte_escolar'),
    s('transporte_responsavel'),

    // Veículos (24-33)
    b('veiculo_bicicleta'),
    b('veiculo_microonibus'),
    b('veiculo_onibus'),
    b('veiculo_tracao'),
    b('veiculo_vans'),
    b('veiculo_outro'),
    b('veiculo_aqua_5'),
    b('veiculo_aqua_15'),
    b('veiculo_aqua_35'),
    b('veiculo_aqua_mais'),
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

function formatDate(d: any): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return String(d || '')
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${date.getFullYear()}`
}