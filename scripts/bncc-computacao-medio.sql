-- ============================================
-- COMPUTAÇÃO - ÁREA DO CONHECIMENTO (ENSINO MÉDIO)
-- ============================================

-- 1. Inserir nova Área
INSERT INTO bncc_areas_conhecimento (nome, tipo_ensino, descricao) VALUES
('Computação', 'medio', 'A Computação é uma área do conhecimento que estuda os fundamentos da computação, suas aplicações e impactos na sociedade, abrangendo pensamento computacional, programação, redes, segurança, dados e cidadania digital.')
ON CONFLICT (nome, tipo_ensino) DO NOTHING;

-- 2. Inserir Competências Específicas
DO $$
DECLARE
  v_area_id UUID;
BEGIN
  SELECT id INTO v_area_id FROM bncc_areas_conhecimento WHERE nome = 'Computação' AND tipo_ensino = 'medio';

  INSERT INTO bncc_competencias (area_id, codigo, descricao) VALUES
    (v_area_id, '1', 'Compreender as possibilidades e os limites da Computação para resolver problemas, tanto em termos de viabilidade quanto de eficiência, propondo e analisando soluções computacionais para diversos domínios do conhecimento, considerando diferentes aspectos.'),
    (v_area_id, '2', 'Analisar criticamente artefatos computacionais, sendo capaz de identificar vulnerabilidades dos ambientes e soluções computacionais, buscando garantir integridade, privacidade, sigilo e segurança das informações.'),
    (v_area_id, '3', 'Analisar situações do mundo contemporâneo, selecionando técnicas computacionais apropriadas para a solução de problemas.'),
    (v_area_id, '4', 'Construir conhecimento usando técnicas e tecnologias computacionais, produzindo informação e/ou artefatos de forma criativa e responsável.'),
    (v_area_id, '5', 'Desenvolver projetos para investigar desafios do mundo contemporâneo, com decisões éticas e colaborativas.'),
    (v_area_id, '6', 'Expressar e partilhar informações, ideias e soluções computacionais usando diferentes plataformas e linguagens de forma criativa, crítica e ética.'),
    (v_area_id, '7', 'Agir pessoal e coletivamente com responsabilidade, autonomia e respeito, utilizando conhecimentos da Computação para tomada de decisões.')
  ON CONFLICT (area_id, codigo) DO NOTHING;

  -- 3. Inserir Habilidades
  INSERT INTO bncc_habilidades_medio (codigo, descricao, area_id, competencia_codigo, componente) VALUES
    -- Competência 1 (6)
    ('EM13CO01', 'Explorar e construir a solução de problemas por meio da reutilização de partes de soluções existentes.', v_area_id, '1', 'geral'),
    ('EM13CO02', 'Explorar e construir a solução de problemas por meio de refinamentos, utilizando diversos níveis de abstração desde a especificação até a implementação.', v_area_id, '1', 'geral'),
    ('EM13CO03', 'Identificar o comportamento dos algoritmos no que diz respeito ao consumo de recursos como tempo de execução, espaço de memória e energia, entre outros.', v_area_id, '1', 'geral'),
    ('EM13CO04', 'Reconhecer o conceito de metaprogramação como forma de generalização na construção de programas.', v_area_id, '1', 'geral'),
    ('EM13CO05', 'Identificar os limites da Computação para diferenciar o que pode ou não ser automatizado.', v_area_id, '1', 'geral'),
    ('EM13CO06', 'Avaliar software considerando diferentes características e métricas associadas.', v_area_id, '1', 'geral'),
    -- Competência 2 (2)
    ('EM13CO07', 'Compreender tecnologias, equipamentos, protocolos e serviços de redes de computadores, identificando possibilidades de escala e confiabilidade.', v_area_id, '2', 'geral'),
    ('EM13CO08', 'Entender como mudanças na tecnologia afetam a segurança e a privacidade, reconhecendo riscos e buscando ajuda em situações de perigo.', v_area_id, '2', 'geral'),
    -- Competência 3 (3)
    ('EM13CO09', 'Identificar tecnologias digitais e suas formas de uso no mundo do trabalho.', v_area_id, '3', 'geral'),
    ('EM13CO10', 'Conhecer fundamentos da Inteligência Artificial, analisando potencialidades, riscos e limites.', v_area_id, '3', 'geral'),
    ('EM13CO11', 'Criar e explorar modelos computacionais simples para simulação e previsão, reconhecendo sua importância científica.', v_area_id, '3', 'geral'),
    -- Competência 4 (5)
    ('EM13CO12', 'Produzir, analisar e compartilhar informações a partir de dados usando ciência de dados.', v_area_id, '4', 'geral'),
    ('EM13CO13', 'Analisar formas de representação e consulta de dados digitais para pesquisas.', v_area_id, '4', 'geral'),
    ('EM13CO14', 'Avaliar confiabilidade de informações digitais considerando autoria, estrutura e propósito.', v_area_id, '4', 'geral'),
    ('EM13CO15', 'Analisar interação entre usuários e sistemas computacionais, refletindo sobre experiência do usuário.', v_area_id, '4', 'geral'),
    ('EM13CO16', 'Desenvolver projetos com robótica, usando artefatos físicos ou simuladores.', v_area_id, '4', 'geral'),
    -- Competência 5 (2)
    ('EM13CO17', 'Construir redes virtuais de interação e colaboração de forma segura e ética.', v_area_id, '5', 'geral'),
    ('EM13CO18', 'Planejar e gerenciar projetos colaborativos usando artefatos computacionais.', v_area_id, '5', 'geral'),
    -- Competência 6 (4)
    ('EM13CO19', 'Expor e negociar propostas e serviços usando mídias digitais.', v_area_id, '6', 'geral'),
    ('EM13CO20', 'Criar e compartilhar conteúdos em ambientes virtuais, avaliando confiabilidade e consequências.', v_area_id, '6', 'geral'),
    ('EM13CO21', 'Comunicar ideias complexas por meio de mapas conceituais, infográficos e hipertextos.', v_area_id, '6', 'geral'),
    ('EM13CO22', 'Produzir e publicar conteúdos digitais em diferentes formatos e mídias.', v_area_id, '6', 'geral'),
    -- Competência 7 (4)
    ('EM13CO23', 'Analisar experiências em comunidades virtuais e seus impactos sociais.', v_area_id, '7', 'geral'),
    ('EM13CO24', 'Identificar como redes sociais afetam a saúde física e mental.', v_area_id, '7', 'geral'),
    ('EM13CO25', 'Dialogar em ambientes virtuais com segurança e respeito, denunciando abusos.', v_area_id, '7', 'geral'),
    ('EM13CO26', 'Aplicar conceitos de direito digital em práticas cotidianas na cultura digital.', v_area_id, '7', 'geral');

  -- 4. Vínculos competência ↔ habilidade
  INSERT INTO bncc_competencia_habilidades (competencia_id, habilidade_id)
  SELECT c.id, h.id FROM bncc_competencias c, bncc_habilidades_medio h
  WHERE c.area_id = v_area_id AND h.area_id = v_area_id AND c.codigo = h.competencia_codigo;
END $$;

