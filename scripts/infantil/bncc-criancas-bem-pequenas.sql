-- Script para limpar e inserir BNCC Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)

-- 1. Deletar registros existentes para Crianças bem pequenas
DELETE FROM bncc_objetivos
WHERE tipo_ensino = 'infantil'
AND faixa_etaria = 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)';

-- 2. Inserir as 32 habilidades corretas para Crianças bem pequenas
INSERT INTO bncc_objetivos (tipo_ensino, etapa, faixa_etaria, campo_experiencia, codigo_bncc, descricao) VALUES
-- Corpo, Gestos e Movimento (5 habilidades)
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI02CG01', 'Apropriar-se de gestos e movimentos de sua cultura no cuidado de si e nos jogos e brincadeiras.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI02CG02', 'Deslocar seu corpo no espaço, orientando-se por noções como em frente, atrás, no alto, embaixo, dentro, fora etc., ao se envolver em brincadeiras e atividades de diferentes naturezas.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI02CG03', 'Explorar formas de deslocamento no espaço (pular, saltar, dançar), combinando movimentos e seguindo orientações.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI02CG04', 'Demonstrar progressiva independência no cuidado do seu corpo.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI02CG05', 'Desenvolver progressivamente as habilidades manuais, adquirindo controle para desenhar, pintar, rasgar, folhear, entre outros.'),

-- Escuta, Fala, Pensamento e Imaginação (9 habilidades)
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF01', 'Dialogar com crianças e adultos, expressando seus desejos, necessidades, sentimentos e opiniões.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF02', 'Identificar e criar diferentes sons e reconhecer rimas e aliterações em cantigas de roda e textos poéticos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF03', 'Demonstrar interesse e atenção ao ouvir a leitura de histórias e outros textos, diferenciando escrita de ilustrações, e acompanhando, com orientação do adulto-leitor, a direção da leitura (de cima para baixo, da esquerda para a direita).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF04', 'Formular e responder perguntas sobre fatos da história narrada, identificando cenários, personagens e principais acontecimentos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF05', 'Relatar experiências e fatos acontecidos, histórias ouvidas, filmes ou peças teatrais assistidos etc.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF06', 'Criar e contar histórias oralmente, com base em imagens ou temas sugeridos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF07', 'Manusear diferentes portadores textuais, demonstrando reconhecer seus usos sociais.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF08', 'Manipular textos e participar de situações de escuta para ampliar seu contato com diferentes gêneros textuais (parlendas, histórias de aventura, tirinhas, cartazes de sala, cardápios, notícias etc.).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI02EF09', 'Manusear diferentes instrumentos e suportes de escrita para desenhar, traçar letras e outros sinais gráficos.'),

-- Espaços, tempos, quantidades, relações e transformações (8 habilidades)
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET01', 'Explorar e descrever semelhanças e diferenças entre as características e propriedades dos objetos (textura, massa, tamanho).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET02', 'Observar, relatar e descrever incidentes do cotidiano e fenômenos naturais (luz solar, vento, chuva etc.).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET03', 'Compartilhar, com outras crianças, situações de cuidado de plantas e animais nos espaços da instituição e fora dela.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET04', 'Identificar relações espaciais (dentro e fora, em cima, embaixo, acima, abaixo, entre e do lado) e temporais (antes, durante e depois).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET05', 'Classificar objetos, considerando determinado atributo (tamanho, peso, cor, forma etc.).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET06', 'Utilizar conceitos básicos de tempo (agora, antes, durante, depois, ontem, hoje, amanhã, lento, rápido, depressa, devagar).'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET07', 'Contar oralmente objetos, pessoas, livros etc., em contextos diversos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI02ET08', 'Registrar com números a quantidade de crianças (meninas e meninos, presentes e ausentes) e a quantidade de objetos da mesma natureza (bonecas, bolas, livros etc.).'),

-- O eu, o outro e o nós (7 habilidades)
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO01', 'Demonstrar atitudes de cuidado e solidariedade na interação com crianças e adultos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO02', 'Demonstrar imagem positiva de si e confiança em sua capacidade para enfrentar dificuldades e desafios.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO03', 'Compartilhar os objetos e os espaços com crianças da mesma faixa etária e adultos.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO04', 'Comunicar-se com os colegas e os adultos, buscando compreendê-los e fazendo-se compreender.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO05', 'Perceber que as pessoas têm características físicas diferentes, respeitando essas diferenças.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO06', 'Respeitar regras básicas de convívio social nas interações e brincadeiras.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'O eu, o outro e o nós', 'EI02EO07', 'Resolver conflitos nas interações e brincadeiras, com a orientação de um adulto.'),

-- Traços, Sons, Cores e Formas (3 habilidades)
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI02TS01', 'Criar sons com materiais, objetos e instrumentos musicais, para acompanhar diversos ritmos de música.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI02TS02', 'Utilizar materiais variados com possibilidades de manipulação (argila, massa de modelar), explorando cores, texturas, superfícies, planos, formas e volumes ao criar objetos tridimensionais.'),
('infantil', 'creche', 'Crianças bem pequenas (1 ano e 7 meses a 3 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI02TS03', 'Utilizar diferentes fontes sonoras disponíveis no ambiente em brincadeiras cantadas, canções, músicas e melodias.');