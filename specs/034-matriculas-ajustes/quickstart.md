# Quickstart: Alunos Matriculados — Ajustes

**Spec**: [spec.md](./spec.md) | **Gates**: `npx tsc --noEmit` + `npx next build` verdes. **Pré-requisito**: migration `patch_codigo_matricula.sql` aplicada via SQL Editor.

## §0 — Migration (US2 base)

1. Aplicar `patch_codigo_matricula.sql` no SQL Editor.
2. Conferir: `SELECT school_id, codigo_matricula FROM academico_matriculas ORDER BY school_id, codigo_matricula` — sequência 1..N por escola, sem nulos nem duplicados.

## §1 — Lista: filtros e tabela (US1)

1. Abrir Alunos Matriculados (aba `matriculas`).
2. Conferir: "Buscar por nome do aluno" com largura reduzida; Select "Turma" ao lado (só com escola+ano efetivos).
3. Selecionar turma → lista recarrega (server-side); "Todas" limpa; busca por nome continua funcionando sobre o recorte.
4. Conferir: cabeçalho sem margens laterais (fundo encosta nas bordas), títulos em destaque legível.
5. Conferir: coluna ID (`font-mono`) antes do Aluno, com o código sequencial.
6. Lixeira → `ConfirmDialog` → confirmar exclui + toast + some da lista; cancelar preserva. (Se o vínculo tiver lançamentos restritivos: `toast.error` amigável, registro preservado.)

## §2 — Código + Excluir no Editar (US2)

1. Nova Matrícula → campo "Código de Matrícula" exibe "Gerado ao salvar" antes do Ano Letivo (reduzido); salvar → código `max+1` gravado.
2. Editar → código read-only exibido; header com Excluir ao lado de Voltar → `ConfirmDialog` → volta à lista.
3. Lista pós-criação mostra o novo código na coluna ID.

## §3 — Transporte (US3)

1. Editar/Nova: Poder Público em 3 Pills (Nenhum/Estadual/Municipal), seleção única.
2. Nenhum → subcard oculto; Estadual/Municipal → subcard "Veículos Utilizados" com 2 grupos.
3. Marcar 2+ veículos (incl. entre grupos) → salvar → reabrir persiste.
4. Trocar p/ Nenhum → salvar → veículos limpos.

## §4 — Dispensas (US4 REVOGADA)

Funcionalidade removida: o card não existe mais em Nova/Editar Matrícula; `grep -ri dispensa src/app/**/matriculas src/lib/actions/matriculas.ts` deve retornar vazio (exceto o comentário-ponte em `matriculas.ts`); tabela dropada via `patch_remove_dispensas.sql`.

## §5 — Movimentações (US5)

1. Editar matrícula sem movimentação: 4 botões (Transferir/Reclassificar/Remanejar/Desistir) como hoje.
2. Criar uma de cada tipo (uma com data efetiva passada = retroativa).
3. Histórico: badge em destaque por tipo; 2 datas rotuladas ("Registrada em" = hoje, "Data efetiva" = passada na retroativa).
4. Transferência → Observações; Reclassificação → Nova Etapa + Nova Turma + Observações (nomes, não IDs); Remanejamento → Turma de Destino + Observações; Desistência → Motivo + Observações.

## §6 — Rodapé (US6)

1. Rolar o form: sem botão flutuante; footer Cancelar/Salvar sempre fixo ao fim do viewport do container.
2. Cancelar → volta à lista sem salvar; Salvar → "Salvando..." desabilita ambos + toast como hoje.
