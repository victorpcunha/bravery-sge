-- ============================================
-- BRAVERY SGE - Adicionar controle de avaliações limitadas
-- ============================================

ALTER TABLE academico_metodos_avaliacao_numerico
ADD COLUMN IF NOT EXISTS limitar_avaliacoes BOOLEAN DEFAULT false;

ALTER TABLE academico_metodos_avaliacao_numerico
ADD COLUMN IF NOT EXISTS avaliacoes_list JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN academico_metodos_avaliacao_numerico.limitar_avaliacoes IS 'Quando true, o professor usa apenas as avaliações predefinidas pela escola';
COMMENT ON COLUMN academico_metodos_avaliacao_numerico.avaliacoes_list IS 'Lista JSON de avaliações predefinidas: [{ nome, peso }]';
