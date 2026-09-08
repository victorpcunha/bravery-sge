-- ============================================
-- BRAVERY SGE - Recursos: Portal do Responsável (gestão interna)
-- Registra o recurso de Comunicados do Portal (spec 025)
-- no sistema de permissões
-- ============================================

INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('portal.comunicados', 'Comunicados do Portal', 'Gestão Acadêmica')
ON CONFLICT (codigo) DO NOTHING;

-- Caso a seed anterior (módulo 'Portal') já tenha sido aplicada,
-- move o recurso para o módulo Gestão Acadêmica.
UPDATE recursos
SET modulo = 'Gestão Acadêmica'
WHERE codigo = 'portal.comunicados' AND modulo <> 'Gestão Acadêmica';
