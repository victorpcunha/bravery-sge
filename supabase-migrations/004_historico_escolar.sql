-- ============================================
-- BRAVERY SGE - Histórico Escolar
-- ============================================
-- Adiciona colunas estado e ano ao historico_manual
-- Cria/atualiza tabela historico_manual_disciplinas
-- ============================================

-- 1. Adicionar colunas ao historico_manual
ALTER TABLE historico_manual ADD COLUMN IF NOT EXISTS estado VARCHAR(2);
ALTER TABLE historico_manual ADD COLUMN IF NOT EXISTS ano INTEGER;
ALTER TABLE historico_manual ALTER COLUMN ano_letivo_id DROP NOT NULL;

COMMENT ON COLUMN historico_manual.estado IS 'UF (Unidade Federativa) onde o aluno estudou';
COMMENT ON COLUMN historico_manual.ano IS 'Ano letivo do historico (ex: 2025)';

-- 2. Criar tabela (fresh install) ou alterar (upgrade)
CREATE TABLE IF NOT EXISTS historico_manual_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historico_manual_id UUID NOT NULL REFERENCES historico_manual(id) ON DELETE CASCADE,
  disciplina_id UUID REFERENCES academico_disciplinas(id) ON DELETE SET NULL,
  disciplina_nome VARCHAR(255),
  media_final DECIMAL(5,2) NOT NULL,
  carga_horaria_anual INTEGER,
  parte_diversificada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hmd_historico ON historico_manual_disciplinas(historico_manual_id);

COMMENT ON TABLE historico_manual_disciplinas IS 'Disciplinas vinculadas a registros manuais de historico escolar';

-- 3. Adicionar colunas faltantes (upgrade de schema anterior)
ALTER TABLE historico_manual_disciplinas ADD COLUMN IF NOT EXISTS disciplina_nome VARCHAR(255);
ALTER TABLE historico_manual_disciplinas ALTER COLUMN disciplina_id DROP NOT NULL;

COMMENT ON COLUMN historico_manual_disciplinas.disciplina_nome IS 'Nome da disciplina livre (para parte diversificada)';

-- 4. Adicionar CHECK constraint (drop antiga se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hmd_disciplina_check') THEN
    ALTER TABLE historico_manual_disciplinas DROP CONSTRAINT hmd_disciplina_check;
  END IF;
  ALTER TABLE historico_manual_disciplinas ADD CONSTRAINT hmd_disciplina_check CHECK (
    (parte_diversificada = false AND disciplina_id IS NOT NULL) OR
    (parte_diversificada = true)
  );
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;
