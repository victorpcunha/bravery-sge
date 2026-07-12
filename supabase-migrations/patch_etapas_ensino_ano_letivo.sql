-- Adiciona ano_letivo_id para associar etapas de ensino a um ano letivo específico
ALTER TABLE academico_etapas_ensino ADD COLUMN IF NOT EXISTS ano_letivo_id UUID REFERENCES academico_anos_letivos(id) ON DELETE CASCADE;

-- Remove a constraint antiga (school_id + etapa_codigo) e recria incluindo ano_letivo_id
ALTER TABLE academico_etapas_ensino DROP CONSTRAINT IF EXISTS academico_etapas_ensino_school_id_etapa_codigo_key;
ALTER TABLE academico_etapas_ensino ADD UNIQUE(school_id, ano_letivo_id, etapa_codigo);

-- Cria índice para consultas por ano letivo
CREATE INDEX IF NOT EXISTS idx_etapas_ensino_ano_letivo ON academico_etapas_ensino(ano_letivo_id);
