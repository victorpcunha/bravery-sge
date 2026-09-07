# Feature Specification: Módulo Documentos

**Feature Branch**: `019-documentos`

**Created**: 2026-09-04

**Status**: Draft (Fase 1 — Fundação + Declaração de Matrícula)

## Visão Geral

Novo módulo **Documentos**, acessado pelos profissionais da escola conforme permissões do cadastro
de Perfis e Permissões. O módulo é sempre operado no contexto da escola do profissional logado
(`user_schools` → `schoolId`), como os demais módulos.

O módulo possui **duas seções independentes**:

1. **Documentos** — documentos oficiais, com modelos próprios, que utilizam a identidade visual da
   Unidade Escolar (`documentos_config`, spec 018) e são gerados como **arquivos finais em PDF**.
   Subdivide-se em duas abas:
   - **Documentos Oficiais**: gerados automaticamente a partir dos dados do sistema.
   - **Documentos para Preenchimento Manual**: modelos em branco com cabeçalho da escola.
2. **Relatórios** — consultas analíticas/operacionais, com filtros, visualização em tela e exportação.

## Escopo desta Fase 1

- Fundação do módulo: recursos de permissão, navigation (sidebar + abas internas), página com seções.
- **1º documento oficial funcional**: **Declaração de Matrícula**.
- Aba "Preenchimento Manual" e seção "Relatórios" como placeholders ("Em breve").

## Especificação — Declaração de Matrícula

Gerada a partir dos dados cadastrais do aluno, matrícula, turma e ano letivo. O profissional:
1. seleciona o **Ano Letivo** da escola;
2. busca e seleciona o **aluno** com matrícula naquele ano (nome/CPF, mínimo 3 caracteres);
3. visualiza **pré-visualização** em PDF e pode **baixar o PDF** final.

Identidade visual usada no cabeçalho/rodapé: `documentos_config` (logo, nome da escola/fantasia,
endereço, CNPJ, telefone, e-mail, responsável/cargo, cabeçalho e rodapé) com fallback para os dados
da própria `schools` quando a configuração não foi preenchida. `cabecalho`/`rodape` (HTML do editor
de texto) são convertidos para texto puro (sanitização via `sanitize-html`) no momento da geração.

## Requisitos Funcionais (Fase 1)

- **FR-001**: O módulo Documentos DEVE ser acessível apenas a profissionais com permissão em pelo
  menos um dos recursos (`documentos.oficiais`, `documentos.preencher`, `relatorios`).
- **FR-002**: As seções DEVERÃO ser controladas individualmente por recurso (Documentos Oficiais,
  Preenchimento Manual, Relatórios).
- **FR-003**: A tela Documentos DEVE dividir-se em Documentos | Relatórios, e a aba Documentos em
  Documentos Oficiais | Preenchimento Manual.
- **FR-004**: A Declaração de Matrícula DEVE exigir Ano Letivo e Aluno para geração.
- **FR-005**: A Declaração DEVE conter identidade da escola (logo/nome/endereço/CNPJ/contato),
  corpo textual padronizado, dados da matrícula/turma e rodapé com local/data + responsável.
- **FR-006**: O sistema DEVE permitir baixar o documento como arquivo PDF.
- **FR-007**: Sem permissão ou sem unidade escolar vinculada, o sistema DEVE exibir estados vazios
  informativos (não quebrar a interface).

## Ajustes — Documentos Oficiais (Declaração de Matrícula)

- **Turno**: `turnos` da turma é JSONB de objetos `{ turno, horario_inicial, horario_final }`. A
  server action extrai `.turno` e retorna `string[]` — o PDF nunca renderiza objeto.
- **Capitalização**: nomes de pessoas (aluno, filiação 1/2, assinatura) são exibidos em **Title Case**
  via `nomeTitulo` (partículas `da/de/do/dos/e/em/...` mantidas em minúsculas), independente de como
  foram salvos no cadastro.
- **Nome da escola**: o cabeçalho exibe **apenas o Nome Fantasia** em destaque (fallback para o nome
  oficial quando não há fantasia). Não há nome oficial/CNPJ no rodapé — a escola insere essas
  informações no texto de rodapé, conforme sua necessidade.
- **Papel timbrado**: os textos de Cabeçalho e Rodapé (`documentos_config`) são renderizados como
  `<View fixed>` no react-pdf, com a área de conteúdo `flexGrow: 1` — cabeçalho fixo no topo e rodapé
  **pregado na base da folha**, repetidos em todas as páginas. Quando o campo está vazio, a área
  simplesmente não aparece.
- **Divisão cabeçalho/rodapé**: o **cabeçalho** contém apenas **Logo + Nome Fantasia + texto de
  cabeçalho** (o texto alinhado à coluna do nome). O **rodapé** contém, numa **única linha
  centralizada**, o endereço (logradouro, número, bairro, município, CEP) e o contato (telefone,
  e-mail, site); abaixo, o texto de rodapé configurado.
- **Datas**: datas `YYYY-MM-DD` são convertidas para `Date` **local** via `parseDataLocal`, evitando o
  deslocamento de um dia causado pelo UTC (ex.: nascimento 02/08 exibia 01/08). A tabela de dados da
  matrícula foi removida.
- **Assinatura editável por emissão**: na Pré-visualização, campos "Nome do responsável" e "Cargo"
  vêm pré-preenchidos com o padrão das Configurações de Documentos e podem ser editados **antes** de
  gerar o PDF, sem alterar a configuração da escola (aplicável a todo Documento Oficial).

## Não-Escopo (Fases futuras)

- Outros documentos oficiais (Histórico Escolar, Atestado, etc.).
- Documentos para Preenchimento Manual (modelos em branco).
- Relatórios analíticos/operacionais.