-- Adiciona campos de contato extra para o cadastro de pessoas (não exportados ao Censo)
ALTER TABLE people ADD COLUMN IF NOT EXISTS telefone_secundario VARCHAR(11);
ALTER TABLE people ADD COLUMN IF NOT EXISTS email_responsavel VARCHAR(255);
