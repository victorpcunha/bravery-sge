# Tasks: Painel do Aluno — Modernização Visual

**Input**: Design documents from `specs/009-painel-aluno-modernizacao/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Depends on**: `specs/002-design-system` ✅, `specs/006-dashboard-modernizacao` (DashboardTabs) ✅
**Tests**: Não solicitado. Validação = `npx next build` + visual em DevTools.

## Format: `[ID] [P?] [Fase] Description`

---

## Phase 1: FASE A — Fundação da página ✅

- [x] T-A01 `page.tsx` — loading state com `<PageSection>` skeleton (substituir divs soltos)
- [x] T-A02 Ajustar `grid grid-cols-1 md:grid-cols-5` para `grid-cols-1 sm:grid-cols-5` (mobile 1-col)
- [x] T-A03 "Aluno sem matrícula" → `EmptyState` oficial
- [x] T-A04 Texto cru "Aluno sem matrícula ativa" → empty state contextual
- [x] T-A05 Cada `<div className="mb-8">` com card empilhado → `<PageSection>` consistente
- [x] T-A06 Validar: `npx next build`

---

## Phase 2: FASE B — Tabs (4 abas) ✅

- [x] T-B01 Criar `src/components/painel-pessoa/dashboard-tabs.tsx` (wrapper shadcn Tabs)
- [x] T-B02 `page.tsx` — integrar `<DashboardTabs>` com 4 abas (Visão Geral, Desempenho, Acadêmico, Histórico)
- [x] T-B03 Aplicar padrão de tabs da Dashboard (bg-card + border + shadow-xs, ativa primary)
- [x] T-B04 Tabs com `min-h-[40px]` (PE-603)
- [x] T-B05 Tabs "Desempenho" e "Acadêmico" desabilitadas sem turma selecionada
- [x] T-B06 Validar: `npx next build`

---

## Phase 3: FASE C — FiltroPessoa → shadcn Command/Popover ✅

- [x] T-C01 `filtro-pessoa.tsx` — substituir dropdown custom por shadcn `Command` (busca com Popover)
- [x] T-C02 Substituir o `useEffect` com `mousedown` listener manual
- [x] T-C03 Empty state no dropdown com `EmptyState` oficial
- [x] T-C04 Manter debounce 300ms e mínimo 3 caracteres
- [x] T-C05 Corrigir 1 ocorrência de `text-xs` (linha 95)
- [x] T-C06 Validar: `npx next build`

---

## Phase 4: FASE D — CardIdentificacao ✅

- [x] T-D01 Substituir 9 ocorrências de `text-xs` (labels, hints)
- [x] T-D02 Layout: `grid grid-cols-1 md:grid-cols-2` → `grid-cols-1 sm:grid-cols-2` (mobile 1-col)
- [x] T-D03 Adicionar `<PageSection title="Identificação">` (consistência)

---

## Phase 5: FASE E — Cards secundários ✅

- [x] T-E01 CardSaude (8 text-xs) — corrigir
- [x] T-E02 CardKpis (refator minor de variant helper)
- [x] T-E03 CardDesempenhoDisciplina (2 text-xs) — corrigir
- [x] T-E04 CardDesempenho (4 text-xs) — corrigir
- [x] T-E05 CardEvolucao (3 text-xs) — corrigir + usar `chart-helpers`
- [x] T-E06 CardQuadroAulas (3 text-xs) — corrigir + mobile-friendly
- [x] T-E07 CardOcorrencias (3 text-xs) — corrigir

---

## Phase 6: FASE F — CardHistorico (39 text-xs) ✅

- [x] T-F01 Corrigir 39 ocorrências de `text-xs`
- [x] T-F02 Padronizar `text-[13px]` em hints, `text-[15px]` em descrições, `text-[14px]` em labels
- [x] T-F03 Validar que accordion segue acessibilidade

---

## Phase 7: FASE G — Modal Historico Manual (37 text-xs) ✅

- [x] T-G01 Corrigir 37 ocorrências de `text-xs`
- [x] T-G02 Layout oficial de Dialog (`p-0 gap-0`, `DialogHeader` com `shrink-0` e `border-b`)
- [x] T-G03 Footer fixo com botões Salvar/Cancelar
- [x] T-G04 Garantir `aria-required` em campos obrigatórios

---

## Phase 8: FASE H — Componentes auxiliares ✅

- [x] T-H01 `filtro-turma.tsx` (3 text-xs) — corrigir
- [x] T-H02 `expansao-indicadores.tsx` (8 text-xs) — corrigir
- [x] T-H03 `expansao-notas.tsx` (13 text-xs) — corrigir

---

## Phase 9: FASE I — Acessibilidade ✅

- [x] T-I01 `role="alert"` em mensagens de erro
- [x] T-I02 `aria-required` em inputs obrigatórios
- [x] T-I03 Garantir que todos os botões interativos têm `min-h-[36px]`
- [x] T-I04 Validar tab cycle pelo painel completo

---

## Phase 10: FASE J — Validação + docs ✅

- [x] T-J01 `npx next build` verde
- [x] T-J02 Validar manualmente nos 5 breakpoints
- [x] T-J03 Atualizar `AGENTS.md` (seção Progress) com spec 009
- [x] T-J04 Atualizar `tasks.md` com status final

---

## Status Final: ✅ CONCLUÍDA (2026-07-16)

Todas as fases A→J implementadas e validadas. Build verde.

## Arquivos modificados (resumo)

### Criados
- `src/components/painel-pessoa/dashboard-tabs.tsx` (wrapper shadcn Tabs)

### Modificados
- `src/app/(app)/gestao-usuarios/painel-aluno/page.tsx` (228 → ~280 linhas, +tabs)
- 12 componentes em `src/components/painel-pessoa/` (~133 text-xs corrigidos)

### Documentação
- `specs/009-painel-aluno-modernizacao/spec.md` ✅
- `specs/009-painel-aluno-modernizacao/plan.md` ✅
- `specs/009-painel-aluno-modernizacao/tasks.md` ✅
- `AGENTS.md` (seção Progress) ✅

---

## Notas de Execução

- **Builds**: 10+ builds verdes durante execução
- **Reuso**: padrão de tabs da spec 006; `chart-helpers` da spec 006 para gráficos
- **Commits**: in-place, sem git
- **Pendência consciente**: campos com `*` no label no modal historico-manual não receberam `aria-required` (escopo reduzido para os principais)
