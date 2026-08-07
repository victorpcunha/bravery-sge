# Feature Specification: Plano de Ensino — Modernização de Telas

**Feature Branch**: `012-plano-ensino-modernizacao`
**Created**: 2026-08-04
**Status**: Implemented
**Depends on**: `specs/002-design-system`, `specs/005-design-system-v2`
**Input**: User description: "Ajustar a tela de Plano de Ensino — card de filtros (escola p/ superadmin, ano letivo, turma, disciplina, período em pills), mini-cards ricos na lista, cards interativos de disciplina na criação, formulário de plano de aula em 3 cards com cômputo de aulas/horas do Quadro de Aulas."

## Contexto

O módulo Plano de Ensino (`/gestao-pedagogica/plano-ensino`) usa `planos_ensino` (por turma) → `planos_ensino_disciplinas` (matriz_disciplina_id) → `planos_aula` (com `periodos INT[]`, `data_inicio/fim`, `bncc_fields JSONB`, `updated_at`). As três telas (lista, criação e detalhe com plano de aula) precisam de modernização visual e funcional:

1. **Lista**: não tem card de filtros; botão "Novo Plano" no header; cards pobres ("1° ANO - AB - Geografia")
2. **Criação**: breadcrumbs; card de identificação em coluna; checkboxes de disciplina
3. **Detalhe**: breadcrumbs; form de plano de aula em 1 card só; sem visibilidade de aulas/horas do Quadro de Aulas

Esta spec **não altera o modelo de dados** (nenhuma migration). Aproveita o `updated_at` já existente.

## Clarifications

### Session 2026-08-04

- Q: Filtro de período/bimestre no card → A: **Derivar dos planos de aula** — filtro mostra planos com ≥1 plano de aula no(s) bimestre(s); card mostra união dos períodos
- Q: Professor responsável → A: **Vinculações da turma** (`turmas_profissionais`), por `matriz_disciplina_id`
- Q: Quantidade de aulas no card → A: **Computada do Quadro de Aulas** dentro das datas (`data_inicio`/`data_fim`) dos planos de aula do plano
- Q: Disciplina para cômputo no form → A: **Listar cada disciplina** do plano com sua quantidade (aulas + horas)
- Q: Escola na criação (superadmin) → A: **Via query param** `?escola=` vindo da lista
- Q: Aulas/horas no card → A: **Exibir aulas + horas** computadas do Quadro

---

## Product Experience

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx** | PE-101 | Lista com filtros rápidos (escola/ano/turma/disciplina/período) |
| **PE-2xx** | PE-201, PE-202 | Hierarquia: filtros > grid de cards > ações |
| **PE-4xx** | PE-401, PE-403 | Skeleton/spinner; empty states contextuais com CTA |
| **PE-5xx** | PE-501 | EmptyState oficial em todos os estados vazios |
| **PE-6xx** | PE-601, PE-603 | Grid responsivo de cards; toques ≥ 36px (pills h-9, botões h-11) |
| **PE-8xx** | PE-802, PE-803 | Cards ricos com disciplina em destaque, badges semânticos |
| **PE-9xx** | PE-902, PE-905 | `aria-pressed` em pills/cards clicáveis; `role`/label correto |

## User Scenarios

### User Story 1 — Gestor filtra planos por turma/disciplina/período (P1)

Acessa `/gestao-pedagogica/plano-ensino`. Vê card "Filtros". Seleciona ano letivo (já vem o ativo), turma, disciplina e bimestres em pills. A lista atualiza.

**Acceptance**: filtros encadeados (turma habilita disciplina; disciplina só com turma); superadmin vê "Selecione uma escola" sem opção "Todas as Escolas"; ano letivo padrão = ativo.

### User Story 2 — Gestor identifica um plano rapidamente (P1)

Na lista, cada plano é um mini-card com disciplina em destaque, turma, bimestre, professor responsável, quantidade de aulas + horas (do Quadro de Aulas) e data da última atualização, com botão "Ver Plano".

**Acceptance**: todos os campos presentes; "Novo Plano de Ensino" no cabeçalho da seção de planos.

### User Story 3 — Professor cria plano de aula com panorama de aulas/horas (P1)

No detalhe do plano, abre "Criar Plano de Aula". Preenche datas; o sistema consulta o Quadro de Aulas ativo e exibe, por disciplina, quantas aulas e horas o período cobre.

**Acceptance**: cômputo por disciplina (interdisciplinar lista todas); informativo, sem persistir; baseado no Quadro ativo da turma no intervalo.

---

## Requirements

### R1 — Filtros da lista (`plano-ensino/page.tsx`)
- `PageSection compact "Filtros"` + `FilterBar` (sem busca)
- Escola (só superadmin): placeholder "Selecione uma escola", **sem** "Todas as Escolas"; demais filtros dependem da escola
- Ano Letivo: lista todos, pré-seleciona o **ativo** (`status === 'ativo'`); exibe apenas `descricao || ano` (sem sufixo "(atual)")
- Turma: `listarTurmasDiario`; habilitada após ano
- Disciplina: `getDisciplinasDiario(turmaId)`; default "Selecione uma disciplina" + opção "Todas as disciplinas"
- Período: pills multi-select (`ClickablePill`); deriva de `listarPeriodosPlanoEnsino(turmaId)` (default 4)

### R2 — Cards de planos
- `PageSection flush "Plano de Ensino"` com botão "Novo Plano de Ensino" no header
- Mini-card (grid responsivo): disciplina em destaque, turma, bimestre (união de períodos), professor (turmas_profissionais), aulas + horas (Quadro de Aulas), última atualização, "Ver Plano"

### R3 — Criação (`criar/page.tsx`)
- Sem breadcrumbs; card Identificação **100% largura**, Ano Letivo + Turma 50/50 lado a lado
- Disciplinas como **cards interativos** (borda `border-primary`, fundo `bg-primary/5`, ícone `Check` no canto superior direito)
- Superadmin usa `?escola=` da lista; sem param → EmptyState orientando a selecionar escola

### R4 — Form de Plano de Aula (`plano-aula-form.tsx`)
- 3 cards: **Identificação e Conteúdo** (Tema, Períodos em pills, Data Inicial, Data Final, bloco informativo de aulas/horas, Conteúdo), **Estrutura da BNCC** (N1/N2 em pills, N3 Habilidades com código em Badge, mesma regra para infantil/médio), **Planejamento Pedagógico** (Recursos, Metodologia, Avaliação, Referências)
- **Cômputo de aulas/horas**: `calcularAulasDoQuadro(turmaId, matrizIds, inicio, fim)` — expande o Quadro ativo no intervalo (limitado a `data_inicial/final` do quadro), por disciplina, com debounce 500ms
- **Footer sticky** (`sticky bottom-0 bg-background/95 backdrop-blur border-t`) com Cancelar (`outline h-11`) e Salvar (`default h-11 shadow-md`)

### R5 — Detalhe (`[id]/page.tsx`)
- Sem breadcrumbs; form extraído para componente; tabs de período resetam o form ao trocar

## Non-Goals
- Não alterar `academico_diario_planos_aplicados` / aba Plano de Aula do Diário de Classe
- Não mudar o modelo de dados (nenhuma migration)
- Sem novas dependências npm

## Acceptance Criteria
1. Lista com filtros e cards conforme R1/R2, incluindo fluxo superadmin (escola obrigatória)
2. Criação sem breadcrumbs, identificação 50/50 e disciplinas como cards
3. Form de plano de aula em 3 cards, pills de período/BNCC, código em Badge
4. Cômputo de aulas/horas por disciplina reflete o Quadro de Aulas ativo no intervalo de datas
5. `npx next build` verde
