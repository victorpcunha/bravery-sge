# Implementation Plan: Perfis e Permissões — Modernização Visual

**Branch**: `008-perfis-modernizacao` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)
**Depends on**: `specs/002-design-system` ✅, `specs/007-usuarios-modernizacao` (Pagination reutilizado) ✅

## Summary

Modernizar a tela de Perfis (`/gestao-usuarios/perfis` lista + `/[id]` cadastro/edição). Dividida em 6 fases (A→F). Sem refator estrutural. Reutiliza `<Pagination>` da spec 007. Inclui card-list em mobile para lista e matriz, footer fixo no form, ajustes de tipografia e acessibilidade.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
**Primary Dependencies**: shadcn/ui v4, Tailwind CSS v4, lucide-react, sonner
**Storage**: Nenhuma migration nesta spec
**Testing**: `npx next build` + validação visual
**Performance Goals**: Build permanece estável. Paginação client-side.
**Constraints**: Zero novas dependências npm. Manter contratos de `listarPerfis`, `criarPerfil`, `editarPerfil`, `excluirPerfil`, `listarPermissoes`, `salvarPermissoes`.
**Scale/Scope**: 5 arquivos modificados (page.tsx, [id]/page.tsx, perfil-grid, perfil-form, matriz-permissoes). Reutiliza `<Pagination>` da spec 007.

## Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Nenhuma action nova |
| II. Security First | ✅ PASS | Verificação de permissão existente preservada |
| III. Multi-Tenant by Design | ✅ PASS | `schoolId` preservado |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Apenas correções de tokens |
| V. Dark Mode Compatibility | ✅ PASS | Tokens já adaptam |
| VI. shadcn/ui as UI Standard | ✅ PASS | EmptyState, Card, Table oficiais |
| VII. Database Through Migrations | N/A | Nenhuma migration |
| VIII. Auditability First | N/A | Nenhuma operação de dados |
| IX. Feature-Based Architecture | ✅ PASS | Componentes em `src/components/perfis/` |
| X. No New Patterns Without Approval | ✅ PASS | Reutiliza Pagination da spec 007 |
| XI. Design System First | ✅ PASS | Layout oficial, componentes oficiais |

**Gate: PASS**

## Project Structure

### Source Code (modificado)

```text
src/
├── app/(app)/gestao-usuarios/perfis/
│   ├── page.tsx                     # MODIFIED: paginação 10/pág, currentPage state
│   └── [id]/page.tsx                # MODIFIED: footer fixo do form
│
└── components/perfis/
    ├── perfil-filtros.tsx           # (sem mudanças)
    ├── perfil-grid.tsx              # MODIFIED: card-list mobile, EmptyState, spinner
    ├── perfil-form.tsx              # MODIFIED: text-xs → text-[13px], aria-required
    └── matriz-permissoes.tsx        # MODIFIED: card-list mobile, EmptyState
```

## Implementation Phases

### FASE A — Fundação da lista

**Objetivo**: Paginação 10/pág + empty state contextual + loading spinner.

- T-A01: Reutilizar `<Pagination>` da spec 007 (já existe em `src/components/ui/pagination.tsx`)
- T-A02: `page.tsx` — adicionar `useState` para `currentPage`, constante `ITEMS_PER_PAGE = 10`
- T-A03: Calcular `totalPages` e `perfisPaginados` via `useMemo` + `slice`
- T-A04: Trocar `perfis.length` no título por `perfisPaginados.map(...)` (ou passar `perfis` paginado para `PerfilGrid`)
- T-A05: Empty state contextual: filtros ativos → "Nenhum resultado" + "Limpar filtros"; sem cadastros → "Nenhum perfil cadastrado" + "Novo Perfil"
- T-A06: Loading: spinner centralizado oficial (não texto cru)

### FASE B — Lista mobile (card-list)

**Objetivo**: Tabela vira cards em `<md>` (PE-602).

- T-B01: `perfil-grid.tsx` — adicionar `<ul>` card-list em `<md>`, manter `<Table>` em `≥md`
- T-B02: Card: nome (font-semibold) + descrição (truncate) + badges (Tipo + Situação) + data cadastro + ações
- T-B03: Ações no card: Editar + Excluir com `min-h-[44px]` (PE-603)
- T-B04: Paginação compartilhada (visível em ambos)

### FASE C — Matriz de permissões (mobile)

**Objetivo**: Tabela da matriz vira cards em `<md>`.

- T-C01: `matriz-permissoes.tsx` — adicionar `<ul>` card-list em `<md>`
- T-C02: Card por recurso: nome + 4 checkboxes de ação (Visualizar/Criar/Editar/Excluir) em grid 2x2 mobile / 4x1 desktop
- T-C03: Manter agrupamento por módulo (label uppercase)
- T-C04: Empty state com `EmptyState` oficial

### FASE D — Form de cadastro (footer fixo + tipografia)

**Objetivo**: Form com footer fixo e tipografia conforme Regra #10.

- T-D01: `perfil-form.tsx` — mover botões "Cancelar" e "Salvar" para um footer fixo no final (com `shrink-0 border-t`)
- T-D02: `page.tsx` ([id]/page.tsx) — ajustar layout para que o `PerfilForm` tenha estrutura de "body scroll + footer fixo" (similar ao Dialog oficial)
- T-D03: `perfil-form.tsx` — substituir 3 ocorrências de `text-xs` por `text-[13px]`
- T-D04: Adicionar `aria-required="true"` no Input "Nome do Perfil"
- T-D05: Botões do footer com altura mínima ≥ 40px (PE-603)

### FASE E — Acessibilidade

- T-E01: Adicionar `role="alert"` em mensagens de erro/aviso
- T-E02: Garantir que botões do footer do form têm altura ≥ 40px
- T-E03: Tab cycle pelo form completo (já deve estar OK com shadcn)

### FASE F — Validação + docs

- T-F01: `npx next build` verde
- T-F02: Validar manualmente nos 5 breakpoints
- T-F03: Atualizar `AGENTS.md` (seção Progress) com spec 008
- T-F04: Atualizar `tasks.md` com status final

## Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | Matriz com muitos recursos (>50) em mobile vira lista muito longa | Card-list com agrupamento por módulo, mesma UX desktop |
| R2 | Footer fixo do form pode cobrir conteúdo se body não tiver `overflow-y-auto` | Garantir estrutura flex-1/overflow-y-auto/shrink-0 |
| R3 | Spec 008 em paralelo com specs ativas | Arquivos ortogonais, sem conflito |

## Estratégia de Migração

- Commits in-place (preferência do usuário)
- Reutilizar `<Pagination>` da spec 007 (zero novas deps)
- Validação: build após cada fase

## Validação Final

- [ ] Build verde
- [ ] Lista com paginação
- [ ] Cards em mobile (lista + matriz)
- [ ] Footer fixo do form
- [ ] Zero `text-xs`
- [ ] `aria-required` em Nome
- [ ] `role="alert"` em mensagens
- [ ] `AGENTS.md` atualizado
