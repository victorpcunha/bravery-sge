# Implementation Plan: Design System v2

**Feature Branch**: `005-design-system-v2`
**Date**: 2026-07-10
**Status**: Draft

## Overview

Codificar as decisões da Visual Language v1.0.0 em tokens CSS (`globals.css`), ajustar componentes oficiais de layout para usar a nova escala tipográfica, e atualizar a documentação do Design System.

## Scope

**Inclui**:
- Atualização de 5 tokens de cor em `:root` (light mode) do `globals.css`
- Substituição da escala de radius `calc()` por valores explícitos
- Adição de 9 tokens tipográficos em `:root` + `@theme inline`
- Ajuste de tipografia em 5 componentes de layout (PageHeader, PageSection, FormCard, StatCard, FilterBar/SearchInput)
- Atualização do catálogo (`specs/002-design-system/catalog.md`)
- Atualização do `AGENTS.md` com novas regras

**Não inclui**:
- Migração de tipografia em páginas individuais (será incremental)
- Novos componentes (não há adição ao catálogo)
- Mudanças em dark mode (já alinhado)
- Mudanças em componentes shadcn base (Button, Input, etc. — herdam tokens automaticamente)

## Architecture Decisions

### AD-1: Tokens tipográficos via `@theme inline` + arbitrary values

**Decisão**: Definir tokens tipográficos como CSS variables em `:root` e mapeá-los em `@theme inline` para uso como utility classes Tailwind. Nos componentes, usar arbitrary values (`text-[28px]`) em vez de criar utility classes semânticas (`text-title`).

**Justificativa**: O Tailwind v4 com `@theme inline` permite definir `--text-size-body: 15px` que gera `text-body`. No entanto, arbitrary values (`text-[15px]`) são mais previsíveis e explícitos para uso em componentes. Os tokens em `:root` servem como documentação e referência; os componentes usam valores literais que correspondem aos tokens. Isso evita acoplamento entre a nomenclatura de tokens e a implementação de componentes.

**Trade-off**: Mantém a flexibilidade do Tailwind (arbitrary values) ao custo de não ter utility classes semânticas. Se a escala tipográfica mudar, cada componente precisa ser atualizado individualmente. Este trade-off é aceitável porque a VL estabelece que a escala é estável (versionamento semântico MAJOR para mudanças).

### AD-2: `--radius` (sem sufixo) preservado como alias

**Decisão**: Manter `--radius: 12px` como alias para `--radius-lg`, porque o Tailwind `rounded-lg` referencia `var(--radius)` via `@theme inline`.

**Justificativa**: O bloco `@theme inline` mapeia `--radius-lg: var(--radius)`. Se removermos `--radius`, quebramos o mapeamento. Em vez disso, mantemos `--radius: 12px` e definimos `--radius-lg: 12px` explicitamente (não via `var(--radius)`), eliminando a ambiguidade.

### AD-3: Mudança de accent sem migração página-a-página

**Decisão**: A mudança de `--accent` de `#2E8BA3` para `#4FC3D7` é global via token CSS. Não revisar páginas individualmente.

**Justificativa**: Componentes que usam `bg-accent`, `text-accent`, `ring-ring` herdarão automaticamente o novo valor. A VL definiu que cianês é a cor aditiva principal — qualquer uso de `bg-accent` já estava semanticamente correto (foco/interação), apenas a cor muda. Não há risco de quebra; apenas uma mudança visual global e intencional.

## Implementation Model

### Fase 1 — Tokens CSS (globals.css)

```
globals.css
├── :root (light mode)
│   ├── COR: --accent #2E8BA3 → #4FC3D7
│   ├── COR: --accent-foreground #FAFCFF → #0F2B46
│   ├── COR: --ring #2E8BA3 → #4FC3D7
│   ├── COR: --background #F4F6F9 → #F1F3F8
│   ├── RADIUS: --radius-sm 7px → 6px
│   ├── RADIUS: --radius-md 10px → 8px
│   ├── RADIUS: --radius-lg 14px → 12px (explicit, not calc)
│   ├── RADIUS: --radius-xl 20px → 16px (explicit)
│   ├── RADIUS: --radius-2xl calc → 24px (explicit)
│   ├── RADIUS: remove --radius-3xl, --radius-4xl
│   ├── TYPO: add --text-display through --text-caption (9 tokens)
│   └── (unchanged: --primary, --secondary, --sidebar-*, --destructive, etc.)
├── @theme inline
│   ├── RADIUS: --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-2xl (update mappings)
│   ├── RADIUS: remove --radius-3xl, --radius-4xl mappings
│   └── (typography tokens exposed here if needed, but components use arbitrary values)
└── .dark (NO CHANGES)
```

### Fase 2 — Componentes de Layout

```
page-header.tsx
├── title: text-2xl font-heading font-semibold → text-[28px] font-bold leading-tight
└── description: text-sm → text-[15px] leading-normal

page-section.tsx
├── title: text-base font-heading font-semibold → text-[20px] font-semibold leading-snug
└── description: text-sm → text-[15px]

form-card.tsx
├── title: (CardTitle) → text-[20px] font-semibold
└── description: (CardDescription) → text-[15px] text-muted-foreground

stat-card.tsx
├── value: (current) → text-[36px] font-bold leading-none
└── label: (current) → text-[14px] font-medium
```

### Fase 3 — Catálogo e AGENTS.md

```
specs/002-design-system/catalog.md
├── Atualizar tabela de tokens de cor (accent, ring, background)
├── Atualizar tabela de radius (6 valores explícitos)
├── Adicionar seção "Escala Tipográfica" (9 níveis)
└── Atualizar anti-padrões

AGENTS.md
├── Adicionar regras de tipografia (corpo 15px, título 28px, seção 20px)
├── Adicionar regra: radius usa escala oficial (não calc)
└── Adicionar regra: accent é cianês #4FC3D7, secondary é teal #2E8BA3
```

## Technical Constraints

- **Tailwind v4**: O `@theme inline` é a interface entre CSS variables e utility classes. Tokens novos devem ser mapeados aqui para uso via Tailwind.
- **shadcn/ui**: Componentes base (Button, Input, Card, etc.) usam tokens CSS via suas classes Tailwind (ex.: `rounded-md` → `var(--radius-md)`). A mudança de radius afeta todos automaticamente.
- **Compatibilidade**: O `--radius` (sem sufixo) deve permanecer porque `rounded-lg` no Tailwind mapeia para `var(--radius)` via `@theme inline`. Remover `--radius` quebraria `rounded-lg` em toda a aplicação.
- **Font weight**: Plus Jakarta Sans carrega pesos 400, 500, 600, 700 via `next/font`. Os tokens tipográficos usam apenas estes 4 pesos.

## Risk Assessment

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Radius menor quebra visual em componentes existentes | Média | Baixo | Valores novos (6, 8px) são próximos aos atuais (7, 10px); diferença é sutil |
| Accent cianês em telas escuras perde contraste | Baixa | Médio | Dark mode já usa `#4FC3D7` como accent — comprovado |
| Tipografia 28px quebra layout em telas pequenas | Baixa | Baixo | `truncate` e `flex-wrap` no PageHeader já lidam com overflow |
| `--accent-foreground` navy sobre cianês em botões accent | Baixa | Baixo | Contraste 5.8:1 — passa WCAG AA |

## Migration Notes

- **Sem banco de dados**: Este spec não introduz migrations SQL. Apenas mudanças em CSS e componentes.
- **Sem breaking changes na API de componentes**: Nenhuma prop é adicionada, removida ou renomeada. As mudanças são internas (estilos) e transparentes para quem consome os componentes.
- **Build verification**: Após as mudanças, executar `npx next build` para confirmar que não há erros de compilação.