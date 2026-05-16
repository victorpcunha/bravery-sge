-- LÍNGUA PORTUGUESA - ANOS INICIAIS (1º AO 5º ANO) - UNIFICADO

BEGIN;

-- LIMPEZA PRÉVIA
DELETE FROM bncc_habilidades
WHERE objeto_conhecimento_id IN (
  SELECT oc.id FROM bncc_objetos_conhecimento oc
  JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
  WHERE ut.disciplina = 'Língua /Literatura Portuguesa'
);

DELETE FROM bncc_objetos_conhecimento
WHERE unidade_tematica_id IN (
  SELECT id FROM bncc_unidades_tematicas
  WHERE disciplina = 'Língua /Literatura Portuguesa' AND campo_atuacao IS NOT NULL
);

DELETE FROM bncc_unidades_tematicas
WHERE disciplina = 'Língua /Literatura Portuguesa' AND campo_atuacao IS NOT NULL;

DELETE FROM bncc_campos_atuacao WHERE etapa_ensino = 'anos_iniciais';

-- TABELAS AUXILIARES
CREATE TABLE IF NOT EXISTS bncc_campos_atuacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  etapa_ensino TEXT NOT NULL,
  UNIQUE(nome, etapa_ensino)
);

INSERT INTO bncc_campos_atuacao (nome, descricao, etapa_ensino) VALUES
('Vida Cotidiana', 'Campo de atuação relativo à participação em situações de leitura, próprias de atividades vivenciadas cotidianamente por crianças, adolescentes, jovens e adultos.', 'anos_iniciais'),
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
SELECT oc.id, 'EF12LP04', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor ou já com certa autonomia, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP16', 'Ler e compreender, em colaboração com os colegas e com a ajuda do professor, quadras, quadrinhas, parlendas, trava-línguas, dentre outros gêneros do campo da vida cotidiana.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP12', 'Ler e compreender com certa autonomia cantigas, letras de canção, dentre outros gêneros do campo da vida cotidiana.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF01LP17', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem e legendas para álbuns, fotos ou ilustrações.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP13', 'Planejar e produzir bilhetes e cartas, em meio impresso e/ou digital.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP18', 'Registrar, em colaboração com os colegas e com a ajuda do professor, cantigas, quadras, quadrinhas, parlendas, trava-línguas.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP14', 'Planejar e produzir pequenos relatos de observação de processos, de fatos, de experiências pessoais.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP05', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, (re)contagens de histórias, poemas e outros textos versificados, poemas visuais, tiras e histórias em quadrinhos.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP06', 'Planejar e produzir, em colaboração com os colegas e com a ajuda do professor, recados, avisos, convites, receitas, instruções de montagem.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP07', 'Identificar e (re)produzir, em cantiga, quadras, quadrinhas, parlendas, trava-línguas e canções, rimas, aliterações, assonâncias.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP20', 'Identificar e reproduzir, em listas, agendas, calendários, regras, avisos, convites, receitas, instruções de montagem e legendas, a formatação e diagramação específica de cada gênero.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP16', 'Identificar e reproduzir, em bilhetes, recados, avisos, cartas, e-mails, receitas, relatos, a formatação e diagramação específica de cada gênero.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP17', 'Identificar e reproduzir, em relatos de experiências pessoais, a sequência dos fatos, utilizando expressões que marquem a passagem do tempo.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP08', 'Ler e compreender fotolegendas em notícias, manchetes e lides, álbum de fotos digital noticioso e notícias curtas para público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP09', 'Ler e compreender slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP10', 'Ler e compreender cartazes, avisos, folhetos, regras e regulamentos que organizam a vida na comunidade escolar.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP11', 'Escrever fotolegendas em notícias, manchetes e lides, álbum de fotos digital noticioso e notícias curtas para público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP12', 'Escrever slogans, anúncios publicitários e textos de campanhas de conscientização destinados ao público infantil.', '["1º","2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF12LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF01LP21', 'Escrever listas de regras e regulamentos que organizam a vida na comunidade escolar.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP18', 'Planejar e produzir cartazes e folhetos para divulgar eventos da escola ou da comunidade.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF02LP19', 'Planejar e produzir notícias curtas para público infantil, para compor jornal falado.', '["2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF02LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12LP13', 'Planejar slogans e peça de campanha de conscientização destinada ao público infantil.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP14', 'Identificar e reproduzir, em fotolegendas de notícias, álbum de fotos digital noticioso, cartas de leitor, a formatação e diagramação específica.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP16', 'Identificar e reproduzir, em anúncios publicitários e textos de campanhas de conscientização, a formatação e diagramação específica.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP17', 'Ler e compreender enunciados de tarefas escolares, diagramas, curiosidades, pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF02LP20', 'Reconhecer a função de textos utilizados para apresentar informações coletadas em atividades de pesquisa.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF02LP21', 'Explorar, com a mediação do professor, textos informativos de diferentes ambientes digitais de pesquisa.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF01LP22', 'Planejar e produzir diagramas, entrevistas, curiosidades.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP22', 'Planejar e produzir pequenos relatos de experimentos, entrevistas, verbetes de enciclopédia infantil.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF02LP23', 'Planejar e produzir, com certa autonomia, pequenos registros de observação de resultados de pesquisa.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF01LP23', 'Planejar e produzir entrevistas, curiosidades.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto oral Exposição oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP24', 'Planejar e produzir relatos de experimentos, registros de observação, entrevistas.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF01LP24', 'Identificar e reproduzir, em enunciados de tarefas escolares, diagramas, entrevistas, curiosidades, a formatação e diagramação específica.', '["1º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Alfabetização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição dos textos/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF01LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF02LP25', 'Identificar e reproduzir, em relatos de experimentos, entrevistas, verbetes de enciclopédia infantil, a formatação e diagramação específica.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP18', 'Apreciar poemas e outros textos versificados, observando rimas, sonoridades, jogos de palavras.', '["1º","2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF01LP25', 'Produzir, tendo o professor como escriba, recontagens de histórias lidas pelo professor.', '["1º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF02LP28', 'Reconhecer o conflito gerador de uma narrativa ficcional e sua resolução.', '["2º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF12LP19', 'Reconhecer, em textos versificados, rimas, sonoridades, jogos de palavras.', '["1º","2º"]', 'anos_iniciais'
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

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP01', 'Ler e compreender, silenciosamente e, em seguida, em voz alta, com autonomia e fluência, textos curtos com nível de textualidade adequado.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Decodificação/Fluência de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Formação de leitor'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP02', 'Selecionar livros da biblioteca e/ou do cantinho de leitura da sala de aula e/ou disponíveis em meios digitais para leitura individual, justificando a escolha.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais ou pronominais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais ou pronominais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais ou pronominais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP06', 'Recuperar relações entre partes de um texto, identificando substituições lexicais ou pronominais.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP07', 'Utilizar, ao produzir um texto, conhecimentos linguísticos e gramaticais, tais como ortografia, regras básicas de concordância nominal e verbal, pontuação.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Convenções da escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP07');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação, vocabulário apropriado ao gênero, recursos de coesão pronominal e articuladores de relações de sentido.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação, vocabulário apropriado ao gênero, recursos de coesão pronominal e articuladores de relações de sentido.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação, vocabulário apropriado ao gênero, recursos de coesão pronominal e articuladores de relações de sentido.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP08', 'Utilizar, ao produzir um texto, recursos de referenciação, vocabulário apropriado ao gênero, recursos de coesão pronominal e articuladores de relações de sentido.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético/Estabelecimento de relações anafóricas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto/Progressão temática e paragrafação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP09', 'Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Planejamento de texto/Progressão temática e paragrafação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral e suas características linguístico-expressivas e composicionais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral e suas características linguístico-expressivas e composicionais.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição de gêneros orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP10');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição de gêneros orais'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição de gêneros orais');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral e suas características linguístico-expressivas e composicionais.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP10', 'Identificar gêneros do discurso oral e suas características linguístico-expressivas e composicionais.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP11', 'Ouvir gravações, canções, textos falados em diferentes variedades linguísticas, rejeitando preconceitos linguísticos.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP12', 'Recorrer ao dicionário para esclarecer dúvida sobre a escrita de palavras.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP01', 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas – c/qu; g/gu; r/rr; s/ss.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP01', 'Grafar palavras utilizando regras de correspondência fonema-grafema regulares, contextuais e morfológicas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP02', 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever corretamente palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever corretamente palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever corretamente palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP02', 'Ler e escrever corretamente palavras com sílabas VV e CVV em casos nos quais a combinação VV (ditongo) é reduzida na língua oral.', '["4º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP13', 'Memorizar a grafia de palavras de uso frequente nas quais as relações fonema-grafema são irregulares.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Construção do sistema alfabético e da ortografia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP13');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP03', 'Localizar palavras no dicionário para esclarecer significados.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP02', 'Identificar o caráter polissêmico das palavras.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento do alfabeto/Ordem alfabética/Polissemia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP02');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias do alfabeto/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico em monossílabos tônicos terminados em a, e, o e em palavras oxítonas.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico em monossílabos tônicos terminados em a, e, o e em palavras oxítonas.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico em monossílabos tônicos terminados em a, e, o e em palavras oxítonas.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP04', 'Usar acento gráfico em monossílabos tônicos terminados em a, e, o e em palavras oxítonas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias do alfabeto/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Conhecimento das diversas grafias/Acentuação'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP04', 'Usar acento gráfico em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP03', 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Conhecimento das diversas grafias/Acentuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP03');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Segmentação de palavras/Classificação por número de sílabas'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP05', 'Identificar o número de sílabas de palavras.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Segmentação de palavras/Classificação por número de sílabas'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Construção do sistema alfabético'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Construção do sistema alfabético');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP06', 'Identificar a sílaba tônica em palavras.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, interrogação, exclamação, dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, interrogação, exclamação, dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, interrogação, exclamação, dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP07', 'Identificar a função na leitura e usar na escrita ponto final, interrogação, exclamação, dois-pontos e travessão.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Usar adequadamente na escrita ponto final, interrogação, exclamação, dois-pontos, travessão, vírgula.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Usar adequadamente na escrita ponto final, interrogação, exclamação, dois-pontos, travessão, vírgula.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Usar adequadamente na escrita ponto final, interrogação, exclamação, dois-pontos, travessão, vírgula.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP05', 'Usar adequadamente na escrita ponto final, interrogação, exclamação, dois-pontos, travessão, vírgula.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP05');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura, vírgula, ponto e vírgula, dois-pontos e reconhecer o efeito de sentido do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura, vírgula, ponto e vírgula, dois-pontos e reconhecer o efeito de sentido do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura, vírgula, ponto e vírgula, dois-pontos e reconhecer o efeito de sentido do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Pontuação'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP04', 'Diferenciar, na leitura, vírgula, ponto e vírgula, dois-pontos e reconhecer o efeito de sentido do uso de reticências, aspas, parênteses.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar substantivos e verbos e suas funções na oração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar substantivos e verbos e suas funções na oração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar substantivos e verbos e suas funções na oração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP08', 'Identificar e diferenciar substantivos e verbos e suas funções na oração.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP06', 'Identificar em textos e usar na produção textual a concordância entre substantivo ou pronome pessoal e verbo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar adequadamente os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar adequadamente os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar adequadamente os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia/Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP06');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP06', 'Flexionar adequadamente os verbos em concordância com pronomes pessoais/nomes sujeitos da oração.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP09', 'Identificar adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP09', 'Identificar adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP09', 'Identificar adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP09', 'Identificar adjetivos e sua função de atribuição de propriedades aos substantivos.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar e usar na produção textual a concordância entre artigo, substantivo e adjetivo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar e usar na produção textual a concordância entre artigo, substantivo e adjetivo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar e usar na produção textual a concordância entre artigo, substantivo e adjetivo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfossintaxe'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP07', 'Identificar e usar na produção textual a concordância entre artigo, substantivo e adjetivo.', '["4º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP14', 'Identificar e usar na produção textual pronomes pessoais, possessivos e demonstrativos como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP14', 'Identificar e usar na produção textual pronomes pessoais, possessivos e demonstrativos como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP14', 'Identificar e usar na produção textual pronomes pessoais, possessivos e demonstrativos como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP14', 'Identificar e usar na produção textual pronomes pessoais, possessivos e demonstrativos como recurso coesivo anafórico.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar o uso de conjunções e a relação que estabelecem entre partes do texto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar o uso de conjunções e a relação que estabelecem entre partes do texto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar o uso de conjunções e a relação que estabelecem entre partes do texto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP07', 'Identificar o uso de conjunções e a relação que estabelecem entre partes do texto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP07');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP10', 'Reconhecer prefixos e sufixos produtivos na formação de palavras derivadas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP08', 'Reconhecer e grafar palavras derivadas com os sufixos -agem, -oso, -eza, -izar/-isar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP08', 'Diferenciar palavras primitivas, derivadas e compostas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Morfologia'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP08');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP11', 'Ler e compreender textos injuntivos instrucionais (receitas, instruções de montagem).', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP09', 'Ler e compreender boletos, faturas e carnês.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP09', 'Ler e compreender textos instrucionais de regras de jogo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP09');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP12', 'Ler e compreender cartas pessoais e diários.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP10', 'Ler e compreender cartas pessoais de reclamação.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP10');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP10', 'Ler e compreender anedotas, piadas e cartuns.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP13', 'Planejar e produzir cartas pessoais e diários.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP11', 'Planejar e produzir cartas pessoais de reclamação.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP11');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP11', 'Registrar anedotas, piadas e cartuns.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escrita colaborativa'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escrita colaborativa');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP14', 'Planejar e produzir textos injuntivos instrucionais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP12', 'Planejar e produzir textos instrucionais de regras de jogo.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Escrita (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP15', 'Planejar e produzir receitas em áudio ou vídeo.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP12', 'Planejar e produzir tutoriais em áudio ou vídeo.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Produção de texto oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP12');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP13', 'Planejar e produzir resenhas digitais em áudio ou vídeo.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP16', 'Identificar e reproduzir a formatação de textos injuntivos instrucionais.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP13', 'Identificar e reproduzir a formatação de textos injuntivos instrucionais de jogos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP13');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP14', 'Identificar e reproduzir a formatação de textos de resenha crítica.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP17', 'Identificar e reproduzir a formatação de gêneros epistolares e diários.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Forma de composição do texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP18', 'Ler e compreender cartas dirigidas a veículos da mídia impressa ou digital e notícias.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP14', 'Identificar, em notícias, fatos, participantes, local e momento da ocorrência.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP15', 'Ler/assistir e compreender notícias, reportagens, vídeos em vlogs argumentativos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP19', 'Identificar e discutir o uso de recursos de persuasão em textos publicitários.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP15', 'Distinguir fatos de opiniões/sugestões em textos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP15');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP16', 'Comparar informações sobre um mesmo fato veiculadas em diferentes mídias.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP20', 'Produzir cartas a veículos da mídia impressa ou digital.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP16', 'Produzir notícias sobre fatos do universo escolar.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP17', 'Produzir roteiro para edição de uma reportagem digital.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP21', 'Produzir anúncios publicitários e campanhas de conscientização.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Escrita colaborativa'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP15', 'Opinar e defender ponto de vista sobre tema polêmico.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP22', 'Planejar e produzir telejornal para público infantil.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento e produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP17', 'Produzir jornais radiofônicos ou televisivos e entrevistas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento e produção de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP18', 'Roteirizar, produzir e editar vídeo para vlogs argumentativos.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF05LP19', 'Argumentar oralmente sobre acontecimentos de interesse social.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP16', 'Identificar e reproduzir a formatação de notícias e cartas de reclamação.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP23', 'Analisar o uso de adjetivos em cartas a veículos da mídia.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP20', 'Analisar a validade de argumentos em argumentações.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP18', 'Analisar o padrão entonacional de âncoras de jornais.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP18');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP21', 'Analisar o padrão entonacional de vloggers opinativos.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Forma de composição dos textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP24', 'Ler/ouvir e compreender relatos de observações e pesquisas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP19', 'Ler e compreender textos expositivos de divulgação científica.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP22', 'Ler e compreender verbetes de dicionário.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão em leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP20', 'Reconhecer a função de gráficos, diagramas e tabelas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Imagens analíticas em textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP20');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP23', 'Comparar informações em gráficos ou tabelas.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Imagens analíticas em textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP17', 'Buscar e selecionar informações sobre fenômenos sociais e naturais.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP25', 'Planejar e produzir textos com resultados de observações e pesquisas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP21', 'Planejar e produzir textos sobre temas de interesse com base em pesquisas.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Produção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP21');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP24', 'Planejar e produzir texto sobre tema de interesse com resultados de pesquisa.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF04LP22', 'Planejar e produzir verbetes de enciclopédia infantil.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Escrita autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP25', 'Planejar e produzir verbetes de dicionário.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP18', 'Escutar apresentações de trabalhos formulando perguntas pertinentes.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP19', 'Recuperar as ideias principais em situações formais de escuta.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Compreensão de textos orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP19');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP20', 'Expor trabalhos escolares com apoio de recursos multissemióticos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto oral Exposição oral'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP20');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição/Adequação do texto às normas de escrita'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição/Adequação do texto às normas de escrita');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF03LP26', 'Identificar e reproduzir a formatação de relatórios de observação e pesquisa.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP26', 'Utilizar conhecimentos linguísticos e gramaticais ao produzir o texto.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP26');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Forma de composição/Coesão e articuladores'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Forma de composição/Coesão e articuladores');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP23', 'Identificar e reproduzir a formatação de verbetes de enciclopédia infantil.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição/Coesão e articuladores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP23');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP27', 'Utilizar recursos de coesão pronominal e articuladores de sentido.', '["5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição/Coesão e articuladores'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF05LP27');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP24', 'Identificar e reproduzir tabelas, diagramas e gráficos em relatórios.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Forma de composição/Adequação do texto às normas de escrita'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP24');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP21', 'Ler e compreender textos literários de diferentes gêneros.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP22', 'Perceber diálogos em textos narrativos observando verbos de enunciação.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Formação do leitor literário/Leitura multissemiótica'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP22');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP23', 'Apreciar poemas observando rimas, aliterações e divisão de versos.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP24', 'Identificar funções do texto dramático.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP25', 'Criar narrativas ficcionais com detalhes descritivos.', '["3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Escrita autônoma e compartilhada'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF35LP25');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35LP26', 'Ler e compreender narrativas ficcionais com elementos da estrutura narrativa.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP27', 'Ler e compreender textos em versos explorando recursos visuais e sonoros.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP28', 'Declamar poemas com entonação e interpretação adequadas.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF03LP27', 'Recitar cordel e cantar repentes e emboladas.', '["3º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Performances orais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF03LP27');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF04LP25', 'Representar cenas de textos dramáticos.', '["4º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP29', 'Identificar cenário, personagem central, conflito gerador e ponto de vista.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP30', 'Diferenciar discurso indireto e discurso direto.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF35LP31', 'Identificar efeitos de sentido de recursos rítmicos e sonoros.', '["3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF04LP26', 'Observar o formato e diagramação em poemas concretos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos poéticos visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP26');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF05LP28', 'Observar recursos multissemióticos em ciberpoemas.', '["5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF04LP25', 'Representar cenas de textos dramáticos.', '["4º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Análise linguística/semiótica (Ortografização)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Forma de composição de textos dramáticos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF04LP25');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Reconstrução das condições de produção e recepção de textos'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP01', 'Identificar a função social de textos que circulam em campos da vida social.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Reconstrução das condições de produção e recepção de textos'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP01');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP02');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP02', 'Estabelecer expectativas em relação ao texto que vai ler.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido de recursos expressivos gráfico-visuais.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido de recursos expressivos gráfico-visuais.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido de recursos expressivos gráfico-visuais.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP04', 'Identificar o efeito de sentido de recursos expressivos gráfico-visuais.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Estratégia de leitura'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP04');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar o texto considerando situação comunicativa, interlocutores e finalidade.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar o texto considerando situação comunicativa, interlocutores e finalidade.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar o texto considerando situação comunicativa, interlocutores e finalidade.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Planejamento de texto'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP05');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Planejamento de texto'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Planejamento de texto');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP05', 'Planejar o texto considerando situação comunicativa, interlocutores e finalidade.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com ajuda do professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com ajuda do professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com ajuda do professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP06', 'Reler e revisar o texto produzido com ajuda do professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP07', 'Editar a versão final do texto.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP08', 'Utilizar software para editar e publicar textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP08', 'Utilizar software para editar e publicar textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP08', 'Utilizar software para editar e publicar textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP08', 'Utilizar software para editar e publicar textos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Produção de textos (escrita compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Utilização de tecnologia digital'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP08');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se com clareza em intercâmbio oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se com clareza em intercâmbio oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se com clareza em intercâmbio oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Oralidade pública/Intercâmbio conversacional'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP09', 'Expressar-se com clareza em intercâmbio oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Oralidade pública/Intercâmbio conversacional'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP09');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Escuta atenta'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Escuta atenta');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP10', 'Escutar falas de professores e colegas com atenção.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP10', 'Escutar falas de professores e colegas com atenção.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP10', 'Escutar falas de professores e colegas com atenção.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP10', 'Escutar falas de professores e colegas com atenção.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP11', 'Reconhecer características da conversação espontânea.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Características da conversação espontânea'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP11');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos na fala.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos na fala.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Pública'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos na fala.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Práticas de Estudo e Pesquisa'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Aspectos não linguísticos no ato da fala'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP12', 'Atribuir significado a aspectos não linguísticos na fala.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Aspectos não linguísticos no ato da fala'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP12');

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT ut.id, 'Relato oral/Registro formal e informal'
FROM bncc_unidades_tematicas ut
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND NOT EXISTS (SELECT 1 FROM bncc_objetos_conhecimento oc2 WHERE oc2.unidade_tematica_id = ut.id AND oc2.objeto_conhecimento = 'Relato oral/Registro formal e informal');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP13', 'Identificar finalidades da interação oral.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP14', 'Construir o sentido de histórias em quadrinhos e tirinhas.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Vida Cotidiana'
AND oc.objeto_conhecimento = 'Leitura de imagens em narrativas visuais'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP14');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP15', 'Reconhecer que textos literários fazem parte do mundo do imaginário.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP16', 'Ler e compreender textos narrativos de maior porte.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Leitura colaborativa e autônoma'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP16');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP17', 'Apreciar poemas visuais e concretos.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Leitura/escuta (compartilhada e autônoma)' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Apreciação estética/Estilo'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP17');

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF15LP18', 'Relacionar texto com ilustrações.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
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
SELECT oc.id, 'EF15LP19', 'Recontar oralmente textos literários lidos pelo professor.', '["1º","2º","3º","4º","5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Língua /Literatura Portuguesa' AND ut.unidade_tematica = 'Oralidade' AND ut.etapa_ensino = 'anos_iniciais' AND COALESCE(ut.campo_atuacao, '') = 'Artístico-Literário'
AND oc.objeto_conhecimento = 'Contagem de histórias'
AND NOT EXISTS (SELECT 1 FROM bncc_habilidades h2 WHERE h2.objeto_conhecimento_id = oc.id AND h2.codigo_bncc = 'EF15LP19');


COMMIT;
