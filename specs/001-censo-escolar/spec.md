# Feature Specification: Censo Escolar – Matrícula Inicial 2026

**Feature Branch**: `001-censo-escolar`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "Módulo Censo Escolar — Matrícula Inicial 2026 (INEP/MEC — EducaCenso)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Validar dados da escola e infraestrutura contra regras INEP (Priority: P1)

O profissional acessa o módulo Censo Escolar, seleciona o ano letivo e a etapa "Matrícula Inicial". O sistema lê os dados já cadastrados da escola (módulo Escolas) e da infraestrutura, cruza com as regras do INEP (Registros 00 e 10), e exibe uma lista de inconsistências: campos obrigatórios não preenchidos, formatos inválidos, combinações incompatíveis (ex: mantenedora exigida para escola privada, parceria com forma de contratação inválida para a dependência). Cada erro tem um link que redireciona para a tela de edição da escola, no campo exato que precisa ser corrigido. Após corrigir, o profissional retorna ao Censo e revalida.

**Why this priority**: Os dados da escola são a raiz do arquivo INEP — sem eles, nenhum outro registro pode ser validado. Além disso, o endereço completo, datas de ano letivo e campos administrativos são os mais prováveis de estarem incompletos, pois são específicos do Censo.

**Independent Test**: Acessar o módulo com uma escola que tem apenas nome e código INEP preenchidos. Clicar "Validar" e verificar que o sistema aponta todos os campos obrigatórios faltantes (CEP, município, endereço, etc.) com links para a tela de edição da escola.

**Acceptance Scenarios**:

1. **Given** uma escola municipal com dados básicos preenchidos, **When** o profissional clica "Validar", **Then** o sistema mostra na aba "Registro 00" os erros: CEP não informado, município não informado, endereço não informado, distrito não informado. Cada erro é um link clicável para `/escolas/[id]`.
2. **Given** uma escola privada sem mantenedora informada, **When** o profissional valida, **Then** o sistema exibe: "Pelo menos um dos campos de mantenedora deve ser preenchido quando a dependência administrativa for Privada" com link para a seção de mantenedora na tela da escola.

---

### User Story 2 — Validar turmas contra regras INEP (Priority: P2)

O sistema lê as turmas já cadastradas (módulo Gestão de Turmas), cruza com as regras do Registro 20, e exibe inconsistências: horários em formato inválido, etapa sem forma de organização compatível, áreas do conhecimento obrigatórias não informadas, turma sem profissional ou sem aluno vinculado. Cada erro redireciona para a tela de edição da turma correspondente.

**Why this priority**: As turmas conectam profissionais e alunos. Sem turmas válidas, os registros 50 e 60 não podem ser validados. A regra "toda turma precisa de ao menos 1 profissional e 1 aluno" é uma das mais comuns de serem violadas.

**Independent Test**: Ter 3 turmas cadastradas: uma completa, uma sem profissional vinculado, uma com horário "09:03-10:00" (minutos não múltiplos de 5). Validar e verificar que apenas as duas últimas geram erros.

**Acceptance Scenarios**:

1. **Given** uma turma com tipo de mediação "Presencial" mas sem nenhum horário preenchido, **When** o profissional valida, **Then** o sistema exibe: "Pelo menos um dia da semana com horário deve ser informado quando a mediação for Presencial" com link para a tela da turma.
2. **Given** uma turma sem profissional vinculado, **When** o profissional valida, **Then** o sistema exibe: "A turma [nome] não possui profissional vinculado. Toda turma deve ter ao menos um profissional (Registro 50)." com link para `/gestao-turmas/quadro-aulas/`.

---

### User Story 3 — Validar pessoas (alunos, profissionais, gestores) contra regras INEP (Priority: P3)

O sistema lê as pessoas cadastradas (módulo Gestão de Usuários) que possuem vínculo com a escola (gestor, profissional, aluno), cruza com as regras do Registro 30, e exibe inconsistências: idade incompatível com o vínculo (gestor <18, profissional <14), CPF obrigatório não informado, nome inválido (menos de 2 palavras, caracteres repetidos), deficiências com combinações proibidas (surdocegueira + cegueira), recursos de acessibilidade incompatíveis com a deficiência, formação acadêmica não informada para profissional, certidão de nascimento para aluno sem CPF. Cada erro redireciona para a tela da pessoa.

**Why this priority**: Pessoas são a entidade com mais regras de validação (110 campos, 10+ regras de incompatibilidade). Mas dependem das turmas (US2) para validações de idade×etapa.

**Independent Test**: Cadastrar 3 pessoas: um gestor com 17 anos, um aluno com deficiência "Cegueira" marcando "Tradutor de Libras", e um profissional sem CPF. Validar e verificar que os 3 erros são reportados.

**Acceptance Scenarios**:

1. **Given** um gestor com data de nascimento que resulta em 17 anos, **When** o profissional valida, **Then** o sistema exibe: "Idade do gestor: 17 anos. Idade permitida: 18 a 95 anos." com link para `/gestao-usuarios/usuarios/[id]`.
2. **Given** um aluno com deficiência "Cegueira" e recurso "Tradutor-Intérprete de Libras" marcado, **When** o profissional valida, **Then** o sistema exibe: "Recurso 'Tradutor-Intérprete de Libras' não é permitido para a deficiência 'Cegueira' (regra N do Anexo 4)." com link para a aba de deficiências na tela da pessoa.

---

### User Story 4 — Validar vínculos de gestores, profissionais e matrículas (Priority: P4)

O sistema lê os vínculos existentes — gestores da escola (tela de Escolas), profissionais nas turmas (Quadro de Aulas), e matrículas de alunos (Alunos Matriculados) — e cruza com as regras dos Registros 40, 50 e 60. Exibe inconsistências: mais de 3 gestores, profissional com função incompatível com o tipo de turma, áreas que o profissional leciona não oferecidas pela turma, aluno com idade fora da faixa da etapa, matrícula em AEE sem tipo de atendimento informado, transporte escolar com veículos inconsistentes. Cada erro redireciona para a tela de origem do vínculo.

**Why this priority**: Validações cross-registro — dependem de todos os dados anteriores estarem consistentes.

**Independent Test**: Ter uma turma EAD com profissional "Auxiliar" vinculado (função não permitida em EAD) e um aluno de 10 anos matriculado em EJA Ensino Médio. Validar e verificar ambos os erros.

**Acceptance Scenarios**:

1. **Given** um profissional com função "Auxiliar/assistente educacional" vinculado a uma turma EAD, **When** o profissional valida, **Then** o sistema exibe: "Função 'Auxiliar' não é permitida para turmas com mediação EAD." com link para `/gestao-turmas/quadro-aulas/`.
2. **Given** um aluno de 8 anos matriculado em turma de EJA Ensino Médio (etapa 71, mín 15 anos), **When** o profissional valida, **Then** o sistema exibe: "Idade do aluno: 8 anos. Idade permitida: 15 a 93 anos para EJA - Ensino Médio." com link para `/gestao-academica/matriculas/`.

---

### User Story 5 — Exportar arquivo .txt validado para o EducaCenso (Priority: P5)

Após todos os erros serem corrigidos e a validação retornar 0 inconsistências, o profissional clica em "Exportar". O sistema gera o arquivo .txt no formato INEP (ISO-8859-1, pipe-delimitado, registros ordenados 00→10→20→30→40→50→60, terminador 99|) e inicia o download. O nome do arquivo segue o padrão: apenas letras, números e underscore, até 20 caracteres.

**Why this priority**: É o objetivo final do módulo. Mas só pode ser executado quando todos os dados passarem na validação.

**Independent Test**: Após zerar todos os erros de validação, clicar "Exportar" e verificar que o arquivo baixado contém a estrutura correta.

**Acceptance Scenarios**:

1. **Given** que todos os erros foram corrigidos e a validação retorna 0 inconsistências, **When** o profissional clica "Exportar", **Then** o sistema gera e inicia o download do arquivo .txt.
2. **Given** que ainda existem erros de validação, **When** o profissional tenta clicar "Exportar", **Then** o botão está desabilitado com tooltip "Corrija todos os erros antes de exportar".
3. **Given** uma escola com situação "Paralisada", **When** o profissional exporta, **Then** o arquivo contém apenas registros 00, 30 e 40.

---

### Edge Cases

- O que acontece quando uma pessoa é profissional em uma turma e aluno em outra? O sistema deve validar ambos os vínculos independentemente, mas garantir que não há registro duplicado de pessoa na mesma turma.
- Como o sistema lida com campos que existem nas regras INEP mas não existem nas tabelas operacionais atuais (ex: `povo_indigena`, `deficiencia_multipla`, `certidao_nascimento`)? Esses campos devem ser adicionados às tabelas existentes (`people`, `turmas`, `escolas`) para que possam ser preenchidos e validados.
- O que acontece quando o profissional clica em "Validar" e zero erros são encontrados? O botão "Exportar" é liberado imediatamente.
- Como funciona o redirecionamento quando um erro aponta para um campo específico? O link deve incluir um parâmetro de URL (ex: `?tab=endereco&field=cep`) para que a tela de destino abra na seção correta.
- O que acontece se a escola não tem código INEP? O sistema alerta que o código INEP é obrigatório para exportação e sugere solicitá-lo ao órgão competente.

## Requirements *(mandatory)*

### Functional Requirements

**Tela do Módulo**

- **FR-001**: O sistema DEVE apresentar uma tela única com filtros de Ano Letivo e Etapa do Censo (Matrícula Inicial / Situação do Aluno).
- **FR-002**: O sistema DEVE exibir o botão "Validar" que executa todas as regras INEP sobre os dados já existentes.
- **FR-003**: O sistema DEVE organizar os resultados da validação em abas por registro (00 a 60), com identificação clara do tipo de registro (ex: "Registro 20 — Turmas").
- **FR-004**: O sistema DEVE exibir cada inconsistência com: descrição da regra violada (texto oficial INEP), valor atual que causou o erro, e link "Corrigir" que redireciona para a tela de gestão correspondente.
- **FR-005**: O sistema DEVE manter o botão "Exportar" desabilitado enquanto houver erros de validação, com tooltip informando o motivo.

**Validação de Dados Existentes**

- **FR-006**: O sistema DEVE ler os dados da escola (Registros 00 e 10) das tabelas operacionais existentes e validar contra as regras INEP de obrigatoriedade, formato, tamanho e compatibilidade condicional.
- **FR-007**: O sistema DEVE ler os dados de turmas (Registro 20) das tabelas operacionais e validar horários (formato hh:mm-hh:mm, minutos múltiplos de 5), etapa × forma de organização (Anexo 6), e áreas do conhecimento.
- **FR-008**: O sistema DEVE ler os dados de pessoas (Registro 30) das tabelas operacionais e validar: idade compatível com vínculo (Anexo 3), CPF obrigatório conforme vínculo, nome válido (mín 2 palavras, máx 4 chars repetidos), deficiências sem conflitos (10 regras), recursos compatíveis com deficiências (Anexo 4).
- **FR-009**: O sistema DEVE ler os vínculos existentes (gestores, profissionais por turma, matrículas) e validar: limite de gestores (máx 3), compatibilidade função × tipo de turma, áreas lecionadas subset da oferta da turma, idade do aluno × etapa, AEE obrigatório para turmas do tipo AEE, transporte escolar condicional.
- **FR-010**: O sistema DEVE validar regras de integridade: toda turma com ≥1 profissional e ≥1 aluno, ordenação correta dos registros, limites de 100 escolas e 1500 turmas.
- **FR-011**: O sistema DEVE aplicar a hierarquia de identificação de pessoa (INEP ID → CPF → Certidão Nova) e validar vínculos máximos por aluno (4 escolarização, 2 não-AEE, 4 AEE).

**Redirecionamento para Correção**

- **FR-012**: Cada erro de validação DEVE ser um link clicável que redireciona para a tela de gestão onde o dado pode ser corrigido, com parâmetros para abrir na seção/aba correta.
- **FR-013**: O sistema DEVE mapear cada campo INEP para sua tela de origem: Registro 00/10 → `/escolas/[id]`, Registro 20 → `/gestao-turmas/turmas/[id]`, Registro 30 → `/gestao-usuarios/usuarios/[id]`, Registro 40 → `/escolas/[id]?tab=gestores`, Registro 50 → `/gestao-turmas/quadro-aulas/`, Registro 60 → `/gestao-academica/matriculas/`.

**Exportação**

- **FR-014**: O sistema DEVE gerar arquivo .txt com codificação ISO-8859-1, nome de até 20 caracteres (letras, números e underscore), campos pipe-delimitados, conteúdo em maiúsculas sem acentos.
- **FR-015**: O sistema DEVE estruturar o arquivo com registros na ordem 00→10→20→30→40→50→60 e terminador 99|.
- **FR-016**: O sistema DEVE tratar escolas paralisadas/extintas gerando apenas registros 00, 30 e 40.

**Campos INEP nas Tabelas Operacionais**

- **FR-017**: O sistema DEVE adicionar às tabelas operacionais existentes (`escolas`, `turmas`, `people`, `academico_matriculas`) os campos exigidos pelo INEP que ainda não existem, para que possam ser preenchidos nas telas de gestão existentes.

### Key Entities

- **Escola** (tabela `schools` operacional): dados cadastrais, endereço completo, dependência administrativa, mantenedores, parcerias, infraestrutura física. Os dados são preenchidos na tela `/escolas/[id]` e validados pelo Censo para os Registros 00 e 10.
- **Turma** (tabela `turmas` operacional): código, nome, tipo de mediação, horários, tipo, etapa de ensino, forma de organização, áreas do conhecimento. Gerenciada em `/gestao-turmas/turmas/` e validada pelo Censo para o Registro 20.
- **Pessoa** (tabela `people` operacional): dados pessoais, documentos, deficiências, formação. Gerenciada em `/gestao-usuarios/usuarios/` e validada pelo Censo para o Registro 30.
- **Vínculos**: gestor (na tela da escola), profissional por turma (Quadro de Aulas), matrícula de aluno (Alunos Matriculados). Validados para Registros 40, 50 e 60.
- **Arquivo de Exportação**: produto final — .txt ISO-8859-1 com 7 tipos de registro pipe-delimitados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O profissional consegue identificar todas as inconsistências nos dados da escola em uma única tela, com abas separadas por tipo de registro, sem precisar navegar entre múltiplas páginas.
- **SC-002**: Cada erro de validação exibe um link que redireciona para a tela exata de correção, posicionando o profissional no campo que precisa ser ajustado.
- **SC-003**: O sistema valida 100% das regras de incompatibilidade entre deficiências (10 regras), entre recursos e deficiências (126 combinações do Anexo 4), e de idade por etapa (35+ combinações do Anexo 3).
- **SC-004**: Após todos os erros serem corrigidos, o profissional consegue exportar o arquivo .txt com um clique, e o arquivo gerado contém a estrutura esperada (registros ordenados, codificação ISO-8859-1, terminador 99|).
- **SC-005**: O tempo entre identificar um erro, clicar no link, corrigir o dado e retornar à validação é menor do que o profissional levaria para localizar a tela manualmente.
- **SC-006**: O módulo Censo não duplica funcionalidades de cadastro já existentes no sistema — ele apenas valida e redireciona.

## Assumptions

- As telas de gestão existentes (Escolas, Turmas, Usuários, Quadro de Aulas, Matrículas) serão estendidas para incluir os campos exigidos pelo INEP que ainda não possuem (ex: endereço completo da escola, deficiências, povo indígena, certidão de nascimento).
- Os parâmetros de URL para posicionamento em seções/abas específicas (ex: `?tab=endereco&field=cep`) são suportados pelas telas de destino.
- As tabelas de referência do INEP (municípios, distritos, países, cursos, IES, áreas do conhecimento, etc.) são carregadas como dados estáticos para consulta durante a validação.
- O profissional que acessa o módulo tem permissão `censo-escolar` e está vinculado a uma escola.
- A exportação é via arquivo .txt que o profissional submete manualmente ao EducaCenso — não há integração direta com API do INEP.
- Os dados operacionais do sistema (turmas, matrículas, pessoas) são a fonte de verdade — o Censo é uma "fotografia" desses dados na data de referência (última quarta-feira de maio).
