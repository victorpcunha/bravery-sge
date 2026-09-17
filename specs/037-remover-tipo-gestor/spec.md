# Feature Specification: Remover Tipo "Gestor" do Usuário (037)

**Feature Branch**: `037-remover-tipo-gestor`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Com o gestor definido no cadastro da Unidade Escolar (spec 036, tabela managers), remover o tipo 'Gestor' da tela de Usuários. Manter apenas Aluno, Profissional e Responsável."

## Contexto

- O pill "Gestor" em "Tipo de Pessoa" (`PessoaForm.tsx:722`, valores de `people.perfil TEXT[]`) ficou redundante: o papel de gestor vive em `managers` (spec 036).
- Nada do Censo depende do pill: R30/R40/exportação leem `managers`; o fallback do R40 usa `perfil_id` (perfil de acesso), outro campo.
- Os 3 gates que testam `perfil includes 'gestor'` (`PessoaForm` seções profissionais, `censo-profissionais.ts` contagens, `ocorrencias.ts` selecionáveis) usam `profissional OU gestor` — diretor marcado como **Profissional** continua passando nos 3.
- Convenção adotada: diretor = `Profissional` (+ vínculo na aba Gestores da escola).

## User Scenarios & Testing

### User Story 1 — Cadastrar usuário sem o tipo Gestor (Priority: P1)

Ao cadastrar/editar usuário, "Tipo de Pessoa" oferece só Aluno, Profissional e Responsável. Diretor é marcado como Profissional (vínculos, escolaridade) e vinculado como gestor na Unidade Escolar.

**Acceptance Scenarios**:

1. **Given** o form de usuário, **When** abre "Tipo de Pessoa", **Then** vê só Aluno, Profissional e Responsável.
2. **Given** pessoa marcada como Profissional, **When** salva, **Then** seções de vínculo/escolaridade, contagens do Censo e seleção em ocorrências funcionam como antes.
3. **Given** pessoa legada só com `gestor`, **When** abre a ficha, **Then** (após ajuste SQL) ela já vem como Profissional.

---

### User Story 2 — Ajuste de dados legados (Priority: P1)

Pessoas com `perfil = {gestor}` (só gestor) passam a ter `profissional` anexado, via SQL no Editor (sem migration), preservando os demais valores.

**Acceptance Scenarios**:

1. **Given** o SELECT de diagnóstico, **When** executa, **Then** lista quem tem só `gestor`.
2. **Given** o UPDATE, **When** executa, **Then** essas pessoas ficam `{gestor,profissional}` e nada mais muda.

## Functional Requirements

- **FR-001**: Remover a opção `gestor` das pills (manter os 3 `includes('gestor')` como compatibilidade legada — inertes para novos cadastros).
- **FR-002**: Ajustar textos "Profissional/Gestor" para "Profissional" no `PessoaForm` (validações de e-mail e escolaridade).
- **FR-003**: Script SQL de diagnóstico + ajuste (rodar no SQL Editor, fora do deploy).

## Out of Scope

- Mudanças em validação/exportação do Censo, `managers`, permissões (`perfil_id`) e contagens.
- Remover valores `gestor` do banco (mantidos por compatibilidade).
