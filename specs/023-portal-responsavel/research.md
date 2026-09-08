# Research: Portal do Responsável

**Feature**: `023-portal-responsavel` | **Date**: 2026-09-08

Levantamento executado via exploração do código + leitura direta de migrations e actions. Todas as decisões abaixo eliminam os NEEDS CLARIFICATION do Technical Context.

## R1 — Área isolada: segmento real `src/app/portal/` (fora de `(app)`)

- **Decision**: Criar `src/app/portal/` com `layout.tsx` próprio (Topbar + Sidebar do portal). Rotas: `/portal/login`, `/portal/termo`, `/portal/selecionar-aluno`, `/portal/aluno` e demais páginas.
- **Nota de implementação**: tentou-se primeiro o grupo de rotas `(portal)/`, mas grupo não altera a URL e `(portal)/login` colidiu com `/login` no build ("two parallel pages resolve to the same path"); o segmento real `portal/` resolve com as mesmas URLs e layout próprio.
- **Rationale**: `src/app/(app)/layout.tsx:11-27` monta `TabProvider > TabBar + TabWorkspace` e **não renderiza `{children}`** — o `TabWorkspace` intercepta todo `pathname` via `openOrFocus`, exige rota registrada em `ROUTES` (`src/lib/tab-routes.tsx`), impõe limite de 6 abas e o shell interno. Qualquer rota do portal dentro de `(app)` herdaria esse comportamento.
- **Alternatives considered**: (a) Registrar módulos do portal em `tab-routes.tsx` — rejeitado: misturaria sessão externa com workspace interno, permissões `modulo.recurso` e limite de abas; viola a separação exigida (FR-001/FR-002). (b) Middleware de gate — rejeitado: `middleware.ts` **não existe** no projeto; toda proteção é client-side.

## R2 — Sessão: Supabase Auth no browser + gate `portal_only` (sem `@supabase/ssr`)

- **Decision**: Login do portal usa o mesmo projeto Supabase Auth via `getSupabaseClient()` (`src/lib/auth.ts:13-26`, anon key, `signInWithPassword`), com gate client + server: `people.portal_acesso_habilitado=true` (migration `patch_portal_acesso_responsavel.sql`, spec 022) E `user_metadata.portal_only=true` (`people.ts:739-741`, `criarAuthUser` com `portalOnly`). Se o gate falhar após `signIn`, fazer `signOut` imediato + erro genérico.
- **Rationale**: É o padrão vigente do projeto (sessão só no browser via localStorage, `auth-provider.tsx:53-65`; sem cookies/SSR em nenhum ponto). Introduzir `@supabase/ssr` seria novo padrão de autenticação — proibido sem aprovação (Constituição X).
- **Alternatives considered**: (a) `@supabase/ssr` com cookies + `auth.getUser()` server-side — rejeitado (novo padrão, sem precedente no código). (b) Sessão separada em outro projeto Supabase — rejeitado (credenciais já provisionadas no projeto atual pela spec 022).

## R3 — Autorização: vínculo validado server-side em CADA action

- **Decision**: Toda action `portal-*` recebe `(responsavelId, alunoId, ...)` e valida antes de qualquer leitura: (1) existe vínculo em `responsavel_alunos` (`responsavel_id`, `aluno_id`); (2) matrícula do aluno ativa no ano vigente; (3) `people.portal_acesso_habilitado=true` do responsável. Helper único `validarVinculoPortal(responsavelId, alunoId)` em `src/lib/actions/portal.ts` (fachada). Nunca confiar em IDs vindos do frontend (Constituição II).
- **Rationale**: Server actions usam `getSupabaseAdmin()` (bypass RLS, padrão do projeto) e não enxergam a sessão do browser; o modelo interno autoriza via `pessoaId` + `validarPermissao*`. O portal não tem perfil interno — o vínculo é o equivalente funcional da permissão.
- **Alternatives considered**: RLS policies por `auth.uid()` — rejeitado: projeto opera com bypass RLS + validação em código em 100% das actions; RLS seria padrão novo e inconsistente.

## R4 — Reuso de motores acadêmicos (nada recalculado do zero)

- **Decision**: Actions do portal delegam para o motor existente; só filtram/empacotam por vínculo:

| Necessidade do portal | Reuso | Observação |
|---|---|---|
| Boletim por bimestre | `getPeriodosBoletim` + `getDadosBoletim` (`boletim.ts:255,320`) | Já retorna `{periodos, bloqueado, motivo}` + médias via `calcularDesempenhoAluno` (`avaliacoes-numericas.ts:492`) |
| Frequência por disciplina/bimestre | `calcularFrequenciaBoletim` (`boletim.ts:182`, hoje privada) | **Exportar** a função (mudança mínima de 1 linha) em vez de duplicar regra (critério, FJ, horários ativos, `data_saida`) |
| KPIs Início | `getFrequenciaGeral` (`painel-pessoa.ts:411`), `getDadosBoletim` (média), contagem de ocorrências | Mesmas regras do Painel/Diário |
| Horários | `getQuadroAulas(turmaId)` (`painel-pessoa.ts:1109`) | Retorna `professor_nome: null` — enriquecer com `people.nome_completo` via `professor_id` na action do portal |
| Ocorrências leitura | Padrão de `getOcorrencias` (`painel-pessoa.ts:1160`) | Nova query com filtros `apresentar_no_portal` + `natureza` (ver R5) |
| Períodos avaliativos | `listarPeriodosAvaliativos` (`boletim.ts:111`) | Fallback `quantidade_periodos_numerico` (padrão spec 021) |
| Auditoria | `registrarAuditoria` (`auditoria.ts:166`, best-effort) | Módulo `Portal do Responsável`; nunca persistir senha |

- **Alternatives considered**: Queries próprias no portal para frequência/notas — rejeitado: duplicaria regras corrigidas com esforço (FJ dupla-contagem, horários ativos, período ativo — specs 014/021) e quebraria SC-004.

## R5 — Ocorrências: banco real já atende (revisado 2026-09-09 com schema de produção)

- **Decision**: NENHUMA alteração de colunas. A tabela real de produção diverge do `ocorrencias.sql` do repositório: já possui `titulo NOT NULL`, `tipo CHECK ('positiva','negativa')`, `detalhes TEXT NOT NULL`, `apresentar_portal BOOLEAN` e vínculo N:N via `ocorrencias_alunos(ocorrencia_id, aluno_id)` — exatamente o que FR-017 pede. A migration `patch_portal_ocorrencias.sql` virou convergência (índice `idx_ocorrencias_alunos_aluno` + comentários documentando o schema real). O portal lê via JOIN (`aluno_id` → `ocorrencia_id`), filtra `apresentar_portal=true` e `tipo`, mapeando `detalhes→descricao` no `OcorrenciaResumo`.
- **Rationale**: Não reinventar nem renomear o que produção já tem; aditivo-zero = risco zero aos dados (a tabela tem 1 linha).
- **Alternatives considered**: (a) Colunas `natureza`/`apresentar_no_portal`/`person_id` como planejado — rejeitado após o diagnóstico: duplicaria conceitos existentes. (b) Alterar `tipo` — nem cogitado (já é positiva/negativa).
- **Follow-up fora de escopo**: `painel-pessoa.getOcorrencias` (e `getResumoAluno`) consultam `person_id`/`descricao`, que não existem em produção — o card de Ocorrências do Painel do Aluno provavelmente vem vazio hoje; corrigir em spec futura.

## R6 — Comunicados: tabelas novas, emissão fora de escopo

- **Decision**: Migration `patch_portal_comunicados.sql` cria `comunicados` (`id, school_id, titulo, descricao, data_comunicado, escopo JSONB {tipo:'geral'|'turmas', turma_ids[]}`, `created_by`, timestamps) + `comunicados_leituras` (`comunicado_id, responsavel_id, lido_em`, UNIQUE par). Visibilidade = escopo alcança `turma_id` da matrícula vigente **E** vínculo com `receber_comunicados=true` (`responsavel_alunos:34`, default TRUE). Emissão interna = spec futura (decisão Q2); carga para homologação via SQL manual.
- **Alternatives considered**: Reusar `ocorrencias` coletivas ou agenda — rejeitado (semântica distinta, sem controle de leitura por responsável).

## R7 — Termo LGPD: tabelas versionadas + aceite por responsável

- **Decision**: Migration `patch_portal_termo.sql` cria `portal_termos` (`id, versao INT UNIQUE, conteudo TEXT, ativo BOOLEAN`, timestamps; seed v1 com o texto FR-006) + `portal_aceites` (`responsavel_id → people, termo_id → portal_termos, aceito_em TIMESTAMPTZ DEFAULT NOW()`, UNIQUE par). Gate pós-login: existe aceite do responsável para o termo `ativo`? Não → `/portal/termo` (bloqueio total, inclusive URL direta — guard client no layout `(portal)`). Nova versão (`ativo` troca) → novo aceite exigido (FR-005).
- **Alternatives considered**: Colunas `termo_aceito_em/termo_versao` em `people` — rejeitado (perde histórico de versões aceitas; auditoria LGPD exige rastro por versão).

## R8 — Login só e-mail, erro genérico, sem CPF

- **Decision**: `/portal/login` aceita **só e-mail + senha** (spec exige e-mail definido pela escola; sem `getPessoaPorCpf`). Falha ou gate negado → `Usuário ou senha inválidos` (`login/page.tsx:46`, padrão Constituição) + orientação "procure a escola" quando bloqueio administrativo. Profissional (credencial sem `portal_only`) é recusado do mesmo jeito, sem revelar o motivo. Sem "Esqueci minha senha" (decisão Q3).
- **Rationale**: Simplicidade + LGPD (não vazar titularidade, padrão da spec 022).

## R9 — Contexto do aluno: provider client + validação server

- **Decision**: `PortalProvider` (client context no layout `(portal)`) guarda `{responsavel, alunosVinculados, alunoSelecionado, trocarAluno}` com persistência em `localStorage`; cada página passa `(responsavelId, alunoId)` às actions, que revalidam via R3. Roteamento: troca preserva a página atual (edge case da spec).
- **Alternatives considered**: `alunoId` na URL (`/portal/aluno/[id]/...`) — rejeitado nesta fase (7 páginas × param + guards por segmento; contexto + validação server-side atende FR-007/FR-010 com menos superfície).

## R10 — Auditoria do portal

- **Decision**: `registrarAuditoria` com `modulo: 'Portal do Responsável'`, entidade `portal_acesso`/`portal_termo`: login (fato, sem senha), aceite (com `versao` do termo, sem conteúdo), troca de aluno (opcional). Tabela `auditoria` inalterada.
