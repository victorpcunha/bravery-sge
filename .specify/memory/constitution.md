# Bravery SGE Constitution

## Core Principles

### I. Server Actions First

Toda lógica de negócio, leitura ou escrita de dados deve ser implementada através de Server Actions.

* Server Actions (`'use server'`) são o padrão oficial para comunicação com o servidor
* API Routes não devem ser utilizadas para lógica de negócio
* Toda action deve residir em `src/lib/actions/[feature].ts`
* Validação client-side é opcional e complementar
* Validação server-side é obrigatória e autoritativa
* Formulários utilizam react-hook-form + zod v4

---

### II. Security First

Toda ação que acessa ou modifica dados deve validar contexto de segurança antes da execução.

Obrigatório validar:

* Usuário autenticado
* Escola ativa
* Permissão necessária
* Escopo da escola

Proibido:

* Confiar em permissões enviadas pelo frontend
* Executar operações críticas sem autorização explícita
* Expor mensagens que revelem informações de autenticação

Toda autorização é validada server-side.

---

### III. Multi-Tenant by Design

Toda feature nova deve ser compatível com múltiplas escolas.

Obrigatório:

* Respeitar o contexto de `schoolId`
* Filtrar dados por escola quando aplicável
* Manter isolamento entre escolas

Proibido:

* Hardcode de escola
* Consultas globais sem justificativa
* Assumir que existe apenas uma escola

Toda decisão arquitetural deve considerar expansão para multi-escola.

---

### IV. Design Tokens over Hardcoded Styles

Toda interface utiliza exclusivamente Design Tokens definidos pelo sistema.

Obrigatório:

* `bg-background`
* `bg-card`
* `bg-muted`
* `text-foreground`
* `text-muted-foreground`
* `border-border`

Proibido:

* `bg-white`
* `text-gray-*`
* `border-slate-*`
* Hexadecimais hardcoded
* RGB hardcoded

Exceções:

* Color Pickers
* SVGs externos
* Data URIs
* Bibliotecas de terceiros

Gradientes utilizam tokens oficiais.

---

### V. Dark Mode Compatibility

Todo componente deve funcionar corretamente em Light Mode e Dark Mode.

Obrigatório:

* Utilizar tokens CSS
* Respeitar variáveis definidas em `globals.css`
* Testar contraste e legibilidade

Proibido:

* Cores fixas incompatíveis com Dark Mode

---

### VI. shadcn/ui as UI Standard

Componentes de interface devem utilizar exclusivamente a biblioteca shadcn/ui.

Obrigatório:

* Input
* Select
* Textarea
* Dialog
* Dropdown
* Tooltip
* Button
* Table
* Badge

Proibido:

* Componentes nativos estilizados manualmente sem justificativa

Componentes base permanecem em:

`src/components/ui/`

---

### VII. Database Through Migrations

O banco de dados é definido exclusivamente através de migrations.

Obrigatório:

* Toda alteração estrutural gera nova migration
* Migrations ficam em `supabase-migrations/`
* Schema nunca é alterado manualmente em produção

Convenções:

* `nome`
* `nome_completo`
* `status`

Proibido:

* `name`
* `full_name`
* `ativo` para entidades que possuem múltiplos estados

---

### VIII. Auditability First

Operações críticas devem gerar rastreabilidade.

Devem ser auditáveis:

* Criação
* Edição
* Exclusão
* Alteração de status
* Alterações acadêmicas
* Alterações financeiras
* Alterações de permissões

Toda auditoria deve registrar:

* Usuário
* Escola
* Data/Hora
* Operação
* Entidade afetada

---

### IX. Feature-Based Architecture

A aplicação é organizada por domínio de negócio.

Estrutura:

* Actions → `src/lib/actions/[feature].ts`
* Components → `src/components/[feature]/`
* Pages → `src/app/(app)/(auth)/`
* Hooks → `src/hooks/`
* UI → `src/components/ui/`
* Data → `src/data/`

Proibido:

* Misturar features
* Criar estruturas paralelas sem aprovação

---

### X. No New Patterns Without Approval

Agentes e desenvolvedores não podem introduzir novos padrões arquiteturais sem aprovação documentada.

Inclui:

* Novas bibliotecas de estado
* Novas bibliotecas de UI
* Novos padrões de autenticação
* Novos padrões de persistência
* Novas estruturas de diretórios

Mudanças devem ser justificadas em:

* Spec
* Plan

e aprovadas antes da implementação.

---

### XI. Design System First

Toda interface do sistema deve ser construída utilizando componentes oficiais do Design System e os Design Tokens definidos pelo projeto.

O Design System é a fonte de verdade para layouts, componentes compartilhados, padrões visuais, estados de interface e regras de composição. Toda implementação nova deve priorizar reutilização antes da criação de novos componentes.

Obrigatório:

* Utilizar componentes oficiais sempre que houver um componente adequado para o caso de uso.
* Utilizar exclusivamente os Design Tokens definidos pelo sistema.
* Garantir compatibilidade com Light Mode e Dark Mode.
* Documentar novos componentes oficiais no catálogo do Design System.
* Manter consistência visual entre todos os módulos do sistema.
* Seguir os layouts oficiais definidos para Listagem, Cadastro, Edição, Visualização e Dashboard.
* Utilizar componentes compostos para padrões recorrentes de interface.

Quando um mesmo padrão visual, estrutural ou comportamental aparecer em três ou mais locais distintos do sistema, sua promoção para componente oficial compartilhado deve ser avaliada.

Todo componente oficial deve:

* Ser reutilizável.
* Possuir API consistente e previsível.
* Utilizar componentes base do shadcn/ui quando aplicável.
* Utilizar Design Tokens oficiais.
* Funcionar corretamente em todos os breakpoints suportados.
* Funcionar corretamente em Light Mode e Dark Mode.
* Possuir documentação no catálogo oficial do Design System.

Proibido:

* Criar implementações locais quando existir um componente oficial equivalente.
* Duplicar componentes compartilhados com pequenas variações visuais.
* Introduzir estilos que contrariem os Design Tokens oficiais.
* Criar padrões visuais isolados para módulos específicos sem justificativa documentada.
* Utilizar componentes não documentados como padrão para novas implementações.

O catálogo oficial do Design System é a referência canônica para componentes compartilhados, padrões visuais, layouts, exemplos de composição e anti-padrões do sistema.

---

## Additional Constraints

### Supabase & Authentication

* Login suporta CPF ou email
* Mensagem de erro genérica:
  "Usuário ou senha inválidos"
* Auth users criados via `supabase.auth.admin.createUser()`
* Relação escola/usuário via `user_schools`
* Permissões seguem padrão:

`modulo.recurso`

Exemplo:

`gestao-usuarios.painel-aluno`

---

### Tables

Primeira coluna fixa:

```css
sticky left-0 bg-background z-10
```

Header correspondente:

```css
sticky left-0 bg-muted z-10
```

Container:

```css
overflow-x-auto
```

---

### Sidebar

Tokens obrigatórios:

* bg-sidebar
* text-sidebar-foreground
* bg-sidebar-accent
* bg-sidebar-primary

---

### Typography

Fonte oficial:

Plus Jakarta Sans

Pesos:

* 400
* 500
* 600
* 700

---

### Charts

Biblioteca oficial:

Recharts

Integração preferencial:

shadcn/ui charts

---

### Query Conventions

Consultas de disciplinas seguem:

```ts
.select(`
matriz_disciplina_id,
academico_matriz_disciplinas(
  disciplina_id,
  academico_disciplinas(nome)
)
`)
```

Utilizar:

`nome`

Nunca:

`name`

---

## Development Workflow

### Spec-Driven Development

Fluxo obrigatório:

```text
specify
→ clarify
→ plan
→ tasks
→ implement
→ analyze
```

---

### Spec Structure

Cada feature deve possuir:

```text
specs/
└── [numero]-[feature]/
    ├── spec.md
    ├── plan.md
    └── tasks.md
```

---

### Review Gates

Nenhuma implementação inicia sem:

* Spec aprovada
* Plan aprovado
* Tasks geradas

---

### Complexity Management

Complexidade fora dos padrões definidos deve ser justificada na documentação.

---

### Context Memory

Memória operacional deve ser mantida em:

`AGENTS.md`

---

## Governance

Esta constituição possui autoridade superior sobre convenções implícitas do projeto.

Emendas exigem:

* Documentação da mudança
* Aprovação explícita
* Plano de migração

Mudanças arquiteturais relevantes exigem atualização de:

* constitution.md
* AGENTS.md
* specs impactadas

Versionamento:

* MAJOR → mudanças incompatíveis
* MINOR → novos princípios ou regras
* PATCH → esclarecimentos e correções

Todo Pull Request deve verificar conformidade com esta constituição antes de merge.
