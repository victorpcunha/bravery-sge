  -- ============================================
  -- BRAVERY SGE - Censo INEP 2026: Campos de Matrículas
  -- Registro 60 (Dados da Matrícula do Aluno)
  -- ============================================

  -- ============================================
  -- CORREÇÕES DE TIPO
  -- ============================================

  -- codigo_inep: VARCHAR(20) -> VARCHAR(8) (padrão INEP)
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'academico_matriculas' AND column_name = 'codigo_inep'
      AND character_maximum_length > 8
    ) THEN
      ALTER TABLE academico_matriculas
        ALTER COLUMN codigo_inep TYPE VARCHAR(8)
        USING LEFT(codigo_inep, 8);
    END IF;
  END $$;

  -- escolarizacao_externa: VARCHAR(50) -> VARCHAR(1) (INEP: 1/2/3)
  DO $$
  DECLARE
    constraint_name text;
  BEGIN
    -- Drop existing CHECK constraint before altering column type
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'academico_matriculas'
      AND con.contype = 'c'
      AND con.conname LIKE '%escolarizacao%';

    IF constraint_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE academico_matriculas DROP CONSTRAINT %I', constraint_name);
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'academico_matriculas' AND column_name = 'escolarizacao_externa'
      AND character_maximum_length > 1
    ) THEN
      ALTER TABLE academico_matriculas
        ALTER COLUMN escolarizacao_externa TYPE VARCHAR(1)
        USING CASE
          WHEN escolarizacao_externa = 'Em domicílio' THEN '2'
          WHEN escolarizacao_externa = 'Em hospital' THEN '3'
          ELSE '1'
        END;
    END IF;
  END $$;

  -- transporte_responsavel: VARCHAR(20) -> VARCHAR(1) (INEP: 1/2/3)
  DO $$
  DECLARE
    constraint_name text;
  BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'academico_matriculas'
      AND con.contype = 'c'
      AND con.conname LIKE '%transporte_responsavel%';

    IF constraint_name IS NOT NULL THEN
      EXECUTE format('ALTER TABLE academico_matriculas DROP CONSTRAINT %I', constraint_name);
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'academico_matriculas' AND column_name = 'transporte_responsavel'
      AND character_maximum_length > 1
    ) THEN
      ALTER TABLE academico_matriculas
        ALTER COLUMN transporte_responsavel TYPE VARCHAR(1)
        USING CASE
          WHEN transporte_responsavel = 'Municipal' THEN '2'
          WHEN transporte_responsavel = 'Estadual' THEN '3'
          ELSE '1'
        END;
    END IF;
  END $$;

  -- ============================================
  -- IDENTIFICADORES CENSO (Registro 60 - campos 1-3)
  -- ============================================

  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS inep_id VARCHAR(12);
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS codigo_matricula_censo VARCHAR(20);

  -- ============================================
  -- TURMA MULTI (Registro 60 - campo 10)
  -- Código de etapa que o aluno cursa na turma multisseriada
  -- ============================================

  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS turma_multi VARCHAR(2);

  -- ============================================
  -- CARGA HORÁRIA IFTP (Registro 60 - campo 11)
  -- ============================================

  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS carga_horaria_iftp INTEGER;

  -- ============================================
  -- ATENDIMENTO EDUCACIONAL ESPECIALIZADO - AEE (Registro 60 - campos 12-22)
  -- ============================================

  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_funcao_cognitiva BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_vida_autonoma BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_enriquecimento BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_informatica BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_libras BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_portugues_sl BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_soroban BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_braille BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_orientacao BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_caa BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS aee_recursos BOOLEAN;

  -- ============================================
  -- VEÍCULOS DE TRANSPORTE ESCOLAR (Registro 60 - campos 26-35)
  -- ============================================

  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_bicicleta BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_microonibus BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_onibus BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_tracao BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_vans BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_outro BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_aqua_5 BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_aqua_15 BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_aqua_35 BOOLEAN;
  ALTER TABLE academico_matriculas ADD COLUMN IF NOT EXISTS veiculo_aqua_mais BOOLEAN;

  -- ============================================
  -- FIM
  -- ============================================
