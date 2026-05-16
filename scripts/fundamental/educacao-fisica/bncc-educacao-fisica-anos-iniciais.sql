-- ============================================
-- EDUCAÇÃO FÍSICA - ENSINO FUNDAMENTAL
-- ANOS INICIAIS (1º AO 5º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Educação Física', 'Brincadeiras e jogos', 'anos_iniciais'),
('Educação Física', 'Esportes', 'anos_iniciais'),
('Educação Física', 'Ginásticas', 'anos_iniciais'),
('Educação Física', 'Danças', 'anos_iniciais'),
('Educação Física', 'Lutas', 'anos_iniciais');

-- ============================================
-- 1º E 2º ANOS
-- ============================================

-- Brincadeiras e jogos
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Brincadeiras e jogos' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF01', 'Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional, reconhecendo e respeitando as diferenças individuais de desempenho dos colegas.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF02', 'Explicar, por meio de múltiplas linguagens (corporal, visual, oral e escrita), as brincadeiras e os jogos populares do contexto comunitário e regional, reconhecendo e valorizando a importância desses jogos e brincadeiras para suas culturas de origem.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF03', 'Planejar e utilizar estratégias para resolver desafios de brincadeiras e jogos populares do contexto comunitário e regional, com base no reconhecimento das características dessas práticas.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF04', 'Colaborar na proposição e na produção de alternativas para a prática, em outros momentos e espaços, de brincadeiras e jogos e demais práticas corporais tematizadas na escola, produzindo textos (orais, escritos, audiovisuais) para divulgá-las na escola e na comunidade.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional';

-- Esportes (1º-2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de marca' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF05', 'Experimentar e fruir, prezando pelo trabalho coletivo e pelo protagonismo, a prática de esportes de marca e de precisão, identificando os elementos comuns a esses esportes.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de marca';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de precisão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF06', 'Discutir a importância da observação das normas e das regras dos esportes de marca e de precisão para assegurar a integridade própria e as dos demais participantes.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de precisão';

-- Ginásticas (1º-2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ginástica geral' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Ginásticas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF07', 'Experimentar, fruir e identificar diferentes elementos básicos da ginástica (equilíbrios, saltos, giros, rotações, acrobacias, com e sem materiais) e da ginástica geral, de forma individual e em pequenos grupos, adotando procedimentos de segurança.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF08', 'Planejar e utilizar estratégias para a execução de diferentes elementos básicos da ginástica e da ginástica geral.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF09', 'Participar da ginástica geral, identificando as potencialidades e os limites do corpo, e respeitando as diferenças individuais e de desempenho corporal.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF10', 'Descrever, por meio de múltiplas linguagens (corporal, oral, escrita e audiovisual), as características dos elementos básicos da ginástica e da ginástica geral, identificando a presença desses elementos em distintas práticas corporais.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

-- Danças (1º-2º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Danças do contexto comunitário e regional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Danças' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF11', 'Experimentar e fruir diferentes danças do contexto comunitário e regional (rodas cantadas, brincadeiras rítmicas e expressivas), e recriá-las, respeitando as diferenças individuais e de desempenho corporal.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças do contexto comunitário e regional';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF12EF12', 'Identificar os elementos constitutivos (ritmo, espaço, gestos) das danças do contexto comunitário e regional, valorizando e respeitando as manifestações de diferentes culturas.', '["1º", "2º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças do contexto comunitário e regional';

-- ============================================
-- 3º AO 5º ANO
-- ============================================

-- Brincadeiras e jogos (3º-5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Brincadeiras e jogos populares do Brasil e do mundo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Brincadeiras e jogos' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF01', 'Experimentar e fruir brincadeiras e jogos populares do Brasil e do mundo, incluindo aqueles de matiz indígena e africana, e recriá-los, valorizando a importância desse patrimônio histórico cultural.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos populares do Brasil e do mundo';


-- Brincadeiras e jogos de matriz indígena e africana
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Brincadeiras e jogos de matriz indígena e africana' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Brincadeiras e jogos' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF02', 'Planejar e utilizar estratégias para possibilitar a participação segura de todos os alunos em brincadeiras e jogos populares do Brasil e de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos de matriz indígena e africana';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF03', 'Descrever, por meio de múltiplas linguagens (corporal, oral, escrita, audiovisual), as brincadeiras e os jogos populares do Brasil e de matriz indígena e africana, explicando suas características e a importância desse patrimônio histórico cultural na preservação das diferentes culturas.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos de matriz indígena e africana';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF04', 'Recriar, individual e coletivamente, e experimentar, na escola e fora dela, brincadeiras e jogos populares do Brasil e do mundo, incluindo aqueles de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Brincadeiras e jogos de matriz indígena e africana';

-- Esportes (3º-5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de campo e taco' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF05', 'Experimentar e fruir diversos tipos de esportes de campo e taco, rede/parede e invasão, identificando seus elementos comuns e criando estratégias individuais e coletivas básicas.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de campo e taco';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de rede/parede' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF06', 'Diferenciar os conceitos de jogo e esporte, identificando as características que os constituem na contemporaneidade.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de rede/parede';

-- Ginásticas (3º-5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ginástica geral' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Ginásticas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF07', 'Experimentar e fruir, de forma coletiva, combinações de diferentes elementos da ginástica geral, propondo coreografias com diferentes temas do cotidiano.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF08', 'Planejar e utilizar estratégias para resolver desafios na execução de elementos básicos de apresentações coletivas de ginástica geral.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica geral';

-- Danças (3º-5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Danças do Brasil e do mundo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Danças' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF09', 'Experimentar, recriar e fruir danças populares do Brasil e do mundo e danças de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças do Brasil e do mundo';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Danças de matriz indígena e africana' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Danças' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF10', 'Comparar e identificar os elementos constitutivos comuns e diferentes em danças populares do Brasil e do mundo e danças de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de matriz indígena e africana';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF11', 'Formular e utilizar estratégias para a execução de elementos constitutivos das danças populares do Brasil e do mundo, e das danças de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de matriz indígena e africana';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF12', 'Identificar situações de injustiça e preconceito geradas no contexto das danças e demais práticas corporais e discutir alternativas para superá-las.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de matriz indígena e africana';

-- Lutas (3º-5º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lutas do contexto comunitário e regional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Lutas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF13', 'Experimentar, fruir e recriar diferentes lutas presentes no contexto comunitário e regional e lutas de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do contexto comunitário e regional';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lutas de matriz indígena e africana' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Lutas' AND etapa_ensino = 'anos_iniciais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF14', 'Planejar e utilizar estratégias básicas das lutas do contexto comunitário e regional e lutas de matriz indígena e africana experimentadas.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas de matriz indígena e africana';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF35EF15', 'Identificar as características das lutas do contexto comunitário e regional e lutas de matriz indígena e africana.', '["3º", "4º", "5º"]', 'anos_iniciais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas de matriz indígena e africana';
