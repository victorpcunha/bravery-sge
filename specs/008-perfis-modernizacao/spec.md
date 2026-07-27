# Feature Specification: Perfis e Permissões — Modernização Visual

**Feature Branch**: `008-perfis-modernizacao`
**Created**: 2026-07-16
**Status**: Draft
**Depends on**: `specs/002-design-system` ✅
**Input**: User description: "Modernizar a tela de Perfis e Permissões, mesmo padrão da spec 007 (visual completo). Lista com card-list + paginação. Matriz de permissões com card-list em mobile. Form do cadastro com footer fixo."

## Contexto

A tela de Perfis (`/gestao-usuarios/perfis`) e a tela de cadastro/edição (`/gestao-usuarios/perfis/[id]`) estão em estado razoável — já usam `PageContainer`, `PageHeader`, `PageSection`, `FilterBar`, `ConfirmDialog`, `FormCard`. Mas:

1. A **lista** tem loading com texto cru, empty state sem `EmptyState` oficial, sem paginação, sem card-list em mobile
2. O **cadastro** não tem footer fixo, falta `aria-required` no campo Nome, `text-xs` em 3 hints
3. A **matriz de permissões** tem empty state cru e tabela sem adaptação mobile

Esta spec **não altera contratos de dados** (`listarPerfis`, `criarPerfil`, `editarPerfil`, `excluirPerfil`, `listarPermissoes`, `salvarPermissoes` permanecem).

## Clarifications

### Session 2026-07-16

- Q: Matriz de permissões — manter ou refatorar? → A: **Adicionar adaptação mobile completa** (card-list)
- Q: Lista — quais refinamentos? → A: **Card-list em `<md>` + paginação 10/pág**
- Q: Form do cadastro — qual tratamento? → A: **Footer fixo com botões Salvar/Cancelar**
- Q: Hero metric / card especial? → A: **N/A** — tela de listagem
- Q: Re-fetch vs client-side? → A: **Client-side** (10/pág, sem mudar `listarPerfis`)

---

## Product Experience

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx** | PE-101 | Lista de perfis é tarefa administrativa — busca, filtros, ações rápidas |
| **PE-2xx** | PE-201, PE-202 | Hierarquia: filtros > grid/cards > ações |
| **PE-4xx** | PE-401, PE-403 | Skeleton/spinner, empty state com CTA |
| **PE-5xx** | PE-501 | Empty state com EmptyState oficial |
| **PE-6xx** | **PE-601, PE-602, PE-603, PE-604, PE-605** | Tabela→cards em mobile; touch ≥ 36px; matriz com card-list |
| **PE-7xx** | PE-704 | Paginação reduz carga cognitiva |
| **PE-8xx** | PE-801 | StatusBadge semântico (success/muted para Ativo/Inativo; info/primary para Professor/Administrativo) |
| **PE-9xx** | PE-902, PE-905 | Foco visível, `aria-required` em Nome, `role="alert"` em mensagens |

## User Scenarios

### User Story 1 — Gestor busca perfil e encontra em < 3s (P1)

Acessa `/gestao-usuarios/perfis`. Digita "coord" na busca. Lista filtra. Se vazio, vê empty state com CTA "Novo Perfil". Se >10, vê paginação.

**Acceptance**:
- Filtro de busca funciona em tempo real
- Empty state com EmptyState oficial (ícone + título + descrição + CTA)
- Paginação com 10/pág + prev/next

### User Story 2 — Lista mobile com cards (P1)

Em <768px, cada perfil vira card com nome, descrição, badges (tipo + situação), ações Editar/Excluir. Touch ≥ 44px.

**Acceptance**:
- Card mobile com hierarquia clara
- Tabela em ≥md
- Paginação compartilhada

### User Story 3 — Matriz de permissões em mobile (P2)

Em mobile, cada recurso vira card com 4 switches/checkboxes de ação (Visualizar, Criar, Editar, Excluir). Toque em qualquer um marca/desmarca.

**Acceptance**:
- Cards mobile com toggles claros
- Tabela em ≥md
- Sticky left em desktop (já tem)

### User Story 4 — Form de cadastro com footer fixo (P2)

Página de cadastro (`/perfis/novo` ou `/perfis/[id]`) com FormCards de Identificação e Permissões. Footer fixo no rodapé com "Cancelar" e "Salvar". Scroll no body, footer sempre visível.

**Acceptance**:
- Footer fixo `shrink-0` com botões `min-h-[40px]`
- "Nome do Perfil" com `aria-required`
- Mensagens com `role="alert"`

## Edge Cases

- Lista com 0 perfis (escola nova): empty state com CTA
- Filtro sem resultado: empty state específico
- Sem permissão para criar/editar: toast + redirect (já existe)
- Matriz sem recursos cadastrados: empty state
- Form sem nome: botão Salvar desabilitado (já existe)

## Out of Scope

- Refator do `matriz-permissoes` em subcomponentes
- Server-side pagination
- Audit log de alterações de perfil
- Drag-and-drop para reordenar perfis
- Bulk actions
- Export de perfis/permissões
