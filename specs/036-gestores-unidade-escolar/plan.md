# Implementation Plan: Gestores na Unidade Escolar (036)

## Architecture

- `managers` é entidade filha de `schools` (1 escola → até 3 vínculos), editada **fora** do submit do `EscolaForm` (react-hook-form da escola só conhece colunas de `schools`; `updateSchool` recebe o payload sem o grupo `gestores`, mesmo padrão do grupo `documentos`).
- Novo componente client `src/components/censo/gestores-form.tsx` com estado próprio: carrega via server action, CRUD imediato por vínculo (sem "Salvar" geral).
- Server actions em `src/lib/actions/managers.ts` com `getSupabaseAdmin()` + `validarPermissaoEstrita(pessoaId, 'escolas', 'editar')` + `registrarAuditoria` (módulo "Unidade Escolar", entidade `managers`) — mesmo padrão de `schools.ts`/`documentos-config.ts`.

## Files

| # | Arquivo | Ação |
|---|---------|------|
| 1 | `src/lib/actions/managers.ts` | CRIAR: `listarManagers(schoolId)` (join pessoa: nome_completo, cpf, inep_id), `adicionarManager`, `atualizarManager`, `removerManager` (regras: máx 3, sem duplicar pessoa, códigos nos domínios v4) |
| 2 | `src/components/censo/gestores-form.tsx` | CRIAR: lista + adicionar (busca pessoa da escola) + editar/excluir inline, selects com textos oficiais v4, condicionais cargo→critério/situação, `EmptyState` sem gestores, `readOnly` herdado |
| 3 | `src/components/censo/escola-form.tsx` | EDITAR: `TabsTrigger`/`TabsContent` "gestores" + `'gestores'` em `TAB_VALIDAS` (deep-link `?tab=`); render só com `schoolId` |
| 4 | `src/lib/actions/censo-regras.ts` | EDITAR: caso `'40'` de `getCorrectionUrl` → `/escolas/${schoolId}?tab=gestores` |
| 5 | `src/data/censo/rotulos-campos.ts` | EDITAR (se necessário): rótulos `cargo`, `criterio_acesso`, `situacao_funcional` para o display de erros |

## Data

- 0 migrations (tabela `managers` já existe com as colunas necessárias).
- Catálogos inline no componente a partir da v4: cargo (1-Diretor(a), 2-Outro Cargo), critério (1-Ser proprietário… 7-Outros), situação (1-Concursado… 4-CLT).

## Verification

1. `npx tsc --noEmit` limpo.
2. `node scripts/checar-layout.mjs` 7/7 (sem alteração esperada na exportação).
3. Roteiro manual: escola ativa sem gestor → Censo acusa "Gestor obrigatório" → cadastra diretor na aba → revalida (erro some) → exporta → linha `40|…|` com 7 campos entre 30 e 50, código de pessoa igual ao campo 3 do 30.
4. Repetir com escola privada (critério 1 e 4/5/6 recusados) e limite de 3 + duplicidade.
