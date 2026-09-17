-- ============================================
-- BRAVERY SGE - Corrige area_codigo das Disciplinas (INEP Registro 50)
-- ============================================
-- Contexto: a coluna academico_disciplinas.area_codigo estava preenchida
-- com códigos sequenciais (1-5) sem relação com a Tabela de Áreas do
-- Conhecimento do INEP (ex.: Geografia=4, Português=1). Com isso o
-- Registro 50 exportava áreas erradas e a validação "Área não ofertada"
-- disparava indevidamente.
-- Correção pelo NOME oficial (códigos INEP de 2 dígitos).
--
-- Como aplicar: rodar este arquivo no SQL Editor do Supabase.
-- Idempotente: pode rodar mais de uma vez.
-- ============================================

UPDATE academico_disciplinas SET area_codigo = 10 WHERE nome = 'Arte';
UPDATE academico_disciplinas SET area_codigo = 4 WHERE nome = 'Biologia';
UPDATE academico_disciplinas SET area_codigo = 5 WHERE nome = 'Ciências';
UPDATE academico_disciplinas SET area_codigo = 11 WHERE nome = 'Educação Física';
UPDATE academico_disciplinas SET area_codigo = 26 WHERE nome = 'Ensino religioso';
UPDATE academico_disciplinas SET area_codigo = 32 WHERE nome = 'Estágio curricular supervisionado';
UPDATE academico_disciplinas SET area_codigo = 28 WHERE nome = 'Estudos Sociais';
UPDATE academico_disciplinas SET area_codigo = 14 WHERE nome = 'Filosofia';
UPDATE academico_disciplinas SET area_codigo = 2 WHERE nome = 'Física';
UPDATE academico_disciplinas SET area_codigo = 13 WHERE nome = 'Geografia';
UPDATE academico_disciplinas SET area_codigo = 12 WHERE nome = 'História';
UPDATE academico_disciplinas SET area_codigo = 16 WHERE nome = 'Informática/Computação';
UPDATE academico_disciplinas SET area_codigo = 23 WHERE nome = 'Libras';
UPDATE academico_disciplinas SET area_codigo = 7 WHERE nome = 'Língua /Literatura estrangeira - Inglês';
UPDATE academico_disciplinas SET area_codigo = 8 WHERE nome = 'Língua /Literatura estrangeira - Espanhol';
UPDATE academico_disciplinas SET area_codigo = 9 WHERE nome = 'Língua /Literatura estrangeira - outra';
UPDATE academico_disciplinas SET area_codigo = 6 WHERE nome = 'Língua /Literatura Portuguesa';
UPDATE academico_disciplinas SET area_codigo = 27 WHERE nome = 'Língua indígena';
UPDATE academico_disciplinas SET area_codigo = 31 WHERE nome = 'Língua Portuguesa como Segunda Língua';
UPDATE academico_disciplinas SET area_codigo = 30 WHERE nome = 'Língua/Literatura estrangeira - Francês';
UPDATE academico_disciplinas SET area_codigo = 3 WHERE nome = 'Matemática';
UPDATE academico_disciplinas SET area_codigo = 99 WHERE nome = 'Outras áreas do conhecimento';
UPDATE academico_disciplinas SET area_codigo = 33 WHERE nome = 'Projeto de vida';
UPDATE academico_disciplinas SET area_codigo = 1 WHERE nome = 'Química';
UPDATE academico_disciplinas SET area_codigo = 29 WHERE nome = 'Sociologia';
UPDATE academico_disciplinas SET area_codigo = 25 WHERE nome = 'Áreas do conhecimento pedagógicas';
UPDATE academico_disciplinas SET area_codigo = 17 WHERE nome = 'Áreas do conhecimento profissionalizantes';
