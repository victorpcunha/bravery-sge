# Implementation Plan: Remover Tipo "Gestor" (037)

## Files

| # | Arquivo | Ação |
|---|---------|------|
| 1 | `src/app/(app)/gestao-usuarios/usuarios/PessoaForm.tsx:722` | Remover `{ value: 'gestor', label: 'Gestor' }` das pills de Tipo de Pessoa |
| 2 | `src/app/(app)/gestao-usuarios/usuarios/PessoaForm.tsx:434,448` | Textos "Profissional/Gestor" → "Profissional" (toasts de e-mail e escolaridade) |
| 3 | SQL Editor (sem arquivo) | Diagnóstico + UPDATE de `people.perfil` (abaixo) |

## SQL (rodar no SQL Editor do Supabase, nessa ordem)

```sql
-- Diagnóstico: quem tem SÓ gestor
SELECT id, nome_completo, perfil
FROM people
WHERE perfil = ARRAY['gestor'];
```

```sql
-- Ajuste: anexa 'profissional' preservando o resto
UPDATE people
SET perfil = array_append(perfil, 'profissional')
WHERE perfil = ARRAY['gestor'];
```

## Não mexer (compatibilidade legada)

- `PessoaForm.tsx:295,728`, `censo-profissionais.ts:51`, `ocorrencias.ts:144` — os `includes('gestor')` permanecem (linhas antigas com `gestor` continuam passando nos gates).
- `perfil_id`, `managers`, validação/exportação do Censo.

## Verification

1. `npx tsc --noEmit` limpo.
2. Novo usuário: só 3 pills; diretor como Profissional + aba Gestores → Censo válido com linha 40.
3. Revalidar escola com gestor legado (pós-SQL): sem erro novo.
