# Feature Specification: Design System v2 — Codificação da Visual Language

**Feature Branch**: `005-design-system-v2`

**Created**: 2026-07-10

**Status**: Implemented

**Input**: Visual Language v1.0.0 (`.specify/memory/visual-language.md`) define a linguagem visual do Bravery SGE. Este spec codifica essas decisões em tokens CSS, ajustes de componentes e regras de implementação no Design System existente.

## Product Experience

Este spec opera sob a autoridade do Product Experience v1.0.0. As decisões de experiência seguem os princípios PE-1xx (Confiança), PE-2xx (Leveza), PE-3xx (Organização), PE-4xx (Inteligência), PE-5xx (Eficiência), PE-6xx (Consistência Visual), PE-7xx (Acessibilidade Visual), PE-8xx (Padronização de Componentes) e PE-9xx (Manutenibilidade). Os critérios de acessibilidade são estritamente visuais (contraste WCAG AA, legibilidade, Dark Mode) — navegação por teclado e ARIA seguem o padrão shadcn/ui.

---

## User Scenarios & Testing

### User Story 1 — Sistema exibe paleta de cores alinhada à Visual Language (Priority: P1)

**Contexto**: A Visual Language define `--accent` como `#4FC3D7` (cianês luminosa) para foco/interação, reservando `#2E8BA3` (teal) como `--secondary`. Atualmente, `--accent` e `--secondary` têm o mesmo valor (`#2E8BA3`), e `--ring` usa teal em vez de cianês. O background deve aquecer de `#F4F6F9` para `#F1F3F8`.

**Given** o `globals.css` atual com `--accent: #2E8BA3`, `--ring: #2E8BA3` e `--background: #F4F6F9`, **When** os tokens são atualizados conforme a Visual Language, **Then**:
1. `--accent` passa a ser `#4FC3D7` (cianês luminosa) — cor aditiva principal para foco, interação e estados ativos.
2. `--accent-foreground` passa a ser `#0F2B46` (navy) — texto legível sobre cianês.
3. `--secondary` permanece `#2E8BA3` (teal) — botão secundário, hover de sidebar, charts.
4. `--ring` passa a ser `#4FC3D7` — foco acompanha accent.
5. `--background` passa a ser `#F1F3F8` — cinza azulado levemente mais quente.
6. Dark mode permanece inalterado (já alinhado).

**Independent Test**: Abrir uma página com inputs e botões em Light Mode. Verificar que: (1) o foco de inputs usa cianês luminoso (`#4FC3D7`), não teal; (2) botões com variante `accent` usam cianês com texto navy; (3) o fundo da página é levemente mais quente que antes; (4) botões secundários e hover de sidebar continuam使用 teal; (5) em Dark Mode, nada mudou.

---

### User Story 2 — Escala de radius explícita e alinhada à Visual Language (Priority: P1)

**Contexto**: A Visual Language define 6 níveis de radius: sm=6px, md=8px, lg=12px, xl=16px, 2xl=24px, full=9999px. Atualmente, o `globals.css` usa `calc()` derivados de `--radius: 12px`, produzindo valores não intencionais (radius-sm=7.2px, radius-md=9.6px, radius-lg=var(--radius)=12px, radius-xl=16.8px, radius-2xl=21.6px).

**Given** o sistema atual com radius baseado em `calc()`, **When** a escala é substituída por valores explícitos, **Then**:
1. `--radius-sm: 6px` (inputs, badges, chips, tags).
2. `--radius-md: 8px` (botões, itens de menu, tabs).
3. `--radius-lg: 12px` (cards, modais, popovers, dropdowns).
4. `--radius-xl: 16px` (cards hero, seções de destaque).
5. `--radius-2xl: 24px` (containers decorativos: avatar, banner de destaque, hero image).
6. `--radius-full: 9999px` (pills, avatares, overlay circular).
7. `--radius` (sem sufixo) permanece `12px` como alias para `--radius-lg` (compatibilidade com Tailwind `rounded-lg`).
8. `--radius-3xl` e `--radius-4xl` são removidos (não usados, não definidos pela VL).

**Independent Test**: Inspecionar `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` em componentes. Verificar que todos produzem valores inteiros (6, 8, 12, 16px) — não fracionados.

---

### User Story 3 — Escala tipográfica expressiva com corpo 15px (Priority: P1)

**Contexto**: A Visual Language define corpo padrão em 15px (não 14px) e uma escala de 7 níveis: display (36/700), title (28/700), heading (20/600), subheading (16/600), body (15/400), body-strong (15/500), label (14/500), small (13/400), caption (12/400). Atualmente, não existe escala tipográfica definida — os componentes usam Tailwind defaults (`text-sm`, `text-2xl`, etc.) sem padronização.

**Given** o sistema atual sem escala tipográfica formal, **When** a escala é codificada em tokens CSS e aplicada aos componentes oficiais, **Then**:
1. `--text-display`: 36px / 700 / 1.2 — KPI principal, título de dashboard.
2. `--text-title`: 28px / 700 / 1.2 — título de página (PageHeader).
3. `--text-heading`: 20px / 600 / 1.3 — subtítulo de seção (PageSection title).
4. `--text-subheading`: 16px / 600 / 1.4 — headline de card, nome em lista.
5. `--text-body`: 15px / 400 / 1.5 — texto corrido, descrições.
6. `--text-body-strong`: 15px / 500 / 1.5 — parágrafo de conclusão, destaque.
7. `--text-label`: 14px / 500 / 1.4 — rótulos, botões, dados em tabela.
8. `--text-small`: 13px / 400 / 1.4 — texto secundário, timestamp, legendas.
9. `--text-caption`: 12px / 400 / 1.3 — anotação de menor prioridade.

**Independent Test**: Em uma página de listagem, verificar que: (1) o título do PageHeader é 28px/700 (não `text-2xl font-semibold` = 24px/600); (2) o título do PageSection é 20px/600 (não `text-base font-semibold` = 16px/600); (3) descrições usam 15px/400; (4) labels de campos usam 14px/500.

---

### User Story 4 — Componentes de layout refletem a nova escala tipográfica (Priority: P2)

**Contexto**: Os componentes de layout (PageHeader, PageSection, FormCard, StatCard, FilterBar) usam classes Tailwind ad-hoc para tipografia. A Visual Language exige que estes componentes usem a escala tipográfica oficial.

**Given** PageHeader com `text-2xl font-heading font-semibold` (24px/600) e PageSection com `text-base font-heading font-semibold` (16px/600), **When** os componentes são atualizados, **Then**:
1. PageHeader title: `text-[28px] font-bold leading-tight` (era `text-2xl font-semibold`).
2. PageHeader description: `text-[15px] leading-normal` (era `text-sm` = 14px).
3. PageSection title: `text-[20px] font-semibold leading-snug` (era `text-base font-semibold` = 16px).
4. PageSection description: `text-[15px]` (era `text-sm`).
5. FormCard title: `text-[20px] font-semibold` (alinhado com PageSection).
6. FormCard description: `text-[15px]`.
7. StatCard value: `text-[36px] font-bold` (display).
8. StatCard label: `text-[14px] font-medium` (label).

**Independent Test**: Abrir uma página de listagem e uma de cadastro. Verificar que: (1) o título da página é visivelmente maior e mais expressivo (28px vs 24px anterior); (2) o título da seção é 20px (vs 16px); (3) as descrições usam 15px (vs 14px); (4) StatCards em dashboard usam 36px para o número principal.

---

### User Story 5 — Catálogo e anti-padrões atualizados (Priority: P3)

**Given** o catálogo atual em `specs/002-design-system/catalog.md` com tokens e regras da v1, **When** o catálogo é atualizado para a v2, **Then**:
1. A tabela de tokens de cor reflete `--accent: #4FC3D7` e `--ring: #4FC3D7`.
2. A tabela de radius mostra os 6 valores explícitos.
3. A escala tipográfica é documentada com 9 níveis.
4. Anti-padrões são ampliados: proibido usar `text-sm` para descrições (usar `text-[15px]`), proibido usar `text-base` para títulos de seção (usar `text-[20px]`).
5. Novo anti-padrão: proibido usar `calc()` para radius — apenas valores da escala oficial.

---

### Edge Cases

- **Efeito cascada do accent**: Componentes que usam `bg-accent` ou `text-accent` mudarão visualmente de teal para cianês. Isto é intencional e desejado. Nenhuma página deve ser revisada individualmente — a mudança é global via token.
- **`--accent-foreground` muda de `#FAFCFF` para `#0F2B46`**: Componentes com `text-accent-foreground` terão texto navy sobre cianês. Isto mantém contraste WCAG AA (navy `#0F2B46` sobre cianês `#4FC3D7` = ratio ~5.8:1).
- **StatusBadge info usa `--info`**: `--info` permanece `#2E8BA3` (teal) — não muda. O badge "info" continuará teal.
- **Sidebar**: `--sidebar-primary` já é `#4FC3D7` — não muda. `--sidebar-accent` já é `#2E8BA3` — não muda.
- **Radius em componentes shadcn existentes**: Componentes shadcn usam `rounded-md`, `rounded-lg` etc. via Tailwind. A mudança de `calc()` para valores explícitos muda o valor computado (ex.: `rounded-md` passa de 9.6px para 8px). Isto é intencional e alinhado à VL.
- **`text-sm`**: A classe Tailwind `text-sm` continua 14px. Não é proibida, mas não deve ser usada onde a VL exige 15px (corpo, descrições). O anti-padrão é usar `text-sm` **como corpo padrão** — não proíbe `text-sm` em situações onde 14px é deliberado (ex.: timestamp secundário).

---

## Requirements

### Functional Requirements

**Tokens de Cor (globals.css)**

- **FR-001**: O sistema DEVE atualizar `--accent` de `#2E8BA3` para `#4FC3D7` (cianês luminosa) em `:root` (light mode).
- **FR-002**: O sistema DEVE atualizar `--accent-foreground` de `#FAFCFF` para `#0F2B46` (navy) em `:root`.
- **FR-003**: O sistema DEVE atualizar `--ring` de `#2E8BA3` para `#4FC3D7` em `:root`.
- **FR-004**: O sistema DEVE atualizar `--background` de `#F4F6F9` para `#F1F3F8` em `:root`.
- **FR-005**: O sistema DEVE manter `--secondary` como `#2E8BA3` (teal) em `:root`.
- **FR-006**: O sistema DEVE manter todos os tokens de dark mode inalterados (já alinhados com a VL).
- **FR-007**: O sistema NÃO DEVE alterar `--info` (permanece `#2E8BA3` — usado por StatusBadge info).

**Tokens de Radius (globals.css)**

- **FR-008**: O sistema DEVE substituir a escala de radius baseada em `calc()` por valores explícitos: `--radius-sm: 6px`, `--radius-md: 8px`, `--radius: 12px` (alias de `--radius-lg`), `--radius-lg: 12px`, `--radius-xl: 16px`, `--radius-2xl: 24px`, `--radius-full: 9999px`.
- **FR-009**: O sistema DEVE remover os tokens `--radius-3xl` e `--radius-4xl` (não definidos pela VL, não usados em produção).
- **FR-010**: O sistema DEVE atualizar `--radius-sm` de `7px` para `6px` e `--radius-md` de `10px` para `8px` (valores da escala oficial).

**Tokens Tipográficos (globals.css)**

- **FR-011**: O sistema DEVE definir 9 tokens tipográficos em `:root`: `--text-display` (36px/700/1.2), `--text-title` (28px/700/1.2), `--text-heading` (20px/600/1.3), `--text-subheading` (16px/600/1.4), `--text-body` (15px/400/1.5), `--text-body-strong` (15px/500/1.5), `--text-label` (14px/500/1.4), `--text-small` (13px/400/1.4), `--text-caption` (12px/400/1.3).
- **FR-012**: O sistema DEVE mapear estes tokens no bloco `@theme inline` para uso via Tailwind (ex.: `--font-size-body: var(--text-body)` → utilitável como `text-body`).
- **FR-013**: O sistema NÃO DEVE alterar a família tipográfica (Plus Jakarta Sans) nem os pesos existentes (400, 500, 600, 700).

**Componentes de Layout**

- **FR-014**: PageHeader DEVE usar `text-[28px] font-bold leading-tight` para o título (era `text-2xl font-heading font-semibold`).
- **FR-015**: PageHeader DEVE usar `text-[15px] leading-normal` para a descrição (era `text-sm`).
- **FR-016**: PageSection DEVE usar `text-[20px] font-semibold leading-snug` para o título (era `text-base font-heading font-semibold`).
- **FR-017**: PageSection DEVE usar `text-[15px]` para a descrição (era `text-sm`).
- **FR-018**: FormCard DEVE usar `text-[20px] font-semibold` para o título e `text-[15px]` para a descrição.
- **FR-019**: StatCard DEVE usar `text-[36px] font-bold` para o valor (display) e `text-[14px] font-medium` para o label.

**Catálogo e Documentação**

- **FR-020**: O catálogo em `specs/002-design-system/catalog.md` DEVE ser atualizado com os novos tokens de cor, radius e tipografia.
- **FR-021**: O catálogo DEVE documentar a escala tipográfica completa (9 níveis) com tokens, tamanhos, pesos e usos.
- **FR-022**: O catálogo DEVE adicionar anti-padrões: usar `text-sm` como corpo padrão, usar `calc()` para radius, usar `--accent` como cor de fundo de seção.

**Validação**

- **FR-023**: O build (`npx next build`) DEVE completar sem erros após as mudanças.
- **FR-024**: O sistema DEVE manter compatibilidade com Dark Mode — nenhum token de dark mode deve ser alterado.

### Key Entities

- **Design Tokens v2**: Tokens CSS atualizados em `globals.css` (`:root` e `@theme inline`) — fonte de verdade para cor, radius e tipografia.
- **Typographic Scale**: 9 tokens tipográficos expostos via `@theme inline` para uso em componentes e páginas.
- **Radius Scale**: 6 níveis explícitos (sm, md, lg, xl, 2xl, full) — sem `calc()`.
- **Color Palette v2**: Accent promovido a cianês `#4FC3D7`; secondary preservado como teal `#2E8BA3`; background aquecido para `#F1F3F8`.

## Success Criteria

- **SC-001**: Foco de inputs em Light Mode usa cianês luminoso (`#4FC3D7`), distinguível do teal usado em botões secundários.
- **SC-002**: Todos os valores de radius computados são inteiros (6, 8, 12, 16, 24, 9999px) — nenhum valor fracionado.
- **SC-003**: O título de página (PageHeader) é visivelmente maior (28px/700) que o título de seção (PageSection 20px/600), criando hierarquia imediata.
- **SC-004**: O corpo de texto padrão em descrições e parágrafos é 15px — não 14px.
- **SC-005**: `npx next build` completa sem erros.
- **SC-006**: Dark Mode permanece visualmente idêntico ao estado atual (nenhum token de dark mode alterado).

## Assumptions

- A Visual Language v1.0.0 (`.specify/memory/visual-language.md`) é a fonte de direção visual. Este spec codifica suas decisões; não introduz decisões novas.
- Os componentes shadcn/ui base permanecem inalterados em sua API e estrutura interna — apenas os tokens CSS que eles consomem mudam.
- A mudança de accent (teal → cianês) é global e automática via token CSS. Nenhuma página precisa ser revisada individualmente para esta mudança específica.
- A escala tipográfica é aplicada primeiramente nos componentes oficiais de layout (PageHeader, PageSection, FormCard, StatCard). Páginas existentes que usam estes componentes herdam a mudança automaticamente. Páginas com tipografia ad-hoc serão corrigidas incrementalmente.
- O `@theme inline` do Tailwind v4 é o mecanismo de exposição de tokens para uso em utilitários. Tokens tipográficos novos seguem o mesmo padrão dos tokens de cor já presentes.
- O `AGENTS.md` será atualizado com as novas regras de tipografia e radius após a implementação.

## Implementation Notes

- Os tokens de cor (`--accent`, `--accent-foreground`, `--ring`, `--background`) são alterados apenas em `:root` (light mode). Os equivalentes em `.dark` permanecem inalterados.
- Os tokens de radius (`--radius-sm`, `--radius-md`) são alterados tanto em `:root` quanto em `@theme inline` (que referencia `:root`). O bloco `@theme inline` já mapeia `--radius-*` para `--color-*(...)` — este mapeamento não muda; apenas os valores-base em `:root` mudam.
- Os tokens tipográficos são novos. Devem ser definidos em `:root` e mapeados em `@theme inline` para uso como utilitários Tailwind.

## Implementation Result — 2026-07-11

Este spec foi implementado e **superado** pela repalette para SaaS moderno blue. A implementação real foi além do escopo original:

- **Cor de marca**: `#0F2B46` (navy) → `#1F88EB` (blue vibrante) — não apenas accent/ring mudou, mas a paleta inteira.
- **Sidebar**: navy profundo → branca (`#FAFBFC`) em light mode / slate-950 (`#0F172A`) em dark mode.
- **Dark mode**: completamente reescrito com paleta slate (background `#0F172A`, card `#1E293B`, border `#334155`), primary preservado em `#1F88EB`.
- **Visual Language**: atualizada para v2.0.0 com a nova paleta.
- **Product Vision**: atualizado para v2.0.0 com reposicionamento de identidade ("SaaS profissional").
- **AGENTS.md**: tabela de cores, Regra #4 (sidebar), Regra #6 (dark mode) todas atualizadas.
- **Build**: `npx next build` passa com 40 páginas, 0 erros.

Tokens que mudaram além do spec original:

| Token | Spec original (VL v1) | Implementado (VL v2) |
|-------|------------------------|---------------------|
| `--primary` | `#0F2B46` (navy) | `#1F88EB` (blue) |
| `--secondary` | `#2E8BA3` (teal) | `#1A6FC2` (deep blue) |
| `--ring` | `#4FC3D7` (accent) | `#1F88EB` (primary) |
| `--background` | `#F1F3F8` | `#F6F8FA` (slate-50) |
| `--foreground` | `#0D1117` | `#1E293B` (slate-800) |
| `--info` | `#2E8BA3` (teal) | `#1F88EB` (= primary) |
| `--sidebar` | navy (implícito) | `#FAFBFC` (branco) |