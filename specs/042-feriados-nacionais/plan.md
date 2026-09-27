# Implementation Plan: Feriados Nacionais Automáticos no Calendário

**Branch**: `main` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/042-feriados-nacionais/spec.md`

## Summary

Todo calendário criado em Estrutura Acadêmica → Calendários já nasce com os feriados nacionais do seu intervalo gravados como eventos `recesso` (`Feriado Nacional – {nome}`), sem botão nem clique extra — buscados na BrasilAPI (gratuita, sem chave) no momento do save, com dedupe por sobreposição, auditoria individual e falha best-effort (nunca bloqueia o save; leitura nunca toca a API). Edição amplia só faixas novas de data; retry automático via marcador de prefixo; backfill de legados em script one-off (P2). 0 migrations + 0 tabelas alteradas + 0 deps npm.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js 16 App Router (Server Actions + 1 client component)

**Primary Dependencies**: BrasilAPI (`GET /api/feriados/v1/{ano}`, sem auth) via `fetch` + `AbortSignal.timeout(8000)`; Supabase via `getSupabaseAdmin()`; `registrarAuditoria` existente; `toast` (sonner) em `TabCalendarios.tsx`; `pg` (já instalada) só no script P2

**Storage**: PostgreSQL — nenhuma migration (linhas em `academico_calendario_eventos` existente, `tipo='recesso'` dentro do CHECK vigente)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate) + asserts manuais dos helpers puros via `node` se necessário

**Target Platform**: Web (mudança invisível na UI — só toasts; sem layout novo, sem breakpoint novo)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: 1–2 fetches externos por save de calendário (~12 linhas/ano inseridas); sem query nova em leitura; script P2 em lote único por calendário

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; helpers puros em módulo neutro (Turbopack: `'use server'` exporta só async — precedente `calendario-utils.ts`); `pessoaId` + auditoria best-effort nas escritas; permissão `gestao-academica.estrutura-academica.calendarios` inalterada; comparação de datas por string `YYYY-MM-DD` (nunca `Date`); tokens Tailwind (nenhum estilo novo — só toasts)

**Scale/Scope**: 1 arquivo novo (`src/lib/feriados-api.ts`) + 2 MOD (`lib/actions/calendarios.ts`, `TabCalendarios.tsx` — só toasts/desestruturação) + 1 script P2 (`scripts/seed-feriados-existentes.mjs`); ~12 eventos/ano por calendário

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — fetch externo e inserts dentro de `create/updateCalendario`; módulo neutro só com helpers + fetch puro (sem lógica de negócio fora da action); script P2 fora do bundle, administrativo. ✅
- **II. Security First** — sem chave/segredo (API pública); validação server-side; `schoolId` resolvido via `ano_letivo_id` como hoje; UI só exibe resultado. ✅
- **III. Multi-Tenant** — semeadura escopada ao `calendario_id` (que pertence ao ano da escola); superadmin segue o fluxo existente. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — zero UI nova além de toasts existentes (`toast.success/warning`); sem hex, sem componente nativo. ✅
- **VII. Migrations** — nenhuma (tabela/colunas existentes; marcador = prefixo de descrição). ✅
- **VIII. Auditability** — `createEvento` por feriado com `registrar('criar', 'Estrutura Acadêmica — Calendários', 'academico_calendario_eventos', …, pessoaId, schoolId)`; script P2 audita com `pessoa_id` nulo + módulo identificado. ✅
- **IX. Feature-Based** — tudo em `lib/feriados-api.ts` + `lib/actions/calendarios.ts` + `gestao-academica/estrutura-academica/TabCalendarios.tsx`; script em `scripts/` (precedente: `fix-acentos-banco.sql`). ✅
- **X. No New Patterns** — fetch server-side com timeout segue o padrão de actions do repo; `.mjs` com `pg` usa dependência já instalada; nenhum lib nova. ✅
- **XI. Design System First** — nenhum componente novo. ✅

### Product Experience

- **PE-101** → nenhuma UI nova; objetivo da tela inalterado, semeadura é comportamento invisível.
- **PE-403** → toast de sucesso com quantidade de feriados incluídos (N=0 com mensagem específica).
- **PE-402** → warning explica o ocorrido + próximo passo ("Salve novamente para tentar"), sem jargão.
- **PE-405** → retry automático no próximo save via marcador de prefixo (FR-005), sem ação dedicada.

*Re-check pós-Phase 1: nenhum artefato introduziu violação — data-model sem DDL, contracts sem endpoint novo, quickstart sem código de implementação.*

## Project Structure

### Documentation (this feature)

```text
specs/042-feriados-nacionais/
├── plan.md                        # This file
├── spec.md                        # Feature specification
├── research.md                    # Phase 0 output (6 decisões R1–R6)
├── data-model.md                  # Phase 1 output (sem DDL: semântica do evento + marcador + shape da fonte)
├── quickstart.md                  # Phase 1 output (§1–§7, incl. teste com API bloqueada)
├── contracts/
│   └── feriados-actions.md        # Phase 1 output (assinaturas + comportamentos)
├── checklists/
│   └── requirements.md            # Quality gate da spec (tudo passa)
└── tasks.md                       # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── feriados-api.ts            # NOVO neutro: FeriadoNacional, anosDoIntervalo,
│   │                              #   filtrarPorIntervalo, mapearParaEvento, buscarFeriadosNacionais
│   └── actions/
│       └── calendarios.ts         # MOD: create/updateCalendario semeiam + retornam
│                                  #   { calendario, feriados } (FR-001–007)
├── app/(app)/gestao-academica/estrutura-academica/
│   └── TabCalendarios.tsx         # MOD: só desestruturação + toasts (FR-009)
scripts/
└── seed-feriados-existentes.mjs   # NOVO P2 (US4): backfill idempotente + --dry-run
```

**Structure Decision**: Feature-based (Constituição IX); módulo neutro segue precedente `calendario-utils.ts`; script administrativo em `scripts/` fora do bundle Next.

## Phases

### Phase 0 — Módulo neutro + semeadura no create (US1, US3 — núcleo)

`src/lib/feriados-api.ts`: tipos + 3 funções puras + `buscarFeriadosNacionais` (fetch + `AbortSignal.timeout(8000)`, valida shape mínimo `{date, name}`). `calendarios.ts`: helper interno `semearFeriados(calendario, pessoaId, {somenteForaDe?})` executando anos → busca → filtra → dedupe por sobreposição (`recesso|nao_letivo|dia_letivo`; `periodo_avaliativo` não bloqueia) → `createEvento` por restante; `createCalendario` chama com intervalo inteiro e retorna `{ calendario, feriados }`. `TabCalendarios.handleCreateCalendario`: desestrutura + toasts (sucesso com N / N=0 / warning com erro).

### Phase 1 — Update inteligente: faixas novas + retry (US2)

`updateCalendario`: com `anterior` já em mãos, chama `semearFeriados` com `somenteForaDe=[anterior.inicio, anterior.fim]`; se zero eventos com prefixo no calendário, semeia intervalo inteiro (retry). `handleUpdateCalendario`: toasta adição só quando `inseridos>0`, warning quando `erro`. Casos: exclusão manual preservada (sem ampliação nada recria), re-save idempotente, redução de intervalo não apaga.

### Phase 2 — Backfill legados (US4, P2 — paralelizável, arquivo isolado)

`scripts/seed-feriados-existentes.mjs`: conecta com `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`, lista calendários sem eventos do prefixo, aplica o mesmo pipeline via SQL direto + inserts em `auditoria`, flag `--dry-run`, log `inseridos/ignorados/erro` por calendário. Idempotência verificada por 2 execuções.

### Phase 3 — Gates

`tsc --noEmit` + `next build` verdes; `quickstart.md` §1–§7 executado (incl. §4 com host bloqueado e §5 de leitura imune); `rg 'Feriado Nacional –' src/lib` com prefixo byte-idêntico nos arquivos; auditoria conferida em `/auditoria`; sem `fetch(brasilapi` fora de `feriados-api.ts` + script P2 (`rg`).

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Marcador = prefixo `Feriado Nacional –` na descrição | Coluna `origem` / tabela de controle | Evita migration por um flag booleanizável via `LIKE`; prefixo é legível na UI e na auditoria |
| Dedupe por sobreposição de data+tipo | Dedupe por descrição+data | Preserva manuais com texto diferente e sobrevive a renomeações; `periodo_avaliativo` tratado como não-bloqueador por não marcar dia livre |
| Retorno `{ calendario, feriados }` nas actions | Exceção em falha / toast cego na UI | Falha best-effort sem bloquear (US3) + feedback com contagem (PE-403); 1 consumidor só (grep confirma) |
| Backfill em `.mjs` com `pg` | Action admin na UI / seed preguiçoso na Visualização | Uso único não merece superfície+permissão; seed preguiçoso ressuscitaria exclusões manuais; `pg` já é dependência |
| Importar tudo que a fonte devolver (incl. facultativos) | Filtrar `type==='national'` | Campo `type` instável entre provedores; exclusão manual pelo fluxo atual é mais simples que maintaining allowlist |
