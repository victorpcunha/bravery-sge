-- ============================================
-- BRAVERY SGE - Métodos de Avaliação
-- ============================================
-- Tabela de métodos de avaliação usados nas matrizes curriculares

CREATE TABLE IF NOT EXISTS academico_metodos_avaliacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  criterio_frequencia VARCHAR(20) DEFAULT 'por_dia' CHECK (criterio_frequencia IN ('por_dia', 'por_aula')),
  frecuencia_minima DECIMAL(5,2) DEFAULT 75.00,
  tipos_avaliacao JSONB DEFAULT '{}',
  quantidade_periodos_numerico INT,
  quantidade_periodos_parecer INT,
  quantidade_periodos_conceito INT,
  quantidade_periodos_nivel INT,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comentários
COMMENT ON TABLE academico_metodos_avaliacao IS 'Métodos de avaliação com configuração detalhada de tipos e critérios';
COMMENT ON COLUMN academico_metodos_avaliacao.criterio_frequencia IS 'Critério para cálculo de frequência: por_dia ou por_aula';
COMMENT ON COLUMN academico_metodos_avaliacao.frecuencia_minima IS 'Frequência mínima em percentual (0-100)';
COMMENT ON COLUMN academico_metodos_avaliacao.tipos_avaliacao IS 'Array JSON com tipos habilitados: numerico, parecer, conceito, nivel';
COMMENT ON COLUMN academico_metodos_avaliacao.quantidade_periodos_numerico IS 'Quantidade de períodos para avaliação numérica';
COMMENT ON COLUMN academico_metodos_avaliacao.quantidade_periodos_parecer IS 'Quantidade de períodos para parecer descritivo';
COMMENT ON COLUMN academico_metodos_avaliacao.quantidade_periodos_conceito IS 'Quantidade de períodos para avaliação por conceito';
COMMENT ON COLUMN academico_metodos_avaliacao.quantidade_periodos_nivel IS 'Quantidade de períodos para avaliação por nível';