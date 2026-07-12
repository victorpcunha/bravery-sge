-- ============================================
-- BRAVERY SGE - Turmas Multietapa: Subetapas
-- ============================================

-- Armazena os IDs das subetapas selecionadas (de academico_subetapas)
-- quando a turma é marcada como multietapa.
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS multietapa_subetapas_ids UUID[] DEFAULT '{}';