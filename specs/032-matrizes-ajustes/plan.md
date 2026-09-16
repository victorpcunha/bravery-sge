# Implementation Plan: Estrutura Acadêmica — Matrizes: Ajustes

**Branch**: `main` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/032-matrizes-ajustes/spec.md`

## Summary

Sete user stories na aba Matrizes: (US1) filtros em card padrão + Etapa com `SelectGroup`; (US2) subcards ricos com expansão corrigida e sem toggle; (US3) cadastro/edição migra de `Dialog` para rotas empilhadas `matrizes/novo` + `matrizes/[id]` com fluxo sem reabrir; (US4) Períodos com Adicionar no topo + replicação renomeada; (US5) modal de disciplina com filtro de ativas, Tipo travado, 2 pills e BNCC expansível; (US6) pills valendo nos cálculos de situação (Diário/Fechamento/Conselho/Boletim/Rendimento); (US7) bug de persistência corrigido na leitura. 1 migration (pills) + leituras estendidas + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (client components + Server Actions)

**Primary Dependencies**: shadcn/ui (Dialog, Button, Select + `SelectGroup/SelectLabel`, Switch, Checkbox, Collapsible/Accordion, `ConfirmDialog`, `EmptyState`, `StatusBadge`, `StatCard` se necessário), `PageSection/PageContainer/FilterBar`, `PillToggleGroup` + `ClickablePill` (`components/ui/`), `DatePickerDual`, `tab-routes.tsx` (rotas empilhadas, padrão spec 016), Supabase via `getSupabaseAdmin()`, `lucide-react` (GraduationCap, Pencil, Trash2, Plus, ChevronDown/Right)

**Storage**: PostgreSQL — 1 migration `patch_matriz_nao_reprova_pills.sql` (2 `BOOLEAN` + backfill; aplicar via SQL Editor)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate) + QA manual do fluxo completo criação→replicação→Diário

**Target Platform**: Web responsiva (página de matriz com grids `md:grid-cols-3`; modal `max-w-3xl` com scroll interno; pills com wrap)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Fim do N+1 sequencial nas expansões (`Promise.all`); `getDisciplinasPorPeriodo` com 2 joins a mais (linhas por período são dezenas); BNCC continua lazy por abertura do modal; sem query nova na listagem além do batch de contagem

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; `pessoaId` + auditoria best-effort nas escritas; permissão `gestao-academica.estrutura-academica.matrizes` inalterada; tokens Tailwind v4 (sem hex); dark-mode; regra única de médias em `rendimento-calculo.ts` (sem duplicar lógica no Diário)

**Scale/Scope**: ~6 arquivos-fonte (`TabMatrizes.tsx`, `MatrizForm.tsx` extraído, 2 rotas novas, `tab-routes.tsx`, `matrizes.ts`, consumidores de situação) + 1 migration; matrizes por escola+ano na casa das dezenas

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — escritas só via actions existentes estendidas (`matrizes.ts`); leitura de habilidades passa a vir no `getDisciplinasPorPeriodo` (sem client-Supabase). ✅
- **II. Security First** — guards `pode.visualizar(...matrizes)` mantidos na lista e na página; trava de ano encerrado replicada na página; `ConfirmDialog` em excluir/replicar. ✅
- **III. Multi-Tenant** — tudo escopado por `effectiveSchoolId`; select de disciplinas filtra `school_id`; superadmin sem escola não abre a página. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `SelectGroup/Label`, `ClickablePill`, `Button variant="destructive"` no Limpar, checkbox com `border-primary/40`; sem hex, sem `<button>` nativo (só via componentes). ✅
- **VII. Migrations** — 1, aditiva + backfill (`nao_reprova_*`), legada preservada; aplicar via SQL Editor e registrar no quickstart. ✅
- **VIII. Auditability** — `registrar()` existente já difunde payloads (pills entram no diff); replicação mantém auditoria agregada. ✅
- **IX. Feature-Based** — rotas sob `gestao-academica/estrutura-academica/matrizes/`; `MatrizForm` extraído para `src/components/matrizes/` ou colocalizado (decidir na execução, sem espalhar). ✅
- **X. No New Patterns** — rotas empilhadas seguem `tab-routes.tsx` (spec 016); pills seguem `comunicado-form.tsx`; página de cadastro segue `plano-ensino/criar`. ✅
- **XI. Design System First** — nenhum componente novo (Collapsible/Accordion e pills já existem no repo). ✅

### Product Experience

- **PE-101/102** → filtros em card, subcards ricos, expansão sem vazamento.
- **PE-201** → Identificação → Carga → Períodos na mesma página, sem reabrir.
- **PE-204** → Períodos após existir matriz; ativas filtradas; BNCC recolhida.
- **PE-205** → `toast.error` objetivos antes de escrever; replicação com confirmação explícita.

## Project Structure

### Documentation (this feature)

```text
specs/032-matrizes-ajustes/
├── plan.md              # This file
├── data-model.md        # DDL das pills + backfill + semântica de leitura/compatibilidade
├── quickstart.md        # Roteiro de verificação manual
├── spec.md              # Feature specification
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-academica/estrutura-academica/
│   ├── TabMatrizes.tsx            # MOD: filtros em card (FR-001/002), subcards ricos (FR-003/004),
│   │                              #       sem Switch/código morto (FR-005), navega p/ rotas (FR-006)
│   ├── MatrizForm.tsx             # MOD→MOVE: extrair conteúdo p/ página (FR-007/008), Períodos (FR-009/010/011),
│   │                              #       modal disciplina (FR-012/013/014), display cargas + leitura (FR-015)
│   └── matrizes/
│       ├── novo/page.tsx          # NEW: criação empilhada na aba (FR-006/008)
│       └── [id]/page.tsx          # NEW: edição empilhada na aba (FR-006/007)
├── lib/
│   ├── tab-routes.tsx             # MOD: registra matrizes/novo + matrizes/[id] no módulo estrutura-academica
│   ├── actions/matrizes.ts        # MOD: getDisciplinasPorPeriodo c/ habilidades, filtro ativas,
│   │                              #       substituirHabilidades sem insert vazio, replicar c/ pills (FR-011/012/013/015)
│   ├── actions/rendimento-calculo.ts # MOD: bypass nao_reprova_nota (origem única) (FR-016)
│   └── actions/{diario-classe,fechamento-turma,conselho-classe,boletim,rendimento}.ts
│                                  # MOD: bypass nota/frequência por disciplina (FR-016)
supabase-migrations/
└── patch_matriz_nao_reprova_pills.sql  # NEW: 2 BOOLEAN + backfill (FR-013/017)
```

## Phases

### Phase 0 — Verificação pré-código (sem dependências, antes de tudo)

Confirmar contra o Método vinculado: quantidades `quantidade_periodos_*` × regra atual `tipo_turma→4/2` do `createPeriodos` (FR-009); mapear todos os pontos que computam média/frequência por disciplina para o bypass (FR-016); decidir destino da extração do `MatrizForm` (colocalizado vs `src/components/matrizes/`).

### Phase 1 — Base de dados + leitura (US7 + fundação US5 — sem dependências de UI)

Migration das pills + backfill; `getDisciplinasPorPeriodo` com joins de habilidades; `substituirHabilidades` sem `insert([])`; display de cargas no campo real. Resultado: edição passa a reabrir preenchida (US7 testável isolado).

### Phase 2 — Listagem (US1 + US2 — paralelizável com Phase 3, arquivos distintos)

Filtros em `PageSection+FilterBar` com `SelectGroup/Label`; subcards ricos; expansão filtrada por matriz com `Promise.all`; remove Switch + código morto; botões navegam para as novas rotas.

### Phase 3 — Página de matriz (US3 + US4 — depende das rotas existirem; paralelizável com Phase 2)

Rotas `novo/[id]` + registro em `tab-routes.tsx`; extração do form; layout em 3 linhas; fluxo criar-e-continuar; Períodos com Adicionar no topo + replicação renomeada com confirmação detalhada.

### Phase 4 — Modal de disciplina (US5 — depende da Phase 1; paralelizável com Phase 2/3 no markup)

Filtro de ativas, Tipo travado, 2 pills, BNCC expansível recolhida, checkbox visível, Limpar vermelho, Adicionar no rodapé.

### Phase 5 — Regras de situação (US6 — depende da Phase 1; maior risco, commit isolado)

Bypass `nao_reprova_nota/frequencia` nos 5 consumidores via origens únicas; backfill garante legado; QA dedicado (quickstart §6) antes de juntar.

### Phase 6 — Gates

`tsc`, `build`, `quickstart.md` completo (§1→§7), `grep` de hex/`input number` em filtro limpos, migration aplicada no ambiente.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Manter `desconsidera_reprovacao` com escrita espelhada (`OR` das pills) | Remover a coluna | 6+ consumidores indiretos referenciam a tabela; remoção exigiria varredura total; espelho preserva compatibilidade |
| Rotas empilhadas na aba (spec 016) | Página fora das abas | Decisão do solicitante + preserva keep-alive da listagem (filtros/scroll/paginação ao voltar) |
| Bypass na origem única (`rendimento-calculo.ts` + helpers de frequência) | Condicional em cada consumidor | Evita regra paralela Diário × Rendimento (histórico de divergência, ex. FJ e horários duplicados) |
| `tipo_ensino` como proxy de "ano letivo" no filtro | Nova coluna `ano_letivo_id` em disciplinas | Decisão do solicitante; a tabela não tem a coluna e criá-la mudaria o modelo do catálogo |
| Verificar quantidades do Método antes de codar (FR-009) | Assumir `tipo_turma→4/2` | O agrupamento é declarado "por Método" mas a criação usa `tipo_turma` — divergência aberta que precisa de fonte canônica |
