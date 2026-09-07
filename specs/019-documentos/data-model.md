# Data Model: Módulo Documentos

**Feature**: `019-documentos`

## Migrations

Nenhuma tabela nova. Apenas seed de recursos de permissão:
`supabase-migrations/patch_recursos_documentos.sql`.

```sql
INSERT INTO recursos (codigo, nome, modulo) VALUES
  ('documentos.oficiais', 'Documentos Oficiais', 'Documentos'),
  ('documentos.preencher', 'Documentos para Preenchimento Manual', 'Documentos'),
  ('relatorios', 'Relatórios', 'Documentos')
ON CONFLICT (codigo) DO NOTHING;
```

## Entidades consumidas (somente leitura)

### Identidade Visual da Escola — `documentos_config`

Tabela criada na spec 018. Campos usados na Declaração de Matrícula:
`nome_escola_doc`, `nome_fantasia`, `cnpj_doc`, `logradouro_doc`, `numero_doc`, `bairro_doc`,
`municipio_doc` (código IBGE 7 dígitos → nome via `nomeMunicipioCeara`), `cep_doc`, `telefone_doc`,
`email_doc`, `site`, `mantenedora`, `cabecalho` (texto rico → sanitizado p/ texto puro),
`rodape` (idem), `responsavel_nome`, `responsavel_cargo`, `logo` (base64).

**Fallback**: quando o campo da config está vazio, usa a coluna equivalente de `schools`
(`nome_escola`, `cnpj`, `endereco`, `numero`, `bairro`, `municipio`, `cep`, `email`).

### Declaração de Matrícula — dados lidos

| Fonte | Campos |
|-------|--------|
| `people` | `nome_completo`, `data_nascimento`, `cpf`, `filiacao_1`, `filiacao_2`, `municipio_nascimento` |
| `academico_matriculas` | `id`, `situacao`, `data_matricula`, `forma_ingresso`, `codigo_inep`, `ativo` |
| `turmas` (via `turma_id`) | `nome`, `codigo_inep`, `turnos` (JSONB array) |
| `academico_etapas_ensino` (via `etapa_ensino_id`) | `etapa_nome` |
| `academico_anos_letivos` (via `ano_letivo_id`) | `descricao` |

**Regra de seleção da matrícula**: quando o aluno possui mais de uma matrícula no mesmo ano letivo,
prioriza `ativo = true` e, em seguida, a mais recente (`data_matricula` desc).

## Query Patterns

### Alunos com matrícula em um ano letivo

```
Source: people (school_id + nome/CPF ILIKE, limit 30)
Match:   academico_matriculas (school_id + ano_letivo_id + aluno_id IN ...)
Dedupe:  por aluno, preferindo situacao/ativo (ativo primeiro)
```

### Dados da Declaração

```
Source: academico_matriculas
Select: id, situacao, data_matricula, forma_ingresso, codigo_inep,
        turma:turma_id(nome, codigo_inep, turnos),
        etapa:etapa_ensino_id(etapa_nome),
        academico_anos_letivos(descricao)
Filter: school_id = :schoolId, aluno_id = :alunoId, ano_letivo_id = :anoLetivoId
Order:  ativo desc, data_matricula desc (limit 1)
```