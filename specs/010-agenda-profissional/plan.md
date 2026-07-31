# Implementation Plan: Agenda do Profissional — Topbar Drawer

**Branch**: `010-agenda-profissional` | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-agenda-profissional/spec.md`

## Summary

Adicionar painel lateral (Sheet) acionado pelo botão calendário na Topbar com CRUD de compromissos pessoais do profissional. Inclui filtro por mês, abas Hoje/Semana/Mês, listagem cronológica com cards, hover-delete com confirmação, e modal de criação com formulário completo. Dados persistidos no Supabase via nova migration `agenda_compromissos.sql` e server actions em `agenda.ts`.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)

**Primary Dependencies**: shadcn/ui v4 (Sheet, Dialog, Button, Input, Select, Textarea, Calendar, Popover), Tailwind CSS v4, lucide-react, sonner (toast), date-fns, react-day-picker

**Storage**: PostgreSQL via Supabase — 1 nova migration `agenda_compromissos.sql`

**Testing**: Validação visual manual + build (`npx next build`). Sem framework de teste automatizado.

**Target Platform**: Web (Next.js App Router, Client Components)

**Project Type**: Web application — frontend expansion + novas server actions + migration

**Performance Goals**: Lista carrega em <500ms. Criação/exclusão instantânea com refresh otimista. Build permanece estável.

**Constraints**: Zero novas dependências npm. Seguir tokens Design System (sem cores hardcoded). shadcn/ui para todos componentes de UI.

**Scale/Scope**: ~1 migration, ~1 server action file, ~7 novos componentes, ~1 componente modificado.

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Todas operações em `agenda.ts` com `'use server'` |
| II. Security First | ✅ PASS | Ações filtram por `school_id` + `pessoa_id` do usuário logado |
| III. Multi-Tenant by Design | ✅ PASS | Queries filtram por `school_id` |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Componentes usam tokens Tailwind oficiais (bg-card, text-foreground, etc.) |
| V. Dark Mode Compatibility | ✅ PASS | Tokens com variantes `.dark` definidas no globals.css |
| VI. shadcn/ui as UI Standard | ✅ PASS | Sheet, Dialog, Button, Input, Select, Textarea, Calendar, Popover oficiais |
| VII. Database Through Migrations | ✅ PASS | `agenda_compromissos.sql` em `supabase-migrations/` |
| VIII. Auditability First | ✅ PASS | `created_by`, `updated_by`, `created_at`, `updated_at` na nova tabela |
| IX. Feature-Based Architecture | ✅ PASS | Componentes em `src/components/agenda/`, actions em `src/lib/actions/agenda.ts` |
| X. No New Patterns Without Approval | ✅ PASS | Reutiliza Sheet, Dialog, Select, Calendar, Popover, Badge, ConfirmDialog existentes |
| XI. Design System First | ✅ PASS | Todos componentes do catálogo oficial |

**Gate: PASS** — Nenhuma violação.

### Product Experience

- **PE-101** ✅ Sheet tem único objetivo: gerenciar compromissos
- **PE-401** ✅ Exclusão com ConfirmDialog
- **PE-403** ✅ Toast de sucesso ao criar/excluir
- **PE-404** ✅ Loading no botão Salvar
- **PE-501** ✅ EmptyState na lista vazia
- **PE-603** ✅ Sheet responsivo, botões com 44px para toque

## Project Structure

### Documentation (this feature)

```text
specs/010-agenda-profissional/
├── plan.md              # This file
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
supabase-migrations/
└── agenda_compromissos.sql              # NOVA migration

src/lib/actions/
└── agenda.ts                             # NOVAS server actions

src/components/agenda/
├── agenda-drawer.tsx                     # Sheet wrapper
├── agenda-filtros.tsx                    # Select mês + Tabs
├── agenda-lista.tsx                      # Lista cronológica
├── agenda-card.tsx                       # Card de evento
├── agenda-empty.tsx                      # Empty state
├── agenda-categoria-badge.tsx            # Badge colorido
└── agenda-modal-novo.tsx                 # Modal de criação

src/components/layout/
└── topbar.tsx                            # MODIFICADO - onClick
```

## Phases

### FASE 1 — Migração + Server Actions
- `supabase-migrations/agenda_compromissos.sql`
- `src/lib/actions/agenda.ts`

### FASE 2 — Componentes do Drawer
- `agenda-empty.tsx`
- `agenda-categoria-badge.tsx`
- `agenda-card.tsx`
- `agenda-lista.tsx`
- `agenda-filtros.tsx`
- `agenda-modal-novo.tsx`
- `agenda-drawer.tsx`

### FASE 3 — Integração Topbar + Build
- Modificar `topbar.tsx`
- `npx next build`

## Complexity Tracking

Nenhuma violação. Complexity Tracking não se aplica.
