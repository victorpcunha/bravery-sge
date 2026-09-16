# Implementation Plan: Métodos de Avaliação — Ajustes

**Branch**: `main` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/033-metodos-ajustes/spec.md`

## Summary

Ajustes 100% client (US1–US7): busca 33% + tabela full-width com cabeçalho em destaque; conversão modal→páginas `metodos/novo` + `metodos/[id]` (padrão Comunicados/Escolas, com Excluir também na edição); checkboxes/selects do cadastro viram `ClickablePill` (single vs multi) com tooltips literais em Aprovações/Arredondamento; Opções em grade 2–3 colunas; Conceitos/Níveis sem cores, sem fundo no grupo, lixeira centralizada/maior com `ConfirmDialog`. 0 migrations + 0 tabelas alteradas + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (client components + Server Actions)

**Primary Dependencies**: shadcn/ui (Table, Button, Input, Label, Tooltip, Dialog removido do fluxo), `ClickablePill` (`components/ui/clickable-pill.tsx`), `ConfirmDialog`, `EmptyState`, `StatusBadge`, `PageContainer/PageHeader/PageSection/FilterBar(/SearchInput)`, `usePermissoes`, `useTabParams`, `useAuth`, `sonner`, `lucide-react` (Plus, Pencil, Trash2, ClipboardList, Info, ArrowLeft, ShieldAlert)

**Storage**: PostgreSQL — nenhuma migration (colunas `cor_fundo/cor_letra` de conceitos/níveis preservadas no banco; UI apenas deixa de exibi-las; `saveMetodo` mantém defaults)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate)

**Target Platform**: Web responsiva (pills com `flex-wrap`; Opções em grade; tabela com `overflow-x-auto`)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Sem queries novas (mesmas `getMetodos/getMetodoCompleto/saveMetodo/deleteMetodo`); páginas novo/editar carregam 1× (`getMetodoCompleto` só na edição)

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()` (inalteradas); `pessoaId` + auditoria nas escritas (inalterado); permissão `gestao-academica.metodos` (inalterada); tokens Tailwind v4 (sem hex — remover `COLORS_*`); dark-mode; abas internas (máx. 6, keep-alive, `useTabParams` nas dinâmicas)

**Scale/Scope**: ~5 arquivos (`metodos/page.tsx`, `metodos/novo/page.tsx`, `metodos/[id]/page.tsx`, form extraído, `tab-routes.tsx`) + ajuste pontual em `FilterBar` (prop opcional retrocompatível)

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — nenhuma action nova (só as 4 existentes de `lib/actions/metodos.ts`). ✅
- **II. Security First** — guards `usePermissoes('gestao-academica.metodos')` nas 3 páginas (criar/editar/excluir/visualizar); `ConfirmDialog` na lista e na edição + por item de conceito/nível; validação Descrição mantida. ✅
- **III. Multi-Tenant** — `effectiveSchoolId`/`?escola=` p/ superadmin nas 3 páginas; superadmin sem escola não carrega. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `ClickablePill`, `ConfirmDialog`, `EmptyState`, `StatusBadge`, `Table` shadcn; remove `COLORS_*`/hex e `input type="color"`; pills com `aria-pressed` nativo. ✅
- **VII. Migrations** — nenhuma. ✅
- **VIII. Auditability** — `saveMetodo/deleteMetodo` com `pessoaId` inalterados; pills entram no diff existente. ✅
- **IX. Feature-Based** — tudo em `gestao-academica/metodos/` (+ `src/components/metodos/` se extrair o form) + 1 prop opcional em `components/layout/filter-bar.tsx`. ✅
- **X. No New Patterns** — páginas seguem `comunicados/novo` + `comunicados/[id]`; pills seguem `comunicado-form.tsx`/`plano-aula-form.tsx`; tooltips seguem `LabelWithTooltip` do próprio form. ✅
- **XI. Design System First** — nenhum componente novo (pills com `Info` usam `Tooltip` shadcn existente). ✅

### Product Experience

- **PE-101/102** → busca 33%, tabela full-width com cabeçalho destacado, pills comunicam estado.
- **PE-201** → Identificação → Numéricas → Aprovações → Arredondamento → condicionais; save volta à lista.
- **PE-205** → Descrição obrigatória (`toast.error`) mantida; exclusões sempre com confirmação.

## Project Structure

### Documentation (this feature)

```text
specs/033-metodos-ajustes/
├── plan.md              # This file
├── data-model.md        # Sem DDL: entidades lidas/escritas + mapa single/multi das pills
├── quickstart.md        # Roteiro de verificação manual
├── spec.md              # Feature specification
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-academica/metodos/
│   ├── page.tsx                 # MOD: busca 33%, tabela full-width, Dialog→router.push (FR-001/002/003/005)
│   ├── novo/page.tsx            # NEW: padrão comunicados/novo (?escola=, guard criar) (FR-003/004/005)
│   └── [id]/page.tsx            # NEW: padrão comunicados/[id] (useTabParams, guards, Excluir) (FR-003/004/005)
├── components/metodos/
│   └── metodo-form.tsx          # NEW (extração de MetodosForm.tsx): todas as pills/tooltips/grades/cores/lixeira (FR-006..011)
├── components/layout/
│   └── filter-bar.tsx           # MOD: prop opcional searchClassName (retrocompatível) (FR-001)
└── lib/
    └── tab-routes.tsx           # MOD: registra metodos/novo + metodos/[id] (FR-003)
```

## Phases

### Phase 0 — Lista + rotas (US1, US2 — base; sem dependências)

`page.tsx`: busca 33%, remove `px-4`, `TableHead bg-muted uppercase`, remove `Dialog/MetodosForm`, navega via `router.push` (com `?escola=` p/ superadmin). `novo/page.tsx` + `[id]/page.tsx` finas (wrappers Suspense + guards + form extraído); `[id]` com Excluir + `ConfirmDialog`. `tab-routes.tsx`: 2 entradas no módulo `metodos`. Form extraído com mesma API de dados (`schoolId/editId`), trocando `onSaved/onCancel` por navegação interna ou callbacks finos.

### Phase 1 — Pills do núcleo (US3, US4 — paralelizáveis entre si, sobre o form extraído)

US3: Ativo + 4 tipos em `ClickablePill` (períodos 1–4 intactos). US4: Forma de Registro (single, `max-w-xs`), Recuperação (multi, condicionais intactas), Média do Período + Resultado Final (singles), Opções em `grid sm:2 lg:3`.

### Phase 2 — Pills explicadas (US5, US6 — paralelizáveis entre si)

US5: Aprovação Automática em Pill (esmaecimento mantido); Aritmética/Ponderada em Pills únicas + `Tooltip` com textos literais; pesos só na Ponderada. US6: Tipo de Arredondamento em 3 Pills + tooltips literais; intervalos/margem/condicionais intactos; Aplicar em 3 Pills multi. Padrão: `ClickablePill` + `Info` com `Tooltip` (estender `LabelWithTooltip` ou compor inline como no bloco `media_pond_rec` atual).

### Phase 3 — Parecer/Conceitos/Níveis (US7 — paralelizável com Phase 2, mesmo arquivo mas blocos distintos)

Registro Geral e Conceito Final em Pills; remove `COLORS_*`, `ColorPreview`, helpers de contraste, `type="color"`; grupo sem `bg-muted`; lixeira `items-center` maior com `ConfirmDialog` por item (estado local de confirmação em `CardConceitosList`/`CardNiveisList`).

### Phase 4 — Gates

`tsc`, `build`, `quickstart.md` completo, `grep 'type="color"'` e `grep '#[0-9A-Fa-f]\{6\}'` limpos no módulo metodos.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Extrair form para `components/metodos/` | Duplicar form nas 2 páginas | Evita divergência novo×edição; páginas ficam finas como Comunicados |
| `?escola=` p/ superadmin (padrão Comunicados) | Reuso do `selectedSchoolId` em estado da lista | Estado da lista morre na navegação entre páginas; query param sobrevive e já é o padrão do repo |
| Salvar volta à lista (padrão Comunicados) | Permanecer na edição (padrão Matrizes 032) | Spec 033 não pede continuação na página; voltar à lista é o fluxo esperado de cadastro simples |
| `ConfirmDialog` por item de conceito/nível | Um `ConfirmDialog` global no form | Listas são componentes isolados (`CardConceitosList/NiveisList`); estado local evita prop-drilling |
| Manter `cor_fundo/cor_letra` no banco | Migration removendo colunas | Fora do escopo; UI some mas dados legados preservados e defaults mantidos no save |
