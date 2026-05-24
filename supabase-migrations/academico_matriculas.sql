-- ============================================
-- BRAVERY SGE - Gestão de Matrículas
-- ============================================

-- 1. Tabela principal de matrículas
CREATE TABLE IF NOT EXISTS academico_matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE RESTRICT,
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  subetapa_id UUID REFERENCES academico_subetapas(id) ON DELETE SET NULL,
  data_matricula DATE NOT NULL,
  codigo_inep VARCHAR(20),
  forma_ingresso VARCHAR(50) NOT NULL
    CHECK (forma_ingresso IN ('Normal', 'Lista de espera', 'Mandado Judicial', 'Reclassificação', 'Transferido de outra rede de ensino')),
  escolarizacao_externa VARCHAR(50) NOT NULL DEFAULT 'Não recebe escolarização fora da escola'
    CHECK (escolarizacao_externa IN ('Não recebe escolarização fora da escola', 'Em domicílio', 'Em hospital')),
  observacoes TEXT,
  transporte_responsavel VARCHAR(20) NOT NULL DEFAULT 'Não utiliza'
    CHECK (transporte_responsavel IN ('Não utiliza', 'Municipal', 'Estadual')),
  transporte_veiculos JSONB DEFAULT '{}'::jsonb,
  situacao VARCHAR(30) NOT NULL DEFAULT 'Ativo'
    CHECK (situacao IN (
      'Ativo', 'Transferido', 'Desistente', 'Óbito',
      'Reclassificado', 'Aprovado', 'Aprovado por conselho de classe',
      'Reprovado', 'Reprovado por frequência', 'Remanejado'
    )),
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_matriculas_school ON academico_matriculas(school_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_aluno ON academico_matriculas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_ano ON academico_matriculas(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_turma ON academico_matriculas(turma_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_etapa ON academico_matriculas(etapa_ensino_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_situacao ON academico_matriculas(situacao);
CREATE INDEX IF NOT EXISTS idx_matriculas_ativo ON academico_matriculas(ativo);

CREATE TRIGGER academico_matriculas_updated_at
BEFORE UPDATE ON academico_matriculas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Tabela de movimentações da matrícula
CREATE TABLE IF NOT EXISTS academico_matriculas_movimentacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID NOT NULL REFERENCES academico_matriculas(id) ON DELETE CASCADE,
  tipo VARCHAR(30) NOT NULL
    CHECK (tipo IN ('Transferencia', 'Reclassificacao', 'Remanejamento', 'Desistencia', 'Obito')),
  data_movimentacao DATE NOT NULL,
  data_registro TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  profissional_id UUID NOT NULL REFERENCES people(id) ON DELETE RESTRICT,
  observacoes TEXT,
  dados_complementares JSONB DEFAULT '{}'::jsonb,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_matriculas_mov_matricula ON academico_matriculas_movimentacoes(matricula_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_mov_tipo ON academico_matriculas_movimentacoes(tipo);

CREATE TRIGGER academico_matriculas_movimentacoes_updated_at
BEFORE UPDATE ON academico_matriculas_movimentacoes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Tabela de dispensa de disciplinas
CREATE TABLE IF NOT EXISTS academico_matriculas_dispensas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula_id UUID NOT NULL REFERENCES academico_matriculas(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES academico_disciplinas(id) ON DELETE RESTRICT,
  motivo TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_matriculas_disp_matricula ON academico_matriculas_dispensas(matricula_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_disp_disciplina ON academico_matriculas_dispensas(disciplina_id);

CREATE TRIGGER academico_matriculas_dispensas_updated_at
BEFORE UPDATE ON academico_matriculas_dispensas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE academico_matriculas IS 'Matrículas de alunos em turmas por ano letivo';
COMMENT ON COLUMN academico_matriculas.transporte_veiculos IS 'JSONB com veículos de transporte escolar: { rodoviario: "...", aquaviario: "..." }';
COMMENT ON COLUMN academico_matriculas.situacao IS 'Situação atual da matrícula';
COMMENT ON TABLE academico_matriculas_movimentacoes IS 'Histórico de movimentações da matrícula';
COMMENT ON COLUMN academico_matriculas_movimentacoes.dados_complementares IS 'JSONB com dados extras: nova_etapa_id, nova_turma_id, motivo_desistencia';
COMMENT ON TABLE academico_matriculas_dispensas IS 'Dispensas de disciplinas por matrícula';
