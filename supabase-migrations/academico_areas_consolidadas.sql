-- ============================================
-- BRAVERY SGE - Áreas do Conhecimento Consolidadas
-- ============================================
-- Tabela de áreas principais do conhecimento conforme INEP/MEC

CREATE TABLE IF NOT EXISTS academico_areas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Inserir as 5 áreas principais
INSERT INTO academico_areas (nome) VALUES
  ('Linguagens'),
  ('Matemática'),
  ('Ciências da Natureza'),
  ('Ciências Humanas'),
  ('Outras áreas')
ON CONFLICT DO NOTHING;

-- Comentários
COMMENT ON TABLE academico_areas IS 'Áreas consolidadas do conhecimento (INEP/MEC)';
COMMENT ON COLUMN academico_areas.nome IS 'Nome da área do conhecimento';

-- RLS
ALTER TABLE academico_areas ENABLE ROW LEVEL SECURITY;

-- Política de leitura
CREATE POLICY "Permitir leitura areas consolidadas" ON academico_areas
FOR SELECT USING (true);