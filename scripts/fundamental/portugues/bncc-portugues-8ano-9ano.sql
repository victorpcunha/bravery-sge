-- LÍNGUA PORTUGUESA - ANOS FINAIS (8º E 9º ANO)

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
SELECT oc.id, 'EF89LP01', 'Analisar os interesses que movem o campo jornalístico e os efeitos das novas tecnologias no campo.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP01', 'Identificar e comparar as várias editorias de jornais impressos e digitais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP01', 'Analisar o fenômeno da disseminação de notícias falsas nas redes sociais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP02', 'Analisar diferentes práticas (curtir, compartilhar, comentar) e textos da cultura digital.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos. Caracterização do campo jornalístico e relação entre os gêneros em circulação, mídias e práticas da cultura digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura: apreender os sentidos globais do texto. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura: apreender os sentidos globais do texto. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP03', 'Analisar textos de opinião e posicionar-se de forma crítica.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de leitura: apreender os sentidos globais do texto. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP02', 'Justificar diferenças no tratamento dado a uma mesma informação veiculada em textos diferentes.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP02', 'Analisar e comentar a cobertura da imprensa sobre fatos de relevância social.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP04', 'Identificar e avaliar teses/opiniões e argumentos em textos argumentativos.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de leitura: apreender os sentidos globais do texto. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeitos de sentido'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeitos de sentido');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP05', 'Analisar o efeito de sentido produzido pelo uso de formas de apropriação textual.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP06', 'Analisar o uso de recursos persuasivos em textos argumentativos.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Efeitos de sentido. Exploração da multissemiose'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Efeitos de sentido. Exploração da multissemiose');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP07', 'Analisar os efeitos de sentido devidos ao tratamento e composição dos elementos nas imagens em movimento.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Efeitos de sentido. Exploração da multissemiose'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP07');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de produção: planejamento de textos informativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de produção: planejamento de textos informativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP08', 'Planejar reportagem impressa e em outras mídias.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de produção: planejamento de textos informativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de produção: textualização de textos informativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de produção: textualização de textos informativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP09', 'Produzir reportagem impressa com título, linha fina e organização composicional.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de produção: textualização de textos informativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de produção: planejamento de textos argumentativos e apreciativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de produção: planejamento de textos argumentativos e apreciativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP10', 'Planejar artigos de opinião tendo em vista as condições de produção.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégia de produção: planejamento de textos argumentativos e apreciativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização de textos argumentativos e apreciativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização de textos argumentativos e apreciativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP03', 'Produzir artigos de opinião defendendo ponto de vista com argumentos e contra-argumentos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Textualização de textos argumentativos e apreciativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP03', 'Produzir artigos de opinião assumindo posição diante de tema polêmico.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Textualização de textos argumentativos e apreciativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento, textualização, revisão e edição de textos publicitários'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento, textualização, revisão e edição de textos publicitários');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP11', 'Produzir, revisar e editar peças e campanhas publicitárias.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento, textualização, revisão e edição de textos publicitários'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP11');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento e participação em debates regrados'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento e participação em debates regrados');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP12', 'Planejar coletivamente a realização de um debate sobre tema previamente definido.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento e participação em debates regrados'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de produção: planejamento, realização e edição de entrevistas orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de produção: planejamento, realização e edição de entrevistas orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP13', 'Planejar entrevistas orais com pessoas ligadas ao fato noticiado.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estratégias de produção: planejamento, realização e edição de entrevistas orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP13');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Jornalístico-Midiático'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Jornalístico-Midiático');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Argumentação: movimentos argumentativos, tipos de argumento e força argumentativa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Argumentação: movimentos argumentativos, tipos de argumento e força argumentativa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP14', 'Analisar os movimentos argumentativos de sustentação, refutação e negociação.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Argumentação: movimentos argumentativos, tipos de argumento e força argumentativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estilo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estilo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP15', 'Utilizar operadores argumentativos que marcam a defesa de ideia nos debates.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP16', 'Analisar a modalização realizada em textos noticiosos e argumentativos.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP16');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução do contexto de produção, circulação e recepção de textos legais e normativos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos legais e normativos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP17', 'Relacionar textos e documentos legais e normativos de importância universal a seus contextos de produção.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Reconstrução do contexto de produção, circulação e recepção de textos legais e normativos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP18', 'Explorar instâncias e canais de participação disponíveis na escola, comunidade e país.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Contexto de produção, circulação e recepção de textos e práticas relacionadas à defesa de direitos e à participação social'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP19', 'Analisar a forma de organização das cartas abertas, abaixo-assinados e petições on-line.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Relação entre contexto de produção e características composicionais e estilísticas dos gêneros. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias e procedimentos de leitura em textos reivindicatórios ou propositivos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias e procedimentos de leitura em textos reivindicatórios ou propositivos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP20', 'Comparar propostas políticas e de solução de problemas.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Estratégias e procedimentos de leitura em textos reivindicatórios ou propositivos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP20');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP21', 'Realizar enquetes e pesquisas de opinião para levantar prioridades e problemas.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de produção: planejamento de textos reivindicatórios ou propositivos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP21');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta. Apreender o sentido geral dos textos. Apreciação e réplica. Produção/Proposta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta. Apreender o sentido geral dos textos. Apreciação e réplica. Produção/Proposta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP22', 'Compreender e comparar diferentes posições e interesses em uma discussão.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Escuta. Apreender o sentido geral dos textos. Apreciação e réplica. Produção/Proposta'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP22');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo de Atuação na Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo de Atuação na Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Movimentos argumentativos e força dos argumentos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Movimentos argumentativos e força dos argumentos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP23', 'Analisar os movimentos argumentativos utilizados em textos reivindicatórios.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Movimentos argumentativos e força dos argumentos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP23');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Curadoria de informação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Curadoria de informação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP24', 'Realizar pesquisa estabelecendo recorte das questões usando fontes confiáveis.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Curadoria de informação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP24');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de escrita: textualização, revisão e edição'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP25', 'Divulgar resultado de pesquisas por meio de apresentações orais, verbetes, vlogs.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP26', 'Produzir resenhas a partir de notas com manejo adequado das vozes envolvidas.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégias de escrita: textualização, revisão e edição'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP26');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP27', 'Tecer considerações e formular problematizações pertinentes em situações de aula.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Procedimentos de apoio à compreensão. Tomada de nota'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Procedimentos de apoio à compreensão. Tomada de nota');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP28', 'Tomar nota de videoaulas, aulas digitais, apresentações multimídias.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Procedimentos de apoio à compreensão. Tomada de nota'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP28');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo das Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização. Progressão temática'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização. Progressão temática');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP29', 'Utilizar e perceber mecanismos de progressão temática e retomadas anafóricas.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Textualização. Progressão temática'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP29');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textualização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textualização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP30', 'Analisar a estrutura de hipertexto e hiperlinks em textos de divulgação científica.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Textualização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP30');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP31', 'Analisar e utilizar modalização epistêmica em textos.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP31');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP32', 'Analisar os efeitos de sentido decorrentes do uso de mecanismos de intertextualidade.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP32');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégias de leitura. Apreciação e réplica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégias de leitura. Apreciação e réplica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP33', 'Ler de forma autônoma romances, contos, crônicas, poemas e outros gêneros.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégias de leitura. Apreciação e réplica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP33');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução da textualidade e compreensão dos efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução da textualidade e compreensão dos efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP34', 'Analisar a organização de texto dramático apresentado em teatro, televisão, cinema.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução da textualidade e compreensão dos efeitos de sentidos provocados pelos usos de recursos linguísticos e multissemióticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP34');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção da textualidade'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção da textualidade');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP35', 'Criar contos, crônicas, minicontos, narrativas de aventura e ficção científica.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção da textualidade'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP35');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relação entre textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relação entre textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP36', 'Parodiar poemas conhecidos e criar textos em versos explorando recursos sonoros e visuais.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Relação entre textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP36');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP04', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: ortografia, regências, concordância.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP04', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: ortografia, regências, concordância.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP04', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: ortografia, regências, concordância.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP04');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica', 'anos_finais', 'Campo Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica' AND etapa_ensino = 'anos_finais' AND COALESCE(campo_atuacao, '') = 'Campo Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Fono-ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Fono-ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP04', 'Utilizar ao produzir texto conhecimentos linguísticos e gramaticais: ortografia, regências, concordância.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP04', 'Escrever textos corretamente de acordo com a norma-padrão com estruturas sintáticas complexas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP04', 'Escrever textos corretamente de acordo com a norma-padrão com estruturas sintáticas complexas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP04', 'Escrever textos corretamente de acordo com a norma-padrão com estruturas sintáticas complexas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP04', 'Escrever textos corretamente de acordo com a norma-padrão com estruturas sintáticas complexas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Fono-ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP05', 'Analisar processos de formação de palavras por composição.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP05', 'Analisar processos de formação de palavras por composição.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP05', 'Analisar processos de formação de palavras por composição.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Léxico/morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Léxico/morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP05', 'Analisar processos de formação de palavras por composição.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Léxico/morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP06', 'Identificar os termos constitutivos da oração (sujeito, verbo, complementos).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP06', 'Identificar os termos constitutivos da oração (sujeito, verbo, complementos).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP06', 'Identificar os termos constitutivos da oração (sujeito, verbo, complementos).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP06', 'Identificar os termos constitutivos da oração (sujeito, verbo, complementos).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP05', 'Identificar orações com estrutura sujeito-verbo de ligação-predicativo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP05', 'Identificar orações com estrutura sujeito-verbo de ligação-predicativo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP05', 'Identificar orações com estrutura sujeito-verbo de ligação-predicativo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP05', 'Identificar orações com estrutura sujeito-verbo de ligação-predicativo.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP07', 'Diferenciar complementos diretos e indiretos de verbos transitivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP07', 'Diferenciar complementos diretos e indiretos de verbos transitivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP07', 'Diferenciar complementos diretos e indiretos de verbos transitivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP07', 'Diferenciar complementos diretos e indiretos de verbos transitivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP06', 'Diferenciar o efeito de sentido do uso dos verbos de ligação ser, estar, ficar, parecer, permanecer.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP06', 'Diferenciar o efeito de sentido do uso dos verbos de ligação ser, estar, ficar, parecer, permanecer.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP06', 'Diferenciar o efeito de sentido do uso dos verbos de ligação ser, estar, ficar, parecer, permanecer.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP06', 'Diferenciar o efeito de sentido do uso dos verbos de ligação ser, estar, ficar, parecer, permanecer.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP08', 'Identificar verbos na voz ativa e passiva interpretando os efeitos de sentido.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP08', 'Identificar verbos na voz ativa e passiva interpretando os efeitos de sentido.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP08', 'Identificar verbos na voz ativa e passiva interpretando os efeitos de sentido.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP08', 'Identificar verbos na voz ativa e passiva interpretando os efeitos de sentido.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP07', 'Comparar o uso de regência verbal e regência nominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP07', 'Comparar o uso de regência verbal e regência nominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP07', 'Comparar o uso de regência verbal e regência nominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP07', 'Comparar o uso de regência verbal e regência nominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP09', 'Interpretar efeitos de sentido de modificadores (adjuntos adnominais) em substantivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP09', 'Interpretar efeitos de sentido de modificadores (adjuntos adnominais) em substantivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP09', 'Interpretar efeitos de sentido de modificadores (adjuntos adnominais) em substantivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP09', 'Interpretar efeitos de sentido de modificadores (adjuntos adnominais) em substantivos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP10', 'Interpretar efeitos de sentido de modificadores do verbo (adjuntos adverbiais).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP10', 'Interpretar efeitos de sentido de modificadores do verbo (adjuntos adverbiais).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP10', 'Interpretar efeitos de sentido de modificadores do verbo (adjuntos adverbiais).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP10', 'Interpretar efeitos de sentido de modificadores do verbo (adjuntos adverbiais).', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP11', 'Identificar agrupamento de orações em períodos diferenciando coordenação de subordinação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP11', 'Identificar agrupamento de orações em períodos diferenciando coordenação de subordinação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP11', 'Identificar agrupamento de orações em períodos diferenciando coordenação de subordinação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP11', 'Identificar agrupamento de orações em períodos diferenciando coordenação de subordinação.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP12', 'Identificar orações subordinadas com conjunções de uso frequente.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP12', 'Identificar orações subordinadas com conjunções de uso frequente.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP12', 'Identificar orações subordinadas com conjunções de uso frequente.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP12', 'Identificar orações subordinadas com conjunções de uso frequente.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP08', 'Identificar a relação que conjunções coordenativas e subordinativas estabelecem entre orações.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP08', 'Identificar a relação que conjunções coordenativas e subordinativas estabelecem entre orações.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP08', 'Identificar a relação que conjunções coordenativas e subordinativas estabelecem entre orações.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP08', 'Identificar a relação que conjunções coordenativas e subordinativas estabelecem entre orações.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP13', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP13', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP13', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP13', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP09', 'Identificar efeitos de sentido do uso de orações adjetivas restritivas e explicativas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP09', 'Identificar efeitos de sentido do uso de orações adjetivas restritivas e explicativas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP09', 'Identificar efeitos de sentido do uso de orações adjetivas restritivas e explicativas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Elementos notacionais da escrita/morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP09', 'Identificar efeitos de sentido do uso de orações adjetivas restritivas e explicativas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Elementos notacionais da escrita/morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP14', 'Utilizar ao produzir texto recursos de coesão sequencial e referencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Semântica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP14', 'Utilizar ao produzir texto recursos de coesão sequencial e referencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Semântica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP14', 'Utilizar ao produzir texto recursos de coesão sequencial e referencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Semântica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Semântica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Semântica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP14', 'Utilizar ao produzir texto recursos de coesão sequencial e referencial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Semântica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP15', 'Estabelecer relações entre partes do texto identificando o antecedente de pronome relativo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP15', 'Estabelecer relações entre partes do texto identificando o antecedente de pronome relativo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP15', 'Estabelecer relações entre partes do texto identificando o antecedente de pronome relativo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP15', 'Estabelecer relações entre partes do texto identificando o antecedente de pronome relativo.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP10', 'Comparar as regras de colocação pronominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP10', 'Comparar as regras de colocação pronominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP10', 'Comparar as regras de colocação pronominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP10', 'Comparar as regras de colocação pronominal na norma-padrão com o português coloquial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP11', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP11', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP11', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP11', 'Inferir efeitos de sentido decorrentes do uso de recursos de coesão sequencial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP16', 'Explicar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP16', 'Explicar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP16', 'Explicar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Modalização'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Modalização');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08LP16', 'Explicar os efeitos de sentido do uso de estratégias de modalização e argumentatividade.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Modalização'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF08LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP37', 'Analisar os efeitos de sentido do uso de figuras de linguagem como ironia e eufemismo.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP37', 'Analisar os efeitos de sentido do uso de figuras de linguagem como ironia e eufemismo.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP37', 'Analisar os efeitos de sentido do uso de figuras de linguagem como ironia e eufemismo.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Figuras de linguagem'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Figuras de linguagem');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89LP37', 'Analisar os efeitos de sentido do uso de figuras de linguagem como ironia e eufemismo.', '["8º","9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Figuras de linguagem'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF89LP37');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP12', 'Identificar estrangeirismos caracterizando-os segundo a conservação de sua forma gráfica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Jornalístico-Midiático'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP12', 'Identificar estrangeirismos caracterizando-os segundo a conservação de sua forma gráfica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo de Atuação na Vida Pública'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP12', 'Identificar estrangeirismos caracterizando-os segundo a conservação de sua forma gráfica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo das Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09LP12', 'Identificar estrangeirismos caracterizando-os segundo a conservação de sua forma gráfica.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica' AND ut.etapa_ensino = 'anos_finais' AND COALESCE(ut.campo_atuacao, '') = 'Campo Artístico-Literário'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF09LP12');


COMMIT;
