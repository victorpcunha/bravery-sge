'use client'

import type { ComponentType } from 'react'
import { useSearchParams } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CalendarDays,
  FileText,
  Shield,
  UserCheck,
  Search,
  BookMarked,
  ClipboardList,
  Building2,
  DoorOpen,
  BarChart3,
  HeartHandshake,
  Puzzle,
  Target,
  Lightbulb,
  Boxes,
  FolderTree,
  Layers,
  Sparkles,
  Briefcase,
  ScrollText,
} from 'lucide-react'
import type { TabParams } from '@/lib/tab-params'

import DashboardPage from '@/app/(app)/(auth)/page'
import EscolasListaPage from '@/app/(app)/escolas/page'
import EscolaNovoPage from '@/app/(app)/escolas/novo/page'
import EscolaDetalhePage from '@/app/(app)/escolas/[id]/page'
import UsuariosPage from '@/app/(app)/gestao-usuarios/usuarios/page'
import FuncoesPage from '@/app/(app)/gestao-usuarios/funcoes/page'
import PerfisListaPage from '@/app/(app)/gestao-usuarios/perfis/page'
import PerfilCadastroPage from '@/app/(app)/gestao-usuarios/perfis/[id]/page'
import PainelAlunoPage from '@/app/(app)/gestao-usuarios/painel-aluno/page'
import TurmasPage from '@/app/(app)/gestao-turmas/turmas/page'
import QuadroAulasPage from '@/app/(app)/gestao-turmas/quadro-aulas/page'
import QuadroAulaCadastroPage from '@/app/(app)/gestao-turmas/quadro-aulas/cadastro/page'
import EstruturaAcademicaPage from '@/app/(app)/gestao-academica/estrutura-academica/page'
import MetodosPage from '@/app/(app)/gestao-academica/metodos/page'
import MatriculasPage from '@/app/(app)/gestao-academica/matriculas/page'
import MatriculaCadastroContent from '@/app/(app)/gestao-academica/matriculas/cadastro/content'
import IndicadoresPage from '@/app/(app)/gestao-pedagogica/indicadores/page'
import DisciplinasPage from '@/app/(app)/gestao-pedagogica/disciplinas/page'
import DiarioClassePage from '@/app/(app)/gestao-pedagogica/diario-classe/page'
import TurmaDiarioPage from '@/app/(app)/gestao-pedagogica/diario-classe/[turmaId]/page'
import FechamentoPage from '@/app/(app)/gestao-pedagogica/diario-classe/[turmaId]/fechamento/page'
import PlanoEnsinoPage from '@/app/(app)/gestao-pedagogica/plano-ensino/page'
import CriarPlanoEnsinoPage from '@/app/(app)/gestao-pedagogica/plano-ensino/criar/page'
import PlanoEnsinoDetalhePage from '@/app/(app)/gestao-pedagogica/plano-ensino/[id]/page'
import ConselhoClassePage from '@/app/(app)/gestao-pedagogica/conselho-classe/page'
import BnccConsultaPage from '@/app/(app)/bncc/consulta/page'
import BnccDireitosPage from '@/app/(app)/bncc/direitos-aprendizagem/page'
import BnccCamposPage from '@/app/(app)/bncc/campos-experiencia/page'
import BnccObjetivosPage from '@/app/(app)/bncc/objetivos/page'
import BnccHabilidadesPage from '@/app/(app)/bncc/habilidades/page'
import BnccObjetosPage from '@/app/(app)/bncc/objetos-conhecimento/page'
import BnccUnidadesPage from '@/app/(app)/bncc/unidades-tematicas/page'
import BnccAreasPage from '@/app/(app)/bncc/areas-conhecimento/page'
import BnccCompetenciasPage from '@/app/(app)/bncc/competencias-habilidades/page'
import CensoEscolarPage from '@/app/(app)/(auth)/censo-escolar/page'
import DocentesPage from '@/app/(app)/docentes/page'
import AuditoriaPage from '@/app/(app)/auditoria/page'

export const TAB_MODULES = {
  dashboard: 'dashboard',
  escolas: 'escolas',
  usuarios: 'usuarios',
  funcoes: 'funcoes',
  perfis: 'perfis',
  'painel-aluno': 'painel-aluno',
  turmas: 'turmas',
  'quadro-aulas': 'quadro-aulas',
  'estrutura-academica': 'estrutura-academica',
  metodos: 'metodos',
  matriculas: 'matriculas',
  indicadores: 'indicadores',
  disciplinas: 'disciplinas',
  'diario-classe': 'diario-classe',
  'plano-ensino': 'plano-ensino',
  'conselho-classe': 'conselho-classe',
  'bncc-consulta': 'bncc-consulta',
  'bncc-direitos': 'bncc-direitos',
  'bncc-campos': 'bncc-campos',
  'bncc-objetivos': 'bncc-objetivos',
  'bncc-habilidades': 'bncc-habilidades',
  'bncc-objetos': 'bncc-objetos',
  'bncc-unidades': 'bncc-unidades',
  'bncc-areas': 'bncc-areas',
  'bncc-competencias': 'bncc-competencias',
  'censo-escolar': 'censo-escolar',
  docentes: 'docentes',
  auditoria: 'auditoria',
} as const

export type TabModuleId = (typeof TAB_MODULES)[keyof typeof TAB_MODULES]

export const HOME_MODULE = TAB_MODULES.dashboard
export const MAX_TABS = 6

export type ModuleMeta = {
  title: string
  icon: LucideIcon
}

export const MODULES: Record<TabModuleId, ModuleMeta> = {
  [TAB_MODULES.dashboard]: { title: 'Dashboard', icon: LayoutDashboard },
  [TAB_MODULES.escolas]: { title: 'Unidade Escolar', icon: School },
  [TAB_MODULES.usuarios]: { title: 'Usuários', icon: Users },
  [TAB_MODULES.funcoes]: { title: 'Funções', icon: Building2 },
  [TAB_MODULES.perfis]: { title: 'Perfis e Permissões', icon: Shield },
  [TAB_MODULES['painel-aluno']]: { title: 'Painel do Aluno', icon: UserCheck },
  [TAB_MODULES.turmas]: { title: 'Turmas', icon: GraduationCap },
  [TAB_MODULES['quadro-aulas']]: { title: 'Quadro de Aulas', icon: CalendarDays },
  [TAB_MODULES['estrutura-academica']]: { title: 'Estrutura Acadêmica', icon: CalendarDays },
  [TAB_MODULES.metodos]: { title: 'Métodos de Avaliação', icon: ClipboardList },
  [TAB_MODULES.matriculas]: { title: 'Alunos Matriculados', icon: DoorOpen },
  [TAB_MODULES.indicadores]: { title: 'Indicadores de Avaliação', icon: BarChart3 },
  [TAB_MODULES.disciplinas]: { title: 'Disciplinas', icon: BookMarked },
  [TAB_MODULES['diario-classe']]: { title: 'Diário de Classe', icon: BookOpen },
  [TAB_MODULES['plano-ensino']]: { title: 'Plano de Ensino', icon: Calendar },
  [TAB_MODULES['conselho-classe']]: { title: 'Conselho de Classe', icon: Users },
  [TAB_MODULES['bncc-consulta']]: { title: 'Consulta da BNCC', icon: Search },
  [TAB_MODULES['bncc-direitos']]: { title: 'Direitos de Aprendizagem', icon: HeartHandshake },
  [TAB_MODULES['bncc-campos']]: { title: 'Campos de Experiência', icon: Puzzle },
  [TAB_MODULES['bncc-objetivos']]: { title: 'Objetivos de Aprendizagem', icon: Target },
  [TAB_MODULES['bncc-habilidades']]: { title: 'Habilidades', icon: Lightbulb },
  [TAB_MODULES['bncc-objetos']]: { title: 'Objetos de Conhecimento', icon: Boxes },
  [TAB_MODULES['bncc-unidades']]: { title: 'Unidades Temáticas', icon: FolderTree },
  [TAB_MODULES['bncc-areas']]: { title: 'Áreas do Conhecimento', icon: Layers },
  [TAB_MODULES['bncc-competencias']]: { title: 'Competências e Habilidades', icon: Sparkles },
  [TAB_MODULES['censo-escolar']]: { title: 'Censo Escolar', icon: FileText },
  [TAB_MODULES.docentes]: { title: 'Docentes', icon: Briefcase },
  [TAB_MODULES.auditoria]: { title: 'Auditoria', icon: ScrollText },
}

export type TabRoute = {
  module: TabModuleId
  match: (pathname: string) => TabParams | undefined
  Component: ComponentType
}

export type ResolvedTabRoute = {
  module: TabModuleId
  params: TabParams
  Component: ComponentType
}

/* MatriculaCadastroContent espera um prop `searchParams` com o id opcional. */
function MatriculaCadastroWrapper() {
  const sp = useSearchParams()
  const id = sp.get('id') ?? undefined
  return <MatriculaCadastroContent searchParams={{ id }} />
}

const exact =
  (path: string) =>
  (pathname: string): TabParams | undefined =>
    pathname === path ? {} : undefined

const ROUTES: TabRoute[] = [
  { module: TAB_MODULES.dashboard, match: exact('/'), Component: DashboardPage },

  // Escolas — estáticas antes da dinâmica
  { module: TAB_MODULES.escolas, match: exact('/escolas'), Component: EscolasListaPage },
  { module: TAB_MODULES.escolas, match: exact('/escolas/novo'), Component: EscolaNovoPage },
  {
    module: TAB_MODULES.escolas,
    match: (p) => {
      const m = p.match(/^\/escolas\/([^/]+)$/)
      return m ? { id: m[1] } : undefined
    },
    Component: EscolaDetalhePage,
  },

  // Gestão de Usuários
  { module: TAB_MODULES.usuarios, match: exact('/gestao-usuarios/usuarios'), Component: UsuariosPage },
  { module: TAB_MODULES.funcoes, match: exact('/gestao-usuarios/funcoes'), Component: FuncoesPage },
  {
    module: TAB_MODULES.perfis,
    match: (p) => {
      const m = p.match(/^\/gestao-usuarios\/perfis\/([^/]+)$/)
      return m ? { id: m[1] } : undefined
    },
    Component: PerfilCadastroPage,
  },
  { module: TAB_MODULES.perfis, match: exact('/gestao-usuarios/perfis'), Component: PerfisListaPage },
  { module: TAB_MODULES['painel-aluno'], match: exact('/gestao-usuarios/painel-aluno'), Component: PainelAlunoPage },

  // Gestão de Turmas
  { module: TAB_MODULES.turmas, match: exact('/gestao-turmas/turmas'), Component: TurmasPage },
  { module: TAB_MODULES['quadro-aulas'], match: exact('/gestao-turmas/quadro-aulas'), Component: QuadroAulasPage },
  {
    module: TAB_MODULES['quadro-aulas'],
    match: exact('/gestao-turmas/quadro-aulas/cadastro'),
    Component: QuadroAulaCadastroPage,
  },

  // Gestão Acadêmica
  {
    module: TAB_MODULES['estrutura-academica'],
    match: exact('/gestao-academica/estrutura-academica'),
    Component: EstruturaAcademicaPage,
  },
  { module: TAB_MODULES.metodos, match: exact('/gestao-academica/metodos'), Component: MetodosPage },
  { module: TAB_MODULES.matriculas, match: exact('/gestao-academica/matriculas'), Component: MatriculasPage },
  {
    module: TAB_MODULES.matriculas,
    match: exact('/gestao-academica/matriculas/cadastro'),
    Component: MatriculaCadastroWrapper,
  },

  // Gestão Pedagógica
  { module: TAB_MODULES.indicadores, match: exact('/gestao-pedagogica/indicadores'), Component: IndicadoresPage },
  { module: TAB_MODULES.disciplinas, match: exact('/gestao-pedagogica/disciplinas'), Component: DisciplinasPage },
  { module: TAB_MODULES['diario-classe'], match: exact('/gestao-pedagogica/diario-classe'), Component: DiarioClassePage },
  {
    module: TAB_MODULES['diario-classe'],
    match: (p) => {
      const m = p.match(/^\/gestao-pedagogica\/diario-classe\/([^/]+)\/fechamento$/)
      return m ? { turmaId: m[1] } : undefined
    },
    Component: FechamentoPage,
  },
  {
    module: TAB_MODULES['diario-classe'],
    match: (p) => {
      const m = p.match(/^\/gestao-pedagogica\/diario-classe\/([^/]+)$/)
      return m ? { turmaId: m[1] } : undefined
    },
    Component: TurmaDiarioPage,
  },
  { module: TAB_MODULES['plano-ensino'], match: exact('/gestao-pedagogica/plano-ensino'), Component: PlanoEnsinoPage },
  { module: TAB_MODULES['plano-ensino'], match: exact('/gestao-pedagogica/plano-ensino/criar'), Component: CriarPlanoEnsinoPage },
  {
    module: TAB_MODULES['plano-ensino'],
    match: (p) => {
      const m = p.match(/^\/gestao-pedagogica\/plano-ensino\/([^/]+)$/)
      return m ? { id: m[1] } : undefined
    },
    Component: PlanoEnsinoDetalhePage,
  },
  {
    module: TAB_MODULES['conselho-classe'],
    match: exact('/gestao-pedagogica/conselho-classe'),
    Component: ConselhoClassePage,
  },

  // BNCC
  { module: TAB_MODULES['bncc-consulta'], match: exact('/bncc/consulta'), Component: BnccConsultaPage },
  {
    module: TAB_MODULES['bncc-direitos'],
    match: exact('/bncc/direitos-aprendizagem'),
    Component: BnccDireitosPage,
  },
  { module: TAB_MODULES['bncc-campos'], match: exact('/bncc/campos-experiencia'), Component: BnccCamposPage },
  { module: TAB_MODULES['bncc-objetivos'], match: exact('/bncc/objetivos'), Component: BnccObjetivosPage },
  { module: TAB_MODULES['bncc-habilidades'], match: exact('/bncc/habilidades'), Component: BnccHabilidadesPage },
  {
    module: TAB_MODULES['bncc-objetos'],
    match: exact('/bncc/objetos-conhecimento'),
    Component: BnccObjetosPage,
  },
  { module: TAB_MODULES['bncc-unidades'], match: exact('/bncc/unidades-tematicas'), Component: BnccUnidadesPage },
  { module: TAB_MODULES['bncc-areas'], match: exact('/bncc/areas-conhecimento'), Component: BnccAreasPage },
  {
    module: TAB_MODULES['bncc-competencias'],
    match: exact('/bncc/competencias-habilidades'),
    Component: BnccCompetenciasPage,
  },

  // Censo & Docentes
  { module: TAB_MODULES['censo-escolar'], match: exact('/censo-escolar'), Component: CensoEscolarPage },
  { module: TAB_MODULES.docentes, match: exact('/docentes'), Component: DocentesPage },

  // Auditoria (exclusiva Superadmin)
  { module: TAB_MODULES.auditoria, match: exact('/auditoria'), Component: AuditoriaPage },
]

export function resolveTabRoute(pathname: string): ResolvedTabRoute | null {
  for (const route of ROUTES) {
    const params = route.match(pathname)
    if (params !== undefined) {
      return { module: route.module, params, Component: route.Component }
    }
  }
  return null
}