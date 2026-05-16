-- LÍNGUA PORTUGUESA - ANOS INICIAIS (EF15LP - 1º AO 5º ANO)


INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler (pressuposições antecipadoras dos sentidos, da forma e da função social do texto), apoiando-se em seus conhecimentos prévios sobre as condições de produção e recepção desse texto, o gênero, o suporte e o universo temático, bem como sobre saliências textuais, recursos gráficos, imagens, dados da própria obra (índice, prefácio etc.), confirmando antecipações e inferências realizadas antes e durante a leitura de textos, checando a adequação das hipóteses realizadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler (pressuposições antecipadoras dos sentidos, da forma e da função social do texto), apoiando-se em seus conhecimentos prévios sobre as condições de produção e recepção desse texto, o gênero, o suporte e o universo temático, bem como sobre saliências textuais, recursos gráficos, imagens, dados da própria obra (índice, prefácio etc.), confirmando antecipações e inferências realizadas antes e durante a leitura de textos, checando a adequação das hipóteses realizadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler (pressuposições antecipadoras dos sentidos, da forma e da função social do texto), apoiando-se em seus conhecimentos prévios sobre as condições de produção e recepção desse texto, o gênero, o suporte e o universo temático, bem como sobre saliências textuais, recursos gráficos, imagens, dados da própria obra (índice, prefácio etc.), confirmando antecipações e inferências realizadas antes e durante a leitura de textos, checando a adequação das hipóteses realizadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Estratégia de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Estratégia de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler (pressuposições antecipadoras dos sentidos, da forma e da função social do texto), apoiando-se em seus conhecimentos prévios sobre as condições de produção e recepção desse texto, o gênero, o suporte e o universo temático, bem como sobre saliências textuais, recursos gráficos, imagens, dados da própria obra (índice, prefácio etc.), confirmando antecipações e inferências realizadas antes e durante a leitura de textos, checando a adequação das hipóteses realizadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP03', 'Localizar informações explícitas em textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP03', 'Localizar informações explícitas em textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP03', 'Localizar informações explícitas em textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP03', 'Localizar informações explícitas em textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemioticos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemioticos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemioticos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemioticos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Produção de textos (escrita compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Revisão de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Revisão de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Revisão de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Revisão de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Revisão de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Revisão de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Revisão de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Revisão de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Revisão de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Revisão de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Revisão de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Revisão de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Edição de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Edição de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto, em colaboração com os colegas e com a ajuda do professor, ilustrando, quando for o caso, em suporte adequado, manual ou digital.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Edição de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Edição de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Edição de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto, em colaboração com os colegas e com a ajuda do professor, ilustrando, quando for o caso, em suporte adequado, manual ou digital.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Edição de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Edição de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Edição de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto, em colaboração com os colegas e com a ajuda do professor, ilustrando, quando for o caso, em suporte adequado, manual ou digital.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Edição de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Edição de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Edição de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto, em colaboração com os colegas e com a ajuda do professor, ilustrando, quando for o caso, em suporte adequado, manual ou digital.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Edição de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Utilização de tecnologia digital'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Utilização de tecnologia digital');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP08', 'Utilizar software, inclusive programas de edição de texto, para editar e publicar os textos produzidos, explorando os recursos multissemioticos disponíveis.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Utilização de tecnologia digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Utilização de tecnologia digital'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Utilização de tecnologia digital');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP08', 'Utilizar software, inclusive programas de edição de texto, para editar e publicar os textos produzidos, explorando os recursos multissemioticos disponíveis.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Utilização de tecnologia digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Utilização de tecnologia digital'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Utilização de tecnologia digital');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP08', 'Utilizar software, inclusive programas de edição de texto, para editar e publicar os textos produzidos, explorando os recursos multissemioticos disponíveis.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Utilização de tecnologia digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Utilização de tecnologia digital'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Utilização de tecnologia digital');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP08', 'Utilizar software, inclusive programas de edição de texto, para editar e publicar os textos produzidos, explorando os recursos multissemioticos disponíveis.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Utilização de tecnologia digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP08');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional em sala de aula'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se em situações de intercâmbio oral com clareza, preocupando-se em ser compreendido pelo interlocutor e usando a palavra com tom de voz audível, boa articulação e ritmo adequado.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional em sala de aula'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se em situações de intercâmbio oral com clareza, preocupando-se em ser compreendido pelo interlocutor e usando a palavra com tom de voz audível, boa articulação e ritmo adequado.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional em sala de aula'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se em situações de intercâmbio oral com clareza, preocupando-se em ser compreendido pelo interlocutor e usando a palavra com tom de voz audível, boa articulação e ritmo adequado.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional em sala de aula'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se em situações de intercâmbio oral com clareza, preocupando-se em ser compreendido pelo interlocutor e usando a palavra com tom de voz audível, boa articulação e ritmo adequado.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional em sala de aula'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta atenta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta atenta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP10', 'Escutar, com atenção, falas de professores e colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escuta atenta'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta atenta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta atenta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP10', 'Escutar, com atenção, falas de professores e colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escuta atenta'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta atenta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta atenta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP10', 'Escutar, com atenção, falas de professores e colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escuta atenta'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta atenta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta atenta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP10', 'Escutar, com atenção, falas de professores e colegas, formulando perguntas pertinentes ao tema e solicitando esclarecimentos sempre que necessário.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escuta atenta'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Características da conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Características da conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea presencial, respeitando os turnos de fala, selecionando e utilizando, durante a conversação, formas de tratamento adequadas, de acordo com a situação e a posição do interlocutor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Características da conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Características da conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Características da conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea presencial, respeitando os turnos de fala, selecionando e utilizando, durante a conversação, formas de tratamento adequadas, de acordo com a situação e a posição do interlocutor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Características da conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Características da conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Características da conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea presencial, respeitando os turnos de fala, selecionando e utilizando, durante a conversação, formas de tratamento adequadas, de acordo com a situação e a posição do interlocutor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Características da conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Características da conversação espontânea'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Características da conversação espontânea');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea presencial, respeitando os turnos de fala, selecionando e utilizando, durante a conversação, formas de tratamento adequadas, de acordo com a situação e a posição do interlocutor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Características da conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos (paralinguísticos) observados na fala, como direção do olhar, riso, gestos, movimentos da cabeça (de concordância ou discordância), expressão corporal, tom de voz.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos (paralinguísticos) observados na fala, como direção do olhar, riso, gestos, movimentos da cabeça (de concordância ou discordância), expressão corporal, tom de voz.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos (paralinguísticos) observados na fala, como direção do olhar, riso, gestos, movimentos da cabeça (de concordância ou discordância), expressão corporal, tom de voz.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos (paralinguísticos) observados na fala, como direção do olhar, riso, gestos, movimentos da cabeça (de concordância ou discordância), expressão corporal, tom de voz.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos (paralinguísticos) no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relato oral/Registro formal e informal'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relato oral/Registro formal e informal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral em diferentes contextos comunicativos (solicitar informações, apresentar opiniões, informar, relatar experiências etc.).', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Relato oral/Registro formal e informal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relato oral/Registro formal e informal'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relato oral/Registro formal e informal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral em diferentes contextos comunicativos (solicitar informações, apresentar opiniões, informar, relatar experiências etc.).', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Relato oral/Registro formal e informal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relato oral/Registro formal e informal'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relato oral/Registro formal e informal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral em diferentes contextos comunicativos (solicitar informações, apresentar opiniões, informar, relatar experiências etc.).', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Relato oral/Registro formal e informal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relato oral/Registro formal e informal'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relato oral/Registro formal e informal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral em diferentes contextos comunicativos (solicitar informações, apresentar opiniões, informar, relatar experiências etc.).', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Relato oral/Registro formal e informal'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura de imagens em narrativas visuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura de imagens em narrativas visuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP14', 'Construir o sentido de histórias em quadrinhos e tirinhas, relacionando imagens e palavras e interpretando recursos gráficos (tipos de balões, de letras, onomatopeias).', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Leitura de imagens em narrativas visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação do leitor literário'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação do leitor literário');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP15', 'Reconhecer que os textos literários fazem parte do mundo do imaginário e apresentam uma dimensão lúdica, de encantamento, valorizando-os, em sua diversidade cultural, como patrimônio artístico da humanidade.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Leitura colaborativa e autônoma'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Leitura colaborativa e autônoma');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP16', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor e, mais tarde, de maneira autônoma, textos narrativos de maior porte como contos (populares, de fadas, acumulativos, de assombração etc.) e crônicas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Leitura colaborativa e autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação estética/Estilo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação estética/Estilo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP17', 'Apreciar poemas visuais e concretos, observando efeitos de sentido criados pelo formato do texto na página, distribuição e diagramação das letras, pelas ilustrações e por outros efeitos visuais.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Apreciação estética/Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação do leitor literário/Leitura multissemiótica'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação do leitor literário/Leitura multissemiótica');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP18', 'Relacionar texto com ilustrações e outros recursos gráficos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário/Leitura multissemiótica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Contagem de histórias'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Contagem de histórias');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP19', 'Recontar oralmente, com e sem apoio de imagem, textos literários lidos pelo professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Contagem de histórias'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP19');
