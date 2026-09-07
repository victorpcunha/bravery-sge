# Spec: Configurações de Documentos no cadastro da Unidade Escolar

**Data**: 2026-09-04 | **Status**: Implementada

## Objetivo

Adicionar o card **"Configurações de Documentos"** na aba **Identificação** do cadastro
da Unidade Escolar (`/escolas/[id]`). Esses dados serão usados pelo futuro módulo de
Documentos para compor cabeçalho, rodapé e identidade visual dos documentos/relatórios.

**Regra central**: estes campos **não pertencem ao motor do Censo Escolar** — não são
validados nem exportados no arquivo do Censo (Registro 00 / Situação Final).

## 1. Dados replicados (cópias independentes)

Campos já existentes no cadastro, **replicados automaticamente** para o card e editáveis
**apenas** dentro das Configurações de Documentos (sem alterar o cadastro original):

| Configuração | Origem em `schools` |
|---|---|
| `nome_escola_doc` | `nome_escola` |
| `cnpj_doc` | `cnpj` |
| `logradouro_doc` | `endereco` |
| `numero_doc` | `numero` |
| `bairro_doc` | `bairro` |
| `municipio_doc` (código IBGE 7 dígitos) | `municipio` |
| `cep_doc` | `cep` |
| `telefone_doc` (formatado `(DD) 99999-9999`) | `ddd` + `telefone_1` |
| `email_doc` | `email` |

## 2. Campos adicionais

- `logo` — upload de imagem (base64 data URL em coluna TEXT)
- `nome_fantasia`
- `site`
- `mantenedora` (texto livre)
- `cabecalho` — informações que aparecem no cabeçalho
- `rodape` — configurações de rodapé
- `responsavel_nome` — responsável pela assinatura
- `responsavel_cargo` — cargo/função do responsável

## 3. Comportamento

- Card aparece **somente na edição** (`schoolId` presente); na criação ("Nova Escola") é oculto.
- `readOnly` do form (visualização sem permissão de edição) desabilita o card automaticamente (`<fieldset disabled>`).
- Ao abrir pela primeira vez (sem config salva), os replicados são pré-preenchidos via seed do cadastro.
- Salvamento integrado ao botão único "Salvar Alterações": payload separado em `censo` (→ `updateSchool`) e `documentos` (→ `salvarConfigDocumentos`).
- Permissão de salvar config = permissão de editar a escola (`validarPermissaoEstrita('escolas','editar')`; Superadmin sempre passa).
- Auditoria: registro em `auditoria` (módulo **"Unidade Escolar"**, entidade `documentos_config`) com o **logo omitido** dos snapshots (blob base64 não vai ao JSONB).

## 4. Acesso

- Leitura/salvamento via server actions (`getSupabaseAdmin`) — consistent com o restante do sistema.

## 5. Fora de escopo

- Módulo de Documentos em si (geração de documentos/relatórios) — virá posteriormente e consumirá `documentos_config`.