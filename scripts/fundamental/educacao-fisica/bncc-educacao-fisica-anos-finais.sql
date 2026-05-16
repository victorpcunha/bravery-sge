-- ============================================
-- EDUCAÇÃO FÍSICA - ENSINO FUNDAMENTAL
-- ANOS FINAIS (6º AO 9º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Educação Física', 'Brincadeiras e jogos', 'anos_finais'),
('Educação Física', 'Esportes', 'anos_finais'),
('Educação Física', 'Ginásticas', 'anos_finais'),
('Educação Física', 'Danças', 'anos_finais'),
('Educação Física', 'Lutas', 'anos_finais'),
('Educação Física', 'Práticas corporais de aventura', 'anos_finais');

-- ============================================
-- 6º E 7º ANOS
-- ============================================

-- Jogos eletrônicos
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Jogos eletrônicos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Brincadeiras e jogos' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF01', 'Experimentar e fruir, na escola e fora dela, jogos eletrônicos diversos, valorizando e respeitando os sentidos e significados atribuídos a eles por diferentes grupos sociais e etários.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Jogos eletrônicos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF02', 'Identificar as transformações nas características dos jogos eletrônicos em função dos avanços das tecnologias e nas respectivas exigências corporais colocadas por esses diferentes tipos de jogos.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Brincadeiras e jogos' AND oc.objeto_conhecimento = 'Jogos eletrônicos';

-- Esportes (6º-7º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de marca' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF03', 'Experimentar e fruir esportes de marca, precisão, invasão e técnico-combinatórios, valorizando o trabalho coletivo e o protagonismo.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de marca';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de precisão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF04', 'Praticar um ou mais esportes de marca, precisão, invasão e técnico-combinatórios oferecidos pela escola, usando habilidades técnico-táticas básicas e respeitando regras.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de precisão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de invasão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF05', 'Planejar e utilizar estratégias para solucionar os desafios técnicos e táticos, tanto nos esportes de marca, precisão, invasão e técnico-combinatórios como nas modalidades esportivas escolhidas para praticar de forma específica.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de invasão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes técnico-combinatórios' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF06', 'Analisar as transformações na organização e na prática dos esportes em suas diferentes manifestações (profissional e comunitário/lazer).', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes técnico-combinatórios';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF07', 'Propor e produzir alternativas para experimentação dos esportes não disponíveis e/ou acessíveis na comunidade e das demais práticas corporais tematizadas na escola.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes técnico-combinatórios';

-- Ginástica de condicionamento físico (6º-7º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ginástica de condicionamento físico' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Ginásticas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF08', 'Experimentar e fruir exercícios físicos que solicitem diferentes capacidades físicas, identificando seus tipos (força, velocidade, resistência, flexibilidade) e as sensações corporais provocadas pela sua prática.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF09', 'Construir, coletivamente, procedimentos e normas de convívio que viabilizem a participação de todos na prática de exercícios físicos, com o objetivo de promover a saúde.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF10', 'Diferenciar exercício físico de atividade física e propor alternativas para a prática de exercícios físicos dentro e fora do ambiente escolar.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

-- Danças urbanas (6º-7º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Danças urbanas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Danças' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF11', 'Experimentar, fruir e recriar danças urbanas, identificando seus elementos constitutivos (ritmo, espaço, gestos).', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças urbanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF12', 'Planejar e utilizar estratégias para aprender elementos constitutivos das danças urbanas.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças urbanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF13', 'Diferenciar as danças urbanas das demais manifestações da dança, valorizando e respeitando os sentidos e significados atribuídos a eles por diferentes grupos sociais.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças urbanas';

-- Lutas do Brasil (6º-7º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lutas do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Lutas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF14', 'Experimentar, fruir e recriar diferentes lutas do Brasil, valorizando a própria segurança e integridade física, bem como as dos demais.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF15', 'Planejar e utilizar estratégias básicas das lutas do Brasil, respeitando o colega como oponente.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF16', 'Identificar as características (códigos, rituais, elementos técnico-táticos, indumentária, materiais, instalações, instituições) das lutas do Brasil.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF17', 'Problematizar preconceitos e estereótipos relacionados ao universo das lutas e demais práticas corporais, propondo alternativas para superá-los, com base na solidariedade, na justiça, na equidade e no respeito.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do Brasil';

-- Práticas corporais de aventura urbanas (6º-7º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Práticas corporais de aventura urbanas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Práticas corporais de aventura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF18', 'Experimentar e fruir diferentes práticas corporais de aventura urbanas, valorizando a própria segurança e integridade física, bem como as dos demais.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura urbanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF19', 'Identificar os riscos durante a realização de práticas corporais de aventura urbanas e planejar estratégias para sua superação.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura urbanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF20', 'Executar práticas corporais de aventura urbanas, respeitando o patrimônio público e utilizando alternativas para a prática segura em diversos espaços.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura urbanas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF67EF21', 'Identificar a origem das práticas corporais de aventura e as possibilidades de recriá-las, reconhecendo as características (instrumentos, equipamentos de segurança, indumentária, organização) e seus tipos de práticas.', '["6º", "7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura urbanas';

-- ============================================
-- 8º E 9º ANOS
-- ============================================

-- Esportes (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de rede/parede' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF01', 'Experimentar diferentes papéis (jogador, árbitro e técnico) e fruir os esportes de rede/parede, campo e taco, invasão e combate, valorizando o trabalho coletivo e o protagonismo.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de rede/parede';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de campo e taco' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF02', 'Praticar um ou mais esportes de rede/parede, campo e taco, invasão e combate oferecidos pela escola, usando habilidades técnico-táticas básicas.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de campo e taco';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de invasão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF03', 'Formular e utilizar estratégias para solucionar os desafios técnicos e táticos, tanto nos esportes de campo e taco, rede/parede, invasão e combate como nas modalidades esportivas escolhidas para praticar de forma específica.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de invasão';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Esportes de combate' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Esportes' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF04', 'Identificar os elementos técnicos ou técnico-táticos individuais, combinações táticas, sistemas de jogo e regras das modalidades esportivas praticadas, bem como diferenciar as modalidades esportivas com base nos critérios da lógica interna.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de combate';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF05', 'Identificar as transformações históricas do fenômeno esportivo e discutir alguns de seus problemas (doping, corrupção, violência etc.) e a forma como as mídias os apresentam.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de combate';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF06', 'Verificar locais disponíveis na comunidade para a prática de esportes e das demais práticas corporais tematizadas na escola, propondo e produzindo alternativas para utilizá-los no tempo livre.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Esportes' AND oc.objeto_conhecimento = 'Esportes de combate';

-- Ginástica de condicionamento físico (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ginástica de condicionamento físico' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Ginásticas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF07', 'Experimentar e fruir um ou mais programas de exercícios físicos, identificando as exigências corporais desses diferentes programas.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF08', 'Discutir as transformações históricas dos padrões de desempenho, saúde e beleza, considerando a forma como são apresentados nos diferentes meios (científico, midiático etc.).', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF09', 'Problematizar a prática excessiva de exercícios físicos e o uso de medicamentos para a ampliação do rendimento ou potencialização das transformações corporais.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de condicionamento físico';

-- Ginástica de conscientização corporal (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ginástica de conscientização corporal' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Ginásticas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF10', 'Experimentar e fruir um ou mais tipos de ginástica de conscientização corporal, identificando as exigências corporais dos mesmos.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de conscientização corporal';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF11', 'Identificar as diferenças e semelhanças entre a ginástica de conscientização corporal e as de condicionamento físico e discutir como a prática de cada uma dessas manifestações pode contribuir para a melhoria das condições de vida, saúde, bem-estar e cuidado consigo mesmo.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Ginásticas' AND oc.objeto_conhecimento = 'Ginástica de conscientização corporal';

-- Danças de salão (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Danças de salão' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Danças' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF12', 'Experimentar, fruir e recriar danças de salão, valorizando a diversidade cultural e respeitando a tradição dessas culturas.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de salão';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF13', 'Planejar e utilizar estratégias para se apropriar dos elementos constitutivos (ritmo, espaço, gestos) das danças de salão.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de salão';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF14', 'Discutir estereótipos e preconceitos relativos às danças de salão e demais práticas corporais e propor alternativas para sua superação.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de salão';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF15', 'Analisar as características (ritmos, gestos, coreografias e músicas) das danças de salão, bem como suas transformações históricas e os grupos de origem.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Danças' AND oc.objeto_conhecimento = 'Danças de salão';

-- Lutas do mundo (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Lutas do mundo' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Lutas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF16', 'Experimentar e fruir a execução dos movimentos pertencentes às lutas do mundo, adotando procedimentos de segurança e respeitando o oponente.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do mundo';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF17', 'Planejar e utilizar estratégias básicas das lutas experimentadas, reconhecendo as suas características técnico-táticas.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do mundo';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF18', 'Discutir as transformações históricas, o processo de esportivização e a midiatização de uma ou mais lutas, valorizando e respeitando as culturas de origem.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Lutas' AND oc.objeto_conhecimento = 'Lutas do mundo';

-- Práticas corporais de aventura na natureza (8º-9º)
INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Práticas corporais de aventura na natureza' FROM bncc_unidades_tematicas
WHERE disciplina = 'Educação Física' AND unidade_tematica = 'Práticas corporais de aventura' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF19', 'Experimentar e fruir diferentes práticas corporais de aventura na natureza, valorizando a própria segurança e integridade física, bem como as dos demais, respeitando o patrimônio natural e minimizando os impactos de degradação ambiental.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura na natureza';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF20', 'Identificar riscos, formular estratégias e observar normas de segurança para superar os desafios na realização de práticas corporais de aventura na natureza.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura na natureza';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF89EF21', 'Identificar as características (equipamentos de segurança, instrumentos, indumentária, organização) das práticas corporais de aventura na natureza, bem como suas transformações históricas.', '["8º", "9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Educação Física' AND ut.unidade_tematica = 'Práticas corporais de aventura' AND oc.objeto_conhecimento = 'Práticas corporais de aventura na natureza';
