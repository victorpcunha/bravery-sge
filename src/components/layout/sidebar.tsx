'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Calendar,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  PanelLeft,
  PanelRight,
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
    title: 'Gestão de Usuários',
    icon: Users,
    submenu: [
      { title: 'Usuários', href: '/gestao-usuarios/usuarios' },
      { title: 'Funções', href: '/gestao-usuarios/funcoes' },
      { title: 'Perfis e Permissões', href: '/gestao-usuarios/perfis' },
      { title: 'Painel do Aluno', href: '/gestao-usuarios/painel-aluno' },
    ],
  },
  {
    title: 'Gestão de Turmas',
    icon: GraduationCap,
    submenu: [
      { title: 'Turmas', href: '/gestao-turmas/turmas' },
      { title: 'Quadro de Aulas', href: '/gestao-turmas/quadro-aulas' },
    ],
  },
  {
    title: 'Gestão Acadêmica',
    icon: Calendar,
    submenu: [
      { title: 'Estrutura Acadêmica', href: '/gestao-academica/estrutura-academica' },
      { title: 'Métodos de Avaliação', href: '/gestao-academica/metodos' },
      { title: 'Alunos Matriculados', href: '/gestao-academica/matriculas' },
    ],
  },
  {
    title: 'Gestão Pedagógica',
    icon: BookOpen,
    submenu: [
      { title: 'Indicadores de Avaliação', href: '/gestao-pedagogica/indicadores' },
      { title: 'Diário de Classe', href: '/gestao-pedagogica/diario-classe' },
      { title: 'Plano de Ensino', href: '/gestao-pedagogica/plano-ensino' },
      { title: 'Conselho de Classe', href: '/gestao-pedagogica/conselho-classe' },
    ],
  },
  {
    title: 'BNCC',
    icon: BookOpen,
    submenu: [
      { title: 'Consulta da BNCC', href: '/bncc/consulta' },
      { title: 'Campos de Experiência', href: '/bncc/campos-experiencia' },
      { title: 'Objetivos de Aprendizagem', href: '/bncc/objetivos' },
      { title: 'Habilidades', href: '/bncc/habilidades' },
      { title: 'Objetos de Conhecimento', href: '/bncc/objetos-conhecimento' },
      { title: 'Unidades Temáticas', href: '/bncc/unidades-tematicas' },
      { title: 'Áreas do Conhecimento', href: '/bncc/areas-conhecimento' },
      { title: 'Competências e Habilidades', href: '/bncc/competencias-habilidades' },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const effectivelyCollapsed = state === 'collapsed' && !isHovering

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

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
          effectivelyCollapsed ? 'p-2' : 'p-4'
        )}>
          <div className={cn(
            'flex items-center transition-all duration-200',
            effectivelyCollapsed ? 'gap-0 justify-center' : 'gap-3'
          )}>
            <div className={cn(
              'bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
              effectivelyCollapsed ? 'w-8 h-8' : 'w-10 h-10'
            )}>
              <School className={cn(
                'text-sidebar-primary-foreground transition-all duration-200',
                effectivelyCollapsed ? 'w-4 h-4' : 'w-5 h-5'
              )} />
            </div>
            <div className={cn(
              'transition-all duration-200',
              effectivelyCollapsed ? 'opacity-0 invisible w-0 overflow-hidden' : 'opacity-100 visible'
            )}>
              <span className="font-heading font-bold text-lg text-sidebar-foreground tracking-tight whitespace-nowrap">Bravery</span>
              <p className="text-xs text-sidebar-foreground/40 font-medium whitespace-nowrap">Gestão Escolar</p>
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
                {modules.map((module) => {
                  const isActive = module.href
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
                      {module.href ? (
                        <Link
                          href={module.href}
                          className={cn(
                            'relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full',
                            effectivelyCollapsed && 'justify-center px-2 gap-0',
                            effectiveActive
                              ? 'bg-sidebar-accent/15 text-sidebar-foreground'
                              : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
                          )}
                        >
                          {!effectivelyCollapsed && effectiveActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                          )}
                          <module.icon className={cn(
                            'h-4 w-4 shrink-0',
                            effectiveActive ? 'text-sidebar-foreground' : ''
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
                                ? 'bg-sidebar-accent/15 text-sidebar-foreground'
                                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
                            )}
                          >
                            {!effectivelyCollapsed && effectiveActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                            )}
                            <module.icon className={cn(
                              'h-4 w-4 shrink-0',
                              effectiveActive ? 'text-sidebar-foreground' : ''
                            )} />
                            <span className={cn(
                              'flex-1 text-left truncate transition-opacity duration-200',
                              effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
                            )}>
                              {module.title}
                            </span>
                            {submenuOpen ? (
                              <ChevronDown className={cn(
                                'h-3.5 shrink-0 text-sidebar-foreground/40 transition-all duration-200',
                                effectivelyCollapsed ? 'w-0 opacity-0 invisible' : 'w-3.5 opacity-100 visible'
                              )} />
                            ) : (
                              <ChevronRight className={cn(
                                'h-3.5 shrink-0 text-sidebar-foreground/40 transition-all duration-200',
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
                                          ? 'bg-sidebar-accent/80 text-sidebar-foreground font-medium'
                                          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
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
              'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10',
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

          {/* User info — expanded only */}
          <div className={cn(
            'flex items-center gap-3 mt-1 transition-all duration-200',
            effectivelyCollapsed ? 'opacity-0 invisible h-0 overflow-hidden' : 'opacity-100 visible'
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-full flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground shrink-0">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-sidebar-foreground/40 truncate">{user?.email}</p>
            </div>
          </div>

          {/* User avatar — collapsed only */}
          <div className={cn(
            'flex justify-center transition-all duration-200',
            effectivelyCollapsed ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-full flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors',
                'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10',
                effectivelyCollapsed && 'justify-center px-0 gap-0'
              )}
            >
              {effectivelyCollapsed ? (
                theme === 'dark' ? (
                  <Sun className="h-4 w-4 shrink-0 text-sidebar-primary" />
                ) : (
                  <Moon className="h-4 w-4 shrink-0 text-sidebar-primary" />
                )
              ) : (
                <div className="p-1 rounded-md bg-sidebar-accent/10 shrink-0">
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-sidebar-primary" />
                  ) : (
                    <Moon className="h-4 w-4 text-sidebar-primary" />
                  )}
                </div>
              )}
              <span className={cn(
                'truncate transition-opacity duration-200',
                effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
              )}>
                {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              </span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors',
              'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10',
              effectivelyCollapsed && 'justify-center px-0 gap-0'
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={cn(
              'truncate transition-opacity duration-200',
              effectivelyCollapsed ? 'opacity-0 invisible w-0' : 'opacity-100 visible'
            )}>
              Sair da conta
            </span>
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
