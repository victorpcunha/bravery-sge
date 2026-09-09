-- ============================================
-- BRAVERY SGE - Recursos: Ocorrências (gestão interna)
-- Registra o recurso de Ocorrências da Gestão Acadêmica
-- (spec 026) no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-academica.ocorrencias', 'Ocorrências', 'Gestão Acadêmica')
ON CONFLICT (codigo) DO NOTHING;
