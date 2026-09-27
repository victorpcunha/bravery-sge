# Quickstart: Documentos no Portal do Responsável

**Feature**: specs/041-documentos-portal/spec.md · Plan: `plan.md`
**Created**: 2026-09-27

> Pré-requisitos: migration `supabase-migrations/patch_portal_documentos_escola.sql`
> aplicada via SQL Editor; `npx next dev -p 3001`; uma escola com portal habilitado,
> um responsável com `portal_acesso_habilitado` e vínculo com ao menos um aluno ativo.

## 1. Configurar a liberação (gestora da escola)

1. Abra a Unidade Escolar → aba **Identificação** → card **Portal do Responsável**.
2. Em **Documentos disponíveis no portal**, desmarque **Boletim Escolar** e salve.
3. **Esperado**: toast de sucesso; ao recarregar, o Boletim segue desmarcado e os demais marcados.
4. Em **Auditoria** (superadmin), filtre módulo `Portal — Documentos`.
   **Esperado**: 1 registro `editar` com quem/quando e diff (`boletim: true → false`).

## 2. Portal respeita a liberação (responsável)

1. Entre no portal (`/portal/<slug>`) como responsável e abra **Documentos** do aluno.
   **Esperado**: galeria com Declaração, Ficha e Histórico; **sem** Boletim.
2. Gere a **Declaração de Matrícula**.
   **Esperado**: preview e download com nome/turma do aluno em visualização, sem pedir seleção de aluno ou turma.
3. Se houver 2º filho vinculado, troque o aluno e gere a Ficha.
   **Esperado**: dados do 2º aluno (FR-005).

## 3. Bloqueio server-side (FR-006)

1. Com o Boletim desmarcado, chame diretamente o wrapper do Boletim no portal (ex.: via console/atalho que invoque a action).
   **Esperado**: erro `Documento indisponível no portal desta escola` (negação, não vazio).

## 4. Nada liberado (FR-007)

1. Desmarque todos os documentos, salve e reabra Documentos no portal.
   **Esperado**: `EmptyState` informando que não há documentos disponíveis + orientação de procurar a secretaria (sem erro técnico).

## 5. Documento inaplicável (FR-008)

1. Com o Boletim liberado, abra-o para aluno de turma sem avaliação numérica.
   **Esperado**: mensagem em linguagem simples de que o Boletim numérico não se aplica àquela turma + orientação de procurar a secretaria.

## 6. Validação técnica

```powershell
npx tsc --noEmit
npx eslint src/lib/portal-documentos.ts src/lib/actions/portal-documentos.ts src/components/portal/documentos-portal.tsx
npx next build   # 40+ rotas, sem erro
```

## 7. Censo (regressão)

1. Exporte o Registro 00 da escola após salvar a config.
   **Esperado**: nenhuma coluna nova no payload (tabela dedicada, fora do Censo).
