# Feature Specification: Auditoria Censo × v4 + Correções (038)

**Feature Branch**: `038-auditoria-censo-v4`

**Created**: 2026-09-17

**Status**: Draft

**Input**: User description: "Analisar se todas as regras e validações do Censo estão de acordo com a planilha v4, tabelas auxiliares e anexos. Entregar relatório + spec + correção."

## Método da auditoria

Quatro levantamentos paralelos (somente leitura): regras do código (`censo-regras.ts` 00/10/20 e 30/40/50/60/cross) × regras da v4 (`Layout ... v4.xlsx`, abas 00/10/20/30/40/50/60 com momento Validação, Regras Gerais, Anexos 4–7). Diff classificado abaixo. Verificado OK (sem ação): ordem e contagem dos 7 builders, chaves pessoa/turma, R40 completo, Anexo 4 (reescrito na 020–030), cursos/IES/ano, DDD/telefone base, grupos do 10, incompatíveis a–j (menos c/j), CPF, múltipla, CNPJ, mediação, áreas derivadas.

## Achados 🔴 Alta

- **H1** Transporte responsável invertido (60.c23): v4 `1 ou 2`, código exige `2 ou 3`.
- **H2** Profissional+aluno mesma turma nunca executa (filtro em relação sem join).
- **H3** Turma multi (60.c8): etapa 56 diverge (`1,2,14–21,41` na v4), etapa 72 só `69,70`, etapa 64 (`39,40`) sem regra, regras de EM/EJA do código sem base na v4.
- **H4** Função 9 (50.c7.r6): falta lista de etapas `39,40,73,74,64,67,68`.
- **H5** Função 4 (50.c7.r8): falta exigir aluno/profissional com surdez/def. auditiva/surdocegueira na turma.
- **H6** Docente obrigatório (20.c24.n6): vale 1 ou 5 quando etapa≠1 (código aceita qualquer profissional).
- **H7** Leciona over-strict (50.r2): exigir 34–37 só quando Código 1 de área é nulo.
- **H8** Tetos de vínculo (regras 33–35): tipo 9 fora do teto AEE; IFTP só conta se exclusivo.
- **H9** Reverificação posição a posição dos builders 20/30/50/60 contra os dumps completos v4.

## Achados 🟡 Média (regras v4 sem checagem)

- **R20**: forma obrigatória fora do EI; FGB/IFA/IFTP, itinerário, tipo-curso e cód-curso nulos fora de contexto; etapa×agregada (n=3); EM 25–29/35–38; eixo/cód-curso/carga por etapa (Tabela de Cursos EP); áreas nulas no EI + área×etapa (Tabela de Regras de Áreas); c21 (sem coluna — só documentar/em branco); duplicadas em 20 (regra 25); horas ≤23; atividades na tabela oficial.
- **R30**: CPF/INEP exclusivos + formato do INEP; nome sempre obrigatório; data válida ≤ dia do Censo; filiação 0/1 + nomes; sexo/cor/povo/país/município-nasc; flags 17/29 e grupos 18–28/30–35/36–49; nulos-quando-não-aplica (18–49); certidão; residência 51–55; tipo médio; áreas 67–69; pós 70–88; formação 89–109 + Nenhum exclusivo; combinações c/j.
- **R10**: grupos cotas/ambiental; rede_local n=2/n=3; alimentação exige turma presencial; compartilha 8 dígitos + sem duplicar; domínios; PPP; línguas indígenas.
- **R00**: nulos-quando-não-ativo; categoria privada; sede ≠ atual; comprimentos.
- **R50/R60**: nulos-quando-não-aplica; transporte=1 sozinho; carga IFTP por etapa.
- **Dados**: diffs Anexo 3×idades, Anexo 5×contratação, Anexo 6×formas, Anexo 7×mediação, mapa etapa×agregada, DDD; tabelas novas conforme necessidade (Povos, Países, Cursos EP, Áreas, Pós).

## Decisões do usuário (pendentes)

- **D1**: Células vazias do Anexo 4 valem veto (só X permite) ou só N veta?
- **D2**: E-mail nulo para aluno sem vínculo 40 (v4 literal) — aplicar?

## Fora de escopo

- Situação Final (não auditada; spec própria futura).
- Regras com momento Processamento (não bloqueiam exportação).
