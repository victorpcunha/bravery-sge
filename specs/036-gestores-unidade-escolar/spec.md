# Feature Specification: Gestores na Unidade Escolar (Registro 40)

**Feature Branch**: `036-gestores-unidade-escolar`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "A escola não tem Registro 40 no cadastro da Unidade Escolar. Criar aba 'Gestores' na Unidade Escolar com cadastro manual (pessoa + cargo + critério de acesso + situação funcional), até 3 gestores, para alimentar a exportação do Censo (Registro 40, 7 campos v4). Sem importação automática do CPF do cadastro."

## Contexto

- A tabela `managers` existe (`censo_2026_tables.sql`: `person_id, cargo, criterio_acesso, situacao_funcional`) mas nada grava nela: nem `EscolaForm` (a aba "Gestão Escolar" é só Registro 10) nem `PessoaForm` (só vínculo/função/regime).
- Validação (`validarRegistro40`) e exportação (`buildRegistro40`, 7 campos v4) já leem `managers`; a validação exige ≥1 gestor em escola ativa (Regras Gerais 19).
- Sem gestor cadastrado, o Censo bloqueia com "Gestor obrigatório" e o TXT sai sem linha 40.

## Regras INEP (v4 aplicáveis)

- Registro 40: `40 | cód.escola | cód.pessoa | inep | cargo(1/2) | critério(1-7) | situação(1-4)` — 7 campos.
- Cargo: 1-Diretor(a), 2-Outro Cargo.
- Critério obrigatório quando cargo=1 e escola ativa (1-Proprietário … 7-Outros); vedado 1 em escola pública; vedados 4/5/6 em escola privada.
- Situação obrigatória quando cargo=1, escola ativa e pública (1-Concursado … 4-CLT).
- Máx 3 registros 40 por escola; sem pessoa duplicada.

## User Scenarios & Testing

### User Story 1 — Cadastrar gestor da escola (Priority: P1)

O gestor abre a Unidade Escolar (`/escolas/[id]`), aba "Gestores", clica em adicionar, busca uma pessoa da escola, informa cargo (Diretor/Outro), critério de acesso e situação funcional, e salva. A lista exibe os gestores com nome, CPF, INEP e os três códigos.

**Why this priority**: Sem ao menos 1 gestor a exportação do Censo fica bloqueada; entrega valor sozinha.

**Independent Test**: Abrir a aba, adicionar diretor com critério e situação, recarregar e conferir persistência; revalidar o Censo e ver o erro "Gestor obrigatório" sumir.

**Acceptance Scenarios**:

1. **Given** escola sem gestores, **When** abre a aba "Gestores", **Then** vê estado vazio orientando a cadastrar o primeiro gestor.
2. **Given** o formulário, **When** seleciona cargo Diretor em escola pública ativa, **Then** critério e situação passam a ser obrigatórios.
3. **Given** 3 gestores cadastrados, **When** tenta adicionar o 4º, **Then** o sistema recusa (máx 3 do INEP).
4. **Given** pessoa já vinculada como gestora, **When** tenta adicioná-la de novo, **Then** o sistema recusa duplicidade.
5. **Given** usuário sem permissão de edição em `escolas`, **When** abre a aba, **Then** vê a lista somente-leitura (mesma regra do restante da tela).

---

### User Story 2 — Editar e excluir gestor (Priority: P2)

O gestor edita critério/situação de um gestor existente ou o exclui (com confirmação). Excluir o último gestor de escola ativa volta a bloquear o Censo com mensagem clara.

**Why this priority**: Mantém o cadastro correto ao longo do ano (troca de direção); depende da US1.

**Independent Test**: Editar critério, excluir com confirmação, excluir o último e revalidar o Censo.

**Acceptance Scenarios**:

1. **Given** um gestor, **When** edita e salva, **Then** a lista reflete imediatamente e a auditoria registra.
2. **Given** exclusão, **When** confirma no `ConfirmDialog`, **Then** o vínculo é removido.
3. **Given** exclusão do último gestor de escola ativa, **When** revalida o Censo, **Then** retorna o erro "Gestor obrigatório" apontando para a Unidade Escolar.

---

### User Story 3 — Linha 40 no TXT (Priority: P2)

Com gestor válido, a exportação emite `40|cód.escola|cód.pessoa|inep|cargo|critério|situação|` (7 campos) entre os blocos 30 e 50, com o código de pessoa idêntico ao campo 3 do Registro 30.

**Why this priority**: É a finalidade da feature; depende da US1.

**Independent Test**: Exportar e conferir posição, contagem de campos (7) e igualdade do código de pessoa com o Registro 30.

## Functional Requirements

- **FR-001**: Aba "Gestores" visível só na edição (`schoolId` presente), fora do submit do form da escola (salvamento imediato por vínculo).
- **FR-002**: Busca de pessoas restrita à escola, com nome + CPF + INEP (padrão `filtro-pessoa`, debounce 300ms).
- **FR-003**: Condicionais de obrigatoriedade idênticas às de `validarRegistro40` (cargo→critério/situação).
- **FR-004**: Permissão segue `escolas/editar`; leitura segue `escolas/visualizar`; auditoria em criar/editar/excluir.
- **FR-005**: "Corrigir" dos erros R40 leva a `/escolas/[id]?tab=gestores`.

## Out of Scope

- Importação automática a partir de `schools.cpf_gestor` (decisão do usuário: só manual).
- Mudanças em `PessoaForm`, validação R40 e exportação (já prontos).
- Gestor de escola paralisada/extinta além do já permitido (validação cobre).
