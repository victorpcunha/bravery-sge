# Implementation Plan: Acesso ao Portal no Cadastro de Responsável

**Branch**: `022-acesso-portal-responsavel` | **Date**: 2026-09-07 | **Spec**: `specs/022-acesso-portal-responsavel/spec.md`

**Input**: Feature specification from `/specs/022-acesso-portal-responsavel/spec.md`

## Summary

Estender o cadastro de responsável (`PessoaForm` + `src/lib/actions/people.ts`) com a seção `Acesso ao Portal` (flag `Habilitar` + `Senha/Confirmação`), persistindo a flag em nova coluna `people.portal_acesso_habilitado` e provisionando/bloqueando a credencial no Supabase Auth com `user_metadata.portal_only=true` + vínculo `user_schools`. Vínculo com aluno (`responsavel_alunos`) inalterado; Portal em si fora de escopo.

## Technical Context

**Language/Version**: TypeScript 5 / React 19 / Next.js 16 App Router (`'use client'` no form, `'use server'` nas actions)

**Primary Dependencies**: Supabase JS (`getSupabaseAdmin()` service_role, bypass RLS), shadcn/ui (`Checkbox`, `Input`, `Label`, `FormCard`), `sonner` (toast)

**Storage**: PostgreSQL via Supabase; **1 migration** (`supabase-migrations/patch_portal_acesso_responsavel.sql`); senha NUNCA em tabela (só Supabase Auth)

**Testing**: Manual via quickstart (projeto sem suite automatizada para este módulo); `npx tsc --noEmit` + `npx next build`

**Target Platform**: Web (desktop predominante 1366×768; mobile adaptado via grid responsivo)

**Project Type**: Web application (Next.js monólito: `src/app`, `src/components`, `src/lib/actions`)

**Performance Goals**: Salvamento do cadastro < 3s (1 createUser Auth + 1 insert user_schools no caminho de habilitação); sem N+1 novos

**Constraints**: Server Actions first; validação server-side autoritativa; multi-tenant (`school_id` em todas as queries); auditoria best-effort sem bloquear; Design tokens (sem hex); `tsc` + `next build` verdes

**Scale/Scope**: 1 migration, ~2 arquivos-fonte alterados (`people.ts`, `PessoaForm.tsx`), 0 novas deps npm, 0 novas rotas

## Constitution & Product Experience Check

### Constitution

- **I. Server Actions First** — toda escrita passa por `src/lib/actions/people.ts` (`'use server'`); validação client complementar, server autoritativa. OK.
- **II. Security First** — validar usuário autenticado + escola ativa + permissão de edição de usuários + escopo `school_id` antes de tocar Auth/`people`; erro de login futuro genérico. OK.
- **III. Multi-Tenant** — `user_schools` + `school_id` em `people`/`responsavel_alunos`; sem hardcode. OK.
- **IV/V/VI/XI. Tokens, Dark Mode, shadcn, Design System** — reuso de `FormCard`, `Checkbox`, `Input`, `Label`, tokens (`text-muted-foreground`, `border-border`); `text-[13px]` hints (padrão spec 007/008). OK.
- **VII. Migrations** — 1 migration nova em `supabase-migrations/`, aplicada via SQL Editor. OK.
- **VIII. Auditability** — `registrarAuditoria` (módulo `Usuários`) em criar/habilitar/desabilitar/redefinir, omitindo a senha. OK.
- **IX. Feature-Based** — actions em `lib/actions/people.ts`, UI no `PessoaForm` existente (sem estrutura paralela). OK.
- **X. No New Patterns** — nenhum padrão novo (mesmo Auth, mesma auditoria, mesmos componentes). OK.

### Product Experience

- Spec referencia **PE-304, PE-204, PE-102, PE-402, PE-403, PE-404, PE-602**.
- Plano reflete cada um: seção em `FormCard` agrupado (PE-204) dentro do Cadastro/Edição vigente (PE-304), com explicação do login (PE-102), erros orientadores (PE-402), toast de sucesso (PE-403), loading no submit (PE-404 já existente no `handleSave`), grid responsivo (PE-602).
- Trade-off documentado: `autorizado_boleto` segue sem UI (paridade com o atual, evita expansão de escopo).

## Project Structure

### Documentation (this feature)

```text
specs/022-acesso-portal-responsavel/
├── spec.md              # Feature specification (/speckit.specify)
├── plan.md              # This file (/speckit.plan)
├── research.md          # Phase 0 output — NÃO se aplica (reuso integral de padrões; pesquisa embutida abaixo em "Decisões")
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # NÃO se aplica (sem endpoints novos; Server Actions tipadas)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
supabase-migrations/
└── patch_portal_acesso_responsavel.sql   (novo)  people.portal_acesso_habilitado

src/lib/actions/
└── people.ts                             (editar) flag no tipo Person + payloads,
                                                 criarAuthUser com portalOnly?,
                                                 definirSenhaPortal, alternarAcessoPortal

src/app/(app)/gestao-usuarios/usuarios/
└── PessoaForm.tsx                        (editar) FormCard "Acesso ao Portal" +
                                                 validações client + handleSave

specs/022-acesso-portal-responsavel/
└── {spec,plan,data-model,quickstart,tasks}.md (novo)
```

**Structure Decision**: Web application monólito existente; nenhuma pasta nova em `src` (seção vive no `PessoaForm`; lógica no `people.ts`).

## Decisões (Phase 0 — pesquisa embutida, sem `research.md` separado)

1. **Onde guardar "Habilitar"**: coluna `people.portal_acesso_habilitado BOOLEAN DEFAULT FALSE` — alternativa (tabela `portal_acessos`) rejeitada: seria join extra para 1 flag; coluna segue o padrão de flags do módulo e permite `SELECT` existente sem mudança.
2. **Onde guardar senha**: exclusivamente Supabase Auth — alternativa (hash em `people`) rejeitada: duplicaria o IdP, quebraria `signIn` padrão (CPF→e-mail) e violaria Security First.
3. **Distinguir portal vs sistema**: `user_metadata { person_id, portal_only: true }` — alternativa (perfil/recurso novo) rejeitada nesta fase: o Portal ainda não existe; o marcador é barato, retrocompatível e suficiente para o futuro gate.
4. **Reuso de `criarAuthUser`**: estender com `portalOnly?: boolean` em vez de nova função de criação — evita duplicar validação de senha/auditoria/`user_schools`.
5. **Ban como bloqueio**: `ban_duration '100000000h'` / `'none'` via `auth.admin.updateUserById`, mesmo padrão de `atualizarAcessoAuth` — alternativa (deletar `auth.user`) rejeitada: perderia histórico e exigiria recriação no re-habilitar.
6. **Localizar `auth.user` na edição**: via RPC existente `fn_buscar_auth_user_por_pessoa(p_person_id)` (mesma de `atualizarAcessoAuth`); fallback por e-mail se necessário.
7. **E-mail único**: erro do Auth é traduzido para mensagem amigável sem vazar titularidade (LGPD).
8. **Gap do vínculo na edição** (vínculos só persistem na criação): corrigir junto nesta feature (T015), pois os testes de não-regressão (US3) exigem edição funcional.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | Nenhuma violação da Constituição | — |
