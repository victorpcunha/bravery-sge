'use client'

import Link from 'next/link'
import { Calendar, UserPlus, BookOpen, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type QuickAction = {
  label: string
  href: string
  icon: LucideIcon
}

type DashboardHeroProps = {
  userName: string
  schoolName: string
  anoLetivoDescricao: string | null
  showSchoolSelect?: boolean
  selectedSchoolId?: string | null
  allSchools?: { id: string; nome_escola: string }[]
  onSelectSchool?: (v: string) => void
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Nova Matrícula', href: '/gestao-academica/matriculas/cadastro', icon: UserPlus },
  { label: 'Diário de Classe', href: '/gestao-pedagogica/diario-classe', icon: BookOpen },
  { label: 'Plano de Ensino', href: '/gestao-pedagogica/plano-ensino', icon: Calendar },
  { label: 'Painel do Aluno', href: '/gestao-usuarios/painel-aluno', icon: Users },
]

function formatDatePtBr(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

export function DashboardHero({
  userName,
  schoolName,
  anoLetivoDescricao,
  showSchoolSelect = false,
  selectedSchoolId = null,
  allSchools = [],
  onSelectSchool,
}: DashboardHeroProps) {
  const today = formatDatePtBr()
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <section
      aria-label="Boas-vindas"
      className="rounded-2xl border border-border bg-secondary shadow-sm mb-8"
    >
      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
              {capitalizedToday}
            </p>
            <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-[30px]">
              Olá, <span className="text-primary">{userName}</span>
            </h1>
            {schoolName ? (
              <p className="mt-1.5 text-[15px] leading-normal text-muted-foreground">
                {schoolName}
                {anoLetivoDescricao ? (
                  <>
                    <span className="mx-2 text-border">•</span>
                    <span>Ano letivo {anoLetivoDescricao}</span>
                  </>
                ) : (
                  <>
                    <span className="mx-2 text-border">•</span>
                    <span className="text-warning">Nenhum ano letivo ativo</span>
                  </>
                )}
              </p>
            ) : (
              <p className="mt-1.5 text-[15px] leading-normal text-muted-foreground">
                Selecione uma escola para visualizar os dados
              </p>
            )}
          </div>

          {showSchoolSelect && (
            <div className="w-full shrink-0 sm:w-64">
              <Select
                value={selectedSchoolId ?? undefined}
                onValueChange={onSelectSchool}
              >
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Selecione uma escola" />
                </SelectTrigger>
                <SelectContent>
                  {allSchools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome_escola}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div
          className="
            mt-6 grid grid-cols-2 gap-2
            sm:gap-3
            lg:grid-cols-4
          "
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="
                  group inline-flex items-center gap-2
                  rounded-lg border border-border bg-card
                  px-3 py-2.5 text-[13px] font-medium leading-tight text-foreground
                  sm:px-4 sm:py-3 sm:text-[14px]
                  shadow-xs transition-all duration-200
                  hover:border-primary/40 hover:bg-card hover:shadow-md hover:-translate-y-0.5
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  min-h-[44px] min-w-0
                "
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-8 sm:w-8">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 whitespace-normal break-words">
                  {action.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
