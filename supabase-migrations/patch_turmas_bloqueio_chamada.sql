-- ============================================
-- BRAVERY SGE - Bloqueio da Numeração de Chamada
-- ============================================
-- Trava irreversível da ordem de chamada da turma. Uma vez bloqueada,
-- "Gerar Número de Chamada" só numera alunos ainda sem número
-- (ao final da sequência), sem reordenar os já numerados.

ALTER TABLE turmas
  ADD COLUMN IF NOT EXISTS chamada_bloqueada BOOLEAN DEFAULT false NOT NULL;

COMMENT ON COLUMN turmas.chamada_bloqueada
  IS 'Ordem de chamada travada pelo profissional. Irreversível: novos alunos entram ao final da numeração.';
