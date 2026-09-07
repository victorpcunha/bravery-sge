# Implementation Plan: Configurações de Documentos (Unidade Escolar)

**Branch**: `018-config-documentos` | **Data**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

## Summary

Novo card "Configurações de Documentos" na aba Identificação do cadastro da Unidade Escolar,
com campos replicados (cópias independentes) + logo/nome fantasia/site/mantenedora/cabeçalho/
rodapé/assinatura. Dados armazenados em tabela separada (`documentos_config`) — **não** exportados
no Censo.

## Technical Context

- **Language**: TypeScript, React, Next.js (App Router), react-hook-form + zod.
- **Storage**: Supabase (`getSupabaseAdmin`). **1 migration** (`documentos_config.sql`).
- **Testing**: `npx tsc --noEmit` + `npx next build` + validação manual.
- **Constraints**: 0 novas deps npm; componentes shadcn/ui; tokens do Design System.

## Project Structure

```
supabase-migrations/documentos_config.sql  # NOVO — tabela (school_id UNIQUE)
src/lib/actions/
  documentos-config.ts                     # NOVO — get/salvarConfigDocumentos (server actions)
  schools.ts                               # MODIFICADO — tipo School ganha colunas de endereço/contato
src/lib/documentos-config.ts               # NOVO — seed/formação (client-safe)
src/components/censo/
  escola-form.tsx                          # MODIFICADO — schema zod documentos, helpers Textarea/Logo, card
src/app/(app)/escolas/[id]/page.tsx        # MODIFICADO — carrega config, separa payload no submit
specs/018-config-documentos/               # NOVOS — spec, plan, data-model, quickstart
```

## Task Breakdown

### Phase 1 — Dados
- [x] Migration `documentos_config.sql` (colunas replicadas + adicionais + `school_id UNIQUE`)
- [x] `documentos-config.ts` (actions): `getConfigDocumentos`, `salvarConfigDocumentos` (validação,
      sanitarização, upsert, auditoria sem logo)
- [x] `src/lib/documentos-config.ts`: `seedDocumentosFromSchool`, formatação telefone, nome do município
- [x] Tipo `School` estendido (endereço/contato)

### Phase 2 — Form
- [x] Schema zod com grupo `documentos` (optional)
- [x] Helpers `TextareaField` e `LogoField` (base64 via FileReader, preview, cap 2 MB)
- [x] Card "Configurações de Documentos" na aba Identificação (somente quando `schoolId` presente),
      com 4 sub-seções (Dados replicados / Identidade visual / Cabeçalho e rodapé / Assinatura)

### Phase 3 — Página
- [x] Carregar `getSchool` + `getConfigDocumentos` em paralelo e mesclar `defaultValues.documentos`
- [x] `handleSubmit` separa `documentos` do payload do censo → `updateSchool` + `salvarConfigDocumentos`

### Phase 4 — Docs e build
- [x] specs/018-config-documentos (spec, plan, data-model, quickstart)
- [x] `npx tsc --noEmit` verde · `npx next build` verde