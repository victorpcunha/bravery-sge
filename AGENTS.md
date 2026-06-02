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
- **Sidebar**: Quadro de Aulas, Indicadores, Alunos Matriculados, Perfis e Permissões, Plano de Ensino
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

## Known Issues
- Migrations `indicadores_niveis.sql`, `academico_matriculas.sql`, `patch_add_data_saida_matriculas.sql` e `patch_diario_planos_aplicados.sql` pendentes no Supabase SQL Editor
- All server actions use `'use server'` + `getSupabaseAdmin()` (service_role, bypass RLS)

## Commands
- Build: `npx next build`
- Dev: `npx next dev -p 3001`
<!-- END:project-summary -->
