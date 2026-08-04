-- ============================================
-- BRAVERY SGE - Recuperação por avaliação
-- ============================================
-- Adiciona coluna descricao para vincular a recuperação (tipo='avaliacao')
-- à avaliação específica que está sendo recuperada.
-- ============================================

ALTER TABLE academico_recuperacoes
  ADD COLUMN IF NOT EXISTS descricao VARCHAR(100);

COMMENT ON COLUMN academico_recuperacoes.descricao IS 'Avaliação sendo recuperada (tipo=avaliacao). NULL para recuperação por período ou final.';
