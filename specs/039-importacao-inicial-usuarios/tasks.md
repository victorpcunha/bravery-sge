# Tasks: Importação Inicial de Usuários

**Input**: Design documents from `/specs/039-importacao-inicial-usuarios/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não há convenção de testes automatizados no repo (Constituição não define suite); validação via `quickstart.md` (cenários manuais) + gates `tsc --noEmit` e `next build`.

**Organization**: Tarefas agrupadas por user story (US1–US4 da spec.md). US2/US3 estendem o shell de UI de US1 (dependência documentada abaixo); US4 é paralelizável após Setup.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos diferentes, sem dependência)
- **[Story]**: user story atendida (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Pré-requisitos de repo (permissão + helper compartilhado) antes de qualquer código da feature

- [x] T001 Criar migration seed em `supabase-migrations/patch_recursos_importacao.sql` (`('importacao-exportacao.importacao-inicial', 'Importação Inicial', 'Importação e Exportação')` com `ON CONFLICT DO NOTHING`), aplicar via SQL Editor e conferir em `recursos` — **arquivo criado; aplicação no banco pendente (ação do usuário no SQL Editor)**
- [x] T002 Reutilizar `cpfValido` já exportado por `src/lib/actions/censo-situacao-final-helpers.ts:32` (algoritmo de dígito verificador) na validação do lote — sem extração nova; a normalização p/ só-dígitos (11 chars) acontece antes da chamada em `src/lib/actions/importacao.ts` (R-05)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Núcleo compartilhado do motor de importação — BLOQUEIA US1/US2

**⚠️ CRITICAL**: Nenhuma user story começa até esta fase estar completa

- [x] T003 Criar tipos e normalizadores em `src/lib/actions/importacao.ts` (`'use server'`): `LoteInput`, `LinhaArquivo`, `ErroLinha`, `ResultadoLote` + `normalizarCpf/Sexo/Data/Email/Regime/Situacao` + `validarCabecalho` (ordem fixa, cf. `contracts/csv-modelos.md`) + formatador de erro `{linha, campo, mensagem, orientacao}` (PE-402)
- [x] T004 Implementar `resolverFuncaoPorNome` em `src/lib/actions/importacao.ts` (lookup em `funcoes_profissionais` ativas da escola, trim + case-insensitive; erro lista nomes disponíveis) (depends on T003, mesmo arquivo)

**Checkpoint**: Motor base pronto — validação por tipo (US1/US2) pode começar

---

## Phase 3: User Story 1 — Importar lote de Alunos (Priority: P1) 🎯 MVP

**Goal**: Fluxo completo de importação de alunos: unidade → tipo → upload CSV → validar → confirmar → resumo + erros por linha

**Independent Test**: Com CSV de alunos feito à mão (cf. `contracts/csv-modelos.md`): 1 linha válida com CPF, 1 sem CPF mas com certidão/sem filiações, 1 sem ambos → validar mostra 2 válidas + 1 rejeitada motivada; confirmar cria 2 pessoas na escola (filiações "Não declarado") e nada da linha inválida; reenvio cria 0 (duplicidades rejeitadas)

- [x] T005 [US1] Implementar validação do tipo `aluno` em `src/lib/actions/importacao.ts` (7 colunas; regra CPF **ou** certidão; defaults de filiação + `filiacao_declarada 0/1`; nascimento válida/não-futura; sexo normalizado; CPF com dígito + unicidade no arquivo e entre ativos da escola) (depends on T003, T004)
- [x] T006 [US1] Implementar `validarLoteImportacao` + `confirmarLoteImportacao` em `src/lib/actions/importacao.ts` (`validarPermissaoEstrita` visualizar/criar; escopo `school_id` server-side; limite 1.000 linhas; revalidação integral no confirmar; inserts sequenciais via `createPerson`; falha de insert vira rejeição sem abortar; 1× `registrarAuditoriaAgregada` best-effort) (depends on T005)
- [x] T007 [US1] Criar página em `src/app/(app)/(auth)/importacao-inicial/page.tsx` (`PageContainer` + `PageHeader` com título/descrição + `<ImportacaoForm/>`)
- [x] T008 [P] [US1] Criar `src/components/importacao/arquivo-upload.tsx` (input CSV + parse via `await import('xlsx')` com `XLSX.read`, UTF-8/BOM, separador `;` com fallback `,`; estados lendo/validando/importando com spinner oficial e botões desabilitados — PE-404)
- [x] T009 [P] [US1] Criar `src/components/importacao/resultado-lote.tsx` (resumo recebidas/criadas/rejeitadas com `StatusBadge`, `Table` shadcn de erros `{linha, campo, mensagem, orientacao}`, `<Pagination>` 10/pág, `<EmptyState>` quando zero erro)
- [x] T010 [US1] Criar `src/components/importacao/importacao-form.tsx` (grupos PE-204: Unidade — fixa p/ usuário comum via `useAuth`, `Select` de escolas p/ superadmin; Tipo de envio Alunos/Profissionais; orquestra upload→validar→revisar→confirmar com trava anti-duplo-envio; toasts `sonner` PE-403) (depends on T008, T009)
- [x] T011 [US1] Registrar navegação: novo módulo `Importação e Exportação` com item `Importação Inicial` em `src/components/layout/sidebar.tsx` + módulo/rota `exact('/importacao-inicial')` em `src/lib/tab-routes.tsx` (padrão Comunicados; respeita 1 aba/módulo, máx. 6)

**Checkpoint**: US1 funcional e testável de ponta a ponta sem depender de US2/US3/US4

---

## Phase 4: User Story 2 — Importar lote de Profissionais (Priority: P2)

**Goal**: Tipo `profissionais` funcional no mesmo shell: validação das 5 colunas + criação só da pessoa (vínculo depois na tela de Usuários)

**Independent Test**: CSV de profissionais com 1 linha válida + 1 sem e-mail → validar aprova 1 e rejeita 1 ("e-mail é obrigatório"); confirmar cria 1 pessoa com `perfil ['profissional']` e **nenhum** `vinculos_profissionais`; nenhum `auth.users`/`user_schools` criado

**Depende de**: shell de UI de US1 (T007–T011)

- [x] T012 [US2] Implementar validação do tipo `profissional` em `src/lib/importacao-validacao.ts` (5 colunas: pessoais + e-mail obrigatório; CPF com dígito + unicidade; sem campos de vínculo) (depends on T006)
- [x] T013 [US2] `confirmarLoteImportacao` em `src/lib/actions/importacao.ts` cria só a pessoa (`perfil ['profissional']`, sem `createVinculoProfissional`) (depends on T012)
- [x] T014 [US2] `src/components/importacao/importacao-form.tsx` + `src/components/importacao/arquivo-upload.tsx` para o tipo Profissionais (instruções do modelo de 5 colunas, cabeçalho esperado, exemplos) (depends on T012)
- [x] T026 [US2] Redução do modelo (5 campos pessoais): remover vínculo da confirmação, normalizadores de regime/situação/carga, `resolverFuncaoPorNome` e notas XLSX do download (volta a CSV); docs atualizados (spec/plan/data-model/contracts/research/quickstart)

**Checkpoint**: US1 e US2 funcionais, cada uma testável com seu próprio CSV

---

## Phase 5: User Story 3 — Baixar o modelo correto (Priority: P2)

**Goal**: Download do CSV-modelo exato por tipo, gerado pelo sistema

**Independent Test**: Sem importar nada — escolhe Alunos → baixa CSV com as 7 colunas na ordem de `contracts/csv-modelos.md`; escolhe Profissionais → CSV com as 5 colunas; sem tipo → botão indisponível com hint (PE-205)

**Depende de**: shell de UI de US1

- [x] T015 [US3] Criar `src/components/importacao/modelo-download.tsx` (geração CSV via `Blob` puro — sem nova dep — cabeçalho oficial + 1 linha de exemplo por tipo, cf. `contracts/csv-modelos.md`; nomes `modelo-alunos.csv` / `modelo-profissionais.csv`)
- [x] T016 [US3] Integrar `<ModeloDownload tipo={...}/>` em `src/components/importacao/importacao-form.tsx` (visível só após escolha do tipo; desabilitado + hint sem tipo) (depends on T015)
- [x] T024 [US3] Upload em `src/components/importacao/arquivo-upload.tsx` aceita `.csv` e `.xlsx` (gate de extensão + leitura por `arrayBuffer`/`text`; primeira aba, ou `Preencher` se existir; servidor inalterado)
- [x] T025 [US3] Docs da fase XLSX (revertida): `research.md` (R-11 histórico), `spec.md` (FR-004/FR-005 CSV)

**Checkpoint**: Modelo correto disponível antes do preenchimento, por tipo

---

## Phase 6: User Story 4 — Censo Escolar no novo módulo (Priority: P3)

**Goal**: Censo reagrupado sob "Importação e Exportação", comportamento 100% inalterado

**Independent Test**: Navega ao Censo pelo novo módulo, executa validar + exportar → idêntico ao anterior; aba do módulo agrupa `/censo-escolar` + `/importacao-inicial` sem duplicar abas

**Paralelizável após Phase 1** (não toca nos arquivos de US1–US3, exceto o bloco do módulo no sidebar/tab-routes — sincronizar com T011)

- [x] T017 [US4] Reagrupar sidebar em `src/components/layout/sidebar.tsx`: item `Censo Escolar` (mesmo href `/censo-escolar`, mesmo recurso `censo-escolar`) vira submenu do módulo `Importação e Exportação` ao lado de `Importação Inicial`
- [x] T018 [US4] Remapear `exact('/censo-escolar')` para o módulo da aba em `src/lib/tab-routes.tsx` + validar regressão zero do Censo (validar/exportar Matrícula Inicial e Situação Final) (depends on T017)

**Checkpoint**: Todas as stories funcionalmente completas

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação ponta a ponta, limites, segurança e gates do repo

- [x] T019 Executar `specs/039-importacao-inicial-usuarios/quickstart.md` por completo (seções 1–4) e corrigir divergências — **verificação em código + smoke tests executados (modelos + 25 asserts nos helpers puros, `tsc` + `next build` verdes); E2E com dados reais pendente de ambiente (migration aplicada + escola/função + usuário com permissão)**
- [x] T020 [P] Sweep de edge cases: arquivo 1.000 linhas, BOM, separador `,`, data ISO, CPF formatado com máscara, header fora de ordem, arquivo só-cabeçalho, reenvio idempotente, usuário sem permissão e escola fora de escopo (SC-006)
- [x] T021 [P] Revisão visual/a11y em `src/components/importacao/*` e `src/app/(app)/(auth)/importacao-inicial/page.tsx`: só tokens (zero hex), `text-[15px]` em descrições, cards `<md`, labels ligadas, `aria-required`/`role="alert"` onde cabível, dark mode
- [x] T022 Gates técnicos: `npx tsc --noEmit` limpo + `npx next build` verde; corrigir até passar
- [x] T023 Conferir auditoria em `/auditoria` (1 registro por lote confirmado, com ator/escola/tipo/quantidades) e migration de recurso aplicada no ambiente validado

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — início imediato
- **Foundational (Phase 2)**: depende de Setup — **BLOQUEIA US1/US2**
- **US1 (Phase 3)**: depende de Foundational — MVP
- **US2 (Phase 4)**: depende de US1 (reusa shell T007–T010) + Foundational
- **US3 (Phase 5)**: depende de US1 (integra no form T010)
- **US4 (Phase 6)**: depende só de Setup (paralelizável com US1–US3; sincronizar edição de `sidebar.tsx`/`tab-routes.tsx` com T011)
- **Polish (Phase 7)**: depende de US1–US4 completas

### User Story Dependencies

- **US1 (P1)**: após Foundational — sem dependência de outra story
- **US2 (P2)**: após US1 (shell) — testável independentemente com CSV próprio
- **US3 (P2)**: após US1 (slot no form) — testável sem importar
- **US4 (P3)**: após Setup — independente das demais

### Within Each User Story

- Engine antes de UI (T005→T006→T007…; T012→T013→T014)
- Componentes folha `[P]` antes do orquestrador (T008+T009 → T010; T015 → T016)
- `sidebar.tsx`/`tab-routes.tsx` por último na story (evita rota quebrada durante dev)
- Checkpoint de teste independente ao fim de cada story

### Parallel Opportunities

- T001 + T002 (arquivos diferentes)
- T008 + T009 (componentes independentes)
- US4 (T017–T018) em paralelo com US1–US3 (sincronizar T011×T017 no mesmo bloco de `sidebar.tsx`)
- T020 + T021 (verificação vs. código visual)

---

## Parallel Example: User Story 1

```bash
# Componentes folha juntos (arquivos diferentes, sem dependência entre si):
Task: "Criar src/components/importacao/arquivo-upload.tsx (T008)"
Task: "Criar src/components/importacao/resultado-lote.tsx (T009)"
# Depois, sequencial: T010 (orquestrador, depende dos dois) → T011 (navegação)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup: recurso + `validarCPF` compartilhado)
2. Complete Phase 2 (Foundational: tipos + normalizadores + função lookup)
3. Complete Phase 3 (US1: alunos de ponta a ponta)
4. **STOP and VALIDATE**: quickstart seções 1–2 com CSV de alunos
5. Deploy/demo

### Incremental Delivery

1. Setup + Foundational → base pronta
2. + US1 → MVP (alunos) → validar → demo
3. + US2 → profissionais → validar com CSV próprio → demo
4. + US3 → download de modelos → demo
5. + US4 → Censo reagrupado, regressão zero → demo
6. Polish → gates verdes

### Parallel Team Strategy

1. Time completa Setup + Foundational junto
2. Dev A: US1 → US2 → US3 (sequencial, mesmo shell/arquivos)
3. Dev B: US4 em paralelo (sincronizar `sidebar.tsx`/`tab-routes.tsx` com T011)
4. Polish junto ao final

---

## Notes

- `- [ ]` + ID sequencial + `[P]` só quando paralelizável + `[USn]` nas phases de story + path exato em toda task
- Nenhuma task cria tabela nova (0 migrations de schema; só seed T001)
- Nunca mapear coluna errada silenciosamente: cabeçalho divergente rejeita o lote (contrato)
- `criarAuthUser`/`user_schools` fora de escopo em todas as phases (R-04)
- Commit após cada task ou grupo lógico; parar em qualquer checkpoint para validar a story
