# Implementation Plan: Histórico Escolar — Painel do Aluno

**Branch**: `004-historico-escolar` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-historico-escolar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Expandir o card "Histórico Escolar" no Painel do Aluno: transformar a tabela simples em accordion com apenas uma linha expandida por vez, exibindo subgrupos de Avaliação Numérica (disciplinas × períodos com notas, faltas, média, frequência) e Avaliação por Indicadores (disciplinas com indicadores e níveis registrados por período). Reformular o modal "Adicionar Histórico" com dois cards (Dados Gerais + Registros Escolares), permitindo adicionar múltiplas disciplinas com cálculo automático de cargas horárias (BNCC / Parte Diversificada / Total). Criar nova tabela `historico_manual_disciplinas` e adicionar coluna `estado` em `historico_manual`.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)

**Primary Dependencies**: shadcn/ui v4, Tailwind CSS v4, react-hook-form + zod v4, lucide-react, sonner (toast)

**Storage**: PostgreSQL via Supabase — 1 nova migration (`004_historico_escolar.sql`)

**Testing**: Validação visual manual + build (`npx next build`). Sem framework de teste automatizado.

**Target Platform**: Web (Next.js App Router, Client Components)

**Project Type**: Web application — frontend expansion + novas server actions + migration

**Performance Goals**: Expansão de matrícula carrega dados em <2s. Sumário de cargas horárias recalcula em <100ms (client-side). Build permanece estável.

**Constraints**: Zero novas dependências npm. Seguir tokens Design System (sem cores hardcoded). shadcn/ui para todos componentes de UI.

**Scale/Scope**: ~3 componentes modificados, ~4 novos componentes/subcomponentes, ~4 novas server actions, 1 migration SQL.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Server Actions First | ✅ PASS | Novas queries em `painel-pessoa.ts` e `historico-manual.ts` com `'use server'` |
| II. Security First | ✅ PASS | Todas ações validam permissão via `validarPermissaoServer(pessoaId, 'gestao-usuarios.painel-aluno', acao)` |
| III. Multi-Tenant by Design | ✅ PASS | Queries filtram por `school_id` |
| IV. Design Tokens over Hardcoded Styles | ✅ PASS | Componentes usam tokens Tailwind oficiais (bg-card, text-foreground, etc.) |
| V. Dark Mode Compatibility | ✅ PASS | Tokens com variantes `.dark` definidas no globals.css |
| VI. shadcn/ui as UI Standard | ✅ PASS | Card, Table, Select, Button, Input, Textarea, Dialog, Collapsible oficiais |
| VII. Database Through Migrations | ✅ PASS | `004_historico_escolar.sql` em `supabase-migrations/` |
| VIII. Auditability First | ✅ PASS | `created_by`, `updated_by`, `created_at`, `updated_at` na nova tabela |
| IX. Feature-Based Architecture | ✅ PASS | Componentes em `src/components/painel-pessoa/`, actions em `src/lib/actions/` |
| X. No New Patterns Without Approval | ✅ PASS | Reutiliza Collapsible (shadcn) para accordion, Table para dados tabulares |
| XI. Design System First | ✅ PASS | Card, Table, Select, Button, Input, Textarea, Dialog do catálogo oficial |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/004-historico-escolar/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (/speckit.specify output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
supabase-migrations/
└── 004_historico_escolar.sql           # NEW: tabela historico_manual_disciplinas + ALTER historico_manual

src/
├── components/painel-pessoa/
│   ├── card-historico.tsx              # MODIFIED: accordion (single-expand), botão sempre visível
│   ├── expansao-notas.tsx             # NEW: subgrupo Avaliação Numérica (tabela disciplina × período)
│   ├── expansao-indicadores.tsx       # NEW: subgrupo Avaliação por Indicadores (select disciplina + tabela)
│   └── modal-historico-manual.tsx     # MODIFIED: Card Dados Gerais + Card Registros Escolares + sumário
└── lib/actions/
    ├── painel-pessoa.ts               # MODIFIED: getNotasDetalhadas, getIndicadoresAvaliados
    └── historico-manual.ts            # MODIFIED: adicionarHistoricoManual (com disciplinas), listarHistoricoManual, removerHistoricoManual
```

**Structure Decision**: Single web application (Next.js App Router). Componentes seguem feature-based architecture em `src/components/painel-pessoa/`. Server actions em `src/lib/actions/`. Migration em `supabase-migrations/`.

## Complexity Tracking

> Nenhuma violação detectada no Constitution Check.
