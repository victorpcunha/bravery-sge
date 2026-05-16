-- ============================================
-- GEOGRAFIA - ANOS FINAIS (6º AO 9º ANO)
-- ============================================

INSERT INTO bncc_unidades_tematicas (disciplina, unidade_tematica, etapa_ensino) VALUES
('Geografia', 'O sujeito e seu lugar no mundo', 'anos_finais'),
('Geografia', 'Conexões e escalas', 'anos_finais'),
('Geografia', 'Mundo do trabalho', 'anos_finais'),
('Geografia', 'Formas de representação e pensamento espacial', 'anos_finais'),
('Geografia', 'Natureza, ambientes e qualidade de vida', 'anos_finais');


INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Identidade sociocultural' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE01', 'Comparar modificações das paisagens nos lugares de vivência e os usos desses lugares em diferentes tempos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Identidade sociocultural';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE02', 'Analisar modificações de paisagens por diferentes tipos de sociedade, com destaque para os povos originários.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Identidade sociocultural';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Relações entre os componentes físico-naturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE03', 'Descrever os movimentos do planeta e sua relação com a circulação geral da atmosfera, o tempo atmosférico e os padrões climáticos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Relações entre os componentes físico-naturais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE04', 'Descrever o ciclo da água, comparando o escoamento superficial no ambiente urbano e rural.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Relações entre os componentes físico-naturais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE05', 'Relacionar padrões climáticos, tipos de solo, relevo e formações vegetais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Relações entre os componentes físico-naturais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Transformação das paisagens naturais e antrópicas' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE06', 'Identificar as características das paisagens transformadas pelo trabalho humano a partir do desenvolvimento da agropecuária e do processo de industrialização.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformação das paisagens naturais e antrópicas';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE07', 'Explicar as mudanças na interação humana com a natureza a partir do surgimento das cidades.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformação das paisagens naturais e antrópicas';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Fenômenos naturais e sociais representados de diferentes maneiras' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE08', 'Medir distâncias na superfície pelas escalas gráficas e numéricas dos mapas.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Fenômenos naturais e sociais representados de diferentes maneiras';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE09', 'Elaborar modelos tridimensionais, blocos-diagramas e perfis topográficos e de vegetação.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Fenômenos naturais e sociais representados de diferentes maneiras';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Biodiversidade e ciclo hidrológico' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE10', 'Explicar as diferentes formas de uso do solo e de apropriação dos recursos hídricos.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Biodiversidade e ciclo hidrológico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE11', 'Analisar distintas interações das sociedades com a natureza, com base na distribuição dos componentes físico-naturais.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Biodiversidade e ciclo hidrológico';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE12', 'Identificar o consumo dos recursos hídricos e o uso das principais bacias hidrográficas no Brasil e no mundo.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Biodiversidade e ciclo hidrológico';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Atividades humanas e dinâmica climática' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF06GE13', 'Analisar consequências, vantagens e desvantagens das práticas humanas na dinâmica climática.', '["6º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Atividades humanas e dinâmica climática';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Ideias e concepções sobre a formação territorial do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE01', 'Avaliar ideias e estereótipos acerca das paisagens e da formação territorial do Brasil.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Ideias e concepções sobre a formação territorial do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Formação territorial do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE02', 'Analisar a influência dos fluxos econômicos e populacionais na formação socioeconômica e territorial do Brasil.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Formação territorial do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE03', 'Selecionar argumentos que reconheçam as territorialidades dos povos indígenas originários e comunidades tradicionais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Formação territorial do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Características da população brasileira' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE04', 'Analisar a distribuição territorial da população brasileira, considerando a diversidade étnico-cultural.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Características da população brasileira';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Produção, circulação e consumo de mercadorias' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE05', 'Analisar fatos representativos das alterações ocorridas entre o período mercantilista e o advento do capitalismo.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Produção, circulação e consumo de mercadorias';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE06', 'Discutir como a produção, circulação e consumo de mercadorias provocam impactos ambientais.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Produção, circulação e consumo de mercadorias';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Desigualdade social e o trabalho' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE07', 'Analisar a influência das redes de transporte e comunicação na configuração do território brasileiro.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Desigualdade social e o trabalho';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE08', 'Estabelecer relações entre industrialização e inovação tecnológica com as transformações do território brasileiro.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Desigualdade social e o trabalho';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Mapas temáticos do Brasil' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE09', 'Interpretar e elaborar mapas temáticos e históricos com informações demográficas e econômicas do Brasil.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Mapas temáticos do Brasil';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE10', 'Elaborar e interpretar gráficos com base em dados socioeconômicos das regiões brasileiras.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Mapas temáticos do Brasil';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Biodiversidade brasileira' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE11', 'Caracterizar dinâmicas dos componentes físico-naturais no território nacional e sua biodiversidade.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Biodiversidade brasileira';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF07GE12', 'Comparar unidades de conservação existentes no Município de residência e em outras localidades brasileiras.', '["7º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Biodiversidade brasileira';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Distribuição da população mundial e deslocamentos populacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE01', 'Descrever as rotas de dispersão da população humana pelo planeta e os principais fluxos migratórios.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Distribuição da população mundial e deslocamentos populacionais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diversidade e dinâmica da população mundial e local' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE02', 'Relacionar fatos da história das famílias do Município com os fluxos migratórios da população mundial.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Diversidade e dinâmica da população mundial e local';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE03', 'Analisar aspectos representativos da dinâmica demográfica.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Diversidade e dinâmica da população mundial e local';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE04', 'Compreender os fluxos de migração na América Latina e as principais políticas migratórias.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Diversidade e dinâmica da população mundial e local';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Corporações e organismos internacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE05', 'Aplicar os conceitos de Estado, nação, território, governo e país para o entendimento de conflitos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE06', 'Analisar a atuação das organizações mundiais nos processos de integração cultural e econômica.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE07', 'Analisar os impactos geoeconômicos e geopolíticos da ascensão dos Estados Unidos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE08', 'Analisar a situação do Brasil e de outros países na ordem mundial do pós-guerra.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE09', 'Analisar os padrões econômicos mundiais de produção, distribuição e intercâmbio.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE10', 'Distinguir e analisar conflitos e ações dos movimentos sociais brasileiros.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE11', 'Analisar áreas de conflito e tensões nas regiões de fronteira do continente latino-americano.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE12', 'Compreender os objetivos e a importância dos organismos de integração do território americano.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Os diferentes contextos e os meios técnico e tecnológico na produção' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE13', 'Analisar a influência do desenvolvimento científico e tecnológico nos tipos de trabalho.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Os diferentes contextos e os meios técnico e tecnológico na produção';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE14', 'Analisar os processos de desconcentração e descentralização das atividades econômicas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Os diferentes contextos e os meios técnico e tecnológico na produção';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Transformações do espaço na sociedade urbano-industrial na América Latina' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE15', 'Analisar a importância dos principais recursos hídricos da América Latina.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformações do espaço na sociedade urbano-industrial na América Latina';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE16', 'Analisar as principais problemáticas comuns às grandes cidades latino-americanas.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformações do espaço na sociedade urbano-industrial na América Latina';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE17', 'Analisar a segregação socioespacial em ambientes urbanos da América Latina.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformações do espaço na sociedade urbano-industrial na América Latina';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Cartografia: anamorfose, croquis e mapas temáticos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE18', 'Elaborar mapas para analisar as redes e dinâmicas urbanas e rurais da África e América.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Cartografia: anamorfose, croquis e mapas temáticos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE19', 'Interpretar cartogramas, mapas esquemáticos e anamorfoses geográficas da África e América.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Cartografia: anamorfose, croquis e mapas temáticos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Identidades e interculturalidades regionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE20', 'Analisar características de países da América e da África e discutir as desigualdades sociais.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Identidades e interculturalidades regionais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE21', 'Analisar o papel ambiental e territorial da Antártica no contexto geopolítico.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Identidades e interculturalidades regionais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diversidade ambiental e transformações nas paisagens na América Latina' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE22', 'Identificar os principais recursos naturais dos países da América Latina.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na América Latina';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE23', 'Identificar paisagens da América Latina associadas aos diferentes povos da região.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na América Latina';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF08GE24', 'Analisar as principais características produtivas dos países latino-americanos.', '["8º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na América Latina';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A hegemonia europeia na economia, na política e na cultura' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE01', 'Analisar criticamente como a hegemonia europeia foi exercida em várias regiões do planeta.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'A hegemonia europeia na economia, na política e na cultura';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Corporações e organismos internacionais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE02', 'Analisar a atuação das corporações internacionais na vida da população.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'Corporações e organismos internacionais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'As manifestações culturais na formação populacional' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'O sujeito e seu lugar no mundo' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE03', 'Identificar diferentes manifestações culturais de minorias étnicas.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'As manifestações culturais na formação populacional';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE04', 'Relacionar diferenças de paisagens aos modos de viver de diferentes povos na Europa, Ásia e Oceania.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'O sujeito e seu lugar no mundo' AND oc.objeto_conhecimento = 'As manifestações culturais na formação populacional';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Integração mundial e suas interpretações: globalização e mundialização' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE05', 'Analisar fatos para compreender a integração mundial, comparando globalização e mundialização.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Integração mundial e suas interpretações: globalização e mundialização';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'A divisão do mundo em Ocidente e Oriente' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE06', 'Associar o critério de divisão do mundo em Ocidente e Oriente com o Sistema Colonial.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'A divisão do mundo em Ocidente e Oriente';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Intercâmbios históricos e culturais entre Europa, Ásia e Oceania' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Conexões e escalas' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE07', 'Analisar os componentes físico-naturais da Eurásia e sua divisão em Europa e Ásia.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Intercâmbios históricos e culturais entre Europa, Ásia e Oceania';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE08', 'Analisar transformações territoriais na Europa, Ásia e Oceania.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Intercâmbios históricos e culturais entre Europa, Ásia e Oceania';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE09', 'Analisar características de países europeus, asiáticos e da Oceania.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Conexões e escalas' AND oc.objeto_conhecimento = 'Intercâmbios históricos e culturais entre Europa, Ásia e Oceania';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Transformações do espaço na sociedade urbano-industrial' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE10', 'Analisar os impactos do processo de industrialização na Europa, Ásia e Oceania.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformações do espaço na sociedade urbano-industrial';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE11', 'Relacionar as mudanças técnicas e científicas com as transformações no trabalho.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Transformações do espaço na sociedade urbano-industrial';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Cadeias industriais e inovação no uso dos recursos naturais' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Mundo do trabalho' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE12', 'Relacionar o processo de urbanização às transformações da produção agropecuária.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Cadeias industriais e inovação no uso dos recursos naturais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE13', 'Analisar a importância da produção agropecuária ante a desigualdade mundial de acesso aos recursos alimentares.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Mundo do trabalho' AND oc.objeto_conhecimento = 'Cadeias industriais e inovação no uso dos recursos naturais';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Leitura e elaboração de mapas temáticos' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Formas de representação e pensamento espacial' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE14', 'Elaborar e interpretar gráficos e mapas temáticos para analisar dados geográficos.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Leitura e elaboração de mapas temáticos';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE15', 'Comparar e classificar diferentes regiões do mundo com base em informações populacionais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Formas de representação e pensamento espacial' AND oc.objeto_conhecimento = 'Leitura e elaboração de mapas temáticos';

INSERT INTO bncc_objetos_conhecimento (unidade_tematica_id, objeto_conhecimento)
SELECT id, 'Diversidade ambiental e transformações nas paisagens na Europa, Ásia e Oceania' FROM bncc_unidades_tematicas
WHERE disciplina = 'Geografia' AND unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND etapa_ensino = 'anos_finais';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE16', 'Identificar e comparar diferentes domínios morfoclimáticos da Europa, Ásia e Oceania.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na Europa, Ásia e Oceania';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE17', 'Explicar as características físico-naturais e a ocupação da terra em diferentes regiões.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na Europa, Ásia e Oceania';

INSERT INTO bncc_habilidades (objeto_conhecimento_id, codigo_bncc, descricao, anos, etapa_ensino)
SELECT oc.id, 'EF09GE18', 'Identificar e analisar as cadeias industriais e as consequências dos usos de recursos naturais.', '["9º"]', 'anos_finais'
FROM bncc_objetos_conhecimento oc
JOIN bncc_unidades_tematicas ut ON ut.id = oc.unidade_tematica_id
WHERE ut.disciplina = 'Geografia' AND ut.unidade_tematica = 'Natureza, ambientes e qualidade de vida' AND oc.objeto_conhecimento = 'Diversidade ambiental e transformações nas paisagens na Europa, Ásia e Oceania';
