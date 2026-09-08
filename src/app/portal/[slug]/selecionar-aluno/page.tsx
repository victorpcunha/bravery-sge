'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2, School } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { usePortal } from '@/components/portal/portal-provider'

export default function SelecionarAlunoPage() {
  const router = useRouter()
  const { alunos, aluno, selecionarAluno, loading, escola } = usePortal()
  const base = escola ? `/portal/${escola.slug}` : '/portal'

  // 1 vínculo entra direto (FR-008); contexto já auto-seleciona no provider
  useEffect(() => {
    if (!loading && alunos.length === 1) {
      router.replace(`${base}/aluno`)
    }
  }, [loading, alunos, router, base])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    )
  }

  if (alunos.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <Card>
          <EmptyState
            icon={School}
            title="Nenhum aluno vinculado"
            description="Não encontramos alunos vinculados ao seu cadastro nesta escola. Procure a secretaria da escola."
          />
        </Card>
      </div>
    )
  }

  function escolher(alunoId: string) {
    selecionarAluno(alunoId)
    router.push(`${base}/aluno`)
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="text-center mb-6">
        <h1 className="text-[28px] font-bold leading-tight text-foreground">Quem você deseja visualizar?</h1>
        <p className="text-[15px] text-muted-foreground mt-1.5">
          Selecione um aluno para ver as informações escolares
        </p>
      </div>
      <ul className="space-y-3">
        {alunos.map(a => (
          <li key={a.alunoId}>
            <Card
              className={`cursor-pointer border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                aluno?.alunoId === a.alunoId ? 'border-primary ring-1 ring-primary' : 'border-border ring-0'
              }`}
              onClick={() => escolher(a.alunoId)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-foreground truncate">{a.nome}</p>
                  <p className="text-[14px] text-muted-foreground">
                    {a.turmaNome}
                    {a.principal ? ' · Principal' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
