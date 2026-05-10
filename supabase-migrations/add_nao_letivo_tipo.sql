-- Adicionar tipo 'nao_letivo' para marcar dias que não são letivos (sem ser recesso)
ALTER TABLE academico_calendario_eventos 
DROP CONSTRAINT IF EXISTS academico_calendario_eventos_tipo_check,
ADD CONSTRAINT academico_calendario_eventos_tipo_check 
CHECK (tipo IN ('dia_letivo', 'recesso', 'nao_letivo'));