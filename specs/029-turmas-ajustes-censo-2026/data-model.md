# Data Model: Turmas — Ajustes e Alinhamento Censo 2026 (029)

**Spec**: `spec.md` · **Plan**: `plan.md`
**Fontes oficiais**: `documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares/Tabela de Etapas 2026.xlsx` (abas `Etapas de ensino`, `Tipo de turma X Etapa`) e `Tabela de Tipo de Atividade Complementar 2026.xlsx` (aba `Tabela`). Conteúdo extraído em 2026-09-15.

## 1. DDL (3 migrations, via SQL Editor)

### M-01 `patch_turmas_atividades_complementares.sql` (NEW)

```sql
ALTER TABLE turmas ADD COLUMN IF NOT EXISTS atividade_complementar_1 VARCHAR(3);
... (idem _2.._6)
```

Paridade com `classrooms.atividade_complementar_1..6` (`censo_2026_tables.sql:288-293`). Ordem de adição na UI = posição 1–6; `<6` atividades → excedentes `NULL` (FR-017). Validação de unicidade/sequência já existe no motor (`censo-regras.ts:1667-1687`) e passa a operar sobre dados reais.

### M-02 `patch_turmas_profissionais_atividades.sql` (NEW)

```sql
ALTER TABLE turmas_profissionais ADD COLUMN IF NOT EXISTS atividades_ids TEXT[] DEFAULT '{}';
```

Códigos (TEXT, não FK — catálogo é planilha versionada em código). Alternativo a `disciplinas_ids`: turma complementar usa um ou outro (FR-018). Inativação usa colunas existentes (`ativo`, `data_encerramento` — `modulo_turmas.sql:73-74`).

### M-03 `patch_turmas_remove_modalidade.sql` (NEW)

```sql
ALTER TABLE turmas DROP COLUMN IF EXISTS modalidade;
```

Pré-requisito: zero referências em `src` (form, tipos, tabela, dashboard). `buildRegistro20` não usa a coluna — export não quebra.

## 2. Catálogos versionados (`src/data/censo/`)

### 2.1 `etapas-ensino.ts` (MOD — correções contra a planilha)

| Agregada oficial | Etapas |
|---|---|
| 301 Educação Infantil | 1 creche (0–3), 2 pré-escola (4–5), 3 unificada (0–5) |
| 302 (EF 9 anos) | 14–18 (1º–5º), 19, 20, 21, 41 (6º–9º) |
| 303 Multi e correção de fluxo | 22 multi, 23 correção de fluxo, 56 multietapa |
| 304 Ensino Médio | 25–28 (1ª–4ª), 29 não seriada |
| 305 Ensino Médio – Normal/Magistério | 35–38 (1ª–4ª) |
| 306 EJA | **69 iniciais (1º segmento)**, **70 finais (2º segmento)**, 72 iniciais+finais (multietapas), 71 médio (3º segmento), 74 técnico integrado EJA, 73 FIC fundamental, 67 FIC médio |
| 308 (Técnico e Qualificação) | 39 concomitante, 40 subsequente, **64 técnico misto**, 68 FIC concomitante, 75 FIC não vinculada |

Divergências do código atual a corrigir: **69↔70 invertidos**, **64 em 304** (oficial: 308). Decisão de execução (2026-09-15): códigos **30–34** e linhas **"Escolarização"** — **excluídos** (só constam das colunas auxiliares "Filtro"; as etapas 39/40/64/68 já cobertas via Curricular/308).

### 2.2 `tipo-turma-mediacao.ts` (MOD — espelho da aba `Tipo de turma X Etapa`)

- Presencial + 4 (Complementar): sem restrição (`etapa_agregada '-'`). Idem Presencial + 5 (AEE).
- Presencial + 6: 301[1,2,3] · 302[14–21,41] · 303[22,23,56] · 304[25–29] · 305[35–38] · 306[69,70,72,71,74,73,67] · 308[39,40,64,68,75].
- Presencial + 9: 302[14–21,41] · 303[**22,23**] (sem 56) · 304[25–29] · 305:**vazio (bloqueia)**.
- Semipresencial + 6: 306[**69,70,71,72**] (única combinação).
- EAD + 6: 304[todas] · **305[35–38] (novo)** · 306[70,71,74,73,67].

### 2.3 `tipo-turma-codigos.ts` (NEW — mapa canônico, sem migração de dados)

```ts
TIPO_TURMA_CODIGO = { 'Atividade Complementar': '4', 'Atendimento Educacional Especializado (AEE)': '5', 'Curricular': '6', 'Curricular com Atividade Complementar': '9' }
FORMA_ORGANIZACAO_CODIGO = { <rótulo atual>: <código Anexo 6>, 'Grupos Não Seriados': <mesmo código do rótulo antigo> }
```

Usado por `censo.ts` (export) e `censo-regras.ts` (validação). Resolve a inconsistência pré-existente (form grava rótulos; motor lia `tipo_turma` singular/códigos).

### 2.4 `atividades-complementares.ts` (NEW — ~150 itens)

`{ codigo: string, nome: string, area: string, subarea: string }`. Ex.: `11002 Canto coral` (Área 1 Cultura, Artes e Educação Patrimonial / Subárea 11 Música). **Excluídos**: 15002, 15003, 19101, 19104, 19105, 22032 (nomes vazios). UI: `SelectGroup(area) > SelectLabel(subarea) > SelectItem(nome)`; estado guarda `codigo`.

## 3. Fluxos de escrita (actions existentes, payloads estendidos)

- `createTurma/updateTurma`: aceitam `atividade_complementar_1..6` (derivados da ordem do array da UI) + validação server-side (matriz §2.2, nulo-forçado de etapa fora de 6/9, 6+dedupe p/ tipo 4/9); removem `modalidade` do tipo/payload.
- `add/updateProfissionalTurma`: aceitam `atividades_ids`; inativar = `update({ativo:false, data_encerramento})` (auditoria como `editar`).
- `getTurma`: retorna `atividade_complementar_1..6` + `atividades_ids` para hidratação do modal.

## 4. Leitura/export (sem escrita nova)

- `buildRegistro20` (`censo.ts`): `tipos_turma` via §2.3; **novas posições** `atividade_complementar_1..6` após tipo; `etapa_agregada`/`etapa_codigo` vazios fora de 6/9 (consistente com FR-006).
- `validarRegistro20/50`: matriz §2.2 (incl. EAD+305, bloqueio 305-tipo-9, 303-tipo-9 sem 56); Registro 50 aceita `atividades_ids` em turma complementar.
- Removido: `alunosPorModalidade` (`dashboard.ts`) + `alunos-por-modalidade-chart.tsx`.
