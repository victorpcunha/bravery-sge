# Implementation Plan: Portal por Escola

**Branch**: `024-portal-por-escola` | **Date**: 2026-09-08 | **Spec**: `specs/024-portal-por-escola/spec.md`

**Input**: Feature specification from `/specs/024-portal-por-escola/spec.md`

## Summary

Evoluir o Portal do Responsável (spec 023) para operação por escola: pilar 1 — card "Portal do Responsável" no cadastro da Unidade Escolar (pill Sim/Não + slug único, molde spec 018); pilar 2 — rotas `/portal/[slug]/*` com branding do login por escola (nome/logo reusados + imagem/texto novos) e genéricas convertidas em orientação; pilar 3 — escopo de dados pela escola do slug em todas as actions (vínculo + escola). 2 migrations aditivas; zero breaking change no interno; links antigos morrem (roteiro de repasse aos responsáveis).

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16 (App Router; `params` assíncrono em segmentos dinâmicos)

**Primary Dependencies**: As da 023 (supabase-js browser com `storageKey` própria, zod v4, shadcn/ui + oficiais, `PillToggleGroup` existente) — nenhuma nova

**Storage**: PostgreSQL via Supabase; **2 migrations** (`patch_portal_escolas.sql`: `schools.portal_habilitado` + `portal_slug` UNIQUE; `patch_portal_login_brand.sql`: `documentos_config.portal_imagem_fundo` + `portal_texto_login`); imagens base64 TEXT ≤2 MB (padrão 018)

**Testing**: Validação manual via `quickstart.md`; gates `npx tsc --noEmit` + `npx next build`

**Target Platform**: Web responsiva mobile-first (login com bg adaptativo em 360px)

**Project Type**: Evolução de área existente (mover `src/app/portal/*` → `src/app/portal/[slug]/*` + estender actions/form)

**Performance Goals**: Resolução slug→escola em 1–2 queries (índice UNIQUE); login em até 3 min incluindo identificação da escola (SC-001/SC-002)

**Constraints**: Sem middleware (padrão); `params` de `[slug]` assíncrono; genéricas nunca expõem form/dados; slug reservado nunca colide; Censo ignora novas colunas; auditoria mascara base64

**Scale/Scope**: ~10 páginas movidas + 1 nova (orientação) + card no EscolaForm + fachada `portal-escola.ts` + escopo em `portal.ts`; 1 escola = 1 slug

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — PASS: `getEscolaPortal`, slug único e branding via actions em `portal-escola.ts`; zero API Routes.
- **II. Security First** — PASS: escola do slug + vínculo revalidados server-side por chamada; slug inválido/desabilitado não vaza existência (mensagem única); `escolas.editar` no cadastro.
- **III. Multi-Tenant** — PASS: o slug *é* o tenant do portal; isolamento A×B verificado (SC-003).
- **IV/V/VI. Tokens/Dark/shadcn** — PASS: só tokens + `PillToggleGroup`/oficiais; bg com fallback.
- **VII. Migrations** — PASS: 2 aditivas; convenções seguidas.
- **VIII. Auditoria** — PASS: módulo `Unidade Escolar` (flag/slug) + máscara base64 (estende `semLogo`).
- **XI. Design System** — PASS: card no form + EmptyState nas variantes orientação/indisponível; layouts oficiais.
- **IX/X** — PASS: domínios existentes (`portal`, censo); sem padrão novo (data URI e storageKey própria já são padrão vigente).

### Product Experience

PE-102 (identificação imediata → branding acima da dobra + orientação clara), PE-204 (card agrupado), PE-402 (slug duplicado/inválido e indisponível com mensagens orientadoras; genérica LGPD), PE-404 (loading slug/login/save), PE-6xx (login 360px). Sem contradições.

**Re-check pós-Phase 1**: mantido — data-model/contracts/quickstart não introduzem violações.

## Project Structure

### Documentation (this feature)

```text
specs/024-portal-por-escola/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── portal-escola.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/portal/[slug]/                   # MOVE de src/app/portal/* (login, termo, selecionar-aluno, aluno/*)
│   ├── layout.tsx                       # NOVO: resolve escola (R2) → indisponível/orientação ou PortalProvider com escola
│   └── login/page.tsx                   # EDIT: branding por escola (R6)
├── app/portal/login/page.tsx            # REPROPÓSITO: página neutra de orientação (US3)
├── components/portal/
│   ├── portal-provider.tsx              # EDIT: recebe escola; repassa schoolId às actions
│   └── portal-orientacao.tsx            # NOVO: orientação/indisponível (variantes)
├── components/censo/escola-form.tsx     # EDIT: grupo zod `portal` + card na Identificação
├── lib/actions/portal-escola.ts         # NOVO: getEscolaPortal, normalizarSlug, validarSlugUnico, sugerirSlug
├── lib/actions/portal.ts                # EDIT: schoolId opcional em validarVinculoPortal/getSessaoPortal
├── lib/actions/schools.ts               # EDIT: tipo School += portal_habilitado/portal_slug
└── lib/actions/documentos-config.ts     # EDIT: tipo + payload += portal_imagem_fundo/portal_texto_login (+ máscara audit)

supabase-migrations/
├── patch_portal_escolas.sql             # NOVO (schools.portal_habilitado/slug)
└── patch_portal_login_brand.sql         # NOVO (documentos_config.portal_imagem_fundo/portal_texto_login)
```

**Structure Decision**: segmento dinâmico `[slug]` com layout-resolver (R1/R2); config no form existente via molde 018 (R3); escopo nas actions existentes (R4); branding com fallback (R6).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
