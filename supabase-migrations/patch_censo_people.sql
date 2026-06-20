-- ============================================
-- BRAVERY SGE - Censo INEP 2026: Campos de Pessoas
-- Registro 30 (Dados do Aluno / Profissional / Gestor)
-- ============================================

-- ============================================
-- CORREÇÕES DE TIPO
-- ============================================

-- povo_indigena: VARCHAR(5) -> VARCHAR(3)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'povo_indigena'
    AND character_maximum_length > 3
  ) THEN
    ALTER TABLE people
      ALTER COLUMN povo_indigena TYPE VARCHAR(3)
      USING LEFT(povo_indigena, 3);
  END IF;
END $$;

-- curso_superior_1: VARCHAR(6) -> VARCHAR(8)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'curso_superior_1'
    AND character_maximum_length < 8
  ) THEN
    ALTER TABLE people ALTER COLUMN curso_superior_1 TYPE VARCHAR(8);
  END IF;
END $$;

-- curso_superior_2: VARCHAR(6) -> VARCHAR(8)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'curso_superior_2'
    AND character_maximum_length < 8
  ) THEN
    ALTER TABLE people ALTER COLUMN curso_superior_2 TYPE VARCHAR(8);
  END IF;
END $$;

-- curso_superior_3: VARCHAR(6) -> VARCHAR(8)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'curso_superior_3'
    AND character_maximum_length < 8
  ) THEN
    ALTER TABLE people ALTER COLUMN curso_superior_3 TYPE VARCHAR(8);
  END IF;
END $$;

-- ies_1: VARCHAR(6) -> VARCHAR(7)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ies_1'
    AND character_maximum_length < 7
  ) THEN
    ALTER TABLE people ALTER COLUMN ies_1 TYPE VARCHAR(7);
  END IF;
END $$;

-- ies_2: VARCHAR(6) -> VARCHAR(7)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ies_2'
    AND character_maximum_length < 7
  ) THEN
    ALTER TABLE people ALTER COLUMN ies_2 TYPE VARCHAR(7);
  END IF;
END $$;

-- ies_3: VARCHAR(6) -> VARCHAR(7)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ies_3'
    AND character_maximum_length < 7
  ) THEN
    ALTER TABLE people ALTER COLUMN ies_3 TYPE VARCHAR(7);
  END IF;
END $$;

-- ano_conclusao_1: INTEGER -> VARCHAR(4)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ano_conclusao_1'
    AND data_type = 'integer'
  ) THEN
    ALTER TABLE people
      ALTER COLUMN ano_conclusao_1 TYPE VARCHAR(4)
      USING ano_conclusao_1::VARCHAR;
  END IF;
END $$;

-- ano_conclusao_2: INTEGER -> VARCHAR(4)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ano_conclusao_2'
    AND data_type = 'integer'
  ) THEN
    ALTER TABLE people
      ALTER COLUMN ano_conclusao_2 TYPE VARCHAR(4)
      USING ano_conclusao_2::VARCHAR;
  END IF;
END $$;

-- ano_conclusao_3: INTEGER -> VARCHAR(4)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'ano_conclusao_3'
    AND data_type = 'integer'
  ) THEN
    ALTER TABLE people
      ALTER COLUMN ano_conclusao_3 TYPE VARCHAR(4)
      USING ano_conclusao_3::VARCHAR;
  END IF;
END $$;

-- ============================================
-- DOCUMENTOS E IDENTIDADE (Registro 30 - campos 3-6, 18-20)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS inep_id VARCHAR(12);
ALTER TABLE people ADD COLUMN IF NOT EXISTS certidao_nascimento VARCHAR(32);
ALTER TABLE people ADD COLUMN IF NOT EXISTS filiacao_declarada VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS filiacao_1 VARCHAR(100);
ALTER TABLE people ADD COLUMN IF NOT EXISTS filiacao_2 VARCHAR(100);

-- ============================================
-- ETNIA E RESIDÊNCIA (Registro 30 - campos 22-27)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS povo_indigena VARCHAR(3);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pais_residencia VARCHAR(3);
ALTER TABLE people ADD COLUMN IF NOT EXISTS cep VARCHAR(8);
ALTER TABLE people ADD COLUMN IF NOT EXISTS municipio_residencia VARCHAR(7);
ALTER TABLE people ADD COLUMN IF NOT EXISTS zona_residencia VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS localizacao_diferenciada_residencia VARCHAR(1);

-- ============================================
-- DEFICIÊNCIAS (Registro 30 - campos 28-39)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS cegueira BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS baixa_visao BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS visao_monocular BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS surdez BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deficiencia_auditiva BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS surdocegueira BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deficiencia_fisica BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deficiencia_intelectual BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deficiencia_multipla BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS tea BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS altas_habilidades BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deficiencia BOOLEAN;

-- ============================================
-- TRANSTORNOS (Registro 30 - campos 40-46)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS transtorno_aprendizagem BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS discalculia BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS disgrafia BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS dislalia BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS dislexia BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS tdah BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS tpac BOOLEAN;

-- ============================================
-- RECURSOS DE ACESSIBILIDADE (Registro 30 - campos 47-60)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS auxilio_ledor BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS auxilio_transcricao BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS guia_interprete BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS tradutor_libras BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS leitura_labial BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS prova_ampliada BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS prova_superampliada BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS cd_audio BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS prova_libras BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS prova_video_libras BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS material_braille BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS prova_braille BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS tempo_adicional BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS nenhum_recurso BOOLEAN;

-- ============================================
-- FORMAÇÃO ACADÊMICA (Registro 30 - campos 61-74)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS escolaridade VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS tipo_ensino_medio VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_superior_1 VARCHAR(8);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_superior_2 VARCHAR(8);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_superior_3 VARCHAR(8);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ano_conclusao_1 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ano_conclusao_2 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ano_conclusao_3 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ies_1 VARCHAR(7);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ies_2 VARCHAR(7);
ALTER TABLE people ADD COLUMN IF NOT EXISTS ies_3 VARCHAR(7);

-- ============================================
-- ÁREAS PEDAGÓGICAS (Registro 30 - campos 75-77)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS area_pedagogica_1 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS area_pedagogica_2 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS area_pedagogica_3 VARCHAR(2);

-- ============================================
-- PÓS-GRADUAÇÃO (Registro 30 - campos 78-86)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_1 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_2 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_3 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_4 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_5 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_tipo_6 VARCHAR(1);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_1 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_2 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_3 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_4 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_5 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_area_6 VARCHAR(2);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_1 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_2 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_3 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_4 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_5 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS pos_ano_6 VARCHAR(4);
ALTER TABLE people ADD COLUMN IF NOT EXISTS sem_pos VARCHAR(1);

-- ============================================
-- FORMAÇÃO CONTINUADA (Registro 30 - campos 87-107)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS form_creche BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_pre_escola BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_alfabetizacao BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_anos_iniciais BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_anos_finais BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_medio BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_eja BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_especial BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_indigena BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_campo BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_ambiental BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_direitos BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_bilingue BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_tic BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_integral BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_genero BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_direitos_crianca BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_etnico_raciais BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_gestao_escolar BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_outros BOOLEAN;
ALTER TABLE people ADD COLUMN IF NOT EXISTS sem_formacao BOOLEAN;

-- ============================================
-- EMAIL (Registro 30 - campo 108)
-- ============================================

ALTER TABLE people ADD COLUMN IF NOT EXISTS email VARCHAR(100);

-- ============================================
-- POS - CORREÇÃO DE TIPO (pos_area era VARCHAR(3), alterar para VARCHAR(2))
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'pos_area_1'
    AND character_maximum_length > 2
  ) THEN
    ALTER TABLE people
      ALTER COLUMN pos_area_1 TYPE VARCHAR(2)
      USING LEFT(pos_area_1, 2);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'pos_area_2'
    AND character_maximum_length > 2
  ) THEN
    ALTER TABLE people
      ALTER COLUMN pos_area_2 TYPE VARCHAR(2)
      USING LEFT(pos_area_2, 2);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people' AND column_name = 'pos_area_3'
    AND character_maximum_length > 2
  ) THEN
    ALTER TABLE people
      ALTER COLUMN pos_area_3 TYPE VARCHAR(2)
      USING LEFT(pos_area_3, 2);
  END IF;
END $$;

-- ============================================
-- FIM
-- ============================================
