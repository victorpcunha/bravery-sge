# Research: Ocorrências da Gestão Acadêmica (026)

**Feature**: `specs/026-ocorrencias-gestao-academica/spec.md` | **Date**: 2026-09-09

Todas as incógnitas do Technical Context foram resolvidas por leitura direta do código. Nenhum `NEEDS CLARIFICATION` restante.

## R1 — Schema real de ocorrências (produção ≠ repo)

- **Decision**: A migration da feature será **convergente**: `CREATE TABLE IF NOT EXISTS ocorrencias` no shape canônico + `ADD COLUMN IF NOT EXISTS` para cada coluna nova + `CREATE TABLE IF NOT EXISTS` para as junctions + índices. Leituras/escritas usam **somente o conjunto de colunas verificado em código** (`id, school_id, titulo, tipo, detalhes, data_ocorrencia, apresentar_portal`).
- **Rationale**: O `supabase-migrations/ocorrencias.sql` do repo (com `person_id NOT NULL`, `descricao`, `tipo CHECK (disciplinar, pedagogica)`) **nunca foi aplicado em produção como escrito** — documentado em `supabase-migrations/patch_portal_ocorrencias.sql:6-8`. O schema real de produção, verificado pelo código que o lê (`src/lib/actions/portal.ts:316-333`), é: `titulo VARCHAR NOT NULL`, `tipo CHECK ('positiva','negativa')`, `detalhes TEXT NOT NULL`, `apresentar_portal BOOLEAN`, `data_ocorrencia DATE`, `school_id`, vínculo N:N via `ocorrencias_alunos(ocorrencia_id, aluno_id)` (índice `idx_ocorrencias_alunos_aluno`).
- **Alternatives considered**:
  - Reescrever `ocorrencias.sql` existente — rejeitado: migrations aplicadas não são reescritas; convergência via nova migration é o padrão do projeto (ex.: `patch_portal_ocorrencias.sql`).
  - Tentar migrar dados legados (`person_id` → `ocorrencias_alunos`) — rejeitado: produção não possui esses dados; backfill seria especulativo.
- **Consequência**: Não usar `created_by/updated_by` nos inserts (colunas não verificadas em produção); rastreabilidade de ator é coberta pelo framework de auditoria (spec 017), que registra usuário/escola/data/operação.

## R2 — Vínculo de profissionais: tabela nova

- **Decision**: Criar `ocorrencias_profissionais(ocorrencia_id, profissional_id → people.id)` N:N, com PK composta e índices por ocorrência e por profissional.
- **Rationale**: Grep em todo `src/` e `supabase-migrations/` confirma que **não existe** nenhum vínculo ocorrência↔profissional (`ocorrencias_profissionais` = 0 ocorrências). A spec exige ≥1 profissional por ocorrência (FR-011/FR-013), logo a junction é obrigatória. Nenhum CRUD de ocorrências existe para o lado staff — só leituras (`portal.ts`, `painel-pessoa.ts`).
- **Alternatives considered**: Coluna `created_by` como "profissional responsável" — rejeitado: a spec exige **múltiplos** profissionais por ocorrência, o que requer N:N.

## R3 — Arquitetura espelha Comunicados (025)

- **Decision**: Replicar a estrutura da spec 025: `src/lib/actions/ocorrencias.ts` (5 actions + validadores), rotas `src/app/(app)/ocorrencias/page.tsx` + `novo/page.tsx` + `[id]/page.tsx`, componentes `src/components/ocorrencias/{ocorrencia-filtros,ocorrencia-minicard,ocorrencia-form}.tsx`, recurso seed via migration `patch_recursos_ocorrencias.sql`, item no submenu Gestão Acadêmica do sidebar, módulo de aba em `tab-routes.tsx`.
- **Rationale**: Comunicados é a feature irmã mais recente (listagem + filtros + minicards + cadastro, permissão granular, auditoria, superadmin com `?escola=`). Reuso maximiza consistência (PE-302/PE-304) e minimiza risco. Padrões verificados:
  - Actions com `RECURSO`/`MODULO`, `validarPermissaoEstrita(pessoaId, RECURSO, acao)` por operação e `registrarAuditoria` só em mutações (`comunicados.ts:4,8-9,159-424`).
  - Recurso via `INSERT INTO recursos (codigo,nome,modulo) ... ON CONFLICT (codigo) DO NOTHING` (`patch_recursos_portal.sql:7-9`).
  - Sidebar: `{ title:'Comunicados', href:'/comunicados', recurso:'portal.comunicados' }` em `sidebar.tsx:114`; submenu Gestão Acadêmica = 4 itens (`sidebar.tsx:107-115`).
  - Abas: `TAB_MODULES` + `{ title, icon }` + `exact()` estáticas + `p.match()` dinâmica (`tab-routes.tsx:75-77,109,152,301-310`).
  - Listagem client com `ITEMS_PER_PAGE = 10`, `Pagination`, `ConfirmDialog`, guards `ShieldAlert`, `?escola=` para superadmin (`comunicados/page.tsx`).
- **Alternatives considered**: Criar estrutura própria divergente — rejeitado: viola Constituição XI (Design System First) e PE-302.

## R4 — Recurso de permissão e009e módulo de auditoria

- **Decision**: `codigo='gestao-academica.ocorrencias'`, `nome='Ocorrências'`, `modulo='Gestão Acadêmica'`; auditoria `modulo='Gestão Acadêmica — Ocorrências'`, `entidade='ocorrencias'`.
- **Rationale**: Segue o padrão `modulo.recurso` da Constituição; `portal.comunicados` usa módulo `Gestão Acadêmica` (`patch_recursos_portal.sql:13-15`), e Ocorrências é item do mesmo submenu — consistência de agrupamento. `validarPermissaoEstrita` (`perfis.ts:418-444`) nega quem não tem `perfil_id`; client usa `usePermissoes(schoolId)` + guard `EmptyState ShieldAlert` (`comunicados/page.tsx:176-191`).

## R5 — Multi-seleção com chips (sem combobox multiple no repo)

- **Decision**: Criar base compartilhada **feature-local** `src/components/ocorrencias/multi-select-field.tsx` sobre primitivas shadcn existentes (`Popover` + `Command` + `Badge` com X individual + botão "Limpar tudo"), seguindo o padrão visual do Combobox oficial; dois wrappers: `profissionais-select-field.tsx` (opções síncronas) e `alunos-select-field.tsx` (busca assíncrona ≥3 letras, debounce 300ms, prop `multiple`/`maxSelecionados` — filtro usa seleção única, form usa múltipla).
- **Rationale**: `src/components/ui/combobox.tsx:16-19` é **single-only**; não há multi-select com chips no repo (Comunicados usa `ClickablePill` para turmas, inadequado para listas longas de pessoas). O pedido do usuário ("multiple e comboboxchips conforme SHADCN") corresponde ao padrão documentado do shadcn Combobox em modo múltiplo (popover + command + badges removíveis) — implementável sem nova dependência, só com `command.tsx`, `popover.tsx` e `badge.tsx`, que já existem. Feature-local (não `ui/`) porque o uso atual é todo dentro desta feature; promoção a oficial fica para avaliação futura (Constituição XI).
- **Alternatives considered**: Reusar `PillToggleGroup` (`pill-toggle.tsx`, tem `multiple`) — rejeitado: pills não escalam para dezenas/centenas de profissionais/alunos (sem busca, sem scroll virtual, polui o layout).

## R6 — Catálogos de pessoas (profissionais ativos + alunos)

- **Decision**: Nova action `listarProfissionaisSelecionaveis(schoolId, pessoaId?)` em `ocorrencias.ts` seguindo `getProfissionaisCenso` (`censo-profissionais.ts:25-51`): `vinculos_profissionais` com `situacao='1'` + join `people` com `ativo=true` + filtro `perfil` contendo `profissional`/`gestor`, ordernado por nome. Para alunos, **reusar** `buscarPessoasMatriculadas` (`painel-pessoa.ts:211-272`, RPC `buscar_pessoas_matriculadas` + fallback `ilike` + filtro de matrícula ativa, `limit 30`).
- **Rationale**: "Profissionais ativos" já tem definição operacional no censo (vínculo `situacao='1'` = ativo, cf. `turmas.ts:594-602`); co-locar a query em `ocorrencias.ts` evita acoplamento ao módulo do censo. Busca de alunos ≥3 letras + debounce 300ms já é o padrão do `filtro-pessoa.tsx:50-72` — reuso direto atende FR-005/FR-013 sem duplicar lógica.
- **Alternatives considered**: `getProfissionaisAtivos` (`turmas.ts:578-591`, filtra `perfil` em JS sobre `people`) — rejeitado: menos preciso que o critério de vínculo ativo do censo.

## R7 — Datas, pills, minicard e form (componentes existentes)

- **Decision**: `Calendar` com `captionLayout="dropdown"` + `locale={ptBR}` (padrão `comunicado-filtros.tsx:83-87`, `periodo-visibilidade-field.tsx:66-73`); `ClickablePill` (`ui/clickable-pill.tsx:15`) para Tipo (seleção única) e para o toggle "Apresentar no Portal" (liga/desliga); `StatusBadge` para o badge do minicard (positiva=`success`, negativa=`destructive`); `ConfirmDialog`, `EmptyState`, `Pagination`, `PageContainer/Header/Section` como em Comunicados. Minicard em grid `1/2/3` colunas com `Skeleton` no loading (mesmo padrão).
- **Rationale**: Todos os elementos visuais exigidos pela spec já têm componente oficial ou padrão verificado — zero novos padrões visuais, zero novas dependências npm.
- **Nota de escopo**: `painel-pessoa.getOcorrencias` (`painel-pessoa.ts:1160-1195`) ainda lê o schema legado (`person_id/descricao`) e está documentado como pendente de ajuste futuro (`patch_portal_ocorrencias.sql:17-19`) — **fora de escopo** desta feature; registrado como follow-up no plano.

## R8 — Estratégia de filtros com junctions (query plan)

- **Decision**: `listarOcorrencias` em 2 passos: (1) se filtro de profissionais/alunos presente, buscar ids via `.in()` nas junctions e `return []` cedo se vazio; (2) query principal em `ocorrencias` com `school_id`, `tipo`, range de `data_ocorrencia`, `.in('id', ids)` quando aplicável, `order data_ocorrencia DESC`; (3) batch-resolve nomes via `ocorrencias_alunos→people(nome_completo)` e `ocorrencias_profissionais→people(nome_completo)` com 4 queries (2 junctions + 2 people com `.in()`), sem N+1.
- **Rationale**: Mesmo padrão do portal (`portal.ts:319-333`: ids da junction → `in('id', ids)` + early return). Supabase JS não faz join-inverso com filtro eficiente nas junctions; o batch em JS é O(1) queries e atende o volume (centenas de ocorrências/escola).
