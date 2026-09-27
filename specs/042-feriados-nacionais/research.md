# Research: Feriados Nacionais Automáticos no Calendário

**Feature**: `042-feriados-nacionais` · **Date**: 2026-09-27

## R1 — Fonte de feriados nacionais

- **Decision**: BrasilAPI, `GET https://brasilapi.com.br/api/feriados/v1/{ano}`.
- **Rationale**: Gratuita, sem chave/cadastro, sem CORS restritivo; retorna fixos + móveis calculados (Carnaval, Paixão, Páscoa, Corpus Christi) no shape `[{ "date": "2026-01-01", "name": "Confraternização Universal", "type": "national" }]`; cobre o requisito "por ano" diretamente (um fetch por ano civil do intervalo, normalmente 1).
- **Alternatives considered**:
  - Nager.Date (`/api/v4/Holidays/BR/{ano}`) — nomes em inglês, granularidade fraca para BR; descartada.
  - FeriadosAPI / feriados.dev — exigem API key (planos pagos para uso relevante); descartadas pelo custo/burocracia.
  - Tabela local fixa (fixos + algoritmo Computus) — descartada por decisão do solicitante (sistema online-only; lei pode mudar e a fonte oficial resolve isso).

## R2 — Onde buscar: server-side na action, nunca no client

- **Decision**: `fetch` executado dentro de `createCalendario`/`updateCalendario` (`src/lib/actions/calendarios.ts`, server), com `AbortSignal.timeout(8000)`; helpers puros + fetch isolado em módulo neutro `src/lib/feriados-api.ts` (sem `'use server'`, precedente: `src/lib/calendario-utils.ts`, `src/lib/importacao-validacao.ts`).
- **Rationale**: Constituição I (Server Actions First) — chave/dependência externa nunca exposta ao browser (aqui nem há chave, mas o padrão mantém timeout/erro sob controle do servidor); módulo neutro mantém helpers testáveis e respeita a restrição do Turbopack (`'use server'` exporta só async).
- **Alternatives considered**: fetch no client (`TabCalendarios`) — descartado (fogem do padrão do repo; erro de rede viraria estado de UI em vez de resultado da action).

## R3 — Tipo do evento e identificação dos automáticos

- **Decision**: `tipo='recesso'`, `descricao='Feriado Nacional – {nome}'` (en-dash), dia único, `etapas=[]`, `recorrencia_tipo='nao_repete'`.
- **Rationale**: Decisão do solicitante (`recesso`); `recesso` já é vermelho no grid, excluído da contagem de dias letivos (`getDiasLetivosPorMes`, `contarDiasLetivosNoIntervalo`) e listado no modal do dia (`getEventosDoDia` filtra só `nao_letivo` para fora — `recesso` aparece sem correção extra). O prefixo da descrição funciona como marcador de semeadura para a regra de retry (FR-005) sem DDL.
- **Alternatives considered**: `tipo='nao_letivo'` — descartado (exigiria corrigir `getEventosDoDia` que hoje oculta `nao_letivo` no modal do dia); coluna dedicada `origem` — descartada (migration desnecessária; prefixo resolve).

## R4 — Dedupe por sobreposição, não por descrição

- **Decision**: Pular a data se existir evento sobreposto com `tipo IN ('recesso','nao_letivo','dia_letivo')`; sobreposição só com `periodo_avaliativo` não bloqueia.
- **Rationale**: Protege eventos manuais com descrição diferente (ex.: usuário cadastrou "Feriado municipal" no mesmo dia de um estadual que coincide com nacional) e evita duplicatas em re-saves; `periodo_avaliativo` é intervalo avaliativo, não marca dia livre (não altera `isLetivo`), então o feriado deve existir junto.
- **Alternatives considered**: dedupe por igualdade de descrição+data — descartado (frágil contra manuais e renomeações).

## R5 — Falha best-effort com retorno estruturado

- **Decision**: `createCalendario`/`updateCalendario` passam a retornar `{ calendario, feriados: { inseridos: number, ignorados: number, erro?: string } }`; em falha, o calendário persiste e `erro` carrega mensagem curta para `toast.warning`. Único consumidor é `TabCalendarios.tsx` (verificado por grep — sem outros callers).
- **Rationale**: Garante US3 (falha nunca bloqueia) sem try/catch espalhado na UI; mudança de retorno segura por haver um só consumidor.
- **Alternatives considered**: lançar exceção na falha — descartado (bloquearia o save, violando US3); toast genérico sem contagem — descartado (PE-403 pede feedback informativo com quantidade).

## R6 — Backfill de legados (US4, P2)

- **Decision**: Script one-off `scripts/seed-feriados-existentes.mjs` (Node puro + `fetch` nativo + `pg`, ambas já disponíveis — `pg` é dependência do repo), executado via `node scripts/seed-feriados-existentes.mjs` com `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` do ambiente; mesma regra de dedupe R4; idempotente; fora do bundle Next.
- **Rationale**: `.mjs` roda sem transpiler (repo não tem tsx/vitest); `pg` já instalado; script descartável não polui `src/`.
- **Alternatives considered**: action admin invocável pela UI — descartada (criaria superfície/permiso nova para uso único); seed preguiçoso ao abrir a Visualização — descartado (ressuscitaria feriados excluídos manualmente, violando US2).
