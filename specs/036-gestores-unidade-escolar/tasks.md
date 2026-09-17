# Tasks: Gestores na Unidade Escolar (036)

- [ ] T001 Criar `src/lib/actions/managers.ts` (listar com join pessoa + CRUD com permissão `escolas/editar` + auditoria + regras máx-3/sem-duplicidade/domínios v4)
- [ ] T002 Criar `src/components/censo/gestores-form.tsx` (lista, busca de pessoa da escola, selects v4, condicionais, EmptyState, readOnly)
- [ ] T003 Adicionar aba "Gestores" em `escola-form.tsx` + `'gestores'` em `TAB_VALIDAS` (só com `schoolId`)
- [ ] T004 Deep-link R40 → `?tab=gestores` em `getCorrectionUrl` (+ rótulos se necessário)
- [ ] T005 `npx tsc --noEmit` + `node scripts/checar-layout.mjs` verdes
- [ ] T006 Roteiro manual (US1–US3: cadastro, edição/exclusão, linha 40 no TXT, privada, limites)
