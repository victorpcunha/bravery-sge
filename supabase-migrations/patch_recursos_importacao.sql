-- ============================================
-- BRAVERY SGE - Recurso: Importação Inicial
-- Registra o recurso de Importação Inicial (módulo Importação e Exportação)
-- no sistema de permissões. Aplicar via SQL Editor (sem CLI Supabase).
-- specs/039-importacao-inicial-usuarios
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('importacao-exportacao.importacao-inicial', 'Importação Inicial', 'Importação e Exportação')
ON CONFLICT (codigo) DO NOTHING;
