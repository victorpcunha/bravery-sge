CREATE TABLE agenda_compromissos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  pessoa_id UUID NOT NULL REFERENCES people(id),
  titulo VARCHAR(200) NOT NULL,
  data_inicial DATE NOT NULL,
  data_final DATE NOT NULL,
  horario_inicial TIME,
  horario_final TIME,
  dia_todo BOOLEAN DEFAULT false,
  categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('reuniao', 'aula', 'formacao', 'outro')),
  detalhes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES people(id),
  updated_by UUID REFERENCES people(id)
);

CREATE INDEX idx_agenda_compromissos_pessoa_data ON agenda_compromissos(pessoa_id, data_inicial, data_final);
CREATE INDEX idx_agenda_compromissos_school ON agenda_compromissos(school_id);
