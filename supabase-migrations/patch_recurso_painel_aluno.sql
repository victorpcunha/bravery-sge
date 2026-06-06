-- ============================================
-- BRAVERY SGE - Recurso: Painel do Aluno
-- Registra o recurso no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-usuarios.painel-aluno', 'Painel do Aluno', 'Gestão de Usuários')
ON CONFLICT (codigo) DO NOTHING;
