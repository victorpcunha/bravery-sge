<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-summary -->
# Bravery SGE - Project Summary

## Goal
Sistema de Gestão Escolar completo: turmas, quadro de aulas, indicadores de avaliação, matrículas, perfis e permissões, funções profissionais.

## Progress
- **Turmas**: Migration, CRUD, listagem/cadastro page
- **Quadro de Aulas**: Migration, CRUD, grade editável dia×horário, validação conflitos
- **Indicadores de Avaliação**: Migration, CRUD hierárquico, import BNCC (Infantil só), Níveis de Desenvolvimento (método + personalizado), migração `indicadores_niveis`
- **Matrículas**: Migration (3 tabelas), CRUD, Transporte, Dispensas, Movimentações (Transferir/Reclassificar/Remanejar/Desistir)
- **Perfis e Permissões**: Complete module — migrations (5), actions, components (PerfilFiltros, PerfilGrid, MatrizPermissoes, PerfilForm), list + detail pages, visual protection, server-side validation, audit logging
- **Funções Profissionais**: CRUD page
- **Login**: CPF ou Email; mensagem genérica "Usuário ou senha inválidos"
- **Auth**: `criarAuthUser` via `supabase.auth.admin.createUser()`, link via `user_schools`
- **Sidebar**: Quadro de Aulas, Indicadores, Alunos Matriculados, Perfis e Permissões, Plano de Ensino, Painel do Aluno
- **Diário de Classe**: Frequência por Dia / por Aula (com validação de período ativo), Parecer Descritivo, Avaliação por Indicadores, Avaliações Numéricas (com recuperação)
- **Período Ativo do Aluno**: Coluna `data_saida` na `academico_matriculas`. Atualizada automaticamente ao criar movimentação. Células fora do período são desabilitadas com tooltip. Percentual de frequência calculado individualmente por aluno (presenças / dias válidos no período ativo).
- **Plano de Ensino (FASE 1–5)**:
  - Migration `plano_ensino.sql`: tables `planos_ensino`, `planos_ensino_disciplinas`, `planos_aula`
  - Migration `patch_planos_aula_periodos.sql`: `periodo` → `periodos INT[]`, `bncc_fields JSONB`
  - Server actions: CRUD planos/aula, `listarPeriodosPlanoEnsino`, `buscarBNCCBase`, `listarPlanoAulaPorMes`
  - Pages: list (`/plano-ensino`), create (`/plano-ensino/criar`), detail (`/plano-ensino/[id]`) with period tabs, multi-period checkboxes, BNCC fields per etapa (EI: campos experiência + objetivos; EF: unidades temáticas + objetos conhecimento + habilidades; EM: áreas conhecimento + competências + habilidades)
- **FASE 6 – Plano de Aula no Diário de Classe**: Nova aba "Plano de Aula" com:
  - Tabela `academico_diario_planos_aplicados` (link `plano_aula` → `data_aula`, sem duplicar dados)
  - Server actions em `diario-planos.ts`: `listarDiasComAula`, `listarPlanosAplicados`, `listarPlanosDisponiveis`, `aplicarPlanoAula`, `removerPlanoAulaAplicado`
  - Grade mensal restrita a dias com aula (filtra pelo Quadro de Horários)
  - Planos são criados **apenas** no Plano de Ensino; no diário o profissional seleciona qual aplicar ao dia
  - Remover aplicação não afeta o plano original (`planos_aula`)
  - Indicador visual BookOpen no Frequência por Aula preservado (removeu diálogo antigo)
  - Componente `plano-aula-diario.tsx`, ação `diario-planos.ts`
  - `criarPlanoAulaDoDiario` removido de `plano-ensino.ts` (dead code)
  - `disciplinaSelecionada` removido de `plano-aula-diario.tsx` (variável não usada)
- **Painel do Aluno (Visão 360º)**:
  - **FASE 1 — Migrações**: `saude_estudantes.sql`, `ocorrencias.sql`, `historico_manual.sql`, `patch_add_permite_historico_manual.sql`, `patch_recurso_painel_aluno.sql`, `fn_buscar_pessoas_matriculadas.sql`
  - **FASE 2 — Server Actions**: `painel-pessoa.ts` (12 funções), `historico-manual.ts` (ações de histórico manual)
  - **FASE 3 — Página + Filtros**: `/gestao-usuarios/painel-aluno`, `filtro-pessoa.tsx` (busca assíncrona com debounce 300ms), `filtro-turma.tsx` (dropdown dinâmico)
  - **FASE 4 — Cards**: `card-identificacao.tsx`, `card-contato.tsx`, `card-saude.tsx` (aparecem ao selecionar aluno, independente de turma)
  - **FASE 5 — Cards dependentes de turma**: `card-desempenho.tsx` (gráfico Recharts + frequência), `card-quadro-aulas.tsx` (grade dia×horário), `card-historico.tsx` (tabela + modal manual condicional)
  - **FASE 6 — Card Ocorrências**: `card-ocorrencias.tsx` (badge colorido por tipo disciplinar/pedagógica)
  - Cards de Identificação/Contato usam colunas da tabela `people` (`logradouro`, `bairro`, `telefone_celular`, `telefone_fixo`, `email`)
  - Busca de alunos usa RPC `buscar_pessoas_matriculadas` (SQL) com fallback em duas queries
  - Recurso de permissão: `gestao-usuarios.painel-aluno`
  - Recharts instalado para gráfico de desempenho

## Known Issues
- All server actions use `'use server'` + `getSupabaseAdmin()` (service_role, bypass RLS)
- `academico_anos_letivos` usa coluna `status` (string), NÃO `ativo` (boolean)

## UI & Design System

### Regra #1: NUNCA use cores hexadecimais (#XXXXXX) em componentes ou páginas
Use SEMPRE os tokens Tailwind v4 derivados das CSS variables do `globals.css`:

| Uso | Token Tailwind | Hex (referência) |
|-----|---------------|------------------|
| Marca principal | `primary` / `bg-primary` / `text-primary` | #0F2B46 |
| Texto em primary | `primary-foreground` | #FAFCFF |
| Ação secundária | `accent` / `bg-accent` / `text-accent` | #2E8BA3 |
| Fundo de página | `background` / `bg-background` | #F4F6F9 |
| Fundo de card | `card` / `bg-card` | #FFFFFF |
| Texto principal | `foreground` / `text-foreground` | #0D1117 |
| Texto secundário | `muted-foreground` / `text-muted-foreground` | #57606A |
| Bordas | `border` / `border-border` | #D0D7DE |
| Fundo muted | `muted` / `bg-muted` | #E8ECF1 |
| Foco/destaque | `ring` / `bg-ring` / `text-ring` | #2E8BA3 |
| Destruição | `destructive` / `bg-destructive` | #CF222E |
| Sucesso | `success` / `bg-success` / `text-success` | #1A7F37 |
| Aviso | `warning` / `bg-warning` / `text-warning` | #9A6700 |
| Info | `info` / `text-info` | #2E8BA3 |
| Sidebar fundo | `sidebar` / `bg-sidebar` | #0F2B46 |
| Sidebar texto | `sidebar-foreground` | #FAFCFF |
| Sidebar acento | `sidebar-accent` | #2E8BA3 |
| Sidebar primário | `sidebar-primary` | #4FC3D7 |

### Regra #2: Componentes de formulário
- SEMPRE use componentes shadcn/ui: `<Select>`, `<Input>`, `<Textarea>`, `<Button>`, etc.
- NUNCA use `<select>`, `<input type="text">` nativo com classes inline de estilo.
- Use `border-border` para bordas (não `border-slate-300`, `border-[#e2e8f0]`, etc.).
- Use `focus:border-primary focus:ring-primary/20` para estados de foco.
- Use `bg-card` para fundo de card (não `bg-white` ou `bg-[#fff]`).
- Use `bg-background` para fundo de página (não `bg-[#f8fafc]`).
- Use `bg-muted` para fundo de seções/zonas (não `bg-slate-50` ou `bg-[#f1f5f9]`).
- Use `text-muted-foreground` para texto secundário (não `text-slate-500` ou `text-[#64748b]`).

### Regra #3: Variantes de opacidade
- Use `primary/10`, `primary/80`, `foreground/60`, `accent/15`, etc. para opacidade.
- NUNCA use `bg-[#1D3557]/10` — use `bg-primary/10`.
- Para badges de perfil: `bg-warning/10 text-warning`, `bg-primary/10 text-primary`, etc.

### Regra #4: Sidebar
- SEMPRE use tokens `sidebar-*`: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `border-sidebar-border`, `bg-sidebar-primary`.
- NUNCA hardcode `#1D3557`, `#457B9D`, `#4FB3BF` no sidebar.
- Para ativo: `bg-sidebar-accent/15 text-sidebar-foreground`.
- Para hover: `hover:bg-sidebar-accent/10 hover:text-sidebar-foreground`.
- Para sub-item ativo: `bg-sidebar-accent/80`.

### Regra #5: Tabelas com sticky
- Primeira coluna em tabelas com scroll horizontal: `sticky left-0 bg-background z-10`.
- Header correspondente: `sticky left-0 bg-muted z-10`.
- Container: `overflow-x-auto`.
- Use `border-border` para bordas de tabela (não `border-[#cbd5e1]`).

### Regra #6: Dark mode
- ThemeProvider (`next-themes`) está instalado no root layout.
- Classes CSS no `.dark` já estão definidas em `globals.css`.
- Ao criar componentes, use tokens (nunca `bg-white`, `text-gray-900`, etc.) para garantir compatibilidade com dark mode.
- Para testar dark mode, adicione `class="dark"` no `<html>`.

### Regra #7: Gradientes
- Use `from-primary to-accent`, `from-primary to-primary/80`, etc.
- NUNCA use `from-[#1D3557] to-[#457B9D]` em gradientes.

### Exceções (NÃO trocar hex por token)
- Cores em data arrays de color picker (`COLORS_BG`, `COLORS_TEXT`) — são conteúdo do banco de dados, não UI.
- SVG path fills que não são customizáveis pelo tema.
- Data URIs em gradientes de imagem de fundo.

### Colunas da tabela `people` importantes
- Nome completo: `nome_completo` (NÃO `name`)
- Login CPF/email: colunas `cpf`, `email`
- Contato: `telefone_celular`, `telefone_fixo`
- Endereço: `logradouro`, `bairro`, `numero`, `complemento`

### Relacionamentos de disciplinas (query pattern)
- `turmas_disciplinas.matriz_disciplina_id` → `academico_matriz_disciplinas.id`
- `academico_matriz_disciplinas.disciplina_id` → `academico_disciplinas.id`
- `academico_disciplinas.nome` — coluna `nome`, NÃO `name`
- Query correta: `.select('matriz_disciplina_id, academico_matriz_disciplinas(disciplina_id, academico_disciplinas(nome))')`

## Commands
- Build: `npx next build`
- Dev: `npx next dev -p 3001`
<!-- END:project-summary -->
