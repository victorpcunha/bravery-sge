-- Acesso ao Portal do Responsável (spec 022): flag operacional, fora do Censo.
-- A senha vive exclusivamente no Supabase Auth; esta coluna só indica se o
-- responsável possui credencial de portal ativa (login = people.email).
ALTER TABLE people ADD COLUMN IF NOT EXISTS portal_acesso_habilitado BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN people.portal_acesso_habilitado IS
  'Define se o responsável possui acesso ao Portal do Responsável (login = people.email). Senha vive no Supabase Auth.';
