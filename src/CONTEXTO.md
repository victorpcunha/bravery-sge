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

### Estrutura Acadêmica
- Etapas de Ensino, Calendários, Matrizes Curriculares
- Rota: `/gestao-academica/estrutura-academica`

### Métodos de Avaliação
- CRUD completo
- Rota: `/gestao-academica/metodos`

### Disciplinas
- CRUD completo
- Rota: `/gestao-pedagogica/disciplinas`

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
│   ├── providers/auth-provider.tsx
│   └── ui/ (shadcn primitives)
├── hooks/
│   └── use-permissoes.ts
├── lib/
│   ├── actions/ (13 arquivos de server actions)
│   ├── auth.ts (getSupabaseAdmin, getSupabaseClient)
│   └── utils.ts
└── data/ (dicionários estáticos: paises, municipios, cursos, etc.)
```

## 6. Migrations

~40 arquivos SQL em `supabase-migrations/`, incluindo:
- Tabelas principais: schools, people, turmas, quadro_aulas, matriculas, indicadores
- Módulo perfis: perfis.sql, recursos.sql, perfis_permissoes.sql, add_perfil_id_to_people.sql, perfis_auditoria.sql
- Módulo acadêmico: calendários, disciplinas, etapas_ensino, matrizes, métodos
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
