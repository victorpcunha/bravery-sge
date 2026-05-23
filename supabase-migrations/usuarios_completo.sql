-- ============================================
-- Migration: Usuários - Perfil, Responsáveis e Campos Faltantes
-- ============================================

-- Adicionar colunas faltantes na tabela people
ALTER TABLE people ADD COLUMN IF NOT EXISTS perfil TEXT[] DEFAULT '{}';
-- Caso a coluna já exista como VARCHAR (migração anterior), alterar o tipo
ALTER TABLE people ALTER COLUMN perfil TYPE TEXT[] USING CASE WHEN perfil IS NULL THEN '{}' ELSE ARRAY[perfil] END;
ALTER TABLE people ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE people ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Campos de contato para Responsável
ALTER TABLE people ADD COLUMN IF NOT EXISTS telefone_celular VARCHAR(11);
ALTER TABLE people ADD COLUMN IF NOT EXISTS telefone_fixo VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(11);

-- Formação Continuada - campos faltantes (Registro 30 - 103 a 106)
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_direitos_crianca BOOLEAN DEFAULT FALSE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_etnico_raciais BOOLEAN DEFAULT FALSE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_gestao_escolar BOOLEAN DEFAULT FALSE;
ALTER TABLE people ADD COLUMN IF NOT EXISTS form_outros BOOLEAN DEFAULT FALSE;

-- ============================================
-- Tabela: responsavel_alunos
-- ============================================
CREATE TABLE IF NOT EXISTS responsavel_alunos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  responsavel_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  aluno_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tipo_vinculo VARCHAR(1) NOT NULL DEFAULT '3', -- 1-Pai, 2-Mãe, 3-Resp.Legal, 4-Tutor, 5-Outro
  principal BOOLEAN DEFAULT FALSE,
  autorizado_retirar BOOLEAN DEFAULT TRUE,
  autorizado_boleto BOOLEAN DEFAULT TRUE,
  receber_comunicados BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(responsavel_id, aluno_id)
);

CREATE INDEX IF NOT EXISTS idx_resp_aluno ON responsavel_alunos(aluno_id);
CREATE INDEX IF NOT EXISTS idx_resp_responsavel ON responsavel_alunos(responsavel_id);

-- ============================================
-- Triggers para updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_people_updated_at ON people;
CREATE TRIGGER set_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_responsavel_alunos_updated_at ON responsavel_alunos;
CREATE TRIGGER set_responsavel_alunos_updated_at
  BEFORE UPDATE ON responsavel_alunos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Campos de endereço detalhado
-- ============================================
ALTER TABLE people ADD COLUMN IF NOT EXISTS bairro VARCHAR(255);
ALTER TABLE people ADD COLUMN IF NOT EXISTS logradouro VARCHAR(255);
ALTER TABLE people ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE people ADD COLUMN IF NOT EXISTS complemento VARCHAR(255);
ALTER TABLE people ADD COLUMN IF NOT EXISTS referencia VARCHAR(255);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE responsavel_alunos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "responsavel_alunos_school_isolation" ON responsavel_alunos;
CREATE POLICY "responsavel_alunos_school_isolation" ON responsavel_alunos
  USING (
    responsavel_id IN (SELECT id FROM people WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()))
    OR
    aluno_id IN (SELECT id FROM people WHERE school_id IN (SELECT school_id FROM user_schools WHERE user_id = auth.uid()))
  );
