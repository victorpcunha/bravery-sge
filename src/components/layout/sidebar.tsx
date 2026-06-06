'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import {
  School,
  Users,
  GraduationCap,
  DoorOpen,
  UserCheck,
  Building2,
  BookOpen,
  LogOut,
  Menu,
  LayoutDashboard,
  Calendar,
  Settings,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Table2,
  UserCircle,
} from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useState } from 'react'

const modules = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Escola',
    href: '/escolas',
    icon: School,
  },
  {
    title: 'Docentes',
    href: '/docentes',
    icon: Users,
  },
  {
    title: 'Gestão de Usuários',
    icon: Users,
    submenu: [
      {
        title: 'Usuários',
        href: '/gestao-usuarios/usuarios',
        icon: UserCheck,
      },
      {
        title: 'Funções',
        href: '/gestao-usuarios/funcoes',
        icon: Building2,
      },
      {
        title: 'Perfis e Permissões',
        href: '/gestao-usuarios/perfis',
        icon: Settings,
      },
      {
        title: 'Painel do Aluno',
        href: '/gestao-usuarios/painel-aluno',
        icon: UserCircle,
      },
    ],
  },
  {
    title: 'Gestão de Turmas',
    icon: GraduationCap,
    submenu: [
      {
        title: 'Turmas',
        href: '/gestao-turmas/turmas',
        icon: GraduationCap,
      },
      {
        title: 'Quadro de Aulas',
        href: '/gestao-turmas/quadro-aulas',
        icon: Table2,
      },
    ],
  },
  {
    title: 'Matrículas',
    href: '/matriculas',
    icon: DoorOpen,
  },
{
        title: 'Gestão Acadêmica',
        icon: Calendar,
        submenu: [
          {
            title: 'Estrutura Acadêmica',
            href: '/gestao-academica/estrutura-academica',
            icon: GraduationCap,
          },
          {
            title: 'Métodos de Avaliação',
            href: '/gestao-academica/metodos',
            icon: ClipboardList,
          },
          {
            title: 'Alunos Matriculados',
            href: '/gestao-academica/matriculas',
            icon: DoorOpen,
          },
        ],
      },
      {
        title: 'Gestão Pedagógica',
        icon: BookOpen,
        submenu: [
          {
            title: 'Disciplinas',
            href: '/gestao-pedagogica/disciplinas',
            icon: BookOpen,
          },
          {
            title: 'Indicadores de Avaliação',
            href: '/gestao-pedagogica/indicadores',
            icon: ClipboardList,
          },
          {
            title: 'Diário de Classe',
            href: '/gestao-pedagogica/diario-classe',
            icon: ClipboardList,
          },
          {
            title: 'Plano de Ensino',
            href: '/gestao-pedagogica/plano-ensino',
            icon: BookOpen,
          },
          {
            title: 'Conselho de Classe',
            href: '/gestao-pedagogica/conselho-classe',
            icon: ClipboardList,
          },
        ],
      },
  {
    title: 'BNCC',
    icon: BookOpen,
    submenu: [
      {
        title: 'Consulta da BNCC',
        href: '/bncc/consulta',
        icon: BookOpen,
      },
      {
        title: 'Campos de Experiência',
        href: '/bncc/campos-experiencia',
        icon: BookOpen,
      },
      {
        title: 'Objetivos de Aprendizagem',
        href: '/bncc/objetivos',
        icon: BookOpen,
      },
      {
        title: 'Habilidades',
        href: '/bncc/habilidades',
        icon: BookOpen,
      },
      {
        title: 'Objetos de Conhecimento',
        href: '/bncc/objetos-conhecimento',
        icon: BookOpen,
      },
      {
        title: 'Unidades Temáticas',
        href: '/bncc/unidades-tematicas',
        icon: BookOpen,
      },
      {
        title: 'Áreas do Conhecimento',
        href: '/bncc/areas-conhecimento',
        icon: BookOpen,
      },
      {
        title: 'Competências e Habilidades',
        href: '/bncc/competencias-habilidades',
        icon: BookOpen,
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const toggleSubmenu = (moduleTitle: string) => {
    setOpenSubmenus(prev =>
      prev.includes(moduleTitle)
        ? prev.filter(title => title !== moduleTitle)
        : [...prev, moduleTitle]
    )
  }

  const isSubmenuOpen = (moduleTitle: string) => openSubmenus.includes(moduleTitle)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-md border border-border shadow-sm hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5 text-foreground" />
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full bg-sidebar">
          {/* Logo */}
          <div className="p-5 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
                <School className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg text-sidebar-foreground tracking-tight">Bravery</span>
                <p className="text-xs text-sidebar-foreground/40 font-medium">Gestão Escolar</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
            <div className="text-xs font-semibold text-sidebar-foreground/30 uppercase tracking-wider px-3 py-2">
              Menu
            </div>
            {modules.map((module, index) => {
              const isActive = module.href ? (pathname === module.href ||
                (module.href !== '/' && pathname.startsWith(module.href))) : false

              const hasSubmenu = module.submenu && module.submenu.length > 0
              const submenuOpen = isSubmenuOpen(module.title)

              const isSubmenuActive = hasSubmenu && module.submenu.some(sub =>
                pathname === sub.href || (sub.href !== '/' && pathname.startsWith(sub.href))
              )

              const effectiveActive = isActive || isSubmenuActive

              return (
                <div key={module.title} style={{ animationDelay: `${index * 40}ms` }}>
                  {hasSubmenu ? (
                    <div
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                        effectiveActive
                          ? "bg-sidebar-accent/15 text-sidebar-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                      )}
                      onClick={() => toggleSubmenu(module.title)}
                    >
                      {effectiveActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                      )}
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        effectiveActive
                          ? "bg-sidebar-accent"
                          : "bg-sidebar-accent/10 group-hover:bg-sidebar-accent/15"
                      )}>
                        <module.icon className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          effectiveActive ? "text-sidebar-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                        )} />
                      </div>
                      <span className="flex-1">{module.title}</span>
                      <div className="transition-transform duration-200">
                        {submenuOpen ? (
                          <ChevronDown className="h-4 w-4 text-sidebar-foreground/50" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-sidebar-foreground/50" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={module.href || '#'}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                        effectiveActive
                          ? "bg-sidebar-accent/15 text-sidebar-foreground"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                      )}
                    >
                      {effectiveActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
                      )}
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        effectiveActive
                          ? "bg-sidebar-accent"
                          : "bg-sidebar-accent/10 group-hover:bg-sidebar-accent/15"
                      )}>
                        <module.icon className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          effectiveActive ? "text-sidebar-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                        )} />
                      </div>
                      <span className="flex-1">{module.title}</span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubmenu && submenuOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5">
                      {module.submenu.map((submenuItem, subIndex) => {
                        const isSubActive = pathname === submenuItem.href ||
                          (submenuItem.href !== '/' && pathname.startsWith(submenuItem.href))

                        return (
                          <Link
                            key={submenuItem.href}
                            href={submenuItem.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                              isSubActive
                                ? "text-sidebar-foreground"
                                : "text-sidebar-foreground/50 hover:bg-sidebar-accent/5 hover:text-sidebar-foreground/80"
                            )}
                            style={{ animationDelay: `${(index * 40) + (subIndex * 25)}ms` }}
                          >
                            {isSubActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sidebar-primary rounded-full" />
                            )}
                            <div className={cn(
                              "p-1.5 rounded-md transition-all duration-200",
                              isSubActive
                                ? "bg-sidebar-accent/80"
                                : "bg-sidebar-accent/5 group-hover:bg-sidebar-accent/10"
                            )}>
                              <submenuItem.icon className={cn(
                                "h-3 w-3 transition-transform duration-200",
                                isSubActive ? "text-sidebar-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                              )} />
                            </div>
                            <span>{submenuItem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-2 p-3 rounded-xl bg-sidebar-accent/10">
              <div className="w-9 h-9 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-full flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground shadow-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-sidebar-foreground/40 truncate">{user?.email}</p>
              </div>
            </div>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 transition-all duration-200"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}