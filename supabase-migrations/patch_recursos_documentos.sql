-- ============================================
-- BRAVERY SGE - Recursos: Módulo Documentos
-- Registra os recursos das seções do módulo
-- Documentos no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('documentos.oficiais', 'Documentos Oficiais', 'Documentos'),
  ('documentos.preencher', 'Documentos para Preenchimento Manual', 'Documentos'),
  ('relatorios', 'Relatórios', 'Documentos')
ON CONFLICT (codigo) DO NOTHING;