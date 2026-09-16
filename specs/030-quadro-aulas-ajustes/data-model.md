# Data Model: Quadro de Aulas — Ajustes + Aulas Extras (030)

**Spec**: `spec.md` · **Plan**: `plan.md`

## 1. DDL (1 migration, via SQL Editor)

### M-01 `patch_quadro_aulas_extras.sql` (NEW)

```sql
CREATE TABLE IF NOT EXISTS quadro_aulas_datas_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadro_aula_id UUID NOT NULL REFERENCES quadro_aulas(id) ON DELETE CASCADE,
  data_aula DATE NOT NULL,
  intervalos JSONB DEFAULT '[]'::jsonb,          -- [{hora_inicial, hora_final}], mesmo shape do quadro
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

CREATE INDEX IF NOT EXISTS idx_extras_datas_quadro ON quadro_aulas_datas_extras(quadro_aula_id);
CREATE INDEX IF NOT EXISTS idx_extras_datas_data ON quadro_aulas_datas_extras(data_aula);
CREATE INDEX IF NOT EXISTS idx_extras_horarios_data ON quadro_aulas_extras_horarios(data_extra_id);
CREATE INDEX IF NOT EXISTS idx_extras_horarios_professor ON quadro_aulas_extras_horarios(professor_id);
```

Espelho de `quadro_aulas.sql`: `intervalos` como JSONB no bloco; horários com `disciplina_id→matriz RESTRICT`, `professor_id→people SET NULL`, `ativo` (soft-inativa+reinsere no save, igual `updateQuadroAula:229`). `CASCADE` garante que `deleteQuadroAula` limpa extras sem código adicional.

Sem alteração em `quadro_aulas` / `quadro_aulas_horarios`. Coluna `quadro_aulas.status` **não** é tocada — vira legado de exibição (FR-003 calcula na leitura).

## 2. Status derivado (sem DDL)

```ts
// proposta: src/lib/quadro-status.ts (ou dentro de quadro-aulas.ts)
function resolverStatusQuadro(
  q: { status: string; data_inicial: string; data_final: string },
  hojeRef?: string  // 'YYYY-MM-DD', default = hoje local; injetável p/ reproduzir o bug
): 'futuro' | 'ativo' | 'encerrado' | 'inativo' {
  if (q.status === 'inativo') return 'inativo'
  const hoje = hojeRef || hojeLocal()       // construir via getFullYear/getMonth/getDate, nunca new Date('YYYY-MM-DD')
  const ini = q.data_inicial?.slice(0, 10)
  const fim = q.data_final?.slice(0, 10)
  if (!ini || !fim) return 'futuro'         // fallback legado
  if (hoje < ini) return 'futuro'
  if (hoje > fim) return 'encerrado'
  return 'ativo'
}
```

Caso do bug: `ini='2026-02-09', fim='2026-12-11', hojeRef='2026-08-30'` → `'ativo'`. Comparação lexicográfica de `YYYY-MM-DD` dispensa `Date` (sem shift UTC).

## 3. Origem dos dias extras (leitura, sem escrita)

```
turmas(id) → etapa_ensino_id → academico_etapas_ensino(etapa_codigo)
turmas.ano_letivo_id → academico_calendarios(id)  [por ano_letivo_id — cf. diario-classe.ts:777, NÃO por school_id]
academico_calendario_eventos(calendario_id IN ids, tipo='dia_letivo')
  filtro etapa: !etapas.length || etapas inclui etapa_codigo|etapa_id  [padrão boletim.ts:147-154]
  filtro recorrência: só datas fora de seg–sex (sábados etc.; decidir dia de semana na execução)
```

Multietapa: união das etapas de `turmas_multietapa`. Expansão de `data_inicio..data_termino` do evento em datas (padrão `getDiasLetivosDaTurma:794-811`). Blocos vazios **não** persistem — derivação a cada abertura; `getExtrasDoQuadro` faz LEFT JOIN do derivado com o persistido.

## 4. Fluxos de escrita (actions em `quadro-aulas.ts`)

- `getExtrasDoQuadro(quadroId)`: datas + horários (`ativo=true`, join disciplina→nome, professor→nome) para hidratar o card.
- `saveExtrasDoQuadro(quadroId, extras, pessoaId)`: valida permissão `editar` + `garantirTurmaAberta`; soft-inativa horários (`ativo=false`) e reinsere (paridade com `updateQuadroAula`); upsert de blocos por `(quadro, data)`; auditoria como `editar` em `quadro_aulas` (proposta; alternativa: entidade própria — decidir na execução).
- `removerDataExtra(dataExtraId, pessoaId)`: conta frequência em `academico_frequencias_aula(data_aula, turma_id)` + `academico_frequencias_dia(dia_letivo, turma_id)`; `>0` → erro bloqueador (FR-014); `0` → delete (UI confirma antes via `ConfirmDialog`).
- `validarConflitosProfessor(..., vigencia?)`: join passa a trazer `quadro(data_inicial, data_final, status, ativo)`; pula sem sobreposição. Extras: conflito por **data exata** (`data_aula` igual + overlap de minutos) — a implementar na Phase 3 (índice `professor` cobre).

## 5. Leitura do Diário (sem escrita nova)

- `getAulasDaTurma(turmaId, matrizDisciplinaId, ano, mes)`: após as regulares, busca extras do quadro (`data_extra.data_aula` no mês + `disciplina_id` filtrada, `ativo=true`) e anexa como `AulaQuadro` (`horario_id` = id do horário extra, `data/data_iso` pela data exata, `extra:true`; `numero_aula` sequencial após as regulares ou null — decidir na execução).
- `listarDiasComAula(...)`: une `data_aula` das extras ao `string[]` de dias.
- `registrarFrequenciaAula/Lote`: sem mudança (upsert por `horario_id+aluno+data_aula`; UUIDs das tabelas não colidem no `UNIQUE`).
- **DDL adicional na M-01 (decisão de execução)**: `horario_id` de `academico_frequencias_aula` referencia `quadro_aulas_horarios(id)` — ids extras violariam a FK. A migration remove essa FK (mantém NOT NULL + UNIQUE + índices); integridade na aplicação (`removerDataExtra` bloqueia com frequência; cálculos filtram só ativos). `academico_diario_planos_aplicados.horario_id` (FK `SET NULL`) **não** foi tocado: aplicar plano de aula em extras fica como follow-up fora desta spec.
- `por_dia` (`getDiasLetivosDaTurma`): já inclui sábados `dia_letivo` — sem mudança.
- Lacuna documentada: Boletim/Rendimento/Fechamento filtram `horario_id ∈ horarios ativos do quadro semanal` — incluir ids extras ou registrar follow-up na execução.
