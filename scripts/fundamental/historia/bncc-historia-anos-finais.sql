-- ============================================
-- HISTÓRIA - ANOS FINAIS (6º AO 9º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('História', 'História: tempo, espaço e formas de registros', 'anos_finais'),
('História', 'A invenção do mundo clássico e o contraponto com outras sociedades', 'anos_finais'),
('História', 'Lógicas de organização política', 'anos_finais'),
('História', 'Trabalho e formas de organização social e cultural', 'anos_finais'),
('História', 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias', 'anos_finais'),
('História', 'Humanismos, Renascimentos e o Novo Mundo', 'anos_finais'),
('História', 'A organização do poder e as dinâmicas do mundo colonial americano', 'anos_finais'),
('História', 'Lógicas comerciais e mercantis da modernidade', 'anos_finais'),
('História', 'O mundo contemporâneo: o Antigo Regime em crise', 'anos_finais'),
('História', 'Os processos de independência nas Américas', 'anos_finais'),
('História', 'O Brasil no século XIX', 'anos_finais'),
('História', 'Configurações do mundo no século XIX', 'anos_finais'),
('História', 'O nascimento da República no Brasil e os processos históricos até a metade do século XX', 'anos_finais'),
('História', 'Totalitarismos e conflitos mundiais', 'anos_finais'),
('História', 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946', 'anos_finais'),
('História', 'A história recente', 'anos_finais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A questão do tempo, sincronias e diacronias' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'História: tempo, espaço e formas de registros' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI01', 'Identificar diferentes formas de compreensão da noção de tempo e de periodização dos processos históricos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'A questão do tempo, sincronias e diacronias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Formas de registro da história e da produção do conhecimento histórico' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'História: tempo, espaço e formas de registros' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI02', 'Identificar a gênese da produção do saber histórico e analisar o significado das fontes.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'Formas de registro da história e da produção do conhecimento histórico';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As origens da humanidade, seus deslocamentos e os processos de sedentarização' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'História: tempo, espaço e formas de registros' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI03', 'Identificar as hipóteses científicas sobre o surgimento da espécie humana.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'As origens da humanidade, seus deslocamentos e os processos de sedentarização';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI04', 'Conhecer as teorias sobre a origem do homem americano.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'As origens da humanidade, seus deslocamentos e os processos de sedentarização';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI05', 'Descrever modificações da natureza e da paisagem realizadas por diferentes tipos de sociedade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'As origens da humanidade, seus deslocamentos e os processos de sedentarização';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI06', 'Identificar geograficamente as rotas de povoamento no território americano.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'História: tempo, espaço e formas de registros' AND oc.objeto_conhecimento = 'As origens da humanidade, seus deslocamentos e os processos de sedentarização';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Povos da Antiguidade na África, Oriente Médio e Américas' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A invenção do mundo clássico e o contraponto com outras sociedades' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI07', 'Identificar aspectos e formas de registro das sociedades antigas na África, Oriente Médio e Américas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A invenção do mundo clássico e o contraponto com outras sociedades' AND oc.objeto_conhecimento = 'Povos da Antiguidade na África, Oriente Médio e Américas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI08', 'Identificar os espaços territoriais ocupados e os aportes culturais dos astecas, maias e incas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A invenção do mundo clássico e o contraponto com outras sociedades' AND oc.objeto_conhecimento = 'Povos da Antiguidade na África, Oriente Médio e Américas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O Ocidente Clássico: aspectos da cultura na Grécia e em Roma' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A invenção do mundo clássico e o contraponto com outras sociedades' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI09', 'Discutir o conceito de Antiguidade Clássica, seu alcance e limite na tradição ocidental.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A invenção do mundo clássico e o contraponto com outras sociedades' AND oc.objeto_conhecimento = 'O Ocidente Clássico: aspectos da cultura na Grécia e em Roma';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As noções de cidadania e política na Grécia e em Roma' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas de organização política' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI10', 'Explicar a formação da Grécia Antiga, com ênfase na formação da pólis.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'As noções de cidadania e política na Grécia e em Roma';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI11', 'Caracterizar o processo de formação da Roma Antiga e suas configurações sociais e políticas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'As noções de cidadania e política na Grécia e em Roma';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI12', 'Associar o conceito de cidadania a dinâmicas de inclusão e exclusão na Grécia e Roma antigas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'As noções de cidadania e política na Grécia e em Roma';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Domínios e expansão das culturas grega e romana. Significados do conceito de “império”' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas de organização política' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI13', 'Conceituar “império” no mundo antigo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'Domínios e expansão das culturas grega e romana. Significados do conceito de “império”';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A passagem do mundo antigo para o mundo medieval' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas de organização política' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI14', 'Identificar e analisar diferentes formas de contato, adaptação ou exclusão entre populações.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'A passagem do mundo antigo para o mundo medieval';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O Mediterrâneo como espaço de interação entre as sociedades' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas de organização política' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI15', 'Descrever as dinâmicas de circulação de pessoas, produtos e culturas no Mediterrâneo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas de organização política' AND oc.objeto_conhecimento = 'O Mediterrâneo como espaço de interação entre as sociedades';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Senhores e servos no mundo antigo e no medieval. Escravidão e trabalho livre' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Trabalho e formas de organização social e cultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI16', 'Caracterizar e comparar as dinâmicas de abastecimento e as formas de organização do trabalho.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Trabalho e formas de organização social e cultural' AND oc.objeto_conhecimento = 'Senhores e servos no mundo antigo e no medieval. Escravidão e trabalho livre';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Senhores e servos no mundo antigo e no medieval' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Trabalho e formas de organização social e cultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI17', 'Diferenciar escravidão, servidão e trabalho livre no mundo antigo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Trabalho e formas de organização social e cultural' AND oc.objeto_conhecimento = 'Senhores e servos no mundo antigo e no medieval';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O papel da religião cristã, dos mosteiros e da cultura na Idade Média' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Trabalho e formas de organização social e cultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI18', 'Analisar o papel da religião cristã na cultura e nos modos de organização social no período medieval.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Trabalho e formas de organização social e cultural' AND oc.objeto_conhecimento = 'O papel da religião cristã, dos mosteiros e da cultura na Idade Média';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O papel da mulher na Grécia e em Roma, e no período medieval' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Trabalho e formas de organização social e cultural' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06HI19', 'Descrever e analisar os diferentes papéis sociais das mulheres no mundo antigo e nas sociedades medievais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Trabalho e formas de organização social e cultural' AND oc.objeto_conhecimento = 'O papel da mulher na Grécia e em Roma, e no período medieval';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A construção da ideia de modernidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI01', 'Explicar o significado de “modernidade” e suas lógicas de inclusão e exclusão.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias' AND oc.objeto_conhecimento = 'A construção da ideia de modernidade';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI02', 'Identificar conexões e interações entre as sociedades do Novo Mundo, Europa, África e Ásia.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias' AND oc.objeto_conhecimento = 'A construção da ideia de modernidade';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Saberes dos povos africanos e pré-colombianos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI03', 'Identificar aspectos das sociedades africanas e americanas antes da chegada dos europeus.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo moderno e a conexão entre sociedades africanas, americanas e europeias' AND oc.objeto_conhecimento = 'Saberes dos povos africanos e pré-colombianos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Humanismos: uma nova visão de ser humano e de mundo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI04', 'Identificar as principais características dos Humanismos e dos Renascimentos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND oc.objeto_conhecimento = 'Humanismos: uma nova visão de ser humano e de mundo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Reformas religiosas: a cristandade fragmentada' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI05', 'Identificar e relacionar as vinculações entre as reformas religiosas e os processos culturais e sociais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND oc.objeto_conhecimento = 'Reformas religiosas: a cristandade fragmentada';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As descobertas científicas e a expansão marítima' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI06', 'Comparar as navegações no Atlântico e no Pacífico entre os séculos XIV e XVI.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Humanismos, Renascimentos e o Novo Mundo' AND oc.objeto_conhecimento = 'As descobertas científicas e a expansão marítima';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A formação e o funcionamento das monarquias europeias' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI07', 'Descrever os processos de formação e consolidação das monarquias europeias.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A formação e o funcionamento das monarquias europeias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A conquista da América e as formas de organização política' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI08', 'Descrever as formas de organização das sociedades americanas no tempo da conquista.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A conquista da América e as formas de organização política';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI09', 'Analisar os diferentes impactos da conquista europeia da América para as populações ameríndias.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A conquista da América e as formas de organização política';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A estruturação dos vice-reinos nas Américas. Resistências indígenas' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI10', 'Analisar diferentes interpretações sobre as dinâmicas das sociedades americanas no período colonial.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A estruturação dos vice-reinos nas Américas. Resistências indígenas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI11', 'Analisar a formação histórico-geográfica do território da América portuguesa.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A estruturação dos vice-reinos nas Américas. Resistências indígenas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI12', 'Identificar a distribuição territorial da população brasileira em diferentes épocas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A organização do poder e as dinâmicas do mundo colonial americano' AND oc.objeto_conhecimento = 'A estruturação dos vice-reinos nas Américas. Resistências indígenas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As lógicas mercantis e o domínio europeu sobre os mares' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI13', 'Caracterizar a ação dos europeus e suas lógicas mercantis visando ao domínio no mundo atlântico.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND oc.objeto_conhecimento = 'As lógicas mercantis e o domínio europeu sobre os mares';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI14', 'Descrever as dinâmicas comerciais das sociedades americanas e africanas.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND oc.objeto_conhecimento = 'As lógicas mercantis e o domínio europeu sobre os mares';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As lógicas internas das sociedades africanas. A escravidão moderna' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI15', 'Discutir o conceito de escravidão moderna e suas distinções em relação ao escravismo antigo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND oc.objeto_conhecimento = 'As lógicas internas das sociedades africanas. A escravidão moderna';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI16', 'Analisar os mecanismos e as dinâmicas de comércio de escravizados em suas diferentes fases.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND oc.objeto_conhecimento = 'As lógicas internas das sociedades africanas. A escravidão moderna';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A emergência do capitalismo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07HI17', 'Discutir as razões da passagem do mercantilismo para o capitalismo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Lógicas comerciais e mercantis da modernidade' AND oc.objeto_conhecimento = 'A emergência do capitalismo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A questão do iluminismo e da ilustração' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI01', 'Identificar os principais aspectos conceituais do iluminismo e do liberalismo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND oc.objeto_conhecimento = 'A questão do iluminismo e da ilustração';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As revoluções inglesas e os princípios do liberalismo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI02', 'Identificar as particularidades político-sociais da Inglaterra do século XVII.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND oc.objeto_conhecimento = 'As revoluções inglesas e os princípios do liberalismo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Revolução Industrial e seus impactos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI03', 'Analisar os impactos da Revolução Industrial na produção e circulação de povos, produtos e culturas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND oc.objeto_conhecimento = 'Revolução Industrial e seus impactos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Revolução Francesa e seus desdobramentos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI04', 'Identificar e relacionar os processos da Revolução Francesa e seus desdobramentos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND oc.objeto_conhecimento = 'Revolução Francesa e seus desdobramentos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Rebeliões na América portuguesa: as conjurações mineira e baiana' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI05', 'Explicar os movimentos e as rebeliões da América portuguesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O mundo contemporâneo: o Antigo Regime em crise' AND oc.objeto_conhecimento = 'Rebeliões na América portuguesa: as conjurações mineira e baiana';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Independência dos Estados Unidos. Independências na América espanhola' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Os processos de independência nas Américas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI06', 'Aplicar os conceitos de Estado, nação, território, governo e país para o entendimento de conflitos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI07', 'Identificar as especificidades dos diversos processos de independência nas Américas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI08', 'Conhecer o ideário dos líderes dos movimentos independentistas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI09', 'Conhecer as características e os principais pensadores do Pan-americanismo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI10', 'Identificar a Revolução de São Domingo como desdobramento da Revolução Francesa.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI11', 'Identificar e explicar os protagonismos de diferentes grupos sociais nas lutas de independência.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Independência dos Estados Unidos. Independências na América espanhola';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os caminhos até a independência do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Os processos de independência nas Américas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI12', 'Caracterizar a organização política e social no Brasil desde 1808 até 1822.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Os caminhos até a independência do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI13', 'Analisar o processo de independência em diferentes países latino-americanos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'Os caminhos até a independência do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A tutela da população indígena, a escravidão dos negros' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Os processos de independência nas Américas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI14', 'Discutir a noção da tutela dos grupos indígenas e a participação dos negros na sociedade brasileira.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Os processos de independência nas Américas' AND oc.objeto_conhecimento = 'A tutela da população indígena, a escravidão dos negros';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Brasil: Primeiro Reinado, Período Regencial, Segundo Reinado' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O Brasil no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI15', 'Identificar e analisar o equilíbrio das forças e os sujeitos envolvidos nas disputas políticas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'Brasil: Primeiro Reinado, Período Regencial, Segundo Reinado';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI16', 'Identificar, comparar e analisar a diversidade política, social e regional nas rebeliões.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'Brasil: Primeiro Reinado, Período Regencial, Segundo Reinado';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI17', 'Relacionar as transformações territoriais com as tensões e conflitos durante o Império.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'Brasil: Primeiro Reinado, Período Regencial, Segundo Reinado';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI18', 'Identificar as questões sobre a atuação do Brasil na Guerra do Paraguai.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'Brasil: Primeiro Reinado, Período Regencial, Segundo Reinado';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O escravismo no Brasil do século XIX' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O Brasil no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI19', 'Formular questionamentos sobre o legado da escravidão nas Américas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'O escravismo no Brasil do século XIX';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI20', 'Identificar e relacionar aspectos das estruturas sociais da atualidade com os legados da escravidão.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'O escravismo no Brasil do século XIX';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Políticas de extermínio do indígena durante o Império' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O Brasil no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI21', 'Identificar e analisar as políticas oficiais com relação ao indígena durante o Império.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'Políticas de extermínio do indígena durante o Império';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A produção do imaginário nacional brasileiro' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O Brasil no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI22', 'Discutir o papel das culturas letradas e das artes na produção das identidades no Brasil do século XIX.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O Brasil no século XIX' AND oc.objeto_conhecimento = 'A produção do imaginário nacional brasileiro';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Nacionalismo, revoluções e as novas nações europeias' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Configurações do mundo no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI23', 'Estabelecer relações causais entre as ideologias raciais e o imperialismo europeu.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Configurações do mundo no século XIX' AND oc.objeto_conhecimento = 'Nacionalismo, revoluções e as novas nações europeias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Uma nova ordem econômica: capitalismo industrial' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Configurações do mundo no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI24', 'Reconhecer os principais produtos utilizados pelos europeus procedentes da África.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Configurações do mundo no século XIX' AND oc.objeto_conhecimento = 'Uma nova ordem econômica: capitalismo industrial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os EUA e a América Latina no século XIX' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Configurações do mundo no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI25', 'Caracterizar e contextualizar aspectos das relações entre os EUA e a América Latina.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Configurações do mundo no século XIX' AND oc.objeto_conhecimento = 'Os EUA e a América Latina no século XIX';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O imperialismo europeu e a partilha da África e da Ásia' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Configurações do mundo no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI26', 'Identificar e contextualizar o protagonismo das populações locais na resistência ao imperialismo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Configurações do mundo no século XIX' AND oc.objeto_conhecimento = 'O imperialismo europeu e a partilha da África e da Ásia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pensamento e cultura no século XIX: darwinismo e racismo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Configurações do mundo no século XIX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08HI27', 'Identificar as tensões e os significados dos discursos civilizatórios.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Configurações do mundo no século XIX' AND oc.objeto_conhecimento = 'Pensamento e cultura no século XIX: darwinismo e racismo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Experiências republicanas e práticas autoritárias' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI01', 'Descrever e contextualizar os principais aspectos da emergência da República no Brasil.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'Experiências republicanas e práticas autoritárias';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI02', 'Caracterizar e compreender os ciclos da história republicana até 1954.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'Experiências republicanas e práticas autoritárias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A questão da inserção dos negros no período republicano' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI03', 'Identificar os mecanismos de inserção dos negros na sociedade brasileira pós-abolição.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'A questão da inserção dos negros no período republicano';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI04', 'Discutir a importância da participação da população negra na formação do Brasil.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'A questão da inserção dos negros no período republicano';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Primeira República e suas características. Contestações' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI05', 'Identificar os processos de urbanização e modernização da sociedade brasileira.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'Primeira República e suas características. Contestações';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O período varguista e suas contradições' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI06', 'Identificar e discutir o papel do trabalhismo como força política no Brasil.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'O período varguista e suas contradições';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A questão indígena durante a República (até 1964)' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI07', 'Identificar e explicar as pautas dos povos indígenas no contexto republicano.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'A questão indígena durante a República (até 1964)';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Anarquismo e protagonismo feminino' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI08', 'Identificar as transformações no debate sobre as questões da diversidade no Brasil.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'Anarquismo e protagonismo feminino';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI09', 'Relacionar as conquistas de direitos à atuação de movimentos sociais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'O nascimento da República no Brasil e os processos históricos até a metade do século XX' AND oc.objeto_conhecimento = 'Anarquismo e protagonismo feminino';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O mundo em conflito: a Primeira Guerra Mundial' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI10', 'Identificar e relacionar as dinâmicas do capitalismo e seus conflitos mundiais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'O mundo em conflito: a Primeira Guerra Mundial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A Revolução Russa' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI11', 'Identificar as especificidades e os desdobramentos mundiais da Revolução Russa.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'A Revolução Russa';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A crise capitalista de 1929' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI12', 'Analisar a crise capitalista de 1929 e seus desdobramentos na economia global.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'A crise capitalista de 1929';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A emergência do fascismo e do nazismo. A Segunda Guerra Mundial' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI13', 'Descrever e contextualizar os processos da emergência do fascismo e do nazismo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'A emergência do fascismo e do nazismo. A Segunda Guerra Mundial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O colonialismo na África. As guerras mundiais' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI14', 'Caracterizar e discutir as dinâmicas do colonialismo no continente africano e asiático.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'O colonialismo na África. As guerras mundiais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A ONU e a questão dos Direitos Humanos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Totalitarismos e conflitos mundiais' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI15', 'Discutir as motivações que levaram à criação da ONU.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'A ONU e a questão dos Direitos Humanos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI16', 'Relacionar a Carta dos Direitos Humanos ao processo de afirmação dos direitos fundamentais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Totalitarismos e conflitos mundiais' AND oc.objeto_conhecimento = 'A ONU e a questão dos Direitos Humanos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O Brasil da era JK e o ideal de uma nação moderna' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI17', 'Identificar e analisar processos sociais do Brasil a partir de 1946.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'O Brasil da era JK e o ideal de uma nação moderna';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI18', 'Descrever e analisar as relações entre as transformações urbanas e seus impactos na cultura brasileira.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'O Brasil da era JK e o ideal de uma nação moderna';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os anos 1960: revolução cultural? A ditadura civil-militar' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI19', 'Identificar e compreender o processo que resultou na ditadura civil-militar no Brasil.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'Os anos 1960: revolução cultural? A ditadura civil-militar';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI20', 'Discutir os processos de resistência durante a ditadura civil-militar.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'Os anos 1960: revolução cultural? A ditadura civil-militar';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI21', 'Identificar as demandas indígenas e quilombolas como contestação ao modelo desenvolvimentista.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'Os anos 1960: revolução cultural? A ditadura civil-militar';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O processo de redemocratização. A Constituição de 1988' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI22', 'Discutir o papel da mobilização da sociedade brasileira do final do período ditatorial até 1988.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'O processo de redemocratização. A Constituição de 1988';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI23', 'Identificar direitos civis, políticos e sociais expressos na Constituição de 1988.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'O processo de redemocratização. A Constituição de 1988';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A história recente do Brasil: 1989 aos dias atuais' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI24', 'Analisar as transformações políticas, econômicas e sociais de 1989 aos dias atuais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'A história recente do Brasil: 1989 aos dias atuais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI25', 'Relacionar as transformações da sociedade brasileira aos protagonismos da sociedade civil após 1989.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'A história recente do Brasil: 1989 aos dias atuais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A questão da violência contra populações marginalizadas' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI26', 'Discutir e analisar as causas da violência contra populações marginalizadas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'A questão da violência contra populações marginalizadas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O Brasil e suas relações internacionais na era da globalização' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI27', 'Relacionar as mudanças no Brasil a partir da década de 1990 ao papel do País no cenário internacional.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'Modernização, ditadura civil-militar e redemocratização: o Brasil após 1946' AND oc.objeto_conhecimento = 'O Brasil e suas relações internacionais na era da globalização';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A Guerra Fria: confrontos de dois modelos políticos' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI28', 'Identificar e analisar aspectos da Guerra Fria e seus principais conflitos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'A Guerra Fria: confrontos de dois modelos políticos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As experiências ditatoriais na América Latina' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI29', 'Descrever e analisar as experiências ditatoriais na América Latina.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'As experiências ditatoriais na América Latina';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI30', 'Comparar as características dos regimes ditatoriais latino-americanos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'As experiências ditatoriais na América Latina';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os processos de descolonização na África e na Ásia' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI31', 'Descrever e avaliar os processos de descolonização na África e na Ásia.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'Os processos de descolonização na África e na Ásia';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'O fim da Guerra Fria e o processo de globalização' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI32', 'Analisar mudanças e permanências associadas ao processo de globalização.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'O fim da Guerra Fria e o processo de globalização';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI33', 'Analisar as transformações geradas pelo desenvolvimento das tecnologias digitais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'O fim da Guerra Fria e o processo de globalização';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Políticas econômicas na América Latina' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI34', 'Discutir as motivações da adoção de diferentes políticas econômicas na América Latina.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'Políticas econômicas na América Latina';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os conflitos do século XXI e a questão do terrorismo' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI35', 'Analisar os aspectos relacionados ao fenômeno do terrorismo na contemporaneidade.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'Os conflitos do século XXI e a questão do terrorismo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Pluralidades e diversidades identitárias na atualidade' FROM bncc_unidades_tematicas
WHERE disciplina = 'História' AND unidade_tematica = 'A história recente' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09HI36', 'Identificar e discutir as diversidades identitárias no início do século XXI.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'História' AND ut.unidade_tematica = 'A história recente' AND oc.objeto_conhecimento = 'Pluralidades e diversidades identitárias na atualidade';
