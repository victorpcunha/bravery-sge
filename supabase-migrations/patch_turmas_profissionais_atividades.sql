-- ============================================
-- BRAVERY SGE - Spec 029: Atividades do Profissional na Turma
-- Códigos da Tabela de Tipo de Atividade Complementar 2026 (TEXT, sem FK —
-- catálogo versionado em src/data/censo/atividades-complementares.ts).
-- Alternativo a disciplinas_ids (turma complementar usa um ou outro).
-- ============================================

ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS atividades_ids TEXT[] DEFAULT '{}';
