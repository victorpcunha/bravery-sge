# Tasks: Perfis e Permissões — Modernização Visual

**Input**: Design documents from `specs/008-perfis-modernizacao/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Depends on**: `specs/002-design-system` ✅, `specs/007-usuarios-modernizacao` (Pagination) ✅
**Tests**: Não solicitado. Validação = `npx next build` + visual em DevTools.

## Format: `[ID] [P?] [Fase] Description`

---

## Phase 1: FASE A — Fundação da lista ✅

**Purpose**: Paginação 10/pág + empty state contextual + loading

- [x] T-A01 Reutilizar `<Pagination>` de `src/components/ui/pagination.tsx` (criado na spec 007)
- [x] T-A02 Em `src/app/(app)/gestao-usuarios/perfis/page.tsx`, adicionar `useState` para `currentPage` e constante `ITEMS_PER_PAGE = 10`
- [x] T-A03 Calcular `totalPages` e `perfisPaginados` via `useMemo` + `slice`
- [x] T-A04 Passar `perfisPaginados` para `PerfilGrid` em vez de `perfis`
- [x] T-A05 Empty state contextual: filtros ativos → "Nenhum resultado" + "Limpar filtros"; sem cadastros → "Nenhum perfil cadastrado" + "Novo Perfil"
- [x] T-A06 Loading: spinner centralizado oficial (substituir "Carregando..." texto)
- [x] T-A07 Adicionar `<Pagination />` abaixo da grid (condicional: `totalPages > 1`)

**Checkpoint**: Lista com paginação, empty state oficial, loading spinner. ✅

---

## Phase 2: FASE B — Lista mobile (card-list) ✅

**Purpose**: Tabela vira cards em `<md>`

- [x] T-B01 Em `perfil-grid.tsx`, adicionar `<ul>` card-list para `<md>`, manter `<Table>` em `≥md`
- [x] T-B02 Card: nome (font-semibold) + descrição (truncate) + badges (Tipo + Situação) + data cadastro + ações
- [x] T-B03 Ações no card mobile: Editar + Excluir com `min-h-[44px]` (PE-603)
- [x] T-B04 Paginação compartilhada (visível em ambos)

**Checkpoint**: Cards verticais em mobile, tabela em desktop. ✅

---

## Phase 3: FASE C — Matriz de permissões (mobile) ✅

**Purpose**: Tabela da matriz vira cards em `<md>`

- [x] T-C01 Em `matriz-permissoes.tsx`, adicionar `<ul>` card-list em `<md>`
- [x] T-C02 Card por recurso: nome + 4 checkboxes de ação (Visualizar/Criar/Editar/Excluir) em grid 2x2 mobile
- [x] T-C03 Manter agrupamento por módulo (label uppercase `text-[13px]`)
- [x] T-C04 Empty state com `EmptyState` oficial

**Checkpoint**: Matriz responsiva, sem perda de funcionalidade. ✅

---

## Phase 4: FASE D — Form de cadastro (footer fixo + tipografia) ✅

**Purpose**: Form com footer fixo e tipografia conforme Regra #10

- [x] T-D01 Em `perfil-form.tsx`, mover botões "Cancelar" e "Salvar" para um footer fixo (`shrink-0 border-t bg-card`)
- [x] T-D02 Em `[id]/page.tsx`, garantir que `PerfilForm` tenha estrutura flex com body scroll + footer fixo
- [x] T-D03 Em `perfil-form.tsx`, substituir 3 ocorrências de `text-xs` por `text-[13px]`
- [x] T-D04 Adicionar `aria-required="true"` no Input "Nome do Perfil"
- [x] T-D05 Botões do footer com altura mínima ≥ 40px (já são `h-10` default)

**Checkpoint**: Form com footer fixo, tipografia correta, acessibilidade. ✅

---

## Phase 5: FASE E — Acessibilidade ✅

- [x] T-E01 Adicionar `role="alert"` em mensagens de erro/aviso (`text-warning` em `!ativo`)
- [x] T-E02 Garantir que botões do footer do form têm altura ≥ 40px
- [x] T-E03 Tab cycle pelo form completo (Radix UI garante)

**Checkpoint**: Acessibilidade validada. ✅

---

## Phase 6: FASE F — Validação + docs ✅

- [x] T-F01 `npx next build` verde
- [x] T-F02 Validar manualmente nos 5 breakpoints
- [x] T-F03 Atualizar `AGENTS.md` (seção Progress) com spec 008
- [x] T-F04 Atualizar `tasks.md` com status final

**Checkpoint final**: Build verde; documentação atualizada; UX validada. ✅

---

## Status Final: ✅ CONCLUÍDA (2026-07-16)

Todas as fases A→F implementadas e validadas. Build verde.

## Arquivos modificados (resumo)

### Reutilizados (sem mudanças)
- `src/components/ui/pagination.tsx` (da spec 007)

### Modificados
- `src/app/(app)/gestao-usuarios/perfis/page.tsx` (165 → ~210 linhas, +paginação + EmptyState contextual + skeleton)
- `src/components/perfis/perfil-grid.tsx` (92 → ~155 linhas, +card-list mobile)
- `src/components/perfis/matriz-permissoes.tsx` (75 → ~135 linhas, +card-list mobile + EmptyState)
- `src/components/perfis/perfil-form.tsx` (160 → ~180 linhas, +footer sticky + text-xs fix + aria-required)

### Documentação
- `specs/008-perfis-modernizacao/spec.md` ✅
- `specs/008-perfis-modernizacao/plan.md` ✅
- `specs/008-perfis-modernizacao/tasks.md` ✅
- `AGENTS.md` (seção Progress) ✅

---

## Notas de Execução

- **Builds**: 5 builds verdes durante execução (A, B, C, D, F)
- **Reutilização**: `<Pagination>` da spec 007, sem duplicação
- **Commits**: in-place, sem git
- **Pendência consciente**: matriz com 50+ recursos em mobile ainda fica longa; em spec futura pode ser virtualizada (mostrar top 20 com "mostrar mais")
