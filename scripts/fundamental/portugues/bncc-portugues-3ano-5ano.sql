-- LÍNGUA PORTUGUESA - ANOS INICIAIS (3º AO 5º ANO)


INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha e compartilhando com os colegas sua opinião, após a leitura.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha e compartilhando com os colegas sua opinião, após a leitura.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha e compartilhando com os colegas sua opinião, após a leitura.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha e compartilhando com os colegas sua opinião, após a leitura.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP03', 'Identificar a ideia central do texto, demonstrando compreensão global.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP03', 'Identificar a ideia central do texto, demonstrando compreensão global.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP03', 'Identificar a ideia central do texto, demonstrando compreensão global.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP03', 'Identificar a ideia central do texto, demonstrando compreensão global.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Compreensão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP04', 'Inferir informações implícitas nos textos lidos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP04', 'Inferir informações implícitas nos textos lidos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP04', 'Inferir informações implícitas nos textos lidos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP04', 'Inferir informações implícitas nos textos lidos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP05', 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP05', 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP05', 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP05', 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação (ponto final, ponto de exclamação, ponto de interrogação, vírgulas em enumerações) e pontuação do discurso direto, quando for o caso.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP07');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação (ponto final, ponto de exclamação, ponto de interrogação, vírgulas em enumerações) e pontuação do discurso direto, quando for o caso.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP07');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação (ponto final, ponto de exclamação, ponto de interrogação, vírgulas em enumerações) e pontuação do discurso direto, quando for o caso.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP07');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação (ponto final, ponto de exclamação, ponto de interrogação, vírgulas em enumerações) e pontuação do discurso direto, quando for o caso.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação (por substituição lexical ou por pronomes pessoais, possessivos e demonstrativos), vocabulário apropriado ao gênero, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível suficiente de informatividade.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação (por substituição lexical ou por pronomes pessoais, possessivos e demonstrativos), vocabulário apropriado ao gênero, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível suficiente de informatividade.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação (por substituição lexical ou por pronomes pessoais, possessivos e demonstrativos), vocabulário apropriado ao gênero, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível suficiente de informatividade.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação (por substituição lexical ou por pronomes pessoais, possessivos e demonstrativos), vocabulário apropriado ao gênero, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível suficiente de informatividade.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto/Progressão temática e paragrafação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto/Progressão temática e paragrafação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto/Progressão temática e paragrafação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto/Progressão temática e paragrafação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP09');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral, utilizados em diferentes situações e contextos comunicativos, e suas características linguístico-expressivas e composicionais (conversação espontânea, conversação telefônica, entrevistas pessoais, entrevistas no rádio ou na TV, debate, noticiário de rádio e TV, narração de jogos esportivos no rádio e TV, aula, debate etc.).', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral, utilizados em diferentes situações e contextos comunicativos, e suas características linguístico-expressivas e composicionais (conversação espontânea, conversação telefônica, entrevistas pessoais, entrevistas no rádio ou na TV, debate, noticiário de rádio e TV, narração de jogos esportivos no rádio e TV, aula, debate etc.).', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral, utilizados em diferentes situações e contextos comunicativos, e suas características linguístico-expressivas e composicionais (conversação espontânea, conversação telefônica, entrevistas pessoais, entrevistas no rádio ou na TV, debate, noticiário de rádio e TV, narração de jogos esportivos no rádio e TV, aula, debate etc.).', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral, utilizados em diferentes situações e contextos comunicativos, e suas características linguístico-expressivas e composicionais (conversação espontânea, conversação telefônica, entrevistas pessoais, entrevistas no rádio ou na TV, debate, noticiário de rádio e TV, narração de jogos esportivos no rádio e TV, aula, debate etc.).', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, identificando características regionais, urbanas e rurais da fala e respeitando as diversas variedades linguísticas como características do uso da língua por diferentes grupos regionais ou diferentes culturas locais, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, identificando características regionais, urbanas e rurais da fala e respeitando as diversas variedades linguísticas como características do uso da língua por diferentes grupos regionais ou diferentes culturas locais, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, identificando características regionais, urbanas e rurais da fala e respeitando as diversas variedades linguísticas como características do uso da língua por diferentes grupos regionais ou diferentes culturas locais, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Variação linguística'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Variação linguística');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, identificando características regionais, urbanas e rurais da fala e respeitando as diversas variedades linguísticas como características do uso da língua por diferentes grupos regionais ou diferentes culturas locais, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Variação linguística'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP11');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Ortografização)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras, especialmente no caso de palavras com relações irregulares fonema-grafema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP12');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Ortografização)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras, especialmente no caso de palavras com relações irregulares fonema-grafema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP12');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Ortografização)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras, especialmente no caso de palavras com relações irregulares fonema-grafema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP12');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Ortografização)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras, especialmente no caso de palavras com relações irregulares fonema-grafema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss; o (e não u) e e (e não i) em sílaba átona em final de palavra – e com marcas de nasalidade (til, m, n).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss; o (e não u) e e (e não i) em sílaba átona em final de palavra – e com marcas de nasalidade (til, m, n).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss; o (e não u) e e (e não i) em sílaba átona em final de palavra – e com marcas de nasalidade (til, m, n).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss; o (e não u) e e (e não i) em sílaba átona em final de palavra – e com marcas de nasalidade (til, m, n).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares diretas e contextuais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares diretas e contextuais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares diretas e contextuais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares diretas e contextuais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas e palavras de uso frequente com correspondências irregulares.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas e palavras de uso frequente com correspondências irregulares.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas e palavras de uso frequente com correspondências irregulares.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas e palavras de uso frequente com correspondências irregulares.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever, corretamente, palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral (ai, ei, ou).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever, corretamente, palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral (ai, ei, ou).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever, corretamente, palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral (ai, ei, ou).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever, corretamente, palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral (ai, ei, ou).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP03', 'Ler e escrever corretamente palavras com os dígrafos lh, nh, ch.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP03', 'Ler e escrever corretamente palavras com os dígrafos lh, nh, ch.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP03', 'Ler e escrever corretamente palavras com os dígrafos lh, nh, ch.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP03', 'Ler e escrever corretamente palavras com os dígrafos lh, nh, ch.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares e com h inicial que não representa fonema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares e com h inicial que não representa fonema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares e com h inicial que não representa fonema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares e com h inicial que não representa fonema.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados, reconhecendo o significado mais plausível para o contexto que deu origem à consulta.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados, reconhecendo o significado mais plausível para o contexto que deu origem à consulta.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados, reconhecendo o significado mais plausível para o contexto que deu origem à consulta.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados, reconhecendo o significado mais plausível para o contexto que deu origem à consulta.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso), comparando o significado de determinados termos utilizados nas áreas científicas com esses mesmos termos utilizados na linguagem usual.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso), comparando o significado de determinados termos utilizados nas áreas científicas com esses mesmos termos utilizados na linguagem usual.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso), comparando o significado de determinados termos utilizados nas áreas científicas com esses mesmos termos utilizados na linguagem usual.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso), comparando o significado de determinados termos utilizados nas áreas científicas com esses mesmos termos utilizados na linguagem usual.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico (agudo ou circunflexo) em monossílabos tônicos terminados em a, e, o e em palavras oxítonas terminadas em a, e, o, seguidas ou não de s.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico (agudo ou circunflexo) em monossílabos tônicos terminados em a, e, o e em palavras oxítonas terminadas em a, e, o, seguidas ou não de s.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico (agudo ou circunflexo) em monossílabos tônicos terminados em a, e, o e em palavras oxítonas terminadas em a, e, o, seguidas ou não de s.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico (agudo ou circunflexo) em monossílabos tônicos terminados em a, e, o e em palavras oxítonas terminadas em a, e, o, seguidas ou não de s.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras, classificando-as em monossílabas, dissílabas, trissílabas e polissílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras, classificando-as em monossílabas, dissílabas, trissílabas e polissílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras, classificando-as em monossílabas, dissílabas, trissílabas e polissílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras, classificando-as em monossílabas, dissílabas, trissílabas e polissílabas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras, classificando-as em oxítonas, paroxítonas e proparoxítonas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras, classificando-as em oxítonas, paroxítonas e proparoxítonas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras, classificando-as em oxítonas, paroxítonas e proparoxítonas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras, classificando-as em oxítonas, paroxítonas e proparoxítonas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, ponto de interrogação, ponto de exclamação e, em diálogos (discurso direto), dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, ponto de interrogação, ponto de exclamação e, em diálogos (discurso direto), dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, ponto de interrogação, ponto de exclamação e, em diálogos (discurso direto), dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, ponto de interrogação, ponto de exclamação e, em diálogos (discurso direto), dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura de textos, vírgula, ponto e vírgula, dois-pontos e reconhecer, na leitura de textos, o efeito de sentido que decorre do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura de textos, vírgula, ponto e vírgula, dois-pontos e reconhecer, na leitura de textos, o efeito de sentido que decorre do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura de textos, vírgula, ponto e vírgula, dois-pontos e reconhecer, na leitura de textos, o efeito de sentido que decorre do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura de textos, vírgula, ponto e vírgula, dois-pontos e reconhecer, na leitura de textos, o efeito de sentido que decorre do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia/Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia/Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP05', 'Identificar a expressão de presente, passado e futuro em tempos verbais do modo indicativo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia/Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia/Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP05', 'Identificar a expressão de presente, passado e futuro em tempos verbais do modo indicativo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia/Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia/Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP05', 'Identificar a expressão de presente, passado e futuro em tempos verbais do modo indicativo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia/Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia/Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP05', 'Identificar a expressão de presente, passado e futuro em tempos verbais do modo indicativo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: agente, ação, objeto da ação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: agente, ação, objeto da ação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: agente, ação, objeto da ação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar, em textos, substantivos e verbos e suas funções na oração: agente, ação, objeto da ação.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo (concordância verbal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo (concordância verbal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo (concordância verbal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo (concordância verbal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar, adequadamente, na escrita e na oralidade, os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar, adequadamente, na escrita e na oralidade, os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar, adequadamente, na escrita e na oralidade, os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar, adequadamente, na escrita e na oralidade, os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP09', 'Identificar, em textos, adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP09', 'Identificar, em textos, adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP09', 'Identificar, em textos, adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfossintaxe'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfossintaxe');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP09', 'Identificar, em textos, adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar em textos e usar na produção textual a concordância entre artigo, substantivo e adjetivo (concordância no grupo nominal).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP14', 'Identificar em textos e usar na produção textual pronomes pessoais, possessivos e demonstrativos, como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP14', 'Identificar em textos e usar na produção textual pronomes pessoais, possessivos e demonstrativos, como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP14', 'Identificar em textos e usar na produção textual pronomes pessoais, possessivos e demonstrativos, como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP14', 'Identificar em textos e usar na produção textual pronomes pessoais, possessivos e demonstrativos, como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar, em textos, o uso de conjunções e a relação que estabelecem entre partes do texto: adição, oposição, tempo, causa, condição, finalidade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar, em textos, o uso de conjunções e a relação que estabelecem entre partes do texto: adição, oposição, tempo, causa, condição, finalidade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar, em textos, o uso de conjunções e a relação que estabelecem entre partes do texto: adição, oposição, tempo, causa, condição, finalidade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar, em textos, o uso de conjunções e a relação que estabelecem entre partes do texto: adição, oposição, tempo, causa, condição, finalidade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas de substantivos, de adjetivos e de verbos, utilizando-os para compreender palavras e para formar novas palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas de substantivos, de adjetivos e de verbos, utilizando-os para compreender palavras e para formar novas palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas de substantivos, de adjetivos e de verbos, utilizando-os para compreender palavras e para formar novas palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas de substantivos, de adjetivos e de verbos, utilizando-os para compreender palavras e para formar novas palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar, corretamente, palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar (regulares morfológicas).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar, corretamente, palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar (regulares morfológicas).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar, corretamente, palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar (regulares morfológicas).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar, corretamente, palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar (regulares morfológicas).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas, e derivadas por adição de prefixo e de sufixo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas, e derivadas por adição de prefixo e de sufixo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas, e derivadas por adição de prefixo e de sufixo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas, e derivadas por adição de prefixo e de sufixo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP11', 'Ler e compreender, com autonomia, textos injuntivos instrucionais (receitas, instruções de montagem etc.), com a estrutura própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e mesclando palavras, imagens e recursos gráfico-visuais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP09', 'Ler e compreender, com autonomia, boletos, faturas e carnês, dentre outros gêneros do campo da vida cotidiana, de acordo com as convenções do gênero (campos, itens elencados, medidas de consumo, código de barras).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP09', 'Ler e compreender, com autonomia, textos instrucionais de regras de jogo, dentre outros gêneros do campo da vida cotidiana.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP12', 'Ler e compreender, com autonomia, cartas pessoais e diários, com expressão de sentimentos e opiniões, dentre outros gêneros do campo da vida cotidiana.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP10', 'Ler e compreender, com autonomia, cartas pessoais de reclamação, dentre outros gêneros do campo da vida cotidiana.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP10', 'Ler e compreender, com autonomia, anedotas, piadas e cartuns, dentre outros gêneros do campo da vida cotidiana.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita colaborativa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita colaborativa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP13', 'Planejar e produzir cartas pessoais e diários, com expressão de sentimentos e opiniões.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP11', 'Planejar e produzir, com autonomia, cartas pessoais de reclamação.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP11', 'Registrar, com autonomia, anedotas, piadas e cartuns.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP11');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Escrita (compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Escrita (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita colaborativa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita colaborativa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP14', 'Planejar e produzir textos injuntivos instrucionais, com a estrutura própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e mesclando palavras, imagens e recursos gráfico-visuais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP12', 'Planejar e produzir, com autonomia, textos instrucionais de regras de jogo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de texto oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de texto oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP15', 'Assistir, em vídeo digital, a programa de culinária infantil e, a partir dele, planejar e produzir receitas em áudio ou vídeo.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP12', 'Assistir, em vídeo digital, a programa infantil com instruções de montagem, de jogos e brincadeiras e, a partir dele, planejar e produzir tutoriais em áudio ou vídeo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP13', 'Assistir, em vídeo digital, a postagem de vlog infantil de críticas de brinquedos e livros de literatura infantil e, a partir dele, planejar e produzir resenhas digitais em áudio ou vídeo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição do texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição do texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP16', 'Identificar e reproduzir, em textos injuntivos instrucionais (receitas, instruções de montagem, digitais ou impressos), a formatação própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e a diagramação específica dos textos desses gêneros (lista de ingredientes ou materiais e instruções de execução).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP13', 'Identificar e reproduzir, em textos injuntivos instrucionais (instruções de jogos digitais ou impressos), a formatação própria desses textos e formato específico dos textos orais ou escritos desses gêneros.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP14', 'Identificar e reproduzir, em textos de resenha crítica de brinquedos ou livros de literatura infantil, a formatação própria desses textos (apresentação e avaliação do produto).', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP17', 'Identificar e reproduzir, em gêneros epistolares e diários, a formatação própria desses textos (relatos de acontecimentos, expressão de vivências, emoções, opiniões ou críticas) e a diagramação específica (data, saudação, corpo do texto, despedida, assinatura).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP18', 'Ler e compreender, com autonomia, cartas dirigidas a veículos da mídia impressa ou digital (cartas de leitor e de reclamação a jornais, revistas) e notícias.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP14', 'Identificar, em notícias, fatos, participantes, local e momento/tempo da ocorrência do fato noticiado.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP15', 'Ler/assistir e compreender, com autonomia, notícias, reportagens, vídeos em vlogs argumentativos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP19', 'Identificar e discutir o propósito do uso de recursos de persuasão (cores, imagens, escolha de palavras, jogo de palavras, tamanho de letras) em textos publicitários e de propaganda.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP15', 'Distinguir fatos de opiniões/sugestões em textos (informativos, jornalísticos, publicitários etc.).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP16', 'Comparar informações sobre um mesmo fato veiculadas em diferentes mídias e concluir sobre qual é mais confiável e por quê.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita colaborativa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita colaborativa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP20', 'Produzir cartas dirigidas a veículos da mídia impressa ou digital (cartas do leitor ou de reclamação a jornais ou revistas).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP16', 'Produzir notícias sobre fatos ocorridos no universo escolar, digitais ou impressas, para o jornal da escola.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP17', 'Produzir roteiro para edição de uma reportagem digital sobre temas de interesse da turma.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP21', 'Produzir anúncios publicitários, textos de campanhas de conscientização destinados ao público infantil, observando os recursos de persuasão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP15', 'Opinar e defender ponto de vista sobre tema polêmico relacionado a situações vivenciadas na escola e/ou na comunidade, utilizando registro formal e estrutura adequada à argumentação.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento e produção de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento e produção de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP22', 'Planejar e produzir, em colaboração com os colegas, telejornal para público infantil com algumas notícias e textos de campanhas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento e produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP17', 'Produzir jornais radiofônicos ou televisivos e entrevistas veiculadas em rádio, TV e na internet.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento e produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP18', 'Roteirizar, produzir e editar vídeo para vlogs argumentativos sobre produtos de mídia para público infantil.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento e produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP19', 'Argumentar oralmente sobre acontecimentos de interesse social, com base em conhecimentos sobre fatos divulgados em TV, rádio, mídia impressa e digital, respeitando pontos de vista diferentes.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição dos textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição dos textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP16', 'Identificar e reproduzir, em notícias, manchetes, lides e corpo de notícias simples para público infantil e cartas de reclamação (revista infantil), a formatação e diagramação específica de cada um desses gêneros.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP23', 'Analisar o uso de adjetivos em cartas dirigidas a veículos da mídia impressa ou digital.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP20', 'Analisar a validade e força de argumentos em argumentações sobre produtos de mídia para público infantil.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP18', 'Analisar o padrão entonacional e a expressão facial e corporal de âncoras de jornais radiofônicos ou televisivos e de entrevistadores/entrevistados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP21', 'Analisar o padrão entonacional, a expressão facial e corporal e as escolhas de variedade e registro linguísticos de vloggers de vlogs opinativos ou argumentativos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP24', 'Ler/ouvir e compreender, com autonomia, relatos de observações e de pesquisas em fontes de informações.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP19', 'Ler e compreender textos expositivos de divulgação científica para crianças.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP22', 'Ler e compreender verbetes de dicionário, identificando a estrutura, as informações gramaticais (significado de abreviaturas) e as informações semânticas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Imagens analíticas em textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Imagens analíticas em textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP20', 'Reconhecer a função de gráficos, diagramas e tabelas em textos, como forma de apresentação de dados e informações.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Imagens analíticas em textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP23', 'Comparar informações apresentadas em gráficos ou tabelas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Imagens analíticas em textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pesquisa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pesquisa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP17', 'Buscar e selecionar, com o apoio do professor, informações de interesse sobre fenômenos sociais e naturais, em textos que circulam em meios impressos ou digitais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP25', 'Planejar e produzir textos para apresentar resultados de observações e de pesquisas em fontes de informações, incluindo, quando pertinente, imagens, diagramas e gráficos ou tabelas simples.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP21', 'Planejar e produzir textos sobre temas de interesse, com base em resultados de observações e pesquisas em fontes de informações impressas ou eletrônicas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP24', 'Planejar e produzir texto sobre tema de interesse, organizando resultados de pesquisa em fontes de informação impressas ou digitais.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP22', 'Planejar e produzir, com certa autonomia, verbetes de enciclopédia infantil.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escrita autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP25', 'Planejar e produzir, com certa autonomia, verbetes de dicionário.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escrita autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta de textos orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta de textos orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP18', 'Escutar, com atenção, apresentações de trabalhos realizadas por colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escuta de textos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão de textos orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão de textos orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP19', 'Recuperar as ideias principais em situações formais de escuta de exposições, apresentações e palestras.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão de textos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto oral Exposição oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto oral Exposição oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP20', 'Expor trabalhos ou pesquisas escolares, em sala de aula, com apoio de recursos multissemióticos (imagens, diagrama, tabelas etc.), orientando-se por roteiro escrito, planejando o tempo de fala e adequando a linguagem à situação comunicativa.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto oral Exposição oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição dos textos Adequação do texto às normas de escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição dos textos Adequação do texto às normas de escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP26', 'Identificar e reproduzir, em relatórios de observação e pesquisa, a formatação e diagramação específica desses gêneros (passos ou listas de itens, tabelas, ilustrações, gráficos, resumo dos resultados).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP26', 'Utilizar, ao produzir o texto, conhecimentos linguísticos e gramaticais: regras sintáticas de concordância nominal e verbal, convenções de escrita de citações, pontuação (ponto final, dois-pontos, vírgulas em enumerações) e regras ortográficas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição dos textos Coesão e articuladores'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição dos textos Coesão e articuladores');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP23', 'Identificar e reproduzir, em verbetes de enciclopédia infantil, a formatação e diagramação específica desse gênero (título do verbete, definição, detalhamento, curiosidades).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos Coesão e articuladores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP27', 'Utilizar, ao produzir o texto, recursos de coesão pronominal (pronomes anafóricos) e articuladores de relações de sentido (tempo, causa, oposição, conclusão, comparação), com nível adequado de informatividade.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos Coesão e articuladores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP27');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP24', 'Identificar e reproduzir, em seu formato, tabelas, diagramas e gráficos em relatórios de observação e pesquisa, como forma de apresentação de dados e informações.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação do leitor literário'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação do leitor literário');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP21', 'Ler e compreender, de forma autônoma, textos literários de diferentes gêneros e extensões, inclusive aqueles sem ilustrações, estabelecendo preferências por gêneros, temas, autores.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação do leitor literário/Leitura multissemiótica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação do leitor literário/Leitura multissemiótica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP22', 'Perceber diálogos em textos narrativos, observando o efeito de sentido de verbos de enunciação e, se for o caso, o uso de variedades linguísticas no discurso direto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário/Leitura multissemiótica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação estética/Estilo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação estética/Estilo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP23', 'Apreciar poemas e outros textos versificados, observando rimas, aliterações e diferentes modos de divisão dos versos, estrofes e refrões e seu efeito de sentido.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Apreciação estética/Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP23');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Textos dramáticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Textos dramáticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP24', 'Identificar funções do texto dramático (escrito para ser encenado) e sua organização por meio de diálogos entre personagens e marcadores das falas das personagens e de cena.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Textos dramáticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma e compartilhada'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma e compartilhada');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP25', 'Criar narrativas ficcionais, com certa autonomia, utilizando detalhes descritivos, sequências de eventos e imagens apropriadas para sustentar o sentido do texto, e marcadores de tempo, espaço e de fala de personagens.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP26', 'Ler e compreender, com certa autonomia, narrativas ficcionais que apresentem cenários e personagens, observando os elementos da estrutura narrativa: enredo, tempo, espaço, personagens, narrador e a construção do discurso indireto e discurso direto.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP27', 'Ler e compreender, com certa autonomia, textos em versos, explorando rimas, sons e jogos de palavras, imagens poéticas (sentidos figurados) e recursos visuais e sonoros.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Declamação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Declamação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP28', 'Declamar poemas, com entonação, postura e interpretação adequadas.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Declamação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Performances orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Performances orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP27', 'Recitar cordel e cantar repentes e emboladas, observando as rimas e obedecendo ao ritmo e à melodia.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Performances orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP27');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP25', 'Representar cenas de textos dramáticos, reproduzindo as falas das personagens, de acordo com as rubricas de interpretação e movimento indicadas pelo autor.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Performances orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formas de composição de narrativas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formas de composição de narrativas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP29', 'Identificar, em narrativas, cenário, personagem central, conflito gerador, resolução e o ponto de vista com base no qual histórias são narradas, diferenciando narrativas em primeira e terceira pessoas.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formas de composição de narrativas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP29');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Discurso direto e indireto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Discurso direto e indireto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP30', 'Diferenciar discurso indireto e discurso direto, determinando o efeito de sentido de verbos de enunciação e explicando o uso de variedades linguísticas no discurso direto, quando for o caso.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Discurso direto e indireto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP30');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de textos poéticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de textos poéticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP31', 'Identificar, em textos versificados, efeitos de sentido decorrentes do uso de recursos rítmicos e sonoros e de metáforas.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos poéticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP31');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de textos poéticos visuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de textos poéticos visuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP26', 'Observar, em poemas concretos, o formato, a distribuição e a diagramação das letras do texto na página.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos poéticos visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP28', 'Observar, em ciberpoemas e minicontos infantis em mídia digital, os recursos multissemióticos presentes nesses textos digitais.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos poéticos visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de textos dramáticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de textos dramáticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP25', 'Representar cenas de textos dramáticos, reproduzindo as falas das personagens, de acordo com as rubricas de interpretação e movimento indicadas pelo autor.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos dramáticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP25');
