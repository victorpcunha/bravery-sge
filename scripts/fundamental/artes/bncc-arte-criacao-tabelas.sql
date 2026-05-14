-- ============================================
-- CRIAÇÃO DAS TABELAS BNCC - ARTES (ENSINO FUNDAMENTAL)
-- ============================================

-- 1. Tabela de Unidades Temáticas
CREATE TABLE IF NOT EXISTS bncc_unidades_tematicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disciplina VARCHAR(100) NOT NULL,
    unidade_tematica VARCHAR(150) NOT NULL,
    etapa_ensino VARCHAR(50) NOT NULL, -- 'anos_iniciais' ou 'anos_finais'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Objetos de Conhecimento
CREATE TABLE IF NOT EXISTS bncc_objetos_conhecimento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unidade_tematica_id UUID NOT NULL REFERENCES bncc_unidades_tematicas(id) ON DELETE CASCADE,
    objeto_conhecimento VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Habilidades (Fundamental/Médio)
CREATE TABLE IF NOT EXISTS bncc_habilidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objeto_conhecimento_id UUID NOT NULL REFERENCES bncc_objetos_conhecimento(id) ON DELETE CASCADE,
    codigo_bncc VARCHAR(30) NOT NULL,
    descricao TEXT NOT NULL,
    anos JSONB NOT NULL, -- Array de anos ex: ["1º", "2º", "3º", "4º", "5º"]
    etapa_ensino VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSERÇÃO DOS DADOS DE ARTE - ANOS INICIAIS (1º ao 5º)
-- ============================================

-- Unidades Temáticas - Anos Iniciais
INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Arte', 'Artes visuais', 'anos_iniciais'),
('Arte', 'Dança', 'anos_iniciais'),
('Arte', 'Música', 'anos_iniciais'),
('Arte', 'Teatro', 'anos_iniciais'),
('Arte', 'Artes integradas', 'anos_iniciais');

-- ============================================
-- ARTES VISUAIS - ANOS INICIAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR01', 'Identificar e apreciar formas distintas das artes visuais tradicionais e contemporâneas, cultivando a percepção, o imaginário, a capacidade de simbolizar e o repertório imagético.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR02', 'Explorar e reconhecer elementos constitutivos das artes visuais (ponto, linha, forma, cor, espaço, movimento etc.).', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Matrizes estéticas e culturais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Matrizes estéticas e culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR03', 'Reconhecer e analisar a influência de distintas matrizes estéticas e culturais das artes visuais nas manifestações artísticas das culturas locais, regionais e nacionais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Matrizes estéticas e culturais';

-- Materialidades
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Materialidades' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR04', 'Experimentar diferentes formas de expressão artística (desenho, pintura, colagem, quadrinhos, dobradura, escultura, modelagem, instalação, vídeo, fotografia etc.), fazendo uso sustentável de materiais, instrumentos, recursos e técnicas convencionais e não convencionais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Materialidades';

-- Processos de criação (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR05', 'Experimentar a criação em artes visuais de modo individual, coletivo e colaborativo, explorando diferentes espaços da escola e da comunidade.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR06', 'Dialogar sobre a sua criação e as dos colegas, para alcançar sentidos plurais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Processos de criação';

-- Sistemas da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sistemas da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes visuais' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR07', 'Reconhecer algumas categorias do sistema das artes visuais (museus, galerias, instituições, artistas, artesãos, curadores etc.).', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes visuais' AND oc.objeto_conhecimento = 'Sistemas da linguagem';

-- ============================================
-- DANÇA - ANOS INICIAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR08', 'Experimentar e apreciar formas distintas de manifestações da dança presentes em diferentes contextos, cultivando a percepção, o imaginário, a capacidade de simbolizar e o repertório corporal.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR09', 'Estabelecer relações entre as partes do corpo e destas com o todo corporal na construção do movimento dançado.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Elementos da linguagem';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR10', 'Experimentar diferentes formas de orientação no espaço (deslocamentos, planos, direções, caminhos etc.) e ritmos de movimento (lento, moderado e rápido) na construção do movimento dançado.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Processos de criação (2 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Dança' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR11', 'Criar e improvisar movimentos dançados de modo individual, coletivo e colaborativo, considerando os aspectos estruturais, dinâmicos e expressivos dos elementos constitutivos do movimento, com base nos códigos de dança.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR12', 'Discutir, com respeito e sem preconceito, as experiências pessoais e coletivas em dança vivenciadas na escola, como fonte para a construção de vocabulários e repertórios próprios.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Dança' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- MÚSICA - ANOS INICIAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR13', 'Identificar e apreciar criticamente diversas formas e gêneros de expressão musical, reconhecendo e analisando os usos e as funções da música em diversos contextos de circulação, em especial, aqueles da vida cotidiana.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR14', 'Perceber e explorar os elementos constitutivos da música (altura, intensidade, timbre, melodia, ritmo etc.), por meio de jogos, brincadeiras, canções e práticas diversas de composição/criação, execução e apreciação musical.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Materialidades
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Materialidades' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR15', 'Explorar fontes sonoras diversas, como as existentes no próprio corpo (palmas, voz, percussão corporal), na natureza e em objetos cotidianos, reconhecendo os elementos constitutivos da música e as características de instrumentos musicais variados.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Materialidades';

-- Notação e registro musical
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Notação e registro musical' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR16', 'Explorar diferentes formas de registro musical não convencional (representação gráfica de sons, partituras criativas etc.), bem como procedimentos e técnicas de registro em áudio e audiovisual, e reconhecer a notação musical convencional.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Notação e registro musical';

-- Processos de criação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Música' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR17', 'Experimentar improvisações, composições e sonorização de histórias, entre outros, utilizando vozes, sons corporais e/ou instrumentos musicais convencionais ou não convencionais, de modo individual, coletivo e colaborativo.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Música' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- TEATRO - ANOS INICIAIS
-- ============================================

-- Contextos e práticas
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Contextos e práticas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR18', 'Reconhecer e apreciar formas distintas de manifestações do teatro presentes em diferentes contextos, aprendendo a ver e a ouvir histórias dramatizadas e cultivando a percepção, o imaginário, a capacidade de simbolizar e o repertório ficcional.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Contextos e práticas';

-- Elementos da linguagem
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Elementos da linguagem' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR19', 'Descobrir teatralidades na vida cotidiana, identificando elementos teatrais (variadas entonações de voz, diferentes fisicalidades, diversidade de personagens e narrativas etc.).', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Elementos da linguagem';

-- Processos de criação (3 habilidades)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Teatro' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR20', 'Experimentar o trabalho colaborativo, coletivo e autoral em improvisações teatrais e processos narrativos criativos em teatro, explorando desde a teatralidade dos gestos e das ações do cotidiano até elementos de diferentes matrizes estéticas e culturais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR21', 'Exercitar a imitação e o faz de conta, ressignificando objetos e fatos e experimentando-se no lugar do outro, ao compor e encenar inúmerações cênicas, por meio de músicas, imagens, textos ou outros pontos de partida, de forma intencional e reflexiva.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR22', 'Experimentar possibilidades criativas de movimento e de voz na criação de um personagem teatral, discutindo estereótipos.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Teatro' AND oc.objeto_conhecimento = 'Processos de criação';

-- ============================================
-- ARTES INTEGRADAS - ANOS INICIAIS
-- ============================================

-- Processos de criação
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Processos de criação' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR23', 'Reconhecer e experimentar, em projetos temáticos, as relações processuais entre diversas linguagens artísticas.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Processos de criação';

-- Matrizes estéticas e culturais
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Matrizes estéticas e culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR24', 'Caracterizar e experimentar brinquedos, brincadeiras, jogos, danças, canções e histórias de diferentes matrizes estéticas e culturais.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Matrizes estéticas e culturais';

-- Patrimônio cultural
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Patrimônio cultural' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR25', 'Conhecer e valorizar o patrimônio cultural, material e imaterial, de culturas diversas, em especial a brasileira, incluindo-se suas matrizes indígenas, africanas e europeias, de diferentes épocas, favorecendo a construção de vocabulário e repertório relativos às diferentes linguagens artísticas.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Patrimônio cultural';

-- Arte e tecnologia
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Arte e tecnologia' FROM bncc_unidades_tematicas
WHERE disciplina = 'Arte' AND unidade_tematica = 'Artes integradas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15AR26', 'Explorar diferentes tecnologias e recursos digitais (multimeios, animações, jogos eletrônicos, gravações em áudio e vídeo, fotografia, softwares etc.) nos processos de criação artística.', '["1º", "2º", "3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.unidade_tematica = 'Artes integradas' AND oc.objeto_conhecimento = 'Arte e tecnologia';