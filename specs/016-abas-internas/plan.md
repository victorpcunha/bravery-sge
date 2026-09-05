# Plano de Implementação: Navegação por Abas Internas

**Branch**: `016-abas-internas` | **Data**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

## Summary

Introduzir navegação por abas internas no Bravery SGE: cada tela de menu abre/foca uma aba (máx. 6), sub-telas detalham dentro da própria aba com keep-alive em pilha, estado (formulário, filtros, scroll) é preservado, modais ficam contidos na aba, e F5 reinicia apenas com o Dashboard.

## Technical Context

- **Language**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router), arquitetura client components.
- **Dependencies**: nenhuma nova — shadcn/ui (radix-ui), Tailwind v4, lucide-react, sonner.
- **Storage**: nenhuma mudança. **0 migrations**.
- **Testing**: `npx next build` + `npx tsc --noEmit` + lint dos arquivos novos + smoke SSR no dev server.
- **Constraints**: 0 novas deps npm; tokens do Design System; premissa de que todas as páginas são client components (verificada).

## Estrutura do Projeto

```
src/components/tabs/
  tab-provider.tsx        # NOVO — Context + store das abas
  tab-bar.tsx             # NOVO — faixa fixa abaixo da Topbar
  tab-workspace.tsx       # NOVO — sincronização pathname→abas + panes keep-alive
src/lib/
  tab-routes.tsx          # NOVO — registro módulo→rota→componente + MODULES
  tab-params.tsx          # NOVO — useTabParams() (injeção de params nas telas)
  tab-portal-context.tsx  # NOVO — alvo dos portais (contido na entrada)
src/app/(app)/layout.tsx  # MODIFICADO — workspace substitui {children}
... (5 páginas dinâmicas adaptadas + 8 wrappers shadcn contidos)
```

## Fases

- **FASE 1 — Fundação**: `tab-provider`, `tab-bar`, `tab-workspace`, `tab-portal-context`; layout novo renderizando o workspace e o TabBar; Dashboard como aba inicial não-persistida.
- **FASE 2 — Registro de rotas + params**: `tab-routes.tsx` com todos os módulos; `tab-params.tsx`; adaptação das 5 páginas dinâmicas.
- **FASE 3 — Regras de navegação**: abrir-or-focar por módulo; drill-in em pilha; limite 6 (block + aviso + revert); fechar/focar vizinho; reabrir Dashboard quando a última aba fecha; sincronização de URL (pathname + query).
- **FASE 4 — Keep-alive & scroll**: panes `absolute inset-0`; entradas em pilha com `overflow-y-auto`, `visibility:hidden` + `inert` quando inativas (scroll preservado).
- **FASE 5 — Contenção de portais**: wrappers shadcn passam a montar overlays dentro da entrada ativa.
- **FASE 6 — Polimento & docs**: título/ícones por módulo, acessibilidade (role=tablist/tab/tabpanel, aria-selected, aria-label no X), specs/016, atualização do AGENTS.md.

## Riscos & mitigações

- **Scroll de página → scroll de container**: mudança de comportamento; sticky internos passam a ancorar na entrada (aceitável e desejável).
- **Modais/overlays em aba oculta**: solucionado via contenção de portais (ref da entrada) — fora das abas (ex.: Topbar) seguem em `document.body`.
- **Telas orientadas a query** (`cadastro?id=X`): entradas guardam `pathname+search`; ao reativar, URL é restaurada com a query.
- **`useSearchParams`/`useParams` fora da árvore do router**: `useSearchParams` funciona via URL global; `useParams` é substituído por `useTabParams`.
- **Dívida de lint pré-existente** (`no-explicit-any` em `src/lib/actions/*`): fora de escopo; verificação usa build + tsc.

## Verificação

- `npx next build` verde (41 rotas).
- `npx tsc --noEmit` limpo.
- Lint dos arquivos novos limpo.
- Smoke SSR (curl) nas rotas estáticas e dinâmicas retornando 200 e contendo `tablist`/`tabpanel`.