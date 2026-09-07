# Quickstart: Boletim Escolar

**Feature**: `021-boletim-escolar`

## Pré-requisitos

1. Specs 018 e 019 aplicadas (módulo Documentos com a aba "Documentos Oficiais").
2. Configurações de Documentos preenchidas na Unidade Escolar (`/escolas/[id]` → aba Identificação
   → card "Configurações de Documentos") para o papel timbrado. Sem config, há fallback para `schools`.
3. Perfil com permissão de **visualizar** no recurso `documentos.oficiais`.
4. Turma do aluno com **Método de Avaliação numérico** ativo e **Períodos Avaliativos** definidos no
   calendário do ano letivo (para frequência por período).
5. Nenhuma migration nova — o recurso já existe desde a spec 019.
6. `npx next build` para validar.

## Perfis

| Recurso | Efeito |
|---------|--------|
| `documentos.oficiais` | Aba "Documentos Oficiais" com a galeria (inclui o minicard Boletim Escolar) |

## Roteiro de validação

1. Logar como profissional com permissão `documentos.oficiais`.
2. Abrir **Documentos → Documentos Oficiais** → conferir o minicard **Boletim Escolar**.
3. Clicar em **Gerar Documento** no Boletim Escolar.
4. Selecionar o **Ano Letivo** e buscar/selecionar o **aluno** (mínimo 3 caracteres).
5. Com o aluno selecionado, escolher o **Período de Avaliação** (listado a partir dos Períodos
   Avaliativos do calendário, com nome e faixa de datas).
6. Aguardar a pré-visualização em imagem do PDF.
7. Conferir:
   - **Identificação Acadêmica**: nome completo, ano letivo, período de avaliação, etapa + turma +
     turno (quando aplicável) na mesma linha.
   - **Resultado por Disciplina**: colunas conforme a configuração da turma —
     `por_aula` → Disciplina · Nota · Freq. · Faltas; `por_dia` → Disciplina · Nota.
   - **Resultado Geral do Período**: Média do Período + Total de faltas.
   - **Data de Emissão** (data de geração) e assinatura.
8. Editar (opcionalmente) o **Nome do responsável** e **Cargo** e conferir que o PDF regenera.
9. Clicar em **Baixar PDF** → arquivo `boletim-escolar-{nome}-{periodo}.pdf`.
10. **Testar bloqueio**: turma com método não numérico (Conceito/Parecer Descritivo) → ao selecionar
    o aluno, aparece o aviso "Esta turma utiliza avaliação por [...]; o Boletim Numérico não está
    disponível para este Método de Avaliação." e o PDF não é gerado.
11. **Testar `por_aula`**: turma com `criterio_frequencia = por_aula` → colunas de Freq. e Faltas por
    disciplina na tabela.
12. **Testar `por_dia`**: turma `por_dia` → tabela só com Disciplina + Nota; Freq. geral e faltas no
    Resultado Geral.
13. Voltar para a galeria e repetir com Declaração/Ficha (fluxo preservado).