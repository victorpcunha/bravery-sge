-- ============================================
-- Migration: Funções e Vínculos Profissionais
-- ============================================

-- Tabela de funções profissionais (configurável por escola)
CREATE TABLE IF NOT EXISTS funcoes_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  nome VARCHAR(255) NOT NULL,
  tipo_censo VARCHAR(10), -- 119 a 138 (Registro 10 INEP)
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de vínculos profissionais (múltiplos por pessoa)
CREATE TABLE IF NOT EXISTS vinculos_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id),
  regime_contratacao VARCHAR(2), -- 1-Concursado, 2-Contrato temporário, 3-Terceirizado, 4-CLT
  funcao_id UUID REFERENCES funcoes_profissionais(id),
  situacao VARCHAR(1), -- 1-Ativo, 2-Afastado, 3-Encerrado
  data_inicio DATE,
  carga_horaria INTEGER,
  observacoes TEXT,
  data_inicio_afastamento DATE,
  data_termino_afastamento DATE,
  data_termino DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_vinculos_profissionais_pessoa ON vinculos_profissionais(person_id);
CREATE INDEX IF NOT EXISTS idx_vinculos_profissionais_escola ON vinculos_profissionais(school_id);
CREATE INDEX IF NOT EXISTS idx_funcoes_profissionais_escola ON funcoes_profissionais(school_id);

-- Seed: funções padrão (inseridas por escola via aplicação)
