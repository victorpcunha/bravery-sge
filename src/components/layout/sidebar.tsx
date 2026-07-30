'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { usePermissoes } from '@/hooks/use-permissoes'
import { useEffect, useState } from 'react'
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  Calendar,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelRight,
  FileText,
} from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'

const modules = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Escolas',
    icon: School,
    recurso: null,
    submenu: [
      { title: 'Unidade Escolar', href: '/escolas', recurso: null },
    ],
  },
  {
    title: 'Gestão de Usuários',
    icon: Users,
    recurso: null,
    submenu: [
      { title: 'Usuários', href: '/gestao-usuarios/usuarios', recurso: 'gestao-usuarios.usuarios' },
      { title: 'Funções', href: '/gestao-usuarios/funcoes', recurso: 'gestao-usuarios.funcoes' },
      { title: 'Perfis e Permissões', href: '/gestao-usuarios/perfis', recurso: 'gestao-usuarios.perfis' },
      { title: 'Painel do Aluno', href: '/gestao-usuarios/painel-aluno', recurso: 'gestao-usuarios.painel-aluno' },
    ],
  },
  {
    title: 'Gestão de Turmas',
    icon: GraduationCap,
    recurso: null,
    submenu: [
      { title: 'Turmas', href: '/gestao-turmas/turmas', recurso: 'gestao-turmas.turmas' },
      { title: 'Quadro de Aulas', href: '/gestao-turmas/quadro-aulas', recurso: 'gestao-turmas.quadro-aulas' },
    ],
  },
  {
    title: 'Gestão Acadêmica',
    icon: Calendar,
    recurso: null,
    submenu: [
      { title: 'Estrutura Acadêmica', href: '/gestao-academica/estrutura-academica', recurso: 'gestao-academica.estrutura-academica' },
      { title: 'Métodos de Avaliação', href: '/gestao-academica/metodos', recurso: 'gestao-academica.metodos' },
      { title: 'Alunos Matriculados', href: '/gestao-academica/matriculas', recurso: 'gestao-academica.matriculas' },
    ],
  },
  {
    title: 'Gestão Pedagógica',
    icon: BookOpen,
    recurso: null,
    submenu: [
      { title: 'Indicadores de Avaliação', href: '/gestao-pedagogica/indicadores', recurso: 'gestao-pedagogica.indicadores' },
      { title: 'Disciplinas', href: '/gestao-pedagogica/disciplinas', recurso: 'gestao-pedagogica.disciplinas' },
      { title: 'Diário de Classe', href: '/gestao-pedagogica/diario-classe', recurso: 'gestao-pedagogica.diario-classe' },
      { title: 'Plano de Ensino', href: '/gestao-pedagogica/plano-ensino', recurso: 'gestao-pedagogica.plano-ensino' },
      { title: 'Conselho de Classe', href: '/gestao-pedagogica/conselho-classe', recurso: 'gestao-pedagogica.conselho-classe' },
    ],
  },
  {
    title: 'BNCC',
    icon: BookOpen,
    recurso: null,
    submenu: [
      { title: 'Direitos de Aprendizagem', href: '/bncc/direitos-aprendizagem', recurso: 'bncc.direitos-aprendizagem' },
      { title: 'Consulta da BNCC', href: '/bncc/consulta', recurso: 'bncc.consulta' },
      { title: 'Campos de Experiência', href: '/bncc/campos-experiencia', recurso: 'bncc.campos-experiencia' },
      { title: 'Objetivos de Aprendizagem', href: '/bncc/objetivos', recurso: 'bncc.objetivos' },
      { title: 'Habilidades', href: '/bncc/habilidades', recurso: 'bncc.habilidades' },
      { title: 'Objetos de Conhecimento', href: '/bncc/objetos-conhecimento', recurso: 'bncc.objetos-conhecimento' },
      { title: 'Unidades Temáticas', href: '/bncc/unidades-tematicas', recurso: 'bncc.unidades-tematicas' },
      { title: 'Áreas do Conhecimento', href: '/bncc/areas-conhecimento', recurso: 'bncc.areas-conhecimento' },
      { title: 'Competências e Habilidades', href: '/bncc/competencias-habilidades', recurso: 'bncc.competencias-habilidades' },
    ],
  },
  {
    title: 'Censo Escolar',
    href: '/censo-escolar',
    icon: FileText,
    recurso: 'censo-escolar',
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { schoolId, isSuperAdmin } = useAuth()
  const { state, toggleSidebar } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const { loaded: permLoaded, pode, isSetup } = usePermissoes(schoolId)

  const effectivelyCollapsed = state === 'collapsed' && !isHovering

  const showAll = !permLoaded || isSuperAdmin || isSetup

  const isVisible = (recurso: string | null | undefined): boolean => {
    if (showAll) return true
    if (!recurso) return true
    return pode.visualizar(recurso)
  }

  useEffect(() => {
    const activeModule = modules.find(
      m => m.submenu?.some(s => pathname === s.href || (s.href !== '/' && pathname.startsWith(s.href)))
    )
    if (activeModule) {
      setOpenSubmenu(activeModule.title)
    }
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(prev => prev === title ? null : title)
  }

  const visibleModules = modules.filter(module => {
    if (!module.submenu) {
      return isVisible(module.recurso)
    }
    const visibleChildren = module.submenu.filter(s => isVisible(s.recurso))
    if (visibleChildren.length === 0) return false
    return true
  }).map(module => {
    if (!module.submenu) return module
    return {
      ...module,
      submenu: module.submenu.filter(s => isVisible(s.recurso)),
    }
  })

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex flex-col h-full"
      >
        {/* Logo */}
        <SidebarHeader className={cn(
          'border-b border-sidebar-border transition-all duration-200',
          effectivelyCollapsed ? 'p-2' : 'px-3 py-[7px]'
        )}>
          <div className={cn(
            'flex items-center transition-all duration-200',
            effectivelyCollapsed ? 'gap-0 justify-center' : 'gap-3'
          )}>
            <div className={cn(
              'bg-sidebar-primary rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
              effectivelyCollapsed ? 'w-8 h-8' : 'w-9 h-9'
            )}>
              <School className={cn(
                'text-sidebar-primary-foreground transition-all duration-200',
                effectivelyCollapsed ? 'w-4 h-4' : 'w-[18px] h-[18px]'
              )} />
            </div>
            <div className={cn(
              'transition-all duration-200',
              effectivelyCollapsed ? 'opacity-0 invisible w-0 overflow-hidden' : 'opacity-100 visible'
            )}>
              <span className="font-heading font-bold text-[15px] text-sidebar-foreground tracking-tight whitespace-nowrap">Bravery</span>
              <p className="text-[11px] text-sidebar-foreground/70 font-medium whitespace-nowrap">Gestão Escolar</p>
            </div>
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className={cn(
              'transition-opacity duration-200',
              effectivelyCollapsed ? '' : '!opacity-100 !mt-0'
            )}>
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleModules.map((module) => {
                  const isActive = module.title === 'Escolas'
                    ? pathname.startsWith('/escolas')
                    : module.href
                      ? (pathname === module.href || (module.href !== '/' && pathname.startsWith(module.href)))
                      : false

                  const hasSubmenu = module.submenu && module.submenu.length > 0
                  const submenuOpen = hasSubmenu && openSubmenu === module.title

                  const isSubmenuActive = hasSubmenu && module.submenu!.some(sub =>
                    pathname === sub.href || (sub.href !== '/' && pathname.startsWith(sub.href))
                  )

                  const effectiveActive = isActive || isSubmenuActive

                  return (
                    <SidebarMenuItem key={module.title}>
                      {/* Escolas: link direto para gestor de uma escola; submenu para Super Admin */}
                      {module.title === 'Escolas' && !isSuperAdmin && schoolId ? (
                        <Link
                          href={`/escolas/${schoolId}`}
                          className={cn(
                            'relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full',
                            effectivelyCollapsed && 'justify-center px-2 gap-0',
                            effectiveActive
                              ? 'bg-sidebar-accent text-accent-foreground dark:text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground'
                          )}
                        >
                          {!effectivelyCollapsed && effectiveActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                          )}
                          <module.icon className={cn(
                            'h-4 w-4 shrink-0',
                            effectiveActive ? 'text-accent-foreground dark:text-sidebar-accent-foreground' : ''
                          )} />
                          <span className={cn(
                            'truncate transition-opacity duration-200',
                            effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
                          )}>
                            Escola
                          </span>
                        </Link>
                      ) : module.href ? (
                        <Link
                          href={module.href}
                          className={cn(
                            'relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full',
                            effectivelyCollapsed && 'justify-center px-2 gap-0',
                            effectiveActive
                              ? 'bg-sidebar-accent text-accent-foreground dark:text-sidebar-accent-foreground'
                              : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground'
                          )}
                        >
                          {!effectivelyCollapsed && effectiveActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                          )}
                          <module.icon className={cn(
                            'h-4 w-4 shrink-0',
                            effectiveActive ? 'text-accent-foreground dark:text-sidebar-accent-foreground' : ''
                          )} />
                          <span className={cn(
                            'truncate transition-opacity duration-200',
                            effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
                          )}>
                            {module.title}
                          </span>
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleSubmenu(module.title)}
                            className={cn(
                              'relative flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                              effectivelyCollapsed && 'justify-center px-2 gap-0',
                              effectiveActive
                                ? 'bg-sidebar-accent text-accent-foreground dark:text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground'
                            )}
                          >
                            {!effectivelyCollapsed && effectiveActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                            )}
                            <module.icon className={cn(
                              'h-4 w-4 shrink-0',
                              effectiveActive ? 'text-accent-foreground dark:text-sidebar-accent-foreground' : ''
                            )} />
                            <span className={cn(
                              'flex-1 text-left truncate transition-opacity duration-200',
                              effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
                            )}>
                              {module.title}
                            </span>
                            {submenuOpen ? (
                              <ChevronDown className={cn(
                                'h-3.5 shrink-0 text-sidebar-foreground transition-all duration-200',
                                effectivelyCollapsed ? 'w-0 opacity-0 invisible' : 'w-3.5 opacity-100 visible'
                              )} />
                            ) : (
                              <ChevronRight className={cn(
                                'h-3.5 shrink-0 text-sidebar-foreground transition-all duration-200',
                                effectivelyCollapsed ? 'w-0 opacity-0 invisible' : 'w-3.5 opacity-100 visible'
                              )} />
                            )}
                          </button>

                          {submenuOpen && (
                            <SidebarMenuSub className={effectivelyCollapsed ? 'hidden' : '!flex'}>
                              {module.submenu!.map((subitem) => {
                                const isSubActive = pathname === subitem.href ||
                                  (subitem.href !== '/' && pathname.startsWith(subitem.href))

                                return (
                                  <SidebarMenuSubItem key={subitem.href}>
                                    <Link
                                      href={subitem.href}
                                      className={cn(
                                        'flex items-center px-3 py-1.5 rounded-sm text-sm transition-colors',
                                        isSubActive
                                          ? 'bg-sidebar-accent text-accent-foreground dark:text-sidebar-accent-foreground font-medium'
                                          : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground'
                                      )}
                                    >
                                      {isSubActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sidebar-primary rounded-full" />
                                      )}
                                      {subitem.title}
                                    </Link>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          )}
                        </>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className={cn(
          'border-t border-sidebar-border transition-all duration-200',
          effectivelyCollapsed ? 'p-2' : 'p-3'
        )}>
          {/* Collapse / Expand toggle */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors',
              'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground',
              effectivelyCollapsed && 'justify-center px-0 gap-0'
            )}
          >
            {state === 'expanded' ? (
              <PanelLeft className="h-4 w-4 shrink-0" />
            ) : (
              <PanelRight className="h-4 w-4 shrink-0" />
            )}
            <span className={cn(
              'truncate transition-opacity duration-200',
              effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            )}>
              {state === 'expanded' ? 'Recolher menu' : 'Fixar menu'}
            </span>
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
