-- ============================================
-- BRAVERY SGE - Painel de Rendimento Escolar (spec 028)
-- Faixa de Atenção do Método de Avaliação: pontos
-- percentuais da escala acima do mínimo que
-- caracterizam proximidade do limite (Atenção).
-- Padrão 5 (ex.: mínima 6,0 em escala 0–10 →
-- atenção até 6,5; frequência 75% → 80%).
-- ============================================

ALTER TABLE academico_metodos_avaliacao
  ADD COLUMN IF NOT EXISTS faixa_atencao_pp NUMERIC DEFAULT 5;

COMMENT ON COLUMN academico_metodos_avaliacao.faixa_atencao_pp IS
  'Faixa de Atenção do Painel de Rendimento: pontos percentuais acima do mínimo (média/frequência). Default 5.';
