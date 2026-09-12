-- ============================================
-- BRAVERY SGE - Recursos: Painel de Rendimento Escolar
-- Registra o recurso do Painel de Rendimento da
-- Gestão Pedagógica (spec 028) no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.rendimento', 'Rendimento Escolar', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;
