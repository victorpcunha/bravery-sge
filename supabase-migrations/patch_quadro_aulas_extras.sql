-- ============================================
-- BRAVERY SGE - Quadro de Aulas: Aulas Extras (SPEC 030)
-- Blocos por dia letivo extra (ex: sábados letivos)
-- com aulas e intervalos próprios
-- Aplicar via SQL Editor (sem CLI Supabase)
-- ============================================

CREATE TABLE IF NOT EXISTS quadro_aulas_datas_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadro_aula_id UUID NOT NULL REFERENCES quadro_aulas(id) ON DELETE CASCADE,
  data_aula DATE NOT NULL,
  intervalos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (quadro_aula_id, data_aula)
);

CREATE TABLE IF NOT EXISTS quadro_aulas_extras_horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_extra_id UUID NOT NULL REFERENCES quadro_aulas_datas_extras(id) ON DELETE CASCADE,
  horario_inicial TIME NOT NULL,
  horario_final TIME NOT NULL,
  disciplina_id UUID REFERENCES academico_matriz_disciplinas(id) ON DELETE RESTRICT,
  professor_id UUID REFERENCES people(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_extras_datas_quadro ON quadro_aulas_datas_extras(quadro_aula_id);
CREATE INDEX IF NOT EXISTS idx_extras_datas_data ON quadro_aulas_datas_extras(data_aula);
CREATE INDEX IF NOT EXISTS idx_extras_horarios_data ON quadro_aulas_extras_horarios(data_extra_id);
CREATE INDEX IF NOT EXISTS idx_extras_horarios_professor ON quadro_aulas_extras_horarios(professor_id);

-- Trigger updated_at (reaproveita função existente do módulo)
DROP TRIGGER IF EXISTS update_quadro_aulas_datas_extras_updated_at ON quadro_aulas_datas_extras;
CREATE TRIGGER update_quadro_aulas_datas_extras_updated_at
BEFORE UPDATE ON quadro_aulas_datas_extras
FOR EACH ROW
EXECUTE FUNCTION update_quadro_aulas_updated_at();

DROP TRIGGER IF EXISTS update_quadro_aulas_extras_horarios_updated_at ON quadro_aulas_extras_horarios;
CREATE TRIGGER update_quadro_aulas_extras_horarios_updated_at
BEFORE UPDATE ON quadro_aulas_extras_horarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE quadro_aulas_datas_extras IS 'SPEC 030 - Blocos de dias letivos extras (ex: sábados letivos) por quadro de aulas';
COMMENT ON TABLE quadro_aulas_extras_horarios IS 'SPEC 030 - Aulas de dias letivos extras com disciplina/professor';

-- ============================================
-- Frequência das aulas extras (SPEC 030 FR-015)
-- academico_frequencias_aula.horario_id referencia quadro_aulas_horarios(id):
-- ids de quadro_aulas_extras_horarios violariam a FK ao lançar frequência.
-- Remove a FK (mantém NOT NULL + UNIQUE + índices); a integridade passa à
-- camada de aplicação: removerDataExtra bloqueia com frequência lançada e o
-- save usa soft-inativa (paridade com updateQuadroAula). Cálculos de
-- frequência já filtram só horários ativos (boletim.ts), ignorando órfãos.
-- ============================================
ALTER TABLE academico_frequencias_aula DROP CONSTRAINT IF EXISTS academico_frequencias_aula_horario_id_fkey;
