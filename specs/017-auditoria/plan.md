# Implementation Plan: Auditoria — Captura automática + Tela de Consulta

**Branch**: `017-auditoria` | **Data**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

## Summary

Criar auditoria geral do sistema: captura automática de toda criação/edição/exclusão
(master-data completa com diffs; alto volume agregada por salvamento) e tela de consulta
exclusiva Superadmin em `/auditoria`, com filtros combináveis (busca livre destacada,
escola, usuário, módulo, tipo de ação, datas) e detalhes em linha expansível.

## Technical Context

- **Language**: TypeScript, React, Next.js (App Router)
- **Storage**: Supabase (`getSupabaseAdmin`). **1 migration** (`auditoria.sql`).
- **Testing**: `npx tsc --noEmit` + `npx next build` + validação manual.
- **Constraints**: 0 novas deps npm; tokens do Design System; shadcn/ui; server actions.

## Project Structure

```
supabase-migrations/auditoria.sql         # NOVO — tabela + índices + backfill perfis_auditoria
src/lib/auditoria.ts                      # NOVO — framework (registrar / agregada / diff / nomear)
src/lib/calendario-utils.ts               # NOVO — utilidades puras de calendário
src/lib/actions/
  auditoria.ts                            # NOVO — listar/filtros/módulos/profissionais/validarSuperAdmin
  calendarios.ts                          # REESCRITO — server action + auditoria
  matrizes.ts                             # REESCRITO — server action + auditoria
  disciplinas.ts                          # NOVO — server action CRUD + auditoria
  perfis.ts, people.ts, turmas.ts, schools.ts, matriculas.ts,
  quadro-aulas.ts, indicadores.ts, metodos.ts, funcoes-profissionais.ts,
  plano-ensino.ts, diario-planos.ts, vinculos-profissionais.ts,
  agenda.ts, etapas-ensino.ts, diario-classe.ts, avaliacoes-numericas.ts,
  avaliacoes-indicadores.ts, pareceres.ts, conselho-classe.ts,
  fechamento-turma.ts, historico-manual.ts # MODIFICADOS — auditoria + pessoaId
src/components/
  providers/auth-provider.tsx             # MODIFICADO — pessoaId no contexto
  layout/sidebar.tsx                      # MODIFICADO — item "Auditoria" (superadmin)
  auditoria/detalhes-auditoria.tsx        # NOVO — detalhes expansíveis
src/app/(app)/auditoria/page.tsx          # NOVO — tela de consulta
src/lib/tab-routes.tsx                    # MODIFICADO — módulo de aba 'auditoria'
specs/017-auditoria/                      # NOVOS — spec, plan, data-model, quickstart
```

## Task Breakdown

### Phase 0 — Fundação
- [x] Migration `auditoria.sql` (tabela, índices, trigram, backfill de `perfis_auditoria`)
- [x] Framework `src/lib/auditoria.ts` (`registrarAuditoria`, `registrarAuditoriaAgregada`,
      `computarAlteracoes`, `nomearRegistro`)
- [x] `pessoaId` no auth-provider (inclusive Superadmin) + `usePermissoes`

### Phase 1 — Repontar auditadores existentes
- [x] `perfis.ts`, `people.ts`, `fechamento-turma.ts` → framework novo
- [x] `desfazerFechamento` lê snapshot na tabela `auditoria`

### Phase 2 — Conversões client → server action
- [x] `calendarios.ts`, `matrizes.ts` (server action + auditoria); utils puros extraídos
- [x] `disciplinas.ts` (server action) + refactor de `disciplinas/page.tsx`

### Phase 3 — Instrumentação Master-Data
- [x] Usuários, Turmas, Escolas, Matrículas, Movimentações, Quadro de Aulas, Indicadores,
      Métodos, Funções, Plano de Ensino, Vínculos, Agenda, Etapas, Histórico Escolar

### Phase 4 — Instrumentação agregada (alto volume)
- [x] Frequência (dia/aula), número de chamada, Notas, Recuperação, Indicações, Parecer,
      Conselho, Fechamento

### Phase 5 — Tela de consulta
- [x] Server actions `auditoria.ts` (busca server-side + filtros + paginação)
- [x] Página `/auditoria` (filtros + tabela + linhas expansíveis + paginação)
- [x] Sidebar (top-level, superadmin) + módulo de aba

### Phase 6 — Docs e build
- [x] specs/017-auditoria (spec, plan, data-model, quickstart)
- [x] `npx tsc --noEmit` verde · `npx next build` verde (42 rotas, incl. `/auditoria`)