# Data Model: Portal do Responsável

**Feature**: `023-portal-responsavel` | **Date**: 2026-09-08

## Novas entidades (3 migrations)

### `portal_termos` — Termo de Uso e Política de Privacidade versionado

Migration `patch_portal_termo.sql`. Uma linha `ativo=true` por vez (a vigente).

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK `gen_random_uuid()` | — |
| `versao` | INT UNIQUE NOT NULL | Incremental (1, 2, ...); exibida ao responsável |
| `conteudo` | TEXT NOT NULL | Texto integral; seed v1 cobre FR-006 (a–d) em linguagem simples |
| `ativo` | BOOLEAN NOT NULL DEFAULT FALSE | Só uma linha ativa; publicar nova versão = `ativo` troca → exige novo aceite (FR-005) |
| `created_at` / `updated_at` | TIMESTAMPTZ | Padrão do projeto (+ trigger `update_updated_at_column()`) |

### `portal_aceites` — Registro de consentimento LGPD

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK | — |
| `responsavel_id` | UUID → `people(id)` ON DELETE CASCADE | Quem aceitou |
| `termo_id` | UUID → `portal_termos(id)` ON DELETE RESTRICT | Qual versão (nunca apagar versão com aceite) |
| `aceito_em` | TIMESTAMPTZ DEFAULT NOW() | Data/hora do clique em "Aceitar" (FR-004) |
| UNIQUE | `(responsavel_id, termo_id)` | Re-aceite da mesma versão é idempotente |

Gate: `EXISTS (aceite do responsavel_id para o termo ativo)` — sem ele, bloqueio total (FR-003).

### `comunicados` — Avisos da escola (leitura nesta spec; emissão em spec futura)

Migration `patch_portal_comunicados.sql`.

| Campo | Tipo | Regras |
|---|---|---|
| `id` | UUID PK | — |
| `school_id` | UUID → `schools(id)` ON DELETE CASCADE | Multi-tenant (III) |
| `titulo` | VARCHAR(200) NOT NULL | — |
| `descricao` | TEXT NOT NULL | Texto integral (modal "Ver Comunicado") |
| `data_comunicado` | DATE NOT NULL DEFAULT CURRENT_DATE | Ordenação DESC; exibida no minicard |
| `escopo` | JSONB NOT NULL DEFAULT `'{"tipo":"geral"}'` | `{tipo:'geral'}` ou `{tipo:'turmas', turma_ids:[uuid...]}` |
| `created_by` | UUID → `people(id)` | Auditoria de origem (preenchido na spec futura) |
| `created_at` / `updated_at` | TIMESTAMPTZ | Padrão |

Visibilidade no portal: escopo `geral` da escola **ou** `turma_id` da matrícula vigente em `turma_ids` **E** vínculo com `receber_comunicados=true`.

### `comunicados_leituras` — Controle lido/não lido

| Campo | Tipo | Regras |
|---|---|---|
| `comunicado_id` | UUID → `comunicados(id)` ON DELETE CASCADE | — |
| `responsavel_id` | UUID → `people(id)` ON DELETE CASCADE | Leitor (por responsável, não por aluno) |
| `lido_em` | TIMESTAMPTZ DEFAULT NOW() | Criada ao abrir o modal (FR-018) |
| UNIQUE | `(comunicado_id, responsavel_id)` | Ausência de linha = não lido |

### `ocorrencias` / `ocorrencias_alunos` — schema REAL de produção (sem alteração)

Diagnóstico 2026-09-09: a tabela de produção **não** corresponde ao
`supabase-migrations/ocorrencias.sql` do repositório (`person_id` + `descricao`
nunca foram aplicados como escritos). O schema real já atende o portal, por
isso a migration `patch_portal_ocorrencias.sql` é só convergência (índice +
comentários):

| Campo real | Uso no portal |
|---|---|
| `titulo VARCHAR NOT NULL` | Título (FR-017) |
| `tipo CHECK ('positiva','negativa')` | Filtro Todas/Positivas/Negativas (FR-017) |
| `detalhes TEXT NOT NULL` | Descrição (mapeado para `descricao` no `OcorrenciaResumo`) |
| `apresentar_portal BOOLEAN` | Portal lê só `=true` (FR-017) |
| `ocorrencias_alunos(ocorrencia_id, aluno_id)` UNIQUE | Vínculo N:N ocorrência↔aluno; índice `idx_ocorrencias_alunos_aluno` criado na migration |

Índice: `CREATE INDEX IF NOT EXISTS idx_ocorrencias_alunos_aluno ON ocorrencias_alunos(aluno_id)`.

## Entidades reutilizadas (sem alteração)

- **`people`** (`portal_acesso_habilitado` da spec 022) + credencial Auth `portal_only=true` — identidade do responsável.
- **`responsavel_alunos`** (`responsavel_id, aluno_id, tipo_vinculo, principal, receber_comunicados`) — única fonte de visibilidade (FR-007).
- **`academico_matriculas`** (`aluno_id, turma_id, ano_letivo_id, situacao, ativo, data_matricula, data_saida`) — matrícula vigente = contexto de todas as páginas.
- **`academico_metodos_avaliacao`** (`criterio_frequencia`, `frecuencia_minima` — sic, coluna real) + `academico_metodos_avaliacao_aprovacao` (`media_minima`) + `quantidade_periodos_numerico` — médias, cores, limite de faltas.
- **`academico_notas / academico_recuperacoes / academico_frequencias_dia / academico_frequencias_aula / quadro_aulas(+horarios) / academico_calendario_eventos`** — lidos via motor existente, nunca direto pelo portal (R4).
- **`auditoria`** — eventos `portal_acesso` (login) e `portal_termo` (aceite com `versao`; sem senha/conteúdo nos snapshots).

## Diagrama de relacionamentos (leitura do portal)

```text
people(responsavel) ──< responsavel_alunos >── people(aluno) ──< academico_matriculas >── turmas
        │                                                        │                    ├── quadro_aulas/horarios
        │                                                        ├── ano_letivo ──< periodos avaliativos
        │                                                        └── metodo (via matriz) ── media/frequencia mínima
        ├── portal_aceites >── portal_termos (ativo)
        └── comunicados_leituras >── comunicados (escopo ∩ turma vigente)
people(aluno) ──< ocorrencias (apresentar_no_portal=true, natureza)
```

## Validações e transições

- Login → gate `portal_only` + flag → gate aceite vigente → vínculos (0/1/N) → contexto.
- Publicar termo: `UPDATE portal_termos SET ativo=false` + `INSERT` nova versão `ativo=true` (operação interna futura; aceite antigo permanece como histórico).
- Comunicado novo: visível imediatamente a todos os vínculos no escopo (não lido até abrir o modal).
- Matrícula inativada (`situacao` ≠ Ativo / `data_saida`): aluno some da seleção; dados históricos seguem regra de matrícula ativa do Painel.
