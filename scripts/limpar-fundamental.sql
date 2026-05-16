-- ============================================
-- LIMPAR TODAS AS HABILIDADES DO ENSINO FUNDAMENTAL
-- ============================================

BEGIN;

-- Remove habilidades do Fundamental
DELETE FROM bncc_habilidades
WHERE etapa_ensino IN ('anos_iniciais', 'anos_finais');

-- Remove objetos de conhecimento do Fundamental
DELETE FROM bncc_objetos_conhecimento
WHERE unidade_tematica_id IN (
  SELECT id FROM bncc_unidades_tematicas
  WHERE etapa_ensino IN ('anos_iniciais', 'anos_finais')
);

-- Remove unidades temáticas do Fundamental
DELETE FROM bncc_unidades_tematicas
WHERE etapa_ensino IN ('anos_iniciais', 'anos_finais');

COMMIT;
