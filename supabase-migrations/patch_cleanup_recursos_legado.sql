-- Desativar recursos legados que não possuem página correspondente no sistema
UPDATE recursos SET ativo = false WHERE codigo = 'docentes';
UPDATE recursos SET ativo = false WHERE codigo = 'matriculas';
