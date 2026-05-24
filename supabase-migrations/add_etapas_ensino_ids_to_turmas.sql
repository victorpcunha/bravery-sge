-- Adicionar coluna etapas_ensino_ids (JSONB) à tabela turmas
-- Necessário para suportar turmas com múltiplas etapas de ensino

ALTER TABLE turmas
ADD COLUMN IF NOT EXISTS etapas_ensino_ids JSONB DEFAULT '[]'::jsonb;

-- Preencher com valor da coluna etapa_ensino_id existente (singular) para registros já criados
UPDATE turmas
SET etapas_ensino_ids = jsonb_build_array(etapa_ensino_id::text)
WHERE etapas_ensino_ids IS NULL OR etapas_ensino_ids = '[]'::jsonb;
