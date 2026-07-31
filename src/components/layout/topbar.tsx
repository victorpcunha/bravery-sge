'use client'

import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { SessionTimer } from '@/components/layout/session-timer'
import { ChangePasswordDialog } from '@/components/layout/change-password-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import {
  Sun,
  Moon,
  LogOut,
  User,
  Lock,
  Calendar,
  UserCheck,
} from 'lucide-react'
import { AgendaDrawer } from '@/components/agenda/agenda-drawer'

export function Topbar() {
  const router = useRouter()
  const { user, signOut, nomeCompleto, iniciais } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [agendaOpen, setAgendaOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-sm">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9 shrink-0 md:hidden" />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Agenda */}
          <Button variant="ghost" size="icon" className="relative shrink-0" aria-label="Agenda do Profissional" onClick={() => setAgendaOpen(true)}>
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 shrink-0"
              aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}

          {/* User dropdown */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors',
                  'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20',
                  dropdownOpen && 'bg-muted'
                )}
                aria-label="Menu do usuário"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-[14px] font-medium text-foreground leading-tight truncate max-w-[160px]">
                    {nomeCompleto}
                  </p>
                  <SessionTimer />
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-72 animate-fade-in-down"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-foreground truncate">
                      {nomeCompleto}
                    </p>
                    <p className="text-[13px] text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setDropdownOpen(false)
                      sessionStorage.setItem('usuarios_search', nomeCompleto.split(' ')[0])
                      router.push('/gestao-usuarios/usuarios')
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Verificar Perfil
                  </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setDropdownOpen(false)
                    setPasswordOpen(true)
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Alterar Senha
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  handleSignOut()
                }}
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
      <AgendaDrawer open={agendaOpen} onOpenChange={setAgendaOpen} />
    </>
  )
}
