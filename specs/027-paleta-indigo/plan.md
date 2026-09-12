# Implementation Plan: Paleta Tonal Steel Blue (v7)

**Feature**: `027-paleta-indigo` | **Status**: Testing

## Approach

Troca de valores no bloco `:root` de `src/app/globals.css` (propagação automática via tokens) + correção do texto da sidebar (`accent-foreground` → `sidebar-foreground` em `layout/sidebar.tsx`) + sync de docs. `.dark` intocado.

## Token changes (`:root` only)

Aplicados: primary `#4682B4`, secondary `#396991`, accent `#B8863B`/`#2A1D06`, ring `#B8863B`, info `#396991`, charts `#4682B4/#B8863B/#396991/#294C69/#16A34A`, sidebar `#294C69` (fg branca, pílula branca/texto `#294C69`). Neutros azulados (`#EDF1F5`, `#E4E9F0`, `#52607A`, `#D7DEE8`), destructive `#C4453A`, warning `#C2571C` (decisões do autor em v6, mantidas).

## Constitution check

| Princípio | Veredito |
|-----------|----------|
| XI. Design System First | ✅ PASS — só tokens + correção de contraste |
| IV. Tokens | ✅ PASS — hex só em `globals.css` + docs |
| VI. Dark Mode | ✅ PASS — `.dark` byte-idêntico |
| VII. Acessibilidade visual | ⚠️ PARCIAL — primary/branco 4.11:1 (AA-large ok, AA-normal abaixo; registrado como tradeoff) |

## Constraints

Zero migrations, zero deps, zero novos padrões. Revert via `git checkout`.

## Validation

Contraste calculado, `detect` baseline, `build` verde, visual light, dark inalterado — todos ✅ exceto decisão SC-004 (pendente).
