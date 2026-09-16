# Feature Specification: Estrutura Acadêmica — Matrizes: Ajustes

**Feature Branch**: `032-matrizes-ajustes`

**Created**: 2026-09-16

**Status**: Draft — aguardando aprovação para implementação

**Input**: User description: "Tela Estrutura Acadêmica — Aba Matrizes — Ajustes: Filtros em Card de Filtros no padrão do sistema + filtro de Etapa no select padrão (sem spinners/hover estranho); Card Matrizes Curriculares com título em destaque e subcards ricos (ícone, descrição, ano letivo, início/término, etapa, turnos, tipo de turma, qtd disciplinas) expansíveis com disciplinas, sem duplicação e sem toggle de inativação; cadastro/edição em página própria (não modal) com Ano+Etapa+Subetapa / Método+Datas / Turnos+Tipo na mesma linha, fluxo sem reabrir (Card Períodos na sequência após Carga Horária); Card Períodos agrupado por Método (mantido), Adicionar Disciplina no topo à direita em tamanho correto; modal Adicionar Disciplina com título em destaque, só disciplinas ativas da escola (+tipo_ensino), Tipo travado automático (Base/Diversificada), toggle Desconsiderar virando 2 pills (Não reprova por nota/frequência) valendo no Diário, BNCC em grupos expansíveis todos recolhidos, checkbox desmarcado visível, Selecionar Todos + Limpar vermelho, botão Adicionar no rodapé; replicação renomeada para 'Replicar para os demais períodos' com modal de confirmação detalhado; investigar/corrigir bug de persistência por disciplina na edição."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A aba Matrizes tem um objetivo principal: configurar matrizes curriculares (identificação → carga horária → períodos → disciplinas/BNCC) sem atrito nem reaberturas.
- **PE-102** — Card de Filtros, subcards ricos e título em destaque comunicam a estrutura sem exploração; expansão mostra só as disciplinas daquela matriz.
- **PE-201** — Página de matriz segue o fluxo mental: Identificação → Carga Horária → Períodos → disciplinas; salvar cria e continua na mesma página (sem reabrir).
- **PE-204** — Divulgação progressiva: Card Períodos só após matriz existir; modal de disciplina só lista ativas da escola+etapa; BNCC recolhida por padrão, expande por grupo.
- **PE-205** — Validações objetivas via `toast.error` antes de qualquer escrita (descrição/ano/etapa/datas; disciplina obrigatória).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtros no padrão do sistema (Priority: P1)

O gestor abre a aba Matrizes e vê Escola (superadmin), Ano Letivo e Etapa agrupados dentro de um Card de Filtros (`PageSection compact + FilterBar`), com o filtro de Etapa em `Select` padrão com grupos (`SelectGroup/SelectLabel`) — sem spinners, sem a lista "subir/descer" no hover.

**Why this priority**: Filtros soltos e Etapa fora do padrão quebram a identidade e a usabilidade. Entrega valor sozinha.

**Independent Test**: Abrir a aba e comparar o card de filtros com o de outras listagens; passar o mouse nas opções de Etapa sem deslocamento da lista.

**Acceptance Scenarios**:

1. **Given** a aba Matrizes, **When** renderiza, **Then** os filtros estão dentro de `PageSection(compact, title="Filtros") + FilterBar` (não `div` solta), com labels `text-[14px]`.
2. **Given** o filtro de Etapa, **When** abre as opções, **Then** usa `SelectGroup + SelectLabel` por tipo de etapa (sem `<div>` dentro de `SelectContent`, sem `input[type=number]`, sem spinners).
3. **Given** os filtros, **When** troca escola/ano/etapa, **Then** a listagem recarrega como antes (sem regressão de dados/permissões).

---

### User Story 2 - Card Matrizes Curriculares com subcards ricos (Priority: P1)

A secretária vê o card "Matrizes Curriculares (N)" com título em destaque; cada matriz é um subcard com ícone, Descrição, Ano Letivo, Início e Término, Etapa de Ensino, Turnos, Tipo de Turma (Regular/Integral) e Quantidade de Disciplinas. Expandir mostra as disciplinas **daquela matriz** (agrupadas por período), sem duplicação/vazamento entre matrizes. Não há mais toggle de inativação no subcard (só Editar/Excluir).

**Why this priority**: É a leitura principal da aba; expansão com dados de outra matriz é defeito de confiança. Entrega valor sozinha.

**Independent Test**: Com 2+ matrizes expandidas, conferir que cada uma lista só as próprias disciplinas; conferir todos os campos do subcard.

**Acceptance Scenarios**:

1. **Given** a lista, **When** visualiza o card, **Then** o título usa o padrão de seção (`font-display text-[20px] font-semibold`) com contador.
2. **Given** uma matriz, **When** visualiza o subcard, **Then** exibe ícone de destaque (`GraduationCap` em pastilha `bg-primary/10`) + descrição + ano letivo + datas `pt-BR` + etapa + turnos + tipo de turma + qtd de disciplinas.
3. **Given** 2 matrizes expandidas, **When** visualiza as expansões, **Then** cada uma lista só as disciplinas dos seus próprios períodos (agrupadas por nome do período), sem itens da outra matriz e sem "Nenhum período configurado" fantasma.
4. **Given** o subcard, **When** visualiza as ações, **Then** há só Editar + Excluir (sem `Switch`); ano encerrado mantém o comportamento atual (só Excluir).
5. **Given** expandir, **When** carrega, **Then** loading por matriz e sem N+1 sequencial (batch/`Promise.all`).

---

### User Story 3 - Nova/Editar Matriz em página própria, sem reabrir (Priority: P1)

"Novo" abre uma página própria (empilhada na mesma aba, padrão abas internas) com o mesmo conteúdo do modal: Card Identificação (com o `Switch` Ativa/Inativa só aqui, na edição), Card Carga Horária e, na sequência, o Card Períodos — sem precisar salvar, sair e reabrir para continuar o preenchimento.

**Why this priority**: O fluxo atual (criar → reabrir para continuar) é o maior atrito do módulo. Entrega valor sozinha.

**Independent Test**: Criar matriz, preencher tudo e chegar aos períodos sem sair da página; recarregar/back preserva o padrão das abas internas.

**Acceptance Scenarios**:

1. **Given** clique em "Nova Matriz", **When** navega, **Then** abre rota própria empilhada na aba `estrutura-academica` (registrada em `tab-routes.tsx`, keep-alive da listagem preservado, máx. 6 abas respeitado) — sem `Dialog`.
2. **Given** a página, **When** visualiza a Identificação, **Then** Linha 1 = Ano Letivo | Etapa | Subetapa; Linha 2 = Método de Avaliação | Data Inicial | Data Final; Linha 3 = Turnos | Tipo de Turma (pills, como hoje).
3. **Given** criação, **When** salva a Identificação/Carga Horária, **Then** permanece na página (vira edição com id) e o Card Períodos aparece na sequência, pronto para preenchimento — sem sair/reabrir.
4. **Given** edição, **When** visualiza a Identificação, **Then** há o `Switch` Ativa/Inativa no Card Identificação (único lugar); a listagem não tem mais o toggle.
5. **Given** F5/reabrir, **When** recarrega, **Then** vale o padrão das abas internas (workspace reinicia no Dashboard; rotas de matriz seguem `useTabParams` se dinâmicas).

---

### User Story 4 - Card Períodos e replicação (Priority: P1)

O Card Períodos continua agrupando os períodos pelo Método de Avaliação vinculado (comportamento mantido). Cada período é um subcard expansível com o botão "Adicionar Disciplina" no **topo, à direita, em tamanho correto**. O botão de replicação chama-se **"Replicar para os demais períodos"** e abre confirmação explicando que disciplinas, desconsiderar-reprovação, carga horária e habilidades marcadas serão replicadas; confirmar aplica a todos os demais períodos.

**Why this priority**: Replicação é o acelerador do preenchimento; o botão 100% no fim do card e o nome genérico escondem a função. Entrega valor sozinha.

**Independent Test**: Replicar o 1º período e conferir disciplinas + configs nos demais; botão Adicionar no topo à direita.

**Acceptance Scenarios**:

1. **Given** o Card Períodos, **When** visualiza, **Then** os períodos seguem o Método vinculado na Identificação (regra atual mantida — ver FR-009 sobre quantidades).
2. **Given** um período expandido, **When** visualiza, **Then** "Adicionar Disciplina" está no topo do subcard, à direita, `size="sm"` (não `w-full`, não no fim).
3. **Given** o 1º período (com 2+ períodos), **When** visualiza, **Then** o botão chama-se "Replicar para os demais períodos".
4. **Given** clique em replicar, **When** abre a confirmação, **Then** o texto informa que disciplinas + desconsiderar-reprovação + carga horária + habilidades de cada disciplina serão replicadas para os demais períodos (`ConfirmDialog variant="warning"`).
5. **Given** confirmação, **When** executa, **Then** os demais períodos ficam com as mesmas disciplinas e configurações (via `replicarDisciplinas`, incluindo as pills do US6).

---

### User Story 5 - Modal Adicionar Disciplina (Priority: P1)

No modal (título em destaque), o profissional escolhe entre **só disciplinas ativas da escola** (compatíveis com a etapa via `tipo_ensino`); o campo **Tipo fica travado**, preenchido sozinho (Base Comum / Parte Diversificada) a partir do cadastro da disciplina. O toggle "Desconsiderar para Reprovação" vira **2 pills** ("Não reprova por nota", "Não reprova por frequência"), marcáveis juntas. As Habilidades BNCC vêm agrupadas (Unidade Temática → Objeto → Habilidade) com o grupo externo expansível e **tudo recolhido**; checkbox desmarcado é visível; "Selecionar Todos" + "Limpar" (vermelho) mantidos; "Adicionar" no rodapé confirma.

**Why this priority**: É o coração do preenchimento da matriz. Entrega valor sozinha.

**Independent Test**: Abrir o modal, trocar de disciplina e ver Tipo travar + BNCC recarregar; marcar pills + habilidades, salvar, reabrir em edição com tudo persistido (cobre o bug do US7).

**Acceptance Scenarios**:

1. **Given** o modal, **When** abre, **Then** o título tem destaque (`font-display`, padrão de Dialog do sistema).
2. **Given** o campo Disciplina, **When** lista, **Then** só `ativo=true` da escola do processo + `tipo_ensino` compatível com a etapa da matriz (sem inativas, sem de outra escola).
3. **Given** disciplina selecionada, **When** visualiza o Tipo, **Then** está bloqueado (`disabled`, sem edição manual) com o valor derivado do cadastro (`diretriz_curricular`: `bncc`→Base Comum, `parte_diversificada`→Parte Diversificada, `nenhuma`/null→Base Comum).
4. **Given** o bloco Desconsiderar, **When** visualiza, **Then** são 2 `ClickablePill` multi-select ("Não reprova por nota", "Não reprova por frequência"), ambas marcáveis juntas; estado persiste em `nao_reprova_nota/nao_reprova_frequencia` (backfill do legado no data-model).
5. **Given** a BNCC, **When** renderiza, **Then** grupos externos (Unidade Temática) expansíveis/recolhíveis, **todos recolhidos por padrão**; busca + Selecionar Todos/Limpar preservados; "Limpar" em vermelho (`variant="destructive"` outline).
6. **Given** um checkbox desmarcado, **When** visualiza, **Then** tem borda/fundo visível (`border-primary/40`, nunca "invisível" sobre o fundo).
7. **Given** preenchimento pronto, **When** clica "Adicionar" (rodapé), **Then** a disciplina entra naquele período com cargas + pills + BNCC + manuais persistidos.

---

### User Story 6 - Pills valendo no Diário de Classe (Priority: P1)

O que for marcado nas pills passa a valer de verdade: disciplina com "Não reprova por nota" não derruba o aluno por média; com "Não reprova por frequência" não derruba por faltas — no Diário, Fechamento, Conselho, Boletim e Rendimento.

**Why this priority**: Sem isso as pills são enfeite (hoje o toggle legado `desconsidera_reprovacao` **não é lido por nenhum consumidor** — só escrito). Entrega valor sozinha.

**Independent Test**: Aluno reprovado por média só por disciplina marcada "Não reprova por nota" → deixa de reprovar; idem frequência; disciplinas não marcadas continuam reprovando.

**Acceptance Scenarios**:

1. **Given** disciplina com `nao_reprova_nota=true`, **When** calcula média/situação (Diário, Fechamento, Conselho, Boletim, Rendimento), **Then** ela é excluída do cômputo de média mínima (continua exibida).
2. **Given** disciplina com `nao_reprova_frequencia=true`, **When** calcula frequência/situação (Diário, Fechamento, Boletim, Rendimento), **Then** ela é excluída do cômputo de frequência mínima (continua exibida).
3. **Given** alteração em `computarMediasPeriodo`, **When** implementa, **Then** é na origem única (`rendimento-calculo.ts`), sem regra paralela Diário × Rendimento.
4. **Given** registros legados (`desconsidera_reprovacao=true`), **When** migra, **Then** viram as duas pills marcadas (backfill), mantendo o comportamento mais próximo do antigo.

---

### User Story 7 - Bug de persistência por disciplina corrigido (Priority: P1)

Ao editar matriz existente e abrir a disciplina, tudo o que foi salvo aparece (cargas, pills, BNCC, manuais) — sem "dados sumidos".

**Why this priority**: Perda aparente de dados destrói a confiança no módulo. Entrega valor sozinha.

**Independent Test**: Salvar disciplina completa, sair, reabrir em edição e conferir cada campo (cargas, pills, cada habilidade BNCC, manuais).

**Acceptance Scenarios**:

1. **Given** edição de disciplina salva, **When** reabre, **Then** cargas, pills, BNCC e manuais vêm preenchidos (leitura com join de habilidades — causa raiz atual: `getDisciplinasPorPeriodo` não traz habilidades e o form lê `editDisc.bncc_habilidades` inexistente).
2. **Given** a linha da disciplina no período, **When** visualiza, **Then** cargas exibidas conferem com o salvo (colunas reais `carga_horaria_*_minutos` — hoje o display lê campo inexistente).
3. **Given** salvar disciplina sem nenhuma BNCC, **When** executa, **Then** não falha (sem `insert([])` vazio) e as manuais persistem.

### Edge Cases

- Escola sem disciplinas ativas compatíveis: modal exibe `EmptyState`/mensagem orientando o cadastro em Disciplinas (não lista vazia sem contexto).
- Disciplina inativada depois de usada na matriz: matriz existente a mantém (não apaga vínculo); só some das opções de *novas* inclusões.
- Disciplina com `diretriz_curricular='nenhuma'`: Tipo trava em Base Comum; BNCC exibe mensagem "sem habilidades para esta disciplina" (grupo não renderiza vazio).
- Matriz legada com `desconsidera_reprovacao=true`: edição mostra as duas pills marcadas (backfill); save preserva até o usuário desmarcar.
- Replicar com destino que já tem disciplinas: comportamento atual mantido (apaga destino e copia origem, via `replicarDisciplinas`) — confirmação deixa isso claro.
- Superadmin sem escola: página de matriz exige escola (como hoje no `MatrizForm`); listagem mantém `EmptyState` de seleção.
- Ano encerrado: edição bloqueada como hoje (só Excluir na lista); página de edição respeita a mesma trava.
- BNCC sem retorno para disciplina/etapa: mensagem atual mantida ("Nenhuma habilidade BNCC encontrada"), sem quebrar o save.
- `substituirHabilidades` com BNCC vazia + manuais vazias: só deleta vínculos, sem `insert` vazio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Filtros MUST usar `PageSection(compact, title="Filtros") + FilterBar` (remove `div.mb-6 flex flex-wrap` solta de `TabMatrizes.tsx:211`); labels `text-[14px]`, hints `text-[13px]` (sem `text-xs` em label de filtro).
- **FR-002**: Filtro de Etapa MUST usar `SelectGroup + SelectLabel` por `etapa_tipo` (remove `<div>` dentro de `SelectContent`, `TabMatrizes.tsx:247-254`); sem `input[type=number]` em filtro.
- **FR-003**: Card da lista MUST ter título `font-display text-[20px] font-semibold` com contador; subcard MUST exibir ícone `GraduationCap` em pastilha `bg-primary/10` + descrição + ano letivo (descrição do ano) + `data_inicio/final` em `pt-BR` + etapa + `turnos[]` + `tipo_turma[]` + qtd de disciplinas (derivada dos períodos carregados).
- **FR-004**: Expansão do subcard MUST filtrar `disciplinasPorPeriodo` pelos `periodo_id`s da matriz expandida (corrige `Object.values(...).flat()` global, `TabMatrizes.tsx:321-324`); agrupar por `periodo_nome`; loading por matriz; `Promise.all` (sem `await` em loop).
- **FR-005**: Subcard MUST NOT ter `Switch` (remove `TabMatrizes.tsx:308` + `handleToggleAtiva` da lista); código morto (`showDiscModal/discForm/savingDisc/replicarTarget` e imports não usados, `TabMatrizes.tsx:68-84`) removido.
- **FR-006**: "Nova Matriz" e "Editar" MUST navegar para `estrutura-academica/matrizes/novo` e `estrutura-academica/matrizes/[id]` (empilhadas na aba, registradas em `tab-routes.tsx`); `Dialog` de matriz em `TabMatrizes` removido; `MatrizForm` vira conteúdo das páginas (colocalizado ou em `src/components/matrizes/`, wrappers finos se `useSearchParams` exigir `content.tsx`).
- **FR-007**: Página MUST organizar Identificação em 3 linhas (Ano|Etapa|Subetapa; Método|Início|Término; Turnos|Tipo) e manter Carga Horária condicional a `tipo_turma.length>0`; `Switch` Ativa/Inativa só no Card Identificação da edição.
- **FR-008**: Criação MUST `createMatriz + createPeriodos` e permanecer na página como edição (Card Períodos renderiza na sequência, sem sair/reabrir).
- **FR-009**: Card Períodos MUST manter agrupamento pelo Método vinculado; **verificar antes de codar** se as quantidades de `createPeriodos` (hoje `tipo_turma`: Regular→4, Integral→2) conferem com `quantidade_periodos_*` do método — se divergirem, usar o método (fonte canônica do agrupamento).
- **FR-010**: "Adicionar Disciplina" MUST ficar no topo do subcard expandido, à direita, `size="sm"` (remove `w-full mt-2` do fim, `MatrizForm.tsx:585`).
- **FR-011**: Replicação MUST chamar-se "Replicar para os demais períodos" e usar `ConfirmDialog variant="warning"` cujo texto cita disciplinas + desconsiderar + carga + habilidades; `replicarDisciplinas` MUST copiar também `nao_reprova_*`.
- **FR-012**: Modal de disciplina MUST ter título em destaque; select filtra `ativo=true + school_id + tipo_ensino compatível` (sem `ano_letivo_id` — a tabela não tem a coluna; decisão registrada); Tipo é `PillToggleGroup disabled` derivado de `diretriz_curricular`.
- **FR-013**: Bloco Desconsiderar MUST ser 2 `ClickablePill` multi (`nao_reprova_nota`, `nao_reprova_frequencia`); persistir nas novas colunas (backfill do legado; escrita espelhada em `desconsidera_reprovacao` = `nota OR frequencia` para compatibilidade dos 6 consumidores indiretos).
- **FR-014**: BNCC MUST usar grupo externo (Unidade Temática) expansível/recolhível, todos recolhidos por padrão; `Checkbox` desmarcado com `border-primary/40 bg-card`; "Selecionar Todos" outline + "Limpar" `variant="destructive"` outline; rodapé "Adicionar" confirma.
- **FR-015**: `getDisciplinasPorPeriodo` MUST trazer `habilidades_bncc(habilidade_codigo)` + `habilidades_manuais(codigo, descricao)` (aliases `bncc_habilidades`/`habilidades_manuais` que `openDiscModal` já espera); display de cargas MUST ler `carga_horaria_*_minutos`; `substituirHabilidades` MUST pular `insert` de array vazio.
- **FR-016**: Cálculos de situação MUST excluir disciplinas `nao_reprova_nota` do cômputo de média e `nao_reprova_frequencia` do cômputo de frequência (Diário, Fechamento, Conselho, Boletim, Rendimento), via origem única (`rendimento-calculo.ts` para médias; helpers de frequência compartilhados), sem regra paralela.
- **FR-017**: 1 migration (`patch_matriz_nao_reprova_pills.sql`, aplicar via SQL Editor — sem CLI Supabase); 0 novas deps npm; 0 hex hardcoded; `tsc --noEmit` + `next build` verdes.

### Key Entities

- **Matriz curricular**: `academico_matrizes_curriculares` (existente, sem DDL) — leitura estendida com ano/etapa/método para o subcard rico.
- **Disciplina da matriz**: `academico_matriz_disciplinas` + 2 colunas novas `nao_reprova_nota/nao_reprova_frequencia BOOLEAN DEFAULT false` (backfill de `desconsidera_reprovacao`; coluna legada mantida com escrita espelhada) — ver `data-model.md`.
- **Habilidades**: `academico_matriz_habilidades_bncc(habilidade_codigo)` + `academico_matriz_habilidades_manuais(codigo, descricao)` (existentes, só passam a ser lidas no `getDisciplinasPorPeriodo`).
- **Disciplina catálogo (leitura)**: `academico_disciplinas(school_id, ativo, tipo_ensino, diretriz_curricular)` — filtro do select + origem do Tipo travado.
- **Rota empilhada**: `matrizes/novo` + `matrizes/[id]` sob o módulo `estrutura-academica` em `tab-routes.tsx` (decisão registrada).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Filtros em card padrão; Etapa sem spinners/hover estranho; troca de filtros sem regressão.
- **SC-002**: Subcard exibe os 7 dados; 2 matrizes expandidas sem vazamento; sem toggle na lista; título em destaque.
- **SC-003**: Criar matriz e chegar aos períodos sem sair da página; edição com `Switch` só na Identificação; back da página volta à lista com filtros/scroll preservados (keep-alive).
- **SC-004**: Períodos agrupados pelo método; Adicionar no topo à direita `sm`; replicar com nome novo + confirmação detalhada aplica disciplinas+configs aos demais.
- **SC-005**: Modal só com ativas da escola+etapa; Tipo travado correto por disciplina; pills + BNCC + cargas persistem e reabrem preenchidos; Limpar vermelho; checkbox desmarcado visível.
- **SC-006**: Aluno reprovado só por disciplina marcada deixa de reprovar (nota e frequência, separadamente); demais disciplinas e módulos inalterados.
- **SC-007**: `tsc --noEmit` + `next build` verdes; 1 migration aplicada; 0 deps; 0 hex.

## Assumptions

- Decisões do solicitante (via questionário 2026-09-16): página em **rota empilhada na aba**; pills com **Diário junto no mesmo escopo**; disciplinas = **ativas da escola + tipo_ensino** (sem vínculo novo com ano letivo).
- `desconsidera_reprovacao` legado não é lido por ninguém hoje (só escrito) — backfill `true` → ambas as pills `true` preserva o comportamento pretendido original.
- `diretriz_curricular='nenhuma'` → Tipo Base Comum (valor neutro; sem categoria própria na matriz).
- Compatibilidade `tipo_ensino × etapa`: usa o filtro `or(tipo_ensino.eq.X, tipo_ensino.eq.todos)` já praticado em `getDisciplinas` (`matrizes.ts`).
- Permissões inalteradas (`gestao-academica.estrutura-academica.matrizes`); auditoria best-effort existente cobre escritas (pills entram no diff).
- Quantidades de períodos na criação: a verificar contra o Método antes de codar (FR-009); se o método for canônico, `createPeriodos` passa a usá-lo.
