-- ============================================
-- BRAVERY SGE - Recursos: Fechamento de Turma
-- Registra os recursos no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.fechamento.fechar', 'Fechamento de Turma — Fechar Turma', 'Gestão Pedagógica'),
  ('gestao-pedagogica.fechamento.desfazer', 'Fechamento de Turma — Desfazer Fechamento', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;