# Implementation Plan: Painel do Aluno — Modernização Visual

**Branch**: `009-painel-aluno-modernizacao` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)
**Depends on**: `specs/002-design-system` ✅, `specs/006-dashboard-modernizacao` (DashboardTabs) ✅

## Summary

Modernizar a tela de Painel do Aluno (`/gestao-usuarios/painel-aluno`) com 12 componentes. Dividida em 10 fases (A→J). Inclui 4 tabs fixas (Visão Geral, Desempenho, Acadêmico, Histórico), refator do FiltroPessoa para shadcn Command/Popover, correção massiva de `text-xs` (~133 ocorrências em 13 arquivos), adaptação mobile e acessibilidade.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
**Primary Dependencies**: shadcn/ui v4, Tailwind CSS v4, lucide-react, sonner, Recharts (já instalado)
**Storage**: Nenhuma migration
**Testing**: `npx next build` + validação visual em 5 breakpoints
**Performance Goals**: Build estável. Sem novos fetches.
**Constraints**: Zero novas dependências npm. Manter contratos de `painel-pessoa.ts`. PessoaForm (modal-historico-manual) é arquivo único.
**Scale/Scope**: 1 página + 12 componentes. ~133 text-xs fixes. 1 refator (FiltroPessoa). 1 reorganização (tabs).

## Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Nenhuma action nova |
| II. Security First | ✅ PASS | Permissões preservadas (usePermissoes) |
| III. Multi-Tenant by Design | ✅ PASS | `schoolId` em todas as actions |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Apenas correções de tokens |
| V. Dark Mode Compatibility | ✅ PASS | Sem mudança de cores |
| VI. shadcn/ui as UI Standard | ✅ PASS | FiltroPessoa migrado para Command/Popover; Dialog oficial |
| VII. Database Through Migrations | N/A | Nenhuma migration |
| VIII. Auditability First | N/A | Nenhuma operação de dados |
| IX. Feature-Based Architecture | ✅ PASS | Componentes em `src/components/painel-pessoa/` |
| X. No New Patterns Without Approval | ✅ PASS | Tabs seguem padrão da spec 006 |
| XI. Design System First | ✅ PASS | Layout oficial, componentes oficiais |

**Gate: PASS**

## Project Structure

### Source Code (modificado)

```text
src/
├── app/(app)/gestao-usuarios/painel-aluno/
│   └── page.tsx                              # MODIFIED: 4 tabs + reorganização
│
└── components/painel-pessoa/
    ├── filtro-pessoa.tsx                     # MODIFIED: shadcn Command/Popover
    ├── card-identificacao.tsx                # MODIFIED: tipografia + layout
    ├── card-saude.tsx                        # MODIFIED: tipografia
    ├── card-kpis.tsx                         # MODIFIED: tipografia
    ├── card-desempenho-disciplina.tsx        # MODIFIED: tipografia
    ├── card-desempenho.tsx                   # MODIFIED: tipografia
    ├── card-evolucao.tsx                     # MODIFIED: tipografia
    ├── card-quadro-aulas.tsx                 # MODIFIED: tipografia
    ├── card-historico.tsx                    # MODIFIED: tipografia (39 text-xs)
    ├── card-ocorrencias.tsx                  # MODIFIED: tipografia
    ├── expansao-indicadores.tsx              # MODIFIED: tipografia
    ├── expansao-notas.tsx                    # MODIFIED: tipografia
    ├── filtro-turma.tsx                      # MODIFIED: tipografia
    ├── grafico-desempenho.tsx                # MODIFIED: tipografia + chart-helpers
    └── modal-historico-manual.tsx            # MODIFIED: tipografia (37 text-xs) + dialog oficial
```

## Implementation Phases

### FASE A — Fundação da página

- T-A01: `page.tsx` — loading state com `<PageSection>` skeleton (não divs soltos)
- T-A02: Ajustar `grid grid-cols-1 md:grid-cols-5` para `grid-cols-1 sm:grid-cols-5` (mobile com 1-col)
- T-A03: Empty state "Aluno sem matrícula" virar `EmptyState` oficial
- T-A04: Texto cru "Aluno sem matrícula ativa" → `EmptyState`
- T-A05: Cada `<div className="mb-8">` com card empilhado → `<PageSection>` consistente

### FASE B — Tabs (4 abas)

- T-B01: Criar `src/components/painel-pessoa/dashboard-tabs.tsx` (wrapper shadcn Tabs + searchParams opcional)
- T-B02: `page.tsx` — integrar `<DashboardTabs>` com 4 abas:
  - **Visão Geral** (sempre): Identificação + Saúde + KPIs
  - **Desempenho** (com turma): DesempenhoDisciplina + Evolução
  - **Acadêmico** (com turma): QuadroAulas
  - **Histórico** (sempre): Histórico + Ocorrências
- T-B03: Aplicar padrão de tabs da Dashboard (bg-card + border + shadow-xs, ativa primary)
- T-B04: Tabs com `min-h-[40px]` (PE-603)

### FASE C — FiltroPessoa → shadcn Command/Popover

- T-C01: Criar `src/components/painel-pessoa/filtro-pessoa.tsx` usando shadcn `Command` (busca com Popover)
- T-C02: Substituir o dropdown custom por `CommandDialog` ou `Popover` com `CommandInput` e `CommandList`
- T-C03: Empty state no dropdown com `EmptyState` oficial
- T-C04: Manter debounce 300ms e mínimo 3 caracteres
- T-C05: Corrigir 1 ocorrência de `text-xs` (linha 95)

### FASE D — CardIdentificacao

- T-D01: Substituir 9 ocorrências de `text-xs` (linhas 75, 84, 91, 97, 103, 109, 115, 121, 130, ...)
- T-D02: Layout: `grid grid-cols-1 md:grid-cols-2` → `grid-cols-1 sm:grid-cols-2` (mobile 1-col)
- T-D03: Adicionar `<PageSection title="Identificação">` (consistência)

### FASE E — CardSaude, CardKpis, CardDesempenho, CardEvolucao, CardQuadroAulas, CardOcorrencias

- T-E01: CardSaude (8 text-xs) — corrigir para `text-[13px]` ou `text-[14px]` conforme contexto
- T-E02: CardKpis (sem text-xs mas usa StatCard oficial) — refator minor de variant helper
- T-E03: CardDesempenhoDisciplina (2 text-xs) — corrigir
- T-E04: CardDesempenho (4 text-xs) — corrigir
- T-E05: CardEvolucao (3 text-xs) — corrigir + usar `chart-helpers` (reutilizar da spec 006)
- T-E06: CardQuadroAulas (3 text-xs) — corrigir + mobile-friendly (sticky first column já existe)
- T-E07: CardOcorrencias (3 text-xs) — corrigir

### FASE F — CardHistorico (39 text-xs)

- T-F01: Corrigir 39 ocorrências de `text-xs` em `card-historico.tsx` (labels, hints, anotações)
- T-F02: Padronizar `text-[13px]` em hints, `text-[15px]` em descrições, `text-[14px]` em labels
- T-F03: Validar que accordion segue acessibilidade (já tem por shadcn Accordion)

### FASE G — Modal Historico Manual (37 text-xs)

- T-G01: Corrigir 37 ocorrências de `text-xs` em `modal-historico-manual.tsx`
- T-G02: Aplicar layout oficial de Dialog (`p-0 gap-0`, `DialogHeader` com `shrink-0` e `border-b`)
- T-G03: Footer fixo com botões Salvar/Cancelar
- T-G04: Garantir `aria-required` em campos obrigatórios

### FASE H — Componentes auxiliares

- T-H01: `filtro-turma.tsx` (3 text-xs) — corrigir
- T-H02: `expansao-indicadores.tsx` (8 text-xs) — corrigir
- T-H03: `expansao-notas.tsx` (13 text-xs) — corrigir

### FASE I — Acessibilidade

- T-I01: `role="alert"` em mensagens de erro
- T-I02: `aria-required` em inputs obrigatórios
- T-I03: Garantir que todos os botões interativos têm `min-h-[36px]`
- T-I04: Validar tab cycle pelo painel completo

### FASE J — Validação + docs

- T-J01: `npx next build` verde
- T-J02: Validar manualmente nos 5 breakpoints
- T-J03: Atualizar `AGENTS.md` (seção Progress) com spec 009
- T-J04: Atualizar `tasks.md` com status final

## Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | 133+ text-xs para corrigir é muito trabalho | Fazer em batch com PowerShell replace (já testado na spec 007) |
| R2 | Refator do FiltroPessoa pode quebrar busca | Manter debounce 300ms e mínimo 3 caracteres; testar com dados reais |
| R3 | Tabs podem confundir com lógica `pessoaSelecionada && turmaId` | Usar `defaultValue` controlado; tabs "Desempenho" e "Acadêmico" desabilitadas sem turma |
| R4 | Modal historico-manual é 15KB | Mudanças focadas; sem refator estrutural |
| R5 | Spec 009 em paralelo com outras ativas | Ortogonais, sem conflito |

## Estratégia de Migração

- Commits in-place (preferência do usuário)
- Tabs primeiro (define estrutura)
- Depois correções em batch (text-xs)
- FiltroPessoa com cuidado (refator)
- Validação após cada fase

## Validação Final

- [ ] Build verde
- [ ] Tabs funcionam
- [ ] FiltroPessoa busca e seleciona aluno
- [ ] Mobile: cards em 1-col, tabs em scroll
- [ ] Zero `text-xs` em todos os 13 arquivos
- [ ] Acessibilidade validada
- [ ] `AGENTS.md` atualizado
