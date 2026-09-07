# Quickstart: Configurações de Documentos

## 1. Aplicar a migration

Execute `supabase-migrations/documentos_config.sql` (cria a tabela com `school_id UNIQUE`).

## 2. Implementação

- Server actions: `src/lib/actions/documentos-config.ts`
  - `getConfigDocumentos(schoolId)` / `salvarConfigDocumentos(schoolId, data, pessoaId?)`.
- Util client-safe: `src/lib/documentos-config.ts`
  - `seedDocumentosFromSchool(school)` pré-preenche os replicados a partir do cadastro.
- Form: `src/components/censo/escola-form.tsx` — schema zod grupo `documentos`, helpers
  `TextareaField`/`LogoField`, card na aba Identificação (só com `schoolId`).
- Página: `src/app/(app)/escolas/[id]/page.tsx` — carrega config e separa `documentos` do
  payload do `updateSchool`.

## 3. Testar

```bash
npx tsc --noEmit
npx next build
```

Acessar `/escolas/[id]` (Superadmin ou perfil com edição de escolas): conferir o card na aba
Identificação, alterar um dado replicado (ex.: nome da escola no card), salvar e verificar que
o cadastro oficial **não** mudou e que o Censo continuou intacto. Fazer upload do logo (até 2 MB)
e salvar novamente.

## 4. Notas

- Os dados replicados são **cópias independentes** — editar o card não altera `schools`.
- `salvarConfigDocumentos` exige permissão de editar a escola (`validarPermissaoEstrita`), e o
  Superadmin passa automaticamente.
- A auditoria da config omite o `logo` (blob base64) dos snapshots.