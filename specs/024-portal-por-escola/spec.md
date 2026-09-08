# Feature Specification: Portal por Escola

**Feature Branch**: `024-portal-por-escola`

**Created**: 2026-09-07

**Status**: Draft

**Input**: User description: "Portal por Escola — o Portal do Responsável (spec 023) passa a ser configurável por unidade escolar. No cadastro da Unidade Escolar, pill clicável Sim/Não habilita o portal para aquela escola (algumas escolas podem não querer a funcionalidade). Se habilitado, campo de slug define o link do portal da escola (/portal/[slug], ex. /portal-bravery), com sugestão automática a partir do nome, editável, único e validado. A página de login é personalizada por escola com nome, logo, imagem de fundo e texto informativo definidos pela escola (nome/logo reusam documentos_config; imagem/texto novos). Rotas genéricas /portal/* sem slug deixam de dar acesso e viram página de orientação. Escola desabilitada tem slug bloqueado com página 'portal indisponível'. Todas as leituras do portal passam a respeitar a escola do slug além do vínculo."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-102** — O responsável identifica a escola do filho desde o primeiro contato (logo + nome + texto no login), sem precisar explorar.
- **PE-102** — A página de orientação explica desde o primeiro contato que o acesso é pelo link da escola.
- **PE-204** — Habilitar + slug agrupados no card "Portal do Responsável" do cadastro da escola, junto às demais configs internas (mesmo molde do card de Documentos, spec 018).
- **PE-402** — Slug inválido/duplicado e escola desabilitada geram mensagens que explicam o problema e como resolver (genérica no portal público, orientadora no cadastro).
- **PE-404** — Salvamento do cadastro e carregamento do login por slug comunicam estado.
- **PE-6xx** — Login personalizado segue responsivo (imagem de fundo adaptada, card legível em 360px).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Habilitar portal e definir slug da escola (Priority: P1)

A gestão abre o cadastro da Unidade Escolar, encontra o card "Portal do Responsável", marca a pill **Sim**, ajusta o slug sugerido a partir do nome (ex. `bravery`), salva — o portal da escola passa a responder em `/portal/bravery`. Ao marcar **Não**, o slug é bloqueado e o portal da escola fica indisponível.

**Why this priority**: É a chave de tudo — sem habilitação + slug por escola, nada do resto existe. Entrega valor sozinha (governança por escola).

**Independent Test**: Habilitar + definir slug, salvar, abrir `/portal/[slug]/login` e ver o login; desabilitar e ver "portal indisponível" no mesmo link.

**Acceptance Scenarios**:

1. **Given** cadastro da escola com portal desabilitado, **When** marco Sim, confirmo o slug sugerido e salvo, **Then** `/portal/[slug]/login` exibe o login e vejo toast de sucesso.
2. **Given** card com Sim marcado, **When** edito o slug para valor com maiúsculas/espaços, **Then** o salvamento normaliza (minúsculas, hífens) ou bloqueia com mensagem explicando a regra.
3. **Given** slug já usado por outra escola, **When** tento salvar, **Then** o salvamento é bloqueado com "este link já está em uso".
4. **Given** escola com portal habilitado, **When** marco Não e salvo, **Then** `/portal/[slug]/login` passa a exibir "portal indisponível" (sem expor dados).

---

### User Story 2 - Login personalizado da escola (Priority: P1)

O responsável abre o link repassado pela escola (`/portal/bravery/login`) e identifica imediatamente a escola do filho: logo, nome fantasia, imagem de fundo e texto informativo definidos pela escola. Sem esses dados, o login usa o visual padrão atual.

**Why this priority**: É a motivação central do pedido (identificação e confiança). Testável isoladamente com o slug da US1.

**Independent Test**: Configurar nome/logo/imagem/texto, abrir o login do slug e conferir os 4 elementos; limpar e conferir o fallback padrão.

**Acceptance Scenarios**:

1. **Given** escola com nome fantasia, logo, imagem de fundo e texto configurados, **When** abro `/portal/[slug]/login`, **Then** vejo os 4 elementos da escola (sem nada de outra escola).
2. **Given** escola habilitada sem personalização, **When** abro o login do slug, **Then** vejo o visual padrão atual (sem erro, sem quebra).
3. **Given** login do slug, **When** entro com credencial válida de responsável com vínculo naquela escola, **Then** o portal abre com dados somente daquela escola.

---

### User Story 3 - Rotas genéricas viram orientação (Priority: P2)

O responsável que tenta `/portal/login` (ou qualquer rota `/portal/*` sem slug, incluindo links antigos) vê uma página neutra de orientação ("use o link repassado pela escola"), sem formulário de login e sem dados.

**Why this priority**: Fecha a porta de entrada ambígua (decisão explícita: só o link completo funciona). Depende das US1–US2 para o destino existir.

**Independent Test**: Acessar `/portal/login` e cada rota antiga sem slug e confirmar orientação em todas, sem login possível.

**Acceptance Scenarios**:

1. **Given** qualquer rota `/portal/*` sem slug, **When** acesso, **Then** vejo a página de orientação (sem formulário, sem dados, sem erro técnico).
2. **Given** slug de escola desabilitada ou inexistente, **When** acesso `/portal/[slug]/login`, **Then** vejo "portal indisponível" (sem indicar se o slug existe ou não).
3. **Given** sessão válida do slug A, **When** tento URL do slug B, **Then** sou redirecionado ao fluxo do slug B (sem vazar dados de A).

---

### User Story 4 - Escopo de dados pela escola do slug (Priority: P2)

Todas as leituras do portal (seleção de alunos, KPIs, boletim, frequência, horários, ocorrências, comunicados) respeitam a escola do slug além do vínculo: responsável com filhos em 2 escolas vê em cada link só os alunos daquela escola.

**Why this priority**: Segurança/isolamento multi-escola (Constituição III). Sem isso, o slug seria só cosmético.

**Independent Test**: Responsável com vínculos em 2 escolas habilitadas; abrir cada slug e confirmar que só os alunos daquela escola aparecem (inclusive por URL direta/chamada de action).

**Acceptance Scenarios**:

1. **Given** responsável com filhos nas escolas A e B, **When** abre o link da escola A, **Then** a seleção lista só os filhos da escola A.
2. **Given** sessão do slug A, **When** chama action com aluno da escola B, **Then** recebe "Acesso negado", sem dados.
3. **Given** filho transferido para outra escola, **When** abre o link da escola antiga, **Then** o aluno não aparece mais lá (só na nova, se habilitada).

### Edge Cases

- Slug alterado depois de divulgado: link antigo vira "portal indisponível"; a escola precisa repassar o novo (mensagem no cadastro alerta sobre isso).
- Escola inativada: segue a regra vigente de inativação + portal bloqueado pelo gate `portal_habilitado`.
- Slug reservado (`login`, `termo`, `aluno`, `api`, etc.): bloqueado na validação para não colidir com rotas.
- Imagem de fundo ausente ou inválida: fallback silencioso ao fundo padrão (nunca quebra o login).
- Responsável sem vínculo na escola do slug (mas com acesso em outra): login válido, seleção vazia com orientação ("este link é da escola X; use o link da escola do aluno").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST oferecer no cadastro da Unidade Escolar o card "Portal do Responsável" com pill Sim/Não (`PillToggleGroup`, default Não) persistido em `schools.portal_habilitado`.
- **FR-002**: Sistema MUST oferecer o campo slug visível somente com Sim marcado: sugestão automática do nome (minúsculas, espaços→hífens, sem acentos), editável, único entre escolas, validado server-side; persistido em `schools.portal_slug`.
- **FR-003**: Sistema MUST exibir preview da URL completa (`/portal/[slug]`) no cadastro e alertar que trocar o slug invalida o link divulgado.
- **FR-004**: Sistema MUST bloquear slugs reservados (`login`, `termo`, `aluno`, `selecionar-aluno`, `documentos`, `api`, etc.) e formato inválido, com mensagem orientadora.
- **FR-005**: Sistema MUST manter `portal_habilitado`/`portal_slug` fora do payload do Censo (mesmo padrão da spec 018) e auditar criações/alterações (módulo `Escolas`, sem dados sensíveis).
- **FR-006**: Sistema MUST servir o portal em `/portal/[slug]/*` (login, termo, selecionar-aluno, aluno/*) resolvendo `school_id` pelo slug + exigindo `portal_habilitado=true`; slug inexistente/desabilitado exibe página "portal indisponível" sem revelar qual caso.
- **FR-007**: Sistema MUST converter as rotas genéricas `/portal/*` sem slug em página neutra de orientação (sem formulário de login, sem dados).
- **FR-008**: Sistema MUST personalizar o login do slug com: nome fantasia + logo (reuso de `documentos_config`) + imagem de fundo + texto informativo (novos campos `portal_imagem_fundo` com teto 2 MB e `portal_texto_login` em `documentos_config`); ausência de qualquer item usa fallback ao padrão atual.
- **FR-009**: Sistema MUST filtrar todas as leituras do portal pela escola do slug além do vínculo `responsavel_alunos` (seleção, KPIs, boletim, frequência, horários, ocorrências, comunicados); action com aluno de outra escola retorna "Acesso negado".
- **FR-010**: Sistema MUST manter compatível o aceite LGPD já registrado (por responsável, independente de escola) e a sessão independente por storageKey (spec 023).

### Key Entities

- **schools (estendida)**: `portal_habilitado: boolean` (default `false`), `portal_slug: varchar unique null` — governa existência do portal da escola.
- **documentos_config (estendida, grupo portal)**: `portal_imagem_fundo: text null` (base64 ≤2 MB), `portal_texto_login: text null` — identidade do login (nome/logo já existem).
- **Contexto de escola do portal**: slug da URL → `school_id` vigente; governa branding, gates e escopo de todas as páginas/actions.
- **Página de orientação**: rota neutra sem escola (sem dados, sem login).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Gestão habilita o portal + define slug e salva em até 2 minutos sem suporte (mesmo fluxo do cadastro atual acrescido do card).
- **SC-002**: Responsável identifica a escola do filho no login em até 10 segundos (logo + nome + texto visíveis acima da dobra).
- **SC-003**: 0 vazamentos entre escolas: slug A nunca expõe dados da escola B (incluindo URL direta e chamada de action), verificado por teste funcional.
- **SC-004**: Rotas genéricas `/portal/*` nunca exibem formulário nem dados (somente orientação), verificado por navegação direta.
- **SC-005**: `npx tsc --noEmit` e `npx next build` verdes após a implementação.

## Assumptions

- Slug único global (não por rede/município); case-insensitive na prática (normalizado para minúsculas).
- Multicase: responsável com filhos em 2 escolas usa um link por escola (sem portal "multi-escola" unificado nesta versão).
- Cores temáticas por escola fora de escopo (decisão explícita; só nome/logo/imagem/texto).
- Imagem de fundo segue o padrão do logo (base64 TEXT ≤2 MB via FileReader, padrão spec 018).
- Aceite LGPD e credenciais inalterados (specs 022/023); slug não afeta `user_schools` nem provisionamento.
- Roteiro de implantação inclui repassar os links novos aos responsáveis (links antigos morrem).
- Migrations via SQL Editor (padrão do projeto); `updateSchool` exclui o grupo portal do payload do Censo.
