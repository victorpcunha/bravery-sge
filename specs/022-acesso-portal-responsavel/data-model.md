# Data Model: Acesso ao Portal no Cadastro de Responsável

**Feature**: `022-acesso-portal-responsavel`

## Migrations

**1 migration** (aplicar manualmente via SQL Editor, padrão do projeto):

`supabase-migrations/patch_portal_acesso_responsavel.sql`:

```sql
ALTER TABLE people
  ADD COLUMN IF NOT EXISTS portal_acesso_habilitado BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN people.portal_acesso_habilitado IS
  'Define se o responsável possui acesso ao Portal do Responsável (login = people.email). Senha vive no Supabase Auth.';
```

- Backfill: existentes assumem `FALSE` (sem acesso até a escola habilitar) — nenhum `auth.user` é criado retroativamente.
- Fora do Censo: coluna operacional, não entra no Registro 30 nem em exports (como `telefone_secundario`).

## Entidades

### `people` (estendida, +1 coluna)

| Campo | Tipo | Regra |
|-------|------|-------|
| `portal_acesso_habilitado` | `BOOLEAN NOT NULL DEFAULT FALSE` | `true` somente se credencial de portal provisionada e não bloqueada; editável só com permissão de edição de usuários |

Tipo TS `Person` (`src/lib/actions/people.ts:8-159`) ganha `portal_acesso_habilitado: boolean`. Incluir nos `select`s de leitura do form e nos payloads de `createPerson`/`updatePerson`.

### Supabase Auth — `auth.users` (sem migration, via Admin API)

| Atributo | Valor no fluxo portal |
|----------|----------------------|
| `email` | `people.email` do responsável (único global) |
| `email_confirm` | `true` (sem fluxo de confirmação nesta fase) |
| `password` | senha definida pela escola (nunca persistida/logada no app) |
| `user_metadata.person_id` | `people.id` (mesmo padrão do acesso interno) |
| `user_metadata.portal_only` | `true` (distingue do acesso interno; acesso interno não seta ou usa `false`) |
| `ban_duration` | `'none'` habilitado / `'100000000h'` desabilitado ou pessoa inativa |

Localização na edição: `fn_buscar_auth_user_por_pessoa(p_person_id)` (existente, usada por `atualizarAcessoAuth`).

### `user_schools` (inalterada)

`{ user_id, school_id }` — 1 linha por credencial, criada uma única vez (criação). Edição (senha/e-mail/ban) nunca reinsere.

### `responsavel_alunos` (inalterada, leitura/escrita como hoje)

`{ responsavel_id, aluno_id, tipo_vinculo '1'..'5', principal, autorizado_retirar, autorizado_boleto (default true, sem UI), receber_comunicados }`, `UNIQUE(responsavel_id, aluno_id)`.

## Query Patterns

### Criação com acesso (US1)

```
1. createPerson({..., portal_acesso_habilitado: true}) → people.id
2. vincularResponsavel(id, alunoId, {...}) por vínculo _new
3. criarAuthUser({ email, password, personId: id, schoolId, portalOnly: true })
     → auth.admin.createUser({ email, password, email_confirm: true,
         user_metadata: { person_id, portal_only: true } })
     → insert user_schools { user_id, school_id }
4. registrarAuditoriaPessoa('criar', 'user_schools', userId, pessoaId, schoolId, null,
     { email, user_id, school_id, pessoa, portal: true })   // sem senha
```

### Edição (US2)

```
- Flag false→true, sem auth.user  → criarAuthUser(portalOnly) + set flag true
- Flag false→true, com auth.user  → updateUserById { ban_duration: 'none', password? } + set flag true
- Flag true→false                 → updateUserById { ban_duration: '100000000h' } + set flag false
- Flag true + nova senha          → updateUserById { password } (sem tocar flag/vínculo)
- Flag true + novo e-mail         → updateUserById { email } + update people.email
- Senha em branco na edição       → não tocar senha (manter atual)
```

### Auditoria (módulo `Usuários`, framework `registrarAuditoria`)

| Operação | entidade | acao | snapshot (sem senha) |
|----------|----------|------|----------------------|
| provisionar | `user_schools` | `criar` | `{ email, user_id, school_id, pessoa, portal: true }` |
| habilitar | `people` | `editar` | `{ portal_acesso_habilitado: false → true }` |
| desabilitar | `people` | `editar` | `{ portal_acesso_habilitado: true → false }` |
| redefinir senha | `people` | `editar` | `{ senha_portal: 'redefinida' }` (fato, nunca o valor) |
| trocar e-mail | `people` | `editar` | diff padrão `{ email: antes → depois }` |

## Regras e invariantes

- `portal_acesso_habilitado=true` IMPLICA `people.email` válido preenchido + `auth.user` existente e desbanido.
- E-mail é único no Auth: colisão falha com mensagem amigável (sem expor o outro titular).
- `ativo=false` em `people` bane a credencial (regra vigente de `atualizarAcessoAuth`, vale para portal e sistema).
- Multi-tipo (`Profissional + Responsável`): acessos independentes; ban de um não toca o outro (localizar por `person_id` + filtro `portal_only` quando houver 2 credenciais para a mesma pessoa).
- Senha nunca aparece em: `people`, logs, auditoria, responses ou estado serializado.
