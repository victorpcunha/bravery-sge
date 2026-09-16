-- Recurso próprio para o bloqueio da numeração de chamada do Diário de Classe
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('gestao-pedagogica.diario-classe.chamada', 'Diário — Número de Chamada', 'Gestão Pedagógica')
ON CONFLICT (codigo) DO NOTHING;

-- Auto-grant: perfis que já têm acesso ao diario-classe base ganham o novo recurso
INSERT INTO perfis_permissoes (school_id, perfil_id, recurso_id, visualizar, criar, editar, excluir)
SELECT pp.school_id, pp.perfil_id, r.id, pp.visualizar, pp.criar, pp.editar, pp.excluir
FROM perfis_permissoes pp
JOIN recursos r_base ON r_base.id = pp.recurso_id
CROSS JOIN recursos r
WHERE r_base.codigo = 'gestao-pedagogica.diario-classe'
  AND r.codigo = 'gestao-pedagogica.diario-classe.chamada'
ON CONFLICT (perfil_id, recurso_id) DO NOTHING;
