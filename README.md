# Bravery SGE

Sistema de Gestão Escolar SaaS multi-tenant com conformidade total ao Censo Escolar INEP.

## Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS v4
- **UI**: shadcn/ui, Lucide React, Sonner
- **Backend**: Supabase (PostgreSQL), Server Actions
- **Auth**: Supabase Auth + RBAC dinâmico (Perfis e Permissões)

## Módulos

- Escolas, Turmas, Quadro de Aulas
- Matrículas (transporte, dispensas, movimentações)
- Indicadores de Avaliação e BNCC
- Gestão de Usuários (Pessoas, Perfis, Permissões, Funções, Painel do Aluno)
- Estrutura Acadêmica, Métodos de Avaliação, Disciplinas
- Plano de Ensino (planos, aulas, BNCC por etapa)
- Diário de Classe (frequência, avaliações, pareceres, plano de aula)
- Censo Escolar (validação e exportação)

## Desenvolvimento

```bash
npm install
npx next dev -p 3001
```

Build: `npx next build`

## Estrutura

```
src/
├── app/          # Rotas e páginas
├── components/   # UI components
├── hooks/        # Custom hooks (use-permissoes)
├── lib/actions/  # Server Actions
└── data/         # Dicionários estáticos
```
