# Quickstart: Módulo Documentos

**Feature**: `019-documentos`

## Pré-requisitos

- Spec 018 (`documentos_config`) aplicada e, idealmente, `Configurações de Documentos` preenchidas
  na Unidade Escolar (logo, responsável, cabeçalho/rodapé) — validar o documento completo.
- Aplicar a migration no Supabase (SQL Editor):
  ```sql
  -- supabase-migrations/patch_recursos_documentos.sql
  ```
- Desenvolver: `npm install` (já inclui `@react-pdf/renderer`). Build: `npx next build`.

## Perfis e Permissões

No cadastro Perfis e Permissões, conceder ao perfil desejado (ex.: Secretária, Gestor) as ações no
módulo **Documentos**:
| Recurso | O que libera |
|---------|-------------|
| `documentos.oficiais` | Aba **Documentos Oficiais** (gerar PDFs) |
| `documentos.preencher` | Aba **Preenchimento Manual** (futuro) |
| `relatorios` | Seção **Relatórios** (futuro) |

Sem nenhuma permissão, o módulo não aparece no menu e a URL `/documentos` mostra "Sem permissão".

## Superadmin

O superadmin não possui unidade escolar vinculada por padrão (`schoolId = null`). Na página
`/documentos`, aparece um seletor **"Unidade Escolar"** (apenas para superadmin) com todas as escolas
(`allSchools`); com apenas 1 escola cadastrada a seleção é automática. Sem escola selecionada, a aba
Documentos Oficiais mostra "Selecione uma unidade escolar".

> O superadmin **não depende de perfil/permissão** (bypass via `validarPermissaoEstrita`). Profissionais
> comuns precisam que o gestor conceda o recurso no Perfis e Permissões.

## Cenário de validação (Declaração de Matrícula)

1. Fazer login com profissional vinculado à escola (com permissão em `documentos.oficiais`).
2. Abrir o menu **Documentos** → aba **Documentos Oficiais**.
3. Selecionar um **Ano Letivo** da escola.
4. Buscar um aluno por nome ou CPF (mínimo 3 caracteres) e selecioná-lo.
   - Deve aparecer a turma e a situação da matrícula na lista de resultados.
5. Aguardar carregar a **Pré-visualização** do PDF (iframe).
   - Verificar: logo/nome da escola, endereço, CNPJ, contato; título "DECLARAÇÃO DE MATRÍCULA";
     corpo com nome do aluno, data de nascimento, CPF, filiação, ano letivo, turma, etapa, turno e
     situação; linha de dados da matrícula; rodapé com local + data e responsável/cargo.
6. Clicar em **Baixar PDF** e confirmar o download do arquivo `.pdf`.
7. Repetir com um aluno sem `documentos_config` preenchida → o cabeçalho usa os dados da
   Unidade Escolar (fallback) e continua gerando normalmente.
8. Testar com perfil sem permissão: menu não exibe Documentos; URL direta mostra "Sem permissão".
9. Testar perfil com apenas `relatorios`: aba Documentos fica desabilitada/sem acesso e a seção
   Relatórios mostra o placeholder "Em breve".