# Bravery SGE — Documento de Contexto (v2.0)

## 1. Visão Geral

O Bravery SGE é uma solução SaaS multi-tenant para escolas particulares brasileiras, com conformidade total ao Censo Escolar INEP. O sistema permite gestão pedagógica e administrativa diária e exportação do arquivo .txt do censo.

## 2. Arquitetura

| Camada | Stack |
|--------|-------|
| Frontend | Next.js 16+, App Router, TypeScript |
| Estilização | Tailwind CSS v4 |
| UI | shadcn/ui (estilo New York), Lucide React, Sonner |
| Backend | Supabase (PostgreSQL), Server Actions |
| ORM | Supabase JS Client (service_role bypass RLS) |
| Formulários | React Hook Form + Zod |
| Datas | date-fns |
| Permissões | RBAC dinâmico (Perfis + Matriz de Permissões) |

## 3. Padrões de Código

### Server Actions
- Arquivos em `src/lib/actions/`
- Usam `'use server'` + `getSupabaseAdmin()` (service_role, bypass RLS)
- Todas as consultas são .ts servidas via Server Actions

### UI Patterns
- **Pattern A**: CRUD com dialog (usado na maioria das páginas: escolas, turmas, disciplinas, funções, perfis)
- **Pattern B**: Página dedicada `[id]` para formulários complexos (cadastro de pessoa, edição de perfil)

### Nomenclatura
- DB: snake_case, prefixo `academico_` para tabelas acadêmicas
- Evitar: "endpoint", "API", "REST", "repository"

## 4. Módulos Implementados

### Login e Autenticação
- `/login` — campo único **CPF ou E-mail**
- Login por CPF: detecta 11 dígitos, busca email da pessoa, autentica
- Login por email: direto no Supabase Auth
- Mensagem de erro genérica: "Usuário ou senha inválidos"
- `criarAuthUser` em `people.ts`: cria auth user + vincula `user_schools`

### Validação de Senha
- Mínimo 10 caracteres
- 1 letra maiúscula, 1 minúscula, 1 número, 1 caractere especial
- Validada no frontend (PessoaForm) e no backend (`criarAuthUser`)

### Escolas (Schools)
- CRUD completo: listagem, criação, edição (aba Identificação, Infraestrutura, Gestão)
- Rotas: `/escolas`, `/escolas/novo`, `/escolas/[id]`

### Turmas (Class Groups)
- CRUD completo com listagem e cadastro
- Rotas: `/turmas`, `/gestao-turmas/turmas`

### Quadro de Aulas (Class Schedule Grid)
- Grade editável dia × horário
- Validação de conflitos
- Rotas: `/gestao-turmas/quadro-aulas`, `/gestao-turmas/quadro-aulas/cadastro`

### Matrículas (Enrollments)
- 3 tabelas: matrícula + transporte + dispensas
- Movimentações: Transferir, Reclassificar, Remanejar, Desistir
- Rotas: `/gestao-academica/matriculas`, `/gestao-academica/matriculas/cadastro`

### Indicadores de Avaliação
- CRUD hierárquico
- Importação BNCC (Infantil)
- Níveis de Desenvolvimento (método + personalizado)
- Rota: `/gestao-pedagogica/indicadores`

### BNCC
- Navegação completa: áreas, campos de experiência, competências, habilidades, objetivos, objetos de conhecimento, unidades temáticas
- Página de consulta geral
- 8 rotas em `/bncc/`

### Gestão de Usuários
- **Pessoas** (Registro 30): cadastro único com perfis dinâmicos (Aluno, Profissional, Gestor, Responsável)
  - Abas: Identificação, Deficiência/TEA, Endereço, Escolaridade, Pós-Graduação, Formação, Vínculo, Contato
  - "Permitir acesso ao sistema": checkbox que expande Nome de acesso, Senha, Confirmação, Perfil de acesso
  - Rota: `/gestao-usuarios/usuarios`
- **Funções Profissionais**: CRUD para cargos/funções
  - Rota: `/gestao-usuarios/funcoes`
- **Perfis e Permissões**: RBAC completo
  - Perfis (CRUD), Matriz de Permissões (Visualizar/Criar/Editar/Excluir por recurso)
  - Proteção visual (hooks), validação server-side, auditoria
  - Rotas: `/gestao-usuarios/perfis`, `/gestao-usuarios/perfis/[id]`
- **Painel do Aluno (Visão 360º)**:
  - Rota: `/gestao-usuarios/painel-aluno`
  - Filtro de pessoa com debounce 300ms (busca por nome ou CPF)
  - Filtro de turma dinâmico (desabilitado quando matrícula única)
  - Cards independentes de turma: Identificação, Contato, Saúde
  - Cards dependentes de turma: Desempenho (gráfico Recharts), Quadro de Aulas, Histórico (com modal manual condicional), Ocorrências
  - Recurso de permissão: `gestao-usuarios.painel-aluno`
  - Recharts para gráfico de desempenho comparativo

### Estrutura Acadêmica
- Etapas de Ensino, Calendários, Matrizes Curriculares
- Rota: `/gestao-academica/estrutura-academica`

### Métodos de Avaliação
- CRUD completo
- Rota: `/gestao-academica/metodos`

### Disciplinas
- CRUD completo
- Rota: `/gestao-pedagogica/disciplinas`

### Plano de Ensino
- **FASE 1–5**: CRUD de planos de ensino e planos de aula
- Migrations: `plano_ensino.sql` (tabelas `planos_ensino`, `planos_ensino_disciplinas`, `planos_aula`), `patch_planos_aula_periodos.sql` (`periodo` → `periodos INT[]`, `bncc_fields JSONB`)
- Server actions: CRUD planos/aula, `listarPeriodosPlanoEnsino`, `buscarBNCCBase`, `listarPlanoAulaPorMes`
- Pages: list (`/plano-ensino`), create (`/plano-ensino/criar`), detail (`/plano-ensino/[id]`)
- BNCC fields por etapa: EI (campos experiência + objetivos), EF (unidades temáticas + objetos conhecimento + habilidades), EM (áreas conhecimento + competências + habilidades)
- **FASE 6**: Plano de Aula aplicado no Diário de Classe
  - Tabela `academico_diario_planos_aplicados` (link `plano_aula_id` → `data_aula` + `horario_id`)
  - Planos criados apenas no Plano de Ensino; no diário o profissional seleciona qual aplicar
  - Grade mensal restrita a dias com aula (filtra pelo Quadro de Horários)
  - Remover aplicação não afeta `planos_aula` original
  - Componente: `plano-aula-diario.tsx`, ação: `diario-planos.ts`

### Diário de Classe
- **Frequência por Dia**: registro por data, alunos presentes/ausentes/justificados
- **Frequência por Aula**: registro por disciplina+horário, com indicador visual BookOpen para planos aplicados
- **Parecer Descritivo**: registro textual por período
- **Avaliação por Indicadores**: lançamento de notas por indicador BNCC, com níveis de desenvolvimento
- **Avaliações Numéricas**: notas por disciplina, com recuperação
- **Período Ativo do Aluno**: validação via `data_saida` — células fora do período são desabilitadas com tooltip
- **Aba Plano de Aula**: grade mensal com planos aplicados do Plano de Ensino
- Rotas: `/gestao-pedagogica/diario-classe`, `/gestao-pedagogica/diario-classe/[turmaId]`

## 5. Estrutura de Arquivos

```
src/
├── app/
│   ├── login/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx (sidebar + shell)
│   │   ├── page.tsx (dashboard)
│   │   ├── escolas/ (CRUD)
│   │   ├── gestao-academica/ (módulo acadêmico)
│   │   ├── gestao-pedagogica/ (módulo pedagógico)
│   │   ├── gestao-turmas/ (módulo turmas)
│   │   ├── gestao-usuarios/ (funções, perfis, usuários)
│   │   ├── bncc/ (navegação BNCC)
│   │   ├── docentes/, turmas/, matriculas/
├── components/
│   ├── layout/sidebar.tsx
│   ├── perfis/ (PerfilFiltros, PerfilGrid, MatrizPermissoes, PerfilForm)
│   ├── painel-pessoa/ (filtro-pessoa, filtro-turma, card-identificacao, card-contato, card-saude, card-desempenho, card-quadro-aulas, card-historico, card-ocorrencias, grafico-desempenho, modal-historico-manual)
│   ├── providers/auth-provider.tsx
│   └── ui/ (shadcn primitives)
├── hooks/
│   └── use-permissoes.ts
├── lib/
│   ├── actions/ (15 arquivos de server actions)
│   ├── auth.ts (getSupabaseAdmin, getSupabaseClient)
│   └── utils.ts
└── data/ (dicionários estáticos: paises, municipios, cursos, etc.)
```

## 6. Migrations

~45 arquivos SQL em `supabase-migrations/`, incluindo:
- Tabelas principais: schools, people, turmas, quadro_aulas, matriculas, indicadores
- Módulo perfis: perfis.sql, recursos.sql, perfis_permissoes.sql, add_perfil_id_to_people.sql, perfis_auditoria.sql
- Módulo acadêmico: calendários, disciplinas, etapas_ensino, matrizes, métodos
- Módulo plano de ensino: plano_ensino.sql, patch_planos_aula_periodos.sql, patch_diario_planos_aplicados.sql
- Módulo painel aluno: saude_estudantes.sql, ocorrencias.sql, historico_manual.sql, patch_add_permite_historico_manual.sql, patch_recurso_painel_aluno.sql, fn_buscar_pessoas_matriculadas.sql
- Diário de classe: patch_add_data_saida_matriculas.sql, patch_diario_planos_aplicados.sql
- Censo 2026: tabelas e funções

## 7. Comandos

| Comando | Descrição |
|---------|-----------|
| `npx next dev -p 3001` | Desenvolvimento |
| `npx next build` | Build produção |
| `npx next start` | Servir produção |

## 8. Observações

- Todas as server actions bypass RLS via service_role
- `validarPermissao` retorna `true` quando não há pessoa (modo setup)
- Hook `usePermissoes` com flag `isSetup` para grant total durante configuração inicial
- Tabela `perfis_auditoria` com colunas JSONB para flexibilidade
- Soft delete em tabelas críticas (schools, people)
- Tabela `people` usa `logradouro`/`bairro` (não `endereco`) e `telefone_celular`/`telefone_fixo` (não `telefone`)
- `academico_anos_letivos` usa coluna `status` com valores `'ativo'`, `'planejamento'`, `'encerrado'` (não coluna booleana `ativo`)
