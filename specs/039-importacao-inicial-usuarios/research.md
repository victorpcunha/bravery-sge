# Research: Importação Inicial de Usuários

**Feature**: specs/039-importacao-inicial-usuarios/spec.md
**Date**: 2026-09-17

Todas as decisões abaixo foram verificadas contra o código atual do repositório (paths + linhas citados).

## R-01 — Parse do CSV no cliente com `xlsx` (dependência já instalada)

- **Decision**: Ler e interpretar o CSV no cliente com `XLSX.read` (import dinâmico), enviando as linhas já estruturadas (JSON) para as Server Actions validarem e persistirem.
- **Rationale**: `xlsx@^0.18.5` já é dependência do projeto e já é usada via `await import('xlsx')` nas telas de relatórios (`relatorio-matriculas.tsx:191,225-229`, `relatorio-desempenho.tsx:243,270-274`), então não há nova lib nem novo padrão (Constituição X). O parser lida com aspas, quebras de linha dentro de campo e detecção de separador — casos que um `split(';')` manual quebraria. Validação continua 100% server-side e autoritativa; o cliente só estrutura o texto.
- **Alternatives considered**: `papaparse`/`csv-parse` (rejeitadas — nova dependência exigiria aprovação formal); parse manual com `split` (rejeitado — frágil com campos entre aspas); upload do arquivo binário via FormData para parse no servidor (rejeitado — transfere parsing para o servidor sem ganho, e o padrão do repo é processamento tabular no cliente com `xlsx`).
- **Detalhes fixados**: leitura via `FileReader.readAsText(file, 'UTF-8')` com remoção de BOM (`\uFEFF`); separador `;` prioritário com fallback para `,` (detecção pelo cabeçalho); cabeçalho obrigatório exatamente igual ao modelo (ordem fixa — nunca mapear coluna errada silenciosamente, cf. spec edge case).

## R-02 — Fluxo em 2 etapas com lote efêmero (0 migrations)

- **Decision**: `validarLote` (só valida, sem insert, retorna relatório por linha) → revisão na tela → `confirmarLote` (revalida tudo + insere só as válidas + auditoria agregada). Nenhuma tabela nova; o lote vive apenas no estado do cliente entre as duas chamadas.
- **Rationale**: A spec exige "conferir o resultado da validação e confirmar a criação" (PE-304). Revalidar no confirmar elimina condição de corrida (função desativada ou CPF cadastrado entre validar e confirmar). Sem tabela de lote, não há migration nem limpeza de temporários (Constituição VII — nenhuma mudança estrutural necessária: `people`, `vinculos_profissionais` e `auditoria` já existem e aceitam inserts parciais — todas as colunas fora do modelo são nullable, cf. `censo_2026_tables.sql:354-466`).
- **Alternatives considered**: tabela `importacoes_lotes` com status (rejeitada — persistência de temporário, jobs de limpeza e migration sem benefício para ≤1.000 linhas); ação única validar+inserir (rejeitada — viola a revisão antes da confirmação exigida na spec).
- **Idempotência**: botão de confirmação desabilitado durante o processamento (PE-404); reenvio acidental do mesmo lote é seguro porque a revalidação rejeita os CPFs já criados como duplicidade (FR-013) — o relatório mostra, sem duplicar registros.

## R-03 — Reuso de `createPerson` (sem lógica paralela)

- **Decision**: Cada linha válida é persistida chamando `createPerson` (`people.ts:240`, gera `codigo_pessoa` sequencial por escola com retry anti-race `:244-282`). Profissional importa só dados pessoais — o vínculo (regime, função, situação, início, carga horária) é completado depois na tela de Usuários. Nenhuma regra de negócio duplicada.
- **Rationale**: Evita o risco clássico de "motor paralelo" divergindo da tela de Usuários. Inserts sequenciais evitam disputa no `MAX(codigo_pessoa)+1`. `user_schools` NÃO é tocada (é só para login — `censo_2026_tables.sql:597-602`); pessoa↔escola é `people.school_id` (`PessoaForm.tsx:550`).
- **Alternatives considered**: inserts SQL diretos em massa (rejeitado — pularia geração de `codigo_pessoa`, auditoria e qualquer invariante das actions); criar `vinculos_profissionais` no lote (removido — modelo de profissionais reduzido a 5 colunas pessoais por decisão do usuário).

## R-04 — Sem criação de login (`criarAuthUser`) no lote

- **Decision**: A importação NÃO cria `auth.users` nem registros em `user_schools`. Acesso ao sistema continua opt-in por usuário na tela de Usuários (checkbox "permitir acesso", `PessoaForm.tsx:694-701`) ou via Portal do Responsável.
- **Rationale**: Criar pessoa nunca criou login automaticamente no sistema; login exige e-mail + senha forte por usuário (`people.ts:714-740`) e geraria custo de e-mails e acoplamento. Alunos importados sem CPF sequer teriam identificador de acesso.
- **Alternatives considered**: criar logins em lote (rejeitado — exige senha por linha, vaza do escopo da spec e contraria o padrão opt-in).

## R-05 — `validarCPF` extraído para helper compartilhado

- **Decision**: Extrair o algoritmo de dígito verificador hoje privado em `censo-regras.ts:2518-2535` para helper exportável (mesmo arquivo ou `lib/`) e reutilizá-lo na validação do lote. CPF armazenado só-dígitos, 11 chars (`censo_2026_tables.sql:359`).
- **Rationale**: A tela de Usuários não valida dígito no cadastro, mas o Censo barra CPF inválido na exportação (`censo-regras.ts:2609-2623`) — importar CPFs inválidos só adiaria o erro. Validar na importação é estritamente melhor e usa a mesma regra do Censo.
- **Alternatives considered**: aceitar qualquer 11 dígitos (rejeitado — empurra o erro para a exportação do Censo).

## R-06 — Normalização de códigos (sexo)

- **Decision**: O CSV aceita código **ou** rótulo em português para `sexo` (`1/Masculino/M`, `2/Feminino/F`); o servidor normaliza para o código canônico e rejeita valores fora da tabela. A tabela de normalização vive em `contracts/csv-modelos.md`.
- **Rationale**: Planilha preenchida à mão vem com "Feminino"/"M" — rejeitar tudo que não seja código geraria suporte desnecessário (PE-402: orientar, não só barrar).
- **Nota**: regime/situação/função por nome existiram no modelo de 10 colunas e foram removidos com a redução do modelo de profissionais a 5 campos pessoais (vínculo completado na tela de Usuários).

## R-07 — Registros parciais + complementação posterior

- **Decision**: Colunas fora do modelo (cor/raça, nacionalidade, endereço, escolaridade etc. — obrigatórias na `PessoaForm.tsx:423-455`) ficam `NULL`; a complementação acontece na tela de Usuários e a validação do Censo aponta as pendências naturalmente. Filiação ausente → `filiacao_1/2 = 'Não declarado'` + `filiacao_declarada = '0'` (estado "Não declarado / Ignorado", `PessoaForm.tsx:1084-1085`); filiação informada → `filiacao_declarada = '1'`. `perfil` = `['aluno']` ou `['profissional']`.
- **Rationale**: Inventar defaults para dados censitários (ex.: cor/raça fictícia) corromperia a exportação do Censo — pior que o NULL explícito. O modelo de colunas da spec é intencionalmente mínimo (importação inicial = semente).
- **Alternatives considered**: estender o CSV com todas as colunas do Censo (rejeitado — contraria o modelo definido pelo usuário na spec e multiplica erros de preenchimento).

## R-08 — Auditoria agregada (1 registro por lote)

- **Decision**: Um único `registrarAuditoriaAgregada` (`auditoria.ts:197-221`) por confirmação, no padrão de `avaliacoes-numericas.ts:15-41` (`modulo`, `entidade`, `entidade_id`, `registro_nome`, `resumo {quantidade,...}`), com `pessoaId` do importador (ator, cf. spec 017).
- **Rationale**: 1 registro por linha (até 1.000) poluía a tela `/auditoria` e contraria o padrão de alto volume da spec 017 (Frequência, Notas etc. usam resumo). Best-effort: falha de auditoria nunca bloqueia a importação.
- **Ajuste de implementação**: como cada linha é persistida via `createPerson` reutilizado (R-03), cada pessoa criada gera também sua auditoria individual padrão do módulo `Usuários` — idêntica à criação manual na tela de Usuários. O registro agregado é a visão consolidada do lote (tipo + recebidas/criadas/rejeitadas).
- **Alternatives considered**: auditoria individual por pessoa (rejeitada — volume e ruído); sem auditoria (rejeitada — Constituição VIII).

## R-09 — Permissão e navegação do novo módulo

- **Decision**: Migration seed `patch_recursos_importacao.sql` no padrão `INSERT ... ON CONFLICT DO NOTHING` (`patch_recurso_painel_aluno.sql:6-8`): `('importacao-exportacao.importacao-inicial', 'Importação Inicial', 'Importação e Exportação')`. Sidebar: item `Censo Escolar` (rota `/censo-escolar` inalterada) vira módulo `Importação e Exportação` (sem href, como `BNCC`, `sidebar.tsx:133-162`) com submenu `Censo Escolar` (recurso `censo-escolar`) + `Importação Inicial` (novo recurso). `tab-routes.tsx`: novo módulo de aba agrupando as duas rotas (padrão Comunicados — várias rotas por módulo), mantendo regra de 1 aba/módulo e máx. 6 (spec 016).
- **Rationale**: Zero mudança funcional no Censo (só reagrupamento visual); permissão granular nova segue `modulo.recurso` + `validarPermissaoEstrita` (`perfis.ts:418-447`).
- **Alternatives considered**: recurso único herdando `censo-escolar` (rejeitado — importação é escrita em massa, merece gate próprio `criar`).

## R-10 — Duplicidade: mesmo critério da tela de Usuários

- **Decision**: Duplicado = CPF igual entre ativos da **mesma escola** (`verificarCpfDuplicado`, `people.ts:205-217`) + CPF repetido dentro do próprio arquivo (cita os números das linhas). Linha duplicada → rejeitada (FR-013), cadastro existente intocado.
- **Rationale**: Paridade exata com a regra que a tela de Usuários já aplica; CPFs de outras escolas não colidem (escopo por `school_id`, Constituição III).

## R-11 — Modelo de profissionais (histórico: XLSX com notas, revertido para CSV)

- **SUPERSEDED**: chegou a existir modelo `.xlsx` com notas de célula em regime/função; com a redução do modelo a 5 campos pessoais, ambos os modelos voltaram a CSV simples e as notas foram removidas (sem resíduo no código).
- Registro original: CSV é texto puro (sem comentário de célula/dropdown); o `xlsx@^0.18.5` instalado grava notas (`ws[addr].c`), verificado em smoke — técnica válida caso um modelo guiado volte a ser necessário, sem nova dependência.

- Registro original (implementado e depois revertido): download de Profissionais em `.xlsx` (aba `Preencher`) com notas em regime/função; upload aceitava `.xlsx`/`.csv`. Motivo da reversão: modelo reduzido a 5 campos pessoais, sem campo livre problemático restante.
