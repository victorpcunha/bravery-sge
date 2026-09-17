-- ============================================
-- BRAVERY SGE - Recursos: Tela de Rematrículas (spec 035)
-- Registra o recurso da rematrícula em lote
-- no sistema de permissões (módulo Gestão Acadêmica)
-- Aplicar via SQL Editor (sem CLI Supabase)
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-academica.rematriculas', 'Rematrículas', 'Gestão Acadêmica')
ON CONFLICT (codigo) DO NOTHING;
