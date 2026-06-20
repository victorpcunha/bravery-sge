-- ============================================
-- BRAVERY SGE - Censo INEP 2026: Campos de Turmas
-- Registro 20 (Dados da Turma)
-- ============================================

-- ============================================
-- CORREÇÕES DE TIPO
-- ============================================

-- codigo_inep: VARCHAR(20) -> VARCHAR(8) (padrão INEP)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'turmas' AND column_name = 'codigo_inep'
    AND character_maximum_length > 8
  ) THEN
    ALTER TABLE turmas
      ALTER COLUMN codigo_inep TYPE VARCHAR(8)
      USING LEFT(codigo_inep, 8);
  END IF;
END $$;

-- ============================================
-- HORÁRIOS DE AULA (Registro 20 - campos 11-17)
-- Formato: hh:mm-hh:mm
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_domingo VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_segunda VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_terca VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_quarta VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_quinta VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_sexta VARCHAR(11);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS horario_sabado VARCHAR(11);

-- ============================================
-- ETAPA DE ENSINO INEP (Registro 20 - campos 24-25)
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS etapa_agregada VARCHAR(3);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS etapa_codigo VARCHAR(2);

-- ============================================
-- CURSO PROFISSIONAL (Registro 20 - campos 26-28)
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS eixo_qualificacao VARCHAR(2);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS codigo_curso_tecnico VARCHAR(8);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS carga_horaria_curso INTEGER;

-- ============================================
-- ITINERÁRIO FORMATIVO (Registro 20 - campos 29-35)
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS fgb BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS ifa BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS iftp BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS tipo_curso_iftp VARCHAR(1);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS ifa_linguagens BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS ifa_matematica BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS ifa_natureza BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS ifa_humanas BOOLEAN;

-- ============================================
-- CARACTERÍSTICAS DA TURMA (Registro 20 - campos 36-38)
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS turma_especial VARCHAR(1);
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS formacao_alternancia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS turma_bilingue BOOLEAN;

-- ============================================
-- ÁREAS DO CONHECIMENTO (Registro 20 - campos 39-65, 27 booleanos)
-- ============================================

ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_quimica BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_fisica BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_matematica_turma BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_biologia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_ciencias BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_portugues BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_ingles BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_espanhol BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_outra_estrangeira BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_arte BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_ed_fisica BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_historia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_geografia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_filosofia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_informatica BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_profissionalizantes BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_libras BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_pedagogicas BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_ensino_religioso BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_lingua_indigena BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_estudos_sociais BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_sociologia BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_frances BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_portugues_sl BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_estagio BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_projeto_vida BOOLEAN;
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS area_outras BOOLEAN;

-- ============================================
-- FIM
-- ============================================
