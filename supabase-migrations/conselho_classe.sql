-- ============================================
-- BRAVERY SGE - Migração: Conselho de Classe
-- Tabela de resultados do conselho de classe
-- ============================================

CREATE TABLE IF NOT EXISTS conselho_classe_resultados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  matriz_disciplina_id UUID NOT NULL REFERENCES academico_matriz_disciplinas(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  periodo INT NOT NULL,
  nota_conselho DECIMAL(5,2),
  parecer TEXT,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(turma_id, matriz_disciplina_id, aluno_id, periodo)
);

CREATE INDEX IF NOT EXISTS idx_conselho_resultados_turma
  ON conselho_classe_resultados(turma_id);

CREATE INDEX IF NOT EXISTS idx_conselho_resultados_aluno
  ON conselho_classe_resultados(aluno_id);

CREATE INDEX IF NOT EXISTS idx_conselho_resultados_disciplina
  ON conselho_classe_resultados(matriz_disciplina_id);

CREATE INDEX IF NOT EXISTS idx_conselho_resultados_periodo
  ON conselho_classe_resultados(periodo);

-- Trigger para updated_at
CREATE TRIGGER conselho_classe_resultados_updated_at
  BEFORE UPDATE ON conselho_classe_resultados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE conselho_classe_resultados IS
  'Resultados do conselho de classe por aluno, disciplina e período';
COMMENT ON COLUMN conselho_classe_resultados.nota_conselho IS
  'Nota atribuída pelo conselho para substituir a nota do período';
COMMENT ON COLUMN conselho_classe_resultados.parecer IS
  'Parecer descritivo do conselho sobre o aluno na disciplina';
