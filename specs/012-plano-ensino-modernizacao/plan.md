# Implementation Plan: Plano de Ensino — Modernização de Telas

**Branch**: `012-plano-ensino-modernizacao` | **Data**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

## Summary

Modernizar as três telas do módulo **Plano de Ensino**: card de filtros na lista (escola p/ superadmin, ano letivo com padrão ativo, turma, disciplina e período em pills), lista de **mini-cards ricos** (disciplina em destaque, turma, bimestre, professor, aulas+horas do Quadro de Aulas, última atualização, "Ver Plano"), criação com identificação 50/50 e disciplinas como **cards interativos**, e form de plano de aula reestruturado em **3 cards** com **cômputo de aulas/horas** a partir do Quadro de Aulas ativo e footer sticky com botões destacados.

## Technical Context

- **Language**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
- **Dependencies**: shadcn/ui (Button, Card, Badge, Select, Input, Textarea, Label, Checkbox, Skeleton), Tailwind v4, lucide-react, sonner
- **Storage**: Supabase. **0 migrations** — reaproveita `planos_aula.updated_at`, `periodos INT[]`, `bncc_fields`.
- **Testing**: `npx next build` + validação visual manual. Sem framework de testes automatizado.
- **Constraints**: zero novas deps npm; tokens do Design System (sem hex); shadcn/ui; server actions `'use server'` com `getSupabaseAdmin()`.

## Project Structure

```
src/components/ui/
  clickable-pill.tsx                   # NOVO — pill reutilizável (aria-pressed)
src/components/plano-ensino/
  plano-aula-form.tsx                  # NOVO — form em 3 cards + cômputo de aulas/horas
src/lib/actions/
  plano-ensino.ts                      # MODIFICADO — filtros+enriquecimento listarPlanosEnsino; calcularAulasDoQuadro
src/app/(app)/gestao-pedagogica/plano-ensino/
  page.tsx                             # REESCRITO — filtros + mini-cards + "Novo" no header da seção
  criar/page.tsx                       # REESCRITO — sem breadcrumbs, identificação 50/50, cards de disciplina
  [id]/page.tsx                        # REESCRITO — sem breadcrumbs, form extraído, tabs resetam form
specs/012-plano-ensino-modernizacao/
  spec.md / plan.md / tasks.md         # NOVOS
```

## Task Breakdown

### Phase 0 — Docs
- [x] Criar `specs/012-plano-ensino-modernizacao/spec.md`
- [x] Criar `specs/012-plano-ensino-modernizacao/plan.md`
- [x] Criar `specs/012-plano-ensino-modernizacao/tasks.md`

### Phase 1 — Server actions (`plano-ensino.ts`)
- [x] Helpers de datas/Quadro (`isoToDate`, `maxIso`, `minIso`, `minutosDoHorario`, `carregarQuadroDaTurma`, `contarAulasNoIntervalo`)
- [x] `calcularAulasDoQuadro(turmaId, matrizDisciplinaIds, dataInicio, dataFim, pessoaId?)` → `{ porDisciplina, total_aulas, total_minutos }`
- [x] `listarPlanosEnsino(schoolId, pessoaId, opts)` — filtros `{ anoLetivoId, turmaId, matrizDisciplinaId, periodos }` + enriquecimento em batch (`disciplinas` com matriz id, `professores`, `periodos`, `aulas_quadro`+`horas_quadro`, `ultima_atualizacao`)

### Phase 2 — Componentes novos
- [x] `src/components/ui/clickable-pill.tsx` (padrão PessoaForm: `button[aria-pressed]`, `rounded-full`, ativo `bg-primary` + Check)
- [x] `src/components/plano-ensino/plano-aula-form.tsx` (3 cards + bloco de aulas/horas + footer sticky)

### Phase 3 — Lista (`plano-ensino/page.tsx`)
- [x] Card de filtros (escola superadmin sem "Todas", ano default ativo, turma, disciplina, pills de período)
- [x] Grid de mini-cards + "Novo Plano de Ensino" no header da `PageSection`
- [x] Empty states contextuais; botão Novo passa `?escola=` (superadmin)

### Phase 4 — Criação (`plano-ensino/criar/page.tsx`)
- [x] Sem breadcrumbs; card Identificação 100% largura 50/50 (Ano Letivo + Turma)
- [x] Disciplinas como cards interativos (border-primary, bg-primary/5, Check no canto)
- [x] Superadmin via `?escola=` + Suspense/useSearchParams; EmptyState sem param

### Phase 5 — Detalhe (`[id]/page.tsx`) + form
- [x] Sem breadcrumbs; `PlanoAulaForm` extraído; tabs resetam o form; `excluirPlanoAula` import estático
- [x] BNCC N1/N2 → pills, N3 → Badge de código (infantil/fundamental/médio)
- [x] Footer sticky Cancelar/Salvar `h-11` destacados

### Phase 6 — Verificação
- [x] `npx next build` verde
- [ ] Validação visual manual (lista, criação, detalhe, cômputo de aulas/horas)
