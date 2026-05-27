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
- **Sidebar**: Quadro de Aulas, Indicadores, Alunos Matriculados, Perfis e Permissões

## Known Issues
- `getEtapasEnsino` exists in both `matriculas.ts` and `indicadores.ts` (added to `matriculas.ts` for import resolution)
- Migrations `indicadores_niveis.sql` and `academico_matriculas.sql` pending execution in Supabase SQL Editor
- All server actions use `'use server'` + `getSupabaseAdmin()` (service_role, bypass RLS)

## Commands
- Build: `npx next build`
- Dev: `npx next dev -p 3001`
<!-- END:project-summary -->
