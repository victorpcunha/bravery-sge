# Data Model: Histórico Escolar — Painel do Aluno

**Feature**: `004-historico-escolar`

## Entity: HistoricoManualDisciplina (NEW)

Tabela: `historico_manual_disciplinas`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| `historico_manual_id` | UUID | NOT NULL, FK → historico_manual(id) ON DELETE CASCADE | Vínculo com o histórico manual |
| `disciplina_id` | UUID | NOT NULL, FK → academico_disciplinas(id) ON DELETE RESTRICT | Disciplina do sistema |
| `media_final` | DECIMAL(5,2) | NOT NULL | Média final na disciplina |
| `carga_horaria_anual` | INTEGER | NULLABLE | Carga horária anual em horas |
| `parte_diversificada` | BOOLEAN | NOT NULL, DEFAULT false | Se é parte diversificada (true) ou BNCC (false) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de criação |

**Indexes**: `idx_hmd_historico` ON `historico_manual_id`

**State transitions**: N/A — registro imutável após criação. Deleção via CASCADE do registro pai.

## Entity: HistoricoManual (MODIFIED)

Tabela: `historico_manual`

| Field | Type | Change |
|-------|------|--------|
| `estado` | VARCHAR(2) | **NEW** — UF do estado onde o aluno estudou |

Existing fields preserved: `id`, `person_id`, `school_id`, `ano_letivo_id`, `carga_horaria`, `dias_letivos`, `media_aprovacao`, `municipio`, `unidade_escolar`, `etapa_ensino_id`, `situacao`, `observacoes`, `created_by`, `updated_by`, `created_at`, `updated_at`.

## Query Patterns

### Notas detalhadas por matrícula

```text
Source: academico_notas
Filter: aluno_id = :alunoId, turma_id = :turmaId
Group by: disciplina_id, periodo
Supplement: academico_recuperacoes (substitui nota original do período)
Supplement: academico_frequencias_dia (total de faltas por disciplina)
```

### Indicadores avaliados por matrícula

```text
Source: academico_avaliacoes_indicadores
Join: indicadores_avaliacao (via indicador_id)
Join: indicadores_niveis (via nivel_id)
Filter: aluno_id = :alunoId, turma_id = :turmaId
Group by: disciplina_id, indicador_id, periodo
```

### Histórico manual com disciplinas

```text
Source: historico_manual
Join: academico_anos_letivos (via ano_letivo_id)
Join: academico_etapas_ensino (via etapa_ensino_id)
Left Join: historico_manual_disciplinas (via historico_manual_id)
Left Join: academico_disciplinas (via disciplina_id)
Filter: person_id = :alunoId
Aggregate: json_agg para disciplinas
```

## Entity Relationships

```text
historico_manual
├── 1:N → historico_manual_disciplinas (CASCADE delete)
│            └── FK → academico_disciplinas (RESTRICT delete)
├── FK → academico_anos_letivos
├── FK → academico_etapas_ensino
└── FK → people (person_id)

Matrícula do Sistema (academico_matriculas)
├── FK → academico_anos_letivos
├── FK → turmas
│        └── FK → academico_etapas_ensino
└── relaciona com:
     ├── academico_notas (aluno_id + turma_id + disciplina_id + periodo)
     ├── academico_recuperacoes (aluno_id + turma_id + disciplina_id + periodo)
     ├── academico_frequencias_dia (aluno_id + turma_id)
     ├── academico_avaliacoes_indicadores (aluno_id + turma_id + indicador_id + periodo)
     │    └── FK → indicadores_avaliacao
     │         └── 1:N → indicadores_niveis
     └── turmas_disciplinas (turma_id)
          └── FK → academico_matriz_disciplinas
               └── FK → academico_disciplinas
```

## Migration SQL

```sql
-- 004_historico_escolar.sql

-- 1. Adicionar coluna estado
ALTER TABLE historico_manual ADD COLUMN IF NOT EXISTS estado VARCHAR(2);

-- 2. Criar tabela de disciplinas do histórico manual
CREATE TABLE IF NOT EXISTS historico_manual_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historico_manual_id UUID NOT NULL REFERENCES historico_manual(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES academico_disciplinas(id) ON DELETE RESTRICT,
  media_final DECIMAL(5,2) NOT NULL,
  carga_horaria_anual INTEGER,
  parte_diversificada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hmd_historico ON historico_manual_disciplinas(historico_manual_id);

COMMENT ON TABLE historico_manual_disciplinas IS 'Disciplinas vinculadas a registros manuais de histórico escolar';
COMMENT ON COLUMN historico_manual.estado IS 'UF (Unidade Federativa) onde o aluno estudou';
```
