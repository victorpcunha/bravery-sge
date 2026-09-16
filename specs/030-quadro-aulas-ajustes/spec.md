# Feature Specification: Quadro de Aulas — Ajustes + Aulas Extras

**Feature Branch**: `030-quadro-aulas-ajustes`

**Created**: 2026-09-15

**Status**: Implemented — pendente QA manual (aplicar `patch_quadro_aulas_extras.sql` via SQL Editor + executar `quickstart.md`)

**Input**: User description: "Tela de Quadro de Aulas — Ajustes: Card de Quantidade de Quadros (header full-width, contraste dos títulos, editar com lápis); bug Status 'Futuro' (quadro 09/02/2026–11/12/2026 exibido Futuro em 30/08/2026 — investigar lógica); Editar Quadro (botão Excluir ao lado de Voltar; remover 'Grupo 1/2/3'; Datas em Calendar padrão; Identificação 5 colunas responsivo; subcard 'Intervalos' com Adicionar acima do vazio); Card Quadro de Aulas (contraste dias, separação entre colunas, mensagem de conflito sem segundos + wrap); conflito do professor só contra quadros com vigência sobreposta; novo card 'Aulas Extras' pós-grade (dias letivos extras do Calendário da Etapa, Adicionar Aula com início/fim/disciplina/professor, múltiplas aulas + intervalos por data, excluir por aula; sincronização com Calendário com modal/bloqueio por frequência; integração com Diário de Classe)."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela tem um objetivo principal: montar a grade semanal da turma e, agora, as aulas de dias letivos extras, sem atrito e sem bloqueios indevidos.
- **PE-102** — Headers full-width com contraste, separação visível entre dias e mensagens de erro legíveis (sem segundos, com quebra de linha) comunicam a estrutura sem exploração.
- **PE-201** — Ordem do formulário segue o fluxo mental: Identificação (quando/quanto tempo) → gerar grade → atribuir aulas → intervalos → aulas extras.
- **PE-204** — Card "Aulas Extras" só lista dias que realmente existem como `dia_letivo` extra no Calendário da Etapa (divulgação progressiva: sem extras no calendário, sem blocos).
- **PE-205** — Validação de conflito por sobreposição de vigência evita o bloqueio indevido de quadros sequenciais; mensagens objetivas via `toast.error` + alerta inline na célula.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Listagem legível com status correto (Priority: P1)

A secretária abre Quadro de Aulas e vê a tabela ocupando 100% da largura do card, títulos com contraste, status condizente com a vigência (quadro 09/02/2026–11/12/2026 aparece **Ativo** em 30/08/2026) e o botão de editar com o lápis padrão do sistema.

**Why this priority**: É a porta de entrada do módulo; o status errado hoje mina a confiança no dado. Entrega valor sozinha.

**Independent Test**: Abrir `/gestao-turmas/quadro-aulas` com um quadro vigente e conferir largura, contraste, status "Ativo" e ícone de lápis.

**Acceptance Scenarios**:

1. **Given** listagem com quadros, **When** renderiza o card, **Then** a linha de títulos ocupa 100% da largura (sem `px-4` lateral) e os títulos têm `text-foreground font-semibold` sobre `bg-muted`.
2. **Given** quadro com vigência 09/02/2026–11/12/2026, **When** a data de referência (hoje) é 30/08/2026, **Then** o status exibido é **Ativo** (não Futuro).
3. **Given** quadro com `data_final` passada, **When** lista, **Then** status **Encerrado**; com `data_inicial` futura → **Futuro**; com `status='inativo'` manual → **Inativo** (preservado).
4. **Given** coluna Ações, **When** visualiza, **Then** o botão de editar usa o ícone `Pencil` (padrão do sistema), mantendo a lixeira `Trash2 text-destructive`.

---

### User Story 2 - Edição com formulário padrão (Priority: P1)

O gestor edita um quadro: encontra "Excluir" ao lado de "Voltar", Identificação sem "Grupo 1/2/3" em 5 colunas, datas no Calendar padrão, subcard "Intervalos" com o botão acima do texto de vazio e grade com dias destacados e separados.

**Why this priority**: É onde o tempo de configuração é gasto; padronização reduz erro operacional.

**Independent Test**: Editar um quadro existente e percorrer Identificação → Intervalos → grade conferindo cada ajuste.

**Acceptance Scenarios**:

1. **Given** tela de edição, **When** renderiza o topo, **Then** há "Excluir" à direita de "Voltar" (só em edição), abrindo `ConfirmDialog` destrutivo; confirmar exclui e volta à listagem.
2. **Given** Card Identificação, **When** renderiza, **Then** não há "Grupo 1"/"Grupo 2"/"Grupo 3 — Intervalos"; todos os campos estão no card, com "Intervalos" como subcard sem numeração.
3. **Given** campos de vigência, **When** edita datas, **Then** usa o `DatePicker` padrão (não `Input type="date"` nativo), respeitando min/max do ano letivo.
4. **Given** Card Identificação em desktop, **When** renderiza, **Then** são 5 colunas (Tempo de Aula na mesma linha); em telas menores reduz para 2 e depois 1 coluna.
5. **Given** sem intervalos, **When** visualiza o subcard, **Then** o botão "Adicionar Intervalo" está acima do texto "Nenhum intervalo cadastrado" (não no topo direito).
6. **Given** grade semanal, **When** renderiza, **Then** dias têm destaque (`text-foreground font-semibold uppercase`) e há separação visível entre colunas (`border-l`); mensagem de conflito exibe `HH:MM às HH:MM` (sem segundos) com quebra de linha e sem estourar a célula.

---

### User Story 3 - Conflito de professor por sobreposição de vigência (Priority: P1)

A secretária cria o quadro do 2º semestre após encerrar o do 1º semestre, reutilizando o mesmo professor nos mesmos horários: o sistema **não** bloqueia (vigências não se sobrepõem). Se tentar sobrepor vigências com o mesmo professor no mesmo dia/horário, bloqueia com a mensagem formatada.

**Why this priority**: Regra atual gera bloqueios indevidos em sequência de quadros — impede operação normal da escola.

**Independent Test**: Criar quadro sequencial (após `data_final` do anterior) com mesmo professor/horário → salva; criar com vigência sobreposta → conflito exibido e salvamento bloqueado.

**Acceptance Scenarios**:

1. **Given** quadro A vigente até 30/06 e novo quadro B a partir de 01/07 com mesmo professor/dia/horário, **When** valida, **Then** nenhum conflito é apontado e o salvamento prossegue.
2. **Given** quadro A vigente até 30/06 e novo quadro B a partir de 15/06 com mesmo professor/dia/horário sobreposto, **When** valida, **Then** conflito é apontado (`Professor … já possui aula na … das 09:10 às 10:00 na turma …`) e `handleSalvar` bloqueia.
3. **Given** conflito apontado, **When** exibe a mensagem, **Then** horários sem segundos e texto com quebra de linha (`break-words`, largura limitada).

---

### User Story 4 - Aulas Extras de dias letivos (sábados) (Priority: P2)

A coordenação marcou sábados letivos no Calendário da Etapa; a secretária abre o quadro da turma e encontra o card "Aulas Extras" com um bloco por sábado, adiciona 2 aulas (manhã/tarde) + intervalo num deles, exclui uma aula errada; o professor lança frequência dessas aulas no Diário normalmente. Novo sábado criado depois no Calendário aparece sozinho; sábado removido do Calendário sem frequência pede confirmação; com frequência, é bloqueado com alerta.

**Why this priority**: Sem isso, dias extras não têm grade nem frequência por aula — lacuna funcional real. P2 porque a grade semanal (fluxo principal) funciona sem ela.

**Independent Test**: Com sábado letivo no calendário, configurar aula extra, lançar frequência no Diário, remover o sábado do calendário (bloqueio) e excluir a frequência + remover (confirmação e remoção).

**Acceptance Scenarios**:

1. **Given** etapa da turma com eventos `dia_letivo` em sábados, **When** abre a edição do quadro, **Then** o card "Aulas Extras" lista um bloco por data extra, após o Card "Quadro de Aulas".
2. **Given** bloco de data extra, **When** clica "Adicionar Aula", **Then** configura início, término, disciplina (da grade da turma) e professor (vinculado à turma/disciplina); múltiplas aulas por data são permitidas.
3. **Given** aula extra adicionada, **When** clica a lixeira da aula, **Then** ela é removida (só ela).
4. **Given** novo sábado letivo criado no Calendário após a configuração, **When** reabre o quadro, **Then** a nova data aparece automaticamente no card.
5. **Given** sábado removido do Calendário sem frequência lançada, **When** reabre/salva, **Then** `ConfirmDialog` padrão confirma a remoção do bloco + aulas.
6. **Given** sábado removido do Calendário com frequência lançada, **When** tenta remover, **Then** bloqueio com alerta ("exclua primeiro a frequência no Diário de Classe").
7. **Given** aulas extras configuradas, **When** o professor abre o Diário da turma, **Then** as aulas aparecem para lançamento de frequência como as regulares.

### Edge Cases

- Quadro com `status='inativo'` manual e vigência vigente: listagem mostra **Inativo** (manual prevalece sobre o cálculo).
- Quadro sem `data_inicial/final` (legado): status cai para **Futuro** (fallback atual, sem quebrar).
- Comparação de datas sempre por string `YYYY-MM-DD` (nunca `new Date()`), evitando shift UTC que motivou a suspeita do bug.
- Turma multietapa: união dos dias extras das etapas vinculadas.
- Dia extra que cai em dia de semana já coberto pela grade: incluído mesmo assim (é letivo extra além da recorrência) — a decidir na execução se filtra seg–sex (proposta: incluir, pois o evento marca excepcionalidade).
- `updateQuadroAula` hoje soft-inativa horários (`ativo=false`) e reinsere — extras seguem o mesmo padrão para não quebrar o filtro "só ativos" da frequência.
- Frequência `FJ` e filtro de horários ativos: reaproveitar a semântica de `calcularFrequenciaBoletim` onde aplicável.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tabela da listagem MUST ocupar 100% da largura do card (remover `px-4` lateral em `quadro-aulas/page.tsx:188`) com header `bg-muted` + títulos `text-foreground font-semibold`.
- **FR-002**: Coluna Ações da listagem MUST usar `Pencil` no editar (trocar `Eye` em `page.tsx:225-229`); lixeira permanece `Trash2 text-destructive`.
- **FR-003**: Status exibido na listagem MUST ser calculado de `data_inicial/data_final` vs hoje (`hoje<inicial→Futuro; hoje>final→Encerrado; senão Ativo`), com `inativo` manual preservado — corrige o caso 09/02/2026–11/12/2026 em 30/08/2026.
- **FR-004**: Tela de edição MUST ter botão "Excluir" à direita de "Voltar" (só com `editId`), via `ConfirmDialog` + `deleteQuadroAula(id, pessoaId)` existentes; sucesso redireciona à listagem.
- **FR-005**: Rótulos "Grupo 1", "Grupo 2", "Grupo 3 — Intervalos" MUST ser removidos; campos unificados no `FormCard "Identificação"`; intervalos como subcard "Intervalos" sem numeração.
- **FR-006**: "Data Inicial"/"Data Final" MUST usar o `DatePicker` padrão (`components/ui/date-picker.tsx`, com `minDate/maxDate` do ano letivo), não `Input type="date"` nativo.
- **FR-007**: Card Identificação MUST usar 5 colunas em desktop (`lg:grid-cols-5`) com "Tempo de Aula" na mesma linha; responsivo (`grid-cols-1 md:grid-cols-2`) em telas menores.
- **FR-008**: Com zero intervalos, o botão "Adicionar Intervalo" MUST ficar acima do texto "Nenhum intervalo cadastrado" (não no topo direito do subcard).
- **FR-009**: Cabeçalhos dos dias da grade MUST ter destaque (`bg-muted text-foreground font-semibold uppercase text-[13px] tracking-wider`) e separação visível entre colunas (`border-l border-border`).
- **FR-010**: Mensagem de conflito MUST formatar `HH:MM` (`.slice(0,5)`, sem segundos) e permitir quebra de linha (`break-words whitespace-normal max-w`), sem largura excessiva.
- **FR-011**: `validarConflitosProfessor` MUST considerar apenas quadros cuja vigência se sobrepõe ao período do quadro em edição (`novaFim < existenteInicio || novaInicio > existenteFim → pular`), além dos filtros atuais (`ativo=true`, `status!=='inativo'`, `ignoreQuadroId`) — decisão registrada: **sobreposição de períodos**.
- **FR-012**: Novo card "Aulas Extras" MUST existir após o Card "Quadro de Aulas" na edição, com um bloco por data `dia_letivo` extra do Calendário da Etapa da turma (derivação em tempo real; dias vazios não persistidos) — decisão registrada: **nova tabela dedicada**.
- **FR-013**: Cada data extra MUST permitir múltiplas aulas (início, término, disciplina da turma, professor vinculado) + intervalos por data (mesmo padrão/limite 3) + exclusão individual por aula.
- **FR-014**: Nova data extra no Calendário MUST aparecer automaticamente no card; data removida do Calendário sem frequência MUST pedir `ConfirmDialog`; com frequência lançada MUST bloquear com alerta orientando excluir a frequência no Diário primeiro.
- **FR-015**: Aulas extras MUST aparecer no Diário (`getAulasDaTurma`, `listarDiasComAula`) para lançamento de frequência idêntico ao das regulares.

### Key Entities

- **Quadro de aula (leitura)**: status passa a ser **derivado** (`resolverStatusQuadro`) — coluna `status` vira legado, sem migration.
- **Data extra**: `quadro_aulas_datas_extras(quadro_aula_id CASCADE, data_aula DATE, intervalos JSONB, UNIQUE(quadro, data))` — bloco por dia letivo extra.
- **Aula extra**: `quadro_aulas_extras_horarios(data_extra_id CASCADE, horario_inicial/final TIME, disciplina_id→matriz, professor_id→people, ativo)` — espelha `quadro_aulas_horarios` + índice de conflito `(professor_id, data_aula)`.
- **Dia letivo extra (origem)**: `academico_calendario_eventos tipo='dia_letivo'` do calendário do `ano_letivo_id` da turma, filtrado por etapa (`etapas` vazio = todas; senão match código/id) — padrão `boletim.ts:listarPeriodosAvaliativos`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quadro 09/02/2026–11/12/2026 exibe **Ativo** com referência em 30/08/2026; matriz Futuro/Ativo/Encerrado/Inativo validada nos 4 casos.
- **SC-002**: Quadro sequencial (pós-`data_final` do anterior, mesmo professor/horário) salva sem conflito; sobreposto bloqueia com mensagem `HH:MM` + wrap.
- **SC-003**: Sábado letivo configurado no card aparece no Diário e aceita frequência; remoção do sábado sem frequência pede confirmação; com frequência bloqueia com alerta.
- **SC-004**: `tsc --noEmit` + `next build` verdes; 0 hex hardcoded; 0 novas deps npm; 1 migration nova aplicada via SQL Editor.

## Assumptions

- Decisões do solicitante (via questionário): status **calculado na listagem** (dúvida registrada — proposta detalhada no plano; coluna vira legado); aulas extras em **nova tabela dedicada**; conflito por **sobreposição de períodos**.
- Toda turma tem Etapa → Calendário → Ano Letivo (garantia do solicitante; sem fallback "sem calendário" além do já existente).
- Só dias `tipo='dia_letivo'` fora da recorrência seg–sex alimentam o card (dias de semana regulares seguem na grade; decidir na execução se inclui extras em dia de semana).
- Frequência das extras usa `registrarFrequenciaAula/Lote` por `horario_id+data_aula` sem mudança; `UNIQUE(horario,aluno,data)` com UUIDs distintos não colide.
- Boletim/Rendimento/Fechamento contam `horario_id ∈ horarios ativos do quadro` — incluir ids extras ou documentar follow-up na execução.
- Migrations aplicadas via SQL Editor (sem CLI Supabase, padrão do projeto); auditoria automática existente cobre as escritas do quadro.
