# Implementation Plan: Unidade Escolar — Acesso por perfil + Proteção + Modernização

**Branch**: `013-unidade-escolar-modernizacao` | **Data**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

## Summary

Reorganizar o módulo **Unidade Escolar** (`/escolas`): escopar a listagem por usuário (superadmin vê todas; usuário vinculado vê as próprias), aplicar permissão por perfil (recurso `escolas` com `validarPermissaoEstrita` para editar/criar/excluir), garantir que a escola **sempre visualize** a própria unidade em modo read-only, e modernizar a tela (filtros + cards ricos + paginação) e o form do Censo (tabs modernas, footer sticky, prop `readOnly`).

## Technical Context

- **Language**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
- **Dependencies**: shadcn/ui (Button, Card, Select, Table, Pagination, ConfirmDialog), Tailwind v4, lucide-react, sonner, react-hook-form/zod (form atual)
- **Storage**: Supabase. **0 migrations** — reutiliza recurso `escolas` + tabela `schools` + `user_schools`.
- **Testing**: `npx next build` + validação visual manual. Sem framework de testes automatizado.
- **Constraints**: zero novas deps npm; tokens do Design System (sem hex); shadcn/ui; permissão sempre validada server-side.

## Project Structure

```
src/lib/actions/
  schools.ts                       # MODIFICADO — getSchoolsEscopadas, getSchool(cx), create/update/delete com permissão estrita
  perfis.ts                        # MODIFICADO — validarPermissaoEstrita
src/components/censo/
  escola-form.tsx                  # MODIFICADO — prop readOnly, fieldset disabled, tabs modernas, footer sticky
src/components/layout/
  sidebar.tsx                      # MODIFICADO — label "Unidade Escolar"
src/app/(app)/escolas/
  page.tsx                         # REESCRITO — client, escopo, filtros, cards ricos, paginação, permissões
  [id]/page.tsx                    # REESCRITO — escopo, read-only, Excluir condicional, ConfirmDialog
  novo/page.tsx                    # REESCRITO — guard criar, ShieldAlert
specs/013-unidade-escolar-modernizacao/
  spec.md / plan.md / tasks.md     # NOVOS
```

## Task Breakdown

### Phase 1 — Server actions
- [x] `validarPermissaoEstrita` em `perfis.ts` (exige perfil com permissão; vazio → permite)
- [x] `getSchoolsEscopadas(ids | null)` valida (substitui `getSchools`)
- [x] `getSchool(id, { pessoaId, escolaDoUsuario })` — própria unidade sem exigir permissão
- [x] `createSchool`/`updateSchool`/`deleteSchool(pessoaId?)` com `validarPermissaoEstrita`

### Phase 2 — Sidebar
- [x] Rótulo do link direto da escola: "Escola" → **"Unidade Escolar"**

### Phase 3 — Listagem (`/escolas`)
- [x] Client component + `useAuth`/`usePermissoes`
- [x] Filtros: busca nome/INEP + Selects situação/dependência/localização
- [x] Cards ricos + `<Pagination>` 10/pág + empty states contextuais
- [x] "Nova Escola" condicional a `pode.criar`; estado "nenhuma escola vinculada"

### Phase 4 — Tela da unidade (`/escolas/[id]`)
- [x] Escopo (`foraDeEscopo`) → ShieldAlert
- [x] `podeEditar`/`podeExcluir` estritos; banner "Visualização somente"; `EscolaForm readOnly`
- [x] Breadcrumbs só superadmin; Excluir via ConfirmDialog

### Phase 5 — Criação (`/escolas/novo`)
- [x] Guard `podeCriar` (nega setup); ShieldAlert em caso de negativa

### Phase 6 — Form (`escola-form.tsx`)
- [x] Prop `readOnly` + `<fieldset disabled className="contents">` nos `TabsContent`
- [x] Tabs modernizadas (padrão PessoaForm) e footer sticky (Voltar/Salvar, h-11)

### Phase 7 — Verificação
- [x] `npx next build` verde
- [ ] Validação visual manual (lista, unidade em edição e read-only, criação)