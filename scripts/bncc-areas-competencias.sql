-- ============================================
-- CRIAÇÃO: TABELAS DE ÁREAS DO CONHECIMENTO E COMPETÊNCIAS BNCC
-- ============================================

CREATE TABLE IF NOT EXISTS bncc_areas_conhecimento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    tipo_ensino VARCHAR(20) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bncc_competencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID NOT NULL REFERENCES bncc_areas_conhecimento(id) ON DELETE CASCADE,
    codigo VARCHAR(10) NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bncc_areas_unique') THEN
    ALTER TABLE bncc_areas_conhecimento ADD CONSTRAINT bncc_areas_unique UNIQUE (nome, tipo_ensino);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bncc_competencias_unique') THEN
    ALTER TABLE bncc_competencias ADD CONSTRAINT bncc_competencias_unique UNIQUE (area_id, codigo);
  END IF;
END $$;

-- ============================================
-- SEED: ENSINO FUNDAMENTAL
-- ============================================
INSERT INTO bncc_areas_conhecimento (nome, tipo_ensino, descricao) VALUES
('Linguagens', 'fundamental', 'As linguagens são construções humanas que permitem a expressão, a comunicação e a interação social.'),
('Matemática', 'fundamental', 'A Matemática é uma ciência humana que contribui para solucionar problemas científicos e tecnológicos.'),
('Ciências da Natureza', 'fundamental', 'As Ciências da Natureza compreendem o conhecimento científico como provisório, cultural e histórico.'),
('Ciências Humanas', 'fundamental', 'As Ciências Humanas estudam o ser humano em sociedade, suas relações, culturas e transformações.'),
('Ensino Religioso', 'fundamental', 'O Ensino Religioso aborda os aspectos estruturantes das diferentes tradições religiosas e filosofias de vida.')
ON CONFLICT (nome, tipo_ensino) DO NOTHING;

-- Inserir competências apenas se não existirem
INSERT INTO bncc_competencias (area_id, codigo, descricao)
SELECT a.id, v.cod, v.descricao
FROM bncc_areas_conhecimento a
CROSS JOIN (VALUES
  ('Linguagens', 'fundamental', '1', 'Compreender as linguagens como construção humana, histórica, social e cultural, de natureza dinâmica.'),
  ('Linguagens', 'fundamental', '2', 'Conhecer e explorar diversas práticas de linguagem (artísticas, corporais e linguísticas).'),
  ('Linguagens', 'fundamental', '3', 'Utilizar diferentes linguagens para se expressar e partilhar informações, experiências e ideias.'),
  ('Linguagens', 'fundamental', '4', 'Utilizar diferentes linguagens para defender pontos de vista que respeitem o outro e promovam os direitos humanos.'),
  ('Linguagens', 'fundamental', '5', 'Desenvolver o senso estético para reconhecer, fruir e respeitar as diversas manifestações artísticas e culturais.'),
  ('Linguagens', 'fundamental', '6', 'Compreender e utilizar tecnologias digitais de informação e comunicação de forma crítica e ética.'),
  ('Matemática', 'fundamental', '1', 'Reconhecer que a Matemática é uma ciência humana, fruto das necessidades de diferentes culturas.'),
  ('Matemática', 'fundamental', '2', 'Desenvolver o raciocínio lógico e a capacidade de produzir argumentos convincentes.'),
  ('Matemática', 'fundamental', '3', 'Compreender as relações entre conceitos e procedimentos dos diferentes campos da Matemática.'),
  ('Matemática', 'fundamental', '4', 'Fazer observações sistemáticas de aspectos quantitativos e qualitativos.'),
  ('Matemática', 'fundamental', '5', 'Utilizar processos e ferramentas matemáticas para modelar e resolver problemas.'),
  ('Matemática', 'fundamental', '6', 'Enfrentar situações-problema em múltiplos contextos.'),
  ('Matemática', 'fundamental', '7', 'Desenvolver projetos que abordem questões de urgência social.'),
  ('Matemática', 'fundamental', '8', 'Interagir com seus pares de forma cooperativa.'),
  ('Ciências da Natureza', 'fundamental', '1', 'Compreender as Ciências da Natureza como empreendimento humano.'),
  ('Ciências da Natureza', 'fundamental', '2', 'Compreender conceitos fundamentais e estruturas explicativas das Ciências da Natureza.'),
  ('Ciências da Natureza', 'fundamental', '3', 'Analisar, compreender e explicar características, fenômenos e processos relativos ao mundo natural.'),
  ('Ciências da Natureza', 'fundamental', '4', 'Avaliar aplicações e implicações políticas, socioambientais e culturais da ciência.'),
  ('Ciências da Natureza', 'fundamental', '5', 'Construir argumentos com base em dados, evidências e informações confiáveis.'),
  ('Ciências da Natureza', 'fundamental', '6', 'Utilizar diferentes linguagens e tecnologias digitais.'),
  ('Ciências da Natureza', 'fundamental', '7', 'Conhecer, apreciar e cuidar de si, do seu corpo e bem-estar.'),
  ('Ciências da Natureza', 'fundamental', '8', 'Agir pessoal e coletivamente com respeito, autonomia e responsabilidade.'),
  ('Ciências Humanas', 'fundamental', '1', 'Compreender a si e ao outro como identidades diferentes, promovendo os direitos humanos.'),
  ('Ciências Humanas', 'fundamental', '2', 'Analisar o mundo social, cultural e digital com base nas Ciências Humanas.'),
  ('Ciências Humanas', 'fundamental', '3', 'Identificar, comparar e explicar a intervenção do ser humano na natureza e sociedade.'),
  ('Ciências Humanas', 'fundamental', '4', 'Interpretar e expressar sentimentos e crenças com relação às diferentes culturas.'),
  ('Ciências Humanas', 'fundamental', '5', 'Comparar eventos ocorridos simultaneamente em diferentes espaços e tempos.'),
  ('Ciências Humanas', 'fundamental', '6', 'Construir argumentos para defender ideias que promovam os direitos humanos.'),
  ('Ciências Humanas', 'fundamental', '7', 'Utilizar linguagens cartográfica, gráfica e iconográfica.'),
  ('Ensino Religioso', 'fundamental', '1', 'Conhecer os aspectos estruturantes das diferentes tradições religiosas.'),
  ('Ensino Religioso', 'fundamental', '2', 'Compreender, valorizar e respeitar as manifestações religiosas.'),
  ('Ensino Religioso', 'fundamental', '3', 'Reconhecer e cuidar de si, do outro e da coletividade.'),
  ('Ensino Religioso', 'fundamental', '4', 'Conviver com a diversidade de crenças e pensamentos.'),
  ('Ensino Religioso', 'fundamental', '5', 'Analisar as relações entre tradições religiosas e os campos da cultura e política.'),
  ('Ensino Religioso', 'fundamental', '6', 'Debater e posicionar-se contra discursos de intolerância religiosa.')
) v(nome, tipo, cod, descricao)
WHERE a.nome = v.nome AND a.tipo_ensino = v.tipo
ON CONFLICT (area_id, codigo) DO NOTHING;

-- ============================================
-- SEED: ENSINO MÉDIO
-- ============================================
INSERT INTO bncc_areas_conhecimento (nome, tipo_ensino, descricao) VALUES
('Linguagens e suas tecnologias', 'medio', 'As linguagens são construções humanas que permitem a expressão, a comunicação e a interação social.'),
('Matemática e suas tecnologias', 'medio', 'A Matemática contribui para a formação geral e tomada de decisões éticas.'),
('Ciências da Natureza e suas tecnologias', 'medio', 'As Ciências da Natureza investigam fenômenos naturais e processos tecnológicos.'),
('Ciências Humanas e Sociais Aplicadas', 'medio', 'As Ciências Humanas analisam processos políticos, econômicos, sociais, ambientais e culturais.')
ON CONFLICT (nome, tipo_ensino) DO NOTHING;

INSERT INTO bncc_competencias (area_id, codigo, descricao)
SELECT a.id, v.cod, v.descricao
FROM bncc_areas_conhecimento a
CROSS JOIN (VALUES
  ('Linguagens e suas tecnologias', 'medio', '1', 'Compreender o funcionamento das diferentes linguagens e práticas culturais.'),
  ('Linguagens e suas tecnologias', 'medio', '2', 'Compreender os processos identitários e relações de poder nas práticas sociais de linguagem.'),
  ('Linguagens e suas tecnologias', 'medio', '3', 'Utilizar diferentes linguagens para exercer protagonismo e autoria.'),
  ('Linguagens e suas tecnologias', 'medio', '4', 'Compreender as línguas como fenômeno político, histórico e cultural.'),
  ('Linguagens e suas tecnologias', 'medio', '5', 'Compreender os processos de produção de sentidos nas práticas corporais.'),
  ('Linguagens e suas tecnologias', 'medio', '6', 'Apreciar esteticamente as produções artísticas e culturais.'),
  ('Linguagens e suas tecnologias', 'medio', '7', 'Mobilizar práticas de linguagem no universo digital.'),
  ('Matemática e suas tecnologias', 'medio', '1', 'Utilizar conceitos e procedimentos matemáticos para interpretar situações.'),
  ('Matemática e suas tecnologias', 'medio', '2', 'Investigar desafios do mundo contemporâneo e tomar decisões éticas.'),
  ('Matemática e suas tecnologias', 'medio', '3', 'Utilizar estratégias matemáticas para interpretar, modelar e resolver problemas.'),
  ('Matemática e suas tecnologias', 'medio', '4', 'Compreender e utilizar diferentes registros de representação matemáticos.'),
  ('Matemática e suas tecnologias', 'medio', '5', 'Investigar e estabelecer conjecturas sobre conceitos matemáticos.'),
  ('Ciências da Natureza e suas tecnologias', 'medio', '1', 'Analisar fenômenos naturais e processos tecnológicos.'),
  ('Ciências da Natureza e suas tecnologias', 'medio', '2', 'Analisar interpretações sobre a dinâmica da Vida, da Terra e do Cosmos.'),
  ('Ciências da Natureza e suas tecnologias', 'medio', '3', 'Investigar situações-problema e avaliar aplicações do conhecimento científico.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '1', 'Analisar processos políticos, econômicos, sociais e culturais.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '2', 'Analisar a formação de territórios e fronteiras.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '3', 'Analisar as relações de grupos com a natureza.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '4', 'Analisar as relações de produção, capital e trabalho.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '5', 'Combater as diversas formas de injustiça e preconceito.'),
  ('Ciências Humanas e Sociais Aplicadas', 'medio', '6', 'Participar do debate público de forma crítica.')
) v(nome, tipo, cod, descricao)
WHERE a.nome = v.nome AND a.tipo_ensino = v.tipo
ON CONFLICT (area_id, codigo) DO NOTHING;

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE bncc_areas_conhecimento ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_areas_conhecimento' AND policyname = 'bncc_areas_leitura') THEN
    CREATE POLICY "bncc_areas_leitura" ON bncc_areas_conhecimento FOR SELECT USING (true);
  END IF;
END $$;

ALTER TABLE bncc_competencias ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bncc_competencias' AND policyname = 'bncc_competencias_leitura') THEN
    CREATE POLICY "bncc_competencias_leitura" ON bncc_competencias FOR SELECT USING (true);
  END IF;
END $$;
