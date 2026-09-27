# Quickstart: Visibilidade dos Módulos do Portal do Responsável

**Feature**: specs/040-configurar-visibilidade-portal/spec.md
**Date**: 2026-09-27

Pré-requisitos: migration `patch_portal_modulos_visiveis.sql` aplicada via SQL Editor; `npx tsc --noEmit` e `npx next build` verdes; duas escolas com portal habilitado (A e B) e um responsável com acesso em cada.

## 1. Ocultar o Boletim da escola A

1. Abra o cadastro da escola A → aba Identificação → card "Portal do Responsável".
2. Confirme que o grupo "Módulos visíveis no portal" exibe 6 pills ativas.
3. Desative a pill **Boletim** e salve.
4. **Esperado**: toast de sucesso; auditoria em `/auditoria` (módulo `Unidade Escolar`) mostra o diff da flag.

## 2. Portal do responsável da escola A

1. Acesse `/portal/[slug-a]/login` como responsável da escola A.
2. **Esperado**: menu sem Boletim; Início sem botão Boletim e sem bloco "Média do Bimestre por Disciplina"; demais módulos normais.
3. Abra diretamente `/portal/[slug-a]/aluno/boletim`.
4. **Esperado**: `EmptyState` "Módulo indisponível" com orientação para procurar a secretaria; nenhuma nota exibida.

## 3. Isolamento entre escolas

1. Acesse `/portal/[slug-b]/login` como responsável da escola B.
2. **Esperado**: Boletim visível e funcional (notas carregam).

## 4. Reexibir o Boletim

1. No cadastro da escola A, reative a pill **Boletim** e salve.
2. Recarregue o portal da escola A.
3. **Esperado**: Boletim de volta no menu, com dados carregando normalmente, sem nova senha ou vínculo.

## 5. Tudo oculto (limite)

1. Desative as 6 pills da escola A e salve; recarregue o portal.
2. **Esperado**: menu com só "Início"; Início exibe identificação do aluno e orientação, sem atalhos quebrados.

## 6. Sem permissão de edição

1. Acesse a Unidade Escolar com perfil sem `escolas/editar`.
2. **Esperado**: banner "Visualização somente" + pills desabilitadas (fieldset `readOnly` herdado); submit bloqueado.
