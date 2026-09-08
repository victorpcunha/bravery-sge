-- ============================================
-- BRAVERY SGE - Portal do Responsável: Termo LGPD
-- Termo de Uso e Política de Privacidade versionado
-- + registro de aceite por responsável (spec 023)
-- ============================================

CREATE TABLE IF NOT EXISTS portal_termos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  versao INT NOT NULL UNIQUE,
  conteudo TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS portal_aceites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  responsavel_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  termo_id UUID NOT NULL REFERENCES portal_termos(id) ON DELETE RESTRICT,
  aceito_em TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(responsavel_id, termo_id)
);

CREATE INDEX IF NOT EXISTS idx_portal_aceites_responsavel ON portal_aceites(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_portal_termos_ativo ON portal_termos(ativo) WHERE ativo = TRUE;

COMMENT ON TABLE portal_termos IS 'Versões do Termo de Uso e Política de Privacidade do Portal do Responsável (uma ativa por vez)';
COMMENT ON TABLE portal_aceites IS 'Registro LGPD de aceite do termo por responsável (responsável + versão + data/hora)';
COMMENT ON COLUMN portal_termos.versao IS 'Versão incremental exibida ao responsável; nova versão exige novo aceite';
COMMENT ON COLUMN portal_aceites.aceito_em IS 'Data/hora do clique em Aceitar (FR-004)';

-- Seed v1: texto em linguagem clara e simples cobrindo FR-006 (a–d)
INSERT INTO portal_termos (versao, conteudo, ativo)
SELECT 1,
'TERMO DE USO E POLÍTICA DE PRIVACIDADE — PORTAL DO RESPONSÁVEL

1. Para que usamos os dados
Os dados do aluno e do responsável exibidos neste portal são utilizados exclusivamente para fins escolares: acompanhamento de frequência, notas, horários, ocorrências e comunicados da escola.

2. Compartilhamento
Os dados não são compartilhados com terceiros sem a sua autorização, exceto quando exigido por lei ou por órgãos oficiais da educação.

3. Seus direitos
Você tem o direito de solicitar a correção ou a exclusão dos dados a qualquer momento. Para isso, entre em contato diretamente com a secretaria da escola.

4. Segurança
Os dados são armazenados de forma segura, com acesso restrito à escola e aos responsáveis vinculados ao aluno. Nunca compartilhe sua senha com outras pessoas. Caso esqueça sua senha, procure a secretaria da escola para gerar uma nova.

Ao clicar em "Aceitar", você confirma que leu este termo e autoriza o uso dos dados conforme descrito acima.',
TRUE
WHERE NOT EXISTS (SELECT 1 FROM portal_termos WHERE versao = 1);
