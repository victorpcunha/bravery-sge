-- ============================================
-- BRAVERY SGE - Recurso: Censo Escolar
-- Registra o recurso no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('censo-escolar', 'Censo Escolar', 'Censo Escolar')
ON CONFLICT (codigo) DO NOTHING;
