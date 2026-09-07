# Spec: Ficha Individual do Aluno

**Feature**: `020-ficha-individual`
**Data**: 2026-09-05
**Status**: Implementado

## Visão geral

Novo documento oficial no módulo **Documentos** (aba **Documentos Oficiais**), seguindo o padrão da
Declaração de Matrícula (spec 019). A aba Documentos Oficiais ganha uma **galeria de minicards** —
cada documento com ícone, nome, descrição breve e botão **"Gerar Documento"**. Ao clicar, um card
com o título do documento apresenta o fluxo de geração (Ano Letivo + Aluno + pré-visualização +
"Baixar PDF").

A **Ficha Individual do Aluno** consolida os dados cadastrais e acadêmicos do aluno em um único
documento, com layout estruturado por seções (não em prosa como a Declaração).

## Corpo da Ficha Individual do Aluno

Gerada a partir dos dados cadastrais completos registrados no Bravery. Apresenta as informações de
forma organizada e hierarquizada. Contém, quando disponíveis no cadastro:

1. **Identificação do aluno**
   - Nome Completo
   - CPF
   - Data de Nascimento
   - Sexo
   - Cor/Raça
   - Nacionalidade
   - Naturalidade (Município de Nascimento)
   - Identificação INEP

2. **Filiação**
   - Filiação 1
   - Filiação 2

3. **Endereço**
   - CEP
   - Município
   - Logradouro
   - Número
   - Bairro
   - Complemento

4. **Condições de Saúde** (quando aplicável)
   - Possui Deficiência, TEA ou Altas Habilidades → Sim/Não + lista de tipos (deficiências + TEA + Altas Habilidades)
   - Possui transtornos que impactam a aprendizagem → Sim/Não + lista de tipos
   - Recursos de Acessibilidade → lista
   - Sem informações cadastradas → "Não há informações de saúde cadastradas."

5. **Dados de Matrícula**
   - Ano Letivo
   - Data de Matrícula
   - Etapa de Ensino
   - Turma
   - Turno

## Requisitos funcionais

- **FR-001**: Documento acessível com a permissão `documentos.oficiais` (visualizar), sem novas migrations/tabelas.
- **FR-002**: Fluxo de geração idêntico à Declaração de Matrícula: selecionar **Ano Letivo** e buscar/selecionar **aluno** (nome/CPF, mínimo 3 caracteres).
- **FR-003**: Pré-visualização em imagens (canvas via `pdfjs-dist`) e download em PDF (`@react-pdf/renderer` → `toBlob`).
- **FR-004**: Identidade visual da escola (papel timbrado, logo, cabeçalho/rodapé) via `documentos_config` com fallback para `schools` — reuso de `montarEscola`.
- **FR-005**: Assinatura editável por emissão (Nome do responsável + Cargo), pré-preenchida das Configurações de Documentos.
- **FR-006**: Galeria de minicards na aba Documentos Oficiais, escalável para novos documentos.
- **FR-007**: Nomes em Title Case (`nomeTitulo`), datas em extenso (`parseDataLocal` evita deslocamento UTC), CPF formatado, CEP formatado `00000-000`.
- **FR-008**: Rótulos de Sexo/Cor-Raça/Nacionalidade via `VALOR_DESCRICOES`; municípios (naturalidade/residência) via `getMunicipioByCodigo`.

## Ajustes de UX/UI

- Documentos Oficiais deixa de renderizar apenas a Declaração e passa a renderizar a galeria.
- Minicard: ícone em chip `bg-primary/10 text-primary`, nome `text-[16px] font-semibold`, descrição `text-[14px] text-muted-foreground`, botão "Gerar Documento" (`FilePlus2`).
- Card de geração: título = nome do documento; ações com botão "Voltar" (ghost, `ArrowLeft`).
- Estado vazio da galeria e estados de carregamento usam `EmptyState`/spinner oficiais do design system.