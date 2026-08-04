# Spec: Diário de Classe — Aba Notas Modernizada

**Branch**: `011-diario-notas-modernizacao` | **Data**: 2026-07-31

## Objetivo

Reescrever a aba **Notas** (Avaliações Numéricas) do Diário de Classe com a mesma linguagem visual e
comportamental das abas modernizadas (Parecer, Indicadores): seletor de bimestre com status dots,
sub-abas hierárquicas, auto-save com debounce, cards de aluno em acordeão e nova aba de Recuperações.

## Comportamento

### 1. Filtro de disciplina
- Mesmo modelo das outras abas: `Select` oficial à esquerda (`min-w-[220px] max-w-xs`).
- Valor = `matriz_disciplina_id` (a coluna `academico_notas.disciplina_id` referencia `academico_matriz_disciplinas.id`).

### 2. Seletor de Bimestre (Segmented Control)
- Botões `1º Bimestre`..`4º Bimestre` com dot de status global do bimestre:
  - **verde** = todos os alunos com todas as avaliações lançadas
  - **amarelo** = parcial
  - **cinza** = pendente
- Trocar bimestre recarrega a lista de avaliações e as notas exibidas.

### 3. Sub-abas hierárquicas
- **Resumo** (ícone `BarChart3`): visão consolidada de todos os bimestres.
- **Registro** (ícone `ClipboardList`): lançamento de notas por aluno (acordeão).
- **Recuperações** (ícone `RefreshCcw`): nova aba, com até 3 sub-abas conforme o método
  (`permite_recuperacao`): Por Avaliação (`FileText`), Por Bimestre (`CalendarRange`) e Final (`CheckSquare`).
- Indicador visual de aba ativa via **underline** (`border-b-2 border-primary`) + ícone distinto.

### 4. Sub-aba Resumo
- **5 cards estatísticos do bimestre ativo** (disciplina selecionada):
  Média da Turma, Maior Média, Menor Média, Acima da média configurada, Abaixo da média configurada.
  Cores semânticas + hover animado (`hover:-translate-y-0.5 hover:shadow-md`).
- **Tabela completa**: coluna Aluno **sticky** (esquerda), 1 coluna por bimestre com a média calculada,
  coluna **Média Final** e coluna **Situação**.
- Cores semânticas nas médias: verde `>=` média mínima configurada, vermelho `<` média mínima.
- Badges de Situação com cores (Aprovado/Recuperação/Reprovado).
- Dados obtidos automaticamente (sem botão "Calcular Desempenho"): recálculo ao carregar e após auto-save (debounce).

### 5. Sub-aba Registro
- **Overview Bar**: Completos / Parciais / Pendentes + barra de progresso com % do bimestre ativo.
- **Cards de Aluno (Acordeão)**:
  - Mini badges por bimestre no header, coloridos por status, clicáveis para trocar bimestre.
  - Label de status à direita: `✓ Completo`, `◐ Parcial`, `○ Pendente`.
  - **Badge de Média** no header (visível colapsado) com cor semântica (verde `>=` média mínima,
    vermelho `<` média mínima, cinza sem nota).
  - Apenas um aluno expandido por vez. Card aberto com `border-primary/40 shadow-md`.
  - Mini-tabela de notas (avaliação + peso no header + campo de **data de aplicação** por avaliação),
    inputs numéricos estilizados (cinza vazio, branco com borda preenchido, focus ring),
    coluna Média calculada automaticamente (fonte grande, cor semântica).
  - Mini-sumário: `2/3 notas lançadas · 1 pendente` / `Todas as notas lançadas`.
- **Cálculo instantâneo**: média recalculada a cada digitação no cliente (badge + tabela, sem re-render total).

### 6. Auto-save com debounce
- Salvamento automático com debounce de **800ms** por célula.
- Indicador no rodapé do card: `Salvando...` (spinner) → `Auto-salvo às HH:MM` (check verde, expira em 4s).
- Badge de média, status do aluno e overview bar atualizam após o save.
- Link sutil **"Limpar notas"** no rodapé para resetar as notas do aluno no bimestre ativo.

### 7. Recuperações
- Visível apenas se o método habilitar recuperação (`permite_recuperacao`).
- **Por Avaliação** (`tipo='avaliacao'`): tabela por aluno com nota original (somente leitura) + input Rec
  por avaliação do bimestre ativo. A nota recuperada substitui a original no cálculo da média.
- **Por Bimestre** (`tipo='periodo'`): tabela por aluno com média do bimestre + input Rec.
  Efetiva: `max(média, rec)` se `recuperacao_periodo_substitutiva`, senão `rec`.
- **Final** (`tipo='final'`): tabela por aluno com Média Anual + input Rec Final para alunos elegíveis
  (média anual `<` média mínima), Média Final e Situação.
- Auto-save com debounce (600ms) + recálculo automático.

## Regras de dados

- `getNumericoConfigCompleta(metodoId)` expõe a config completa do método
  (inclui `media_minima`, `pesos_periodos`, `permite_recuperacao[]`, `tipo_media_periodo`, `avaliacoes_list`).
- `listarNotasTurmaDisciplina` retorna as notas de todos os bimestres da disciplina.
- `limparNotasAluno` remove as notas do aluno+bimestre+disciplina.
- `salvarRecuperacao` ganha parâmetro `descricao` (para `tipo='avaliacao'`).
- Migration `patch_recuperacoes_descricao.sql`: `academico_recuperacoes.descricao VARCHAR(100)`.
- Engine `calcularDesempenhoAluno`:
  - Recuperação por avaliação substitui a nota original da avaliação (mesma `descricao`).
  - Recuperação por período sempre aplica: `max` se substitutiva, senão substitui.

## Fora de escopo

- Recuperação no Registro (permanece apenas nas abas de Recuperação).
- Virtualização da lista de alunos.
