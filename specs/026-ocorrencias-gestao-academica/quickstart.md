# Quickstart: Ocorrências da Gestão Acadêmica (026)

**Feature**: `specs/026-ocorrencias-gestao-academica/spec.md` | **Date**: 2026-09-09

Guia de validação end-to-end (sem código de implementação — ver `contracts/ocorrencias-actions.md` e `data-model.md`).

## Pré-requisitos

1. Migrations aplicadas via SQL Editor: `ocorrencias_gestao.sql` + `patch_recursos_ocorrencias.sql`.
2. Perfil do usuário com `gestao-academica.ocorrencias` (visualizar/criar/editar/excluir) ou Superadmin.
3. Escola com ≥2 profissionais ativos e ≥2 alunos matriculados.
4. Dev: `npx next dev -p 3001`.

## Cenários

### 1. Listagem + filtros (< 1 min — SC-001)

1. Acesse `/ocorrencias` (sidebar → Gestão Acadêmica → Ocorrências).
2. Sem permissão → `EmptyState ShieldAlert "Sem permissão"`, nenhum dado (SC-004).
3. Superadmin sem escola → EmptyState "Selecione uma escola", sem dados (SC-005); selecione a escola.
4. Com 2 ocorrências seed (1 positiva c/ Portal, 1 negativa s/ Portal): confira minicards (ícone+badge, título, data, sinalização Portal, nomes de profissionais/alunos, descrição truncada 100, Editar/Excluir).
5. Aplique isoladamente: Tipo=Positivas; intervalo de datas; 1 profissional; 1 aluno (digite 2 letras → sem sugestão; 3+ → sugere). Cada filtro reduz corretamente.
6. Data Inicial > Data Final → erro amigável orientando a correção.

### 2. Criação (SC-002)

1. "Nova Ocorrência" → tela sem breadcrumbs, com Voltar, sem Excluir.
2. Salvar vazio → bloqueio com mensagens por campo (título, tipo, data, ≥1 aluno, ≥1 profissional).
3. Descrição 501 chars → bloqueio citando o limite de 500 (contador visível).
4. Preencha tudo (tipo Negativa + pill Portal marcado + 2 profissionais + 2 alunos, remova 1 chip pelo X) → Salvar → toast sucesso → minicard na listagem com sinalização Portal.
5. Duplo clique em Salvar → 1 único registro.

### 3. Edição/exclusão (SC-003)

1. Editar → campos preenchidos + Voltar + Excluir; altere título e desmarque o Portal → Salvar → minicard atualizado.
2. Excluir pelo minicard e pela edição → `ConfirmDialog` sempre; cancelar nada altera; confirmar remove + toast.
3. Auditoria (`/auditoria`, superadmin): registros criar/editar/excluir com usuário, escola, data/hora e diffs.

## Build verde

`npx tsc --noEmit` limpo + `npx next build` verde (rotas `/ocorrencias`, `/ocorrencias/novo`, `/ocorrencias/[id]` presentes).
