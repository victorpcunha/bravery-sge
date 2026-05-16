-- LÍNGUA PORTUGUESA - ANOS FINAIS (EF69LP - 6º AO 9º ANO)
-- Executar APÓS bncc-portugues-6ano-7ano.sql e bncc-portugues-8ano-9ano.sql

BEGIN;
INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação e réplica. Relação entre gêneros e mídias'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação e réplica. Relação entre gêneros e mídias');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP01', 'Diferenciar liberdade de expressão de discursos de ódio, posicionando-se contrariamente.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Apreciação e réplica. Relação entre gêneros e mídias'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP02', 'Analisar e comparar peças publicitárias variadas, percebendo a articulação entre elas em campanhas.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Apreciação e réplica. Relação entre gêneros e mídias'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura: apreender os sentidos globais do texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura: apreender os sentidos globais do texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP03', 'Identificar em notícias o fato central, suas principais circunstâncias e eventuais decorrências.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de leitura: apreender os sentidos globais do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeitos de sentido'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeitos de sentido');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP04', 'Identificar e analisar os efeitos de sentido que fortalecem a persuasão nos textos publicitários.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP05', 'Inferir e justificar em textos multissemióticos o efeito de humor, ironia e/ou crítica.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP05');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação do texto com o contexto de produção e experimentação de papéis sociais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação do texto com o contexto de produção e experimentação de papéis sociais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP06', 'Produzir e publicar notícias, fotodenúncias, reportagens, infográficos, podcasts noticiosos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Relação do texto com o contexto de produção e experimentação de papéis sociais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP07', 'Produzir textos em diferentes gêneros considerando adequação ao contexto de produção e circulação.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Textualização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Revisão/edição de texto informativo e opinativo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Revisão/edição de texto informativo e opinativo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP08', 'Revisar/editar o texto produzido tendo em vista adequação ao contexto de produção.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Revisão/edição de texto informativo e opinativo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de textos de peças publicitárias de campanhas sociais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de textos de peças publicitárias de campanhas sociais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP09', 'Planejar uma campanha publicitária sobre questões significativas para a escola e/ou comunidade.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Planejamento de textos de peças publicitárias de campanhas sociais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP09');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de textos jornalísticos orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de textos jornalísticos orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP10', 'Produzir notícias para rádios, TV ou vídeos, podcasts noticiosos e de opinião.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Produção de textos jornalísticos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP11', 'Identificar e analisar posicionamentos defendidos e refutados na escuta de interações polêmicas.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Produção de textos jornalísticos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento e produção de textos jornalísticos orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento e produção de textos jornalísticos orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP12', 'Desenvolver estratégias de planejamento, elaboração e edição de textos orais.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Planejamento e produção de textos jornalísticos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Participação em discussões orais de temas controversos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Participação em discussões orais de temas controversos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP13', 'Engajar-se e contribuir com a busca de conclusões comuns relativas a problemas ou temas polêmicos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Participação em discussões orais de temas controversos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP14', 'Formular perguntas e decompor tema/questão polêmica com ajuda dos colegas e professores.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Participação em discussões orais de temas controversos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP15', 'Apresentar argumentos e contra-argumentos coerentes respeitando os turnos de fala.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Participação em discussões orais de temas controversos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP15');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção composicional'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção composicional');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP16', 'Analisar e utilizar as formas de composição dos gêneros jornalísticos da ordem do relatar.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Construção composicional'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estilo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estilo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP17', 'Perceber e analisar os recursos estilísticos e semioticias dos gêneros jornalísticos e publicitários.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP18', 'Utilizar na escrita recursos linguísticos que marquem relações de sentido entre parágrafos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeito de sentido'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeito de sentido');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP19', 'Analisar em gêneros orais que envolvam argumentação os efeitos de sentido de elementos da fala.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeito de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP19');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e circulação e adequação do texto à construção composicional e ao estilo de gênero'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e circulação e adequação do texto à construção composicional e ao estilo de gênero');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP20', 'Identificar a forma de organização dos textos normativos e legais.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e circulação e adequação do texto à construção composicional e ao estilo de gênero'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP21', 'Posicionar-se em relação a conteúdos veiculados em práticas não institucionalizadas de participação social.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP21');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização, revisão e edição'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização, revisão e edição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP22', 'Produzir, revisar e editar textos reivindicatórios ou propositivos sobre problemas da escola ou comunidade.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP23', 'Contribuir com a escrita de textos normativos quando houver demanda na escola.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP23');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Discussão oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Discussão oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP24', 'Discutir casos reais ou simulações submetidos a juízo que envolvam desrespeitos a artigos legais.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Discussão oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP25', 'Posicionar-se de forma consistente em discussão, assembleia e reuniões de colegiados.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Discussão oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Registro'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Registro');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP26', 'Tomar nota em discussões, debates, palestras como forma de documentar o evento.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Registro'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP26');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Análise de textos legais/normativos, propositivos e reivindicatórios'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Análise de textos legais/normativos, propositivos e reivindicatórios');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP27', 'Analisar a forma composicional de textos pertencentes a gêneros normativos/jurídicos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Análise de textos legais/normativos, propositivos e reivindicatórios'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP28', 'Observar os mecanismos de modalização adequados aos textos jurídicos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP28');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção dos textos e adequação do texto à construção composicional e ao estilo de gênero'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção dos textos e adequação do texto à construção composicional e ao estilo de gênero');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP29', 'Refletir sobre a relação entre contextos de produção dos gêneros de divulgação científica.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção dos textos e adequação do texto à construção composicional e ao estilo de gênero'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP29');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP30', 'Comparar conteúdos, dados e informações de diferentes fontes.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP30');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP31', 'Utilizar pistas linguísticas para compreender a hierarquização das proposições.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP31');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias e procedimentos de leitura. Relação do verbal com outras semioses. Procedimentos e gêneros de apoio à compreensão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias e procedimentos de leitura. Relação do verbal com outras semioses. Procedimentos e gêneros de apoio à compreensão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP32', 'Selecionar informações e dados relevantes de fontes diversas.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias e procedimentos de leitura. Relação do verbal com outras semioses. Procedimentos e gêneros de apoio à compreensão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias e procedimentos de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias e procedimentos de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP33', 'Articular o verbal com esquemas, infográficos, imagens na construção de sentidos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias e procedimentos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP33');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP34', 'Grifar partes essenciais do texto e produzir marginálias, sínteses e resumos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias e procedimentos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP34');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Consideração das condições de produção de textos de divulgação científica. Estratégias de escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Consideração das condições de produção de textos de divulgação científica. Estratégias de escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP35', 'Planejar textos de divulgação científica a partir de esquema e notas de leitura.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Consideração das condições de produção de textos de divulgação científica. Estratégias de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP35');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de escrita: textualização, revisão e edição'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP36', 'Produzir, revisar e editar textos de divulgação do conhecimento.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP37', 'Produzir roteiros para elaboração de vídeos de diferentes tipos para divulgação científica.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de produção'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP37');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento e produção de apresentações orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento e produção de apresentações orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP38', 'Organizar dados pesquisados em painéis ou slides de apresentação.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento e produção de apresentações orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP38');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP39', 'Definir recorte temático da entrevista, elaborar roteiro e realizar entrevista.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de produção'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP39');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção composicional. Elementos paralinguísticos e cinésicos. Apresentações orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção composicional. Elementos paralinguísticos e cinésicos. Apresentações orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP40', 'Analisar em gravações a construção composicional dos gêneros de apresentação.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção composicional. Elementos paralinguísticos e cinésicos. Apresentações orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP40');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Usar adequadamente ferramentas de apoio a apresentações orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Usar adequadamente ferramentas de apoio a apresentações orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP41', 'Usar adequadamente ferramentas de apoio a apresentações orais.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Usar adequadamente ferramentas de apoio a apresentações orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP41');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção composicional e estilo. Gêneros de divulgação científica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção composicional e estilo. Gêneros de divulgação científica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP42', 'Analisar a construção composicional dos textos de divulgação de conhecimentos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção composicional e estilo. Gêneros de divulgação científica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP42');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Marcas linguísticas. Intertextualidade'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Marcas linguísticas. Intertextualidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP43', 'Identificar e utilizar os modos de introdução de outras vozes no texto.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Marcas linguísticas. Intertextualidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP43');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção, circulação e recepção. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção, circulação e recepção. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP44', 'Inferir a presença de valores sociais, culturais e humanos em textos literários.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção, circulação e recepção. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP44');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção... Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção... Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP45', 'Posicionar-se criticamente em relação a textos como quarta-capa, programa, sinopse, resenha.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção... Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP45');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP46', 'Participar de práticas de compartilhamento de leitura de obras literárias.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção... Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP46');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução da textualidade e compreensão dos efeitos de sentidos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução da textualidade e compreensão dos efeitos de sentidos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP47', 'Analisar em textos narrativos ficcionais as diferentes formas de composição.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução da textualidade e compreensão dos efeitos de sentidos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP47');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP48', 'Interpretar em poemas efeitos produzidos por recursos expressivos sonoros e semânticos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução da textualidade e compreensão dos efeitos de sentidos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP48');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Adesão às práticas de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Adesão às práticas de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP49', 'Mostrar-se interessado e envolvido pela leitura de livros de literatura.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Adesão às práticas de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP49');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP50', 'Elaborar texto teatral a partir da adaptação de romances, contos e mitos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP50');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Consideração das condições de produção. Estratégias de produção'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Consideração das condições de produção. Estratégias de produção');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP51', 'Engajar-se nos processos de planejamento, textualização e revisão de textos literários.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Consideração das condições de produção. Estratégias de produção'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP51');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de textos orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de textos orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP52', 'Representar cenas ou textos dramáticos considerando aspectos linguísticos e paralinguísticos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Produção de textos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP52');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de textos orais. Oralização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de textos orais. Oralização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP53', 'Ler em voz alta textos literários diversos e contar/recontar histórias.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Produção de textos orais. Oralização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP53');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Recursos linguísticos e semioticias que operam nos textos literários'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Recursos linguísticos e semioticias que operam nos textos literários');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP54', 'Analisar os efeitos de sentido decorrentes da interação entre elementos linguísticos e paralinguísticos.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Recursos linguísticos e semioticias que operam nos textos literários'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP54');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP55', 'Reconhecer as variedades da língua falada, o conceito de norma-padrão e o de preconceito linguístico.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP55');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP55', 'Reconhecer as variedades da língua falada, o conceito de norma-padrão e o de preconceito linguístico.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP55');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP55', 'Reconhecer as variedades da língua falada, o conceito de norma-padrão e o de preconceito linguístico.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP55');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP55', 'Reconhecer as variedades da língua falada, o conceito de norma-padrão e o de preconceito linguístico.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP55');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP56', 'Fazer uso consciente e reflexivo de regras da norma-padrão em situações de fala e escrita.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP56');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP56', 'Fazer uso consciente e reflexivo de regras da norma-padrão em situações de fala e escrita.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP56');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP56', 'Fazer uso consciente e reflexivo de regras da norma-padrão em situações de fala e escrita.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP56');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF69LP56', 'Fazer uso consciente e reflexivo de regras da norma-padrão em situações de fala e escrita.', '["6º","7º","8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF69LP56');


COMMIT;
