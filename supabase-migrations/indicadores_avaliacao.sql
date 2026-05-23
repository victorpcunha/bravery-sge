-- ============================================
-- BRAVERY SGE - Indicadores de Avaliação
-- Permite à escola definir indicadores de
-- avaliação por ano letivo e etapa de ensino
-- ============================================

CREATE TABLE IF NOT EXISTS indicadores_avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  ano_letivo_id UUID NOT NULL REFERENCES academico_anos_letivos(id) ON DELETE RESTRICT,
  etapa_ensino_id UUID NOT NULL REFERENCES academico_etapas_ensino(id) ON DELETE RESTRICT,
  subetapa_id UUID REFERENCES academico_subetapas(id) ON DELETE RESTRICT,
  campo_experiencia VARCHAR(100),
  disciplina_id UUID REFERENCES academico_disciplinas(id) ON DELETE SET NULL,
  codigo VARCHAR(20),
  descricao TEXT NOT NULL,
  periodos_ids UUID[] DEFAULT '{}',
  opcoes_registro_ids UUID[] DEFAULT '{}',
  origem VARCHAR(20) NOT NULL DEFAULT 'manual'
    CHECK (origem IN ('matriz', 'manual')),
  objetivo_bncc_id UUID REFERENCES bncc_objetivos(id) ON DELETE SET NULL,
  utilizado BOOLEAN DEFAULT false NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (
    (campo_experiencia IS NOT NULL AND disciplina_id IS NULL)
    OR (campo_experiencia IS NULL AND disciplina_id IS NOT NULL)
    OR (campo_experiencia IS NULL AND disciplina_id IS NULL)
  )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_indicadores_school ON indicadores_avaliacao(school_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_ano ON indicadores_avaliacao(ano_letivo_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_etapa ON indicadores_avaliacao(etapa_ensino_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_subetapa ON indicadores_avaliacao(subetapa_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_campo ON indicadores_avaliacao(campo_experiencia);
CREATE INDEX IF NOT EXISTS idx_indicadores_disciplina ON indicadores_avaliacao(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_indicadores_ativo ON indicadores_avaliacao(ativo);

-- Trigger updated_at
CREATE TRIGGER indicadores_avaliacao_updated_at
BEFORE UPDATE ON indicadores_avaliacao
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE indicadores_avaliacao IS 'Indicadores de avaliação por ano letivo e etapa de ensino';
COMMENT ON COLUMN indicadores_avaliacao.origem IS 'Origem do indicador: matriz (importado BNCC) ou manual (criado pela escola)';
COMMENT ON COLUMN indicadores_avaliacao.utilizado IS 'Indica se já foi utilizado em avaliações (bloqueia exclusão)';
