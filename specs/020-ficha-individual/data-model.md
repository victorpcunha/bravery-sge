# Data Model: Ficha Individual do Aluno

**Feature**: `020-ficha-individual`

## Migrations

Nenhuma. A Ficha reusa o recurso de permissão `documentos.oficiais` (seed da spec 019,
`supabase-migrations/patch_recursos_documentos.sql`).

## Entidades consumidas (somente leitura)

### Identidade Visual da Escola — `documentos_config` (spec 018)

Reuso de `montarEscola` (`src/lib/actions/documentos.ts`): `nome_escola_doc`, `nome_fantasia`,
`cnpj_doc`, `logradouro_doc`, `numero_doc`, `bairro_doc`, `municipio_doc` (IBGE → nome via
`nomeMunicipioCeara`), `cep_doc`, `telefone_doc`, `email_doc`, `site`, `mantenedora`, `cabecalho`
(sanitizado), `rodape` (sanitizado), `responsavel_nome`, `responsavel_cargo`, `logo` (base64).
Fallback por campo para `schools`.

### Ficha Individual — dados lidos

| Fonte | Campos |
|-------|--------|
| `people` | `nome_completo`, `cpf`, `data_nascimento`, `sexo` (1/2), `cor_raca` (0-5), `nacionalidade` (1-3), `municipio_nascimento` (IBGE), `inep_id`, `filiacao_1`, `filiacao_2`, `cep`, `municipio_residencia` (IBGE), `logradouro`, `numero`, `bairro`, `complemento` |
| `people` (saúde) | `deficiencia`, `cegueira`, `baixa_visao`, `visao_monocular`, `surdez`, `deficiencia_auditiva`, `surdocegueira`, `deficiencia_fisica`, `deficiencia_intelectual`, `deficiencia_multipla`, `tea`, `altas_habilidades`, `transtorno_aprendizagem`, `discalculia`, `disgrafia`, `dislalia`, `dislexia`, `tdah`, `tpac`, `auxilio_ledor`, `auxiliary_transcricao`, `guia_interprete`, `tradutor_libras`, `leitura_labial`, `prova_ampliada`, `prova_superampliada`, `cd_audio`, `prova_libras`, `prova_video_libras`, `material_braille`, `prova_braille`, `tempo_adicional`, `nenhum_recurso` |
| `academico_matriculas` | `data_matricula`, `situacao`, `ativo` |
| `turmas` (via `turma_id`) | `nome`, `turnos` (JSONB array) |
| `academico_etapas_ensino` (via `etapa_ensino_id`) | `etapa_nome` |
| `academico_anos_letivos` (via `ano_letivo_id`) | `descricao` |

**Regra de seleção da matrícula**: quando o aluno possui mais de uma matrícula no mesmo ano letivo,
prioriza `ativo = true` e, em seguida, a mais recente (`data_matricula` desc).

## Query Patterns

### Dados da Ficha

```
Source: people (todos os campos da ficha + flags de saúde)
Filter: id = :alunoId

Source: academico_matriculas
Select: data_matricula, situacao,
        turma:turma_id(nome, turnos),
        etapa:etapa_ensino_id(etapa_nome),
        academico_anos_letivos(descricao)
Filter: school_id = :schoolId, aluno_id = :alunoId, ano_letivo_id = :anoLetivoId
Order:  ativo desc, data_matricula desc (limit 1)

Turnos: JSONB array → map (string ou {turno}) → string[] (mesma extração da Declaração)
```

### Mapeamentos de rótulo

- `sexo` / `cor_raca` / `nacionalidade` → `VALOR_DESCRICOES` (`src/data/censo/rotulos-campos.ts`).
- `municipio_nascimento` / `municipio_residencia` → `getMunicipioByCodigo` (`src/data/municipios.ts`).
- Deficiências / transtornos / recursos → mapas locais no componente PDF (padrão `card-saude.tsx`).