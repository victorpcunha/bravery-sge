'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowLeftRight,
  Bell,
  CalendarDays,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Megaphone,
  Menu,
  Star,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { usePortal } from '@/components/portal/portal-provider'
import { TrocarAlunoModal } from '@/components/portal/trocar-aluno-modal'
import { TermosModal } from '@/components/portal/termos-modal'

const ITENS = [
  { href: '/aluno', label: 'Início', icon: Home },
  { href: '/aluno/boletim', label: 'Boletim', icon: Star },
  { href: '/aluno/frequencia', label: 'Frequência', icon: CalendarDays },
  { href: '/aluno/horarios', label: 'Horários', icon: GraduationCap },
  { href: '/aluno/ocorrencias', label: 'Ocorrências', icon: Bell },
  { href: '/aluno/comunicados', label: 'Comunicados', icon: Megaphone },
  { href: '/aluno/documentos', label: 'Documentos', icon: FolderOpen },
]

function ConteudoSidebar({ aoNavegar }: { aoNavegar?: () => void }) {
  const pathname = usePathname()
  const { sessao, alunos, aluno, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'
  const [trocarOpen, setTrocarOpen] = useState(false)
  const [termosOpen, setTermosOpen] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[14px] font-bold text-sidebar-foreground leading-tight truncate">Portal do Responsável</p>
            <p className="text-[13px] text-sidebar-foreground/70 truncate">{escola?.nome || sessao?.responsavel.nome}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-sidebar-border">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-sidebar-foreground/70 mb-2 text-left">
          Aluno visualizado
        </p>
        {aluno ? (
          <div className="flex items-center gap-3 text-left">
            <User className="h-5 w-5 shrink-0 text-sidebar-foreground/70" aria-hidden="true" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[14px] font-semibold text-sidebar-foreground truncate text-left">{aluno.nome}</p>
              <p className="text-[13px] text-sidebar-foreground/70 truncate text-left">{aluno.turmaNome}</p>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-sidebar-foreground/70 text-left">Nenhum aluno selecionado</p>
        )}
        {alunos.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground"
            onClick={() => {
              aoNavegar?.()
              setTrocarOpen(true)
            }}
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Trocar de aluno
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Navegação do portal">
        {ITENS.map(item => {
          const href = `${base}${item.href}`
          const ativo = pathname === href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={href}
              onClick={aoNavegar}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full mb-0.5',
                ativo
                  ? 'bg-sidebar-accent text-accent-foreground dark:text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:text-accent-foreground hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground'
              )}
              aria-current={ativo ? 'page' : undefined}
            >
              {ativo && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-primary rounded-full" />
              )}
              <Icon className={cn(
                'h-4 w-4 shrink-0',
                ativo ? 'text-accent-foreground dark:text-sidebar-accent-foreground' : ''
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setTermosOpen(true)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        >
          <FileText className="h-3.5 w-3.5" />
          Termos
          {sessao?.termoVersao ? ` · v${sessao.termoVersao}` : ''}
        </button>
      </div>

      <TrocarAlunoModal open={trocarOpen} onOpenChange={setTrocarOpen} />
      <TermosModal open={termosOpen} onOpenChange={setTermosOpen} />
    </div>
  )
}

export function PortalSidebar() {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      {/* Desktop fixa */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar border-r border-sidebar-border z-30">
        <ConteudoSidebar />
      </aside>
      {/* Mobile drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-sidebar/95 backdrop-blur border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 h-14">
          <Button variant="ghost" size="icon-sm" onClick={() => setAberto(true)} aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-[14px] font-bold text-sidebar-foreground">Portal do Responsável</span>
        </div>
      </div>
      <Sheet open={aberto} onOpenChange={setAberto}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <SheetTitle className="sr-only">Menu do portal</SheetTitle>
          <div className="flex justify-end p-2">
            <Button variant="ghost" size="icon-sm" onClick={() => setAberto(false)} aria-label="Fechar menu">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="h-[calc(100%-52px)]">
            <ConteudoSidebar aoNavegar={() => setAberto(false)} />
          </div>
        </SheetContent>
      </Sheet>
      {/* Espaço do header mobile */}
      <div className="lg:hidden h-14" />
    </>
  )
}
