# Implementation Plan: Módulo Documentos

**Branch**: `019-documentos` | **Data**: 2026-09-04 | **Spec**: [./spec.md](./spec.md)

## Summary

Fundação do módulo **Documentos** + primeiro documento oficial (**Declaração de Matrícula**).
Reutiliza `documentos_config` (spec 018) para a identidade visual. Geração de PDF no cliente via
`@react-pdf/renderer` (única nova dependência npm).

## Technical Context

- **Language**: TypeScript, React 19, Next.js 16 (App Router), client components.
- **Storage**: Supabase (`getSupabaseAdmin`). **1 migration** (`patch_recursos_documentos.sql`) —
  apenas seed de recursos de permissão.
- **PDF**: `@react-pdf/renderer` 4.x — `Document`/`Page`/`View`/`Text`/`Image`,
  download via `pdf(<Doc/>).toBlob()`. **Preview** renderizado como **imagens** (canvas) via
  `pdfjs-dist` (worker embutido com `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`)
  — elimina a barra de ferramentas do visualizador de PDF do navegador. O `PDFViewer` do pacote foi
  evitado (quebra com React 19 — "X is not a function", issue diegomura/react-pdf#2978). Fonte
  embutida Helvetica. Logo base64 em `<Image>`.
- **Testing**: `npx tsc --noEmit` + `npx next build` (43 rotas) + validação manual.
- **Constraints**: tokens do Design System; shadcn/ui; `validarPermissaoEstrita` em todas as actions.

## Project Structure

```
supabase-migrations/
  patch_recursos_documentos.sql        # NOVO — recursos documentos.oficiais/preencher + relatorios
src/lib/actions/
  documentos.ts                        # NOVO — buscarAlunosPorAnoLetivo, getDadosDeclaracaoMatricula
src/components/documentos/
  declaracao-matricula.tsx             # NOVO — componente PDF (react-pdf)
  oficiais-tab.tsx                     # NOVO — seleção ano/aluno + preview + download
  documentos-tabs.tsx                  # NOVO — seções Documentos|Relatórios + sub-abas
src/app/(app)/documentos/page.tsx      # NOVO — página com guard de permissão
src/components/layout/sidebar.tsx      # MOD — módulo "Documentos" (link direto)
src/lib/tab-routes.tsx                 # MOD — módulo de aba `documentos`
package.json                           # MOD — + @react-pdf/renderer
specs/019-documentos/                  # NOVOS — spec, plan, data-model, quickstart
```

## Task Breakdown

### Fase 1 — Setup
- [x] Instalar `@react-pdf/renderer`
- [x] Migration `patch_recursos_documentos.sql` (recursos: `documentos.oficiais`,
      `documentos.preencher`, `relatorios`)

### Fase 2 — Dados/actions
- [x] `src/lib/actions/documentos.ts`: `buscarAlunosPorAnoLetivo` (nome/CPF, filtro por
      `school_id` + `ano_letivo_id`, dedupe por aluno preferindo matrícula ativa)
- [x] `getDadosDeclaracaoMatricula`: pessoa + matrícula (turma, etapa, ano letivo) + identidade
      da escola (`documentos_config` com fallback `schools`)

### Fase 3 — PDF
- [x] `declaracao-matricula.tsx`: cabeçalho (logo + escola + endereço + CNPJ/contato),
      título, corpo padronizado, tabela de dados da matrícula, rodapé (local/data + assinatura)

### Fase 4 — UI
- [x] `oficiais-tab.tsx`: select Ano Letivo + busca de aluno (Popover/Command, debounce 300ms),
      preview em **imagens** (`pdfjs-dist`, canvas, sem barra de ferramentas) + botão "Baixar PDF"
- [x] `documentos-tabs.tsx`: Tabs Documentos|Relatórios + sub-abas Oficiais|Preenchimento,
      gates por permissão e placeholders "Em breve"
- [x] `src/app/(app)/documentos/page.tsx`: guard de permissão + estados vazios

### Fase 5 — Integração
- [x] Sidebar: módulo "Documentos" visível se o usuário pode visualizar qualquer recurso do módulo
- [x] `tab-routes.tsx`: módulo de aba `documentos` (ícone FileText), rota `/documentos`

### Fase 6 — Verificação
- [x] `npx tsc --noEmit` verde
- [x] `npx next build` verde (43 rotas, inclui `/documentos`)
- [ ] Aplicar migration `patch_recursos_documentos.sql` no Supabase (SQL Editor)
- [ ] Validação manual (quickstart.md)

## Notes

- Recursos controlam **visualizar**; a geração do documento utiliza a permissão `visualizar`
  do recurso correspondente (sem mutação de dados — não gera auditoria).
- `@react-pdf/renderer` é o módulo correto para documentos com identidade visual da escola;
  sem ele não haveria arquivo PDF de fato.