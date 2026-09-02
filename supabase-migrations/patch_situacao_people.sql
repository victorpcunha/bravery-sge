-- ============================================
-- BRAVERY SGE - Situação do Usuário (Card Situação)
-- Colunas internas de inativação (não exportadas pelo Censo)
-- ============================================

ALTER TABLE people
  ADD COLUMN IF NOT EXISTS data_inativacao DATE,
  ADD COLUMN IF NOT EXISTS motivo_inativacao VARCHAR(20)
    CHECK (motivo_inativacao IN ('falecimento', 'solicitacao_pessoa'));

COMMENT ON COLUMN people.data_inativacao IS 'Data em que o usuário foi inativado (uso interno, não exportado pelo Censo)';
COMMENT ON COLUMN people.motivo_inativacao IS 'Motivo da inativação: falecimento ou solicitacao_pessoa (uso interno, não exportado pelo Censo)';

-- ============================================
-- RPC: localizar auth.users pelo person_id (user_metadata)
-- Usado para bloquear/liberar login quando a pessoa é inativada/reativada
-- ============================================

CREATE OR REPLACE FUNCTION public.fn_buscar_auth_user_por_pessoa(p_person_id UUID)
RETURNS TABLE (user_id UUID, email TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id, email
  FROM auth.users
  WHERE raw_user_meta_data->>'person_id' = p_person_id::text
  LIMIT 1;
$$;