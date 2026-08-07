# Tasks — Plano de Ensino Modernização

> Executado em sessão única (2026-08-04). Todas as fases marcadas como concluídas após `npx next build` verde.

## Phase 0 — Docs
- [x] `specs/012-plano-ensino-modernizacao/spec.md`
- [x] `specs/012-plano-ensino-modernizacao/plan.md`
- [x] `specs/012-plano-ensino-modernizacao/tasks.md`

## Phase 1 — Server actions (`src/lib/actions/plano-ensino.ts`)
- [x] Helpers: `isoToDate`, `maxIso`, `minIso`, `minutosDoHorario`, `carregarQuadroDaTurma`, `contarAulasNoIntervalo`
- [x] `calcularAulasDoQuadro(turmaId, matrizIds[], inicio, fim, pessoaId?)` → `{ porDisciplina[], total_aulas, total_minutos }`
- [x] `listarPlanosEnsino` com `opts: { anoLetivoId?, turmaId?, matrizDisciplinaId?, periodos? }`
- [x] Enriquecimento em batch: disciplinas (com `matriz_disciplina_id`), professores (turmas_profissionais), periodos (união), aulas/horas (quadro), `ultima_atualizacao`
- [x] Type `PlanoEnsino` atualizado (mantém campos atuais p/ compatibilidade)

## Phase 2 — Componentes
- [x] `src/components/ui/clickable-pill.tsx`
- [x] `src/components/plano-ensino/plano-aula-form.tsx`

## Phase 3 — Lista
- [x] Filtros: escola (superadmin, sem "Todas"), ano (default ativo), turma, disciplina ("Selecione"/"Todas"), período (pills)
- [x] Mini-cards (grid responsivo) com disciplina em destaque, turma, bimestre, professor, aulas+horas, última atualização, "Ver Plano"
- [x] "Novo Plano de Ensino" no header da seção + `?escola=` para superadmin
- [x] Empty states contextuais

## Phase 4 — Criação
- [x] Sem breadcrumbs
- [x] Card Identificação 100% largura, Ano Letivo + Turma 50/50
- [x] Cards interativos de disciplina (borda/fundo/check)
- [x] Superadmin via `?escola=` + Suspense

## Phase 5 — Detalhe + form
- [x] Sem breadcrumbs; `PlanoAulaForm` extraído
- [x] 3 cards: Identificação e Conteúdo / Estrutura da BNCC / Planejamento Pedagógico
- [x] Períodos em pills; BNCC N1/N2 pills; Habilidades com código em Badge
- [x] Cômputo de aulas/horas por disciplina (debounce 500ms)
- [x] Footer sticky com Cancelar/Salvar `h-11`
- [x] Tabs resetam form ao trocar período
- [x] Detalhe: `PageHeader` com título composto (disciplina ou Interdisciplinar + turma) e botão Voltar (removido card de cabeçalho)
- [x] Tabs de períodos: `TabsList` com borda + `TabsTrigger` pills (ativa `bg-primary`)
- [x] Cards de plano de aula: bloco de datas azul (`bg-primary/5`), tema em destaque, chips Períodos/Aulas/Horas/Habilidades, conteúdo truncado (100 chars)
- [x] Ações por card: "Visualizar plano de aula" (Dialog de detalhe), Editar, "Excluir plano de aula"
- [x] `listarPlanoAulaComQuadro` alimenta `aulas_quadro`/`horas_quadro` dos cards

## Phase 6 — Verificação
- [x] `npx next build` (8.0s compile / 16.9s TS) — sem erros
- [ ] Validação visual manual em andamento
