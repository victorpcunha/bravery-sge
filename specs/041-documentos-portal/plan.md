# Implementation Plan: Documentos no Portal do Responsável

**Branch**: `041-documentos-portal` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/041-documentos-portal/spec.md`

## Summary

A escola passa a escolher, no card "Portal do Responsável" (Unidade Escolar → Identificação), quais documentos oficiais e de preenchimento manual os responsáveis podem gerar pelo portal; o portal exibe só o liberado e gera sempre no contexto do aluno/turma em visualização, com bloqueio server-side. Abordagem: tabela dedicada `escola_portal_documentos` (opt-out: ausência = liberado, o que torna documentos futuros automaticamente cobertos — FR-009), catálogo neutro `src/lib/portal-documentos.ts` espelhando o padrão `portal-modulos.ts` (spec 040), wrappers portal que validam vínculo + módulo + documento e delegam ao motor existente com `pessoaId` indefinido (padrão `portal.ts`), e reuso do `DocumentoGerador` estendido com aluno/ano fixos. Detalhes em [research.md](./research.md), [data-model.md](./data-model.md), [contracts/portal-documentos.md](./contracts/portal-documentos.md) e [quickstart.md](./quickstart.md).

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16.2.4 (App Router) + React

**Primary Dependencies**: `react-hook-form` 7 + `zod` v4 (forms), `shadcn/ui` (UI), `@react-pdf/renderer` + `pdfjs-dist` (geração/preview de PDF), `sanitize-html` (papel timbrado), Supabase (`getSupabaseAdmin()`, sem CLI — migrations via SQL Editor)

**Storage**: Supabase Postgres. Nova tabela `escola_portal_documentos` via `supabase-migrations/patch_portal_documentos_escola.sql`. Zero colunas novas em `schools` (Registro 00 do Censo ignora por construção).

**Testing**: Sem suite automatizada no repo (padrão das specs 019–021/039/040): `npx tsc --noEmit` + `eslint` nos arquivos tocados + `npx next build` + E2E manual do [quickstart.md](./quickstart.md).

**Target Platform**: Web responsivo (desktop da secretaria + mobile do responsável; portal mobile-first já existente).

**Project Type**: Web application (Next.js monolito: Server Actions em `src/lib/actions/`, componentes em `src/components/`, páginas em `src/app/`).

**Performance Goals**: Galeria do portal abre sem queries extras por documento (1 leitura normalizada via `getEscolaPortal`); geração delega ao motor existente (mesmos tempos do módulo interno).

**Constraints**: Server Actions `'use server'` + `getSupabaseAdmin()`; validação server-side autoritativa (vínculo `responsavel_alunos` revalidado por chamada + `exigirModuloVisivel` + `exigirDocumentoLiberado`); multi-tenant por `schoolId` (cross-escola nega); só tokens do Design System (zero hex; PDFs via `pdf-palette.ts`); auditoria best-effort via `registrarAuditoria`; módulos `'use server'` exportam só async (helpers no módulo neutro).

**Scale/Scope**: 4 documentos oficiais iniciais + categoria manual vazia; 1 tabela; ~6 arquivos novos/estendidos; 0 novas deps npm.

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — toda leitura/escrita via actions em `src/lib/actions/` (`portal-documentos.ts`, acréscimos em `portal.ts`/`portal-escola.ts`); validação client complementar, server-side autoritativa. ✅
- **II. Security First** — `salvarDocumentosPortal` exige `escolas/editar` (`validarPermissaoEstrita`); wrappers do portal exigem `validarVinculoPortal` + módulo + documento; cliente nunca informa turma/ano; erros sem vazar auth (`Acesso negado` genérico; mensagem orientativa só para indisponibilidade configurada). ✅
- **III. Multi-Tenant** — config por `school_id` (FK, PK composta); `schoolId` do slug confrontado com o da matrícula; superadmin sem contexto não gera pelo portal. ✅
- **IV/V/VI/XI. Tokens, Dark Mode, shadcn, Design System** — `ClickablePill`, `PageSection`, `EmptyState`, `StatusBadge`/`ModuloBloqueado` existentes; galeria espelha `oficiais-tab.tsx`; zero hex. ✅
- **VII. Migrations** — 1 migration em `supabase-migrations/`, aplicada via SQL Editor; convenções de nome (`liberado`, não `ativo`). ✅
- **VIII. Auditability** — `salvarDocumentosPortal` registra `editar` (módulo `Portal — Documentos`) com diff; geração (leitura) não audita, conforme spec 017. ✅
- **IX. Feature-Based** — actions em `lib/actions/`, catálogo em `lib/`, UI em `components/portal/` + `components/censo/` + `components/documentos/`, página em `app/portal/[slug]/aluno/documentos/`. ✅
- **X. No New Patterns** — nenhum padrão novo: reuso de pills, grupo separado + action própria (spec 018), enforcement pós-vínculo (spec 040), `DocumentoGerador` estendido de forma retrocompatível. ✅

Sem violações — **Complexity Tracking vazio**.

### Product Experience

- **PE-101** — página do portal mantém objetivo único (gerar documentos do aluno); seção da escola tem objetivo único (definir disponibilidade). Refletido em: galeria sem ações concorrentes; seção isolada no card do portal.
- **PE-102** — header do portal identifica aluno + turma; seção da escola vive no card "Portal do Responsável" com descrição própria.
- **PE-201** — só o liberado aparece no portal; na escola, a seção fica abaixo de habilitação/módulos.
- **PE-204** — agrupamento no card do portal, separado por categoria oficial/manual.
- **PE-402** — erros orientativos distintos (`Módulo indisponível…`, `Documento indisponível…`, motivo de bloqueio do Boletim) + FR-007/FR-008 com orientação à secretaria.
- **PE-403** — preview + "Baixar PDF" imediatos via `DocumentoGerador` reutilizado.

## Project Structure

### Documentation (this feature)

```text
specs/041-documentos-portal/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── portal-documentos.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── portal-documentos.ts          # NOVO (neutro): catálogo + normalização
│   └── actions/
│       ├── portal-documentos.ts      # NOVO: getDocumentosLiberados, salvarDocumentosPortal
│       ├── portal-escola.ts          # + exigirDocumentoLiberado; getEscolaPortal retorna documentosLiberados
│       └── portal.ts                 # + listarDocumentosDisponiveisPortal + 5 wrappers de geração
├── components/
│   ├── portal/
│   │   ├── portal-provider.tsx       # EscolaPortalCtx += documentosLiberados
│   │   └── documentos-portal.tsx     # NOVO: galeria filtrada + geração
│   ├── documentos/
│   │   └── documento-gerador.tsx     # + props opcionais alunoFixo/anoLetivoFixo
│   └── censo/
│       └── escola-form.tsx           # + seção no card Portal (grupo portal_documentos)
├── app/
│   ├── portal/[slug]/aluno/documentos/page.tsx  # galeria real no lugar do "Em breve"
│   └── (app)/escolas/[id]/page.tsx              # chama salvarDocumentosPortal pós-updateSchool
supabase-migrations/
└── patch_portal_documentos_escola.sql  # NOVO: tabela escola_portal_documentos
```

**Structure Decision**: monolito Next.js existente, organização por domínio (Constituição IX); nenhum diretório novo além dos arquivos acima.

## Complexity Tracking

> Nenhuma violação da Constituição — seção sem linhas (GATE passou antes e depois do design).
