# Data Model: Ocorrências da Gestão Acadêmica (026)

**Feature**: `specs/026-ocorrencias-gestao-academica/spec.md` | **Date**: 2026-09-09

Migration nova: `supabase-migrations/ocorrencias_gestao.sql` (convergente — ver R1) + `supabase-migrations/patch_recursos_ocorrencias.sql` (seed do recurso). Aplicação via SQL Editor, sem CLI (padrão do projeto).

## Entidades

### ocorrencias (canônica — converge com produção)

| Coluna | Tipo | Regras |
|--------|------|--------|
| `id` | UUID PK, default `gen_random_uuid()` | — |
| `school_id` | UUID NOT NULL → `schools(id)` ON DELETE CASCADE | Escopo multi-tenant; toda leitura/escrita filtra por ela (FR-018) |
| `titulo` | VARCHAR NOT NULL | 3–150 caracteres (validação server-side; listagem exibe integral) |
| `tipo` | VARCHAR NOT NULL CHECK (`positiva`, `negativa`) | Seleção única via pill (FR-011) |
| `data_ocorrencia` | DATE NOT NULL | Data válida de calendário; default `CURRENT_DATE` |
| `detalhes` | TEXT NOT NULL | 1–500 caracteres, contador visível (FR-014) |
| `apresentar_portal` | BOOLEAN NOT NULL DEFAULT false | Pill liga/desliga, desmarcado por padrão (FR-012); Portal (futuro) lista somente `true` |

Migration (idempotente): `CREATE TABLE IF NOT EXISTS` com o shape acima; `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` para `titulo`, `tipo` (só se a coluna não existir — nunca altera CHECK legado existente), `detalhes`, `apresentar_portal`, `data_ocorrencia`; índices `IF NOT EXISTS`: `(school_id)`, `(data_ocorrencia DESC)`, `(school_id, tipo)`.

> Nota: ambientes criados pelo `ocorrencias.sql` legado do repo mantêm `person_id/descricao/tipo(disciplinar,pedagogica)` intactos — sem migração destrutiva; produção já está no shape canônico.

### ocorrencias_alunos (existente em produção — convergir)

| Coluna | Tipo | Regras |
|--------|------|--------|
| `ocorrencia_id` | UUID NOT NULL → `ocorrencias(id)` ON DELETE CASCADE | PK composta `(ocorrencia_id, aluno_id)` |
| `aluno_id` | UUID NOT NULL → `people(id)` ON DELETE CASCADE | ≥1 por ocorrência (FR-011); índice por `aluno_id` (já existe `idx_ocorrencias_alunos_aluno`) |

Migration: `CREATE TABLE IF NOT EXISTS` + índices; sem alteração do que produção já tem.

### ocorrencias_profissionais (nova)

| Coluna | Tipo | Regras |
|--------|------|--------|
| `ocorrencia_id` | UUID NOT NULL → `ocorrencias(id)` ON DELETE CASCADE | PK composta `(ocorrencia_id, profissional_id)` |
| `profissional_id` | UUID NOT NULL → `people(id)` ON DELETE CASCADE | ≥1 por ocorrência (FR-011); índice por `profissional_id` |

Ocorrências preservam o vínculo mesmo se o profissional for desativado depois (sem SET NULL — histórico; filtro lista só ativos, cf. edge case da spec).

### recursos (seed — sem tabela nova)

`INSERT INTO recursos (codigo, nome, modulo) VALUES ('gestao-academica.ocorrencias', 'Ocorrências', 'Gestão Acadêmica') ON CONFLICT (codigo) DO NOTHING;`

## Relacionamentos

```text
schools 1──N ocorrencias (school_id, CASCADE)
ocorrencias N──N people (alunos) via ocorrencias_alunos (CASCADE ambos os lados)
ocorrencias N──N people (profissionais) via ocorrencias_profissionais (CASCADE ambos os lados)
```

Exclusão de ocorrência = hard delete; junctions caem em cascata; auditoria `excluir` guarda snapshot (spec 017).

## Validações server-side (autoritativas)

1. `titulo` 3–150 chars; `tipo` ∈ {positiva, negativa}; `data_ocorrencia` data válida (`YYYY-MM-DD`); `detalhes` 1–500 chars.
2. `alunoIds` não-vazio, todos `people` da mesma `school_id` (checagem por `.in('id', ...)` + comparação de `school_id` — impede vincular aluno de outra escola).
3. `profissionalIds` não-vazio, todos com vínculo ativo na escola (`vinculos_profissionais.situacao='1'` + `people.ativo`) — impede vincular profissional inativo/desligado.
4. Filtro de listagem: `dataInicial <= dataFinal` quando ambos presentes (senão erro amigável, cf. edge case).
5. Toda operação valida `validarPermissaoEstrita(pessoaId, 'gestao-academica.ocorrencias', acao)` + escopo `school_id` (superadmin opera com `schoolId` explícito do filtro `?escola=`).

## Estratégia de leitura (sem N+1 — ver R8)

`listarOcorrencias`: (1) junctions → ids (`return []` cedo se filtro de envolvidos vazio); (2) `ocorrencias` com `school_id` + `tipo` + range de data + `.in('id')`, `order data_ocorrencia DESC`; (3) batch de nomes (2 junctions + 2 `people.in(id)`). Ordem padrão: mais recentes primeiro. Paginação 10/pág client-side (padrão Comunicados).
