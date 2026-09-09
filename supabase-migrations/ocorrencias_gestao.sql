-- ============================================
-- BRAVERY SGE - Ocorrências da Gestão Acadêmica (spec 026)
-- Migration CONVERGENTE: cria a tabela canônica e os
-- vínculos N:N se não existirem; adiciona colunas novas
-- sem alterar nem remover o schema legado.
-- Produção já possui titulo/tipo(positiva,negativa)/
-- detalhes/apresentar_portal + ocorrencias_alunos
-- (vide patch_portal_ocorrencias.sql) — aqui esses
-- comandos são no-op; o que é novo de fato é
-- ocorrencias_profissionais + índices.
-- Aplicar via SQL Editor (sem CLI Supabase).
-- ============================================

-- Tabela canônica (no-op onde já existe)
CREATE TABLE IF NOT EXISTS ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  titulo VARCHAR(150) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('positiva', 'negativa')),
  data_ocorrencia DATE NOT NULL DEFAULT CURRENT_DATE,
  detalhes TEXT NOT NULL,
  apresentar_portal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Convergência: ambientes criados pelo ocorrencias.sql
-- legado do repo ganham as colunas novas (nullable para
-- não quebrar linhas legadas; a validação server-side
-- exige preenchimento nos novos registros).
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS titulo VARCHAR(150);
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS data_ocorrencia DATE DEFAULT CURRENT_DATE;
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS detalhes TEXT;
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS apresentar_portal BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE ocorrencias ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- NOTA: a coluna `tipo` legada possui CHECK
-- (disciplinar, pedagogica) onde aplicada. NÃO a
-- alteramos aqui (migração destrutiva fora de escopo);
-- produção já usa (positiva, negativa).

-- Vínculo N:N ocorrência ↔ aluno (no-op em produção)
CREATE TABLE IF NOT EXISTS ocorrencias_alunos (
  ocorrencia_id UUID NOT NULL REFERENCES ocorrencias(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (ocorrencia_id, aluno_id)
);

-- Vínculo N:N ocorrência ↔ profissional (NOVO — spec 026)
CREATE TABLE IF NOT EXISTS ocorrencias_profissionais (
  ocorrencia_id UUID NOT NULL REFERENCES ocorrencias(id) ON DELETE CASCADE,
  profissional_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  PRIMARY KEY (ocorrencia_id, profissional_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ocorrencias_school ON ocorrencias(school_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_data ON ocorrencias(data_ocorrencia DESC);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_school_tipo ON ocorrencias(school_id, tipo);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_alunos_aluno ON ocorrencias_alunos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_alunos_ocorrencia ON ocorrencias_alunos(ocorrencia_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_profissionais_prof ON ocorrencias_profissionais(profissional_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_profissionais_ocorrencia ON ocorrencias_profissionais(ocorrencia_id);

COMMENT ON TABLE ocorrencias IS 'Ocorrências positivas/negativas da Gestão Acadêmica (spec 026); Portal lista somente apresentar_portal=true';
COMMENT ON TABLE ocorrencias_alunos IS 'Vínculo N:N ocorrência↔aluno; ao menos um aluno por ocorrência';
COMMENT ON TABLE ocorrencias_profissionais IS 'Vínculo N:N ocorrência↔profissional; ao menos um profissional por ocorrência';
COMMENT ON COLUMN ocorrencias.tipo IS 'Natureza: positiva|negativa (filtro Todas/Positivas/Negativas)';
COMMENT ON COLUMN ocorrencias.apresentar_portal IS 'Sinaliza exibição no Portal do Responsável (spec futura)';
