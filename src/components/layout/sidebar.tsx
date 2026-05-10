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
  BookOpen,
  LogOut,
  Menu,
  LayoutDashboard,
  Calendar,
  Settings
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
    title: 'Turmas',
    href: '/turmas',
    icon: GraduationCap,
  },
  {
    title: 'Pessoas',
    href: '/pessoas',
    icon: UserCheck,
  },
  {
    title: 'Matrículas',
    href: '/matriculas',
    icon: DoorOpen,
  },
  {
    title: 'Gestão Acadêmica',
    href: '/gestao-academica',
    icon: Calendar,
  },
  {
    title: 'Consulta BNCC',
    href: '/bncc',
    icon: BookOpen,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

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
              const isActive = pathname === module.href || 
                (module.href !== '/' && pathname.startsWith(module.href))
              
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-white/15 text-white shadow-lg shadow-black/10" 
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-[#457B9D]" 
                      : "bg-white/10 group-hover:bg-white/15"
                  )}>
                    <module.icon className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isActive ? "text-white" : "text-white/60 group-hover:text-white"
                    )} />
                  </div>
                  <span className="relative">
                    {module.title}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4FB3BF] rounded-full" />
                    )}
                  </span>
                </Link>
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