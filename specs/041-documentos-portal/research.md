# Research: Documentos no Portal do Responsável

**Feature**: specs/041-documentos-portal/spec.md
**Created**: 2026-09-27

## R1 — Onde persistir a liberação por documento e por escola

**Decision**: Nova tabela dedicada `escola_portal_documentos` (`school_id` UUID FK → `schools.id`, `documento_id` TEXT, `liberado` BOOLEAN NOT NULL DEFAULT TRUE, PK composta `(school_id, documento_id)`). **Ausência de linha = liberado** (opt-out).

**Rationale**:
- FR-009 exige que documentos futuros entrem no mesmo mecanismo sem reformulação. Colunas booleanas fixas em `schools` (padrão da spec 040 para os 6 módulos) exigiriam nova migration + nova coluna + novo campo no form a cada documento novo — inviável.
- JSONB em `schools` misturaria a config com o payload do Censo que trafega no `updateSchool` e dificultaria diff de auditoria campo a campo; tabela dedicada mantém a separação já adotada por `documentos_config` (spec 018).
- Opt-out (ausente = liberado) preserva o comportamento atual para escolas existentes, confirma a suposição da spec sobre o padrão inicial e faz documentos futuros nascerem liberados sem backfill.
- Tabela nova é ignorada pelo Registro 00 do Censo por construção (leitura de colunas explícitas de `schools`), como já ocorre com `documentos_config` e as flags `portal_vis_*`.

**Alternatives considered**:
- Colunas `portal_doc_<id>` em `schools` (espelhar spec 040): rejeitado — quebra FR-009.
- JSONB `portal_documentos` em `schools`: rejeitado — acoplamento com payload do Censo/auditoria, sem ganho real sobre tabela dedicada.

## R2 — Catálogo canônico de documentos

**Decision**: Módulo neutro `src/lib/portal-documentos.ts` (sem `'use server'`, pois o Turbopack exige que módulos `'use server'` exportem só async) espelhando `src/lib/portal-modulos.ts` (spec 040): constante `DOCUMENTOS_PORTAL` com `{ id, titulo, categoria: 'oficial' | 'manual' }` + helpers `todosLiberados()` e `normalizarDocumentosLiberados()`.

**Rationale**: Hoje os ids (`declaracao`, `ficha`, `boletim`, `historico`) vivem só como literais em `oficiais-tab.tsx`. Um catálogo único alimenta a config da escola, a galeria do portal e o enforcement server-side sem divergência. Ícones permanecem nas telas (são componentes, não cabem no módulo neutro).

**Alternatives considered**: Reaproveitar `DocumentoConfig` do `documento-gerador.tsx` como catálogo — rejeitado: ele é client-side, amarra `carregarPdf` dinâmico e exige `schoolId/pessoaId`, inadequado para form de escola e enforcement.

## R3 — Edição na Unidade Escolar

**Decision**: Nova seção "Documentos disponíveis no portal" dentro do card "Portal do Responsável" (`escola-form.tsx`, aba Identificação), com `ClickablePill` por documento agrupado por categoria — mesmo padrão visual dos "Módulos visíveis no portal" (spec 040). Grupo `portal_documentos` no schema zod (lista de ids liberados), carregado via `getDocumentosLiberados(schoolId)` e salvo por action própria `salvarDocumentosPortal(schoolId, ids, pessoaId)` chamada na page **após** `updateSchool` — mesmo padrão do grupo `documentos`/`salvarConfigDocumentos` (spec 018, `escolas/[id]/page.tsx`). Herda `readOnly` do fieldset; exige permissão `escolas/editar` (FR-011, via `validarPermissaoEstrita`, padrão de `updateSchool`/`salvarConfigDocumentos`).

**Rationale**: Reuso integral de padrões já aprovados (pills, grupo separado, action própria, auditoria) em vez de inflar o `updateSchool`/payload do Censo.

## R4 — Geração no portal com contexto do aluno

**Decision**: Wrappers portal em `src/lib/actions/portal.ts` (ex.: `listarDocumentosDisponiveisPortal`, `getDadosDeclaracaoPortal`, `getDadosFichaPortal`, `getDadosBoletimPortal`, `getDadosHistoricoPortal`), cada um executando `validarVinculoPortal` → `exigirModuloVisivel('documentos')` → `exigirDocumentoLiberado(documentoId)` e delegando ao motor existente (`getDadosDeclaracaoMatricula`, `getDadosFichaIndividual`, `getPeriodosBoletim`/`getDadosBoletim`, `getDadosHistoricoEscolar`) com `pessoaId` `undefined` e `anoLetivoId`/`schoolId` vindos do `PortalCtx` — padrão documentado em `portal.ts` (a autorização do portal É o vínculo). UI em `src/components/portal/documentos-portal.tsx` (galeria filtrada) reutilizando `DocumentoGerador` estendido com props opcionais `alunoFixo`/`anoLetivoFixo` que, quando presentes, ocultam os selects de ano/aluno e a busca (o portal já conhece o aluno; `getAnosLetivos` sequer é chamado nesse modo).

**Rationale**: Zero regra paralela de dados (Boletim/frequência usam o mesmo motor do Diário/Fechamento, como na spec 021); zero duplicação da cadeia de preview/raster/download/assinatura.

**Alternatives considered**: Componente de geração próprio do portal — rejeitado: duplicaria ~300 linhas de `DocumentoGerador` (preview pdfjs, debounce, assinatura editável).

## R5 — Enforcement server-side (FR-006)

**Decision**: `exigirDocumentoLiberado(schoolId, documentoId)` em `portal-escola.ts`, chamado após `exigirModuloVisivel` em todo wrapper; erro `'Documento indisponível no portal desta escola'` (distinto de `'Acesso negado'`, mesmo padrão de erro orientativo da spec 040/PE-402).

## R6 — Auditoria (FR-010)

**Decision**: `salvarDocumentosPortal` registra via `registrarAuditoria` (módulo `'Portal — Documentos'`, entidade `'escola_portal_documentos'`, `acao: 'editar'`, `dados_anteriores`/`dados_novos` como mapa `documento_id → liberado`; diff automático por `computarAlteracoes`; best-effort, nunca bloqueia o save — padrão spec 017). A **geração** de documentos é leitura e não é auditada (spec 017 cobre criação/edição/exclusão).

## R7 — Preenchimento Manual (categoria sem modelos)

**Decision**: O catálogo nasce só com os 4 oficiais; a categoria `manual` existe no tipo mas vazia. A seção de config renderiza por categoria do catálogo; enquanto não houver modelos manuais, exibe nota "Em breve" sem bloquear os oficiais, e o portal não exibe a categoria. Quando os modelos forem implementados, basta acrescentar entradas ao catálogo (FR-009 sem nova migration de estrutura).

## R8 — Migration e ambiente

**Decision**: `supabase-migrations/patch_portal_documentos_escola.sql` (tabela + índice + comentários), aplicada via SQL Editor — padrão do projeto (sem CLI Supabase; migrations anteriores 019–021/040 aplicadas manualmente). Validação: `tsc --noEmit` + `eslint` + `next build` verdes + quickstart E2E manual (padrão das specs 019–021/039/040; o repo não possui suite automatizada).
