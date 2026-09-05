# Quickstart: Auditoria

## 1. Aplicar a migration

Execute `supabase-migrations/auditoria.sql` no banco (cria a tabela + índices + backfill).

## 2. Implementação

- Framework: `src/lib/auditoria.ts`
  - `registrarAuditoria({...})` → registro completo (diff automático);
  - `registrarAuditoriaAgregada({...})` → resumo por salvamento;
  - `computarAlteracoes`, `nomearRegistro`.
- Ator: `useAuth().pessoaId` (agora disponível inclusive para Superadmin). Mutações
  recebem `pessoaId?: string | null` e registram a auditoria.
- Tela: `src/app/(app)/auditoria/page.tsx` + `src/components/auditoria/detalhes-auditoria.tsx`
  + server actions em `src/lib/actions/auditoria.ts` (`listarAuditoria`, `listarModulosAuditoria`,
  `listarProfissionaisAuditoria`, `validarSuperAdmin`).
- Navegação: item top-level "Auditoria" no sidebar (visível apenas a Superadmin) + módulo
  de aba `auditoria` em `src/lib/tab-routes.tsx`.

## 3. Testar

```bash
npx tsc --noEmit
npx next build
```

Acessar `/auditoria` com perfil Superadmin: aplicar filtros (busca + escola + usuário +
módulo + tipo de ação + datas), expandir linhas e conferir diffs/conteúdo/resumo.
Realizar uma edição (ex.: editar um Usuário) e confirmar o registro na listagem.

## 4. Padrão para telas futuras

Em qualquer nova server action de Master-Data, chamar `registrarAuditoria` após a mutação:

```ts
await registrarAuditoria({
  school_id, pessoa_id: pessoaId, modulo, entidade, entidade_id,
  acao, dados_anteriores, dados_novos,           // snapshots
})
```

Para operações de alto volume, usar `registrarAuditoriaAgregada` com `resumo`
(`{ turma, disciplina, periodo, quantidade }`).

## 5. Notas

- Captura é **best-effort** (nunca bloqueia a operação principal).
- `desfazerFechamento` lê o snapshot do fechamento na tabela `auditoria`
  (antes lia em `perfis_auditoria`).
- Calendários, Matrizes e Disciplinas migraram de client-Supabase para server actions
  com auditoria.