# Feature Specification: Usuários — Modernização Visual

**Feature Branch**: `007-usuarios-modernizacao`
**Created**: 2026-07-16
**Status**: Draft
**Depends on**: `specs/002-design-system` (catálogo de componentes) ✅
**Input**: User description: "Modernizar a tela de Usuários, mesmo padrão da Dashboard (visual completo). Manter PessoaForm em arquivo único. Adicionar card-list em mobile. Paginação 10/pág."

## Contexto

A tela de Usuários (`/gestao-usuarios/usuarios`) está em estado melhor que a Dashboard original — já usa `PageContainer`, `PageHeader`, `PageSection(flush)`, `FilterBar`, `EmptyState` e `ConfirmDialog`. Mas:

1. A **lista** (`page.tsx`) tem 6 problemas pontuais: tipografia (`text-xs` na linha 255), sem adaptação mobile para tabela, sem empty state contextual para filtros, sem paginação.
2. O **formulário** (`PessoaForm.tsx`, 1664 linhas) tem 8 problemas significativos: ~22 violações de `text-xs`, `grid-cols-2` sem responsividade mobile, Dialog sem padrão oficial, sem acessibilidade em mensagens de erro, sem paginação interna.

Esta spec **não altera contratos de dados** (`getPeople(schoolId, search, perfil, mostrarInativos)` permanece) — é refatoração visual/UX alinhada com Visual Language v2 e princípios PE.

## Clarifications

### Session 2026-07-16

- Q: PessoaForm (1664 linhas) — manter em arquivo único ou refatorar? → A: **Manter arquivo único**, ajustar tipografia/mobile/acessibilidade/dialog oficial
- Q: Lista em mobile — card-list ou tabela com overflow? → A: **Card-list** em `<md>` (similar à FASE H da Dashboard)
- Q: Paginação — incluir ou adiar? → A: **Incluir 10/pág** (client-side)
- Q: Hero metric / hero card? → A: **N/A** — tela de listagem, sem KPI (decisão da spec 002 design system oficial)
- Q: Re-fetch vs client-side? → A: **Client-side** (10/pág) — sem mudar `getPeople`

---

## Product Experience

Esta spec aplica os seguintes princípios do `product-experience.md`:

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx Filosofia** | PE-101 | Lista de usuários é tarefa operacional — deve priorizar busca, filtros e ações rápidas |
| **PE-2xx Hierarquia** | PE-201, PE-202, PE-203 | Hierarquia: filtros > contador > tabela/cards; ações de linha (Editar/Excluir) discretas |
| **PE-3xx Layout** | PE-301, PE-302, PE-303 | Layout oficial de listagem (PageContainer > PageHeader + Filtros + Tabela/Cards) |
| **PE-4xx Feedback** | PE-401, PE-402, PE-403 | Empty state contextual para "sem resultados de filtro"; toast em ações; skeleton no loading |
| **PE-5xx Estado Zero** | PE-501, PE-502 | Empty state distingue "sem cadastros" vs "filtro não retornou" |
| **PE-6xx Responsividade** | **PE-601, PE-602, PE-603, PE-604, PE-605** | Tabela → cards em mobile; touch ≥ 36px; grid 2-col → 1-col em mobile; prioridade preservada (filtros no topo) |
| **PE-7xx Jornada** | PE-704 | Paginação reduz carga cognitiva em listas grandes |
| **PE-8xx Visualização** | PE-801 | StatusBadge com cor semântica (success=ativo, destructive=inativo) |
| **PE-9xx Acessibilidade** | PE-902, PE-905 | Foco visível em ações; mensagens de erro com `role="alert"`; campos obrigatórios com `aria-required` |

### Princípios do `visual-language.md`

- **§5 Tipografia**: corpo 15px (não 14px); labels de seção 16px semibold; subheading 16px; descrição 13px
- **§6 Espaçamento**: `space-4` (16px) entre colunas, `space-2` (8px) gap interno
- **§7 Radius**: `rounded-md` em botões, `rounded-lg` em cards
- **§8 Elevação**: `shadow-sm` em cards em repouso

### Princípios do `constitution.md`

- **Regra #6 shadcn/ui as UI Standard**: Card, Table, Dialog, Button, Select, EmptyState oficiais
- **Regra #8 Componentes oficiais**: FormCard para organizar seções do PessoaForm

---

## User Scenarios & Testing

### User Story 1 — Gestor filtra usuários e encontra resultado em < 3 segundos (Priority: P1)

O gestor acessa `/gestao-usuarios/usuarios`. Vê a lista de usuários. Digita "maria" na busca. Lista filtra em tempo real. Se o filtro não retornar resultados, vê empty state específico: "Nenhum usuário encontrado para 'maria'". Se retornar, vê contador "5 usuário(s) encontrado(s)" e a tabela atualizada.

**Acceptance Scenarios**:
1. **Given** uma escola com 100 usuários, **When** o gestor digita "maria" na busca, **Then** a lista filtra para mostrar apenas usuários com "maria" no nome
2. **Given** busca por "xyz123" (sem matches), **When** o filtro não retorna, **Then** o empty state mostra "Nenhum usuário encontrado para 'xyz123'" com botão "Limpar filtros"
3. **Given** o gestor clica em "Limpar filtros", **When** a busca é limpa, **Then** todos os usuários voltam à lista
4. **Given** a lista tem mais de 10 usuários, **When** o gestor rola a página, **Then** vê paginação: 1-10 de 47, com botões "Anterior" e "Próximo"

---

### User Story 2 — Gestor acessa a lista em mobile e consegue ler/editar (Priority: P1)

Em viewport < 768px, a tabela vira lista de cards verticais. Cada card mostra: nome completo, CPF, INEP, badges de tipo, badge de status, e botões de ação. Toque em qualquer área do card abre menu de ações (ou os botões ficam visíveis diretamente).

**Acceptance Scenarios**:
1. **Given** viewport 360px, **When** o gestor acessa a lista, **Then** os usuários são renderizados como cards verticais (não tabela)
2. **Given** o card mobile, **When** o usuário toca no botão "Editar" do card, **Then** o modal de edição abre
3. **Given** o card mobile, **When** o usuário toca no botão "Excluir", **Then** o ConfirmDialog abre
4. **Given** o card mobile, **When** visualizado, **Then** os botões de ação têm altura ≥ 44px (PE-603)

---

### User Story 3 — Gestor preenche PessoaForm com tipografia consistente e mobile-friendly (Priority: P2)

O gestor abre o modal de criar/editar pessoa. O formulário tem seções claramente separadas (FormCard). Cada label é 15px, cada hint é 13px, cada mensagem de erro aparece com `role="alert"`. Em mobile, os campos 2-col viram 1-col automaticamente.

**Acceptance Scenarios**:
1. **Given** o modal aberto em desktop, **When** o gestor olha os labels, **Then** todos têm 15px (não 14px nem 12px)
2. **Given** o modal aberto em mobile (360px), **When** os campos são renderizados, **Then** cada par de campos vira 1 coluna (não 2 colunas apertadas)
3. **Given** um campo obrigatório vazio, **When** o usuário tenta salvar, **Then** a mensagem de erro aparece com `role="alert"` e `aria-describedby` apontando para o input
4. **Given** o modal, **When** o usuário rola para baixo, **Then** o header fica visível (ou o footer de ação fica fixo no fundo)

---

### User Story 4 — Lista é navegável com teclado (Priority: P2)

Usuário pode tabular entre: busca → filtros de perfil → botão "Mostrar inativos" → botão "Novo" → linhas da tabela/cards. Cada elemento interativo tem `focus-visible:ring-2 focus-visible:ring-ring`.

**Acceptance Scenarios**:
1. **Given** o usuário tabando, **When** chega na linha da tabela, **Then** vê `focus-visible:ring-2` claro no botão Editar
2. **Given** o modal aberto, **When** o usuário tabando, **Then** consegue alcançar todos os campos e botões sem "preso" em algum lugar
3. **Given** o ConfirmDialog de exclusão, **When** o usuário tabando, **Then** "Cancelar" e "Excluir" são alcançáveis; Enter aciona o focado

---

## Edge Cases

- **Lista com 0 usuários** (escola nova): empty state "Nenhum usuário cadastrado" com CTA "Novo Usuário"
- **Filtro sem resultados**: empty state específico "Nenhum resultado para os filtros aplicados" + botão "Limpar filtros"
- **Erro de rede ao carregar**: toast.error "Erro ao carregar usuários"
- **Modal aberto com PessoaForm pesado (1664 linhas)**: DialogContent com `max-h-[90vh]` e Form com `overflow-y-auto` para permitir scroll
- **Paginação 10/pág** com exatamente 10 usuários: paginação escondida (não mostra "1 de 1")
- **Inativar pessoa**: inativa mas mantém na lista se filtro "Mostrar inativos" ativo
- **Mobile 320px**: cards devem continuar legíveis (truncate em nome longo, badges quebram linha)

## Out of Scope

- Edição inline na tabela (clicar para editar sem modal)
- Drag-and-drop para reordenar
- Bulk actions (selecionar múltiplos e excluir)
- Export para CSV/Excel
- Histórico de alterações da pessoa (audit log visual)
- Refator estrutural do PessoaForm em subcomponentes
- Server-side pagination (cursor ou offset)
- Filtros adicionais (data de cadastro, escola específica além do super admin)
- Busca avançada (regex, multi-campo, etc.)
