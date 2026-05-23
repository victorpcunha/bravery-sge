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
  ChevronRight
} from 'lucide-react'
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
        className="fixed top-4 left-4 z-50 md:hidden bg-white/80 backdrop-blur-md shadow-sm hover:bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </Button>

      {/* Overlay mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full bg-[#1D3557]">
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#1D3557] rounded-xl flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">Bravery</span>
                <p className="text-xs text-white/50">Gestão Escolar</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-3 mb-3">
              Menu Principal
            </div>
            {modules.map((module, index) => {
              const isActive = module.href ? (pathname === module.href ||
                (module.href !== '/' && pathname.startsWith(module.href))) : false

              const hasSubmenu = module.submenu && module.submenu.length > 0
              const submenuOpen = isSubmenuOpen(module.title)

              // Verificar se algum item do submenu está ativo
              const isSubmenuActive = hasSubmenu && module.submenu.some(sub =>
                pathname === sub.href || (sub.href !== '/' && pathname.startsWith(sub.href))
              )

              const effectiveActive = isActive || isSubmenuActive

              return (
                <div key={module.title} style={{ animationDelay: `${index * 50}ms` }}>
                  {hasSubmenu ? (
                    // Módulo com submenu - usa div com onClick
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
                        effectiveActive
                          ? "bg-white/15 text-white shadow-lg shadow-black/10"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => toggleSubmenu(module.title)}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        effectiveActive
                          ? "bg-[#457B9D]"
                          : "bg-white/10 group-hover:bg-white/15"
                      )}>
                        <module.icon className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          effectiveActive ? "text-white" : "text-white/60 group-hover:text-white"
                        )} />
                      </div>
                      <span className="relative flex-1">
                        {module.title}
                        {effectiveActive && (
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4FB3BF] rounded-full" />
                        )}
                      </span>
                      <div className="transition-transform duration-200">
                        {submenuOpen ? (
                          <ChevronDown className="h-4 w-4 text-white/60" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white/60" />
                        )}
                      </div>
                    </div>
                  ) : (
                    // Módulo normal - usa Link
                    <Link
                      href={module.href || '#'}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        effectiveActive
                          ? "bg-white/15 text-white shadow-lg shadow-black/10"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        effectiveActive
                          ? "bg-[#457B9D]"
                          : "bg-white/10 group-hover:bg-white/15"
                      )}>
                        <module.icon className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          effectiveActive ? "text-white" : "text-white/60 group-hover:text-white"
                        )} />
                      </div>
                      <span className="relative flex-1">
                        {module.title}
                        {effectiveActive && (
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4FB3BF] rounded-full" />
                        )}
                      </span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubmenu && submenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {module.submenu.map((submenuItem, subIndex) => {
                        const isSubActive = pathname === submenuItem.href ||
                          (submenuItem.href !== '/' && pathname.startsWith(submenuItem.href))

                        return (
                          <Link
                            key={submenuItem.href}
                            href={submenuItem.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                              isSubActive
                                ? "bg-white/10 text-white"
                                : "text-white/50 hover:bg-white/5 hover:text-white/80"
                            )}
                            style={{ animationDelay: `${(index * 50) + (subIndex * 25)}ms` }}
                          >
                            <div className={cn(
                              "p-1.5 rounded-lg transition-all duration-200",
                              isSubActive
                                ? "bg-[#457B9D]/80"
                                : "bg-white/5 group-hover:bg-white/10"
                            )}>
                              <submenuItem.icon className={cn(
                                "h-3 w-3 transition-transform duration-200",
                                isSubActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                              )} />
                            </div>
                            <span className="relative">
                              {submenuItem.title}
                              {isSubActive && (
                                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#4FB3BF] rounded-full" />
                              )}
                            </span>
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
          <div className="p-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 bg-[#4FB3BF] rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
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