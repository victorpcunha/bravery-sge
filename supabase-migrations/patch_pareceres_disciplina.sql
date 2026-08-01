-- ============================================
-- BRAVERY SGE - Pareceres descritivos por disciplina
-- ============================================
-- Habilita parecer descritivo por disciplina quando o método de avaliação
-- não utiliza "registro geral" (registro_geral = false).
-- Quando registro_geral = true, disciplina_id permanece NULL.
-- ============================================

-- 1. Coluna disciplina_id (matriz disciplina)
ALTER TABLE academico_pareceres_descritivos
  ADD COLUMN IF NOT EXISTS disciplina_id UUID REFERENCES academico_matriz_disciplinas(id) ON DELETE CASCADE;

COMMENT ON COLUMN academico_pareceres_descritivos.disciplina_id
  IS 'Matriz disciplina do parecer (NULL quando registro geral / único para todas as disciplinas)';

-- 2. Remover UNIQUE antigo (aluno_id, periodo)
ALTER TABLE academico_pareceres_descritivos
  DROP CONSTRAINT IF EXISTS academico_pareceres_descritivos_aluno_id_periodo_key;

-- 3. Unicidade condicional:
--    - registro geral: um parecer por (aluno_id, periodo) com disciplina_id NULL
--    - por disciplina: um parecer por (aluno_id, disciplina_id, periodo)
CREATE UNIQUE INDEX IF NOT EXISTS uq_pareceres_geral_periodo
  ON academico_pareceres_descritivos (aluno_id, periodo)
  WHERE disciplina_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_pareceres_disciplina_periodo
  ON academico_pareceres_descritivos (aluno_id, disciplina_id, periodo)
  WHERE disciplina_id IS NOT NULL;

-- 4. Índice auxiliar por disciplina
CREATE INDEX IF NOT EXISTS idx_pareceres_disciplina
  ON academico_pareceres_descritivos (disciplina_id);
