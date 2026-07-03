-- Adiciona campos extras de Curso Superior no cadastro de Profissionais
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_situacao_1 VARCHAR(20);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_situacao_2 VARCHAR(20);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_situacao_3 VARCHAR(20);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_termino_1 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_termino_2 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_termino_3 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_inicio_1 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_inicio_2 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_data_inicio_3 VARCHAR(10);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_carga_horaria_1 VARCHAR(7);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_carga_horaria_2 VARCHAR(7);
ALTER TABLE people ADD COLUMN IF NOT EXISTS curso_carga_horaria_3 VARCHAR(7);
