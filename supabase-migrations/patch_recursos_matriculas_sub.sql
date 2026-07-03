-- Sub-recurso para permissões de movimentações de matrículas
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-academica.matriculas.movimentacoes', 'Matrículas — Movimentações', 'Gestão Acadêmica')
ON CONFLICT (codigo) DO NOTHING;

-- Auto-grant aos perfis que já têm acesso a alunos matriculados
INSERT INTO perfis_permissoes (school_id, perfil_id, recurso_id, visualizar, criar, editar, excluir)
SELECT pp.school_id, pp.perfil_id, r.id, pp.visualizar, pp.criar, pp.editar, pp.excluir
FROM perfis_permissoes pp
JOIN recursos r_base ON r_base.id = pp.recurso_id
CROSS JOIN recursos r
WHERE r_base.codigo = 'gestao-academica.matriculas'
  AND r.codigo = 'gestao-academica.matriculas.movimentacoes'
ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
