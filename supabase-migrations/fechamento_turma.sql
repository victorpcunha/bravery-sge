-- ============================================
-- BRAVERY SGE - Fechamento de Turma
-- Estado fechada no cadastro da turma
-- ============================================

-- Colunas de controle de fechamento
ALTER TABLE turmas
  ADD COLUMN fechada BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN data_fechamento DATE,
  ADD COLUMN fechada_por UUID REFERENCES people(id) ON DELETE SET NULL;

-- Índice parcial para consultas rápidas de turmas fechadas
CREATE INDEX IF NOT EXISTS idx_turmas_fechada ON turmas(fechada) WHERE fechada = true;

-- Comentários
COMMENT ON COLUMN turmas.fechada IS 'Indica se a turma foi fechada pelo processo de Fechamento de Turma';
COMMENT ON COLUMN turmas.data_fechamento IS 'Data em que o fechamento da turma foi realizado';
COMMENT ON COLUMN turmas.fechada_por IS 'Profissional responsável pelo fechamento da turma';