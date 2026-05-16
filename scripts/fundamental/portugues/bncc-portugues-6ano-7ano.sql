-- LÍNGUA PORTUGUESA - ANOS FINAIS (6º E 7º ANO)

BEGIN;
INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP01', 'Reconhecer a impossibilidade de uma neutralidade absoluta no relato de fatos e identificar diferentes graus de parcialidade/imparcialidade.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP01', 'Distinguir diferentes propostas editoriais – sensacionalismo, jornalismo investigativo etc.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP02', 'Estabelecer relação entre os diferentes gêneros jornalísticos, compreendendo a centralidade da notícia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP01', 'Analisar a estrutura e funcionamento dos hiperlinks em textos noticiosos publicados na Web.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP02', 'Explorar o espaço reservado ao leitor nos jornais, revistas, impressos e on-line.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP03', 'Comparar informações sobre um mesmo fato divulgadas em diferentes veículos e mídias.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura. Distinção de fato e opinião'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura. Distinção de fato e opinião');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP04', 'Distinguir, em segmentos descontínuos de textos, fato da opinião enunciada.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de leitura. Distinção de fato e opinião'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura: identificação de teses e argumentos. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura: identificação de teses e argumentos. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP05', 'Identificar e avaliar teses/opiniões/posicionamentos explícitos e argumentos em textos argumentativos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de leitura: identificação de teses e argumentos. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeitos de sentido'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeitos de sentido');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP06', 'Identificar os efeitos de sentido provocados pela seleção lexical, topicalização de elementos e seleção e hierarquização de informações.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP07', 'Identificar o uso de recursos persuasivos em textos argumentativos diversos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeitos de sentido. Exploração da multissemiose'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeitos de sentido. Exploração da multissemiose');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP08', 'Identificar os efeitos de sentido devidos à escolha de imagens estáticas, sequenciação ou sobreposição de imagens.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido. Exploração da multissemiose'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP08');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento de textos informativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento de textos informativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP09', 'Planejar notícia impressa e para circulação em outras mídias.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento de textos informativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização, tendo em vista suas condições de produção, as características do gênero, o estabelecimento de coesão, adequação à norma-padrão e o uso adequado de ferramentas de edição'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização, tendo em vista suas condições de produção, as características do gênero, o estabelecimento de coesão, adequação à norma-padrão e o uso adequado de ferramentas de edição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP10', 'Produzir notícia impressa tendo em vista características do gênero.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Textualização, tendo em vista suas condições de produção, as características do gênero, o estabelecimento de coesão, adequação à norma-padrão e o uso adequado de ferramentas de edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento de textos argumentativos e apreciativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento de textos argumentativos e apreciativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP11', 'Planejar resenhas, vlogs, vídeos e podcasts variados.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento de textos argumentativos e apreciativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização de textos argumentativos e apreciativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização de textos argumentativos e apreciativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP12', 'Produzir resenhas críticas, vlogs, vídeos, podcasts variados.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Textualização de textos argumentativos e apreciativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção e edição de textos publicitários'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção e edição de textos publicitários');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP13', 'Produzir, revisar e editar textos publicitários.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Produção e edição de textos publicitários'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP13');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento e produção de entrevistas orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento e produção de entrevistas orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP14', 'Definir o contexto de produção da entrevista, levantar informações sobre o entrevistado e sobre o tema.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Planejamento e produção de entrevistas orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP14');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias e procedimentos de leitura em textos legais e normativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias e procedimentos de leitura em textos legais e normativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP15', 'Identificar a proibição imposta ou o direito garantido em artigos relativos a normas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Estratégias e procedimentos de leitura em textos legais e normativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP16', 'Explorar e analisar espaços de reclamação de direitos e de envio de solicitações.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP17', 'Analisar a forma de organização das cartas de solicitação e de reclamação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias, procedimentos de leitura em textos reivindicatórios ou propositivos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias, procedimentos de leitura em textos reivindicatórios ou propositivos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP18', 'Identificar o objeto da reclamação e/ou da solicitação e sua sustentação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Estratégias, procedimentos de leitura em textos reivindicatórios ou propositivos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP18');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP19', 'Realizar levantamento de questões que requeiram denúncia de desrespeito a direitos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP19');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Curadoria de informação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Curadoria de informação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP20', 'Realizar pesquisa, a partir de recortes e questões definidos previamente.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Curadoria de informação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP20');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de escrita: textualização, revisão e edição'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP21', 'Divulgar resultados de pesquisas por meio de apresentações orais, painéis, artigos de divulgação científica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP22', 'Produzir resumos, a partir das notas e/ou esquemas feitos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP22');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP23', 'Respeitar os turnos de fala na participação em conversações e discussões.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Procedimentos de apoio à compreensão. Tomada de nota'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Procedimentos de apoio à compreensão. Tomada de nota');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP24', 'Tomar nota de aulas, apresentações orais, entrevistas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Procedimentos de apoio à compreensão. Tomada de nota'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP24');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização. Progressão temática'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização. Progressão temática');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP25', 'Reconhecer e utilizar os critérios de organização tópica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Textualização. Progressão temática'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP26', 'Reconhecer a estrutura de hipertexto em textos de divulgação científica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Textualização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP26');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP27', 'Analisar referências explícitas ou implícitas a outros textos entre os textos literários.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de leitura. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de leitura. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP28', 'Ler, de forma autônoma, e compreender romances infantojuvenis, contos populares, lendas, crônicas, poemas etc.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégias de leitura. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução da textualidade. Efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução da textualidade. Efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP29', 'Identificar, em texto dramático, personagem, ato, cena, fala e indicações cênicas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução da textualidade. Efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP29');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção da textualidade. Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção da textualidade. Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP30', 'Criar narrativas ficcionais, tais como contos populares, contos de suspense, crônicas, histórias em quadrinhos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção da textualidade. Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP30');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP31', 'Criar poemas compostos por versos livres e de forma fixa, utilizando recursos visuais, semânticos e sonoros.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção da textualidade. Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP31');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP32', 'Escrever palavras com correção ortográfica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP32');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP32', 'Escrever palavras com correção ortográfica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP32', 'Escrever palavras com correção ortográfica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP32');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP32', 'Escrever palavras com correção ortográfica.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP33', 'Pontuar textos adequadamente.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP33', 'Pontuar textos adequadamente.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP33', 'Pontuar textos adequadamente.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP33', 'Pontuar textos adequadamente.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP03', 'Analisar diferenças de sentido entre palavras de uma série sinonímica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP03', 'Analisar diferenças de sentido entre palavras de uma série sinonímica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP03', 'Analisar diferenças de sentido entre palavras de uma série sinonímica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP03', 'Analisar diferenças de sentido entre palavras de uma série sinonímica.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP03', 'Formar, com base em palavras primitivas, palavras derivadas com prefixos e sufixos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP03', 'Formar, com base em palavras primitivas, palavras derivadas com prefixos e sufixos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP03', 'Formar, com base em palavras primitivas, palavras derivadas com prefixos e sufixos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP03', 'Formar, com base em palavras primitivas, palavras derivadas com prefixos e sufixos.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP34', 'Formar antônimos com acréscimo de prefixos que expressam noção de negação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP34');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP34', 'Formar antônimos com acréscimo de prefixos que expressam noção de negação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP34');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP34', 'Formar antônimos com acréscimo de prefixos que expressam noção de negação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP34');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP34', 'Formar antônimos com acréscimo de prefixos que expressam noção de negação.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP34');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP35', 'Distinguir palavras derivadas por acréscimo de afixos e palavras compostas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP35');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP35', 'Distinguir palavras derivadas por acréscimo de afixos e palavras compostas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP35');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP35', 'Distinguir palavras derivadas por acréscimo de afixos e palavras compostas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP35');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP35', 'Distinguir palavras derivadas por acréscimo de afixos e palavras compostas.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP35');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP04', 'Analisar a função e as flexões de substantivos, adjetivos e verbos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP04', 'Analisar a função e as flexões de substantivos, adjetivos e verbos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP04', 'Analisar a função e as flexões de substantivos, adjetivos e verbos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP04', 'Analisar a função e as flexões de substantivos, adjetivos e verbos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP04', 'Reconhecer o verbo como o núcleo das orações.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP04', 'Reconhecer o verbo como o núcleo das orações.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP04', 'Reconhecer o verbo como o núcleo das orações.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP04', 'Reconhecer o verbo como o núcleo das orações.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP05', 'Identificar os efeitos de sentido dos modos verbais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP05', 'Identificar os efeitos de sentido dos modos verbais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP05', 'Identificar os efeitos de sentido dos modos verbais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP05', 'Identificar os efeitos de sentido dos modos verbais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP05', 'Identificar verbos de predicação completa e incompleta.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP05', 'Identificar verbos de predicação completa e incompleta.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP05', 'Identificar verbos de predicação completa e incompleta.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP05', 'Identificar verbos de predicação completa e incompleta.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP06', 'Empregar as regras de concordância nominal e verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP06', 'Empregar as regras de concordância nominal e verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP06', 'Empregar as regras de concordância nominal e verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP06', 'Empregar as regras de concordância nominal e verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP06', 'Empregar as regras básicas de concordância nominal e verbal.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP06', 'Empregar as regras básicas de concordância nominal e verbal.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP06', 'Empregar as regras básicas de concordância nominal e verbal.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP06', 'Empregar as regras básicas de concordância nominal e verbal.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP07', 'Identificar a estrutura básica da oração: sujeito, predicado, complemento.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP07', 'Identificar a estrutura básica da oração: sujeito, predicado, complemento.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP07', 'Identificar a estrutura básica da oração: sujeito, predicado, complemento.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP07', 'Identificar a estrutura básica da oração: sujeito, predicado, complemento.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP08', 'Identificar adjetivos que ampliam o sentido do substantivo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP08', 'Identificar adjetivos que ampliam o sentido do substantivo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP08', 'Identificar adjetivos que ampliam o sentido do substantivo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP08', 'Identificar adjetivos que ampliam o sentido do substantivo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP09', 'Identificar advérbios e locuções adverbiais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP09', 'Identificar advérbios e locuções adverbiais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP09', 'Identificar advérbios e locuções adverbiais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP09', 'Identificar advérbios e locuções adverbiais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP07', 'Identificar períodos compostos por coordenação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP07', 'Identificar períodos compostos por coordenação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP07', 'Identificar períodos compostos por coordenação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP07', 'Identificar períodos compostos por coordenação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP08', 'Identificar orações como unidades constituídas em torno de um núcleo verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP08', 'Identificar orações como unidades constituídas em torno de um núcleo verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP08', 'Identificar orações como unidades constituídas em torno de um núcleo verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP08', 'Identificar orações como unidades constituídas em torno de um núcleo verbal.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP10', 'Utilizar conhecimentos linguísticos e gramaticais ao produzir texto.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP10', 'Utilizar conhecimentos linguísticos e gramaticais ao produzir texto.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP10', 'Utilizar conhecimentos linguísticos e gramaticais ao produzir texto.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP10', 'Utilizar conhecimentos linguísticos e gramaticais ao produzir texto.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP09', 'Classificar os períodos simples e compostos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP09', 'Classificar os períodos simples e compostos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP09', 'Classificar os períodos simples e compostos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP09', 'Classificar os períodos simples e compostos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP11', 'Identificar períodos compostos nos quais duas orações são conectadas por vírgula ou conjunções.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP11', 'Identificar períodos compostos nos quais duas orações são conectadas por vírgula ou conjunções.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP11', 'Identificar períodos compostos nos quais duas orações são conectadas por vírgula ou conjunções.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP11', 'Identificar períodos compostos nos quais duas orações são conectadas por vírgula ou conjunções.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP10', 'Identificar sintagmas nominais e verbais como constituintes imediatos da oração.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Sintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP10', 'Identificar sintagmas nominais e verbais como constituintes imediatos da oração.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Sintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP10', 'Identificar sintagmas nominais e verbais como constituintes imediatos da oração.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Sintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP10', 'Identificar sintagmas nominais e verbais como constituintes imediatos da oração.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Sintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP11', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: tempos verbais, concordância, ortografia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP11', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: tempos verbais, concordância, ortografia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP11', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: tempos verbais, concordância, ortografia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP11', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: tempos verbais, concordância, ortografia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica. Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica. Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP12', 'Utilizar ao produzir texto recursos de coesão referencial (nome e pronomes), sinonímia, antonímia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica. Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica. Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP12', 'Utilizar ao produzir texto recursos de coesão referencial (nome e pronomes), sinonímia, antonímia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica. Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica. Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP12', 'Utilizar ao produzir texto recursos de coesão referencial (nome e pronomes), sinonímia, antonímia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica. Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica. Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06LP12', 'Utilizar ao produzir texto recursos de coesão referencial (nome e pronomes), sinonímia, antonímia.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF06LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP12', 'Reconhecer recursos de coesão referencial: substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP12', 'Reconhecer recursos de coesão referencial: substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP12', 'Reconhecer recursos de coesão referencial: substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP12', 'Reconhecer recursos de coesão referencial: substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Semântica. Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP36', 'Utilizar ao produzir texto recursos de coesão referencial (léxica e pronominal) e sequencial.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP36', 'Utilizar ao produzir texto recursos de coesão referencial (léxica e pronominal) e sequencial.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP36', 'Utilizar ao produzir texto recursos de coesão referencial (léxica e pronominal) e sequencial.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP36', 'Utilizar ao produzir texto recursos de coesão referencial (léxica e pronominal) e sequencial.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP36');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP13', 'Estabelecer relações entre partes do texto identificando substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP13', 'Estabelecer relações entre partes do texto identificando substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP13', 'Estabelecer relações entre partes do texto identificando substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP13', 'Estabelecer relações entre partes do texto identificando substituições lexicais ou pronominais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências textuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências textuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP37', 'Analisar os efeitos de sentido decorrentes do uso de recursos linguístico-discursivos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Sequências textuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências textuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências textuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP37', 'Analisar os efeitos de sentido decorrentes do uso de recursos linguístico-discursivos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Sequências textuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências textuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências textuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP37', 'Analisar os efeitos de sentido decorrentes do uso de recursos linguístico-discursivos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Sequências textuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sequências textuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sequências textuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP37', 'Analisar os efeitos de sentido decorrentes do uso de recursos linguístico-discursivos.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Sequências textuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP14', 'Identificar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP14', 'Identificar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP14', 'Identificar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07LP14', 'Identificar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF07LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP38', 'Analisar os efeitos de sentido do uso de figuras de linguagem.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP38');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP38', 'Analisar os efeitos de sentido do uso de figuras de linguagem.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP38');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP38', 'Analisar os efeitos de sentido do uso de figuras de linguagem.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP38');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67LP38', 'Analisar os efeitos de sentido do uso de figuras de linguagem.', '["6º","7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF67LP38');


COMMIT;
