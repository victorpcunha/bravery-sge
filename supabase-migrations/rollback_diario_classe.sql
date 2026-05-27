-- ============================================
-- BRAVERY SGE - Rollback do Módulo Diário de Classe
-- Desfaz as alterações de diario_classe_completo.sql
-- ============================================

-- 1. Remover índices
DROP INDEX IF EXISTS idx_recuperacoes_aluno;
DROP INDEX IF EXISTS idx_recuperacoes_turma;
DROP INDEX IF EXISTS idx_recuperacoes_school;
DROP INDEX IF EXISTS idx_notas_aluno;
DROP INDEX IF EXISTS idx_notas_turma;
DROP INDEX IF EXISTS idx_notas_disciplina;
DROP INDEX IF EXISTS idx_notas_periodo;
DROP INDEX IF EXISTS idx_notas_school;
DROP INDEX IF EXISTS idx_avaliacoes_indicadores_aluno;
DROP INDEX IF EXISTS idx_avaliacoes_indicadores_indicador;
DROP INDEX IF EXISTS idx_avaliacoes_indicadores_turma;
DROP INDEX IF EXISTS idx_avaliacoes_indicadores_school;
DROP INDEX IF EXISTS idx_pareceres_aluno;
DROP INDEX IF EXISTS idx_pareceres_turma;
DROP INDEX IF EXISTS idx_pareceres_school;
DROP INDEX IF EXISTS idx_frequencia_aulas_turma_data;
DROP INDEX IF EXISTS idx_frequencia_aulas_horario;
DROP INDEX IF EXISTS idx_frequencia_aulas_aluno;
DROP INDEX IF EXISTS idx_frequencia_aulas_school;
DROP INDEX IF EXISTS idx_frequencias_turma_data;
DROP INDEX IF EXISTS idx_frequencias_aluno;
DROP INDEX IF EXISTS idx_frequencias_school;

-- 2. Remover triggers
DROP TRIGGER IF EXISTS recuperacoes_updated_at ON recuperacoes;
DROP TRIGGER IF EXISTS notas_updated_at ON notas;
DROP TRIGGER IF EXISTS avaliacoes_indicadores_updated_at ON avaliacoes_indicadores;
DROP TRIGGER IF EXISTS pareceres_descritivos_updated_at ON pareceres_descritivos;
DROP TRIGGER IF EXISTS frequencia_aulas_updated_at ON frequencia_aulas;
DROP TRIGGER IF EXISTS frequencias_updated_at ON frequencias;

-- 3. Remover coluna numero_chamada de academico_matriculas
DROP INDEX IF EXISTS idx_matriculas_chamada;
ALTER TABLE academico_matriculas DROP COLUMN IF EXISTS numero_chamada;

-- 4. Remover tabelas
DROP TABLE IF EXISTS recuperacoes;
DROP TABLE IF EXISTS notas;
DROP TABLE IF EXISTS avaliacoes_indicadores;
DROP TABLE IF EXISTS pareceres_descritivos;
DROP TABLE IF EXISTS frequencia_aulas;
DROP TABLE IF EXISTS frequencias;

-- 5. Remover a função update_updated_at() se não for usada por outras tabelas
-- (descomente apenas se tiver certeza que nenhuma outra tabela a usa)
-- DROP FUNCTION IF EXISTS update_updated_at();

-- ============================================
-- Fim do rollback
-- ============================================
