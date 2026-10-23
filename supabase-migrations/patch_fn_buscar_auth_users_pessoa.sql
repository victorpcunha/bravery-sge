-- ============================================
-- BRAVERY SGE - Localizar TODAS as credenciais Auth de uma pessoa
-- A versão anterior retornava apenas 1 registro (LIMIT 1), o que
-- impedia distinguir credencial do sistema x credencial do portal
-- e deixava e-mails órfãos ao excluir a pessoa.
-- ============================================

-- Garante que a assinatura/retorno antigos não impeçam a substituição.
DROP FUNCTION IF EXISTS public.fn_buscar_auth_user_por_pessoa(UUID);

CREATE OR REPLACE FUNCTION public.fn_buscar_auth_user_por_pessoa(p_person_id UUID)
RETURNS TABLE (user_id UUID, email TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT id, email::text
  FROM auth.users
  WHERE raw_user_meta_data->>'person_id' = p_person_id::text;
$$;

-- Somente server actions (service_role) consultam credenciais Auth.
REVOKE ALL ON FUNCTION public.fn_buscar_auth_user_por_pessoa(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_buscar_auth_user_por_pessoa(UUID) TO service_role;
