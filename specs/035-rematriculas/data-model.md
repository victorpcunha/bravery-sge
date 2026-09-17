# Data Model: Tela de Rematrículas

**Feature**: `035-rematriculas` | **Date**: 2026-09-16

**Zero tabelas novas.** A feature só lê tabelas existentes e insere em `academico_matriculas` via `createMatricula`. A única migration é seed do recurso de permissão.

##tables lidas (existentes, sem alteração)

| Tabela | Uso | Filtro relevante |
|---|---|---|
| `academico_anos_letivos` | Origem (encerrado mais recente) e Destino (ativo) | `school_id`, `status` (`ativo`/`encerrado`) |
| `academico_etapas_ensino` | Etapas de origem e destino | `school_id`, `ano_letivo_id`, `ativa = true` |
| `turmas` | Turmas de origem e destino | `school_id`, `ano_letivo_id`, etapa, `ativo = true` |
| `academico_matriculas` | Alunos da turma de origem (leitura) + cruzamento com ano de destino (anti-duplicidade) | `ano_letivo_id`, `turma_id`, `situacao`, `ativo = true` |
| `people` | Nome + CPF da listagem (join existente) | — |

## Tabela escrita (existente, via `createMatricula`)

| Tabela | Operação | Garantias herdadas |
|---|---|---|
| `academico_matriculas` | 1 `INSERT` por aluno selecionado (`school_id`, `aluno_id`, `ano_letivo_id` destino, `turma_id`/`etapa_ensino_id` destino individual, `data_matricula`, `situacao = 'Ativo'`) | Regra Geral (sem duplicidade Curricular, sem conflito turno/dias), `codigo_matricula` sequencial por escola, auditoria individual |

## Entidades transitórias (estado de tela + payloads, não persistidas)

- **FiltroOrigem**: `{ anoLetivoId (travado), etapaId, turmaId, situacoes[] (família Aprovado ou Reprovado) }`
- **FiltroDestino**: `{ anoLetivoId (travado), etapaId, turmaId, dataMatricula (≤ hoje) }`
- **AlunoElegivel** (projeção): `{ matriculaOrigemId, alunoId, nome, cpf, situacao }` — só alunos da turma de origem na situação filtrada e **sem** matrícula ativa no ano de destino
- **DestinoIndividual**: `{ alunoId, turmaDestinoId }` — padrão = turma do subcard, ajustável dentro da mesma etapa
- **ResultadoLote**: `{ criados: AlunoId[], falhas: [{ alunoId, nome, motivo, proximoPasso }] }`

## Regra de consistência (aplicada client + revalidada server)

| Situação (família) | Etapa destino válida |
|---|---|
| Aprovado (`Aprovado`, `Aprovado por conselho de classe`, `Aprovado concluinte`) | ≠ etapa de origem |
| Reprovado (`Reprovado`, `Reprovado por frequência`) | = etapa de origem |

## Migration

- `supabase-migrations/patch_recursos_rematriculas.sql` — seed do recurso `gestao-academica.rematriculas` (módulo `Gestão Acadêmica`), seguindo o formato de `patch_recursos_documentos.sql`. Aplicar via SQL Editor (padrão do projeto, sem CLI Supabase).
