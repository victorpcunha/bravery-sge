-- ============================================================================
-- SEED DE TESTE (manual, via SQL Editor — NÃO é migration automática)
-- Cria 23 ALUNOS (perfil '{aluno}') + 10 PROFISSIONAIS (perfil '{profissional}')
--
-- COMO USAR:
--   1. Abra o Supabase → SQL Editor → New query
--   2. Cole este arquivo inteiro e clique em Run
--   3. Rode as queries de CONFERÊNCIA no final para validar
--
-- COMPORTAMENTO:
--   - Destino automático: escola com mais pessoas cadastradas
--     (para forçar outra escola, troque o bloco 0 pelo UUID desejado)
--   - CPFs gerados com dígitos verificadores VÁLIDOS (mesma regra do app)
--     e com checagem de colisão (pula CPF já existente na escola)
--   - codigo_pessoa sequencial (max atual + 1, sem furar a unique)
--   - Idempotente: se o seed já foi aplicado, avisa e não duplica
--   - Nomes marcados ("Aluno Teste XX" / "Profissional Teste XX")
--     para facilitar a remoção (ver LIMPEZA no final)
-- ============================================================================

DO $$
DECLARE
  v_school_id   UUID;
  v_school_nome TEXT;
  v_codigo      INTEGER;
  v_seed        INTEGER := 310001000; -- base de 9 dígitos p/ gerar CPFs de teste
  v_base        TEXT;
  v_soma        INTEGER;
  v_r           INTEGER;
  v_d1          INTEGER;
  v_d2          INTEGER;
  v_cpf         TEXT;
  v_nome        TEXT;
  v_nasc        DATE;
  v_sexo        VARCHAR(1);
  v_email       TEXT;
  i             INTEGER;
  v_n_alunos    INTEGER := 0;
  v_n_prof      INTEGER := 0;
BEGIN
  -- --------------------------------------------------------------------------
  -- 0) Escola destino (a que já tem mais pessoas cadastradas)
  --    Para forçar uma escola específica, comente o SELECT abaixo e use:
  --    v_school_id := 'COLE-O-UUID-DA-ESCOLA-AQUI';
  -- --------------------------------------------------------------------------
  SELECT s.id, s.nome_escola
    INTO v_school_id, v_school_nome
  FROM schools s
  ORDER BY (SELECT count(*) FROM people p WHERE p.school_id = s.id) DESC,
           s.created_at ASC NULLS LAST
  LIMIT 1;

  IF v_school_id IS NULL THEN
    RAISE EXCEPTION 'Nenhuma escola encontrada. Cadastre a unidade escolar antes de rodar este seed.';
  END IF;

  RAISE NOTICE 'Escola destino: "%" (%)', v_school_nome, v_school_id;

  -- Idempotência: não duplica se o seed já foi aplicado nesta escola
  IF EXISTS (
    SELECT 1 FROM people
    WHERE school_id = v_school_id
      AND (nome_completo LIKE 'Aluno Teste __'
        OR nome_completo LIKE 'Profissional Teste __')
  ) THEN
    RAISE NOTICE 'Seed já aplicado nesta escola (nomes "Teste" encontrados). Nada a fazer.';
    RETURN;
  END IF;

  SELECT coalesce(max(codigo_pessoa), 0) INTO v_codigo
  FROM people WHERE school_id = v_school_id;

  -- --------------------------------------------------------------------------
  -- 1) 23 ALUNOS
  -- --------------------------------------------------------------------------
  FOR i IN 1..23 LOOP
    -- Gera CPF válido (dígitos verificadores) e livre nesta escola
    LOOP
      v_base := lpad(v_seed::text, 9, '0');

      -- 1º dígito: pesos 10..2
      v_soma := 0;
      FOR d IN 1..9 LOOP
        v_soma := v_soma + substring(v_base FROM d FOR 1)::int * (10 - d);
      END LOOP;
      v_r := v_soma % 11;
      v_d1 := CASE WHEN v_r < 2 THEN 0 ELSE 11 - v_r END;

      -- 2º dígito: pesos 11..3 + d1*2
      v_soma := v_d1 * 2;
      FOR d IN 1..9 LOOP
        v_soma := v_soma + substring(v_base FROM d FOR 1)::int * (12 - d);
      END LOOP;
      v_r := v_soma % 11;
      v_d2 := CASE WHEN v_r < 2 THEN 0 ELSE 11 - v_r END;

      v_cpf := v_base || v_d1::text || v_d2::text;

      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM people
        WHERE school_id = v_school_id AND cpf = v_cpf
      );
      v_seed := v_seed + 1;
      IF v_seed > 399999999 THEN
        RAISE EXCEPTION 'Faixa de CPF do seed esgotada (colisões demais).';
      END IF;
    END LOOP;

    v_codigo := v_codigo + 1;
    v_nome := 'Aluno Teste ' || lpad(i::text, 2, '0');
    v_nasc := DATE '2012-01-15' + ((i * 211) % 2190); -- espalha ~6 anos
    v_sexo := CASE WHEN i % 2 = 0 THEN '2' ELSE '1' END;

    INSERT INTO people (
      school_id, codigo_pessoa, nome_completo, cpf, data_nascimento,
      sexo, perfil, filiacao_declarada, filiacao_1, filiacao_2, ativo
    ) VALUES (
      v_school_id, v_codigo, v_nome, v_cpf, v_nasc,
      v_sexo, '{aluno}',
      '1',
      'Mae Teste ' || lpad(i::text, 2, '0'),
      'Pai Teste ' || lpad(i::text, 2, '0'),
      true
    );

    v_seed := v_seed + 1;
    v_n_alunos := v_n_alunos + 1;
  END LOOP;

  -- --------------------------------------------------------------------------
  -- 2) 10 PROFISSIONAIS (só dados pessoais; o vínculo se completa na tela
  --    de Usuários — mesmo padrão da Importação Inicial)
  -- --------------------------------------------------------------------------
  FOR i IN 1..10 LOOP
    LOOP
      v_base := lpad(v_seed::text, 9, '0');

      v_soma := 0;
      FOR d IN 1..9 LOOP
        v_soma := v_soma + substring(v_base FROM d FOR 1)::int * (10 - d);
      END LOOP;
      v_r := v_soma % 11;
      v_d1 := CASE WHEN v_r < 2 THEN 0 ELSE 11 - v_r END;

      v_soma := v_d1 * 2;
      FOR d IN 1..9 LOOP
        v_soma := v_soma + substring(v_base FROM d FOR 1)::int * (12 - d);
      END LOOP;
      v_r := v_soma % 11;
      v_d2 := CASE WHEN v_r < 2 THEN 0 ELSE 11 - v_r END;

      v_cpf := v_base || v_d1::text || v_d2::text;

      EXIT WHEN NOT EXISTS (
        SELECT 1 FROM people
        WHERE school_id = v_school_id AND cpf = v_cpf
      );
      v_seed := v_seed + 1;
      IF v_seed > 399999999 THEN
        RAISE EXCEPTION 'Faixa de CPF do seed esgotada (colisões demais).';
      END IF;
    END LOOP;

    v_codigo := v_codigo + 1;
    v_nome := 'Profissional Teste ' || lpad(i::text, 2, '0');
    v_nasc := DATE '1975-06-01' + ((i * 733) % 9000);
    v_sexo := CASE WHEN i % 2 = 0 THEN '2' ELSE '1' END;
    v_email := 'profissional.teste' || lpad(i::text, 2, '0') || '@teste.edu.br';

    INSERT INTO people (
      school_id, codigo_pessoa, nome_completo, cpf, data_nascimento,
      sexo, perfil, email, ativo
    ) VALUES (
      v_school_id, v_codigo, v_nome, v_cpf, v_nasc,
      v_sexo, '{profissional}', v_email, true
    );

    v_seed := v_seed + 1;
    v_n_prof := v_n_prof + 1;
  END LOOP;

  RAISE NOTICE 'Seed concluído: % alunos + % profissionais na escola "%".',
    v_n_alunos, v_n_prof, v_school_nome;
END $$;

-- ============================================================================
-- CONFERÊNCIA (rode após o bloco acima, na mesma sessão do SQL Editor)
-- ============================================================================

-- 1) Totais por perfil em cada escola (esperado na escola destino:
--    alunos = 2 existentes + 23 = 25; profissionais = 10)
SELECT s.nome_escola AS escola, t.perfil, count(*) AS total
FROM people p
CROSS JOIN unnest(p.perfil) AS t(perfil)
JOIN schools s ON s.id = p.school_id
WHERE p.ativo = true
GROUP BY 1, 2
ORDER BY 1, 2;

-- 2) Lista só dos registros de teste criados
SELECT codigo_pessoa, nome_completo, cpf, data_nascimento, sexo, perfil, email
FROM people
WHERE nome_completo LIKE 'Aluno Teste __'
   OR nome_completo LIKE 'Profissional Teste __'
ORDER BY perfil, nome_completo;

-- ============================================================================
-- LIMPEZA (opcional — só se os registros de teste NÃO tiverem matrículas,
-- vínculos ou outros lançamentos; o ON DELETE CASCADE apaga dependências)
-- ============================================================================
-- DELETE FROM people
-- WHERE nome_completo LIKE 'Aluno Teste __'
--    OR nome_completo LIKE 'Profissional Teste __';
