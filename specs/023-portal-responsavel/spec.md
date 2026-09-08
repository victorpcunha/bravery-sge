# Feature Specification: Portal do Responsável

**Feature Branch**: `023-portal-responsavel`

**Created**: 2026-09-07

**Status**: Draft

**Input**: User description: "Portal do Responsável — Criação: portal de acesso exclusivo para os responsáveis, separado do acesso dos profissionais da escola. Login com e-mail e senha definidos pela escola no cadastro do responsável. Um responsável pode estar vinculado a mais de um aluno — nesse caso o sistema apresenta a lista de alunos vinculados para seleção. Primeiro acesso exibe Termo de Uso e Política de Privacidade com aceite obrigatório (data/hora registrada); sem aceite, sem acesso; termo atualizado exige novo aceite. Portal segue o padrão visual Bravery (Topbar + Sidebar com Início, Boletim, Frequência, Horários, Ocorrências, Comunicados, Documentos; identificação do aluno + troca). Início com 4 KPIs (Presença Geral, Média geral com seleção de período, Total de faltas, Total de ocorrências) + cards (Comunicados Recentes, Média do Bimestre por Disciplina, Ocorrências Recentes) com 'Ver Todos'. Boletim com abas de bimestre, avaliações do método, média mínima e cores por nota. Frequência com 3 abas (Geral, Por Disciplina Geral, Disciplina por Bimestre). Horários com quadro da turma. Ocorrências com filtro de tipo. Comunicados como minicards com modal e sinalização de não lido."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — Cada página do portal tem um único objetivo (Início = visão geral do aluno; Boletim = notas; Frequência = presença; etc.).
- **PE-102** — O aluno visualizado está identificado na Sidebar e em cada página desde o primeiro contato, sem necessidade de exploração.
- **PE-201 / PE-202** — No Início, os 4 KPIs ficam acima da dobra, antes dos cards secundários.
- **PE-204** — Conteúdos agrupados por contexto ( KPIs, Comunicados Recentes, Média por Disciplina, Ocorrências Recentes em cards independentes; abas por bimestre no Boletim/Frequência).
- **PE-205** — Comunicados usam divulgação progressiva (minicard + modal com descrição completa); troca de aluno via seletor sem sair do contexto.
- **PE-301** — O Início usa layout de Dashboard (monitorar situação do aluno).
- **PE-402** — Erro de login usa mensagem genérica sem revelar titularidade ("Usuário ou senha inválidos", padrão da Constituição).
- **PE-404** — Login, aceite do termo e troca de aluno comunicam estado de carregamento.
- **PE-5xx** — Responsável sem vínculo ativo, aluno sem notas/frequência lançadas e lista vazia de comunicados/ocorrências têm estados vazios orientadores.
- **PE-6xx** — Portal totalmente utilizável em mobile (responsáveis acessam majoritariamente pelo celular): KPIs empilham, tabelas viram card-list ou rolam com primeira coluna fixa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Primeiro acesso com aceite do termo LGPD (Priority: P1)

O responsável recebe e-mail + senha da escola, acessa o portal pela primeira vez, visualiza o Termo de Uso e Política de Privacidade, clica em "Aceitar" e só então chega ao portal. O aceite registra data/hora vinculada ao cadastro. Se o termo for atualizado, o próximo acesso exige novo aceite.

**Why this priority**: Bloqueador legal (LGPD) — sem isso nenhum dado pode ser exibido. Entrega valor sozinho (conformidade + registro de consentimento).

**Independent Test**: Criar responsável com acesso habilitado (spec 022), logar pela 1ª vez e confirmar que (a) o termo aparece antes de qualquer dado, (b) sem aceitar não há navegação, (c) após aceitar, data/hora ficam registradas e o portal abre.

**Acceptance Scenarios**:

1. **Given** responsável com acesso habilitado que nunca aceitou o termo, **When** faz login com e-mail + senha corretos, **Then** vê somente a tela do Termo de Uso e Política de Privacidade, sem acesso a nenhum dado do aluno.
2. **Given** responsável na tela do termo, **When** clica em "Aceitar", **Then** o sistema registra data/hora do aceite vinculada ao cadastro e libera o portal.
3. **Given** responsável que já aceitou a versão vigente, **When** faz novo login, **Then** entra direto no portal sem rever o termo.
4. **Given** responsável que aceitou uma versão antiga e a escola publicou versão nova, **When** faz login, **Then** vê a nova versão e precisa aceitar novamente antes de prosseguir.
5. **Given** responsável com login correto mas termo pendente, **When** tenta acessar URL interna do portal diretamente, **Then** é redirecionado para a tela do termo.

---

### User Story 2 - Seleção do aluno vinculado (Priority: P1)

Responsável com mais de um aluno vinculado vê a lista de alunos após o login (ou após o aceite, no primeiro acesso) e escolhe qual visualizar. Responsável com um único aluno entra direto nos dados dele. A Sidebar identifica o aluno visualizado e permite trocar, atualizando todas as telas.

**Why this priority**: Núcleo da navegação do portal — sem o contexto do aluno nenhuma página funciona. Testável isoladamente (login → seleção → contexto).

**Independent Test**: Responsável com 2 vínculos loga, vê a lista, seleciona um aluno, navega; troca pelo seletor da Sidebar e confirma que os dados atualizam.

**Acceptance Scenarios**:

1. **Given** responsável com 2+ alunos vinculados ativos, **When** conclui login/aceite, **Then** vê a lista dos alunos vinculados para escolher.
2. **Given** responsável com 1 aluno vinculado ativo, **When** conclui login/aceite, **Then** entra direto nos dados desse aluno, sem tela intermediária.
3. **Given** responsável visualizando o Aluno A, **When** troca para o Aluno B no seletor da Sidebar, **Then** todas as páginas passam a exibir dados do Aluno B.
4. **Given** responsável sem nenhum vínculo ativo com aluno, **When** conclui login/aceite, **Then** vê estado vazio orientando a procurar a escola (sem dados expostos).

---

### User Story 3 - Início com KPIs e resumo (Priority: P2)

O responsável abre o Início e vê 4 KPIs (Presença Geral, Média geral com seleção de bimestre/período, Total de faltas geral, Total de ocorrências) + 3 cards (Comunicados Recentes, Média do Bimestre por Disciplina com filtro de bimestre, Ocorrências Recentes), cada card com botão "Ver Todos" que leva à página correspondente.

**Why this priority**: É a página de aterrissagem e o maior valor percebido (visão geral rápida). Depende das US1–US2 para o contexto, mas o conteúdo é independente das páginas internas.

**Independent Test**: Logar, selecionar aluno e confirmar KPIs + 3 cards com dados coerentes com o Diário/Fechamento, e que cada "Ver Todos" navega para a página certa.

**Acceptance Scenarios**:

1. **Given** aluno com frequência e notas lançadas, **When** abre o Início, **Then** vê Presença Geral, Média geral do período selecionado, Total de faltas e Total de ocorrências.
2. **Given** Início carregado, **When** troca o bimestre/período do KPI de Média geral, **Then** a média recalcula para o período escolhido.
3. **Given** Início carregado, **When** clica em "Ver Todos" no card de Comunicados/Médias/Ocorrências, **Then** é levado a Comunicados/Boletim/Ocorrências do mesmo aluno.
4. **Given** aluno sem lançamentos, **When** abre o Início, **Then** vê estados vazios orientadores em vez de zeros enganosos.

---

### User Story 4 - Boletim por bimestre (Priority: P2)

O responsável abre o Boletim, navega pelas abas de bimestre (conforme Método de Avaliação do Ano Letivo) e vê a tabela por disciplina com as avaliações do método e a média, com cores verde/vermelha por nota e indicação da média mínima exigida.

**Why this priority**: Principal informação acadêmica procurada pelo responsável. Reusa as regras de cálculo do Diário/Fechamento.

**Independent Test**: Abrir Boletim de aluno com notas lançadas, trocar de bimestre e conferir avaliações, médias, cores e média mínima.

**Acceptance Scenarios**:

1. **Given** aluno em turma com método numérico de N bimestres, **When** abre o Boletim, **Then** vê N abas (1º Bimestre, 2º Bimestre, ...) e a tabela do bimestre ativo.
2. **Given** aba de bimestre ativa, **When** visualiza a tabela, **Then** cada disciplina mostra as avaliações configuradas no método (respeitando "Limitar quantidade de avaliações") + a média.
3. **Given** tabela exibida, **When** há média mínima configurada no método, **Then** ela está informada em local visível e notas/médias usam verde (≥ mínima) e vermelho (< mínima), no padrão do Diário de Classe.
4. **Given** turma com avaliação não-numérica (conceito/parecer), **When** abre o Boletim, **Then** vê mensagem explicativa (sem tabela numérica vazia) — mesmo comportamento da emissão do Boletim oficial (spec 021).

---

### User Story 5 - Frequência em 3 visões (Priority: P2)

O responsável abre Frequência e alterna entre Geral (percentual + totais + limite de faltas), Por Disciplina Geral (tabela com barra de progresso) e Disciplina por Bimestre (filtro de bimestre + tabela).

**Why this priority**: Segunda informação mais procurada; regras de cálculo (critério por dia/aula, FJ, período ativo) já existem e devem ser idênticas às do sistema.

**Independent Test**: Abrir cada aba e conferir totais/barras contra os lançamentos do Diário.

**Acceptance Scenarios**:

1. **Given** aba Geral, **When** exibida, **Then** mostra Percentual de Presença + Total de aulas registradas + Total de faltas + Limite de faltas derivado da frequência mínima do método (ex.: mínima 75% → limite 25% aplicado sobre as aulas registradas).
2. **Given** aba Por Disciplina Geral, **When** exibida, **Then** cada disciplina mostra Total de Aulas, Faltas e Presença com barra de progresso e porcentagem.
3. **Given** aba Disciplina por Bimestre, **When** seleciona um bimestre, **Then** a tabela reflete somente aulas/faltas daquele bimestre.
4. **Given** aluno com movimentação (data de saída), **When** exibe qualquer visão, **Then** o cálculo respeita o período ativo do aluno (mesma regra do Diário/Painel).

---

### User Story 6 - Horários, Ocorrências e Comunicados (Priority: P3)

O responsável consulta o quadro de aulas da turma (Horários), filtra e lê as ocorrências do aluno (Ocorrências) e lê comunicados com controle de não lidos (Comunicados).

**Why this priority**: Consultas de apoio, de menor frequência que notas/frequência, mas exigidas explicitamente. Cada página é testável isoladamente.

**Independent Test**: Abrir cada página e conferir conteúdo contra os registros da escola.

**Acceptance Scenarios**:

1. **Given** aluno matriculado em turma com quadro de aulas, **When** abre Horários, **Then** vê dias × horários com disciplina, profissional, intervalo e demais informações do quadro.
2. **Given** página Ocorrências, **When** alterna o filtro Todas/Positivas/Negativas (padrão Todas), **Then** a lista filtra, cada item mostra ícone, título, data, descrição e badge; só aparecem ocorrências do aluno com `apresentar_no_portal = true`.
3. **Given** página Comunicados, **When** exibida, **Then** comunicados aparecem como minicards (título, data, "Ver Comunicado"); os não visualizados têm sinalização de não lido.
4. **Given** minicard de comunicado não lido, **When** abre o modal e lê a descrição, **Then** a sinalização de não lido desaparece.

---

### User Story 7 - Página Documentos como placeholder (Priority: P3)

A Sidebar exibe o item Documentos, mas o conteúdo fica como placeholder "Em breve" nesta versão — sem listagem nem download. A página existe na navegação para preservar a estrutura, sem entregar funcionalidade.

**Why this priority**: Mantém a Sidebar conforme exigido sem expandir o escopo; o conteúdo real será definido em spec futura.

**Independent Test**: Abrir Documentos e confirmar o estado "Em breve", sem erro e sem dados.

**Acceptance Scenarios**:

1. **Given** responsável logado, **When** abre Documentos, **Then** vê estado "Em breve" (EmptyState oficial), sem listagem nem download.

### Edge Cases

- Login com credencial de profissional (acesso interno) na tela do portal: negado com mensagem genérica, sem indicar o motivo (separação dos acessos).
- Responsável com acesso desabilitado pela escola (`portal_acesso_habilitado=false` ou ban): login recusado com mensagem genérica + orientação para procurar a escola.
- E-mail com dois vínculos (ex.: mãe e pai no mesmo e-mail — bloqueado já no cadastro pela spec 022): não há ambiguidade de identidade no portal.
- Aluno transferido/remanejado no meio do ano: portal mostra a turma/matrícula vigente; histórico de outras turmas segue a regra de matrícula ativa (mesma do Painel do Aluno).
- Turma sem quadro de aulas / sem método numérico / sem comunicados: cada página exibe estado vazio orientador, nunca tabela vazia ou zeros enganosos.
- Sessão expirada ou acesso direto por URL sem login: redireciona para o login do portal (nunca para o login interno).
- Troca de aluno preserva a página atual quando aplicável (ex.: estava no Boletim do Aluno A → Boletim do Aluno B).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST oferecer login do portal separado do login interno, com e-mail + senha definidos pela escola (credencial provisionada na spec 022, `user_metadata.portal_only=true`).
- **FR-002**: Sistema MUST recusar no portal credenciais do acesso interno (profissionais) e credenciais de portal com acesso desabilitado/banido, sempre com mensagem genérica ("Usuário ou senha inválidos") + orientação para procurar a escola quando for bloqueio administrativo.
- **FR-003**: Sistema MUST exibir o Termo de Uso e Política de Privacidade no primeiro acesso (e a cada nova versão), bloqueando toda navegação/dados até o clique em "Aceitar".
- **FR-004**: Sistema MUST registrar data/hora de cada aceite, vinculado ao cadastro do responsável e à versão do termo aceita.
- **FR-005**: Sistema MUST versionar o termo: publicar nova versão exige novo aceite no próximo acesso de cada responsável (quem aceitou versão antiga volta a ver o termo).
- **FR-006**: Conteúdo do termo MUST informar, em linguagem clara e simples: (a) dados usados exclusivamente para fins escolares; (b) não compartilhamento com terceiros sem autorização; (c) direito de solicitar correção/exclusão via escola; (d) armazenamento seguro.
- **FR-007**: Sistema MUST restringir todos os dados do portal aos alunos com vínculo ativo com o responsável logado (via `responsavel_alunos`); ningún dado de outro aluno pode ser acessível (nem por URL direta).
- **FR-008**: Sistema MUST apresentar a lista de alunos vinculados quando houver 2+ vínculos ativos; com 1 vínculo, entrar direto; sem vínculo, exibir estado vazio orientador.
- **FR-009**: Sistema MUST seguir o padrão visual Bravery (Design Tokens, shadcn/ui, PageContainer/PageHeader/PageSection, tipografia e radius oficiais) com Topbar + Sidebar próprias do portal.
- **FR-010**: Sidebar MUST conter: Início, Boletim, Frequência, Horários, Ocorrências, Comunicados, Documentos + identificação do aluno visualizado + seletor para troca quando houver 2+ vínculos.
- **FR-011**: Início MUST exibir 4 KPIs: Presença Geral, Média geral (com seleção de bimestre/período), Total de faltas geral, Total de ocorrências — calculados com as mesmas regras do Diário/Fechamento/Painel (critério por dia/aula, FJ, período ativo).
- **FR-012**: Início MUST exibir os cards Comunicados Recentes (3 últimos: título, data, descrição + "Ver Todos" → Comunicados), Média do Bimestre por Disciplina (filtro bimestre + "Ver Todos" → Boletim) e Ocorrências Recentes (3 últimas: título, data, descrição + "Ver Todos" → Ocorrências).
- **FR-013**: Boletim MUST ter abas por bimestre conforme o Método de Avaliação do Ano Letivo; cada aba mostra tabela Disciplina × avaliações do método (respeitando "Limitar quantidade de avaliações") + Média.
- **FR-014**: Boletim MUST informar a média mínima do método em local visível e colorir notas/médias (verde ≥ mínima, vermelho < mínima) no padrão do Diário de Classe.
- **FR-015**: Frequência MUST ter 3 abas: Geral (Percentual de Presença + Total de aulas + Total de faltas + Limite de faltas derivado da frequência mínima do método), Por Disciplina Geral (Disciplina, Total de Aulas, Faltas, Presença com barra + %) e Disciplina por Bimestre (filtro de bimestre + mesmas colunas no recorte do bimestre).
- **FR-016**: Horários MUST exibir o quadro de aulas da turma do aluno (dias × horários, disciplina, profissional, intervalo e demais informações do quadro).
- **FR-017**: Ocorrências MUST filtrar por Todas (padrão) / Positivas / Negativas e listar somente ocorrências do aluno com `apresentar_no_portal = true`, cada item com ícone do tipo, título, data, descrição e badge.
- **FR-018**: Comunicados MUST ser listados como minicards (título, data, "Ver Comunicado") com modal de descrição; não visualizados têm sinalização de não lido, removida após a abertura.
- **FR-019**: Sistema MUST oferecer leitura de Comunicados a partir de entidade própria (`comunicados`: título, data, descrição, escola, escopo de visibilidade por turma/etapa ou geral); o responsável vê somente comunicados cujo escopo alcance a turma do aluno vinculado. A tela interna de emissão/postagem pela escola é OUTRA spec futura e NÃO faz parte desta — esta spec cria apenas a tabela + leitura do portal (carga inicial via SQL/manual).
- **FR-020**: Página Documentos MUST existir na Sidebar como placeholder "Em breve" (EmptyState oficial), sem listagem nem download nesta versão; conteúdo real em spec futura.
- **FR-021**: Recuperação de senha é SOMENTE pela secretaria (redefinição no cadastro, spec 022); o portal NÃO oferece "Esqueci minha senha" e orienta o responsável a procurar a escola em caso de bloqueio.
- **FR-022**: Sistema MUST auditar os eventos do portal (login, aceite do termo com versão, troca de aluno visualizado opcional) sem persistir senhas ou dados sensíveis nos snapshots, seguindo o framework de auditoria vigente (spec 017).

### Key Entities

- **Responsável (people + credencial portal)**: `people.portal_acesso_habilitado`, credencial Auth com `portal_only=true` (base da spec 022); novo atributo de aceite do termo (data/hora + versão).
- **Vínculo responsável↔aluno (`responsavel_alunos`)**: 1..N vínculos ativos; única fonte de quais alunos o responsável pode ver.
- **Termo de Uso e Política de Privacidade**: conteúdo versionado + registro de aceite (responsável, versão, data/hora).
- **Contexto de visualização**: aluno selecionado + matrícula/turma vigente; governa todas as páginas do portal.
- **Comunicado** (`comunicados`, entidade NOVA desta spec): aviso da escola (título, data, descrição, escola, escopo por turma/etapa ou geral); emissão/postagem interna em spec futura separada.
- **Leitura de comunicado**: marcação responsável × comunicado (base da sinalização não lido/lido).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Responsável com credencial válida conclui login + aceite (1º acesso) + seleção do aluno em até 3 minutos sem ajuda da escola.
- **SC-002**: 100% dos acessos a dados ocorrem somente após aceite da versão vigente do termo; auditoria comprova data/hora/versão de cada aceite.
- **SC-003**: 0 vazamentos de dados entre alunos: responsável nunca visualiza dados de aluno sem vínculo ativo (incluindo acesso direto por URL), verificado por teste de penetração funcional.
- **SC-004**: KPIs, boletim e frequência do portal conferem 100% com os valores do Diário de Classe/Fechamento para os mesmos alunos/períodos (amostra de homologação).
- **SC-005**: Portal utilizável em celular (viewport 360px) sem scroll horizontal e sem perda de função em todas as 7 páginas.
- **SC-006**: `npx tsc --noEmit` e `npx next build` verdes após a implementação.

## Assumptions

- Credencial e flag de acesso vêm da spec 022 (`people.portal_acesso_habilitado`, Auth `portal_only=true`, `user_schools`); esta spec não recria provisionamento.
- Cálculos acadêmicos reutilizam o motor existente: `calcularDesempenhoAluno` (notas/médias), critério de frequência por dia/aula com FJ, período ativo via `data_saida`, horários ativos do quadro (correção da spec 021), média/frequência mínima do método de avaliação.
- Turmas com avaliação não-numérica seguem o comportamento da spec 021 (bloqueio explicativo, sem tabela numérica).
- Ocorrências do portal vêm do schema real de produção (`apresentar_portal=true`, vínculo N:N via `ocorrencias_alunos`); descrições longas podem ser truncadas nos cards com leitura completa na página/modal.
- Bimestres do Boletim/Frequência derivam dos Períodos Avaliativos do calendário (padrão da spec 021), com fallback para `quantidade_periodos_numerico`.
- Sessão do portal é independente da sessão interna (profissional logado no sistema não herda acesso ao portal e vice-versa).
- Responsável multi-tipo (Profissional + Responsável) usa cada credencial no seu respectivo acesso.
- "Limite de faltas" = (100% − frequência mínima do método) aplicado sobre o total de aulas registradas até o momento.
- "Total de faltas geral" e "Total de ocorrências" do Início referem-se ao ano letivo vigente do aluno.
- Auditoria segue o padrão best-effort vigente (não bloqueia a operação).
- Migrations aplicadas manualmente via SQL Editor (sem CLI Supabase), padrão do projeto.
- Emissão/postagem de Comunicados pela escola (tela interna) é spec futura separada (decisão Q2); esta spec cria a tabela + leitura do portal, com carga inicial via SQL manual para homologação.
- Sem "Esqueci minha senha" no portal (decisão Q3); redefinição somente pela secretaria via spec 022.
- Página Documentos é placeholder "Em breve" (decisão Q1); conteúdo real em spec futura.
