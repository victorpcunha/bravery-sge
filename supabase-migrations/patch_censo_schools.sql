-- ============================================
-- BRAVERY SGE - Censo INEP 2026: Campos da Escola
-- Registros 00 (Dados Cadastrais) e 10 (Infraestrutura)
-- ============================================

-- ============================================
-- CORREÇÕES DE TIPO
-- ============================================

-- regulamentacao: BOOLEAN -> VARCHAR(1)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schools' AND column_name = 'regulamentacao'
    AND data_type = 'boolean'
  ) THEN
    ALTER TABLE schools
      ALTER COLUMN regulamentacao TYPE VARCHAR(1)
      USING CASE WHEN regulamentacao = true THEN '1' ELSE '0' END;
  END IF;
END $$;

-- unidade_vinculada: VARCHAR(20) -> VARCHAR(1)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'schools' AND column_name = 'unidade_vinculada'
    AND character_maximum_length > 1
  ) THEN
    ALTER TABLE schools
      ALTER COLUMN unidade_vinculada TYPE VARCHAR(1)
      USING LEFT(unidade_vinculada, 1);
  END IF;
END $$;

-- ============================================
-- GRUPO ENDEREÇO (Registro 00 - campos 4-13)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS cep VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS municipio VARCHAR(7);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS distrito VARCHAR(2);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS endereco VARCHAR(100);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS numero VARCHAR(10);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS complemento VARCHAR(20);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS bairro VARCHAR(50);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS ddd VARCHAR(2);

-- ============================================
-- GRUPO ANO LETIVO (Registro 00 - campos 14-15)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS data_inicio_ano DATE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS data_fim_ano DATE;

-- ============================================
-- GRUPO ADMINISTRATIVO (Registro 00 - campos 16-20)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_orgao_regional VARCHAR(5);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS orgao_secretaria_educacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS orgao_seguranca BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS orgao_saude BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS orgao_outro BOOLEAN;

-- ============================================
-- GRUPO MANTENEDORA (Registro 00 - campos 21-26)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_empresa BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_sindicatos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_ong BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_sem_fins_lucrativos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_sistema_s BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mant_oscip BOOLEAN;

-- ============================================
-- GRUPO PARCERIAS E CONVÊNIOS (Registro 00 - campos 27-40)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS parceria_estadual BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS parceria_municipal BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_colaboracao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_fomento BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_cooperacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_prestacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_coop_tecnica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_est_consorcio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_colaboracao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_fomento BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_cooperacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_prestacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_coop_tecnica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS contr_mun_consorcio BOOLEAN;

-- ============================================
-- GRUPO REGULAMENTAÇÃO (Registro 00 - campos 41-43)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS esfera_regulamentacao VARCHAR(1);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_escola_sede VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_ies VARCHAR(9);

-- ============================================
-- GRUPO CNPJ (Registro 00 - campos 44-45)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS cnpj_mantenedora VARCHAR(14);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cnpj_escola VARCHAR(14);

-- ============================================
-- GRUPO LOCAIS DE FUNCIONAMENTO (Registro 10 - campos 1-13)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_predio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_salas_outra BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_galpao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_socioeducativa BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_prisional BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS local_outros BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS forma_ocupacao VARCHAR(1);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS predio_compartilhado BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_1 VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_2 VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_3 VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_4 VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_5 VARCHAR(8);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_codigo_6 VARCHAR(8);

-- ============================================
-- GRUPO ÁGUA / ENERGIA / ESGOTO / LIXO (Registro 10 - campos 14-37)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_potavel BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_rede_publica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_poco_artesiano BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_cacimba BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_fonte BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_carro_pipa BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS agua_inexistente BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS energia_rede_publica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS energia_gerador BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS energia_renovavel BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS energia_inexistente BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS esgoto_rede_publica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS esgoto_fossa_septica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS esgoto_fossa_rudimentar BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS esgoto_inexistente BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_coleta BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_queima BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_enterra BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_destinacao_licenciada BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_outra_area BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_separacao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_reaproveitamento BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_reciclagem BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS lixo_sem_tratamento BOOLEAN;

-- ============================================
-- GRUPO DEPENDÊNCIAS FÍSICAS (Registro 10 - campos 38-77)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_almoxarifado BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_area_verde BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_auditorio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_banheiro BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_banheiro_pcd BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_banheiro_infantil BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_banheiro_funcionarios BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_vestiario BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_biblioteca BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_cozinha BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_despensa BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_dormitorio_aluno BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_dormitorio_professor BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_lab_ciencias BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_lab_informatica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_lab_robotica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_lab_profissional BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_parque_infantil BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_patio_coberto BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_patio_descoberto BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_piscina BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_quadra_coberta BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_quadra_descoberta BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_refeitorio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_repouso BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_artes BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_musica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_danca BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_multiuso BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_terreirao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_viveiro BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_diretoria BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_leitura BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_professores BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_aee BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_sala_secretaria BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_oficinas BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_estudio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_horta BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS dep_nenhuma BOOLEAN;

-- ============================================
-- GRUPO ACESSIBILIDADE (Registro 10 - campos 78-87)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_corrimao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_elevador BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_pisos_tateis BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_portas_80cm BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_rampas BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_sinalizacao_luminosa BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_sinalizacao_sonora BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_sinalizacao_tatil BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_sinalizacao_visual BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS acess_nenhum BOOLEAN;

-- ============================================
-- GRUPO SALAS DE AULA (Registro 10 - campos 88-92)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_salas_dentro INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_salas_fora INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_salas_climatizadas INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_salas_acessiveis INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_salas_leitura INTEGER;

-- ============================================
-- GRUPO EQUIPAMENTOS (Registro 10 - campos 93-107)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_antena_parabolica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_computadores BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_copiadora BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_impressora BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_impressora_multifuncional BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_scanner BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS eq_nenhum BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_dvd INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_som INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_tv INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_lousa_digital INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_projetor INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_desktop_alunos INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_portateis_alunos INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS qtd_tablets_alunos INTEGER;

-- ============================================
-- GRUPO INTERNET (Registro 10 - campos 108-115)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_administrativo BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_ensino BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_alunos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_comunidade BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_inexistente BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_equip_alunos VARCHAR(1);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS internet_banda_larga BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS rede_local VARCHAR(1);

-- ============================================
-- GRUPO PROFISSIONAIS POR FUNÇÃO (Registro 10 - campos 116-135)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_agronomos INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_assistente_social INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_aux_admin INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_aux_servicos INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_bibliotecario INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_bombeiro INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_coordenador INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_fonoaudiologo INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_nutricionista INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_psicologo INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_cozinheiro INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_supervisao INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_secretario INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_seguranca INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_tecnicos INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_vice_diretor INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_orientador_comun INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_tradutor_libras INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_revisor_braille INTEGER;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS prof_nenhum INTEGER;

-- ============================================
-- GRUPO MATERIAIS PEDAGÓGICOS (Registro 10 - campos 136-155)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_acervo_multimidia BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_brinquedos_infantil BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_cientificos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_amplificacao_som BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_audiovisuais BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_horta BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_instrumentos_musicais BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_jogos_educativos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_kits_robotica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_atividades_culturais BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_emocional BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_profissional BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_pratica_desportiva BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_bilingue_surdos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_indigena BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_etnico_raciais BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_campo BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_quilombola BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_educacao_especial BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS mat_nenhum BOOLEAN;

-- ============================================
-- GRUPO LÍNGUAS (Registro 10 - campos 156-160)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS lingua_ensino VARCHAR(1);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_lingua_indigena_1 VARCHAR(5);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_lingua_indigena_2 VARCHAR(5);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS codigo_lingua_indigena_3 VARCHAR(5);

-- ============================================
-- GRUPO GESTÃO ESCOLAR (Registro 10 - campos 161-189)
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS exame_selecao BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_ppi BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_renda BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_escola_publica BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_pcd BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_outros BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS cota_nenhum BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS site_blog BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS compartilha_espacos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS usa_entorno BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_associacao_pais BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_associacao_mestres BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_conselho_escolar BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_gremio BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_outros BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS org_nenhum BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS ppp_atualizado VARCHAR(1);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS educacao_ambiental BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_conteudo BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_componente BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_eixo BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_eventos BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_transversal BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS amb_nenhum BOOLEAN;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS alimentacao_escolar BOOLEAN;

-- ============================================
-- FIM
-- ============================================
