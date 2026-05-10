-- Tabela para armazenar Objetivos de Aprendizagem e Habilidades BNCC

CREATE TABLE IF NOT EXISTS bncc_objetivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_ensino VARCHAR(20) NOT NULL,      -- 'infantil', 'fundamental', 'medio'
  etapa VARCHAR(50) NOT NULL,            -- 'creche', 'pre-escola', '1-5ano', '6-9ano', etc
  faixa_etaria VARCHAR(100),             -- 'Bebês (0-1a6)', 'Crianças pequenas (1a7-3a11)'
  campo_experiencia VARCHAR(100) NOT NULL, -- 'Corpo, Gestos e Movimento', etc
  codigo_bncc VARCHAR(20) NOT NULL,      -- 'EI01CG01'
  descricao TEXT NOT NULL,                -- Descrição da habilidade/objetivo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_bncc_tipo_ensino ON bncc_objetivos(tipo_ensino);
CREATE INDEX idx_bncc_etapa ON bncc_objetivos(etapa);
CREATE INDEX idx_bncc_faixa_etaria ON bncc_objetivos(faixa_etaria);
CREATE INDEX idx_bncc_campo ON bncc_objetivos(campo_experiencia);
CREATE INDEX idx_bncc_codigo ON bncc_objetivos(codigo_bncc);

-- Habilitar RLS
ALTER TABLE bncc_objetivos ENABLE ROW LEVEL SECURITY;

-- Policy para leitura (público para consulta)
CREATE POLICY "bncc_leitura" ON bncc_objetivos FOR SELECT USING (true);

-- Inserir dados da Educação Infantil - Creche Bebês (0-1a6)
INSERT INTO bncc_objetivos (tipo_ensino, etapa, faixa_etaria, campo_experiencia, codigo_bncc, descricao) VALUES
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG01', 'Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG02', 'Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG03', 'Imitar gestos e movimentos de outras crianças, adultos e animais.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG04', 'Participar do cuidado do seu corpo e da promoção do seu bem-estar.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG05', 'Utilizar os movimentos de preensão, encaixe e lançamento, ampliando suas possibilidades de manuseio de diferentes materiais e objetos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF01', 'Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF02', 'Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF03', 'Demonstrar interesse ao ouvir histórias lidas ou contadas, observando ilustrações e os movimentos de leitura do adulto-leitor.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF04', 'Reconhecer elementos das ilustrações de histórias, apontando-os, a pedido do adulto-leitor.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF05', 'Imitar as variações de entonação e gestos realizados pelos adultos, ao ler histórias e ao cantar.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF06', 'Comunicar-se com outras pessoas usando movimentos, gestos, balbucios, fala e outras formas de expressão.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF07', 'Conhecer e manipular materiais impressos e audiovisuais em diferentes portadores.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF08', 'Participar de situações de escuta de textos em diferentes gêneros textuais.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF09', 'Conhecer e manipular diferentes instrumentos e suportes de escrita.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET01', 'Explorar e descobrir as propriedades de objetos e materiais.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET02', 'Explorar relações de causa e efeito.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET03', 'Explorar o ambiente pela ação e observação, manipulando, experimentando e fazendo descobertas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET04', 'Manipular, experimentar, arrumar e explorar o espaço por meio de experiências de deslocamentos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET05', 'Manipular materiais diversos e variados para comparar as diferenças e semelhanças entre eles.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET06', 'Vivenciar diferentes ritmos, velocidades e fluxos nas interações e brincadeiras.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO01', 'Perceber que suas ações têm efeitos nas outras crianças e nos adultos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO02', 'Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO03', 'Interagir com crianças da mesma faixa etária e adultos ao explorar espaços, materiais, objetos, brinquedos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO04', 'Comunicar necessidades, desejos e emoções, utilizando gestos, balbucios, palavras.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO05', 'Reconhecer seu corpo e expressar suas sensações em momentos de alimentação, higiene, brincadeira e descanso.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO06', 'Interagir com outras crianças da mesma faixa etária e adultos, adaptando-se ao convívio social.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS01', 'Explorar sons produzidos com o próprio corpo e com objetos do ambiente.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS02', 'Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS03', 'Explorar diferentes fontes sonoras e materiais para acompanhar brincadeiras cantadas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS04', 'Desenvolver progressivamente o domínio do corpo para criar diferentes звуки e expressões.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS05', 'Explorar o mundo through dos sentidos.');

SELECT COUNT(*) as total_objetivos FROM bncc_objetivos;