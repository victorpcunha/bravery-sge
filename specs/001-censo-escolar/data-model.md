# Data Model: Censo Escolar – Matrícula Inicial 2026

**Feature**: 001-censo-escolar
**Date**: 2026-06-09

## Princípio

O módulo Censo **lê e valida** dados das tabelas operacionais existentes. NÃO cria tabelas `censo_*` separadas para cadastro. Os campos exigidos pelo INEP que ainda não existem são **adicionados às tabelas operacionais**, para que possam ser preenchidos nas telas de gestão existentes.

## Tabelas Existentes que Recebem Novos Campos

### `schools` — Dados da Escola (Registros 00 e 10)

**Já existem**: `codigo_inep`, `nome_escola`, `cnpj`, `situacao_funcionamento`, `dependencia_administrativa`, `localizacao`, `localizacao_diferenciada`, `categoria_escola_privada`, `regulamentacao`, `unidade_vinculada`, `telefone_1`, `telefone_2`, `email`, e ~30 campos booleanos de infraestrutura.

**A adicionar (~200 campos)**:
- **Endereço**: `cep`, `municipio`, `distrito`, `endereco`, `numero`, `complemento`, `bairro`, `ddd`
- **Ano letivo**: `data_inicio_ano`, `data_fim_ano`
- **Administrativo**: `codigo_orgao_regional`, `orgao_secretaria_educacao`, `orgao_seguranca`, `orgao_saude`, `orgao_outro`
- **Mantenedora**: `mant_empresa`, `mant_sindicatos`, `mant_ong`, `mant_sem_fins_lucrativos`, `mant_sistema_s`, `mant_oscip`
- **Parcerias e convênios**: `parceria_estadual`, `parceria_municipal`, + 12 campos de forma de contratação (6 estaduais + 6 municipais)
- **Regulamentação**: `esfera_regulamentacao`, `codigo_escola_sede`, `codigo_ies`
- **CNPJs**: `cnpj_mantenedora`, `cnpj_escola` (separar do `cnpj` atual)
- **Infraestrutura completa** (~160 campos): locais de funcionamento, água/luz/esgoto/lixo, dependências físicas, acessibilidade, salas de aula, equipamentos, internet, profissionais, materiais pedagógicos, gestão escolar

**A corrigir**: `regulamentacao` (BOOLEAN→VARCHAR), `unidade_vinculada` (VARCHAR 20→VARCHAR 1)

### `people` — Pessoas (Registro 30)

**Já existem**: `cpf`, `nome_completo`, `data_nascimento`, `sexo`, `cor_raca`, `nacionalidade`, e alguns campos de deficiência.

**A adicionar (~20 campos)**:
- **Documentos**: `certidao_nascimento` (VARCHAR 32), `inep_id` (VARCHAR 12)
- **Identidade**: `povo_indigena` (VARCHAR 3), `filiacao_declarada`, `filiacao_1`, `filiacao_2`
- **Residência**: `pais_residencia`, `cep`, `municipio_residencia`, `zona_residencia`, `localizacao_diferenciada_residencia`
- **Deficiências** (completar): `deficiencia`, `cegueira`, `baixa_visao`, `visao_monocular`, `surdez`, `deficiencia_auditiva`, `surdocegueira`, `deficiencia_fisica`, `deficiencia_intelectual`, `deficiencia_multipla`, `tea`, `altas_habilidades`
- **Transtornos**: `transtorno_aprendizagem`, `discalculia`, `disgrafia`, `dislalia`, `dislexia`, `tdah`, `tpac`
- **Recursos de acessibilidade** (14 campos): `auxilio_ledor` a `tempo_adicional`
- **Formação acadêmica**: `escolaridade`, `tipo_ensino_medio`, 3× curso superior (codigo + ano + ies), 3× área pedagógica
- **Pós-graduação**: 6× (tipo + área + ano) + `sem_pos`
- **Formação continuada** (21 campos): `form_creche` a `form_gestao`, `sem_formacao`
- **Email**: `email` (VARCHAR 100 — apenas para gestores)

### `turmas` — Turmas (Registro 20)

**Já existem**: `nome`, `tipo_mediacao`, `tipo_ensino`, `etapa_ensino_id`, `dias_funcionamento`, `turnos`, `tipos_turma`, `organizacao_curricular`, `forma_organizacao`, `ativo`.

**A adicionar/corrigir (~10 campos)**:
- **Horários INEP**: `horario_domingo` a `horario_sabado` (VARCHAR 11 cada, formato hh:mm-hh:mm)
- **Etapa**: `etapa_agregada` (VARCHAR 3), `etapa_codigo` (VARCHAR 2 — código INEP)
- **Curso profissional**: `eixo_qualificacao` (VARCHAR 2), `codigo_curso_tecnico` (VARCHAR 8), `carga_horaria_curso`
- **Itinerário**: `fgb`, `ifa`, `iftp`, `tipo_curso_iftp`, `ifa_linguagens`, `ifa_matematica`, `ifa_natureza`, `ifa_humanas`
- **Outros**: `turma_especial` (VARCHAR 1), `formacao_alternancia` (BOOLEAN), `turma_bilingue`
- **Áreas do conhecimento** (27 campos booleanos — ampliar os existentes)

### `turmas_profissionais` (Registro 50 via Quadro de Aulas)

**Já vincula** profissional a turma com função e disciplinas.

**A adicionar**:
- **Função INEP**: `funcao_censo` (VARCHAR 1 — códigos 1 a 9 do INEP)
- **Situação funcional**: `situacao_funcional` (VARCHAR 1)
- **Áreas INEP** (25 slots): `area_censo_1` a `area_censo_25` (VARCHAR 2)
- **Itinerário**: `leciona_linguagens`, `leciona_matematica`, `leciona_natureza`, `leciona_humanas`, `leciona_iftp`

### `academico_matriculas` (Registro 60)

**Já contém** matrícula de aluno em turma, transporte (responsável, veículos), situação.

**A adicionar (~15 campos)**:
- **Censo**: `codigo_inep`, `inep_id`, `codigo_matricula_censo`
- **Turma multi**: `turma_multi` (VARCHAR 2 — código de etapa que o aluno cursa na turma multisseriada)
- **Carga horária**: `carga_horaria_iftp`
- **AEE** (11 campos booleanos): `aee_funcao_cognitiva` a `aee_recursos_opticos`
- **Escolarização externa**: `escolarizacao_externa` (VARCHAR 1 — 1/2/3)
- **Transporte detalhado**: expandir veículos para 10 campos individuais (`veiculo_bicicleta` a `veiculo_aqua_mais`)

## Tabelas de Referência (Dados Estáticos)

Armazenadas como JSON/TypeScript em `src/data/censo/`:

- `idades-permitidas.ts` — Anexo 3
- `recursos-deficiencias.ts` — Anexo 4, matriz 14×9
- `recursos-transtornos.ts` — Anexo 4, matriz 3×6
- `contratacao-dependencia.ts` — Anexo 5, matriz 6×5
- `etapas-formas-organizacao.ts` — Anexo 6, matriz 35+×6
- `etapas-ensino.ts` — Códigos e nomes de etapas (extraído da Tabela de Etapas 2026.xlsx)
- `areas-conhecimento.ts` — Códigos INEP de áreas (extraído da tabela INEP correspondente)

Tabelas grandes (municípios, distritos, cursos superiores, IES) já existem em `src/data/` e podem ser complementadas.
