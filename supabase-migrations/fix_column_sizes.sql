-- ============================================
-- Migration: Aumentar tamanho de colunas VARCHAR
-- Cursos superiores, IES, áreas
-- ============================================

ALTER TABLE people ALTER COLUMN curso_superior_1 TYPE VARCHAR(20);
ALTER TABLE people ALTER COLUMN curso_superior_2 TYPE VARCHAR(20);
ALTER TABLE people ALTER COLUMN curso_superior_3 TYPE VARCHAR(20);

ALTER TABLE people ALTER COLUMN ies_1 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN ies_2 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN ies_3 TYPE VARCHAR(10);

ALTER TABLE people ALTER COLUMN area_pedagogica_1 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN area_pedagogica_2 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN area_pedagogica_3 TYPE VARCHAR(10);

ALTER TABLE people ALTER COLUMN pos_area_1 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN pos_area_2 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN pos_area_3 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN pos_area_4 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN pos_area_5 TYPE VARCHAR(10);
ALTER TABLE people ALTER COLUMN pos_area_6 TYPE VARCHAR(10);

ALTER TABLE people ALTER COLUMN povo_indigena TYPE VARCHAR(10);
