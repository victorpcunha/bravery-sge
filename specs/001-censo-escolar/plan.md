# Implementation Plan: Censo Escolar – Matrícula Inicial 2026

**Branch**: `001-censo-escolar` | **Date**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-censo-escolar/spec.md`

## Summary

Criar o módulo de Censo Escolar no Bravery SGE como uma **camada de validação e exportação** sobre os dados já existentes. O módulo lê dados das tabelas operacionais (escolas, turmas, pessoas, matrículas), valida contra as regras do INEP, exibe inconsistências em abas por registro, e redireciona o profissional para as telas de gestão existentes para correção. Após todos os erros sanados, gera o arquivo .txt no formato EducaCenso.

**Mudança de paradigma**: O módulo NÃO é um novo sistema de cadastro. É um validador inteligente que aponta o que está errado e leva o profissional até o local exato para corrigir.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.4 (App Router)
**Primary Dependencies**: Supabase JS, shadcn/ui v4, Tailwind CSS v4, react-hook-form + zod v4, date-fns
**Storage**: PostgreSQL (Supabase)
**Testing**: Nenhum framework instalado
**Target Platform**: Web (Next.js App Router, Server Actions)
**Project Type**: Web application — feature de validação/exportação (não CRUD)
**Performance Goals**: Validação de até 1500 turmas e seus vínculos em tempo aceitável (<10s)
**Constraints**: Server Actions obrigatórios (principle I), Design Tokens (principle II), shadcn/ui (principle III), Migrations (principle IV)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| I. Server Actions First | ✅ | Ações de validação e exportação em `src/lib/actions/censo.ts` |
| II. Design Tokens sobre Hardcode | ✅ | Tela usa tokens `bg-card`, `text-foreground`, `border-border`, `text-success`, `text-destructive` |
| III. Componentes shadcn/ui | ✅ | Tabs, Badge, Button, Tooltip do shadcn/ui |
| IV. Migrations como Fonte de Verdade | ✅ | Migration adiciona campos INEP às tabelas operacionais existentes |
| V. Dark Mode Compatibility | ✅ | Tokens CSS garantem light/dark |
| VI. Separação por Feature | ✅ | `src/lib/actions/censo.ts`, `src/components/censo/`, `src/app/(app)/(auth)/censo-escolar/` |

**Gate: PASS** — Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/001-censo-escolar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── checklists/
```

### Source Code (repository root)

```text
src/
├── app/(app)/(auth)/censo-escolar/
│   └── page.tsx                        # Tela única: filtros + abas de validação + exportação
├── components/censo/
│   ├── validacao-aba.tsx               # Componente de aba de validação (recebe registro, erros)
│   ├── validacao-erro-item.tsx         # Item de erro com link "Corrigir"
│   ├── validacao-resumo.tsx            # Resumo: total de erros por registro
│   ├── matriz-idades.ts                # Anexo 3 — idades permitidas
│   ├── matriz-recursos.ts              # Anexo 4 — recursos × deficiências
│   ├── matriz-contratacao.ts           # Anexo 5 — contratação × dependência
│   └── matriz-formas-org.ts            # Anexo 6 — etapas × forma organização
└── lib/actions/
    ├── censo.ts                        # validarCenso(), exportarCenso()
    └── censo-regras.ts                 # Funções de validação por registro (00 a 60)
```

## Complexity Tracking

Nenhuma violação.

## Redirecionamento: Campo INEP → Tela de Origem

| Registro | Campo/Tipo de Erro | Tela de Destino | Parâmetro |
|---|---|---|---|
| 00 | Dados cadastrais da escola | `/escolas/[id]` | `?tab=identificacao` |
| 00 | Endereço, CEP, município | `/escolas/[id]` | `?tab=endereco` |
| 00 | Dependência, mantenedora | `/escolas/[id]` | `?tab=administrativo` |
| 00 | Parcerias e convênios | `/escolas/[id]` | `?tab=parcerias` |
| 10 | Infraestrutura física | `/escolas/[id]` | `?tab=infraestrutura` |
| 20 | Dados da turma | `/gestao-turmas/turmas/[id]` | — |
| 20 | Sem profissional vinculado | `/gestao-turmas/quadro-aulas/` | `?turma=[id]` |
| 30 | Pessoa (aluno/profissional/gestor) | `/gestao-usuarios/usuarios/[id]` | `?tab=[secao]` |
| 40 | Gestor (vínculo) | `/escolas/[id]` | `?tab=gestores` |
| 50 | Profissional × turma | `/gestao-turmas/quadro-aulas/` | `?turma=[id]` |
| 60 | Matrícula | `/gestao-academica/matriculas/` | `?turma=[id]` |

## Campos INEP a Adicionar nas Tabelas Operacionais

### `schools` (Registros 00 e 10)
Adicionar ~200 campos: endereço completo (cep, municipio, distrito, endereco, numero, complemento, bairro, ddd), datas ano letivo, órgãos vinculados, mantenedoras, parcerias e convênios, CNPJs, infraestrutura completa (dependências físicas, acessibilidade, equipamentos, internet, materiais pedagógicos, profissionais, gestão escolar).

### `people` (Registro 30)
Adicionar ~20 campos: deficiências detalhadas, transtornos de aprendizagem, recursos de acessibilidade, certidão de nascimento, povo indígena, formação continuada, email.

### `turmas` (Registro 20)
Adicionar/corrigir ~10 campos: áreas do conhecimento INEP, itinerário formativo, turma multi, eixo de qualificação.

### `academico_matriculas` (Registro 60)
Adicionar ~15 campos: AEE (11 tipos), transporte escolar (responsável + 10 veículos), turma multi, carga horária IFTP.

## Validações a Implementar por Registro

### Registro 00 (~20 validações)
Formatos: CEP 8 dígitos, CNPJ válido, datas no intervalo permitido, email regex INEP. Condicionais: mantenedoras × dependência, parcerias × dependência (Anexo 5), datas × situação. Restrições de perfil: código órgão regional.

### Registro 10 (~15 validações)
Regras de grupo "pelo menos um" (13 grupos), "nenhum dos listados" não conflitante, quantidades de salas não excedem total, alimentação escolar × turma presencial.

### Registro 20 (~10 validações)
Horários: formato hh:mm-hh:mm, minutos múltiplos de 5, inicial < final. Etapa × forma organização (Anexo 6). Áreas compatíveis com etapa. Local diferenciado × infraestrutura (Registro 10).

### Registro 30 (~20 validações)
CPF: obrigatoriedade condicional, formato, status RF. Nome: ≥2 palavras, ≤4 chars repetidos. Idade × vínculo (Anexo 3). Deficiências: 10 regras de incompatibilidade. Recursos × deficiências (Anexo 4, 126 combinações). Formação acadêmica × vínculo profissional.

### Registros 40/50/60 (~15 validações)
Gestor: máx 3, critério acesso × dependência. Profissional: função × tipo mediação (7 regras), áreas subset da turma, sequencialidade. Aluno: idade × etapa (35+ combinações), turma multi × etapa (6 mapeamentos), AEE × tipo turma, transporte condicional.
