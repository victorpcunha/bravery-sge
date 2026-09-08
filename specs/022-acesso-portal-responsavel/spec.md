# Feature Specification: Acesso ao Portal no Cadastro de Responsável

**Feature Branch**: `022-acesso-portal-responsavel`

**Created**: 2026-09-07

**Status**: Implementado (código + migration criados; validação manual do quickstart pendente)

**Input**: User description: "O cadastro de responsável já existe no sistema, porém precisa ser ajustado para comportar o acesso ao Portal do Responsável. O cadastro deve receber os campos adicionais: Senha (para acesso ao portal) e Habilitar Acesso ao Portal (sim/não). Esses campos devem aparecer em uma nova seção chamada 'Acesso ao Portal', dentro do cadastro do responsável. A escola define login (e-mail já existente) e senha; o responsável usa e-mail + senha para acessar o portal. O vínculo com aluno (um ou mais alunos, tipo Mãe/Pai/Responsável Legal, flag principal) deve ser mantido. Escopo atual: SOMENTE o ajuste do cadastro — o Portal em si será definido posteriormente. Leitura futura restrita a filhos vinculados, respeitando `apresentar_no_portal`; mesma política de senha atual."

## Product Experience Principles Applied *(mandatory)*

### Applied Principles

- **PE-304** — A alteração ocorre dentro do layout de Cadastro/Edição existente (`PessoaForm` em Dialog); nenhum layout novo é criado.
- **PE-204** — Senha + Habilitar vão agrupados em uma nova seção `FormCard "Acesso ao Portal"`, separada do bloco "Permitir acesso ao sistema" (acesso interno).
- **PE-102** — A seção explica desde o primeiro contato que o login do portal é o e-mail do cadastro + senha definida pela escola.
- **PE-402** — Erros orientam a correção (e-mail ausente/duplicado, senha fraca, confirmação divergente).
- **PE-403** — Salvamento com acesso concluído gera feedback imediato (`toast` "Responsável salvo com sucesso").
- **PE-404** — Salvamento comunica estado (botão com loading, evita duplo submit).
- **PE-602** — Campos seguem o padrão responsivo existente (`grid-cols-1 sm:grid-cols-2`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Habilitar acesso ao portal no cadastro (Priority: P1)

A secretaria cadastra um responsável (Nome + CPF + e-mail + vínculo com aluno), marca **Habilitar Acesso ao Portal = Sim**, define a **Senha**, salva — o responsável passa a ter credencial de portal (e-mail + senha) apta para o futuro login do Portal.

**Why this priority**: É o valor central pedido: sem isso o Portal não tem como autenticar ninguém. Entrega valor sozinho (credencial provisionada e auditada), mesmo com o Portal ainda inexistente.

**Independent Test**: Criar um responsável novo com acesso habilitado e confirmar que (a) o save é aceito, (b) existe `auth.user` + vínculo `user_schools` para o e-mail, (c) a flag `portal_acesso_habilitado` ficou `true`. Depois desabilitar e confirmar bloqueio.

**Acceptance Scenarios**:

1. **Given** responsável novo com Nome, CPF, e-mail válido e 1 vínculo com aluno, **When** marco Habilitar=Sim, informo senha forte + confirmação igual e salvo, **Then** o cadastro é criado, a credencial de portal é provisionada e vejo toast de sucesso.
2. **Given** responsável com Habilitar=Sim, **When** a senha tem menos de 10 caracteres (ou sem maiúscula/minúscula/número/especial), **Then** o salvamento é bloqueado com mensagem explicando a regra de senha.
3. **Given** responsável com Habilitar=Sim, **When** a confirmação de senha diverge, **Then** o salvamento é bloqueado com "As senhas não conferem".
4. **Given** responsável com Habilitar=Sim, **When** o e-mail está vazio ou inválido, **Then** o salvamento é bloqueado com "Informe o e-mail do responsável para habilitar o acesso ao portal".
5. **Given** responsável com Habilitar=Sim, **When** o e-mail já pertence a outro login, **Then** o salvamento é bloqueado com mensagem orientando a usar outro e-mail (sem expor dados do outro usuário).

---

### User Story 2 - Gerenciar acesso de responsável existente (Priority: P2)

A secretaria edita um responsável: habilita/desabilita o acesso, redefine a senha, troca o e-mail de login. Desabilitar bloqueia o login do portal sem apagar o cadastro nem os vínculos.

**Why this priority**: Operação cotidiana (perda de senha, troca de e-mail, revogação). Independente da US1 após existir ao menos um responsável.

**Independent Test**: Editar responsável existente: habilitar, redefinir senha, trocar e-mail, desabilitar — cada operação auditada e refletida no login.

**Acceptance Scenarios**:

1. **Given** responsável existente sem acesso, **When** habilito + defino senha e salvo, **Then** a credencial é criada e a flag vira `true`.
2. **Given** responsável com acesso habilitado, **When** desmarco Habilitar e salvo, **Then** o login do portal é bloqueado (`ban`), o cadastro e os vínculos são preservados, com auditoria.
3. **Given** responsável com acesso habilitado, **When** informo nova senha (sem trocar o resto) e salvo, **Then** só a senha é atualizada (sem recriar vínculo `user_schools`).
4. **Given** responsável com acesso habilitado, **When** troco o e-mail e salvo, **Then** o login passa a ser o novo e-mail (Auth sincronizado).

---

### User Story 3 - Vínculo com aluno preservado (Priority: P2)

O comportamento atual de vínculo (1..N alunos, tipo Mãe/Pai/Responsável Legal — além dos valores Tutor/Outro já existentes —, flag principal, autorizado a retirar, recebe comunicados) continua funcionando idêntico, com ou sem acesso ao portal.

**Why this priority**: Requisito explícito de não-regressão; base da futura regra LGPD ("só filhos vinculados").

**Independent Test**: Criar/editar responsável com 2 vínculos (tipos distintos, 1 principal) com acesso habilitado e desabilitado — vínculos idênticos nos dois casos.

**Acceptance Scenarios**:

1. **Given** cadastro de responsável, **When** adiciono 2 alunos com tipos distintos e 1 marcado principal, **Then** ambos os vínculos são persistidos (criação e edição).
2. **Given** responsável com acesso ao portal, **When** removo 1 vínculo e salvo, **Then** só aquele vínculo é excluído; acesso e demais vínculos intactos.

### Edge Cases

- E-mail compartilhado por dois responsáveis (ex.: pai e mãe com o mesmo e-mail): o segundo salvamento falha no Auth — mensagem orienta a cadastrar e-mail individual, sem revelar a quem pertence o e-mail.
- Responsável multi-tipo (ex.: `Profissional + Responsável`): os dois blocos coexistem de forma independente — "Permitir acesso ao sistema" (login interno) e "Acesso ao Portal" (login do portal).
- Responsável inativado (`ativo=false`): segue a regra vigente de `atualizarAcessoAuth` (ban) para ambas as credenciais.
- Senha em branco na edição com acesso já habilitado: significa "manter a senha atual" (não redefine, não bloqueia).
- Auditoria nunca persiste o valor da senha (apenas o fato da operação).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema MUST exibir seção `Acesso ao Portal` no cadastro sempre que o tipo de pessoa incluir `responsavel` (inclusive `apenasResponsavel`), separada do bloco `Permitir acesso ao sistema` (que permanece oculto para responsável puro).
- **FR-002**: Sistema MUST oferecer o campo `Habilitar Acesso ao Portal` (sim/não, default `false`) persistido em `people.portal_acesso_habilitado`.
- **FR-003**: Sistema MUST oferecer os campos `Senha` + `Confirmação de senha` visíveis quando Habilitar=Sim; ambos `type="password"`, não persistidos em `people`.
- **FR-004**: Sistema MUST usar como login do portal o e-mail já existente do cadastro; Habilitar=Sim MUST exigir e-mail válido preenchido.
- **FR-005**: Sistema MUST aplicar a política de senha vigente (`validarSenha`: mín. 10 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial) e exigir confirmação igual.
- **FR-006**: Sistema MUST provisionar a credencial via Supabase Auth (`auth.admin.createUser` com `email_confirm: true`, `user_metadata { person_id, portal_only: true }`) + vínculo `user_schools` na criação; na edição, atualizar via `auth.admin.updateUserById` sem duplicar vínculos.
- **FR-007**: Sistema MUST bloquear o login do portal ao desabilitar (Habilitar=false) via `ban_duration`, sem excluir cadastro, vínculos ou o `auth.user`; ao reabilitar, remover o ban.
- **FR-008**: Sistema MUST sincronizar troca de e-mail com o Auth quando o acesso estiver habilitado.
- **FR-009**: Sistema MUST manter integralmente o vínculo com alunos (`responsavel_alunos`: 1..N, `tipo_vinculo` 1–5 com rótulos Pai/Mãe/Responsável Legal/Tutor/Outro, `principal`, `autorizado_retirar`, `receber_comunicados`; `autorizado_boleto` default `true` sem UI, como hoje).
- **FR-010**: Sistema MUST validar server-side: permissão de edição de usuários (padrão vigente da tela), e-mail, senha e flag — nunca confiar no frontend.
- **FR-011**: Sistema MUST auditar (módulo `Usuários`, framework `registrarAuditoria`) criar/habilitar/desabilitar/redefinir-senha do acesso portal, omitindo o valor da senha nos snapshots.
- **FR-012**: Sistema MUST exibir erro genérico de login no futuro Portal ("Usuário ou senha inválidos"), padrão da Constituição — registrado aqui como restrição para a fase do Portal, sem implementação nesta feature.

### Key Entities

- **people (estendida)**: cadastro único; novo atributo `portal_acesso_habilitado: boolean` (default `false`). Senha vive só no Supabase Auth, nunca em `people`.
- **auth.user (Supabase)**: credencial do portal (`email`, `user_metadata.person_id`, `user_metadata.portal_only=true` para distinguir do acesso interno).
- **user_schools**: vínculo `user_id ↔ school_id` (multi-tenant), criado uma única vez por credencial.
- **responsavel_alunos (inalterada)**: vínculo N:N responsável↔aluno (`tipo_vinculo`, `principal`, flags de autorização); base da futura regra LGPD.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Secretaria habilita acesso + define senha e salva um responsável em até 2 minutos sem suporte (mesmo fluxo do cadastro atual acrescido da seção).
- **SC-002**: 100% das operações de acesso (criar, habilitar, desabilitar, redefinir senha) geram registro de auditoria sem expor a senha.
- **SC-003**: 0 regressões no vínculo com aluno (criação/edição/exclusão de vínculos funcionam com acesso habilitado ou não).
- **SC-004**: `npx tsc --noEmit` e `npx next build` verdes após a implementação.

## Assumptions

- Reutilização integral do Auth atual: Supabase Auth + `user_schools`; sem novo provedor, sem fluxo de convite/primeiro-acesso nesta fase (a escola define a senha).
- Sem "esqueci minha senha" pelo responsável nesta fase (será parte do Portal, escopo futuro).
- `email_responsavel` (coluna legada, só usada na aba do aluno) não é o login do portal; login = `people.email` do próprio responsável.
- O Portal (rota, layout, telas de leitura, `apresentar_no_portal`, seletor de filhos) é escopo futuro e NÃO faz parte desta spec.
- Multi-tipo (`Profissional + Responsável`) mantém acessos independentes (sistema vs portal).
- Migration aplicada manualmente via SQL Editor (sem CLI Supabase), padrão do projeto.
