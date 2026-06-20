# Quickstart: Design System — Padronização Global de UI/UX

**Feature**: 002-design-system
**Date**: 2026-06-11

## Prerequisites

1. Components in `src/components/layout/` (`page-header.tsx`, `page-section.tsx`) exist and are functional
2. shadcn/ui components (`Button`, `Card`, `Table`, `Dialog`, `AlertDialog`, `Badge`, `Input`, `Select`) are installed
3. Design tokens in `globals.css` are defined and functional (Light + Dark Mode)
4. The application builds successfully (`npx next build` passes)

## Validation Scenarios

### Scenario 1: PageContainer wraps page layout correctly

1. Create a test page using `<PageContainer>`
2. Verify: container is centered with `py-8 px-4` padding, `max-w-none` by default
3. Create a test page using `<PageContainer maxWidth="dashboard">`
4. Verify: container has `max-w-6xl` constraint
5. Verify: both render identically in Light Mode and Dark Mode

**Expected**: No manual `container mx-auto py-8 px-4` string in the page code. Container renders identically to the previous inline pattern.

### Scenario 2: PageHeader renders with breadcrumbs

1. Use `<PageHeader title="Turmas" description="Gerencie as turmas" icon={GraduationCap} actions={<Button>Nova Turma</Button>} />`
2. Verify: title is `text-2xl font-heading font-semibold`, description uses `text-muted-foreground`, icon is in `bg-primary/10 rounded-xl` container
3. Add `breadcrumbs={[{ label: "Gestão de Turmas", href: "/gestao-turmas" }, { label: "Turmas" }]}`
4. Verify: breadcrumb shows "Gestão de Turmas" as clickable link, "Turmas" as non-clickable current item

**Expected**: All 3 heading patterns (`text-3xl`, `text-2xl text-primary`, `text-xl font-semibold`) replaced by consistent `text-2xl font-heading font-semibold`.

### Scenario 3: FilterBar with search and filters

1. Use `<FilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Buscar turmas...">` with `<Select>` and `<Button>` as children
2. Verify: search input has magnifying glass icon and placeholder, filters and actions are aligned beside it
3. Verify: works correctly in Light Mode and Dark Mode

**Expected**: Consistent filter bar across all list pages. No duplicated search input implementations.

### Scenario 4: StatusBadge with semantic status

1. Render `<StatusBadge status="success">Ativo</StatusBadge>` → green badge
2. Render `<StatusBadge status="warning">Pendente</StatusBadge>` → yellow/amber badge
3. Render `<StatusBadge status="destructive">Inativo</StatusBadge>` → red badge
4. Render `<StatusBadge status="info">Info</StatusBadge>` → blue/accent badge
5. Render `<StatusBadge status="muted">Rascunho</StatusBadge>` → gray/muted badge
6. Toggle Dark Mode and verify all badges maintain contrast and readability

**Expected**: No hardcoded colors like `bg-purple-100 text-purple-700` or `bg-cyan-100 text-cyan-700` in any page using StatusBadge.

### Scenario 5: FormCard for form sections

1. Use `<FormCard title="Dados Pessoais" description="Informações básicas do aluno">` with form fields as children
2. Verify: Card with header (title + description) and content area with `space-y-4`
3. Verify: renders identically to the 3 existing patterns (`border bg-muted/40`, `border bg-muted/30`, `shadow-[rgba]`)
4. Toggle Dark Mode and verify card background and text contrast

**Expected**: All form sections use consistent padding, spacing, and styling regardless of which pattern was previously used.

### Scenario 6: ConfirmDialog for destructive actions

1. Use `<ConfirmDialog title="Excluir turma" description="Esta ação não pode ser desfeita." variant="destructive" onConfirm={handleDelete} open={open} onOpenChange={setOpen} />`
2. Verify: dialog opens with destructive styling (red confirm button), cancel button, and loading support
3. Use `<ConfirmDialog title="Desativar usuário" variant="warning" ...>` 
4. Verify: warning variant uses default button styling instead of red

**Expected**: All destructive confirmation dialogs use ConfirmDialog instead of manual Dialog + Button composition.

### Scenario 7: Anti-pattern elimination check

1. Run a global search for `text-white` in tsx files → should find 0 occurrences on buttons/primary backgrounds (exceptions: gradients with primary backgrounds that need white text, SVG fills)
2. Run a global search for `shadow-[` in tsx files → should find 0 occurrences
3. Run a global search for `card-glass` in tsx files → should find 0 occurrences (after CSS is removed)
4. Run a global search for `<button` in tsx files → should find 0 occurrences (or only intentional use cases with `variant="ghost"`)
5. Run a global search for `bg-white` in tsx files → should find 0 occurrences
6. Run a global search for `text-gray-` or `text-slate-` → should find 0 occurrences
7. Run a global search for `border-slate-` → should find 0 occurrences

**Expected**: All anti-patterns eliminated. Build passes without errors.

### Scenario 8: Dark Mode verification across all modules

1. Activate Dark Mode (toggle theme)
2. Navigate through: Escolas, Usuários, Turmas, Matrículas, Indicadores, Diário de Classe, Plano de Ensino, Censo Escolar
3. On each page, verify: (a) text contrast is adequate, (b) cards/sections backgrounds are visible, (c) buttons are distinguishable, (d) badges maintain semantic meaning, (e) sticky table columns have correct background
4. Toggle back to Light Mode and verify same pages render correctly

**Expected**: All pages maintain WCAG AA contrast in both modes. No invisible text, no broken backgrounds, no unstyled elements.

### Scenario 9: Catalog as reference for new implementation

1. A developer who has never worked on the system reads `specs/002-design-system/catalog.md`
2. Following only the catalog's composition rules and component API, they create a page of listagem with: PageContainer > PageHeader + FilterBar + PageSection(variant="flush") > Table + EmptyState
3. Verify: the page is visually consistent with existing pages, uses only design tokens, and contains no custom styles

**Expected**: New page created in <30 minutes with zero anti-patterns.

## Edge Cases

- PageContainer with no children (empty state page): renders wrapper with padding, no layout break
- PageHeader with no icon: renders without icon container, title aligned left
- PageHeader with long title: title truncates with `truncate` class
- FilterBar with no search (no searchValue prop): renders only children, no search input
- StatusBadge with unknown status string: falls back to `muted` variant
- ConfirmDialog with async onConfirm: shows loading on confirm button until promise resolves
- PageSection flush variant with Table: table fills section width, no padding, borders flush with section