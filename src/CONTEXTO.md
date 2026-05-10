Documento de Contexto para Desenvolvimento (Versão 1.0)
1. Visão Geral do Projeto

O Bravery - SGE não é apenas um software de gestão escolar comum; ele é uma solução SaaS (Software as a Service) Multi-tenant de alta conformidade, projetada para escolas particulares brasileiras.

O coração do sistema é a Conformidade Total com o Censo Escolar (INEP). O sistema deve permitir a gestão pedagógica e administrativa diária e, ao mesmo tempo, garantir que 100% dos dados estejam aptos para a exportação anual do arquivo .txt exigido pelo governo, seguindo o layout de 2026.
2. O Desafio Técnico do Censo Escolar (INEP)

O sistema deve gerenciar mais de 300 campos específicos e validar mais de 500 regras de negócio baseadas nos manuais do INEP.

    Registros Mapeados (Layout v3 - 2026):
        - Registro 00 (Identificação): 53 campos
        - Registro 10 (Infraestrutura): 187 campos
        - Registro 20 (Turmas): 66 campos
        - Registro 30 (Pessoas/Identidade): 110 campos
        - Registro 40 (Gestor): 7 campos
        - Registro 50 (Vínculo Docente): 38 campos
        - Registro 60 (Matrícula do Aluno): 33 campos

    Regras de Exportação (Saída): O motor de exportação deve gerar arquivos em codificação ISO-8859-1, com todos os textos convertidos para LETRAS MAIÚSCULAS, sem acentos e sem caracteres especiais.

    Regras de Integridade (Entrada): Validações em tempo real para evitar "Descaracterização de Pessoa Física" (impedir alteração simultânea de Nome, Data de Nascimento e Filiação) e travas de cronologia (Datas de ano letivo, idades compatíveis com etapas).

3. Arquitetura de Software e Negócio

    Modelo de Dados: Multi-escola. Cada Instituição pode ter várias Unidades Escolares. O isolamento de dados é garantido no nível do banco de dados (Row Level Security - RLS).

    Segurança (RBAC Dinâmico): O sistema possui um motor de permissões flexível. O Administrador cria perfis (ex: Professor, Coordenador) e atribui permissões granulares (Visualizar, Criar, Editar, Excluir) por recurso. Um usuário pode acumular múltiplos perfis.

    Arquitetura Técnica:

        Frontend: Next.js 15+ (App Router), TypeScript.

        Estilização: Tailwind CSS.

        Interface (UI): Shadcn/UI (Estilo Vega/New York), Lucide-React (Ícones), Sonner (Notificações).

        Backend & Banco de Dados: Supabase (PostgreSQL), utilizando autenticação nativa e RLS.

        Formulários: React Hook Form + Zod (Validação de Schemas).

        Datas: Date-fns.

4. Estrutura Modular Organizada

O sistema está dividido nos seguintes módulos estratégicos:

    Módulo BNCC: Gestão de Objetivos de Aprendizagem, Unidades Temáticas e Habilidades (Base para o pedagógico).

    Módulo de Gestão Acadêmica: Calendários Escolares (com controle de dias letivos/recessos), Estrutura Acadêmica e Métodos de Avaliação.

    Módulo de Gestão Pedagógica: Diário de Classe Integrado (Frequência e Avaliações na mesma tela), Disciplinas, Campos de Experiência e Indicadores.
        - Tela: Alunos Matriculados (Registro 60)

    Módulo de Gestão de Usuários: Cadastro Único de Pessoas com papéis dinâmicos (Gestor, Profissional, Aluno, Responsável).
        - Tela: Cadastro de Pessoas (Registro 30)
        - Tela: Gestores (Registro 40)

    Módulo de Gestão de Turmas: Quadro de Horários e Configuração de Turmas (Regular, AEE, Atividade Complementar).
        - Tela: Gestão de Turmas (Registro 20)
        - Tela: Quadro de Horários (Registro 20)
        - Tela: Vinculação de Professores (Registro 50) - Professores vinculados diretamente nas turmas com disciplinas definidas

    Módulo de Configurações Gerais: Dados Oficiais da Unidade Escolar (Identificação, Infraestrutura e Direção).
        - Tela: Gestão da Unidade Escolar (Abas: Identificação, Infraestrutura, Gestão) - Registros 00 e 10

    Módulo do Census Escolar: Validação e Exportação de dados para o INEP.
        - Tela: Census Escolar (Validar Dados → Listar Erros por Categoria → Gerar Arquivo .txt)

5. Ferramental Instalado e Configurado

A "fábrica" de código na máquina local/cloud está pronta com:

    Ambiente: Node.js, Git, GitHub, Antigravity (Google IDX).

    Shadcn/UI inicializado: Estilo Vega, Cor Slate.

    Componentes instalados: accordion, alert, alert-dialog, avatar, badge, button, calendar, card, checkbox, command, dialog, dropdown-menu, form, hover-card, input, label, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast (sonner), tooltip.

    Conexão de Dados: @supabase/supabase-js e @supabase/ssr. Arquivo .env.local configurado com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.

6. Diretrizes de Desenvolvimento para a IA

    Componentização: Dividir telas grandes em componentes menores dentro da pasta da página.

    Lógica Reativa: Campos devem aparecer ou sumir baseados em "Gatilhos" (Ex: Se Escola é Privada, oculta campos de convênio público).

    Sanitização Automática: Implementar funções que garantam que strings sejam salvas no banco conforme a exigência do Censo (Maiúsculas e sem acentos).

    Segurança de Registro: Implementar Soft Delete em todas as tabelas críticas. Nunca apagar fisicamente um aluno ou escola.

7. Versionamento do Censo (Evolução Anual)

    Regra de Ouro: Os layouts do INEP mudam anualmente (campos são adicionados ou removidos). A arquitetura não deve ser "engessada".

    Requisito: A IA deve priorizar a criação de códigos limpos e modulares, onde a lógica de validação de 2026 possa ser facilmente estendida ou duplicada para 2027 sem precisar reescrever o sistema inteiro.

8. Interconectividade entre Registros (Inteligência Cruzada)

O sistema não é uma coleção de formulários isolados. Ele é um ecossistema:

    Dependência Física: O que for marcado no Registro 10 (Infraestrutura) deve limitar as opções no Registro 20 (Turmas). (Ex: Se a escola não marcou que tem "Laboratório de Ciências" na infraestrutura, o sistema não deve permitir criar uma turma nesse local).

    Dependência Acadêmica: A Etapa de Ensino (Reg 20) deve filtrar automaticamente os componentes da BNCC e a idade permitida para a Matrícula (Reg 60).

9. UX para Grandes Volumes: O "Termômetro de Conformidade"

    O Desafio: Preencher 182 campos de infraestrutura de uma vez é exaustivo.

    A Solução Técnica: A IA deve prever um estado de "Rascunho". O sistema deve mostrar visualmente (um termômetro ou porcentagem) o quanto cada registro está "Pronto para o Censo". Isso permite que o usuário salve o que tem e termine depois, sem perder o progresso.

10. Trilha de Auditoria e LGPD (Audit Log)

    Rastreabilidade: Como lidamos com notas e dados sensíveis de menores, toda alteração em campos críticos deve disparar um log silencioso no banco de dados contendo: Quem alterou, Quando, Valor Anterior e Valor Novo.

    Privacidade: Dados de saúde (Registro 30) devem ser tratados com criptografia ou máscaras de acesso, visíveis apenas para perfis autorizados (Coordenador/Diretor).

11. Padronização de Máscaras e Entradas (Data UX)

    Regra Técnica: A IA deve implementar máscaras de entrada em todos os campos sensíveis (CPF, CNPJ, CEP, Telefone, Datas).

    Justificativa de Negócio: Não podemos permitir que o usuário digite um CPF com 10 ou 12 dígitos. O sistema deve "forçar" o formato correto 000.000.000-00 enquanto ele digita. Isso reduz em 90% a necessidade de suporte técnico por erro de preenchimento.

12. O "Motor de Pré-Validação" (Pre-flight Check)

    Requisito de Software: O sistema deve ter uma tela dedicateda do Census Escolar com:
        - Botão "Validar Dados": Varre todas as tabelas em busca de campos vazios ou regras violadas
        - Lista de Erros: Erros separados por categoria (Escola, Turmas, Pessoas, Matrículas, etc.)
        - Navegação: Cada erro deve ser clicável e levar o usuário direto ao campo que precisa ser corrigido
        - Botão "Gerar Arquivo": Disponível apenas após correção dos erros, gera o arquivo .txt para exportação

    Regras de Validação Incluem:
        - Limite de 100 escolas por arquivo
        - Máximo 1.500 turmas por escola
        - Turmas com alunos e profissionais vinculados
        - Validação de descaracterização de pessoa física
        - Verificação de sequência correta dos registros
        - Campos obrigatórios preenchidos

13. Performance e Responsividade (Acessibilidade Técnica)

    Hardware Alvo: O sistema deve ser leve. Muitas escolas usam computadores antigos ou tablets simples.

    Requisito: A IA deve evitar o uso de animações pesadas e priorizar o carregamento assíncrono (carregar os dados aos poucos) para que a tela não "congele" ao abrir uma lista com 500 alunos.

14. Feedback ao Usuário (UX de Erros e Sucessos)

    Regra de Ouro: O sistema nunca deve dar um erro genérico como "Erro ao salvar".

    Requisito: A IA deve implementar mensagens claras usando o componente Sonner.

        Exemplo: Em vez de "Erro no campo", use "O Código INEP deve ter exatamente 8 dígitos".

    Estado de Carregamento: Toda vez que o sistema estiver salvando ou buscando dados no Supabase, os botões devem mostrar um estado de "Carregando" (spinner) para o usuário não clicar duas vezes.

15. Integridade Referencial (A Fonte Única da Verdade)

    Arquitetura: A IA deve entender que o Registro 30 (Pessoas) é o centro de tudo.

    Regra: Um Diretor (40), um Professor (50) ou um Aluno (60) não podem existir "soltos". Eles devem ser sempre um vínculo criado a partir de uma pessoa já existente na base. Isso evita que os dados da mesma pessoa fiquem desatualizados em lugares diferentes.

16. Código Sustentável (Clean Code para IA)

    Manutenibilidade: A IA deve escrever comentários em português no topo de cada função complexa, explicando qual Regra do INEP aquele código está validando.

    Tipagem Forte: Como estamos usando TypeScript, a IA não deve usar o tipo any. Ela deve definir exatamente o que é cada dado (Ex: type Aluno = { nome: string, inep: number ... }). Isso evita que o sistema "quebre" silenciosamente.