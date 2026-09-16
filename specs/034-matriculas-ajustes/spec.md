# Feature Specification: Alunos Matriculados — Ajustes

**Feature Branch**: `034-matriculas-ajustes`

**Created**: 2026-09-16

**Status**: Implemented — 2026-09-16 (`tsc` + `next build` verdes)

**Input**: User description: "Tela de Alunos Matriculados — Ajustes: Card de Filtros (buscar reduzida + filtro Turma); Card Alunos Matriculados tabela full-width com títulos em destaque, lixeira com ConfirmDialog, coluna ID antes do Aluno. Tela Editar/Nova Matrícula: botão Excluir no topo direito do Editar; Card Dados da Matrícula (código automático antes de Ano Letivo, Ano Letivo reduzido); Card Transporte (Poder Público em Pills únicas Nenhum/Estadual/Municipal + subcard Veículos em 2 grupos multi); Card Movimentações (hierarquia + badge em destaque, 2 datas por item, campos por tipo); rodapé padrão Cancelar/Salvar fixo substituindo botão flutuante."

**Decisões do solicitante (2026-09-16)**: (1) código de matrícula = sequencial por escola via migration + backfill (padrão `codigo_pessoa`); (2) exclusão = permanente (hard delete) com modal de confirmação, na tabela e no Editar; (3) **Card Dispensa de Disciplinas removido por completo** (frontend + backend + tabela via `patch_remove_dispensas.sql`) — US4 abaixo está REVOGADA.

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-101** — A tela tem um objetivo principal: gerenciar vínculos aluno↔turma (listar, filtrar, criar, editar, excluir o incorreto) sem atrito.
- **PE-102** — Filtros em card padrão, tabela full-width com cabeçalho em destaque, Pills e badges semânticos comunicam o estado sem exploração.
- **PE-201** — Cadastro segue o fluxo mental: Dados → Transporte → Movimentações (só edição) → rodapé fixo Cancelar/Salvar.
- **PE-205** — Exclusões sempre com `ConfirmDialog`; validações objetivas via `toast.error` antes de qualquer escrita.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filtros e tabela da listagem (Priority: P1)

O gestor abre Alunos Matriculados e vê "Buscar por nome do aluno" com largura reduzida + novo filtro Turma; a tabela ocupa 100% da largura com títulos em destaque; cada linha mostra o ID (código de matrícula) antes do nome e tem lixeira com confirmação.

**Why this priority**: É a leitura principal; busca gigante, tabela com margens e ausência de ID/ Turma/ exclusão quebram o padrão das demais listagens. Entrega valor sozinha.

**Independent Test**: Abrir a lista, conferir busca reduzida, filtrar por Turma, conferir cabeçalho full-width com destaque, ver coluna ID e excluir um vínculo via lixeira com confirmação.

**Acceptance Scenarios**:

1. **Given** o Card de Filtros, **When** renderiza, **Then** "Buscar por nome do aluno" tem largura reduzida (`searchClassName` no `FilterBar`, ex. `max-w-xs`) e há um Select "Turma" (turmas ativas da escola+ano) fluindo ao lado dos demais filtros.
2. **Given** o filtro Turma, **When** seleciona uma turma, **Then** a lista recarrega server-side via `getMatriculas(schoolId, { ano_letivo_id, turma_id })` (parâmetro já suportado); "Todas" limpa o filtro.
3. **Given** o Card Alunos Matriculados, **When** renderiza a tabela, **Then** não há wrapper com margem lateral (remove `px-4` de `page.tsx:150`); o fundo da linha de títulos ocupa 100% da largura do card.
4. **Given** os títulos das colunas, **When** visualiza, **Then** têm destaque (`bg-muted text-foreground`, sem `text-xs` novo; `text-muted-foreground` atual tem contraste insuficiente sobre `bg-muted/50`).
5. **Given** as linhas, **When** visualiza, **Then** a primeira coluna exibe o ID (código de matrícula, `font-mono tabular-nums`) antes do Aluno.
6. **Given** a listagem, **When** carrega, **Then** as linhas vêm ordenadas do menor para o maior código (`order codigo_matricula asc`, desempate `created_at desc`).
6. **Given** a coluna Ações, **When** visualiza, **Then** há lápis (editar) + lixeira (`Trash2 text-destructive`); **When** clica na lixeira, **Then** abre o `ConfirmDialog` padrão; confirmar exclui permanentemente + toast + reload; cancelar preserva.

---

### User Story 2 - Código de matrícula automático + Excluir no Editar (Priority: P1)

Toda matrícula tem um código sequencial por escola, gerado automaticamente e exibido como read-only antes do Ano Letivo; a página Editar Matrícula tem botão Excluir no topo direito ao lado de Voltar.

**Why this priority**: O ID visível na lista (US1) depende desta base; excluir vínculo incorreto pelo Editar é o fluxo complementar à lixeira da lista. Entrega valor sozinha.

**Independent Test**: Criar matrícula (código gerado), ver código no Editar e na lista; excluir pelo Editar com confirmação e voltar à lista.

**Acceptance Scenarios**:

1. **Given** o banco, **When** aplicada a migration, **Then** `academico_matriculas.codigo_matricula INTEGER` existe com `UNIQUE(school_id, codigo_matricula)` + índice, backfill `ROW_NUMBER() OVER (PARTITION BY school_id ORDER BY data_matricula, created_at)` cobre legados.
2. **Given** Nova Matrícula, **When** salva, **Then** `createMatricula` gera `max+1` por escola (padrão `people.ts:246-251`); o campo exibe "Gerado ao salvar" antes do save.
3. **Given** o Card Dados da Matrícula, **When** renderiza, **Then** o campo "Código de Matrícula" (read-only, `bg-muted`) está posicionado antes do Ano Letivo; Ano Letivo tem largura reduzida (`max-w-[180px]` ou similar).
4. **Given** a página Editar, **When** visualiza o header, **Then** há Excluir (`variant="destructive"`, `ConfirmDialog` padrão) ao lado de Voltar; confirmar faz hard delete + auditoria + `router.push('/gestao-academica/matriculas')`.
5. **Given** vínculo com lançamentos restritivos, **When** tenta excluir, **Then** erro do banco é exibido via `toast.error` amigável (sem tela quebrada).

---

### User Story 3 - Transporte em Pills + subcard Veículos (Priority: P1)

"Poder Público Responsável" vira 3 Pills de seleção única (Nenhum/Estadual/Municipal); ao marcar Estadual/Municipal aparece o subcard "Veículos Utilizados no Transporte Escolar" em 2 grupos multi-seleção (Rodoviários 6 / Aquaviários 4).

**Why this priority**: Select + checkboxes soltos destoam do sistema; agrupar rodoviário × aquaviário organiza a leitura. Entrega valor sozinha.

**Independent Test**: Alternar Nenhum/Estadual/Municipal, ver subcard aparecer/sumir, marcar múltiplos veículos por grupo, salvar e reabrir.

**Acceptance Scenarios**:

1. **Given** o Card Transporte Escolar, **When** visualiza, **Then** são 3 `ClickablePill` seleção única (Nenhum/Estadual/Municipal, mapeados p/ `'Não utiliza'/'Estadual'/'Municipal'`), sem `Select`.
2. **Given** Nenhum ativo, **When** visualiza, **Then** o subcard de veículos está oculto (como hoje com `'1'`).
3. **Given** Estadual ou Municipal ativo, **When** visualiza, **Then** há o subcard "Veículos Utilizados no Transporte Escolar" com 2 grupos: Rodoviários (Bicicleta, Micro-ônibus, Ônibus, Tração Animal, Vans/Kombis, Outro Rodoviário) e Aquaviários (Até 5 alunos, 5 a 15 alunos, 15 a 35 alunos, Acima de 35 alunos).
4. **Given** o subcard, **When** marca opções, **Then** multi-seleção por grupo (mais de uma simultânea); persistência nas colunas atuais (verificação Fase 0: booleanas `veiculo_*` vs JSONB).
5. **Given** trocar Estadual/Municipal → Nenhum, **When** salva, **Then** veículos são limpos (comportamento atual mantido).

---

### User Story 4 - ~~Dispensas~~ REVOGADA

> **REVOGADA em 2026-09-16** — a funcionalidade Dispensa de Disciplinas foi removida por completo do sistema: card removido de `content.tsx`, actions (`getDispensas`/`adicionarDispensa`/`removerDispensa` + type `Dispensa` + `getDisciplinasDaTurma` órfã) removidas de `matriculas.ts`, tabela `academico_matriculas_dispensas` dropada via `patch_remove_dispensas.sql`. Critérios abaixo preservados só como registro histórico.

Itens dispensados ganham tratamento visual rico; ao adicionar, a nova dispensa aparece **abaixo** da listagem existente.

**Why this priority**: Visual cru (badge outline simples) e ordem invertida confundem — a última adição deveria fechar a lista. Entrega valor sozinha.

**Independent Test**: Adicionar dispensa (vai para o fim), remover com o X, salvar e reabrir.

**Acceptance Scenarios**:

1. **Given** uma disciplina dispensada, **When** visualiza, **Then** o item tem destaque (ícone + nome em destaque + motivo + remover, padrão dos cards ricos — ex. bloco `bg-warning/5 border-warning/20` atual elevado a item estruturado), sem texto simples com borda arredondada.
2. **Given** disciplinas da turma, **When** visualiza o topo do card, **Then** a listagem existente é mantida (o pedido cobre só os itens dispensados).
3. **Given** selecionar disciplina + motivo e clicar Adicionar, **When** adiciona, **Then** o item entra **abaixo** do último existente (append + `order by created_at`); nunca acima.
4. **Given** o botão remover, **When** clica, **Then** comportamento atual mantido (edição: soft-delete imediato; nova: remove do lote local).

---

### User Story 5 - Movimentações com hierarquia, 2 datas e campos por tipo (Priority: P1)

O histórico ganha hierarquia visual com badge de tipo em destaque; cada item mostra "Registrada em" (sistema) + "Data efetiva" (ocorrência, permite retroativo); campos exibidos variam por tipo.

**Why this priority**: Visual cru + data única escondem informação crítica (retroatividade) e poluem com campos irrelevantes por tipo. Entrega valor sozinha.

**Independent Test**: Criar movimentações dos 4 tipos (incl. uma retroativa), conferir badge, 2 datas e campos por tipo; salvar e reabrir.

**Acceptance Scenarios**:

1. **Given** um item do histórico, **When** visualiza, **Then** o tipo usa `StatusBadge` com variant por tipo (mapa em `situacoes-matricula.ts`: Transferido/Reclassificado/Remanejado/Desistente) em destaque — não `Badge outline text-[10px]`.
2. **Given** o item, **When** visualiza as datas, **Then** há 2 datas rotuladas separadamente: "Registrada em" (`data_registro`, sistema) e "Data efetiva" (`data_movimentacao`, permite retroativa).
3. **Given** o tipo, **When** é Transferência, **Then** exibe Observações.
4. **Given** o tipo, **When** é Reclassificação, **Then** exibe Nova Etapa (nome resolvido) + Nova Turma (nome resolvido) + Observações.
5. **Given** o tipo, **When** é Remanejamento, **Then** exibe Turma de Destino (nome resolvido) + Observações.
6. **Given** o tipo, **When** é Desistência, **Then** exibe Motivo + Observações.
7. **Given** os modais de movimentação, **When** sem alteração, **Then** campos de entrada e validações atuais mantidos (só a exibição do histórico muda + labels das 2 datas).

---

### User Story 6 - Rodapé padrão Cancelar/Salvar (Priority: P1)

O botão flutuante "Salvar" é substituído pelo rodapé fixo padrão do sistema com Cancelar + Salvar.

**Why this priority**: Botão flutuante circular destoa de todas as telas de cadastro e esconde o Cancelar. Entrega valor sozinha.

**Independent Test**: Rolar o form até o fim e no meio; rodapé sempre visível; Cancelar volta à lista sem salvar.

**Acceptance Scenarios**:

1. **Given** a página Nova/Editar, **When** visualiza, **Then** NÃO há botão flutuante (`content.tsx:935-941` removido); há footer `sticky bottom-0 bg-background/95 backdrop-blur border-t` com Cancelar (outline, volta à lista) + Salvar (`h-11`, padrão `plano-aula-form.tsx:556-565`).
2. **Given** salvando, **When** executa, **Then** ambos desabilitados com estado "Salvando..." (padrão); toast + redirect/navegação como hoje.
3. **Given** o wrapper, **When** renderiza, **Then** `pb-20` (respiro do flutuante) removido.

### Edge Cases

- Superadmin sem escola: lista mantém `EmptyState` "Selecione uma Escola"; filtro Turma só carrega com escola efetiva.
- Turma sem etapas/matrículas: Select Turma com EmptyState ou desabilitado; filtro sem resultado → `EmptyState` atual.
- Código em concorrência: `max+1` app-level tem a mesma ressalva do `codigo_pessoa` (janela de escrita concorrente); UNIQUE do banco protege, erro vira `toast.error` + retry manual.
- Excluir matrícula com frequência/notas/parecer vinculados (se FKs existirem — Fase 0): `toast.error` amigável, sem excluir; documentar no quickstart o que bloqueia.
- Transporte: valores do form (`'1'/'2'/'3'`?) vs CHECK do banco (`'Não utiliza'/'Municipal'/'Estadual'`) — Fase 0 confirma o mapeamento real antes de trocar por Pills; labels exibidos são Nenhum/Estadual/Municipal.
- Veículos: colunas booleanas `veiculo_*` vs `transporte_veiculos JSONB` — Fase 0 confirma qual é a fonte verdadeira de leitura/escrita.
- Movimentação `data_registro` é automática (`NOW()`); exibição "Registrada em" usa o valor gravado, sem edição.
- Reclassificação/Remanejamento exibem nomes (etapa/turma destino) resolvidos via batch, não IDs.
- F5 no cadastro: padrão das abas internas (workspace reinicia no Dashboard; `id` via query param, já existente).
