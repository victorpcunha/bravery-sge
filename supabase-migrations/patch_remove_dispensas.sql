-- ============================================
-- BRAVERY SGE - Remoção de Dispensa de Disciplinas (spec 034)
-- A funcionalidade foi removida do sistema (frontend + backend).
-- Remove tabela, índices e trigger. Registros de auditoria
-- (tabela `auditoria`) são histórico e são preservados.
-- Aplicar via SQL Editor
-- ============================================

DROP TRIGGER IF EXISTS academico_matriculas_dispensas_updated_at
  ON academico_matriculas_dispensas;

DROP INDEX IF EXISTS idx_matriculas_disp_matricula;
DROP INDEX IF EXISTS idx_matriculas_disp_disciplina;

DROP TABLE IF EXISTS academico_matriculas_dispensas;
