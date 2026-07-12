-- Adiciona 'periodo_avaliativo' ao CHECK constraint de tipo em academico_calendario_eventos
ALTER TABLE academico_calendario_eventos DROP CONSTRAINT IF EXISTS academico_calendario_eventos_tipo_check;
ALTER TABLE academico_calendario_eventos ADD CONSTRAINT academico_calendario_eventos_tipo_check CHECK (tipo IN ('dia_letivo', 'recesso', 'nao_letivo', 'periodo_avaliativo'));
