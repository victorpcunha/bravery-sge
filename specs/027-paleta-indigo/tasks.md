# Tasks: Paleta Tonal Steel Blue (v7)

**Feature**: `027-paleta-indigo`

- [X] T001 Aplicar mapeamento tonal no `:root` + corrigir texto da sidebar p/ `sidebar-foreground`
- [X] T002 Sincronizar docs — `AGENTS.md`, `catalog.md`, `DESIGN.md`, `PRODUCT.md`, `design.json`
- [X] T003 Contrastes: secondary 5.83, sidebar 9.0, accent 5.1, muted 5.58 ✓; primary 4.11 (exceção documentada)
- [X] T004 `detect` baseline (1 warning pré-existente, 2 advisories scrollbar)
- [X] T005 `npx next build` verde + dark inalterado
- [ ] T006 Decisão final: manter / ajustar primary-fill → secondary / reverter

**Purpose**: T003–T005 gates de aceitação; T006 fecha com o usuário.
Revert: `git checkout -- src/app/globals.css src/components/layout/sidebar.tsx` + reverter docs.
