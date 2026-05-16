-- ============================================
-- CORREÇÃO: ACENTUAÇÃO CORROMPIDA
-- ============================================
-- Usa REPLACE para cada padrão de caractere corrompido
-- Seguro: REPLACE só age onde o padrão existe

CREATE OR REPLACE FUNCTION fix_text(t TEXT) RETURNS TEXT AS $$
BEGIN
  IF t IS NULL THEN RETURN NULL; END IF;
  -- Pares específicos que indicam dupla codificação
  t := REPLACE(t, 'Ã¡', 'á');
  t := REPLACE(t, 'Ã©', 'é');
  t := REPLACE(t, 'Ã­', 'í');
  t := REPLACE(t, 'Ã³', 'ó');
  t := REPLACE(t, 'Ãº', 'ú');
  t := REPLACE(t, 'Ã£', 'ã');
  t := REPLACE(t, 'Ãµ', 'õ');
  t := REPLACE(t, 'Ã¢', 'â');
  t := REPLACE(t, 'Ãª', 'ê');
  t := REPLACE(t, 'Ã´', 'ô');
  t := REPLACE(t, 'Ã§', 'ç');
  t := REPLACE(t, 'Ã ', 'à');
  t := REPLACE(t, 'Ã¬', 'ì');
  t := REPLACE(t, 'Ã²', 'ò');
  t := REPLACE(t, 'Ã¹', 'ù');
  t := REPLACE(t, 'Ã¼', 'ü');
  t := REPLACE(t, 'Ã¤', 'ä');
  t := REPLACE(t, 'Ã«', 'ë');
  t := REPLACE(t, 'Ã¯', 'ï');
  t := REPLACE(t, 'Ã¶', 'ö');
  t := REPLACE(t, 'Ã±', 'ñ');
  t := REPLACE(t, 'Ã¡', 'Á'); -- uppercase
  t := REPLACE(t, 'Ã‰', 'É');
  t := REPLACE(t, 'Ã', 'Í');
  t := REPLACE(t, 'Ã“', 'Ó');
  t := REPLACE(t, 'Ãš', 'Ú');
  t := REPLACE(t, 'Ãƒ', 'Ã');
  t := REPLACE(t, 'Ã‚', 'Â');
  t := REPLACE(t, 'ÃŠ', 'Ê');
  t := REPLACE(t, 'Ã”', 'Ô');
  t := REPLACE(t, 'Ã‡', 'Ç');
  -- Combinações comuns
  t := REPLACE(t, 'Ã§Ã£o', 'ção');
  t := REPLACE(t, 'Ã§Ãµes', 'ções');
  t := REPLACE(t, 'Ã§Ã£', 'çã');
  t := REPLACE(t, 'Ã£o', 'ão');
  t := REPLACE(t, 'Ãµes', 'ões');
  t := REPLACE(t, 'Ãªncia', 'ência');
  t := REPLACE(t, 'Ã¡rio', 'ário');
  RETURN t;
END;
$$ LANGUAGE plpgsql;

-- Aplicar correção nas tabelas acadêmicas
UPDATE academico_anos_letivos SET descricao = fix_text(descricao);
UPDATE academico_calendarios SET descricao = fix_text(descricao);
UPDATE academico_calendario_eventos SET descricao = fix_text(descricao);
UPDATE academico_etapas_ensino SET etapa_nome = fix_text(etapa_nome);
UPDATE academico_disciplinas SET nome = fix_text(nome), nome_abreviado = fix_text(nome_abreviado);

-- Tabelas BNCC
UPDATE bncc_areas_conhecimento SET nome = fix_text(nome), descricao = fix_text(descricao);
UPDATE bncc_competencias SET descricao = fix_text(descricao);
UPDATE bncc_habilidades_medio SET descricao = fix_text(descricao);

DROP FUNCTION IF EXISTS fix_text;
