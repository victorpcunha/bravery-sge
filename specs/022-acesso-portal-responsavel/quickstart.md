# Quickstart: Acesso ao Portal no Cadastro de Responsável

**Feature**: `022-acesso-portal-responsavel`

## Pré-requisitos

1. Migration aplicada manualmente no SQL Editor do Supabase:
   `supabase-migrations/patch_portal_acesso_responsavel.sql`
   (coluna `people.portal_acesso_habilitado`; conferível via `select portal_acesso_habilitado from people limit 1`).
2. Logado como usuário com permissão de edição na tela `/gestao-usuarios/usuarios`.
3. Ao menos 1 aluno ativo na escola (para o vínculo).
4. `npx tsc --noEmit` para validar tipos.

## Roteiro de validação

### US1 — Habilitar no cadastro (P1)

1. Abrir **Usuários** → **Novo** → Tipo de Pessoa: marcar **Responsável**.
2. Preencher Nome + CPF + **e-mail válido** + vínculo com 1 aluno (tipo `Mãe`/`Pai`/`Responsável Legal`).
3. Na seção **Acesso ao Portal**: marcar **Habilitar Acesso ao Portal = Sim**.
4. Definir **Senha** forte (10+, maiúscula + minúscula + número + especial) + **Confirmação igual** → **Salvar**.
5. Conferir: toast de sucesso; na reabertura do cadastro a flag segue marcada; no banco, `portal_acesso_habilitado=true`, existe `auth.user` do e-mail com `user_metadata.portal_only=true` e 1 linha em `user_schools`.
6. Conferir auditoria (`/auditoria`, módulo `Usuários`): registro de criação do acesso **sem** a senha.

### Validações negativas (US1)

7. Repetir com senha fraca (`abc123`) → bloqueio com regra de senha explicada.
8. Repetir com confirmação divergente → bloqueio com "As senhas não conferem".
9. Repetir com Habilitar=Sim e e-mail vazio → bloqueio pedindo o e-mail.
10. Repetir com e-mail já usado por outro login → bloqueio orientando outro e-mail (sem expor titular).

### US2 — Gerenciar existente (P2)

11. Editar responsável sem acesso → habilitar + definir senha → salvar → login do portal passa a existir.
12. Editar responsável com acesso → apagar a senha (deixar em branco) e salvar → senha **mantida** (sem erro).
13. Editar responsável com acesso → informar nova senha → salvar → senha atualizada, `user_schools` sem duplicata.
14. Editar responsável com acesso → trocar e-mail → salvar → login passa ao novo e-mail.
15. Editar responsável com acesso → desmarcar Habilitar → salvar → login bloqueado (ban), cadastro e vínculos intactos; reabilitar desbloqueia.

### US3 — Vínculo preservado (P2)

16. Com acesso habilitado: adicionar 2º aluno (tipo distinto, 1 principal) → salvar → reabrir → ambos os vínculos presentes.
17. Remover 1 vínculo → salvar → só aquele some; acesso continua habilitado.

### Final

18. `npx tsc --noEmit` + `npx next build` verdes.
