# Navegação por Abas Internas

**Spec**: `016-abas-internas` | **Data**: 2026-09-04

## Objetivo

O sistema passa a funcionar com **navegação por abas internas**: o usuário permanece em uma única aba do navegador, mas consegue manter múltiplas telas abertas simultaneamente dentro do próprio sistema, com estado preservado.

## Requisitos

1. **Barra de abas fixa** abaixo da Topbar, sempre visível.
2. Cada **tela de menu** (Usuários, Turmas, Alunos Matriculados, etc.) abre como uma **nova aba** — as já abertas permanecem.
3. **Máximo 6 abas** simultâneas. Ao atingir o limite, **não abre automaticamente**: aviso ao usuário, que deve fechar uma aba manualmente antes de abrir outra.
4. Acessar uma tela **já aberta** (ex.: clicar em Usuários no menu com a aba de Usuários aberta) **não duplica** — apenas **foca** na aba existente.
5. **Preservação de estado**: enquanto a aba estiver aberta (mesmo sem foco), formulários preenchidos, filtros, paginação, scroll e listagens ficam exatamente como deixados.
6. **Modais** (ex.: editar registro) continuam sobre a tela/aba atual; **não geram abas** e ficam **ocultos junto com a aba** ao trocar.
7. **Sem persistência**: F5 / reabrir o navegador inicia novamente com apenas a tela inicial (Dashboard) aberta.
8. Cada aba possui **botão de fechamento (X)**.

## Decisões de produto (confirmadas)

- **Sub-telas (detalhe/cadastro)** dentro de um módulo **não geram nova aba**: substituem o conteúdo da aba do módulo (ex.: "Ver Plano" → detalhe; clicar numa turma → Diário da turma), com retorno pela navegação/breadcrumb da própria tela.
- **Preservação da listagem no drill-in**: ao entrar no detalhe/cadastro e voltar, a listagem reaparece com **filtros, paginação e posição de rolagem** intactos (via keep-alive em pilha dentro da aba — a listagem permanece montada e oculta).
- **Dashboard é fechável como as demais**; ao fechar a última aba, o Dashboard é reaberto automaticamente.
- **Limite 6**: ao tentar abrir a 7ª aba → toast "Feche uma aba para abrir outra" e **nenhuma navegação** (URL revertida).
- **Modais/menus por aba**: overlays (Dialog, Popover, Select, Tooltip...) são montados **dentro da entrada da aba** e ficam ocultos junto com ela ao trocar de aba.

## Arquitetura

O `(app)/layout` deixa de renderizar o `children` do router e passa a montar um **workspace de abas**. Como todas as páginas são client components, o workspace as renderiza a partir de um **registro de rotas** (`lib/tab-routes.tsx`), mantendo cada aba **montada** (pane `absolute inset-0`; entradas inativas com `visibility:hidden` + `inert`, preservando estado e scroll).

- **Registro** (`lib/tab-routes.tsx`): captura de cada rota navegável → módulo, componente, params. Cada **menu = 1 aba** identificado por módulo.
- **Estrutura de abas** (`tab-provider.tsx`): store em memória `{ module, entries[], activeIndex }`; ações `openOrFocus(pathname, search)`, `closeTab(module)`, `activateTab(module)`. Entradas guardam `pathname + search` para telas com query (`cadastro?id=X`) manterem seu próprio estado/URL.
- **Sincronização** (`tab-workspace.tsx`): efeito em `usePathname()` converte **qualquer navegação** (menu, topbar, links internos, `router.push`) em `openOrFocus` → abre/foca aba por módulo; drill-in empilha/desempilha entradas dentro da mesma aba.
- **Params injetados**: páginas dinâmicas (`escolas/[id]`, `plano-ensino/[id]`, `diario-classe/[turmaId]`, `/.../fechamento`, `perfis/[id]`) passam a usar `useTabParams()` (contexto do workspace; fallback `useParams`).
- **Contenção de overlays**: wrappers shadcn passam a montar o portal dentro da entrada (via `useTabPortalContainer()`), em vez de `document.body`.
- **URL sincronizada**: abrir/fechar/focar atualiza a barra de endereço para a tela da aba ativa; F5 vitaliza o store (só Dashboard).

## Arquivos

### Novos
```
src/components/tabs/
  tab-provider.tsx        # Context + store (abas, entrada ativa, openOrFocus, closeTab, activateTab)
  tab-bar.tsx             # Faixa de abas (sticky, X por aba, overflow-x, role tablist)
  tab-workspace.tsx       # Sync pathname + panes + EntryPane (keep-alive, inert, portal container)
src/lib/
  tab-routes.tsx          # Registro módulo→componente + MODULES (título/ícone) + resolveTabRoute
  tab-params.tsx          # TabParamsContext + useTabParams()
  tab-portal-context.tsx  # Context do elemento-alvo dos portais (useTabPortalContainer)
```

### Modificados
```
src/app/(app)/layout.tsx                          # workspace no lugar de {children}
src/app/(app)/escolas/[id]/page.tsx               # useTabParams
src/app/(app)/gestao-pedagogica/diario-classe/[turmaId]/page.tsx
src/app/(app)/gestao-pedagogica/diario-classe/[turmaId]/fechamento/page.tsx
src/app/(app)/gestao-pedagogica/plano-ensino/[id]/page.tsx
src/app/(app)/gestao-usuarios/perfis/[id]/page.tsx
src/components/ui/dialog.tsx                      # portal na entrada
src/components/ui/alert-dialog.tsx                # ...
src/components/ui/popover.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/select.tsx
src/components/ui/tooltip.tsx
src/components/ui/hover-card.tsx
src/components/ui/sheet.tsx
src/components/agenda/agenda-drawer.tsx           # fix de narrowing (TS) pré-existente
```

## Notas técnicas

- **0 migrations**, **0 novas deps npm**.
- Scroll por **container de entrada** (as páginas rolam dentro da aba) — necessário para preservar scroll no drill-in e entre abas.
- `matriculas/cadastro` (server component) é renderizado pela aba via `content.tsx` (client) + wrapper com `useSearchParams`.
- `children` do layout permanece não utilizado (workspace é a única origem de conteúdo das rotas `(app)`).
- Devido à dívida de lint pré-existente (`no-explicit-any` em `src/lib/actions/*`), a verificação adotada é `npx next build` (verde) + `tsc --noEmit` (verde) + lint dos arquivos novos (limpo).

## Testes

`npx next build` · `npx tsc --noEmit` · checklist manual (abrir 2–3 abas; filtrar+modal+scroll; drill-in e voltar; limite 6; F5; mobile).