-- ============================================
-- TABELA: CAMPOS DE EXPERIÊNCIA (BNCC INFANTIL)
-- ============================================
CREATE TABLE IF NOT EXISTS bncc_campos_experiencia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sigla VARCHAR(10) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor VARCHAR(20) DEFAULT '#1D3557',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bncc_campos_experiencia ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_campos_experiencia' AND policyname = 'campos_leitura') THEN
    CREATE POLICY "campos_leitura" ON bncc_campos_experiencia FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_campos_experiencia' AND policyname = 'campos_insercao') THEN
    CREATE POLICY "campos_insercao" ON bncc_campos_experiencia FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_campos_experiencia' AND policyname = 'campos_atualizacao') THEN
    CREATE POLICY "campos_atualizacao" ON bncc_campos_experiencia FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_campos_experiencia' AND policyname = 'campos_exclusao') THEN
    CREATE POLICY "campos_exclusao" ON bncc_campos_experiencia FOR DELETE USING (true);
  END IF;
END $$;

-- Seed dos 5 campos oficiais da BNCC
INSERT INTO bncc_campos_experiencia (sigla, nome, descricao, cor) VALUES
('CG', 'Corpo, Gestos e Movimento', 'Desenvolvimento da coordenação motora, expressão corporal e consciência corporal.', '#E11D48'),
('EF', 'Escuta, Fala, Pensamento e Imaginação', 'Desenvolvimento da linguagem oral, escrita, leitura e imaginação.', '#7C3AED'),
('ET', 'Espaços, tempos, quantidades, relações e transformações', 'Exploração de conceitos matemáticos, espaciais, temporais e científicos.', '#059669'),
('EO', 'O eu, o outro e o nós', 'Desenvolvimento da identidade, socialização e convivência coletiva.', '#D97706'),
('TS', 'Traços, Sons, Cores e Formas', 'Expressão artística através de artes visuais, música e criatividade.', '#0891B2')
ON CONFLICT (sigla) DO NOTHING;
