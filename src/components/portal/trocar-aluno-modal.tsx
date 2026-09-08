'use client'

import { GraduationCap } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { usePortal } from '@/components/portal/portal-provider'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Modal compartilhado (Topbar + Sidebar) para trocar o aluno visualizado.
export function TrocarAlunoModal({ open, onOpenChange }: Props) {
  const { alunos, aluno, selecionarAluno } = usePortal()

  function escolher(alunoId: string) {
    selecionarAluno(alunoId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[20px]">Trocar de aluno</DialogTitle>
          <DialogDescription>
            Selecione qual aluno você deseja visualizar
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
          {alunos.map(a => {
            const ativo = aluno?.alunoId === a.alunoId
            return (
              <li key={a.alunoId}>
                <Card
                  className={`cursor-pointer border transition-all hover:shadow-md ${ativo ? 'border-primary ring-1 ring-primary' : 'border-border ring-0'}`}
                  onClick={() => escolher(a.alunoId)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[16px] font-semibold text-foreground truncate">{a.nome}</p>
                      <p className="text-[14px] text-muted-foreground truncate">
                        {a.turmaNome}
                        {a.etapaNome ? ` · ${a.etapaNome}` : ''}
                      </p>
                      {a.turnos.length > 0 && (
                        <p className="text-[13px] text-muted-foreground truncate">
                          Turno: {a.turnos.join(', ')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
