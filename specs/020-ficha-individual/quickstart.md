# Quickstart: Ficha Individual do Aluno

**Feature**: `020-ficha-individual`

## Pré-requisitos

1. Spec 018 e 019 aplicadas (módulo Documentos com a aba "Documentos Oficiais").
2. Configurações de Documentos preenchidas na Unidade Escolar (`/escolas/[id]` → aba Identificação
   → card "Configurações de Documentos") para o papel timbrado (logo, nome fantasia, cabeçalho/rodapé,
   responsável/cargo). Sem config, há fallback para os dados de `schools`.
3. Perfil com permissão de **visualizar** no recurso `documentos.oficiais`.
4. Nenhuma migration nova — o recurso já existe desde a spec 019.
5. `npx next build` para validar.

## Perfis

| Recurso | Efeito |
|---------|--------|
| `documentos.oficiais` | Aba "Documentos Oficiais" com a galeria (Declaração de Matrícula + Ficha Individual do Aluno) |

Sem permissão em nenhum recurso do módulo, "Documentos" some do menu e a página mostra "Sem permissão".
Superadmin vê tudo (seletor de Unidade Escolar quando não há escola de contexto).

## Roteiro de validação

1. Logar como profissional com permissão `documentos.oficiais`.
2. Abrir **Documentos → Documentos Oficiais**.
3. Conferir a galeria: dois minicards (Declaração de Matrícula e Ficha Individual do Aluno), cada um com
   ícone, descrição e botão "Gerar Documento".
4. Clicar em **Gerar Documento** na Ficha Individual do Aluno.
5. Selecionar o **Ano Letivo** e buscar o **aluno** (mínimo 3 caracteres de nome ou CPF).
6. Aguardar a pré-visualização em imagem do PDF.
7. Conferir as seções: Identificação (nome, CPF, nascimento, sexo, cor/raça, nacionalidade, naturalidade,
   INEP), Filiação, Endereço, Condições de Saúde (Sim/Não + listas) e Dados de Matrícula.
8. Editar (opcionalmente) o **Nome do responsável** e **Cargo** da assinatura e conferir que o PDF regenera.
9. Clicar em **Baixar PDF** → arquivo `ficha-individual-{nome}.pdf`.
10. Voltar para a galeria ("Voltar") e repetir com a Declaração de Matrícula (fluxo preservado).
11. Testar fallback: unidade sem Configurações de Documentos → papel timbrado usa dados de `schools`.
12. Testar permissão: perfil sem `documentos.oficiais` não vê a aba.