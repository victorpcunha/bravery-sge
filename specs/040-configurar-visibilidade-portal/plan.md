# Implementation Plan: Visibilidade dos Módulos do Portal do Responsável

**Branch**: `main` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/040-configurar-visibilidade-portal/spec.md`

## Summary

Configuração por escola, no card "Portal do Responsável" da Unidade Escolar, para marcar/desmarcar os 6 módulos funcionais visíveis no Portal do Responsável (Boletim, Frequência, Horários, Ocorrências, Comunicados, Documentos). Persistência em 6 booleans de `schools` (`DEFAULT TRUE`); enforcement server-side via `exigirModuloVisivel` nas actions do portal + filtragem client via `modulosVisiveis` no contexto do portal. Sem perfil de responsável; gestão interna inalterada.

## Technical Context

**Language/Version**: TypeScript 5, Next.js 16.2.4 (Turbopack), React 19, react-hook-form + zod v4

**Primary Dependencies**: Supabase (`@supabase/supabase-js`, `getSupabaseAdmin`), shadcn/ui (`ClickablePill`, `EmptyState`, `Button`), `sonner` (toast)

**Storage**: PostgreSQL via Supabase — 1 migration aditiva (`supabase-migrations/patch_portal_modulos_visiveis.sql`); sem CLI Supabase, aplicar via SQL Editor

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro manual ([quickstart.md](./quickstart.md)); repo sem runner de testes

**Target Platform**: Web (app interno + portal público por slug)

**Project Type**: Web application (Next.js full-stack, Server Actions)

**Performance Goals**: Zero fetch extra no portal — visibilidade viaja no `getEscolaPortal` já executado pelo `[slug]/layout.tsx`; `getInicioPortal` pula consultas de módulos ocultos

**Constraints**: `'use server'` exporta só async (helpers neutros em `src/lib/portal-modulos.ts`); form usa convenção `'1'`/`'0'`; somente tokens de design (sidebar-* no portal); Registro 00 do Censo não pode ser afetado

**Scale/Scope**: ~10 arquivos tocados, 1 migration, 0 novas deps npm; por escola, efeito imediato para todos os responsáveis

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First**: configuração via `updateSchool`; enforcement em actions (`portal-escola.ts`, `portal.ts`); cliente só espelha. ✅
- **II. Security First**: `exigirModuloVisivel` server-side após `validarVinculoPortal`, por `school_id` do slug; sem confiança no frontend; mensagem de bloqueio sem vazar dados. ✅
- **III. Multi-Tenant by Design**: visibilidade 1:1 por escola, isolamento verificado no quickstart (cenário 3). ✅
- **IV/V. Design Tokens + Dark Mode**: pills oficiais, tokens `sidebar-*` no portal, `EmptyState` oficial no bloqueio. ✅
- **VI. shadcn/ui**: `ClickablePill`, `Button`, `EmptyState` — nenhum componente novo. ✅
- **VII. Database Through Migrations**: 1 migration em `supabase-migrations/`, colunas `portal_vis_*` (prefixo existente, sem `ativo`). ✅
- **VIII. Auditability**: `updateSchool` já audita diff completo (módulo `Unidade Escolar`). ✅
- **IX. Feature-Based**: actions em `lib/actions/portal*.ts`, UI em `components/portal/` + `components/censo/`, neutro em `lib/portal-modulos.ts`. ✅
- **X. No New Patterns**: reuso de `ClickablePill`, `EmptyState`, split `{ documentos, ...censo }`, padrão de orientação de portal desabilitado. ✅
- **XI. Design System First**: sem componente novo; pills agrupadas no card existente (PE-204). ✅

### Product Experience

- **PE-101/102**: card mantém objetivo único; grupo rotulado comunica o propósito no primeiro olhar.
- **PE-204**: toggles agrupados no card existente, junto a habilitar/slug.
- **PE-402**: bloqueio exibe `EmptyState` orientador ("procure a secretaria"), nunca erro técnico nem tela vazia.
- **PE-403**: save confirma via `toast.success` vigente.
- Trade-off intencional: `getInicioPortal` retorna zeros/arrays vazios para módulos ocultos (shape inalterado) em vez de erro — o Início é sempre visível (FR-010) e as seções somem silenciosamente por diseño.

*Re-check pós-Phase 1*: design acima reflete todos os 5 princípios; sem contradições. ✅

## Project Structure

### Documentation (this feature)

```text
specs/040-configurar-visibilidade-portal/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── portal-visibilidade.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
supabase-migrations/
└── patch_portal_modulos_visiveis.sql   # NOVO: 6 booleans DEFAULT TRUE

src/
├── lib/
│   ├── portal-modulos.ts               # NOVO (neutro): chaves, rótulos, mapa coluna, defaults
│   └── actions/
│       ├── portal-escola.ts            # EDIT: select das flags, modulosVisiveis, exigirModuloVisivel
│       ├── portal.ts                   # EDIT: guards nas 8 actions + skip em getInicioPortal
│       └── schools.ts                  # EDIT: tipo School += 6 flags
├── components/
│   ├── censo/
│   │   └── escola-form.tsx             # EDIT: zod + 6 ClickablePill (só com portal ativo)
│   ├── portal/
│   │   ├── portal-provider.tsx         # EDIT: EscolaPortalCtx += modulosVisiveis
│   │   ├── portal-sidebar.tsx          # EDIT: filtrar ITENS (Início sempre)
│   │   └── inicio-cards.tsx            # EDIT: omitir blocos de módulos ocultos
│   └── ui/
│       └── clickable-pill.tsx          # REUSO (sem alteração)
└── app/
    ├── portal/[slug]/
    │   ├── layout.tsx                  # EDIT: repassar modulosVisiveis ao provider
    │   └── aluno/
    │       ├── page.tsx                # EDIT: acesso rápido filtrado
    │       └── {boletim,frequencia,horarios,ocorrencias,comunicados,documentos}/page.tsx  # EDIT: EmptyState quando oculto
    └── (app)/escolas/[id]/page.tsx    # SEM ALTERAÇÃO (submit/auditoria/permicovers já cobrem)
```

**Structure Decision**: Web application —Segue a estrutura por domínio vigente (actions por feature em `lib/actions/`, UI em `components/[dominio]/`); nenhum diretório novo além do neutro `lib/portal-modulos.ts` (precedente `lib/importacao-modelos.ts`, spec 039).

## Complexity Tracking

> Nenhuma violação da Constituição — tabela vazia por diseño.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
