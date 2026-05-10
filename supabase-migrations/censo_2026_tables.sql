-- ============================================
-- BRAVERY SGE - Tabelas do Censo INEP 2026
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- TABELA 1: schools (Registro 00)
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '00',
  codigo_inep VARCHAR(8),
  nome_escola VARCHAR(100) NOT NULL,
  cnpj VARCHAR(14),
  cpf_gestor VARCHAR(11),
  nome_gestor VARCHAR(100),
  cpf_secretario VARCHAR(11),
  nome_secretario VARCHAR(100),
  telefone_1 VARCHAR(11),
  telefone_2 VARCHAR(11),
  email VARCHAR(100),
  situacao_funcionamento VARCHAR(1) NOT NULL,
  dependencia_administrativa VARCHAR(1) NOT NULL,
  dependencia_administrativa_estadual VARCHAR(1),
  categoria_escola_privada VARCHAR(1),
  convenio_pdde BOOLEAN,
  tipo_convenio_pdde VARCHAR(1),
  convenio_pnate BOOLEAN,
  mantenedora_escola VARCHAR(1),
  regulamentacao BOOLEAN,
  orgao_vinculado VARCHAR(1),
  unidade_vinculada VARCHAR(20),
  formato_organizacional VARCHAR(1) NOT NULL,
  localizacao VARCHAR(1) NOT NULL,
  localizacao_diferenciada VARCHAR(1),
  oferta_educacao_especial BOOLEAN,
  atividade_complementar BOOLEAN,
  carga_horaria_atividade_complementar INTEGER,
  materias_contraturno BOOLEAN,
  projeto_clima_escolar BOOLEAN,
  projeto_mais_educacao BOOLEAN,
  projeto_escola_ativa BOOLEAN,
  programa_dual BOOLEAN,
  tipo_atendimento_medio VARCHAR(1),
  tipo_atendimento_eja VARCHAR(1),
  tipo_atendimento_educacao_especial VARCHAR(1),
  educacao_indigena BOOLEAN,
  lingua_indigena VARCHAR(1),
  codigo_lingua_indigena VARCHAR(3),
  lagoa BOOLEAN,
  area_verde BOOLEAN,
  almoxarifado BOOLEAN,
  arquivo BOOLEAN,
  berçario BOOLEAN,
  biblioteca BOOLEAN,
  cancela BOOLEAN,
  laboratorio_ciencias BOOLEAN,
  laboratorio_informatica BOOLEAN,
  patio_coberto BOOLEAN,
  patio_descoberto BOOLEAN,
  piscina BOOLEAN,
  printer BOOLEAN,
  quadro_interativo BOOLEAN,
  refeitorio BOOLEAN,
  sala_artes BOOLEAN,
  sala_ed_fisica BOOLEAN,
  sala_musica BOOLEAN,
  sala_professor BOOLEAN,
  sala_secretaria BOOLEAN,
  tv BOOLEAN,
  video BOOLEAN,
  acesso_internet BOOLEAN,
  acesso_internet_alunos BOOLEAN,
  tipo_internet VARCHAR(1),
  qtd_computadores INTEGER,
  qtd_computadores_administrativo INTEGER,
  qtd_computadores_alunos INTEGER,
  qtd_tablets INTEGER,
  qtd_notebooks INTEGER,
  qtd_desktop INTEGER,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_codigo_inep ON schools(codigo_inep);

-- ============================================
-- TABELA 2: teachers (Registro 10)
-- ============================================

CREATE TABLE IF NOT EXISTS teachers (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '10',
  codigo_inep VARCHAR(8),
  codigo_pessoa VARCHAR(20) NOT NULL,
  inep_id VARCHAR(12),
  cpf VARCHAR(11),
  nome_completo VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  filiacao_declarada VARCHAR(1),
  filiacao_1 VARCHAR(100),
  filiacao_2 VARCHAR(100),
  sexo VARCHAR(1),
  cor_raca VARCHAR(1),
  nacionalidade VARCHAR(1),
  pais_nacionalidade VARCHAR(3),
  municipio_nascimento VARCHAR(7),
  deficiencia BOOLEAN,
  cegueira BOOLEAN,
  baixa_visao BOOLEAN,
  visao_monocular BOOLEAN,
  surdez BOOLEAN,
  deficiencia_auditiva BOOLEAN,
  surdocegueira BOOLEAN,
  deficiencia_fisica BOOLEAN,
  deficiencia_intelectual BOOLEAN,
  deficiencia_multipla BOOLEAN,
  tea BOOLEAN,
  altas_habilidades BOOLEAN,
  ano_letivo_inicio DATE NOT NULL,
  codigo_escola VARCHAR(20) NOT NULL,
  tipo_vinculo VARCHAR(1) NOT NULL,
  tipo_contratacao VARCHAR(1),
  situacao_funcional VARCHAR(1),
  tipo_tempo_trabalho VARCHAR(1),
  carga_horaria_semanal INTEGER,
  codigo_funcao VARCHAR(3),
  formacao VARCHAR(1),
  formacao_continuada BOOLEAN,
  formacao_continuada_cursos VARCHAR(200),
  formacao_continuada_areas VARCHAR(100),
  formacao_complementar VARCHAR(50),
  nivel_1 VARCHAR(2),
  instituicao_1 VARCHAR(6),
  ano_conclusao_1 INTEGER,
  nivel_2 VARCHAR(2),
  instituicao_2 VARCHAR(6),
  ano_conclusao_2 INTEGER,
  nivel_3 VARCHAR(2),
  instituicao_3 VARCHAR(6),
  ano_conclusao_3 INTEGER,
  nivel_4 VARCHAR(2),
  instituicao_4 VARCHAR(6),
  ano_conclusao_4 INTEGER,
  nivel_5 VARCHAR(2),
  instituicao_5 VARCHAR(6),
  ano_conclusao_5 INTEGER,
  nivel_6 VARCHAR(2),
  instituicao_6 VARCHAR(6),
  ano_conclusao_6 INTEGER,
  pos_tipo_1 VARCHAR(1),
  pos_area_1 VARCHAR(3),
  pos_instituicao_1 VARCHAR(6),
  pos_ano_1 INTEGER,
  pos_tipo_2 VARCHAR(1),
  pos_area_2 VARCHAR(3),
  pos_instituicao_2 VARCHAR(6),
  pos_ano_2 INTEGER,
  pos_tipo_3 VARCHAR(1),
  pos_area_3 VARCHAR(3),
  pos_instituicao_3 VARCHAR(6),
  pos_ano_3 INTEGER,
  form_creche BOOLEAN,
  form_pre_escola BOOLEAN,
  form_alfabetizacao BOOLEAN,
  form_anos_iniciais BOOLEAN,
  form_anos_finais BOOLEAN,
  form_medio BOOLEAN,
  form_eja BOOLEAN,
  form_especial BOOLEAN,
  form_indigena BOOLEAN,
  form_campo BOOLEAN,
  form_ambiental BOOLEAN,
  form_direitos BOOLEAN,
  form_bilingue BOOLEAN,
  form_tic BOOLEAN,
  form_integral BOOLEAN,
  form_genero BOOLEAN,
  form_outros BOOLEAN,
  sem_formacao BOOLEAN,
  recebeu_formacao BOOLEAN,
  tipo_formacao_docente VARCHAR(1),
  componente_1 VARCHAR(3),
  componente_2 VARCHAR(3),
  componente_3 VARCHAR(3),
  componente_4 VARCHAR(3),
  componente_5 VARCHAR(3),
  componente_6 VARCHAR(3),
  componente_7 VARCHAR(3),
  componente_8 VARCHAR(3),
  componente_9 VARCHAR(3),
  componente_10 VARCHAR(3),
  componente_11 VARCHAR(3),
  componente_12 VARCHAR(3),
  componente_13 VARCHAR(3),
  atividade_1 VARCHAR(3),
  atividade_2 VARCHAR(3),
  atividade_3 VARCHAR(3),
  atividade_4 VARCHAR(3),
  atividade_5 VARCHAR(3),
  atividade_6 VARCHAR(3),
  funcao_regente BOOLEAN,
  funcao_coordenador BOOLEAN,
  funcao_diretor BOOLEAN,
  funcao_vice_diretor BOOLEAN,
  funcao_secretario BOOLEAN,
  funcao_supervisor BOOLEAN,
  funcao_orientador BOOLEAN,
  funcao_monitor BOOLEAN,
  funcao_medidor BOOLEAN,
  funcao_apoio BOOLEAN,
  area_linguagens BOOLEAN,
  area_matematica BOOLEAN,
  area_natureza BOOLEAN,
  area_humanas BOOLEAN,
  area_tecnologica BOOLEAN,
  area_profissional BOOLEAN,
  area_chapes BOOLEAN,
  area_artes BOOLEAN,
  area_ed_fisica BOOLEAN,
  area_religiao BOOLEAN,
  area_pedagogia BOOLEAN,
  area_sociologia BOOLEAN,
  area_filosofia BOOLEAN,
  area_outros BOOLEAN,
  iftp_curso_1 VARCHAR(4),
  iftp_carga_1 INTEGER,
  iftp_curso_2 VARCHAR(4),
  iftp_carga_2 INTEGER,
  iftp_curso_3 VARCHAR(4),
  iftp_carga_3 INTEGER,
  iftp_curso_4 VARCHAR(4),
  iftp_carga_4 INTEGER,
  iftp_curso_5 VARCHAR(4),
  iftp_carga_5 INTEGER,
  iftp_leciona_especializado BOOLEAN,
  iftp_formacao_complementar BOOLEAN,
  regente_serie BOOLEAN,
  regente_educacao_especial BOOLEAN,
  regente_educacao_infantil BOOLEAN,
  regente_eja BOOLEAN,
  regente_ensino_medio BOOLEAN,
  regente_educacao_profissional BOOLEAN,
  regente_educacao_indigena BOOLEAN,
  regente_camadas_sociais BOOLEAN,
  regente_atividades_complementares BOOLEAN,
  regente_apoio_aprendizagem BOOLEAN,
  regente_projetos BOOLEAN,
  regente_espacos_leitura BOOLEAN,
  regente_historico_escola BOOLEAN,
  regente_outros BOOLEAN,
  sem_regencia BOOLEAN,
  qtd_turmas INTEGER,
  qtd_alunos INTEGER,
  qtd_aulas_semana INTEGER,
  tempo_formacao INTEGER,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE UNIQUE INDEX idx_teachers_codigo ON teachers(school_id, codigo_pessoa);

-- ============================================
-- TABELA 3: classrooms (Registro 20)
-- ============================================

CREATE TABLE IF NOT EXISTS classrooms (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '20',
  codigo_inep VARCHAR(8),
  codigo_turma VARCHAR(20) NOT NULL,
  codigo_turma_inep VARCHAR(12),
  nome_turma VARCHAR(80),
  tipo_mediacao VARCHAR(1) NOT NULL,
  horario_domingo VARCHAR(11),
  horario_segunda VARCHAR(11),
  horario_terca VARCHAR(11),
  horario_quarta VARCHAR(11),
  horario_quinta VARCHAR(11),
  horario_sexta VARCHAR(11),
  horario_sabado VARCHAR(11),
  tipo_turma VARCHAR(1) NOT NULL,
  atividade_complementar_1 VARCHAR(3),
  atividade_complementar_2 VARCHAR(3),
  atividade_complementar_3 VARCHAR(3),
  atividade_complementar_4 VARCHAR(3),
  atividade_complementar_5 VARCHAR(3),
  atividade_complementar_6 VARCHAR(3),
  local_diferenciado VARCHAR(1),
  turma_especial BOOLEAN,
  etapa_agregada VARCHAR(3),
  etapa_ensino VARCHAR(3),
  eixo_qualificacao VARCHAR(3),
  codigo_curso VARCHAR(4),
  carga_horaria_curso INTEGER,
  forma_organizacao VARCHAR(1),
  formacao_alternancia BOOLEAN,
  fgb BOOLEAN,
  ifa BOOLEAN,
  iftp BOOLEAN,
  area_linguagens BOOLEAN,
  area_matematica BOOLEAN,
  area_natureza BOOLEAN,
  area_humanas BOOLEAN,
  tipo_curso_iftp VARCHAR(1),
  codigo_curso_tecnico VARCHAR(4),
  area_quimica BOOLEAN,
  area_fisica BOOLEAN,
  area_matematica_turma BOOLEAN,
  area_biologia BOOLEAN,
  area_ciencias BOOLEAN,
  area_portugues BOOLEAN,
  area_ingles BOOLEAN,
  area_espanhol BOOLEAN,
  area_outra_estrangeira BOOLEAN,
  area_arte BOOLEAN,
  area_ed_fisica BOOLEAN,
  area_historia BOOLEAN,
  area_geografia BOOLEAN,
  area_filosofia BOOLEAN,
  area_informatica BOOLEAN,
  area_profissionalizantes BOOLEAN,
  area_libras BOOLEAN,
  area_pedagogicas BOOLEAN,
  area_ensino_religioso BOOLEAN,
  area_lingua_indigena BOOLEAN,
  area_estudos_sociais BOOLEAN,
  area_sociologia BOOLEAN,
  area_frances BOOLEAN,
  area_portugues_sl BOOLEAN,
  area_estagio BOOLEAN,
  area_projeto_vida BOOLEAN,
  area_outras BOOLEAN,
  turma_bilingue BOOLEAN,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classrooms_school ON classrooms(school_id);
CREATE UNIQUE INDEX idx_classrooms_codigo ON classrooms(school_id, codigo_turma);

-- ============================================
-- TABELA 4: people (Registro 30)
-- ============================================

CREATE TABLE IF NOT EXISTS people (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '30',
  codigo_inep VARCHAR(8),
  codigo_pessoa VARCHAR(20) NOT NULL,
  inep_id VARCHAR(12),
  cpf VARCHAR(11),
  nome_completo VARCHAR(100) NOT NULL,
  data_nascimento DATE,
  filiacao_declarada VARCHAR(1),
  filiacao_1 VARCHAR(100),
  filiacao_2 VARCHAR(100),
  sexo VARCHAR(1),
  cor_raca VARCHAR(1),
  povo_indigena VARCHAR(5),
  nacionalidade VARCHAR(1),
  pais_nacionalidade VARCHAR(3),
  municipio_nascimento VARCHAR(7),
  deficiencia BOOLEAN,
  cegueira BOOLEAN,
  baixa_visao BOOLEAN,
  visao_monocular BOOLEAN,
  surdez BOOLEAN,
  deficiencia_auditiva BOOLEAN,
  surdocegueira BOOLEAN,
  deficiencia_fisica BOOLEAN,
  deficiencia_intelectual BOOLEAN,
  deficiencia_multipla BOOLEAN,
  tea BOOLEAN,
  altas_habilidades BOOLEAN,
  transtorno_aprendizagem BOOLEAN,
  discalculia BOOLEAN,
  disgrafia BOOLEAN,
  dislalia BOOLEAN,
  dislexia BOOLEAN,
  tdah BOOLEAN,
  tpac BOOLEAN,
  auxilio_ledor BOOLEAN,
  auxiliary_transcricao BOOLEAN,
  guia_interprete BOOLEAN,
  tradutor_libras BOOLEAN,
  leitura_labial BOOLEAN,
  prova_ampliada BOOLEAN,
  prova_superampliada BOOLEAN,
  cd_audio BOOLEAN,
  prova_libras BOOLEAN,
  prova_video_libras BOOLEAN,
  material_braille BOOLEAN,
  prova_braille BOOLEAN,
  tempo_adicional BOOLEAN,
  nenhum_recurso BOOLEAN,
  certidao_nascimento VARCHAR(32),
  pais_residencia VARCHAR(3),
  cep VARCHAR(8),
  municipio_residencia VARCHAR(7),
  zona_residencia VARCHAR(1),
  localizacao_diferenciada VARCHAR(1),
  escolaridade VARCHAR(1),
  tipo_ensino_medio VARCHAR(1),
  curso_superior_1 VARCHAR(6),
  ano_conclusao_1 INTEGER,
  ies_1 VARCHAR(6),
  curso_superior_2 VARCHAR(6),
  ano_conclusao_2 INTEGER,
  ies_2 VARCHAR(6),
  curso_superior_3 VARCHAR(6),
  ano_conclusao_3 INTEGER,
  ies_3 VARCHAR(6),
  area_pedagogica_1 VARCHAR(2),
  area_pedagogica_2 VARCHAR(2),
  area_pedagogica_3 VARCHAR(2),
  pos_tipo_1 VARCHAR(1),
  pos_area_1 VARCHAR(3),
  pos_ano_1 INTEGER,
  pos_tipo_2 VARCHAR(1),
  pos_area_2 VARCHAR(3),
  pos_ano_2 INTEGER,
  pos_tipo_3 VARCHAR(1),
  pos_area_3 VARCHAR(3),
  pos_ano_3 INTEGER,
  pos_tipo_4 VARCHAR(1),
  pos_area_4 VARCHAR(3),
  pos_ano_4 INTEGER,
  pos_tipo_5 VARCHAR(1),
  pos_area_5 VARCHAR(3),
  pos_ano_5 INTEGER,
  pos_tipo_6 VARCHAR(1),
  pos_area_6 VARCHAR(3),
  pos_ano_6 INTEGER,
  sem_pos BOOLEAN,
  form_creche BOOLEAN,
  form_pre_escola BOOLEAN,
  form_alfabetizacao BOOLEAN,
  form_anos_iniciais BOOLEAN,
  form_anos_finais BOOLEAN,
  form_medio BOOLEAN,
  form_eja BOOLEAN,
  form_especial BOOLEAN,
  form_indigena BOOLEAN,
  form_campo BOOLEAN,
  form_ambiental BOOLEAN,
  form_direitos BOOLEAN,
  form_bilingue BOOLEAN,
  form_tic BOOLEAN,
  form_integral BOOLEAN,
  form_genero BOOLEAN,
  sem_formacao BOOLEAN,
  recebeu_formacao BOOLEAN,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_people_school ON people(school_id);
CREATE UNIQUE INDEX idx_people_codigo ON people(school_id, codigo_pessoa);
CREATE INDEX idx_people_cpf ON people(cpf) WHERE cpf IS NOT NULL;

-- ============================================
-- TABELA 5: managers (Registro 40)
-- ============================================

CREATE TABLE IF NOT EXISTS managers (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '40',
  codigo_inep VARCHAR(8),
  codigo_pessoa VARCHAR(20) NOT NULL,
  inep_id VARCHAR(12),
  cargo VARCHAR(1) NOT NULL,
  criterio_acesso VARCHAR(1),
  situacao_funcional VARCHAR(1),
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_managers_person ON managers(person_id);

-- ============================================
-- TABELA 6: classroom_teachers (Registro 50)
-- ============================================

CREATE TABLE IF NOT EXISTS classroom_teachers (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '50',
  codigo_inep VARCHAR(8),
  codigo_pessoa VARCHAR(20) NOT NULL,
  inep_id VARCHAR(12),
  codigo_turma VARCHAR(20) NOT NULL,
  codigo_turma_inep VARCHAR(12),
  funcao VARCHAR(1) NOT NULL,
  situacao_funcional VARCHAR(1),
  area_1 VARCHAR(2),
  area_2 VARCHAR(2),
  area_3 VARCHAR(2),
  area_4 VARCHAR(2),
  area_5 VARCHAR(2),
  area_6 VARCHAR(2),
  area_7 VARCHAR(2),
  area_8 VARCHAR(2),
  area_9 VARCHAR(2),
  area_10 VARCHAR(2),
  area_11 VARCHAR(2),
  area_12 VARCHAR(2),
  area_13 VARCHAR(2),
  area_14 VARCHAR(2),
  area_15 VARCHAR(2),
  area_16 VARCHAR(2),
  area_17 VARCHAR(2),
  area_18 VARCHAR(2),
  area_19 VARCHAR(2),
  area_20 VARCHAR(2),
  area_21 VARCHAR(2),
  area_22 VARCHAR(2),
  area_23 VARCHAR(2),
  area_24 VARCHAR(2),
  area_25 VARCHAR(2),
  area_linguagens BOOLEAN,
  area_matematica BOOLEAN,
  area_natureza BOOLEAN,
  area_humanas BOOLEAN,
  leciona_iftp BOOLEAN,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classroom_teachers_classroom ON classroom_teachers(classroom_id);

-- ============================================
-- TABELA 7: enrollments (Registro 60)
-- ============================================

CREATE TABLE IF NOT EXISTS enrollments (
  tipo_registro VARCHAR(2) NOT NULL DEFAULT '60',
  codigo_inep VARCHAR(8),
  codigo_pessoa VARCHAR(20) NOT NULL,
  inep_id VARCHAR(12),
  codigo_turma VARCHAR(20) NOT NULL,
  codigo_turma_inep VARCHAR(12),
  codigo_matricula VARCHAR(20),
  turma_multi VARCHAR(2),
  carga_horaria_iftp INTEGER,
  aee_funcao_cognitiva BOOLEAN,
  aee_vida_autonoma BOOLEAN,
  aee_enriquecimento BOOLEAN,
  aee_informatica BOOLEAN,
  aee_libras BOOLEAN,
  aee_portugues_sl BOOLEAN,
  aee_soroban BOOLEAN,
  aee_braille BOOLEAN,
  aee_orientacao BOOLEAN,
  aee_caa BOOLEAN,
  aee_recursos BOOLEAN,
  escolarizacao_externa VARCHAR(1),
  transporte_escolar BOOLEAN,
  responsavel_transporte VARCHAR(1),
  veiculo_bicicleta BOOLEAN,
  veiculo_microonibus BOOLEAN,
  veiculo_onibus BOOLEAN,
  veiculo_tracao BOOLEAN,
  veiculo_vans BOOLEAN,
  veiculo_outro BOOLEAN,
  veiculo_aqua_5 BOOLEAN,
  veiculo_aqua_15 BOOLEAN,
  veiculo_aqua_35 BOOLEAN,
  veiculo_aqua_mais BOOLEAN,
  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_classroom ON enrollments(classroom_id);
CREATE UNIQUE INDEX idx_enrollments_class_student ON enrollments(classroom_id, codigo_pessoa);

-- ============================================
-- TABELA user_schools (para RLS multitenancy)
-- ============================================

CREATE TABLE IF NOT EXISTS user_schools (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, school_id)
);

-- ============================================
-- HABILITAR RLS
-- ============================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schools ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS (depois de user_schools!)
-- ============================================

CREATE POLICY "schools_all_access" ON schools FOR ALL USING (true);

CREATE POLICY "teachers_school_isolation" ON teachers
USING (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()));

CREATE POLICY "classrooms_school_isolation" ON classrooms
USING (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()));

CREATE POLICY "people_school_isolation" ON people
USING (school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()));

CREATE POLICY "managers_school_isolation" ON managers
USING (
  person_id IN (
    SELECT id FROM people 
    WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid())
  )
);

CREATE POLICY "classroom_teachers_school_isolation" ON classroom_teachers
USING (
  classroom_id IN (
    SELECT id FROM classrooms 
    WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid())
  )
);

CREATE POLICY "enrollments_school_isolation" ON enrollments
USING (
  classroom_id IN (
    SELECT id FROM classrooms 
    WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid())
  )
);

CREATE POLICY "user_schools_all_access" ON user_schools FOR ALL USING (true);

-- ============================================
-- FUNÇÃO create_school_user
-- ============================================

CREATE OR REPLACE FUNCTION public.create_school_user(
  p_email TEXT,
  p_school_id UUID,
  p_role TEXT DEFAULT 'director'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO auth.users (email, email_confirmed_at, raw_user_meta_data)
  VALUES (p_email, NOW(), jsonb_build_object('role', p_role))
  RETURNING id INTO v_user_id;
  
  INSERT INTO user_schools (user_id, school_id)
  VALUES (v_user_id, p_school_id);
  
  RETURN v_user_id;
END;
$$;

-- ============================================
-- TRIGGERS updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER classrooms_updated_at
  BEFORE UPDATE ON classrooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER managers_updated_at
  BEFORE UPDATE ON managers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER classroom_teachers_updated_at
  BEFORE UPDATE ON classroom_teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FIM
-- ============================================