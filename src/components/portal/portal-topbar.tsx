'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { LogOut, Lock, Repeat, UserCheck } from 'lucide-react'
import { usePortal } from '@/components/portal/portal-provider'
import { PortalChangePasswordDialog } from '@/components/portal/portal-change-password-dialog'
import { TrocarAlunoModal } from '@/components/portal/trocar-aluno-modal'

function iniciais(nome: string) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('')
}

export function PortalTopbar() {
  const { user, sessao, aluno, alunos, sair } = usePortal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [trocarOpen, setTrocarOpen] = useState(false)

  const nome = sessao?.responsavel.nome || ''

  return (
    <>
      <header className="sticky top-14 lg:top-0 z-20 flex h-12 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-sm">
        {/* Left side — aluno visualizado */}
        <div className="min-w-0">
          {aluno ? (
            <p className="text-[14px] text-muted-foreground truncate">
              Visualizando: <span className="font-semibold text-foreground">{aluno.nome}</span>
              <span className="text-muted-foreground"> · {aluno.turmaNome}</span>
            </p>
          ) : (
            <p className="text-[14px] text-muted-foreground">Portal do Responsável</p>
          )}
        </div>

        {/* Right side — usuário */}
        <div className="flex items-center gap-1 sm:gap-2">
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
                  {nome ? (
                    <span className="text-[13px] font-bold text-primary-foreground">{iniciais(nome)}</span>
                  ) : (
                    <UserCheck className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-[14px] font-medium text-foreground leading-tight truncate max-w-[160px]">
                    {nome}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-72">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    {nome ? (
                      <span className="text-[14px] font-bold text-primary-foreground">{iniciais(nome)}</span>
                    ) : (
                      <UserCheck className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-foreground truncate">{nome}</p>
                    <p className="text-[13px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {alunos.length > 1 && (
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      setDropdownOpen(false)
                      setTrocarOpen(true)
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Repeat className="w-4 h-4" />
                    Trocar de aluno
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    setDropdownOpen(false)
                    setPasswordOpen(true)
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Alterar senha
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  sair()
                }}
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <PortalChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
      <TrocarAlunoModal open={trocarOpen} onOpenChange={setTrocarOpen} />
    </>
  )
}
