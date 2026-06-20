-- ============================================
-- Limpeza colunas duplicadas Censo INEP
-- Remove colunas criadas em duplicidade com
-- nomes incorretos (typos ou design ruins)
-- ============================================

-- 1. localizacao_diferenciada_residencia → usar só localizacao_diferenciada
ALTER TABLE people DROP COLUMN IF EXISTS localizacao_diferenciada_residencia;

-- 2. auxiliary_transcricao (typo original) → usar só auxilio_transcricao
ALTER TABLE people DROP COLUMN IF EXISTS auxiliary_transcricao;
