-- ============================================
-- BRAVERY SGE - Atualização Disciplinas
-- ============================================
-- Adiciona campos necessários conforme spec Tela de Disciplinas

-- Adicionar campos novos
ALTER TABLE academico_disciplinas
ADD COLUMN IF NOT EXISTS sigla VARCHAR(10),
ADD COLUMN IF NOT EXISTS area_codigo INTEGER,
ADD COLUMN IF NOT EXISTS codigo_inep INTEGER,
ADD COLUMN IF NOT EXISTS diretriz_curricular VARCHAR(50) CHECK (diretriz_curricular IN ('bncc', 'parte_diversificada', 'nenhuma')),
ADD COLUMN IF NOT EXISTS is_padrao_mec BOOLEAN DEFAULT false;

-- Atualizar comentário
COMMENT ON COLUMN academico_disciplinas.sigla IS 'Sigla da disciplina (ex: MAT, PORT)';
COMMENT ON COLUMN academico_disciplinas.area_codigo IS 'Código da área do conhecimento (1-99 conforme INEP)';
COMMENT ON COLUMN academico_disciplinas.codigo_inep IS 'Código INEP do componente curricular';
COMMENT ON COLUMN academico_disciplinas.diretriz_curricular IS 'Diretriz curricular: bncc, parte_diversificada ou nenhuma';
COMMENT ON COLUMN academico_disciplinas.is_padrao_mec IS 'Indica se é disciplina padrão do MEC (não pode ser excluída)';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_disciplinas_area_codigo ON academico_disciplinas(area_codigo);
CREATE INDEX IF NOT EXISTS idx_disciplinas_codigo_inep ON academico_disciplinas(codigo_inep);
CREATE INDEX IF NOT EXISTS idx_disciplinas_is_padrao_mec ON academico_disciplinas(is_padrao_mec);

-- ============================================
-- Tabela de Áreas do Conhecimento (Seed Data)
-- ============================================
CREATE TABLE IF NOT EXISTS academico_areas_conhecimento (
  codigo INTEGER PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Inserir áreas do conhecimento conforme INEP 2025
INSERT INTO academico_areas_conhecimento (codigo, nome, categoria) VALUES
-- Linguagens
(6, 'Língua /Literatura Portuguesa', 'linguagens'),
(7, 'Língua /Literatura estrangeira - Inglês', 'linguagens'),
(8, 'Língua /Literatura estrangeira - Espanhol', 'linguagens'),
(30, 'Língua/Literatura estrangeira - Francês', 'linguagens'),
(9, 'Língua /Literatura estrangeira - outra', 'linguagens'),
(27, 'Língua indígena', 'linguagens'),
(23, 'Libras', 'linguagens'),
(31, 'Língua Portuguesa como Segunda Língua', 'linguagens'),
(10, 'Arte', 'linguagens'),
(11, 'Educação Física', 'linguagens'),
-- Matemática
(3, 'Matemática', 'matematica'),
-- Ciências da Natureza
(1, 'Química', 'ciencias_natureza'),
(2, 'Física', 'ciencias_natureza'),
(4, 'Biologia', 'ciencias_natureza'),
(5, 'Ciências', 'ciencias_natureza'),
-- Ciências Humanas
(12, 'História', 'ciencias_humanas'),
(13, 'Geografia', 'ciencias_humanas'),
(14, 'Filosofia', 'ciencias_humanas'),
(28, 'Estudos Sociais', 'ciencias_humanas'),
(29, 'Sociologia', 'ciencias_humanas'),
-- Outras áreas
(16, 'Informática/Computação', 'outras'),
(17, 'Áreas do conhecimento profissionalizantes', 'outras'),
(25, 'Áreas do conhecimento pedagógicas', 'outras'),
(26, 'Ensino religioso', 'outras'),
(32, 'Estágio curricular supervisionado', 'outras'),
(33, 'Projeto de vida', 'outras'),
(99, 'Outras áreas do conhecimento', 'outras')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- Tabela de Componentes INEP (Seed Data)
-- ============================================
CREATE TABLE IF NOT EXISTS academico_componentes_inep (
  codigo INTEGER PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  area_codigo INTEGER REFERENCES academico_areas_conhecimento(codigo),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Inserir componentes conforme INEP 2025
INSERT INTO academico_componentes_inep (codigo, nome, area_codigo) VALUES
(1, 'Química', 1),
(2, 'Física', 2),
(3, 'Matemática', 3),
(4, 'Biologia', 4),
(5, 'Ciências', 5),
(6, 'Língua /Literatura Portuguesa', 6),
(7, 'Língua /Literatura estrangeira - Inglês', 7),
(8, 'Língua /Literatura estrangeira - Espanhol', 8),
(9, 'Língua /Literatura estrangeira - outra', 9),
(10, 'Arte', 10),
(11, 'Educação Física', 11),
(12, 'História', 12),
(13, 'Geografia', 13),
(14, 'Filosofia', 14),
(16, 'Informática/Computação', 16),
(17, 'Áreas do conhecimento profissionalizantes', 17),
(23, 'Libras', 23),
(25, 'Áreas do conhecimento pedagógicas', 25),
(26, 'Ensino religioso', 26),
(27, 'Língua indígena', 27),
(28, 'Estudos Sociais', 28),
(29, 'Sociologia', 29),
(30, 'Língua/Literatura estrangeira - Francês', 30),
(31, 'Língua Portuguesa como Segunda Língua', 31),
(32, 'Estágio curricular supervisionado', 32),
(33, 'Projeto de vida', 33),
(99, 'Outras áreas do conhecimento', 99)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- Disciplinas Padrão do MEC (Seed Data)
-- ============================================
INSERT INTO academico_disciplinas (school_id, nome, nome_abreviado, sigla, area_codigo, codigo_inep, componente, tipo_ensino, is_padrao_mec, ativo)
SELECT 
  s.id,
  c.nome,
  LEFT(c.nome, 20),
  UPPER(LEFT(c.nome, 4)),
  c.area_codigo,
  c.codigo,
  CASE 
    WHEN c.area_codigo IN (6, 7, 8, 9, 23, 27, 30, 31) THEN 'linguagens'
    WHEN c.area_codigo = 3 THEN 'matematica'
    WHEN c.area_codigo IN (1, 2, 4, 5) THEN 'ciencias_natureza'
    WHEN c.area_codigo IN (12, 13, 14, 28, 29) THEN 'ciencias_humanas'
    WHEN c.area_codigo = 26 THEN 'ensino_religioso'
    WHEN c.area_codigo = 11 THEN 'educacao_fisica'
    WHEN c.area_codigo = 10 THEN 'arte'
    ELSE 'todos'
  END,
  'todos',
  true,
  true
FROM academico_componentes_inep c
CROSS JOIN (SELECT id FROM schools LIMIT 1) s
WHERE NOT EXISTS (
  SELECT 1 FROM academico_disciplinas d 
  WHERE d.codigo_inep = c.codigo AND d.is_padrao_mec = true
);