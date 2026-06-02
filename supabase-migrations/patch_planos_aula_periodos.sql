-- ============================================
-- BRAVERY SGE - Patch: Multi-período + BNCC
-- ============================================

-- 1. periodo INT → periodos INT[]
ALTER TABLE planos_aula
  ALTER COLUMN periodo TYPE INT[] USING ARRAY[periodo],
  ALTER COLUMN periodo SET DEFAULT '{1}';

ALTER TABLE planos_aula
  RENAME COLUMN periodo TO periodos;

-- 2. Coluna para campos BNCC
ALTER TABLE planos_aula
  ADD COLUMN IF NOT EXISTS bncc_fields JSONB DEFAULT '[]'::jsonb;
