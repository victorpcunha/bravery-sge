# Data Model: Censo Escolar — Situação Final

**Feature**: 015-censo-situacao-final

## Princípio

Igual à Matrícula Inicial: o módulo **lê e valida** dados das tabelas operacionais. **Nenhuma migração é necessária** — todos os campos INEP já existem nas tabelas; o flag "admitido após" é derivado de `academico_matriculas.data_matricula` vs `DATA_REFERENCIA_CENSO`.

## Fontes de Dados

### `schools` — Registro 89 (escola)
- `codigo_inep` (VARCHAR(8)) — código INEP da escola.
- `situacao_funcionamento` — `'1'` ativa, `'2'`/'3' desativada (extinta/paralisada).

### `vinculos_profissionais` + `people` + `funcoes_profissionais` — Registro 89 (gestor)
- Filtro: `school_id`, `situacao='1'`, função nome casa `/gestor|diretor|dirigente|coordenador/i`.
- Gestor: `people.cpf`, `people.nome_completo`.

### `turmas` — Registros 90/91 (turma)
- `codigo_inep` (VARCHAR(8)), `etapa_codigo` (VARCHAR(2) — código INEP da etapa), `tipo_mediacao`, `tipos_turma` (JSONB), `fgb`, `ita`, `iftp`, `ano_letivo_id`, `school_id`.
- Turma de escolarização: não AEE/complementar (`turmaIsCurricular`), não IF-exclusivo (turma de itinerário sem formação geral básica).

### `people` — Registros 90/91 (aluno)
- `inep_id` (VARCHAR(12)), `nome_completo`, `data_nascimento`.

### `academico_matriculas` — Registros 90/91 (matrícula)
- `id`, `aluno_id`, `turma_id`, `ano_letivo_id`, `data_matricula`, `data_saida`, `codigo_matricula_censo`, `inep_id`, `situacao`, `ativo`.
- Situações (CHECK em `patch_situacao_matriculas_fechamento.sql`):
  `'Ativo','Transferido','Desistente','Óbito','Reclassificado','Remanejado','Aprovado','Aprovado por conselho de classe','Reprovado','Reprovado por frequência','Aprovado concluinte','Sem movimentação'`.

### `academico_anos_letivos` — Ano letivo
- `id`, `descricao`, `data_inicio`, `data_termino`, `status` (string).

## Dados de Referência (novos)

| Arquivo | Conteúdo |
|---|---|
| `src/data/censo/referencias.ts` | `DATA_REFERENCIA_CENSO` (2026-05-27) |
| `src/data/censo/situacao-final.ts` | `SITUACAO_FINAL_INEP`, `ETAPAS_EI`, `ETAPAS_FINAIS`, `ETAPAS_EM`, `ETAPAS_TURMA_ADMISSAO`, `FUNCAO_GESTOR_REGEX` |

## Mapeamento situação → código

Ver `spec.md`. Centralizado em `SITUACAO_FINAL_INEP` (`Record<string, string>`), usado por validadores e builder de arquivo.