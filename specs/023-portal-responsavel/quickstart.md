# Quickstart: Portal do Responsável

**Feature**: `023-portal-responsavel` | **Date**: 2026-09-08

Guia de validação manual end-to-end (padrão do projeto: migrations via SQL Editor; gates `npx tsc --noEmit` + `npx next build`).

## Pré-requisitos

1. Migrations aplicadas no SQL Editor, nesta ordem: `patch_portal_termo.sql`, `patch_portal_comunicados.sql`, `patch_portal_ocorrencias.sql` (ver `data-model.md`).
2. Responsável com acesso habilitado (fluxo spec 022: cadastro + Habilitar + senha) e 2 vínculos com alunos matriculados na mesma escola (1 vínculo `principal`).
3. Aluno A com notas + frequência lançadas no bimestre vigente (turma com método numérico, `frecuencia_minima=75`); Aluno B sem lançamentos.
4. Carga manual: 1 comunicado `escopo geral` + 1 restrito à turma do Aluno A; 1 ocorrência do Aluno A (`apresentar_no_portal=true`, `natureza='positiva'`, com `titulo`) + 1 com `apresentar_no_portal=false`.

## Cenários

1. **Login + aceite (US1)**: abrir `/portal/login`, entrar com e-mail+senha → cai em `/portal/termo` sem ver dados; tentar URL `/portal/aluno` direta → volta ao termo; clicar Aceitar → libera; na tabela `portal_aceites` há 1 linha (responsável, termo v1, `aceito_em` ≈ agora); `auditoria` registra `portal_termo/criar` sem senha.
2. **Seleção e troca (US2)**: após aceite → `/portal/selecionar-aluno` lista os 2 alunos (nome + turma); entrar no Aluno A; trocar para B na Sidebar → todas as páginas recarregam com dados de B; responsável com credencial interna em `/portal/login` → `Usuário ou senha inválidos`.
3. **Início (US3)**: Aluno A → 4 KPIs conferem com Diário/Painel (presença, média do período, faltas, ocorrências); trocar período da média → recalcula; 3 cards com "Ver Todos" navegando certo; Aluno B → estados vazios (sem zeros).
4. **Boletim (US4)**: abas = bimestres do método; tabela com avaliações + média; média mínima visível; verde/vermelho no padrão do Diário; turma não-numérica → mensagem explicativa (spec 021).
5. **Frequência (US5)**: Geral mostra percentual + aulas + faltas + limite (75% → 25% das registradas); Por Disciplina com barras; Por Bimestre filtra pelo período; valores batem com o Diário (critério/FJ/período ativo).
6. **Horários/Ocorrências/Comunicados (US6)**: grade dia×horário com professor; filtro Todas/Positivas/Negativas (só a `positiva` visível; a com `false` nunca aparece); minicards com badge não lido → abrir modal → badge some (`comunicados_leituras` criada); comunicado restrito a outra turma não aparece.
7. **Documentos (US7)**: `/portal/aluno/documentos` → EmptyState "Em breve", sem erro.
8. **Re-aceite (US1-C4)**: publicar termo v2 (`ativo`) via SQL → próximo login volta ao termo; aceitar → 2ª linha em `portal_aceites`.
9. **Isolamento (SC-003)**: com sessão do Aluno A, chamar actions com `alunoId` de outra escola/vínculo (via DevTools) → `Acesso negado`, sem dados.
10. **Mobile (SC-005)**: viewport 360px nas 7 páginas → sem scroll horizontal, tabelas em card-list ou com 1ª coluna fixa.
11. **Gates**: `npx tsc --noEmit` e `npx next build` verdes (SC-006).

Detalhes de entidades e assinaturas: `data-model.md`, `contracts/portal-actions.md`.
