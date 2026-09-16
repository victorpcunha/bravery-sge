# Implementation Plan: Quadro de Aulas — Ajustes + Aulas Extras

**Branch**: `main` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-quadro-aulas-ajustes/spec.md`

## Summary

Ajustes de UI/contraste na listagem e edição do Quadro de Aulas + correção do status (passa a calculado, corrigindo o caso 09/02/2026–11/12/2026) + regra de conflito por sobreposição de vigência + card "Aulas Extras" (dias `dia_letivo` do Calendário da Etapa) com integração ao Diário. 1 migration DDL (2 tabelas novas) + 0 tabelas alteradas + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (listagem e cadastro em client components + Server Actions)

**Primary Dependencies**: shadcn/ui (Table, Select, Dialog via ConfirmDialog, Button), `PageContainer/Header/Section`, `FormCard`, `StatusBadge`, `EmptyState`, `DatePicker` (`components/ui/date-picker.tsx`), Supabase via `getSupabaseAdmin()`, `lucide-react` (Pencil, Trash2, Plus, ChevronLeft, AlertCircle, Calendar, Clock, Save)

**Storage**: PostgreSQL — 1 migration: `patch_quadro_aulas_extras.sql` (`quadro_aulas_datas_extras` + `quadro_aulas_extras_horarios`); coluna `quadro_aulas.status` vira legado (sem alteração)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate) + casos de reprodução do bug de status e do conflito sequencial

**Target Platform**: Web responsiva (grade com `overflow-x-auto`; Identificação `grid-cols-1 md:grid-cols-2 lg:grid-cols-5`)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Status calculado O(1) por linha (string compare, sem query); conflito com 1 join a mais (vigência) sem N+1 — buscar vigências em batch; extras derivadas do calendário já carregado; Diário une regulares + extras em memória

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; `pessoaId` + auditoria em todas as escritas; permissão `gestao-turmas.quadro-aulas` (escrita) e `gestao-pedagogica.diario-classe*` (leitura no Diário); tokens Tailwind v4 (sem hex); dark-mode; comparação de datas por string `YYYY-MM-DD`

**Scale/Scope**: 2 telas (`quadro-aulas/page.tsx`, `quadro-aulas/cadastro/page.tsx`) + 3 actions (`quadro-aulas.ts`, `diario-classe.ts`, `diario-planos.ts`) + 1 migration; blocos extras por turma limitados aos eventos do ano (≈ dezenas)

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — escritas em `quadro-aulas.ts` (`create/update/deleteQuadroAula`, extras); validação server-side de sobreposição + conflito; sem API Routes. ✅
- **II. Security First** — `validarPermWrite('gestao-turmas.quadro-aulas', ...)` mantido em todas as mutações (incl. extras); `ConfirmDialog` destrutivo na exclusão. ✅
- **III. Multi-Tenant** — `school_id` no quadro; extras herdam via `quadro_aula_id`; calendário resolvido pelo `ano_letivo_id` da turma. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `PageSection flush` sem `px-4`, `TableHead bg-muted text-foreground`, `DatePicker`, `Pencil/Trash2` padrão. ✅
- **VII. Migrations** — 1 patch `IF NOT EXISTS` + `CASCADE`, padrão `quadro_aulas.sql`; aplicada via SQL Editor. ✅
- **VIII. Auditability** — `registrarQuadro` existente cobre quadro (extras como `editar` com diff ou entidade própria — decidir na execução, proposta: mesma entidade `quadro_aulas` como `editar`). ✅
- **IX. Feature-Based** — tudo em `gestao-turmas/quadro-aulas/` + `lib/actions/quadro-aulas.ts` (+ extensão pontual em `diario-*.ts`). ✅
- **X. No New Patterns** — DatePicker segue `TurmaForm`/comunicados; ConfirmDialog segue `quadro-aulas/page.tsx:247`; extras espelham `quadro_aulas_horarios`. ✅
- **XI. Design System First** — sem componentes locais novos (subcard = `div rounded-lg border`; bloco de data = `Card`/`FormCard` existente). ✅

### Product Experience

- **PE-101/102** → tabela full-width contrastada, status confiável, grade com dias destacados e mensagens legíveis.
- **PE-201/204** → Identificação unificada em 5 colunas; extras só quando o calendário tem dias extras.
- **PE-205** → conflito por sobreposição elimina bloqueio indevido; feedback imediato inline + toast.

## Project Structure

### Documentation (this feature)

```text
specs/030-quadro-aulas-ajustes/
├── plan.md              # This file
├── data-model.md        # DDL + derivação calendário + fluxos Diário
├── quickstart.md        # Roteiro de verificação manual
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-turmas/quadro-aulas/
│   ├── page.tsx                 # MOD: full-width, TableHead contraste, Pencil, status calculado
│   └── cadastro/page.tsx        # MOD: Excluir+Voltar, sem Grupos, DatePicker, 5 cols,
│                                #       subcard Intervalos, grade contraste/separação,
│                                #       conflito HH:MM+wrap, card Aulas Extras
├── lib/
│   ├── quadro-status.ts         # NEW (proposta): resolverStatusQuadro(q, hojeRef?)
│   └── actions/
│       ├── quadro-aulas.ts      # MOD: helper status, validarConflitosProfessor c/ vigência,
│       │                        #       CRUD extras (get/save/delete), getDiasExtrasDoCalendario
│       ├── diario-classe.ts     # MOD: getAulasDaTurma une regulares + extras
│       └── diario-planos.ts     # MOD: listarDiasComAula une regulares + extras
supabase-migrations/
└── patch_quadro_aulas_extras.sql  # NEW
```

## Phases

### Phase 0 — Status calculado + fundação (desbloqueia US1)

Criar `resolverStatusQuadro(q)` (string compare `YYYY-MM-DD`, `inativo` preservado, fallback Futuro sem datas); trocar `page.tsx:202` para o calculado; remover `div.px-4 (:188)`; `TableHead bg-muted text-foreground font-semibold uppercase`; `Eye→Pencil`. Reproduzir o caso 09/02/2026–11/12/2026 com `hojeRef='2026-08-30'` em teste manual (função pura permite injetar a data).

### Phase 1 — Edição padrão (US2)

`cadastro/page.tsx`: header com Excluir (ConfirmDialog + `deleteQuadroAula` + redirect); remover Labels Grupo 1/2/3 e divisor; `Input type=date → DatePicker min/max`; grid `lg:grid-cols-5` com Tempo de Aula dentro; subcard Intervalos com botão acima do vazio; grade com `TableHead` contrastado + `border-l` nas células + conflito `.slice(0,5)` + `break-words max-w`.

### Phase 2 — Conflito por sobreposição (US3)

`validarConflitosProfessor(..., vigencia?)`: select inclui `quadro(data_inicial,data_final,status,ativo)`; pula `!ativo`, `inativo`, `ignoreQuadroId` e sem sobreposição (`novaFim < existenteInicio || novaInicio > existenteFim`); `checkConflito` passa `{inicio: dataInicial, fim: dataFinal}`. Teste: sequencial salva, sobreposto bloqueia.

### Phase 3 — Aulas Extras (US4, núcleo)

Migration (2 tabelas, §1 de `data-model.md`); `getDiasExtrasDoCalendario(turmaId)` (turma→etapa→calendários do ano→eventos `dia_letivo` filtrados por etapa, fora seg–sex — decidir inclusão de dia de semana na execução); CRUD extras (`getExtrasDoQuadro`, `saveExtrasDoQuadro` no padrão soft-inativa+reinsere, `removerDataExtra` com checagem de frequência); UI do card (bloco por data, Adicionar Aula inline, lixeira por aula, intervalos por data); sincronização (derivar em tempo real; ConfirmDialog sem frequência; bloqueio com frequência).

### Phase 4 — Diário + gates (US4 fim)

`getAulasDaTurma` e `listarDiasComAula`: unir extras (`data_extra.data_aula` no mês + disciplina filtrada) como `AulaQuadro[]` (`extra:true`, `numero_aula` sequencial ou null — decidir na execução); `registrarFrequenciaAula/Lote` sem mudança (validar UNIQUE). Gates: `tsc`, `build`, `quickstart.md` completo, `grep` de `type="date"` e `Eye` limpos no módulo.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Status calculado na leitura, coluna como legado | Trigger/cron persistindo status | Sem migration, sem backfill, corrige o bug imediatamente; função pura testável com data injetada |
| Nova tabela dedicada p/ extras | Coluna `data_especifica` em `quadro_aulas_horarios` | Separa recorrência semanal de datas pontuais; índices de conflito distintos; `CASCADE` limpo (decisão do solicitante) |
| Conflito por sobreposição de vigências | Só quadros vigentes hoje | Cobre edição de quadros futuros e sequenciais sem bloquear operação normal (decisão do solicitante) |
| Dias extras derivados em tempo real (vazios não persistem) | Persistir blocos vazios ao abrir | Evita lixo no banco; nova data do calendário aparece sozinha |
| Comparação de datas por string | `new Date()` | Evita shift UTC (a suspeita original do bug); padrão já usado em calendário/boletim |
