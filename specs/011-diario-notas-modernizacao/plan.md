# Implementation Plan: Diário de Classe — Aba Notas Modernizada

**Branch**: `011-diario-notas-modernizacao` | **Data**: 2026-07-31 | **Spec**: [spec.md](./spec.md)

## Summary

Reescrever a aba **Notas** (Avaliações Numéricas) do Diário de Classe seguindo o padrão das abas
modernizadas (Parecer, Indicadores): seletor de disciplina + segmented control de bimestres com status dots,
sub-abas Resumo / Registro / Recuperações, cards de aluno em acordeão com mini-tabela de notas,
auto-save com debounce (800ms) e indicador de salvamento. Nova aba **Recuperações** com sub-abas conforme o
método (Por Avaliação, Por Bimestre, Final). Persistência via server actions existentes + novas.

## Technical Context

- **Language**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
- **Dependencies**: shadcn/ui (Tabs, Button, Input, Select, Table, Badge, Progress, Accordion), Tailwind v4, lucide-react, sonner
- **Storage**: Supabase. 1 nova migration (`patch_recuperacoes_descricao.sql`).
- **Testing**: build (`npx next build`) + validação visual manual. Sem framework de testes automatizado.
- **Constraints**: zero novas deps npm; tokens do Design System (sem hex); shadcn/ui; ações via `'use server'`.

## Project Structure

```
supabase-migrations/
  patch_recuperacoes_descricao.sql        # NOVO
src/lib/actions/
  avaliacoes-numericas.ts                 # MODIFICADO (config completa, ações novas, engine rec)
src/components/diario-classe/
  avaliacoes-numericas.tsx                # REESCRITO
specs/011-diario-notas-modernizacao/
  spec.md / plan.md                       # NOVOS
```

## Task Breakdown

### Phase 0 — Docs
- [x] Criar `specs/011-diario-notas-modernizacao/spec.md`
- [x] Criar `specs/011-diario-notas-modernizacao/plan.md`

### Phase 1 — Migration
- [ ] `patch_recuperacoes_descricao.sql`: `ALTER TABLE academico_recuperacoes ADD COLUMN IF NOT EXISTS descricao VARCHAR(100)`

### Phase 2 — Server actions (`avaliacoes-numericas.ts`)
- [ ] `ConfigNumericaCompleta` type + `getNumericoConfigCompleta(metodoId)`
- [ ] `listarNotasTurmaDisciplina(turmaId, disciplinaId, pessoaId)`
- [ ] `limparNotasAluno(turmaId, alunoId, disciplinaId, periodo, pessoaId)`
- [ ] `salvarRecuperacao` + parâmetro `descricao`; `Recuperacao` type + `descricao`
- [ ] `listarRecuperacoes` + `descricao`
- [ ] Engine `calcularDesempenhoAluno`: rec por avaliação (substitui) e por período (max/substitui)

### Phase 3 — Componente (`avaliacoes-numericas.tsx`)
- [ ] Estado + carregamento (config completa, notas de todos os períodos, recuperações, desempenhos)
- [ ] Topo: Select disciplina + segmented control bimestres (status dots global)
- [ ] Sub-abas underline (Resumo/Registro/Recuperações)
- [ ] Resumo: 5 cards estatísticos + tabela (aluno sticky, bimestres, Média Final, Situação)
- [ ] Registro: overview bar + acordeão (pills bimestre, badge média, label status, mini-tabela com data, média)
- [ ] Auto-save debounce 800ms + feedback salvando/auto-salvo + link "Limpar notas"
- [ ] Recuperações: sub-abas dinâmicas (avaliação/período/final) + auto-save 600ms

### Phase 4 — Verificação
- [ ] `npx next build` verde

## Risk

- Média client-side (Registro) vs server (Resumo) podem divergir brevemente entre save e recalc — convergem em ~1s.
- Mudança de comportamento no engine: rec por período agora sempre aplica (antes só com substitutiva) — sem dados existentes de rec por período, impacto nulo.
