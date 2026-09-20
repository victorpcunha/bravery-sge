# Quickstart: Importação Inicial de Usuários

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Modelos**: [contracts/csv-modelos.md](./contracts/csv-modelos.md)

Pré-requisitos: app rodando (`npx next dev -p 3001`), migration `patch_recursos_importacao.sql` aplicada (SQL Editor), perfil com `importacao-exportacao.importacao-inicial` (visualizar + criar), 1 escola cadastrada, nenhum aluno nela.

## 1. Navegação do módulo (US-4)

1. Abra o sidebar → **Importação e Exportação** → veja o submenu **Censo Escolar** + **Importação Inicial**.
2. Entre no Censo, execute uma validação qualquer → comportamento idêntico ao anterior (SC-005).

## 2. Baixar modelo + importar alunos (US-1, US-3)

1. Em **Importação Inicial**: selecione a escola (usuário comum: fixa na própria) → tipo **Alunos** → **Baixar modelo** → confira as 7 colunas na ordem de `csv-modelos.md`.
2. Preencha 3 linhas: (a) válida com CPF; (b) sem CPF mas com certidão e sem filiações; (c) sem CPF e sem certidão.
3. Envie → **Validar**: esperado `totalRecebidas 3`, (a)(b) válidas, (c) rejeitada ("informe CPF ou matrícula da certidão").
4. **Confirmar** → toast + resumo `criadas 2, rejeitadas 1`; na tela de Usuários as 2 existem na escola; (b) tem filiações = "Não declarado" (SC-003/SC-004).
5. Reenvie o mesmo arquivo e confirme → `criadas 0` (duplicidades rejeitadas, nada duplicado — idempotência).

## 3. Importar profissionais (US-2)

1. Tipo **Profissionais** → **Baixar modelo** (`modelo-profissionais.csv`, 5 colunas) → preencha 2 linhas: (a) válida; (b) sem e-mail.
2. Envie → Validar → (b) rejeitada ("e-mail é obrigatório"); Confirmar → 1 profissional criado **sem vínculo** (completar regime/função depois na tela de Usuários).
3. Confira: nenhum `auth.users`/`user_schools` criado (login continua opt-in na tela de Usuários).

## 4. Erros e limites (edge cases)

- Arquivo só com cabeçalho → rejeitado ("preencha ao menos uma linha").
- Cabeçalho fora de ordem → lote rejeitado mostrando o cabeçalho esperado.
- CPF repetido no arquivo / já ativo na escola → rejeitado como duplicidade (cadastro existente intacto).
- CPF de outra escola no banco → **não** é duplicidade (escopo por escola).
- Data futura, e-mail inválido, situação "Afastado" → rejeitados com orientação.
- `/auditoria`: 1 registro por lote confirmado (ator, escola, tipo, quantidades).
- Usuário sem permissão / escola fora de escopo → negado sem vazar dados (SC-006).

## 5. Gates técnicos

`npx tsc --noEmit` limpo + `npx next build` verde (padrão do repo). Limite: 1.000 linhas/arquivo (SC-001: 300 alunos em ≤10 min).
