-- ============================================
-- BRAVERY SGE - Recurso Diário de Classe
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.diario-classe', 'Diário de Classe', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;
