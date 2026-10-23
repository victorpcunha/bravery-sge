-- ============================================
-- BRAVERY SGE - Múltiplos perfis de acesso por pessoa
-- A partir desta migration, a fonte de verdade dos perfis
-- de uma pessoa é a tabela people_perfis.
-- people.perfil_id permanece apenas como espelho de
-- compatibilidade (primeiro perfil selecionado).
-- ============================================

CREATE TABLE IF NOT EXISTS people_perfis (
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  perfil_id UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  PRIMARY KEY (person_id, perfil_id)
);

CREATE INDEX IF NOT EXISTS idx_people_perfis_perfil
  ON people_perfis(perfil_id);

CREATE INDEX IF NOT EXISTS idx_people_perfis_school
  ON people_perfis(school_id);

-- Acesso somente via server actions (service_role). Sem policies = nega anon/authenticated.
ALTER TABLE people_perfis ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE people_perfis IS
  'Perfis de acesso vinculados a uma pessoa (N:N). Fonte de verdade para permissões.';

-- Backfill: cada pessoa que já tinha perfil_id passa a ter o vínculo.
INSERT INTO people_perfis (person_id, perfil_id, school_id)
SELECT pe.id, pe.perfil_id, pe.school_id
FROM people pe
JOIN perfis p ON p.id = pe.perfil_id
WHERE pe.perfil_id IS NOT NULL
  AND pe.school_id IS NOT NULL
ON CONFLICT (person_id, perfil_id) DO NOTHING;

COMMENT ON COLUMN people.perfil_id IS
  'DEPRECATED: espelho do primeiro perfil em people_perfis. Use people_perfis para permissões.';
