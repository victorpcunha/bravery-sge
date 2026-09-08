# Quickstart: Portal por Escola

**Feature**: `024-portal-por-escola` | **Date**: 2026-09-08

Validação manual (migrations via SQL Editor; gates `npx tsc --noEmit` + `npx next build`).

## Pré-requisitos

1. Migrations aplicadas: `patch_portal_escolas.sql`, `patch_portal_login_brand.sql`.
2. Portal 023 funcional (responsável + vínculos + matrícula + lançamentos, ver `specs/023-portal-responsavel/quickstart.md`).
3. Escola A habilitada (`portal_habilitado=true`, slug `bravery`) com nome fantasia + logo + imagem + texto; escola B habilitada com slug e sem personalização.

## Cenários

1. **Habilitar + slug (US1)**: cadastro da escola A → card marca Sim, slug sugerido `bravery` → salva (toast); `/portal/bravery/login` abre o login; slug duplicado/maiúsculas bloqueia com mensagem; preview da URL visível.
2. **Desabilitar (US1)**: marca Não + salva → `/portal/bravery/login` vira "portal indisponível" (sem indicar se existe).
3. **Login personalizado (US2)**: slug A → logo + nome + fundo + texto da escola A; slug B → visual padrão, sem erro.
4. **Genéricas (US3)**: `/portal/login`, `/portal/aluno`, `/portal/xyz` → orientação em todas (sem form, sem dados).
5. **Escopo (US4)**: responsável com filhos em A e B → slug A lista só filhos de A; action com aluno de B no slug A → "Acesso negado"; aluno transferido A→B some do slug A.
6. **Troca de slug**: altera slug de A → link antigo indisponível; alerta exibido no cadastro.
7. **Censo intacto**: exporta Registro 00 da escola A → sem colunas do portal; auditoria mostra flag/slug (sem base64).
8. **Gates**: `npx tsc --noEmit` e `npx next build` verdes (SC-005).

Detalhes: `data-model.md`, `contracts/portal-escola.md`.
