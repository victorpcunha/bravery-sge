-- ============================================
-- BRAVERY SGE - Recurso: Conselho de Classe
-- Registra o recurso no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.conselho-classe', 'Conselho de Classe', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;
