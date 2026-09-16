-- ============================================
-- BRAVERY SGE - Spec 029: Remoção de Modalidade da Turma
-- Modalidade NÃO é campo do Registro 20 — remoção total (T016).
-- Aplicar SOMENTE após a UI/dashboard estarem sem referências.
-- ============================================

ALTER TABLE turmas DROP COLUMN IF EXISTS modalidade;
