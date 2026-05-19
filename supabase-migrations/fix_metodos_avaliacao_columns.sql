-- ============================================
-- BRAVERY SGE - Adicionar colunas faltantes
-- em academico_metodos_avaliacao
-- ============================================
-- ATENÇÃO: Rodar este script no SQL Editor do
-- Supabase Dashboard (https://supabase.com/dashboard)
-- ============================================

-- 1. Adicionar colunas que podem estar faltando
ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS criterio_frequencia VARCHAR(20) DEFAULT 'por_dia' 
CHECK (criterio_frequencia IN ('por_dia', 'por_aula'));

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS frecuencia_minima DECIMAL(5,2) DEFAULT 75.00;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS tipos_avaliacao JSONB DEFAULT '{}';

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_numerico INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_parecer INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_conceito INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS quantidade_periodos_nivel INT;

ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true NOT NULL;

-- 2. Atualizar updated_at
ALTER TABLE academico_metodos_avaliacao 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- 3. Recarregar cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- 4. Verificar resultado
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'academico_metodos_avaliacao'
ORDER BY ordinal_position;
