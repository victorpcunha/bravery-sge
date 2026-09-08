# Research: Comunicados do Portal (025)

**Feature**: `specs/025-comunicados-portal/spec.md` | **Date**: 2026-09-08

All unknowns resolved — no NEEDS CLARIFICATION remains. Key discovery: the `comunicados` table and the portal reading side **already exist** (spec 023, migration `patch_portal_comunicados.sql`); this feature adds the **admin management UI + visibility window + targeting snapshot**.

## R1 — Reusar a tabela `comunicados` existente (estender, não recriar)

- **Decision**: Estender `comunicados` via migration patch (`ALTER TABLE ... ADD COLUMN`) com `ano_letivo_id`, `visivel_de`, `visivel_ate`; estender o JSONB `escopo` com `etapa_ids[]`; manter `comunicados_leituras` intacta.
- **Rationale**: Tabela já em produção no Portal (`portal.ts` lê `school_id, titulo, descricao, data_comunicado, escopo, leituras`). Recriar quebraria o portal e as leituras já registradas.
- **Alternatives considered**: Nova tabela `portal_comunicados_v2` — rejeitada (duplicaria leituras/escopo e exigiria migração de dados + reescrita do portal).

## R2 — Janela de visibilidade com `NULL` = ilimitado (compatibilidade retroativa)

- **Decision**: `visivel_de TIMESTAMPTZ NULL`, `visivel_ate TIMESTAMPTZ NULL`. Filtro do portal: `(visivel_de IS NULL OR visivel_de <= now()) AND (visivel_ate IS NULL OR now() <= visivel_ate)`. Backfill: linhas legadas recebem `visivel_de = data_comunicado 00:00`, `visivel_ate = NULL` (continuam visíveis). Novos comunicados exigem início e fim (validação server-side `visivel_de < visivel_ate`).
- **Rationale**: Comunicados legados (carga manual via SQL, spec 023) não têm período; apagá-los do portal seria regressão. `NULL` ilimitado é o padrão de "sem restrição".
- **Alternatives considered**: Exigir período com backfill artificial (ex.: +30 dias) — rejeitada (expiraria conteúdo legado silenciosamente).

## R3 — Snapshot de direcionamento dentro do `escopo` JSONB

- **Decision**: Admin grava `escopo = {"tipo":"turmas","etapa_ids":[...],"turma_ids":[...]}`. O portal continua decidindo visibilidade por `turma_ids` (mais `geral` legado); `etapa_ids` é snapshot informativo para a gestão (fidelidade ao "momento do cadastro"). Sem opção "geral" na UI admin (spec exige ≥1 turma).
- **Rationale**: Turma implica etapa (seletor de turmas é dependente das etapas); checar etapa no portal seria redundante e divergiria da lógica vigente (`turma_ids.includes(ctx.turmaId)`). Etapa desativada depois não afeta o snapshot.
- **Alternatives considered**: Colunas relacionais `comunicado_etapas`/`comunicado_turmas` — rejeitada (over-engineering para um snapshot imutável; JSONB já é o padrão da tabela).

## R4 — `data_comunicado` mantida como data de envio derivada

- **Decision**: Manter a coluna; no create/update o admin grava `data_comunicado = data(visivel_de)` (fuso da escola). Ordenação do portal (`data_comunicado DESC`) e minicard ("Data Envio") seguem inalterados.
- **Rationale**: Zero mudança no portal para ordenação/exibição; "Data Envio e Final" do minicard = `data(visivel_de)` e `data(visivel_ate)`.
- **Alternatives considered**: Remover a coluna — rejeitada (quebra queries e índices existentes `idx_comunicados_data`).

## R5 — Componentes de data/hora: compor com o que existe

- **Decision**:
  - Filtros (Data de envio / Data final): `Calendar` de `ui/calendar.tsx` em `Popover` (padrão `agenda-modal-novo.tsx`) com `captionLayout="dropdown"` (suportado via passthrough react-day-picker, já estilizado no wrapper — zero mudança no componente base) = seletor mês/ano pedido.
  - Formulário (Período de visualização): mesmo `Calendar` com `mode="range"` (estilos de range já definidos no wrapper, nenhum uso atual) + `captionLayout="dropdown"` + dois `Input type="time"` nativos (padrão `agenda-modal-novo.tsx` / `TurmaForm.tsx` — não existe time-picker dedicado no repo).
- **Rationale**: Atende ao pedido (month/year selector, range, time) sem nova dependência (Constituição X) e sem alterar o componente base.
- **Alternatives considered**: Instalar biblioteca de date-range/time-picker — rejeitada (nova dep sem aprovação, Constituição X).

## R6 — Recurso de permissão `portal.comunicados` + módulo "Portal" no sidebar

- **Decision**: Seed `('portal.comunicados', 'Comunicados do Portal', 'Gestão Acadêmica')` via `patch_recursos_portal.sql` (padrão `patch_recursos_documentos.sql` + `ON CONFLICT DO NOTHING` + `UPDATE` de correção caso a seed anterior com módulo `'Portal'` já tenha sido aplicada). Sidebar: item `Comunicados → /comunicados` como submenu de **Gestão Acadêmica** (sem módulo próprio). Rota interna `/comunicados` (top-level) — **nunca** `/portal/*`, que colidiria com o portal público `/portal/[slug]`.
- **Rationale**: Portal não tem recursos internos hoje (autorização do portal público é por vínculo, não por `recursos`); a gestão segue o padrão `modulo.recurso` + `validarPermissaoEstrita`. `/comunicados` evita colisão de rota com `[slug]` dinâmico.
- **Alternatives considered**: Recurso `gestao-portal.comunicados` / rota `/gestao-portal/*` — equivalente; `portal.*` escolhido por nomear o domínio (Portal), não a mecânica.

## R7 — Mudança mínima no portal (`portal.ts`)

- **Decision**: Somente `listarComunicadosPortal` (filtro da janela server-side na query) e `marcarComunicadoLido` (revalidar janela antes do upsert) passam a respeitar `visivel_de/ate`. O gate `receber_comunicados=false` foi **removido** (decisão posterior: comunicado é broadcast escola→responsáveis; assuntos individuais serão Ocorrências; migration `patch_remove_receber_comunicados.sql` dropa a coluna). Nenhuma mudança visual no portal (página e minicards já existem).
- **Rationale**: FR-010 exige expiração; o menor diff que a implementa sem regressão.
- **Alternatives considered**: Reescrever leitura do portal — rejeitada (risco sem benefício).

## R8 — Padrões de tela reaproveitados (sem componente novo global)

- **Decision**: Listagem = `PageContainer > PageHeader + PageSection(compact "Filtros") + FilterBar + PageSection(flush "Comunicados Registrados", actions=Novo)` (padrão `turmas/page.tsx`); minicards = grid `1/2/3` cols + `Card` com tile de ícone (padrão `oficiais-tab.tsx` + metadados `plano-ensino/page.tsx`); paginação client-side 10/pág (`ui/pagination.tsx`); `ConfirmDialog` destrutivo; `EmptyState` contextual (sem dados vs filtro vazio); form em 2 `FormCard`s + rodapé sticky (`plano-aula-form.tsx`); edição com `useTabParams()` (spec 016) empilhada no módulo `comunicados` do `tab-routes.tsx`.
- **Rationale**: Constituição XI (reuso antes de criar); todos os precedentes existem e estão catalogados.
- **Alternatives considered**: Tabela em vez de minicards — rejeitada (spec exige minicards explicitamente).
