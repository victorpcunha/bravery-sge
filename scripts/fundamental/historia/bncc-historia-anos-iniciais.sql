-- ============================================
-- HISTÓRIA - ANOS INICIAIS (1º AO 5º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('História', 'Mundo pessoal: meu lugar no mundo', 'anos_iniciais'),
('História', 'Mundo pessoal: eu, meu grupo social e meu tempo', 'anos_iniciais'),
('História', 'A comunidade e seus registros', 'anos_iniciais'),
('História', 'As formas de registrar as experiências da comunidade', 'anos_iniciais'),
('História', 'O trabalho e a sustentabilidade na comunidade', 'anos_iniciais'),
('História', 'As pessoas e os grupos que compõem a cidade e o município', 'anos_iniciais'),
('História', 'O lugar em que vive', 'anos_iniciais'),
('História', 'A noção de espaço público e privado', 'anos_iniciais'),
('História', 'Transformações e permanências nas trajetórias dos grupos humanos', 'anos_iniciais'),
('História', 'Circulação de pessoas, produtos e culturas', 'anos_iniciais'),
('História', 'As questões históricas relativas às migrações', 'anos_iniciais'),
('História', 'Povos e culturas: meu lugar no mundo e meu grupo social', 'anos_iniciais'),
('História', 'Registros da história: linguagens e culturas', 'anos_iniciais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As fases da vida e a ideia de temporalidade (passado, presente, futuro)' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI01', 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou de lembranças dos membros de sua família e/ou de sua comunidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND oc.objeto_conhecimento = 'As fases da vida e a ideia de temporalidade (passado, presente, futuro)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As diferentes formas de organização da família e da comunidade: os vínculos pessoais e as relações de amizade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI02', 'Identificar a relação entre as suas histórias e as histórias de sua família e de sua comunidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND oc.objeto_conhecimento = 'As diferentes formas de organização da família e da comunidade: os vínculos pessoais e as relações de amizade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI03', 'Descrever e distinguir os seus papéis e responsabilidades relacionados à família, à escola e à comunidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND oc.objeto_conhecimento = 'As diferentes formas de organização da família e da comunidade: os vínculos pessoais e as relações de amizade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A escola e a diversidade do grupo social envolvido' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI04', 'Identificar as diferenças entre os variados ambientes em que vive (doméstico, escolar e da comunidade), reconhecendo as especificidades dos hábitos e das regras que os regem.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: meu lugar no mundo' AND oc.objeto_conhecimento = 'A escola e a diversidade do grupo social envolvido';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A vida em casa, a vida na escola e formas de representação social e espacial: os jogos e brincadeiras como forma de interação social e espacial' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI05', 'Identificar semelhanças e diferenças entre jogos e brincadeiras atuais e de outras épocas e lugares.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND oc.objeto_conhecimento = 'A vida em casa, a vida na escola e formas de representação social e espacial: os jogos e brincadeiras como forma de interação social e espacial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A vida em família: diferentes configurações e vínculos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI06', 'Conhecer as histórias da família e da escola e identificar o papel desempenhado por diferentes sujeitos em diferentes espaços.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND oc.objeto_conhecimento = 'A vida em família: diferentes configurações e vínculos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI07', 'Identificar mudanças e permanências nas formas de organização familiar.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND oc.objeto_conhecimento = 'A vida em família: diferentes configurações e vínculos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A escola, sua representação espacial, sua história e seu papel na comunidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01HI08', 'Reconhecer o significado das comemorações e festas escolares, diferenciando-as das datas festivas comemoradas no âmbito familiar ou da comunidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Mundo pessoal: eu, meu grupo social e meu tempo' AND oc.objeto_conhecimento = 'A escola, sua representação espacial, sua história e seu papel na comunidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A noção do “Eu” e do “Outro”: comunidade, convivências e interações entre pessoas' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A comunidade e seus registros' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI01', 'Reconhecer espaços de sociabilidade e identificar os motivos que aproximam e separam as pessoas em diferentes grupos sociais ou de parentesco.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'A noção do “Eu” e do “Outro”: comunidade, convivências e interações entre pessoas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI02', 'Identificar e descrever práticas e papéis sociais que as pessoas exercem em diferentes comunidades.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'A noção do “Eu” e do “Outro”: comunidade, convivências e interações entre pessoas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI03', 'Selecionar situações cotidianas que remetam à percepção de mudança, pertencimento e memória.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'A noção do “Eu” e do “Outro”: comunidade, convivências e interações entre pessoas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A noção do “Eu” e do “Outro”: registros de experiências pessoais e da comunidade no tempo e no espaço' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A comunidade e seus registros' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI04', 'Selecionar e compreender o significado de objetos e documentos pessoais como fontes de memórias e histórias.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'A noção do “Eu” e do “Outro”: registros de experiências pessoais e da comunidade no tempo e no espaço';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Formas de registrar e narrar histórias (marcos de memória materiais e imateriais)' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A comunidade e seus registros' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI05', 'Selecionar objetos e documentos pessoais e de grupos próximos ao seu convívio e compreender sua função, seu uso e seu significado.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'Formas de registrar e narrar histórias (marcos de memória materiais e imateriais)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O tempo como medida' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A comunidade e seus registros' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI06', 'Identificar e organizar, temporalmente, fatos da vida cotidiana, usando noções relacionadas ao tempo (antes, durante, ao mesmo tempo e depois).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'O tempo como medida';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI07', 'Identificar e utilizar diferentes marcadores do tempo presentes na comunidade, como relógio e calendário.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A comunidade e seus registros' AND oc.objeto_conhecimento = 'O tempo como medida';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As fontes: relatos orais, objetos, imagens, músicas, escrita, tecnologias digitais e inscrições' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'As formas de registrar as experiências da comunidade' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI08', 'Compilar histórias da família e/ou da comunidade registradas em diferentes fontes.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As formas de registrar as experiências da comunidade' AND oc.objeto_conhecimento = 'As fontes: relatos orais, objetos, imagens, músicas, escrita, tecnologias digitais e inscrições';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI09', 'Identificar objetos e documentos pessoais que remetam à própria experiência no âmbito da família e/ou da comunidade.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As formas de registrar as experiências da comunidade' AND oc.objeto_conhecimento = 'As fontes: relatos orais, objetos, imagens, músicas, escrita, tecnologias digitais e inscrições';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A sobrevivência e a relação com a natureza' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O trabalho e a sustentabilidade na comunidade' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI10', 'Identificar diferentes formas de trabalho existentes na comunidade em que vive.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O trabalho e a sustentabilidade na comunidade' AND oc.objeto_conhecimento = 'A sobrevivência e a relação com a natureza';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02HI11', 'Identificar impactos no ambiente causados pelas diferentes formas de trabalho existentes na comunidade em que vive.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O trabalho e a sustentabilidade na comunidade' AND oc.objeto_conhecimento = 'A sobrevivência e a relação com a natureza';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O “Eu”, o “Outro” e os diferentes grupos sociais e étnicos que compõem a cidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI01', 'Identificar os grupos populacionais que formam a cidade, o município e a região.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND oc.objeto_conhecimento = 'O “Eu”, o “Outro” e os diferentes grupos sociais e étnicos que compõem a cidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI02', 'Selecionar e registrar acontecimentos ocorridos ao longo do tempo na cidade ou região em que vive.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND oc.objeto_conhecimento = 'O “Eu”, o “Outro” e os diferentes grupos sociais e étnicos que compõem a cidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI03', 'Identificar e comparar pontos de vista em relação a eventos significativos do local em que vive.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND oc.objeto_conhecimento = 'O “Eu”, o “Outro” e os diferentes grupos sociais e étnicos que compõem a cidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os patrimônios históricos e culturais da cidade e/ou do município em que vive' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI04', 'Identificar os patrimônios históricos e culturais de sua cidade ou região.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As pessoas e os grupos que compõem a cidade e o município' AND oc.objeto_conhecimento = 'Os patrimônios históricos e culturais da cidade e/ou do município em que vive';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A produção dos marcos da memória: os lugares de memória (ruas, praças, escolas, monumentos, museus etc.)' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O lugar em que vive' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI05', 'Identificar os marcos históricos do lugar em que vive e compreender seus significados.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O lugar em que vive' AND oc.objeto_conhecimento = 'A produção dos marcos da memória: os lugares de memória (ruas, praças, escolas, monumentos, museus etc.)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A produção dos marcos da memória: os lugares de memória' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O lugar em que vive' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI06', 'Identificar os registros de memória na cidade (nomes de ruas, monumentos, edifícios etc.).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O lugar em que vive' AND oc.objeto_conhecimento = 'A produção dos marcos da memória: os lugares de memória';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A produção dos marcos da memória: formação cultural da população' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O lugar em que vive' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI07', 'Identificar semelhanças e diferenças existentes entre comunidades de sua cidade ou região.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O lugar em que vive' AND oc.objeto_conhecimento = 'A produção dos marcos da memória: formação cultural da população';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A produção dos marcos da memória: a cidade e o campo, aproximações e diferenças' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O lugar em que vive' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI08', 'Identificar modos de vida na cidade e no campo no presente, comparando-os com os do passado.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O lugar em que vive' AND oc.objeto_conhecimento = 'A produção dos marcos da memória: a cidade e o campo, aproximações e diferenças';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A cidade, seus espaços públicos e privados e suas áreas de conservação ambiental' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A noção de espaço público e privado' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI09', 'Mapear os espaços públicos no lugar em que vive (ruas, praças, escolas, hospitais etc.) e identificar suas funções.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A noção de espaço público e privado' AND oc.objeto_conhecimento = 'A cidade, seus espaços públicos e privados e suas áreas de conservação ambiental';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI10', 'Identificar as diferenças entre o espaço doméstico, os espaços públicos e as áreas de conservação ambiental.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A noção de espaço público e privado' AND oc.objeto_conhecimento = 'A cidade, seus espaços públicos e privados e suas áreas de conservação ambiental';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A cidade e suas atividades: trabalho, cultura e lazer' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A noção de espaço público e privado' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI11', 'Identificar diferenças entre formas de trabalho realizadas na cidade e no campo.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A noção de espaço público e privado' AND oc.objeto_conhecimento = 'A cidade e suas atividades: trabalho, cultura e lazer';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03HI12', 'Comparar as relações de trabalho e lazer do presente com as de outros tempos e espaços.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A noção de espaço público e privado' AND oc.objeto_conhecimento = 'A cidade e suas atividades: trabalho, cultura e lazer';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A ação das pessoas, grupos sociais e comunidades no tempo e no espaço' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Transformações e permanências nas trajetórias dos grupos humanos' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI01', 'Reconhecer a história como resultado da ação do ser humano no tempo e no espaço.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Transformações e permanências nas trajetórias dos grupos humanos' AND oc.objeto_conhecimento = 'A ação das pessoas, grupos sociais e comunidades no tempo e no espaço';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI02', 'Identificar mudanças e permanências ao longo do tempo, discutindo os grandes marcos da história da humanidade.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Transformações e permanências nas trajetórias dos grupos humanos' AND oc.objeto_conhecimento = 'A ação das pessoas, grupos sociais e comunidades no tempo e no espaço';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O passado e o presente: a noção de permanência e as lentas transformações sociais e culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Transformações e permanências nas trajetórias dos grupos humanos' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI03', 'Identificar as transformações ocorridas na cidade ao longo do tempo e discutir suas interferências nos modos de vida de seus habitantes.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Transformações e permanências nas trajetórias dos grupos humanos' AND oc.objeto_conhecimento = 'O passado e o presente: a noção de permanência e as lentas transformações sociais e culturais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A circulação de pessoas e as transformações no meio natural' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI04', 'Identificar as relações entre os indivíduos e a natureza e discutir o significado do nomadismo e da fixação das primeiras comunidades humanas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND oc.objeto_conhecimento = 'A circulação de pessoas e as transformações no meio natural';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI05', 'Relacionar os processos de ocupação do campo a intervenções na natureza, avaliando os resultados dessas intervenções.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND oc.objeto_conhecimento = 'A circulação de pessoas e as transformações no meio natural';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A invenção do comércio e a circulação de produtos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI06', 'Identificar as transformações ocorridas nos processos de deslocamento das pessoas e mercadorias.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND oc.objeto_conhecimento = 'A invenção do comércio e a circulação de produtos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As rotas terrestres, fluviais e marítimas e seus impactos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI07', 'Identificar e descrever a importância dos caminhos terrestres, fluviais e marítimos para a dinâmica da vida comercial.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND oc.objeto_conhecimento = 'As rotas terrestres, fluviais e marítimas e seus impactos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O mundo da tecnologia: a integração de pessoas e as exclusões sociais e culturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI08', 'Identificar as transformações ocorridas nos meios de comunicação e discutir seus significados para os diferentes grupos sociais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Circulação de pessoas, produtos e culturas' AND oc.objeto_conhecimento = 'O mundo da tecnologia: a integração de pessoas e as exclusões sociais e culturais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O surgimento da espécie humana no continente africano e sua expansão pelo mundo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'As questões históricas relativas às migrações' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI09', 'Identificar as motivações dos processos migratórios em diferentes tempos e espaços.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As questões históricas relativas às migrações' AND oc.objeto_conhecimento = 'O surgimento da espécie humana no continente africano e sua expansão pelo mundo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os processos migratórios para a formação do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'As questões históricas relativas às migrações' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI10', 'Analisar diferentes fluxos populacionais e suas contribuições para a formação da sociedade brasileira.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As questões históricas relativas às migrações' AND oc.objeto_conhecimento = 'Os processos migratórios para a formação do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04HI11', 'Analisar, na sociedade em que vive, a existência ou não de mudanças associadas à migração.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'As questões históricas relativas às migrações' AND oc.objeto_conhecimento = 'Os processos migratórios para a formação do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O que forma um povo: do nomadismo aos primeiros povos sedentarizados' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI01', 'Identificar os processos de formação das culturas e dos povos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND oc.objeto_conhecimento = 'O que forma um povo: do nomadismo aos primeiros povos sedentarizados';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As formas de organização social e política: a noção de Estado' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI02', 'Identificar os mecanismos de organização do poder político com vistas à compreensão da ideia de Estado.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND oc.objeto_conhecimento = 'As formas de organização social e política: a noção de Estado';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O papel das religiões e da cultura para a formação dos povos antigos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI03', 'Analisar o papel das culturas e das religiões na composição identitária dos povos antigos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND oc.objeto_conhecimento = 'O papel das religiões e da cultura para a formação dos povos antigos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Cidadania, diversidade cultural e respeito às diferenças' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI04', 'Associar a noção de cidadania com os princípios de respeito à diversidade e aos direitos humanos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND oc.objeto_conhecimento = 'Cidadania, diversidade cultural e respeito às diferenças';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI05', 'Associar o conceito de cidadania à conquista de direitos dos povos e das sociedades.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Povos e culturas: meu lugar no mundo e meu grupo social' AND oc.objeto_conhecimento = 'Cidadania, diversidade cultural e respeito às diferenças';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As tradições orais e a valorização da memória. O surgimento da escrita e a noção de fonte.' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Registros da história: linguagens e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI06', 'Comparar o uso de diferentes linguagens e tecnologias no processo de comunicação.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Registros da história: linguagens e culturas' AND oc.objeto_conhecimento = 'As tradições orais e a valorização da memória. O surgimento da escrita e a noção de fonte.';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI07', 'Identificar os processos de produção e difusão dos marcos de memória.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Registros da história: linguagens e culturas' AND oc.objeto_conhecimento = 'As tradições orais e a valorização da memória. O surgimento da escrita e a noção de fonte.';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI08', 'Identificar formas de marcação da passagem do tempo em distintas sociedades.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Registros da história: linguagens e culturas' AND oc.objeto_conhecimento = 'As tradições orais e a valorização da memória. O surgimento da escrita e a noção de fonte.';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI09', 'Comparar pontos de vista sobre temas que impactam a vida cotidiana no tempo presente.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Registros da história: linguagens e culturas' AND oc.objeto_conhecimento = 'As tradições orais e a valorização da memória. O surgimento da escrita e a noção de fonte.';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os patrimônios materiais e imateriais da humanidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Registros da história: linguagens e culturas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05HI10', 'Inventariar os patrimônios materiais e imateriais da humanidade e analisar mudanças e permanências.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Registros da história: linguagens e culturas' AND oc.objeto_conhecimento = 'Os patrimônios materiais e imateriais da humanidade';
