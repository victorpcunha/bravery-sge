-- ============================================
-- BRAVERY SGE - Recursos
-- Tabela de recursos/módulos do sistema
-- para controle de permissões
-- ============================================

CREATE TABLE IF NOT EXISTS recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(100) NOT NULL UNIQUE,
  nome VARCHAR(150) NOT NULL,
  modulo VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_recursos_modulo ON recursos(modulo);
CREATE INDEX IF NOT EXISTS idx_recursos_ativo ON recursos(ativo);

-- Comentários
COMMENT ON TABLE recursos IS 'Recursos/módulos do sistema para controle de permissões';

-- Seed dos recursos do sistema
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('dashboard', 'Dashboard', 'Dashboard'),
  ('escolas', 'Escola', 'Escola'),
  ('docentes', 'Docentes', 'Docentes'),
  ('gestao-usuarios.usuarios', 'Usuários', 'Gestão de Usuários'),
  ('gestao-usuarios.funcoes', 'Funções', 'Gestão de Usuários'),
  ('gestao-usuarios.perfis', 'Perfis e Permissões', 'Gestão de Usuários'),
  ('gestao-turmas.turmas', 'Turmas', 'Gestão de Turmas'),
  ('gestao-turmas.quadro-aulas', 'Quadro de Aulas', 'Gestão de Turmas'),
  ('matriculas', 'Matrículas', 'Matrículas'),
  ('gestao-academica.estrutura-academica', 'Estrutura Acadêmica', 'Gestão Acadêmica'),
  ('gestao-academica.metodos', 'Métodos de Avaliação', 'Gestão Acadêmica'),
  ('gestao-academica.matriculas', 'Alunos Matriculados', 'Gestão Acadêmica'),
  ('gestao-pedagogica.disciplinas', 'Disciplinas', 'Gestão Pedagógica'),
  ('gestao-pedagogica.indicadores', 'Indicadores de Avaliação', 'Gestão Pedagógica'),
  ('bncc.consulta', 'Consulta da BNCC', 'BNCC'),
  ('bncc.campos-experiencia', 'Campos de Experiência', 'BNCC'),
  ('bncc.objetivos', 'Objetivos de Aprendizagem', 'BNCC'),
  ('bncc.habilidades', 'Habilidades', 'BNCC'),
  ('bncc.objetos-conhecimento', 'Objetos de Conhecimento', 'BNCC'),
  ('bncc.unidades-tematicas', 'Unidades Temáticas', 'BNCC'),
  ('bncc.areas-conhecimento', 'Áreas do Conhecimento', 'BNCC'),
  ('bncc.competencias-habilidades', 'Competências e Habilidades', 'BNCC')
ON CONFLICT (codigo) DO NOTHING;
