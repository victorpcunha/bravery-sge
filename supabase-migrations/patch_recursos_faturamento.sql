-- Recursos do módulo Gestão de Faturamento (spec 043)
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('faturamento.visao-geral', 'Faturamento — Visão Geral', 'Faturamento'),
  ('faturamento.cobrancas', 'Faturamento — Cobranças', 'Faturamento'),
  ('faturamento.configuracao', 'Faturamento — Configuração', 'Faturamento')
ON CONFLICT (codigo) DO NOTHING;

-- Auto-grant aos perfis que já operam alunos matriculados
INSERT INTO perfis_permissoes (school_id, perfil_id, recurso_id, visualizar, criar, editar, excluir)
SELECT pp.school_id, pp.perfil_id, r.id, pp.visualizar, pp.criar, pp.editar, pp.excluir
FROM perfis_permissoes pp
JOIN recursos r_base ON r_base.id = pp.recurso_id
CROSS JOIN recursos r
WHERE r_base.codigo = 'gestao-academica.matriculas'
  AND r.codigo IN ('faturamento.visao-geral', 'faturamento.cobrancas', 'faturamento.configuracao')
ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
