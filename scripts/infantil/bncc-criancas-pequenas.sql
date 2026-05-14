-- Script para limpar e inserir BNCC Crianças pequenas (4 anos a 5 anos e 11 meses) - Pré-escola

-- 1. Deletar registros existentes para Crianças pequenas
DELETE FROM bncc_objetivos
WHERE tipo_ensino = 'infantil'
AND faixa_etaria = 'Crianças pequenas (4 anos a 5 anos e 11 meses)';

-- 2. Inserir as 32 habilidades corretas para Crianças pequenas
INSERT INTO bncc_objetivos (tipo_ensino, etapa, faixa_etaria, campo_experiencia, codigo_bncc, descricao) VALUES
-- Corpo, Gestos e Movimento (5 habilidades)
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI03CG01', 'Criar com o corpo formas diversificadas de expressão de sentimentos, sensações e emoções, tanto nas situações do cotidiano quanto em brincadeiras, dança, teatro, música.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI03CG02', 'Demonstrar controle e adequação do uso de seu corpo em brincadeiras e jogos, escuta e reconto de histórias, atividades artísticas, entre outras possibilidades.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI03CG03', 'Criar movimentos, gestos, olhares e mímicas em brincadeiras, jogos e atividades artísticas como dança, teatro e música.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI03CG04', 'Adotar hábitos de autocuidado relacionados a higiene, alimentação, conforto e aparência.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Corpo, Gestos e Movimento', 'EI03CG05', 'Coordenar suas habilidades manuais no atendimento adequado a seus interesses e necessidades em situações diversas.'),

-- Escuta, Fala, Pensamento e Imaginação (9 habilidades)
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF01', 'Expressar ideias, desejos e sentimentos sobre suas vivências, por meio da linguagem oral e escrita (escrita espontânea), de fotos, desenhos e outras formas de expressão.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF02', 'Inventar brincadeiras cantadas, poemas e canções, criando rimas, aliterações e ritmos.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF03', 'Escolher e folhear livros, procurando orientar-se por temas e ilustrações e tentando identificar palavras conhecidas.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF04', 'Recontar histórias ouvidas e planejar coletivamente roteiros de vídeos e de encenações, definindo os contextos, os personagens, a estrutura da história.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF05', 'Recontar histórias ouvidas para produção de reconto escrito, tendo o professor como escriba.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF06', 'Produzir suas próprias histórias orais e escritas (escrita espontânea), em situações com função social significativa.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF07', 'Levantar hipóteses sobre gêneros textuais veiculados em portadores conhecidos, recorrendo a estratégias de observação gráfica e/ou de leitura.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF08', 'Selecionar livros e textos de gêneros conhecidos para a leitura de um adulto e/ou para sua própria leitura (partindo de seu repertório sobre esses textos, como a recuperação pela memória, pela leitura das ilustrações etc.).'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Escuta, Fala, Pensamento e Imaginação', 'EI03EF09', 'Levantar hipóteses em relação à linguagem escrita, realizando registros de palavras e textos, por meio de escrita espontânea.'),

-- Espaços, tempos, quantidades, relações e transformações (7 habilidades)
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET01', 'Estabelecer relações de comparação entre objetos, observando suas propriedades.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET02', 'Observar e descrever mudanças em diferentes materiais, resultantes de ações sobre eles, em experimentos envolvendo fenômenos naturais e artificiais.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET03', 'Identificar e selecionar fontes de informações, para responder a questões sobre a natureza, seus fenômenos, sua conservação.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET04', 'Registrar observações, manipulações e medidas, usando múltiplas linguagens (desenho, registro por números ou escrita espontânea), em diferentes suportes.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET05', 'Classificar objetos e figuras de acordo com suas semelhanças e diferenças.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET06', 'Relatar fatos importantes sobre seu nascimento e desenvolvimento, a história dos seus familiares e da sua comunidade.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET07', 'Relacionar números às suas respectivas quantidades e identificar o antes, o depois e o entre em uma sequência.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Espaços, tempos, quantidades, relações e transformações', 'EI03ET08', 'Expressar medidas (peso, altura etc.), construindo gráficos básicos.'),

-- O eu, o outro e o nós (7 habilidades)
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO01', 'Demonstrar empatia pelos outros, percebendo que as pessoas têm diferentes sentimentos, necessidades e maneiras de pensar e agir.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO02', 'Agir de maneira independente, com confiança em suas capacidades, reconhecendo suas conquistas e limitações.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO03', 'Ampliar as relações interpessoais, desenvolvendo atitudes de participação e cooperação.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO04', 'Comunicar suas ideias e sentimentos a pessoas e grupos diversos.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO05', 'Demonstrar valorização das características de seu corpo e respeitar as características dos outros (crianças e adultos) com os quais convive.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO06', 'Manifestar interesse e respeito por diferentes culturas e modos de vida.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'O eu, o outro e o nós', 'EI03EO07', 'Usar estratégias pautadas no respeito mútuo para lidar com conflitos nas interações com crianças e adultos.'),

-- Traços, Sons, Cores e Formas (3 habilidades)
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI03TS01', 'Utilizar sons produzidos por materiais, objetos e instrumentos musicais durante brincadeiras de faz de conta, encenações, criações musicais, festas.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI03TS02', 'Expressar-se livremente por meio de desenho, pintura, colagem, dobradura e escultura, criando produções bidimensionais e tridimensionais.'),
('infantil', 'pre-escola', 'Crianças pequenas (4 anos a 5 anos e 11 meses)', 'Traços, Sons, Cores e Formas', 'EI03TS03', 'Reconhecer as qualidades do som (intensidade, duração, altura e timbre), utilizando-as em suas produções sonoras e ao ouvir músicas e sons.');