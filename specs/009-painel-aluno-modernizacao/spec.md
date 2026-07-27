# Feature Specification: Painel do Aluno — Modernização Visual

**Feature Branch**: `009-painel-aluno-modernizacao`
**Created**: 2026-07-16
**Status**: Draft
**Depends on**: `specs/002-design-system` ✅, `specs/006-dashboard-modernizacao` (DashboardTabs pattern) ✅
**Input**: User description: "Modernizar a tela de Painel do Aluno, mesmo padrão da Dashboard (visual completo). Modernizar TODOS os 12 componentes. Adicionar 4 tabs fixas (Visão Geral, Desempenho, Acadêmico, Histórico). Migrar FiltroPessoa para shadcn Command/Popover."

## Contexto

A tela de Painel do Aluno (`/gestao-usuarios/painel-aluno`) está em estado razoável — usa `PageContainer`, `PageHeader`, `PageSection`, `Card`, `StatCard`, `EmptyState`. Mas:

1. **~133 violações de `text-xs`** (Regra #10) em 13 arquivos — o maior ofensor de qualquer tela modernizada até agora
2. **Cards empilhados** sem agrupamento temático (cansa a rolagem em painéis longos)
3. **FiltroPessoa custom** usa `<div>` com `mousedown` listener manual em vez de shadcn `Command`/`Popover`
4. **Falta adaptação mobile** real — `md:grid-cols-X` não funciona bem em 360px
5. **Empty states** alguns usam texto cru em vez do componente oficial

Esta spec **não altera contratos de dados** (`getTurmasDaPessoa`, `getDadosPessoais`, `getResumoAluno`, `getDesempenhoPorDisciplina`, `getEvolucao`, `getQuadroAulas`, `getHistorico`, etc. permanecem).

## Clarifications

### Session 2026-07-16

- Q: Escopo geral — quantos componentes? → A: **Modernização completa (12 componentes)**
- Q: Tabs no painel — como organizar? → A: **4 tabs fixas** (Visão Geral, Desempenho, Acadêmico, Histórico)
- Q: FiltroPessoa — como tratar? → A: **Migrar para shadcn Command/Popover** (refator)
- Q: Hero metric / card especial? → A: **N/A** — tela de visualização detalhada
- Q: Re-fetch vs client-side? → A: **N/A** — server actions existentes

---

## Product Experience

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx** | PE-101 | Painel é tarefa de leitura — prioriza visualização clara e filtros |
| **PE-2xx** | PE-201, PE-202 | Hierarquia: Identificação > KPIs > Detalhes por aba |
| **PE-3xx** | PE-301, PE-302 | Tabs reduzem rolagem; agrupamento temático (Visão Geral / Desempenho / Acadêmico / Histórico) |
| **PE-4xx** | PE-401, PE-403 | Loading com skeleton, empty state contextual |
| **PE-5xx** | PE-501 | Empty states oficiais em todos os cards |
| **PE-6xx** | **PE-601, PE-602, PE-603, PE-604, PE-605** | Mobile card-list onde aplicável; touch ≥ 36px; tabs preservam ordem de prioridade |
| **PE-8xx** | PE-801 | StatusBadge semântico para situação da matrícula |
| **PE-9xx** | PE-902, PE-905 | Foco visível, `aria-required` em inputs, `role="alert"` em mensagens |

## User Scenarios

### User Story 1 — Profissional busca aluno e visualiza visão geral (P1)

Acessa `/gestao-usuarios/painel-aluno`. Digita "maria" no campo shadcn Command. Lista filtra em tempo real. Seleciona "Maria Silva". Vê Identificação + Saúde + KPIs (Frequência, Desempenho, Disciplinas, Ocorrências) na aba "Visão Geral". Seleciona turma. Abas "Desempenho" e "Acadêmico" ficam habilitadas.

**Acceptance**:
- Filtro usa shadcn Command/Popover (busca em tempo real)
- Visão Geral: Identificação + Saúde + 4 KPIs
- KPIs: Frequência % (cor semântica), Desempenho (cor semântica), Disciplinas, Ocorrências
- Tabs com 4 abas, padrão dashboard (`bg-card` + `border`)

### User Story 2 — Profissional consulta desempenho por disciplina (P2)

Clica na aba "Desempenho". Vê CardDesempenhoDisciplina (tabela com médias por disciplina) e CardEvolucao (gráfico Recharts com notas ao longo do tempo).

**Acceptance**:
- Tabela responsiva (PE-602)
- Gráfico com gradient, legend, tooltip moderno
- Card mobile com 1-col em `<md>`

### User Story 3 — Profissional consulta quadro de aulas (P2)

Clica na aba "Acadêmico". Vê CardQuadroAulas (grade dia×horário da turma selecionada).

**Acceptance**:
- Grade mantém-se em mobile com scroll horizontal
- Linhas alternadas, sticky first column

### User Story 4 — Profissional consulta histórico e ocorrências (P2)

Clica na aba "Histórico". Vê CardHistorico (matrículas do aluno, accordion com notas) e CardOcorrencias (lista de ocorrências disciplinares/pedagógicas).

**Acceptance**:
- Accordion acessível por teclado
- Mobile: card-list em vez de tabela quando aplicável
- Modal "Adicionar Histórico" segue layout oficial (header sticky, footer fixo, padding correto)

### User Story 5 — FiltroPessoa moderno (P1)

O filtro de aluno foi migrado para shadcn Command (busca instantânea) ou Popover (dropdown com search).

**Acceptance**:
- Dropdown abre com click-to-open (não precisa digitar primeiro)
- Mostra lista de alunos conforme digita
- Suporta busca por nome E CPF
- Empty state com EmptyState oficial quando não há matches

## Edge Cases

- Nenhum aluno selecionado: empty state centralizado "Selecione um aluno"
- Aluno sem matrículas: empty state contextual
- Filtro sem matches: empty state no dropdown
- Filtro com erro: mensagem em `text-destructive`
- Turma sem alunos: CardKpis com loading/error
- Mobile 360px: tabs em scroll horizontal, cards em 1-col
- FiltroPessoa com debounce 300ms (preservar comportamento atual)
- FiltroPessoa com `mín. 3 caracteres` (preservar regra de negócio)

## Out of Scope

- Refator de actions em `painel-pessoa.ts`
- Adicionar novos campos nos cards (apenas ajustar visual)
- Drag-and-drop em gráficos
- Export de relatórios
- Filtros avançados (faixa de data, tipo de ocorrência, etc)
- Internacionalização
- Dark mode custom (já tem)
