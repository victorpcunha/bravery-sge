-- ============================================
-- BRAVERY SGE - Número de Chamada na Matrícula
-- ============================================
-- Adiciona a coluna numero_chamada em academico_matriculas, usada pela
-- ação "Gerar Chamada" do Diário de Classe para numerar os alunos da turma
-- em ordem alfabética (1, 2, 3, ...).

ALTER TABLE academico_matriculas
  ADD COLUMN IF NOT EXISTS numero_chamada SMALLINT;

CREATE INDEX IF NOT EXISTS idx_matriculas_chamada
  ON academico_matriculas(turma_id, numero_chamada);

COMMENT ON COLUMN academico_matriculas.numero_chamada
  IS 'Número de chamada do aluno na turma. Atribuído em ordem alfabética pela ação "Gerar Chamada" do Diário de Classe.';
