-- LÍNGUA PORTUGUESA - ANOS INICIAIS (1º AO 2º ANO)

CREATE TABLE IF NOT EXISTS bncc_campos_atuacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  etapa_ensino TEXT NOT NULL,
  UNIQUE(nome, etapa_ensino)
);

INSERT INTO bncc_campos_atuacao (nome, descricao, etapa_ensino) VALUES
('Vida Cotidiana', 'Campo de atuação relativo à participação em situações de leitura, próprias de atividades vivenciadas cotidianamente por crianças, adolescentes, jovens e adultos, no espaço doméstico e familiar, escolar, cultural e profissional.', 'anos_iniciais'),
('Vida Pública', 'Campo de atuação relativo à participação em situações de leitura e escrita, especialmente de textos das esferas jornalística, publicitária, política, jurídica e reivindicatória.', 'anos_iniciais'),
('Práticas de Estudo e Pesquisa', 'Campo de atuação relativo à participação em situações de leitura/escrita que possibilitem conhecer os textos expositivos e argumentativos.', 'anos_iniciais'),
('Artístico-Literário', 'Campo de atuação relativo à participação em situações de leitura, fruição e produção de textos literários e artísticos.', 'anos_iniciais')
ON CONFLICT (nome, etapa_ensino) DO NOTHING;

ALTER TABLE bncc_unidades_tematicas ADD COLUMN IF NOT EXISTS campo_atuacao TEXT;

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Protocolos de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Protocolos de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP01', 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Protocolos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Protocolos de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Protocolos de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP01', 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Protocolos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Protocolos de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Protocolos de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP01', 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Protocolos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP01');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Leitura/escuta (compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Protocolos de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Protocolos de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP01', 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Protocolos de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP01', 'Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP01', 'Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP01', 'Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Decodificação/Fluência de leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Decodificação/Fluência de leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP01', 'Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP02', 'Buscar, selecionar e ler, com a mediação do professor (leitura compartilhada), textos que circulam em meios impressos ou digitais, de acordo com as necessidades e interesses.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP02', 'Buscar, selecionar e ler, com a mediação do professor (leitura compartilhada), textos que circulam em meios impressos ou digitais, de acordo com as necessidades e interesses.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP02', 'Buscar, selecionar e ler, com a mediação do professor (leitura compartilhada), textos que circulam em meios impressos ou digitais, de acordo com as necessidades e interesses.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação de leitor'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação de leitor');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP02', 'Buscar, selecionar e ler, com a mediação do professor (leitura compartilhada), textos que circulam em meios impressos ou digitais, de acordo com as necessidades e interesses.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP02');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Escrita (compartilhada e autônoma)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Escrita (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Correspondência fonema-grafema'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Correspondência fonema-grafema');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP02', 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Correspondência fonema-grafema'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP02');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Escrita (compartilhada e autônoma)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Escrita (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Correspondência fonema-grafema'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Correspondência fonema-grafema');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP02', 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Correspondência fonema-grafema'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP02');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Escrita (compartilhada e autônoma)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Escrita (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Correspondência fonema-grafema'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Correspondência fonema-grafema');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP02', 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Correspondência fonema-grafema'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP02');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Escrita (compartilhada e autônoma)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Escrita (compartilhada e autônoma)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Correspondência fonema-grafema'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Correspondência fonema-grafema');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP02', 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Correspondência fonema-grafema'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP03', 'Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP03', 'Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP03', 'Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Convenções da escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP03', 'Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP01', 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP01', 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP01', 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP01', 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP03', 'Copiar textos breves, mantendo suas características e voltando para o texto sempre que tiver dúvidas sobre sua distribuição gráfica, espaçamento entre as palavras, escrita das palavras e pontuação.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP03', 'Copiar textos breves, mantendo suas características e voltando para o texto sempre que tiver dúvidas sobre sua distribuição gráfica, espaçamento entre as palavras, escrita das palavras e pontuação.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP03', 'Copiar textos breves, mantendo suas características e voltando para o texto sempre que tiver dúvidas sobre sua distribuição gráfica, espaçamento entre as palavras, escrita das palavras e pontuação.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP03', 'Copiar textos breves, mantendo suas características e voltando para o texto sempre que tiver dúvidas sobre sua distribuição gráfica, espaçamento entre as palavras, escrita das palavras e pontuação.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas na referenciação e construção da coesão'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP03');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Alfabetização)', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP04', 'Distinguir as letras do alfabeto de outros sinais gráficos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP04');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Alfabetização)', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP04', 'Distinguir as letras do alfabeto de outros sinais gráficos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP04');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Alfabetização)', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP04', 'Distinguir as letras do alfabeto de outros sinais gráficos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP04');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Análise linguística/semiótica (Alfabetização)', 'anos_iniciais', 'Artístico-Literário'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Artístico-Literário');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto do português do Brasil'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP04', 'Distinguir as letras do alfabeto de outros sinais gráficos.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP05', 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP05', 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP05', 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP05', 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP06', 'Segmentar oralmente palavras em sílabas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP06', 'Segmentar oralmente palavras em sílabas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP06', 'Segmentar oralmente palavras em sílabas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético e da ortografia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP06', 'Segmentar oralmente palavras em sílabas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP02', 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP02', 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP02', 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP02', 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP07', 'Identificar fonemas e sua representação por letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP07', 'Identificar fonemas e sua representação por letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP07', 'Identificar fonemas e sua representação por letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP07', 'Identificar fonemas e sua representação por letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP03', 'Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP03', 'Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP03', 'Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP03', 'Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP08', 'Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP08', 'Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP08', 'Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP08', 'Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP04', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, identificando que existem vogais em todas as sílabas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP04', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, identificando que existem vogais em todas as sílabas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP04', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, identificando que existem vogais em todas as sílabas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP04', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, identificando que existem vogais em todas as sílabas.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP09', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP09', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP09', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP09', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP05', 'Ler e escrever corretamente palavras com marcas de nasalidade (til, m, n).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP05', 'Ler e escrever corretamente palavras com marcas de nasalidade (til, m, n).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP05', 'Ler e escrever corretamente palavras com marcas de nasalidade (til, m, n).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP05', 'Ler e escrever corretamente palavras com marcas de nasalidade (til, m, n).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP10', 'Nomear as letras do alfabeto e recitá-lo na ordem das letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP10', 'Nomear as letras do alfabeto e recitá-lo na ordem das letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP10', 'Nomear as letras do alfabeto e recitá-lo na ordem das letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP10', 'Nomear as letras do alfabeto e recitá-lo na ordem das letras.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP06', 'Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP06', 'Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP06', 'Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP06', 'Perceber o princípio acrofônico que opera nos nomes das letras do alfabeto.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto do português do Brasil'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP06');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP11', 'Conhecer, diferenciar e relacionar letras em formato imprensa e cursiva, maiúsculas e minúsculas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP11', 'Conhecer, diferenciar e relacionar letras em formato imprensa e cursiva, maiúsculas e minúsculas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP11', 'Conhecer, diferenciar e relacionar letras em formato imprensa e cursiva, maiúsculas e minúsculas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP11', 'Conhecer, diferenciar e relacionar letras em formato imprensa e cursiva, maiúsculas e minúsculas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP07', 'Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP07', 'Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP07', 'Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP07', 'Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP12', 'Reconhecer a separação das palavras, na escrita, por espaços em branco.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP12', 'Reconhecer a separação das palavras, na escrita, por espaços em branco.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP12', 'Reconhecer a separação das palavras, na escrita, por espaços em branco.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação de palavras por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP12', 'Reconhecer a separação das palavras, na escrita, por espaços em branco.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP08', 'Segmentar corretamente as palavras ao escrever frases e textos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP08', 'Segmentar corretamente as palavras ao escrever frases e textos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP08', 'Segmentar corretamente as palavras ao escrever frases e textos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP08', 'Segmentar corretamente as palavras ao escrever frases e textos.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação de palavras por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP13', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas mediais e finais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP13', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas mediais e finais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP13', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas mediais e finais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP13', 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas mediais e finais.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP14', 'Identificar outros sinais no texto além das letras, como pontos finais, de interrogação e exclamação e seus efeitos na entonação.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP14', 'Identificar outros sinais no texto além das letras, como pontos finais, de interrogação e exclamação e seus efeitos na entonação.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP14', 'Identificar outros sinais no texto além das letras, como pontos finais, de interrogação e exclamação e seus efeitos na entonação.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP14', 'Identificar outros sinais no texto além das letras, como pontos finais, de interrogação e exclamação e seus efeitos na entonação.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP09', 'Usar adequadamente ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP09', 'Usar adequadamente ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP09', 'Usar adequadamente ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP09', 'Usar adequadamente ponto final, ponto de interrogação e ponto de exclamação.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sinonímia e antonímia/Morfologia/Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP15', 'Agrupar palavras pelo critério de aproximação de significado (sinonímia) e separar palavras pelo critério de oposição de significado (antonímia).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sinonímia e antonímia/Morfologia/Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP15', 'Agrupar palavras pelo critério de aproximação de significado (sinonímia) e separar palavras pelo critério de oposição de significado (antonímia).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sinonímia e antonímia/Morfologia/Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP15', 'Agrupar palavras pelo critério de aproximação de significado (sinonímia) e separar palavras pelo critério de oposição de significado (antonímia).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Sinonímia e antonímia/Morfologia/Pontuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP15', 'Agrupar palavras pelo critério de aproximação de significado (sinonímia) e separar palavras pelo critério de oposição de significado (antonímia).', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP10', 'Identificar sinônimos de palavras de texto lido, determinando a diferença de sentido entre eles, e formar antônimos de palavras encontradas em texto lido pelo acréscimo do prefixo de negação in-/im-.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP10', 'Identificar sinônimos de palavras de texto lido, determinando a diferença de sentido entre eles, e formar antônimos de palavras encontradas em texto lido pelo acréscimo do prefixo de negação in-/im-.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP10', 'Identificar sinônimos de palavras de texto lido, determinando a diferença de sentido entre eles, e formar antônimos de palavras encontradas em texto lido pelo acréscimo do prefixo de negação in-/im-.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP10', 'Identificar sinônimos de palavras de texto lido, determinando a diferença de sentido entre eles, e formar antônimos de palavras encontradas em texto lido pelo acréscimo do prefixo de negação in-/im-.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Sinonímia e antonímia/Morfologia/Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP11', 'Formar o aumentativo e o diminutivo de palavras com os sufixos -ão e -inho/-zinho.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP11', 'Formar o aumentativo e o diminutivo de palavras com os sufixos -ão e -inho/-zinho.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP11', 'Formar o aumentativo e o diminutivo de palavras com os sufixos -ão e -inho/-zinho.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Morfologia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Morfologia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP11', 'Formar o aumentativo e o diminutivo de palavras com os sufixos -ão e -inho/-zinho.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP04', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor ou já com certa autonomia, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP16', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP12', 'Ler e compreender com certa autonomia cantigas, letras de canção, dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma e compartilhada'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma e compartilhada');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP17', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP13', 'Planejar e produzir bilhetes e cartas, em meio impresso e/ou digital, dentre outros gêneros do campo da vida cotidiana.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP18', 'Registrar, em colaboração com os colegas e com a ajuda do professor, cantigas, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP14', 'Planejar e produzir pequenos relatos de observação de processos, de fatos, de experiências pessoais, mantendo as características do gênero.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP14');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita compartilhada'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita compartilhada');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP05', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, (re)contagens de histórias, poemas e outros textos versificados, poemas visuais, tiras e histórias em quadrinhos, dentre outros gêneros do campo artístico-literário.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP05');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Cotidiana'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Cotidiana');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de texto oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de texto oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP06', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, recados, avisos, convites, receitas, instruções de montagem, dentre outros gêneros do campo da vida cotidiana.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP19', 'Recitar parlendas, quadras, quadrinhas, trava-línguas, com entonação adequada e observando as rimas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP15', 'Cantar cantigas e canções, obedecendo ao ritmo e à melodia.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP15');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição do texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição do texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP07', 'Identificar e (re)produzir, em cantiga, quadras, quadrinhas, parlendas, trava-línguas e canções, rimas, aliterações, assonâncias, o ritmo de fala relacionado ao ritmo e à melodia das músicas e seus efeitos de sentido.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP20', 'Identificar e reproduzir, em listas, agendas, calendários, regras, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações (digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP16', 'Identificar e reproduzir, em bilhetes, recados, avisos, cartas, e-mails, receitas (modo de fazer), relatos (digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP17', 'Identificar e reproduzir, em relatos de experiências pessoais, a sequência dos fatos, utilizando expressões que marquem a passagem do tempo (antes, depois, ontem, hoje, amanhã, outro dia, antigamente, há muito tempo etc.), e o nível de informatividade necessário.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP08', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, fotolegendas em notícias, manchetes e lides em notícias, álbum de fotos digital noticioso e notícias curtas para público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP09', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP10', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, cartazes, avisos, folhetos, regras e regulamentos que organizam a vida na comunidade escolar.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita compartilhada'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita compartilhada');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP11', 'Escrever, em colaboração com os colegas e com a ajuda do professor, fotolegendas em notícias, manchetes e lides em notícias, álbum de fotos digital noticioso e notícias curtas para público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP12', 'Escrever, em colaboração com os colegas e com a ajuda do professor, slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP21', 'Escrever, em colaboração com os colegas e com a ajuda do professor, listas de regras e regulamentos que organizam a vida na comunidade escolar.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP18', 'Planejar e produzir cartazes e folhetos para divulgar eventos da escola ou da comunidade, utilizando linguagem persuasiva e elementos textuais e visuais adequados ao gênero.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP18');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Vida Pública'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Vida Pública');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de texto oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de texto oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP19', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, notícias curtas para público infantil, para compor jornal falado que possa ser repassado oralmente ou em meio digital.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP13', 'Planejar, em colaboração com os colegas e com a ajuda do professor, slogans e peça de campanha de conscientização destinada ao público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição do texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição do texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP14', 'Identificar e reproduzir, em fotolegendas de notícias, álbum de fotos digital noticioso, cartas de leitor (revista infantil), digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP15', 'Identificar a forma de composição de slogans publicitários.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP16', 'Identificar e reproduzir, em anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil (orais e escritos, digitais ou impressos), a formatação e diagramação específica de cada um desses gêneros, inclusive o uso de imagens.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP16');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Compreensão em leitura'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Compreensão em leitura');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP17', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, enunciados de tarefas escolares, diagramas, curiosidades, pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP17');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Imagens analíticas em textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Imagens analíticas em textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP20', 'Reconhecer a função de textos utilizados para apresentar informações coletadas em atividades de pesquisa (enquetes, pequenas entrevistas, registros de experimentações).', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Imagens analíticas em textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Pesquisa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Pesquisa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP21', 'Explorar, com a mediação do professor, textos informativos de diferentes ambientes digitais de pesquisa, conhecendo suas possibilidades.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP21');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Produção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Produção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP22', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, diagramas, entrevistas, curiosidades, dentre outros gêneros do campo investigativo.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP22', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP22');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP23', 'Planejar e produzir, com certa autonomia, pequenos registros de observação de resultados de pesquisa, coerentes com um tema investigado.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escrita autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP23');

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino, campo_atuacao)
SELECT 'Língua /Literatura Portuguesa', 'Oralidade', 'anos_iniciais', 'Práticas de Estudo e Pesquisa'
WHERE NOT EXISTS (SELECT 1 FROM bncc_unidades_tematicas WHERE disciplina = 'Língua /Literatura Portuguesa' AND unidade_tematica = 'Oralidade' AND etapa_ensino = 'anos_iniciais' AND COALESCE(campo_atuacao, '') = 'Práticas de Estudo e Pesquisa');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto oral Exposição oral'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto oral Exposição oral');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP23', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, entrevistas, curiosidades, dentre outros gêneros do campo investigativo.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto oral Exposição oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP24', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, relatos de experimentos, registros de observação, entrevistas, dentre outros gêneros do campo investigativo.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto oral Exposição oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP24');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição dos textos/Adequação do texto às normas de escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição dos textos/Adequação do texto às normas de escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP24', 'Identificar e reproduzir, em enunciados de tarefas escolares, diagramas, entrevistas, curiosidades, digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP25', 'Identificar e reproduzir, em relatos de experimentos, entrevistas, verbetes de enciclopédia infantil, digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formação do leitor literário'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formação do leitor literário');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP26', 'Ler e compreender, com certa autonomia, textos literários, de gêneros variados, desenvolvendo o gosto pela leitura.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Apreciação estética/Estilo'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Apreciação estética/Estilo');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP18', 'Apreciar poemas e outros textos versificados, observando rimas, sonoridades, jogos de palavras, reconhecendo seu pertencimento ao mundo imaginário e sua dimensão de encantamento, jogo e fruição.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Apreciação estética/Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP18');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita autônoma e compartilhada'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita autônoma e compartilhada');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP25', 'Produzir, tendo o professor como escriba, recontagens de histórias lidas pelo professor, histórias imaginadas ou baseadas em livros de imagens.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP27', 'Reescrever textos narrativos literários lidos pelo professor.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP27');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formas de composição de narrativas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formas de composição de narrativas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP26', 'Identificar elementos de uma narrativa lida ou escutada, incluindo personagens, enredo, tempo e espaço.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formas de composição de narrativas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP28', 'Reconhecer o conflito gerador de uma narrativa ficcional e sua resolução, além de palavras, expressões e frases que caracterizam personagens e ambientes.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formas de composição de narrativas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP28');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formas de composição de textos poéticos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formas de composição de textos poéticos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP19', 'Reconhecer, em textos versificados, rimas, sonoridades, jogos de palavras, palavras, expressões, comparações, relacionando-as com sensações e associações.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formas de composição de textos poéticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP19');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Formas de composição de textos poéticos visuais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Formas de composição de textos poéticos visuais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP29', 'Observar, em poemas visuais, o formato do texto na página, as ilustrações e outros efeitos visuais.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formas de composição de textos poéticos visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP29');
