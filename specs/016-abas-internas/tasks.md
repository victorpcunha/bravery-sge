# Tasks — Navegação por Abas Internas (spec 016)

Status: ✅ concluído · ⬜ pendente

## FASE 1 — Fundação
- ✅ `src/lib/tab-portal-context.tsx` — contexto do alvo dos portais (`useTabPortalContainer`).
- ✅ `src/components/tabs/tab-provider.tsx` — store em memória (`tabs[]`, `activeModule`, `openOrFocus`, `closeTab`, `activateTab`), Dashboard inicial.
- ✅ `src/components/tabs/tab-bar.tsx` — faixa fixa abaixo da Topbar (sticky, `role=tablist`, X por aba).
- ✅ `src/components/tabs/tab-workspace.tsx` — sync `usePathname()` (ignora montagem inicial, via `didInit`), panes + `EntryPane` keep-alive.
- ✅ `src/app/(app)/layout.tsx` — substitui `{children}` pelo workspace dentro de `<Suspense>` (necessário p/ `useSearchParams` de `matriculas/cadastro`).

## FASE 2 — Registro de rotas + params
- ✅ `src/lib/tab-routes.tsx` — registro ~28 módulos (Dashboard, Escolas, Usuários, Perfis, Diário, Plano de Ensino, BNCC 9x, Censo, etc.), estático-antes-de-dinâmico, `resolveTabRoute`, `MODULES` (título/ícone).
- ✅ `src/lib/tab-params.tsx` — `TabParamsProvider` + `useTabParams()` (fallback `useParams`, hook incondicional).
- ✅ Páginas dinâmicas para `useTabParams()`: `escolas/[id]`, `diario-classe/[turmaId]`, `diario-classe/[turmaId]/fechamento`, `plano-ensino/[id]`, `perfis/[id]` (remove `use(params)`).

## FASE 3 — Regras de navegação
- ✅ Abrir-or-focar por **módulo** (aba única por menu; re-clique foca).
- ✅ **Drill-in em pilha**: detalhe/cadastro empilham entrada; voltar revela a anterior (listagem preservada).
- ✅ **Limite 6**: `openOrFocus` retorna `blocked` → toast + `router.replace(prev)`.
- ✅ **Fechar aba**: foca vizinho; última aba fechada → reabre Dashboard.
- ✅ **URL sincronizada** com pathname + query (`entryPath`); entradas guardam `pathname+search`.

## FASE 4 — Keep-alive & scroll
- ✅ Panes e entradas `absolute inset-0`; entradas `overflow-y-auto overscroll-contain`.
- ✅ Entradas inativas: `visibility:hidden` + `pointer-events-none` + `inert` + `aria-hidden` (estado e scroll preservados).

## FASE 5 — Contenção de portais
- ✅ `dialog.tsx`, `alert-dialog.tsx`, `popover.tsx`, `dropdown-menu.tsx`, `select.tsx`, `tooltip.tsx`, `hover-card.tsx`, `sheet.tsx` montam overlays dentro da entrada via `useTabPortalContainer()`.
- ✅ `command.tsx`, `combobox.tsx`, `date-picker.tsx` cobertos por Dialog/Popover.
- ✅ `agenda-drawer.tsx` (topbar, fora de aba) segue no body.

## FASE 6 — Polimento & docs
- ✅ Acessibilidade: `role=tablist/tab/tabpanel`, `aria-selected`, `aria-hidden`, `inert`, `aria-label="Fechar aba ..."`.
- ✅ `specs/016-abas-internas/{spec,plan,tasks}.md`.
- ✅ AGENTS.md atualizado (segue).

## Verificação
- ✅ `npx tsc --noEmit` limpo.
- ✅ `npx next build` verde (41 rotas).
- ✅ Lint dos arquivos novos limpo.
- ✅ Smoke SSR (dev server) → 200 em rotas estáticas/dinâmicas; HTML com `tablist`, `tabpanel`, aba "Dashboard".
- ⬜ **Manual (navegador)**: abrir 2–3 abas; filtro+modal+scroll; drill-in e voltar; limite 6; F5; mobile.