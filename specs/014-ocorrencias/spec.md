# Feature Specification: Ocorrências — Tela de Profissionais da Escola

**Feature Branch**: `014-ocorrencias`
**Created**: 2026-08-22
**Status**: Draft
**Depends on**: `specs/002-design-system`, `specs/005-design-system-v2`, `specs/007-usuarios-modernizacao`, `specs/008-perfis-modernizacao`, `specs/009-painel-aluno-modernizacao` (referência para busca de aluno)
**Input**: User description: "Módulo Gestão Acadêmica - Tela: Ocorrências. Deve ser criado a tela de Ocorrências, composto por duas partes: a tela de ocorrências, acessada pelos profissionais da escola. Posteriormente será disponibilizado no Portal dos Responsáveis."

## Contexto

A tabela `ocorrencias` já existe em `supabase-migrations/ocorrencias.sql` e é hoje consumida exclusivamente pelo card de Ocorrências do **Painel do Aluno** (cards `card-ocorrencias.tsx` + ação `getOcorrencias` em `painel-pessoa.ts:1160`). O modelo atual registra ocorrências por **aluno** (`person_id`) com tipo `disciplinar | pedagogica`, descrição, data e turma.

O profissional da escola **não tem hoje** uma tela dedicada para gerenciar (criar/editar/listar) ocorrências. Esta spec entrega a primeira parte do módulo de Ocorrências:

1. **Tela de Listagem de Ocorrências** para profissionais da escola, controlada por permissão de Perfil (`gestao-academica.ocorrencias`).
2. **Tela de Cadastro/Edição de Ocorrência** com fluxo próprio (sem breadcrumbs, com Voltar/Excluir condicional).
3. **Mini cards** como unidade de listagem (não tabela), com ícone/badge do tipo (Positivo/Negativo) e demais metadados da ocorrência.

**Escopo da Portal dos Responsáveis**: a flag `apresentar_no_portal` é persistida agora, mas a leitura pública para responsáveis **fica para spec futura** (Portal dos Responsáveis). Esta spec não cria rotas nem ações para o portal.

**Modelo de dados**: a tabela atual `ocorrencias` tem amarração `person_id` (um aluno por ocorrência). O usuário descreve ocorrências com **N profissionais** (autoria coletiva) e **N alunos** (vários envolvidos). Isso exige:

- **Adicionar `titulo`** à ocorrência (atualmente só existe `descricao`).
- **Refatorar `tipo`**: de `disciplinar | pedagogica` para `positiva | negativa` (semântica Positivo/Negativo), preservando migração de dados existentes.
- **Adicionar `apresentar_no_portal BOOLEAN`** (flag do futuro Portal).
- **Tabelas associativas**: `ocorrencias_profissionais` (N profissionais autores) e `ocorrencias_alunos` (N alunos envolvidos).
- **`ocorrencias.turma_id`** deixa de ser referência única: passa a ser uma propriedade **derivada** dos alunos envolvidos (regra: turma atual principal, ou primeira matrícula ativa do aluno no ano letivo vigente da escola). Persistir `turma_id` na tabela principal como **cache denormalizado opcional** da turma primária dos alunos (somente para filtros e ordenação rápida; não é fonte da verdade).

Esta spec **não altera** a leitura feita pelo Painel do Aluno (`getOcorrencias` em `painel-pessoa.ts:1160`): o card do painel continua exibindo as ocorrências **por aluno** (`person_id`). A migração de tipos (`disciplinar→negativa`, `pedagogica→positiva`) é feita no banco, com mapeamento reversível para a UI do Painel.

---

## Clarifications

### Session 2026-08-22

- Q: O modelo atual é 1 ocorrência → 1 aluno. O usuário descreve N profissionais autores e N alunos envolvidos. Como modelar? → A: **Refatorar** com `ocorrencias_profissionais` (autoria) e `ocorrencias_alunos` (vínculo). Mantém `person_id` em `ocorrencias_alunos` para compatibilidade com Painel do Aluno.
- Q: Tipo `disciplinar | pedagogica` → Positivo/Negativo é compatível com o card do Painel? → A: **Migrar** `disciplinar → negativa` e `pedagogica → positiva` no banco; o card do Painel lê o novo valor e mostra o badge semântico (`destructive` para negativa, `warning` para positiva, conforme paleta atual).
- Q: Onde fica a turma da ocorrência? → A: **Derivada** dos alunos. Adicionar `turma_id` em `ocorrencias` como **cache opcional** (turma primária do 1º aluno no ano vigente), com índice e filtro rápido. Fonte da verdade continua sendo `ocorrencias_alunos`.
- Q: Ocorrência pode existir sem aluno? → A: **Não**. Pelo menos 1 aluno envolvido é obrigatório (validação Zod + constraint).
- Q: Ocorrência pode existir sem profissional? → A: **Sim**, mas o profissional logado é registrado como `created_by` mesmo sem autoria explícita; autoria é opcional (a ocorrência pode ter sido criada pelo sistema ou pelo usuário logado sem co-autores).
- Q: O usuário pode excluir ocorrência que aparece no Painel do Aluno? → A: **Sim**, a exclusão é da ocorrência (apaga em cascata `ocorrencias_alunos` e `ocorrencias_profissionais`); o card do Painel some imediatamente. Não há "soft delete" para ocorrências.
- Q: Quem pode criar ocorrência? → A: Qualquer profissional da escola com `gestao-academica.ocorrencias.criar` no perfil. Edição/Exclusão exigem `gestao-academica.ocorrencias.editar`/`excluir`. Visualização exige `gestao-academica.ocorrencias.visualizar`. Sem permissão → `ShieldAlert`.
- Q: Aluno é vinculado pela matrícula ativa na escola? → A: **Sim**. A busca de alunos (`buscarPessoasMatriculadas`) já filtra por matrículas ativas no ano letivo vigente da escola. A spec reusa este padrão.
- Q: A ordem da listagem? → A: **Data da ocorrência DESC** (mais recente primeiro), com secundária por `created_at DESC`.
- Q: Paginação da lista? → A: **10 mini cards por página** (client-side), seguindo o padrão `<Pagination>` da spec 007.
- Q: Filtros persistidos em URL? → A: **Não nesta spec**. Filtros são locais (estado do componente). Query strings não são necessárias.
- Q: `captionLayout="dropdown"` do DatePicker é o padrão já implementado? → A: **Confirmar no plano**. A spec afirma o requisito; a implementação usa `react-day-picker` com `captionLayout="dropdown"` se já disponível, ou cria wrapper oficial.

---

## Product Experience

| Categoria | Princípios | Aplicação |
|-----------|-----------|-----------|
| **PE-1xx** | PE-101, PE-102, PE-103 | Tela de Listagem = localizar ocorrências; Cadastro = criar/editar uma ocorrência; ação principal = "Nova Ocorrência" no topo direito |
| **PE-2xx** | PE-201, PE-202, PE-203 | Hierarquia: filtros > grid de mini cards > ações; ícone + badge do tipo (peso visual maior que demais informações) |
| **PE-3xx** | PE-302 (Lista), PE-304 (Cadastro) | Layout de Listagem (filtros + grid + paginação) e Layout de Cadastro (formulário único, sem wizard) |
| **PE-4xx** | PE-401, PE-402, PE-403 | Excluir via `ConfirmDialog`; toasts de sucesso/erro via Sonner; erros do servidor com mensagem orientativa |
| **PE-5xx** | PE-501, PE-502 | Empty states: "Nenhuma ocorrência cadastrada" (CTA "Nova Ocorrência") e "Nenhuma ocorrência para os filtros aplicados" (CTA "Limpar filtros") |
| **PE-6xx** | PE-601, PE-602, PE-603, PE-604 | Mini cards responsivos (grid `md:grid-cols-2 xl:grid-cols-3`); botão Voltar/Excluir/Salvar `h-11`; combobox chips com altura de toque ≥ 36px |
| **PE-7xx** | PE-701, PE-703, PE-705 | Fluxo único "Listar → Criar/Editar → Voltar para lista"; botão Voltar sempre disponível; estado preservado em caso de erro de salvamento |
| **PE-8xx** | PE-801, PE-802 | Mini cards (visualização primária do registro); StatusBadge semântico (`success` para Positiva, `destructive` para Negativa) |
| **PE-9xx** | PE-901, PE-902, PE-903, PE-904 | `aria-label` nos ícones; `aria-required` nos inputs críticos (Título, Data, Tipo); `role="alert"` em erros; foco visível em Combobox/Chips |

## User Scenarios

### User Story 1 — Profissional da escola consulta e cria ocorrências (P1)

Maria é gestora da Escola X. Acessa `/gestao-academica/ocorrencias`. Vê o card de filtros (Período, Profissionais, Alunos, Tipo) com "Todas" selecionado. O grid de mini cards está vazio (sem ocorrências cadastradas). Clica em **"Nova Ocorrência"** (topo direito do card de listagem). Abre `/gestao-academica/ocorrencias/novo`. Preenche Título, seleciona tipo "Positiva" via pill, marca "Apresentar Ocorrência no Portal" (pill clicável), seleciona a Data, escolhe 1 aluno e 2 profissionais nos Comboboxes com chips, escreve a descrição. Clica em **Salvar**. Volta para a listagem; vê o mini card com ícone verde (Positiva), badge "Positiva", título, data, pill "Portal", 2 profissionais, 1 aluno.

**Acceptance**:
- Acesso à tela respeita `gestao-academica.ocorrencias.visualizar` no perfil (sem permissão → `ShieldAlert`).
- Filtros funcionam individualmente e combinados (AND lógico).
- "Nova Ocorrência" abre nova página (não modal), sem breadcrumbs, com botão **Voltar** e botão **Salvar** sticky no rodapé.
- Validação Zod bloqueia salvamento sem Título, Data ou pelo menos 1 aluno envolvido.

### User Story 2 — Profissional edita e exclui ocorrência existente (P1)

Maria clica no botão **Editar** (ícone Pencil) em um mini card. Abre `/gestao-academica/ocorrencias/{id}` com os campos preenchidos. Aparece adicionalmente o botão **Excluir** (somente em ocorrências já criadas). Altera o título e salva; toast de sucesso; volta para a listagem atualizada.

**Acceptance**:
- Tela de edição mantém os mesmos campos e layout da criação; apenas adiciona o botão Excluir (sticky bottom).
- Excluir abre `ConfirmDialog` (`variant="destructive"`); após confirmar, redireciona para a lista com toast "Ocorrência excluída com sucesso".
- Excluir é bloqueado server-side sem `gestao-academica.ocorrencias.excluir`.

### User Story 3 — Superadmin filtra ocorrências de uma escola específica (P2)

Carlos é superadmin e acessa `/gestao-academica/ocorrencias`. Como superadmin, vê o card de filtros com **escolha de Escola** no topo (Select de escolas vinculadas/contratadas). Seleciona "Escola X"; os demais filtros passam a atuar apenas sobre as ocorrências dessa escola.

**Acceptance**:
- Card de filtros para superadmin começa com **Select de Escola** (obrigatório para carregar a lista); sem seleção, a listagem exibe `EmptyState` orientando "Selecione uma escola para listar as ocorrências".
- Para usuários não-superadmin, o filtro de Escola **não aparece** (lista já está escopada automaticamente à sua `schoolId`).
- Após selecionar Escola, os demais filtros (Período, Profissionais, Alunos, Tipo) ficam disponíveis.

### User Story 4 — Filtros combinados e limpeza (P3)

Maria aplica filtro de Período (01/08/2026 a 31/08/2026) e Tipo (Negativa). A lista mostra apenas ocorrências negativas de agosto/2026. Adiciona o aluno "João Silva" ao filtro — a lista reduz para ocorrências negativas de agosto envolvendo o João. Clica em **"Limpar filtros"** (botão no card de filtros); todos os filtros voltam ao padrão.

**Acceptance**:
- Todos os filtros são combinados com AND.
- "Limpar filtros" reseta para o estado inicial (Período vazio, Tipo=Todas, Profissionais vazio, Alunos vazio) sem perder a Escola selecionada (se superadmin).
- A contagem de resultados é mostrada na paginação (`Mostrando X a Y de Z`).

### User Story 5 — Card de Ocorrências no Painel do Aluno permanece compatível (P2)

Após o deploy, Maria abre o Painel do Aluno de um aluno específico. O `card-ocorrencias.tsx` continua exibindo a lista de ocorrências do aluno com badges semânticos (`destructive` para Negativa, `warning` para Positiva). Os dados exibidos não foram perdidos pela migração.

**Acceptance**:
- Nenhuma ocorrência existente antes da migração desaparece do Painel do Aluno.
- Badge continua funcional após migração `disciplinar → negativa` e `pedagogica → positiva`.
- A query `getOcorrencias` em `painel-pessoa.ts:1160` lê a tabela `ocorrencias` já migrada (sem `INNER JOIN` com as novas tabelas associativas; leitura direta).

---

## Requirements

### R1 — Migration: refatorar tabela `ocorrencias` + tabelas associativas

**Arquivo**: `supabase-migrations/014_ocorrencias_refactor.sql`

1. **Renomear valores do CHECK de `tipo`**:
   - `CHECK (tipo IN ('positiva', 'negativa'))` (substitui `'disciplinar'`, `'pedagogica'`).
   - Migrar dados existentes: `UPDATE ocorrencias SET tipo = 'negativa' WHERE tipo = 'disciplinar'`.
   - Migrar: `UPDATE ocorrencias SET tipo = 'positiva' WHERE tipo = 'pedagogica'`.

2. **Adicionar colunas à `ocorrencias`**:
   - `titulo VARCHAR(200) NOT NULL DEFAULT ''` (backfill com primeiros 50 chars de `descricao` para registros antigos; em nova spec, título é obrigatório).
   - `apresentar_no_portal BOOLEAN NOT NULL DEFAULT FALSE`.
   - `turma_id UUID` (cache opcional, FK para `turmas(id) ON DELETE SET NULL`) — preenchido automaticamente na inserção a partir da turma primária do 1º aluno.

3. **Criar `ocorrencias_profissionais`** (autoria):
   ```sql
   CREATE TABLE ocorrencias_profissionais (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     ocorrencia_id UUID NOT NULL REFERENCES ocorrencias(id) ON DELETE CASCADE,
     person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
     UNIQUE (ocorrencia_id, person_id)
   );
   CREATE INDEX idx_ocorrencias_prof_ocorrencia ON ocorrencias_profissionais(ocorrencia_id);
   CREATE INDEX idx_ocorrencias_prof_pessoa ON ocorrencias_profissionais(person_id);
   ```

4. **Criar `ocorrencias_alunos`** (vínculo):
   ```sql
   CREATE TABLE ocorrencias_alunos (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     ocorrencia_id UUID NOT NULL REFERENCES ocorrencias(id) ON DELETE CASCADE,
     person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
     UNIQUE (ocorrencia_id, person_id)
   );
   CREATE INDEX idx_ocorrencias_alunos_ocorrencia ON ocorrencias_alunos(ocorrencia_id);
   CREATE INDEX idx_ocorrencias_alunos_pessoa ON ocorrencias_alunos(person_id);
   ```

5. **Migration de vínculo pré-existente** (para dados existentes com `person_id` direto em `ocorrencias`):
   ```sql
   INSERT INTO ocorrencias_alunos (ocorrencia_id, person_id)
   SELECT id, person_id FROM ocorrencias;
   ```

6. **Recurso de permissão**:
   ```sql
   INSERT INTO recursos (codigo, nome, modulo) VALUES
     ('gestao-academica.ocorrencias', 'Ocorrências', 'Gestão Acadêmica')
   ON CONFLICT (codigo) DO NOTHING;
   ```
   (Permite granularidade: `gestao-academica.ocorrencias.visualizar/criar/editar/excluir`.)

### R2 — Server Actions em `src/lib/actions/ocorrencias.ts`

Todas as actions usam `'use server'` + `getSupabaseAdmin()`. Permissões validadas server-side (Constitution II). Multi-tenant: filtrar por `school_id` (Constitution III).

- **`listarOcorrencias(filtros, pessoaId)`**: `filtros = { escolaId, dataInicio, dataFim, profissionalIds: string[], alunoIds: string[], tipo: 'todas' | 'positiva' | 'negativa' }`. Retorna `OcorrenciaListagem[]` com: `id`, `titulo`, `tipo`, `data_ocorrencia`, `apresentar_no_portal`, `quantidade_profissionais`, `profissionais: PessoaResumo[]`, `quantidade_alunos`, `alunos: PessoaResumo[]`, `descricao_preview` (100 chars), `created_at`.
- **`listarProfissionaisAtivos(escolaId, pessoaId)`**: retorna `PessoaResumo[]` filtrado por `people.school_id = escolaId` e `tipo = 'profissional'` (ou que tenha função profissional). Valida `gestao-academica.ocorrencias.visualizar`.
- **`buscarAlunosMatriculados(escolaId, termo, pessoaId)`**: reusa `buscarPessoasMatriculadas` (já existente em `painel-pessoa.ts:211`); ≥ 3 letras.
- **`listarEscolasParaSuperadmin(pessoaId)`**: retorna `SchoolResumo[]` (id, nome) — apenas para superadmin (`validarPermRead` + checagem de role).
- **`getOcorrencia(id, pessoaId)`**: retorna `OcorrenciaDetalhe` (todos os campos incluindo descrição completa, profissionais[], alunos[]). Valida `gestao-academica.ocorrencias.visualizar`.
- **`criarOcorrencia(payload, pessoaId)`**: valida Zod (`titulo` 1-200, `tipo` enum, `data_ocorrencia` ISO date, `alunoIds` ≥ 1, `profissionalIds` ≥ 0, `descricao` 0-500, `apresentar_no_portal` boolean); valida `gestao-academica.ocorrencias.criar`; INSERT em `ocorrencias` + inserts em `ocorrencias_alunos` e `ocorrencias_profissionais`; `created_by` = `pessoaId`; `turma_id` = turma primária do 1º aluno; `school_id` = `escolaId` derivado do 1º aluno (matrícula ativa no ano vigente).
- **`atualizarOcorrencia(id, payload, pessoaId)`**: valida `gestao-academica.ocorrencias.editar`; UPDATE em `ocorrencias`; DELETE+INSERT em `ocorrencias_alunos` e `ocorrencias_profissionais` (transação); `updated_by` = `pessoaId`; revalida `turma_id` cache.
- **`excluirOcorrencia(id, pessoaId)`**: valida `gestao-academica.ocorrencias.excluir`; DELETE em `ocorrencias` (CASCADE apaga as tabelas associativas); audit log (Constitution VIII).

Tipos exportados em `src/lib/actions/ocorrencias.ts`:

```ts
export type OcorrenciaTipo = 'positiva' | 'negativa'
export type OcorrenciaListagem = { ... }
export type OcorrenciaDetalhe = { ... }
export type OcorrenciaFiltros = { escolaId, dataInicio, dataFim, profissionalIds, alunoIds, tipo }
```

### R3 — Página de Listagem `/gestao-academica/ocorrencias`

**Arquivo**: `src/app/(app)/gestao-academica/ocorrencias/page.tsx` (client component).

- **PageHeader**: ícone `AlertCircle`, título "Ocorrências", descrição "Gerencie as ocorrências registradas pelos profissionais da escola".
- **PageSection "Filtros"** (compact, com `FilterBar` interno):
  - Para superadmin: `Select` de **Escola** (label "Selecione uma escola" no estado inicial). Carrega via `listarEscolasParaSuperadmin`. Valor obrigatório para exibir a lista.
  - **Período** (DataPicker range com `captionLayout="dropdown"`): 2 `DatePicker` oficiais lado a lado ("Data Inicial" e "Data Final") usando o componente oficial já existente no projeto (verificar `date-picker.tsx` em `src/components/ui`).
  - **Profissionais**: Combobox com múltipla seleção e chips (padrão `multiple` + `comboboxchips` shadcn). Botão "Remover todos" e ícone X em cada chip. Carrega via `listarProfissionaisAtivos` filtrado pela escola selecionada.
  - **Alunos**: Combobox assíncrono com debounce 300ms (≥ 3 letras), reusa padrão do `filtro-pessoa.tsx` da spec 014 (referência). Multi-select com chips.
  - **Tipo**: 3 pills (`Todas` | `Positivas` | `Negativas`). Padrão `Todas`.
  - Botão **"Limpar filtros"** (variant ghost) à direita; desabilitado se todos os filtros estão no padrão.
- **PageSection "Listagem"** (flush):
  - Ação `actions={podeCriar ? <Button>Nova Ocorrência</Button> : null}` no topo direito do `PageSection`.
  - Grid responsivo: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`.
  - Cada mini card (`<MiniOcorrenciaCard>`):
    - Topo esquerdo: ícone (CheckCircle2 verde para Positiva, XCircle vermelho para Negativa) — `h-5 w-5`.
    - Topo direito: `<StatusBadge>` semântico (`success` para Positiva, `destructive` para Negativa) com texto "Positiva"/"Negativa".
    - Título: `text-[16px] font-semibold`, line-clamp-2.
    - Linha "Data: 15/08/2026" com ícone Calendar (`text-muted-foreground`).
    - Linha "Portal: Sim/Não" com ícone Eye/EyeOff (chip `bg-primary/10 text-primary` se Sim, `bg-muted text-muted-foreground` se Não).
    - Linha "Profissionais (N): Nome1, Nome2, Nome3 + (mais X)" — `line-clamp-1` na lista de nomes.
    - Linha "Alunos (N): Nome1, Nome2, ..." — idem.
    - Descrição (preview até 100 chars) com `text-[14px] text-muted-foreground line-clamp-2`.
    - Botões no rodapé do card: **Editar** (`variant="ghost" size="icon-sm"` com `<Pencil>`) e **Excluir** (`variant="ghost" size="icon-sm"` com `<Trash2 className="text-destructive"/>`).
  - `<Pagination>` 10/pág client-side (componente da spec 007).
  - **Empty states**:
    - Sem escola selecionada (superadmin) → `EmptyState` ícone `School` "Selecione uma escola" descrição "Para listar as ocorrências, selecione a escola no filtro acima."
    - Sem ocorrências cadastradas → `EmptyState` ícone `AlertCircle` "Nenhuma ocorrência cadastrada" com CTA "Nova Ocorrência" (se `podeCriar`).
    - Sem resultados para filtros → `EmptyState` ícone `SearchX` "Nenhuma ocorrência encontrada para os filtros aplicados" com CTA "Limpar filtros".
  - **Loading**: skeleton de 6 mini cards com `animate-pulse`.

### R4 — Página de Cadastro/Edição `/gestao-academica/ocorrencias/novo` e `/[id]`

**Arquivos**:
- `src/app/(app)/gestao-academica/ocorrencias/novo/page.tsx`
- `src/app/(app)/gestao-academica/ocorrencias/[id]/page.tsx`
- Componente compartilhado: `src/components/ocorrencias/ocorrencia-form.tsx`

- **PageHeader**: **sem breadcrumbs**. Título "Nova Ocorrência" ou "Editar Ocorrência". Ícone `AlertCircle`.
- **Formulário** (dividido em 3 cards lógicos; visualmente um único `<form>` com `space-y-6`):
  1. **Identificação**: Input Título (`<Input>`, max 200 chars), Pill `Tipo` (Positiva | Negativa) usando `<ClickablePill>`, Pill `Apresentar Ocorrência no Portal` (toggle) usando `<ClickablePill>`, DatePicker de `Data da Ocorrência` (com `captionLayout="dropdown"`).
  2. **Vínculos**: Combobox multi-select `Profissionais da Ocorrência` (carrega `listarProfissionaisAtivos`), Combobox multi-select `Alunos Envolvidos` (busca assíncrona com debounce).
  3. **Descrição**: `<Textarea>` com contador `0/500` e maxLength 500.
- **Footer sticky bottom-0** (`bg-background/95 backdrop-blur border-t`):
  - Botão **Cancelar** (`variant="outline"` `h-11`) à esquerda.
  - Botão **Excluir** (`variant="destructive"` `h-11`) à esquerda do Salvar — **somente em edição** (não aparece em `/novo`).
  - Botão **Salvar** (`h-11`) à direita; desabilitado durante salvamento.
- **Validação Zod** (`ocorrenciaSchema`):
  ```ts
  z.object({
    titulo: z.string().min(1, 'Título obrigatório').max(200),
    tipo: z.enum(['positiva', 'negativa']),
    data_ocorrencia: z.date(),
    profissionalIds: z.array(z.string().uuid()),
    alunoIds: z.array(z.string().uuid()).min(1, 'Selecione pelo menos 1 aluno'),
    descricao: z.string().max(500),
    apresentar_no_portal: z.boolean(),
  })
  ```
- **Validação server-side** em `criarOcorrencia`/`atualizarOcorrencia` espelha o schema.
- **Mensagens de erro**: `toast.error()` (Sonner) para erros do servidor; erros inline nos campos para erros Zod client-side (`role="alert"`).
- **Após salvar**: `toast.success()` + `router.push('/gestao-academica/ocorrencias')` (lista filtrada pela escola do registro salvo).

### R5 — Mini Cards (componente)

**Arquivo**: `src/components/ocorrencias/mini-ocorrencia-card.tsx` (client component puro).

- Props: `ocorrencia: OcorrenciaListagem`, `onEditar()`, `onExcluir()`.
- Visual: `<Card>` com `hover:shadow-md transition-shadow`.
- Ícones: `lucide-react` `CheckCircle2` (verde), `XCircle` (vermelho), `Calendar`, `Eye`/`EyeOff`, `Users` (profissionais), `UserCheck` (alunos).
- Acessibilidade: `role="article"` no card, `aria-labelledby` apontando para o título.

### R6 — Sidebar

- Adicionar item **"Ocorrências"** dentro do submenu de **"Gestão Acadêmica"** em `src/components/layout/sidebar.tsx`:
  ```ts
  { title: 'Ocorrências', href: '/gestao-academica/ocorrencias', recurso: 'gestao-academica.ocorrencias' }
  ```
- Posição: logo após **"Alunos Matriculados"** (último item do submenu de Gestão Acadêmica).

### R7 — Compatibilidade com Painel do Aluno

- `painel-pessoa.ts:1160` (`getOcorrencias`): **nenhuma alteração** necessária. A query lê `ocorrencias.tipo` já migrado; o componente `card-ocorrencias.tsx` precisa atualizar o mapeamento de badge:
  - Antes: `STATUS_TIPO = { disciplinar: 'destructive', pedagogica: 'warning' }`.
  - Depois: `STATUS_TIPO = { negativa: 'destructive', positiva: 'warning' }`.
- Badge do Painel mostra "Positiva"/"Negativa" (label atualiza de "disciplinar"/"pedagogica").
- A query continua lendo `ocorrencias` por `person_id` (registros pré-migração) **e** `ocorrencias_alunos` (novos registros)? **Decisão**: alterar `card-ocorrencias.tsx` para consultar `ocorrencias_alunos` no lugar de `ocorrencias.person_id` (após migração de dados, todas as ocorrências têm vínculo na tabela associativa). Backfill garante isso.

### R8 — Auditoria (Constitution VIII)

- Toda criação, edição e exclusão de ocorrência gera registro de auditoria em `audit_logs` (tabela já existente) com `operation`, `entity_id`, `actor_id`, `school_id`, `payload_diff` (somente em edição).

### R9 — Design System & Acessibilidade

- **Tokens**: nenhuma cor hex hardcoded; usar `bg-success`, `text-destructive`, `bg-primary/10` etc.
- **Tipografia**: títulos `text-[16px] font-semibold`, descrições `text-[15px]`, corpo `text-[14px]`.
- **Radius**: `rounded-lg` em cards, `rounded-md` em botões, `rounded-sm` em chips.
- **Dark Mode**: tokens validados para ambos os modos.
- **Foco visível** em Comboboxes e Pills.
- **aria-required**: Título, Data, Tipo, Alunos Envolvidos.

---

## Constraints

- **1 migration nova** (`supabase-migrations/014_ocorrencias_refactor.sql`).
- **0 novas dependências npm** (usa `react-day-picker` já instalado para `captionLayout="dropdown"`).
- Server actions com `'use server'` + `getSupabaseAdmin()`; permissão sempre validada server-side (Constitution II).
- Multi-tenant por design: escopo por `school_id` (Constitution III).
- Auditoria de operações críticas (Constitution VIII).
- Componentes oficiais: `PageContainer`, `PageHeader`, `PageSection`, `FilterBar`, `StatusBadge`, `ConfirmDialog`, `EmptyState`, `Combobox`, `<Pagination>` (spec 007), `<ClickablePill>`, `<DatePicker>` (já existente em `src/components/ui/date-picker.tsx`).

## Out of Scope

- **Portal dos Responsáveis** — apenas persistir `apresentar_no_portal`; leitura pública para responsáveis fica para spec futura.
- **Notificações push/email** para responsáveis ou profissionais.
- **Anexos/mídias** em ocorrências (fotos, documentos).
- **Histórico de edições** com diff visual (apenas `audit_logs` server-side).
- **Exportação de relatórios** (PDF/Excel) de ocorrências.
- **Templates de ocorrências** pré-cadastrados.
- **Vinculação ocorrência ↔ aula do Diário de Classe** (ocorrência é independente do contexto de aula).
- **Comentários em ocorrências** (thread de discussão).

## Key Entities

- **Ocorrência** (`ocorrencias`): id, school_id, titulo, tipo (`positiva`|`negativa`), descricao, data_ocorrencia, apresentar_no_portal, turma_id (cache), created_by, updated_by, created_at, updated_at.
- **OcorrênciaProfissional** (`ocorrencias_profissionais`): id, ocorrencia_id, person_id, created_at — autoria da ocorrência.
- **OcorrênciaAluno** (`ocorrencias_alunos`): id, ocorrencia_id, person_id, created_at — vínculo da ocorrência com o(s) aluno(s) envolvido(s).
- **Pessoa** (`people`): id, nome_completo, cpf, school_id — referenciada por profissionais autores e alunos envolvidos.
- **Turma** (`turmas`): id, nome — cache opcional em `ocorrencias.turma_id`.
- **Recurso** (`recursos`): codigo `gestao-academica.ocorrencias` — controla acesso via Perfis e Permissões.
