-- ============================================
-- ARTE - ANOS FINAIS (6º ao 9º)
-- ============================================

-- Inserir Unidades Temáticas - Anos Finais
INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Arte', 'Artes visuais', 'anos_finais'),
('Arte', 'Dança', 'anos_finais'),
('Arte', 'Música', 'anos_finais'),
('Arte', 'Teatro', 'anos_finais'),
('Arte', 'Artes integradas', 'anos_finais');

-- ============================================
-- ARTES VISUAIS - ANOS FINAIS
-- ============================================

-- Contextos e práticas (3 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR01', 'Pesquisar, apreciar e analisar formas distintas das artes visuais tradicionais e contemporâneas, em obras de artistas brasileiros e estrangeiros de diferentes épocas e em diferentes matrizes estéticas e culturais, de modo a ampliar a experiência com diferentes contextos e práticas artístico-visuais e cultivar a percepção, o imaginário, a capacidade de simbolizar e o repertório imagético.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR02', 'Pesquisar e analisar diferentes estilos visuais, contextualizando-os no tempo e no espaço.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR03', 'Analisar situações nas quais as linguagens das artes visuais se integram às linguagens audiovisuais (cinema, animações, vídeos etc.), gráficas (capas de livros, ilustrações de textos diversos etc.), cenográficas, coreográficas, musicais etc.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR04', 'Analisar os elementos constitutivos das artes visuais (ponto, linha, forma, direção, cor, tom, escala, dimensão, espaço, movimento etc.) na apreciação de diferentes produções artísticas.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Materialidades
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Materialidades' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR05', 'Experimentar e analisar diferentes formas de expressão artística (desenho, pintura, colagem, quadrinhos, dobradura, escultura, modelagem, instalação, vídeo, fotografia, performance etc.).', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Materialidades';

-- Processos de criação (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR06', 'Desenvolver processos de criação em artes visuais, com base em temas ou interesses artísticos, de modo individual, coletivo e colaborativo, fazendo uso de materiais, instrumentos e recursos convencionais, alternativos e digitais.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR07', 'Dialogar com princípios conceituais, proposições temáticas, repertórios imagéticos e processos de criação nas suas produções visuais.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Processos de criação';

-- Sistemas da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistemas da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR08', 'Diferenciar as categorias de artista, artesão, produtor cultural, curador, designer, entre outras, estabelecendo relações entre os profissionais do sistema das artes visuais.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Sistemas da linguagem';

-- ============================================
-- DANÇA - ANOS FINAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR09', 'Pesquisar e analisar diferentes formas de expressão, representação e encenação da dança, reconhecendo e apreciando composições de dança de artistas e grupos brasileiros e estrangeiros de diferentes épocas.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR10', 'Explorar elementos constitutivos do movimento cotidiano e do movimento dançado, abordando, criticamente, o desenvolvimento das formas da dança em sua história tradicional e contemporânea.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Elementos da linguagem';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR11', 'Experimentar e analisar os fatores de movimento (tempo, peso, fluência e espaço) como elementos que, combinados, geram as ações corporais e o movimento dançado.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Processos de criação (4 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR12', 'Investigar e experimentar procedimentos de improvisação e criação do movimento como fonte para a construção de vocabulários e repertórios próprios.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR13', 'Investigar brincadeiras, jogos, danças coletivas e outras práticas de dança de diferentes matrizes estéticas e culturais como referência para a criação e a composição de danças autorais, individualmente e em grupo.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR14', 'Analisar e experimentar diferentes elementos (figurino, iluminação, cenário, trilha sonora etc.) e espaços (convencionais e não convencionais) para composição cênica e apresentação coreográfica.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR15', 'Discutir as experiências pessoais e coletivas em dança vivenciadas na escola e em outros contextos, problematizando estereótipos e preconceitos.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- MÚSICA - ANOS FINAIS
-- ============================================

-- Contextos e práticas (4 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR16', 'Analisar criticamente, por meio da apreciação musical, usos e funções da música em seus contextos de produção e circulação, relacionando as práticas musicais às diferentes dimensões da vida social, cultural, política, histórica, econômica, estética e ética.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR17', 'Explorar e analisar criticamente diferentes meios e equipamentos culturais de circulação da música e do conhecimento musical.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR18', 'Reconhecer e apreciar o papel de músicos e grupos de música brasileiros e estrangeiros que contribuíram para o desenvolvimento de formas e gêneros musicais.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR19', 'Identificar e analisar diferentes estilos musicais, contextualizando-os no tempo e no espaço, de modo a aprimorar a capacidade de apreciação da estética musical.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR20', 'Explorar e analisar elementos constitutivos da música (altura, intensidade, timbre, melodia, ritmo etc.), por meio de recursos tecnológicos (games e plataformas digitais), jogos, canções e práticas diversas de composição/criação, execução e apreciação musicais.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Materialidades
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Materialidades' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR21', 'Explorar e analisar fontes e materiais sonoros em práticas de composição/criação, execução e apreciação musical, reconhecendo timbres e características de instrumentos musicais diversos.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Materialidades';

-- Notação e registro musical
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Notação e registro musical' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR22', 'Explorar e identificar diferentes formas de registro musical (notação musical tradicional, partituras criativas e procedimentos da música contemporânea), bem como procedimentos e técnicas de registro em áudio e audiovisual.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Notação e registro musical';

-- Processos de criação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR23', 'Explorar e criar improvisações, composições, arranjos, jingles, trilhas sonoras, entre outros, utilizando vozes, sons corporais e/ou instrumentos acústicos ou eletrônicos, convencionais ou não convencionais, expressando ideias musicais de maneira individual, coletiva e colaborativa.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- TEATRO - ANOS FINAIS
-- ============================================

-- Contextos e práticas (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR24', 'Reconhecer e apreciar artistas e grupos de teatro brasileiros e estrangeiros de diferentes épocas, investigando os modos de criação, produção, divulgação, circulação e organização da atuação profissional em teatro.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Contextos e práticas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR25', 'Identificar e analisar diferentes estilos cênicos, contextualizando-os no tempo e no espaço de modo a aprimorar a capacidade de apreciação da estética teatral.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR26', 'Explorar diferentes elementos envolvidos na composição dos inúmerações cênicos (figurinos, adereços, cenário, iluminação e sonoplastia) e reconhecer seus vocabulários.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Processos de criação (4 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR27', 'Pesquisar e criar formas de dramaturgias e espaços cênicos para o acontecimento teatral, em diálogo com o teatro contemporâneo.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR28', 'Investigar e experimentar diferentes funções teatrais e discutir os limites e desafios do trabalho artístico coletivo e colaborativo.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR29', 'Experimentar a gestualidade e as construções corporais e vocais de maneira imaginativa na improvisação teatral e no jogo cênico.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR30', 'Compor improvisações e inúmerações cênicas com base em textos dramáticos ou outros estímulos (música, imagens, objetos etc.), caracterizando personagens (com figurinos e adereços), cenário, iluminação e sonoplastia e considerando a relação com o espectador.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- ARTES INTEGRADAS - ANOS FINAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR31', 'Relacionar as práticas artísticas às diferentes dimensões da vida social, cultural, política, histórica, econômica, estética e ética.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Processos de criação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR32', 'Analisar e explorar, em projetos temáticos, as relações processuais entre diversas linguagens artísticas.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Processos de criação';

-- Matrizes estéticas e culturais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Matrizes estéticas e culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR33', 'Analisar aspectos históricos, sociais e políticos da produção artística, problematizando as narrativas eurocêntricas e as diversas categorizações da arte (arte, artesanato, folclore, design etc.).', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Matrizes estéticas e culturais';

-- Patrimônio cultural
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Patrimônio cultural' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR34', 'Analisar e valorizar o patrimônio cultural, material e imaterial, de culturas diversas, em especial a brasileira, incluindo suas matrizes indígenas, africanas e europeias, de diferentes épocas, e favorecendo a construção de vocabulário e repertório relativos às diferentes linguagens artísticas.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Patrimônio cultural';

-- Arte e tecnologia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Arte e tecnologia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69AR35', 'Identificar e manipular diferentes tecnologias e recursos digitais para acessar, apreciar, produzir, registrar e compartilhar práticas e repertórios artísticos, de modo reflexivo, ético e responsável.', '["6º", "7º", "8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Arte e tecnologia';