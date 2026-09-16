# Feature Specification: Turmas — Ajustes e Alinhamento Censo 2026

**Feature Branch**: `029-turmas-ajustes-censo-2026`

**Created**: 2026-09-15

**Status**: Implemented — pendente QA manual (aplicar M-01/M-02/M-03 via SQL Editor + executar `quickstart.md`; T004/T005/T016b/T017 em `tasks.md`)

**Input**: User description: "Tela de Turmas — Ajustes: agrupar filtros de tipo sob título 'Tipo'; tabela full-width com header de contraste; destaque nos títulos dos modais; pills 'Turma de:' + renomear para 'Educação Especial'; alinhar pill Multietapa; Etapa Agregada bloqueada/nula salvo Curricular/Curricular+Complementar, só agregadas ativas, validação cruzada Tipo x Etapa pela Tabela de Etapas 2026; remover Modalidade (modal, banco, Censo); reagrupar Etapas por Etapa Agregada oficial; Formas de Organização e Disciplinas em 4 colunas + 'Selecionar Todas'; modal Profissional com Calendar padrão, 'Selecionar Todas', inativação com Data de Término (preserva histórico) e ConfirmDialog na exclusão; card condicional Atividades Complementares (select por Área/Subárea, add até 6, códigos 1–6 na exportação); profissional de turma complementar vincula atividades, não disciplinas. Fontes oficiais: `documentacao_interna/Censo Escolar/Arquivos do INEP/2026/Matricula Inicial/v4/Tabelas Auxiliares/Tabela de Etapas 2026.xlsx` e `Tabela de Tipo de Atividade Complementar 2026.xlsx`."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela tem um objetivo principal: cadastrar turmas válidas para o Censo Escolar com o menor atrito possível, bloqueando combinações inválidas já na digitação.
- **PE-102** — Filtros rotulados ("Tipo"), tabela legível (header full-width com contraste) e títulos de modal com hierarquia comunicam a estrutura sem exploração.
- **PE-201** — Hierarquia do modal segue o Registro 20: Identificação → Turno → Dias → Tipo → (Atividades Complementares quando aplicável) → Configurações/Etapa → Organização → Disciplinas → Profissionais.
- **PE-204** — Cards condicionais (Organização Curricular, Atividades Complementares, Eixo, Multietapa) só aparecem quando o Tipo/Mediação/Etapa os exige (divulgação progressiva).
- **PE-205** — "Selecionar Todas" e o modelo select+Adicionar (atividades) reduzem cliques repetitivos; validações cruzadas (Tipo × Etapa, limite de 6, sem duplicadas) dão feedback imediato via `toast.error`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cadastrar turma curricular com validação oficial (Priority: P1)

A secretária abre Turmas, clica em "Nova Turma", preenche Identificação (pills "Turma de:"), Turno, Dias, Tipo "Curricular", escolhe Etapa Agregada (só agregadas com etapa ativa na escola/ano) e Etapa (só etapas habilitadas para Presencial+Curricular pela matriz oficial), marca Forma de Organização (4 colunas), usa "Selecionar Todas" nas Disciplinas e salva. Combinação inválida (ex.: etapa de EJA com mediação Presencial em tipo Curricular fora da matriz) é bloqueada com mensagem objetiva.

**Why this priority**: É o fluxo central da tela e o que garante conformidade com o Censo 2026. Entrega valor sozinha.

**Independent Test**: Criar turma Curricular Presencial com etapa 15 (2º Ano EF) e salvar; tentar salvar com etapa incompatível e verificar o bloqueio com mensagem.

**Acceptance Scenarios**:

1. **Given** modal Nova Turma, **When** exibe o Card Identificação, **Then** as pills "Bilíngue de Surdos", "Formação por Alternância" e "Educação Especial" estão agrupadas sob o título "Turma de:".
2. **Given** Tipo "Curricular" + mediação "Presencial", **When** abre o select de Etapa, **Then** só lista etapas habilitadas pela matriz oficial (ex.: 14–21, 41 para agregada 302) dentre as ativas da escola/ano.
3. **Given** Tipo "AEE" ou "Atividade Complementar" (puro), **When** visualiza Configurações, **Then** Etapa Agregada está desabilitada e nula.
4. **Given** Card Disciplinas, **When** ativa "Selecionar Todas", **Then** todas as pills de disciplinas ficam marcadas; desativar desmarca todas.
5. **Given** Tipo × Etapa incompatível (ex.: Presencial + Curricular + etapa 35–38 fora de tipo 9, ou Normal/Magistério em tipo 9), **When** tenta salvar, **Then** salvamento é bloqueado com `toast.error` objetivo.

---

### User Story 2 - Turma de Atividade Complementar de ponta a ponta (Priority: P1)

A secretária cria turma tipo "Atividade Complementar", vê o card "Atividades Complementares", seleciona atividades no select (agrupadas por Área/Subárea, só nomes) clicando Adicionar até 6, sem repetir. Adiciona profissional: o modal mostra "Atividades Complementares do Profissional" (não Disciplinas). Na exportação do Censo, os códigos ocupam Código 1–6 em ordem, excedentes nulos.

**Why this priority**: É a maior lacuna funcional atual (atividades só existem na tabela `classrooms` de staging; `turmas` não tem o dado e o export não emite).

**Independent Test**: Criar turma complementar com 3 atividades, vincular profissional a 2 delas, gerar Registro 20 e conferir `atividade_complementar_1..3` = códigos em ordem e `_4..6` vazios.

**Acceptance Scenarios**:

1. **Given** Tipo "Atividade Complementar" ou "Curricular com Atividade Complementar", **When** o modal renderiza, **Then** o card "Atividades Complementares" está visível; com outros tipos, está oculto.
2. **Given** card visível, **When** seleciona atividade e clica Adicionar, **Then** ela entra na lista (máx. 6); repetir a mesma atividade é recusado com mensagem; remover libera vaga.
3. **Given** select de atividades, **When** aberto, **Then** opções agrupadas por Área e Subárea exibindo só o Nome (sem códigos).
4. **Given** turma de Atividade Complementar, **When** abre Adicionar Profissional, **Then** não há campo de Disciplinas; há "Atividades Complementares do Profissional" restrito às atividades da turma.
5. **Given** turma com 3 atividades, **When** exporta Registro 20, **Then** Código 1–3 preenchidos em ordem de adição e 4–6 nulos.

---

### User Story 3 - Gerir vínculo do profissional com histórico (Priority: P2)

O gestor inativa o vínculo do professor que saiu da escola informando a Data de Término (Calendar padrão): o registro é mantido (`ativo=false`), preservando tudo que ele lançou. Exclusão pela lixeira pede confirmação no `ConfirmDialog` oficial (nunca `confirm()` nativo) e só deve ser usada para lançamento indevido.

**Why this priority**: Preserva integridade histórica (frequência, notas, pareceres vinculados ao profissional); P2 porque o fluxo atual (excluir) funciona, mas destrói histórico.

**Independent Test**: Inativar vínculo com data de término e verificar badge "Inativo" + registros do profissional intactos; clicar na lixeira e verificar o `ConfirmDialog` oficial.

**Acceptance Scenarios**:

1. **Given** profissional vinculado, **When** inativa com Data de Término, **Then** vínculo fica `ativo=false` + `data_encerramento` preenchida; diário/notas do profissional permanecem consultáveis.
2. **Given** Data de Início/Término, **When** o campo é exibido, **Then** usa Popover+Calendar padrão do sistema (não input nativo).
3. **Given** clique na lixeira do profissional, **When** o diálogo abre, **Then** é o `ConfirmDialog` oficial com variante destrutiva.
4. **Given** modal do profissional, **When** há disciplinas da turma, **Then** "Selecionar Todas" marca/desmarca todas.

---

### User Story 4 - Estrutura de Etapas alinhada à tabela oficial (Priority: P2)

A escola ativa etapas em Gestão Acadêmica → Estrutura Acadêmica → Etapas vendo os grupos oficiais 2026 (Infantil; Fundamental Anos Iniciais/Finais; Multi e Correção de Fluxo; Médio; Médio Normal/Magistério; EJA; Técnico e Qualificação Profissional), com códigos 69/70 corrigidos e 64 no grupo técnico.

**Why this priority**: Sem os grupos/códigos corretos, a validação Tipo × Etapa (US1) opera sobre base errada.

**Independent Test**: Abrir a aba Etapas e conferir os 7 grupos, nomes oficiais e códigos INEP (incl. 69=iniciais, 70=finais, 64 em Técnico).

**Acceptance Scenarios**:

1. **Given** aba Etapas, **When** renderiza, **Then** exibe os 7 grupos oficiais com as etapas e códigos da Tabela de Etapas 2026.
2. **Given** catálogo interno, **When** comparado à planilha, **Then** 69 = anos iniciais, 70 = anos finais, 64 = agregada 308.

### Edge Cases

- Turma tipo 9 (Curricular + Complementar) com agregada 305 (Normal/Magistério): matriz oficial deixa habilitadas em branco → nenhuma etapa habilitada → salvamento bloqueado com mensagem.
- EAD + Curricular + 305 [35–38]: permitido pela planilha (entrada ausente no código atual) → passa a validar.
- Semipresencial só permite Curricular+EJA [69,70,71,72]; qualquer outra etapa é bloqueada.
- Atividade complementar com nome vazio na planilha (15002, 15003, 19101, 19104, 19105, 22032): excluídas do catálogo semeado.
- Turma complementar sem nenhuma atividade: bloqueada na validação Registro 20 (regra já existente, passa a funcionar).
- Profissional inativado que retorna: permitir reativar (limpa `data_encerramento`) — a decidir na execução (proposta: sim, via mesma ação).
- Turmas existentes com `modalidade` preenchida: migração descarta a coluna; inventário de impacto cobre dashboard (abaixo).
- Códigos 30–34 (Técnico Integrado 1ª–4ª série + não seriada, coluna "Filtro" da planilha): confirmar na execução se entram no catálogo; default = incluir se constarem como etapas válidas 2026.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Filtros de tipo (Todos, AEE, Curricular, Atividade Complementar) MUST ficar agrupados sob o título "Tipo" no Card de Filtros.
- **FR-002**: Tabela de turmas MUST ocupar 100% da largura (sem `px-4` lateral no wrapper) e o header MUST ter fundo sólido `bg-muted` com texto `text-foreground` (contraste AA, sem hex).
- **FR-003**: Títulos dos modais (Nova/Editar Turma, Adicionar/Editar Profissional) MUST seguir Regra #10 (`font-display text-[20px] font-semibold`).
- **FR-004**: Pills "Bilíngue de Surdos", "Formação por Alternância", "Educação Especial" (renomeada, só rótulo) MUST ficar sob o título "Turma de:".
- **FR-005**: Pill "Multietapa" MUST alinhar verticalmente com o campo vizinho (grade `items-end` ou altura equalizada).
- **FR-006**: Etapa Agregada MUST ficar desabilitada e nula quando Tipo ∉ {Curricular, Curricular com Atividade Complementar} — inclusive no payload/export do Censo.
- **FR-007**: Etapa Agregada e Etapa de Ensino MUST listar apenas opções derivadas das etapas **ativas** da escola+ano letivo.
- **FR-008**: Sistema MUST validar Tipo × Etapa (mediação + tipo + agregada + etapa) contra a matriz oficial `Tipo de turma X Etapa` no salvamento e na filtragem de opções.
- **FR-009**: Campo Modalidade MUST ser removido do modal, das actions/tipos, do banco (`DROP COLUMN`) e de qualquer referência; **NÃO** integra o Registro 20 (export já não o usa). Gráfico "alunos por modalidade" do dashboard MUST ser removido junto (decisão: exclusão total — ver Assumptions).
- **FR-010**: Tela de Etapas MUST exibir os 7 grupos oficiais 2026 com nomes/códigos da planilha.
- **FR-011**: Cards Formas de Organização e Disciplinas MUST usar 4 colunas (`grid-cols-2 md:grid-cols-4`); label "Grupos Não Seriados" (sem "(art. 23 da LDB)", valor preservado).
- **FR-012**: Cards Disciplinas e Disciplinas-do-Profissional MUST ter toggle "Selecionar Todas" (marca/desmarca tudo no escopo filtrado).
- **FR-013**: Data de Início (e Término) do vínculo MUST usar Popover+Calendar padrão (`captionLayout="dropdown"`, `ptBR`).
- **FR-014**: Lixeira do profissional MUST abrir `ConfirmDialog` oficial (variante destrutiva); `confirm()` nativo é proibido.
- **FR-015**: Inativação de vínculo MUST pedir Data de Término e gravar `ativo=false` + `data_encerramento` (sem delete; histórico preservado).
- **FR-016**: Card "Atividades Complementares" MUST aparecer só para tipos Atividade Complementar / Curricular+Complementar; select agrupado por Área/Subárea (só nomes) + Adicionar; máx. 6; sem duplicadas.
- **FR-017**: Exportação Registro 20 MUST emitir `atividade_complementar_1..6` com os códigos em ordem de adição, nulos nos excedentes.
- **FR-018**: Modal do profissional em turma de Atividade Complementar MUST exibir "Atividades Complementares do Profissional" (restrito às da turma) em vez de Disciplinas.
- **FR-019**: Catálogo de etapas interno MUST refletir a planilha oficial: 69=iniciais, 70=finais, 64→308; matriz de compatibilidade com EAD+305 e tipo 9 sem 56/305.
- **FR-020**: Mapa canônico rótulo→código INEP MUST centralizar conversões de Tipo de Turma e Forma de Organização para validação/export (sem migração de dados legados).

### Key Entities

- **Turma (estendida)**: `atividade_complementar_1..6 VARCHAR(3)` (ordem de adição); `etapa_agregada` nula fora de Curricular/9; sem `modalidade`.
- **Vínculo profissional (estendido)**: `atividades_ids TEXT[]` (códigos de atividade da turma; alternativo a `disciplinas_ids`); `ativo` + `data_encerramento` para inativação com histórico.
- **Catálogo de Atividades Complementares**: `{ codigo, nome, area, subarea }` semeado da planilha oficial (~150 itens, nomes vazios excluídos); UI mostra só `nome`.
- **Matriz Tipo × Etapa**: `(tipo_mediacao, tipo_turma, etapa_agregada) → etapas habilitadas`, espelho da aba `Tipo de turma X Etapa` (incl. EAD+305; tipo 9 sem 56/305; 305-tipo-9 = vazio/bloqueado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das turmas salvas passam na validação Registro 20 de Tipo × Etapa sem falso-positivo/negativo contra a matriz oficial (amostra cobre os 4 tipos × 3 mediações).
- **SC-002**: Turma complementar com N≤6 atividades exporta Códigos 1..N corretos em ordem e N+1..6 nulos; tentativa de 7ª ou duplicada é recusada na UI.
- **SC-003**: Zero ocorrências de `modalidade` em `src`, migrations pendentes e dashboard após a conclusão (`grep` limpo, salvo docs históricos de specs antigas).
- **SC-004**: Vínculo inativado mantém diário/notas/pareceres do profissional consultáveis; lixeira sempre abre `ConfirmDialog` (zero `confirm()` nativo no módulo).
- **SC-005**: `tsc --noEmit` + `next build` verdes; 0 hex hardcoded; 0 novas deps npm.

## Assumptions

- Exclusão total da Modalidade (decisão do solicitante seguindo recomendação): remove coluna do banco, coluna da tabela de Turmas, validações/gates, gráfico "alunos por modalidade" do dashboard (`dashboard.ts` + `alunos-por-modalidade-chart.tsx` + uso em `(auth)/page.tsx`) e citações em specs antigas ficam como registro histórico (não reescrever specs 003/006).
- Derivação rótulo→código (sem migração de dados): `tipos_turma` e `forma_organizacao` continuam gravados como hoje; conversão acontece na validação/export via mapa canônico.
- Catálogo de atividades como `src/data/censo/atividades-complementares.ts` versionado (não tabela no banco): a tabela muda 1×/ano via portaria; versionar no código facilita diff/auditoria. Se o volume de consulta preocupar, pode virar seed SQL futuro — fora desta spec.
- Linha "Escolarização" e códigos 30–34 da planilha: verificar na execução (ver Edge Cases); default = ignorar "Escolarização" se for artefato de layout, incluir 30–34 se etapas válidas.
- Migrations aplicadas via SQL Editor (sem CLI Supabase, padrão do projeto); auditoria automática existente cobre as escritas.
- Fora de escopo: reagrupamento visual de outras telas; substituição do gráfico de modalidade por outro agrupamento; reativação de vínculo (proposta incluída, a confirmar na execução); migração de `tipos_turma`/`forma_organizacao` legados para códigos.
