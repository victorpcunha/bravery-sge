# Tasks: Feriados Nacionais Automáticos no Calendário

**Input**: Design documents from `/specs/042-feriados-nacionais/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/feriados-actions.md, quickstart.md

**Tests**: Repo sem framework de testes (gate = `tsc --noEmit` + `next build` + `quickstart.md`); nenhuma test-task gerada.

**Organization**: Tasks por user story; US1–US3 = MVP incremental, US4 (P2) descopável.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: user story da spec (`US1`–`US4`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar premissa externa antes de codar

- [X] T001 Validar shape vivo da BrasilAPI via `Invoke-RestMethod https://brasilapi.com.br/api/feriados/v1/2026` (conferir campos `date`/`name`/`type` e presença de móveis como Carnaval/Paixão/Corpus Christi); se divergir de `data-model.md` §4, atualizar data-model + contracts antes de codar

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Módulo neutro que todas as stories consomem

**⚠️ CRITICAL**: Nenhuma user story começa antes desta phase

- [X] T002 Criar `src/lib/feriados-api.ts` (neutro, sem `'use server'`) com `FeriadoNacional`, `anosDoIntervalo`, `filtrarPorIntervalo`, `mapearParaEvento` (prefixo `Feriado Nacional –` com en-dash, `tipo: 'recesso'`, dia único, `etapas: []`, `recorrencia_tipo: 'nao_repete'`) e `buscarFeriadosNacionais` (`fetch` + `AbortSignal.timeout(8000)`, valida `{date, name}`, rejeita em timeout/HTTP/rede/payload inválido)

**Checkpoint**: Helpers importáveis; `npx tsc --noEmit` verde

---

## Phase 3: User Story 1 - Calendário nasce com os feriados nacionais (Priority: P1) 🎯 MVP

**Goal**: `createCalendario` semeia o intervalo inteiro; UI confirma com toast de contagem

**Independent Test**: `quickstart.md` §1 (anual jan–dez/2026, ~12 recessos vermelhos + KPI) e §2 (semestral, subconjunto)

- [X] T003 [US1] Implementar helper interno `semearFeriados` + novo retorno `{ calendario, feriados: { inseridos, ignorados, erro? } }` em `createCalendario` em `src/lib/actions/calendarios.ts` (pipeline anos→busca→filtra→dedupe por sobreposição `recesso|nao_letivo|dia_letivo`, `periodo_avaliativo` não bloqueia → `createEvento` por restante com auditoria; falha da fonte nunca lança — vai em `feriados.erro`)
- [X] T004 [US1] Ajustar `handleCreateCalendario` em `src/app/(app)/gestao-academica/estrutura-academica/TabCalendarios.tsx` (desestrutura novo retorno; `toast.success` com N / N=0 com mensagem específica / `toast.warning` quando `erro`) e executar `quickstart.md` §1–§2

**Checkpoint**: US1 funcional e testável sozinha (criação cobre o caso feliz + falha com warning)

---

## Phase 4: User Story 2 - Expansão sem ressuscitar + retry (Priority: P1)

**Goal**: `updateCalendario` semeia só faixas novas; retry integral quando nada foi semeado

**Independent Test**: `quickstart.md` §3 (ampliar sem ressuscitar, sem duplicar; re-save idempotente)

- [X] T005 [US2] Implementar semeadura parcial em `updateCalendario` em `src/lib/actions/calendarios.ts` (usa `anterior` já carregado: só datas fora de `[anterior.data_inicio, anterior.data_termino]` e dentro do novo intervalo; se zero eventos com prefixo no calendário, semeia intervalo inteiro; mesmo pipeline/dedupe/erro de T003)
- [X] T006 [US2] Ajustar `handleUpdateCalendario` em `src/app/(app)/gestao-academica/estrutura-academica/TabCalendarios.tsx` (toasta adição só se `inseridos>0`, warning se `erro`, senão toast atual) e executar `quickstart.md` §3

**Checkpoint**: US1 + US2 funcionam; exclusão manual nunca ressuscita sem ampliação

---

## Phase 5: User Story 3 - Falha nunca bloqueia nem apaga (Priority: P1)

**Goal**: Provar best-effort na escrita e imunidade da leitura (maioria já coberta em T003–T006; aqui fecha a garantia)

**Independent Test**: `quickstart.md` §4 (host bloqueado → save com warning → desbloquear → re-save semeia) e §5 (leitura normal com fonte fora + zero chamadas no Network)

- [X] T007 [US3] Revisar caminhos de falha em `src/lib/feriados-api.ts` + `src/lib/actions/calendarios.ts` (timeout 8s efetivo, HTTP≠2xx, JSON inválido, ano sem feriados → `inseridos: 0` sem `erro`), auditar por `rg 'brasilapi' src/` que nenhum caminho de leitura (`getEventos`, grid, KPIs, Boletim, Rendimento, documentos) toca a fonte, e executar `quickstart.md` §4–§5

**Checkpoint**: US1 + US2 + US3 funcionam; garantia "dado gravado independe da API" verificada

---

## Phase 6: User Story 4 - Backfill de legados (Priority: P2, descopável)

**Goal**: Script one-off idempotente para calendários pré-feature

**Independent Test**: `quickstart.md` §6 (`--dry-run` não escreve; 2ª execução insere 0)

- [X] T008 [P] [US4] Criar `scripts/seed-feriados-existentes.mjs` (Node + `fetch` nativo + `pg` já instalada; lista calendários sem eventos do prefixo, aplica pipeline com dedupe R4, grava auditoria identificada, flag `--dry-run`, log por calendário; fora do bundle Next)
- [X] T009 [US4] Validar `scripts/seed-feriados-existentes.mjs` contra base de homologação (`--dry-run`, execução real, 2ª execução com 0 inseridos) e conferir manuais preservados via `quickstart.md` §6

**Checkpoint**: Todas as stories funcionalmente completas (US4 pula se descopada)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Gates finais e registro no sumário do projeto

- [X] T010 Gates técnicos: `npx tsc --noEmit` limpo + `npx next build` verde + `rg 'Feriado Nacional –' src/lib/` com prefixo byte-idêntico em `src/lib/feriados-api.ts` e `src/lib/actions/calendarios.ts`
- [X] T011 [P] Executar `quickstart.md` §1–§7 completo e conferir auditoria em `/auditoria` (criações como `Estrutura Acadêmica — Calendários / criar / academico_calendario_eventos`)
- [X] T012 [P] Registrar a feature no `AGENTS.md` (bullet no Project Summary, padrão das features anteriores: fluxo, BrasilAPI, 0 migrations/deps, builds verdes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — começa imediatamente
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories
- **User Stories**: dependem da Foundational
  - US1 → US2 → US3 (mesmos arquivos: `calendarios.ts`, `TabCalendarios.tsx` — sequencial)
  - US4 (script isolado) pode rodar em paralelo após a Foundational
- **Polish**: depende das stories desejadas (pula US4 se descopada)

### User Story Dependencies

- **US1 (P1)**: após Foundational; sem dependência de outra story — **MVP**
- **US2 (P1)**: após US1 (estende `updateCalendario` + toast de update)
- **US3 (P1)**: após US1 (fecha garantias sobre a base de T003–T006)
- **US4 (P2)**: após Foundational; paralelizável com US1–US3 (arquivo isolado)

### Parallel Opportunities

- T008 (script) em paralelo com T003–T007 (arquivos distintos)
- T011 e T012 em paralelo (validação vs. documentação)
- T001 é pré-requisito lógico de T002 (shape da fonte), mas leva segundos

---

## Parallel Example: Foundational + US4

```powershell
# Após T001–T002 prontos, em paralelo:
# Frente A (MVP): T003 → T004 → T005 → T006 → T007
# Frente B (P2):  T008 → T009
```

---

## Implementation Strategy

### MVP First (User Stories 1–3)

1. Complete Phase 1 (T001) + Phase 2 (T002)
2. Complete US1 (T003–T004) → **STOP e VALIDATE** (`quickstart.md` §1–§2) → demo ok
3. Complete US2 (T005–T006) → validate §3
4. Complete US3 (T007) → validate §4–§5
5. Polish (T010–T012)

### Incremental Delivery

1. Setup + Foundational → base pronta
2. + US1 → MVP demonstrável (calendário nasce com feriados)
3. + US2 → edições inteligentes (sem ressuscitar, com retry)
4. + US3 → garantias anti-falha verificadas
5. (+ US4 se escopada → legados preenchidos)

---

## Notes

- [P] = arquivos diferentes, sem dependência; [USn] = rastreabilidade à spec
- Cada story é independentemente testável via seu § do `quickstart.md`
- Sem test-tasks (repo sem framework; gates = tsc + build + quickstart)
- Commit após cada task ou grupo lógico
- `<!-- SPECKIT END -->` do `AGENTS.md` já aponta para `specs/042-feriados-nacionais/plan.md`
