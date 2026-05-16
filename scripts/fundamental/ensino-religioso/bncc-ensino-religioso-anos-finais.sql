-- ============================================
-- ENSINO RELIGIOSO - ANOS FINAIS (6º AO 9º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Ensino religioso', 'Crenças religiosas e filosofias de vida', 'anos_finais'),
('Ensino religioso', 'Manifestações religiosas', 'anos_finais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Tradição escrita: registro dos ensinamentos sagrados' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER01', 'Reconhecer o papel da tradição escrita na preservação de memórias, acontecimentos e ensinamentos religiosos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Tradição escrita: registro dos ensinamentos sagrados';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER02', 'Reconhecer e valorizar a diversidade de textos religiosos escritos (textos do Budismo, Cristianismo, Espiritismo, Hinduísmo, Islamismo, Judaísmo, entre outros).', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Tradição escrita: registro dos ensinamentos sagrados';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ensinamentos da tradição escrita' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER03', 'Reconhecer, em textos escritos, ensinamentos relacionados a modos de ser e viver.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ensinamentos da tradição escrita';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER04', 'Reconhecer que os textos escritos são utilizados pelas tradições religiosas de maneiras diversas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ensinamentos da tradição escrita';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER05', 'Discutir como o estudo e a interpretação dos textos religiosos influenciam os adeptos a vivenciarem os ensinamentos das tradições religiosas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Ensinamentos da tradição escrita';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Símbolos, ritos e mitos religiosos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER06', 'Reconhecer a importância dos mitos, ritos, símbolos e textos na estruturação das diferentes crenças, tradições e movimentos religiosos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Símbolos, ritos e mitos religiosos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06ER07', 'Exemplificar a relação entre mito, rito e símbolo nas práticas celebrativas de diferentes tradições religiosas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Símbolos, ritos e mitos religiosos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Místicas e espiritualidades' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER01', 'Reconhecer e respeitar as práticas de comunicação com as divindades em distintas manifestações e tradições religiosas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Místicas e espiritualidades';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER02', 'Identificar práticas de espiritualidade utilizadas pelas pessoas em determinadas situações (acidentes, doenças, fenômenos climáticos).', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Místicas e espiritualidades';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lideranças religiosas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Manifestações religiosas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER03', 'Reconhecer os papéis atribuídos às lideranças de diferentes tradições religiosas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Lideranças religiosas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER04', 'Exemplificar líderes religiosos que se destacaram por suas contribuições à sociedade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Lideranças religiosas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER05', 'Discutir estratégias que promovam a convivência ética e respeitosa entre as religiões.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Manifestações religiosas' AND oc.objeto_conhecimento = 'Lideranças religiosas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Princípios éticos e valores religiosos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER06', 'Identificar princípios éticos em diferentes tradições religiosas e filosofias de vida, discutindo como podem influenciar condutas pessoais e práticas sociais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Princípios éticos e valores religiosos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Liderança e direitos humanos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER07', 'Identificar e discutir o papel das lideranças religiosas e seculares na defesa e promoção dos direitos humanos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Liderança e direitos humanos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07ER08', 'Reconhecer o direito à liberdade de consciência, crença ou convicção, questionando concepções e práticas sociais que a violam.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Liderança e direitos humanos';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Crenças, convicções e atitudes' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER01', 'Discutir como as crenças e convicções podem influenciar escolhas e atitudes pessoais e coletivas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Crenças, convicções e atitudes';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER02', 'Analisar filosofias de vida, manifestações e tradições religiosas destacando seus princípios éticos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Crenças, convicções e atitudes';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Doutrinas religiosas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER03', 'Analisar doutrinas das diferentes tradições religiosas e suas concepções de mundo, vida e morte.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Doutrinas religiosas';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Crenças, filosofias de vida e esfera pública' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER04', 'Discutir como filosofias de vida, tradições e instituições religiosas podem influenciar diferentes campos da esfera pública (política, saúde, educação, economia).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Crenças, filosofias de vida e esfera pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER05', 'Debater sobre as possibilidades e os limites da interferência das tradições religiosas na esfera pública.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Crenças, filosofias de vida e esfera pública';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER06', 'Analisar práticas, projetos e políticas públicas que contribuem para a promoção da liberdade de pensamento, crenças e convicções.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Crenças, filosofias de vida e esfera pública';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Tradições religiosas, mídias e tecnologias' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08ER07', 'Analisar as formas de uso das mídias e tecnologias pelas diferentes denominações religiosas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Tradições religiosas, mídias e tecnologias';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Imanência e transcendência' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER01', 'Analisar princípios e orientações para o cuidado da vida nas diversas tradições religiosas e filosofias de vida.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Imanência e transcendência';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER02', 'Discutir as diferentes expressões de valorização e de desrespeito à vida, por meio da análise de matérias nas diferentes mídias.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Imanência e transcendência';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Vida e morte' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER03', 'Identificar sentidos do viver e do morrer em diferentes tradições religiosas, através do estudo de mitos fundantes.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Vida e morte';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER04', 'Identificar concepções de vida e morte em diferentes tradições religiosas e filosofias de vida, por meio da análise de diferentes ritos fúnehres.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Vida e morte';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER05', 'Analisar as diferentes ideias de imortalidade elaboradas pelas tradições religiosas (ancestralidade, reencarnação, transmigração e ressurreição).', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Vida e morte';


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Princípios e valores éticos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Ensino religioso' AND unidade_tematica = 'Crenças religiosas e filosofias de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER06', 'Reconhecer a coexistência como uma atitude ética de respeito à vida e à dignidade humana.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Princípios e valores éticos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER07', 'Identificar princípios éticos (familiares, religiosos e culturais) que possam alicerçar a construção de projetos de vida.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Princípios e valores éticos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09ER08', 'Construir projetos de vida assentados em princípios e valores éticos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Ensino religioso' AND ut.unidade_tematica = 'Crenças religiosas e filosofias de vida' AND oc.objeto_conhecimento = 'Princípios e valores éticos';

