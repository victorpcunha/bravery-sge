# Contracts — Modelos CSV oficiais

**Feature**: specs/039-importacao-inicial-usuarios/spec.md
**Regras de arquivo**: CSV UTF-8 (BOM tolerado) · separador `;` (fallback `,`) ·
**upload aceita `.csv` e `.xlsx`** (primeira aba, ou `Preencher` se existir).
Cabeçalho obrigatório na ordem exata · datas `DD/MM/AAAA` ou `AAAA-MM-DD` · máx. 1.000 linhas

> Profissional importa **só dados pessoais** (5 colunas). O vínculo
> (regime, função, situação, início, carga horária) é completado depois
> na tela de Usuários.

## Modelo Aluno (7 colunas, ordem fixa — download em CSV)

| # | Coluna | Obrig. | Formato |
|---|---|---|---|
| 1 | `nome_completo` | Sim | Texto não-vazio |
| 2 | `cpf` | Condicional | 11 dígitos (aceita formatado `000.000.000-00`, normaliza p/ só-dígitos) + dígito verificador válido |
| 3 | `data_nascimento` | Sim | `DD/MM/AAAA` ou `AAAA-MM-DD`; não futura |
| 4 | `sexo` | Sim | Código ou rótulo (tabela abaixo) → `1`/`2` |
| 5 | `filiacao_1` | Não | Vazio → `'Não declarado'` (+ `filiacao_declarada='0'` se ambas vazias, senão `'1'`) |
| 6 | `filiacao_2` | Não | Idem |
| 7 | `matricula_certidao` | Condicional | Texto não-vazio, máx. 32 chars |

**Regra condicional**: cada linha exige `cpf` **OU** `matricula_certidao` (ao menos um); sem ambos → rejeitada.

## Modelo Profissional (5 colunas, ordem fixa — download em CSV)

| # | Coluna | Obrig. | Formato |
|---|---|---|---|
| 1 | `nome_completo` | Sim | Texto não-vazio |
| 2 | `cpf` | Sim | Idem aluno + unicidade (arquivo + ativos da escola) |
| 3 | `data_nascimento` | Sim | Idem aluno |
| 4 | `sexo` | Sim | Idem aluno |
| 5 | `email` | Sim | Formato válido |

## Normalização (código ↔ rótulo, case-insensitive, trim)

| Campo | `1` | `2` |
|---|---|---|
| `sexo` | Masculino, M | Feminino, F |

Valor fora da tabela → linha rejeitada listando os valores aceitos (PE-402).

## Exemplo — `modelo-alunos.csv`

```csv
nome_completo;cpf;data_nascimento;sexo;filiacao_1;filiacao_2;matricula_certidao
Maria Silva Santos;11144477735;12/03/2018;Feminino;Ana Silva;;
João Pereira;47283910433;05/11/2017;1;;;"123456 78 90 1234 1 23456 789 0123456 89"
```

## Exemplo — `modelo-profissionais.csv`

```csv
nome_completo;cpf;data_nascimento;sexo;email
Carlos Souza;12345678909;20/07/1985;Masculino;carlos.souza@escola.edu.br
```
