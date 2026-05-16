-- ============================================
-- ENSINO RELIGIOSO - ANOS INICIAIS (1º AO 5º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Ensino religioso', 'Identidades e alteridades', 'anos_iniciais'),
('Ensino religioso', 'Manifestações religiosas', 'anos_iniciais'),
('Ensino religioso', 'Crenças religiosas e filosofias de vida', 'anos_iniciais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O eu, o outro e o nós' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER01', 'Identificar e acolher as semelhanças e diferenças entre o eu, o outro e o nós.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'O eu, o outro e o nós';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER02', 'Reconhecer que o seu nome e o das demais pessoas os identificam e os diferenciam.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'O eu, o outro e o nós';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Imanência e transcendência' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER03', 'Reconhecer e respeitar as características físicas e subjetivas de cada um.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Imanência e transcendência';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER04', 'Valorizar a diversidade de formas de vida.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Imanência e transcendência';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Sentimentos, lembranças, memórias e saberes' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER05', 'Identificar e acolher sentimentos, lembranças, memórias e saberes de cada um.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Sentimentos, lembranças, memórias e saberes';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01ER06', 'Identificar as diferentes formas pelas quais as pessoas manifestam sentimentos, ideias, memórias, gostos e crenças em diferentes espaços.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Sentimentos, lembranças, memórias e saberes';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O eu, a família e o ambiente de convivência' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER01', 'Reconhecer os diferentes espaços de convivência.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'O eu, a família e o ambiente de convivência';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER02', 'Identificar costumes, crenças e formas diversas de viver em variados ambientes de convivência.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'O eu, a família e o ambiente de convivência';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Memórias e símbolos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER03', 'Identificar as diferentes formas de registro das memórias pessoais, familiares e escolares (fotos, músicas, narrativas, álbuns...).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Memórias e símbolos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER04', 'Identificar os símbolos presentes nos variados espaços de convivência.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Memórias e símbolos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Símbolos religiosos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER05', 'Identificar, distinguir e respeitar símbolos religiosos de distintas manifestações, tradições e instituições religiosas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Símbolos religiosos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Alimentos sagrados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER06', 'Exemplificar alimentos considerados sagrados por diferentes culturas, tradições e expressões religiosas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Alimentos sagrados';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02ER07', 'Identificar significados atribuídos a alimentos em diferentes manifestações e tradições religiosas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Alimentos sagrados';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Espaços e territórios religiosos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Identidades e alteridades' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER01', 'Identificar e respeitar os diferentes espaços e territórios religiosos de diferentes tradições e movimentos religiosos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Espaços e territórios religiosos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER02', 'Caracterizar os espaços e territórios religiosos como locais de realização das práticas celebrativas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Identidades e alteridades' AND oc.objeto_conhecimento = 'Espaços e territórios religiosos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Práticas celebrativas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER03', 'Identificar e respeitar práticas celebrativas (cerimônias, orações, festividades, peregrinações, entre outras) de diferentes tradições religiosas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Práticas celebrativas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER04', 'Caracterizar as práticas celebrativas como parte integrante do conjunto das manifestações religiosas de diferentes culturas e sociedades.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Práticas celebrativas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Indumentárias religiosas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER05', 'Reconhecer as indumentárias (roupas, acessórios, símbolos, pinturas corporais) utilizadas em diferentes manifestações e tradições religiosas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Indumentárias religiosas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03ER06', 'Caracterizar as indumentárias como elementos integrantes das identidades religiosas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Indumentárias religiosas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ritos religiosos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER01', 'Identificar ritos presentes no cotidiano pessoal, familiar, escolar e comunitário.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Ritos religiosos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER02', 'Identificar ritos e suas funções em diferentes manifestações e tradições religiosas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Ritos religiosos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER03', 'Caracterizar ritos de iniciação e de passagem em diversos grupos religiosos (nascimento, casamento e morte).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Ritos religiosos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER04', 'Identificar as diversas formas de expressão da espiritualidade (orações, cultos, gestos, cantos, dança, meditação) nas diferentes tradições religiosas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Ritos religiosos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Representações religiosas na arte' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER05', 'Identificar representações religiosas em diferentes expressões artísticas (pinturas, arquitetura, esculturas, ícones, símbolos, imagens), reconhecendo-as como parte da identidade de diferentes culturas e tradições religiosas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Representações religiosas na arte';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ideia(s) de divindade(s)' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER06', 'Identificar nomes, significados e representações de divindades nos contextos familiar e comunitário.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ideia(s) de divindade(s)';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04ER07', 'Reconhecer e respeitar as ideias de divindades de diferentes manifestações e tradições religiosas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ideia(s) de divindade(s)';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Narrativas religiosas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER01', 'Identificar e respeitar acontecimentos sagrados de diferentes culturas e tradições religiosas como recurso para preservar a memória.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Narrativas religiosas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Mitos nas tradições religiosas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER02', 'Identificar mitos de criação em diferentes culturas e tradições religiosas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Mitos nas tradições religiosas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER03', 'Reconhecer funções e mensagens religiosas contidas nos mitos de criação (concepções de mundo, natureza, ser humano, divindades, vida e morte).', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Mitos nas tradições religiosas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ancestralidade e tradição oral' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER04', 'Reconhecer a importância da tradição oral para preservar memórias e acontecimentos religiosos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ancestralidade e tradição oral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER05', 'Identificar elementos da tradição oral nas culturas e religiosidades indígenas, afro-brasileiras, ciganas, entre outras.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ancestralidade e tradição oral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER06', 'Identificar o papel dos sábios e anciãos na comunicação e preservação da tradição oral.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ancestralidade e tradição oral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05ER07', 'Reconhecer, em textos orais, ensinamentos relacionados a modos de ser e viver.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ancestralidade e tradição oral';

