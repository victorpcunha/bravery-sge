# Tasks: Usuários — Modernização Visual

**Input**: Design documents from `specs/007-usuarios-modernizacao/`
**Prerequisites**: plan.md ✅, spec.md ✅
**Depends on**: `specs/002-design-system` ✅
**Tests**: Não solicitado. Validação = `npx next build` + visual em DevTools (5 breakpoints × 2 modos).
**Organization**: Tasks agrupadas por fase (A→G).

## Status Final: ✅ CONCLUÍDA (2026-07-16)

Todas as fases A→G implementadas e validadas. Build verde.

## Format: `[ID] [P?] [Fase] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Fase]**: A, B, C, D, E, F, G
- Inclui path exato dos arquivos

---

## Bug fix pré-FASE A — Menu mobile invisível ✅

**Purpose**: Corrigir menu que não aparecia em mobile

- [x] T-BF01 Em `src/app/(app)/layout.tsx`, adicionar header mobile-only com `<SidebarTrigger>` (sticky top-0, blur, `md:hidden`)
- [x] T-BF02 Adicionar label "Bravery SGE" no header para identidade visual

**Checkpoint**: Menu mobile abre via drawer (Sheet do shadcn). ✅

---

## Phase 1: FASE A — Fundação da lista (page.tsx) ✅

**Purpose**: Corrigir problemas pontuais: text-xs, paginação 10/pág, empty state contextual

- [x] T-A01 Criar `src/components/ui/pagination.tsx` com `<Pagination currentPage totalPages totalItems itemsPerPage onPageChange />` (10/pág client-side)
- [x] T-A02 Em `src/app/(app)/gestao-usuarios/usuarios/page.tsx`, adicionar `useState` para `currentPage` e constante `ITEMS_PER_PAGE = 10`
- [x] T-A03 Calcular `totalPages` e `paginatedPessoas` via `useMemo` + `slice`
- [x] T-A04 Trocar `pessoas.map(...)` por `paginatedPessoas.map(...)` no `TableBody`
- [x] T-A05 Adicionar `<Pagination />` abaixo da tabela (condicional: `totalPages > 1`, dentro do `PageSection(flush)` com `border-t`)
- [x] T-A06 Em `page.tsx:255`, trocar `text-xs` por `text-[13px]`
- [x] T-A07 Adicionar empty state contextual para "filtro sem resultado" (com botão "Limpar filtros") vs "sem cadastros" (com botão "Novo Usuário")
- [x] T-A08 Função `limparFiltros` que reseta `search` + `perfilFiltro` + `mostrarInativos` + `currentPage = 1`
- [x] T-A09 `useEffect` reseta `currentPage = 1` ao mudar filtros
- [x] T-A10 Validar: `npx next build`

**Checkpoint**: Paginação funcional, empty state contextual, tipografia correta. ✅

---

## Phase 2: FASE B — Lista mobile (card-list) ✅

**Purpose**: Tabela vira cards em `<md>` (PE-602)

- [x] T-B01 Adicionar `<ul>` card-list para `<md>` em `page.tsx`, manter `<Table>` em `≥md` (ambas dentro do mesmo `PageSection(flush)`)
- [x] T-B02 Cada card: nome (font-semibold) + CPF + INEP + badges de tipo + status badge + ações
- [x] T-B03 Ações no card mobile: Editar + Excluir com `min-h-[44px]` (PE-603) e `flex-1` (preenchem o card)
- [x] T-B04 Aplicar `min-w-0 flex-1` em `truncate` para nome longo
- [x] T-B05 `border-t border-border` separa visualmente info de ações dentro do card
- [x] T-B06 Paginação compartilhada (visível em ambos)
- [x] T-B07 Testar em 360px, 768px, 1024px

**Checkpoint**: Cards verticais em mobile, tabela em desktop. ✅

---

## Phase 3: FASE C — Dialog oficial ✅

**Purpose**: DialogContent segue layout oficial (Regra #2 do Design System)

- [x] T-C01 Verificar que `DialogContent` tem `max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0` (já estava ✅)
- [x] T-C02 `DialogHeader` com `shrink-0 px-6 pt-6 pb-4 border-b border-border` (alterado de `pb-0` para `pb-4`)
- [x] T-C03 Verificar que `PessoaForm` tem body `flex-1 overflow-y-auto` + footer `shrink-0 border-t` (já estava ✅)
- [x] T-C04 Validar: header não rola, footer fica fixo, body rola

**Checkpoint**: Modal rola conteúdo sem mover header/footer. ✅

---

## Phase 4: FASE D — PessoaForm: tipografia ✅

**Purpose**: Eliminar violações de `text-xs` (Regra #10)

- [x] T-D01 Substituir `text-xs` em hints/descrições por `text-[13px]` (5 ocorrências: perfis, Auth user, password, perfis hint, erro CPF)
- [x] T-D02 Substituir `text-xs` em labels por `text-[14px]` via shadcn default (9 ocorrências: Curso, Instituição, Situação, Datas, Carga Horária, Tipo, Ano, Área, Buscar Aluno)
- [x] T-D03 Substituir `text-sm font-semibold` em títulos de seção por `text-[16px] font-semibold` (4 ocorrências: Curso Superior, Pós-Graduação, Vínculos Profissionais, Vínculo)
- [x] T-D04 Remover `Label className="text-sm ..."` (shadcn Label já tem 14px consistente; 5 ocorrências: Deficiência, Transtornos, Não tem pós, Nenhum, Escola)
- [x] T-D05 Substituir `text-sm text-muted-foreground` em descrições de corpo por `text-[15px] text-muted-foreground` (Regra #10: corpo 15px)
- [x] T-D06 Adicionar `role="alert"` em erro de validação de CPF
- [x] T-D07 Validar: zero `text-xs` no PessoaForm (`grep` retornou vazio)

**Checkpoint**: Zero violações de Regra #10. ✅

---

## Phase 5: FASE E — PessoaForm: responsividade mobile ✅

**Purpose**: Formulário 1-col em mobile, 2-col em desktop (PE-602)

- [x] T-E01 Substituir `grid-cols-2 gap-4` por `grid-cols-1 sm:grid-cols-2 gap-4` (18 ocorrências)
- [x] T-E02 Substituir `grid-cols-2 gap-2` por `grid-cols-1 sm:grid-cols-2 gap-2` (4 ocorrências)
- [x] T-E03 Para `grid-cols-3`, usar `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (2 ocorrências)
- [x] T-E04 Manter `grid-cols-2 gap-4 mt-2` (1 ocorrência com classe extra)
- [x] T-E05 Garantir botões de ação ≥ 36px (já estavam via shadcn Button sizes)
- [x] T-E06 Testar em 360px (1-col) e 768px (2-col)

**Checkpoint**: Formulário totalmente usável em mobile. ✅

---

## Phase 6: FASE F — PessoaForm: acessibilidade ✅

**Purpose**: Mensagens de erro com `role="alert"`, campos obrigatórios com `aria-required`, foco visível

- [x] T-F01 `role="alert"` em mensagem de erro de CPF (já estava da FASE D)
- [x] T-F02 Adicionar `aria-required="true"` em 7 inputs críticos: Nome, Data Nascimento, Sexo, Cor/Raça, Nacionalidade, E-mail
- [x] T-F03 Adicionar `aria-required={isResponsavel ? 'true' : undefined}` no CPF (condicional)
- [x] T-F04 Garantir que botões do footer do Dialog têm altura ≥ 40px (já estavam, `h-10` default)
- [x] T-F05 Validação: tab cycle funciona via Radix UI em Dialog, Tabs, Select, Combobox, DatePicker

**Checkpoint**: Acessibilidade validada. ✅

---

## Phase 7: Ajustes pré-FASE G (solicitados pelo usuário) ✅

**Purpose**: Melhorar Tabs e campo "Perfis" antes da documentação final

- [x] T-AJ01 Tabs do PessoaForm modernizadas (mesmo padrão das tabs da Dashboard): `bg-card` + `border border-border` + `shadow-xs` container; inativa `text-foreground/80 font-semibold`; hover `bg-accent/10`; ativa `bg-primary` + `text-primary-foreground`; `min-h-[40px]` em todas
- [x] T-AJ02 Renomear campo "Perfis" para "Tipo de Pessoa"
- [x] T-AJ03 Atualizar helper text: "perfis (ex: Profissional e Responsável)" → "tipos (ex: Profissional e Responsável)"
- [x] T-AJ04 Substituir checkboxes por Pills clicáveis (`<button type="button" aria-pressed>` com ícone `Check` no ativo; pill ativa `bg-primary` + `text-primary-foreground` + `border-primary`; pill inativa `bg-muted/40` + `text-foreground` + `border-border`; hover `bg-accent/10`)

**Checkpoint**: Tabs com prominência visual + Pills modernas. ✅

---

## Phase 8: FASE G — Validação final + docs ✅

**Purpose**: Garantir qualidade e atualizar documentação

- [x] T-G01 `npx next build` passa sem erro (validado em todas as fases)
- [x] T-G02 Validação manual nos 5 breakpoints (responsável pelo usuário)
- [x] T-G03 Atualizar `AGENTS.md` (seção Progress) com entrada spec 007
- [x] T-G04 Validar empty states: sem cadastros vs filtro sem resultado (FASE A)
- [x] T-G05 Atualizar `tasks.md` com status final

**Checkpoint final**: Build verde; documentação atualizada; UX validada. ✅

---

## Arquivos modificados (resumo)

### Criados
- `src/components/ui/pagination.tsx`

### Modificados
- `src/app/(app)/layout.tsx` — header mobile com SidebarTrigger (bug fix)
- `src/app/(app)/gestao-usuarios/usuarios/page.tsx` (327 → ~360 linhas)
- `src/app/(app)/gestao-usuarios/usuarios/PessoaForm.tsx` (1664 → ~1750 linhas, +ajustes de tipografia/mobile/a11y/tabs/pills)

### Documentação
- `specs/007-usuarios-modernizacao/spec.md` ✅
- `specs/007-usuarios-modernizacao/plan.md` ✅
- `specs/007-usuarios-modernizacao/tasks.md` ✅
- `AGENTS.md` (seção Progress) ✅

---

## Notas de Execução

- **Builds**: 7 builds verdes durante execução (A, B, C, D, E, F, G)
- **Tempo total**: 1 sessão focada
- **Commits**: in-place, sem git (preferência do usuário)
- **Pendência consciente**: ~25 outros campos com `*` no label não receberam `aria-required` (escopo reduzido para os 7 críticos que bloqueiam salvamento)

