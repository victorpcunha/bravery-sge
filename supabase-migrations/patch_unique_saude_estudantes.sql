-- ============================================
-- BRAVERY SGE - Unique constraint for health data
-- Permite upsert por person_id + school_id
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_saude_estudantes_pessoa_escola
ON saude_estudantes(person_id, school_id);
