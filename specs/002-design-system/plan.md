# Implementation Plan: Design System — Padronização Global de UI/UX

**Branch**: `002-design-system` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-design-system/spec.md`

## Summary

Criar um Design System interno para o Bravery SGE, definindo componentes oficiais reutilizáveis (PageContainer, PageHeader, PageSection com variantes, FilterBar, FormCard, StatusBadge, ConfirmDialog, SearchInput), consolidar padrões visuais existentes (eliminar `card-glass`, `shadow-[rgba]`, `text-white` em botões, `<button>` nativo, `<table>` nativo, heading manual), migrar todas as 30+ páginas para usar componentes oficiais, e documentar um catálogo de componentes como referência canônica para implementações futuras.

A abordagem é incremental: primeiro criar/melhorar os componentes oficiais (Fase 1), depois documentar o catálogo (Fase 2), depois migrar páginas grupo a grupo (Fases 3-5), e finalmente verificar Dark Mode e remover código legado (Fase 6).

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)

**Primary Dependencies**: Tailwind CSS v4, shadcn/ui v4, react-hook-form + zod v4, lucide-react, sonner (toast), recharts (charts)

**Storage**: N/A (no database changes — this is a UI-only initiative)

**Testing**: Nenhum framework de teste automatizado instalado. Validação visual por inspeção manual (Light/Dark Mode) e build (`npx next build`).

**Target Platform**: Web (Next.js App Router, Server Components + Client Components)

**Project Type**: Web application — refactoring/UI standardization (no new features, no data model changes)

**Performance Goals**: Nenhuma regressão de performance. Build time deve permanecer estável. Bundle size não deve aumentar significativamente (componentes são wrappers em torno de primitivos shadcn existentes).

**Constraints**: Princípios constitucionais (Design Tokens, shadcn/ui, Dark Mode, Feature-Based Architecture, Server Actions). Zero novas dependências npm. Zero mudanças no banco de dados.

**Scale/Scope**: 30+ páginas, 80+ componentes, 9 padrões de botão → 1, 2 padrões de card → 1, 3 padrões de heading → 1, ~26 instâncias de `text-white` → `text-primary-foreground`, ~43 instâncias de shadow hardcoded → escala Tailwind.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Nenhuma action nova necessária. Componentes são client-side. Migração não altera lógica de servidor. |
| II. Security First | ✅ PASS | Nenhuma mudança de segurança. Componentes visuais não acessam dados diretamente. |
| III. Multi-Tenant by Design | ✅ PASS | Componentes são agnósticos a escola. Layout e padrões visuais são globais. |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Este é o PRINCIPAL objetivo da feature — eliminar hardcoded styles e consolidar em tokens. |
| V. Dark Mode Compatibility | ✅ PASS | Verificação explícita em Fase 6. Todos os componentes usam tokens compatíveis com Dark Mode. |
| VI. shadcn/ui as UI Standard | ✅ PASS | Todos os componentes novos são compostos a partir de primitivos shadcn. Nenhuma alternativa de UI. |
| VII. Database Through Migrations | ✅ PASS | Nenhuma mudança de banco de dados. |
| VIII. Auditability First | ✅ PASS | N/A — componentes visuais não operam dados auditáveis. |
| IX. Feature-Based Architecture | ✅ PASS | Componentes de layout em `src/components/layout/`. Componentes de feature permanecem em `src/components/[feature]/`. Primitivos em `src/components/ui/`. |
| X. No New Patterns Without Approval | ✅ PASS | O Design System é aprovado via spec + plan. Nenhum novo padrão arquitetural. |
| XI. Design System First | ✅ PASS | Esta feature CRIA o princípio XI e o implementa. Auto-conformidade. |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/002-design-system/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Design decisions and alternatives
├── data-model.md        # Component entity definitions
├── quickstart.md        # Validation scenarios
├── contracts/           # Component API contracts
│   ├── layout-components.md
│   ├── data-components.md
│   ├── form-components.md
│   └── feedback-components.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── catalog.md           # Component catalog (anti-patterns, composition rules)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/                         # Design System layout components
│   │   ├── page-container.tsx          # NEW: PageContainer
│   │   ├── page-header.tsx             # EXISTING: enhance with breadcrumbs
│   │   ├── page-section.tsx            # EXISTING: add variant prop (flush, compact)
│   │   ├── filter-bar.tsx              # NEW: FilterBar
│   │   └── form-card.tsx               # NEW: FormCard
│   ├── ui/                             # shadcn/ui base components (unchanged)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── ... (existing shadcn components)
│   │   ├── stat-card.tsx              # EXISTING: reference pattern
│   │   └── empty-state.tsx            # EXISTING: used as-is
│   ├── feedback/                       # NEW subdirectory for feedback components
│   │   ├── confirm-dialog.tsx          # NEW: ConfirmDialog (wraps AlertDialog)
│   │   └── status-badge.tsx            # NEW: StatusBadge
│   └── [feature]/                      # Feature components (migrated in phases)
│       ├── painel-pessoa/
│       ├── perfis/
│       ├── diario-classe/
│       ├── conselho-classe/
│       ├── censo/
│       └── ...
├── app/
│   └── (app)/(auth)/                   # Pages (migrated in phases)
│       ├── page.tsx                    # Dashboard (migrate)
│       ├── escolas/                    # (migrate)
│       ├── gestao-usuarios/            # (migrate)
│       ├── gestao-turmas/              # (migrate)
│       ├── gestao-academica/            # (migrate)
│       ├── gestao-pedagogica/          # (migrate)
│       └── censo-escolar/              # (migrate)
└── app/
    └── globals.css                     # Remove card-glass (Phase 6)
```

**Structure Decision**: Componentes de layout em `src/components/layout/` (convenção existente), componentes de feedback em `src/components/feedback/` (novo subdiretório lógico), primitivos shadcn em `src/components/ui/` (inalterado). Feature components permanecem em `src/components/[feature]/` e são migrados conteúdo-internamente. Nenhum novo diretório de nível superior.

## Complexity Tracking

Nenhuma violação constitucional. Nenhuma complexidade excepcional justificada.

---

## Phase 0: Research ✅

**Completed**: research.md documents 13 design decisions with rationale and alternatives considered.

Key research outcomes:
1. Layout components in `src/components/layout/` (existing convention)
2. PageContainer as React component, not CSS class
3. PageSection variants via `variant` prop
4. StatusBadge with semantic status mapping, not arbitrary colors
5. FormCard wraps Card shadcn, not a new component
6. FilterBar uses children composition, not config props
7. Catalog in Markdown, not Storybook
8. Incremental page-by-page migration
9. EmptyState reused as-is
10. Header margin standardized to `mb-8`
11. Heading size standardized to `text-2xl font-semibold`
12. ConfirmDialog wraps AlertDialog shadcn
13. Dashboard layout via `maxWidth` prop on PageContainer

## Phase 1: Design & Contracts

### Components to Create/Enhance

| Component | Action | Priority | Key Props |
|-----------|--------|----------|-----------|
| PageContainer | NEW | P0 | `className`, `maxWidth: "default" \| "dashboard"` |
| PageHeader | ENHANCE | P0 | Add `breadcrumbs: BreadcrumbItem[]` prop |
| PageSection | ENHANCE | P0 | Add `variant: "default" \| "flush" \| "compact"` prop |
| FilterBar | NEW | P0 | `searchValue`, `onSearchChange`, `searchPlaceholder`, children |
| FormCard | NEW | P1 | `title`, `description`, `children`, `className` |
| StatusBadge | NEW | P1 | `status: semantic status`, `children` |
| ConfirmDialog | NEW | P1 | `title`, `description`, `confirmLabel`, `cancelLabel`, `variant`, `onConfirm`, `open`, `onOpenChange` |
| SearchInput | NEW | P1 | `value`, `onChange`, `placeholder`, `className` |

### Layouts Defined

| Layout | Composition | Use Case |
|--------|------------|----------|
| Listagem | PageContainer > PageHeader + FilterBar + PageSection(variant="flush") > Table + EmptyState | Escolas, Usuários, Turmas, Indicadores, etc. |
| Cadastro | PageContainer > PageHeader + FormCard(s) | Matrículas cadastro, Escola novo, Plano Ensino criar |
| Edição | PageContainer > PageHeader + FormCard(s) (pre-filled) | Editar escola, editar perfil |
| Visualização | PageContainer > PageHeader + PageSection(s) + Cards | Painel do Aluno, Escola detail, Plano Ensino detail |
| Dashboard | PageContainer(maxWidth="dashboard") > PageHeader + StatCards + PageSections | Dashboard principal |

### Anti-Patterns Catalog (to be documented)

| Anti-Pattern | Replacement | Occurrences |
|-------------|-------------|-------------|
| `text-white` on buttons | `text-primary-foreground` (or default Button variant) | ~26 |
| `shadow-[rgba]` | `shadow-xs` / `shadow-sm` / `shadow-md` | ~43 |
| `card-glass` CSS class | `PageSection` or `Card` shadcn | ~74 |
| `<button>` native | `<Button>` shadcn or `<Button variant="ghost">` | ~45 |
| `<table>` native | `<Table>` shadcn components | ~10 |
| Heading manual (3 patterns) | `<PageHeader>` | ~30 |
| 9 button style patterns | `<Button>` with default variant | ~30 |
| `border-2` on inputs | `border` (standard 1px) | ~2 |
| `shadow-lg shadow-blue-500/20` | `shadow-sm` or `shadow-md` | ~3 |
| `bg-purple-100 text-purple-700` (badges) | `<StatusBadge status="...">` | ~5 |
| `ml-64` (hardcoded sidebar) | Remove (layout handles sidebar) | 1 |
| `text-foreground/80` | `text-muted-foreground` | ~4 |

## Phase 2: Catalog Documentation

Create `specs/002-design-system/catalog.md` with:

1. **Component Catalog**: Every official component, props, variants, and usage examples
2. **Layout Catalog**: 5 official layouts with composition diagrams
3. **Design Token Registry**: All CSS tokens from globals.css mapped to usage contexts
4. **Anti-Pattern Registry**: Explicit list of prohibited patterns with examples
5. **Composition Rules**: How to compose pages from components
6. **Migration Guide**: Step-by-step guide for migrating each type of page

This catalog will be referenced from AGENTS.md for agent context.

## Phase 3: Core Component Implementation

Create/enhance the 8 core components listed in Phase 1. Each component:
- Uses exclusively Design Tokens
- Supports Light Mode and Dark Mode
- Is composed from shadcn/ui primitives
- Has TypeScript props with JSDoc comments
- Is documented in the catalog

## Phase 4-6: Page Migration (by group)

Migration order, grouped by dependency and impact:

**Phase 4: Dashboard + Modulos Administrativos**
- Dashboard (`(auth)/page.tsx`) — already uses PageHeader, needs minor alignment
- Escolas (`escolas/`) — oldest pages, most inconsistencies
- Gestão de Usuários (`gestao-usuarios/`) — usuarios, perfis, funções, painel-aluno
- Login (`login/`) — isolated, quick win

**Phase 5: Módulos Acadêmicos e Turmas**
- Gestão de Turmas (`gestao-turmas/`) — turmas, quadro-aulas
- Gestão Acadêmica (`gestao-academica/`) — matrículas, métodos
- Estrutura Acadêmica (`gestao-academica/estrutura-academica/`) — tabs, matrizes

**Phase 6: Módulos Pedagógicos + Censo + Limpeza**
- Gestão Pedagógica (`gestao-pedagogica/`) — indicadores, disciplinas, diário, plano ensino, conselho
- BNCC (`bncc/`) — áreas, campos, competências, etc.
- Censo Escolar (`censo-escolar/`) — newest module
- **Dark Mode verification** across all pages
- **Remove `card-glass` from globals.css**
- **Remove dead CSS classes**
- **Final build verification**: `npx next build`

Each page migration follows this checklist:
1. Replace manual `container mx-auto py-8 px-4` with `<PageContainer>`
2. Replace manual heading with `<PageHeader>`
3. Replace card-glass / shadow-[rgba] sections with `<PageSection>` or `<Card>`
4. Replace `<button>` native with `<Button>`
5. Replace `<table>` native with `<Table>` shadcn
6. Replace `text-white` with `text-primary-foreground` or Button default variant
7. Replace `shadow-[rgba]` with `shadow-sm` / `shadow-md`
8. Replace hardcoded badge colors with `<StatusBadge>`
9. Replace manual empty states with `<EmptyState>`
10. Replace manual filter bars with `<FilterBar>` where applicable
11. Replace native breadcrumb with `<PageHeader breadcrumbs>`
12. Verify Dark Mode appearance