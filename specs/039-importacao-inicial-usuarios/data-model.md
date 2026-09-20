# Data Model: Importação Inicial de Usuários

**Feature**: specs/039-importacao-inicial-usuarios/spec.md
**Date**: 2026-09-17

> **0 migrations de tabela.** Todas as entidades persistentes já existem (`people`, `vinculos_profissionais`, `recursos`, `auditoria`). As entidades de lote/linha são **efêmeras** (estado do cliente + payload das actions, nunca persistidas). Ver R-02 em [research.md](./research.md).

## Entidades efêmeras (não persistidas)

### LoteImportacao

Um envio: unidade destino + tipo + linhas estruturadas. Vive no estado do cliente entre validar e confirmar; reenviado integralmente no confirmar (servidor revalida tudo).

| Campo | Tipo | Regras |
|---|---|---|
| `schoolId` | UUID string | Obrigatório; server-side: usuário comum restrito à própria escola, superadmin qualquer unidade |
| `tipo` | `'aluno' \| 'profissional'` | Obrigatório; define colunas e validações |
| `linhas` | LinhaArquivo[] | 1–1.000 linhas (além do cabeçalho); vazio → rejeitado (FR + edge case arquivo vazio) |
| `pessoaId` | UUID string \| null | Ator (auditoria + `validarPermissaoEstrita`); superadmin sem pessoa passa |

### LinhaArquivo

| Campo | Tipo | Regras |
|---|---|---|
| `numeroLinha` | number | 2-based (linha 1 = cabeçalho); usado em todo erro (PE-402) |
| `valores` | string[] | Na ordem exata do modelo; coluna faltante/extra/fora de ordem → lote rejeitado antes da validação por linha |
| `estado` | `'valida' \| 'rejeitada'` | Resultado da validação |
| `erros` | ErroLinha[] | 1+ por linha rejeitada |

### ErroLinha

| Campo | Tipo | Regras |
|---|---|---|
| `linha` | number | `numeroLinha` (redundante p/ exibição direta na tabela) |
| `campo` | string | Nome amigável da coluna (ex. "CPF", "Função") |
| `mensagem` | string | O que está errado (ex. "CPF inválido (dígito verificador)") |
| `orientacao` | string | Como corrigir (ex. "Confira os 11 dígitos ou deixe em branco e informe a matrícula da certidão") |

### ResultadoLote (retorno das actions)

| Campo | Tipo | Regras |
|---|---|---|
| `totalRecebidas` | number | Linhas recebidas (sem cabeçalho) |
| `totalCriadas` | number | 0 no validar; N no confirmar |
| `totalRejeitadas` | number | Linhas com ≥1 erro |
| `erros` | ErroLinha[] | Ordenados por linha; paginação 10/pág no cliente |
| `criadosIds` | string[] | Só no confirmar (ids das `people` criadas, p/ conferência/auditoria) |

## Entidades persistentes (reutilizadas, sem alteração)

### people (insert por linha válida)

Mapeamento Aluno: `school_id` (lote), `nome_completo`, `cpf` (só-dígitos ou NULL), `data_nascimento` (DATE ISO), `sexo` (`1`/`2`), `filiacao_1`/`filiacao_2` (valor ou `'Não declarado'`), `filiacao_declarada` (`'1'` se ao menos uma filiação informada, senão `'0'`), `certidao_nascimento`, `perfil = ['aluno']`, `codigo_pessoa` (gerado por `createPerson`). Restante NULL (R-07).

Mapeamento Profissional: mesmos pessoais + `email`, `perfil = ['profissional']`; sem filiação/certidao.

Validações por linha (server-side, espelham Usuários + Censo): nome não-vazio; CPF (se presente) 11 dígitos + `validarCPF` + unicidade (arquivo + ativos da escola); aluno exige CPF **ou** certidão; nascimento válida/não-futura; sexo normalizado; e-mail (profissional) formato. Falha em qualquer campo → linha rejeitada, erro por campo.

> Sem `vinculos_profissionais` no lote: o vínculo do profissional é completado depois na tela de Usuários. Sem `criarAuthUser` (R-04).

### auditoria (1 insert por lote confirmado)

Via `registrarAuditoriaAgregada`: `modulo` próprio da importação, `entidade 'people'`, `resumo {tipo, totalRecebidas, totalCriadas, totalRejeitadas}` + escola/ator. Best-effort (R-08).

### recursos (1 seed)

`('importacao-exportacao.importacao-inicial', 'Importação Inicial', 'Importação e Exportação')` via `patch_recursos_importacao.sql` (R-09).

## Modelos CSV oficiais (ordem fixa das colunas)

**Aluno** (7): `nome_completo | cpf | data_nascimento | sexo | filiacao_1 | filiacao_2 | matricula_certidao`
**Profissional** (5): `nome_completo | cpf | data_nascimento | sexo | email`

Cabeçalho divergente (nome, ordem ou quantidade) → lote rejeitado com mensagem que mostra o cabeçalho esperado. Formato: CSV UTF-8 (BOM tolerado), separador `;` (fallback `,`), data `DD/MM/AAAA` ou `AAAA-MM-DD`. Tabelas de normalização (códigos ↔ rótulos) em [contracts/csv-modelos.md](./contracts/csv-modelos.md).

## Transições de estado (fluxo)

`sem-arquivo → arquivo-lido → validando → {valido-total | parcial | rejeitado-total} → confirmando → concluído`

- `validando`/`confirmando`: UI bloqueada contra duplo envio (PE-404).
- `parcial`: mostra resumo + erros; confirmação importa só as válidas (FR-012).
- `rejeitado-total` (ex.: cabeçalho errado, 0 linhas): nada a confirmar; orienta baixar o modelo.
- `concluído`: resumo final + erros das rejeitadas p/ correção e reenvio.
