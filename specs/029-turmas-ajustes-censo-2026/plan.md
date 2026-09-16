# Implementation Plan: Turmas — Ajustes e Alinhamento Censo 2026

**Branch**: `main` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/029-turmas-ajustes-censo-2026/spec.md`

## Summary

Ajustes na Tela de Turmas + alinhamento ao Censo 2026 usando as planilhas oficiais (`Tabela de Etapas 2026.xlsx`, abas `Etapas de ensino` e `Tipo de turma X Etapa`; `Tabela de Tipo de Atividade Complementar 2026.xlsx`). Núcleo: catálogos versionados em `src/data/censo/`, matriz Tipo × Etapa aplicada no modal, card condicional de Atividades Complementares (colunas `atividade_complementar_1..6` + export no Registro 20), vínculo profissional com `atividades_ids` + inativação histórica, remoção total de `modalidade` (banco, UI, dashboard), reagrupamento da tela de Etapas. 3 migrations DDL + 0 tabelas novas + 0 deps.

## Technical Context

**Language/Version**: TypeScript 5 + Next.js App Router (modal em client component + Server Actions)

**Primary Dependencies**: shadcn/ui (Dialog, Select+SelectGroup, Popover, Calendar, AlertDialog via ConfirmDialog), `PillToggleGroup`, `ConfirmDialog`, Supabase via `getSupabaseAdmin()`, `date-fns` + `ptBR`

**Storage**: PostgreSQL — 3 migrations: `patch_turmas_atividades_complementares.sql` (6 colunas), `patch_turmas_profissionais_atividades.sql` (`atividades_ids`), `patch_turmas_remove_modalidade.sql` (`DROP COLUMN`)

**Testing**: `npx tsc --noEmit` + `npx next build` + roteiro `quickstart.md` (repo sem framework de testes; build verde é o gate) + `grep` de varredura (`modalidade`, `confirm(`)

**Target Platform**: Web responsiva (pills/cards empilham em `<md`; tabelas com `overflow-x-auto`)

**Project Type**: Web application (Next.js, feature-based)

**Performance Goals**: Catálogos como constantes TS (zero query extra); Etapa/Disciplinas já carregadas via props/actions existentes; sem N+1 novo

**Constraints**: Server Actions com `'use server'` + `getSupabaseAdmin()`; `pessoaId` + auditoria em todas as escritas; permissão `gestao-turmas.turmas`; tokens Tailwind v4 (sem hex); dark-mode; Select com `SelectGroup/SelectLabel` para Área/Subárea

**Scale/Scope**: 1 tela de listagem + 1 modal (2 sub-modais) + 1 aba de Etapas + export/validação Registro 20/50; ~150 itens no catálogo de atividades

## Constitution & Product Experience Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitution

- **I. Server Actions First** — escritas em `turmas.ts` (`createTurma/updateTurma/add/updateProfissional`); validação server-side autoritativa da matriz Tipo × Etapa + limite 6/sem-duplicadas; sem API Routes. ✅
- **II. Security First** — `validarPermWrite('gestao-turmas.turmas', ...)` mantido em todas as mutações; `ConfirmDialog` destrutivo na exclusão de vínculo. ✅
- **III. Multi-Tenant** — `school_id` em turma/vínculo; etapas filtradas por escola+ano; sem vazamento. ✅
- **IV/V/VI. Tokens, Dark Mode, shadcn** — `PageSection flush` (sem `px-4`), `TableHead bg-muted text-foreground`, `DialogTitle font-display`, `PillToggleGroup`, `Calendar`, `SelectGroup`. ✅
- **VII. Migrations** — 3 patches `IF NOT EXISTS`/`DROP IF EXISTS`, padrão `patch_censo_turmas.sql`; aplicadas via SQL Editor. ✅
- **VIII. Auditability** — `registrarTurma` existente cobre turma/vínculo (incl. inativação como `editar` com diff). ✅
- **IX. Feature-Based** — tudo em `gestao-turmas/turmas/` + `lib/actions/turmas.ts` + `data/censo/`. ✅
- **X. No New Patterns** — Calendar segue `ocorrencia-form.tsx`; ConfirmDialog segue `turmas/page.tsx`; "Selecionar Todas" segue `comunicado-form.tsx:163`. ✅
- **XI. Design System First** — sem componentes locais novos (toggle = `Button`/`PillToggleGroup` + estado). ✅

### Product Experience

- **PE-101/102** → filtros rotulados, header full-width contrastado, títulos de modal hierarquizados.
- **PE-201/204** → ordem Registro 20 no modal; cards condicionais (Atividades só p/ tipo 4/9; Disciplinas só curricular não-infantil; Eixo só etapas do catálogo).
- **PE-205** → "Selecionar Todas", select+Adicionar, bloqueio imediato de combinação inválida com `toast.error` objetivo.

## Project Structure

### Documentation (this feature)

```text
specs/029-turmas-ajustes-censo-2026/
├── plan.md              # This file
├── data-model.md        # DDL + catálogos + matriz Tipo x Etapa
├── quickstart.md        # Roteiro de verificação manual
└── tasks.md             # Execução por user story
```

### Source Code (repository root)

```text
src/
├── app/(app)/gestao-turmas/turmas/
│   ├── page.tsx                 # MOD: filtros "Tipo", tabela full-width, DialogTitle
│   └── TurmaForm.tsx            # MOD: todos os cards + modal profissional + atividades
├── app/(app)/gestao-academica/estrutura-academica/
│   └── TabEtapas.tsx            # MOD: 7 grupos oficiais
├── app/(app)/(auth)/page.tsx    # MOD: remover AlunosPorModalidadeChart
├── components/dashboard/
│   └── alunos-por-modalidade-chart.tsx  # DELETE
├── data/censo/
│   ├── etapas-ensino.ts         # MOD: 69/70, 64→308, nomes oficiais (+30–34 se confirmado)
│   ├── tipo-turma-mediacao.ts   # MOD: +EAD/305, tipo 9 sem 56/305
│   ├── tipo-turma-codigos.ts    # NEW: rótulo→código (tipo + forma organização)
│   └── atividades-complementares.ts  # NEW: ~150 itens {codigo,nome,area,subarea}
├── lib/actions/
│   ├── turmas.ts                # MOD: tipos, payload atividades, sem modalidade, matriz server-side
│   ├── censo.ts                 # MOD: buildRegistro20 emite atividade_complementar_1..6 via mapa
│   ├── censo-regras.ts          # MOD: Etapa×Tipo usa matriz oficial; vínculo complementar via atividades_ids
│   └── dashboard.ts             # MOD: remover alunosPorModalidade
supabase-migrations/
├── patch_turmas_atividades_complementares.sql  # NEW
├── patch_turmas_profissionais_atividades.sql   # NEW
└── patch_turmas_remove_modalidade.sql          # NEW
```

## Phases

### Phase 0 — Catálogos oficiais (bloqueia US1/US2/US4)

Extrair das planilhas (lidas em 2026-09-15 via `Tabelas Auxiliares`): corrigir `etapas-ensino.ts` (69=iniciais, 70=finais, 64→308, nomes oficiais); completar `tipo-turma-mediacao.ts` (+EAD/305, tipo 9 = 302[14–41]+303[22,23]+304[25–29], 305-tipo-9 vazio); criar `tipo-turma-codigos.ts` (4↔Atividade Complementar, 5↔AEE, 6↔Curricular, 9↔Curricular com Atividade Complementar; forma organização rótulo→código Anexo 6); criar `atividades-complementares.ts` (~150 itens, pulando nomes vazios 15002/15003/19101/19104/19105/22032, carry-forward de Área/Subárea mescladas). Verificar "Escolarização" e códigos 30–34 (Edge Cases da spec).

### Phase 1 — Banco (3 migrations, via SQL Editor)

M-01 `turmas.atividade_complementar_1..6 VARCHAR(3)`; M-02 `turmas_profissionais.atividades_ids TEXT[] DEFAULT '{}'`; M-03 `DROP COLUMN turmas.modalidade` (após UI sem referências; conferir dashboard). Auditoria: nenhuma mudança (trilha existente).

### Phase 2 — Modal Turma (US1+US2, núcleo)

`TurmaForm.tsx`: label "Turma de:" + rename Educação Especial; Multietapa `items-end`; Etapa Agregada condicional (disabled+null fora de 6/9; opções = agregadas das etapas ativas); matriz Tipo × Etapa no `handleSave` + filtragem de selects; Formas/Disciplinas 4 cols + "Selecionar Todas"; card Atividades Complementares (select agrupado + Adicionar, 6, dedupe); payload com `atividade_complementar_1..6` em ordem; remover Modalidade (campo, validação, gate). `turmas.ts`: tipos atualizados, validação server-side espelho, `registrarTurma` mantido.

### Phase 3 — Profissional + listagem (US3 + FR-001/002/003)

Modal profissional: Calendar padrão (início + término), "Selecionar Todas", swap Disciplinas→Atividades em turma complementar (`atividades_ids`), ação Inativar (pede data → `ativo=false`+`data_encerramento`) + lixeira via `ConfirmDialog` (remove `confirm()`). `page.tsx`: grupo "Tipo", tabela sem `px-4` + header `bg-muted text-foreground`, `DialogTitle` hierarquizado. Dashboard: remover gráfico de modalidade + `alunosPorModalidade`.

### Phase 4 — Etapas + motor Censo (US4 + FR-017/019)

`TabEtapas.tsx`: 7 grupos oficiais (nomes/códigos da planilha). `censo.ts`: `buildRegistro20` emite `atividade_complementar_1..6` nas posições após `tipos_turma` (via mapa rótulo→código p/ `tipos_turma` e `forma_organizacao`). `censo-regras.ts`: Registro 20 usa matriz oficial (incl. EAD+305, tipo 9 restrito, 305-tipo-9 bloqueado); Registro 50 aceita `atividades_ids` em turma complementar. Gates: `tsc`, `build`, `grep modalidade` + `grep confirm(` limpos no módulo, `quickstart.md` executado.

## Complexity Tracking

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Catálogo de atividades como constante TS versionada | Tabela no banco + seed SQL | Portaria muda 1×/ano; diff em código é auditável e sem query extra; migração p/ banco fica p/ futuro se preciso |
| Derivação rótulo→código sem migração de dados | Reescrever `tipos_turma`/`forma_organizacao` legados | Evita migração de dados em produção; conversão centralizada no mapa canônico |
| Exclusão total da modalidade (banco+UI+dashboard) | Manter coluna oculta / agregar por etapa | Coluna morta convida divergência; modalidade não é campo do Registro 20; gráfico sem fonte vira lixo |
| Inativar = `ativo=false` + data (sem delete) | Delete + tabela de histórico | Schema já tem os campos; trilha de auditoria + FKs preservados; reativação trivial |
