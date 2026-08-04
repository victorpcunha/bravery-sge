-- ============================================
-- BRAVERY SGE - Recuperação Final Substitutiva
-- ============================================
-- Adiciona flag própria para a Recuperação Final seguir a mesma regra
-- da Recuperação por Período:
--   marcada   -> mantém a maior nota entre a média anual e a recuperação
--   desmarcada -> a nota da recuperação substitui a média anual

ALTER TABLE academico_metodos_avaliacao_numerico
  ADD COLUMN IF NOT EXISTS recuperacao_final_substitutiva BOOLEAN DEFAULT false;

COMMENT ON COLUMN academico_metodos_avaliacao_numerico.recuperacao_final_substitutiva
  IS 'Se true, mantém a maior nota entre a média anual e a recuperação final; se false, a recuperação substitui a média anual';
