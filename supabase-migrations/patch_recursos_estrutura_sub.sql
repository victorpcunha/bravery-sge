-- Sub-recursos para permissões granulares da Estrutura Acadêmica (separado por abas)
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-academica.estrutura-academica.calendarios', 'Estrutura — Calendários', 'Gestão Acadêmica'),
  ('gestao-academica.estrutura-academica.etapas', 'Estrutura — Etapas', 'Gestão Acadêmica'),
  ('gestao-academica.estrutura-academica.matrizes', 'Estrutura — Matrizes', 'Gestão Acadêmica')
ON CONFLICT (codigo) DO NOTHING;

-- Auto-grant aos perfis que já têm acesso à estrutura acadêmica base
INSERT INTO perfis_permissoes (school_id, perfil_id, recurso_id, visualizar, criar, editar, excluir)
SELECT pp.school_id, pp.perfil_id, r.id, pp.visualizar, pp.criar, pp.editar, pp.excluir
FROM perfis_permissoes pp
JOIN recursos r_base ON r_base.id = pp.recurso_id
CROSS JOIN recursos r
WHERE r_base.codigo = 'gestao-academica.estrutura-academica'
  AND r.codigo LIKE 'gestao-academica.estrutura-academica.%'
ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
