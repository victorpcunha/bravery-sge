# Implementation Plan: Estrutura Acadêmica — Calendários: Ajustes

**Branch**: `main` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/031-calendarios-ajustes/spec.md`

## Summary

Seis ajustes 100% client (US1–US6): abas em `ModernTabs`, subcard do ano com rótulos + botões 50/50, vínculo de Etapas no modal de calendário (UI nova sobre coluna `TEXT[]` existente), responsividade do `DatePicker`/modais, KPIs `StatCard` no topo da Visualização e Tipo de evento em `ClickablePill`. 0 migrations + 0 tabelas alteradas + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (client components + Server Actions)

**Primary Dependencies**: shadcn/ui (Tabs via `ModernTabs`, Dialog, Button, Select), `StatCard` (`components/ui/stat-card.tsx`), `ClickablePill` (`components/ui/clickable-pill.tsx`), `StatusBadge`, `ConfirmDialog`, `EmptyState`, `DatePicker/DatePickerDual` (`components/ui/date-picker.tsx`), `getEtapasEnsino` (`lib/actions/etapas-ensino.ts`), Supabase via `getSupabaseAdmin()`, `lucide-react` (Trash2, CalendarCheck, Pencil)

**Storage**: PostgreSQL — nenhuma migration (coluna `academico_calendarios.etapas TEXT[]` já existe e já é persistida por `create/updateCalendario`)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate) + conferência visual em 1366×768

**Target Platform**: Web responsiva (modais com scroll interno; KPI grid `grid-cols-2 lg:grid-cols-4`; `DatePickerDual` empilha em mobile)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Etapas carregadas 1× por abertura do modal (`getEtapasEnsino` filtrada por escola+ano, dezenas de linhas); KPIs derivados em memória (funções puras já existentes, sem query nova); `DatePicker` com menos células renderizadas

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; `pessoaId` + auditoria nas escritas (inalterado); permissão `gestao-academica.estrutura-academica.calendarios` (inalterada); tokens Tailwind v4 (sem hex); dark-mode; comparação de datas por string `YYYY-MM-DD`

**Scale/Scope**: 3 arquivos (`estrutura-academica/page.tsx`, `TabCalendarios.tsx`, `date-picker.tsx`); etapas por escola+ano limitadas ao catálogo INEP (~35 códigos)

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — nenhuma action nova (só leitura via `getEtapasEnsino` existente; escritas pelos `create/updateCalendario` existentes). ✅
- **II. Security First** — permissões e `ConfirmDialog`s inalterados; validação de etapas obrigatórias também no client (regra UX, sem exposição nova). ✅
- **III. Multi-Tenant** — etapas sempre escopadas por `effectiveSchoolId + selectedAno.id`; superadmin sem escola não carrega. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `ModernTabs`, `StatCard`, `ClickablePill`, `Button variant="destructive"`; sem hex, sem `<button>`/`<input radio>` nativos. ✅
- **VII. Migrations** — nenhuma (coluna `etapas TEXT[]` existente). ✅
- **VIII. Auditability** — `registrar('criar'/'editar', 'Estrutura Acadêmica — Calendários', ...)` existente já inclui `etapas` no diff. ✅
- **IX. Feature-Based** — tudo em `gestao-academica/estrutura-academica/` + ajuste pontual em `components/ui/date-picker.tsx` (componente compartilhado, mudança compatível). ✅
- **X. No New Patterns** — `ModernTabs` segue `dashboard-tabs.tsx`; pills seguem `comunicado-form.tsx`/`ocorrencia-form.tsx`; modal com scroll segue padrão `max-h-[90vh] overflow-y-auto`. ✅
- **XI. Design System First** — nenhum componente novo (constante local de grupos é dado, não componente). ✅

### Product Experience

- **PE-101/102** → abas, rótulos e KPIs padronizados, sem atrito visual.
- **PE-201/204** → modal: Identificação → Etapas (só ativas, grupos vazios ocultos, Selecionar Todas por grupo).
- **PE-205** → etapas obrigatórias + datas validadas com `toast.error` antes de escrever.

## Project Structure

### Documentation (this feature)

```text
specs/031-calendarios-ajustes/
├── plan.md              # This file
├── data-model.md        # Sem DDL: semântica de etapas[] + mapa dos 7 grupos + derivações KPI
├── quickstart.md        # Roteiro de verificação manual
├── spec.md              # Feature specification
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-academica/estrutura-academica/
│   ├── page.tsx                 # MOD: Tabs ad-hoc → ModernTabs (FR-001)
│   └── TabCalendarios.tsx       # MOD: subcard ano (FR-002/003), modal etapas (FR-004/005/006),
│                                #       KPIs topo (FR-009/010), tipo em pills (FR-011)
└── components/ui/
    └── date-picker.tsx          # MOD: semanas dinâmicas + popover responsivo (FR-007)
                                # + overflow-y-auto nos 3 DialogContents da aba (FR-008, em TabCalendarios)
```

## Phases

### Phase 0 — Abas + subcard do ano (US1, US2 — sem dependências)

`page.tsx`: trocar `Tabs/TabsList/TabsTrigger/Content` por `ModernTabs` (`fullWidth`, `defaultValue="calendarios"`, `urlSync={false}`, children = 3 tabs). `TabCalendarios.tsx:771-800`: 3 linhas com rótulo + `Encerrar/Ativar/Reativar flex-1` + `Excluir variant="destructive" flex-1` com ícone + label. ConfirmDialogs intactos.

### Phase 1 — Vínculo de Etapas (US3 — núcleo; depende só do modal existir)

Constante local `GRUPOS_CALENDARIO` (7 títulos + listas de códigos INEP, §2 de `data-model.md`); state `etapasDisponiveis` carregado via `getEtapasEnsino` na abertura do modal; seção "Etapas de Ensino *" com grupo → título + "Selecionar Todas" + pills multi-select; `handleCreate/UpdateCalendario` bloqueiam `etapas.length===0`; modal `max-w-2xl`; pré-preencher `cal.etapas`; empty/loading states.

### Phase 2 — Responsividade (US4 — paralelizável com Phase 1, arquivos distintos)

`date-picker.tsx`: remover pad de 42 células (semanas dinâmicas), `PopoverContent max-w-[calc(100vw-2rem)] + collisionPadding={16}`; 3 `DialogContent`s da aba ganham `overflow-y-auto`. Verificar regressão visual nos outros consumidores do `DatePicker` (TurmaForm, comunicados, agenda — mudança é só remoção de células vazias + limite de largura).

### Phase 3 — KPIs + pills de evento (US5, US6 — paralelizáveis entre si)

`renderPeriodosKpis()` para acima de `renderCalendarGrid()`; KPI geral em `StatCard` (ícone `CalendarCheck`); KPI por período em card no mesmo visual com editar/excluir; remover `StatusBadge` do header; grid `grid-cols-2 lg:grid-cols-4`; sem períodos → só geral. Tipo do evento: radios → 3 `ClickablePill` seleção única ligados a `eventoForm.tipo`.

### Phase 4 — Gates

`tsc`, `build`, `quickstart.md` completo em 1366×768 + mobile, `grep 'type="radio"'` e `grep '#[0-9A-Fa-f]\{6\}'` limpos no módulo.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Agrupar por código INEP explícito (constante local) | Agrupar por `etapa_tipo` | Médio e Normal/Magistério compartilham `tipo='medio'` — só código separa; constante local evita tocar `TabEtapas` |
| `etapas TEXT[]` = códigos INEP string | UUIDs de `academico_etapas_ensino` | UUID varia por ano letivo; código INEP é estável e legível no diff de auditoria |
| KPI de período replica estilo StatCard em vez do componente | Forçar `StatCard` + ações absolutas | `StatCard` não tem slot de ações; replicar as classes mantém o visual sem acoplar posicionamento absoluto ao componente oficial |
| `urlSync={false}` nas abas | Sync como na Dashboard | Evita poluir `?tab=` dentro do Tab Workspace (a Dashboard é rota própria; esta página vive dentro de uma aba) |
| Semanas dinâmicas no DatePicker | Altura fixa menor | Altura fixa ainda reserva espaço em meses curtos; dinâmico elimina o vazio em todos os meses |
