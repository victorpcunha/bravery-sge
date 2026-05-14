-- Script para limpar e inserir BNCC Bebês (0 a 1 ano e 6 meses)

-- 1. Deletar registros existentes para Bebês
DELETE FROM bncc_objetivos
WHERE tipo_ensino = 'infantil'
AND faixa_etaria = 'Bebês (zero a 1 ano e 6 meses)';

-- 2. Inserir os 29 habilidades corretas para Bebês
INSERT INTO bncc_objetivos (tipo_ensino, etapa, faixa_etaria, campo_experiencia, codigo_bncc, descricao) VALUES
-- Corpo, Gestos e Movimento (5 habilidades)
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG01', 'Movimentar as partes do corpo para exprimir corporalmente emoções, necessidades e desejos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG02', 'Experimentar as possibilidades corporais nas brincadeiras e interações em ambientes acolhedores e desafiantes.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG03', 'Imitar gestos e movimentos de outras crianças, adultos e animais.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG04', 'Participar do cuidado do seu corpo e da promoção do seu bem-estar.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Corpo, Gestos e Movimento', 'EI01CG05', 'Utilizar os movimentos de preensão, encaixe e lançamento, ampliando suas possibilidades de manuseio de diferentes materiais e objetos.'),

-- Escuta, Fala, Pensamento e Imaginação (9 habilidades)
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF01', 'Reconhecer quando é chamado por seu nome e reconhecer os nomes de pessoas com quem convive.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF02', 'Demonstrar interesse ao ouvir a leitura de poemas e a apresentação de músicas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF03', 'Demonstrar interesse ao ouvir histórias lidas ou contadas, observando ilustrações e os movimentos de leitura do adulto-leitor (modo de segurar o portador e de virar as páginas).'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF04', 'Reconhecer elementos das ilustrações de histórias, apontando-os, a pedido do adulto-leitor.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF05', 'Imitar as variações de entonação e gestos realizados pelos adultos, ao ler histórias e ao cantar.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF06', 'Comunicar-se com outras pessoas usando movimentos, gestos, balbucios, fala e outras formas de expressão.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF07', 'Conhecer e manipular materiais impressos e audiovisuais em diferentes portadores (livro, revista, gibi, jornal, cartaz, CD, tablet etc.).'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF08', 'Participar de situações de escuta de textos em diferentes gêneros textuais (poemas, fábulas, contos, receitas, quadrinhos, anúncios etc.).'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI01EF09', 'Conhecer e manipular diferentes instrumentos e suportes de escrita.'),

-- Espaços, tempos, quantidades, relações e transformações (6 habilidades)
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET01', 'Explorar e descobrir as propriedades de objetos e materiais (odor, cor, sabor, temperatura).'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET02', 'Explorar relações de causa e efeito (transbordar, tingir, misturar, mover e remover etc.) na interação com o mundo físico.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET03', 'Explorar o ambiente pela ação e observação, manipulando, experimentando e fazendo descobertas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET04', 'Manipular, experimentar, arrumar e explorar o espaço por meio de experiências de deslocamentos de si e dos objetos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET05', 'Manipular materiais diversos e variados para comparar as diferenças e semelhanças entre eles.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI01ET06', 'Vivenciar diferentes ritmos, velocidades e fluxos nas interações e brincadeiras (em danças, balanços, escorregadores etc.).'),

-- O eu, o outro e o nós (6 habilidades)
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO01', 'Perceber que suas ações têm efeitos nas outras crianças e nos adultos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO02', 'Perceber as possibilidades e os limites de seu corpo nas brincadeiras e interações das quais participa.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO03', 'Interagir com crianças da mesma faixa etária e adultos ao explorar espaços, materiais, objetos, brinquedos.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO04', 'Comunicar necessidades, desejos e emoções, utilizando gestos, balbucios, palavras.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO05', 'Reconhecer seu corpo e expressar suas sensações em momentos de alimentação, higiene, brincadeira e descanso.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'O eu, o outro e o nós', 'EI01EO06', 'Interagir com outras crianças da mesma faixa etária e adultos, adaptando-se ao convívio social.'),

-- Traços, Sons, Cores e Formas (3 habilidades)
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS01', 'Explorar sons produzidos com o próprio corpo e com objetos do ambiente.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS02', 'Traçar marcas gráficas, em diferentes suportes, usando instrumentos riscantes e tintas.'),
('infantil', 'creche', 'Bebês (zero a 1 ano e 6 meses)', 'Traços, Sons, Cores e Formas', 'EI01TS03', 'Explorar diferentes fontes sonoras e materiais para acompanhar brincadeiras cantadas, canções, músicas e melodias.');