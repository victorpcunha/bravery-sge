# Implementation Plan: Usuários — Modernização Visual

**Branch**: `007-usuarios-modernizacao` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)
**Depends on**: `specs/002-design-system` ✅

## Summary

Modernizar a tela de Usuários (`/gestao-usuarios/usuarios`) para sair do "cara de 2010". Dividida em 6 fases (A→F), sem refator estrutural do PessoaForm (mantido em arquivo único, 1664 linhas). Inclui paginação 10/pág client-side, card-list em mobile, correção de tipografia (`text-xs` → `text-[13px]`/`text-[14px]`/`text-[15px]`), DialogContent oficial com footer fixo, acessibilidade em mensagens de erro, e atualização do `AGENTS.md` ao final.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
**Primary Dependencies**: shadcn/ui v4, Tailwind CSS v4, react-hook-form + zod v4, lucide-react, sonner
**Storage**: Nenhuma migration nesta spec
**Testing**: `npx next build` + validação visual em DevTools (5 breakpoints)
**Target Platform**: Web (Next.js App Router, Client Components)
**Project Type**: Web application — refatoração frontend
**Performance Goals**: Build permanece estável. Paginação client-side: 10/pág.
**Constraints**: Zero novas dependências npm. PessoaForm permanece em arquivo único. Manter todos os contratos de `getPeople(schoolId, search, perfil, mostrarInativos)`.
**Scale/Scope**: 2 arquivos modificados (page.tsx 327 linhas, PessoaForm.tsx 1664 linhas), 1 novo componente se necessário (`Paginacao.tsx`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | `getPeople`, `deletePerson`, `inativarPessoa`, `reativarPessoa` permanecem |
| II. Security First | ✅ PASS | Sem mudança em auth/permissions |
| III. Multi-Tenant by Design | ✅ PASS | `getPeople(schoolId, ...)` preserva contexto |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Apenas correções de tipografia (text-xs → text-[13px]/[15px]) |
| V. Dark Mode Compatibility | ✅ PASS | Sem mudança de cores; tokens já adaptam |
| VI. shadcn/ui as UI Standard | ✅ PASS | Componentes existentes mantidos |
| VII. Database Through Migrations | N/A | Nenhuma migration |
| VIII. Auditability First | N/A | Nenhuma operação de dados |
| IX. Feature-Based Architecture | ✅ PASS | PessoaForm permanece em `src/app/(app)/gestao-usuarios/usuarios/` |
| X. No New Patterns Without Approval | ✅ PASS | Sem novas bibliotecas; paginação é state local |
| XI. Design System First | ✅ PASS | PageContainer, PageHeader, PageSection, FilterBar, EmptyState, ConfirmDialog oficiais |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/007-usuarios-modernizacao/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-usuarios/usuarios/
│   ├── page.tsx                     # MODIFIED: paginação 10/pág, card-list mobile, empty state contextual
│   └── PessoaForm.tsx               # MODIFIED: text-xs → tokens, grid 1-col em mobile, dialog oficial, a11y
│
└── components/ui/
    └── pagination.tsx               # NEW: componente de paginação (10/pág)
```

## Implementation Phases

### FASE A — Fundação da lista (page.tsx)

**Objetivo**: Corrigir problemas pontuais da lista: `text-xs`, empty state contextual, paginação.

**Tasks-chave**:
- T-A01: Criar `src/components/ui/pagination.tsx` com `<Pagination currentPage totalPages onPageChange />`
- T-A02: Em `page.tsx`, adicionar `useState` para `currentPage` e `ITEMS_PER_PAGE = 10`
- T-A03: Em `page.tsx:231`, calcular `totalPages = Math.ceil(pessoas.length / 10)`, `paginatedPessoas = pessoas.slice(...)`
- T-A04: Trocar `pessoas.map(...)` por `paginatedPessoas.map(...)`
- T-A05: Adicionar `<Pagination />` abaixo da tabela (visível se `totalPages > 1`)
- T-A06: Em `page.tsx:255`, trocar `text-xs` por `text-[13px]`
- T-A07: Adicionar empty state contextual para "filtro sem resultado" vs "sem cadastros"

**Princípios PE**: PE-202, PE-401, PE-501, PE-704

**Critério de aceite**: Lista com paginação; empty state contextual; tipografia correta.

---

### FASE B — Lista mobile (card-list)

**Objetivo**: Tabela vira lista de cards em `<md>` (PE-602).

**Tasks-chave**:
- T-B01: Adicionar versão card-list em `<ul>` para `<md>`, manter tabela em `≥md`
- T-B02: Cada card mobile: nome + CPF + INEP + badges + status + ações
- T-B03: Ações no card: Editar (lápis) + Excluir (lixeira) com altura ≥ 44px (PE-603)
- T-B04: `min-w-0 flex-1` no nome do card para `truncate` funcionar
- T-B05: Testar em 360px, 768px, 1024px

**Princípios PE**: PE-602, PE-603, PE-604, PE-605

**Critério de aceite**: Em mobile, cards verticais. Em desktop, tabela.

---

### FASE C — Dialog oficial

**Objetivo**: DialogContent segue layout oficial (Regra #2 do Design System) com header/footer fixos.

**Tasks-chave**:
- T-C01: Em `page.tsx:298-313`, ajustar DialogContent para `p-0 gap-0 flex flex-col`
- T-C02: DialogHeader com `shrink-0 px-6 pt-6 pb-4 border-b border-border`
- T-C03: PessoaForm deve ter body scrollável (`flex-1 overflow-y-auto px-6 py-4`) e footer fixo (`shrink-0 border-t border-border px-6 py-3 flex justify-end gap-2 bg-muted/30`)
- T-C04: Verificar se PessoaForm.tsx tem footer (botões "Salvar" e "Cancelar") — se não, adicionar

**Princípios PE**: PE-301, PE-302, PE-303

**Critério de aceite**: Modal rola conteúdo sem mover header/footer; body tem padding adequado.

---

### FASE D — PessoaForm: tipografia

**Objetivo**: Eliminar todas as violações de `text-xs` (Regra #10) e padronizar tamanhos.

**Tasks-chave**:
- T-D01: Substituir todas as `text-xs` (~22 ocorrências) por:
  - `text-[13px]` em hints, descrições, anotações secundárias
  - `text-[14px]` em labels de campos, botões
  - `text-[15px]` em valores de input, texto principal
  - `text-[16px] font-semibold` em títulos de seção (substituir `text-sm font-semibold`)
- T-D02: Substituir `Label className="text-sm ..."` por `Label` (sem className de tamanho) — Label do shadcn já tem 14px consistente
- T-D03: Validar que não restou nenhum `text-xs` no PessoaForm

**Princípios PE**: Regra #10 (escala tipográfica)

**Critério de aceite**: Zero `text-xs` no PessoaForm; hierarquia visual consistente.

---

### FASE E — PessoaForm: responsividade mobile

**Objetivo**: Formulário adaptável a mobile (PE-602) com grid 1-col em `<sm>` e 2-col em `≥sm`.

**Tasks-chave**:
- T-E01: Substituir `grid-cols-2 gap-4` por `grid-cols-1 sm:grid-cols-2 gap-4` em todas as ~22 ocorrências
- T-E02: Para grids com 3 colunas (`grid-cols-3`), usar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- T-E03: Em mobile, garantir que botões de ação (Adicionar Vínculo, etc.) ficam full-width ou com altura ≥ 44px
- T-E04: Testar em 360px (campos 1-col, scroll natural) e 768px (campos 2-col)

**Princípios PE**: PE-602 (adaptação ao espaço), PE-603 (alvos de toque)

**Critério de aceite**: Em mobile, formulário usa 1 coluna e é totalmente usável.

---

### FASE F — PessoaForm: acessibilidade + Dialog CTA

**Objetivo**: Mensagens de erro com `role="alert"`, campos obrigatórios com `aria-required`, foco visível.

**Tasks-chave**:
- T-F01: Adicionar `role="alert"` em mensagens de erro (ex.: linha 1033)
- T-F02: Adicionar `aria-required={true}` em inputs obrigatórios
- T-F03: Adicionar `aria-describedby={descriptionId}` ligando input ao seu hint
- T-F04: Garantir que o footer fixo do Dialog tem botões com altura ≥ 40px (PE-603)
- T-F05: Validação: tab cycle pelo formulário completo sem ficar preso

**Princípios PE**: PE-902, PE-905 (leitor de tela)

**Critério de aceite**: Leitor de tela anuncia erros; tab cycle completo.

---

### FASE G — Validação final + docs

**Objetivo**: Garantir qualidade e atualizar documentação.

**Tasks-chave**:
- T-G01: `npx next build` passa sem erro
- T-G02: Validar manualmente nos 5 breakpoints (360, 768, 1024, 1280, 1440) × 2 modos (light/dark)
- T-G03: Atualizar `AGENTS.md` (seção Progress) com entrada "Usuários — Modernização visual (spec 007)"
- T-G04: Validar empty states: sem cadastros vs filtro sem resultado

**Critério de aceite**: Build verde; documentação atualizada; UX validada.

## Riscos e Decisões

| # | Risco / Decisão | Mitigação |
|---|---|---|
| R1 | PessoaForm 1664 linhas: difícil de ler/modificar | Manter em arquivo único (decisão do usuário); tratar refator estrutural em spec futura |
| R2 | Paginação client-side: tudo carrega mesmo sem scroll | Lista de usuários é tipicamente < 200 por escola; sem problema de performance |
| R3 | DialogContent oficial pode quebrar layout atual do PessoaForm | Testar com FASE C; ajustar padding interno do Form se necessário |
| R4 | Grid 1-col em mobile pode aumentar muito altura do form | Aceitável — form em modal rola naturalmente; melhor UX que campos apertados |
| R5 | Spec 007 em paralelo com spec 004 (Histórico Escolar) | Ortogonais; spec 004 não toca arquivos de Usuários |
| R6 | `text-xs` em ~22 locais do PessoaForm | Buscar/Substituir com revisão; validar com build |

## Estratégia de Migração

- **Commits**: 1 commit por fase (A, B, C, D, E, F, G) — usuário não quis git, então apenas mudanças in-place
- **Branching**: work in-place
- **Feature flag**: nenhuma
- **Rollback**: cada fase é revertível independentemente
- **Validação**: build após cada fase; screenshot comparativo

## Validação Final

Antes de marcar spec como concluída:

- [ ] `npx next build` passa sem erro
- [ ] Lista com paginação funciona (10/pág, navegação prev/next)
- [ ] Mobile: cards verticais em `<md>`, tabela em `≥md`
- [ ] Dialog rola conteúdo sem mover header/footer
- [ ] PessoaForm: zero `text-xs` restante
- [ ] PessoaForm: 1-col em mobile, 2-col em desktop
- [ ] Mensagens de erro com `role="alert"`
- [ ] Foco visível em todos os interativos
- [ ] `AGENTS.md` atualizado
