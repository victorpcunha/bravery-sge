-- Sub-recursos para permissões granulares do Diário de Classe
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.diario-classe.frequencia', 'Diário — Frequência', 'Gestão Pedagógica'),
  ('gestao-pedagogica.diario-classe.parecer', 'Diário — Parecer Descritivo', 'Gestão Pedagógica'),
  ('gestao-pedagogica.diario-classe.indicadores', 'Diário — Avaliação por Indicadores', 'Gestão Pedagógica'),
  ('gestao-pedagogica.diario-classe.avaliacoes', 'Diário — Avaliações Numéricas', 'Gestão Pedagógica'),
  ('gestao-pedagogica.diario-classe.planos', 'Diário — Plano de Aula', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;

-- Auto-grant: perfis que já têm acesso ao diario-classe base ganham todos os sub-recursos
INSERT INTO perfis_permissoes (school_id, perfil_id, recurso_id, visualizar, criar, editar, excluir)
SELECT pp.school_id, pp.perfil_id, r.id, pp.visualizar, pp.criar, pp.editar, pp.excluir
FROM perfis_permissoes pp
JOIN recursos r_base ON r_base.id = pp.recurso_id
CROSS JOIN recursos r
WHERE r_base.codigo = 'gestao-pedagogica.diario-classe'
  AND r.codigo LIKE 'gestao-pedagogica.diario-classe.%'
ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
